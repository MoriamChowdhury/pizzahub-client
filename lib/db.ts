import { MongoClient } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

const uri = process.env.MONGODB_URI as string;
if (!uri) throw new Error("MONGODB_URI is not set");

const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };

export const client =
  globalForMongo._mongoClient ??
  new MongoClient(uri, {
    maxIdleTimeMS: 5000,
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 5,
    minPoolSize: 0,
    retryReads: true,
    retryWrites: true,
  });

// Production e-o cache koro
globalForMongo._mongoClient = client;

// Vercel function suspend hole idle connection thik moto close kore
attachDatabasePool(client);

export const db = client.db("pizzahub");