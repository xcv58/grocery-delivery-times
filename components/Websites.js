import SubscribeLink from './SubscribeLink'

export default ({ children, zip }) => {
  return (
    <div className="flex flex-wrap justify-center w-full mx-4">
      {zip && (
        <>
          <div className="flex items-center justify-center w-full">
            <p className="p-2 m-2">
              Tracking grocery delivery websites for zip: {zip}.
            </p>
            {/* <SubscribeLink {...{ zip }} /> */}
          </div>
          <hr className="w-full my-2 border border-gray-300" />
        </>
      )}
      {children}
    </div>
  )
}
