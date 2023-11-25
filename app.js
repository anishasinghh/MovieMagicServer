import express from 'express';
import session from "express-session";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./users/routes.js";
import "dotenv/config";

// var client_id = 'fd0da0633f7940a7a94467b34d578437';
// var client_secret = '306958e505474393b16a4eb0f33f6b28';

// var authOptions = {
//   url: 'https://accounts.spotify.com/api/token',
//   headers: {
//     'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
//   },
//   form: {
//     grant_type: 'client_credentials'
//   },
//   json: true
// };

// request.post(authOptions, function(error, response, body) {
//   if (!error && response.statusCode === 200) {
//     var token = body.access_token;
//   }
// });

const app = express();
app.use(express.json());
app.use(
    cors({
      credentials: true,
      // origin: process.env.FRONTEND_URL,
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
  
const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/kanbas';
mongoose.connect(CONNECTION_STRING);
UserRoutes(app);
app.listen(process.env.PORT || 4000);