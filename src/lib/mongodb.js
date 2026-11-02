
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI environment variable is missing");
}

const globalForMongo = globalThis;

if (!globalForMongo._careconnectMongoClient) {
  globalForMongo._careconnectMongoClient = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
  });
}

export const mongoClientPromise = Promise.resolve(
  globalForMongo._careconnectMongoClient
);
