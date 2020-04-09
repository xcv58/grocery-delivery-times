import React, { useEffect, useState } from 'react'
import { timeAgo } from '../util/datetime'

export default ({ date }) => {
  const [now, setNow] = useState(new Date().toLocaleTimeString())
  useEffect(() => {
    const handle = setInterval(() => {
      setNow(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(handle)
  }, [])
  return (
    <div>
      {now}, update {timeAgo.format(new Date(date))}
    </div>
  )
}
