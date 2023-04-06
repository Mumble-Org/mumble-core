import mongoose from 'mongoose';
import { getErrorMessage } from './utils/errors.util';


// mongodb connection string
const mongo_uri: string = process.env.MONGO_URI;

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