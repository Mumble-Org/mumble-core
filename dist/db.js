"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const errors_util_1 = require("./utils/errors.util");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// mongodb connection string
const url = process.env.MUMBLE_MONGO_URI;
const mongo_uri = `${url}`;
/* Database Connection */
mongoose_1.default
    .connect(mongo_uri)
    .then(() => {
    console.log("DB connected");
})
    .catch((error) => {
    const message = (0, errors_util_1.getErrorMessage)(error);
    console.log(`${message}`);
});
// log database errors
mongoose_1.default.connection.on("error", (error) => {
    console.log(`${error}`);
});
