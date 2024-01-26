import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith("Bearer")) {
    try {
      const token = authorization.split(" ")[1];
      // verify token
      const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
      console.log(user);
      req.user = user;

      next();
    } catch (error) {
      console.log("error: ", error);
      res
        .status(401)
        .send({ error: "error", message: "Unauthrorized user, token expired" });
    }
  } else {
    console.log("error");
    res.status(401).send({ error: "error", message: "Unauthrorized user" });
  }
};
