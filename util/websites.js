export const ALL = 'all'
export const COSTCO = 'costco'

export const ALL_WEBSITES = [COSTCO]

export const isValidWebsite = (website) => {
  if (!website) {
    return true
  }
  return ALL_WEBSITES.includes(website)
}
