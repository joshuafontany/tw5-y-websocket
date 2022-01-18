/*\
title: $:/plugins/@tw5/y-websocket/rawmarkup-boot.js
type: application/javascript
module-type: library

Boot code that is transcluded by a rawmarkup startup tiddler

\*/
(function() {
    window.addEventListener('load', () => {debugger;
        // Initialize & sync the doc and providers
        const wikiDoc = new YCore.Y.Doc($tw.y.uuid)
        wikiDoc.gc = $tw.y.gcEnabled
        wikiDoc.name = $tw.y.uuid
        $tw.y.wikiDoc = wikiDoc
    
        const idb = new YCore.IndexeddbPersistence(wikiDoc.name,wikiDoc)
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
            const host = new URL($tw.y.host);
            host.protocol = host.protocol.replace('http', 'ws');

            const awareness = new YCore.awarenessProtocol.Awareness(wikiDoc) 
            const options = {
                authorize: true,
                authToken: `${$tw.y.uuid};${awareness.clientID}`,
                awareness: awareness,
                connect: true,
                params: {"wiki": $tw.y.uuid}
            };        
            $tw.y.session = new YCore.WebsocketProvider(host.origin,host.pathname,wikiDoc,options);

            $tw.y.session.once('synced',() => {
                $tw.y.binding = new YCore.TiddlywikiBinding(wikiDoc,$tw,$tw.y.session.awareness);    
                // Check the quill-cursors package on how to change the way cursors are rendered
                $tw.y.session.awareness.setLocalStateField('user', {
                    name: $tw.y.session.authStatus.username,
                    isReadOnly: $tw.y.session.authStatus["read_only"],
                    isAnonymous: $tw.y.session.authStatus.anonymous,
                    color: 'blue'
                })    
                // Preload the tiddlers from the wikiDoc
                $tw.preloadTiddlers.push(...wikiDoc.getArray("tiddlers").toJSON());    
                // On session sync, boot tiddlywiki
                $tw.boot.suppressBoot && $tw.boot.boot()
            })
        })
    })
})();
