import octokit from './octokit'
import { owner, repo } from './data'

export default async ({ zip, website = 'all' }) =>
  await octokit.issues.create({
    owner,
    repo,
    title: `${zip} for ${website}`,
    labels: [zip, website],
  })
