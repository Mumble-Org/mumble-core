"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const beat_controller_1 = require("../controllers/beat.controller");
const upload_middleware_1 = __importDefault(require("../middlewares/upload.middleware"));
/**
 * Initialize express router
 */
const router = (0, express_1.Router)();
/**
 * Define audio routes
 */
router.post("", [
    upload_middleware_1.default.fields([
        {
            name: "audio",
            maxCount: 1,
        },
        {
            name: "image",
            maxCount: 1,
        },
    ]),
    auth_1.default,
], beat_controller_1.uploadBeat);
router.get("/:id", auth_1.default, beat_controller_1.getBeatsById);
router.get("", beat_controller_1.getBeats);
router.delete("", auth_1.default, beat_controller_1.deleteBeat);
exports.default = router;
