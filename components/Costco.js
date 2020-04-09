import { useRouter } from 'next/router'
import useSWR from 'swr'
import { timeAgo } from '../util/datetime'
import fetcher from '../util/fetcher'
import Times from './Times'

const Content = ({ zip }) => {
  const { data, error } = useSWR(() => zip && `/api/costco/${zip}`, fetcher)

  if (error)
    return (
      <div className="p-2 font-bold text-red-500">
        {error.message || 'Unable to get data, please try again!'}
      </div>
    )
  if (!data) return <div>Loading...</div>

  const { date, text, screenshot, hasSlot } = data
  return (
    <>
      <Times {...{ date }} />
      <div>{text}</div>
      {screenshot && (
        <img
          src={`data:image/png;base64,${screenshot}`}
          alt="costco screenshot"
        />
      )}
    </>
  )
}

export default (props) => (
  <div className="w-full website">
    <h2 className="text-2xl text-center">Costco</h2>
    <Content {...props} />
  </div>
)
