import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "바다송금",
    short_name: "바다송금",
    description: "고령자를 위한 안전하고 쉬운 송금 연습 서비스",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f5",
    theme_color: "#0B6FA8",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
