
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI environment variable is missing");
}

const globalForMongo = globalThis;

if (!globalForMongo._careconnectMongoPromise) {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  globalForMongo._careconnectMongoPromise = client
    .connect()
    .catch((error) => {
      globalForMongo._careconnectMongoPromise = null;
      throw error;
    });
}

export const mongoClientPromise =
  globalForMongo._careconnectMongoPromise;
