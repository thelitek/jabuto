import { expect, test, type Page } from '@playwright/test';

async function open(page: Page) {
  await page.clock.install();
  await page.goto('/');
  await expect(page.locator('html.ready')).toBeAttached();
}

const presetRows = (page: Page) => page.locator('home-screen .list > .row');
const scheduled = (page: Page) =>
  page.evaluate(() =>
    (
      globalThis as unknown as { __jabuto: { scheduledStrikes: { at: number; role: string }[] } }
    ).__jabuto.scheduledStrikes.map((s) => [s.at, s.role]),
  );

test('first launch shows a zero streak and the default preset', async ({ page }) => {
  await open(page);
  await expect(page.locator('.streak-numeral')).toHaveText('0');
  await expect(page.locator('.streak-unit')).toHaveText('days in a row');
  await expect(presetRows(page)).toHaveCount(1);
  await expect(presetRows(page).first()).toContainText('Sit');
  await expect(presetRows(page).first()).toContainText('10:00');
});

test('edits a preset: name, length, warmup and interval bells', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: 'Edit', exact: true }).click();
  await page.getByRole('link', { name: 'Edit Sit' }).click();

  const name = page.getByLabel('Preset name');
  await name.fill('Morning');
  await name.press('Enter');
  await page.getByRole('textbox', { name: 'Length' }).fill('20:00');
  await page.getByRole('textbox', { name: 'Length' }).press('Enter');
  await page.getByRole('button', { name: 'Lengthen warmup by 10 seconds' }).click();

  await page.getByRole('button', { name: 'Add bell' }).click();
  await expect(page.getByLabel('New bell time')).toHaveValue('10:00');
  await page.getByLabel('New bell time').fill('2:30');
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await page.getByRole('button', { name: 'Add bell' }).click();
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await expect(page.getByRole('button', { name: /Remove bell at/ })).toHaveCount(2);
  await page.getByRole('button', { name: 'Remove bell at 02:30' }).click();
  await expect(page.getByRole('button', { name: /Remove bell at/ })).toHaveCount(1);

  await page.getByText('Back').click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(presetRows(page).first()).toContainText('Morning');
  await expect(presetRows(page).first()).toContainText('20:00');

  await page.reload();
  await expect(presetRows(page).first()).toContainText('Morning');
});

test('reorders presets with the keyboard, and Cancel discards the order', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: 'Edit', exact: true }).click();
  await page.getByRole('button', { name: 'New preset' }).click();
  await page.getByLabel('Preset name').fill('Second');
  await page.getByLabel('Preset name').press('Enter');
  await page.getByText('Back').click();

  const order = () => page.locator('home-screen [data-id] .grow').allTextContents();
  await expect.poll(order).toEqual(['Sit', 'Second']);
  await page.getByRole('button', { name: /Move Second/ }).press('ArrowUp');
  await expect.poll(order).toEqual(['Second', 'Sit']);
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(presetRows(page).nth(0)).toContainText('Sit');

  await page.getByRole('button', { name: 'Edit', exact: true }).click();
  await page.getByRole('button', { name: /Move Second/ }).press('ArrowUp');
  await page.getByRole('button', { name: 'Done' }).click();
  await expect(presetRows(page).nth(0)).toContainText('Second');
});

test('a full session: bells, overtime, End, streak', async ({ page }) => {
  await open(page);
  await presetRows(page).first().click();
  await expect(page.locator('session-screen')).toBeVisible();
  await expect(page.getByText('Sitting', { exact: true })).toBeVisible();
  await expect(page.getByRole('timer')).toHaveText('10:00');
  await expect
    .poll(() => scheduled(page))
    .toEqual([
      [0, 'start'],
      [600, 'end'],
      [604, 'end'],
      [608, 'end'],
    ]);

  await page.clock.runFor(4 * 60_000);
  await expect(page.getByRole('timer')).toHaveText('06:00');

  await page.getByRole('button', { name: 'Pause' }).click();
  await expect(page.getByText('Paused', { exact: true })).toBeVisible();
  await page.clock.runFor(60_000);
  await expect(page.getByRole('timer')).toHaveText('06:00');
  await page.getByRole('button', { name: 'Resume' }).click();

  await page.clock.runFor(6 * 60_000 + 134_000);
  await expect(page.getByRole('timer')).toHaveText('+02:14');
  await expect(page.getByRole('button', { name: 'Pause' })).toBeHidden();

  await page.getByRole('button', { name: 'End' }).click();
  await expect(page.locator('home-screen')).toBeVisible();
  await expect(page.locator('.streak-numeral')).toHaveText('1');
  await expect(page.locator('.streak-unit')).toHaveText('day in a row');
});

test('ending early under a minute does not count', async ({ page }) => {
  await open(page);
  await presetRows(page).first().click();
  await expect(page.locator('session-screen')).toBeVisible();
  await page.clock.runFor(30_000);
  await page.getByRole('button', { name: 'End' }).click();
  await expect(page.locator('.streak-numeral')).toHaveText('0');
});

test('overtime ends on its own after 60 minutes', async ({ page }) => {
  await open(page);
  await presetRows(page).first().click();
  await expect(page.locator('session-screen')).toBeVisible();
  await page.clock.fastForward(10 * 60_000 + 60 * 60_000 + 1000);
  await expect(page.locator('home-screen')).toBeVisible();
  await expect(page.locator('.streak-numeral')).toHaveText('1');
});

test('the back gesture asks before ending a session', async ({ page }) => {
  await open(page);
  await presetRows(page).first().click();
  await expect(page.locator('session-screen')).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Keep sitting' }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.locator('session-screen')).toBeVisible();

  await page.goBack();
  await page.getByRole('dialog').getByRole('button', { name: 'End' }).click();
  await expect(page.locator('home-screen')).toBeVisible();
});

test('export and import round-trip, with a confirmation', async ({ page }) => {
  await open(page);
  await page.getByRole('link', { name: 'Setup' }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: /^Export/ }).click();
  const file = await download;
  expect(file.suggestedFilename()).toMatch(/^jabuto-\d{4}-\d{2}-\d{2}\.json$/);
  const text = await (
    await file.createReadStream()
  )
    .toArray()
    .then((c) => Buffer.concat(c).toString());
  const data = JSON.parse(text);
  data.presets[0].name = 'Imported';

  const chooser = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: /^Import/ }).click();
  await (
    await chooser
  ).setFiles({
    name: 'x.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(data)),
  });
  await expect(page.getByText('Replace 1 presets and 0 sessions?')).toBeVisible();
  await page.getByRole('button', { name: 'Replace', exact: true }).click();
  await expect(page.getByText('Imported.')).toBeVisible();

  await page.getByText('Back').click();
  await expect(presetRows(page).first()).toContainText('Imported');
});

test('import rejects a broken file and changes nothing', async ({ page }) => {
  await open(page);
  await page.getByRole('link', { name: 'Setup' }).click();
  const chooser = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: /^Import/ }).click();
  await (
    await chooser
  ).setFiles({ name: 'x.json', mimeType: 'application/json', buffer: Buffer.from('{"nope":1}') });
  await expect(page.getByText(/another app/)).toBeVisible();
});

test('theme setting applies at once', async ({ page }) => {
  await open(page);
  await page.getByRole('link', { name: 'Setup' }).click();
  await page.getByRole('button', { name: 'Dark' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'System' }).click();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.*/);
});
