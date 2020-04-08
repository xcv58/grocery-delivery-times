require('dotenv').config()
const isProd = process.env.NODE_ENV === 'production'
const costco = require('./costco');
const puppeteer = require(isProd ? 'puppeteer-core' : 'puppeteer')
const chrome = isProd ? require('chrome-aws-lambda') : {
  headless: process.env.HEADLESS !== 'false'
}

const init = async () => {
  console.log('init browser');
  const browser = isProd ? await puppeteer.launch({
    dumpio: true,
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
  }) : await puppeteer.launch(chrome)

  const costcoRes = await costco(browser, '94102')
  console.log(costcoRes);
  await browser.close()
}

init()
