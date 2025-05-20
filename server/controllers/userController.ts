import { Request, Response } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { insertUserSchema } from "@shared/schema";

export async function getUser(req: Request, res: Response) {
  try {
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
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
}

export async function createUser(req: Request, res: Response) {
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
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
}

export async function login(req: Request, res: Response) {
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
    console.error("Error during login:", error);
    res.status(500).json({ message: "Login failed" });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // In a real app, we would validate and update the user data
    // For this prototype, we'll just return the existing user
    
    // Don't send the password in the response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
}

export async function getUserLearningProgress(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const progress = await storage.getAllUserLearningProgress(userId);
    res.json(progress);
  } catch (error) {
    console.error("Error fetching user learning progress:", error);
    res.status(500).json({ message: "Failed to fetch user learning progress" });
  }
}

export async function updateUserLearningProgress(req: Request, res: Response) {
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
    console.error("Error updating user learning progress:", error);
    res.status(500).json({ message: "Failed to update user learning progress" });
  }
}
