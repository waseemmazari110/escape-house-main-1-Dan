import { ChefHat, Utensils, Paintbrush, Wine, Palette, Mic2, Sparkles, Camera, Heart, Coffee, Gift, Music, PartyPopper, Flower2, Scissors, Flame, Pizza, GlassWater, Dumbbell, Users } from "lucide-react";

export const experiencesData: Record<string, any> = {
  "private-chef": {
    title: "Private Chef Experience",
    duration: "3-4 hours",
    priceFrom: 65,
    groupSize: "8-24 guests",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-a-private-ch-e336a153-20251018105040.jpg",
    gallery: [
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-a-priva-eb946e05-20251024112454.jpg",
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-beautif-052b2939-20251027101941.jpg",
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-a-priva-23564d70-20251024130257.jpg"
    ],
    icon: ChefHat,
    description: "Treat your group to a restaurant-quality dining experience in the comfort of your own property. Our professional chefs will arrive with all ingredients, prepare a stunning three-course meal tailored to your preferences, and handle all the clearing up. It's the perfect way to enjoy gourmet food without lifting a finger, leaving you free to focus on celebrating with your guests.",
    included: ["Professional private chef for the evening", "Three-course gourmet meal tailored to your group", "All ingredients, equipment, and serving ware", "Menu planning consultation beforehand", "Full table service and presentation", "Kitchen cleanup and washing up"],
    whatToProvide: ["Dining space and table setup", "Basic kitchen facilities (oven, hob, fridge)", "Crockery and cutlery for your group size", "Let us know about any dietary requirements in advance"],
    pricing: [{ size: "8-12 guests", price: 75 }, { size: "13-18 guests", price: 68 }, { size: "19-24 guests", price: 65 }],
    faqs: [{ question: "Can we customise the menu?", answer: "Absolutely! Our chefs will work with you to create a menu that suits your group's preferences and dietary requirements. We can accommodate vegetarian, vegan, gluten-free, and other dietary needs." }, { question: "What time does the chef arrive?", answer: "The chef typically arrives 1-2 hours before your preferred dining time to prepare. We'll coordinate the exact timing with you when booking." }, { question: "Does the price include drinks?", answer: "The price includes all food and chef service. Drinks are not included, but we can arrange wine pairing recommendations or beverage delivery services for an additional cost." }]
  },
  "bbq-catering": {
    title: "BBQ Catering",
    duration: "3-4 hours",
    priceFrom: 45,
    groupSize: "10-30 guests",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80",
      "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80",
      "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=800&q=80"
    ],
    icon: Flame,
    description: "Fire up your celebration with a professional BBQ catering service. Our experienced BBQ chefs will bring everything needed to create a delicious outdoor feast. From succulent burgers and sausages to grilled vegetables and gourmet sides, we'll serve up a crowd-pleasing spread while you relax and enjoy the party atmosphere.",
    included: ["Professional BBQ chef", "All BBQ equipment and fuel", "Premium meats and vegetarian options", "Selection of sides and salads", "Condiments and serving ware", "Setup and cleanup"],
    whatToProvide: ["Outdoor space for BBQ setup", "Tables for food service", "Plates and cutlery", "Let us know dietary requirements"],
    pricing: [{ size: "10-15 guests", price: 50 }, { size: "16-22 guests", price: 47 }, { size: "23-30 guests", price: 45 }],
    faqs: [{ question: "What's on the menu?", answer: "Our standard menu includes burgers, sausages, chicken, halloumi, mixed salads, coleslaw, and bread rolls. We can customize based on your preferences." }, { question: "What if it rains?", answer: "We can set up under covered areas or use gazebos. If extreme weather prevents outdoor cooking, we'll discuss alternative arrangements." }]
  },
  "pizza-making-class": {
    title: "Pizza Making Class",
    duration: "2-3 hours",
    priceFrom: 42,
    groupSize: "8-20 guests",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&q=80",
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&q=80"
    ],
    icon: Pizza,
    description: "Get hands-on and create your own authentic Italian pizzas from scratch. Our expert instructor will teach you how to make perfect dough, create delicious sauce, and top your pizzas with premium ingredients. Then watch as they're cooked to perfection in a portable pizza oven. It's interactive, fun, and incredibly tasty!",
    included: ["Professional pizza-making instructor", "All ingredients for dough and toppings", "Portable pizza oven", "Chef's hats and aprons", "Recipe cards to take home", "Eat your creations together"],
    whatToProvide: ["Kitchen or outdoor space", "Tables for preparation", "Access to water", "Appetite for delicious pizza!"],
    pricing: [{ size: "8-12 guests", price: 45 }, { size: "13-16 guests", price: 43 }, { size: "17-20 guests", price: 42 }],
    faqs: [{ question: "Can we choose our own toppings?", answer: "Absolutely! We provide a wide selection of toppings including vegetarian and vegan options." }, { question: "Do we really get to eat what we make?", answer: "Yes! You'll enjoy your freshly made pizzas together as part of the experience." }]
  },
  "butlers-in-the-buff": {
    title: "Butlers in the Buff",
    duration: "2-3 hours",
    priceFrom: 60,
    groupSize: "8-25 guests",
    image: "https://butlersinthebuff.co.uk/wp-content/uploads/2023/05/fun_friendly.jpg.webp",
    gallery: [
      "https://butlersinthebuff.co.uk/wp-content/uploads/2023/05/fun_friendly.jpg.webp",
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"
    ],
    icon: Heart,
    description: "Add some cheeky fun to your celebration with our handsome butlers who serve in nothing but an apron and bow tie! Professional, friendly, and entertaining, our butlers will serve drinks, canapés, and bring plenty of laughs to your party. It's the ultimate hen party experience that'll have everyone giggling and creating unforgettable memories.",
    included: ["Handsome professional butler", "Drinks service and hosting", "Games and entertainment", "Photo opportunities", "Canapé service (food not included)", "Guaranteed fun and laughter"],
    whatToProvide: ["Drinks and canapés to be served", "Party atmosphere", "Cameras ready for photos!", "Age 18+ guests only"],
    pricing: [{ size: "8-15 guests", price: 65 }, { size: "16-20 guests", price: 62 }, { size: "21-25 guests", price: 60 }],
    faqs: [{ question: "What do the butlers wear?", answer: "Our butlers wear a collar, cuffs, bow tie, and a smart black apron - and that's it! All butlers are professional, respectful, and great fun." }, { question: "What will they do?", answer: "They'll serve drinks and canapés, host games, pose for photos, and keep the party atmosphere buzzing throughout the session." }]
  },
  "bottomless-brunch": {
    title: "Bottomless Brunch",
    duration: "2 hours",
    priceFrom: 55,
    groupSize: "8-20 guests",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80",
      "https://images.unsplash.com/photo-1568096889942-6eedde686635?w=800&q=80",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80"
    ],
    icon: Coffee,
    description: "Start your day the right way with a bottomless brunch experience at your property. Enjoy a delicious selection of brunch dishes paired with unlimited prosecco, mimosas, or cocktails for two hours. Our team will handle all the catering and service, so you can sit back, sip, and savour with your group.",
    included: ["Professional catering team", "Selection of brunch dishes", "Unlimited prosecco, mimosas, or cocktails for 2 hours", "Table service and presentation", "All serving ware and glassware", "Setup and cleanup"],
    whatToProvide: ["Dining space and seating", "Tables for food service", "Let us know dietary requirements", "Ready to celebrate!"],
    pricing: [{ size: "8-12 guests", price: 60 }, { size: "13-16 guests", price: 57 }, { size: "17-20 guests", price: 55 }],
    faqs: [{ question: "What food is included?", answer: "A selection of brunch classics including pastries, eggs, avocado toast, pancakes, fresh fruit, and more. We can tailor to dietary needs." }, { question: "What drinks are included?", answer: "Unlimited prosecco, mimosas, Bellinis, or selected cocktails for 2 hours. We can discuss your drink preferences when booking." }]
  },
  "life-drawing": {
    title: "Life Drawing",
    duration: "1.5-2 hours",
    priceFrom: 48,
    groupSize: "8-20 guests",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
    ],
    icon: Paintbrush,
    description: "Get cheeky and creative with a life drawing class featuring a naked male model! Under the guidance of a professional art tutor, you'll learn basic drawing techniques while having a laugh with your group. Whether you're talented or terrible, it's guaranteed to be hilarious. Everyone takes home their masterpiece as a unique souvenir.",
    included: ["Professional art tutor", "Naked male model", "Drawing materials for each guest", "Step-by-step instruction", "Plenty of laughs", "Take home your artwork"],
    whatToProvide: ["Table space for drawing", "Chairs for participants", "Good lighting", "Open minds and sense of humour!"],
    pricing: [{ size: "8-12 guests", price: 52 }, { size: "13-16 guests", price: 50 }, { size: "17-20 guests", price: 48 }],
    faqs: [{ question: "Is it really a naked model?", answer: "Yes! Our professional male models are experienced, friendly, and completely comfortable. It's all done in good fun and great taste." }, { question: "Do we need drawing experience?", answer: "Not at all! The tutor will guide you through basic techniques, but the focus is on fun rather than masterpieces." }]
  },
  "gin-tasting": {
    title: "Gin Tasting",
    duration: "2 hours",
    priceFrom: 48,
    groupSize: "8-20 guests",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&q=80",
      "https://images.unsplash.com/photo-1509657298582-2f760f76fa1d?w=800&q=80",
      "https://images.unsplash.com/photo-1560508562-27d0de6b7d66?w=800&q=80"
    ],
    icon: GlassWater,
    description: "Discover the wonderful world of gin with a guided tasting experience. Sample a selection of premium gins from around the UK, learn about botanicals and distilling processes, and find your perfect serve. Mix and match with different tonics and garnishes to create your ideal G&T. It's educational, sophisticated, and seriously enjoyable.",
    included: ["Expert gin host", "Tasting selection of 5-6 premium gins", "Variety of tonics and garnishes", "Tasting notes and information", "Glassware and ice", "Recipe cards to take home"],
    whatToProvide: ["Table space for tasting station", "Seating for participants", "Ice and water", "Designated drivers arranged"],
    pricing: [{ size: "8-12 guests", price: 52 }, { size: "13-16 guests", price: 50 }, { size: "17-20 guests", price: 48 }],
    faqs: [{ question: "How many gins do we taste?", answer: "You'll sample 5-6 premium gins, with enough for everyone to find their favourites and learn about different styles." }, { question: "Can we keep drinking after?", answer: "The tasting includes sample measures. You're welcome to purchase full bottles of any gins you love to enjoy later!" }]
  },
  "wine-tasting": {
    title: "Wine Tasting",
    duration: "2 hours",
    priceFrom: 50,
    groupSize: "8-20 guests",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&q=80",
      "https://images.unsplash.com/photo-1566753323558-f212ad96c84d?w=800&q=80",
      "https://images.unsplash.com/photo-1513618827672-0d7c5ad591b1?w=800&q=80"
    ],
    icon: Wine,
    description: "Elevate your celebration with a sophisticated wine tasting experience. A professional sommelier will guide you through a selection of carefully chosen wines from around the world. Learn tasting techniques, discover flavour profiles, and enjoy paired nibbles. It's a refined and delicious way to spend an afternoon or evening with your group.",
    included: ["Professional sommelier host", "Tasting selection of 6 wines", "Tasting notes and guidance", "Paired cheese and charcuterie", "Wine glasses and accessories", "Educational and fun experience"],
    whatToProvide: ["Table space for tasting", "Seating for participants", "Water for palate cleansing", "Transport arrangements"],
    pricing: [{ size: "8-12 guests", price: 55 }, { size: "13-16 guests", price: 52 }, { size: "17-20 guests", price: 50 }],
    faqs: [{ question: "What wines will we taste?", answer: "We'll take you on a journey through reds, whites, and potentially a sparkling or rosé, showcasing different regions and grape varieties." }, { question: "Is food included?", answer: "Yes! We provide a selection of cheese, charcuterie, and crackers paired perfectly with the wines." }]
  },
  "mobile-beauty-bar": {
    title: "Mobile Beauty Bar",
    duration: "2-4 hours",
    priceFrom: 38,
    groupSize: "8-20 guests",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80"
    ],
    icon: Sparkles,
    description: "Transform your property into a luxury beauty salon with our mobile beauty bar. Our professional beauticians offer a range of treatments including manicures, pedicures, makeup application, and more. Get glammed up together before your night out or enjoy a relaxing pampering session. It's convenient, luxurious, and perfect for groups.",
    included: ["Professional beauty therapists", "All beauty products and equipment", "Choice of treatments", "Sanitary stations and setup", "Personalized service", "Group package discounts"],
    whatToProvide: ["Space with tables and good lighting", "Access to plug sockets", "Chairs for clients", "Treatment preferences in advance"],
    pricing: [{ size: "8-12 guests", price: 42 }, { size: "13-16 guests", price: 40 }, { size: "17-20 guests", price: 38 }],
    faqs: [{ question: "What treatments are available?", answer: "Choose from manicures, gel polish, pedicures, makeup application, lash extensions, eyebrow shaping, and more. We'll create a custom package for your group." }, { question: "How long does each treatment take?", answer: "Treatment times vary: manicures 30-45 mins, makeup 30 mins, lashes 60 mins. We'll schedule to ensure everyone's ready on time." }]
  },
  "dance-class": {
    title: "Dance Class",
    duration: "1.5-2 hours",
    priceFrom: 40,
    groupSize: "8-25 guests",
    image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&q=80",
      "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&q=80",
      "https://images.unsplash.com/photo-1485230405346-71acb9518d9c?w=800&q=80"
    ],
    icon: Music,
    description: "Get your group moving with a fun and energetic dance class! Choose from styles like street dance, Bollywood, Charleston, or even a full hen party choreography. Our professional instructor will teach you an easy-to-follow routine that'll have everyone laughing, bonding, and busting moves. Perfect for creating hilarious videos and burning off some energy.",
    included: ["Professional dance instructor", "Choreographed routine", "Music and sound system", "Warm-up and cool-down", "Video recording of performance", "Guaranteed laughs and memories"],
    whatToProvide: ["Space to move and dance", "Bluetooth speaker or sound system", "Comfortable clothing and trainers", "Energy and enthusiasm!"],
    pricing: [{ size: "8-12 guests", price: 45 }, { size: "13-18 guests", price: 42 }, { size: "19-25 guests", price: 40 }],
    faqs: [{ question: "Do we need dance experience?", answer: "Not at all! Our instructors tailor the routine to your group's ability. It's all about having fun, not being perfect." }, { question: "What style of dance?", answer: "You can choose! Popular options include street dance, Bollywood, 90s throwback, Charleston, or a custom hen party routine." }]
  },
  "pamper-party-package": {
    title: "Pamper Party Package",
    duration: "3-4 hours",
    priceFrom: 70,
    groupSize: "8-16 guests",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&q=80"
    ],
    icon: Gift,
    description: "Indulge in the ultimate pampering experience with our comprehensive package. Combining multiple treatments including mini facials, hand massages, makeup touch-ups, and nail care, this package lets everyone enjoy a variety of treatments in one luxurious session. It's the perfect way to relax and bond before the big celebrations.",
    included: ["Multiple professional therapists", "Mini facial for each guest", "Hand and arm massage", "Manicure or polish", "Light makeup application", "All products and equipment", "Relaxing atmosphere with music"],
    whatToProvide: ["Multiple treatment spaces", "Good lighting", "Comfortable seating", "Towels and robes if available"],
    pricing: [{ size: "8-10 guests", price: 78 }, { size: "11-13 guests", price: 74 }, { size: "14-16 guests", price: 70 }],
    faqs: [{ question: "What's included in the package?", answer: "Each guest receives a mini facial, hand massage, manicure or nail polish, and light makeup touch-up - perfect preparation for your celebration!" }, { question: "How many therapists will there be?", answer: "We bring multiple therapists to ensure treatments run smoothly and everyone is pampered in time." }]
  },
  "make-up-artist": {
    title: "Make-up Artist",
    duration: "2-3 hours",
    priceFrom: 40,
    groupSize: "8-20 guests",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80",
      "https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=800&q=80",
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80"
    ],
    icon: Sparkles,
    description: "Look absolutely stunning with professional makeup application from our talented makeup artists. Whether you want a natural glow or full glamour, our artists will create the perfect look for each person. Using premium products and the latest techniques, everyone will feel confident and camera-ready for your celebrations.",
    included: ["Professional makeup artist", "Premium makeup products", "Individual consultation", "Full face makeup application", "False lashes if desired", "Touch-up tips and tricks"],
    whatToProvide: ["Space with mirrors and natural light", "Chairs for clients", "Access to plug sockets", "Inspiration photos welcome"],
    pricing: [{ size: "8-12 guests", price: 45 }, { size: "13-16 guests", price: 42 }, { size: "17-20 guests", price: 40 }],
    faqs: [{ question: "How long does each makeup take?", answer: "Each full face makeup application takes approximately 30-45 minutes. We'll schedule appointments to ensure everyone's ready on time." }, { question: "Can we bring inspiration photos?", answer: "Absolutely! Bringing photos helps our artists understand exactly what look you're hoping to achieve." }]
  },
  "yoga-session": {
    title: "Yoga Session",
    duration: "1.5 hours",
    priceFrom: 35,
    groupSize: "8-20 guests",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80",
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80"
    ],
    icon: Dumbbell,
    description: "Start your celebration with mindful movement and relaxation. Our qualified yoga instructor will lead a session tailored to all abilities, combining gentle stretches, breathing exercises, and meditation. It's the perfect way to energize the group, ease any pre-celebration nerves, and set a positive tone for the weekend ahead.",
    included: ["Qualified yoga instructor", "Guided session for all levels", "Yoga mats for all participants", "Relaxation and meditation", "Calming music", "Post-session herbal tea"],
    whatToProvide: ["Indoor or outdoor space to spread out", "Quiet environment", "Comfortable clothing for movement", "Water bottles for participants"],
    pricing: [{ size: "8-12 guests", price: 38 }, { size: "13-16 guests", price: 37 }, { size: "17-20 guests", price: 35 }],
    faqs: [{ question: "Do we need yoga experience?", answer: "Not at all! Our instructor will adapt the session for all levels, from complete beginners to experienced yogis." }, { question: "What style of yoga?", answer: "We typically offer a gentle flow suitable for all abilities, but can adapt to your group's preferences - vinyasa, yin, or even laughter yoga!" }]
  },
  "photography-package": {
    title: "Photography Package",
    duration: "2-3 hours",
    priceFrom: 55,
    groupSize: "8-30 guests",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80"
    ],
    icon: Camera,
    description: "Capture every special moment with a professional photographer. From candid shots during activities to styled group photos, you'll receive stunning images that perfectly document your celebration. No more worrying about who's taking the photos - everyone can be in the pictures and enjoy the moment while our photographer works their magic.",
    included: ["Professional photographer", "2-3 hours coverage", "Candid and posed photography", "Group and individual shots", "Professionally edited photos", "Online gallery for downloading", "High-resolution digital images"],
    whatToProvide: ["Access to property and activities", "Shot list or special requests", "Let us know key moments to capture", "Everyone's permission for photos"],
    pricing: [{ size: "8-15 guests", price: 60 }, { size: "16-22 guests", price: 57 }, { size: "23-30 guests", price: 55 }],
    faqs: [{ question: "How many photos do we receive?", answer: "You'll typically receive 100-200 professionally edited images depending on the package length and activities covered." }, { question: "How soon do we get the photos?", answer: "Photos are usually delivered within 2-3 weeks via an online gallery where you can download and share them." }]
  },
  "flower-crown-making": {
    title: "Flower Crown Making",
    duration: "1.5-2 hours",
    priceFrom: 35,
    groupSize: "8-20 guests",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80",
    gallery: [
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-women-m-ae355045-20251024112745.jpg",
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-beautif-6e71a563-20251024112747.jpg",
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-group-o-c6f54c3e-20251024112747.jpg"
    ],
    icon: Flower2,
    description: "Get creative and make beautiful flower crowns for your group. Perfect Instagram moment included. Take home your handmade creations!",
    included: ["Professional florist instructor", "Fresh flowers and greenery", "All crafting materials and tools", "Step-by-step guidance", "Take-home flower crowns", "Group photo session with crowns"],
    whatToProvide: ["Table space for crafting", "Good natural lighting", "Chairs for participants", "Enthusiasm and creativity!"],
    pricing: [{ size: "8-12 guests", price: 40 }, { size: "13-16 guests", price: 37 }, { size: "17-20 guests", price: 35 }],
    faqs: [{ question: "How long do the crowns last?", answer: "Fresh flower crowns last 1-2 days with proper care. We'll provide tips to keep them looking their best!" }, { question: "Can we choose the flowers?", answer: "Yes! We can tailor the color scheme and flower types to match your group's preferences and wedding colors." }]
  },
  "cocktail-masterclass": {
    title: "Cocktail Masterclass",
    duration: "2 hours",
    priceFrom: 50,
    groupSize: "8-20 guests",
    image: "https://butlersinthebuff.co.uk/wp-content/uploads/2023/05/fun_friendly.jpg.webp",
    gallery: [
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/hen-party-cocktail-classes-4-e1657801576427.jpg-1760963913852.webp",
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80"
    ],
    slug: "cocktail-masterclass",
    icon: Wine,
    description: "Shake things up with a professional cocktail masterclass led by an expert mixologist. Learn to create classic and contemporary cocktails while enjoying a fun, hands-on experience. Each guest will master three different cocktails, complete with professional techniques, garnishing tips, and plenty of tasting along the way. Perfect for bringing your group together with laughs, learning, and delicious drinks.",
    included: ["Professional mixologist instructor", "All spirits, mixers, and ingredients for 3 cocktails per person", "Bar equipment and glassware", "Recipe cards to take home", "Cocktail-making techniques and tips", "Fun group atmosphere with music"],
    whatToProvide: ["Kitchen or bar area with counter space", "Ice and a freezer", "Glasses if you prefer to use your own", "Designated drivers or transport arrangements"],
    pricing: [{ size: "8-12 guests", price: 55 }, { size: "13-16 guests", price: 52 }, { size: "17-20 guests", price: 50 }],
    faqs: [{ question: "What cocktails will we learn?", answer: "You'll typically learn three cocktails, which can include classics like Mojitos, Espresso Martinis, and Cosmopolitans, or we can tailor the selection to your group's preferences." }, { question: "Is the alcohol included?", answer: "Yes! All spirits, mixers, and ingredients are included in the price. We bring everything you need." }, { question: "Can non-drinkers participate?", answer: "Absolutely! We can create mocktail versions of any cocktails so everyone can join in the fun." }]
  },
  "sip-and-paint": {
    title: "Sip & Paint",
    duration: "2-3 hours",
    priceFrom: 45,
    groupSize: "8-20 guests",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-a-sip-a-b0921423-20251024095025.jpg",
    gallery: [
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80"
    ],
    slug: "sip-and-paint",
    icon: Palette,
    description: "Unleash your inner artist with a relaxed and fun painting session. No experience needed - our friendly instructor will guide you step-by-step to create your own masterpiece. Enjoy your favourite drinks while you paint, chat, and laugh with your group. Everyone takes home their own canvas as a unique memento of your celebration. It's creative, social, and brilliantly fun.",
    included: ["Professional art instructor", "Canvas for each guest", "All paints, brushes, and art supplies", "Aprons to protect clothing", "Step-by-step guidance to complete your painting", "Set-up and clean-up"],
    whatToProvide: ["Table space for painting", "Good lighting", "Chairs for all participants", "Drinks and snacks (we recommend prosecco!)"],
    pricing: [{ size: "8-12 guests", price: 48 }, { size: "13-16 guests", price: 47 }, { size: "17-20 guests", price: 45 }],
    faqs: [{ question: "Do we need any art experience?", answer: "Not at all! Our instructor will guide you through every step. It's designed to be fun and relaxed, not intimidating." }, { question: "What will we paint?", answer: "We can tailor the painting to your group - popular choices include landscapes, abstract designs, or even a cheeky hen-themed piece!" }, { question: "How long does it take to complete?", answer: "Most paintings are completed within 2-3 hours, but the pace is flexible based on your group's preference." }]
  },
  "hair-styling": {
    title: "Hair Styling",
    duration: "2-3 hours",
    priceFrom: 35,
    groupSize: "8-20 guests",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80",
      "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800&q=80"
    ],
    slug: "hair-styling",
    icon: Scissors,
    description: "Get glammed up with professional hair styling for your group. Our talented stylists will come to your property and create beautiful looks for your evening out. From elegant updos to beachy waves, bouncy blow-dries to braided styles, we'll make sure everyone looks and feels fabulous. Perfect before a big night out or special celebration dinner.",
    included: ["Professional mobile hair stylist", "Consultation for each guest", "Wash, blow-dry, and style", "Hair products and styling tools", "Touch-up tips and product recommendations", "Group discounts for larger parties"],
    whatToProvide: ["Space with mirrors and good lighting", "Access to plug sockets", "Hair washed beforehand (or let us know if you'd like wet hair styling)", "Any specific style inspiration photos"],
    pricing: [{ size: "8-12 guests", price: 40 }, { size: "13-16 guests", price: 37 }, { size: "17-20 guests", price: 35 }],
    faqs: [{ question: "How long does each person take?", answer: "Each styling typically takes 20-30 minutes, depending on the complexity. We'll schedule to ensure everyone's ready on time." }, { question: "Can we bring inspiration photos?", answer: "Yes, please do! It helps our stylists understand exactly what you're looking for." }, { question: "Do you provide hair extensions or accessories?", answer: "We can arrange extensions and accessories for an additional cost - just let us know when booking." }]
  },
  "karaoke-night": {
    title: "Karaoke Night",
    duration: "3-4 hours",
    priceFrom: 40,
    groupSize: "8-30 guests",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80",
      "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&q=80"
    ],
    slug: "karaoke-night",
    icon: Mic2,
    description: "Bring the party to your property with a full karaoke setup. Belt out your favourite tunes with our professional sound system, wireless microphones, and access to thousands of songs. Our host will keep the energy high, manage the playlist, and make sure everyone gets their moment in the spotlight. From power ballads to guilty pleasure pop anthems, it's guaranteed to be a night of laughs and unforgettable performances.",
    included: ["Professional karaoke system with screen", "Two wireless microphones", "Sound system and speakers", "Access to 10,000+ songs across all genres", "Karaoke host to manage the night", "Disco lights and party atmosphere"],
    whatToProvide: ["Space for the equipment and performance area", "TV or projector screen (or we can provide one)", "Power sockets", "Your best singing voices and confidence!"],
    pricing: [{ size: "8-15 guests", price: 45 }, { size: "16-25 guests", price: 42 }, { size: "26-30 guests", price: 40 }],
    faqs: [{ question: "What if we can't sing?", answer: "That's what makes it fun! Karaoke is all about having a laugh and letting loose - no talent required." }, { question: "Can we request specific songs?", answer: "Yes! Our system has over 10,000 songs, and you can send us a wishlist beforehand to make sure your favourites are ready to go." }, { question: "Is there a host included?", answer: "Yes, our experienced host will run the evening, manage the tech, and keep the energy high so you can focus on performing!" }]
  },
  "spa-treatments": {
    title: "Spa Treatments",
    duration: "2-3 hours",
    priceFrom: 75,
    groupSize: "8-20 guests",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-luxury-spa-t-15d1f1e0-20251021222805.jpg",
    gallery: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80"
    ],
    slug: "spa-treatments",
    icon: Sparkles,
    description: "Treat your group to ultimate relaxation with professional spa treatments at your property. Our mobile spa therapists bring everything needed to create a tranquil spa experience without leaving your accommodation. Choose from massages, facials, manicures, pedicures, and more. It's the perfect way to unwind before a big night out or simply indulge in some well-deserved pampering with your group.",
    included: ["Qualified mobile spa therapists", "All treatment products and equipment", "Massage tables, towels, and robes", "Relaxing music and aromatherapy", "Choice of treatments tailored to your group", "Set-up and clean-up"],
    whatToProvide: ["Quiet space for treatments (bedrooms work perfectly)", "Access to warm water", "Comfortable temperature in treatment rooms", "Let us know treatment preferences in advance"],
    pricing: [{ size: "8-12 guests", price: 85 }, { size: "13-16 guests", price: 80 }, { size: "17-20 guests", price: 75 }],
    faqs: [{ question: "What treatments can we choose?", answer: "Popular options include Swedish massage, back massage, express facials, manicures, pedicures, and reflexology. We'll work with you to create a spa menu for your group." }, { question: "How long is each treatment?", answer: "Treatments typically range from 30-60 minutes per person. We'll schedule a rotation so everyone gets pampered." }, { question: "Can we have multiple therapists?", answer: "Yes! For larger groups, we can bring multiple therapists so treatments happen simultaneously and everyone's finished in time." }]
  }
};

