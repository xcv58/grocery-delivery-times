import octokit from './octokit'
import { owner, repo } from './data'
import { ALL } from '../util/websites'

export default async ({ zip, website = ALL }) => {
  const res = await octokit.issues.create({
    owner,
    repo,
    title: `${zip} for ${website}`,
    labels: [zip, website],
    body: `Please click the Subscribe button on the right bottom to get notification.\nThe bot will comment on the issue when there is time slot for ${zip}.`,
  })
  if (res) {
    return res.data
  }
}
