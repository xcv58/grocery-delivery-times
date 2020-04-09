const notifier = require('node-notifier')
const log = require('loglevel')

const userAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4100.3 Safari/537.36'

const fillForm = async (page, selector, content, BCount = 0) => {
  log.debug('Wait for selector:', selector)
  const element = await page.waitForSelector(selector)
  log.debug('Type in this selector:', selector)
  for (let i = 0; i < BCount; i++) {
    await element.press('Backspace')
  }
  await element.type(content)
}

const click = async (page, selector) => {
  log.debug('Wait for selector:', selector)
  const button = await page.waitForSelector(selector)
  log.debug('Click:', selector)
  return await button.click()
}

const getNewPage = async (browser) => {
  const page = await browser.newPage()
  // Must set the user agent to avoid website denies connection from HeadlessChrome, thanks https://medium.com/@jsoverson/how-to-bypass-access-denied-pages-with-headless-chrome-87ddd5f3413c
  await page.setUserAgent(userAgent)
  return page
}

const notify = ({ title, message, open }) => {
  notifier.notify({
    title,
    message,
    open,
    sound: true,
    timeout: false,
  })
}

const getDateTime = () => new Date().toLocaleString()

const zipCodePattern = /^\d{5}$|^\d{5}-\d{4}$/

const isValidZip = (zip) => Boolean(zipCodePattern.test(zip))

module.exports = {
  notify,
  fillForm,
  click,
  getNewPage,
  getDateTime,
  isValidZip,
}
