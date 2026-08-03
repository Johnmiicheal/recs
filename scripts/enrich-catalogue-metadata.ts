import { mkdir, readFile, writeFile } from "node:fs/promises"
import { gunzipSync } from "node:zlib"

import {
  recommendations,
  type Recommendation,
  type StreamingService,
} from "../src/lib/recommendations"
import type {
  CatalogueMetadata,
  StreamingProvider,
} from "../src/lib/catalogue-metadata"

const METADATA_PATH = "src/lib/catalogue-metadata.generated.json"
const IMDb_RATINGS = "https://datasets.imdbws.com/title.ratings.tsv.gz"
const fetchedAt = new Date().toISOString().slice(0, 10)

type IMDbSuggestion = {
  id: string
  l: string
  q?: string
  qid?: string
  y?: number
  yr?: string
  i?: { imageUrl?: string }
}

type Cinemeta = {
  name: string
  year?: string
  description?: string
  imdbRating?: string
  background?: string
  poster?: string
}

const providerDetails: Record<
  StreamingService,
  StreamingProvider & { sourceUrl: string }
> = {
  netflix: {
    name: "Netflix",
    technicalName: "netflix",
    modes: ["Subscription"],
    url: "https://www.netflix.com/",
    iconPath: "/providers/netflix.webp",
    sourceUrl: "https://www.netflix.com/",
  },
  prime: {
    name: "Amazon Prime Video",
    technicalName: "amazonprimevideo",
    modes: ["Subscription"],
    url: "https://www.primevideo.com/",
    iconPath: "/providers/amazon-prime-video.webp",
    sourceUrl: "https://www.primevideo.com/",
  },
  hbo: {
    name: "HBO Max",
    technicalName: "hbomax",
    modes: ["Subscription"],
    url: "https://www.hbomax.com/",
    iconPath: "/providers/hbo-max.webp",
    sourceUrl: "https://www.hbomax.com/",
  },
  apple: {
    name: "Apple TV",
    technicalName: "appletvplus",
    modes: ["Subscription"],
    url: "https://tv.apple.com/",
    iconPath: "/providers/apple-tv.webp",
    sourceUrl: "https://tv.apple.com/",
  },
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

function suggestionScore(
  recommendation: Recommendation,
  suggestion: IMDbSuggestion
) {
  const expectedTitle = normalize(recommendation.title)
  const candidateTitle = normalize(suggestion.l)
  const expectedTokens = new Set(expectedTitle.split(" "))
  const candidateTokens = new Set(candidateTitle.split(" "))
  const sharedTokens = [...expectedTokens].filter((token) =>
    candidateTokens.has(token)
  )
  const typeMatches =
    recommendation.type === "movie"
      ? suggestion.qid === "movie" || suggestion.q === "feature"
      : suggestion.qid?.toLowerCase().includes("tv") ||
        suggestion.q?.toLowerCase().includes("series")

  let score =
    (sharedTokens.length / Math.max(expectedTokens.size, candidateTokens.size)) *
    60
  if (candidateTitle === expectedTitle) score += 100
  if (candidateTitle.includes(expectedTitle) || expectedTitle.includes(candidateTitle)) {
    score += 25
  }
  if (typeMatches) score += 35

  return score
}

async function findIMDbMatch(recommendation: Recommendation) {
  const query = encodeURIComponent(recommendation.title)
  const response = await fetch(
    `https://v3.sg.media-imdb.com/suggestion/x/${query}.json`
  )
  if (!response.ok) {
    throw new Error(`IMDb suggestion returned ${response.status}`)
  }

  const payload = (await response.json()) as { d?: IMDbSuggestion[] }
  const candidates = (payload.d ?? [])
    .filter((candidate) => candidate.id.startsWith("tt"))
    .sort(
      (left, right) =>
        suggestionScore(recommendation, right) -
        suggestionScore(recommendation, left)
    )

  return candidates[0]
}

async function getCinemeta(recommendation: Recommendation, imdbId: string) {
  const type = recommendation.type === "movie" ? "movie" : "series"
  const response = await fetch(
    `https://v3-cinemeta.strem.io/meta/${type}/${imdbId}.json`
  )
  if (!response.ok) return undefined
  const payload = (await response.json()) as { meta?: Cinemeta }
  return payload.meta
}

async function getIMDbRatings(ids: Set<string>) {
  const response = await fetch(IMDb_RATINGS)
  if (!response.ok) throw new Error(`IMDb ratings returned ${response.status}`)
  const text = gunzipSync(Buffer.from(await response.arrayBuffer())).toString(
    "utf8"
  )
  const ratings = new Map<string, { value: number; votes: number }>()

  for (const line of text.split("\n").slice(1)) {
    const [id, value, votes] = line.split("\t")
    if (ids.has(id)) {
      ratings.set(id, { value: Number(value), votes: Number(votes) })
    }
  }

  return ratings
}

async function downloadArtwork(url: string, destination: string) {
  const response = await fetch(url)
  if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) {
    throw new Error(`Artwork returned ${response.status}`)
  }
  await writeFile(destination, new Uint8Array(await response.arrayBuffer()))
}

