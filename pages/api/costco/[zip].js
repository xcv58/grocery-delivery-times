import log from 'loglevel'
import getBrowser from '../../../util/browser'
import { isValidZip, isProd } from '../../../util/index'
import costco from '../../../vendors/costco'
import { FAKE_DATA } from '../../../util/fake_data'
import updateIssue from '../../../github/updateIssue'

export default async (req, res) => {
  log.setLevel('DEBUG')

  const zip = req.query.zip.toString()
  if (!isValidZip(zip)) {
    return res.status(400).json({
      error: `Invalid zip code: '${zip}'`,
    })
  }
  if (!isProd()) {
    return res.json(FAKE_DATA)
  }
  const browser = await getBrowser()
  const data = await costco(browser, zip, {
    saveScreenshot: false,
  })
  const { screenshot, text, link, hasSlot } = data
  await browser.close()
  if (hasSlot) {
    await Promise.all([
      updateIssue({ zip, website: 'costco' }, data),
      updateIssue({ zip }, data),
    ])
  }
  res.statusCode = 200
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate')
  res.json({
    date: new Date(),
    text,
    link,
    zip,
    hasSlot,
    screenshot,
  })
}
