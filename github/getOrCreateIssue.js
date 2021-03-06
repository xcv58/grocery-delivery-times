import searchIssue from './searchIssue'
import createIssue from './createIssue'
import { isValidZip } from '../util'
import { ALL_WEBSITES, isValidWebsite } from '../util/websites'

export const getOrCreateIssue = async ({ zip, website }) => {
  const data = await searchIssue({ zip, website })
  if (data) {
    return data
  }
  return createIssue({ zip, website })
}

export default async (req, res) => {
  const { zip, website } = req.query
  if (!isValidZip(zip)) {
    return res.status(400).json({
      error: `Invalid zip code: '${zip}'`,
    })
  }
  if (!isValidWebsite(website)) {
    return res.status(400).json({
      error: `Invalid website: '${website}'`,
    })
  }
  const data = await getOrCreateIssue({ zip, website })
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
  res.json(data)
}
