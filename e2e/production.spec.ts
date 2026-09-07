import { test, expect, type Locator } from '@playwright/test'

const SITE = process.env.E2E_BASE_URL ?? 'https://anezkabereckova.com'
const HOST = new URL(SITE).hostname

function decoded(img: Locator) {
  return expect
    .poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth), {
      timeout: 30_000,
    })
    .toBeGreaterThan(0)
}

async function scrollThrough(page: import('@playwright/test').Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
    window.scrollTo(0, 0)
  })
}

test('home: name, film hero, Vanity Fair line, no third parties', async ({
  page,
}) => {
  const external: string[] = []
  page.on('request', (req) => {
    const u = new URL(req.url())
    if (u.hostname !== HOST && u.protocol.startsWith('http')) {
      external.push(req.url())
    }
  })
  await page.goto(SITE)
  await expect(
    page.getByRole('heading', { level: 1, name: /Anežka Berecková/i })
  ).toBeVisible()
  await decoded(page.locator('main img').first())
  await scrollThrough(page)
  await expect(page.getByText(/Vanity Fair/).first()).toBeVisible()
  expect(external, 'third-party requests').toEqual([])
  expect(await page.context().cookies(), 'cookies').toEqual([])
})

test('project detail: gallery decodes, LOOK labels present', async ({
  page,
}) => {
  test.setTimeout(120_000)
  await page.goto(`${SITE}/projekty/milano-cortina-2026/`)
  await scrollThrough(page)
  await expect(page.getByText(/LOOK 01 \/ \d+/).first()).toBeVisible()

  const imgs = page.locator('main img')
  const count = await imgs.count()
  expect(count).toBeGreaterThan(10)
  let checked = 0
  for (let i = 0; i < count && checked < 12; i++) {
    const box = await imgs.nth(i).boundingBox()
    if (!box || box.width < 1 || box.height < 1) continue
    await imgs.nth(i).scrollIntoViewIfNeeded()
    await decoded(imgs.nth(i))
    checked++
  }
  expect(checked).toBeGreaterThan(5)
})

test('look URL opens story mode and closes back to the project', async ({
  page,
}) => {
  await page.goto(`${SITE}/projekty/new-breath-ss22/look-03/`)
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText(/03 \/ \d+/)).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  expect(new URL(page.url()).pathname).toBe('/projekty/new-breath-ss22/')
})

test('pages fit the viewport', async ({ page }) => {
  for (const path of [
    '/',
    '/projekty/',
    '/o-mne/',
    '/press/',
    '/kontakt/',
    '/en/',
  ]) {
    await page.goto(`${SITE}${path}`)
    await scrollThrough(page)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    )
    expect(overflow, `${path} scrolls horizontally`).toBeLessThanOrEqual(1)
  }
})

test('contact and language mirror', async ({ page }) => {
  await page.goto(`${SITE}/kontakt/`)
  await expect(
    page.getByRole('link', { name: /contact@anezkabereckova\.com/i }).first()
  ).toBeVisible()

  await page.goto(`${SITE}/en/about/`)
  expect(await page.evaluate(() => document.documentElement.lang)).toBe('en')
  await expect(page.locator('link[hreflang="cs"]')).toHaveAttribute(
    'href',
    /\/o-mne\/?$/
  )
})

test('404 shows the ghost look', async ({ page }) => {
  const res = await page.goto(`${SITE}/tenhle-look-neexistuje/`)
  expect(res?.status()).toBe(404)
  await expect(page.getByText(/JEŠTĚ NEEXISTUJE/)).toBeVisible()
})
