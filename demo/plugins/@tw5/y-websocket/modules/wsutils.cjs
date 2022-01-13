'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Y = require('yjs');
var syncProtocol = require('y-protocols/dist/sync.cjs');
var authProtocol = require('y-protocols/dist/auth.cjs');
var awarenessProtocol = require('y-protocols/dist/awareness.cjs');
var encoding = require('lib0/dist/encoding.cjs');
var decoding = require('lib0/dist/decoding.cjs');
var mutex = require('lib0/dist/mutex.cjs');
var map = require('lib0/dist/map.cjs');
var debounce = require('lodash.debounce');
var http = require('http');
require('fs-extra/lib/remove/rimraf');
var require$$2 = require('y-leveldb');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Y__default = /*#__PURE__*/_interopDefaultLegacy(Y);
var syncProtocol__default = /*#__PURE__*/_interopDefaultLegacy(syncProtocol);
var authProtocol__default = /*#__PURE__*/_interopDefaultLegacy(authProtocol);
var awarenessProtocol__default = /*#__PURE__*/_interopDefaultLegacy(awarenessProtocol);
var encoding__default = /*#__PURE__*/_interopDefaultLegacy(encoding);
var decoding__default = /*#__PURE__*/_interopDefaultLegacy(decoding);
var mutex__default = /*#__PURE__*/_interopDefaultLegacy(mutex);
var map__default = /*#__PURE__*/_interopDefaultLegacy(map);
var debounce__default = /*#__PURE__*/_interopDefaultLegacy(debounce);
var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
var require$$2__default = /*#__PURE__*/_interopDefaultLegacy(require$$2);

const CALLBACK_URL = process.env.CALLBACK_URL ? new URL(process.env.CALLBACK_URL) : null;
const CALLBACK_TIMEOUT = process.env.CALLBACK_TIMEOUT || 5000;
const CALLBACK_OBJECTS = process.env.CALLBACK_OBJECTS ? JSON.parse(process.env.CALLBACK_OBJECTS) : {};

var isCallbackSet$1 = !!CALLBACK_URL;

/**
 * @param {Uint8Array} update
 * @param {any} origin
 * @param {WSSharedDoc} doc
 */
var callbackHandler$1 = (update, origin, doc) => {
  const room = doc.name;
  const dataToSend = {
    room: room,
    data: {}
  };
  const sharedObjectList = Object.keys(CALLBACK_OBJECTS);
  sharedObjectList.forEach(sharedObjectName => {
    const sharedObjectType = CALLBACK_OBJECTS[sharedObjectName];
    dataToSend.data[sharedObjectName] = {
      type: sharedObjectType,
      content: getContent(sharedObjectName, sharedObjectType, doc).toJSON()
    };
  });
  callbackRequest(CALLBACK_URL, CALLBACK_TIMEOUT, dataToSend);
};

/**
 * @param {URL} url
 * @param {number} timeout
 * @param {Object} data
 */
const callbackRequest = (url, timeout, data) => {
  data = JSON.stringify(data);
  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    timeout: timeout,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };
  const req = http__default["default"].request(options);
  req.on('timeout', () => {
    console.warn('Callback request timed out.');
    req.abort();
  });
  req.on('error', (e) => {
    console.error('Callback request error.', e);
    req.abort();
  });
  req.write(data);
  req.end();
};

/**
 * @param {string} objName
 * @param {string} objType
 * @param {WSSharedDoc} doc
 */
const getContent = (objName, objType, doc) => {
  switch (objType) {
    case 'Array': return doc.getArray(objName)
    case 'Map': return doc.getMap(objName)
    case 'Text': return doc.getText(objName)
    case 'XmlFragment': return doc.getXmlFragment(objName)
    case 'XmlElement': return doc.getXmlElement(objName)
    default : return {}
  }
};

var callback = {
	isCallbackSet: isCallbackSet$1,
	callbackHandler: callbackHandler$1
};

const callbackHandler = callback.callbackHandler;
const isCallbackSet = callback.isCallbackSet;

