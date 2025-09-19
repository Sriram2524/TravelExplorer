// Shared destinations data for Vercel API routes
export const destinations = [
  {
    id: "santorini-greece",
    name: "Santorini",
    country: "Greece",
    region: "Europe",
    description: "A stunning Greek island known for its white-washed buildings, blue domes, and breathtaking sunsets over the Aegean Sea.",
    imageUrl: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2535&q=80",
    latitude: 36.3932,
    longitude: 25.4615,
    tags: ["beach", "romantic", "cultural", "luxury"],
    activities: ["Sunset watching", "Wine tasting", "Beach relaxation", "Photography", "Archaeological sites"],
    bestTimeToVisit: "April to October",
    averageCost: 150,
    difficulty: "easy"
  },
  {
    id: "machu-picchu-peru",
    name: "Machu Picchu",
    country: "Peru",
    region: "South America",
    description: "An ancient Incan citadel set high in the Andes Mountains, offering breathtaking views and rich archaeological significance.",
    imageUrl: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80",
    latitude: -13.1631,
    longitude: -72.5450,
    tags: ["adventure", "cultural", "historical", "hiking"],
    activities: ["Hiking", "Photography", "Archaeological exploration", "Inca Trail", "Cultural tours"],
    bestTimeToVisit: "May to September",
    averageCost: 200,
    difficulty: "moderate"
  },
  {
    id: "reykjavik-iceland",
    name: "Reykjavik",
    country: "Iceland",
    region: "Europe",
    description: "Iceland's capital city, known for its vibrant culture, stunning natural landscapes, and proximity to geothermal wonders.",
    imageUrl: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    latitude: 64.9631,
    longitude: -19.0208,
    tags: ["adventure", "nature", "cultural", "northern-lights"],
    activities: ["Northern Lights viewing", "Blue Lagoon", "Glacier tours", "Geysir exploration", "Whale watching"],
    bestTimeToVisit: "June to August (summer), September to March (Northern Lights)",
    averageCost: 180,
    difficulty: "easy"
  },
  {
    id: "dubai-uae",
    name: "Dubai",
    country: "United Arab Emirates",
    region: "Middle East",
    description: "A modern metropolis known for luxury shopping, ultramodern architecture, and vibrant nightlife scene.",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    latitude: 25.2048,
    longitude: 55.2708,
    tags: ["luxury", "shopping", "modern", "beach"],
    activities: ["Burj Khalifa", "Desert safari", "Shopping", "Beach resorts", "Fine dining"],
    bestTimeToVisit: "November to March",
    averageCost: 250,
    difficulty: "easy"
  },
  {
    id: "maldives",
    name: "Maldives",
    country: "Maldives",
    region: "Asia",
    description: "A tropical paradise of 1,192 coral islands known for clear blue waters, vibrant coral reefs, and luxury resorts.",
    imageUrl: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    latitude: 3.2028,
    longitude: 73.2207,
    tags: ["beach", "luxury", "romantic", "diving"],
    activities: ["Snorkeling", "Scuba diving", "Spa treatments", "Water sports", "Sunset cruises"],
    bestTimeToVisit: "November to April",
    averageCost: 400,
    difficulty: "easy"
  },
  {
    id: "kyoto-japan",
    name: "Kyoto",
    country: "Japan",
    region: "Asia",
    description: "Former imperial capital of Japan, famous for its classical Buddhist temples, gardens, imperial palaces, and traditional wooden houses.",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    latitude: 35.0116,
    longitude: 135.7681,
    tags: ["cultural", "historical", "traditional", "temples"],
    activities: ["Temple visits", "Traditional tea ceremony", "Cherry blossom viewing", "Bamboo forest walks", "Geisha districts"],
    bestTimeToVisit: "March to May, September to November",
    averageCost: 120,
    difficulty: "easy"
  }
];

export function getAllDestinations() {
  return destinations;
}

export function getDestination(id) {
  return destinations.find(dest => dest.id === id);
}

export function getDestinationsByRegion(region) {
  return destinations.filter(dest => 
    dest.region.toLowerCase() === region.toLowerCase()
  );
}

export function getDestinationsByTag(tag) {
  return destinations.filter(dest => 
    dest.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

export function searchDestinations(query) {
  const searchTerm = query.toLowerCase();
  return destinations.filter(dest => 
    dest.name.toLowerCase().includes(searchTerm) ||
    dest.country.toLowerCase().includes(searchTerm) ||
    dest.description.toLowerCase().includes(searchTerm) ||
    dest.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}