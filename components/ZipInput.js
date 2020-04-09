import React, { useState } from 'react'
import Router from 'next/router'

export default ({ zip = '' }) => {
  const [value, setZip] = useState(zip)
  const [typed, setTyped] = useState(false)
  return (
    <form
      className="w-full mx-auto"
      onSubmit={(e) => {
        e.preventDefault()
        if (value) {
          Router.push('/[zip]', `/${value}`)
        } else {
          Router.push('/')
        }
      }}
    >
      <div className="flex items-center max-w-sm py-2 mx-auto border-b-2 border-gray-400 focus-within:border-blue-500 hover:border-blue-300">
        <input
          className="w-full px-2 py-1 mr-3 leading-tight text-gray-700 bg-transparent border-none appearance-none focus:outline-none"
          placeholder="Zip code"
          id="zip"
          value={typed ? value : zip}
          onChange={(e) => {
            setZip(e.target.value)
          }}
          onFocus={() => {
            if (!typed) {
              setTyped(true)
              if (!value) {
                setZip(zip)
              }
            }
          }}
          name="zip"
          type="text"
          inputMode="numeric"
          pattern="^(\?(^00000(|-0000))|(\d{5}(|-\d{4})))$"
        />
        <input
          type="submit"
          value="Submit"
          className="flex-shrink-0 px-2 py-1 text-sm text-white bg-blue-500 border-4 border-blue-500 rounded focus:shadow-outline focus:outline-none hover:bg-blue-700 hover:border-blue-700"
        />
      </div>
    </form>
  )
}
