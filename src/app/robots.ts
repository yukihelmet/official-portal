// app/robots.ts
import { MetadataRoute } from "next";

export const revalidate = 3600;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [],
    },
    sitemap: "https://yuki-helmet.com/sitemap.xml",
  };
}
