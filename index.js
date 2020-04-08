require('dotenv').config()
const CronJob = require('cron').CronJob
const yargs = require('yargs')
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

const getBrowser = async () => {
  log.debug('init browser');
  const browser = isProd ? await puppeteer.launch({
    dumpio: true,
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
  }) : await puppeteer.launch(chrome)

  return browser
}

const WEBSITES_HANDLER = {
  costco
}

const zipCodePattern = /^\d{5}$|^\d{5}-\d{4}$/;

const argv = yargs
.command('$0', 'watch the websites', () => {}, (argv) => {
  const websites = [...new Set(argv.websites)]
  const { debug, interval, zip } = argv
  if (interval <= 0 || interval > 500) {
    log.error(`The input interval "${interval}" is invalid, please use interval (minutes) from 1 to 500.`)
    return
  }
  if (!zipCodePattern.test(zip)) {
    log.error(`Invalid zip code: ${zip}.`)
    return
  }
  if (debug) {
    log.setLevel('DEBUG')
  } else {
    log.setLevel('INFO')
  }
  log.info('watching websites:', websites, `for zip: "${zip}" on every ${interval} minutes`);
  const job = new CronJob(`*/${interval} * * * *`, async () => {
    try {
      const browser = await getBrowser()
      await Promise.all(websites.map((website) => WEBSITES_HANDLER[website](browser, zip)))
      await browser.close()
    } catch (e) {
      log.error('Error in cron job:', e)
    }
  }, null, true)
  job.start()
})
.option('websites', {
  alias: 'w',
  demandOption: true,
  array: true,
  describe: 'websites to watch',
  default: 'costco',
  choices: [
    'costco',
    'amazon-fresh'
  ]
})
.option('interval', {
  alias: 'i',
  demandOption: false,
  number: true,
  describe: 'The check interval in minutes',
  default: 15
})
.option('zip', {
  alias: 'z',
  demandOption: true,
  describe: 'The zip code to watch',
  type: 'string'
})
.option('debug', {
  alias: 'd',
  default: false,
  type: 'boolean'
})
.help('help')
.help('h')
.showHelpOnFail(true)
.argv
