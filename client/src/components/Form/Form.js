import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Form.css";

import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";

class Form extends Component {
  // pass entered event name value to parent
  handleNameChange = event => {
    this.props.handleNameChange(event.target.value);
  };

  // pass entered hashtag value to parent
  handleHashtagChange = event => {
    this.props.handleHashtagChange(event.target.value);
  };

  // pass submit ('Start Event') action to parent
  handleSubmit = e => {
    e.preventDefault();
    this.props.handleSubmit();
  };

  render() {
    return (
      <div className={this.props.showSearch ? "" : "hidden"} id="form-div">
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
            errorText={
              this.props.showError ? "Please enter the event Hashtag!" : null
            }
          />
          <br />
          <RaisedButton
            label="Start Event"
            type="submit"
            primary={true}
            fullWidth={true}
          />
        </form>
      </div>
    );
  }
}

// prop-types definition
Form.propTypes = {
  showSearch: PropTypes.bool,
  showError: PropTypes.bool,
  handleNameChange: PropTypes.func,
  handleHashtagChange: PropTypes.func,
  handleSubmit: PropTypes.func
};

// default prop values
Form.defaultProps = {
  showSearch: true,
  showError: false
};

export default Form;
