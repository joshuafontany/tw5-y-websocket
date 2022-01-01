/*\
title: $:/plugins/@tw5/y-websocket/wsadaptor-browser.js
type: application/javascript
module-type: syncadaptor

A sync adaptor for syncing changes from/to a browser using Yjs websockets

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

const CONFIG_HOST_TIDDLER = "$:/config/tiddlyweb/host",
	DEFAULT_HOST_TIDDLER = "$protocol$//$host$/";

function WebsocketAdaptor(options) {
	this.wiki = options.wiki;
	this.host = this.getHost();
	this.logger = new $tw.utils.Logger("wsadaptor");

	this.hasStatus = false;
	this.isLoggedIn = false;
	this.isReadOnly = false;
	this.isAnonymous = true;

	// Configure the binding
	$tw.y.binding.logger = this.logger;

	// Find all fields that use $tw.utils.parseStringArray
	$tw.y.binding.textFields = []
	$tw.utils.each($tw.Tiddler.fieldModules,(module,name) => {
		if(module.parse == $tw.utils.parseStringArray) {
			$tw.y.binding.textFields.push(name)
		}
	});
}

// Syncadaptor properties

// REQUIRED
// The name of the syncadaptor
WebsocketAdaptor.prototype.name = "wsadaptor";

WebsocketAdaptor.prototype.supportsLazyLoading = true;

WebsocketAdaptor.prototype.setLoggerSaveBuffer = function(loggerForSaving) {
	this.logger.setSaveBuffer(loggerForSaving);
};

WebsocketAdaptor.prototype.isReady = function() {
	return this.session && this.session.isReady();
}

WebsocketAdaptor.prototype.getTiddlerInfo = function(tiddler) {
	/* 
		Return the vector clock of the tiddler?
	*/
	return null;
}

WebsocketAdaptor.prototype.getHost = function() {
	let text = this.wiki.getTiddlerText(CONFIG_HOST_TIDDLER,DEFAULT_HOST_TIDDLER),
		substitutions = [
			{name: "protocol", value: document.location.protocol},
			{name: "host", value: document.location.host}
		];
	for(let t=0; t<substitutions.length; t++) {
		let s = substitutions[t];
		text = $tw.utils.replaceString(text,new RegExp("\\$" + s.name + "\\$","mg"),s.value);
	}
	return text;
}

/*
Get the current status of the user
*/
WebsocketAdaptor.prototype.getStatus = function(callback) {
	this.logger.log("Getting status");
	// Get status
	if($tw.y.session.isReady()) {
		this.hasStatus = true;
		this.logger.log("Status:",$tw.y.session.toJSON());
		// Check if we're logged in
		this.isLoggedIn = !!$tw.y.session.username;
		this.isReadOnly = !!$tw.y.session["read_only"];
		this.isAnonymous = !!$tw.y.session.anonymous;
	}
	// Invoke the callback if present
	if(callback) {
		// Invoke the callback if present
		return callback(null,this.isLoggedIn,$tw.y.session.username,this.isReadOnly,this.isAnonymous);
	}	
};

/*
Return all updated tiddlers the first time it is called, then null (updates from the Yjs binding are automatically enqueued)
*/
WebsocketAdaptor.prototype.getUpdatedTiddlers = function(syncer,callback) {
	// Updates are real-time
	callback(null,{
		modifications: [],
		deletions: []
	});
}

/*
Save a tiddler and invoke the callback with (err,adaptorInfo,revision)
*/
WebsocketAdaptor.prototype.saveTiddler = function(tiddler,callback,options) {
	$tw.y.binding.save(tiddler,callback,options);
}

/*
Load a tiddler and invoke the callback with (err,tiddlerFields)

We do need to implement loading for the ws adaptor, because readOnly users shouldn't be able to change the wikistate.
*/
WebsocketAdaptor.prototype.loadTiddler = function(title,callback) {
	$tw.y.binding.load(title,callback);
};

/*
Delete a tiddler and invoke the callback with (err)
*/
WebsocketAdaptor.prototype.deleteTiddler = function(title,callback,options) {
	$tw.y.binding.delete(title,callback,options);
}

if($tw.browser) {
	exports.adaptorClass = WebsocketAdaptor
}
