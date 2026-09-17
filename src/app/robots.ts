import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Cho phép tất cả các Bot truy cập vào toàn bộ trang web
        userAgent: '*',
        allow: '/',
      },
      {
        // Ưu tiên cho phép Facebook Bot để đảm bảo hiện ảnh preview (Scraping)
        userAgent: 'facebookexternalhit',
        allow: '/',
      },
    ],
    sitemap: 'https://lvstants-portfolio.vercel.app/sitemap.xml',
  }
}