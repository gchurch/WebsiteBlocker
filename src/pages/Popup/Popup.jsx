import React, { Component } from 'react';
import './Popup.css';

export default class Popup extends Component {

  constructor(props) {
    super(props);
    this.state = { numberOfBlockedWebsites: 0 };
  }

  componentDidMount() {
    this.calculateNumberOfBlockedWebsites();
  }

  calculateNumberOfBlockedWebsites() {
    chrome.declarativeNetRequest.getDynamicRules(
      (rules) => {
        this.setState({ numberOfBlockedWebsites: rules.length });
      }
    );
  }

  render() {
    return (
      <div>
        <header>
          <img src="icon-128.png" />
          <h1>Website Blocker</h1>
        </header>
        <p>Currently blocking {this.state.numberOfBlockedWebsites} website(s).</p>
        <button onClick={this.openOptions}>Settings</button>
      </div>
    );
  }

  openOptions() {
    console.log("Opening the options page...");
    chrome.tabs.create({ url: "options.html" });
  }
};