const CALLBACK_DEBOUNCE_WAIT = parseInt(process.env.CALLBACK_DEBOUNCE_WAIT) || 2000;
const CALLBACK_DEBOUNCE_MAXWAIT = parseInt(process.env.CALLBACK_DEBOUNCE_MAXWAIT) || 10000;

const wsReadyStateConnecting = 0;
const wsReadyStateOpen = 1;

// disable gc when using snapshots!
const gcEnabled = process.env.GC !== 'false' && process.env.GC !== '0';
const persistenceDir = process.env.YPERSISTENCE;
/**
 * @type {{bindState: function(string,WSSharedDoc):void, writeState:function(string,WSSharedDoc):Promise<any>, provider: any}|null}
 */
let persistence = null;
if (typeof persistenceDir === 'string') {
  console.info('Persisting documents to "' + persistenceDir + '"');
  // @ts-ignore
  const LeveldbPersistence = require$$2__default["default"].LeveldbPersistence;
  const ldb = new LeveldbPersistence(persistenceDir);
  persistence = {
    provider: ldb,
    bindState: async (docName, ydoc) => {
      const persistedYdoc = await ldb.getYDoc(docName);
      const newUpdates = Y__default["default"].encodeStateAsUpdate(ydoc);
      ldb.storeUpdate(docName, newUpdates);
      Y__default["default"].applyUpdate(ydoc, Y__default["default"].encodeStateAsUpdate(persistedYdoc));
      ydoc.on('update', update => {
        ldb.storeUpdate(docName, update);
      });
      ydoc.emit('load',[]);
    },
    writeState: async (docName, ydoc) => {}
  };
}

/**
 * @param {{bindState: function(string,WSSharedDoc):void,
 * writeState:function(string,WSSharedDoc):Promise<any>,provider:any}|null} persistence_
 */
var setPersistence = persistence_ => {
  persistence = persistence_;
};

/**
 * @return {null|{bindState: function(string,WSSharedDoc):void,
  * writeState:function(string,WSSharedDoc):Promise<any>}|null} used persistence layer
  */
var getPersistence = () => persistence;

// You may check/set permissions of the user here. Set the conn.isReadOnly and conn.authStatus then return a boolean.
// Set opts.authorize: true when emitting the connection to enable pre-sync auth.
/**
 * @param {any} y // Y.Doc / WSSharedDoc
 * @param {string} token // provider.authToken
 */
let authorize = (doc, conn, token) => {
  // This example sets conn.isReadOnly to false and conn.authorized to true
  conn.isReadyOnly = false;
  conn.authorized = true;
  // You can set conn.authStatus to a denied reason and conn.authorized to false
  // if (doc.name !== token) {
  //    conn.authStatus = "403 Forbidden" //Auto-terminates the websocket provider
  //    conn.authorized = false
  // }
};

/**
 * @param {function(WSSharedDoc,string):boolean} authorize_
 */
var setAuthorize = authorize_ => {
  authorize = authorize_;
};

/**
 * @return {function(WSSharedDoc,string):boolean} used persistence layer
  */
var getAuthorize = () => authorize;


/**
 * @type {Map<string,WSSharedDoc>}
 */
const docs = new Map();
// exporting docs so that others can use it
var docs_1 = docs;

const messageSync = 0;
const messageAwareness = 1;
const messageAuth = 2;

/**
 * @param {Uint8Array} update
 * @param {any} origin
 * @param {WSSharedDoc} doc
 */
const updateHandler = (update, origin, doc) => {
  const encoder = encoding__default["default"].createEncoder();
  encoding__default["default"].writeVarUint(encoder, messageSync);
  syncProtocol__default["default"].writeUpdate(encoder, update);
  const message = encoding__default["default"].toUint8Array(encoder);
  doc.conns.forEach((_, conn) => send(doc, conn, message));
};

