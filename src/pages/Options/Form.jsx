/*global chrome*/
import React, { Component } from 'react';
import './Options.css';

export default class Form extends Component {

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    Website to block: <input id="urlToBlock" type="text" placeholder="example.com" required pattern=".+[.].+"></input>
                    <button type="submit">Add</button>
                </form>
            </div>
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        var urlToBlock = this.getUrlFromTextField();
        this.props.onAddingUrl(urlToBlock);
        this.clearTextField();
    }

    getUrlFromTextField() {
        var inputElement = document.getElementById("urlToBlock");
        var urlToBlock = inputElement.value;
        return urlToBlock;
    }

    clearTextField() {
        var inputElement = document.getElementById("urlToBlock");
        inputElement.value = "";
    }
}