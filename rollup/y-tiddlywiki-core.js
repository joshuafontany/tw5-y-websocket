/* eslint-env browser */

import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { TiddlywikiBinding } from 'y-tiddlywiki'
import { WebsocketProvider } from 'y-websocket'
import  * as awarenessProtocol from 'y-protocols/awareness'

export { Y, IndexeddbPersistence, TiddlywikiBinding, WebsocketProvider, awarenessProtocol }