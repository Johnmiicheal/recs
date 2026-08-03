import { mkdir, rm, writeFile } from "node:fs/promises"
import { gunzipSync } from "node:zlib"

import { recommendations, type Recommendation } from "../src/lib/recommendations"

const JUSTWATCH_API = "https://apis.justwatch.com/graphql"
const JUSTWATCH_SITE = "https://www.justwatch.com"
const JUSTWATCH_IMAGES = "https://images.justwatch.com"
const IMDb_RATINGS = "https://datasets.imdbws.com/title.ratings.tsv.gz"
const REGION = "GB"
const LANGUAGE = "en"
const fetchedAt = new Date().toISOString().slice(0, 10)

const expectedYears: Record<string, number> = {
  "Silo": 2023,
  "Pluribus": 2025,
  "Spider-Noir": 2026,
  "Young Sherlock": 2026,
  "The Wonderfools": 2025,
  "Trigger": 2025,
  "Ted": 2024,
  "Shameless": 2011,
  "House": 2004,
  "One Piece": 1999,
  "The Office": 2005,
  "Special Ops: Lioness": 2023,
  "The Apothecary Diaries": 2023,
  "Last Samurai Standing": 2025,
  "Project Hail Mary": 2026,
  "The Sixth Sense": 1999,
  "Avatar Aang — The Last Airbender": 2026,
  "Spider-Man: Brand New Day": 2026,
  "Superman": 2025,
  "Thunderbolts*": 2025,
  "It Takes Two": 1995,
  "100 Meters": 2025,
  "The Fall Guy": 2024,
  "The Platform": 2019,
  "F1": 2025,
  "Ford v Ferrari": 2019,
  "The Blacklist": 2013,
  "Prison Break": 2005,
  "Money Heist": 2017,
  "Stranger Things": 2016,
  "Peaky Blinders": 2013,
  "Narcos": 2015,
  "Dexter": 2006,
  "Sherlock": 2010,
  "Mr. Robot": 2015,
  "Westworld": 2016,
  "Mindhunter": 2017,
  "Lost": 2004,
  "The Walking Dead": 2010,
  "The Witcher": 2019,
  "You": 2018,
  "The Last of Us": 2023,
  "Reacher": 2022,
  "Daredevil": 2015,
  "The Punisher": 2017,
  "Arcane": 2021,
  "Invincible": 2021,
  "True Detective": 2014,
  "Counterpart": 2017,
  "12 Monkeys": 2015,
  "The Americans": 2013,
  "Fargo": 2014,
  "Succession": 2018,
  "Warrior": 2019,
  "From": 2022,
  "Monk": 2002,
  "Leverage": 2008,
  "Scorpion": 2014,
  "How to Get Away with Murder": 2014,
  "Criminal Minds": 2005,
  "Modern Family": 2009,
  "Parks and Recreation": 2009,
  "Superstore": 2015,
  "Silicon Valley": 2014,
  "1899": 2022,
  "The Flash": 2014,
  "The Big Bang Theory": 2007,
  "Gotham": 2014,
  "Psych": 2006,
  "The Peripheral": 2022,
  "The Society": 2019,
  "Agents of S.H.I.E.L.D.": 2013,
  "Castle": 2009,
  "Travelers": 2016,
  "The OA": 2016,
  "Bones": 2005,
  "Lie to Me": 2009,
  "Attack on Titan": 2013,
  "Death Note": 2006,
  "Hunter x Hunter": 2011,
  "Demon Slayer: Kimetsu no Yaiba": 2019,
  "Code Geass": 2006,
  "Steins;Gate": 2011,
  "Vinland Saga": 2019,
  "Solo Leveling": 2024,
  "Chainsaw Man": 2022,
  "Mob Psycho 100": 2016,
  "Cyberpunk: Edgerunners": 2022,
  "One-Punch Man": 2015,
  "Mr Inbetween": 2018,
  "The Devil’s Hour": 2022,
  "Watchmen": 2019,
  "Black Sails": 2014,
  "Banshee": 2013,
  "Bodies": 2023,
  "Elementary": 2012,
  "White Collar": 2009,
  "Burn Notice": 2007,
  "Community": 2009,
  "Hannibal": 2013,
  "The Following": 2013,
  "Luther": 2010,
  "Broadchurch": 2013,
  "Bosch": 2015,
  "24": 2001,
  "Quantico": 2015,
  "Shooter": 2016,
  "Bodyguard": 2018,
  "The Recruit": 2022,
  "Sons of Anarchy": 2008,
  "Animal Kingdom": 2016,
  "Power": 2014,
  "Snowfall": 2017,
  "Top Boy": 2011,
  "The Last Kingdom": 2015,
  "Spartacus": 2010,
  "Rome": 2005,
  "Marco Polo": 2014,
  "Heroes": 2006,
  "The 4400": 2004,
  "Orphan Black": 2013,
  "Sense8": 2015,
  "The Man in the High Castle": 2015,
  "Continuum": 2012,
  "Wayward Pines": 2015,
  "Under the Dome": 2013,
  "Colony": 2016,
  "Utopia": 2013,
  "The Strain": 2014,
  "Into the Night": 2020,
  "Arrow": 2012,
  "Titans": 2018,
  "Doom Patrol": 2019,
  "Chuck": 2007,
  "How I Met Your Mother": 2005,
  "New Girl": 2011,
}

