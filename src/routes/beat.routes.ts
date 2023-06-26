import {
	deleteBeat,
	getBeats,
	getBeatsById,
	getBeatsByUserid,
	getPopularBeats,
	getTrendingBeats,
	saveBeat,
	unsaveBeat,
	updateBeatPlays,
	uploadBeat,
} from "../controllers/beat.controller";

import { Router } from "express";
import auth from "../middlewares/auth";
import upload from "../middlewares/upload.middleware";

/**
 * Initialize express router
 */
const router: Router = Router();

/**
 * Define audio routes
 */
router.post(
	"",
	[
		upload.fields([
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
		auth,
	],
	uploadBeat
);
router.get("/trending", getTrendingBeats);
router.get("/popular", getPopularBeats);
router.get("", getBeats);
router.get("/getuserbeats/", getBeatsByUserid);
router.delete("", auth, deleteBeat);
router.put("/plays", updateBeatPlays);
router.put("/save", auth, saveBeat);
router.put("/unsave", auth, unsaveBeat);
router.get("/:id", auth, getBeatsById);


export default router;
