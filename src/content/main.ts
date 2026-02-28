import { createCourseCatalog } from './courses';
import { createTimetableUI, type TimetableUIState } from './ui';
import {
  createEmptyTimetable,
  loadTimetable,
  saveTimetable,
  type DayKey,
  type Lesson,
  type PeriodKey,
  type TimetableData
} from './storage';

type CellKey = { day: DayKey; period: PeriodKey };

let timetable: TimetableData = createEmptyTimetable();
let editMode = false;
let selectedCell: CellKey | null = null;
let infoMessage = '';
let uiMounted = false;
let captureEnabled = false;

const ui = createTimetableUI({
  onToggleEdit: () => {
    editMode = !editMode;
    if (!editMode) {
      selectedCell = null;
      infoMessage = '';
      disableCourseCapture();
    } else {
      infoMessage = '枠を選んでください';
      enableCourseCapture();
    }
    render();
  },
  onSelectCell: (cell) => {
    if (!editMode) return;
    selectedCell = cell;
    infoMessage = 'ダッシュボードから授業を入力してください';
    render();
  },
  onRemoveCell: async ({ day, period }) => {
    timetable[day][period] = null;
    await saveTimetable(timetable);
    render();
  },
  onOpenLesson: (lesson) => {
    window.location.href = lesson.url;
  }
});

const catalog = createCourseCatalog();

function render(): void {
  ui.render(timetable, {
    editMode,
    selectedCell,
    message: infoMessage
  } satisfies TimetableUIState);
}

function upsertSelectedCell(lesson: Lesson): void {
  if (!selectedCell) {
    infoMessage = '枠を選んでください';
    render();
    return;
  }

  timetable[selectedCell.day][selectedCell.period] = lesson;
  saveTimetable(timetable).catch((error) => {
    console.error('[mpt] failed to save timetable', error);
  });
  infoMessage = `設定: ${lesson.title}`;
  render();
}

function onDocumentClickCapture(event: MouseEvent): void {
  if (!editMode) return;

  const target = event.target;
  if (!(target instanceof Element)) return;

  const anchor = target.closest('a[href]');
  if (!(anchor instanceof HTMLAnchorElement)) return;

  const lesson = catalog.findByAnchor(anchor);
  if (!lesson) return;

  // In edit mode, intercept matching course links on capture phase so Moodle handlers cannot navigate.
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  upsertSelectedCell(lesson);
}

function enableCourseCapture(): void {
  if (captureEnabled) return;
  document.addEventListener('click', onDocumentClickCapture, true);
  captureEnabled = true;
}

function disableCourseCapture(): void {
  if (!captureEnabled) return;
  document.removeEventListener('click', onDocumentClickCapture, true);
  captureEnabled = false;
}

function findCourseOverviewTarget(): Element | null {
  const headingCandidates = Array.from(document.querySelectorAll('h1, h2, h3, h4, [role="heading"], .card-title, .header'));

  // Selector strategy for "コース概要" block:
  // 1) First, locate an explicit heading node that includes "コース概要", then insert before that section.
  // 2) If not found, locate a container whose aria-label/text includes "コース概要" and insert before that block.
  // 3) Finally, fallback to main content start to avoid failing on delayed/variant Moodle DOM.
  for (const heading of headingCandidates) {
    const text = (heading.textContent ?? '').trim();
    if (!text.includes('コース概要')) continue;
    const section = heading.closest('section, .block, .card, .container-fluid, [role="region"]');
    return section ?? heading;
  }

  const labeled = Array.from(
    document.querySelectorAll<HTMLElement>('[aria-label*="コース概要"], section, .block, .card, [role="region"]')
  );
  for (const element of labeled) {
    const aria = (element.getAttribute('aria-label') ?? '').trim();
    const text = (element.textContent ?? '').trim();
    if (aria.includes('コース概要') || text.includes('コース概要')) {
      return element;
    }
  }

  return null;
}

function findFallbackMountPoint(): Element | null {
  return (
    document.querySelector('[role="main"] .container-fluid') ||
    document.querySelector('[role="main"]') ||
    document.querySelector('main .container-fluid') ||
    document.querySelector('main') ||
    document.querySelector('#page-content') ||
    document.body.firstElementChild
  );
}

function tryMountUI(): boolean {
  if (uiMounted) return true;
  if (document.querySelector('.mpt-host')) {
    uiMounted = true;
    return true;
  }

  const courseOverview = findCourseOverviewTarget();
  if (courseOverview && courseOverview.parentElement) {
    ui.mount(courseOverview);
    uiMounted = true;
    return true;
  }

  const fallback = findFallbackMountPoint();
  if (fallback) {
    const marker = document.createElement('div');
    fallback.insertAdjacentElement('afterbegin', marker);
    ui.mount(marker);
    marker.remove();
    uiMounted = true;
    return true;
  }

  return false;
}

function startMountObserver(): void {
  if (tryMountUI()) {
    render();
    return;
  }

  const observer = new MutationObserver(() => {
    if (tryMountUI()) {
      render();
      observer.disconnect();
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

async function init(): Promise<void> {
  if (location.pathname !== '/my/courses.php') {
    return;
  }

  timetable = await loadTimetable();
  startMountObserver();

  window.addEventListener('beforeunload', () => {
    disableCourseCapture();
    catalog.disconnect();
  });
}

void init();
