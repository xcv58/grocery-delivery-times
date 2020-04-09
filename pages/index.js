export default () => {
  return (
    <div className="flex flex-wrap items-center justify-center p-1">
      <h1 className="w-full text-3xl text-center">Grocery delivery times</h1>
      <div>
        <input
          className="w-48 px-4 py-2 leading-normal bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:shadow-outline"
          placeholder="zip code"
          id="zip"
          name="zip"
          type="text"
          inputmode="numeric"
          pattern="^(?(^00000(|-0000))|(\d{5}(|-\d{4})))$"
        />
      </div>
    </div>
  )
}
