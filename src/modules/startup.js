/*\
title: $:/plugins/@tw5/y-websocket/startup.js
type: application/javascript
module-type: startup

Initialise the yjs code on node

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Export name and synchronous status
exports.name = "startup-y";
exports.platforms = ["node"];
exports.before = ["startup"];
exports.synchronous = false;

exports.startup = async function(callback) {
    const path = require("path");
    const uuid = require('uuid');
	const URL = require('url').URL;
	const WS = require('ws');

	const CONFIG_HOST_TIDDLER = "$:/config/tiddlyweb/host";
    const CONFIG_GC_ENABLED = "$:/config/yjs/gcEnabled";
    const STATUS_UUID_TIDDLER = "$:/status/UUID";

	const { uniqueNamesGenerator, adjectives, colors, animals, names } = require('unique-names-generator');
	const TiddlywikiBinding = require('y-tiddlywiki').TiddlywikiBinding;

	const BOOT_Y_CORE = "$:/boot/y-tiddlywiki-core.js";

    const getUUID = function() {
        let key =  null
        if($tw.boot.wikiInfo['uuid']) {
            key = $tw.boot.wikiInfo['uuid']
        }
        if(!key || !uuid.validate(key) || key == uuid.NIL) {
            key = uuid.v4()
            $tw.boot.wikiInfo['uuid'] = key
            // Save the tiddlywiki.info file
            const fs = require("fs");
            fs.writeFileSync(path.resolve($tw.boot.wikiPath,$tw.config.wikiInfo),JSON.stringify($tw.boot.wikiInfo,null,$tw.config.preferences.jsonSpaces),"utf8")
        }
        // Add the api key to the wiki
        $tw.wiki.addTiddler(new $tw.Tiddler({
            title: STATUS_UUID_TIDDLER,
            text: key
        }))
        return key
    };

	const key = getUUID();

    // disable gc when using snapshots!
    process.env.GC = $tw.wiki.getTiddlerText(CONFIG_GC_ENABLED,"yes") == "yes";
    // Persistence
    process.env.YPERSISTENCE = path.resolve($tw.boot.wikiPath,"./leveldb/"+key);
    // init on node
    $tw.y = require('./wsutils.cjs');
    $tw.y.uuid = key;
    // Initialize & sync the doc and providers, bind to the $tw instance
    $tw.y.wikiDoc = $tw.y.getYDoc($tw.y.uuid);
    $tw.y.wikiDoc.once('load',() => {
        $tw.y.binding = new TiddlywikiBinding($tw.y.wikiDoc,$tw,$tw.y.wikiDoc.awareness);
		// Hook into server start
		$tw.hooks.addHook("th-server-command-post-start",function(twServer,nodeServer,name) {
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

			// Setup the server functions
			let anonId = 0;

			const verifyUpgrade = (request,options) => {
				if(request.url.indexOf("wiki=") == -1) {
					return false
				}
				// Compose the state object
				var state = {};
				state.wiki = options.wiki || $tw.wiki;
				state.boot = options.boot || $tw.boot;
				state.server = options.server;
				state.ip = request.headers['x-forwarded-for'] ? request.headers['x-forwarded-for'].split(/\s*,\s*/)[0]:
					request.connection.remoteAddress;
				state.serverAddress = state.server.protocol + "://" + nodeServer.address().address + ":" + nodeServer.address().port;
				state.urlInfo = new URL(request.url,state.serverAddress);
				// Get the principals authorized to access this resource
				state.authorizationType = "readers";
				// Check whether anonymous access is granted
				state.allowAnon = state.server.isAuthorized(state.authorizationType,null);
				// Authenticate with the first active authenticator
				let fakeResponse = {
					writeHead: function(){},
					end: function(){}
				}
				if(state.server.authenticators.length > 0) {
					if(!state.server.authenticators[0].authenticateRequest(request,fakeResponse,state)) {
						// Bail if we failed (the authenticator will have -not- sent the response)
						return false;
					}	
				}
				// Authorize with the authenticated username
				if(!state.server.isAuthorized(state.authorizationType,state.authenticatedUsername)) {
					return false;
				}
				return state.urlInfo.searchParams.get("wiki") == state.boot.wikiInfo['uuid'] && state
			};

			const getUsername = (state) => {
				let name = state.authenticatedUsername
				if (!name || name == state.server.get("anon-username")) {
					name = (state.server.get("anon-username") || '') + uniqueNamesGenerator({
						dictionaries: [colors, adjectives, animals, names],
						style: 'capital',
						separator: '',
						length: 3,
						seed: anonId++
					})
				}
				return name;
			}
	
			// Init authorization function
			const authorize = (doc, conn, token) => {
				if (token.split(';')[0] !== doc.name) {
					conn.authStatus = "403 Forbidden" //Auto-terminates the websocket provider
					conn.authorized = false
				}
				try {
					let json = JSON.parse(conn.authStatus)
					conn.isReadyOnly = json["read_only"]
					conn.clientID = token.split(';')[1]
					conn.authorized = true
				} catch (err) {
					console.warn(`Error: unable to read authStatus on ws connection`)
					conn.authorized = false
				}
			}
			$tw.y.setAuthorize(authorize);
	
			// Set up the the WebSocketServer
			twServer.wss = new WS.Server({
				clientTracking: false,
				noServer: true // We roll our own Upgrade
			});
			twServer.wss.on('connection',$tw.y.setupWSConnection);
			// Handle upgrade events
			nodeServer.on('upgrade', function (request, socket, head) {
				if(request.headers.upgrade === 'websocket') {
					// Verify the client here
					let options = {};
					options.boot = $tw.boot;
					options.wiki = $tw.wiki;
					options.pathPrefix = $tw.boot.pathPrefix;
					options.server = twServer;
					let state = verifyUpgrade(request, options);
					if(state) {
						const status = JSON.stringify({
							username: getUsername(state),
							anonymous: !state.authenticatedUsername || state.authenticatedUsername == state.server.get("anon-username"),
							read_only: !state.server.isAuthorized("writers",state.authenticatedUsername),
							tiddlywiki_version: $tw.version
						});
						twServer.wss.handleUpgrade(request, socket, head, function (ws) {
							twServer.wss.emit('connection', ws, request, {docName: state.boot.wikiInfo['uuid'], authorize: true, authStatus: status});
						});
					} else {
						$tw.utils.log(`ws-server: Unauthorized Upgrade GET ${$tw.boot.origin+request.url}`);
						const status = "401 Unauthorized";
						twServer.wss.handleUpgrade(request, socket, head, function (ws) {
							twServer.wss.emit('connection', ws, request, {docName: state.urlInfo.searchParams.get("wiki"), authorize: true, authStatus: status});
						});
					}
				}
			});
			$tw.utils.log(`Multiplayer provided by @tw5/y-websocket`);
		});
        callback(null) 
    });
};
