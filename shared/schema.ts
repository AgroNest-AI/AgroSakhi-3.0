import { pgTable, text, serial, integer, boolean, timestamp, real, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  location: text("location"),
  preferredLanguage: text("preferred_language").default("en"),
  role: text("role").default("farmer"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  location: true,
  preferredLanguage: true,
});

// Farm Schema
export const farms = pgTable("farms", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  location: text("location"),
  size: real("size"), // in hectares
  description: text("description"),
});

export const insertFarmSchema = createInsertSchema(farms).pick({
  userId: true,
  name: true,
  location: true,
  size: true,
  description: true,
});

// IoT Device Schema
export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  farmId: integer("farm_id"),
  name: text("name").notNull(),
  type: text("type").notNull(), // e.g., "AgroSakhi Band", "SakhiSense Station", "Pest Monitor"
  location: text("location"),
  status: text("status").default("online"),
  batteryLevel: integer("battery_level"), // percentage
  lastSeen: timestamp("last_seen").defaultNow(),
});

export const insertDeviceSchema = createInsertSchema(devices).pick({
  userId: true,
  farmId: true,
  name: true,
  type: true,
  location: true,
  status: true,
  batteryLevel: true,
});

// Sensor Reading Schema
export const sensorReadings = pgTable("sensor_readings", {
  id: serial("id").primaryKey(),
  deviceId: integer("device_id").notNull(),
  type: text("type").notNull(), // e.g., "soil_moisture", "soil_temperature", "light_level", "soil_ph"
  value: real("value").notNull(),
  unit: text("unit").notNull(), // e.g., "%", "°C", "pH"
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertSensorReadingSchema = createInsertSchema(sensorReadings).pick({
  deviceId: true,
  type: true,
  value: true,
  unit: true,
});

// Crop Schema
export const crops = pgTable("crops", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  farmId: integer("farm_id"),
  name: text("name").notNull(),
  variety: text("variety"),
  plantingDate: timestamp("planting_date"),
  harvestDate: timestamp("harvest_date"),
  status: text("status").default("active"), // e.g., "active", "harvested"
  healthStatus: text("health_status").default("good"), // e.g., "good", "needs_attention", "poor"
  area: real("area"), // in hectares
});

export const insertCropSchema = createInsertSchema(crops).pick({
  userId: true,
  farmId: true,
  name: true,
  variety: true,
  plantingDate: true,
  harvestDate: true,
  status: true,
  healthStatus: true,
  area: true,
});

// Task Schema
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  farmId: integer("farm_id"),
  cropId: integer("crop_id"),
  title: text("title").notNull(),
  description: text("description"),
  scheduledDate: timestamp("scheduled_date"),
  completedDate: timestamp("completed_date"),
  completed: boolean("completed").default(false),
  priority: text("priority").default("medium"), // e.g., "low", "medium", "high"
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  userId: true,
  farmId: true,
  cropId: true,
  title: true,
  description: true,
  scheduledDate: true,
  priority: true,
});

