/*global chrome*/
import React, { Component } from 'react';
import './Options.css';

export default class Rule extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <tr>
                <td>{this.props.urlFilter}</td>
                <td>{this.renderTimeSinceUrlWasBlocked()}</td>
                <td><button onClick={() => this.props.onButtonClick()}><i className="fa fa-trash-o"></i></button></td>
            </tr>
        )
    }

    renderTimeSinceUrlWasBlocked() {
        var timeDifference = this.calcuateTimeSinceUrlWasBlocked(this.props.ruleId);
        var numDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        var numHours = Math.floor(timeDifference / (1000 * 60 * 60)) % 24;
        var numMinutes = Math.floor(timeDifference / (1000 * 60)) % 60;
        var timeString = numDays + " day(s) " + numHours + " hour(s) " + numMinutes + " min(s)";
        return timeString;
    }

    calcuateTimeSinceUrlWasBlocked() {
        var timeNow = new Date().getTime();
        var timeOfBlocking = this.loadTimeOfBlockingFromLocalStorage(this.props.ruleId);
        var timeDifference = timeNow - timeOfBlocking;
        return timeDifference;
    }

    loadTimeOfBlockingFromLocalStorage() {
        var timeOfBlocking = localStorage.getItem(this.props.ruleId);
        return timeOfBlocking;
    }

}