import log from 'loglevel'
import octokit from './octokit'
import { owner, repo, ALL } from './data'
import { getOrCreateIssue } from './getOrCreateIssue'

export default async ({ zip, website = ALL }, data) => {
  log.setLevel('DEBUG')
  if (!data.hasSlot) {
    return
  }
  const issue = await getOrCreateIssue({ zip, website })
  const { number } = issue
  const now = new Date()
  const since = new Date(now.getTime() - 30 * 60 * 1000).toISOString()
  const issues = await octokit.issues.listComments({
    owner,
    repo,
    issue_number: number,
    since,
  })
  log.debug('Find issues:', issues)
  if (issues && issues.length) {
    log.debug('The issue has been updated recently, skip update!')
    return
  }
  const { link, text } = data
  await octokit.issues.createComment({
    owner,
    repo,
    issue_number: number,
    body: `Found available time for zip: '${zip}' on ${website} website:

${text}

The URL: ${link} `,
  })
}
