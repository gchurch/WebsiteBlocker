/*global chrome*/
import React, { Component } from 'react';
import './css/Form.css';

export default class Form extends Component {

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.clearFromTimeInput();
        this.clearToTimeInput();
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        URL to block: <input id="urlToBlock" type="text" placeholder="example.com" required pattern=".+[.].+"></input>
                    </div>
                    <div>
                        From <input id="fromTime" type="time"></input>
                        To <input id="toTime" type="time"></input>
                    </div>
                    <div>
                        <button type="submit">Add</button>
                    </div>
                </form>
            </div>
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        var urlToBlock = this.getUrlFromTextField();
        var fromTime = this.getFromTimeFromInput();
        var toTime = this.getToTimeFromInput();
        var blockingInfo = {
            url: urlToBlock,
            fromTime: fromTime,
            toTime: toTime,
        };
        this.props.onAddingUrl(blockingInfo);
        this.clearTextField();
        this.clearFromTimeInput();
        this.clearToTimeInput();
    }

    getUrlFromTextField() {
        var inputElement = document.getElementById("urlToBlock");
        var urlToBlock = inputElement.value;
        return urlToBlock;
    }

    getFromTimeFromInput() {
        var inputElement = document.getElementById("fromTime");
        var fromTime = inputElement.value;
        return fromTime;
    }

    getToTimeFromInput() {
        var inputElement = document.getElementById("toTime");
        var toTime = inputElement.value;
        return toTime;
    }

    clearTextField() {
        var inputElement = document.getElementById("urlToBlock");
        inputElement.value = "";
    }

    clearFromTimeInput() {
        var inputElement = document.getElementById("fromTime");
        inputElement.value = "00:00";
    }

    clearToTimeInput() {
        var inputElement = document.getElementById("toTime");
        inputElement.value = "00:00";
    }
}