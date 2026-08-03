import type { MetadataRoute } from "next"

import { siteDescription, siteName, siteTitle } from "@/lib/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteTitle,
    short_name: siteName,
    description: siteDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#121118",
    theme_color: "#9878f5",
    icons: [
      {
        src: "/icon.png",
        sizes: "256x256",
        type: "image/png",
        purpose: "any",
      },
    ],
  }
}
