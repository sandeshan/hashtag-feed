import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Gallery.css";

import Tile from "../Tile/Tile";

import { GridList } from "material-ui/GridList";
import AutoComplete from "material-ui/AutoComplete";

import _ from "lodash";

import { cyan500 } from "material-ui/styles/colors";

const styles = {
  gridList: {
    width: "100%",
    height: "100%"
  }
};

class Gallery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: ""
    };
  }

  // Handle search event
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

  // Handle search filed update
  handleUpdate = (searchText, dataSource, params) => {
    this.setState({
      searchTerm: searchText
    });
  };

  render() {
    let tilesData = this.props.tilesData;
    let searchDataSource = [];

    this.props.tweets.forEach(tweet => {
      let img_link = `${tweet.entities.media[0].media_url_https}:medium`;
      if (
        _.findIndex(tilesData, ["id", tweet.id_str]) === -1 &&
        _.findIndex(tilesData, ["img", img_link]) === -1
      ) {
        tilesData.unshift({
          id: tweet.id_str,
          img: img_link,
          created_at: tweet.created_at,
          user_name: tweet.user.name,
          user_screen_name: tweet.user.screen_name,
          user_img: tweet.user.profile_image_url_https,
          user_id: tweet.user.id
        });
      }
    });

    let uniqUsers = _.uniqBy(tilesData, "user_id");
    let postCount = tilesData.length;
    let userCount = _.uniqBy(tilesData, "user_id").length;

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
      let search = this.state.searchTerm.toLowerCase();
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
            <p className="hashtag-text">
              {this.props.hashtagName.indexOf("#") === 0
                ? this.props.hashtagName
                : `#${this.props.hashtagName}`}
            </p>{" "}
            <p className="tweets-info-text">
              <b>{postCount} </b>Posts // <b>{userCount} </b>Users
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
            cellHeight={this.props.cellHeight}
            padding={8}
            cols={this.props.numColumns}
            style={styles.gridList}
          >
            {tilesData.map(tile => (
              <Tile
                key={tile.id}
                tweetInfo={tile}
                numColumns={this.props.numColumns}
              />
            ))}
          </GridList>
        </div>
      </div>
    );
  }
}

// prop-types definition
Gallery.propTypes = {
  showSearch: PropTypes.bool,
  eventName: PropTypes.string,
  hashtagName: PropTypes.string,
  tweets: PropTypes.arrayOf(PropTypes.object),
  tilesData: PropTypes.arrayOf(PropTypes.object),
  numColumns: PropTypes.number,
  cellHeight: PropTypes.number
};

// default prop values
Gallery.defaultProps = {
  showSearch: true,
  eventName: "My Event",
  tweets: [],
  tilesData: [],
  numColumns: 5,
  cellHeight: 240
};

export default Gallery;
