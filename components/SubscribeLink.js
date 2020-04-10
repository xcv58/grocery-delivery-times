import useSWR from 'swr'
import fetcher from '../util/fetcher'
import Octicon, { Bell, Unmute } from '@primer/octicons-react'

export default ({ zip, website }) => {
  const { data, error } = useSWR(() => {
    if (!zip) {
      return
    }
    if (website) {
      return `/api/github/${zip}/${website}`
    } else {
      return `/api/github/${zip}`
    }
  }, fetcher)

  const className =
    'flex items-center justify-center px-2 py-1 mx-2 my-1 text-black bg-gray-200 border-0 rounded shadow-md hover:bg-gray-400 focus:outline-none focus:shadow-outline'
  if (error || !data) {
    return null
  }
  const { html_url, number } = data
  return (
    <a
      rel="noopener noreferrer"
      target="_blank"
      href={html_url}
      className={className}
    >
      <Octicon icon={Unmute} className="mr-3" /> Subscribe
    </a>
  )
}
