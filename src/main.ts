import { effect, untracked } from '@preact/signals-core';
import { createPlatform } from './platform';
import { explanation, init, settings } from './ui/app';
import { h } from './ui/dom';
import { route, type Route } from './ui/router';
import { HomeScreen } from './ui/screens/home';
import { LicencesScreen } from './ui/screens/licences';
import { PresetScreen } from './ui/screens/preset';
import { SessionScreen } from './ui/screens/session';
import { SetupScreen } from './ui/screens/setup';
import { SoundScreen } from './ui/screens/sound';
import './ui/styles.css';

customElements.define('home-screen', HomeScreen);
customElements.define('preset-screen', PresetScreen);
customElements.define('sound-screen', SoundScreen);
customElements.define('session-screen', SessionScreen);
customElements.define('setup-screen', SetupScreen);
customElements.define('licences-screen', LicencesScreen);

function screenFor(r: Route): HTMLElement {
  switch (r.name) {
    case 'home':
      return new HomeScreen();
    case 'preset':
      return Object.assign(new PresetScreen(), { presetId: r.id });
    case 'sound':
      return Object.assign(new SoundScreen(), { presetId: r.id, bellRole: r.role });
    case 'session':
      return new SessionScreen();
    case 'setup':
      return new SetupScreen();
    case 'licences':
      return new LicencesScreen();
  }
}

async function main() {
  await init(await createPlatform());
  const app = document.getElementById('app')!;

  effect(() => {
    const theme = settings.value.theme;
    if (theme === 'system') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme;
  });

  // The single place screens are swapped; View Transitions would wrap this.
  effect(() => {
    const r = route.value;
    // Building a screen reads signals; only the route may re-run this effect.
    untracked(() => app.replaceChildren(screenFor(r)));
    window.scrollTo(0, 0);
  });

  // Explanations before Android permission prompts, shown over any screen.
  const text = h('p', { class: 'row-title explain-text' });
  const sheet = h(
    'dialog',
    { class: 'sheet' },
    text,
    h(
      'div',
      { class: 'row-actions' },
      h('button', {
        class: 'small-action',
        text: 'Not now',
        on: { click: () => explanation.value?.answer(false) },
      }),
      h('button', {
        class: 'small-action strong',
        text: 'Continue',
        on: { click: () => explanation.value?.answer(true) },
      }),
    ),
  );
  sheet.addEventListener('cancel', (e) => {
    e.preventDefault();
    explanation.value?.answer(false);
  });
  document.body.append(sheet);
  effect(() => {
    const e = explanation.value;
    text.textContent = e?.text ?? '';
    if (e && !sheet.open) sheet.showModal();
    if (!e && sheet.open) sheet.close();
  });

  await document.fonts.ready;
  document.documentElement.classList.add('ready');
}

void main();
