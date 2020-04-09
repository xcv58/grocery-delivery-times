import log from 'loglevel'
import getBrowser from '../../../util/browser'
import { isValidZip, isProd } from '../../../util/index'
import costco from '../../../costco'
import { COSTCO_DATA } from '../../../util/fake_data'

export default async (req, res) => {
  log.setLevel('DEBUG')

  const zip = req.query.zip.toString()
  if (!isValidZip(zip)) {
    return res.status(400).json({
      error: `Invalid zip code: '${zip}'`,
    })
  }
  if (!isProd()) {
    return res.json(COSTCO_DATA)
  }
  const browser = await getBrowser()
  const { screenshot, text, hasSlot } = await costco(browser, zip, {
    saveScreenshot: false,
  })
  await browser.close()
  res.statusCode = 200
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate')
  res.json({
    date: new Date(),
    text,
    zip,
    hasSlot,
    screenshot,
  })
}
