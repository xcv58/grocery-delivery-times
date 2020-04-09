export const isProd = () => process.env.NODE_ENV === 'production'

const zipCodePattern = /^\d{5}$|^\d{5}-\d{4}$/

export const isValidZip = (zip) => Boolean(zipCodePattern.test(zip))
