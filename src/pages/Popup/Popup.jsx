import React, { Component } from 'react';
import logo from '../../assets/img/logo.svg';
import './Popup.css';

export default class Popup extends Component {
  render() {
    return (
      <div>
        <h1>Website blocker</h1>
        <p>Click the button below to go to the options page, where you can block and unblock websites.</p>
        <button onClick={this.openOptions}>Options</button>
      </div>
    );
  }

  openOptions() {
    console.log("Opening the options page...");
    chrome.tabs.create({ url: "options.html" });
  }
};