import mongoose from 'mongoose';
import { getErrorMessage } from './utils/errors.util';
import dotenv from 'dotenv'


// mongodb connection string
const url = process.env.MONGO_URI
const mongo_uri = `${url}`;

/* Database Connection */
mongoose.connect(mongo_uri).then(() => {
        console.log('DB connected');
}).catch((error: Error) => {
        const message: string = getErrorMessage(error);
        console.log(`${message}`);
});

// log database errors
mongoose.connection.on('error', (error) => {
        console.log(`${error}`);
});