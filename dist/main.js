"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
require("./db");
// import routers
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const beat_routes_1 = __importDefault(require("./routes/beat.routes"));
dotenv_1.default.config();
// initialize Express app
const app = (0, express_1.default)();
// Declare server port
const port = process.env.PORT || 3000;
// app Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json({ limit: "30mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "30mb", extended: true }));
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
// Server Entry route
app.get("/", (req, res) => {
    res.send("Welcome to Mumble's API ⚡️");
});
// routers
app.use("/users", user_routes_1.default);
app.use("/beats", beat_routes_1.default);
// Start serve3r on port {port}
app.listen(port, () => {
    console.log(`⚡️[server]: Server running at http://localhost:${port}`);
});
exports.default = app;
