require('dotenv').config()
const isProd = process.env.NODE_ENV === 'production'
console.log({ isProd })

const puppeteer = require(isProd ? 'puppeteer-core' : 'puppeteer')
const chrome = isProd ? require('chrome-aws-lambda') : {
    headless: process.env.HEADLESS !== 'false'
}

const ACCOUNT = process.env.COSTCO_ACCOUNT
const PASSWORD = process.env.COSTCO_PASSWORD

const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4100.3 Safari/537.36'

const fillForm = async (page, selector, content, BCount = 0) => {
    console.log('Try to fill form for:', selector)
    const element = await page.waitForSelector(selector)
    for (let i = 0; i < BCount; i++) {
        await element.press('Backspace');
    }
    await element.type(content, { delay: 20 })
}

const click = async (page, selector) => {
    console.log('Try to click for:', selector)
    await page.waitForSelector(selector)
    const button = await page.$(selector)
    return await button.click()
}

async function getScreenshot(zip = '14228') {
    console.log('Check delivery time for zip:', zip)
    const browser = isProd ? await puppeteer.launch({
        dumpio: true,
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
    }) : await puppeteer.launch(chrome)
    const page = await browser.newPage()
    // Must set the user agent to avoid website denies connection from HeadlessChrome, thanks https://medium.com/@jsoverson/how-to-bypass-access-denied-pages-with-headless-chrome-87ddd5f3413c
    await page.setUserAgent(userAgent)
    console.log('Open costco instacart page');
    await page.goto('https://www.costco.com/logon-instacart')
    // console.log('screnshot page');
    // page.screenshot({ path: 'tmp.png' })
    await fillForm(page, '#logonId', ACCOUNT)
    await fillForm(page, '#logonPassword', PASSWORD)
    await click(page, 'input[value="Sign In"]')

    await click(page, 'div[style="height: 100%; position: relative;"][data-radium="true"] button[data-radium="true"]')
    await click(page, 'div[style="height: 100%; position: relative;"][data-radium="true"] button[data-radium="true"]')
    // await click(page, 'span[title="94103"]')

    await fillForm(page, 'input[name="postal_code"]', zip, 5)
    const submitButton = (await page.$$('.addressPickerModal div button'))[2]
    await submitButton.click()

    await click(page, 'span[title="See delivery times"]')

    console.log('wait for 3 seconds');
    await page.waitFor(3000)
    const path = isProd ? undefined : `${zip} - ${new Date().toISOString()}.png`
    const popup = await page.waitForSelector('.react-tabs__tab-panel.react-tabs__tab-panel--selected div[data-radium="true"]')

    console.log('Save screenshot');
    const file = await popup.screenshot({ path, type: 'png' })
    await browser.close()
    return file
}

// getScreenshot()
module.exports = getScreenshot;
