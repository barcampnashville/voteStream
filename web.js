var express = require("express");
var app = express();
app.use(express.logger());
app.use(express.bodyParser());

// This serves up all the HTML pages on the site
// The port designation allows us to develop on 5000 but serve from heroku on standard ports
app.use("/", express.static(__dirname + "/app")).listen(process.env.PORT || 5000);
console.log("APP Server started successfully.");