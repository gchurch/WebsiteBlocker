import React, { Component } from 'react';
import './Popup.css';

export default class Popup extends Component {
  render() {
    return (
      <div>
        <h1>Website Blocker</h1>
        <button onClick={this.openOptions}>Settings</button>
      </div>
    );
  }

  openOptions() {
    console.log("Opening the options page...");
    chrome.tabs.create({ url: "options.html" });
  }
};