import { DAY_KEYS, PERIOD_KEYS, type DayKey, type Lesson, type PeriodKey, type TimetableData } from './storage';

type CellKey = { day: DayKey; period: PeriodKey };

type Callbacks = {
  onToggleEdit(): void;
  onSelectCell(cell: CellKey): void;
  onRemoveCell(cell: CellKey): void;
  onOpenLesson(lesson: Lesson): void;
};

const DAY_LABELS: Record<DayKey, string> = {
  mon: '月',
  tue: '火',
  wed: '水',
  thu: '木',
  fri: '金',
  sat: '土'
};

const PERIOD_LABELS: Record<PeriodKey, string> = {
  p1: '1',
  p2: '2',
  p3: '3',
  p4: '4',
  p5: '5',
  other: 'その他'
};

export type TimetableUIState = {
  editMode: boolean;
  selectedCell: CellKey | null;
  message: string;
};

export type TimetableUI = {
  mount(target: Element): void;
  render(timetable: TimetableData, state: TimetableUIState): void;
};

export function createTimetableUI(callbacks: Callbacks): TimetableUI {
  const host = document.createElement('div');
  host.className = 'mpt-host';
  const shadow = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = `
    :host { all: initial; }
    .mpt-wrap { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; border: 1px solid #c6ccd6; border-radius: 10px; background: #fff; margin: 8px 0 16px; padding: 12px; box-sizing: border-box; max-width: 1200px; }
    .mpt-header { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 8px; }
    .mpt-title { font-size: 16px; font-weight: 700; color: #20262f; }
    .mpt-message { font-size: 13px; color: #0d5ea6; min-height: 20px; }
    .mpt-btn { position: sticky; bottom: 12px; margin-left: auto; display: block; border: 1px solid #2e6fb3; background: #2e6fb3; color: #fff; border-radius: 999px; padding: 8px 14px; font-size: 13px; cursor: pointer; }
    .mpt-btn:hover { background: #24598f; }
    .mpt-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    .mpt-table th, .mpt-table td { border: 1px solid #d2d8e0; padding: 6px; vertical-align: top; }
    .mpt-table th { background: #f4f7fb; font-size: 13px; }
    .mpt-period { width: 60px; text-align: center; font-weight: 700; }
    .mpt-cell { position: relative; min-height: 54px; font-size: 13px; cursor: pointer; }
    .mpt-cell.mpt-selected { outline: 2px solid #ff8c00; outline-offset: -2px; }
    .mpt-lesson-link { color: #1558a6; text-decoration: none; word-break: break-word; display: block; padding-right: 18px; }
    .mpt-lesson-link:hover { text-decoration: underline; }
    .mpt-remove { position: absolute; right: 4px; top: 3px; border: none; background: #d64545; color: #fff; width: 16px; height: 16px; line-height: 16px; border-radius: 50%; font-size: 11px; cursor: pointer; padding: 0; }
    .mpt-empty { color: #95a1af; }
  `;

  const root = document.createElement('div');
  root.className = 'mpt-wrap';

  const header = document.createElement('div');
  header.className = 'mpt-header';

  const title = document.createElement('div');
  title.className = 'mpt-title';
  title.textContent = '時間割';

  const message = document.createElement('div');
  message.className = 'mpt-message';

  header.append(title, message);

  const table = document.createElement('table');
  table.className = 'mpt-table';

  const toggleButton = document.createElement('button');
  toggleButton.className = 'mpt-btn';
  toggleButton.type = 'button';
  toggleButton.addEventListener('click', () => callbacks.onToggleEdit());

  root.append(header, table, toggleButton);
  shadow.append(style, root);

  const cellMap = new Map<string, HTMLTableCellElement>();

  const buildStaticTable = () => {
    table.innerHTML = '';

    const headRow = document.createElement('tr');
    const emptyHead = document.createElement('th');
    emptyHead.textContent = '';
    headRow.appendChild(emptyHead);

    for (const day of DAY_KEYS) {
      const th = document.createElement('th');
      th.textContent = DAY_LABELS[day];
      headRow.appendChild(th);
    }
    table.appendChild(headRow);

    for (const period of PERIOD_KEYS) {
      const row = document.createElement('tr');

      const periodCell = document.createElement('th');
      periodCell.className = 'mpt-period';
      periodCell.textContent = PERIOD_LABELS[period];
      row.appendChild(periodCell);

      for (const day of DAY_KEYS) {
        const td = document.createElement('td');
        td.className = 'mpt-cell';
        td.dataset.day = day;
        td.dataset.period = period;
        td.addEventListener('click', () => callbacks.onSelectCell({ day, period }));
        row.appendChild(td);
        cellMap.set(`${day}:${period}`, td);
      }

      table.appendChild(row);
    }
  };

  buildStaticTable();

  const renderCell = (cellEl: HTMLTableCellElement, lesson: Lesson | null, state: TimetableUIState) => {
    const day = cellEl.dataset.day as DayKey;
    const period = cellEl.dataset.period as PeriodKey;

    cellEl.innerHTML = '';

    const isSelected = state.selectedCell?.day === day && state.selectedCell?.period === period;
    cellEl.classList.toggle('mpt-selected', Boolean(isSelected));

    if (!lesson) {
      const empty = document.createElement('span');
      empty.className = 'mpt-empty';
      empty.textContent = ' '; // Keep cell height stable.
      cellEl.appendChild(empty);
      return;
    }

    const link = document.createElement('a');
    link.className = 'mpt-lesson-link';
    link.textContent = lesson.title;
    link.href = lesson.url;

    if (state.editMode) {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
      });
    } else {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        callbacks.onOpenLesson(lesson);
      });
    }

    cellEl.appendChild(link);

    if (state.editMode) {
      const remove = document.createElement('button');
      remove.className = 'mpt-remove';
      remove.type = 'button';
      remove.textContent = 'x';
      remove.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        callbacks.onRemoveCell({ day, period });
      });
      cellEl.appendChild(remove);
    }
  };

  return {
    mount(target: Element) {
      target.parentNode?.insertBefore(host, target);
    },
    render(timetable: TimetableData, state: TimetableUIState) {
      message.textContent = state.message;
      toggleButton.textContent = state.editMode ? '編集を終える' : '編集する';

      for (const day of DAY_KEYS) {
        for (const period of PERIOD_KEYS) {
          const cellEl = cellMap.get(`${day}:${period}`);
          if (!cellEl) continue;
          renderCell(cellEl, timetable[day][period], state);
        }
      }
    }
  };
}
