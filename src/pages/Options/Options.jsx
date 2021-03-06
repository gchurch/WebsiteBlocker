/*global chrome*/
import React, { Component } from 'react';
import './Options.css';
import Rule from './Rule';
import Form from './Form';

export default class Options extends Component {

    constructor(props) {
        super(props);
        this.state = {
            urlBlockingRules: [],
            numberOfBlockedWebsites: 0
        }

        this.blockUrl = this.blockUrl.bind(this);
        this.unblockUrl = this.unblockUrl.bind(this);

        this.rulesUpdateInterval = null;
    }

    componentDidMount() {
        this.updateBlockingInformation();
        this.regularlyUpdateBlockingInformation();
    }

    regularlyUpdateBlockingInformation() {
        this.rulesUpdateInterval = setInterval(() => {
            this.updateBlockingInformation();
        }, 5000);
    }

    updateBlockingInformation() {
        this.updateUrlBlockingRules();
        this.updateNumberOfBlockedWebsites();
    }

    updateUrlBlockingRules() {
        chrome.declarativeNetRequest.getDynamicRules(
            (rules) => {
                this.setState({ urlBlockingRules: rules });
            }
        );
    }

    updateNumberOfBlockedWebsites() {
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
                <main>
                    <Form onAddingUrl={this.blockUrl.bind(this)} />
                    {this.renderBlockedUrlsList()}
                    {this.renderRatingLink()}
                </main>
            </div>
        );
    }

    blockUrl(urlToBlock) {
        var uniqueId = this.createUniqueIdForRule();
        var updateRuleOptions = this.createUpdateRuleOptionsToBlockUrl(urlToBlock, uniqueId);

        chrome.declarativeNetRequest.updateDynamicRules(updateRuleOptions, () => {
            this.updateBlockingInformation();
            this.saveTimeOfBlockingToStorage(uniqueId);
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

    saveTimeOfBlockingToStorage(ruleId) {
        var timeNow = new Date().getTime();
        const key = ruleId.toString();
        chrome.storage.sync.set({ [key]: timeNow });
    }

    renderBlockedUrlsList() {
        return (
            <div>
                <h3>Currently blocking {this.state.numberOfBlockedWebsites} Website(s):</h3>
                <table>
                    <tbody>
                        <tr>
                            <th>Website</th>
                            <th>Time since blocked</th>
                            <th>Remove</th>
                        </tr>
                        {this.state.urlBlockingRules.map(rule =>
                            <Rule key={rule.id} rule={rule} onButtonClick={this.unblockUrl.bind(this, rule)} />
                        )}
                    </tbody>
                </table>
            </div>
        );
    }

    unblockUrl(rule) {
        var confirmation = confirm("Are you sure that you want to unblock " + rule.condition.urlFilter + "?");
        if (confirmation == true) {
            var updateRuleOptions = {
                removeRuleIds: [rule.id],
                addRules: []
            }
            chrome.declarativeNetRequest.updateDynamicRules(updateRuleOptions, () => {
                this.updateBlockingInformation();
                chrome.storage.sync.remove(rule.id.toString());
            });
        }
    }

    renderRatingLink() {
        return (
            <div id="ratingDiv">
                <a id="ratingLink" href="https://chrome.google.com/webstore/detail/website-blocker/pohdmcmfjhjnocjjhoobmhbgonebakad/reviews" target="_blank">Leave a rating</a>
            </div>
        )
    }

    componentWillUnmount() {
        if (this.timeUpdateInterval) {
            clearInterval(this.rulesUpdateInterval);
        }
    }
}