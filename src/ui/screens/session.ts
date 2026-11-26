import { formatClock, formatOvertime, phaseAt } from '../../core';
import {
  confirmingEnd,
  endSession,
  keepSitting,
  pauseSession,
  resumeSession,
  session,
} from '../app';
import { h, Screen, setText } from '../dom';
import { navigate } from '../router';

const NOTICES = {
  volumeOff: 'Media volume is off',
  dndMuting: 'Do Not Disturb is muting bells',
} as const;

export class SessionScreen extends Screen {
  protected render() {
    if (!session.value) {
      queueMicrotask(() => navigate({ name: 'home' }, { replace: true }));
      return [];
    }

    const notice = h('div', { class: 'notice', attrs: { role: 'status' } });
    const phase = h('div', { class: 'label' });
    const time = h('div', { class: 'session-time', attrs: { role: 'timer' } });
    const pause = h('button', { class: 'control' });
    const end = h('button', {
      class: 'control strong end',
      text: 'End',
      on: { click: () => void endSession() },
    });
    const controls = h('div', { class: 'controls' }, pause, end);

    pause.addEventListener('click', () =>
      session.value?.paused ? resumeSession() : pauseSession(),
    );

    this.bind(() => {
      const s = session.value;
      if (!s) return;
      const p = phaseAt(s.request.plan, s.elapsed);
      setText(notice, s.notice ? NOTICES[s.notice] : '');
      const text =
        p.phase === 'warmup' || p.phase === 'sitting'
          ? formatClock(p.remaining)
          : formatOvertime(p.overtime);
      setText(time, text);
      time.classList.toggle('long', text.length > 6);
      setText(
        phase,
        s.paused
          ? 'Paused'
          : p.phase === 'warmup'
            ? 'Warmup'
            : p.phase === 'sitting'
              ? 'Sitting'
              : '',
      );
      const overtime = p.phase === 'overtime' || p.phase === 'capped';
      pause.hidden = overtime;
      controls.classList.toggle('single', overtime);
      setText(pause, s.paused ? 'Resume' : 'Pause');
    });

    const dialog = h(
      'dialog',
      { class: 'sheet', attrs: { 'aria-labelledby': 'end-q' } },
      h('h2', { class: 'title', text: 'End session?', attrs: { id: 'end-q' } }),
      h('button', {
        class: 'row row-big strong',
        text: 'Keep sitting',
        on: { click: keepSitting },
      }),
      h('button', {
        class: 'row row-big muted',
        text: 'End',
        on: { click: () => void endSession() },
      }),
    );
    dialog.addEventListener('cancel', (e) => {
      e.preventDefault();
      keepSitting();
    });
    this.bind(() => {
      if (confirmingEnd.value && !dialog.open) dialog.showModal();
      if (!confirmingEnd.value && dialog.open) dialog.close();
    });

    return [
      h('header', { class: 'bar' }, notice),
      h('section', { class: 'session-main' }, phase, time),
      controls,
      dialog,
    ];
  }
}
