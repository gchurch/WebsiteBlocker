/*global chrome*/
import React, { Component } from 'react';
import './css/Options.css';
import Rule from './Rule';
import Form from './Form';

export default class Options extends Component {

    constructor(props) {
        super(props);
        this.state = { urlBlockingRules: [] }

        this.blockUrl = this.blockUrl.bind(this);
        this.unblockUrl = this.unblockUrl.bind(this);
    }

    componentDidMount() {
        this.updateUrlBlockingRulesInState();
    }

    updateUrlBlockingRulesInState() {
        chrome.declarativeNetRequest.getDynamicRules(
            (rules) => {
                this.setState({ urlBlockingRules: rules });
                console.log("Updated blocking rules.");
            }
        );
    }

    render() {
        return (
            <div>
                <h1>Website Blocker</h1>
                <Form onAddingUrl={this.blockUrl.bind(this)} />
                {this.renderBlockedUrlsList()}
            </div>
        );
    }

    blockUrl(blockingInfo) {
        var uniqueId = this.createUniqueIdForRule();
        var updateRuleOptions = this.createUpdateRuleOptionsToBlockUrl(blockingInfo.url, uniqueId);

        console.log(blockingInfo);

        chrome.declarativeNetRequest.updateDynamicRules(updateRuleOptions, () => {
            this.updateUrlBlockingRulesInState();
            this.saveBlockingInfoToLocalStorage(uniqueId, blockingInfo);
        });
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

    saveBlockingInfoToLocalStorage(ruleId, blockingInfo) {
        var timeNow = new Date().getTime();
        blockingInfo.timeOfBlocking = timeNow;
        var stringifiedObject = JSON.stringify(blockingInfo);
        localStorage.setItem(ruleId, stringifiedObject);
    }

    renderBlockedUrlsList() {
        return (
            <div>
                <h3>Currently blocked URLs:</h3>
                <table>
                    <tbody>
                        <tr>
                            <th>URL</th>
                            <th>Blocking Time</th>
                            <th>Time since added</th>
                            <th>Remove</th>
                        </tr>
                        {this.state.urlBlockingRules.map(rule =>
                            <Rule key={rule.id} ruleId={rule.id} urlFilter={rule.condition.urlFilter} onButtonClick={this.unblockUrl.bind(this, rule.id)} />
                        )}
                    </tbody>
                </table>
            </div>
        );
    }

    unblockUrl(ruleId) {

        var updateRuleOptions = {
            removeRuleIds: [ruleId],
            addRules: []
        }

        chrome.declarativeNetRequest.updateDynamicRules(updateRuleOptions, () => {
            this.updateUrlBlockingRulesInState();
        });
    }
}