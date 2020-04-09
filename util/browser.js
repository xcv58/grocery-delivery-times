import puppeteer from 'puppeteer-core'
import chrome from 'chrome-aws-lambda'
import log from 'loglevel'
import { isProd } from './index'

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
