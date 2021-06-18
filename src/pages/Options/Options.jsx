/*global chrome*/
import React, { Component } from 'react';
import './Options.css';

export default class Options extends Component {

    constructor(props) {
        super(props);
        this.state = { blockedUrlList: [] }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.blockUrl = this.blockUrl.bind(this);
        this.unblockUrl = this.unblockUrl.bind(this);
    }

    componentDidMount() {
        this.updateBlockedUrlList();
    }

    updateBlockedUrlList() {
        chrome.declarativeNetRequest.getDynamicRules(
            (rules) => {
                console.log(rules);
                this.setState({ blockedUrlList: rules });
            }
        );
    }

    render() {
        return (
            <div>
                <h1>Website Blocker</h1>
                <h2>Options Page</h2>
                {this.renderFormToBlockUrl()}
                {this.renderBlockedUrlsList()}
            </div>
        );
    }

    renderFormToBlockUrl() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    Url to add to block list: <input id="urlToBlock" type="text"></input>
                    <button type="submit">Add</button>
                </form>
            </div>
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        this.blockUrl();
    }

    blockUrl() {
        var inputElement = document.getElementById("urlToBlock");
        var urlToBlock = inputElement.value;
        console.log("URL to block: " + urlToBlock);

        var uniqueId = this.createUniqueIdForRule();
        var updateRuleOptions = this.createUpdateRuleOptionsToBlockUrl(urlToBlock, uniqueId);

        chrome.declarativeNetRequest.updateDynamicRules(updateRuleOptions, () => {
            this.updateBlockedUrlList();
            this.saveTimeOfBlockingToLocalStorage(uniqueId);
        });
    }

    saveTimeOfBlockingToLocalStorage(ruleId) {
        var timeNow = new Date().getTime();
        localStorage.setItem(ruleId, timeNow);
    }

    createUpdateRuleOptionsToBlockUrl(urlToBlock, uniqueId) {
        var updateRuleOptions = {
            removeRuleIds: [],
            addRules: [
                {
                    "id": uniqueId,
                    "priority": 1,
                    "action": { "type": "block" },
                    "condition": {
                        "urlFilter": urlToBlock,
                        "resourceTypes": ["main_frame", "sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping", "csp_report", "media", "websocket", "other"]
                    }
                }
            ]
        }
        return updateRuleOptions;
    }

    createUniqueIdForRule() {
        var uniqueId = 1;
        for (var i = 0; i < this.state.blockedUrlList.length; i++) {
            if (uniqueId <= this.state.blockedUrlList[i].id) {
                uniqueId = this.state.blockedUrlList[i].id + 1;
            }
        }
        return uniqueId;
    }

    renderBlockedUrlsList() {
        return (
            <div>
                <h3>Currently blocked URLs:</h3>
                <ul>
                    {this.state.blockedUrlList.map(rule =>
                        <li>
                            <p>{rule.condition.urlFilter}</p>
                            <p>Time since URL has been blocked: {this.renderTimeSinceUrlWasBlocked(rule.id)}</p>
                            <button onClick={this.unblockUrl.bind(this, rule.id)}>Remove</button>
                        </li>
                    )}
                </ul>
            </div>
        );
    }

    renderTimeSinceUrlWasBlocked(ruleId) {
        var timeDifference = this.calcuateTimeSinceUrlWasBlocked(ruleId);
        var numDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        var numHours = Math.floor(timeDifference / (1000 * 60 * 60)) % 24;
        var numMinutes = Math.floor(timeDifference / (1000 * 60)) % 60;
        var numSeconds = Math.floor(timeDifference / (1000)) % 60;
        var timeString = numDays + " day(s) " + numHours + " hour(s) " + numMinutes + " min(s) " + numSeconds + " sec(s)";
        return timeString;
    }

    calcuateTimeSinceUrlWasBlocked(ruleId) {
        var timeNow = new Date().getTime();
        var timeOfBlocking = this.loadTimeOfBlockingFromLocalStorage(ruleId);
        var timeDifference = timeNow - timeOfBlocking;
        return timeDifference;
    }

    loadTimeOfBlockingFromLocalStorage(ruleId) {
        var timeOfBlocking = localStorage.getItem(ruleId);
        return timeOfBlocking;
    }

    unblockUrl(id) {
        console.log("unblocking rule with id: " + id);

        var updateRuleOptions = {
            removeRuleIds: [id],
            addRules: []
        }

        chrome.declarativeNetRequest.updateDynamicRules(updateRuleOptions, () => {
            this.updateBlockedUrlList();
        });
    }
}