const metadata = JSON.parse(
  await readFile(METADATA_PATH, "utf8")
) as Record<string, CatalogueMetadata>
const pending = recommendations.filter(
  (recommendation) => !metadata[recommendation.title]
)

if (!pending.length) {
  console.log(`Catalogue metadata is current (${recommendations.length} titles)`)
  process.exit(0)
}

await mkdir("public/artwork", { recursive: true })
const matches = new Map<
  string,
  { suggestion: IMDbSuggestion; cinemeta?: Cinemeta }
>()
const failures: string[] = []

for (let index = 0; index < pending.length; index += 8) {
  const batch = pending.slice(index, index + 8)
  const results = await Promise.allSettled(
    batch.map(async (recommendation) => {
      const suggestion = await findIMDbMatch(recommendation)
      if (!suggestion) throw new Error("No IMDb match")
      const cinemeta = await getCinemeta(recommendation, suggestion.id)
      return { suggestion, cinemeta }
    })
  )

  results.forEach((result, resultIndex) => {
    const recommendation = batch[resultIndex]
    if (result.status === "fulfilled") {
      matches.set(recommendation.title, result.value)
    } else {
      failures.push(`${recommendation.title}: ${result.reason}`)
    }
  })

  process.stdout.write(
    `\rMatched ${Math.min(index + batch.length, pending.length)}/${pending.length}`
  )
}
process.stdout.write("\n")

const ratings = await getIMDbRatings(
  new Set([...matches.values()].map(({ suggestion }) => suggestion.id))
)

for (const recommendation of pending) {
  const match = matches.get(recommendation.title)
  if (!match) continue

  const { suggestion, cinemeta } = match
  const imdbUrl = `https://www.imdb.com/title/${suggestion.id}/`
  const artworkUrl = cinemeta?.background ?? cinemeta?.poster ?? suggestion.i?.imageUrl
  const localArtworkPath = `/artwork/${String(recommendation.id).padStart(3, "0")}-${slugify(recommendation.title)}.jpg`
  let artwork: CatalogueMetadata["artwork"]

  if (artworkUrl) {
    try {
      await downloadArtwork(artworkUrl, `public${localArtworkPath}`)
      artwork = {
        path: localArtworkPath,
        kind: cinemeta?.background ? "backdrop" : "poster",
        source: "Cinemeta",
        sourceUrl: imdbUrl,
      }
    } catch (error) {
      failures.push(`${recommendation.title} artwork: ${error}`)
    }
  }

  const rating = ratings.get(suggestion.id)
  const provider = recommendation.service
    ? providerDetails[recommendation.service]
    : undefined
  const providerSourceUrl = provider?.sourceUrl ?? imdbUrl
  const streamingProviders: StreamingProvider[] = provider
    ? [
        {
          name: provider.name,
          technicalName: provider.technicalName,
          modes: provider.modes,
          url: provider.url,
          iconPath: provider.iconPath,
        },
      ]
    : []

  metadata[recommendation.title] = {
    matchedTitle: cinemeta?.name ?? suggestion.l,
    year:
      suggestion.y ??
      (cinemeta?.year ? Number.parseInt(cinemeta.year, 10) : undefined),
    description: cinemeta?.description,
    artwork,
    rating: rating
      ? {
          source: "IMDb",
          sourceUrl: imdbUrl,
          ...rating,
          checkedAt: fetchedAt,
        }
      : undefined,
    streaming: {
      region: "GB",
      checkedAt: fetchedAt,
      source: "Catalogue",
      sourceUrl: providerSourceUrl,
      providers: streamingProviders,
    },
  }
}

await writeFile(METADATA_PATH, `${JSON.stringify(metadata, null, 2)}\n`)

console.log(
  `Enriched ${Object.keys(metadata).length}/${recommendations.length} titles`
)
console.log(
  `Artwork available for ${Object.values(metadata).filter((item) => item.artwork).length} titles`
)
console.log(
  `IMDb ratings available for ${Object.values(metadata).filter((item) => item.rating).length} titles`
)
if (failures.length) console.log(`Failures:\n${failures.join("\n")}`)
