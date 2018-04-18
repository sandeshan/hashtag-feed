import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Tile.css";

import { GridTile } from "material-ui/GridList";
import FlatButton from "material-ui/FlatButton";
import { ListItem } from "material-ui/List";
import Avatar from "material-ui/Avatar";

import moment from "moment";

import TwitterIcon from "../../assets/twitter.svg";

class Tile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isHovering: ""
    };
  }

  // Handle 'hover' event for feed/gallery tile.
  handleHover = id => {
    this.setState({
      isHovering: id
    });
  };

  render() {
    let tile = this.props.tweetInfo;
    let avatarSize = this.props.numColumns > 3 ? 40 : 25; // small user image for mobile screens

    return (
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
            "tweet-hover " + (this.state.isHovering === tile.id ? "" : "hidden")
          }
        >
          <ListItem
            leftAvatar={<Avatar src={tile.user_img} size={avatarSize} />}
            rightIcon={
              <img className="tweet-icon" src={TwitterIcon} alt="logo" />
            }
            className="white-text"
            innerDivStyle={{ paddingLeft: "25px", paddingRight: "25px" }}
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
    );
  }
}

// prop-types definition
Tile.propTypes = {
  tweetInfo: PropTypes.object
};

// default prop values
Tile.defaultProps = {
  tweetInfo: {}
};

export default Tile;
