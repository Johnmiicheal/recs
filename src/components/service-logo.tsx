import {
  siAppletv,
  siHbo,
  siNetflix,
  siPrimevideo,
  type SimpleIcon,
} from "simple-icons"

import type { StreamingService } from "@/lib/recommendations"

const logos: Record<StreamingService, SimpleIcon> = {
  netflix: siNetflix,
  prime: siPrimevideo,
  hbo: siHbo,
  apple: siAppletv,
}

const viewBoxes: Record<StreamingService, string> = {
  netflix: "0 0 24 24",
  prime: "0 7.25 24 9.5",
  hbo: "0 6.5 24 11",
  apple: "0 5 24 14",
}

const displayColors: Record<StreamingService, string> = {
  netflix: `#${siNetflix.hex}`,
  prime: `#${siPrimevideo.hex}`,
  hbo: "#f4f4f5",
  apple: "#f4f4f5",
}

export function ServiceLogo({ service }: { service: StreamingService }) {
  const logo = logos[service]

  return (
    <svg
      className="service-logo"
      role="img"
      viewBox={viewBoxes[service]}
      data-service={service}
      aria-label={logo.title}
      style={{ color: displayColors[service] }}
    >
      <path fill="currentColor" d={logo.path} />
    </svg>
  )
}
