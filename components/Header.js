import { useRouter } from 'next/router'
import ZipInput from './ZipInput'

export default () => {
  const router = useRouter()
  const { zip = '' } = router.query
  return (
    <>
      <h1 className="w-full text-3xl text-center">Grocery delivery times</h1>
      <ZipInput {...{ zip }} />
    </>
  )
}
