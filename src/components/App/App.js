import React, { Component } from "react";
import "./App.css";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import { GridList, GridTile } from "material-ui/GridList";
import TextField from "material-ui/TextField";
import AutoComplete from "material-ui/AutoComplete";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import { ListItem } from "material-ui/List";
import Avatar from "material-ui/Avatar";
import TwitterIcon from "../../assets/twitter.svg";

import axios from "axios";
import _ from "lodash";
import moment from "moment";

import common from "../../util/common";
import { cyan500 } from "material-ui/styles/colors";

let refreshTimer;
let count = 0;

const styles = {
  gridList: {
    width: "100%",
    height: "100%"
  }
};

class App extends Component {
  constructor(props) {
    super(props);

    // split search form and grid

    this.state = {
      showSearch: true,
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
      tilesData: []
    });

    axios.get(`/search/${query}`).then(res => {
      this.parseTweets(res, tweetsArray);
    });

    refreshTimer = setInterval(this.getNewTweets, 5000);
  };

  handleSearch = (searchTerm, index) => {
    if (typeof searchTerm === "string") {
      this.setState({
        searchTerm: searchTerm
      });
    } else {
      this.setState({
        searchTerm: searchTerm.text
      });
    }
  };

  handleUpdate = (searchText, dataSource, params) => {
    this.setState({
      searchTerm: searchText
    });
  };

  render() {
    let tilesData = this.state.tilesData;
    let searchDataSource = [];

    this.state.tweets.forEach(tweet => {
      if (_.findIndex(tilesData, ["id", tweet.id_str]) === -1) {
        tilesData.unshift({
          id: tweet.id_str,
          img: `${tweet.entities.media[0].media_url_https}:medium`,
          created_at: tweet.created_at,
          user_name: tweet.user.name,
          user_img: tweet.user.profile_image_url_https,
          user_id: tweet.user.id
        });
      }
    });

    let userCount = _.uniqBy(tilesData, "user_id").length;
    let uniqUsers = _.uniqBy(tilesData, "user_id");

    _.sortBy(uniqUsers, [
      function(o) {
        return o.user_name;
      }
    ]).forEach(tile => {
      searchDataSource.push({
        text: tile.user_name,
        value: tile.user_id
      });
    });

    if (this.state.searchTerm !== "") {
      let search = this.state.searchTerm;
      tilesData = _.filter(tilesData, function(o) {
        return o.user_name.indexOf(search) !== -1;
      });
    }

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
              </div>
              <div className="feed-subtitle">
                <div className="subtitle-text">
                  <p className="hashtag-text">#{this.state.hashtagName}</p>{" "}
                  <p className="tweets-info-text">
                    {this.state.tweets.length} Posts // {userCount} Users
                  </p>
                </div>
                <div className="search-div">
                  <AutoComplete
                    floatingLabelText="Search by username"
                    filter={AutoComplete.fuzzyFilter}
                    dataSource={searchDataSource}
                    onNewRequest={this.handleSearch}
                    onUpdateInput={this.handleUpdate}
                    floatingLabelStyle={{ color: cyan500 }}
                    underlineStyle={{ borderColor: cyan500 }}
                    maxSearchResults={5}
                  />
                </div>
              </div>
              <div className="feed-container">
                <GridList
                  cellHeight={200}
                  cols={this.state.numColums}
                  style={styles.gridList}
                >
                  {tilesData.map(tile => (
                    <GridTile
                      key={tile.id}
                      className="tweet-info-grid"
                      style={{
                        backgroundImage: `url(${tile.img})`
                      }}
                      onMouseEnter={() => this.handleHover(tile.id)}
                      onMouseLeave={() => this.handleHover("")}
                    >
                      <div
                        className={
                          "tweet-hover " +
                          (this.state.isHovering === tile.id ? "" : "hidden")
                        }
                      >
                        <ListItem
                          leftAvatar={<Avatar src={tile.user_img} />}
                          rightIcon={<img src={TwitterIcon} alt="logo" />}
                          className="white-text"
                          primaryText={tile.user_name}
                          secondaryText={
                            <p className="white-text">
                              {moment(tile.created_at).fromNow()}
                            </p>
                          }
                        />
                        <FlatButton
                          label="View Tweet"
                          labelStyle={{ color: "white" }}
                          className="view-tweet-btn"
                          href={`https://twitter.com/statuses/${tile.id}`}
                          target="_blank"
                        />
                      </div>
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
