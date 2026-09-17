import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://lvstants-portfolio.vercel.app';
  const currentDate = new Date().toISOString();

  const routes = [
    '',
    '/about-us',
    '/projects',
    '/contact',
    '/community-us',
    '/privacy-policy',
    '/terms-of-service',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : route === '/projects' || route === '/about-us' ? 0.8 : 0.5,
  }));
}
