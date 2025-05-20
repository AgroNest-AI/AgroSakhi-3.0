import { Request, Response } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { insertWeatherForecastSchema } from "@shared/schema";

export async function getWeatherForecasts(req: Request, res: Response) {
  try {
    const { location } = req.params;
    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }
    
    const days = req.query.days ? parseInt(req.query.days as string) : 7;
    
    const forecasts = await storage.getWeatherForecasts(location, days);
    res.json(forecasts);
  } catch (error) {
    console.error("Error fetching weather forecasts:", error);
    res.status(500).json({ message: "Failed to fetch weather forecasts" });
  }
}

export async function getCurrentWeather(req: Request, res: Response) {
  try {
    const { location } = req.params;
    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }
    
    const forecasts = await storage.getWeatherForecasts(location, 1);
    if (forecasts.length === 0) {
      return res.status(404).json({ message: "No weather data found for this location" });
    }
    
    res.json(forecasts[0]);
  } catch (error) {
    console.error("Error fetching current weather:", error);
    res.status(500).json({ message: "Failed to fetch current weather" });
  }
}

export async function createWeatherForecast(req: Request, res: Response) {
  try {
    const forecastData = insertWeatherForecastSchema.parse(req.body);
    const forecast = await storage.createWeatherForecast(forecastData);
    res.status(201).json(forecast);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid weather forecast data", errors: error.errors });
    }
    console.error("Error creating weather forecast:", error);
    res.status(500).json({ message: "Failed to create weather forecast" });
  }
}

export async function getRainfallForecast(req: Request, res: Response) {
  try {
    const { location } = req.params;
    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }
    
    const days = req.query.days ? parseInt(req.query.days as string) : 10;
    
    const forecasts = await storage.getWeatherForecasts(location, days);
    
    // Map to simplified rainfall data format
    const rainfallData = forecasts.map(forecast => ({
      date: forecast.forecastDate,
      value: forecast.rainfall || 0
    }));
    
    res.json(rainfallData);
  } catch (error) {
    console.error("Error fetching rainfall forecast:", error);
    res.status(500).json({ message: "Failed to fetch rainfall forecast" });
  }
}
