import {
  users, type User, type InsertUser,
  farms, type Farm, type InsertFarm,
  devices, type Device, type InsertDevice,
  sensorReadings, type SensorReading, type InsertSensorReading,
  crops, type Crop, type InsertCrop,
  tasks, type Task, type InsertTask,
  marketplaceListings, type MarketplaceListing, type InsertMarketplaceListing,
  blockchainTransactions, type BlockchainTransaction, type InsertBlockchainTransaction,
  learningModules, type LearningModule, type InsertLearningModule,
  userLearningProgress, type UserLearningProgress, type InsertUserLearningProgress,
  weatherForecasts, type WeatherForecast, type InsertWeatherForecast,
  cropRecommendations, type CropRecommendation, type InsertCropRecommendation
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, lte, gte } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Farm operations
  getFarm(id: number): Promise<Farm | undefined>;
  getFarmsByUserId(userId: number): Promise<Farm[]>;
  createFarm(farm: InsertFarm): Promise<Farm>;
  
  // Device operations
  getDevice(id: number): Promise<Device | undefined>;
  getDevicesByUserId(userId: number): Promise<Device[]>;
  getDevicesByFarmId(farmId: number): Promise<Device[]>;
  createDevice(device: InsertDevice): Promise<Device>;
  updateDeviceStatus(id: number, status: string, batteryLevel?: number): Promise<Device>;
  
  // Sensor Reading operations
  getSensorReadings(deviceId: number, type: string, limit?: number): Promise<SensorReading[]>;
  createSensorReading(reading: InsertSensorReading): Promise<SensorReading>;
  
  // Crop operations
  getCrop(id: number): Promise<Crop | undefined>;
  getCropsByUserId(userId: number): Promise<Crop[]>;
  getCropsByFarmId(farmId: number): Promise<Crop[]>;
  createCrop(crop: InsertCrop): Promise<Crop>;
  updateCropStatus(id: number, status: string, healthStatus?: string): Promise<Crop>;
  
  // Task operations
  getTask(id: number): Promise<Task | undefined>;
  getTasksByUserId(userId: number): Promise<Task[]>;
  getTasksByFarmId(farmId: number): Promise<Task[]>;
  getTasksByCropId(cropId: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTaskCompletion(id: number, completed: boolean): Promise<Task>;
  
  // Marketplace operations
  getMarketplaceListing(id: number): Promise<MarketplaceListing | undefined>;
  getMarketplaceListingsByUserId(userId: number): Promise<MarketplaceListing[]>;
  getAllMarketplaceListings(): Promise<MarketplaceListing[]>;
  createMarketplaceListing(listing: InsertMarketplaceListing): Promise<MarketplaceListing>;
  
  // Blockchain operations
  getBlockchainTransaction(id: number): Promise<BlockchainTransaction | undefined>;
  getBlockchainTransactionsByUserId(userId: number): Promise<BlockchainTransaction[]>;
  getBlockchainTransactionsByListingId(listingId: number): Promise<BlockchainTransaction[]>;
  createBlockchainTransaction(transaction: InsertBlockchainTransaction): Promise<BlockchainTransaction>;
  
  // Learning operations
  getLearningModule(id: number): Promise<LearningModule | undefined>;
  getAllLearningModules(): Promise<LearningModule[]>;
  createLearningModule(module: InsertLearningModule): Promise<LearningModule>;
  getUserLearningProgress(userId: number, moduleId: number): Promise<UserLearningProgress | undefined>;
  getAllUserLearningProgress(userId: number): Promise<UserLearningProgress[]>;
  createUserLearningProgress(progress: InsertUserLearningProgress): Promise<UserLearningProgress>;
  updateUserLearningProgress(userId: number, moduleId: number, progress: number, completed: boolean): Promise<UserLearningProgress>;
  
  // Weather operations
  getWeatherForecast(location: string, date?: Date): Promise<WeatherForecast | undefined>;
  getWeatherForecasts(location: string, days?: number): Promise<WeatherForecast[]>;
  createWeatherForecast(forecast: InsertWeatherForecast): Promise<WeatherForecast>;
  
  // Crop recommendation operations
  getCropRecommendation(id: number): Promise<CropRecommendation | undefined>;
  getCropRecommendationsByUserId(userId: number): Promise<CropRecommendation[]>;
  getCropRecommendationsByLocation(location: string): Promise<CropRecommendation[]>;
  createCropRecommendation(recommendation: InsertCropRecommendation): Promise<CropRecommendation>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }
  
  // Farm operations
  async getFarm(id: number): Promise<Farm | undefined> {
    const result = await db.select().from(farms).where(eq(farms.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getFarmsByUserId(userId: number): Promise<Farm[]> {
    return await db.select().from(farms).where(eq(farms.userId, userId));
  }

  async createFarm(farm: InsertFarm): Promise<Farm> {
    const result = await db.insert(farms).values(farm).returning();
    return result[0];
  }
  
  // Device operations
  async getDevice(id: number): Promise<Device | undefined> {
    const result = await db.select().from(devices).where(eq(devices.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getDevicesByUserId(userId: number): Promise<Device[]> {
    return await db.select().from(devices).where(eq(devices.userId, userId));
  }

  async getDevicesByFarmId(farmId: number): Promise<Device[]> {
    return await db.select().from(devices).where(eq(devices.farmId, farmId));
  }

  async createDevice(device: InsertDevice): Promise<Device> {
    const result = await db.insert(devices).values(device).returning();
    return result[0];
  }

  async updateDeviceStatus(id: number, status: string, batteryLevel?: number): Promise<Device> {
    const updateValues: Partial<Device> = { status };
    if (batteryLevel !== undefined) {
      updateValues.batteryLevel = batteryLevel;
    }
    updateValues.lastSeen = new Date();
    
    const result = await db
      .update(devices)
      .set(updateValues)
      .where(eq(devices.id, id))
      .returning();
    
    return result[0];
  }
  
  // Sensor Reading operations
  async getSensorReadings(deviceId: number, type: string, limit: number = 100): Promise<SensorReading[]> {
    return await db
      .select()
      .from(sensorReadings)
      .where(and(
        eq(sensorReadings.deviceId, deviceId),
        eq(sensorReadings.type, type)
      ))
      .orderBy(desc(sensorReadings.timestamp))
      .limit(limit);
  }

  async createSensorReading(reading: InsertSensorReading): Promise<SensorReading> {
    const result = await db.insert(sensorReadings).values(reading).returning();
    return result[0];
  }
  
  // Crop operations
  async getCrop(id: number): Promise<Crop | undefined> {
    const result = await db.select().from(crops).where(eq(crops.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getCropsByUserId(userId: number): Promise<Crop[]> {
    return await db.select().from(crops).where(eq(crops.userId, userId));
  }

  async getCropsByFarmId(farmId: number): Promise<Crop[]> {
    return await db.select().from(crops).where(eq(crops.farmId, farmId));
  }

  async createCrop(crop: InsertCrop): Promise<Crop> {
    const result = await db.insert(crops).values(crop).returning();
    return result[0];
  }

  async updateCropStatus(id: number, status: string, healthStatus?: string): Promise<Crop> {
    const updateValues: Partial<Crop> = { status };
    if (healthStatus !== undefined) {
      updateValues.healthStatus = healthStatus;
    }
    
    const result = await db
      .update(crops)
      .set(updateValues)
      .where(eq(crops.id, id))
      .returning();
    
    return result[0];
  }
  
  // Task operations
  async getTask(id: number): Promise<Task | undefined> {
    const result = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getTasksByUserId(userId: number): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.userId, userId));
  }

  async getTasksByFarmId(farmId: number): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.farmId, farmId));
  }

  async getTasksByCropId(cropId: number): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.cropId, cropId));
  }

  async createTask(task: InsertTask): Promise<Task> {
    const result = await db.insert(tasks).values(task).returning();
    return result[0];
  }

  async updateTaskCompletion(id: number, completed: boolean): Promise<Task> {
    const updateValues: Partial<Task> = { 
      completed,
      completedDate: completed ? new Date() : null
    };
    
    const result = await db
      .update(tasks)
      .set(updateValues)
      .where(eq(tasks.id, id))
      .returning();
    
    return result[0];
  }
  
  // Marketplace operations
  async getMarketplaceListing(id: number): Promise<MarketplaceListing | undefined> {
    const result = await db.select().from(marketplaceListings).where(eq(marketplaceListings.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getMarketplaceListingsByUserId(userId: number): Promise<MarketplaceListing[]> {
    return await db.select().from(marketplaceListings).where(eq(marketplaceListings.userId, userId));
  }

  async getAllMarketplaceListings(): Promise<MarketplaceListing[]> {
    return await db.select().from(marketplaceListings);
  }

  async createMarketplaceListing(listing: InsertMarketplaceListing): Promise<MarketplaceListing> {
    const result = await db.insert(marketplaceListings).values(listing).returning();
    return result[0];
  }
  
  // Blockchain operations
  async getBlockchainTransaction(id: number): Promise<BlockchainTransaction | undefined> {
    const result = await db.select().from(blockchainTransactions).where(eq(blockchainTransactions.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getBlockchainTransactionsByUserId(userId: number): Promise<BlockchainTransaction[]> {
    return await db.select().from(blockchainTransactions).where(eq(blockchainTransactions.userId, userId));
  }

  async getBlockchainTransactionsByListingId(listingId: number): Promise<BlockchainTransaction[]> {
    return await db.select().from(blockchainTransactions).where(eq(blockchainTransactions.listingId, listingId));
  }

  async createBlockchainTransaction(transaction: InsertBlockchainTransaction): Promise<BlockchainTransaction> {
    const result = await db.insert(blockchainTransactions).values(transaction).returning();
    return result[0];
  }
  
  // Learning operations
  async getLearningModule(id: number): Promise<LearningModule | undefined> {
    const result = await db.select().from(learningModules).where(eq(learningModules.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getAllLearningModules(): Promise<LearningModule[]> {
    return await db.select().from(learningModules);
  }

  async createLearningModule(module: InsertLearningModule): Promise<LearningModule> {
    const result = await db.insert(learningModules).values(module).returning();
    return result[0];
  }

  async getUserLearningProgress(userId: number, moduleId: number): Promise<UserLearningProgress | undefined> {
    const result = await db
      .select()
      .from(userLearningProgress)
      .where(and(
        eq(userLearningProgress.userId, userId),
        eq(userLearningProgress.moduleId, moduleId)
      ))
      .limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getAllUserLearningProgress(userId: number): Promise<UserLearningProgress[]> {
    return await db.select().from(userLearningProgress).where(eq(userLearningProgress.userId, userId));
  }

  async createUserLearningProgress(progress: InsertUserLearningProgress): Promise<UserLearningProgress> {
    const result = await db.insert(userLearningProgress).values(progress).returning();
    return result[0];
  }

  async updateUserLearningProgress(userId: number, moduleId: number, progress: number, completed: boolean): Promise<UserLearningProgress> {
    const updateValues: Partial<UserLearningProgress> = { 
      progress,
      completed,
      lastAccessedAt: new Date()
    };
    
    const result = await db
      .update(userLearningProgress)
      .set(updateValues)
      .where(and(
        eq(userLearningProgress.userId, userId),
        eq(userLearningProgress.moduleId, moduleId)
      ))
      .returning();
    
    return result[0];
  }
  
  // Weather operations
  async getWeatherForecast(location: string, date?: Date): Promise<WeatherForecast | undefined> {
    if (date) {
      const result = await db
        .select()
        .from(weatherForecasts)
        .where(and(
          eq(weatherForecasts.location, location),
          eq(weatherForecasts.forecastDate, date)
        ))
        .limit(1);
      return result.length > 0 ? result[0] : undefined;
    } else {
      // Get the most recent forecast for the location
      const result = await db
        .select()
        .from(weatherForecasts)
        .where(eq(weatherForecasts.location, location))
        .orderBy(desc(weatherForecasts.forecastDate))
        .limit(1);
      return result.length > 0 ? result[0] : undefined;
    }
  }

  async getWeatherForecasts(location: string, days: number = 7): Promise<WeatherForecast[]> {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + days);
    
    return await db
      .select()
      .from(weatherForecasts)
      .where(and(
        eq(weatherForecasts.location, location),
        gte(weatherForecasts.forecastDate, today),
        lte(weatherForecasts.forecastDate, endDate)
      ))
      .orderBy(weatherForecasts.forecastDate);
  }

  async createWeatherForecast(forecast: InsertWeatherForecast): Promise<WeatherForecast> {
    const result = await db.insert(weatherForecasts).values(forecast).returning();
    return result[0];
  }
  
  // Crop recommendation operations
  async getCropRecommendation(id: number): Promise<CropRecommendation | undefined> {
    const result = await db.select().from(cropRecommendations).where(eq(cropRecommendations.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getCropRecommendationsByUserId(userId: number): Promise<CropRecommendation[]> {
    return await db.select().from(cropRecommendations).where(eq(cropRecommendations.userId, userId));
  }

  async getCropRecommendationsByLocation(location: string): Promise<CropRecommendation[]> {
    return await db.select().from(cropRecommendations).where(eq(cropRecommendations.location, location));
  }

  async createCropRecommendation(recommendation: InsertCropRecommendation): Promise<CropRecommendation> {
    const result = await db.insert(cropRecommendations).values(recommendation).returning();
    return result[0];
  }

  // Add methods to seed initial data
  async seedInitialData() {
    // Check if we have users
    const userCount = await db.select({ count: users.id }).from(users);
    if (Number(userCount[0]?.count) === 0) {
      // Seed initial data
      await this.seedUsers();
      await this.seedFarms();
      await this.seedDevices();
      await this.seedSensorReadings();
      await this.seedCrops();
      await this.seedTasks();
      await this.seedLearningModules();
      await this.seedWeatherForecasts();
      await this.seedMarketplaceListings();
    }
  }

  private async seedUsers() {
    await db.insert(users).values([
      {
        username: "farmer_raj",
        password: "password123",
        displayName: "Raj Kumar",
        location: "Barabanki",
        preferredLanguage: "hi",
        role: "farmer"
      },
      {
        username: "agro_expert",
        password: "expert456",
        displayName: "Priya Singh",
        location: "Lucknow",
        preferredLanguage: "en",
        role: "expert"
      }
    ]);
  }

  private async seedFarms() {
    await db.insert(farms).values([
      {
        userId: 1,
        name: "Barabanki Farm",
        location: "Barabanki, UP",
        size: 5.5,
        description: "Small family farm with mixed crops"
      }
    ]);
  }

  private async seedDevices() {
    await db.insert(devices).values([
      {
        userId: 1,
        farmId: 1,
        name: "AgroSakhi Band 1",
        type: "AgroSakhi Band",
        location: "North Field",
        status: "online",
        batteryLevel: 85,
        lastSeen: new Date()
      },
      {
        userId: 1,
        farmId: 1,
        name: "SakhiSense Station 1",
        type: "SakhiSense Station",
        location: "Central Field",
        status: "online",
        batteryLevel: 92,
        lastSeen: new Date()
      }
    ]);
  }

  private async seedSensorReadings() {
    const now = new Date();
    await db.insert(sensorReadings).values([
      {
        deviceId: 1,
        type: "soil_moisture",
        value: 42.5,
        unit: "%",
        timestamp: now
      },
      {
        deviceId: 1,
        type: "soil_temperature",
        value: 28.3,
        unit: "°C",
        timestamp: now
      },
      {
        deviceId: 1,
        type: "light_level",
        value: 850,
        unit: "lux",
        timestamp: now
      },
      {
        deviceId: 2,
        type: "soil_moisture",
        value: 38.7,
        unit: "%",
        timestamp: now
      },
      {
        deviceId: 2,
        type: "soil_temperature",
        value: 27.9,
        unit: "°C",
        timestamp: now
      }
    ]);
  }

  private async seedCrops() {
    const plantingDate = new Date();
    plantingDate.setMonth(plantingDate.getMonth() - 1);
    
    const harvestDate = new Date();
    harvestDate.setMonth(harvestDate.getMonth() + 2);
    
    await db.insert(crops).values([
      {
        userId: 1,
        farmId: 1,
        name: "Wheat",
        variety: "HD-2967",
        plantingDate,
        harvestDate,
        status: "active",
        healthStatus: "good",
        area: 2.5
      },
      {
        userId: 1,
        farmId: 1,
        name: "Rice",
        variety: "Pusa Basmati",
        plantingDate,
        harvestDate,
        status: "active",
        healthStatus: "needs_attention",
        area: 1.5
      }
    ]);
  }

  private async seedTasks() {
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + 2);
    
    await db.insert(tasks).values([
      {
        userId: 1,
        farmId: 1,
        cropId: 1,
        title: "Irrigation",
        description: "Water the wheat field",
        scheduledDate,
        completed: false,
        priority: "high"
      },
      {
        userId: 1,
        farmId: 1,
        cropId: 2,
        title: "Apply Fertilizer",
        description: "Apply organic fertilizer to rice crop",
        scheduledDate,
        completed: false,
        priority: "medium"
      }
    ]);
  }

  private async seedLearningModules() {
    await db.insert(learningModules).values([
      {
        title: "Organic Farming Basics",
        description: "Learn the fundamentals of organic farming practices",
        durationMinutes: 60,
        lessonCount: 5,
        difficulty: "beginner"
      },
      {
        title: "Advanced Water Management",
        description: "Techniques for efficient water usage in agriculture",
        durationMinutes: 90,
        lessonCount: 7,
        difficulty: "intermediate"
      }
    ]);
  }

  private async seedWeatherForecasts() {
    const today = new Date();
    
    // Create forecasts for the next 5 days
    for (let i = 0; i < 5; i++) {
      const forecastDate = new Date(today);
      forecastDate.setDate(forecastDate.getDate() + i);
      
      await db.insert(weatherForecasts).values({
        location: "Barabanki",
        forecastDate,
        temperature: 28 + Math.random() * 5,
        minTemperature: 22 + Math.random() * 3,
        maxTemperature: 30 + Math.random() * 5,
        humidity: 60 + Math.random() * 20,
        rainfall: i === 2 ? 15 + Math.random() * 10 : 0, // Rain on day 3
        condition: i === 2 ? "rainy" : "sunny"
      });
    }
  }

  private async seedMarketplaceListings() {
    await db.insert(marketplaceListings).values([
      {
        userId: 1,
        cropName: "Wheat",
        variety: "HD-2967",
        quantity: 100,
        unit: "kg",
        price: 25,
        currency: "INR",
        description: "Organically grown wheat",
        location: "Barabanki, UP",
        isOrganic: true,
        isVerified: false,
        createdAt: new Date()
      }
    ]);
  }
}

export const storage = new DatabaseStorage();