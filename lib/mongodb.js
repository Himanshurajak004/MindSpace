
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (uri) {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  if (!clientPromise) {
    throw new Error("MONGODB_URI is missing. Check your environment variables.");
  }

  const connectedClient = await clientPromise;
  await connectedClient.db("admin").command({ ping: 1 });

  return connectedClient;
}
