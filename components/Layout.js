import Header from './Header'

export default ({ children }) => {
  return (
    <div className="flex flex-wrap items-center justify-center p-1">
      <Header />
      {children}
    </div>
  )
}
