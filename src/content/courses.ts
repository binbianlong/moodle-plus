import type { Lesson } from './storage';

export type CourseCatalog = {
  findByAnchor(anchor: HTMLAnchorElement): Lesson | null;
  disconnect(): void;
};

function normalizeUrl(url: string): string {
  try {
    return new URL(url, location.href).toString();
  } catch {
    return url;
  }
}

function isInsideRecentArea(anchor: HTMLAnchorElement): boolean {
  const region = anchor.closest('section, .block, [role="region"], .card, .content');
  if (!region) return false;
  return /最近アクセスされたアイテム/.test(region.textContent ?? '');
}

export function isCourseLink(anchor: HTMLAnchorElement): boolean {
  const href = anchor.getAttribute('href') ?? '';
  if (!href) return false;

  // Selector strategy:
  // 1) Prioritize strict Moodle course links (course/view.php?id=...) as primary target.
  // 2) Fallback for "recent items" area: allow broader mod/course paths there.
  // 3) Exclude assignment/deadline links by default to avoid setting non-course URLs.
  if (href.includes('course/view.php?id=')) return true;
  if (href.includes('assign/view.php')) return false;
  if (href.includes('mod/assign/')) return false;

  if (isInsideRecentArea(anchor)) {
    if (href.includes('course/view.php')) return true;
    if (href.includes('/mod/') && !href.includes('assign')) return true;
  }

  return false;
}

export function createCourseCatalog(onUpdated?: () => void): CourseCatalog {
  let map = new Map<string, Lesson>();
  let observer: MutationObserver | null = null;

  const refresh = () => {
    const next = new Map<string, Lesson>();
    const anchors = document.querySelectorAll<HTMLAnchorElement>('a[href]');

    for (const anchor of anchors) {
      if (!isCourseLink(anchor)) continue;
      const title = (anchor.textContent ?? '').trim();
      const href = anchor.href;
      if (!title || !href) continue;

      const normalized = normalizeUrl(href);
      if (next.has(normalized)) continue;
      next.set(normalized, { title, url: normalized });
    }

    map = next;
    onUpdated?.();
  };

  refresh();

  observer = new MutationObserver(() => {
    refresh();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href']
  });

  return {
    findByAnchor(anchor: HTMLAnchorElement): Lesson | null {
      if (!isCourseLink(anchor)) return null;
      const normalized = normalizeUrl(anchor.href);
      return map.get(normalized) ?? null;
    },
    disconnect() {
      observer?.disconnect();
      observer = null;
    }
  };
}
