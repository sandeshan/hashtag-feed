import React, { Component } from "react";
import "./App.css";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import FlatButton from "material-ui/FlatButton";

import Form from "../Form/Form";
import Gallery from "../Gallery/Gallery";

import axios from "axios";

import common from "../../util/common";
import TwitterIcon from "../../assets/twitter.svg";

let refreshTimer;
let count = 0;

class App extends Component {
  constructor(props) {
    super(props);

    // split search form and grid

    this.state = {
      showSearch: true,
      showError: false,
      eventName: "My Event",
      hashtagName: "",
      tweets: [],
      tilesData: [],
      searchTerm: "",
      max_id: "",
      isHovering: "",
      numColums: 5
    };
  }

  componentDidMount = () => {
    window.addEventListener("resize", this.checkWindowWidth);
    this.checkWindowWidth();
  };

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.checkWindowWidth);
  };

  handleNameChange = eventName => {
    this.setState({ eventName: eventName });
  };

  handleHashtagChange = hashtagName => {
    this.setState({ hashtagName: hashtagName });
  };

  handleSubmit = () => {
    count = 0;

    if (this.state.hashtagName.length > 0) {
      let query = "%23" + this.state.hashtagName;
      let tweetsArray = [];

      this.setState({
        showSearch: false,
        tweets: [],
        tilesData: []
      });

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

  handleHomeClick = () => {
    this.setState({
      showSearch: true
    });
  };

  getNewTweets = () => {
    if (this.state.max_id !== "") {
      let query = "%23" + this.state.hashtagName;
      axios.get(`/search/${query}/${this.state.max_id}`).then(res => {
        this.parseTweets(res, this.state.tweets);
      });

      count++;
      if (count >= 5) clearInterval(refreshTimer);
    }
  };

  parseTweets = (json, tweetsArray) => {
    let max_id = "";
    if (json.data.search_metadata.next_results !== undefined) {
      max_id = common.getMaxID(json.data.search_metadata.next_results);
    }

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

  checkWindowWidth = () => {
    if (window.innerWidth < 500) {
      this.setState({
        numColums: 2
      });
    } else if (window.innerWidth < 800) {
      this.setState({
        numColums: 4
      });
    } else {
      this.setState({
        numColums: 5
      });
    }
  };

  handleHover = id => {
    this.setState({
      isHovering: id
    });
  };

  handleSearch = searchTerm => {
    this.setState({
      searchTerm: searchTerm
    });
  };

  handleUpdate = searchText => {
    this.setState({
      searchTerm: searchText
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
              searchTerm={this.state.searchTerm}
              tweets={this.state.tweets}
              tilesData={this.state.tilesData}
              numColums={this.state.numColums}
              isHovering={this.state.isHovering}
              handleHover={this.handleHover}
              handleSearch={this.handleSearch}
              handleUpdate={this.handleUpdate}
            />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
