/*global chrome*/
import React, { Component } from 'react';
import './Options.css';

export default class Rule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            timeSinceBlocking: 0
        }
        this.timeUpdateInterval = null;
    }

    componentDidMount() {
        this.updateTimeSinceUrlWasBlocked();
        this.regularlyUpdateTimeSinceBlocked();
    }

    regularlyUpdateTimeSinceBlocked() {
        this.timeUpdateInterval = setInterval(() => {
            this.updateTimeSinceUrlWasBlocked();
        }, 5000);
    }

    updateTimeSinceUrlWasBlocked() {
        var key = this.props.rule.id.toString();
        var timeNow = new Date().getTime();
        chrome.storage.sync.get(key, (data) => {
            // If there is no time saved for this id then save the current time.
            if (data[key] == null) {
                chrome.storage.sync.set({ [key]: timeNow });
            }
            else {
                var timeOfBlocking = data[key];
                var timeDifference = timeNow - timeOfBlocking;
                this.setState({ timeSinceBlocking: timeDifference });
            }
        });
    }

    render() {
        return (
            <tr>
                <td>{this.props.rule.condition.urlFilter}</td>
                <td>{this.renderTimeSinceUrlWasBlocked()}</td>
                <td><button onClick={() => this.props.onButtonClick()}><i className="fa fa-trash-o"></i></button></td>
            </tr>
        )
    }

    renderTimeSinceUrlWasBlocked() {
        var timeDifference = this.state.timeSinceBlocking;
        var numDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        var numHours = Math.floor(timeDifference / (1000 * 60 * 60)) % 24;
        var numMinutes = Math.floor(timeDifference / (1000 * 60)) % 60;
        var timeString = numDays + " day(s) " + numHours + " hour(s) " + numMinutes + " min(s)";
        return timeString;
    }

    componentWillUnmount() {
        if (this.timeUpdateInterval) {
            clearInterval(this.timeUpdateInterval);
        }
    }
}