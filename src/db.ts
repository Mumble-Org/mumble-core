import mongoose from 'mongoose';
import { getErrorMessage } from './utils/errors.util';


const mongo_uri: string = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mumble";

/* Database Connection */
mongoose.connect(mongo_uri).then(() => {
        console.log('DB connected');
}).catch((error: any) => {
        const message: string = getErrorMessage(error);
        console.log(`${message}`);
});

mongoose.connection.on('error', (error) => {
        console.log(`${error}`);
});