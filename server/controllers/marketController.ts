import { Request, Response } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { 
  insertMarketplaceListingSchema, 
  insertBlockchainTransactionSchema 
} from "@shared/schema";

export async function getMarketplaceListings(req: Request, res: Response) {
  try {
    const listings = await storage.getAllMarketplaceListings();
    res.json(listings);
  } catch (error) {
    console.error("Error fetching marketplace listings:", error);
    res.status(500).json({ message: "Failed to fetch marketplace listings" });
  }
}

export async function getMarketplaceListingsByUserId(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const listings = await storage.getMarketplaceListingsByUserId(userId);
    res.json(listings);
  } catch (error) {
    console.error("Error fetching marketplace listings by user:", error);
    res.status(500).json({ message: "Failed to fetch marketplace listings" });
  }
}

export async function createMarketplaceListing(req: Request, res: Response) {
  try {
    const listingData = insertMarketplaceListingSchema.parse(req.body);
    const listing = await storage.createMarketplaceListing(listingData);
    res.status(201).json(listing);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid marketplace listing data", errors: error.errors });
    }
    console.error("Error creating marketplace listing:", error);
    res.status(500).json({ message: "Failed to create marketplace listing" });
  }
}

export async function getBlockchainTransactionsByUserId(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const transactions = await storage.getBlockchainTransactionsByUserId(userId);
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching blockchain transactions by user:", error);
    res.status(500).json({ message: "Failed to fetch blockchain transactions" });
  }
}

export async function getBlockchainTransactionsByListingId(req: Request, res: Response) {
  try {
    const listingId = parseInt(req.params.listingId);
    if (isNaN(listingId)) {
      return res.status(400).json({ message: "Invalid listing ID" });
    }

    const transactions = await storage.getBlockchainTransactionsByListingId(listingId);
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching blockchain transactions by listing:", error);
    res.status(500).json({ message: "Failed to fetch blockchain transactions" });
  }
}

export async function createBlockchainTransaction(req: Request, res: Response) {
  try {
    const transactionData = insertBlockchainTransactionSchema.parse(req.body);
    const transaction = await storage.createBlockchainTransaction(transactionData);
    res.status(201).json(transaction);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid blockchain transaction data", errors: error.errors });
    }
    console.error("Error creating blockchain transaction:", error);
    res.status(500).json({ message: "Failed to create blockchain transaction" });
  }
}

export async function getMarketPrices(req: Request, res: Response) {
  try {
    // In a real app, this would fetch real-time market prices from an external API
    // For the prototype, we'll return some static data
    const marketPrices = [
      {
        commodity: "Wheat",
        msp: 2125,
        marketPrice: 2240,
        priceChange: 5.4,
        currency: "₹",
        unit: "quintal"
      },
      {
        commodity: "Rice",
        msp: 2040,
        marketPrice: 2150,
        priceChange: 5.2,
        currency: "₹",
        unit: "quintal"
      }
    ];
    
    res.json(marketPrices);
  } catch (error) {
    console.error("Error fetching market prices:", error);
    res.status(500).json({ message: "Failed to fetch market prices" });
  }
}

export async function getPriceTrends(req: Request, res: Response) {
  try {
    const { commodity } = req.params;
    
    // In a real app, this would fetch historical price data from a database
    // For the prototype, we'll return some static data
    const priceTrends = [
      { month: "Aug", price: 1900, percentage: 60 },
      { month: "Sep", price: 1950, percentage: 65 },
      { month: "Oct", price: 2050, percentage: 75 },
      { month: "Nov", price: 2150, percentage: 85 },
      { month: "Dec", price: 2180, percentage: 90 },
      { month: "Jan", price: 2200, percentage: 95 },
      { month: "Feb", price: 2240, percentage: 100 },
    ];
    
    res.json(priceTrends);
  } catch (error) {
    console.error("Error fetching price trends:", error);
    res.status(500).json({ message: "Failed to fetch price trends" });
  }
}
