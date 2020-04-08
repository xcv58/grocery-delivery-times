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
  const zip = pathname.split('/').pop()
  const { file, text, hasSlot } = await costco(browser, zip, {
    saveScreenshot: false,
  })
  res.statusCode = 200
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate')
  res.json({
    date: new Date().toISOString(),
    file,
    text,
    hasSlot,
  })
}
