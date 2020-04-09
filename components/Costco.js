import { useRouter } from 'next/router'
import useSWR from 'swr'
import { timeAgo } from '../util/datetime'
import fetcher from '../util/fetcher'

export default ({ zip }) => {
  const { data, error } = useSWR(() => zip && `/api/costco/${zip}`, fetcher)

  if (error) return <div>{error.message}</div>
  if (!data) return <div>Loading...</div>

  const { date, text, hasSlot } = data
  return (
    <div className="w-64">
      <h2>Costco</h2>
      <div>Update {timeAgo.format(new Date(date))}</div>
      <div>{text}</div>
    </div>
  )
}
