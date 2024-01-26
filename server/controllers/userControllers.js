import User from "../models/User.js";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import transporter from "../config/emailConfig.js";
import { CLIENT_BASE_URL } from "../utils/constants.js";

dotenv.config();

class UserController {
  static userRegistration = async (req, res) => {
    const { email, username, password, rePassword } = req.body;
    const user = await User.findOne({
      $or: [{ email }, { username }],
    });

    // if user already exists
    if (user) {
      return res.status(400).send({
        status: "error",
        message: "User Registration failed ! User already exist",
      });
    }

    // if user does not exist
    if (username && email && password && rePassword) {
      if (password === rePassword) {
        // password and confirm pasword matches
        try {
          // create a new user in database
          const hashedPassword = await bycrypt.hash(password, 10);
          const doc = User({ email, password: hashedPassword, username });
          await doc.save();
          res.status(201).send({
            status: "success",
            message: "User registration successful",
          });
        } catch (error) {
          res.status(500).send({ status: "error", message: error.message });
        }
      } else {
        // password does not match
        res
          .status(400)
          .send({ status: "error", message: "Password does not match" });
      }
    } else {
      res
        .status(400)
        .send({ status: "error", message: "All fields are required" });
    }
  };
  static userLogin = async (req, res) => {
    const { identifier, password } = req.body;
    if (identifier && password) {
      const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }],
      });
      if (user != null) {
        const isMatched = await bycrypt.compare(password, user.password);

        if (isMatched) {
          const payload = { id: user._id, identifier: identifier };
          // create a httponly cookie
          // Set an HTTP-only cookie with a long expiration time
          const refreshToken = generateRefreshToken(payload);
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 365 * 30 * 24 * 60 * 60 * 1000,
          });
          // generate acces token

          const token = generateAccessToken(payload);

          res.status(200).send({
            status: "success",
            message: "User logged in successfully",
            token: token,
          });
        } else {
          res.status(400).send({
            status: "error",
            message: "Email | Username or Password is not valid",
          });
        }
      } else {
        res
          .status(400)
          .send({ staus: "error", message: "User does not exist" });
      }
    } else {
      res
        .status(400)
        .send({ status: "error", message: "all fields are required" });
    }
  };

  static changeUserPassword = async (req, res) => {
    const { password, password_confirmation } = req.body;
    if (password && password_confirmation) {
      if (password === password_confirmation) {
        console.log(password);
        const hashedPassword = await bycrypt.hash(password, 10);
        try {
          await User.findByIdAndUpdate(req.user.id, {
            $set: { password: hashedPassword },
          });
          res.status(201).send({
            status: "success",
            message: "Password changed successfully",
          });
        } catch (error) {
          res.status(500).send({
            status: "error",
            message: "Password could not be changed",
          });
        }
      } else {
        res.status(400).send({
          status: "error",
          message: "Password and confirm password does not match",
        });
      }
    } else {
      res
        .status(400)
        .send({ status: "error", message: "all fields are required" });
    }
  };
  static loggedUser = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      res.status(200).send({ status: "success", user: user });
    } catch (error) {
      res.status(500).send({
        status: "error",
        message: "couldn't retrieve user information",
        error: error,
      });
    }
  };
  static sendUserPasswordResetEmail = async (req, res) => {
    const { email } = req.body;
    console.log(email);
    if (email) {
      const user = await User.findOne({ email });
      if (user) {
        const secret = user._id + process.env.RESET_PASSWORD_SECRET_KEY;
        const token = jwt.sign({ id: user._id }, secret, {
          expiresIn: "15m",
        });
        const link = `${CLIENT_BASE_URL}/${user._id}/${token}`;
        const info = transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user.email,
          subkect: "UserAuth: Reset passwword link",

          html: `<a href=${link}>Click here to reset your password`,
        });
        res.status(200).send({
          status: "success",
          message: "Password reset Email sent... Please check you Email",
          info,
        });
      } else {
        res.status(400).send({
          status: "error",
          message: "Email does not exist",
        });
      }
    } else {
      res.status(400).send({
        status: "error",
        message: "Email field is required!",
      });
    }
  };

  static userResetPassword = async (req, res) => {
    const { password, password_confirmation } = req.body;
    const { id, token } = req.params;
    if (!(password && password_confirmation)) {
      return res.send({ status: "error", message: "All fieds are required!" });
    }
    if (password !== password_confirmation) {
      return res.send({
        status: "error",
        message: "New Password and confirmation password does not match",
      });
    }
    try {
      const user = await User.findById(id);
      const new_secret = user._id + process.env.RESET_PASSWORD_SECRET_KEY;
      jwt.verify(token, new_secret);
      const hashedPassword = await bycrypt.hash(password, 10);
      await User.findByIdAndUpdate(user._id, {
        $set: { password: hashedPassword },
      });
      res
        .status(201)
        .send({ status: "success", message: "Password reset successful" });
    } catch (error) {
      console.error("error", error);
      res.status(400).send({ status: "error", message: "Invalid token" });
    }
  };
  static refreshToken = (req, res) => {
    // get refresh token
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ status: "error", message: "refresh token is not available" });
    }
    try {
      const user = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY
      );
      if (user) {
        const payload = { id: user.id, identifier: user.identifier };
        const accesToken = generateAccessToken(payload);

        return res.status(201).send({ status: "success", token: accesToken });
      }
      res.status(401).send({ status: "error", message: "unauthorized" });
    } catch (error) {
      console.error("error", error);
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
  static logout = (req, res) => {
    try {
      // Clear the refresh token cookie on the client side
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: "15m",
  });
}
function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET_KEY);
}
export default UserController;
