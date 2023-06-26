"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const beat_controller_1 = require("../controllers/beat.controller");
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
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
        {
            name: "data",
            maxCount: 1,
        },
    ]),
    auth_1.default,
], beat_controller_1.uploadBeat);
router.get("/trending", beat_controller_1.getTrendingBeats);
router.get("/popular", beat_controller_1.getPopularBeats);
router.get("", beat_controller_1.getBeats);
router.get("/getuserbeats/", beat_controller_1.getBeatsByUserid);
router.delete("", auth_1.default, beat_controller_1.deleteBeat);
router.put("/plays", beat_controller_1.updateBeatPlays);
router.put("/save", auth_1.default, beat_controller_1.saveBeat);
router.put("/unsave", auth_1.default, beat_controller_1.unsaveBeat);
router.get("/:id", auth_1.default, beat_controller_1.getBeatsById);
exports.default = router;
