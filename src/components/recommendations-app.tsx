"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import {
  BookmarkSimpleIcon,
  CaretDownIcon,
  CaretUpIcon,
  MagnifyingGlassIcon,
  StarIcon,
  XIcon,
} from "@phosphor-icons/react"
import { toast } from "sonner"

import { ServiceLogo } from "@/components/service-logo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { catalogueMetadata } from "@/lib/catalogue-metadata"
import { cn } from "@/lib/utils"
import {
  recommendations,
  serviceLabels,
  typeLabels,
  type Genre,
  type Recommendation,
  type RecommendationGroup,
  type StreamingService,
} from "@/lib/recommendations"

const allServices: StreamingService[] = ["netflix", "prime", "hbo", "apple"]
const allGenres = Array.from(
  new Set(recommendations.flatMap((item) => item.genres))
).sort()

const serviceProviderNames: Record<StreamingService, string[]> = {
  netflix: ["netflix"],
  prime: ["amazon prime"],
  hbo: ["hbo max", "max"],
  apple: ["apple tv"],
}

const recommendationGroupOrder: RecommendationGroup[] = [
  "series",
  "movie",
  "anime",
  "plan",
]

const recommendationGroupLabels: Record<RecommendationGroup, string> = {
  series: "Series",
  movie: "Movies",
  anime: "Anime",
  plan: "Plan to Watch",
}

function getRecommendationGroup(
  recommendation: Recommendation
): RecommendationGroup {
  return recommendation.planned ? "plan" : recommendation.type
}

function isSupportedProvider(providerName: string) {
  const normalizedName = providerName.toLowerCase()

  return allServices.some((service) =>
    serviceProviderNames[service].some((name) =>
      normalizedName.includes(name)
    )
  )
}

function DescriptionDisclosure({
  description,
  recommendationId,
}: {
  description: string
  recommendationId: number
}) {
  const [expanded, setExpanded] = useState(false)
  const canExpand = description.length > 140
  const descriptionId = `recommendation-description-${recommendationId}`

  return (
    <div className="description-disclosure">
      <CardDescription
        id={descriptionId}
        className={cn(
          "recommendation-description",
          expanded && "is-expanded"
        )}
      >
        {description}
      </CardDescription>
      {canExpand && (
        <Button
          className="description-toggle"
          size="xs"
          variant="ghost"
          aria-controls={descriptionId}
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? "Less" : "More"}
          {expanded ? (
            <CaretUpIcon data-icon="inline-end" aria-hidden="true" />
          ) : (
            <CaretDownIcon data-icon="inline-end" aria-hidden="true" />
          )}
        </Button>
      )}
    </div>
  )
}

