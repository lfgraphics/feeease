"use server"

import mongoose from 'mongoose';

export async function getStorageUsage(mongoDbUri?: string, cloudinaryConfig?: { cloudName: string; apiKey: string; apiSecret: string }) {
  const result: {
    mongodb: {
      used: number;
      total: number;
      unit: string;
      plan?: string;
      error?: string;
    } | null;

    cloudinary: {
      used: number;
      total: number;
      unit: string;
      bandwidth: { used: number; total: number; unit: string };
      transformations: { used: number; total: number; unit: string };
      plan?: string;
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
      const conn = await mongoose.createConnection(effectiveMongoUri).asPromise();
      const stats = await conn.db?.stats();
      
      if (stats) {
        const isLocal = effectiveMongoUri.includes('localhost') || effectiveMongoUri.includes('127.0.0.1');
        const storageValue = Number(stats.storageSize);
        const storageNum = !isNaN(storageValue) ? storageValue : 0;
        
        const maxSizeValue = Number(stats.maxSize);
        let plan = isLocal ? "Local Storage" : "Atlas Cluster";
        let totalLimit = isLocal ? 0 : 512 * 1024 * 1024;

        if (!isNaN(maxSizeValue) && maxSizeValue > 0) {
          totalLimit = maxSizeValue;
          if (maxSizeValue <= 536870912) plan = "M0 (Free)";
          else if (maxSizeValue <= 2147483648) plan = "M2";
          else if (maxSizeValue <= 5368709120) plan = "M5";
          else plan = "Shared Cluster";
        } else if (storageNum > 512 * 1024 * 1024 && !isLocal) {
          plan = "Dedicated Cluster";
          totalLimit = storageNum * 1.5;
        }

        result.mongodb = {
          used: storageNum / (1024 * 1024),
          total: totalLimit / (1024 * 1024),
          unit: 'MB',
          plan
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
        next: { revalidate: 0 }
      });

      if (response.ok) {
        const data = await response.json();
        const stats = data.storage || {};
        const usedValue = Number(stats.usage);
        const limitValue = Number(stats.limit);
        
        const usedNum = !isNaN(usedValue) ? usedValue : 0;
        let limitNum = !isNaN(limitValue) ? limitValue : 0;

        if (limitNum === 0 && data.credits) {
          limitNum = Number(data.credits.limit) * (1024 * 1024 * 1024);
        }

        if (limitNum === 0 && data.plan === "Free") {
          limitNum = 25 * 1024 * 1024 * 1024;
        }
        
        const bwStats = data.bandwidth || {};
        const transStats = data.transformations || {};
        const bwUsed = Number(bwStats.usage) || 0;
        let bwLimit = Number(bwStats.limit) || 0;
        const transUsed = Number(transStats.usage) || 0;
        let transLimit = Number(transStats.limit) || 0;

        if (data.credits) {
          const creditLimitInBytes = Number(data.credits.limit) * (1024 * 1024 * 1024);
          if (bwLimit === 0) bwLimit = creditLimitInBytes;
          if (transLimit === 0) transLimit = Number(data.credits.limit) * 1000;
        }

        if (data.plan === "Free") {
           if (bwLimit === 0) bwLimit = 25 * 1024 * 1024 * 1024;
           if (transLimit === 0) transLimit = 25000;
        }

        result.cloudinary = {
          used: usedNum / (1024 * 1024),
          total: limitNum / (1024 * 1024),
          unit: 'MB',
          bandwidth: {
            used: bwUsed / (1024 * 1024),
            total: bwLimit / (1024 * 1024),
            unit: 'MB'
          },
          transformations: {
            used: transUsed,
            total: transLimit,
            unit: 'Ops'
          },
          plan: data.plan
        };

        if (!usedNum && !limitNum) {
          result.cloudinary.error = "Check Cloudinary API credentials.";
        }
      } else {
        result.cloudinary = { 
          used: 0, total: 0, unit: 'MB', 
          bandwidth: { used: 0, total: 0, unit: 'MB' },
          transformations: { used: 0, total: 0, unit: 'Ops' },
          error: 'Failed to fetch Cloudinary usage' 
        };
      }
    } catch (error) {
      console.error('Cloudinary Storage Stats Error:', error);
      result.cloudinary = { 
        used: 0, total: 0, unit: 'MB', 
        bandwidth: { used: 0, total: 0, unit: 'MB' },
        transformations: { used: 0, total: 0, unit: 'Ops' },
        error: 'Cloudinary API error' 
      };
    }
  }

  return result;
}

/**
 * Fetches global system metrics for the main application infrastructure
 */
export async function getGlobalSystemStats() {
  const result: {
    mongodb: any;
    redis: any;
    cloudinary: any;
  } = {
    mongodb: null,
    redis: null,
    cloudinary: null,
  };

  // 1. App MongoDB
  try {
    const data = await getStorageUsage(process.env.MONGODB_URI);
    if (data) result.mongodb = data.mongodb;
  } catch (e) {
    console.error("Global MongoDB Stats Error:", e);
  }

  // 2. Upstash Redis (Rate Limiter)
  const redisUrl = process.env.UPSTASH_REDIS_REST_KV_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;

  if (redisUrl && redisToken) {
    try {
      const response = await fetch(`${redisUrl}/info`, {
        headers: { Authorization: `Bearer ${redisToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        const infoStr = data.result || "";
        const info: Record<string, string> = {};
        
        // Split by standard or carriage return newlines
        infoStr.split(/\r?\n/).forEach((line: string) => {
          const parts = line.split(':');
          if (parts.length >= 2) {
            info[parts[0].trim()] = parts[1].trim();
          }
        });

        result.redis = {
          usedMemory: parseInt(info.used_memory) || 0,
          peakMemory: parseInt(info.used_memory_peak) || 0,
          // total_commands_processed is the true metric for Upstash (rate limiter requests)
          totalConnections: parseInt(info.total_commands_processed) || parseInt(info.total_connections_received) || 0,
          connectedClients: parseInt(info.connected_clients) || 0,
          uptime: parseInt(info.uptime_in_seconds) || 0,
        };

      }
    } catch (e) {
      console.error("Upstash Redis Stats Error:", e);
    }
  }

  // 3. Global Cloudinary
  const globalCloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const globalApiKey = process.env.CLOUDINARY_API_KEY;
  const globalApiSecret = process.env.CLOUDINARY_API_SECRET;

  if (globalCloudName && globalApiKey && globalApiSecret) {
    try {
      const data = await getStorageUsage();
      if (data) result.cloudinary = data.cloudinary;
    } catch (e) {
      console.error("Global Cloudinary Stats Error:", e);
    }
  }

  return result;
}
