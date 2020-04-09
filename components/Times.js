import { timeAgo } from '../util/datetime'
import { useEffect } from 'react'
import { useState } from 'react/cjs/react.development'

export default ({ date }) => {
  const [now, setNow] = useState(new Date().toLocaleTimeString())
  useEffect(() => {
    const handle = setInterval(() => {
      setNow(new Date().toLocaleTimeString())
    }, 1000)
  }, [])
  return (
    <div>
      {now}, update {timeAgo.format(new Date(date))}
    </div>
  )
}
