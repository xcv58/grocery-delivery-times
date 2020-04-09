import React, { useState } from 'react'
import Router from 'next/router'

export default ({ zip = '' }) => {
  const [value, setZip] = useState(zip)
  const [typing, setTyping] = useState(false)
  return (
    <div className="flex items-center justify-center w-full">
      <input
        className="w-48 px-4 py-2 leading-normal bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:shadow-outline"
        placeholder="zip code"
        id="zip"
        value={typing ? value : zip}
        onChange={(e) => {
          setZip(e.target.value)
        }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            Router.push('/[zip]', `/${value}`)
          }
        }}
        onFocus={() => {
          setZip(zip)
          setTyping(true)
        }}
        onBlur={() => {
          setZip('')
          setTyping(false)
        }}
        name="zip"
        type="text"
        inputMode="numeric"
        pattern="^(\?(^00000(|-0000))|(\d{5}(|-\d{4})))$"
      />
    </div>
  )
}
