import { useRouter } from 'next/router'
import ZipInput from '../components/ZipInput'
import Websites from '../components/Websites'
import Website from '../components/Website'
import useGA from '../components/useGA'
import { ALL_WEBSITES } from '../util/websites'
import { isValidZip } from '../util/index'

export default () => {
  useGA()
  const router = useRouter()
  const { zip } = router.query
  if (!isValidZip(zip)) {
    return `Invalid zip code: ${zip}!`
  }
  const sites = ALL_WEBSITES.map((website) => (
    <Website key={website} {...{ website, zip }} />
  ))
  return <Websites {...{ zip }}>{sites}</Websites>
}
