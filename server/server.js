const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const app = express();
app.use(express.static(path.join(__dirname, "build")));

const Twitter = require("twitter");

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

app.get("/ping", function(req, res) {
  return res.send("pong");
});

app.get("/search/:hashtag", function(req, res) {
  client.get(
    "search/tweets",
    {
      q: `${req.params.hashtag}`,
      count: 100
    },
    function(error, tweets, response) {
      return res.json(tweets);
    }
  );
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 8080);
