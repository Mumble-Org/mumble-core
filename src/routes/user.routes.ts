import * as reviewController from "../controllers/reviews.controller";
import * as userController from "../controllers/user.controller";

import { Request, Response, Router } from "express";

import auth from "../middlewares/auth";
import upload from "../middlewares/upload.middleware";

const router: Router = Router();

// user routes
router.post("/login", userController.login);
router.post("/signup", userController.signup);
router.put("/update", auth, userController.update);
router.post("/confirmUser", userController.confirmUsername);
router.post("/confirmEmail", userController.confirmEmail);
router.post("/", userController.getUserWithName);
router.post("/review", auth, reviewController.createReview);
router.get("/review", reviewController.getReview);
router.get("/trendingProducers", userController.getTrendingProducers);
router.get("/trendingEngineers", userController.getTrendingSoundEngineers);
router.get("/profile", auth, userController.getUserDetails);
router.put("/save", auth, userController.SavedBeats);
router.put(
	"/profileImage",
	[upload.single("image"), auth],
	userController.uploadProfileImage
);
router.delete("/savedBeat", auth, userController.RemoveSavedBeat);
router.get("/verify", auth, (req: Request, res: Response) => {
	return res.status(200).json({ success: true });
});

export default router;
