require('dotenv').config()
const { notify } = require('./util')
const isProd = process.env.NODE_ENV === 'production'
const costco = require('./costco');
const puppeteer = require(isProd ? 'puppeteer-core' : 'puppeteer')
const chrome = isProd ? require('chrome-aws-lambda') : {
  headless: process.env.HEADLESS !== 'false'
}

const log = require('loglevel')

if (isProd) {
  log.setLevel('INFO')
} else {
  log.setLevel('DEBUG')
}

const init = async () => {
  log.debug('init browser');
  const browser = isProd ? await puppeteer.launch({
    dumpio: true,
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
  }) : await puppeteer.launch(chrome)

  const costcoRes = await costco(browser, '94102')
  log.info(costcoRes);
  if (costcoRes.hasSlot) {
    notify(costcoRes)
  }
  await browser.close()
}

init()
