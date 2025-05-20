import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertTaskSchema, 
  insertDeviceSchema,
  insertSensorReadingSchema,
  insertCropSchema,
  insertMarketplaceListingSchema,
  insertBlockchainTransactionSchema,
  insertLearningModuleSchema,
  insertUserLearningProgressSchema,
  insertWeatherForecastSchema,
  insertCropRecommendationSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // User routes
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't send the password in the response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      // Don't send the password in the response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Don't send the password in the response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Farm routes
  app.get("/api/farms/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const farms = await storage.getFarmsByUserId(userId);
    res.json(farms);
  });

  // IoT Device routes
  app.get("/api/devices/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const devices = await storage.getDevicesByUserId(userId);
    res.json(devices);
  });

  app.post("/api/devices", async (req: Request, res: Response) => {
    try {
      const deviceData = insertDeviceSchema.parse(req.body);
      const device = await storage.createDevice(deviceData);
      res.status(201).json(device);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid device data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create device" });
    }
  });

  app.patch("/api/devices/:id/status", async (req: Request, res: Response) => {
    try {
      const deviceId = parseInt(req.params.id);
      if (isNaN(deviceId)) {
        return res.status(400).json({ message: "Invalid device ID" });
      }
      
      const { status, batteryLevel } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const device = await storage.updateDeviceStatus(deviceId, status, batteryLevel);
      res.json(device);
    } catch (error) {
      res.status(500).json({ message: "Failed to update device status" });
    }
  });

  // Sensor Reading routes
  app.get("/api/sensors/:deviceId/:type", async (req: Request, res: Response) => {
    const deviceId = parseInt(req.params.deviceId);
    if (isNaN(deviceId)) {
      return res.status(400).json({ message: "Invalid device ID" });
    }

    const { type } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    
    const readings = await storage.getSensorReadings(deviceId, type, limit);
    res.json(readings);
  });

  app.post("/api/sensors", async (req: Request, res: Response) => {
    try {
      const readingData = insertSensorReadingSchema.parse(req.body);
      const reading = await storage.createSensorReading(readingData);
      res.status(201).json(reading);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid sensor reading data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create sensor reading" });
    }
  });

  // Crop routes
  app.get("/api/crops/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const crops = await storage.getCropsByUserId(userId);
    res.json(crops);
  });

  app.post("/api/crops", async (req: Request, res: Response) => {
    try {
      const cropData = insertCropSchema.parse(req.body);
      const crop = await storage.createCrop(cropData);
      res.status(201).json(crop);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid crop data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create crop" });
    }
  });

  app.patch("/api/crops/:id/status", async (req: Request, res: Response) => {
    try {
      const cropId = parseInt(req.params.id);
      if (isNaN(cropId)) {
        return res.status(400).json({ message: "Invalid crop ID" });
      }
      
      const { status, healthStatus } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const crop = await storage.updateCropStatus(cropId, status, healthStatus);
      res.json(crop);
    } catch (error) {
      res.status(500).json({ message: "Failed to update crop status" });
    }
  });

  // Task routes
  app.get("/api/tasks/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const tasks = await storage.getTasksByUserId(userId);
    res.json(tasks);
  });

  app.post("/api/tasks", async (req: Request, res: Response) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.patch("/api/tasks/:id/complete", async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id);
      if (isNaN(taskId)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
      
      const { completed } = req.body;
      if (completed === undefined) {
        return res.status(400).json({ message: "Completed status is required" });
      }
      
      const task = await storage.updateTaskCompletion(taskId, completed);
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to update task completion" });
    }
  });

  // Marketplace routes
  app.get("/api/marketplace", async (_req: Request, res: Response) => {
    const listings = await storage.getAllMarketplaceListings();
    res.json(listings);
  });

  app.get("/api/marketplace/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const listings = await storage.getMarketplaceListingsByUserId(userId);
    res.json(listings);
  });

  app.post("/api/marketplace", async (req: Request, res: Response) => {
    try {
      const listingData = insertMarketplaceListingSchema.parse(req.body);
      const listing = await storage.createMarketplaceListing(listingData);
      res.status(201).json(listing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid marketplace listing data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create marketplace listing" });
    }
  });

  // Blockchain routes
  app.get("/api/blockchain/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const transactions = await storage.getBlockchainTransactionsByUserId(userId);
    res.json(transactions);
  });

  app.get("/api/blockchain/listing/:listingId", async (req: Request, res: Response) => {
    const listingId = parseInt(req.params.listingId);
    if (isNaN(listingId)) {
      return res.status(400).json({ message: "Invalid listing ID" });
    }

    const transactions = await storage.getBlockchainTransactionsByListingId(listingId);
    res.json(transactions);
  });

  app.post("/api/blockchain", async (req: Request, res: Response) => {
    try {
      const transactionData = insertBlockchainTransactionSchema.parse(req.body);
      const transaction = await storage.createBlockchainTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid blockchain transaction data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create blockchain transaction" });
    }
  });

  // Learning Module routes
  app.get("/api/learning/modules", async (_req: Request, res: Response) => {
    const modules = await storage.getAllLearningModules();
    res.json(modules);
  });

  app.get("/api/learning/modules/:id", async (req: Request, res: Response) => {
    const moduleId = parseInt(req.params.id);
    if (isNaN(moduleId)) {
      return res.status(400).json({ message: "Invalid module ID" });
    }

    const module = await storage.getLearningModule(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Learning module not found" });
    }

    res.json(module);
  });

  app.post("/api/learning/modules", async (req: Request, res: Response) => {
    try {
      const moduleData = insertLearningModuleSchema.parse(req.body);
      const module = await storage.createLearningModule(moduleData);
      res.status(201).json(module);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid learning module data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create learning module" });
    }
  });

  // User Learning Progress routes
  app.get("/api/learning/progress/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const progress = await storage.getAllUserLearningProgress(userId);
    res.json(progress);
  });

  app.get("/api/learning/progress/:userId/:moduleId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const moduleId = parseInt(req.params.moduleId);
    
    if (isNaN(userId) || isNaN(moduleId)) {
      return res.status(400).json({ message: "Invalid user ID or module ID" });
    }

    const progress = await storage.getUserLearningProgress(userId, moduleId);
    if (!progress) {
      return res.status(404).json({ message: "Learning progress not found" });
    }

    res.json(progress);
  });

  app.post("/api/learning/progress", async (req: Request, res: Response) => {
    try {
      const progressData = insertUserLearningProgressSchema.parse(req.body);
      const progress = await storage.createUserLearningProgress(progressData);
      res.status(201).json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid learning progress data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create learning progress" });
    }
  });

  app.patch("/api/learning/progress/:userId/:moduleId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const moduleId = parseInt(req.params.moduleId);
      
      if (isNaN(userId) || isNaN(moduleId)) {
        return res.status(400).json({ message: "Invalid user ID or module ID" });
      }
      
      const { progress, completed } = req.body;
      if (progress === undefined || completed === undefined) {
        return res.status(400).json({ message: "Progress and completed status are required" });
      }
      
      const updatedProgress = await storage.updateUserLearningProgress(userId, moduleId, progress, completed);
      res.json(updatedProgress);
    } catch (error) {
      res.status(500).json({ message: "Failed to update learning progress" });
    }
  });

  // Weather routes
  app.get("/api/weather/:location", async (req: Request, res: Response) => {
    const { location } = req.params;
    const days = req.query.days ? parseInt(req.query.days as string) : 7;
    
    const forecasts = await storage.getWeatherForecasts(location, days);
    res.json(forecasts);
  });

  app.post("/api/weather", async (req: Request, res: Response) => {
    try {
      const forecastData = insertWeatherForecastSchema.parse(req.body);
      const forecast = await storage.createWeatherForecast(forecastData);
      res.status(201).json(forecast);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid weather forecast data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create weather forecast" });
    }
  });

  // Crop Recommendation routes
  app.get("/api/recommendations/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const recommendations = await storage.getCropRecommendationsByUserId(userId);
    res.json(recommendations);
  });

  app.get("/api/recommendations/location/:location", async (req: Request, res: Response) => {
    const { location } = req.params;
    const recommendations = await storage.getCropRecommendationsByLocation(location);
    res.json(recommendations);
  });

  app.post("/api/recommendations", async (req: Request, res: Response) => {
    try {
      const recommendationData = insertCropRecommendationSchema.parse(req.body);
      const recommendation = await storage.createCropRecommendation(recommendationData);
      res.status(201).json(recommendation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid crop recommendation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create crop recommendation" });
    }
  });

  return httpServer;
}
