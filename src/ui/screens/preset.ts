import { computed } from '@preact/signals-core';
import {
  addBell,
  formatClock,
  LIMITS,
  normaliseName,
  parseClock,
  removeBell,
  setMeditationDuration,
  setWarmupDuration,
  soundName,
  suggestBell,
  type BellSetting,
  type Preset,
} from '../../core';
import { deletePreset, findPreset, presets, updatePreset } from '../app';
import { backLink, h, header, label, Screen, setText } from '../dom';
import { href, navigate } from '../router';

type Step = { label: string; by: number; aria: string };

/** A large editable duration with four steppers underneath. */
function durationField(
  name: string,
  className: string,
  steps: Step[],
  value: () => number,
  set: (seconds: number) => void,
  bind: (fn: () => void) => void,
) {
  const input = h('input', {
    class: `duration ${className}`,
    attrs: {
      type: 'text',
      inputmode: 'numeric',
      'aria-label': name,
      autocomplete: 'off',
      spellcheck: 'false',
    },
  });
  bind(() => {
    if (document.activeElement !== input) input.value = formatClock(value());
  });
  input.addEventListener('change', () => {
    const seconds = parseClock(input.value);
    if (seconds !== null) set(seconds);
    input.value = formatClock(value());
  });
  input.addEventListener('focus', () => input.select());
  const steppers = h(
    'div',
    { class: 'steppers' },
    ...steps.map((s) =>
      h('button', {
        class: 'num',
        text: s.label,
        attrs: { 'aria-label': s.aria },
        on: { click: () => set(value() + s.by) },
      }),
    ),
  );
  return [input, steppers];
}

function bellRow(
  text: () => string,
  detail: () => string,
  link: string,
  bind: (fn: () => void) => void,
) {
  const name = h('span', { class: 'grow' });
  const extra = h('span', { class: 'num muted small' });
  bind(() => {
    setText(name, text());
    setText(extra, detail());
  });
  return h('a', { class: 'row row-mid', attrs: { href: link } }, name, extra);
}

export class PresetScreen extends Screen {
  presetId = '';

  private readonly preset = computed(() => presets.value.find((p) => p.id === this.presetId));

