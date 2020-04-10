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
  let className =
    'flex-shrink-0 flex justify-center px-2 py-1 text-sm text-white border-4 rounded disabled:cursor-not-allowed focus:shadow-outline focus:outline-none hover:bg-red-700 hover:border-red-700 disabled:opacity-75 '
  if (hasSlot) {
    className += 'bg-red-500 border-red-500'
  } else {
    className += 'border-red-200 bg-red-200'
  }

  return (
    <>
      <a
        rel="costco website"
        href="http://costco.com"
        target="_blank"
        className={className}
      >
        Shop Now
      </a>
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

export default (props) => {
  return (
    <div className="w-full website">
      <h2 className="text-2xl text-center">Costco</h2>

      <Content {...props} />
    </div>
  )
}
