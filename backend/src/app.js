const express = require("express");
const authMiddleware = require("./middlewares/authMiddleware");
const authController = require("./controllers/authController");
const settingsController = require("./controllers/settingsController");
const morgan = require("morgan");

require("express-async-errors");

const cors = require("cors");
const helmet = require("helmet");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));

app.use(helmet());

app.use(express.json());

app.use(morgan("dev"));

app.post("/login", authController.doLogin);

app.get("/settings", authMiddleware, settingsController.getSettings);

app.patch("/settings", authMiddleware, settingsController.updateSettings);

app.post("/logout", authController.doLogout);

app.use(require("./middlewares/errorMiddleware"));

module.exports = app;
