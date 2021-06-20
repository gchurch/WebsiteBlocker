import React, { Component } from 'react';
import './Popup.css';

export default class Popup extends Component {
  render() {
    return (
      <div>
        <h1>Website Blocker</h1>
        <p>Click the button below to go to the options page.</p>
        <button onClick={this.openOptions}>Options</button>
      </div>
    );
  }

  openOptions() {
    console.log("Opening the options page...");
    chrome.tabs.create({ url: "options.html" });
  }
};