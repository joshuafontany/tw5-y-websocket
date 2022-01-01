/*\
title: $:/plugins/@tw5/y-websocket/rawmarkup-boot.js
type: application/javascript
module-type: library

Boot code that is transcluded by a rawmarkup startup tiddler

\*/
(function() {
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
        $tw.y.persistence.provider.on('synced',() => {
            // Connect the wssession
            let host = new URL($tw.y.host);
            host.protocol = url.protocol.replace('http', 'ws');

            let serverUrl = host.origin, roomName = host.pathName, options = {
                connect: true,
                params: {"wiki": $tw.y.uuid}
            };

            $tw.y.session = new WebsocketProvider(serverUrl,roomName,wikiDoc,options);
            $tw.y.session.on('synced',() => {

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

                // On session sync
                $tw.boot.suppressBoot && $tw.boot.boot($tw)
            })
        })
      })
})();
