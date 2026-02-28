import { DAY_KEYS, PERIOD_KEYS, type DayKey, type Lesson, type PeriodKey, type TimetableData } from './storage';

type CellKey = { day: DayKey; period: PeriodKey };

type Callbacks = {
  onToggleEdit(): void;
  onSelectCell(cell: CellKey): void;
  onRemoveCell(cell: CellKey): void;
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

const PERIOD_TIMES: Partial<Record<PeriodKey, string>> = {
  p1: '9:00〜10:35',
  p2: '10:45〜12:20',
  p3: '13:10〜14:45',
  p4: '14:55〜16:30',
  p5: '16:40〜18:15'
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

function pickCssVar(style: CSSStyleDeclaration, names: string[], fallback: string): string {
  for (const name of names) {
    const value = style.getPropertyValue(name).trim();
    if (value) return value;
  }
  return fallback;
}

function getThemeTokens(): string {
  const rootStyle = getComputedStyle(document.documentElement);

  const bodyBg = pickCssVar(rootStyle, ['--body-bg', '--bs-body-bg'], '#f8f9fa');
  const surface = pickCssVar(rootStyle, ['--card-bg', '--bs-card-bg', '--bs-white'], '#ffffff');
  const border = pickCssVar(rootStyle, ['--border-color', '--bs-border-color', '--gray-300'], '#d9dee4');
  const text = pickCssVar(rootStyle, ['--body-color', '--bs-body-color', '--gray-900'], '#2b3138');
  const muted = pickCssVar(rootStyle, ['--secondary', '--bs-secondary-color', '--gray-600'], '#5f6b7a');
  const primary = pickCssVar(rootStyle, ['--primary', '--bs-primary'], '#0f6cbf');
  const primaryHover = pickCssVar(rootStyle, ['--primary-600', '--bs-primary-text-emphasis'], '#0c5a9f');

  return `
    --mpt-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    --mpt-bg-page: ${bodyBg};
    --mpt-bg-surface: ${surface};
    --mpt-bg-subtle: color-mix(in srgb, ${bodyBg} 70%, ${surface} 30%);
    --mpt-border: ${border};
    --mpt-text: ${text};
    --mpt-text-muted: ${muted};
    --mpt-primary: ${primary};
    --mpt-primary-hover: ${primaryHover};
    --mpt-primary-soft: color-mix(in srgb, ${primary} 14%, ${surface} 86%);
    --mpt-danger-soft: #eef1f4;
    --mpt-danger-text: #4b5563;
    --mpt-shadow: 0 1px 2px rgb(15 23 42 / 0.05);
    --mpt-radius: 8px;
  `;
}

export function createTimetableUI(callbacks: Callbacks): TimetableUI {
  const host = document.createElement('div');
  host.className = 'mpt-host';
  const shadow = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = `
    :host {
      all: initial;
      ${getThemeTokens()}
      color: var(--mpt-text);
      font-family: var(--mpt-font-family);
    }

    .mpt-wrap {
      font-family: var(--mpt-font-family);
      background: var(--mpt-bg-surface);
      border: 1px solid var(--mpt-border);
      border-radius: var(--mpt-radius);
      box-shadow: var(--mpt-shadow);
      margin: 6px 0 14px;
      padding: 12px;
      box-sizing: border-box;
      width: 100%;
      max-width: 1200px;
    }

    .mpt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 10px;
    }

    .mpt-title-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
      flex: 1;
    }

    .mpt-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--mpt-text);
      line-height: 1.3;
    }

    .mpt-message {
      font-size: 12px;
      color: var(--mpt-text-muted);
      border-radius: 6px;
      border: 1px solid transparent;
      border-left-width: 3px;
      padding: 0;
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transform: translateY(-2px);
      transition: opacity 120ms ease, transform 120ms ease, max-height 160ms ease, padding 120ms ease;
    }

    .mpt-message.mpt-show {
      background: var(--mpt-primary-soft);
      border-color: color-mix(in srgb, var(--mpt-primary) 20%, var(--mpt-bg-surface) 80%);
      color: color-mix(in srgb, var(--mpt-primary) 75%, var(--mpt-text) 25%);
      opacity: 1;
      transform: translateY(0);
      max-height: 52px;
      padding: 6px 8px;
    }

    .mpt-btn {
      height: 34px;
      border-radius: 6px;
      border: 1px solid transparent;
      padding: 0 12px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease, box-shadow 120ms ease;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .mpt-btn:focus-visible {
      outline: none;
      box-shadow: 0 0 0 0.18rem color-mix(in srgb, var(--mpt-primary) 28%, transparent 72%);
    }

    .mpt-btn-primary {
      background: var(--mpt-primary);
      border-color: var(--mpt-primary);
      color: #fff;
    }

    .mpt-btn-primary:hover {
      background: var(--mpt-primary-hover);
      border-color: var(--mpt-primary-hover);
    }

    .mpt-btn-primary:active {
      background: color-mix(in srgb, var(--mpt-primary-hover) 88%, #000 12%);
    }

    .mpt-btn-secondary {
      background: var(--mpt-bg-surface);
      border-color: var(--mpt-border);
      color: var(--mpt-text);
    }

    .mpt-btn-secondary:hover {
      background: var(--mpt-bg-subtle);
      border-color: color-mix(in srgb, var(--mpt-border) 85%, var(--mpt-text) 15%);
    }

    .mpt-btn-secondary:active {
      background: color-mix(in srgb, var(--mpt-bg-subtle) 90%, #000 10%);
    }

    .mpt-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      font-size: 13px;
      background: var(--mpt-bg-surface);
    }

    .mpt-table th,
    .mpt-table td {
      border: 1px solid var(--mpt-border);
      padding: 0;
      vertical-align: middle;
      background: var(--mpt-bg-surface);
    }

    .mpt-table th {
      background: var(--mpt-bg-subtle);
      color: color-mix(in srgb, var(--mpt-text) 85%, var(--mpt-text-muted) 15%);
      font-weight: 600;
      height: 34px;
      text-align: center;
    }

    .mpt-period {
      width: 54px;
      min-width: 54px;
      font-size: 12px;
    }

    .mpt-period-main {
      display: block;
      font-weight: 600;
      line-height: 1.2;
    }

    .mpt-period-time {
      display: block;
      margin-top: 2px;
      font-size: 10px;
      font-weight: 400;
      color: var(--mpt-primary);
      line-height: 1.2;
      white-space: nowrap;
    }

    .mpt-cell {
      position: relative;
      cursor: pointer;
      transition: background-color 120ms ease, box-shadow 120ms ease;
    }

    .mpt-cell:hover {
      background: color-mix(in srgb, var(--mpt-primary) 4%, var(--mpt-bg-surface) 96%);
    }

    .mpt-cell.mpt-selected {
      background: color-mix(in srgb, var(--mpt-primary) 8%, var(--mpt-bg-surface) 92%);
      box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--mpt-primary) 55%, var(--mpt-bg-surface) 45%);
    }

    .mpt-cell-inner {
      display: flex;
      align-items: center;
      min-height: 46px;
      padding: 6px 10px;
      width: 100%;
      box-sizing: border-box;
      min-width: 0;
    }

    .mpt-lesson-link {
      display: block;
      color: var(--mpt-primary);
      text-decoration: none;
      min-width: 0;
      width: 100%;
      white-space: normal;
      overflow-wrap: anywhere;
      line-height: 1.35;
      padding-right: 18px;
    }

    .mpt-lesson-link:hover {
      text-decoration: underline;
    }

    .mpt-empty {
      display: block;
      width: 100%;
      color: color-mix(in srgb, var(--mpt-text-muted) 80%, var(--mpt-bg-surface) 20%);
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      opacity: 0.7;
    }

    .mpt-remove {
      position: absolute;
      right: 6px;
      top: 5px;
      width: 20px;
      height: 20px;
      border-radius: 999px;
      border: 1px solid transparent;
      background: var(--mpt-danger-soft);
      color: var(--mpt-danger-text);
      font-size: 12px;
      line-height: 1;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 120ms ease, background-color 120ms ease, border-color 120ms ease;
    }

    .mpt-cell:hover .mpt-remove,
    .mpt-cell:focus-within .mpt-remove,
    .mpt-remove:focus-visible {
      opacity: 1;
      pointer-events: auto;
    }

    .mpt-remove:hover {
      background: color-mix(in srgb, var(--mpt-danger-soft) 75%, #d1d5db 25%);
      border-color: color-mix(in srgb, var(--mpt-border) 80%, var(--mpt-text) 20%);
    }

    .mpt-remove:focus-visible {
      outline: none;
      box-shadow: 0 0 0 0.16rem color-mix(in srgb, var(--mpt-primary) 24%, transparent 76%);
    }

    @media (max-width: 640px) {
      .mpt-wrap {
        padding: 10px;
      }

      .mpt-header {
        align-items: flex-start;
      }

      .mpt-title {
        font-size: 15px;
      }

      .mpt-btn {
        height: 32px;
        padding: 0 10px;
        font-size: 12px;
      }

      .mpt-table {
        font-size: 12px;
      }

      .mpt-period {
        width: 42px;
        min-width: 42px;
      }

      .mpt-cell,
      .mpt-cell-inner {
        min-height: 40px;
      }

      .mpt-cell-inner {
        padding: 4px 7px;
      }
    }

    @media (prefers-color-scheme: dark) {
      :host {
        --mpt-shadow: 0 1px 2px rgb(0 0 0 / 0.24);
      }
    }
  `;

  const root = document.createElement('div');
  root.className = 'mpt-wrap';

  const header = document.createElement('div');
  header.className = 'mpt-header';

  const titleGroup = document.createElement('div');
  titleGroup.className = 'mpt-title-group';

  const title = document.createElement('div');
  title.className = 'mpt-title';
  title.textContent = '時間割';

  const message = document.createElement('div');
  message.className = 'mpt-message';

  const toggleButton = document.createElement('button');
  toggleButton.className = 'mpt-btn';
  toggleButton.type = 'button';
  toggleButton.addEventListener('click', () => callbacks.onToggleEdit());

  titleGroup.append(title, message);
  header.append(titleGroup, toggleButton);

  const table = document.createElement('table');
  table.className = 'mpt-table';

  root.append(header, table);
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
      const periodMain = document.createElement('span');
      periodMain.className = 'mpt-period-main';
      periodMain.textContent = PERIOD_LABELS[period];
      periodCell.appendChild(periodMain);

      const periodTimeText = PERIOD_TIMES[period];
      if (periodTimeText) {
        const periodTime = document.createElement('span');
        periodTime.className = 'mpt-period-time';
        periodTime.textContent = periodTimeText;
        periodCell.appendChild(periodTime);
      }
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

    const inner = document.createElement('div');
    inner.className = 'mpt-cell-inner';

    if (!lesson) {
      const empty = document.createElement('span');
      empty.className = 'mpt-empty';
      empty.textContent = state.editMode ? 'クリックして選択' : ' '; // Keep height stable.
      inner.appendChild(empty);
      cellEl.appendChild(inner);
      return;
    }

    const link = document.createElement('a');
    link.className = 'mpt-lesson-link';
    link.textContent = lesson.title;
    link.href = lesson.url;
    link.dataset.url = lesson.url;

    if (state.editMode) {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
      });
    }

    inner.appendChild(link);
    cellEl.appendChild(inner);

    if (state.editMode) {
      const remove = document.createElement('button');
      remove.className = 'mpt-remove';
      remove.type = 'button';
      remove.textContent = 'x';
      remove.setAttribute('aria-label', '授業を削除');
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
      message.classList.toggle('mpt-show', Boolean(state.message));

      toggleButton.textContent = state.editMode ? '編集を終える' : '編集する';
      toggleButton.classList.remove('mpt-btn-primary', 'mpt-btn-secondary');
      toggleButton.classList.add(state.editMode ? 'mpt-btn-secondary' : 'mpt-btn-primary');

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
