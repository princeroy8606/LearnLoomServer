const mongoose = require("mongoose");
const express = require("express");
const Cors = require("cors");

const authRouters = require("./routes/authRoutes");
const courseRouters = require("./routes/courseRoutes");

require("dotenv").config();

const app = express();

app.use(
  Cors({
    origin: "*",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Connection Successful");
});

// mongodb

mongoose
  .connect(process.env.SERVER_URL)
  .then(() => {
    app.listen(5000, () => {
      console.log("Connected 🚀");
    });
  })
  .catch((err) => {
    console.log("Error > ", err);
  });
app.use(express.json());

app.use("/auth", authRouters);
app.use("/course", courseRouters);
