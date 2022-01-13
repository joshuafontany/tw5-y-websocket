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

exports.startup = function () {
	const WebSocketServer = require('./wsserver.js').WebSocketServer;
	const CONFIG_HOST_TIDDLER = "$:/config/tiddlyweb/host";
	const BOOT_Y_CORE = "$:/boot/y-tiddlywiki-core.js";

	$tw.hooks.addHook("th-server-command-post-start",function(simpleServer,nodeServer,name) {
		// Setup the config tiddler. For backwards compatibility we use $:/config/tiddlyweb/host
		let config = $tw.wiki.getTiddler(CONFIG_HOST_TIDDLER),
		newFields = {
			title: CONFIG_HOST_TIDDLER,
			text: `${$tw.boot.origin + $tw.boot.pathPrefix}/`
		};
		$tw.wiki.addTiddler(new $tw.Tiddler(config,newFields));

		// Unpack the BOOT_Y_CORE tiddler from a shadow to a regular tiddler, so it can be included in the html template
		$tw.wiki.addTiddler($tw.wiki.getTiddler(BOOT_Y_CORE));

		// Compare all loaded tiddlers with the current wikiDoc tiddlers
		$tw.y.binding.updateWikiDoc($tw);

		// Init authorization function
		const authorize = (doc, conn, token) => {
			if (doc.name !== token) {
				conn.authStatus = "403 Forbidden" //Auto-terminates the websocket provider
				conn.authorized = false
			}
			try {
				let json = JSON.parse(conn.authStatus)
				conn.isReadyOnly = json["read_only"]
				conn.authorized = true
			} catch (err) {
				console.warn(`Error: unable to read authStatus on ws connection`)
				conn.authorized = false
			}
		}
		$tw.y.setAuthorize(authorize);

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
				if(state) {
					const status = JSON.stringify({
						username: state.authenticatedUsername || state.server.get("anon-username") || "",
						anonymous: !state.authenticatedUsername,
						read_only: !state.server.isAuthorized("writers",state.authenticatedUsername),
						tiddlywiki_version: $tw.version
					});
					$tw.wsServer.handleUpgrade(request, socket, head, function (ws) {
						$tw.wsServer.emit('connection', ws, request, {docName: state.boot.wikiInfo['uuid'], authorize: true, authStatus: status});
					});
				} else {
					$tw.utils.log(`ws-server: Unauthorized Upgrade GET ${$tw.boot.origin+request.url}`);
					const status = "401 Unauthorized";
					$tw.wsServer.handleUpgrade(request, socket, head, function (ws) {
						$tw.wsServer.emit('connection', ws, request, {docName: state.urlInfo.searchParams.get("wiki"), authorize: true, authStatus: status});
					});
				}
			}
		});
		$tw.utils.log(`Multiplayer provided by @tw5/y-websocket`);
	});
};