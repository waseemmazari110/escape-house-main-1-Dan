import { MetadataRoute } from 'next';
import { db } from '@/db';
import { properties, experiences, destinations, blogPosts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://groupescapehouses.co.uk';
  const currentDate = new Date().toISOString();
  
  // Static routes with optimized priorities for AI search
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/experiences`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/our-story`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/house-styles-and-features`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/booking-terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Fetch dynamic properties directly from database
  let propertyRoutes: MetadataRoute.Sitemap = [];
  try {
    const publishedProperties = await db
      .select()
      .from(properties)
      .where(eq(properties.isPublished, true));
    
    propertyRoutes = publishedProperties.map((property) => ({
      url: `${baseUrl}/properties/${property.slug}`,
      lastModified: property.updatedAt || currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error fetching properties for sitemap:', error);
  }

  // Fetch dynamic experiences directly from database
  let experienceRoutes: MetadataRoute.Sitemap = [];
  try {
    const publishedExperiences = await db
      .select()
      .from(experiences)
      .where(eq(experiences.isPublished, true));
    
    experienceRoutes = publishedExperiences.map((experience) => ({
      url: `${baseUrl}/experiences/${experience.slug}`,
      lastModified: experience.updatedAt || currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching experiences for sitemap:', error);
  }

  // Fetch dynamic destinations directly from database
  let destinationRoutes: MetadataRoute.Sitemap = [];
  try {
    const publishedDestinations = await db
      .select()
      .from(destinations)
      .where(eq(destinations.isPublished, true));
    
    destinationRoutes = publishedDestinations.map((destination) => ({
      url: `${baseUrl}/destinations/${destination.slug}`,
      lastModified: destination.updatedAt || currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error fetching destinations for sitemap:', error);
  }

  // Fetch dynamic blog posts directly from database
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const publishedBlogPosts = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true));
    
    blogRoutes = publishedBlogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.publishedAt || currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Feature pages
  const featureRoutes: MetadataRoute.Sitemap = [
    'hot-tub',
    'swimming-pool',
    'indoor-swimming-pool',
    'games-room',
    'cinema-room',
    'tennis-court',
    'direct-beach-access',
    'ev-charging',
    'fishing-lake',
    'ground-floor-bedroom',
  ].map((slug) => ({
    url: `${baseUrl}/features/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // House styles pages
  const houseStyleRoutes: MetadataRoute.Sitemap = [
    'manor-houses',
    'party-houses',
    'castles',
    'country-houses',
    'stately-houses',
    'luxury-houses',
    'large-holiday-homes',
    'large-cottages',
    'luxury-cottages-with-sea-views',
    'luxury-dog-friendly-cottages',
    'unusual-and-quirky',
    'family-holidays',
  ].map((slug) => ({
    url: `${baseUrl}/house-styles/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Occasions pages (with /occasions/ prefix)
  const occasionRoutes: MetadataRoute.Sitemap = [
    'hen-party-houses',
    'weddings',
    'special-celebrations',
    'weekend-breaks',
    'christmas',
    'new-year',
    'easter',
  ].map((slug) => ({
    url: `${baseUrl}/occasions/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Direct occasion routes (without /occasions/ prefix)
  const directOccasionRoutes: MetadataRoute.Sitemap = [
    'hen-party-houses',
    'weddings',
    'special-celebrations',
    'weekend-breaks',
    'christmas',
    'new-year',
    'easter',
    'spa-treatments',
  ].map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...propertyRoutes,
    ...experienceRoutes,
    ...destinationRoutes,
    ...blogRoutes,
    ...featureRoutes,
    ...houseStyleRoutes,
    ...occasionRoutes,
    ...directOccasionRoutes,
  ];
}