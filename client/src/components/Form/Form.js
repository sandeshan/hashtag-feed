import React, { Component } from "react";
import "./Form.css";

import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";

class Form extends Component {
  handleNameChange = event => {
    this.props.handleNameChange(event.target.value);
  };

  handleHashtagChange = event => {
    this.props.handleHashtagChange(event.target.value);
  };

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

export default Form;
