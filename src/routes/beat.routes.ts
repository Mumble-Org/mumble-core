import { Router } from "express";
import auth from "../middlewares/auth";
import {
	uploadBeat,
	getBeatsById,
	deleteBeat,
	getBeats,
	getTrendingBeats,
	getPopularBeats,
	updateBeatPlays,
} from "../controllers/beat.controller";
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
router.get("/:id", auth, getBeatsById);
router.delete("", auth, deleteBeat);
router.put("/plays", updateBeatPlays);

export default router;
