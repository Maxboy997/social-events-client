import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

let client: MongoClient;
let db: Db;

export async function getMongoDb(): Promise<{ client: MongoClient; db: Db }> {
  if (!client) {
    client = new MongoClient(uri as string);
    await client.connect();
  }
  if (!db) {
    db = client.db("socialEvents");
  }
  return { client, db };
}