import { Router } from "express";
import User from "../models/User.js";
import UserController from "../controllers/userControllers.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

//public routes
router.get("/", (req, res) => {
  res.send("auth router");
});
router.post("/login", UserController.userLogin);
router.post("/register", UserController.userRegistration);
router.post("/reset-password/:id/:token", UserController.userResetPassword);
router.post("/refresh-token", UserController.refreshToken);
router.post(
  "/send-reset-password-email",
  UserController.sendUserPasswordResetEmail
);

// private routes
router.post("/changepassword", authenticate, UserController.changeUserPassword);
router.post("/loggedinuser", authenticate, UserController.loggedUser);

router.post("/logout", authenticate, UserController.logout);

export default router;
