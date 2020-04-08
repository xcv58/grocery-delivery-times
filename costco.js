const log = require('loglevel')
const { userAgent, fillForm, click, getNewPage, notify } = require('./util')

const ACCOUNT = process.env.COSTCO_ACCOUNT
const PASSWORD = process.env.COSTCO_PASSWORD

const COSTCO_LINK = 'https://www.costco.com/logon-instacart'

const $postalCodeInput = 'input[name="postal_code"]'
const $seeTimes = 'span[title="See delivery times"]'
const $postalCodeSubmit = '.addressPickerModal div button'

const hasTimeSlot = (text) => !text.includes('No delivery times available')

async function costco(browser, zip) {
  if (!browser || !zip) {
    log.error('Invalid costco calls:', { browser, zip })
  }
  log.info('Check Costco delivery time for zip:', zip)
  const page = await getNewPage(browser)
  log.debug('Open costco instacart page');
  await page.goto(COSTCO_LINK)
  await fillForm(page, '#logonId', ACCOUNT)
  await fillForm(page, '#logonPassword', PASSWORD)
  await click(page, 'input[value="Sign In"]')

  while (true) {
    await click(page, 'div[style="height: 100%; position: relative;"][data-radium="true"] button[data-radium="true"]')
    const postalCodeInput =  await page.$($postalCodeInput)
    const buttons = await page.$$($postalCodeSubmit)
    if (postalCodeInput && buttons && buttons.length === 3) {
      break
    }
    await page.waitFor(1000)
  }

  await fillForm(page, $postalCodeInput, zip, 5)
  const submitButton = (await page.$$($postalCodeSubmit))[2]
  await submitButton.click()

  await page.waitFor(1000)

  while (!(await page.$($seeTimes))) {
    await page.reload()
    await page.waitFor(1000)
  }

  await click(page, $seeTimes)

  const path = `${zip} - ${new Date().toISOString()}.png`
  const popup = await page.waitForSelector('.react-tabs__tab-panel.react-tabs__tab-panel--selected > .module-renderer')
  let text = await popup.evaluate(node => node.innerText)
  while (text === '') {
    log.debug('wait 1 second')
    await page.waitFor(1000)
    text = await popup.evaluate(node => node.innerText)
  }
  log.debug({ text });
  log.debug('Save screenshot');
  const file = await popup.screenshot({ path, type: 'png' })
  await page.close()
  if (hasTimeSlot(text)) {
    notify({
      title: `Found Costco Delivery Times`,
      message: `Found Costco time slot for ${zip}, click to open Costco delivery website`,
      open: COSTCO_LINK,
    })
  }
  return { hasSlot, text }
}

module.exports = costco
