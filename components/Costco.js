import clsx from 'clsx'
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

  const { date, text, link, screenshot, hasSlot } = data

  return (
    <>
      <a
        rel="costco website"
        href={link}
        target="_blank"
        className={clsx(
          'flex justify-center p-2 text-sm text-white border-0 rounded focus:shadow-outline focus:outline-none',
          hasSlot
            ? 'bg-red-500 hover:bg-red-700'
            : 'bg-red-300 hover:bg-red-500 line-through'
        )}
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
