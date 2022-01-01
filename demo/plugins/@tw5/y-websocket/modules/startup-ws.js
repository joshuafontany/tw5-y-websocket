/*\
title: $:/plugins/@tw5/y-websocket/startup-ws.js
type: application/javascript
module-type: startup

Hook into `th-server-command-post-start` to start the websocket server

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Export name and synchronous status
exports.name = "startup-ws";
exports.platforms = ["node"];
exports.after = ["startup-y"];
exports.before = ["startup"];
exports.synchronous = true;

const WebSocketServer = require('./wsserver.js').WebSocketServer;

const CONFIG_HOST_TIDDLER = "$:/config/tiddlyweb/host";

exports.startup = function () {
	$tw.hooks.addHook("th-server-command-post-start",function(simpleServer,nodeServer,name) {
		// Setup the config tiddler. For backwards compatibility we use $:/config/tiddlyweb/host
		let config = $tw.wiki.getTiddler(CONFIG_HOST_TIDDLER),
		newFields = {
			title: CONFIG_HOST_TIDDLER,
			text: `${$tw.boot.origin + $tw.boot.pathPrefix}/`
		};
		$tw.wiki.addTiddler(new $tw.Tiddler(config,newFields));
		
		$tw.y.binding.updateWikiDoc($tw);

		// Set up the the WebSocketServer
		$tw.wsServer = new WebSocketServer({
			clientTracking: false,
			noServer: true, // We roll our own Upgrade
			httpServer: nodeServer
		});
		// Handle upgrade events
		nodeServer.on('upgrade', function (request, socket, head) {
			if(request.headers.upgrade === 'websocket') {
				// Verify the client here
				let options = {};
				options.boot = $tw.boot;
				options.wiki = $tw.wiki;
				options.pathPrefix = $tw.boot.pathPrefix;
				options.server = simpleServer;
				let state = $tw.wsServer.verifyUpgrade(request, options);
				$tw.wsServer.handleUpgrade(request, socket, head, function (ws) {
					$tw.wsServer.emit('connection', ws, request, state);
				});
			}
		});
		$tw.utils.log(`Multiplayer provided by @tw5/y-websocket`);
	});
};