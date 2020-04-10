import searchIssue from './searchIssue'
import createIssue from './createIssue'

export const getOrCreateIssue = async ({ zip, website }) => {
  const data = await searchIssue({ zip, website })
  if (data) {
    return data
  }
  return createIssue({ zip, website })
}

export default async (req, res) => {
  const { zip, website } = req.query
  const data = await getOrCreateIssue({ zip, website })
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
  res.json(data)
}
