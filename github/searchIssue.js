import octokit from './octokit'
import { owner, repo, ALL } from './data'

export default async ({ zip, website = ALL }) => {
  const issuseRes = await octokit.search.issuesAndPullRequests({
    q: `repo:${owner}/${repo}+is:open+is:issue+label:${zip}+label:${website}`,
    sort: 'updated',
  })
  const { total_count, items } = issuseRes.data
  if (total_count > 0) {
    return items[0]
  }
}
