import clsx from 'clsx'
import useSWR from 'swr'
import { timeAgo } from '../util/datetime'
import fetcher from '../util/fetcher'
import Times from './Times'
import SubscribeLink from './SubscribeLink'
import { PRIME_NOW } from '../util/websites'

const SITE_NAME_MAP = {
  [PRIME_NOW]: 'Prime Now',
}

const Content = ({ website, zip }) => {
  const { data, error, isValidating } = useSWR(
    () => zip && `/api/${website}/${zip}`,
    fetcher
  )

  if (error)
    return (
      <div className="p-2 font-bold text-red-500">
        {error.message || 'Unable to get data, please try again!'}
      </div>
    )
  if (!data)
    return (
      <div className="flex flex-col items-center w-full p-1 m-1 website">
        <div className="la-ball-spin-clockwise la-dark la-3x">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div>
          <h3 className="p-8 text-1xl">
            Checking time slots for {website}, may take up to 60 seconds...
          </h3>
        </div>
      </div>
    )

  const { date, text, link, screenshot, hasSlot } = data

  return (
    <>
      <a
        href={link}
        rel="noreferrer noopener"
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
      <Times {...{ date, isValidating }} />
      <div>{text}</div>
      {screenshot && (
        <img
          src={`data:image/png;base64,${screenshot}`}
          alt={`${website} screenshot`}
        />
      )}
    </>
  )
}

export default (props) => {
  const { zip, website } = props
  return (
    <div className="w-full p-1 m-1 website">
      <div className="relative flex items-center justify-center w-full h-12">
        <h2 className="w-full text-2xl text-center capitalize">
          {SITE_NAME_MAP[website] || website}
        </h2>
        <div className="absolute right-0 inline-block">
          <SubscribeLink {...{ zip, website }} />
        </div>
      </div>
      <Content {...props} />
    </div>
  )
}
