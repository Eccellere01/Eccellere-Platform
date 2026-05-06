import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/dashboard/",
          "/specialist/",
          "/api/",
          "/login",
          "/register",
        ],
      },
      {
        userAgent: "GPTBot",
        allow: ["/"],
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/"],
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: "https://eccellere.co.in/sitemap.xml",
    host: "https://eccellere.co.in",
  };
}
