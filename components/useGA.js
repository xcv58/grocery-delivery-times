import { useEffect } from 'react'
import ReactGA from 'react-ga'

ReactGA.initialize(process.env.GA_TRACKING_ID || '')

const useGA = () => {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search)
  }, [])
}

export default useGA
