/*global chrome*/
import React, { Component } from 'react';
import './css/Rule.css';

export default class Rule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            timeSinceBlocking: 0
        }
    }

    componentDidMount() {
        this.calculateTimeSinceUrlWasBlocked();
        this.regularlyUpdateTimeSinceBlocked();
    }

    regularlyUpdateTimeSinceBlocked() {
        setInterval(() => {
            this.calculateTimeSinceUrlWasBlocked();
        }, 60000);
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
        var timeDifference = this.state.timeSinceBlocking;
        var numDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        var numHours = Math.floor(timeDifference / (1000 * 60 * 60)) % 24;
        var numMinutes = Math.floor(timeDifference / (1000 * 60)) % 60;
        var timeString = numDays + " day(s) " + numHours + " hour(s) " + numMinutes + " min(s)";
        return timeString;
    }

    calculateTimeSinceUrlWasBlocked() {
        var timeNow = new Date().getTime();
        var timeOfBlocking = this.loadTimeOfBlockingFromLocalStorage(this.props.ruleId);
        var timeDifference = timeNow - timeOfBlocking;
        this.setState({ timeSinceBlocking: timeDifference });
    }

    loadTimeOfBlockingFromLocalStorage() {
        var timeOfBlocking = localStorage.getItem(this.props.ruleId);
        return timeOfBlocking;
    }

}