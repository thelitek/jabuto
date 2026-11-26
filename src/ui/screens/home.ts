import { signal } from '@preact/signals-core';
import { formatClock, type Preset } from '../../core';
import { createPreset, currentStreak, presets, reorderPresets, startSession } from '../app';
import { h, header, label, Screen, setText } from '../dom';
import { href, navigate } from '../router';

/** Edit mode survives a trip to the preset editor and back. */
const editing = signal(false);
const draft = signal<string[]>([]);

export class HomeScreen extends Screen {
  protected render() {
    const numeral = h('div', { class: 'streak-numeral' });
    const unit = h('div', { class: 'streak-unit' });
    this.bind(() => {
      const n = currentStreak.value;
      setText(numeral, String(n));
      setText(unit, n === 1 ? 'day in a row' : 'days in a row');
    });

    const list = h('div', { class: 'list' });
    const footer = h('div', { class: 'row-actions' });
    this.bind(() => {
      if (editing.value) this.renderEditing(list, footer);
      else this.renderViewing(list, footer);
    });

    return [
      header(h('span'), h('a', { class: 'bar-link', text: 'Setup', attrs: { href: '#/setup' } })),
      h('section', { class: 'streak' }, label('Streak'), numeral, unit),
      h('div', { class: 'spacer' }),
      h('section', { class: 'presets' }, label('Presets'), list, footer),
    ];
  }

  private renderViewing(list: HTMLElement, footer: HTMLElement) {
    list.replaceChildren(
      ...presets.value.map((p) =>
        h(
          'button',
          {
            class: 'row row-big',
            attrs: { 'aria-label': `Start ${p.name}, ${formatClock(p.meditationDuration)}` },
            on: { click: () => void startSession(p) },
          },
          h('span', { class: 'grow', text: p.name }),
          h('span', { class: 'num', text: formatClock(p.meditationDuration) }),
        ),
      ),
    );
    footer.replaceChildren(
      h('span'),
      h('button', {
        class: 'small-action',
        text: 'Edit',
        on: {
          click: () => {
            draft.value = presets.value.map((p) => p.id);
            editing.value = true;
          },
        },
      }),
    );
  }

  private renderEditing(list: HTMLElement, footer: HTMLElement) {
    const byId = new Map(presets.value.map((p) => [p.id, p]));
    // Presets created meanwhile (New preset) join the end of the draft order.
    const ids = [
      ...draft.value.filter((id) => byId.has(id)),
      ...presets.value.map((p) => p.id).filter((id) => !draft.value.includes(id)),
    ];
    const rows = ids.map((id) => this.editRow(byId.get(id)!, list));
    list.replaceChildren(
      ...rows,
      h('button', {
        class: 'row row-big muted',
        text: 'New preset',
        on: {
          click: () => {
            draft.value = [...this.order(list)];
            const preset = createPreset();
            navigate({ name: 'preset', id: preset.id });
          },
        },
      }),
    );
    footer.replaceChildren(
      h('button', {
        class: 'small-action',
        text: 'Cancel',
        on: { click: () => (editing.value = false) },
      }),
      h('button', {
        class: 'small-action strong',
        text: 'Done',
        on: {
          click: () => {
            reorderPresets(this.order(list));
            editing.value = false;
          },
        },
      }),
    );
  }

  private order(list: HTMLElement): string[] {
    return [...list.querySelectorAll<HTMLElement>('[data-id]')].map((el) => el.dataset.id!);
  }

  private editRow(p: Preset, list: HTMLElement): HTMLElement {
    const handle = h('button', {
      class: 'handle',
      text: '≡',
      attrs: { 'aria-label': `Move ${p.name}. Drag, or use the arrow keys.` },
    });
    const row = h(
      'div',
      { class: 'row row-big', attrs: { 'data-id': p.id } },
      handle,
      h('span', { class: 'grow', text: p.name }),
      h('span', { class: 'num muted', text: formatClock(p.meditationDuration) }),
      h('a', {
        class: 'row-link',
        text: 'Edit',
        attrs: { href: href({ name: 'preset', id: p.id }), 'aria-label': `Edit ${p.name}` },
        on: { click: () => (draft.value = this.order(list)) },
      }),
    );

    // Dragging moves the row's DOM node; the order is read back on Done.
    handle.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      handle.setPointerCapture(e.pointerId);
      row.classList.add('lifted');
      const move = (ev: PointerEvent) => {
        const rows = [...list.querySelectorAll<HTMLElement>('[data-id]')].filter((r) => r !== row);
        const before = rows.find((r) => {
          const box = r.getBoundingClientRect();
          return ev.clientY < box.top + box.height / 2;
        });
        if (before) list.insertBefore(row, before);
        else rows.at(-1)?.after(row);
      };
      const up = () => {
        row.classList.remove('lifted');
        handle.removeEventListener('pointermove', move);
        handle.removeEventListener('pointerup', up);
        handle.removeEventListener('pointercancel', up);
      };
      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', up);
      handle.addEventListener('pointercancel', up);
    });

    handle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' && row.previousElementSibling?.hasAttribute('data-id')) {
        row.previousElementSibling.before(row);
      } else if (e.key === 'ArrowDown' && row.nextElementSibling?.hasAttribute('data-id')) {
        row.nextElementSibling.after(row);
      } else return;
      e.preventDefault();
      handle.focus();
    });

    return row;
  }
}
