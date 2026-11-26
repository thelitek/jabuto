import { computed, signal } from '@preact/signals-core';
import {
  SOUND_IDS,
  soundName,
  type BundledSound,
  type Preset,
  type SoundId,
  type Strikes,
} from '../../core';
import { getPlatform, presets, updatePreset } from '../app';
import { backLink, h, header, label, Screen, setText } from '../dom';
import { navigate } from '../router';

const TITLES = { start: 'Start bell', interval: 'Interval bells', end: 'End bell' } as const;

export class SoundScreen extends Screen {
  presetId = '';
  bellRole: 'start' | 'interval' | 'end' = 'start';

  private readonly preset = computed(() => presets.value.find((p) => p.id === this.presetId));
  private readonly playing = signal<BundledSound | null>(null);

  protected render() {
    const preset = this.preset.value;
    if (!preset) {
      queueMicrotask(() => navigate({ name: 'home' }, { replace: true }));
      return [];
    }
    const { runner } = getPlatform();
    this.own(() => runner.stopPreview());

    const selected = (p: Preset): SoundId =>
      this.bellRole === 'interval'
        ? p.intervalSound
        : this.bellRole === 'start'
          ? p.startBell.sound
          : p.endBell.sound;
    const strikes = (p: Preset): Strikes =>
      this.bellRole === 'start' ? p.startBell.strikes : p.endBell.strikes;

    const pick = (sound: SoundId) => {
      const p = this.preset.value!;
      if (this.bellRole === 'interval') updatePreset({ ...p, intervalSound: sound });
      else if (this.bellRole === 'start')
        updatePreset({ ...p, startBell: { ...p.startBell, sound } });
      else updatePreset({ ...p, endBell: { ...p.endBell, sound } });
    };
    const pickStrikes = (n: Strikes) => {
      const p = this.preset.value!;
      if (this.bellRole === 'start')
        updatePreset({ ...p, startBell: { ...p.startBell, strikes: n } });
      else updatePreset({ ...p, endBell: { ...p.endBell, strikes: n } });
    };

    const play = async (sound: BundledSound) => {
      if (this.playing.value === sound) {
        runner.stopPreview();
        this.playing.value = null;
        return;
      }
      this.playing.value = sound;
      await runner.preview(sound);
      if (this.playing.value === sound) this.playing.value = null;
    };

    const rows = SOUND_IDS.map((id) => {
      const choose = h('button', {
        class: 'grow choice',
        text: soundName(id),
        on: { click: () => pick(id) },
      });
      const playButton =
        id === 'silent'
          ? null
          : h('button', { class: 'row-link', on: { click: () => void play(id) } });
      this.bind(() => {
        const p = this.preset.value;
        if (!p) return;
        const on = selected(p) === id;
        choose.classList.toggle('selected', on);
        choose.setAttribute('aria-pressed', String(on));
        if (playButton) {
          const isPlaying = this.playing.value === id;
          setText(playButton, isPlaying ? 'Stop' : 'Play');
          playButton.setAttribute('aria-label', `${isPlaying ? 'Stop' : 'Play'} ${soundName(id)}`);
        }
      });
      return h('div', { class: 'row row-big' }, choose, playButton);
    });

    const strikeSection =
      this.bellRole === 'interval'
        ? null
        : h(
            'section',
            { class: 'block' },
            label('Strikes'),
            h(
              'div',
              { class: 'steppers three ruled-bottom' },
              ...([1, 2, 3] as const).map((n) => {
                const b = h('button', {
                  class: 'choice num',
                  text: `${n}×`,
                  attrs: { 'aria-label': n === 1 ? '1 strike' : `${n} strikes` },
                  on: { click: () => pickStrikes(n) },
                });
                this.bind(() => {
                  const p = this.preset.value;
                  if (!p) return;
                  const on = strikes(p) === n;
                  b.classList.toggle('selected', on);
                  b.setAttribute('aria-pressed', String(on));
                });
                return b;
              }),
            ),
          );

    const presetName = h('div', { class: 'label' });
    this.bind(() => this.preset.value && setText(presetName, this.preset.value.name));

    return [
      header(backLink({ name: 'preset', id: this.presetId })),
      h(
        'section',
        { class: 'title-block' },
        presetName,
        h('h1', { class: 'title', text: TITLES[this.bellRole] }),
      ),
      h('section', { class: 'block' }, label('Sound'), h('div', { class: 'list' }, ...rows)),
      strikeSection,
    ];
  }
}
