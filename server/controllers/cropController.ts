import { Request, Response } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { 
  insertCropSchema, 
  insertCropRecommendationSchema 
} from "@shared/schema";

export async function getCropsByUserId(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const crops = await storage.getCropsByUserId(userId);
    res.json(crops);
  } catch (error) {
    console.error("Error fetching crops:", error);
    res.status(500).json({ message: "Failed to fetch crops" });
  }
}

export async function getCropById(req: Request, res: Response) {
  try {
    const cropId = parseInt(req.params.id);
    if (isNaN(cropId)) {
      return res.status(400).json({ message: "Invalid crop ID" });
    }

    const crop = await storage.getCrop(cropId);
    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }
    
    res.json(crop);
  } catch (error) {
    console.error("Error fetching crop:", error);
    res.status(500).json({ message: "Failed to fetch crop" });
  }
}

export async function createCrop(req: Request, res: Response) {
  try {
    const cropData = insertCropSchema.parse(req.body);
    const crop = await storage.createCrop(cropData);
    res.status(201).json(crop);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid crop data", errors: error.errors });
    }
    console.error("Error creating crop:", error);
    res.status(500).json({ message: "Failed to create crop" });
  }
}

export async function updateCropStatus(req: Request, res: Response) {
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
    console.error("Error updating crop status:", error);
    res.status(500).json({ message: "Failed to update crop status" });
  }
}

export async function getCropRecommendationsByUserId(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const recommendations = await storage.getCropRecommendationsByUserId(userId);
    res.json(recommendations);
  } catch (error) {
    console.error("Error fetching crop recommendations:", error);
    res.status(500).json({ message: "Failed to fetch crop recommendations" });
  }
}

export async function createCropRecommendation(req: Request, res: Response) {
  try {
    const recommendationData = insertCropRecommendationSchema.parse(req.body);
    const recommendation = await storage.createCropRecommendation(recommendationData);
    res.status(201).json(recommendation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid crop recommendation data", errors: error.errors });
    }
    console.error("Error creating crop recommendation:", error);
    res.status(500).json({ message: "Failed to create crop recommendation" });
  }
}

export async function getCropRecommendationsByLocation(req: Request, res: Response) {
  try {
    const { location } = req.params;
    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }
    
    const recommendations = await storage.getCropRecommendationsByLocation(location);
    res.json(recommendations);
  } catch (error) {
    console.error("Error fetching crop recommendations by location:", error);
    res.status(500).json({ message: "Failed to fetch crop recommendations" });
  }
}
