/*global chrome*/
import React, { Component } from 'react';
import './Options.css';

export default class Options extends Component {

    constructor(props) {
        super(props);
        this.state = { blockedList: [] }
    }

    componentDidMount() {
        this.populateBlockedList();
    }

    populateBlockedList() {
        chrome.declarativeNetRequest.getDynamicRules((rules) => {
            console.log(rules);
            this.setState({ blockedList: rules });
        });
    }

    render() {
        return (
            <div>
                <h1>OPTIONS PAGE</h1>
                {this.renderForm()}
                {this.renderCurrentlyBlockedUrls()}
            </div>
        )
    }

    renderForm() {
        return (
            <div>
                Url to add to block list: <input id="urlToBlock" type="text"></input>
                <button onClick={this.blockUrl}>Add</button>
            </div>
        )
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

    blockUrl() {
        var element = document.getElementById("urlToBlock");
        var urlToBlock = element.value;
        console.log(urlToBlock);

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
        var self = this;
        chrome.declarativeNetRequest.updateDynamicRules(updateRuleOptions, () => {
            self.populateBlockedList();
        });
    }

    renderCurrentlyBlockedUrls() {
        return (
            <div>
                <h3>Currently blocked URLs:</h3>
                <ul>
                    {this.state.blockedList.map(rule =>
                        <li>{rule.condition.urlFilter}</li>
                    )}
                </ul>
            </div>
        );
    }
}