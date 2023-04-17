import { Router } from "express";
import auth from "../middlewares/auth";
import {
	uploadBeat,
	getBeatsById,
	deleteBeat,
	getBeats,
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
		]),
		auth,
	],
	uploadBeat
);
router.get("/:id", auth, getBeatsById);
router.get("", getBeats);
router.delete("", auth, deleteBeat);

export default router;
