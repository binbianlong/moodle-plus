export const STORAGE_KEY = 'timetable_v1';

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
export type PeriodKey = 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'other';

export type Lesson = {
  title: string;
  url: string;
};

export type TimetableData = Record<DayKey, Record<PeriodKey, Lesson | null>>;

export const DAY_KEYS: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
export const PERIOD_KEYS: PeriodKey[] = ['p1', 'p2', 'p3', 'p4', 'p5', 'other'];

export function createEmptyTimetable(): TimetableData {
  return {
    mon: { p1: null, p2: null, p3: null, p4: null, p5: null, other: null },
    tue: { p1: null, p2: null, p3: null, p4: null, p5: null, other: null },
    wed: { p1: null, p2: null, p3: null, p4: null, p5: null, other: null },
    thu: { p1: null, p2: null, p3: null, p4: null, p5: null, other: null },
    fri: { p1: null, p2: null, p3: null, p4: null, p5: null, other: null },
    sat: { p1: null, p2: null, p3: null, p4: null, p5: null, other: null }
  };
}

export async function loadTimetable(): Promise<TimetableData> {
  const raw = await chrome.storage.local.get(STORAGE_KEY);
  const stored = raw[STORAGE_KEY];
  if (!stored || typeof stored !== 'object') {
    return createEmptyTimetable();
  }

  const base = createEmptyTimetable();
  for (const day of DAY_KEYS) {
    for (const period of PERIOD_KEYS) {
      const value = stored?.[day]?.[period];
      if (
        value &&
        typeof value === 'object' &&
        typeof value.title === 'string' &&
        typeof value.url === 'string'
      ) {
        base[day][period] = { title: value.title, url: value.url };
      }
    }
  }
  return base;
}

export async function saveTimetable(data: TimetableData): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: data });
}
