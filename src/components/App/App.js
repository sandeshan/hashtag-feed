import React, { Component } from "react";
import "./App.css";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import { GridList, GridTile } from "material-ui/GridList";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";

import axios from "axios";

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
      eventName: "",
      hashtagName: "",
      tweets: []
    };
  }

  componentDidMount = () => {};

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

  handleSubmit = e => {
    e.preventDefault();

    let query = "%23" + this.state.hashtagName;
    let tweetsArray = [];

    axios.get(`/search/${query}`).then(res => {
      res.data.statuses.forEach(tweet => {
        if (tweet.entities.media != null) {
          console.log(tweet);
          tweetsArray.unshift(tweet);
          tweetsArray.unshift(tweet);
          tweetsArray.unshift(tweet);
        }
      });
      this.setState({
        showSearch: false,
        tweets: tweetsArray
      });
    });
  };

  render() {
    let tilesData = [];

    this.state.tweets.forEach(tweet => {
      tilesData.unshift({
        img: `${tweet.entities.media[0].media_url_https}:medium`
      });
    });

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
                  <h1>{this.state.eventName}</h1>
                </div>
                <div>
                  #{this.state.hashtagName} {this.state.tweets.length} Posts //
                </div>
              </div>
              <div style={styles.root}>
                <GridList cellHeight={180} cols={5} style={styles.gridList}>
                  {tilesData.map(tile => (
                    <GridTile
                      key={tile.img + Math.floor(Math.random() * (15 - 0))}
                    >
                      <img src={tile.img} alt="" />
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
