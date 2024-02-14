import "dotenv/config";
import { connect, disconnect } from "mongoose";

async function dbConnect(): Promise<void> {
  const DB_URI = <string>process.env.DB_URI;
  try {
    const connection = await connect(DB_URI);
    console.log(`MongoDB connected: ${connection.connections[0].name}`);
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
    throw error;
  }
}

async function dbConnectTest(): Promise<void> {
  const DB_URI = <string>process.env.DB_URI_TEST;
  try {
    const connection = await connect(DB_URI);
    console.log(`MongoDB connected: ${connection.connections[0].name}`);
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
    throw error;
  }
}

async function dbDisconnect(): Promise<void> {
  await disconnect();
  console.log(`MongoDB disconnected`);
}

export { dbConnect, dbDisconnect, dbConnectTest };
