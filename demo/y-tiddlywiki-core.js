/* eslint-env browser */

import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { WebsocketProvider } from 'y-websocket'
import { TiddlywikiBinding } from 'y-tiddlywiki'

window.addEventListener('load', () => {
    // Initialize & sync the doc and providers
    const wikiDoc = new Y.Doc($tw.y.uuid)
    wikiDoc.gc = $tw.y.gcEnabled
    wikiDoc.name = $tw.y.uuid
    $tw.y.wikiDoc = wikiDoc

    const idb = new IndexeddbPersistence(wikiDoc.name,wikiDoc)
    /** 
     * @type {{bindState: function(string,WikiDoc):void, writeState:function(string,WikiDoc):Promise<any>, provider: any}|null}
     */
    $tw.y.persistence = {
        provider: idb,
        setKey: async (key,value) => {

        },
        getKey: async (key) => {

        },
        deleteKey: async (key) => {

        }
    }
    $tw.y.persistence.provider.once('synced',() => {
        // Connect the wssession
        let host = new URL($tw.y.host);
        host.protocol = host.protocol.replace('http', 'ws');

        let serverUrl = host.origin, roomName = $tw.y.uuid, options = {
            connect: true,
            params: {"wiki": $tw.y.uuid}
        };
    
        $tw.y.session = new WebsocketProvider(serverUrl,roomName,wikiDoc,options);
        $tw.y.session.once('synced',() => {

            $tw.y.binding = new TiddlywikiBinding(wikiDoc,$tw,$tw.y.session.awareness);

            $tw.y.session.username = "Test User";
            $tw.y.session["read_only"] = false;
            $tw.y.session.anonymous = false;

            /*
            // Define user name and user name?
            // Check the quill-cursors package on how to change the way cursors are rendered
            $tw.y.session.awareness.setLocalStateField('user', {
                name: 'Typing Jimmy',
                color: 'blue'
            })
            */

            // Preload the tiddlers from the wikiDoc
            $tw.preloadTiddlers.push(...wikiDoc.getArray("tiddlers").toJSON());

            // On session sync
            $tw.boot.suppressBoot && $tw.boot.boot()
        })
    })
})