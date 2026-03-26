import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/portal/'],
    },
    sitemap: 'https://www.feeease.com/sitemap.xml',
  }
}