const searchOverrides: Record<string, string> = {
  "House": "House M.D.",
  "Spider-Noir": "Spider Noir",
  "The Office": "The Office US",
  "Shameless": "Shameless US",
  "One Piece": "One Piece 1999",
  "Special Ops: Lioness": "Lioness",
  "The Apothecary Diaries": "Kusuriya no Hitorigoto",
  "Avatar Aang — The Last Airbender": "Aang The Last Airbender",
  "F1": "F1 The Movie",
  "The Flash": "The Flash 2014",
  "Agents of S.H.I.E.L.D.": "Marvel Agents of SHIELD",
  "The Society": "The Society 2019",
  "The Peripheral": "The Peripheral 2022",
  "Mr. Robot": "Mr Robot 2015",
  "You": "You 2018",
  "From": "From 2022",
  "Fargo": "Fargo 2014",
  "Warrior": "Warrior 2019",
  "Castle": "Castle 2009",
  "The Devil’s Hour": "The Devil's Hour",
  "Bodies": "Bodies 2023",
  "Watchmen": "Watchmen 2019",
  "Shooter": "Shooter 2016",
  "Power": "Power 2014",
  "24": "24 2001",
  "The 4400": "The 4400 2004",
  "Utopia": "Utopia 2013 UK",
}

const imdbOverrides: Record<string, string> = {
  "Lift": "tt14371878",
}

const query = `query SearchCatalogue($country: Country!, $language: Language!, $first: Int!, $filter: TitleFilter) {
  popularTitles(country: $country, first: $first, filter: $filter) {
    edges {
      node {
        id
        objectType
        content(country: $country, language: $language) {
          title
          fullPath
          originalReleaseYear
          shortDescription
          posterUrl
          backdrops { backdropUrl }
          externalIds { imdbId }
          scoring { imdbScore imdbVotes }
        }
        offers(country: $country, platform: WEB) {
          monetizationType
          standardWebURL
          package { clearName technicalName icon }
        }
      }
    }
  }
}`

type JustWatchOffer = {
  monetizationType: string
  standardWebURL: string
  package: {
    clearName: string
    technicalName: string
    icon: string
  }
}

type JustWatchNode = {
  id: string
  objectType: "MOVIE" | "SHOW"
  content: {
    title: string
    fullPath: string
    originalReleaseYear: number | null
    shortDescription: string | null
    posterUrl: string | null
    backdrops: { backdropUrl: string }[]
    externalIds: { imdbId: string | null }
    scoring: { imdbScore: number | null; imdbVotes: number | null }
  }
  offers: JustWatchOffer[]
}

type Provider = {
  name: string
  technicalName: string
  modes: string[]
  url: string
  iconPath?: string
}

