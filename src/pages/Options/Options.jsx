/*global chrome*/
import React, { Component } from 'react';
import './Options.css';
import Rule from './Rule';
import Form from './Form';

export default class Options extends Component {

    constructor(props) {
        super(props);
        this.state = { urlBlockingRules: [] }

        this.blockUrl = this.blockUrl.bind(this);
        this.unblockUrl = this.unblockUrl.bind(this);

        this.rulesUpdateInterval = null;
    }

    componentDidMount() {
        this.updateUrlBlockingRules();
        this.regularlyUpdateUrlBlockingRules();
    }

    regularlyUpdateUrlBlockingRules() {
        this.rulesUpdateInterval = setInterval(() => {
            this.updateUrlBlockingRules();
        }, 5000);
    }

    updateUrlBlockingRules() {
        chrome.declarativeNetRequest.getDynamicRules(
            (rules) => {
                this.setState({ urlBlockingRules: rules });
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
            this.updateUrlBlockingRules();
            this.saveTimeOfBlockingToLocalStorage(uniqueId);
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

    saveTimeOfBlockingToLocalStorage(ruleId) {
        var timeNow = new Date().getTime();
        localStorage.setItem(ruleId, timeNow);
    }

    renderBlockedUrlsList() {
        return (
            <div>
                <h3>Blocked Websites:</h3>
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
        var confirmation = confirm("Are you sure you want to unblock " + rule.condition.urlFilter + " ?");
        if (confirmation == true) {
            var updateRuleOptions = {
                removeRuleIds: [rule.id],
                addRules: []
            }
            chrome.declarativeNetRequest.updateDynamicRules(updateRuleOptions, () => {
                this.updateUrlBlockingRules();
                localStorage.removeItem(rule.id);
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