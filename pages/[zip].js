import { useRouter } from 'next/router'
import ZipInput from '../components/ZipInput'
import Costco from '../components/Costco'
import Websites from '../components/Websites'
import useGA from '../components/useGA'

export default () => {
  const router = useRouter()
  const { zip } = router.query
  useGA()
  return (
    <Websites>
      <Costco {...{ zip }} />
    </Websites>
  )
}
