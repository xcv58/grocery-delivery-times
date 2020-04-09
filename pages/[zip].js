import { useRouter } from 'next/router'
import ZipInput from '../components/ZipInput'
import Costco from '../components/Costco'
import Websites from '../components/Websites'

export default () => {
  const router = useRouter()
  const { zip } = router.query

  return (
    <Websites>
      <Costco {...{ zip }} />
    </Websites>
  )
}
