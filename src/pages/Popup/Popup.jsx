import React, { Component } from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

export default class Popup extends Component {
  render() {
    return (
      <div>
        <h1>Popup</h1>
        <button onClick={this.openOptions}>Options</button>
      </div>
    );
  }

  openOptions() {
    console.log("Opening the options page...");
    chrome.tabs.create({ url: "options.html" });
  }
};