"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { MapPin, Navigation, Coffee, Moon, Sparkles, UtensilsCrossed, ChevronDownIcon, Calendar, Home, Waves, PoundSterling, Users, PartyPopper, Train, Plane, Car, Bus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";

export default function DestinationDetailPage() {
  const [openFaq, setOpenFaq,] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const params = useParams();
  const slug = params.slug as string;

  const handleImageError = (imageId: string) => {
    setImageErrors(prev => ({ ...prev, [imageId]: true }));
  };

  // Fetch properties for this destination
  useEffect(() => {
    const fetchProperties = async () => {
      if (!slug) return;
      
      try {
        setIsLoadingProperties(true);
        const response = await fetch(`/api/properties?isPublished=true&location=${encodeURIComponent(slug)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const data = await response.json();
        const propertiesArray = Array.isArray(data) ? data : (data.properties || []);

        // Transform properties data to match PropertyCard props
        const transformedProperties = propertiesArray.map((prop: any) => ({
          id: prop.id.toString(),
          title: prop.title,
          location: prop.location,
          sleeps: prop.sleepsMax,
          bedrooms: prop.bedrooms,
          priceFrom: prop.priceFromWeekend || prop.priceFromMidweek,
          image: prop.heroImage,
          features: [],
          slug: prop.slug,
        }));

        setProperties(transformedProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
      } finally {
        setIsLoadingProperties(false);
      }
    };

    fetchProperties();
  }, [slug]);

  // Destinations data
  const destinationsData: Record<string, any> = {
    "lake-district": {
      name: "Lake District",
      region: "Cumbria",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-lake-district-51198f8c-20251019170636.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/stunning-cinematic-aerial-drone-shot-gli-b539c0a2-20251023164106.mp4",
      overview: "The Lake District is England's most stunning national park, offering breathtaking landscapes, luxury lodges, and peaceful mountain retreats perfect for group celebrations. With dramatic fells, pristine lakes, and charming villages, it's the ideal destination for groups seeking natural beauty combined with luxury accommodation.",
      quickFacts: {
        fromLondon: "4-5 hours by train to Windermere or 5-6 hours by car via M6",
        bestTime: "May to September for hiking and boat trips, winter for cosy retreats with log fires",
        nightlife: "Traditional Lakeland pubs with local ales, cosy inns with live folk music",
        dining: "Award-winning gastropubs, Michelin-starred restaurants, traditional afternoon tea with lake views",
        beachAccess: "No beaches but 16 stunning lakes including Windermere, Ullswater and Derwentwater for boat trips",
        accommodation: "Luxury lakeside lodges with hot tubs, mountain-view retreats, converted barns with spa facilities",
        priceRange: "£80-£120 per night with premium lodges featuring private hot tubs and saunas",
        activities: "Lake cruises, fell walking, spa treatments, kayaking, scenic drives, mountain biking"
      },
      gettingThere: [
        { icon: Train, text: "Regular train services to Windermere and Penrith from London Euston (4-5 hours)" },
        { icon: Car, text: "Scenic drive via M6 motorway (approx 5-6 hours from London)" },
        { icon: Bus, text: "National Express coaches run daily services to major Lake District towns" },
        { icon: Plane, text: "Nearest airports: Manchester (2 hours) or Newcastle (2.5 hours)" }
      ],
      nightlife: [
        { name: "The Drunken Duck", description: "Award-winning pub with craft beers and stunning views", image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80" },
        { name: "Zeffirellis", description: "Popular cinema and jazz bar in Ambleside", image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80" },
        { name: "The Old Dungeon Ghyll", description: "Traditional climbers' pub with live music", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-traditional-c-9f271f04-20251022073931.jpg" }
      ],
      brunch: [
        { name: "The Jumble Room", description: "Quirky restaurant with creative brunch menu", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-quirky-eclect-9dc02dd6-20251022073924.jpg", link: "#" },
        { name: "Doi Intanon", description: "Thai restaurant with lakeside views", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-thai-restaura-a5539b7a-20251022073930.jpg", link: "#" },
        { name: "The Cottage in the Wood", description: "Fine dining with panoramic fell views", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Windermere Lake Cruise", description: "Scenic boat tours on England's largest lake", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80" },
        { name: "Spa Treatments", description: "Luxury spa experiences in stunning settings", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80" },
        { name: "Mountain Hiking", description: "Guided walks and fell climbing adventures", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80" }
      ]
    },
    brighton: {
      name: "Brighton",
      region: "East Sussex",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-brighton-uk--cf923885-20251018100341.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/vibrant-aerial-establishing-shot-of-brig-8a8e78c4-20251022152555.mp4",
      overview: "Brighton is the UK's premier hen party destination, combining stunning Regency architecture with legendary nightlife, a vibrant beach scene, and endless entertainment options. From cocktail bars to beachfront clubs, this seaside city offers the perfect blend of sophistication and fun for unforgettable group celebrations.",
      quickFacts: {
        fromLondon: "Just 1 hour by direct train from Victoria or London Bridge - perfect for quick escapes",
        bestTime: "Year-round destination! May-September for beach clubs and seafront, October-April for cheaper rates",
        nightlife: "Legendary! Coalition (5 floors), Patterns seafront club, The Arch cocktail bar, PRYZM superclub",
        dining: "Outstanding seafood at Riddle & Finns, The Ivy in the Lanes, bottomless brunch at Plateau",
        beachAccess: "Direct beach access! 5 miles of pebble beach, Brighton Pier, beach volleyball, water sports",
        accommodation: "Regency townhouses with hot tubs, seafront villas with games rooms, modern lofts near The Lanes",
        priceRange: "£75-£110 per night, split between groups makes it very affordable",
        activities: "Beach clubs, The Lanes shopping, Brighton Pier rides, paddleboarding, comedy clubs, cocktail classes"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Victoria or London Bridge (1 hour)" },
        { icon: Car, text: "Easy drive via M23 and A23 (approx 1.5 hours from London)" },
        { icon: Bus, text: "National Express and Megabus services from London Victoria" },
        { icon: Plane, text: "Gatwick Airport is 30 minutes away with direct train connections" }
      ],
      nightlife: [
        { name: "Coalition", description: "Multi-room club with varied music across 5 floors", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-a-large-multi-e060105c-20251021225447.jpg" },
        { name: "Patterns", description: "Seafront club with top DJs and stunning terrace", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-a-seafront-ni-845a7016-20251021225429.jpg" },
        { name: "The Arch", description: "Boutique venue with cocktails and live music", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-an-upscale-bo-dede2298-20251021225429.jpg" }
      ],
      brunch: [
        { name: "The Ivy in the Lanes", description: "Elegant all-day dining in historic setting", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-an-elegant-up-8951bf0f-20251021225427.jpg", link: "https://theivybrighton.com" },
        { name: "Plateau", description: "Rooftop restaurant with bottomless brunch", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-a-chic-roofto-e8a24100-20251021225428.jpg", link: "#" },
        { name: "Riddle & Finns", description: "Premium seafood and champagne bar", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-a-premium-sea-2a93d3c3-20251021225430.jpg", link: "#" }
      ],
      activities: [
        { name: "Beach Clubs", description: "Spend the day at Brighton's famous beach clubs", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-brighton-beac-c00ed960-20251021225429.jpg" },
        { name: "Shopping in The Lanes", description: "Explore quirky boutiques and vintage shops", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-the-lanes-sho-5a58ff3e-20251021225428.jpg" },
        { name: "Brighton Pier", description: "Classic seaside fun with rides and arcades", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-brighton-pala-91beb56d-20251021225428.jpg" }
      ]
    },
    london: {
      name: "London",
      region: "Greater London",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-london-citysc-8f325788-20251019170619.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/cinematic-aerial-drone-shot-soaring-over-eab71258-20251023160205.mp4",
      overview: "London is the ultimate hen party destination with world-class entertainment, dining, and iconic landmarks. From West End shows to rooftop bars, Michelin-starred restaurants to hidden speakeasies, the capital offers endless possibilities for an unforgettable celebration.",
      quickFacts: {
        fromLondon: "You're already here! Easy access from all London airports and train stations",
        bestTime: "Year-round with endless indoor options - Christmas markets (Nov-Jan) and summer rooftops (Jun-Aug) are highlights",
        nightlife: "World-class! Cirque le Soir, XOYO Shoreditch, Sky Garden rooftop, Mahiki Mayfair, Ministry of Sound",
        dining: "Michelin stars to street food - Sketch afternoon tea, Dishoom breakfast, The Ivy, Borough Market",
        beachAccess: "No beaches but beautiful Thames riverside walks, boat cruises, and summer beach bars",
        accommodation: "Luxury Kensington townhouses, Shoreditch lofts, Chelsea manor houses with hot tubs and cinema rooms",
        priceRange: "£100-£150 per night, premium but unmatched amenities and entertainment options",
        activities: "West End shows, Thames cruises, afternoon tea, shopping Oxford Street, museums, rooftop bars, spa days"
      },
      gettingThere: [
        { icon: Train, text: "Multiple train stations connecting to all major UK cities" },
        { icon: Plane, text: "Five major airports: Heathrow, Gatwick, Stansted, Luton, City" },
        { icon: Bus, text: "Excellent coach connections from across the UK" },
        { icon: Car, text: "M25 motorway provides access from all directions" }
      ],
      nightlife: [
        { name: "Cirque le Soir", description: "Theatrical nightclub with circus performers", image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80" },
        { name: "XOYO", description: "Shoreditch club with cutting-edge music", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-trendy-urban--2931fb0e-20251022153404.jpg" },
        { name: "Sky Garden", description: "Rooftop bar with stunning city views", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80" }
      ],
      brunch: [
        { name: "Sketch", description: "Instagram-famous afternoon tea and brunch", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-sketch-restau-e634d453-20251022153404.jpg", link: "https://sketch.london" },
        { name: "Dishoom", description: "Bombay-style café with legendary breakfast", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "The Ivy Chelsea Garden", description: "Chic all-day dining with bottomless brunch", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "West End Shows", description: "World-class theatre and musicals", image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80" },
        { name: "Thames River Cruise", description: "Champagne cruises past iconic landmarks", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80" },
        { name: "Shopping", description: "From Oxford Street to boutique Covent Garden", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" }
      ]
    },
    bath: {
      name: "Bath",
      region: "Somerset",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-bath-uk-city-79258396-20251018100352.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/stunning-cinematic-aerial-drone-shot-gli-8ac50973-20251023155918.mp4",
      overview: "Bath is a stunning UNESCO World Heritage city combining Roman history, Georgian elegance, and world-class spa experiences. Perfect for sophisticated hen parties seeking culture, relaxation, and refined entertainment in one of England's most beautiful cities.",
      quickFacts: {
        fromLondon: "Just 1.5 hours by direct train from Paddington - ideal for elegant weekend escapes",
        bestTime: "Year-round elegance! Spring (Apr-May) for festivals, December for Christmas markets and lights",
        nightlife: "Sophisticated scene - Sub 13 underground cocktails, The Dark Horse speakeasy, champagne at The Bath Priory",
        dining: "Fine dining capital! The Pump Room in Roman Baths, Sally Lunn's historic buns, Society Café bottomless brunch",
        beachAccess: "No beach but beautiful River Avon walks, punting, and the stunning Royal Crescent gardens",
        accommodation: "Georgian townhouses with period features, luxury spas with hot tubs, Bath stone manors with games rooms",
        priceRange: "£85-£120 per night for authentic Georgian properties with modern luxury",
        activities: "Thermae Bath Spa rooftop pools, Roman Baths tours, Jane Austen Centre, afternoon tea, boutique shopping"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Paddington (1.5 hours)" },
        { icon: Car, text: "M4 motorway via Bristol (approx 2.5 hours from London)" },
        { icon: Bus, text: "National Express coaches from London Victoria" },
        { icon: Plane, text: "Bristol Airport is 30 minutes away" }
      ],
      nightlife: [
        { name: "Sub 13", description: "Underground cocktail bar in vaulted cellars", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80" },
        { name: "The Bell Inn", description: "Historic pub with live music nights", image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&q=80" },
        { name: "The Dark Horse", description: "Cocktail bar with speakeasy vibes", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80" }
      ],
      brunch: [
        { name: "The Pump Room", description: "Elegant dining in historic Roman Baths setting", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
        { name: "Society Café", description: "Stylish all-day dining and cocktails", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "Colonna & Small's", description: "Award-winning coffee and brunch", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Thermae Bath Spa", description: "Rooftop thermal pools with city views", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80" },
        { name: "Roman Baths", description: "Ancient Roman bathing complex", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80" },
        { name: "Royal Crescent", description: "Iconic Georgian architecture and gardens", image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80" }
      ]
    },
    manchester: {
      name: "Manchester",
      region: "Greater Manchester",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-manchester-u-fdc0037c-20251018100402.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/dynamic-aerial-drone-shot-sweeping-over--5f6ee601-20251022191055.mp4",
      overview: "Manchester is the vibrant Northern powerhouse with world-class shopping, incredible nightlife, and warm hospitality. From the trendy Northern Quarter to iconic music venues, Manchester offers an electric atmosphere perfect for unforgettable hen celebrations.",
      quickFacts: {
        fromLondon: "Just 2 hours by direct train from Euston - easy Northern escape with big city energy",
        bestTime: "Year-round party city! Summer (Jun-Aug) for rooftop bars, any weekend for legendary nightlife",
        nightlife: "Legendary music scene! The Warehouse Project, Refuge grand hotel bar, Cloud 23 rooftop, Deansgate Locks",
        dining: "Diverse and trendy - Beautif NQ brunch, The Ivy Spinningfields, Street food at Mackie Mayor, Federal Bar",
        beachAccess: "No beach but vibrant canal-side bars, Castlefield waterfront, and nearby Peak District countryside",
        accommodation: "Industrial loft conversions with hot tubs, Northern Quarter warehouses, modern city centre apartments",
        priceRange: "£70-£95 per night - amazing value for a major city with top facilities",
        activities: "Shopping Trafford Centre, Northern Quarter street art, Altrincham Market, Old Trafford tours, live music"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Euston (2 hours)" },
        { icon: Plane, text: "Manchester Airport with global connections" },
        { icon: Car, text: "M6 and M62 motorways from all directions" },
        { icon: Bus, text: "Frequent coach services from major UK cities" }
      ],
      nightlife: [
        { name: "The Warehouse Project", description: "Legendary club with world-class DJs", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-the-warehouse-b090804a-20251022190830.jpg" },
        { name: "Refuge", description: "Grand hotel bar with eclectic entertainment", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-refuge-bar-an-b3087eb5-20251022190830.jpg" },
        { name: "Cloud 23", description: "Rooftop bar with panoramic city views", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-cloud-23-roof-d94afb9b-20251022190830.jpg" }
      ],
      brunch: [
        { name: "Beautif", description: "Trendy Northern Quarter brunch spot", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-beautif-manch-90968a36-20251022191035.jpg", link: "#" },
        { name: "The Ivy Spinningfields", description: "Elegant all-day dining and cocktails", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-the-ivy-spinn-4308f1da-20251022190830.jpg", link: "#" },
        { name: "Federal Bar", description: "Australian-inspired brunch and coffee", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-australian-st-14bd32d8-20251022190830.jpg", link: "#" }
      ],
      activities: [
        { name: "Shopping", description: "From Harvey Nichols to independent boutiques", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-manchester-sp-e36bf3b2-20251022191035.jpg" },
        { name: "Northern Quarter", description: "Vibrant street art and creative scene", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-manchester-no-a9e2fddf-20251022191035.jpg" },
        { name: "Food Markets", description: "Altrincham and Mackie Mayor markets", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-mackie-mayor--e1d6b2c7-20251022190830.jpg" }
      ]
    },
    york: {
      name: "York",
      region: "North Yorkshire",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-york-uk%2c-m-7d6cc34e-20251018100412.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/cinematic-aerial-drone-shot-sweeping-ove-f36426ad-20251023160703.mp4",
      overview: "York is a stunning medieval city with cobbled streets, historic walls, and charming riverside pubs. Perfect for hen parties seeking history, culture, and traditional English charm combined with modern entertainment and excellent dining.",
      quickFacts: {
        fromLondon: "2 hours by direct train from Kings Cross - medieval charm meets modern celebration",
        bestTime: "Year-round magic! Summer (Jun-Aug) for outdoor terraces, December for Christmas markets in Shambles",
        nightlife: "Historic meets trendy - The Botanist cocktails, House of Trembling Madness beer hall, Evil Eye Lounge",
        dining: "Charming and diverse - Ate O'Clock Shambles brunch, The Ivy St Helen's Square, Mannion & Co modern British",
        beachAccess: "No beach but beautiful River Ouse walks, boat cruises, and the stunning Minster gardens",
        accommodation: "Medieval townhouses with modern luxuries, Georgian properties with hot tubs, river-view cottages",
        priceRange: "£75-£100 per night for characterful properties in the historic centre",
        activities: "York Minster tours, Shambles medieval shopping, Jorvik Viking Centre, river cruises, afternoon tea, ghost walks"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Kings Cross (2 hours)" },
        { icon: Car, text: "A1(M) and M1 motorways (approx 3.5 hours from London)" },
        { icon: Bus, text: "National Express services from major cities" },
        { icon: Plane, text: "Leeds Bradford Airport is 45 minutes away" }
      ],
      nightlife: [
        { name: "The Botanist", description: "Stylish bar with botanical cocktails", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80" },
        { name: "The House of Trembling Madness", description: "Unique medieval beer hall", image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&q=80" },
        { name: "Evil Eye Lounge", description: "Quirky cocktail bar with vintage vibes", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80" }
      ],
      brunch: [
        { name: "Ate O'Clock", description: "Popular brunch spot in The Shambles", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
        { name: "The Ivy St. Helen's Square", description: "Elegant dining in historic setting", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "Mannion & Co", description: "Contemporary dining with local produce", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "York Minster", description: "Stunning Gothic cathedral tours", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80" },
        { name: "The Shambles", description: "Medieval shopping street with boutiques", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" },
        { name: "River Cruise", description: "Relaxing boat trips along the River Ouse", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80" }
      ]
    },
    cardiff: {
      name: "Cardiff",
      region: "South Wales",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/cardiff-city-center-photograph%2c-iconic-caf939c9-20251017161252.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/stunning-cinematic-aerial-drone-shot-soa-e077764b-20251023162007.mp4",
      overview: "Cardiff is Wales' vibrant capital offering fantastic value, warm Welsh hospitality, and stunning Cardiff Bay. With a thriving nightlife scene, excellent shopping, and beautiful waterfront, it's perfect for hen parties seeking a lively celebration with great prices.",
      quickFacts: {
        fromLondon: "2 hours by direct train from Paddington - fantastic value capital city experience",
        bestTime: "Year-round Welsh warmth! Summer (Jun-Sep) for Cardiff Bay waterfront, Six Nations rugby (Feb-Mar)",
        nightlife: "Lively and affordable! Clwb Ifor Bach Welsh venue, Lab 22 underground club, The Dead Canary cocktails",
        dining: "Welsh cuisine and international - Milkwood Cardiff Bay, The Ivy Cardiff, Bill's bottomless brunch",
        beachAccess: "No beach but stunning Cardiff Bay waterfront with restaurants, bars, and the Wales Millennium Centre",
        accommodation: "Modern bay-view apartments with hot tubs, city centre Georgian townhouses, Victorian properties with games rooms",
        priceRange: "£65-£90 per night - incredible value for a capital city with excellent facilities",
        activities: "Cardiff Castle tours, Principality Stadium behind-scenes, Cardiff Bay waterfront, shopping arcades, Doctor Who tours"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Paddington (2 hours)" },
        { icon: Car, text: "M4 motorway (approx 2.5 hours from London)" },
        { icon: Bus, text: "Regular coach services from major UK cities" },
        { icon: Plane, text: "Cardiff Airport with connections to major cities" }
      ],
      nightlife: [
        { name: "Clwb Ifor Bach", description: "Iconic Welsh music and club venue", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-clwb-ifor-bac-44ae0181-20251023161956.jpg" },
        { name: "Lab 22", description: "Underground cocktail bar and club", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-lab-22-underg-05e667b7-20251023161954.jpg" },
        { name: "The Dead Canary", description: "Award-winning speakeasy cocktail bar", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-the-dead-cana-b4c59d94-20251023161957.jpg" }
      ],
      brunch: [
        { name: "Milkwood", description: "Stylish bar and kitchen in Cardiff Bay", image: "https://images.unsplash.com/photo-1485962398705-ef6a13c41e8f?w=800&q=80", link: "#" },
        { name: "The Ivy Cardiff", description: "Elegant all-day dining and cocktails", image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&q=80", link: "#" },
        { name: "Bill's Cardiff", description: "Quirky dining with bottomless brunch", image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Cardiff Castle", description: "Historic castle in the city centre", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-cardiff-castl-2274b175-20251023161955.jpg" },
        { name: "Principality Stadium Tour", description: "Behind-the-scenes rugby stadium tour", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-principality--9504fcea-20251023161956.jpg" },
        { name: "Cardiff Bay", description: "Waterfront dining and entertainment", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-cardiff-bay-w-1adce638-20251023161957.jpg" }
      ]
    },
    bournemouth: {
      name: "Bournemouth",
      region: "Dorset",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-bournemouth--f4900618-20251018100420.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/stunning-aerial-drone-shot-sweeping-over-dabe5bff-20251023160417.mp4",
      overview: "Bournemouth offers beautiful sandy beaches, vibrant nightlife, and stunning clifftop walks. Perfect for hen parties wanting beach club days, lively entertainment, and coastal charm all in one fantastic seaside destination.",
      quickFacts: {
        fromLondon: "2 hours by direct train from Waterloo - 7 miles of golden beaches await!",
        bestTime: "May to September for beach clubs and water sports, year-round for nightlife and clifftop walks",
        nightlife: "Beach party central! Aruba beach club with DJs, Ojo Rojo seafront cocktails, The Old Fire Station rooftop",
        dining: "Seafood and beachfront - Urban Beach bottomless brunch, The Larder House wine bar, Neo Restaurant sea views",
        beachAccess: "7 miles of award-winning sandy beaches! Beach volleyball, paddleboarding, pier, beach clubs with DJ sets",
        accommodation: "Beachfront houses with hot tubs and sea views, modern apartments near the pier, clifftop villas with games rooms",
        priceRange: "£75-£105 per night for beach-view properties with hot tubs and BBQ areas",
        activities: "Beach clubs with day beds, water sports, surfing lessons, Boscombe Pier, coastal cliff walks, Oceanarium"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Waterloo (2 hours)" },
        { icon: Car, text: "M3 and A31 (approx 2.5 hours from London)" },
        { icon: Bus, text: "National Express services from London Victoria" },
        { icon: Plane, text: "Bournemouth Airport with European connections" }
      ],
      nightlife: [
        { name: "Aruba", description: "Beach club and nightclub with DJ sets", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-a-vibrant-bea-7dca7b21-20251023161457.jpg" },
        { name: "Ojo Rojo", description: "Beach club with sea views and cocktails", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80" },
        { name: "The Old Fire Station", description: "Multi-level bar with rooftop terrace", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80" }
      ],
      brunch: [
        { name: "Urban Beach", description: "Beachfront dining with bottomless brunch", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
        { name: "The Larder House", description: "Stylish café and wine bar", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "Neo Restaurant", description: "Contemporary dining with sea views", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Beach Clubs", description: "Sun loungers, cocktails and DJ sets", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80" },
        { name: "Water Sports", description: "Paddleboarding, surfing and jet skiing", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-action-photograph-of-water--8a2389a2-20251023161455.jpg" },
        { name: "Coastal Walks", description: "Stunning clifftop paths with sea views", image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80" }
      ]
    },
    liverpool: {
      name: "Liverpool",
      region: "Merseyside",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-liverpool-wat-563898e7-20251019170646.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/stunning-cinematic-aerial-drone-shot-swe-e7e7b7d3-20251023163139.mp4",
      overview: "Liverpool combines iconic waterfront views, legendary nightlife, and rich Beatles heritage. With warm Scouse hospitality, fantastic value, and a vibrant atmosphere, it's perfect for hen parties seeking authentic Northern charm.",
      quickFacts: {
        fromLondon: "2.5 hours by direct train from Euston - UNESCO waterfront and legendary Scouse welcome",
        bestTime: "Year-round Scouse party spirit! Summer (Jun-Aug) for Albert Dock outdoor dining, Beatles Week (Aug)",
        nightlife: "Famous party city! The Cavern Club live music, Santa Chupitos theatrical shots, The Merchant rooftop views",
        dining: "Waterfront dining - The Ivy Liverpool elegant, Maray Middle Eastern plates, 92 Degrees coffee and brunch",
        beachAccess: "No beach but UNESCO Albert Dock waterfront, Mersey ferry cruises, and nearby Formby beaches (30 mins)",
        accommodation: "Converted waterfront warehouses with hot tubs, Georgian townhouses, modern apartments near Cavern Quarter",
        priceRange: "£70-£95 per night - excellent value with warm Northern hospitality",
        activities: "Beatles Story museum, Albert Dock shopping, Mersey ferry sightseeing, Anfield stadium tour, nightlife crawls"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Euston (2.5 hours)" },
        { icon: Plane, text: "Liverpool John Lennon Airport" },
        { icon: Car, text: "M6 and M62 motorways" },
        { icon: Bus, text: "Regular coach services from major cities" }
      ],
      nightlife: [
        { name: "The Cavern Club", description: "Legendary music venue where Beatles played", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-the-cavern-cl-42a42f19-20251023163114.jpg" },
        { name: "Santa Chupitos", description: "Shot bar with theatrical serves", image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&q=80" },
        { name: "The Merchant", description: "Rooftop bar with city views", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80" }
      ],
      brunch: [
        { name: "The Ivy Liverpool", description: "Elegant dining in stunning setting", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
        { name: "Maray", description: "Middle Eastern inspired small plates", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "92 Degrees", description: "Award-winning coffee and brunch", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Beatles Story", description: "Immersive Beatles museum experience", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80" },
        { name: "Albert Dock Shopping", description: "Waterfront shopping and dining", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" },
        { name: "River Cruise", description: "Mersey ferry sightseeing tours", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80" }
      ]
    },
    newcastle: {
      name: "Newcastle",
      region: "Tyne and Wear",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-newcastle-upo-1cea0fd5-20251019170922.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/stunning-cinematic-aerial-drone-shot-swe-2e241ed1-20251023162728.mp4",
      overview: "Newcastle is famous for legendary nightlife, friendly locals, and stunning quayside architecture. The Geordie spirit of fun combined with excellent value makes it a top choice for unforgettable hen celebrations.",
      quickFacts: {
        fromLondon: "3 hours by direct train from Kings Cross - legendary Geordie nightlife and warmth awaits",
        bestTime: "Year-round party town! Famous for winter nightlife, summer (Jun-Aug) for quayside outdoor bars",
        nightlife: "LEGENDARY! House of Smith multi-floor venue, Digital underground club, The Botanist cocktails, Tup Tup Palace",
        dining: "Geordie food scene! Pleased To Meet You rooftop dining, The Forth chef's table, The Patricia bistro",
        beachAccess: "Stunning Tynemouth beach just 20 minutes away - Victorian pier, surf, and seaside charm",
        accommodation: "Quayside warehouse apartments with hot tubs, modern city centre houses, riverside properties with Tyne Bridge views",
        priceRange: "£65-£90 per night - incredible value with famous Geordie hospitality",
        activities: "Quayside Sunday market, Angel of the North photo op, Eldon Square shopping, Tynemouth beach trips, nightlife crawls"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Kings Cross (3 hours)" },
        { icon: Plane, text: "Newcastle International Airport" },
        { icon: Car, text: "A1(M) motorway from the south" },
        { icon: Bus, text: "National Express services from major cities" }
      ],
      nightlife: [
        { name: "House of Smith", description: "Multi-floor venue with DJs and live acts", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-a-vibrant-mul-495189b3-20251023162657.jpg" },
        { name: "Digital", description: "Underground club with top electronic music", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80" },
        { name: "The Botanist", description: "Botanical bar and restaurant", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80" }
      ],
      brunch: [
        { name: "Pleased To Meet You", description: "Stylish rooftop dining and cocktails", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
        { name: "The Forth", description: "Award-winning restaurant with chef's table", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "The Patricia", description: "Contemporary bistro on the quayside", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Quayside Market", description: "Sunday market with crafts and street food", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80" },
        { name: "Angel of the North", description: "Iconic sculpture photo opportunity", image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80" },
        { name: "Shopping", description: "From Eldon Square to Grainger Market", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" }
      ]
    },
    birmingham: {
      name: "Birmingham",
      region: "West Midlands",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-birmingham-ci-2022de45-20251019170730.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/a-dynamic-aerial-flyover-of-birmingham-s-3dd3f2d0-20251022110443.mp4",
      overview: "Birmingham is Britain's dynamic second city with world-class shopping, diverse dining, and buzzing nightlife. The vibrant Jewellery Quarter and modern canal-side venues create the perfect backdrop for celebrations.",
      quickFacts: {
        fromLondon: "1.5 hours by train",
        bestTime: "Year-round, Summer for outdoor venues",
        nightlife: "Diverse clubs and trendy bars",
        dining: "Balti Triangle and Michelin-starred restaurants",
        beachAccess: "No beach, extensive canal network",
        accommodation: "Industrial lofts and modern apartments",
        priceRange: "£70-£95 per night",
        activities: "Shopping, canal walks, food tours"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Euston (1.5 hours)" },
        { icon: Plane, text: "Birmingham Airport with global connections" },
        { icon: Car, text: "M6, M5, M40 and M42 motorways" },
        { icon: Bus, text: "National Express hub with extensive services" }
      ],
      nightlife: [
        { name: "Snobs", description: "Iconic indie club since 1993", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-snobs-nightcl-e17f02f4-20251024124424.jpg" },
        { name: "Lab 11", description: "Cocktail bar with speakeasy vibes", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80" },
        { name: "The Jekyll & Hyde", description: "Multi-level themed bar and club", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80" }
      ],
      brunch: [
        { name: "The Ivy Temple Row", description: "Glamorous all-day dining", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
        { name: "Purnell's Bistro", description: "Michelin-starred chef's casual dining", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "The Wilderness", description: "Innovative tasting menu restaurant", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Shopping", description: "Bullring, Grand Central and boutiques", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" },
        { name: "Balti Triangle Food Tour", description: "Explore Birmingham's curry heritage", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80" },
        { name: "Jewellery Quarter", description: "Historic area with independent shops", image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80" }
      ]
    },
    newquay: {
      name: "Newquay",
      region: "Cornwall",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-newquay-beach-1b9fbe44-20251019170627.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/stunning-cinematic-aerial-drone-shot-swe-47e54cae-20251023163601.mp4",
      overview: "Newquay is Cornwall's surf capital with stunning beaches, coastal walks, and vibrant nightlife. Perfect for hen parties combining beach days, water sports, and evening entertainment in this beautiful seaside town.",
      quickFacts: {
        fromLondon: "5 hours by train",
        bestTime: "May-September for beach weather",
        nightlife: "Beach clubs and surf-themed bars",
        dining: "Fresh seafood and beachfront cafés",
        beachAccess: "Multiple stunning surf beaches",
        accommodation: "Beach-view houses and coastal cottages",
        priceRange: "£70-£95 per night",
        activities: "Surfing, coastal walks, beach clubs"
      },
      gettingThere: [
        { icon: Train, text: "Trains from London Paddington via Plymouth (5 hours)" },
        { icon: Plane, text: "Newquay Cornwall Airport with UK connections" },
        { icon: Car, text: "A30 via Exeter (approx 5-6 hours from London)" },
        { icon: Bus, text: "National Express services via Plymouth" }
      ],
      nightlife: [
        { name: "Sailors", description: "Legendary nightclub and live music venue", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-sailors-night-26dfa53f-20251023163540.jpg" },
        { name: "Bertie's Nightclub", description: "Waterfront club with sea views", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80" },
        { name: "Koola", description: "Beach club with DJ sets and cocktails", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80" }
      ],
      brunch: [
        { name: "The Seafood Restaurant", description: "Rick Stein's legendary seafood dining", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
        { name: "Fistral Beach Restaurant", description: "Beachfront dining with stunning views", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "The Beach Hut", description: "Relaxed café with fresh local produce", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Surf Lessons", description: "Learn to surf on Fistral Beach", image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80" },
        { name: "Coastal Walks", description: "Stunning South West Coast Path", image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80" },
        { name: "Beach Clubs", description: "Day beds, cocktails and DJ sets", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80" }
      ]
    },
    bristol: {
      name: "Bristol",
      region: "South West England",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-bristol-harbo-235d69cd-20251019170653.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/sweeping-aerial-drone-shot-gliding-over--593379f4-20251022200952.mp4",
      overview: "Bristol is a creative harbour city with fantastic food scene, vibrant culture and stunning waterfront. Perfect for hen parties seeking street art, independent venues and a bohemian atmosphere combined with excellent nightlife.",
      quickFacts: {
        fromLondon: "1.5-2 hours by train",
        bestTime: "Year-round, Summer for harbour",
        nightlife: "Eclectic bars and live music venues",
        dining: "Award-winning restaurants and street food",
        beachAccess: "No beach, beautiful harbour",
        accommodation: "Converted warehouses and modern apartments",
        priceRange: "£75-£100 per night",
        activities: "Street art tours, harbour walks, food markets"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Paddington (1.5-2 hours)" },
        { icon: Car, text: "M4 and M5 motorways (approx 2.5 hours from London)" },
        { icon: Bus, text: "National Express services from major cities" },
        { icon: Plane, text: "Bristol Airport 20 minutes from city centre" }
      ],
      nightlife: [
        { name: "Motion", description: "Legendary club with international DJs", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-motion-nightc-31081129-20251023164257.jpg" },
        { name: "Thekla", description: "Nightclub on a converted ship", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80" },
        { name: "Bambalan", description: "Caribbean-inspired cocktail bar", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80" }
      ],
      brunch: [
        { name: "The Ivy Clifton Brasserie", description: "Elegant dining with harbour views", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
        { name: "Spoke & Stringer", description: "Harbourside café with brunch", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "No. 1 Harbourside", description: "Fine dining overlooking the water", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Street Art Tours", description: "Explore Banksy and street art scene", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-bristol-stree-d121d751-20251023164258.jpg" },
        { name: "Clifton Suspension Bridge", description: "Iconic Victorian engineering marvel", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-clifton-suspe-11fe7a52-20251023164256.jpg" },
        { name: "St Nicholas Market", description: "Historic covered market with food stalls", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80" }
      ]
    },
    cambridge: {
      name: "Cambridge",
      region: "Cambridgeshire",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-cambridge-uni-706b7fc1-20251019170701.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/serene-aerial-view-gliding-over-cambridg-a7382733-20251022200307.mp4",
      overview: "Cambridge is a historic university city with beautiful colleges, punting and sophisticated dining. Perfect for hen parties seeking culture, riverside charm and elegant celebrations in one of England's most picturesque cities.",
      quickFacts: {
        fromLondon: "1 hour by train",
        bestTime: "Spring-Summer for punting",
        nightlife: "Sophisticated cocktail bars",
        dining: "Fine dining and traditional pubs",
        beachAccess: "No beach, river Cam",
        accommodation: "Period houses and modern apartments",
        priceRange: "£80-£105 per night",
        activities: "Punting, college tours, afternoon tea"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Kings Cross (1 hour)" },
        { icon: Car, text: "M11 motorway (approx 1.5 hours from London)" },
        { icon: Bus, text: "National Express services from London Victoria" },
        { icon: Plane, text: "Stansted Airport 40 minutes away" }
      ],
      nightlife: [
        { name: "Revolution", description: "Cocktail bar with vodka vault", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-vodka-vault-c-203bf712-20251022073647.jpg" },
        { name: "Lola Lo", description: "Tiki-themed cocktail bar and club", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-tiki-themed-t-c281e5cc-20251022073648.jpg" },
        { name: "The Regal", description: "Former cinema turned nightclub", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-converted-his-1e5a1b75-20251022073647.jpg" }
      ],
      brunch: [
        { name: "The Ivy Cambridge Brasserie", description: "Elegant all-day dining", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
        { name: "Fitzbillies", description: "Historic café famous for Chelsea buns", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-a-traditional-6f351355-20251022073648.jpg", link: "#" },
        { name: "Midsummer House", description: "TwoMichelin-starred riverside dining", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-michelin-star-eb18d817-20251022073647.jpg", link: "#" }
      ],
      activities: [
        { name: "Punting on River Cam", description: "Traditional river tour past the colleges", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-punting-boats-ff10642b-20251022073647.jpg" },
        { name: "King's College Chapel", description: "Stunning Gothic architecture", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-king-s-colleg-191baaa4-20251022073647.jpg" },
        { name: "Afternoon Tea", description: "Traditional tea at historic venues", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-traditional-a-960991eb-20251022073642.jpg" }
      ]
    },
    oxford: {
      name: "Oxford",
      region: "Oxfordshire",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-oxford-univer-e05e954c-20251019170708.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/majestic-aerial-establishing-shot-rising-702ff814-20251022200310.mp4",
      overview: "Oxford offers stunning architecture, world-famous university and elegant atmosphere. With beautiful colleges, sophisticated bars and excellent dining, it's perfect for refined hen celebrations.",
      quickFacts: {
        fromLondon: "1 hour by train",
        bestTime: "Year-round, Spring for gardens",
        nightlife: "Elegant bars and traditional pubs",
        dining: "Fine dining and gastropubs",
        beachAccess: "No beach, riverside walks",
        accommodation: "Historic townhouses and apartments",
        priceRange: "£85-£110 per night",
        activities: "College tours, river cruises, shopping"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Paddington (1 hour)" },
        { icon: Car, text: "M40 motorway (approx 1.5 hours from London)" },
        { icon: Bus, text: "Oxford Tube coaches every 10-15 minutes from London" },
        { icon: Plane, text: "Heathrow Airport 1 hour away" }
      ],
      nightlife: [
        { name: "The Alchemist", description: "Theatrical cocktails and molecular mixology", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80" },
        { name: "Bridge", description: "Riverside bar and nightclub", image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80" },
        { name: "Jericho Tavern", description: "Historic music venue and bar", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80" }
      ],
      brunch: [
        { name: "The Ivy Oxford Brasserie", description: "Sophisticated dining", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
        { name: "Quod Restaurant", description: "Contemporary brasserie", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "The Old Parsonage", description: "Boutique hotel dining", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "University Tours", description: "Explore famous Oxford colleges", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80" },
        { name: "Bodleian Library", description: "Historic library tours", image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80" },
        { name: "River Punting", description: "Peaceful river tours", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80" }
      ]
    },
    leeds: {
      name: "Leeds",
      region: "West Yorkshire",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-leeds-city-ce-2b3778ad-20251019170714.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/vibrant-aerial-shot-sweeping-over-leeds--ce356a74-20251022200645.mp4",
      overview: "Leeds is a dynamic northern city with incredible shopping and legendary nightlife. From designer boutiques to vibrant bars and clubs, it's perfect for hen parties seeking great value and Northern hospitality.",
      quickFacts: {
        fromLondon: "2.5 hours by train",
        bestTime: "Year-round, Summer for rooftop bars",
        nightlife: "Buzzing bars and club scene",
        dining: "International cuisine and trendy restaurants",
        beachAccess: "No beach, canal walks",
        accommodation: "Modern apartments and city centre houses",
        priceRange: "£70-£95 per night",
        activities: "Shopping, cocktail bars, food markets"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Kings Cross (2.5 hours)" },
        { icon: Plane, text: "Leeds Bradford Airport" },
        { icon: Car, text: "M1 motorway from London" },
        { icon: Bus, text: "National Express services from major cities" }
      ],
      nightlife: [
        { name: "Headrow House", description: "Multi-level venue with rooftop terrace", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-headrow-house-bd183f03-20251023164500.jpg" },
        { name: "Belgrave Music Hall", description: "Rooftop bars and live music", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80" },
        { name: "Mint Club", description: "Underground club with top DJs", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80" }
      ],
      brunch: [
        { name: "The Ivy Leeds", description: "Elegant all-day dining", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
        { name: "Pintura", description: "Tapas and bottomless brunch", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "The Man Behind The Curtain", description: "Michelin-starred innovative dining", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Victoria Quarter Shopping", description: "Designer shopping in stunning arcades", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" },
        { name: "Kirkgate Market", description: "Historic covered market", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80" },
        { name: "Royal Armouries", description: "Free museum with arms and armour", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80" }
      ]
    },
    nottingham: {
      name: "Nottingham",
      region: "Nottinghamshire",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-nottingham-ci-c74b1381-20251019170721.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/dynamic-aerial-view-of-nottingham-city-c-fc006cf1-20251022200647.mp4",
      overview: "Nottingham is a historic city with Robin Hood heritage, great nightlife and vibrant atmosphere. With excellent value accommodation and legendary night scene, it's perfect for budget-conscious hen celebrations.",
      quickFacts: {
        fromLondon: "2 hours by train",
        bestTime: "Year-round, famous for nightlife",
        nightlife: "Legendary student and club scene",
        dining: "International restaurants and pubs",
        beachAccess: "No beach, river walks",
        accommodation: "City centre apartments and houses",
        priceRange: "£65-£90 per night",
        activities: "Castle tours, shopping, caves tour"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London St Pancras (2 hours)" },
        { icon: Car, text: "M1 motorway from London" },
        { icon: Bus, text: "National Express services from major cities" },
        { icon: Plane, text: "East Midlands Airport 20 minutes away" }
      ],
      nightlife: [
        { name: "Stealth", description: "Multi-room club with varied music", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-stealth-night-2b473176-20251023164756.jpg" },
        { name: "Hockley Arts Club", description: "Independent music and arts venue", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80" },
        { name: "Tilt", description: "Board game bar and cocktails", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80" }
      ],
      brunch: [
        { name: "The Larder on Goosegate", description: "Bistro and cocktail bar", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
        { name: "Annie's Burger Shack", description: "American-style diner", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "Hart's Restaurant", description: "Fine dining overlooking the park", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Nottingham Castle", description: "Historic castle and museum", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80" },
        { name: "City of Caves", description: "Underground cave network tour", image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80" },
        { name: "Shopping", description: "From Victoria Centre to independent boutiques", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" }
      ]
    },
    sheffield: {
      name: "Sheffield",
      region: "South Yorkshire",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-sheffield-cit-c9093e0d-20251019170737.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/sweeping-aerial-shot-over-sheffield-show-5d5b8f57-20251022200304.mp4",
      overview: "Sheffield is a green city near Peak District with friendly locals and great value. With excellent nightlife, outdoor activities nearby and warm Yorkshire hospitality, it's perfect for adventurous hen celebrations.",
      quickFacts: {
        fromLondon: "2.5 hours by train",
        bestTime: "Year-round, Summer for Peak District",
        nightlife: "Student bars and live music venues",
        dining: "International cuisine and gastropubs",
        beachAccess: "No beach, near Peak District",
        accommodation: "City apartments with great value",
        priceRange: "£60-£85 per night",
        activities: "Peak District walks, climbing, shopping"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London St Pancras (2.5 hours)" },
        { icon: Car, text: "M1 motorway from London" },
        { icon: Bus, text: "National Express services from major cities" },
        { icon: Plane, text: "Doncaster Sheffield Airport" }
      ],
      nightlife: [
        { name: "Corporation", description: "Multi-room rock and alternative club", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-corporation-n-5ef9596b-20251023164944.jpg" },
        { name: "The Leadmill", description: "Iconic live music venue since 1980", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80" },
        { name: "Bloo88", description: "Trendy cocktail bar", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80" }
      ],
      brunch: [
        { name: "Craft & Dough", description: "Pizza and bottomless brunch", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-craft-dough-r-267bd7b2-20251023164945.jpg", link: "#" },
        { name: "Tamper Coffee", description: "Award-winning coffee and brunch", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "Jöro", description: "Michelin-starred tasting menus", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Peak District", description: "Hiking and outdoor adventures", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80" },
        { name: "Kelham Island Quarter", description: "Trendy area with bars and markets", image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80" },
        { name: "Winter Garden", description: "Beautiful indoor botanical garden", image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80" }
      ]
    },
    exeter: {
      name: "Exeter",
      region: "Devon",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-exeter-cathed-62bbdacd-20251019170745.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/cinematic-aerial-view-of-exeter-cathedra-5488dc00-20251022200647.mp4",
      overview: "Exeter is a cathedral city with Roman history and beautiful Devon setting. With historic charm, excellent dining and access to both coast and countryside, it's perfect for relaxed hen celebrations.",
      quickFacts: {
        fromLondon: "2.5 hours by train",
        bestTime: "Spring-Summer for countryside",
        nightlife: "Student bars and historic pubs",
        dining: "Traditional Devon cuisine and cafés",
        beachAccess: "Nearby Devon beaches (20 mins)",
        accommodation: "Period houses and modern apartments",
        priceRange: "£70-£95 per night",
        activities: "Cathedral tours, quayside walks, coastal trips"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Paddington (2.5 hours)" },
        { icon: Car, text: "M5 motorway via Bristol" },
        { icon: Bus, text: "National Express services from London" },
        { icon: Plane, text: "Exeter Airport with UK and European connections" }
      ],
      nightlife: [
        { name: "Timepiece", description: "Multi-level nightclub with varied music", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-timepiece-nig-39ae38b5-20251023165128.jpg" },
        { name: "The Old Firehouse", description: "Quirky bar and events venue", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80" },
        { name: "Vaults", description: "Underground bar in historic vaults", image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80" }
      ],
      brunch: [
        { name: "The Cosy Club", description: "Eclectic dining in converted cinema", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-the-cosy-club-9d99debc-20251023165128.jpg", link: "#" },
        { name: "Lloyd's Kitchen", description: "Contemporary British dining", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "Harry's Restaurant", description: "Fine dining with tasting menus", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Exeter Cathedral", description: "Stunning Gothic cathedral tours", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80" },
        { name: "Quayside", description: "Historic waterfront with restaurants", image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80" },
        { name: "Beach Trips", description: "Visit nearby Devon beaches", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80" }
      ]
    },
    chester: {
      name: "Chester",
      region: "Cheshire",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-chester-city--d1134f79-20251019170752.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/majestic-aerial-shot-gliding-over-cheste-1b776860-20251022200639.mp4",
      overview: "Chester is a Roman walled city with unique shopping and riverside charm. With historic architecture, traditional pubs and excellent shopping, it's perfect for sophisticated hen celebrations.",
      quickFacts: {
        fromLondon: "2.5 hours by train",
        bestTime: "Year-round, Summer for riverside",
        nightlife: "Traditional pubs and cocktail bars",
        dining: "Historic inns and contemporary restaurants",
        beachAccess: "No beach, River Dee walks",
        accommodation: "Historic buildings and modern apartments",
        priceRange: "£75-£100 per night",
        activities: "Roman wall walk, shopping rows, river cruises"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Euston (2.5 hours)" },
        { icon: Car, text: "M6 and M56 motorways" },
        { icon: Bus, text: "National Express services from major cities" },
        { icon: Plane, text: "Liverpool and Manchester airports 30 minutes away" }
      ],
      nightlife: [
        { name: "Off The Wall", description: "Atmospheric cocktail bar", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80" },
        { name: "Cruise", description: "Stylish bar and nightclub", image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80" },
        { name: "The Suburbs", description: "Live music and entertainment venue", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80" }
      ],
      brunch: [
        { name: "The Architect", description: "Modern British dining", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
        { name: "Sticky Walnut", description: "Neighbourhood bistro", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "Simon Radley", description: "Michelin-starred fine dining", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Chester Rows", description: "Unique two-level shopping galleries", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" },
        { name: "Roman Walls Walk", description: "2-mile walk around ancient walls", image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80" },
        { name: "River Dee Cruise", description: "Relaxing boat tours", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80" }
      ]
    },
    durham: {
      name: "Durham",
      region: "County Durham",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-durham-cathed-5ca6e566-20251019170759.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/sweeping-aerial-view-of-durham-cathedral-adaab2bf-20251022200316.mp4",
      overview: "Durham is a UNESCO World Heritage site with stunning cathedral and historic university. With medieval charm, riverside walks and excellent value, it's perfect for cultured hen celebrations.",
      quickFacts: {
        fromLondon: "3 hours by train",
        bestTime: "Year-round, Spring for gardens",
        nightlife: "Student bars and traditional pubs",
        dining: "Historic inns and contemporary restaurants",
        beachAccess: "Durham beaches 20 minutes away",
        accommodation: "Historic buildings and riverside houses",
        priceRange: "£65-£90 per night",
        activities: "Cathedral tours, river walks, castle visit"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Kings Cross (3 hours)" },
        { icon: Car, text: "A1(M) motorway from London" },
        { icon: Bus, text: "National Express services from major cities" },
        { icon: Plane, text: "Newcastle Airport 30 minutes away" }
      ],
      nightlife: [
        { name: "The Garden House", description: "Student union venue with club nights", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-the-garden-ho-cecf04e5-20251024134102.jpg" },
        { name: "Klute", description: "Famous student nightclub", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80" },
        { name: "Slug and Lettuce", description: "Bar with cocktails and music", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80" }
      ],
      brunch: [
        { name: "The Cellar Door", description: "Contemporary dining", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
        { name: "The Rabbit Hole", description: "Quirky café and cocktail bar", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "Finbarr's", description: "Irish restaurant and bar", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Durham Cathedral", description: "Stunning Norman cathedral", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80" },
        { name: "Durham Castle", description: "University college in Norman castle", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80" },
        { name: "River Wear Walk", description: "Scenic riverside paths", image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80" }
      ]
    },
    canterbury: {
      name: "Canterbury",
      region: "Kent",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-canterbury-ca-dca05dc1-20251019170811.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/aerial-establishing-shot-of-canterbury-s-b3d925e4-20251022200652.mp4",
      overview: "Canterbury is a medieval city with famous cathedral and cobbled streets. With historic charm, independent shops and traditional tea rooms, it's perfect for elegant hen celebrations.",
      quickFacts: {
        fromLondon: "1 hour by train",
        bestTime: "Year-round, Summer for gardens",
        nightlife: "Traditional pubs and cocktail bars",
        dining: "Historic inns and contemporary restaurants",
        beachAccess: "Whitstable beach 20 minutes away",
        accommodation: "Period buildings and modern apartments",
        priceRange: "£75-£100 per night",
        activities: "Cathedral tours, river punting, afternoon tea"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London St Pancras (1 hour)" },
        { icon: Car, text: "M2 and A2 from London (1.5 hours)" },
        { icon: Bus, text: "National Express services from London Victoria" },
        { icon: Plane, text: "London Gatwick 1.5 hours away" }
      ],
      nightlife: [
        { name: "The Foundry", description: "Brewery bar with craft beers", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80" },
        { name: "Club Chemistry", description: "Student nightclub", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80" },
        { name: "The Ballroom", description: "Art deco cocktail bar", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80" }
      ],
      brunch: [
        { name: "The Goods Shed", description: "Farmers' market and restaurant", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
        { name: "Deeson's", description: "British seasonal dining", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "Café du Soleil", description: "French bistro charm", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Canterbury Cathedral", description: "UNESCO World Heritage site", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80" },
        { name: "River Punting", description: "Traditional punt tours", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80" },
        { name: "Medieval Shopping", description: "Independent boutiques in historic lanes", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" }
      ]
    },
    blackpool: {
      name: "Blackpool",
      region: "Lancashire",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-blackpool-tow-64085652-20251019170818.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/vibrant-aerial-view-of-blackpool-seafron-f56dc062-20251022200306.mp4",
      overview: "Blackpool is a classic seaside resort with famous tower and lively entertainment. With beach fun, amusement rides and vibrant nightlife, it's perfect for fun-filled hen celebrations.",
      quickFacts: {
        fromLondon: "3 hours by train",
        bestTime: "Summer for beach and attractions",
        nightlife: "Promenade bars and entertainment venues",
        dining: "Classic seaside and international restaurants",
        beachAccess: "Long sandy promenade beach",
        accommodation: "Seafront hotels and holiday apartments",
        priceRange: "£60-£85 per night",
        activities: "Pleasure Beach, Tower, beach, shows"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Euston (3 hours)" },
        { icon: Car, text: "M6 and M55 motorways" },
        { icon: Bus, text: "National Express services from major cities" },
        { icon: Plane, text: "Blackpool Airport and Manchester Airport nearby" }
      ],
      nightlife: [
        { name: "Funny Girls", description: "Famous cabaret and drag shows", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-funny-girls-c-77af8830-20251024134341.jpg" },
        { name: "The Syndicate", description: "Multi-room nightclub", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80" },
        { name: "Promenade Bars", description: "Seafront entertainment venues", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80" }
      ],
      brunch: [
        { name: "The Dining Room", description: "Fine dining in hotel", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
        { name: "Number Five", description: "Contemporary café and bistro", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "The Beach House", description: "Seafront dining", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Blackpool Tower", description: "Iconic tower with attractions", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80" },
        { name: "Pleasure Beach", description: "Theme park with rides", image: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80" },
        { name: "Beach Promenade", description: "Golden mile entertainment", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80" }
      ]
    },
    cotswolds: {
      name: "Cotswolds",
      region: "South West England",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-cotswolds-cou-81699b79-20251019170824.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/sweeping-aerial-drone-shot-over-pictures-d843fa0c-20251022200636.mp4",
      overview: "The Cotswolds offers picturesque villages and luxury country retreats. With rolling hills, charming stone cottages and peaceful countryside, it's perfect for relaxing hen celebrations in stunning rural settings.",
      quickFacts: {
        fromLondon: "2 hours by car",
        bestTime: "Spring-Summer for countryside",
        nightlife: "Cosy country pubs",
        dining: "Gastropubs and country hotels",
        beachAccess: "No beach, rolling countryside",
        accommodation: "Luxury country houses and manor houses",
        priceRange: "£90-£130 per night",
        activities: "Village walks, spa treatments, afternoon tea"
      },
      gettingThere: [
        { icon: Train, text: "Train to Moreton-in-Marsh or Cheltenham, then taxi" },
        { icon: Car, text: "M40 and A40 from London (2 hours)" },
        { icon: Bus, text: "Limited coach services to main towns" },
        { icon: Plane, text: "Bristol or Birmingham airports" }
      ],
      nightlife: [
        { name: "The Wild Rabbit", description: "Country inn with local ales", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80" },
        { name: "The Kingham Plough", description: "Award-winning gastropub", image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80" },
        { name: "The Feathered Nest", description: "Historic country pub", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80" }
      ],
      brunch: [
        { name: "The Potting Shed Pub", description: "Garden restaurant at Barnsley House", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
        { name: "The Swan at Bibury", description: "Riverside hotel dining", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "Daylesford Farmshop", description: "Organic café and farm shop", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Village Tours", description: "Explore picturesque Cotswolds villages", image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80" },
        { name: "Spa Treatments", description: "Luxury spa experiences", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80" },
        { name: "Country Walks", description: "Scenic walking trails", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80" }
      ]
    },
    margate: {
      name: "Margate",
      region: "Kent",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-margate-seafr-9f3138d3-20251019170830.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/cinematic-aerial-view-of-margate-seaside-63a5e6fe-20251022200651.mp4",
      overview: "Margate is a trendy seaside town with sandy beaches and creative vibe. With vintage shops, art galleries and vibrant atmosphere, it's perfect for bohemian hen celebrations.",
      quickFacts: {
        fromLondon: "1.5 hours by train",
        bestTime: "Summer for beach weather",
        nightlife: "Quirky bars and beach venues",
        dining: "Independent restaurants and seafood",
        beachAccess: "Beautiful sandy main beach",
        accommodation: "Seafront apartments and beach houses",
        priceRange: "£70-£95 per night",
        activities: "Beach, vintage shopping, art galleries"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London St Pancras (1.5 hours)" },
        { icon: Car, text: "M2 and A299 from London (2 hours)" },
        { icon: Bus, text: "National Express services from London Victoria" },
        { icon: Plane, text: "London Gatwick 2 hours away" }
      ],
      nightlife: [
        { name: "The Lighthouse Bar", description: "Seafront cocktail bar", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-the-lighthous-c2deb5ed-20251024134657.jpg" },
        { name: "The Cuban Bar", description: "Latin-inspired cocktails and music", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80" },
        { name: "The Spread Eagle", description: "Historic pub with live music", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80" }
      ],
      brunch: [
        { name: "The Ambrette", description: "Award-winning Indian fusion", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
        { name: "Hantverk & Found", description: "Nordic café and design shop", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "GB Pizza Co.", description: "Sourdough pizzas and small plates", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Main Sands Beach", description: "Beautiful sandy beach", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80" },
        { name: "Turner Contemporary", description: "Free art gallery", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-turner-contem-24973ad3-20251024134700.jpg" },
        { name: "Vintage Shopping", description: "Retro and vintage boutiques", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" }
      ]
    },
    harrogate: {
      name: "Harrogate",
      region: "North Yorkshire",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-harrogate-tow-ef6ad8e6-20251019170838.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/elegant-aerial-shot-gliding-over-harroga-41e2b757-20251022200650.mp4",
      overview: "Harrogate is an elegant spa town with beautiful gardens and afternoon tea. With boutique shopping, Turkish baths and refined atmosphere, it's perfect for sophisticated hen celebrations.",
      quickFacts: {
        fromLondon: "2.5 hours by train",
        bestTime: "Year-round, Spring for gardens",
        nightlife: "Sophisticated cocktail bars",
        dining: "Fine dining and traditional tea rooms",
        beachAccess: "No beach, spa town heritage",
        accommodation: "Victorian townhouses and boutique hotels",
        priceRange: "£80-£110 per night",
        activities: "Turkish baths, gardens, afternoon tea, shopping"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Kings Cross (2.5 hours)" },
        { icon: Car, text: "A1(M) motorway from London" },
        { icon: Bus, text: "National Express services from major cities" },
        { icon: Plane, text: "Leeds Bradford Airport 20 minutes away" }
      ],
      nightlife: [
        { name: "The Ivy Harrogate", description: "Elegant bar and restaurant", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80" },
        { name: "Hobo", description: "Stylish cocktail bar", image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80" },
        { name: "The Winter Gardens", description: "Historic venue with events", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80" }
      ],
      brunch: [
        { name: "Bettys Tea Rooms", description: "Iconic traditional afternoon tea", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
        { name: "Orchid Restaurant", description: "Pan-Asian fine dining", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "West Park Hotel", description: "Elegant hotel dining", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Turkish Baths", description: "Victorian spa experience", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80" },
        { name: "Valley Gardens", description: "Beautiful botanical gardens", image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80" },
        { name: "Boutique Shopping", description: "Independent shops and boutiques", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" }
      ]
    },
    "st-ives": {
      name: "St Ives",
      region: "Cornwall",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-st-ives-harbo-608d18b9-20251019170846.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/beautiful-aerial-view-of-st-ives-harbor--7d3d7780-20251022200308.mp4",
      overview: "St Ives offers stunning harbour with golden beaches and artistic charm. With seafood restaurants, art galleries and coastal walks, it's perfect for picturesque hen celebrations.",
      quickFacts: {
        fromLondon: "5 hours by train",
        bestTime: "Summer for beach weather",
        nightlife: "Beach bars and harbour pubs",
        dining: "Fresh seafood and beachfront dining",
        beachAccess: "Multiple golden sandy beaches",
        accommodation: "Harbour-view cottages and beach houses",
        priceRange: "£85-£115 per night",
        activities: "Beaches, art galleries, coastal walks, boat trips"
      },
      gettingThere: [
        { icon: Train, text: "Train to St Ives via Plymouth and Penzance (5 hours)" },
        { icon: Plane, text: "Newquay Cornwall Airport" },
        { icon: Car, text: "A30 via Exeter (5-6 hours from London)" },
        { icon: Bus, text: "National Express to Penzance, then local bus" }
      ],
      nightlife: [
        { name: "The Hub", description: "Live music and harbourside venue", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80" },
        { name: "The Sloop Inn", description: "Historic harbourside pub", image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80" },
        { name: "The Lifeboat Inn", description: "Beach bar with views", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80" }
      ],
      brunch: [
        { name: "Porthminster Beach Café", description: "Beachfront seafood dining", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
        { name: "The Seafood Café", description: "Fresh catch of the day", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "Blas Burgerworks", description: "Gourmet burgers with sea views", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Porthminster Beach", description: "Beautiful golden sand beach", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80" },
        { name: "Tate St Ives", description: "Modern art gallery", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-architectural-photograph-of-5c0f6123-20251024135527.jpg" },
        { name: "Coastal Path Walk", description: "Stunning clifftop walks", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-stunning-sout-ab875efe-20251024135526.jpg" }
      ]
    },
    windsor: {
      name: "Windsor",
      region: "Berkshire",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-windsor-castl-304247da-20251019170853.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/majestic-aerial-shot-of-windsor-castle-a-a25a4427-20251022200307.mp4",
      overview: "Windsor is a royal town with historic castle and Thames-side elegance. With royal heritage, riverside walks and elegant hotels, it's perfect for regal hen celebrations.",
      quickFacts: {
        fromLondon: "45 minutes by train",
        bestTime: "Year-round, Summer for river",
        nightlife: "Elegant bars and riverside pubs",
        dining: "Fine dining and traditional tea rooms",
        beachAccess: "No beach, Thames riverside",
        accommodation: "Historic hotels and riverside houses",
        priceRange: "£90-£125 per night",
        activities: "Castle tours, river cruises, afternoon tea, shopping"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Waterloo or Paddington (45 mins)" },
        { icon: Car, text: "M4 and M25 from London (1 hour)" },
        { icon: Bus, text: "Green Line coaches from London" },
        { icon: Plane, text: "Heathrow Airport 20 minutes away" }
      ],
      nightlife: [
        { name: "The Ivy Windsor Brasserie", description: "Sophisticated dining and cocktails", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80" },
        { name: "Gilbey's Bar", description: "Wine bar in historic building", image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80" },
        { name: "The Boatman", description: "Riverside pub", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80" }
      ],
      brunch: [
        { name: "The Drawing Room", description: "Afternoon tea at Oakley Court", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
        { name: "Bel & The Dragon", description: "Contemporary dining", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "The Duchess of Cambridge", description: "Traditional British pub", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Windsor Castle", description: "Royal residence tours", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-windsor-castl-339f0a4d-20251024135809.jpg" },
        { name: "Thames River Cruise", description: "Boat trips along the river", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-thames-river--8b114eaa-20251024135809.jpg" },
        { name: "Windsor Great Park", description: "Royal parkland walks", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-landscape-photograph-of-win-7dd82fc8-20251024135809.jpg" }
      ]
    },
    "stratford-upon-avon": {
      name: "Stratford-upon-Avon",
      region: "Warwickshire",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-stratford-upo-660c5853-20251019170900.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/cinematic-aerial-view-of-stratford-upon--964f6188-20251022200418.mp4",
      overview: "Stratford-upon-Avon is Shakespeare's birthplace with Tudor buildings and theatre. With literary heritage, riverside walks and charming market town atmosphere, it's perfect for cultured hen celebrations.",
      quickFacts: {
        fromLondon: "2 hours by train",
        bestTime: "Year-round, Summer for outdoor theatre",
        nightlife: "Traditional pubs and wine bars",
        dining: "Tudor-style inns and contemporary restaurants",
        beachAccess: "No beach, River Avon",
        accommodation: "Historic buildings and riverside houses",
        priceRange: "£80-£105 per night",
        activities: "Theatre, Shakespeare tours, river walks"
      },
      gettingThere: [
        { icon: Train, text: "Trains from London Marylebone via Birmingham (2 hours)" },
        { icon: Car, text: "M40 motorway from London (2 hours)" },
        { icon: Bus, text: "National Express services from London" },
        { icon: Plane, text: "Birmingham Airport 40 minutes away" }
      ],
      nightlife: [
        { name: "The Dirty Duck", description: "Traditional actors' pub", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80" },
        { name: "The Vintner", description: "Wine bar and bistro", image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80" },
        { name: "Cox's Yard", description: "Riverside bars and entertainment", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80" }
      ],
      brunch: [
        { name: "The Opposition Bistro", description: "Contemporary dining", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
        { name: "The Townhouse", description: "Boutique hotel restaurant", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "Lambs", description: "Fine dining in Tudor building", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Royal Shakespeare Theatre", description: "World-class theatre performances", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-the-royal-sha-cb0520ba-20251024140754.jpg" },
        { name: "Shakespeare's Birthplace", description: "Historic house museum", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-shakespeare-s-630aa4bc-20251024140755.jpg" },
        { name: "River Avon Walk", description: "Scenic riverside paths", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-landscape-photograph-of-riv-a4e07409-20251024140754.jpg" }
      ]
    },
    plymouth: {
      name: "Plymouth",
      region: "Devon",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-pley-14909bf-20251019170907.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/sweeping-aerial-shot-over-plymouth-water-a6fb3dc4-20251022200314.mp4",
      overview: "Plymouth is a historic waterfront city with maritime heritage and coastal views. With naval history, harbour walks and nearby beaches, it's perfect for coastal hen celebrations.",
      quickFacts: {
        fromLondon: "3.5 hours by train",
        bestTime: "Summer for waterfront",
        nightlife: "Waterfront bars and student venues",
        dining: "Fresh seafood and harbour restaurants",
        beachAccess: "Nearby beaches and coastline",
        accommodation: "Waterfront apartments and houses",
        priceRange: "£70-£95 per night",
        activities: "Harbour walks, aquarium, coastal trips"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Paddington (3.5 hours)" },
        { icon: Car, text: "A38 via Exeter from M5" },
        { icon: Bus, text: "National Express services from London" },
        { icon: Plane, text: "Exeter Airport 1 hour away" }
      ],
      nightlife: [
        { name: "Barbican venues", description: "Historic waterfront bars", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-historic-plym-8a7d2159-20251024141736.jpg" },
        { name: "Pryzm", description: "Large nightclub with multiple rooms", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-pryzm-nightcl-acfb3c5e-20251024141737.jpg" },
        { name: "The Treasury", description: "Cocktail bar in former bank", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-the-treasury--7d2b6855-20251024141737.jpg" }
      ],
      brunch: [
        { name: "The Stable", description: "Cider and pizza restaurant", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
        { name: "Supha's Street Food", description: "Thai street food", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "The Boathouse", description: "Waterfront dining", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "The Barbican", description: "Historic harbour area", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-plymouth-barb-9c3e104f-20251024141737.jpg" },
        { name: "National Marine Aquarium", description: "UK's largest aquarium", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-national-mari-623e1ca6-20251024141736.jpg" },
        { name: "Coastal Walks", description: "South West Coast Path", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-landscape-photograph-of-sou-b24d00e7-20251024141736.jpg" }
      ]
    },
    cheltenham: {
      name: "Cheltenham",
      region: "Gloucestershire",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-cheltenham-to-be3b5273-20251019170915.jpg",
      video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_videos/sweeping-cinematic-aerial-drone-shot-ove-5f97556f-20251024142038.mp4",
      overview: "Cheltenham is a Regency spa town famous for festivals and elegant architecture. With horse racing heritage, beautiful gardens and sophisticated atmosphere, it's perfect for refined hen celebrations.",
      quickFacts: {
        fromLondon: "2 hours by train",
        bestTime: "Year-round, March for racing festival",
        nightlife: "Wine bars and cocktail venues",
        dining: "Fine dining and gastro pubs",
        beachAccess: "No beach, Cotswolds countryside",
        accommodation: "Regency townhouses and boutique hotels",
        priceRange: "£85-£110 per night",
        activities: "Racing, gardens, shopping, spa treatments"
      },
      gettingThere: [
        { icon: Train, text: "Direct trains from London Paddington (2 hours)" },
        { icon: Car, text: "M5 motorway via Gloucester" },
        { icon: Bus, text: "National Express services from London" },
        { icon: Plane, text: "Bristol and Birmingham airports nearby" }
      ],
      nightlife: [
        { name: "Subtone", description: "Cocktail bar and nightclub", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-subtone-night-c6240747-20251024142019.jpg" },
        { name: "The Scandinavian Coffee Pod", description: "Quirky bar and café", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-the-scandinav-c41ac42a-20251024142016.jpg" },
        { name: "Moo Moo", description: "Stylish wine and cocktail bar", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-moo-moo-cockt-6212ce3f-20251024142020.jpg" }
      ],
      brunch: [
        { name: "The Ivy Montpellier Brasserie", description: "Elegant all-day dining", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80", link: "#" },
        { name: "Le Champignon Sauvage", description: "Michelin-starred French cuisine", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", link: "#" },
        { name: "The Coconut Tree", description: "Sri Lankan street food", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", link: "#" }
      ],
      activities: [
        { name: "Cheltenham Racecourse", description: "Horse racing events", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-cheltenham-ra-d060cd8b-20251024142016.jpg" },
        { name: "Montpellier District", description: "Shopping and wine bars", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-montpellier-d-b724c78f-20251024142018.jpg" },
        { name: "Pittville Pump Room", description: "Regency spa building and park", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-architectural-photograph-of-d946dcb9-20251024142018.jpg" }
      ]
    }
  };

  // Location-specific properties
  const propertiesByLocation: Record<string, any[]> = {
    london: [
      {
        id: "1",
        title: "The Kensington Residence",
        location: "London, Greater London",
        sleeps: 20,
        bedrooms: 10,
        priceFrom: 120,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-lu-82828771-20251019163638.jpg",
        features: ["Hot Tub", "Cinema Room", "Roof Terrace"],
        slug: "kensington-residence",
      },
      {
        id: "2",
        title: "Shoreditch Loft House",
        location: "London, Greater London",
        sleeps: 16,
        bedrooms: 8,
        priceFrom: 105,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-an-i-60588db0-20251019163645.jpg",
        features: ["Games Room", "City Views", "Hot Tub"],
        slug: "shoreditch-loft",
      },
      {
        id: "3",
        title: "Chelsea Manor House",
        location: "London, Greater London",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 98,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-an-e-053848fb-20251019163658.jpg",
        features: ["Garden", "Hot Tub", "Parking"],
        slug: "chelsea-manor",
      },
    ],
    manchester: [
      {
        id: "1",
        title: "Northern Quarter House",
        location: "Manchester, Greater Manchester",
        sleeps: 18,
        bedrooms: 9,
        priceFrom: 85,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-co-351421dc-20251019163711.jpg",
        features: ["Hot Tub", "Games Room", "City Centre"],
        slug: "northern-quarter-house",
      },
      {
        id: "2",
        title: "Deansgate Apartment",
        location: "Manchester, Greater Manchester",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 75,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-lu-9926ea92-20251019163718.jpg",
        features: ["Roof Terrace", "BBQ", "Parking"],
        slug: "deansgate-apartment",
      },
      {
        id: "3",
        title: "Castlefield Warehouse",
        location: "Manchester, Greater Manchester",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 68,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-co-28d24ba1-20251019163727.jpg",
        features: ["Hot Tub", "Industrial Style", "Canal Views"],
        slug: "castlefield-warehouse",
      },
    ],
    york: [
      {
        id: "1",
        title: "The York Minster House",
        location: "York, North Yorkshire",
        sleeps: 16,
        bedrooms: 8,
        priceFrom: 92,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-hi-bf770839-20251019163816.jpg",
        features: ["Hot Tub", "Garden", "Historic"],
        slug: "york-minister-house",
      },
      {
        id: "2",
        title: "Shambles Townhouse",
        location: "York, North Yorkshire",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 78,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-ch-1c701d93-20251019163822.jpg",
        features: ["City Centre", "Period Features", "Parking"],
        slug: "shambles-townhouse",
      },
      {
        id: "3",
        title: "The Roman Villa",
        location: "York, North Yorkshire",
        sleeps: 10,
        bedrooms: 5,
        priceFrom: 72,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-st-7602731a-20251019163831.jpg",
        features: ["Hot Tub", "Garden", "BBQ"],
        slug: "roman-villa-york",
      },
    ],
    cardiff: [
      {
        id: "1",
        title: "Cardiff Bay House",
        location: "Cardiff, South Wales",
        sleeps: 18,
        bedrooms: 9,
        priceFrom: 82,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-lu-e34312f0-20251019163838.jpg",
        features: ["Hot Tub", "Bay Views", "Games Room"],
        slug: "cardiff-bay-house",
      },
      {
        id: "2",
        title: "Cathedral Quarter Residence",
        location: "Cardiff, South Wales",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 70,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-an-e-c05d8b9a-20251019163846.jpg",
        features: ["City Centre", "Hot Tub", "Roof Terrace"],
        slug: "cathedral-quarter",
      },
      {
        id: "3",
        title: "Pontcanna Villa",
        location: "Cardiff, South Wales",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 65,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-tr-e206e578-20251019163854.jpg",
        features: ["Garden", "BBQ", "Parking"],
        slug: "pontcanna-villa",
      },
    ],
    brighton: [
      {
        id: "1",
        title: "The Brighton Manor",
        location: "Brighton, East Sussex",
        sleeps: 16,
        bedrooms: 8,
        priceFrom: 89,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-gr-18e00f17-20251019163902.jpg",
        features: ["Hot Tub", "Pool", "Games Room"],
        slug: "brighton-manor",
      },
      {
        id: "2",
        title: "Brighton Seafront Villa",
        location: "Brighton, East Sussex",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 79,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-st-87e31c86-20251019163913.jpg",
        features: ["Sea View", "Hot Tub", "BBQ"],
        slug: "brighton-villa",
      },
      {
        id: "3",
        title: "The Lanes Townhouse",
        location: "Brighton, East Sussex",
        sleeps: 10,
        bedrooms: 5,
        priceFrom: 69,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-an-e-89ca9be8-20251019163920.jpg",
        features: ["City Centre", "Roof Terrace"],
        slug: "lanes-townhouse",
      },
    ],
    newcastle: [
      {
        id: "1",
        title: "The Quayside Residence",
        location: "Newcastle, Tyne and Wear",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 79,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-co-77b74508-20251019163928.jpg",
        features: ["Hot Tub", "Games Room", "City Views"],
        slug: "quayside-residence",
      },
      {
        id: "2",
        title: "Ouseburn Valley House",
        location: "Newcastle, Tyne and Wear",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 69,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-co-18512d03-20251019163938.jpg",
        features: ["Hot Tub", "BBQ", "Parking"],
        slug: "ouseburn-house",
      },
      {
        id: "3",
        title: "Tyne Bridge Loft",
        location: "Newcastle, Tyne and Wear",
        sleeps: 10,
        bedrooms: 5,
        priceFrom: 59,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-mo-855c1f42-20251019163946.jpg",
        features: ["City Centre", "Modern", "Roof Terrace"],
        slug: "tyne-bridge-loft",
      },
    ],
    bath: [
      {
        id: "1",
        title: "The Royal Crescent Manor",
        location: "Bath, Somerset",
        sleeps: 16,
        bedrooms: 8,
        priceFrom: 109,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-gr-c3e80ad2-20251019163958.jpg",
        features: ["Hot Tub", "Gardens", "Historic"],
        slug: "royal-crescent-manor",
      },
      {
        id: "2",
        title: "Bath Spa Townhouse",
        location: "Bath, Somerset",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 89,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-an-e-8601b6de-20251019164005.jpg",
        features: ["Hot Tub", "City Centre", "Georgian"],
        slug: "bath-spa-townhouse",
      },
      {
        id: "3",
        title: "Pulteney Bridge House",
        location: "Bath, Somerset",
        sleeps: 10,
        bedrooms: 5,
        priceFrom: 79,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-lu-98c82857-20251019164016.jpg",
        features: ["River Views", "Period Features", "Central"],
        slug: "pulteney-bridge-house",
      },
    ],
    bournemouth: [
      {
        id: "1",
        title: "Bournemouth Beach House",
        location: "Bournemouth, Dorset",
        sleeps: 16,
        bedrooms: 8,
        priceFrom: 95,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-st-042fd885-20251019164023.jpg",
        features: ["Hot Tub", "Beach Access", "Games Room"],
        slug: "bournemouth-beach-house",
      },
      {
        id: "2",
        title: "Clifftop Retreat",
        location: "Bournemouth, Dorset",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 85,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-an-e-8ca07f6a-20251019164030.jpg",
        features: ["Sea View", "Hot Tub", "Parking"],
        slug: "clifftop-retreat",
      },
      {
        id: "3",
        title: "The Sandbanks Villa",
        location: "Bournemouth, Dorset",
        sleeps: 10,
        bedrooms: 5,
        priceFrom: 75,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-mo-5886e798-20251019164036.jpg",
        features: ["Beach Views", "Modern", "BBQ"],
        slug: "sandbanks-villa",
      },
    ],
    liverpool: [
      {
        id: "1",
        title: "Albert Dock Warehouse",
        location: "Liverpool, Merseyside",
        sleeps: 18,
        bedrooms: 9,
        priceFrom: 88,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-lu-4365bdeb-20251019193601.jpg",
        features: ["Hot Tub", "Waterfront Views", "Games Room"],
        slug: "albert-dock-warehouse",
      },
      {
        id: "2",
        title: "Cavern Quarter House",
        location: "Liverpool, Merseyside",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 78,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-ge-2ab8031f-20251019193610.jpg",
        features: ["City Centre", "Hot Tub", "Roof Terrace"],
        slug: "cavern-quarter-house",
      },
      {
        id: "3",
        title: "Georgian Liverpool Villa",
        location: "Liverpool, Merseyside",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 68,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-co-dcc45b8e-20251019193618.jpg",
        features: ["Period Features", "Garden", "Parking"],
        slug: "georgian-liverpool-villa",
      },
    ],
    birmingham: [
      {
        id: "1",
        title: "Canal Quarter Loft",
        location: "Birmingham, West Midlands",
        sleeps: 16,
        bedrooms: 8,
        priceFrom: 82,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-mo-bb4a26f2-20251019193626.jpg",
        features: ["Hot Tub", "Canal Views", "Modern"],
        slug: "canal-quarter-loft",
      },
      {
        id: "2",
        title: "Jewellery Quarter House",
        location: "Birmingham, West Midlands",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 72,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-vi-022c6c8f-20251019193634.jpg",
        features: ["Historic", "Hot Tub", "City Centre"],
        slug: "jewellery-quarter-house",
      },
      {
        id: "3",
        title: "Digbeth Warehouse",
        location: "Birmingham, West Midlands",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 65,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-an-i-1fc2be7f-20251019193642.jpg",
        features: ["Industrial Style", "Games Room", "Parking"],
        slug: "digbeth-warehouse",
      },
    ],
    newquay: [
      {
        id: "1",
        title: "Fistral Beach House",
        location: "Newquay, Cornwall",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 85,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-lu-5ec76d4f-20251019193650.jpg",
        features: ["Hot Tub", "Beach Views", "Surf Boards"],
        slug: "fistral-beach-house",
      },
      {
        id: "2",
        title: "Coastal Surf Villa",
        location: "Newquay, Cornwall",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 75,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-co-573b6e40-20251019193657.jpg",
        features: ["Hot Tub", "Ocean Views", "BBQ"],
        slug: "coastal-surf-villa",
      },
      {
        id: "3",
        title: "The Boardwalk House",
        location: "Newquay, Cornwall",
        sleeps: 10,
        bedrooms: 5,
        priceFrom: 68,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-mo-990f735b-20251019193704.jpg",
        features: ["Beach Access", "Modern", "Parking"],
        slug: "boardwalk-house",
      },
    ],
    "lake-district": [
      {
        id: "1",
        title: "Windermere Lakeside House",
        location: "Lake District, Cumbria",
        sleeps: 16,
        bedrooms: 8,
        priceFrom: 105,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-lu-b461b168-20251019193711.jpg",
        features: ["Hot Tub", "Lake Views", "Gardens"],
        slug: "windermere-lakeside",
      },
      {
        id: "2",
        title: "Mountain View Lodge",
        location: "Lake District, Cumbria",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 92,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-mo-d0f3779c-20251019193718.jpg",
        features: ["Hot Tub", "Mountain Views", "Fireplace"],
        slug: "mountain-view-lodge",
      },
      {
        id: "3",
        title: "Ambleside Retreat",
        location: "Lake District, Cumbria",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 82,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-la-74487299-20251019193728.jpg",
        features: ["Hot Tub", "Gardens", "Parking"],
        slug: "ambleside-retreat",
      },
    ],
    bristol: [
      {
        id: "1",
        title: "Harbourside Warehouse",
        location: "Bristol, South West England",
        sleeps: 16,
        bedrooms: 8,
        priceFrom: 89,
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
        features: ["Hot Tub", "Harbour Views", "Games Room"],
        slug: "harbourside-warehouse",
      },
      {
        id: "2",
        title: "Clifton Village House",
        location: "Bristol, South West England",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 78,
        image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
        features: ["Hot Tub", "Garden", "Village Setting"],
        slug: "clifton-village-house",
      },
      {
        id: "3",
        title: "Bristol City Loft",
        location: "Bristol, South West England",
        sleeps: 10,
        bedrooms: 5,
        priceFrom: 69,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
        features: ["City Centre", "Modern", "Roof Terrace"],
        slug: "bristol-city-loft",
      },
    ],
    cambridge: [
      {
        id: "1",
        title: "Cambridge College House",
        location: "Cambridge, Cambridgeshire",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 92,
        image: "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=800&q=80",
        features: ["Hot Tub", "Gardens", "Historic"],
        slug: "cambridge-college-house",
      },
      {
        id: "2",
        title: "River Cam Villa",
        location: "Cambridge, Cambridgeshire",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 82,
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
        features: ["River Views", "Hot Tub", "Parking"],
        slug: "river-cam-villa",
      },
      {
        id: "3",
        title: "Cambridge City Residence",
        location: "Cambridge, Cambridgeshire",
        sleeps: 10,
        bedrooms: 5,
        priceFrom: 75,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        features: ["City Centre", "Modern", "BBQ"],
        slug: "cambridge-city-residence",
      },
    ],
    oxford: [
      {
        id: "1",
        title: "Oxford Spires House",
        location: "Oxford, Oxfordshire",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 95,
        image: "https://images.unsplash.com/photo-1547516508-4c1f9c7c4ec3?w=800&q=80",
        features: ["Hot Tub", "Gardens", "Historic"],
        slug: "oxford-spires-house",
      },
      {
        id: "2",
        title: "Jericho Quarter Villa",
        location: "Oxford, Oxfordshire",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 85,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        features: ["Hot Tub", "City Views", "Parking"],
        slug: "jericho-quarter-villa",
      },
      {
        id: "3",
        title: "Oxford City Townhouse",
        location: "Oxford, Oxfordshire",
        sleeps: 10,
        bedrooms: 5,
        priceFrom: 78,
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
        features: ["City Centre", "Period Features", "Garden"],
        slug: "oxford-city-townhouse",
      },
    ],
    leeds: [
      {
        id: "1",
        title: "Leeds City Loft",
        location: "Leeds, West Yorkshire",
        sleeps: 16,
        bedrooms: 8,
        priceFrom: 82,
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
        features: ["Hot Tub", "City Views", "Games Room"],
        slug: "leeds-city-loft",
      },
      {
        id: "2",
        title: "Chapel Allerton House",
        location: "Leeds, West Yorkshire",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 72,
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        features: ["Hot Tub", "Garden", "Parking"],
        slug: "chapel-allerton-house",
      },
      {
        id: "3",
        title: "Leeds Warehouse",
        location: "Leeds, West Yorkshire",
        sleeps: 10,
        bedrooms: 5,
        priceFrom: 65,
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
        features: ["Industrial Style", "Modern", "City Centre"],
        slug: "leeds-warehouse",
      },
    ],
    nottingham: [
      {
        id: "1",
        title: "Nottingham Castle House",
        location: "Nottingham, Nottinghamshire",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 78,
        image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
        features: ["Hot Tub", "Gardens", "Games Room"],
        slug: "nottingham-castle-house",
      },
      {
        id: "2",
        title: "Lace Market Loft",
        location: "Nottingham, Nottinghamshire",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 68,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        features: ["Hot Tub", "City Centre", "Historic"],
        slug: "lace-market-loft",
      },
      {
        id: "3",
        title: "Park Estate Villa",
        location: "Nottingham, Nottinghamshire",
        sleeps: 10,
        bedrooms: 5,
        priceFrom: 59,
        image: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80",
        features: ["Garden", "BBQ", "Parking"],
        slug: "park-estate-villa",
      },
    ],
    sheffield: [
      {
        id: "1",
        title: "Sheffield Steel House",
        location: "Sheffield, South Yorkshire",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 75,
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
        features: ["Hot Tub", "Games Room", "City Views"],
        slug: "sheffield-steel-house",
      },
      {
        id: "2",
        title: "Peak View Lodge",
        location: "Sheffield, South Yorkshire",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 65,
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        features: ["Hot Tub", "Mountain Views", "Garden"],
        slug: "peak-view-lodge",
      },
      {
        id: "3",
        title: "Kelham Island Warehouse",
        location: "Sheffield, South Yorkshire",
        sleeps: 10,
        bedrooms: 5,
        priceFrom: 58,
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
        features: ["Industrial Style", "Hot Tub", "Parking"],
        slug: "kelham-island-warehouse",
      },
    ],
    exeter: [
      {
        id: "1",
        title: "Exeter Cathedral House",
        location: "Exeter, Devon",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 82,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        features: ["Hot Tub", "Gardens", "Historic"],
        slug: "exeter-cathedral-house",
      },
      {
        id: "2",
        title: "Quayside Villa",
        location: "Exeter, Devon",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 72,
        image: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80",
        features: ["Hot Tub", "River Views", "Parking"],
        slug: "quayside-villa",
      },
      {
        id: "3",
        title: "Devon Country House",
        location: "Exeter, Devon",
        sleeps: 10,
        bedrooms: 5,
        priceFrom: 65,
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
        features: ["Hot Tub", "Garden", "BBQ"],
        slug: "devon-country-house",
      },
    ],
    chester: [
      {
        id: "1",
        title: "Chester Roman House",
        location: "Chester, Cheshire",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 85,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-hi-4aee43a7-20251023165317.jpg",
        features: ["Hot Tub", "Historic", "Gardens"],
        slug: "chester-roman-house",
      },
      {
        id: "2",
        title: "City Walls Residence",
        location: "Chester, Cheshire",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 75,
        image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
        features: ["Hot Tub", "City Centre", "Parking"],
        slug: "city-walls-residence",
      },
      {
        id: "3",
        title: "Riverside Chester Villa",
        location: "Chester, Cheshire",
        sleeps: 10,
        bedrooms: 5,
        priceFrom: 68,
        image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80",
        features: ["River Views", "Hot Tub", "Garden"],
        slug: "riverside-chester-villa",
      },
    ],
    durham: [
      {
        id: "1",
        title: "Durham Castle View House",
        location: "Durham, County Durham",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 78,
        image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
        features: ["Hot Tub", "Castle Views", "Historic"],
        slug: "durham-castle-view-house",
      },
      {
        id: "2",
        title: "Cathedral Quarter Villa",
        location: "Durham, County Durham",
        sleeps: 10,
        bedrooms: 5,
        priceFrom: 68,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        features: ["Hot Tub", "City Centre", "Parking"],
        slug: "cathedral-quarter-villa-durham",
      },
      {
        id: "3",
        title: "River Wear House",
        location: "Durham, County Durham",
        sleeps: 8,
        bedrooms: 4,
        priceFrom: 59,
        image: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80",
        features: ["River Views", "Hot Tub", "Garden"],
        slug: "river-wear-house",
      },
    ],
    canterbury: [
      {
        id: "1",
        title: "Canterbury Cathedral House",
        location: "Canterbury, Kent",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 85,
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        features: ["Hot Tub", "Historic", "Gardens"],
        slug: "canterbury-cathedral-house",
      },
      {
        id: "2",
        title: "Medieval Quarter Villa",
        location: "Canterbury, Kent",
        sleeps: 10,
        bedrooms: 5,
        priceFrom: 75,
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
        features: ["Hot Tub", "City Centre", "Period Features"],
        slug: "medieval-quarter-villa",
      },
      {
        id: "3",
        title: "Canterbury City House",
        location: "Canterbury, Kent",
        sleeps: 8,
        bedrooms: 4,
        priceFrom: 68,
        image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
        features: ["Garden", "Parking", "Modern"],
        slug: "canterbury-city-house",
      },
    ],
    blackpool: [
      {
        id: "1",
        title: "Blackpool Seafront House",
        location: "Blackpool, Lancashire",
        sleeps: 16,
        bedrooms: 8,
        priceFrom: 75,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-lu-de9befb4-20251024134339.jpg",
        features: ["Hot Tub", "Sea Views", "Games Room"],
        slug: "blackpool-seafront-house",
      },
      {
        id: "2",
        title: "Tower View Villa",
        location: "Blackpool, Lancashire",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 65,
        image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80",
        features: ["Hot Tub", "Beach Access", "Parking"],
        slug: "tower-view-villa",
      },
      {
        id: "3",
        title: "Promenade House",
        location: "Blackpool, Lancashire",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 58,
        image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
        features: ["Sea Views", "Modern", "BBQ"],
        slug: "promenade-house",
      },
    ],
    cotswolds: [
      {
        id: "1",
        title: "Cotswolds Manor House",
        location: "Cotswolds, South West England",
        sleeps: 18,
        bedrooms: 9,
        priceFrom: 115,
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        features: ["Hot Tub", "Gardens", "Historic"],
        slug: "cotswolds-manor-house",
      },
      {
        id: "2",
        title: "Stone Village House",
        location: "Cotswolds, South West England",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 95,
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
        features: ["Hot Tub", "Village Setting", "Fireplace"],
        slug: "stone-village-house",
      },
      {
        id: "3",
        title: "Country Estate Lodge",
        location: "Cotswolds, South West England",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 85,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        features: ["Hot Tub", "Countryside Views", "Parking"],
        slug: "country-estate-lodge",
      },
    ],
    margate: [
      {
        id: "1",
        title: "Margate Beach House",
        location: "Margate, Kent",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 82,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-lu-79d6f51b-20251024134657.jpg",
        features: ["Hot Tub", "Sea Views", "Modern"],
        slug: "margate-beach-house",
      },
      {
        id: "2",
        title: "Old Town Villa",
        location: "Margate, Kent",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 72,
        image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80",
        features: ["Hot Tub", "Beach Access", "Roof Terrace"],
        slug: "old-town-villa",
      },
      {
        id: "3",
        title: "Seafront Loft",
        location: "Margate, Kent",
        sleeps: 10,
        bedrooms: 5,
        priceFrom: 65,
        image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
        features: ["Sea Views", "Modern", "Parking"],
        slug: "seafront-loft",
      },
    ],
    harrogate: [
      {
        id: "1",
        title: "Harrogate Spa House",
        location: "Harrogate, North Yorkshire",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 92,
        image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
        features: ["Hot Tub", "Gardens", "Victorian"],
        slug: "harrogate-spa-house",
      },
      {
        id: "2",
        title: "Valley Gardens Villa",
        location: "Harrogate, North Yorkshire",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 82,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        features: ["Hot Tub", "Garden Views", "Parking"],
        slug: "valley-gardens-villa",
      },
      {
        id: "3",
        title: "Turkish Baths House",
        location: "Harrogate, North Yorkshire",
        sleeps: 10,
        bedrooms: 5,
        priceFrom: 75,
        image: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80",
        features: ["Hot Tub", "City Centre", "Period Features"],
        slug: "turkish-baths-house",
      },
    ],
    "st-ives": [
      {
        id: "1",
        title: "St Ives Harbour House",
        location: "St Ives, Cornwall",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 98,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-lu-6d16f567-20251024135529.jpg",
        features: ["Hot Tub", "Harbour Views", "Beach Access"],
        slug: "st-ives-harbour-house",
      },
      {
        id: "2",
        title: "Porthminster Beach Villa",
        location: "St Ives, Cornwall",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 88,
        image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80",
        features: ["Hot Tub", "Beach Views", "Modern"],
        slug: "porthminster-beach-villa",
      },
      {
        id: "3",
        title: "Artists Quarter House",
        location: "St Ives, Cornwall",
        sleeps: 10,
        bedrooms: 5,
        priceFrom: 78,
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
        features: ["Sea Views", "Hot Tub", "Parking"],
        slug: "artists-quarter-house",
      },
    ],
    windsor: [
      {
        id: "1",
        title: "Windsor Castle View House",
        location: "Windsor, Berkshire",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 105,
        image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
        features: ["Hot Tub", "Castle Views", "Gardens"],
        slug: "windsor-castle-view-house",
      },
      {
        id: "2",
        title: "Thames Riverside Villa",
        location: "Windsor, Berkshire",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 92,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        features: ["Hot Tub", "River Views", "Parking"],
        slug: "thames-riverside-villa",
      },
      {
        id: "3",
        title: "Royal Borough House",
        location: "Windsor, Berkshire",
        sleeps: 10,
        bedrooms: 5,
        priceFrom: 85,
        image: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80",
        features: ["Hot Tub", "Historic", "Garden"],
        slug: "royal-borough-house",
      },
    ],
    "stratford-upon-avon": [
      {
        id: "1",
        title: "Shakespeare's House",
        location: "Stratford-upon-Avon, Warwickshire",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 92,
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        features: ["Hot Tub", "Historic", "Gardens"],
        slug: "shakespeares-house",
      },
      {
        id: "2",
        title: "Avon Riverside Villa",
        location: "Stratford-upon-Avon, Warwickshire",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 82,
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
        features: ["Hot Tub", "River Views", "Parking"],
        slug: "avon-riverside-villa",
      },
      {
        id: "3",
        title: "Theatre District House",
        location: "Stratford-upon-Avon, Warwickshire",
        sleeps: 10,
        bedrooms: 5,
        priceFrom: 75,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        features: ["Hot Tub", "City Centre", "Period Features"],
        slug: "theatre-district-house",
      },
    ],
    plymouth: [
      {
        id: "1",
        title: "Plymouth Waterfront House",
        location: "Plymouth, Devon",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 82,
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-exterior-photograph-of-a-lu-d39fc8a9-20251024142257.jpg",
        features: ["Hot Tub", "Harbour Views", "Modern"],
        slug: "plymouth-waterfront-house",
      },
      {
        id: "2",
        title: "Barbican House",
        location: "Plymouth, Devon",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 72,
        image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80",
        features: ["Hot Tub", "Historic", "City Centre"],
        slug: "barbican-house",
      },
      {
        id: "3",
        title: "Sound View Villa",
        location: "Plymouth, Devon",
        sleeps: 10,
        bedrooms: 5,
        priceFrom: 65,
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
        features: ["Sea Views", "Hot Tub", "Parking"],
        slug: "sound-view-villa",
      },
    ],
    cheltenham: [
      {
        id: "1",
        title: "Cheltenham Regency House",
        location: "Cheltenham, Gloucestershire",
        sleeps: 14,
        bedrooms: 7,
        priceFrom: 95,
        image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
        features: ["Hot Tub", "Gardens", "Regency"],
        slug: "cheltenham-regency-house",
      },
      {
        id: "2",
        title: "Montpellier Villa",
        location: "Cheltenham, Gloucestershire",
        sleeps: 12,
        bedrooms: 6,
        priceFrom: 85,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        features: ["Hot Tub", "Period Features", "Parking"],
        slug: "montpellier-villa",
      },
      {
        id: "3",
        title: "Racecourse View House",
        location: "Cheltenham, Gloucestershire",
        sleeps: 10,
        bedrooms: 5,
        priceFrom: 78,
        image: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80",
        features: ["Hot Tub", "Gardens", "Modern"],
        slug: "racecourse-view-house",
      },
    ]
  };

  const destination = destinationsData[slug] || destinationsData.brighton;

  const faqs = [
    {
      question: `How far is ${destination.name} from London?`,
      answer: `${destination.quickFacts.fromLondon}. ${destination.name} is easily accessible by direct train services, making it perfect for a weekend getaway without the hassle of long travel times.`
    },
    {
      question: `What's included in the price of a hen party house in ${destination.name}?`,
      answer: `Our ${destination.name} properties include all essential amenities such as WiFi, bed linens, towels, fully equipped kitchens, and access to features like hot tubs and games rooms where available. Prices are typically per night, and we'll provide a full breakdown of what's included when you enquire. Most properties also include welcome packs and detailed house information.`
    },
    {
      question: `How many people can stay in your ${destination.name} hen party houses?`,
      answer: `Our ${destination.name} properties accommodate groups from 10 to 20+ people. Each house listing shows the exact number of bedrooms and maximum occupancy. We have a range of properties to suit different group sizes, from intimate gatherings to large hen parties. When you enquire, let us know your exact numbers and we'll match you with the perfect property.`
    },
    {
      question: `Are hen parties and celebrations allowed in ${destination.name} properties?`,
      answer: `Yes! Our ${destination.name} properties are specifically selected for group celebrations including hen parties. However, we do have house rules to respect neighbours and local communities. This typically includes reasonable noise levels after 11pm and no external guests beyond your booking. Each property has specific guidelines which we'll share with you.`
    },
    {
      question: `What are the best areas to stay in ${destination.name} for a hen party?`,
      answer: `For ${destination.name}, we recommend staying close to the main nightlife and entertainment areas for easy access. ${destination.name === 'Brighton' ? 'Properties near The Lanes, North Laine, or the seafront offer the best location for hen parties, with bars, restaurants, and the beach all within walking distance.' : destination.name === 'Bath' ? 'The city centre or near Milsom Street puts you within walking distance of the Roman Baths, restaurants, and nightlife.' : destination.name === 'Manchester' ? 'The Northern Quarter and city centre areas are ideal, close to bars, restaurants, and Manchester\'s famous nightlife.' : 'Properties near the city centre typically offer the best access to restaurants, bars, and local attractions.'} We'll help you choose the perfect location based on your plans.`
    },
    {
      question: `Can we bring decorations and have a party at the house?`,
      answer: `Absolutely! You're welcome to bring decorations to celebrate. We recommend non-damaging items like banners, balloons, and table decorations. Please avoid confetti, glitter, or anything that might damage walls or furnishings. Many properties have outdoor spaces perfect for daytime celebrations, and all have spacious living areas for gathering as a group.`
    },
    {
      question: `What time is check-in and check-out?`,
      answer: `Standard check-in is typically 4pm and check-out is 10am. However, we understand hen parties often want more flexibility. Where possible, we can arrange early check-in or late check-out for an additional fee. Let us know your travel plans when booking and we'll do our best to accommodate your needs.`
    },
    {
      question: `Is parking available at ${destination.name} properties?`,
      answer: `${destination.name === 'Brighton' || destination.name === 'London' ? 'Parking in ' + destination.name + ' can be limited in central areas. Some properties include designated parking spaces, while others have nearby public car parks. We recommend using public transport where possible as ' + destination.name + ' has excellent connections. We\'ll provide full parking information for your chosen property.' : 'Most of our ' + destination.name + ' properties include parking for multiple vehicles. We\'ll confirm exact parking arrangements when you book. ' + destination.name + ' also has good public transport links if some of your group prefers not to drive.'}`
    },
    {
      question: `How does payment work and can we split the cost?`,
      answer: `We require a deposit to secure your booking, with the balance due closer to your stay date. For hen parties, it's common for one person to pay the deposit and then split the remaining cost among the group. We provide detailed payment schedules and can work with you on timing. Many groups use money pool apps to collect funds from everyone.`
    },
    {
      question: `What's your cancellation policy?`,
      answer: `We understand plans can change. Our standard cancellation policy allows full refund if cancelled 8+ weeks before arrival, 50% refund for 4-8 weeks notice, and deposits are non-refundable within 4 weeks of arrival. We strongly recommend travel insurance for hen parties. Each property may have specific terms which we'll share when booking.`
    },
    {
      question: `Are the houses suitable for mixed groups or just hen parties?`,
      answer: `While our properties are perfect for hen parties, they're also ideal for any group celebration including birthdays, reunions, stag dos, and special occasions. Our ${destination.name} houses are designed for groups who want to celebrate together in a private, comfortable setting with excellent amenities.`
    },
    {
      question: `Can you help arrange activities and experiences in ${destination.name}?`,
      answer: `Yes! We partner with local experience providers to offer activities like cocktail making classes, spa treatments, private chefs, butlers in the buff, life drawing, and more. ${destination.name} also has fantastic restaurants, bars, and attractions. We're happy to provide recommendations and help book experiences to make your hen party extra special.`
    }
  ];

  // FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://groupescapehouses.co.uk"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Destinations",
        "item": "https://groupescapehouses.co.uk/destinations"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": destination.name,
        "item": `https://groupescapehouses.co.uk/destinations/${slug}`
      }
    ]
  };

  useEffect(() => {
    // Ensure video plays when loaded
    if (videoRef.current && destination.video) {
      const playVideo = async () => {
        try {
          videoRef.current!.muted = true;
          await videoRef.current!.play();
          setVideoLoaded(true);
          console.log('Video playing successfully');
        } catch (error) {
          console.error('Video play failed:', error);
          // Show fallback image if video fails to play
          if (videoRef.current) {
            videoRef.current.style.display = 'none';
          }
          const fallbackImg = document.getElementById('hero-fallback-img');
          if (fallbackImg) {
            (fallbackImg as HTMLElement).style.display = 'block';
          }
        }
      };

      // Try to play immediately
      playVideo();

      // Also try when video is loaded
      videoRef.current.addEventListener('loadeddata', playVideo);
      videoRef.current.addEventListener('canplay', playVideo);

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('loadeddata', playVideo);
          videoRef.current.removeEventListener('canplay', playVideo);
        }
      };
    }
  }, [destination.video]);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header />

      {/* Hero */}
      <div className="relative h-[500px] mt-20 overflow-hidden">
        {destination.video ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ 
                display: 'block',
                zIndex: 0
              }}
              onError={(e) => {
                console.error('Video failed to load:', e);
                e.currentTarget.style.display = 'none';
                const fallbackImg = document.getElementById('hero-fallback-img');
                if (fallbackImg) {
                  (fallbackImg as HTMLElement).style.display = 'block';
                }
              }}
            >
              <source src={destination.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {/* Fallback image if video fails */}
            <div 
              id="hero-fallback-img"
              className="absolute inset-0"
              style={{ display: 'none', zIndex: 0 }}
            >
              <Image 
                src={destination.image} 
                alt={destination.name} 
                fill 
                className="object-cover" 
                priority 
                onError={() => handleImageError('hero-fallback')}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" style={{ zIndex: 1 }}></div>
          </>
        ) : (
          <>
            <Image 
              src={destination.image} 
              alt={destination.name} 
              fill 
              className="object-cover" 
              style={{ zIndex: 0 }}
              priority 
              onError={() => handleImageError('hero')}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" style={{ zIndex: 1 }}></div>
          </>
        )}
        <div className="absolute bottom-0 left-0 right-0" style={{ zIndex: 2 }}>
          <div className="max-w-[1200px] mx-auto px-6 pb-12">
            <h1 className="text-white mb-2 drop-shadow-lg" style={{ fontFamily: "var(--font-display)", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
              {destination.name}
            </h1>
            <div className="flex items-center gap-2 text-white text-xl mb-6 drop-shadow-md" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
              <MapPin className="w-5 h-5 drop-shadow-md" />
              <span>{destination.region}</span>
            </div>
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-8 py-4 font-medium transition-all duration-300 hover:scale-[1.02] shadow-lg"
              style={{
                background: "var(--color-accent-sage)",
                color: "white",
              }}
            >
              <Link href="/contact">Check Availability and Book</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* SEO Content Section with Internal Links */}
      <section className="py-12 bg-white border-b border-[var(--color-bg-secondary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-4">
              Looking for the perfect <Link href="/occasions/hen-party-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">hen party houses in {destination.name}</Link>? 
              Group Escape Houses offers stunning <Link href="/properties" className="text-[var(--color-accent-sage)] hover:underline font-medium">luxury group accommodation</Link> perfect 
              for celebrations. Our <Link href="/house-styles/party-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">party houses</Link> feature 
              amazing amenities including <Link href="/features/hot-tub" className="text-[var(--color-accent-sage)] hover:underline font-medium">hot tubs</Link>, <Link href="/features/swimming-pool" className="text-[var(--color-accent-sage)] hover:underline font-medium">swimming pools</Link>, 
              and <Link href="/features/games-room" className="text-[var(--color-accent-sage)] hover:underline font-medium">games rooms</Link> to make your weekend unforgettable.
            </p>
            <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed">
              Whether you're planning a <Link href="/occasions/hen-party-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">hen do</Link>, <Link href="/occasions/special-celebrations" className="text-[var(--color-accent-sage)] hover:underline font-medium">special celebration</Link>, 
              or <Link href="/occasions/weekend-breaks" className="text-[var(--color-accent-sage)] hover:underline font-medium">weekend break</Link>, {destination.name} combines the 
              perfect location with our <Link href="/house-styles/luxury-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">luxury houses</Link>. 
              Explore our <Link href="/experiences" className="text-[var(--color-accent-sage)] hover:underline font-medium">experiences</Link> to add cocktail classes, spa treatments, 
              and more. Also discover other popular destinations including <Link href="/destinations/london" className="text-[var(--color-accent-sage)] hover:underline font-medium">London</Link>, <Link href="/destinations/bath" className="text-[var(--color-accent-sage)] hover:underline font-medium">Bath</Link>, 
              and <Link href="/destinations" className="text-[var(--color-accent-sage)] hover:underline font-medium">more UK party destinations</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-semibold mb-6" style={{ fontFamily: "var(--font-display)" }}>
                Why {destination.name}?
              </h2>
              <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed mb-6">
                {destination.overview}
              </p>
              
              <div className="space-y-4 mt-6">
                <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed">
                  {destination.name} stands out as one of the UK's premier destinations for <Link href="/occasions/hen-party-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">hen party celebrations</Link>. 
                  Our carefully selected <Link href="/properties" className="text-[var(--color-accent-sage)] hover:underline font-medium">luxury properties</Link> in the area provide the perfect base for your celebration, 
                  featuring essential amenities like <Link href="/features/hot-tub" className="text-[var(--color-accent-sage)] hover:underline font-medium">private hot tubs</Link>, <Link href="/features/games-room" className="text-[var(--color-accent-sage)] hover:underline font-medium">games rooms</Link>, 
                  and spacious living areas designed for group entertainment.
                </p>
                
                <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed">
                  Beyond the accommodation, {destination.name} offers an incredible range of activities to enhance your <Link href="/occasions/weekend-breaks" className="text-[var(--color-accent-sage)] hover:underline font-medium">weekend break</Link>. 
                  From world-class dining and vibrant nightlife to unique <Link href="/experiences" className="text-[var(--color-accent-sage)] hover:underline font-medium">experiences</Link> like cocktail masterclasses, spa treatments, 
                  and private chef dinners, there's something to suit every group's taste and budget. The city's compact layout means you can easily explore on foot, making it simple to move between venues and attractions.
                </p>
                
                <p className="text-lg text-[var(--color-neutral-dark)] leading-relaxed">
                  Looking for other celebration options? Explore our <Link href="/house-styles/party-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">party houses</Link> for 
                  lively group gatherings, <Link href="/house-styles/luxury-houses" className="text-[var(--color-accent-sage)] hover:underline font-medium">luxury houses</Link> for upscale celebrations, 
                  or browse our collection of <Link href="/destinations" className="text-[var(--color-accent-sage)] hover:underline font-medium">UK destinations</Link> including <Link href="/destinations/bath" className="text-[var(--color-accent-sage)] hover:underline font-medium">Bath</Link>, <Link href="/destinations/manchester" className="text-[var(--color-accent-sage)] hover:underline font-medium">Manchester</Link>, 
                  and <Link href="/destinations/york" className="text-[var(--color-accent-sage)] hover:underline font-medium">York</Link>.
                </p>
              </div>
            </div>
            <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-6">Quick Facts</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Navigation className="w-5 h-5 text-[var(--color-accent-pink)] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">From London</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">{destination.quickFacts.fromLondon}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[var(--color-accent-gold)] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Best Time to Visit</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">{destination.quickFacts.bestTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Moon className="w-5 h-5 text-[var(--color-accent-sage)] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Nightlife</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">{destination.quickFacts.nightlife}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Coffee className="w-5 h-5 text-[var(--color-accent-gold)] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Dining</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">{destination.quickFacts.dining}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Waves className="w-5 h-5 text-[var(--color-accent-pink)] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Beach Access</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">{destination.quickFacts.beachAccess}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-[var(--color-accent-sage)] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Accommodation</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">{destination.quickFacts.accommodation}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <PoundSterling className="w-5 h-5 text-[var(--color-accent-gold)] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Price Range</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">{destination.quickFacts.priceRange}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <PartyPopper className="w-5 h-5 text-[var(--color-accent-pink)] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Activities</p>
                    <p className="text-sm text-[var(--color-neutral-dark)]">{destination.quickFacts.activities}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting There */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <Navigation className="w-5 h-5 text-[var(--color-accent-pink)]" />
            <h2 className="text-3xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              Getting There
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {destination.gettingThere.map((option: any, index: number) => {
              const Icon = option.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 flex items-start gap-4 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-accent-sage)]/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-[var(--color-accent-sage)]" />
                  </div>
                  <p className="text-[var(--color-neutral-dark)] flex-1">{option.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Nightlife */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <Moon className="w-5 h-5 text-[var(--color-accent-sage)]" />
            <h2 className="text-3xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              Top Nightlife Spots
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destination.nightlife.map((venue: any, index: number) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
                {venue.image && !imageErrors[`nightlife-${index}`] ? (
                  <div className="relative h-48 overflow-hidden bg-[var(--color-bg-secondary)]">
                    <Image
                      src={venue.image}
                      alt={venue.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={() => handleImageError(`nightlife-${index}`)}
                    />
                  </div>
                ) : (
                  <div className="relative h-48 overflow-hidden bg-[var(--color-bg-secondary)] flex items-center justify-center">
                    <Moon className="w-16 h-16 text-[var(--color-accent-sage)] opacity-30" />
                  </div>
                )}
                <div className="p-6">
                  <p className="font-semibold mb-2 text-[var(--color-text-primary)]">{venue.name}</p>
                  <p className="text-sm text-[var(--color-neutral-dark)]">{venue.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brunch & Dining */}
      <section className="py-16 bg-[var(--color-bg-secondary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <UtensilsCrossed className="w-5 h-5 text-[var(--color-accent-gold)]" />
            <h2 className="text-3xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              Best Brunch & Dining
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destination.brunch.map((venue: any, index: number) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                {!imageErrors[`brunch-${index}`] ? (
                  <div className="relative h-48 overflow-hidden bg-[var(--color-bg-primary)]">
                    <Image
                      src={venue.image}
                      alt={venue.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={() => handleImageError(`brunch-${index}`)}
                    />
                  </div>
                ) : (
                  <div className="relative h-48 overflow-hidden bg-[var(--color-bg-primary)] flex items-center justify-center">
                    <UtensilsCrossed className="w-16 h-16 text-[var(--color-accent-gold)] opacity-30" />
                  </div>
                )}
                <div className="p-6">
                  <p className="font-semibold mb-2 text-[var(--color-text-primary)]">{venue.name}</p>
                  <p className="text-sm text-[var(--color-neutral-dark)]">{venue.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-5 h-5 text-[var(--color-accent-pink)]" />
            <h2 className="text-3xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              Things to Do
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destination.activities.map((activity: any, index: number) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
                {activity.image && !imageErrors[`activity-${index}`] ? (
                  <div className="relative h-48 overflow-hidden bg-[var(--color-bg-secondary)]">
                    <Image
                      src={activity.image}
                      alt={activity.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={() => handleImageError(`activity-${index}`)}
                    />
                  </div>
                ) : (
                  <div className="relative h-48 overflow-hidden bg-[var(--color-bg-secondary)] flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-[var(--color-accent-pink)] opacity-30" />
                  </div>
                )}
                <div className="p-6">
                  <p className="font-semibold mb-2 text-[var(--color-text-primary)]">{activity.name}</p>
                  {activity.description && (
                    <p className="text-sm text-[var(--color-neutral-dark)]">{activity.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
              Everything you need to know about visiting {destination.name}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[var(--color-bg-primary)] rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-[var(--color-bg-secondary)] transition-colors"
                >
                  <span className="font-semibold text-[var(--color-text-primary)] pr-4">
                    {faq.question}
                  </span>
                  <ChevronDownIcon
                    className={`w-5 h-5 text-[var(--color-accent-gold)] flex-shrink-0 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-[var(--color-neutral-dark)] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Properties in this area */}
      <section className="py-24 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-8" style={{ fontFamily: "var(--font-display)" }}>
            Hen Party Houses in {destination.name}
          </h2>
          
          {isLoadingProperties ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent-sage)]"></div>
              <p className="mt-4 text-[var(--color-neutral-dark)]">Loading properties...</p>
            </div>
          ) : properties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Button
                  asChild
                  size="lg"
                  className="rounded-2xl px-10 py-6 font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                  style={{
                    background: "var(--color-accent-sage)",
                    color: "white",
                  }}
                >
                  <Link href="/contact">Check Availability and Book</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl">
              <Home className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-xl font-semibold text-gray-900 mb-2">No properties available yet</p>
              <p className="text-[var(--color-neutral-dark)] mb-6">
                We're currently adding properties in {destination.name}. Check back soon!
              </p>
              <Button
                asChild
                variant="outline"
                className="rounded-full"
              >
                <Link href="/properties">View All Properties</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}




