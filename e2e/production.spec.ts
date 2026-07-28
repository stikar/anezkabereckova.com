import { test, expect, type Locator } from '@playwright/test'

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

test('gallery photos load', async ({ page }) => {
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
      await page.getByRole('button', { name: 'Next slide' }).click()
    }
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
