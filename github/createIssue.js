import octokit from './octokit'
import { owner, repo, ALL } from './data'

export default async ({ zip, website = ALL }) =>
  await octokit.issues.create({
    owner,
    repo,
    title: `${zip} for ${website}`,
    labels: [zip, website],
  })
