require('dotenv').config()
const isProd = process.env.NODE_ENV === 'production'
console.log({ isProd })

const puppeteer = require(isProd ? 'puppeteer-core' : 'puppeteer')
const chrome = isProd ? require('chrome-aws-lambda') : {
    // The costco link doesn't work with headless mode
    headless: false,
}

const ACCOUNT = process.env.COSTCO_ACCOUNT
const PASSWORD = process.env.COSTCO_PASSWORD

const fillForm = async (page, selector, content, BCount = 0) => {
    console.log('Fill form for:', selector)
    const element = await page.waitForSelector(selector)
    for (let i = 0; i < BCount; i++) {
        await element.press('Backspace');
    }
    await element.type(content, { delay: 20 })
}

const click = async (page, selector) => {
    console.log('Click for:', selector)
    await page.waitForSelector(selector)
    const button = await page.$(selector)
    return await button.click()
}

async function init(zip = '14228') {
    console.log('Check delivery time for zip:', zip)
    const browser = await puppeteer.launch(chrome)
    const page = await browser.newPage()
    console.log('Open costco instacart page');
    await page.goto('https://www.costco.com/logon-instacart')
    // console.log('wait for 5 seconds');
    // DEBUG for headless mode
    // await page.waitFor(5000)
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
    const path = `${zip} - ${new Date().toISOString()}.png`
    const popup = await page.waitForSelector('.react-tabs__tab-panel.react-tabs__tab-panel--selected div[data-radium="true"]')

    console.log('Save screenshot');
    await popup.screenshot({ path, type: 'png' })
    await browser.close()
}

init()

