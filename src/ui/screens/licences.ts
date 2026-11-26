import { backLink, h, header, label, Screen } from '../dom';
import { CREDITS } from '../licences';

export class LicencesScreen extends Screen {
  protected render() {
    return [
      header(backLink({ name: 'setup' })),
      h('section', { class: 'title-block' }, h('h1', { class: 'title', text: 'Licences' })),
      ...CREDITS.map((group) =>
        h(
          'section',
          { class: 'block' },
          label(group.title),
          h(
            'div',
            { class: 'list ruled' },
            ...group.credits.map((c) => {
              const summary = h(
                'summary',
                { class: 'row row-tall' },
                h(
                  'span',
                  { class: 'stack' },
                  h('span', { class: 'row-title small-title', text: c.name }),
                  h('span', { class: 'hint', text: c.detail }),
                ),
              );
              return c.text
                ? h(
                    'details',
                    { class: 'credit' },
                    summary,
                    h('pre', { class: 'licence-text', text: c.text }),
                  )
                : h(
                    'div',
                    { class: 'row row-tall' },
                    h(
                      'span',
                      { class: 'stack' },
                      h('span', { class: 'row-title small-title', text: c.name }),
                      h('span', { class: 'hint', text: c.detail }),
                    ),
                  );
            }),
          ),
        ),
      ),
    ];
  }
}
