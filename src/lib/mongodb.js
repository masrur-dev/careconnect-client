import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing from .env.local");
}

const globalForMongo = globalThis;

// Reuse one client across hot reloads. Never call connect() here — the driver
// connects lazily on the first operation. Connecting at import time broke
// `next build` (Vercel's build box cannot reach Atlas, so page-data collection
// for /api/auth/[...all] failed with MongoNetworkError).
if (!globalForMongo._careconnectMongoClient) {
  globalForMongo._careconnectMongoClient = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
  });
}

export const mongoClientPromise = Promise.resolve(
  globalForMongo._careconnectMongoClient
);
