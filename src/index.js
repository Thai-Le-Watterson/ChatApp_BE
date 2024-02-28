import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import connection from "./database/connectDB.js";
import initAppRoutes from "./routes/index.js";
import initModels from "./models/index.js";
import initSocket from "./socket/socket.js";

dotenv.config();

const app = express();
const server = http.Server(app);
const port = process.env.PORT;
const whitelist = [process.env.CLIENT_URL, process.env.CLIENT_LOCAL_URL];
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    console.log(origin, process.env.CLIENT_URL);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionSuccessStatus: 200,
};

connection.testConnection();

initModels();

app.use(cors(corsOptions));
app.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "*"
    // "Origin, X-Requested-With, Content-Type, Accept, Set-Cookie"
  );
  next();
});
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

initAppRoutes(app);
initSocket(server);

server.listen(port || 8000, () => {
  console.log(`Server is running on port ${port}`);
});
