/*\
title: $:/plugins/@tw5/y-websocket/startup-y.js
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
    const TiddlywikiBinding = require('$:/library/y-tiddlywiki-core.js').TiddlywikiBinding;
    const CONFIG_GC_ENABLED = "$:/config/yjs/gcEnabled";
    const STATUS_UUID_TIDDLER = "$:/status/UUID";

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
    $tw.y = require('$:/library/y-tiddlywiki-core.js').WSUtils;
    $tw.y.uuid = key;
    // Initialize & sync the doc and providers, bind to the $tw instance
    $tw.y.wikiDoc = $tw.y.getYDoc($tw.y.uuid);
    $tw.y.wikiDoc.once('load',() => {
        $tw.y.binding = new TiddlywikiBinding($tw.y.wikiDoc,$tw,$tw.y.wikiDoc.awareness);
        callback(null) 
    });
};
