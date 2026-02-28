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

function findDashboardHeading(): Element | null {
  const candidates = Array.from(document.querySelectorAll('h1, h2, h3, .page-header-headings, .breadcrumb-nav'));
  for (const element of candidates) {
    const text = (element.textContent ?? '').trim();
    if (text === 'ダッシュボード') return element;
    if (text.includes('ダッシュボード')) return element;
  }
  return null;
}

function findFallbackMountPoint(): Element | null {
  return (
    document.querySelector('main .container-fluid') ||
    document.querySelector('main') ||
    document.querySelector('#page-content') ||
    document.body.firstElementChild
  );
}

function tryMountUI(): boolean {
  if (uiMounted) return true;

  const heading = findDashboardHeading();
  if (heading && heading.parentElement) {
    ui.mount(heading);
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
  if (document.title && !document.title.includes('ダッシュボード')) {
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
