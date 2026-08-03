import generatedMetadata from "./catalogue-metadata.generated.json"

export type StreamingProvider = {
  name: string
  technicalName: string
  modes: string[]
  url: string
  iconPath?: string
}

export type CatalogueMetadata = {
  matchedTitle: string
  year?: number
  description?: string
  artwork?: {
    path: string
    kind: "backdrop" | "poster"
    source: "JustWatch" | "Cinemeta"
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
    source: "JustWatch" | "Catalogue"
    sourceUrl: string
    providers: StreamingProvider[]
  }
}

export const catalogueMetadata = generatedMetadata as Record<
  string,
  CatalogueMetadata
>
