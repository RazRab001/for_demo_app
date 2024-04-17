import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config();

mongoose.connect(process.env.MONGO_URL as string)
const db = mongoose.connection

db.on('error', (err: Error)=> console.log(`Mongo ERROR: ${err}`))
db.once('open', () => console.log('Mongo: succes connection to db'));
