# Hashtag Feed

### Live Twitter-Hashtag Feed Gallery.

---

## Live Demo:

* [Hosted here](https://hashtag-feed.herokuapp.com/))

## Features:

* Just enter event hashtag and the Gallery continually updates images as new tweets are fetched, with search auto-complete to filter by Username.
* Client bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
* UI built using [Material UI Components](https://www.material-ui.com/#/).
* Simple Node.js back-end to retreive tweets using [Twitter Search API](https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets.html)
* Clean and modular ES6 code.
* Responsive layout, adapting to Desktop and Mobile screens.

## Instructions:

* Clone this repo.
* Install dependencies:

  * Server (root dir):

  ```bash
  $ yarn install
  ```

  * Client:

  ```bash
  $ cd client
  $ yarn install
  ```

* Prepare Twitter Access Keys/Tokens:

  * Create file '.env' in root directory.
  * Place Twiiter credentials in this file as shown below:
    ```
    TWITTER_CONSUMER_KEY=<CONSUMER_KEY>
    TWITTER_CONSUMER_SECRET=<CONSUMER_SECRET>
    TWITTER_ACCESS_TOKEN_KEY=<TOKEN_KEY>
    TWITTER_ACCESS_TOKEN_SECRET=<TOKEN_SECRET>
    ```

* Start app from root directory: (runs on `http://localhost:3000/`):

```bash
$ yarn dev
```

​ Starts both server and client from same terminal.
