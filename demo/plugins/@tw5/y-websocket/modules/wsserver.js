/*\
title: $:/plugins/@tw5/y-websocket/wsserver.js
type: application/javascript
module-type: library


\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

if($tw.node) {
	const { uniqueNamesGenerator, adjectives, colors, animals, names } = require('unique-names-generator');
	const URL = require('url').URL;
	const WS = require('ws');

/*
	A simple websocket server extending the `ws` library
	options: 
*/
function WebSocketServer(options) {
	Object.assign(this, new WS.Server(options));
	// Setup the httpServer
	this.httpServer = options.httpServer || null;
	// Users
	this.anonId = 0; // Incremented when an anonymous userid is created
	// Set the event handlers
	this.on('listening',this.serverOpened);
	this.on('close',this.serverClosed);
	this.on('connection',$tw.y.setupWSConnection);
}

WebSocketServer.prototype = Object.create(WS.Server.prototype);
WebSocketServer.prototype.constructor = WebSocketServer;

WebSocketServer.prototype.defaultVariables = {

};

WebSocketServer.prototype.serverOpened = function() {

}

WebSocketServer.prototype.serverClosed = function() {

}



/*
	User methods
*/
WebSocketServer.prototype.getAnonUsername = function(state) {
	// Query the request state server for the anon username parameter
	let anon = state.server.get("anon-username")
	return (anon || '') + uniqueNamesGenerator({
		dictionaries: [colors, adjectives, animals, names],
		style: 'capital',
		separator: '',
		length: 3,
		seed: this.anonId++
	});
}

/*
	Session methods
*/

WebSocketServer.prototype.getSessionsByUser = function(username) {
	let usersSessions = new Map();
	for (let [id,session] of this.sessions.entries()) {
		if(session.username === username) {
			usersSessions.add(id,session);
		}
	}
	return usersSessions;
}


exports.WebSocketServer = WebSocketServer;

}
