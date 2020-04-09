import { useRouter } from 'next/router'
import ZipInput from '../components/ZipInput'
import Costco from '../components/Costco'

export default () => {
  const router = useRouter()
  const { zip } = router.query

  return (
    <div>
      <Costco {...{ zip }} />
    </div>
  )
}
