const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

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

app.get("/search/:hashtag/:max_id", function(req, res) {
  client.get(
    "search/tweets",
    {
      q: `${req.params.hashtag}`,
      max_id: `${req.params.max_id}`,
      count: 100
    },
    function(error, tweets, response) {
      return res.json(tweets);
    }
  );
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port);
