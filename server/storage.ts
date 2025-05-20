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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private farms: Map<number, Farm>;
  private devices: Map<number, Device>;
  private sensorReadings: Map<number, SensorReading>;
  private crops: Map<number, Crop>;
  private tasks: Map<number, Task>;
  private marketplaceListings: Map<number, MarketplaceListing>;
  private blockchainTransactions: Map<number, BlockchainTransaction>;
  private learningModules: Map<number, LearningModule>;
  private userLearningProgress: Map<string, UserLearningProgress>; // composite key: userId-moduleId
  private weatherForecasts: Map<string, WeatherForecast>; // composite key: location-date
  private cropRecommendations: Map<number, CropRecommendation>;
  
  private currentUserIdCounter: number = 1;
  private currentFarmIdCounter: number = 1;
  private currentDeviceIdCounter: number = 1;
  private currentSensorReadingIdCounter: number = 1;
  private currentCropIdCounter: number = 1;
  private currentTaskIdCounter: number = 1;
  private currentMarketplaceListingIdCounter: number = 1;
  private currentBlockchainTransactionIdCounter: number = 1;
  private currentLearningModuleIdCounter: number = 1;
  private currentUserLearningProgressIdCounter: number = 1;
  private currentWeatherForecastIdCounter: number = 1;
  private currentCropRecommendationIdCounter: number = 1;

  constructor() {
    this.users = new Map();
    this.farms = new Map();
    this.devices = new Map();
    this.sensorReadings = new Map();
    this.crops = new Map();
    this.tasks = new Map();
    this.marketplaceListings = new Map();
    this.blockchainTransactions = new Map();
    this.learningModules = new Map();
    this.userLearningProgress = new Map();
    this.weatherForecasts = new Map();
    this.cropRecommendations = new Map();
    
    // Initialize with a default user
    this.createUser({
      username: "priya",
      password: "password123",
      displayName: "Priya Singh",
      location: "Barabanki, Uttar Pradesh",
      preferredLanguage: "en"
    });
    
    // Add some initial sample data
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create a farm for the default user
    const defaultFarm = this.createFarm({
      userId: 1,
      name: "Priya's Farm",
      location: "Barabanki",
      size: 5.4,
      description: "Main agricultural farm with mixed crops"
    });

    // Create some devices
    this.createDevice({
      userId: 1,
      farmId: 1,
      name: "AgroSakhi Band #1",
      type: "AgroSakhi Band",
      location: "North Wheat Field",
      status: "online",
      batteryLevel: 85
    });

    this.createDevice({
      userId: 1,
      farmId: 1,
      name: "SakhiSense Station",
      type: "SakhiSense Station",
      location: "Central Hub",
      status: "online",
      batteryLevel: 92
    });

    this.createDevice({
      userId: 1,
      farmId: 1,
      name: "Pest Monitor",
      type: "Pest Monitor",
      location: "East Rice Paddy",
      status: "low_signal",
      batteryLevel: 42
    });

    // Create crops
    this.createCrop({
      userId: 1,
      farmId: 1,
      name: "Wheat",
      variety: "HD-2967",
      plantingDate: new Date("2022-11-15"),
      harvestDate: new Date("2023-04-05"),
      status: "active",
      healthStatus: "good",
      area: 2.5
    });

    this.createCrop({
      userId: 1,
      farmId: 1,
      name: "Rice",
      variety: "Pusa-1509",
      plantingDate: new Date("2022-06-20"),
      harvestDate: new Date("2023-03-15"),
      status: "active",
      healthStatus: "needs_attention",
      area: 1.8
    });

    this.createCrop({
      userId: 1,
      farmId: 1,
      name: "Mustard",
      variety: "Pusa Bold",
      plantingDate: new Date("2022-10-10"),
      harvestDate: new Date("2023-03-25"),
      status: "active",
      healthStatus: "good",
      area: 1.1
    });

    // Create tasks
    this.createTask({
      userId: 1,
      farmId: 1,
      cropId: 1,
      title: "Irrigation check for wheat field",
      description: "Check irrigation levels and adjust if necessary",
      scheduledDate: new Date(),
      priority: "high"
    });

    this.createTask({
      userId: 1,
      farmId: 1,
      cropId: 1,
      title: "Apply fertilizer to tomato plants",
      description: "Use organic fertilizer on kitchen garden tomatoes",
      scheduledDate: new Date(),
      priority: "medium"
    });

    this.createTask({
      userId: 1,
      farmId: 1,
      cropId: 2,
      title: "Inspect rice paddy for pest damage",
      description: "Look for signs of pest activity and document findings",
      scheduledDate: new Date(),
      priority: "high"
    });

    // Generate weather forecasts
    const today = new Date();
    const locations = ["Barabanki", "Lucknow", "Kanpur", "Allahabad"];
    const conditions = ["sunny", "partly_cloudy", "cloudy", "rainy"];
    
    for (let i = 0; i < 10; i++) {
      const forecastDate = new Date(today);
      forecastDate.setDate(today.getDate() + i);
      
      this.createWeatherForecast({
        location: "Barabanki",
        forecastDate,
        temperature: 30 + Math.floor(Math.random() * 6),
        minTemperature: 20 + Math.floor(Math.random() * 5),
        maxTemperature: 30 + Math.floor(Math.random() * 6),
        humidity: 50 + Math.floor(Math.random() * 30),
        rainfall: i === 3 ? 15 : i === 4 ? 5 : i === 9 ? 3 : 0,
        condition: i === 3 ? "rainy" : i === 4 ? "cloudy" : i === 8 || i === 9 ? "cloudy" : "sunny"
      });
    }

    // Create crop recommendations
    this.createCropRecommendation({
      userId: 1,
      location: "Barabanki",
      cropName: "Wheat",
      variety: "HD-2967",
      matchPercentage: 95,
      reason: "Ideal for your soil pH and upcoming winter season"
    });

    this.createCropRecommendation({
      userId: 1,
      location: "Barabanki",
      cropName: "Mustard",
      variety: "Pusa Bold",
      matchPercentage: 90,
      reason: "Good companion crop with low water requirements"
    });

    this.createCropRecommendation({
      userId: 1,
      location: "Barabanki",
      cropName: "Chickpea",
      variety: "JG-11",
      matchPercentage: 82,
      reason: "Nitrogen-fixing crop ideal after rice harvest"
    });

    // Create sensor readings
    for (let i = 0; i < 10; i++) {
      const readingDate = new Date();
      readingDate.setDate(readingDate.getDate() - (9 - i));
      
      // Soil moisture (device 1)
      this.createSensorReading({
        deviceId: 1,
        type: "soil_moisture",
        value: 40 + Math.floor(Math.random() * 30),
        unit: "%",
        timestamp: readingDate
      });
      
      // Soil temperature (device 1)
      this.createSensorReading({
        deviceId: 1,
        type: "soil_temperature",
        value: 22 + Math.floor(Math.random() * 10),
        unit: "°C",
        timestamp: readingDate
      });
      
      // Light level (device 1)
      this.createSensorReading({
        deviceId: 1,
        type: "light_level",
        value: 50 + Math.floor(Math.random() * 50),
        unit: "%",
        timestamp: readingDate
      });
      
      // Soil pH (device 2)
      this.createSensorReading({
        deviceId: 2,
        type: "soil_ph",
        value: 6.0 + (Math.random() * 1.5),
        unit: "pH",
        timestamp: readingDate
      });
    }

    // Create marketplace listings
    this.createMarketplaceListing({
      userId: 1,
      cropName: "Wheat",
      variety: "HD-2967",
      quantity: 500,
      unit: "kg",
      price: 2400,
      currency: "INR",
      description: "Organically grown wheat, harvested last week",
      location: "Barabanki",
      isOrganic: true
    });

    // Create blockchain transactions
    this.createBlockchainTransaction({
      userId: 1,
      listingId: 1,
      transactionType: "harvest",
      details: {
        crop: "Wheat",
        variety: "HD-2967",
        quantity: "200 kg",
        quality: "Grade A"
      },
      transactionHash: "0x7e21...8f92"
    });

    this.createBlockchainTransaction({
      userId: 1,
      listingId: 1,
      transactionType: "quality_check",
      details: {
        crop: "Wheat",
        variety: "HD-2967",
        moisture: "12%",
        protein: "11.5%",
        grade: "A"
      },
      transactionHash: "0x9a45...2e71"
    });

    this.createBlockchainTransaction({
      userId: 1,
      listingId: 1,
      transactionType: "market_listing",
      details: {
        crop: "Wheat",
        variety: "HD-2967",
        quantity: "200 kg",
        price: "₹2,240/quintal"
      },
      transactionHash: "0x3f62...1a47"
    });

    // Create learning modules
    this.createLearningModule({
      title: "Advanced Pest Management",
      description: "Learn environmentally friendly techniques to control pests without harmful chemicals.",
      durationMinutes: 150,
      lessonCount: 6,
      difficulty: "intermediate"
    });

    this.createLearningModule({
      title: "Water Conservation Techniques",
      description: "Discover modern irrigation methods to reduce water usage while improving crop yields.",
      durationMinutes: 180,
      lessonCount: 8,
      difficulty: "intermediate"
    });

    this.createLearningModule({
      title: "Organic Farming",
      description: "Comprehensive guide to organic farming practices and certification.",
      durationMinutes: 210,
      lessonCount: 10,
      difficulty: "beginner"
    });

    // Create user learning progress
    this.createUserLearningProgress({
      userId: 1,
      moduleId: 3,
      progress: 65,
      completed: false
    });
  }

  /* User operations */
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserIdCounter++;
    const newUser: User = { ...user, id, role: "farmer" };
    this.users.set(id, newUser);
    return newUser;
  }

  /* Farm operations */
  async getFarm(id: number): Promise<Farm | undefined> {
    return this.farms.get(id);
  }

  async getFarmsByUserId(userId: number): Promise<Farm[]> {
    return Array.from(this.farms.values()).filter(
      (farm) => farm.userId === userId
    );
  }

  async createFarm(farm: InsertFarm): Promise<Farm> {
    const id = this.currentFarmIdCounter++;
    const newFarm: Farm = { ...farm, id };
    this.farms.set(id, newFarm);
    return newFarm;
  }

  /* Device operations */
  async getDevice(id: number): Promise<Device | undefined> {
    return this.devices.get(id);
  }

  async getDevicesByUserId(userId: number): Promise<Device[]> {
    return Array.from(this.devices.values()).filter(
      (device) => device.userId === userId
    );
  }

  async getDevicesByFarmId(farmId: number): Promise<Device[]> {
    return Array.from(this.devices.values()).filter(
      (device) => device.farmId === farmId
    );
  }

  async createDevice(device: InsertDevice): Promise<Device> {
    const id = this.currentDeviceIdCounter++;
    const now = new Date();
    const newDevice: Device = { 
      ...device, 
      id, 
      lastSeen: device.lastSeen || now 
    };
    this.devices.set(id, newDevice);
    return newDevice;
  }

  async updateDeviceStatus(id: number, status: string, batteryLevel?: number): Promise<Device> {
    const device = await this.getDevice(id);
    if (!device) {
      throw new Error(`Device with id ${id} not found`);
    }
    
    const updatedDevice: Device = { 
      ...device, 
      status,
      batteryLevel: batteryLevel !== undefined ? batteryLevel : device.batteryLevel,
      lastSeen: new Date()
    };
    
    this.devices.set(id, updatedDevice);
    return updatedDevice;
  }

  /* Sensor Reading operations */
  async getSensorReadings(deviceId: number, type: string, limit?: number): Promise<SensorReading[]> {
    let readings = Array.from(this.sensorReadings.values()).filter(
      (reading) => reading.deviceId === deviceId && (type ? reading.type === type : true)
    );
    
    // Sort by timestamp descending (newest first)
    readings.sort((a, b) => {
      const aTime = a.timestamp instanceof Date ? a.timestamp.getTime() : 0;
      const bTime = b.timestamp instanceof Date ? b.timestamp.getTime() : 0;
      return bTime - aTime;
    });
    
    if (limit) {
      readings = readings.slice(0, limit);
    }
    
    return readings;
  }

  async createSensorReading(reading: InsertSensorReading): Promise<SensorReading> {
    const id = this.currentSensorReadingIdCounter++;
    const newReading: SensorReading = {
      ...reading,
      id,
      timestamp: reading.timestamp || new Date()
    };
    this.sensorReadings.set(id, newReading);
    return newReading;
  }

  /* Crop operations */
  async getCrop(id: number): Promise<Crop | undefined> {
    return this.crops.get(id);
  }

  async getCropsByUserId(userId: number): Promise<Crop[]> {
    return Array.from(this.crops.values()).filter(
      (crop) => crop.userId === userId
    );
  }

  async getCropsByFarmId(farmId: number): Promise<Crop[]> {
    return Array.from(this.crops.values()).filter(
      (crop) => crop.farmId === farmId
    );
  }

  async createCrop(crop: InsertCrop): Promise<Crop> {
    const id = this.currentCropIdCounter++;
    const newCrop: Crop = { ...crop, id };
    this.crops.set(id, newCrop);
    return newCrop;
  }

  async updateCropStatus(id: number, status: string, healthStatus?: string): Promise<Crop> {
    const crop = await this.getCrop(id);
    if (!crop) {
      throw new Error(`Crop with id ${id} not found`);
    }
    
    const updatedCrop: Crop = {
      ...crop,
      status,
      healthStatus: healthStatus || crop.healthStatus
    };
    
    this.crops.set(id, updatedCrop);
    return updatedCrop;
  }

  /* Task operations */
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getTasksByUserId(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.userId === userId
    );
  }

  async getTasksByFarmId(farmId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.farmId === farmId
    );
  }

  async getTasksByCropId(cropId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.cropId === cropId
    );
  }

  async createTask(task: InsertTask): Promise<Task> {
    const id = this.currentTaskIdCounter++;
    const newTask: Task = {
      ...task,
      id,
      completed: false,
      completedDate: null
    };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async updateTaskCompletion(id: number, completed: boolean): Promise<Task> {
    const task = await this.getTask(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    const updatedTask: Task = {
      ...task,
      completed,
      completedDate: completed ? new Date() : null
    };
    
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  /* Marketplace operations */
  async getMarketplaceListing(id: number): Promise<MarketplaceListing | undefined> {
    return this.marketplaceListings.get(id);
  }

  async getMarketplaceListingsByUserId(userId: number): Promise<MarketplaceListing[]> {
    return Array.from(this.marketplaceListings.values()).filter(
      (listing) => listing.userId === userId
    );
  }

  async getAllMarketplaceListings(): Promise<MarketplaceListing[]> {
    return Array.from(this.marketplaceListings.values());
  }

  async createMarketplaceListing(listing: InsertMarketplaceListing): Promise<MarketplaceListing> {
    const id = this.currentMarketplaceListingIdCounter++;
    const newListing: MarketplaceListing = {
      ...listing,
      id,
      isVerified: false,
      createdAt: new Date()
    };
    this.marketplaceListings.set(id, newListing);
    return newListing;
  }

  /* Blockchain operations */
  async getBlockchainTransaction(id: number): Promise<BlockchainTransaction | undefined> {
    return this.blockchainTransactions.get(id);
  }

  async getBlockchainTransactionsByUserId(userId: number): Promise<BlockchainTransaction[]> {
    return Array.from(this.blockchainTransactions.values()).filter(
      (transaction) => transaction.userId === userId
    );
  }

  async getBlockchainTransactionsByListingId(listingId: number): Promise<BlockchainTransaction[]> {
    return Array.from(this.blockchainTransactions.values()).filter(
      (transaction) => transaction.listingId === listingId
    );
  }

  async createBlockchainTransaction(transaction: InsertBlockchainTransaction): Promise<BlockchainTransaction> {
    const id = this.currentBlockchainTransactionIdCounter++;
    const newTransaction: BlockchainTransaction = {
      ...transaction,
      id,
      timestamp: transaction.timestamp || new Date()
    };
    this.blockchainTransactions.set(id, newTransaction);
    return newTransaction;
  }

  /* Learning operations */
  async getLearningModule(id: number): Promise<LearningModule | undefined> {
    return this.learningModules.get(id);
  }

  async getAllLearningModules(): Promise<LearningModule[]> {
    return Array.from(this.learningModules.values());
  }

  async createLearningModule(module: InsertLearningModule): Promise<LearningModule> {
    const id = this.currentLearningModuleIdCounter++;
    const newModule: LearningModule = { ...module, id };
    this.learningModules.set(id, newModule);
    return newModule;
  }

  async getUserLearningProgress(userId: number, moduleId: number): Promise<UserLearningProgress | undefined> {
    return this.userLearningProgress.get(`${userId}-${moduleId}`);
  }

  async getAllUserLearningProgress(userId: number): Promise<UserLearningProgress[]> {
    return Array.from(this.userLearningProgress.values()).filter(
      (progress) => progress.userId === userId
    );
  }

  async createUserLearningProgress(progress: InsertUserLearningProgress): Promise<UserLearningProgress> {
    const id = this.currentUserLearningProgressIdCounter++;
    const newProgress: UserLearningProgress = {
      ...progress,
      id,
      lastAccessedAt: new Date()
    };
    this.userLearningProgress.set(`${progress.userId}-${progress.moduleId}`, newProgress);
    return newProgress;
  }

  async updateUserLearningProgress(userId: number, moduleId: number, progress: number, completed: boolean): Promise<UserLearningProgress> {
    const userProgress = await this.getUserLearningProgress(userId, moduleId);
    
    if (!userProgress) {
      return this.createUserLearningProgress({
        userId,
        moduleId,
        progress,
        completed
      });
    }
    
    const updatedProgress: UserLearningProgress = {
      ...userProgress,
      progress,
      completed,
      lastAccessedAt: new Date()
    };
    
    this.userLearningProgress.set(`${userId}-${moduleId}`, updatedProgress);
    return updatedProgress;
  }

  /* Weather operations */
  async getWeatherForecast(location: string, date?: Date): Promise<WeatherForecast | undefined> {
    const dateString = date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    return this.weatherForecasts.get(`${location}-${dateString}`);
  }

  async getWeatherForecasts(location: string, days = 7): Promise<WeatherForecast[]> {
    const forecasts = Array.from(this.weatherForecasts.values()).filter(
      (forecast) => forecast.location === location
    );
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filter forecasts for today and future dates, up to 'days' ahead
    const filteredForecasts = forecasts.filter(forecast => {
      const forecastDate = forecast.forecastDate instanceof Date ? forecast.forecastDate : new Date(forecast.forecastDate);
      forecastDate.setHours(0, 0, 0, 0);
      
      const diffTime = forecastDate.getTime() - today.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      return diffDays >= 0 && diffDays < days;
    });
    
    // Sort by date ascending
    filteredForecasts.sort((a, b) => {
      const aDate = a.forecastDate instanceof Date ? a.forecastDate : new Date(a.forecastDate);
      const bDate = b.forecastDate instanceof Date ? b.forecastDate : new Date(b.forecastDate);
      return aDate.getTime() - bDate.getTime();
    });
    
    return filteredForecasts;
  }

  async createWeatherForecast(forecast: InsertWeatherForecast): Promise<WeatherForecast> {
    const id = this.currentWeatherForecastIdCounter++;
    const newForecast: WeatherForecast = { ...forecast, id };
    
    const dateString = forecast.forecastDate instanceof Date 
      ? forecast.forecastDate.toISOString().split('T')[0] 
      : new Date(forecast.forecastDate).toISOString().split('T')[0];
    
    this.weatherForecasts.set(`${forecast.location}-${dateString}`, newForecast);
    return newForecast;
  }

  /* Crop recommendation operations */
  async getCropRecommendation(id: number): Promise<CropRecommendation | undefined> {
    return this.cropRecommendations.get(id);
  }

  async getCropRecommendationsByUserId(userId: number): Promise<CropRecommendation[]> {
    return Array.from(this.cropRecommendations.values()).filter(
      (recommendation) => recommendation.userId === userId
    );
  }

  async getCropRecommendationsByLocation(location: string): Promise<CropRecommendation[]> {
    return Array.from(this.cropRecommendations.values()).filter(
      (recommendation) => recommendation.location === location
    );
  }

  async createCropRecommendation(recommendation: InsertCropRecommendation): Promise<CropRecommendation> {
    const id = this.currentCropRecommendationIdCounter++;
    const newRecommendation: CropRecommendation = { ...recommendation, id };
    this.cropRecommendations.set(id, newRecommendation);
    return newRecommendation;
  }
}

// Export a singleton instance of the storage
export const storage = new MemStorage();
