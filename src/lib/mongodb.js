
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing from .env.local");
}

const globalForMongo = globalThis;

// Reuse MongoDB connection in development
if (!globalForMongo._careconnectMongoPromise) {
  const client = new MongoClient(uri);

  globalForMongo._careconnectMongoPromise =
    client.connect();
}

export const mongoClientPromise =
  globalForMongo._careconnectMongoPromise;
