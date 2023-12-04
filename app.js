import express from 'express';
import session from "express-session";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./users/routes.js";
import "dotenv/config";
import MovieRoutes from ".movies/routes.js";

const app = express()
app.use(express.json());
app.use(
    cors({
      credentials: true,
      origin: process.env.NODE_ENV === "production"
         ? process.env.FRONTEND_URL
         : process.env.FRONTEND_URL_LOCAL,
    })
  );
  const sessionOptions = {
    secret: "any string",
    resave: false,
    saveUninitialized: false,
  };
  if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
      sameSite: "none",
      secure: true,
    };
  }
  app.use(session(sessionOptions));

const CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
mongoose.connect(CONNECTION_STRING);

UserRoutes(app);
MovieRoutes(app);
app.listen(process.env.PORT || 4000);