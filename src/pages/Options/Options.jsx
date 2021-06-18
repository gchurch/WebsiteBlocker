/*global chrome*/
import React, { Component } from 'react';
import './Options.css';

export default class Options extends Component {

    constructor(props) {
        super(props);
        this.state = { blockedList: [] }

        this.blockUrl = this.blockUrl.bind(this);
        this.unblockUrl = this.unblockUrl.bind(this);
    }

    componentDidMount() {
        this.populateBlockedList();
    }

    populateBlockedList() {
        chrome.declarativeNetRequest.getDynamicRules(
            (rules) => {
                console.log(rules);
                this.setState({ blockedList: rules });
            }
        );
    }

    render() {
        return (
            <div>
                <h1>OPTIONS PAGE</h1>
                {this.renderForm()}
                {this.renderCurrentlyBlockedUrls()}
            </div>
        );
    }

    renderForm() {
        return (
            <div>
                Url to add to block list: <input id="urlToBlock" type="text"></input>
                <button onClick={this.blockUrl}>Add</button>
            </div>
        );
    }

    blockUrl() {
        var element = document.getElementById("urlToBlock");
        var urlToBlock = element.value;
        console.log("URL to block: " + urlToBlock);

        var uniqueId = this.createUniqueId();
        var updateRuleOptions = {
            removeRuleIds: [],
            addRules: [
                {
                    "id": uniqueId,
                    "priority": 1,
                    "action": { "type": "block" },
                    "condition": { "urlFilter": urlToBlock, "resourceTypes": ["main_frame", "sub_frame", "script"] }
                }
            ]
        }

        chrome.declarativeNetRequest.updateDynamicRules(updateRuleOptions, () => {
            this.populateBlockedList();
        });
    }

    createUniqueId() {
        var uniqueId = 1;
        for (var i = 0; i < this.state.blockedList.length; i++) {
            if (uniqueId <= this.state.blockedList[i].id) {
                uniqueId = this.state.blockedList[i].id + 1;
            }
        }
        return uniqueId;
    }

    renderCurrentlyBlockedUrls() {
        return (
            <div>
                <h3>Currently blocked URLs:</h3>
                <ul>
                    {this.state.blockedList.map(rule =>
                        <div>
                            <li>{rule.condition.urlFilter}</li>
                            <button onClick={this.unblockUrl.bind(this, rule.id)}>Remove</button>
                        </div>
                    )}
                </ul>
            </div>
        );
    }

    unblockUrl(id) {
        console.log("unblocking rule with id: " + id);

        var updateRuleOptions = {
            removeRuleIds: [id],
            addRules: []
        }

        chrome.declarativeNetRequest.updateDynamicRules(updateRuleOptions, () => {
            this.populateBlockedList();
        });
    }
}