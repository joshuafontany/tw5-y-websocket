/*\
title: $:/plugins/@tw5/y-websocket/wsadaptor-node.js
type: application/javascript
module-type: syncadaptor

A sync adaptor module for synchronising Yjs websockets with the local filesystem via node.js APIs

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

function WebsocketAdaptor(options) {
	this.wiki = options.wiki;
	this.boot = options.boot || $tw.boot;
	this.logger = new $tw.utils.Logger("wsadaptor",{colour: "blue"});

	// Configure the binding
	$tw.y.binding.logger = this.logger;

	// Find all fields that use $tw.utils.parseStringArray
	$tw.y.binding.textFields = []
	$tw.utils.each($tw.Tiddler.fieldModules,(module,name) => {
		if(module.parse == $tw.utils.parseStringArray) {
			$tw.y.binding.textFields.push(name)
		}
	});

    // Setup a filesystem adaptor if required???
    if ($tw.wiki.tiddlerExists("$:/plugins/tiddlywiki/filesystem")) {
        const FileSystemAdaptor = require("$:/plugins/tiddlywiki/filesystem/filesystemadaptor.js").adaptorClass
        $tw.y.fsadaptor = new FileSystemAdaptor({boot: $tw.boot, wiki: $tw.wiki})
    }
}

WebsocketAdaptor.prototype.name = "wsadaptor";

WebsocketAdaptor.prototype.supportsLazyLoading = false;

WebsocketAdaptor.prototype.setLoggerSaveBuffer = function(loggerForSaving) {
	this.logger.setSaveBuffer(loggerForSaving);
};

WebsocketAdaptor.prototype.isReady = function() {
	return !!$tw.y.binding;
};

WebsocketAdaptor.prototype.getTiddlerInfo = function(tiddler) {
	return $tw.y.binding? $tw.y.fsadaptor.getTiddlerInfo(tiddler): null;
};

/*
Save a tiddler and invoke the callback with (err,adaptorInfo,revision)
*/
WebsocketAdaptor.prototype.saveTiddler = function(tiddler,callback,options) {
    $tw.y.binding.save(tiddler,(err) => {
		if (err) {
			return callback(err);
		} else if(!!$tw.y.fsadaptor) {
			return $tw.y.fsadaptor.saveTiddler(tiddler,callback,options)
		} else {
			return callback(null)
		}
	},options)
};

/*
Load a tiddler and invoke the callback with (err,tiddlerFields)

We don't need to implement loading for the file system adaptor, because all the tiddler files 
will have been loaded during the boot process, and all updates to thw WikiDoc are pushed to the wiki.
But we still need to support syncer.enqueueLoadTiddler().
*/
WebsocketAdaptor.prototype.loadTiddler = function(title,callback) {
    $tw.y.binding.load(title,callback);
};

/*
Delete a tiddler and invoke the callback with (err)
*/
WebsocketAdaptor.prototype.deleteTiddler = function(title,callback,options) {
    $tw.y.binding.delete(title,(err) => {
		if (err) {
			return callback(err);
		} else if(!!$tw.y.fsadaptor) {
			return $tw.y.fsadaptor.deleteTiddler(title,callback,options)
		} else {
			return callback(null)
		}
	},options);
};

if($tw.node) {
	exports.adaptorClass = WebsocketAdaptor;
}
