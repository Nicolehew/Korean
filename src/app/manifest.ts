import type { MetadataRoute } from "next";

// Placeholder name/icons — swap in your school's branding.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hangeul Quest",
    short_name: "Hangeul Quest",
    description: "Learn Korean, level by level, with your school.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9fd",
    theme_color: "#6d56fa",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
