import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ResitLog",
    short_name: "ResitLog",
    description: "Snap, rekod dan jejak perbelanjaan melalui resit.",
    start_url: "/utama",
    display: "standalone",
    background_color: "#f6f5f4",
    theme_color: "#6e1428",
    lang: "ms",
    icons: [
      { src: "/ikon/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/ikon/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
