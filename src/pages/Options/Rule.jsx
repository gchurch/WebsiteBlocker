/*global chrome*/
import React, { Component } from 'react';
import './Options.css';

export default class Rule extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <tr key={this.props.ruleId}>
                <td>{this.props.urlFilter}</td>
                <td>{this.renderTimeSinceUrlWasBlocked(this.props.ruleId)}</td>
                <td><button onClick={() => this.props.onButtonClick()}><i className="fa fa-trash-o"></i></button></td>
            </tr>
        )
    }

    renderTimeSinceUrlWasBlocked(ruleId) {
        var timeDifference = this.calcuateTimeSinceUrlWasBlocked(ruleId);
        var numDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        var numHours = Math.floor(timeDifference / (1000 * 60 * 60)) % 24;
        var numMinutes = Math.floor(timeDifference / (1000 * 60)) % 60;
        var timeString = numDays + " day(s) " + numHours + " hour(s) " + numMinutes + " min(s)";
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

}