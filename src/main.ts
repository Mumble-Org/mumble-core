import express, { Express, Request, Response } from "express";
import cookieParser from 'cookie-parser';
import bodyParser from "body-parser";
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';
import './db';

// import routers
import UserRouter from './routes/user.routes';


// initialize Express app
const app: Express = express();

// Declare server port
const port = process.env.PORT || 3000;

// app Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));


// Server Entry route
app.get("/", (req: Request, res: Response) => {
        res.send("Welcome to Mumble's API ⚡️");
});

// routers
app.use('/', UserRouter);

// Start serve3r on port {port}
app.listen(port, () => {
        console.log(`⚡️[server]: Server running at http://localhost:${port}`);
});