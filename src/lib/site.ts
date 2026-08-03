export const siteName = "Recs."

export const siteTitle = "Recs. — Movies, series & anime"

export const siteDescription =
  "A personal catalogue of movies, series, and anime with ratings, recommendations, and streaming availability."

const localUrl = "http://localhost:3000"

function withProtocol(value: string) {
  return /^https?:\/\//.test(value) ? value : `https://${value}`
}

export function getSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    localUrl

  return new URL(withProtocol(configuredUrl))
}
