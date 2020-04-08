require('dotenv').config()
const CronJob = require('cron').CronJob
const yargs = require('yargs')
const { notify, isValidZip } = require('./util')
const isProd = process.env.NODE_ENV === 'production'
const costco = require('./costco')
const puppeteer = require(isProd ? 'puppeteer-core' : 'puppeteer')
const chrome = isProd
  ? require('chrome-aws-lambda')
  : {
      headless: process.env.HEADLESS !== 'false',
    }
const log = require('loglevel')
const loglevelMessagePrefix = require('loglevel-message-prefix')

loglevelMessagePrefix(log, {
  prefixes: ['timestamp', 'level'],
  prefixFormat: '%p:',
  options: {
    timestamp: {
      hour12: false,
      locale: 'en-us',
    },
  },
})

const getBrowser = async () => {
  log.debug('init browser')
  const browser = isProd
    ? await puppeteer.launch({
        dumpio: true,
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
      })
    : await puppeteer.launch(chrome)

  return browser
}

const hasEnvForCostco = Boolean(
  process.env.COSTCO_ACCOUNT && process.env.COSTCO_PASSWORD
)

const WEBSITES_HANDLER = {
  costco,
}

const argv = yargs
  .command(
    '$0',
    'Watch grocery websites for delivery time',
    () => {},
    (argv) => {
      const websites = [...new Set(argv.websites)]
      const {
        debug,
        interval,
        zip,
        costco_user,
        costco_password,
        runOnInit,
      } = argv
      if (debug) {
        log.setLevel('DEBUG')
      } else {
        log.setLevel('INFO')
      }
      log.debug('Options:', {
        debug,
        interval,
        zip,
        costco_user,
        costco_password,
        runOnInit,
      })
      if (interval <= 0 || interval > 60 || isNaN(interval)) {
        // TODO: need to translate minutes more than 60 to correct crontab.
        yargs.showHelp()
        log.error(
          `The input interval "${interval}" is invalid, please use interval (minutes) from 1 to 60.`
        )
        return
      }
      if (!isValidZip(zip)) {
        yargs.showHelp()
        log.error(`Invalid zip code: ${zip}.`)
        return
      }
      log.info(
        'watching websites:',
        websites,
        `for zip: "${zip}" on every ${interval} minutes`
      )
      const job = new CronJob(
        `*/${interval} * * * *`,
        async () => {
          try {
            const browser = await getBrowser()
            await Promise.all(
              websites.map((website) =>
                WEBSITES_HANDLER[website](browser, zip, {
                  account: costco_user,
                  password: costco_password,
                })
              )
            )
            await browser.close()
          } catch (e) {
            log.error('Error in cron job:', e)
          }
        },
        null,
        true,
        null,
        null,
        runOnInit
      )
      job.start()
    }
  )
  .option('websites', {
    alias: 'w',
    demandOption: true,
    array: true,
    describe: 'websites to watch',
    default: 'costco',
    choices: ['costco', 'amazon-fresh'],
  })
  .option('interval', {
    alias: 'i',
    demandOption: false,
    number: true,
    describe: 'The check interval in minutes',
    default: 15,
  })
  .option('zip', {
    alias: 'z',
    demandOption: true,
    describe: 'The zip code to watch',
    type: 'string',
  })
  .option('runOnInit', {
    default: false,
    type: 'boolean',
  })
  .option('debug', {
    alias: 'd',
    default: false,
    type: 'boolean',
  })
  .option('costco_user', {
    alias: 'cu',
    type: 'string',
  })
  .option('costco_password', {
    alias: 'cp',
    type: 'string',
  })
  .check(({ costco_password, costco_user, websites }) => {
    if (websites.includes('costco')) {
      if (hasEnvForCostco) {
        return true
      }
      if (!costco_password || !costco_user) {
        throw new Error('You must provide costco user & password!')
      }
    }
    return true
  })
  .help()
  .showHelpOnFail(true).argv
