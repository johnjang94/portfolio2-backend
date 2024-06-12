require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./user");
const nodemailer = require("nodemailer");
const http = require("http");
const https = require("https");
const privateKey = fs.readFileSync("sslcert/server.key", "utf8");
const certificate = fs.readFileSync("sslcert/server.crt", "utf8");

const credentials = { key: privateKey, cert: certificate };
const app = express();
const uri = process.env.MONGO_URI;
console.log("MONGO_URI:", uri);

app.use(bodyParser.json());
app.use(cors());

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

app.post("/contact", async (req, res) => {
  const { name, email, inquiry, message } = req.body;

  try {
    const newUser = new User({ name, email, inquiry, message });
    await newUser.save();
    res.status(201).send("Your message has been sent!");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongoose connected!");
  })
  .catch((err) => {
    console.log("DB connection failed", err);
  });

httpServer.listen(8080);
httpsServer.listen(5173);

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.REACT_APP_ADDRESS,
    pass: process.env.REACT_APP_PASSWORD,
  },
});
