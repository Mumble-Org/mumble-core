"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const audio_controller_1 = require("../controllers/audio.controller");
const upload_middleware_1 = __importDefault(require("../middlewares/upload.middleware"));
/**
 * Initialize express router
*/
const router = (0, express_1.Router)();
/**
* Define audio routes
*/
router.post('/audio', auth_1.default, upload_middleware_1.default.single('audio'), audio_controller_1.uploadAudio);
router.get('/audio', auth_1.default, audio_controller_1.getAudio);
router.delete('/audio', auth_1.default, audio_controller_1.deleteAudioFile);
exports.default = router;
