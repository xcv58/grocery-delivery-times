import log from 'loglevel'
import getBrowser from '../../../util/browser'
import { isValidZip } from '../../../util/index'
import costco from '../../../costco'

export default async (req, res) => {
  log.setLevel('DEBUG')

  const zip = req.query.zip.toString()
  if (!isValidZip(zip)) {
    return res.status(400).json({
      error: `Invalid zip code: '${zip}'`,
    })
  }
  const browser = await getBrowser()
  const { file, text, hasSlot } = await costco(browser, zip, {
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
  })
}