  protected render() {
    if (!findPreset(this.presetId)) {
      queueMicrotask(() => navigate({ name: 'home' }, { replace: true }));
      return [];
    }
    const current = () => this.preset.value!;
    const change = (fn: (p: Preset) => Preset) => {
      const p = this.preset.value;
      if (p) updatePreset(fn(p));
    };
    const bind = (fn: () => void) => this.bind(() => this.preset.value && fn());

    const nameInput = h('input', {
      class: 'name-input',
      attrs: {
        type: 'text',
        maxlength: String(LIMITS.nameMax),
        'aria-label': 'Preset name',
        autocomplete: 'off',
      },
    });
    bind(() => {
      if (document.activeElement !== nameInput) nameInput.value = current().name;
    });
    nameInput.addEventListener('change', () => {
      const name = normaliseName(nameInput.value);
      if (name) change((p) => ({ ...p, name }));
      nameInput.value = current().name;
    });

    const strikes = (b: BellSetting) => (b.sound === 'silent' ? '' : `${b.strikes}×`);
    const soundLink = (role: 'start' | 'interval' | 'end') =>
      href({ name: 'sound', id: this.presetId, role });

    const bells = h('div', { class: 'list' });
    bind(() => {
      bells.replaceChildren(
        ...current().intervalBells.map((at) =>
          h(
            'div',
            { class: 'row row-mid' },
            h('span', { class: 'grow num', text: formatClock(at) }),
            h('button', {
              class: 'row-link',
              text: 'Remove',
              attrs: { 'aria-label': `Remove bell at ${formatClock(at)}` },
              on: { click: () => change((p) => removeBell(p, at)) },
            }),
          ),
        ),
      );
    });

    const endTime = h('span', { class: 'grow num' });
    bind(() => setText(endTime, formatClock(current().meditationDuration)));

    return [
      header(backLink()),
      h('section', { class: 'title-block' }, label('Preset'), nameInput),
      h(
        'section',
        { class: 'block' },
        label('Warmup'),
        ...durationField(
          'Warmup',
          'duration-mid',
          [
            { label: '−1:00', by: -60, aria: 'Shorten warmup by 1 minute' },
            { label: '−0:10', by: -10, aria: 'Shorten warmup by 10 seconds' },
            { label: '+0:10', by: 10, aria: 'Lengthen warmup by 10 seconds' },
            { label: '+1:00', by: 60, aria: 'Lengthen warmup by 1 minute' },
          ],
          () => current().warmupDuration,
          (s) => change((p) => setWarmupDuration(p, s)),
          bind,
        ),
      ),
      h(
        'section',
        { class: 'block' },
        label('Start bell'),
        h(
          'div',
          { class: 'list ruled' },
          bellRow(
            () => soundName(current().startBell.sound),
            () => strikes(current().startBell),
            soundLink('start'),
            bind,
          ),
        ),
      ),
      h(
        'section',
        { class: 'block' },
        label('Length'),
        ...durationField(
          'Length',
          'duration-big',
          [
            { label: '−5:00', by: -300, aria: 'Shorten by 5 minutes' },
            { label: '−1:00', by: -60, aria: 'Shorten by 1 minute' },
            { label: '+1:00', by: 60, aria: 'Lengthen by 1 minute' },
            { label: '+5:00', by: 300, aria: 'Lengthen by 5 minutes' },
          ],
          () => current().meditationDuration,
          (s) => change((p) => setMeditationDuration(p, s)),
          bind,
        ),
      ),
      h(
        'section',
        { class: 'block' },
        label('Interval bells'),
        h(
          'div',
          { class: 'list' },
          h(
            'a',
            { class: 'row row-mid', attrs: { href: soundLink('interval') } },
            h('span', { class: 'grow muted small-text', text: 'Sound' }),
            (() => {
              const s = h('span', { class: 'small-text' });
              bind(() => setText(s, soundName(current().intervalSound)));
              return s;
            })(),
          ),
          bells,
          this.addBellRow(current, change),
          h(
            'div',
            { class: 'row row-mid muted' },
            endTime,
            h('span', { class: 'small-text', text: 'End' }),
          ),
        ),
      ),
      h(
        'section',
        { class: 'block' },
        label('End bell'),
        h(
          'div',
          { class: 'list ruled' },
          bellRow(
            () => soundName(current().endBell.sound),
            () => strikes(current().endBell),
            soundLink('end'),
            bind,
          ),
        ),
      ),
      h('div', { class: 'spacer' }),
      h('button', {
        class: 'small-action',
        text: 'Delete preset',
        on: {
          click: () => {
            deletePreset(this.presetId);
            navigate({ name: 'home' }, { replace: true });
          },
        },
      }),
    ];
  }

  /** "Add bell" turns into an mm:ss field prefilled with the middle of the largest gap. */
  private addBellRow(current: () => Preset, change: (fn: (p: Preset) => Preset) => void) {
    const wrap = h('div');
    const error = h('div', { class: 'hint', attrs: { role: 'status' } });
    const button = h('button', { class: 'row row-mid muted add-bell', text: 'Add bell' });
    const showButton = () => wrap.replaceChildren(button);

    button.addEventListener('click', () => {
      const suggestion = suggestBell(current().intervalBells, current().meditationDuration);
      const input = h('input', {
        class: 'grow num inline-input',
        attrs: {
          type: 'text',
          inputmode: 'numeric',
          'aria-label': 'New bell time',
          autocomplete: 'off',
        },
      });
      input.value = suggestion === null ? '' : formatClock(suggestion);
      const add = () => {
        const at = parseClock(input.value);
        const before = current().intervalBells.length;
        if (at !== null) change((p) => addBell(p, at));
        if (at === null || current().intervalBells.length === before) {
          setText(
            error,
            `A bell must be between 00:01 and ${formatClock(current().meditationDuration - LIMITS.endGap - 1)}, once.`,
          );
          return;
        }
        showButton();
      };
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') add();
        if (e.key === 'Escape') showButton();
      });
      setText(error, '');
      wrap.replaceChildren(
        h(
          'div',
          { class: 'row row-mid' },
          input,
          h('button', { class: 'row-link', text: 'Cancel', on: { click: showButton } }),
          h('button', { class: 'row-link strong', text: 'Add', on: { click: add } }),
        ),
        error,
      );
      input.focus();
      input.select();
    });

    showButton();
    return wrap;
  }
}