type GeneratedMetadata = {
  matchedTitle: string
  year?: number
  description?: string
  artwork?: {
    path: string
    kind: "backdrop" | "poster"
    source: "JustWatch"
    sourceUrl: string
  }
  rating?: {
    source: "IMDb"
    sourceUrl: string
    value: number
    votes: number
    checkedAt: string
  }
  streaming: {
    region: "GB"
    checkedAt: string
    source: "JustWatch"
    sourceUrl: string
    providers: Provider[]
  }
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

function slugify(value: string) {
  return normalize(value).replace(/\s+/g, "-")
}

function candidateScore(recommendation: Recommendation, node: JustWatchNode) {
  const expectedType = recommendation.type === "movie" ? "MOVIE" : "SHOW"
  if (node.objectType !== expectedType) return -1000

  const expectedTitle = normalize(recommendation.title)
  const candidateTitle = normalize(node.content.title)
  const expectedTokens = new Set(expectedTitle.split(" "))
  const candidateTokens = new Set(candidateTitle.split(" "))
  const sharedTokens = [...expectedTokens].filter((token) => candidateTokens.has(token))
  const tokenScore =
    (sharedTokens.length / Math.max(expectedTokens.size, candidateTokens.size)) * 60

  let score = tokenScore
  if (candidateTitle === expectedTitle) score += 100
  if (candidateTitle.includes(expectedTitle) || expectedTitle.includes(candidateTitle)) score += 25

  const expectedYear = expectedYears[recommendation.title]
  const candidateYear = node.content.originalReleaseYear
  if (expectedYear && candidateYear) {
    score += expectedYear === candidateYear ? 50 : -Math.min(60, Math.abs(expectedYear - candidateYear) * 8)
  }

  return score
}

async function searchJustWatch(recommendation: Recommendation) {
  const searchQuery = searchOverrides[recommendation.title] ?? recommendation.title
  const objectTypes = [recommendation.type === "movie" ? "MOVIE" : "SHOW"]
  const response = await fetch(JUSTWATCH_API, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query,
      variables: {
        country: REGION,
        language: LANGUAGE,
        first: 10,
        filter: { searchQuery, objectTypes },
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`JustWatch returned ${response.status} for ${recommendation.title}`)
  }

  const payload = (await response.json()) as {
    data?: { popularTitles?: { edges?: { node: JustWatchNode }[] } }
    errors?: { message: string }[]
  }

  if (payload.errors?.length) {
    throw new Error(`${recommendation.title}: ${payload.errors.map((error) => error.message).join(", ")}`)
  }

  const candidates = (payload.data?.popularTitles?.edges ?? [])
    .map((edge) => edge.node)
    .sort(
      (left, right) =>
        candidateScore(recommendation, right) - candidateScore(recommendation, left)
    )

  return {
    node: candidates[0],
    score: candidates[0] ? candidateScore(recommendation, candidates[0]) : -1000,
  }
}

function imageUrl(path: string, kind: "backdrop" | "poster") {
  const profile = kind === "backdrop" ? "s640" : "s332"
  return `${JUSTWATCH_IMAGES}${path}`
    .replace("{profile}", profile)
    .replace("{format}", "webp")
}

async function downloadImage(url: string, destination: string) {
  const response = await fetch(url)
  if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) {
    throw new Error(`Image download failed (${response.status}): ${url}`)
  }
  await writeFile(destination, new Uint8Array(await response.arrayBuffer()))
}

function canonicalProviderName(name: string) {
  const normalized = name
    .replace(" Standard with Ads", "")
    .replace(" with Ads", "")
    .replace(" Amazon Channel", "")
    .trim()

  if (normalized.startsWith("Amazon Prime Video")) return "Amazon Prime Video"
  if (normalized.startsWith("ITVX")) return "ITVX"
  if (normalized.startsWith("Netflix")) return "Netflix"
  if (normalized.startsWith("Now TV")) return "Now TV"
  if (normalized.startsWith("Paramount")) return "Paramount Plus"

  return normalized
}

function selectProviders(offers: JustWatchOffer[]) {
  const preferredModes = new Set(["FLATRATE", "FREE", "ADS"])
  const preferred = offers.filter((offer) => preferredModes.has(offer.monetizationType))
  const selectedOffers = preferred.length ? preferred : offers
  const providers = new Map<string, Provider & { iconUrl?: string }>()

  for (const offer of selectedOffers) {
    const name = canonicalProviderName(offer.package.clearName)
    const key = name.toLowerCase()
    const current = providers.get(key)
    const mode =
      offer.monetizationType === "FLATRATE"
        ? "Subscription"
        : offer.monetizationType.charAt(0) +
          offer.monetizationType.slice(1).toLowerCase()

    if (current) {
      if (!current.modes.includes(mode)) current.modes.push(mode)
      continue
    }

    providers.set(key, {
      name,
      technicalName: offer.package.technicalName,
      modes: [mode],
      url: offer.standardWebURL,
      iconUrl: offer.package.icon
        ? imageUrl(offer.package.icon, "poster")
        : undefined,
    })
  }

  return [...providers.values()]
}

async function getIMDbRatings(ids: Set<string>) {
  const response = await fetch(IMDb_RATINGS)
  if (!response.ok) throw new Error(`IMDb ratings returned ${response.status}`)
  const text = gunzipSync(Buffer.from(await response.arrayBuffer())).toString("utf8")
  const ratings = new Map<string, { value: number; votes: number }>()

  for (const line of text.split("\n").slice(1)) {
    const [id, value, votes] = line.split("\t")
    if (ids.has(id)) ratings.set(id, { value: Number(value), votes: Number(votes) })
  }

  return ratings
}

const matches = new Map<string, { node: JustWatchNode; score: number }>()
const failures: string[] = []

for (let index = 0; index < recommendations.length; index += 5) {
  const batch = recommendations.slice(index, index + 5)
  const results = await Promise.allSettled(batch.map(searchJustWatch))

  results.forEach((result, resultIndex) => {
    const recommendation = batch[resultIndex]
    if (result.status === "rejected" || !result.value.node) {
      failures.push(
        `${recommendation.title}: ${result.status === "rejected" ? result.reason : "no match"}`
      )
      return
    }
    matches.set(recommendation.title, result.value)
  })

  process.stdout.write(`\rMatched ${Math.min(index + batch.length, recommendations.length)}/${recommendations.length}`)
}
process.stdout.write("\n")

