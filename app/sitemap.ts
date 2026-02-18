import { MetadataRoute } from 'next';
import { readBlogs } from '@/lib/blogUtils';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.indiiserve.ai';

  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/work',
    '/services',
    '/blog',
    '/privacy',
    '/terms',
    '/services/digital-branding',
    '/services/ai-automation',
    '/services/bpm',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic blog routes
  const blogs = readBlogs();
  const blogRoutes = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.updatedAt || blog.createdAt || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
