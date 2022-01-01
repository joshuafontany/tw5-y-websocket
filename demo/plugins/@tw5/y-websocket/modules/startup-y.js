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

// disable gc when using snapshots!
$tw.y = {
    binding: null,
    uuid: null,
    wikiDoc: null
}

const STATUS_UUID_TIDDLER = "$:/status/UUID";

exports.startup = async function(callback) {
    const path = require("path");
    const uuid = require('uuid');

    const getUUID = function() {
        let key =  null
        if($tw.boot.wikiInfo['yjs-uuid']) {
            key = $tw.boot.wikiInfo['yjs-uuid']
        }
        if(!key || !uuid.validate(uuid) || key == uuid.NIL) {
            key = uuid.v4()
            $tw.boot.wikiInfo['yjs-uuid'] = key
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
    // uuid the wiki
    $tw.y.uuid = getUUID();
    
    // disable gc when using snapshots!
    process.env.GC = $tw.wiki.getTiddlerText("$:/config/yjs/gcEnabled","yes") == "yes";
    // Persistence
    process.env.YPERSISTENCE = path.resolve($tw.boot.wikiPath,"./leveldb/"+$tw.y.uuid);
    const WSUtils = require('y-websocket/bin/utils');
    const TiddlywikiBinding = require('y-tiddlywiki').TiddlywikiBinding;
    
    // Initialize & sync the doc and providers, bind to the $tw instance
    $tw.y.wikiDoc = await WSUtils.getYDoc($tw.y.uuid);
    $tw.y.binding = new TiddlywikiBinding($tw.y.wikiDoc,$tw,null);

    callback(null) 
};
