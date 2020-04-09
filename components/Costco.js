import { useRouter } from 'next/router'
import useSWR from 'swr'
import { timeAgo } from '../util/datetime'
import fetcher from '../util/fetcher'
import Times from './Times'

export default ({ zip }) => {
  const { data, error } = useSWR(() => zip && `/api/costco/${zip}`, fetcher)

  if (error) return <div>{error.message}</div>
  if (!data) return <div>Loading...</div>

  const { date, text, screenshot, hasSlot } = data
  return (
    <div className="w-full">
      <h2>Costco</h2>
      <Times {...{ date }} />
      <div>{text}</div>
      {screenshot && (
        <img
          src={`data:image/png;base64,${screenshot}`}
          alt="costco screenshot"
        />
      )}
    </div>
  )
}
