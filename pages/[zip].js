import { useRouter } from 'next/router'
import ZipInput from '../components/ZipInput'
import Costco from '../components/Costco'

export default () => {
  const router = useRouter()
  const { zip } = router.query

  return (
    <div className="flex flex-wrap items-center justify-center p-1">
      <h1 className="w-full text-3xl text-center">Grocery delivery times</h1>
      <ZipInput {...{ zip }} />
      <div>
        <Costco {...{ zip }} />
      </div>
    </div>
  )
}
