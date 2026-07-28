import { test, expect, type Locator } from '@playwright/test'

const SITE = 'https://anezkabereckova.com'

// A broken <img> is still "visible" to Playwright — naturalWidth is the only
// honest signal that the browser actually got pixels back.
function decodedWidth(img: Locator) {
  return expect
    .poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth), {
      timeout: 15_000,
    })
    .toBeGreaterThan(0)
}

test('gallery photos load', async ({ page }) => {
  await page.goto(SITE)

  // Gallery is fetched client-side from Supabase, so wait for a real thumbnail
  // instead of the loading skeleton / "No images in gallery yet" fallback.
  const firstPhoto = page.locator('main img').first()
  await expect(firstPhoto).toBeVisible()
  await decodedWidth(firstPhoto)
})

test('contact page loads', async ({ page }) => {
  await page.goto(`${SITE}/contact`)

  await expect(
    page.getByRole('heading', { name: 'Anežka Berecková' })
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'contact@anezkabereckova.com' })
  ).toBeVisible()
  await decodedWidth(page.getByAltText('Anežka Berecková'))
})
