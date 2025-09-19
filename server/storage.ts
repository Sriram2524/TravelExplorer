import { randomUUID } from "crypto";
import { 
  type User, type InsertUser, 
  type Destination, type InsertDestination,
  type UserFavorite, type InsertUserFavorite,
  type TripPlan, type InsertTripPlan,
  type TripPlanDestination, type InsertTripPlanDestination
} from "@shared/schema";
import { db } from "./db";
import { users, destinations, userFavorites, tripPlans, tripPlanDestinations } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Destination management
  getAllDestinations(): Promise<Destination[]>;
  getDestination(id: string): Promise<Destination | undefined>;
  getDestinationsByRegion(region: string): Promise<Destination[]>;
  getDestinationsByTag(tag: string): Promise<Destination[]>;
  searchDestinations(query: string): Promise<Destination[]>;
  
  // Favorites management
  getUserFavorites(userId: string): Promise<UserFavorite[]>;
  addToFavorites(favorite: InsertUserFavorite): Promise<UserFavorite>;
  removeFromFavorites(userId: string, destinationId: string): Promise<void>;
  isFavorited(userId: string, destinationId: string): Promise<boolean>;
  
  // Trip planning
  getUserTripPlans(userId: string): Promise<TripPlan[]>;
  getTripPlan(id: string): Promise<TripPlan | undefined>;
  createTripPlan(tripPlan: InsertTripPlan): Promise<TripPlan>;
  updateTripPlan(id: string, updates: Partial<InsertTripPlan>): Promise<TripPlan>;
  deleteTripPlan(id: string): Promise<void>;
  
  // Trip plan destinations
  getTripPlanDestinations(tripPlanId: string): Promise<TripPlanDestination[]>;
  addDestinationToTripPlan(tripPlanDestination: InsertTripPlanDestination): Promise<TripPlanDestination>;
  removeDestinationFromTripPlan(tripPlanId: string, destinationId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  private users = new Map<string, User>();
  private destinations = new Map<string, Destination>();
  private userFavorites = new Map<string, UserFavorite>();
  private tripPlans = new Map<string, TripPlan>();
  private tripPlanDestinations = new Map<string, TripPlanDestination>();

  constructor() {
    this.initializeDestinations();
  }

  private initializeDestinations() {
    const sampleDestinations: Destination[] = [
      {
        id: "santorini-greece",
        name: "Santorini, Greece",
        region: "Europe",
        country: "Greece",
        description: "Experience stunning sunsets, white-washed buildings, and crystal-clear waters in this iconic Greek island paradise.",
        longDescription: "Santorini is a stunning Greek island known for its dramatic views, stunning sunsets, and distinctive architecture. The island features white-washed buildings perched on volcanic cliffs, crystal-clear waters, and some of the world's most beautiful sunsets. Visitors can explore traditional villages, taste local wines, and relax on unique volcanic beaches.",
        imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        galleryImages: [
          "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
        ],
        rating: 4.8,
        reviewCount: 2847,
        bestTimeToVisit: "Apr - Oct",
        language: "Greek",
        currency: "Euro (EUR)",
        timezone: "EET (UTC+2)",
        latitude: 36.3932,
        longitude: 25.4615,
        activities: ["Sunset Photography", "Wine Tasting", "Beach Hopping", "Caldera Cruise"],
        tags: ["beach", "culture", "europe", "romantic", "sunset"]
      },
      {
        id: "kyoto-japan",
        name: "Kyoto, Japan",
        region: "Asia",
        country: "Japan",
        description: "Immerse yourself in ancient traditions, beautiful temples, and serene gardens in Japan's cultural heart.",
        longDescription: "Kyoto, the former imperial capital of Japan, is a city where ancient traditions blend seamlessly with modern life. Known for its thousands of temples, traditional wooden houses, and stunning gardens, Kyoto offers visitors a glimpse into Japan's rich cultural heritage. The city is famous for its geishas, tea ceremonies, and cherry blossom season.",
        imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        galleryImages: [
          "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1492571350019-22de08371fd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
        ],
        rating: 4.9,
        reviewCount: 3256,
        bestTimeToVisit: "Mar - May, Sep - Nov",
        language: "Japanese",
        currency: "Japanese Yen (JPY)",
        timezone: "JST (UTC+9)",
        latitude: 35.0116,
        longitude: 135.7681,
        activities: ["Temple Visits", "Tea Ceremony", "Garden Tours", "Cherry Blossom Viewing"],
        tags: ["culture", "asia", "temples", "traditional", "gardens"]
      },
      {
        id: "machu-picchu-peru",
        name: "Machu Picchu, Peru",
        region: "Americas",
        country: "Peru",
        description: "Explore the mystical ancient Incan citadel nestled high in the Andes mountains, a true wonder of the world.",
        longDescription: "Machu Picchu is an ancient Incan citadel set high in the Andes Mountains of Peru. Built in the 15th century and later abandoned, this archaeological wonder is renowned for its sophisticated dry-stone construction and stunning mountain setting. The site offers breathtaking views and insights into the remarkable Incan civilization.",
        imageUrl: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        galleryImages: [
          "https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1580729242561-dbba430bce60?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1539650116574-75c0c6d0c7f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
        ],
        rating: 4.7,
        reviewCount: 1924,
        bestTimeToVisit: "May - Sep",
        language: "Spanish, Quechua",
        currency: "Peruvian Sol (PEN)",
        timezone: "PET (UTC-5)",
        latitude: -13.1631,
        longitude: -72.5450,
        activities: ["Hiking", "Archaeological Tours", "Photography", "Inca Trail"],
        tags: ["adventure", "americas", "hiking", "ancient", "mountains"]
      },
      {
        id: "maldives",
        name: "Maldives",
        region: "Asia",
        country: "Maldives",
        description: "Escape to paradise with pristine beaches, luxury overwater villas, and world-class diving in crystal-clear waters.",
        longDescription: "The Maldives is a tropical paradise consisting of 1,192 coral islands grouped into 26 atolls. Known for its pristine white sand beaches, crystal-clear turquoise waters, and luxury overwater bungalows, it's the perfect destination for a romantic getaway or peaceful retreat. The underwater world offers incredible diving and snorkeling opportunities.",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        galleryImages: [
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
        ],
        rating: 4.9,
        reviewCount: 2156,
        bestTimeToVisit: "Nov - Apr",
        language: "Dhivehi, English",
        currency: "Maldivian Rufiyaa (MVR)",
        timezone: "MVT (UTC+5)",
        latitude: 3.2028,
        longitude: 73.2207,
        activities: ["Diving", "Snorkeling", "Spa Treatments", "Water Sports"],
        tags: ["beach", "asia", "luxury", "diving", "romantic"]
      },
      {
        id: "iceland",
        name: "Iceland",
        region: "Europe",
        country: "Iceland",
        description: "Witness the magical Northern Lights, explore dramatic waterfalls, and relax in geothermal hot springs.",
        longDescription: "Iceland is a Nordic island country known for its dramatic landscapes, including volcanoes, geysers, hot springs, and lava fields. The country offers unique natural phenomena like the Northern Lights and midnight sun, along with stunning waterfalls, black sand beaches, and glacier lagoons. It's a paradise for nature lovers and adventure seekers.",
        imageUrl: "https://images.unsplash.com/photo-1551524164-6cf31e4ab5e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        galleryImages: [
          "https://images.unsplash.com/photo-1476610182048-b716b8518aae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1551524164-6cf31e4ab5e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1549739181-e9b788ce1c30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
        ],
        rating: 4.8,
        reviewCount: 1789,
        bestTimeToVisit: "Jun - Aug (summer), Sep - Mar (Northern Lights)",
        language: "Icelandic",
        currency: "Icelandic Króna (ISK)",
        timezone: "GMT (UTC+0)",
        latitude: 64.9631,
        longitude: -19.0208,
        activities: ["Northern Lights", "Hot Springs", "Glacier Tours", "Waterfall Hiking"],
        tags: ["adventure", "europe", "northern-lights", "nature", "unique"]
      },
      {
        id: "dubai-uae",
        name: "Dubai, UAE",
        region: "Middle East",
        country: "United Arab Emirates",
        description: "Experience luxury shopping, futuristic architecture, and desert adventures in this modern metropolis.",
        longDescription: "Dubai is a futuristic city in the United Arab Emirates known for its ultramodern architecture, luxury shopping, and vibrant nightlife. Home to the world's tallest building (Burj Khalifa) and largest shopping mall, Dubai offers everything from desert safaris to indoor skiing. It's a perfect blend of traditional Middle Eastern culture and cutting-edge modernity.",
        imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        galleryImages: [
          "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1539650116574-75c0c6d0c7f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1580479542299-6758b00b8c20?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1502780402662-acc01917275e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
        ],
        rating: 4.6,
        reviewCount: 3421,
        bestTimeToVisit: "Nov - Mar",
        language: "Arabic, English",
        currency: "UAE Dirham (AED)",
        timezone: "GST (UTC+4)",
        latitude: 25.2048,
        longitude: 55.2708,
        activities: ["Burj Khalifa", "Desert Safari", "Shopping", "Architecture Tours"],
        tags: ["luxury", "modern", "shopping", "architecture", "desert"]
      }
    ];

    sampleDestinations.forEach(destination => {
      this.destinations.set(destination.id, destination);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }

  async getDestination(id: string): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }

  async getDestinationsByRegion(region: string): Promise<Destination[]> {
    return Array.from(this.destinations.values()).filter(
      destination => destination.region.toLowerCase() === region.toLowerCase()
    );
  }

  async getDestinationsByTag(tag: string): Promise<Destination[]> {
    return Array.from(this.destinations.values()).filter(
      destination => destination.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }

  async searchDestinations(query: string): Promise<Destination[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.destinations.values()).filter(destination =>
      destination.name.toLowerCase().includes(searchTerm) ||
      destination.country.toLowerCase().includes(searchTerm) ||
      destination.region.toLowerCase().includes(searchTerm) ||
      destination.description.toLowerCase().includes(searchTerm) ||
      destination.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Favorites management
  async getUserFavorites(userId: string): Promise<UserFavorite[]> {
    return Array.from(this.userFavorites.values()).filter(
      favorite => favorite.userId === userId
    );
  }

  async addToFavorites(insertFavorite: InsertUserFavorite): Promise<UserFavorite> {
    const id = randomUUID();
    const favorite: UserFavorite = { ...insertFavorite, id, createdAt: new Date() };
    this.userFavorites.set(id, favorite);
    return favorite;
  }

  async removeFromFavorites(userId: string, destinationId: string): Promise<void> {
    for (const [id, favorite] of Array.from(this.userFavorites.entries())) {
      if (favorite.userId === userId && favorite.destinationId === destinationId) {
        this.userFavorites.delete(id);
        break;
      }
    }
  }

  async isFavorited(userId: string, destinationId: string): Promise<boolean> {
    return Array.from(this.userFavorites.values()).some(
      favorite => favorite.userId === userId && favorite.destinationId === destinationId
    );
  }

  // Trip planning
  async getUserTripPlans(userId: string): Promise<TripPlan[]> {
    return Array.from(this.tripPlans.values()).filter(
      plan => plan.userId === userId
    );
  }

  async getTripPlan(id: string): Promise<TripPlan | undefined> {
    return this.tripPlans.get(id);
  }

  async createTripPlan(insertTripPlan: InsertTripPlan): Promise<TripPlan> {
    const id = randomUUID();
    const now = new Date();
    const tripPlan: TripPlan = { ...insertTripPlan, id, createdAt: now, updatedAt: now, description: insertTripPlan.description ?? null };
    this.tripPlans.set(id, tripPlan);
    return tripPlan;
  }

  async updateTripPlan(id: string, updates: Partial<InsertTripPlan>): Promise<TripPlan> {
    const existing = this.tripPlans.get(id);
    if (!existing) {
      throw new Error(`Trip plan with id ${id} not found`);
    }
    const updated: TripPlan = { ...existing, ...updates, updatedAt: new Date() };
    this.tripPlans.set(id, updated);
    return updated;
  }

  async deleteTripPlan(id: string): Promise<void> {
    this.tripPlans.delete(id);
  }

  // Trip plan destinations
  async getTripPlanDestinations(tripPlanId: string): Promise<TripPlanDestination[]> {
    return Array.from(this.tripPlanDestinations.values()).filter(
      dest => dest.tripPlanId === tripPlanId
    );
  }

  async addDestinationToTripPlan(insertTripPlanDestination: InsertTripPlanDestination): Promise<TripPlanDestination> {
    const id = randomUUID();
    const tripPlanDestination: TripPlanDestination = { ...insertTripPlanDestination, id, addedAt: new Date(), notes: insertTripPlanDestination.notes ?? null };
    this.tripPlanDestinations.set(id, tripPlanDestination);
    return tripPlanDestination;
  }

  async removeDestinationFromTripPlan(tripPlanId: string, destinationId: string): Promise<void> {
    for (const [id, dest] of Array.from(this.tripPlanDestinations.entries())) {
      if (dest.tripPlanId === tripPlanId && dest.destinationId === destinationId) {
        this.tripPlanDestinations.delete(id);
        break;
      }
    }
  }
}

export const storage = new DatabaseStorage();
