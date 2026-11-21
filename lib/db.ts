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
  });

// Production e-o cache koro (age shudhu dev e hoto)
globalForMongo._mongoClient = client;

// Vercel function suspend hole idle connection thik moto close kore
attachDatabasePool(client);

export const db = client.db("pizzahub");