import log from 'loglevel'
import { PRIME_NOW } from '../util/websites'
import { isValidZip, isProd } from '../util/index'
import { getNewPage, click, fillForm } from '../util/browser'

const LINK = 'https://primenow.amazon.com/onboard'

const hasTimeSlot = (text) => !text.includes('No delivery times available')

const $noSlotBanner = '#nawBannerContainer,ul>li>div>div>img[sizes="100vw"]'
const $notAvailable = '#no-availability-message'

export default async (browser, zip, { saveScreenshot = false }) => {
  if (!browser || !zip) {
    log.error('Invalid prime now calls:', { browser, zip })
  }
  if (!isValidZip(zip)) {
    log.error(`Invalid zip code: "${zip}`)
    throw new Error(`Invalid zip code: "${zip}`)
  }
  log.info(`${PRIME_NOW}: check delivery time for zip:`, zip)
  const page = await getNewPage(browser)
  log.debug('Open primenow page')
  await page.goto(LINK)
  await fillForm(page, '#lsPostalCode', zip)
  await click(page, 'input[type="submit"].a-button-input')
  log.debug('wait for 2 seconds')
  await page.waitFor(2000)
  log.debug('check not available element')
  const notAvailable = await page.$($notAvailable)
  if (notAvailable) {
    log.debug('find not available element')
    const text = await notAvailable.evaluate((node) => node.innerText)
    await page.close()
    return {
      hasSlot: false,
      link: LINK,
      text,
    }
  }

  try {
    log.debug('Wait for selector:', $noSlotBanner)
    const noSlot = await page.waitForSelector($noSlotBanner)
    if (noSlot) {
      const screenshot = await noSlot.screenshot({
        type: 'png',
        encoding: 'base64',
      })
      return {
        hasSlot: false,
        text: 'No delivery slot available for prime now.',
        screenshot,
        link: LINK,
      }
    }
    log.debug('wait for 1 second')
    await page.waitFor(1000)
  } catch (e) {
    log.error(e)
  }

  await page.close()
  return {
    hasSlot: false,
    text: 'Found dilvery time slot',
    link: LINK,
  }
}
