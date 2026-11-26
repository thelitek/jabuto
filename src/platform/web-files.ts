import type { Files } from './types';

export const webFiles: Files = {
  async save(name, text) {
    const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  },

  open() {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json,.json';
      input.addEventListener('change', async () => {
        const file = input.files?.[0];
        resolve(file ? await file.text() : null);
      });
      input.addEventListener('cancel', () => resolve(null));
      input.click();
    });
  },
};
