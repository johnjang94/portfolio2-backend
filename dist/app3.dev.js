"use strict";

require("dotenv").config();

var express = require("express");

var mongoose = require("mongoose");

var bodyParser = require("body-parser");

var cors = require("cors");

var User = require("./user");

var app = express();
var uri = process.env.MONGO_URI;
console.log("MONGO_URI:", uri);
app.use(bodyParser.json());
app.use(cors());
app.post("/inquiry", function _callee(req, res) {
  var _req$body, name, email, inquiry, message, newUser;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, email = _req$body.email, inquiry = _req$body.inquiry, message = _req$body.message;
          _context.prev = 1;
          newUser = new User({
            name: name,
            email: email,
            inquiry: inquiry,
            message: message
          });
          _context.next = 5;
          return regeneratorRuntime.awrap(newUser.save());

        case 5:
          res.status(201).send("User registered successfully");
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          res.status(400).send("Error registering user: " + _context.t0.message);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 8]]);
});
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  console.log("mongoose connected!");
})["catch"](function (err) {
  console.log("DB connection failed", err);
});
app.listen(8080, function () {
  console.log("server is on 8080");
});