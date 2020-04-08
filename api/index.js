const { parse } = require('url')
const log = require('loglevel')
const puppeteer = require('puppeteer-core')
const chrome = require('chrome-aws-lambda')
const costco = require('../costco')

module.exports = async function (req, res) {
  log.setLevel('DEBUG')
  const browser = await puppeteer.launch({
    dumpio: true,
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
  })
  const { pathname = '/' } = parse(req.url, true)
  let zip = pathname.slice(1)
  const { file, text, hasSlot } = await costco(browser, zip, {
    saveScreenshot: false,
  })
  res.statusCode = 200
  res.setHeader('Content-Type', `application/json`)
  res.setHeader('Cache-Control', 'max-age=600, immutable')
  res.end({
    date: new Date(),
    text,
    file,
    hasSlot,
  })
}