if (matches.size !== recommendations.length) {
  if (failures.length) console.error(`Failures:\n${failures.join("\n")}`)
  throw new Error(
    `Metadata refresh stopped before replacing the existing snapshot (${matches.size}/${recommendations.length} matches)`
  )
}

await rm("public/artwork", { recursive: true, force: true })
await rm("public/providers", { recursive: true, force: true })
await mkdir("public/artwork", { recursive: true })
await mkdir("public/providers", { recursive: true })

const imdbIds = new Set(
  [
    ...[...matches.values()].map(({ node }) => node.content.externalIds.imdbId),
    ...Object.values(imdbOverrides),
  ].filter((id): id is string => Boolean(id))
)
const imdbRatings = await getIMDbRatings(imdbIds)
const metadata: Record<string, GeneratedMetadata> = {}
const providerIconDownloads = new Map<string, Promise<void>>()
const lowConfidence: string[] = []

for (const recommendation of recommendations) {
  const match = matches.get(recommendation.title)
  if (!match) continue
  const { node, score } = match
  const justWatchUrl = `${JUSTWATCH_SITE}${node.content.fullPath}`
  const imdbId = imdbOverrides[recommendation.title] ?? node.content.externalIds.imdbId
  const rating = imdbId ? imdbRatings.get(imdbId) : undefined
  const rawProviders = selectProviders(node.offers)
  const providers: Provider[] = []

  if (score < 80) {
    lowConfidence.push(
      `${recommendation.title} -> ${node.content.title} (${node.content.originalReleaseYear ?? "unknown"}), score ${score.toFixed(1)}`
    )
  }

  for (const rawProvider of rawProviders) {
    const { iconUrl, ...provider } = rawProvider
    if (iconUrl) {
      const iconSlug = slugify(rawProvider.name)
      const iconPath = `/providers/${iconSlug}.webp`
      provider.iconPath = iconPath
      if (!providerIconDownloads.has(iconSlug)) {
        providerIconDownloads.set(
          iconSlug,
          downloadImage(iconUrl, `public${iconPath}`).catch((error) => {
            console.warn(`\nProvider icon skipped: ${rawProvider.name}: ${error}`)
          })
        )
      }
    }
    providers.push(provider)
  }

  const backdrop = node.content.backdrops[0]?.backdropUrl
  const poster = node.content.posterUrl
  const artworkPath = backdrop ?? poster
  const artworkKind = backdrop ? "backdrop" : "poster"
  let artwork: GeneratedMetadata["artwork"]

  if (artworkPath) {
    const localPath = `/artwork/${String(recommendation.id).padStart(3, "0")}-${slugify(recommendation.title)}.webp`
    try {
      await downloadImage(
        imageUrl(artworkPath, artworkKind),
        `public${localPath}`
      )
      artwork = {
        path: localPath,
        kind: artworkKind,
        source: "JustWatch",
        sourceUrl: justWatchUrl,
      }
    } catch (error) {
      failures.push(`${recommendation.title} artwork: ${error}`)
    }
  }

  metadata[recommendation.title] = {
    matchedTitle: node.content.title,
    year: node.content.originalReleaseYear ?? undefined,
    description: node.content.shortDescription ?? undefined,
    artwork,
    rating: rating
      ? {
          source: "IMDb",
          sourceUrl: `https://www.imdb.com/title/${imdbId}/`,
          ...rating,
          checkedAt: fetchedAt,
        }
      : imdbId && node.content.scoring.imdbScore && node.content.scoring.imdbVotes
        ? {
            source: "IMDb",
            sourceUrl: `https://www.imdb.com/title/${imdbId}/`,
            value: node.content.scoring.imdbScore,
            votes: node.content.scoring.imdbVotes,
            checkedAt: fetchedAt,
          }
        : undefined,
    streaming: {
      region: REGION,
      checkedAt: fetchedAt,
      source: "JustWatch",
      sourceUrl: justWatchUrl,
      providers,
    },
  }
}

await Promise.all(providerIconDownloads.values())
await writeFile(
  "src/lib/catalogue-metadata.generated.json",
  `${JSON.stringify(metadata, null, 2)}\n`
)

console.log(`Generated metadata for ${Object.keys(metadata).length}/${recommendations.length} titles`)
console.log(`Downloaded ${Object.values(metadata).filter((item) => item.artwork).length} artwork images`)
console.log(`Matched ${Object.values(metadata).filter((item) => item.rating).length} IMDb ratings`)
if (lowConfidence.length) console.log(`Low-confidence matches:\n${lowConfidence.join("\n")}`)
if (failures.length) console.log(`Failures:\n${failures.join("\n")}`)
