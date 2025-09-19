import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const destinations = pgTable("destinations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  region: text("region").notNull(),
  country: text("country").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description").notNull(),
  imageUrl: text("image_url").notNull(),
  galleryImages: text("gallery_images").array().notNull(),
  rating: real("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  bestTimeToVisit: text("best_time_to_visit").notNull(),
  language: text("language").notNull(),
  currency: text("currency").notNull(),
  timezone: text("timezone").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  activities: text("activities").array().notNull(),
  tags: text("tags").array().notNull(),
});

export const insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true,
});

export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinations.$inferSelect;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// User favorites table
export const userFavorites = pgTable("user_favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  destinationId: varchar("destination_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Trip planning tables
export const tripPlans = pgTable("trip_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tripPlanDestinations = pgTable("trip_plan_destinations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tripPlanId: varchar("trip_plan_id").notNull(),
  destinationId: varchar("destination_id").notNull(),
  notes: text("notes"),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  favorites: many(userFavorites),
  tripPlans: many(tripPlans),
}));

export const destinationsRelations = relations(destinations, ({ many }) => ({
  favorites: many(userFavorites),
  tripPlanDestinations: many(tripPlanDestinations),
}));

export const userFavoritesRelations = relations(userFavorites, ({ one }) => ({
  user: one(users, {
    fields: [userFavorites.userId],
    references: [users.id],
  }),
  destination: one(destinations, {
    fields: [userFavorites.destinationId],
    references: [destinations.id],
  }),
}));

export const tripPlansRelations = relations(tripPlans, ({ one, many }) => ({
  user: one(users, {
    fields: [tripPlans.userId],
    references: [users.id],
  }),
  destinations: many(tripPlanDestinations),
}));

export const tripPlanDestinationsRelations = relations(tripPlanDestinations, ({ one }) => ({
  tripPlan: one(tripPlans, {
    fields: [tripPlanDestinations.tripPlanId],
    references: [tripPlans.id],
  }),
  destination: one(destinations, {
    fields: [tripPlanDestinations.destinationId],
    references: [destinations.id],
  }),
}));

// Insert schemas for new tables
export const insertUserFavoriteSchema = createInsertSchema(userFavorites).omit({
  id: true,
  createdAt: true,
});

export const insertTripPlanSchema = createInsertSchema(tripPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTripPlanDestinationSchema = createInsertSchema(tripPlanDestinations).omit({
  id: true,
  addedAt: true,
});

// Export types
export type InsertUserFavorite = z.infer<typeof insertUserFavoriteSchema>;
export type UserFavorite = typeof userFavorites.$inferSelect;

export type InsertTripPlan = z.infer<typeof insertTripPlanSchema>;
export type TripPlan = typeof tripPlans.$inferSelect;

export type InsertTripPlanDestination = z.infer<typeof insertTripPlanDestinationSchema>;
export type TripPlanDestination = typeof tripPlanDestinations.$inferSelect;
