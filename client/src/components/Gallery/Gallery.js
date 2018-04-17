import React, { Component } from "react";
import "./Gallery.css";

import { GridList, GridTile } from "material-ui/GridList";
import AutoComplete from "material-ui/AutoComplete";
import FlatButton from "material-ui/FlatButton";
import { ListItem } from "material-ui/List";
import Avatar from "material-ui/Avatar";
import TwitterIcon from "../../assets/twitter.svg";

import _ from "lodash";
import moment from "moment";

import { cyan500 } from "material-ui/styles/colors";

const styles = {
  gridList: {
    width: "100%",
    height: "100%"
  }
};

class Gallery extends Component {
  handleHover = id => {
    this.props.handleHover(id);
  };

  handleSearch = (searchTerm, index) => {
    if (typeof searchTerm === "string") {
      this.props.handleSearch(searchTerm);
    } else {
      this.props.handleSearch(searchTerm.text);
    }
  };

  handleUpdate = (searchText, dataSource, params) => {
    this.props.handleUpdate(searchText);
  };

  render() {
    let tilesData = this.props.tilesData;
    let searchDataSource = [];

    this.props.tweets.forEach(tweet => {
      if (_.findIndex(tilesData, ["id", tweet.id_str]) === -1) {
        tilesData.unshift({
          id: tweet.id_str,
          img: `${tweet.entities.media[0].media_url_https}:medium`,
          created_at: tweet.created_at,
          user_name: tweet.user.name,
          user_screen_name: tweet.user.screen_name,
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

    if (this.props.searchTerm !== "") {
      let search = this.props.searchTerm.toLowerCase();
      tilesData = _.filter(tilesData, function(o) {
        return o.user_name.toLowerCase().indexOf(search) !== -1;
      });
    }

    return (
      <div
        className={this.props.showSearch ? "hidden" : ""}
        id="feed-div"
        style={{ display: "initial" }}
      >
        <div className="feed-title">
          <div>
            <h1 className="title-text">{this.props.eventName}</h1>
          </div>
        </div>
        <div className="feed-subtitle">
          <div className="subtitle-text">
            <p className="hashtag-text">#{this.props.hashtagName}</p>{" "}
            <p className="tweets-info-text">
              <b>{this.props.tweets.length} </b>Posts // <b>{userCount} </b>Users
            </p>
          </div>
          <div className="search-div">
            <AutoComplete
              floatingLabelText="Search by username"
              filter={AutoComplete.fuzzyFilter}
              dataSource={searchDataSource}
              maxSearchResults={5}
              onNewRequest={this.handleSearch}
              onUpdateInput={this.handleUpdate}
              floatingLabelStyle={{ color: cyan500 }}
              underlineStyle={{ borderColor: cyan500 }}
            />
          </div>
        </div>
        <div className="feed-container">
          <GridList
            cellHeight={220}
            padding={8}
            cols={this.props.numColums}
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
                    (this.props.isHovering === tile.id ? "" : "hidden")
                  }
                >
                  <ListItem
                    leftAvatar={<Avatar src={tile.user_img} />}
                    rightIcon={<img src={TwitterIcon} alt="logo" />}
                    className="white-text"
                    primaryText={
                      <a
                        href={`https://twitter.com/${tile.user_screen_name}`}
                        target="_blank"
                      >
                        {tile.user_name}
                      </a>
                    }
                    secondaryText={
                      <p className="white-text">
                        {moment(
                          tile.created_at,
                          "ddd MMM DD HH:mm:ss ZZ YYYY"
                        ).fromNow()}
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
    );
  }
}

export default Gallery;
