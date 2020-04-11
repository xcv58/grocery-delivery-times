import puppeteer from 'puppeteer-core'
import chrome from 'chrome-aws-lambda'
import log from 'loglevel'
import { isProd } from './index'

const userAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4100.3 Safari/537.36'

export const getNewPage = async (browser) => {
  const page = await browser.newPage()
  // Must set the user agent to avoid website denies connection from HeadlessChrome, thanks https://medium.com/@jsoverson/how-to-bypass-access-denied-pages-with-headless-chrome-87ddd5f3413c
  await page.setUserAgent(userAgent)
  return page
}

export const fillForm = async (page, selector, content, BCount = 0) => {
  log.debug('Wait for selector:', selector)
  const element = await page.waitForSelector(selector)
  log.debug('Type in this selector:', selector)
  for (let i = 0; i < BCount; i++) {
    await element.press('Backspace')
  }
  await element.type(content)
}

export const click = async (page, selector) => {
  log.debug('Wait for selector:', selector)
  const button = await page.waitForSelector(selector)
  log.debug('Click:', selector)
  return await button.click()
}

export default async () => {
  if (isProd()) {
    log.debug('launch browser on prod')
    const browser = await puppeteer.launch({
      dumpio: true,
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    })
    return browser
  }
  log.debug('launch browser during development')
  const fullPuppeteer = require('puppeteer')
  return await fullPuppeteer.launch({
    headless: false,
  })
}
