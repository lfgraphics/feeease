"use server"

import mongoose from 'mongoose';

export async function getStorageUsage(mongoDbUri?: string, cloudinaryConfig?: { cloudName: string; apiKey: string; apiSecret: string }) {
  const result: {
    mongodb: {
      used: number;
      total: number; // For free tier it's usually 512MB or 5GB, let's assume 512MB if not specified
      unit: string;
      error?: string;
    } | null;
    cloudinary: {
      used: number;
      total: number;
      unit: string;
      error?: string;
    } | null;
  } = {
    mongodb: null,
    cloudinary: null,
  };

  // 1. MongoDB Storage Stats
  const effectiveMongoUri = mongoDbUri || process.env.MONGODB_URI;
  if (effectiveMongoUri) {

    try {
      // Create a temporary connection
      const conn = await mongoose.createConnection(effectiveMongoUri).asPromise();

      const stats = await conn.db?.stats();
      
      if (stats) {
        // storageSize is in bytes
        const storageValue = Number(stats.storageSize);
        const storageNum = !isNaN(storageValue) ? storageValue : 0;
        
        result.mongodb = {
          used: storageNum / (1024 * 1024), // MB
          total: 512, // Defaulting to 512MB (Standard Atlas Free Tier)
          unit: 'MB'
        };
      }

      await conn.close();
    } catch (error) {
      console.error('MongoDB Storage Stats Error:', error);
      result.mongodb = { used: 0, total: 512, unit: 'MB', error: 'Could not fetch database stats' };
    }
  }

  // 2. Cloudinary Storage Stats
  const cloudName = cloudinaryConfig?.cloudName || process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = cloudinaryConfig?.apiKey || process.env.CLOUDINARY_API_KEY;
  const apiSecret = cloudinaryConfig?.apiSecret || process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    try {
      const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/usage`, {

        headers: {
          'Authorization': `Basic ${auth}`
        },
        next: { revalidate: 0 } // No cache during development troubleshooting

      });

      if (response.ok) {
        const data = await response.json();
        const stats = data.storage || {};
        
        // Handle potential different response structures (usage vs storage directly)
        const usedValue = Number(stats.usage); // API uses 'usage' not 'used'
        const limitValue = Number(stats.limit);

        if (process.env.NODE_ENV === 'development') {
          console.log(`Cloudinary usage for ${cloudName}:`, { usedValue, limitValue });
        }

        
        const usedNum = !isNaN(usedValue) ? usedValue : 0;
        let limitNum = !isNaN(limitValue) ? limitValue : 0;

        // For newer accounts, limits are and metrics are in 'credits'
        if (limitNum === 0 && data.credits) {
          // data.credits.limit is usually in credits (1 credit = 1 GB)
          limitNum = Number(data.credits.limit) * (1024 * 1024 * 1024);
        }

        // Fallback for standard Free Tier (which usually doesn't return a specific storage limit if credits are used, but is generally 25GB equivalent)
        if (limitNum === 0 && data.plan === "Free") {
          limitNum = 25 * 1024 * 1024 * 1024; // 25 GB in bytes
        }
        
        result.cloudinary = {
          used: usedNum / (1024 * 1024), // MB
          total: limitNum / (1024 * 1024), // MB
          unit: 'MB'
        };




        if (!usedNum && !limitNum) {
          result.cloudinary.error = "Check Cloudinary API credentials.";
        }

      } else {

        result.cloudinary = { used: 0, total: 0, unit: 'MB', error: 'Failed to fetch Cloudinary usage' };
      }
    } catch (error) {
      console.error('Cloudinary Storage Stats Error:', error);
      result.cloudinary = { used: 0, total: 0, unit: 'MB', error: 'Cloudinary API error' };
    }
  }

  return result;
}
