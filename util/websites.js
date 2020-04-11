export const ALL = 'all'
export const COSTCO = 'costco'
export const PRIME_NOW = 'primenow'

export const ALL_WEBSITES = [COSTCO, PRIME_NOW]

export const isValidWebsite = (website) => {
  if (!website) {
    return true
  }
  return ALL_WEBSITES.includes(website)
}
