import { MetadataRoute } from "next";
import { getServerApiBaseUrl } from "@/lib/server-api";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/cart`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
  ];

  let productPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${getServerApiBaseUrl()}/api/products`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const products = await res.json();
      productPages = (Array.isArray(products) ? products : []).map((p: { id: string }) => ({
        url: `${siteUrl}/products/${p.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch {
    // API unavailable at build/request time
  }

  return [...staticPages, ...productPages];
}