// Marketplace Listing Schema
export const marketplaceListings = pgTable("marketplace_listings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  cropName: text("crop_name").notNull(),
  variety: text("variety"),
  quantity: real("quantity").notNull(),
  unit: text("unit").notNull(), // e.g., "kg", "quintal"
  price: real("price").notNull(),
  currency: text("currency").default("INR"),
  description: text("description"),
  location: text("location"),
  isOrganic: boolean("is_organic").default(false),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMarketplaceListingSchema = createInsertSchema(marketplaceListings).pick({
  userId: true,
  cropName: true,
  variety: true,
  quantity: true,
  unit: true,
  price: true,
  currency: true,
  description: true,
  location: true,
  isOrganic: true,
});

// Blockchain Transaction Schema (for traceability)
export const blockchainTransactions = pgTable("blockchain_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  listingId: integer("listing_id"),
  transactionType: text("transaction_type").notNull(), // e.g., "harvest", "quality_check", "market_listing", "sale"
  details: json("details"),
  transactionHash: text("transaction_hash"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertBlockchainTransactionSchema = createInsertSchema(blockchainTransactions).pick({
  userId: true,
  listingId: true,
  transactionType: true,
  details: true,
  transactionHash: true,
});

// Learning Module Schema
export const learningModules = pgTable("learning_modules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes"),
  lessonCount: integer("lesson_count"),
  difficulty: text("difficulty").default("beginner"), // e.g., "beginner", "intermediate", "advanced"
});

export const insertLearningModuleSchema = createInsertSchema(learningModules).pick({
  title: true,
  description: true,
  durationMinutes: true,
  lessonCount: true,
  difficulty: true,
});

// User Progress for Learning
export const userLearningProgress = pgTable("user_learning_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  moduleId: integer("module_id").notNull(),
  progress: integer("progress").default(0), // percentage
  completed: boolean("completed").default(false),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
});

export const insertUserLearningProgressSchema = createInsertSchema(userLearningProgress).pick({
  userId: true,
  moduleId: true,
  progress: true,
  completed: true,
});

// Weather Forecast Schema
export const weatherForecasts = pgTable("weather_forecasts", {
  id: serial("id").primaryKey(),
  location: text("location").notNull(),
  forecastDate: timestamp("forecast_date").notNull(),
  temperature: real("temperature"),
  minTemperature: real("min_temperature"),
  maxTemperature: real("max_temperature"),
  humidity: real("humidity"),
  rainfall: real("rainfall"),
  condition: text("condition"), // e.g., "sunny", "cloudy", "rainy"
});

export const insertWeatherForecastSchema = createInsertSchema(weatherForecasts).pick({
  location: true,
  forecastDate: true,
  temperature: true,
  minTemperature: true,
  maxTemperature: true,
  humidity: true,
  rainfall: true,
  condition: true,
});

// Crop Recommendation Schema
export const cropRecommendations = pgTable("crop_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  location: text("location"),
  cropName: text("crop_name").notNull(),
  variety: text("variety"),
  matchPercentage: integer("match_percentage"),
  reason: text("reason"),
});

export const insertCropRecommendationSchema = createInsertSchema(cropRecommendations).pick({
  userId: true,
  location: true,
  cropName: true,
  variety: true,
  matchPercentage: true,
  reason: true,
});

// Export Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Farm = typeof farms.$inferSelect;
export type InsertFarm = z.infer<typeof insertFarmSchema>;

export type Device = typeof devices.$inferSelect;
export type InsertDevice = z.infer<typeof insertDeviceSchema>;

export type SensorReading = typeof sensorReadings.$inferSelect;
export type InsertSensorReading = z.infer<typeof insertSensorReadingSchema>;

export type Crop = typeof crops.$inferSelect;
export type InsertCrop = z.infer<typeof insertCropSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type MarketplaceListing = typeof marketplaceListings.$inferSelect;
export type InsertMarketplaceListing = z.infer<typeof insertMarketplaceListingSchema>;

export type BlockchainTransaction = typeof blockchainTransactions.$inferSelect;
export type InsertBlockchainTransaction = z.infer<typeof insertBlockchainTransactionSchema>;

export type LearningModule = typeof learningModules.$inferSelect;
export type InsertLearningModule = z.infer<typeof insertLearningModuleSchema>;

export type UserLearningProgress = typeof userLearningProgress.$inferSelect;
export type InsertUserLearningProgress = z.infer<typeof insertUserLearningProgressSchema>;

export type WeatherForecast = typeof weatherForecasts.$inferSelect;
export type InsertWeatherForecast = z.infer<typeof insertWeatherForecastSchema>;

export type CropRecommendation = typeof cropRecommendations.$inferSelect;
export type InsertCropRecommendation = z.infer<typeof insertCropRecommendationSchema>;
