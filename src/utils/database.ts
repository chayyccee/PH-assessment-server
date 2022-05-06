import mongoose from "mongoose";
import 'dotenv/config';
import logger from "./logger";

const DB_CONNECTION_STRING: string = process.env.DB_STRING!;

export async function connectToDatabase () {
    try {
        await mongoose.connect(DB_CONNECTION_STRING);
        logger.info("Connected to database");
    } catch (error: any) {
        logger.error(`Error connecting to database: ${error}`);
        process.exit(1);
    }
}

export async function disconnectFromDatabase () {
    try {
        await mongoose.connection.close();
        logger.info("Disconnected from database");
    } catch (error: any) {
        logger.error(`Error disconnecting from database: ${error}`);
        process.exit(1);
    }
}
