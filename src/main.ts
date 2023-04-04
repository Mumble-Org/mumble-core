import express, { Express, Request, Response } from "express";
import dotenv from 'dotenv';

// initialize Express app
const app: Express = express();

// Declare server port
const port = process.env.PORT || 3000;

// Server Entry route
app.get("/", (req: Request, res: Response) => {
        res.send("Hello world");
});


app.listen(port, () => {
        console.log(`⚡️[server]: Server running at http://localhost:${port}`);
});