class WSSharedDoc extends Y__default["default"].Doc {
  /**
   * @param {string} name
   */
  constructor (name) {
    super({ gc: gcEnabled });
    this.name = name;
    this.mux = mutex__default["default"].createMutex();
    /**
     * Maps from conn to set of controlled user ids. Delete all user ids from awareness when this conn is closed
     * @type {Map<Object, Set<number>>}
     */
    this.conns = new Map();
    /**
     * @type {awarenessProtocol.Awareness}
     */
    this.awareness = new awarenessProtocol__default["default"].Awareness(this);
    this.awareness.setLocalState(null);
    /**
     * @param {{ added: Array<number>, updated: Array<number>, removed: Array<number> }} changes
     * @param {Object | null} conn Origin is the connection that made the change
     */
    const awarenessChangeHandler = ({ added, updated, removed }, conn) => {
      const changedClients = added.concat(updated, removed);
      if (conn !== null) {
        const connControlledIDs = /** @type {Set<number>} */ (this.conns.get(conn));
        if (connControlledIDs !== undefined) {
          added.forEach(clientID => { connControlledIDs.add(clientID); });
          removed.forEach(clientID => { connControlledIDs.delete(clientID); });
        }
      }
      // broadcast awareness update
      const encoder = encoding__default["default"].createEncoder();
      encoding__default["default"].writeVarUint(encoder, messageAwareness);
      encoding__default["default"].writeVarUint8Array(encoder, awarenessProtocol__default["default"].encodeAwarenessUpdate(this.awareness, changedClients));
      const buff = encoding__default["default"].toUint8Array(encoder);
      this.conns.forEach((_, c) => {
        send(this, c, buff);
      });
    };
    this.awareness.on('update', awarenessChangeHandler);
    this.on('update', updateHandler);
    if (isCallbackSet) {
      this.on('update', debounce__default["default"](
        callbackHandler,
        CALLBACK_DEBOUNCE_WAIT,
        { maxWait: CALLBACK_DEBOUNCE_MAXWAIT }
      ));
    }
  }
}

/**
 * Gets a Y.Doc by name, whether in memory or on disk
 *
 * @param {string} docname - the name of the Y.Doc to find or create
 * @param {boolean} gc - whether to allow gc on the doc (applies only when created)
 * @return {WSSharedDoc}
 */
const getYDoc = (docname, gc = true) => map__default["default"].setIfUndefined(docs, docname, () => {
  const doc = new WSSharedDoc(docname);
  doc.gc = gc;
  if (persistence !== null) {
    persistence.bindState(docname, doc);
  }
  docs.set(docname, doc);
  return doc
});

var getYDoc_1 = getYDoc;

/**
 * @param {any} conn
 * @param {WSSharedDoc} doc
 * @param {Uint8Array} message
 */
const messageListener = (conn, doc, message) => {
  try {
    const encoder = encoding__default["default"].createEncoder();
    const decoder = decoding__default["default"].createDecoder(message);
    const messageType = decoding__default["default"].readVarUint(decoder);
    switch (messageType) {
      case messageSync:
        encoding__default["default"].writeVarUint(encoder, messageSync);
        syncProtocol__default["default"].readSyncMessage(decoder, encoder, doc, conn);
        if (encoding__default["default"].length(encoder) > 1) {
          send(doc, conn, encoding__default["default"].toUint8Array(encoder));
        }
        break
      case messageAwareness: {
        awarenessProtocol__default["default"].applyAwarenessUpdate(doc.awareness, decoding__default["default"].readVarUint8Array(decoder), conn);
        break
      }
      case messageAuth: {
        encoding__default["default"].writeVarUint(encoder, messageAuth);
        authProtocol__default["default"].verifyAuthMessage(decoder, doc, conn, authorize);
        if (conn.authorized) {
          authProtocol__default["default"].writePermissionApproved(encoder, conn.authStatus);
          send(doc, conn, encoding__default["default"].toUint8Array(encoder));
          sendSync(doc, conn);
        } else {
          authProtocol__default["default"].writePermissionDenied(encoder, conn.authStatus);
          conn.terminate();
        }
        break
      }
    }
  } catch (err) {
    console.error(err);
    doc.emit('error', [err]);
  }
};

/**
 * @param {WSSharedDoc} doc
 * @param {any} conn
 */
