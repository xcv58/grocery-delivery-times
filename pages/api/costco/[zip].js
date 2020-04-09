import log from 'loglevel'
import getBrowser from '../../../util/browser'
import { isValidZip, isProd } from '../../../util/index'
import costco from '../../../costco'

export default async (req, res) => {
  log.setLevel('DEBUG')

  const zip = req.query.zip.toString()
  if (!isValidZip(zip)) {
    return res.status(400).json({
      error: `Invalid zip code: '${zip}'`,
    })
  }
  if (!isProd()) {
    return res.json({
      date: '2020-04-09T05:06:34.116Z',
      text:
        'No delivery times available\n\nRight now, all shoppers are busy and working hard to get to every order. Please check back later to see if deliveries are available.',
      zip: '10024',
      hasSlot: false,
    })
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