export const relatedExperiences = [
  {
    title: "Cocktail Masterclass",
    duration: "2 hours",
    priceFrom: 50,
    groupSize: "8-20 guests",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/hen-party-cocktail-classes-4-e1657801576427.jpg-1760963913852.webp",
    slug: "cocktail-masterclass",
  },
  {
    title: "Private Chef Experience",
    duration: "3-4 hours",
    priceFrom: 65,
    groupSize: "8-24 guests",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-a-private-ch-e336a153-20251018105040.jpg",
    slug: "private-chef",
  },
  {
    title: "Sip & Paint",
    duration: "2-3 hours",
    priceFrom: 45,
    groupSize: "8-20 guests",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-a-sip-a-b0921423-20251024095025.jpg",
    slug: "sip-and-paint",
  },
  {
    title: "Hair Styling",
    duration: "2-3 hours",
    priceFrom: 35,
    groupSize: "8-20 guests",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
    slug: "hair-styling",
  },
  {
    title: "Karaoke Night",
    duration: "3-4 hours",
    priceFrom: 40,
    groupSize: "8-30 guests",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    slug: "karaoke-night",
  },
  {
    title: "Spa Treatments",
    duration: "2-3 hours",
    priceFrom: 75,
    groupSize: "8-20 guests",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-luxury-spa-t-15d1f1e0-20251021222805.jpg",
    slug: "spa-treatments",
  },
];