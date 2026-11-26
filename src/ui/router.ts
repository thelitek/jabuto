import { signal } from '@preact/signals-core';

export type Route =
  | { name: 'home' }
  | { name: 'preset'; id: string }
  | { name: 'sound'; id: string; role: 'start' | 'interval' | 'end' }
  | { name: 'session' }
  | { name: 'setup' }
  | { name: 'licences' };

export function parse(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  const [first, id, third, role] = parts;
  if (
    first === 'preset' &&
    id &&
    third === 'sound' &&
    (role === 'start' || role === 'interval' || role === 'end')
  )
    return { name: 'sound', id, role };
  if (first === 'preset' && id && !third) return { name: 'preset', id };
  if (first === 'session') return { name: 'session' };
  if (first === 'setup') return { name: 'setup' };
  if (first === 'licences') return { name: 'licences' };
  return { name: 'home' };
}

export function href(route: Route): string {
  switch (route.name) {
    case 'home':
      return '#/';
    case 'preset':
      return `#/preset/${encodeURIComponent(route.id)}`;
    case 'sound':
      return `#/preset/${encodeURIComponent(route.id)}/sound/${route.role}`;
    default:
      return `#/${route.name}`;
  }
}

export const route = signal<Route>(parse(location.hash));

/** Return false to keep the current screen (the URL is put back). */
let guard: ((to: Route) => boolean) | null = null;
let current = location.hash || '#/';
/** In-app history, so Back can return to the previous screen instead of stacking a new one. */
const stack: string[] = [current];

export function setGuard(fn: ((to: Route) => boolean) | null) {
  guard = fn;
}

window.addEventListener('hashchange', () => {
  const to = parse(location.hash);
  if (guard && !guard(to)) {
    // Back gesture or link away from a guarded screen: restore its entry.
    history.pushState(null, '', current);
    return;
  }
  current = location.hash || '#/';
  if (stack.at(-2) === current) stack.pop();
  else stack.push(current);
  route.value = to;
});

export function navigate(to: Route, options: { replace?: boolean } = {}) {
  const target = href(to);
  if (options.replace) {
    history.replaceState(null, '', target);
    current = target;
    stack[stack.length - 1] = target;
    route.value = to;
  } else if (location.hash !== target) {
    location.hash = target;
  }
}

/** Back to the previous screen if the app came from there, otherwise to `fallback`. */
export function goBack(fallback: Route) {
  if (stack.at(-2) === href(fallback)) history.back();
  else navigate(fallback, { replace: true });
}

/** Android's back button: previous screen if there is one, otherwise false (leave the app). */
export function back(): boolean {
  if (route.value.name === 'home') return false;
  if (stack.length > 1) history.back();
  else navigate({ name: 'home' }, { replace: true });
  return true;
}
