import { Request, Response } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { insertCropRecommendationSchema } from "@shared/schema";
import { generateCropRecommendations, analyzeWeatherImpact, generateFarmingAdvice } from "../lib/openai";

export async function getCropRecommendationsByUserId(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const recommendations = await storage.getCropRecommendationsByUserId(userId);
    res.json(recommendations);
  } catch (error) {
    console.error("Error fetching crop recommendations by user:", error);
    res.status(500).json({ message: "Failed to fetch crop recommendations" });
  }
}

export async function getCropRecommendationsByLocation(req: Request, res: Response) {
  try {
    const location = req.params.location;
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

export async function generateAICropRecommendations(req: Request, res: Response) {
  try {
    const { location, soilType, soilPH, soilMoisture, temperature, season } = req.body;
    
    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }

    const aiRecommendations = await generateCropRecommendations(
      location,
      soilType,
      soilPH,
      soilMoisture,
      temperature,
      season
    );

    // If userId is provided, save the recommendations to storage
    if (req.body.userId) {
      const userId = parseInt(req.body.userId);
      
      // Save each recommendation to storage
      const savedRecommendations = await Promise.all(
        aiRecommendations.map(async (rec) => {
          const recommendationData = {
            userId,
            location,
            cropName: rec.cropName,
            variety: rec.variety,
            reason: rec.reason,
            matchPercentage: rec.matchPercentage
          };
          
          return await storage.createCropRecommendation(recommendationData);
        })
      );
      
      return res.status(201).json(savedRecommendations);
    }
    
    res.json(aiRecommendations);
  } catch (error) {
    console.error("Error generating AI crop recommendations:", error);
    res.status(500).json({ 
      message: "Failed to generate AI crop recommendations", 
      error: error.message 
    });
  }
}

export async function analyzeWeatherImpactForCrop(req: Request, res: Response) {
  try {
    const { cropName, weatherForecast } = req.body;
    
    if (!cropName || !weatherForecast) {
      return res.status(400).json({ message: "Crop name and weather forecast are required" });
    }
    
    const analysis = await analyzeWeatherImpact(cropName, weatherForecast);
    res.json({ analysis });
  } catch (error) {
    console.error("Error analyzing weather impact:", error);
    res.status(500).json({ 
      message: "Failed to analyze weather impact", 
      error: error.message 
    });
  }
}

export async function generatePersonalizedFarmingAdvice(req: Request, res: Response) {
  try {
    const { cropName, growthStage, issues } = req.body;
    
    if (!cropName || !growthStage) {
      return res.status(400).json({ message: "Crop name and growth stage are required" });
    }
    
    const advice = await generateFarmingAdvice(cropName, growthStage, issues);
    res.json({ advice });
  } catch (error) {
    console.error("Error generating farming advice:", error);
    res.status(500).json({ 
      message: "Failed to generate farming advice", 
      error: error.message 
    });
  }
}