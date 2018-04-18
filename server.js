const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

const Twitter = require("twitter");

// set up twitter client
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// Method which hits Twiiter Search API with user's hastag's query.
// input: query: string
// return: Twitter search response: JSON
app.get("/search/:hashtag", function(req, res) {
  client.get(
    "search/tweets",
    {
      q: req.params.hashtag,
      count: 100
    },
    function(error, tweets, response) {
      return res.json(tweets);
    }
  );
});

// Method which hits Twiiter Search API with user's hastag's query, and 'max_id' for nextset of results.
// input: query: string, max_id: string
// return: Twitter search response: JSON
app.get("/search/:hashtag/:max_id", function(req, res) {
  client.get(
    "search/tweets",
    {
      q: req.params.hashtag,
      max_id: req.params.max_id,
      count: 100
    },
    function(error, tweets, response) {
      return res.json(tweets);
    }
  );
});

// The "catch-all" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 5000;

app.listen(port);
