const { userAgent, fillForm, click, getNewPage } = require('./util')

const ACCOUNT = process.env.COSTCO_ACCOUNT
const PASSWORD = process.env.COSTCO_PASSWORD

const $postalCodeInput = 'input[name="postal_code"]'
const $seeTimes = 'span[title="See delivery times"]'
const hasTimeSlot = (text) => !text.includes('No delivery times available')

async function costco(browser, zip) {
  if (!browser || !zip) {
    console.log('Invalid costco calls:', { browser, zip })
  }
  console.log('Check Costco delivery time for zip:', zip)
  const page = await getNewPage(browser)
  console.log('Open costco instacart page');
  await page.goto('https://www.costco.com/logon-instacart')
  await fillForm(page, '#logonId', ACCOUNT)
  await fillForm(page, '#logonPassword', PASSWORD)
  await click(page, 'input[value="Sign In"]')

  while (true) {
    await click(page, 'div[style="height: 100%; position: relative;"][data-radium="true"] button[data-radium="true"]')
    const postalCodeInput =  await page.$($postalCodeInput)
    if (postalCodeInput) {
      break
    }
    await page.waitFor(1000)
  }

  await fillForm(page, $postalCodeInput, zip, 5)
  const submitButton = (await page.$$('.addressPickerModal div button'))[2]
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
    console.log('wait 1 second')
    await page.waitFor(1000)
    text = await popup.evaluate(node => node.innerText)
  }
  console.log({ text });
  console.log('Save screenshot');
  const file = await popup.screenshot({ path, type: 'png' })
  await page.close()
  return {
    hasSlot: hasTimeSlot(text),
    text,
    file
  }
}

module.exports = costco
