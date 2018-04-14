import React, { Component } from "react";
import "./App.css";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import { GridList, GridTile } from "material-ui/GridList";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import { ListItem } from "material-ui/List";
import Avatar from "material-ui/Avatar";
import TwitterIcon from "../../assets/twitter.svg";

import axios from "axios";
import _ from "lodash";
import moment from "moment";

import common from "../../util/common";

let refreshTimer;
let count = 0;

const styles = {
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 10,
    overflowY: "auto",
    height: "calc(100vh - 175px)"
  },
  gridList: {
    width: "85%",
    height: "100%"
  }
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSearch: true,
      eventName: "My Event",
      hashtagName: "",
      tweets: [],
      tilesData: [],
      tweetsInfo: [],
      max_id: "",
      isHovering: ""
    };
  }

  componentDidMount = () => {};

  handleHover = id => {
    this.setState({
      isHovering: id
    });
  };

  handleNameChange = event => {
    this.setState({ eventName: event.target.value });
  };

  handleHashtagChange = event => {
    this.setState({ hashtagName: event.target.value });
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
      if (count === 5) clearInterval(refreshTimer);
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

  handleSubmit = e => {
    e.preventDefault();

    let query = "%23" + this.state.hashtagName;
    let tweetsArray = [];

    this.setState({
      showSearch: false,
      tweets: [],
      tilesData: [],
      tweetsInfo: []
    });

    axios.get(`/search/${query}`).then(res => {
      this.parseTweets(res, tweetsArray);
    });

    refreshTimer = setInterval(this.getNewTweets, 5000);
  };

  render() {
    let tilesData = this.state.tilesData;
    let tweetsInfo = this.state.tweetsInfo;

    this.state.tweets.forEach(tweet => {
      if (_.findIndex(tilesData, ["id", tweet.id_str]) === -1)
        tilesData.unshift({
          img: `${tweet.entities.media[0].media_url_https}:medium`,
          id: tweet.id_str
        });
      tweetsInfo.unshift({
        username: tweet.user.name,
        img: tweet.user.profile_image_url_https,
        created_at: tweet.created_at,
        id: tweet.id_str,
        user_id: tweet.user.id
      });
    });

    let userCount = _.uniqBy(tweetsInfo, "user_id").length;

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
            <div
              className={this.state.showSearch ? "" : "hidden"}
              id="form-div"
            >
              <form className="input-form" onSubmit={this.handleSubmit}>
                <TextField
                  floatingLabelText="Event Name"
                  fullWidth={true}
                  onChange={this.handleNameChange}
                />
                <br />
                <TextField
                  floatingLabelText="Hashtag"
                  fullWidth={true}
                  onChange={this.handleHashtagChange}
                />
                <br />
                <RaisedButton
                  label="Submit"
                  type="submit"
                  primary={true}
                  fullWidth={true}
                />
              </form>
            </div>
            <div
              className={this.state.showSearch ? "hidden" : ""}
              id="feed-div"
              style={{ display: "initial" }}
            >
              <div className="feed-title">
                <div>
                  <h1 className="title-text">{this.state.eventName}</h1>
                </div>
                <div style={{ display: "flex" }}>
                  <p className="hashtag-text">#{this.state.hashtagName}</p>{" "}
                  <p className="tweets-info-text">
                    {this.state.tweets.length} Posts // {userCount} Users
                  </p>
                </div>
              </div>
              <div style={styles.root}>
                <GridList cellHeight={200} cols={5} style={styles.gridList}>
                  {tilesData.map(tile => (
                    <GridTile
                      key={tile.id}
                      className="tweet-info-grid"
                      onMouseEnter={() => this.handleHover(tile.id)}
                      onMouseLeave={() => this.handleHover("")}
                    >
                      {this.state.isHovering !== tile.id ? (
                        <img src={tile.img} alt="" className="grid-img" />
                      ) : (
                        <div>
                          <ListItem
                            leftAvatar={
                              <Avatar
                                src={tweetsInfo.find(x => x.id === tile.id).img}
                              />
                            }
                            rightIcon={<img src={TwitterIcon} alt="logo" />}
                            className="white-text"
                            primaryText={
                              tweetsInfo.find(x => x.id === tile.id).username
                            }
                            secondaryText={moment(
                              tweetsInfo.find(x => x.id === tile.id).created_at
                            ).fromNow()}
                          />
                          <FlatButton
                            label="View Tweet"
                            labelStyle={{ color: "white" }}
                            href={`https://twitter.com/statuses/${tile.id}`}
                            target="_blank"
                          />
                        </div>
                      )}
                    </GridTile>
                  ))}
                </GridList>
              </div>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
