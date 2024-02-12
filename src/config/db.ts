import 'dotenv/config'
import { connect, connection } from 'mongoose'

async function dbConnect(): Promise<void> {
    const DB_URI = <string>process.env.DB_URI;
    try {
        const connection = await connect(DB_URI);
        console.log(`MongoDB connected: ${connection.connections[0].name}`)
        
    } catch (error) {
        console.log(error)
    }
}

export default dbConnect;