import { signal } from '@preact/signals-core';
import type { ImportResult } from '../../core';
import type { Theme } from '../../platform';
import {
  applyImport,
  dndDenied,
  exportData,
  getPlatform,
  grantDnd,
  readImport,
  setDnd,
  settings,
  updateSettings,
} from '../app';
import { backLink, h, header, label, Screen, setText } from '../dom';

const IMPORT_ERRORS = {
  invalid: 'That file is not a Jabuto export. Nothing was changed.',
  otherApp: 'That file is from another app. Nothing was changed.',
  newerVersion:
    'That file is from a newer version of Jabuto. Update the app first. Nothing was changed.',
} as const;

function toggleRow(
  title: string,
  detail: string | null,
  value: () => boolean,
  set: (on: boolean) => void,
  bind: (fn: () => void) => void,
) {
  const state = h('span', { class: 'toggle-state' });
  const row = h(
    'button',
    { class: 'row row-tall', on: { click: () => set(!value()) } },
    h(
      'span',
      { class: 'grow stack' },
      h('span', { class: 'row-title', text: title }),
      detail ? h('span', { class: 'hint', text: detail }) : null,
    ),
    state,
  );
  bind(() => {
    setText(state, value() ? 'On' : 'Off');
    row.setAttribute('aria-pressed', String(value()));
  });
  return row;
}

export class SetupScreen extends Screen {
  private readonly pending = signal<Extract<ImportResult, { ok: true }> | null>(null);
  private readonly message = signal('');

  protected render() {
    const { device } = getPlatform();
    const bind = (fn: () => void) => this.bind(fn);

    const themes = (['system', 'light', 'dark'] as Theme[]).map((theme) => {
      const b = h('button', {
        class: 'row row-big choice',
        text: theme[0]!.toUpperCase() + theme.slice(1),
        on: { click: () => updateSettings({ theme }) },
      });
      bind(() => {
        const on = settings.value.theme === theme;
        b.classList.toggle('selected', on);
        b.setAttribute('aria-pressed', String(on));
      });
      return b;
    });

    const denied = h(
      'div',
      { class: 'row row-small' },
      h('span', { class: 'grow hint', text: 'DND access not granted' }),
      h('button', {
        class: 'row-link strong',
        text: 'Grant',
        on: { click: () => void grantDnd() },
      }),
    );
    // The line keeps its space whether or not it shows, so nothing below moves.
    bind(() => denied.classList.toggle('invisible', !(settings.value.dnd && dndDenied.value)));

    const sessionSection = h(
      'section',
      { class: 'block' },
      label('Session'),
      h(
        'div',
        { class: 'list' },
        device.native
          ? toggleRow(
              'Do Not Disturb',
              'From warmup to the end bell',
              () => settings.value.dnd,
              (on) => void setDnd(on),
              bind,
            )
          : null,
        device.native ? denied : null,
        toggleRow(
          'Vibrate with bells',
          null,
          () => settings.value.vibrate,
          (vibrate) => updateSettings({ vibrate }),
          bind,
        ),
      ),
    );

    const message = h('div', { class: 'hint message', attrs: { role: 'status' } });
    bind(() => setText(message, this.message.value));

    const confirm = h('div', { class: 'confirm' });
    bind(() => {
      const p = this.pending.value;
      if (!p) {
        confirm.replaceChildren();
        return;
      }
      confirm.replaceChildren(
        h('div', {
          class: 'row-title',
          text: `Replace ${p.presets.length} presets and ${p.sessions.length} sessions?`,
        }),
        h('div', { class: 'hint', text: 'Everything on this device is replaced by the file.' }),
        h(
          'div',
          { class: 'row-actions' },
          h('button', {
            class: 'small-action',
            text: 'Cancel',
            on: { click: () => (this.pending.value = null) },
          }),
          h('button', {
            class: 'small-action strong',
            text: 'Replace',
            on: {
              click: async () => {
                await applyImport(p);
                this.pending.value = null;
                this.message.value = 'Imported.';
              },
            },
          }),
        ),
      );
    });

    return [
      header(backLink()),
      h('section', { class: 'title-block' }, h('h1', { class: 'title', text: 'Setup' })),
      h('section', { class: 'block' }, label('Theme'), h('div', { class: 'list' }, ...themes)),
      sessionSection,
      h(
        'section',
        { class: 'block' },
        label('Data'),
        h(
          'div',
          { class: 'list ruled' },
          h(
            'button',
            {
              class: 'row row-tall',
              on: {
                click: async () => {
                  this.message.value = '';
                  await exportData();
                },
              },
            },
            h(
              'span',
              { class: 'stack' },
              h('span', { class: 'row-title', text: 'Export' }),
              h('span', { class: 'hint', text: 'Presets and session log as one file' }),
            ),
          ),
          h(
            'button',
            {
              class: 'row row-tall',
              on: {
                click: async () => {
                  this.message.value = '';
                  const result = await readImport();
                  if (!result) return;
                  if (result.ok) this.pending.value = result;
                  else this.message.value = IMPORT_ERRORS[result.reason];
                },
              },
            },
            h(
              'span',
              { class: 'stack' },
              h('span', { class: 'row-title', text: 'Import' }),
              h('span', { class: 'hint', text: 'Replace presets and session log from a file' }),
            ),
          ),
          h('a', { class: 'row row-big', text: 'Licences', attrs: { href: '#/licences' } }),
        ),
        confirm,
        message,
      ),
      h('div', { class: 'spacer' }),
      h('p', { class: 'hint footer', text: 'No account. Everything stays on this device.' }),
    ];
  }
}
