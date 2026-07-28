import { test, expect, type Locator, type Page } from '@playwright/test'

const SITE = 'https://anezkabereckova.com'

// A broken <img> is still "visible" to Playwright — naturalWidth is the only
// honest signal that the browser actually got pixels back. Generous timeout:
// full-size photos come from Supabase storage with a cold CDN cache.
function decoded(img: Locator) {
  return expect
    .poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth), {
      timeout: 30_000,
    })
    .toBeGreaterThan(0)
}

// The lightbox arrows are hidden on phones, so mobile has to swipe — that is
// the only way through the gallery there, and worth exercising for real.
async function nextSlide(page: Page, isMobile: boolean) {
  if (!isMobile) {
    await page.getByRole('button', { name: 'Next slide' }).click()
    return
  }

  const box = (await page.getByRole('dialog').boundingBox())!
  const y = box.y + box.height / 2
  await page.mouse.move(box.x + box.width * 0.8, y)
  await page.mouse.down()
  for (let i = 8; i >= 2; i--) {
    await page.mouse.move(box.x + box.width * (i / 10), y, { steps: 2 })
  }
  await page.mouse.up()
}

test('gallery photos load', async ({ page, isMobile }) => {
  test.setTimeout(180_000)

  await page.goto(SITE)

  // Gallery is fetched client-side from Supabase, so wait for a real thumbnail
  // instead of the loading skeleton / "No images in gallery yet" fallback.
  const thumbs = page.locator('main button img')
  await expect(thumbs.first()).toBeVisible()

  const count = await thumbs.count()
  expect(count).toBeGreaterThan(0)

  for (let i = 0; i < count; i++) {
    await decoded(thumbs.nth(i))
  }

  // Thumbnails and full-size images are different files behind different
  // transforms — a working grid says nothing about the lightbox.
  await page.locator('main button').first().click()

  const lightbox = page.getByRole('dialog')
  const counter = lightbox.getByText(/^\d+ \/ \d+$/)
  await expect(counter).toHaveText(`1 / ${count}`)

  // Slides render in image order, so nth(i) is the one the counter points at.
  const slides = lightbox.locator('img')
  for (let i = 0; i < count; i++) {
    await expect(counter).toHaveText(`${i + 1} / ${count}`)
    await decoded(slides.nth(i))
    if (i < count - 1) {
      await nextSlide(page, isMobile)
    }
  }

  await page.getByLabel('Close lightbox').click()
  await expect(lightbox).toBeHidden()
})

test('theme toggle switches and persists', async ({ page }) => {
  await page.goto(SITE)

  // getByLabel matches the aria-label, which only the mounted (interactive)
  // toggle has — the pre-hydration placeholder is ignored.
  const toggle = page.getByLabel('Toggle theme')
  await expect(toggle).toBeVisible()

  // next-themes with attribute="class" puts the theme on <html>.
  const isDark = () =>
    page.evaluate(() => document.documentElement.classList.contains('dark'))

  const started = await isDark()

  for (const expected of [!started, started]) {
    await toggle.click()
    await expect.poll(isDark).toBe(expected)

    await page.reload()
    await expect(toggle).toBeVisible()
    expect(await isDark(), 'theme did not survive a reload').toBe(expected)
  }
})

// The layout is responsive, so the failure worth catching is a stray element
// pushing the page wider than the viewport — invisible on desktop, obvious and
// ugly on a phone.
test('pages fit the viewport', async ({ page }) => {
  for (const path of ['/', '/contact']) {
    await page.goto(`${SITE}${path}`)
    await page.locator('main img').first().waitFor()

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    )
    expect(overflow, `${path} scrolls horizontally`).toBeLessThanOrEqual(1)
  }
})

test('contact page loads', async ({ page }) => {
  await page.goto(`${SITE}/contact`)

  await expect(
    page.getByRole('heading', { name: 'Anežka Berecková' })
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'contact@anezkabereckova.com' })
  ).toBeVisible()
  await decoded(page.getByAltText('Anežka Berecková'))
})
