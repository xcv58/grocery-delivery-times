import log from 'loglevel'
import { WEEE } from '../util/websites'
import { isValidZip, isProd } from '../util/index'
import { getNewPage, click, fillForm } from '../util/browser'

const LINK = 'https://www.sayweee.com/en'

const $closeModalButton = '.weee-portal-zipcode-delivery-modal button'

export default async (browser, zip, { saveScreenshot = false }) => {
  if (!browser || !zip) {
    log.error('Invalid weee calls:', { browser, zip })
  }
  if (!isValidZip(zip)) {
    log.error(`Invalid zip code: "${zip}`)
    throw new Error(`Invalid zip code: "${zip}`)
  }
  log.info(`${WEEE}: check delivery time for zip:`, zip)
  const page = await getNewPage(browser)
  log.debug('Open weee page')
  await page.goto(LINK)
  await fillForm(page, '#zip_code', zip)
  await click(page, 'button#save-btn')
  log.debug('wait for 1 seconds')
  await page.waitFor(1000)
  if (await page.$('#subscribe-email')) {
    const warning = await page.$('form > div.zipcode-warning')
    const text = await warning.evaluate((node) => node.innerText)
    await page.close()
    return {
      hasSlot: false,
      link: LINK,
      text,
    }
  }

  while (true) {
    const tmp = await page.$($closeModalButton)
    if (tmp) {
      break
    }
    log.debug('wait for 1 seconds')
    await page.waitFor(1000)
  }
  await click(page, '.weee-portal-zipcode-delivery-modal button')
  log.debug('wait for 1 seconds')
  await page.waitFor(1000)
  await click(page, '#date_select_header')

  const $modal = '.delivery-date-list-modal .modal-content'
  let tried = 0
  while (tried++ < 3) {
    try {
      log.debug('Wait for selector:', $modal)
      const modal = await page.$($modal)
      if (modal) {
        const screenshot = await modal.screenshot({
          type: 'png',
          encoding: 'base64',
        })
        const allCell = await modal.$$('.date-cell')
        const unavailableCell = await modal.$$('.date-cell.unavailable')
        const hasSlot = allCell.length - unavailableCell.length > 0
        return {
          hasSlot,
          text: hasSlot
            ? 'Found time slot'
            : `No delivery slot available for ${WEEE}.`,
          screenshot,
          link: LINK,
        }
      }
      log.debug('wait for 1 second')
      await page.waitFor(1000)
    } catch (e) {
      log.error(e)
    }
  }

  await page.close()
  throw Error('Timeout on server side')
}