const closeConn = (doc, conn) => {
  if (doc.conns.has(conn)) {
    /**
     * @type {Set<number>}
     */
    // @ts-ignore
    const controlledIds = doc.conns.get(conn);
    doc.conns.delete(conn);
    awarenessProtocol__default["default"].removeAwarenessStates(doc.awareness, Array.from(controlledIds), null);
    if (doc.conns.size === 0 && persistence !== null) {
      // if persisted, we store state and destroy ydocument
      persistence.writeState(doc.name, doc).then(() => {
        doc.destroy();
      });
      docs.delete(doc.name);
    }
  }
  conn.close();
};

/**
 * @param {WSSharedDoc} doc
 * @param {any} conn
 * @param {Uint8Array} m
 */
const send = (doc, conn, m) => {
  if (conn.readyState !== wsReadyStateConnecting && conn.readyState !== wsReadyStateOpen) {
    closeConn(doc, conn);
  }
  try {
    conn.send(m, /** @param {any} err */ err => { err != null && closeConn(doc, conn); });
  } catch (e) {
    closeConn(doc, conn);
  }
};

/**
 * @param {WSSharedDoc} doc
 * @param {any} conn
 */
const sendSync = (doc, conn) =>{
  // send sync step 1
  const encoder = encoding__default["default"].createEncoder();
  encoding__default["default"].writeVarUint(encoder, messageSync);
  syncProtocol__default["default"].writeSyncStep1(encoder, doc);
  send(doc, conn, encoding__default["default"].toUint8Array(encoder));
  const awarenessStates = doc.awareness.getStates();
  if (awarenessStates.size > 0) {
    const encoder = encoding__default["default"].createEncoder();
    encoding__default["default"].writeVarUint(encoder, messageAwareness);
    encoding__default["default"].writeVarUint8Array(encoder, awarenessProtocol__default["default"].encodeAwarenessUpdate(doc.awareness, Array.from(awarenessStates.keys())));
    send(doc, conn, encoding__default["default"].toUint8Array(encoder));
  }
};

const pingTimeout = 30000;

/**
 * @param {any} conn
 * @param {any} req
 * @param {any} opts
 */
var setupWSConnection = (conn, req, { docName = req.url.slice(1).split('?')[0], gc = true, authorize = false, authStatus = "" } = {}) => {
  conn.authorized = !authorize;
  conn.authStatus = authStatus;
  conn.isReadOnly = false;
  conn.binaryType = 'arraybuffer';
  // get doc, initialize if it does not exist yet
  const doc = getYDoc(docName, gc);
  doc.conns.set(conn, new Set());
  // listen and reply to events
  conn.on('message', /** @param {ArrayBuffer} message */ message => messageListener(conn, doc, new Uint8Array(message)));

  // Check if connection is still alive
  let pongReceived = true;
  const pingInterval = setInterval(() => {
    if (!pongReceived) {
      if (doc.conns.has(conn)) {
        closeConn(doc, conn);
      }
      clearInterval(pingInterval);
    } else if (doc.conns.has(conn)) {
      pongReceived = false;
      try {
        conn.ping();
      } catch (e) {
        closeConn(doc, conn);
        clearInterval(pingInterval);
      }
    }
  }, pingTimeout);
  conn.on('close', () => {
    closeConn(doc, conn);
    clearInterval(pingInterval);
  });
  conn.on('pong', () => {
    pongReceived = true;
  });
  // If pre-authorized then sync, else wait for the auth handshake
  if(conn.authorized){
    sendSync(doc, conn);
  }
};

var utils = {
	setPersistence: setPersistence,
	getPersistence: getPersistence,
	setAuthorize: setAuthorize,
	getAuthorize: getAuthorize,
	docs: docs_1,
	getYDoc: getYDoc_1,
	setupWSConnection: setupWSConnection
};

exports["default"] = utils;
exports.docs = docs_1;
exports.getAuthorize = getAuthorize;
exports.getPersistence = getPersistence;
exports.getYDoc = getYDoc_1;
exports.setAuthorize = setAuthorize;
exports.setPersistence = setPersistence;
exports.setupWSConnection = setupWSConnection;
//# sourceMappingURL=wsutils.cjs.map