function RecommendationCard({
  recommendation,
  saved,
  onToggleSaved,
}: {
  recommendation: Recommendation
  saved: boolean
  onToggleSaved: (recommendation: Recommendation) => void
}) {
  const metadata = catalogueMetadata[recommendation.title]
  const providers =
    metadata?.streaming.providers.filter((provider) =>
      isSupportedProvider(provider.name)
    ) ?? []

  return (
    <Card className="recommendation-card">
      {metadata?.artwork && (
        <div className="recommendation-artwork">
          <Image
            src={metadata.artwork.path}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}

      <CardHeader>
        <div className="recommendation-meta">
          <Badge variant="secondary">
            {recommendation.planned
              ? "Plan to watch"
              : typeLabels[recommendation.type]}
          </Badge>
          {metadata?.year && <span>{metadata.year}</span>}
          {metadata?.rating && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="ghost">
                  <StarIcon
                    data-icon="inline-start"
                    weight="fill"
                    aria-hidden="true"
                  />
                  IMDb {metadata.rating.value.toFixed(1)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent sideOffset={8}>
                {metadata.rating.votes.toLocaleString()} ratings · checked {metadata.rating.checkedAt}
              </TooltipContent>
            </Tooltip>
          )}
          {recommendation.status === "watching" && <Badge>Watching</Badge>}
          {recommendation.status === "dropped" && (
            <Badge variant="destructive">Dropped</Badge>
          )}
        </div>
        <CardTitle>{recommendation.title}</CardTitle>
        <CardAction>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label={saved ? `Remove ${recommendation.title} from saved` : `Save ${recommendation.title}`}
                aria-pressed={saved}
                onClick={() => onToggleSaved(recommendation)}
              >
                <BookmarkSimpleIcon
                  data-icon="inline-start"
                  weight={saved ? "fill" : "regular"}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>{saved ? "Saved" : "Save"}</TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>

      <CardContent className="recommendation-details">
        {recommendation.progress && (
          <CardDescription>{recommendation.progress}</CardDescription>
        )}
        {recommendation.badges && (
          <div className="recommendation-badges" aria-label="Personal badges">
            {recommendation.badges.map((badge) => (
              <Badge
                key={badge}
                variant={
                  badge === "Editor’s choice" || badge.startsWith("Peak ")
                    ? "default"
                    : "secondary"
                }
              >
                {badge}
              </Badge>
            ))}
          </div>
        )}
        {metadata?.description && (
          <DescriptionDisclosure
            description={metadata.description}
            recommendationId={recommendation.id}
          />
        )}
      </CardContent>

      <CardFooter>
        <span className="card-genres">{recommendation.genres.join(" · ")}</span>
        {providers.length > 0 && (
          <div className="streaming-availability">
            <span className="sr-only">
              Available in the UK on{" "}
              {providers.map((provider) => provider.name).join(", ")}
            </span>
            {providers.map((provider) => (
              <Tooltip key={provider.name}>
                <TooltipTrigger asChild>
                  <span
                    className="provider-mark"
                    role="img"
                    tabIndex={0}
                    aria-label={`${provider.name}: ${provider.modes.join(", ")}`}
                  >
                    {provider.iconPath ? (
                      <Image
                        src={provider.iconPath}
                        alt=""
                        width={24}
                        height={24}
                      />
                    ) : (
                      <span>{provider.name}</span>
                    )}
                  </span>
                </TooltipTrigger>
                <TooltipContent sideOffset={8}>
                  {provider.name} · {provider.modes.join(" / ")}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

export function RecommendationsApp() {
  const [query, setQuery] = useState("")
  const [type, setType] = useState<"all" | RecommendationGroup>("all")
  const [genre, setGenre] = useState<"all" | Genre>("all")
  const [services, setServices] = useState<StreamingService[]>(allServices)
  const [saved, setSaved] = useState<number[]>([])

  const filteredRecommendations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return recommendations.filter((recommendation) => {
      const metadata = catalogueMetadata[recommendation.title]
      const matchesQuery =
        !normalizedQuery ||
        [
          recommendation.title,
          recommendation.genres.join(" "),
          recommendation.progress,
          recommendation.badges?.join(" "),
          recommendation.planned ? "plan to watch" : undefined,
          metadata?.description,
          metadata?.streaming.providers
            .filter((provider) => isSupportedProvider(provider.name))
            .map((provider) => provider.name)
            .join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)

      const providerNames =
        metadata?.streaming.providers.map((provider) =>
          provider.name.toLowerCase()
        ) ?? []
      const matchesService =
        services.length === allServices.length ||
        services.some((service) =>
          serviceProviderNames[service].some((providerName) =>
            providerNames.some((name) => name.includes(providerName))
          )
        )

      return (
        matchesQuery &&
        (type === "all" || getRecommendationGroup(recommendation) === type) &&
        (genre === "all" || recommendation.genres.includes(genre)) &&
        matchesService
      )
    })
  }, [genre, query, services, type])

  const groupedRecommendations = useMemo(
    () =>
      recommendationGroupOrder
        .map((recommendationGroup) => ({
          type: recommendationGroup,
          recommendations: filteredRecommendations.filter(
            (recommendation) =>
              getRecommendationGroup(recommendation) === recommendationGroup
          ),
        }))
        .filter((group) => group.recommendations.length > 0),
    [filteredRecommendations]
  )

  const clearFilters = () => {
    setQuery("")
    setType("all")
    setGenre("all")
    setServices(allServices)
  }

  const toggleSaved = (recommendation: Recommendation) => {
    const isSaved = saved.includes(recommendation.id)
    setSaved((current) =>
      isSaved
        ? current.filter((id) => id !== recommendation.id)
        : [...current, recommendation.id]
    )
    toast(isSaved ? "Removed from saved" : "Saved for later")
  }

  const hasActiveFilters =
    query.length > 0 ||
    type !== "all" ||
    genre !== "all" ||
    services.length !== allServices.length

  return (
    <div className="app-frame">
      <header className="app-header">
        <div className="page-shell header-inner">
          <a href="#top" className="wordmark">Recs.</a>
          <Badge variant="secondary">{recommendations.length} recommendations</Badge>
        </div>
      </header>

      <main id="top" className="page-shell page-main">
        <section className="intro" aria-labelledby="page-title">
          <h1 id="page-title">Movies, series &amp; anime</h1>
          <p>The good stuff, the questionable stuff, and everything in between.</p>
        </section>

        <section className="toolbar" aria-label="Filter recommendations">
          <InputGroup className="search-control">
            <InputGroupAddon><MagnifyingGlassIcon aria-hidden="true" /></InputGroupAddon>
            <InputGroupInput
              aria-label="Search recommendations"
              placeholder="Search recommendations"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton aria-label="Clear search" size="icon-xs" onClick={() => setQuery("")}>
                  <XIcon data-icon="inline-start" />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>

          <div className="filter-scroll">
            <ToggleGroup
              aria-label="Filter by type"
              type="single"
              value={type}
              variant="default"
              spacing={1}
              onValueChange={(value) => value && setType(value as typeof type)}
            >
              <ToggleGroupItem value="all">All</ToggleGroupItem>
              <ToggleGroupItem value="series">Series</ToggleGroupItem>
              <ToggleGroupItem value="movie">Movies</ToggleGroupItem>
              <ToggleGroupItem value="anime">Anime</ToggleGroupItem>
              <ToggleGroupItem value="plan">Plan</ToggleGroupItem>
            </ToggleGroup>

            <Select
              value={genre}
              onValueChange={(value) => setGenre(value as typeof genre)}
            >
              <SelectTrigger className="genre-select" size="sm" aria-label="Filter by genre">
                <SelectValue>{genre === "all" ? "All genres" : genre}</SelectValue>
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectGroup>
                  <SelectItem value="all">All genres</SelectItem>
                  {allGenres.map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <ToggleGroup
              aria-label="Filter by streaming service"
              type="multiple"
              value={services}
              variant="default"
              spacing={1}
              onValueChange={(value) => setServices(value as StreamingService[])}
            >
              {allServices.map((service) => (
                <ToggleGroupItem
                  key={service}
                  value={service}
                  aria-label={`Filter by ${serviceLabels[service]}`}
                >
                  <ServiceLogo service={service} />
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </section>

        <section className="recommendation-section" aria-labelledby="recommendations-heading">
          <div className="section-heading">
            <h2 id="recommendations-heading">Recommendations</h2>
            <div className="result-summary" aria-live="polite">
              <span>{filteredRecommendations.length} results</span>
              {hasActiveFilters && (
                <Button size="xs" variant="ghost" onClick={clearFilters}>Clear</Button>
              )}
            </div>
          </div>

          {filteredRecommendations.length ? (
            <div className="recommendation-groups">
              {groupedRecommendations.map((group) => (
                <section
                  className="recommendation-group"
                  key={group.type}
                  aria-labelledby={`${group.type}-heading`}
                >
                  <div className="group-heading">
                    <h3 id={`${group.type}-heading`}>
                      {recommendationGroupLabels[group.type]}
                    </h3>
                    <span>{group.recommendations.length}</span>
                  </div>
                  <div className="card-grid">
                    {group.recommendations.map((recommendation) => (
                      <RecommendationCard
                        key={recommendation.id}
                        recommendation={recommendation}
                        saved={saved.includes(recommendation.id)}
                        onToggleSaved={toggleSaved}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <Empty className="empty-state">
              <EmptyHeader>
                <EmptyMedia variant="icon"><MagnifyingGlassIcon /></EmptyMedia>
                <EmptyTitle>No recommendations found</EmptyTitle>
                <EmptyDescription>Try a different search or reset the filters.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button variant="outline" onClick={clearFilters}>Reset filters</Button>
              </EmptyContent>
            </Empty>
          )}
        </section>
      </main>
    </div>
  )
}
