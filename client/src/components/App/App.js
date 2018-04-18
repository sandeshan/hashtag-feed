import React, { Component } from "react";
import "./App.css";

import Form from "../Form/Form";
import Gallery from "../Gallery/Gallery";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import FlatButton from "material-ui/FlatButton";
import Snackbar from "material-ui/Snackbar";

import axios from "axios";

import { getMaxID } from "../../util/common";

let refreshTimer;
let count = 0;

class App extends Component {
  constructor(props) {
    super(props);

    // initial state of App
    this.state = {
      showSearch: true,
      showError: false,
      eventName: "My Event",
      hashtagName: "",
      tweets: [],
      tilesData: [],
      max_id: "",
      numColumns: 5,
      cellHeight: 240,
      showSnackbar: false,
      snackbarMessage: "Loading new tweets ...",
      snackbarTimeOut: 3000
    };
  }

  // START App lifecycle methods

  // attach listener to observe window re-size events. Required to set number of columns in grid.
  componentDidMount = () => {
    window.addEventListener("resize", this.checkWindowWidth);
    this.checkWindowWidth();
  };

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.checkWindowWidth);
  };

  // END App lifecycle methods

  // START Form Handler methods

  // handle event name updates
  handleNameChange = eventName => {
    this.setState({ eventName: eventName });
  };

  // handle hashtag name updates
  handleHashtagChange = hashtagName => {
    this.setState({
      hashtagName: hashtagName,
      showError: hashtagName.length === 0
    });
  };

  // handle form submit/"Start Event" button click event
  handleSubmit = () => {
    count = 0;

    // check if hashtag is entered. If not, then show error in form
    if (this.state.hashtagName.length > 0) {
      // append '#' (%23 in ascii) to search term if absent
      let query =
        this.state.hashtagName.indexOf("#") === 0
          ? "%23" + this.state.hashtagName.substr(1)
          : "%23" + this.state.hashtagName;

      let tweetsArray = [];

      this.setState({
        showSearch: false,
        tweets: [],
        tilesData: []
      });

      // fetch tweets from back-end
      axios.get(`/search/${query}`).then(res => {
        this.parseTweets(res, tweetsArray);
      });

      refreshTimer = setInterval(this.getNewTweets, 5000);
    } else {
      this.setState({
        showError: true
      });
    }
  };

  // END Form Handler methods

  // Handle 'Home' button click event
  handleHomeClick = () => {
    count = 0;
    clearInterval(refreshTimer);

    this.setState({
      showSearch: true,
      snackbarMessage: "Loading new tweets ..."
    });
  };

  // START Tweet fetch and parse methods.

  // Method to fetch next set of tweets using current max_id.
  getNewTweets = () => {
    // only fetch next set of tweets if new max_id is present.. Else, show 'no new tweets' message.
    if (this.state.max_id !== "") {
      let query =
        this.state.hashtagName.indexOf("#") === 0
          ? "%23" + this.state.hashtagName.substr(1)
          : "%23" + this.state.hashtagName;

      axios.get(`/search/${query}/${this.state.max_id}`).then(res => {
        this.parseTweets(res, this.state.tweets);
      });

      this.setState({
        showSnackbar: true,
        snackbarMessage: "Loading new tweets ...",
        snackbarTimeOut: 3000
      });

      count++;
      if (count >= 10) clearInterval(refreshTimer);
    } else {
      // No max_id; show 'no new tweets' message.
      if (this.state.snackbarMessage !== "No more new tweets.") {
        this.setState({
          showSnackbar: true,
          snackbarMessage: "No more new tweets.",
          snackbarTimeOut: 6000
        });
      }
    }
  };

  // Method to parse tweets response, and store new max_id, if available.
  parseTweets = (json, tweetsArray) => {
    let max_id = "";
    if (json.data.search_metadata.next_results !== undefined) {
      max_id = getMaxID(json.data.search_metadata.next_results);
    }

    // add each tweet to start of tweets array.
    json.data.statuses.forEach(tweet => {
      if (tweet.entities.media != null && !tweet.possibly_sensitive) {
        tweetsArray.unshift(tweet);
      }
    });

    this.setState({
      tweets: tweetsArray,
      max_id: max_id
    });
  };

  // END Tweet fetch and parse methods.

  // Method to change number of columns in the grid and cell height, based on browser window width.
  checkWindowWidth = () => {
    let width = window.innerWidth;

    // set number of columns in grid.
    if (width < 500) {
      this.setState({
        numColumns: 2
      });
    } else if (width < 900) {
      this.setState({
        numColumns: 3
      });
    } else if (width < 1200) {
      this.setState({
        numColumns: 4
      });
    } else {
      this.setState({
        numColumns: 5
      });
    }

    // set cell height.
    if (width <= 1200) {
      this.setState({
        cellHeight: 200
      });
    } else if (width > 2000) {
      this.setState({
        cellHeight: 280
      });
    } else {
      this.setState({
        cellHeight: 240
      });
    }
  };

  // handle snackbar close event.
  handleSnackbarClose = () => {
    this.setState({
      showSnackbar: false
    });
  };

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <AppBar
            title="Hashtag Feed"
            iconElementRight={
              <FlatButton
                label="Home"
                className={this.state.showSearch ? "hidden" : ""}
                onClick={this.handleHomeClick}
              />
            }
          />
          <div className="content">
            <Form
              showSearch={this.state.showSearch}
              showError={this.state.showError}
              handleNameChange={this.handleNameChange}
              handleHashtagChange={this.handleHashtagChange}
              handleSubmit={this.handleSubmit}
            />
            <Gallery
              showSearch={this.state.showSearch}
              eventName={this.state.eventName}
              hashtagName={this.state.hashtagName}
              tweets={this.state.tweets}
              tilesData={this.state.tilesData}
              numColumns={this.state.numColumns}
              cellHeight={this.state.cellHeight}
            />
            <Snackbar
              open={this.state.showSnackbar}
              message={this.state.snackbarMessage}
              autoHideDuration={this.state.snackbarTimeOut}
              onRequestClose={this.handleSnackbarClose}
            />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
