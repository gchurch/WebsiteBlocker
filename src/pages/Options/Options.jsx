/*global chrome*/
import React, { Component } from 'react';
import './Options.css';

export default class Options extends Component {

    constructor(props) {
        super(props);
        this.state = { urlBlockingRules: [] }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.blockUrl = this.blockUrl.bind(this);
        this.unblockUrl = this.unblockUrl.bind(this);
    }

    componentDidMount() {
        this.updateUrlBlockingRules();
    }

    updateUrlBlockingRules() {
        chrome.declarativeNetRequest.getDynamicRules(
            (rules) => {
                console.log(rules);
                this.setState({ urlBlockingRules: rules });
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
                    URL to block: <input id="urlToBlock" type="text"></input>
                    <button type="submit">Add</button>
                </form>
            </div>
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        var urlToBlock = this.getUrlFromTextField();
        this.blockUrl(urlToBlock);
        this.clearTextField();
    }

    getUrlFromTextField() {
        var inputElement = document.getElementById("urlToBlock");
        var urlToBlock = inputElement.value;
        return urlToBlock;
    }

    blockUrl(urlToBlock) {
        var uniqueId = this.createUniqueIdForRule();
        var updateRuleOptions = this.createUpdateRuleOptionsToBlockUrl(urlToBlock, uniqueId);

        chrome.declarativeNetRequest.updateDynamicRules(updateRuleOptions, () => {
            this.updateUrlBlockingRules();
            this.saveTimeOfBlockingToLocalStorage(uniqueId);
        });
    }

    clearTextField() {
        var inputElement = document.getElementById("urlToBlock");
        inputElement.value = "";
    }

    createUniqueIdForRule() {
        var uniqueId = 1;
        for (var i = 0; i < this.state.urlBlockingRules.length; i++) {
            if (uniqueId <= this.state.urlBlockingRules[i].id) {
                uniqueId = this.state.urlBlockingRules[i].id + 1;
            }
        }
        return uniqueId;
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

    saveTimeOfBlockingToLocalStorage(ruleId) {
        var timeNow = new Date().getTime();
        localStorage.setItem(ruleId, timeNow);
    }

    renderBlockedUrlsList() {
        return (
            <div>
                <h3>Currently blocked URLs:</h3>
                <table>
                    <tr>
                        <th>URL</th>
                        <th>Time since being blocked</th>
                        <th>Remove</th>
                    </tr>
                    {this.state.urlBlockingRules.map(rule =>
                        <tr>
                            <td>{rule.condition.urlFilter}</td>
                            <td>{this.renderTimeSinceUrlWasBlocked(rule.id)}</td>
                            <td><button onClick={this.unblockUrl.bind(this, rule.id)}>Remove</button></td>
                        </tr>
                    )}
                </table>
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
            this.updateUrlBlockingRules();
        });
    }
}