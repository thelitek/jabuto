import { effect } from '@preact/signals-core';
import { goBack, href, type Route } from './router';

type Child = Node | string | null | false | undefined;

interface Props {
  class?: string;
  text?: string;
  attrs?: Record<string, string | boolean | undefined>;
  on?: Partial<{ [K in keyof HTMLElementEventMap]: (e: HTMLElementEventMap[K]) => void }>;
}

/** Builds an element. Strings always become text nodes, never markup. */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Props = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (props.class) el.className = props.class;
  if (props.text !== undefined) el.textContent = props.text;
  for (const [name, value] of Object.entries(props.attrs ?? {})) {
    if (value === true) el.setAttribute(name, '');
    else if (value !== false && value !== undefined) el.setAttribute(name, value);
  }
  for (const [type, handler] of Object.entries(props.on ?? {})) {
    el.addEventListener(type, handler as EventListener);
  }
  for (const child of children) {
    if (child === null || child === false || child === undefined) continue;
    el.append(child);
  }
  return el;
}

/**
 * A screen builds its DOM once in `render()` and keeps it current with
 * `bind()`; everything bound is released when the screen leaves the page.
 */
export abstract class Screen extends HTMLElement {
  private disposers: (() => void)[] = [];

  connectedCallback() {
    this.classList.add('screen');
    this.replaceChildren(...this.render().filter((n): n is Node => n !== null));
  }

  disconnectedCallback() {
    for (const d of this.disposers.splice(0)) d();
  }

  protected abstract render(): (Node | null)[];

  /** Runs `fn` now and again whenever a signal it reads changes. */
  protected bind(fn: () => void) {
    this.disposers.push(effect(fn));
  }

  protected own(dispose: () => void) {
    this.disposers.push(dispose);
  }
}

/** Sets text only when it changes, so the countdown never touches layout needlessly. */
export function setText(el: Node, text: string) {
  if (el.textContent !== text) el.textContent = text;
}

export function header(...children: Child[]) {
  return h('header', { class: 'bar' }, ...children);
}

export function backLink(to: Route = { name: 'home' }) {
  return h('a', {
    class: 'bar-link',
    text: 'Back',
    attrs: { href: href(to) },
    on: {
      click: (e) => {
        e.preventDefault();
        goBack(to);
      },
    },
  });
}

export function label(text: string) {
  return h('div', { class: 'label', text });
}
