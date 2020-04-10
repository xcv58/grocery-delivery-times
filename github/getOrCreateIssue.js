import searchIssue from './searchIssue'
import createIssue from './createIssue'

export default async (req, res) => {
  const { zip, website } = req.query
  const data = await searchIssue({ zip, website })
  if (data) {
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
    res.json(data)
  } else {
    const issue = await createIssue({ zip, website })
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
    res.json(issue)
  }
}
