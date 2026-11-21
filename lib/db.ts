import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
if (!uri) throw new Error("MONGODB_URI is not set");

const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };

export const client =
  globalForMongo._mongoClient ??
  new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 5,
    minPoolSize: 0,
    retryReads: true,
    retryWrites: true,
  });

// Production e-o cache. Kono jaygay client.close() call kora hobe na
globalForMongo._mongoClient = client;

export const db = client.db("pizzahub");