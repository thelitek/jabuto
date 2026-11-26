import capacitorAndroid from '../../node_modules/@capacitor/android/LICENSE?raw';
import capacitorCore from '../../node_modules/@capacitor/core/LICENSE?raw';
import signals from '../../node_modules/@preact/signals-core/LICENSE?raw';
import ofl from '../../public/fonts/OFL.txt?raw';
import { SOUNDS } from '../core';

export interface Credit {
  name: string;
  detail: string;
  text?: string;
}

export interface CreditGroup {
  title: string;
  credits: Credit[];
}

/** Everything bundled with the app and its licence. Add a sound's source here when it is replaced. */
export const CREDITS: CreditGroup[] = [
  {
    title: 'Sounds',
    credits: SOUNDS.map((s) => ({
      name: s.name,
      detail: 'Placeholder, synthesised for Jabuto · CC0 1.0',
    })),
  },
  {
    title: 'Typeface',
    credits: [
      {
        name: 'Inter Tight',
        detail: 'The Inter Project Authors · SIL Open Font License 1.1',
        text: ofl,
      },
    ],
  },
  {
    title: 'Software',
    credits: [
      { name: 'Capacitor', detail: 'Drifty Co. · MIT', text: capacitorCore },
      { name: 'Capacitor Android', detail: 'Drifty Co. · MIT', text: capacitorAndroid },
      { name: 'Preact Signals', detail: 'Preact Team · MIT', text: signals },
    ],
  },
];
