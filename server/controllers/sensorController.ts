import { Request, Response } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { insertSensorReadingSchema } from "@shared/schema";

export async function getSensorReadings(req: Request, res: Response) {
  try {
    const deviceId = parseInt(req.params.deviceId);
    if (isNaN(deviceId)) {
      return res.status(400).json({ message: "Invalid device ID" });
    }

    const { type } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    
    const readings = await storage.getSensorReadings(deviceId, type, limit);
    res.json(readings);
  } catch (error) {
    console.error("Error fetching sensor readings:", error);
    res.status(500).json({ message: "Failed to fetch sensor readings" });
  }
}

export async function createSensorReading(req: Request, res: Response) {
  try {
    const readingData = insertSensorReadingSchema.parse(req.body);
    const reading = await storage.createSensorReading(readingData);
    res.status(201).json(reading);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid sensor reading data", errors: error.errors });
    }
    console.error("Error creating sensor reading:", error);
    res.status(500).json({ message: "Failed to create sensor reading" });
  }
}

export async function getLatestSensorReading(req: Request, res: Response) {
  try {
    const deviceId = parseInt(req.params.deviceId);
    if (isNaN(deviceId)) {
      return res.status(400).json({ message: "Invalid device ID" });
    }

    const { type } = req.params;
    
    const readings = await storage.getSensorReadings(deviceId, type, 1);
    if (readings.length === 0) {
      return res.status(404).json({ message: "No sensor readings found" });
    }
    
    res.json(readings[0]);
  } catch (error) {
    console.error("Error fetching latest sensor reading:", error);
    res.status(500).json({ message: "Failed to fetch latest sensor reading" });
  }
}

export async function getSensorStatistics(req: Request, res: Response) {
  try {
    const deviceId = parseInt(req.params.deviceId);
    if (isNaN(deviceId)) {
      return res.status(400).json({ message: "Invalid device ID" });
    }

    const { type } = req.params;
    
    const readings = await storage.getSensorReadings(deviceId, type);
    if (readings.length === 0) {
      return res.status(404).json({ message: "No sensor readings found" });
    }
    
    // Calculate min, max, and average
    const values = readings.map(r => r.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    
    res.json({
      min,
      max,
      avg: parseFloat(avg.toFixed(2)),
      count: readings.length,
      unit: readings[0].unit
    });
  } catch (error) {
    console.error("Error calculating sensor statistics:", error);
    res.status(500).json({ message: "Failed to calculate sensor statistics" });
  }
}
