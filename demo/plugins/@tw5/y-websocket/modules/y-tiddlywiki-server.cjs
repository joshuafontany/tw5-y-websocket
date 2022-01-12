'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var require$$0$3 = require('events');
var require$$1 = require('util');
var require$$0$2 = require('buffer');
var assert$1 = require('assert');
var require$$0$4 = require('perf_hooks');
var require$$1$1 = require('crypto');
var http = require('http');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var require$$0__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$0$3);
var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);
var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0$2);
var assert__default = /*#__PURE__*/_interopDefaultLegacy(assert$1);
var require$$0__default$2 = /*#__PURE__*/_interopDefaultLegacy(require$$0$4);
var require$$1__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$1$1);
var http__default = /*#__PURE__*/_interopDefaultLegacy(http);

/**
 * Utility module to work with key-value stores.
 *
 * @module map
 */

/**
 * Creates a new Map instance.
 *
 * @function
 * @return {Map<any, any>}
 *
 * @function
 */
const create$j = () => new Map();

/**
 * Copy a Map object into a fresh Map object.
 *
 * @function
 * @template X,Y
 * @param {Map<X,Y>} m
 * @return {Map<X,Y>}
 */
const copy$4 = m => {
  const r = create$j();
  m.forEach((v, k) => { r.set(k, v); });
  return r
};

/**
 * Get map property. Create T if property is undefined and set T on map.
 *
 * ```js
 * const listeners = map.setIfUndefined(events, 'eventName', set.create)
 * listeners.add(listener)
 * ```
 *
 * @function
 * @template T,K
 * @param {Map<K, T>} map
 * @param {K} key
 * @param {function():T} createT
 * @return {T}
 */
const setIfUndefined$2 = (map, key, createT) => {
  let set = map.get(key);
  if (set === undefined) {
    map.set(key, set = createT());
  }
  return set
};

/**
 * Creates an Array and populates it with the content of all key-value pairs using the `f(value, key)` function.
 *
 * @function
 * @template K
 * @template V
 * @template R
 * @param {Map<K,V>} m
 * @param {function(V,K):R} f
 * @return {Array<R>}
 */
const map$6 = (m, f) => {
  const res = [];
  for (const [key, value] of m) {
    res.push(f(value, key));
  }
  return res
};

/**
 * Tests whether any key-value pairs pass the test implemented by `f(value, key)`.
 *
 * @todo should rename to some - similarly to Array.some
 *
 * @function
 * @template K
 * @template V
 * @param {Map<K,V>} m
 * @param {function(V,K):boolean} f
 * @return {boolean}
 */
const any$2 = (m, f) => {
  for (const [key, value] of m) {
    if (f(value, key)) {
      return true
    }
  }
  return false
};

/**
 * Utility module to work with sets.
 *
 * @module set
 */

const create$i = () => new Set();

/**
 * Utility module to work with Arrays.
 *
 * @module array
 */

/**
 * Return the last element of an array. The element must exist
 *
 * @template L
 * @param {Array<L>} arr
 * @return {L}
 */
const last$2 = arr => arr[arr.length - 1];

/**
 * Append elements from src to dest
 *
 * @template M
 * @param {Array<M>} dest
 * @param {Array<M>} src
 */
const appendTo$2 = (dest, src) => {
  for (let i = 0; i < src.length; i++) {
    dest.push(src[i]);
  }
};

/**
 * Transforms something array-like to an actual Array.
 *
 * @function
 * @template T
 * @param {ArrayLike<T>|Iterable<T>} arraylike
 * @return {T}
 */
const from$3 = Array.from;

/**
 * Observable class prototype.
 *
 * @module observable
 */

/**
 * Handles named events.
 *
 * @template N
 */
class Observable$1 {
  constructor () {
    /**
     * Some desc.
     * @type {Map<N, any>}
     */
    this._observers = create$j();
  }

  /**
   * @param {N} name
   * @param {function} f
   */
  on (name, f) {
    setIfUndefined$2(this._observers, name, create$i).add(f);
  }

  /**
   * @param {N} name
   * @param {function} f
   */
  once (name, f) {
    /**
     * @param  {...any} args
     */
    const _f = (...args) => {
      this.off(name, _f);
      f(...args);
    };
    this.on(name, _f);
  }

  /**
   * @param {N} name
   * @param {function} f
   */
  off (name, f) {
    const observers = this._observers.get(name);
    if (observers !== undefined) {
      observers.delete(f);
      if (observers.size === 0) {
        this._observers.delete(name);
      }
    }
  }

  /**
   * Emit a named event. All registered event listeners that listen to the
   * specified name will receive the event.
   *
   * @todo This should catch exceptions
   *
   * @param {N} name The event name.
   * @param {Array<any>} args The arguments that are applied to the event listener.
   */
  emit (name, args) {
    // copy all listeners to an array first to make sure that no event is emitted to listeners that are subscribed while the event handler is called.
    return from$3((this._observers.get(name) || create$j()).values()).forEach(f => f(...args))
  }

  destroy () {
    this._observers = create$j();
  }
}

/**
 * Common Math expressions.
 *
 * @module math
 */

const floor$2 = Math.floor;
const abs$2 = Math.abs;

/**
 * @function
 * @param {number} a
 * @param {number} b
 * @return {number} The smaller element of a and b
 */
const min$2 = (a, b) => a < b ? a : b;

/**
 * @function
 * @param {number} a
 * @param {number} b
 * @return {number} The bigger element of a and b
 */
const max$2 = (a, b) => a > b ? a : b;

/**
 * @param {number} n
 * @return {boolean} Wether n is negative. This function also differentiates between -0 and +0
 */
const isNegativeZero$2 = n => n !== 0 ? n < 0 : 1 / n < 0;

/**
 * Utility module to work with strings.
 *
 * @module string
 */

/**
 * @param {string} s
 * @return {string}
 */
const toLowerCase = s => s.toLowerCase();

const trimLeftRegex = /^\s*/g;

/**
 * @param {string} s
 * @return {string}
 */
const trimLeft = s => s.replace(trimLeftRegex, '');

const fromCamelCaseRegex = /([A-Z])/g;

/**
 * @param {string} s
 * @param {string} separator
 * @return {string}
 */
const fromCamelCase = (s, separator) => trimLeft(s.replace(fromCamelCaseRegex, match => `${separator}${toLowerCase(match)}`));

/* istanbul ignore next */
/** @type {TextEncoder} */ (typeof TextEncoder !== 'undefined' ? new TextEncoder() : null);

/* istanbul ignore next */
let utf8TextDecoder = typeof TextDecoder === 'undefined' ? null : new TextDecoder('utf-8', { fatal: true, ignoreBOM: true });

/* istanbul ignore next */
if (utf8TextDecoder && utf8TextDecoder.decode(new Uint8Array()).length === 1) {
  // Safari doesn't handle BOM correctly.
  // This fixes a bug in Safari 13.0.5 where it produces a BOM the first time it is called.
  // utf8TextDecoder.decode(new Uint8Array()).length === 1 on the first call and
  // utf8TextDecoder.decode(new Uint8Array()).length === 1 on the second call
  // Another issue is that from then on no BOM chars are recognized anymore
  /* istanbul ignore next */
  utf8TextDecoder = null;
}

/**
 * Often used conditions.
 *
 * @module conditions
 */

/**
 * @template T
 * @param {T|null|undefined} v
 * @return {T|null}
 */
/* istanbul ignore next */
const undefinedToNull$1 = v => v === undefined ? null : v;

/* global localStorage, addEventListener */

/**
 * Isomorphic variable storage.
 *
 * Uses LocalStorage in the browser and falls back to in-memory storage.
 *
 * @module storage
 */

/* istanbul ignore next */
class VarStoragePolyfill$1 {
  constructor () {
    this.map = new Map();
  }

  /**
   * @param {string} key
   * @param {any} newValue
   */
  setItem (key, newValue) {
    this.map.set(key, newValue);
  }

  /**
   * @param {string} key
   */
  getItem (key) {
    return this.map.get(key)
  }
}

/* istanbul ignore next */
/**
 * @type {any}
 */
let _localStorage$1 = new VarStoragePolyfill$1();
let usePolyfill$1 = true;

try {
  // if the same-origin rule is violated, accessing localStorage might thrown an error
  /* istanbul ignore next */
  if (typeof localStorage !== 'undefined') {
    _localStorage$1 = localStorage;
    usePolyfill$1 = false;
  }
} catch (e) { }

/* istanbul ignore next */
/**
 * This is basically localStorage in browser, or a polyfill in nodejs
 */
const varStorage$1 = _localStorage$1;

/**
 * Isomorphic module to work access the environment (query params, env variables).
 *
 * @module map
 */

/* istanbul ignore next */
// @ts-ignore
const isNode$2 = typeof process !== 'undefined' && process.release && /node|io\.js/.test(process.release.name);
/* istanbul ignore next */
typeof navigator !== 'undefined' ? /Mac/.test(navigator.platform) : false;

/**
 * @type {Map<string,string>}
 */
let params$1;

/* istanbul ignore next */
const computeParams$1 = () => {
  if (params$1 === undefined) {
    if (isNode$2) {
      params$1 = create$j();
      const pargs = process.argv;
      let currParamName = null;
      /* istanbul ignore next */
      for (let i = 0; i < pargs.length; i++) {
        const parg = pargs[i];
        if (parg[0] === '-') {
          if (currParamName !== null) {
            params$1.set(currParamName, '');
          }
          currParamName = parg;
        } else {
          if (currParamName !== null) {
            params$1.set(currParamName, parg);
            currParamName = null;
          }
        }
      }
      if (currParamName !== null) {
        params$1.set(currParamName, '');
      }
    // in ReactNative for example this would not be true (unless connected to the Remote Debugger)
    } else if (typeof location === 'object') {
      params$1 = create$j()
      // eslint-disable-next-line no-undef
      ;(location.search || '?').slice(1).split('&').forEach(kv => {
        if (kv.length !== 0) {
          const [key, value] = kv.split('=');
          params$1.set(`--${fromCamelCase(key, '-')}`, value);
          params$1.set(`-${fromCamelCase(key, '-')}`, value);
        }
      });
    } else {
      params$1 = create$j();
    }
  }
  return params$1
};

/**
 * @param {string} name
 * @return {boolean}
 */
/* istanbul ignore next */
const hasParam$1 = name => computeParams$1().has(name);
// export const getArgs = name => computeParams() && args

/**
 * @param {string} name
 * @return {string|null}
 */
/* istanbul ignore next */
const getVariable$1 = name => isNode$2 ? undefinedToNull$1(process.env[name.toUpperCase()]) : undefinedToNull$1(varStorage$1.getItem(name));

/**
 * @param {string} name
 * @return {boolean}
 */
/* istanbul ignore next */
const hasConf$1 = name => hasParam$1('--' + name) || getVariable$1(name) !== null;

/* istanbul ignore next */
hasConf$1('production');

/* eslint-env browser */

/**
 * Binary data constants.
 *
 * @module binary
 */

/**
 * n-th bit activated.
 *
 * @type {number}
 */
const BIT1$2 = 1;
const BIT2$2 = 2;
const BIT3$2 = 4;
const BIT4$2 = 8;
const BIT6$2 = 32;
const BIT7$2 = 64;
const BIT8$2 = 128;
const BITS5$2 = 31;
const BITS6$2 = 63;
const BITS7$2 = 127;
const BITS8$2 = 255;
/**
 * @type {number}
 */
const BITS31$2 = 0x7FFFFFFF;
/**
 * @type {number}
 */
const BITS32$2 = 0xFFFFFFFF;

/**
 * Efficient schema-less binary decoding with support for variable length encoding.
 *
 * Use [lib0/decoding] with [lib0/encoding]. Every encoding function has a corresponding decoding function.
 *
 * Encodes numbers in little-endian order (least to most significant byte order)
 * and is compatible with Golang's binary encoding (https://golang.org/pkg/encoding/binary/)
 * which is also used in Protocol Buffers.
 *
 * ```js
 * // encoding step
 * const encoder = new encoding.createEncoder()
 * encoding.writeVarUint(encoder, 256)
 * encoding.writeVarString(encoder, 'Hello world!')
 * const buf = encoding.toUint8Array(encoder)
 * ```
 *
 * ```js
 * // decoding step
 * const decoder = new decoding.createDecoder(buf)
 * decoding.readVarUint(decoder) // => 256
 * decoding.readVarString(decoder) // => 'Hello world!'
 * decoding.hasContent(decoder) // => false - all data is read
 * ```
 *
 * @module decoding
 */

/**
 * A Decoder handles the decoding of an Uint8Array.
 */
class Decoder$2 {
  /**
   * @param {Uint8Array} uint8Array Binary data to decode
   */
  constructor (uint8Array) {
    /**
     * Decoding target.
     *
     * @type {Uint8Array}
     */
    this.arr = uint8Array;
    /**
     * Current decoding position.
     *
     * @type {number}
     */
    this.pos = 0;
  }
}

/**
 * @function
 * @param {Uint8Array} uint8Array
 * @return {Decoder}
 */
const createDecoder$2 = uint8Array => new Decoder$2(uint8Array);

/**
 * @function
 * @param {Decoder} decoder
 * @return {boolean}
 */
const hasContent$2 = decoder => decoder.pos !== decoder.arr.length;

/**
 * Create an Uint8Array view of the next `len` bytes and advance the position by `len`.
 *
 * Important: The Uint8Array still points to the underlying ArrayBuffer. Make sure to discard the result as soon as possible to prevent any memory leaks.
 *            Use `buffer.copyUint8Array` to copy the result into a new Uint8Array.
 *
 * @function
 * @param {Decoder} decoder The decoder instance
 * @param {number} len The length of bytes to read
 * @return {Uint8Array}
 */
const readUint8Array$2 = (decoder, len) => {
  const view = createUint8ArrayViewFromArrayBuffer$2(decoder.arr.buffer, decoder.pos + decoder.arr.byteOffset, len);
  decoder.pos += len;
  return view
};

/**
 * Read variable length Uint8Array.
 *
 * Important: The Uint8Array still points to the underlying ArrayBuffer. Make sure to discard the result as soon as possible to prevent any memory leaks.
 *            Use `buffer.copyUint8Array` to copy the result into a new Uint8Array.
 *
 * @function
 * @param {Decoder} decoder
 * @return {Uint8Array}
 */
const readVarUint8Array$2 = decoder => readUint8Array$2(decoder, readVarUint$2(decoder));

/**
 * Read one byte as unsigned integer.
 * @function
 * @param {Decoder} decoder The decoder instance
 * @return {number} Unsigned 8-bit integer
 */
const readUint8$2 = decoder => decoder.arr[decoder.pos++];

/**
 * Read unsigned integer (32bit) with variable length.
 * 1/8th of the storage is used as encoding overhead.
 *  * numbers < 2^7 is stored in one bytlength
 *  * numbers < 2^14 is stored in two bylength
 *
 * @function
 * @param {Decoder} decoder
 * @return {number} An unsigned integer.length
 */
const readVarUint$2 = decoder => {
  let num = 0;
  let len = 0;
  while (true) {
    const r = decoder.arr[decoder.pos++];
    num = num | ((r & BITS7$2) << len);
    len += 7;
    if (r < BIT8$2) {
      return num >>> 0 // return unsigned number!
    }
    /* istanbul ignore if */
    if (len > 35) {
      throw new Error('Integer out of range!')
    }
  }
};

/**
 * Read signed integer (32bit) with variable length.
 * 1/8th of the storage is used as encoding overhead.
 *  * numbers < 2^7 is stored in one bytlength
 *  * numbers < 2^14 is stored in two bylength
 * @todo This should probably create the inverse ~num if number is negative - but this would be a breaking change.
 *
 * @function
 * @param {Decoder} decoder
 * @return {number} An unsigned integer.length
 */
const readVarInt$2 = decoder => {
  let r = decoder.arr[decoder.pos++];
  let num = r & BITS6$2;
  let len = 6;
  const sign = (r & BIT7$2) > 0 ? -1 : 1;
  if ((r & BIT8$2) === 0) {
    // don't continue reading
    return sign * num
  }
  while (true) {
    r = decoder.arr[decoder.pos++];
    num = num | ((r & BITS7$2) << len);
    len += 7;
    if (r < BIT8$2) {
      return sign * (num >>> 0)
    }
    /* istanbul ignore if */
    if (len > 41) {
      throw new Error('Integer out of range!')
    }
  }
};

/**
 * Read string of variable length
 * * varUint is used to store the length of the string
 *
 * Transforming utf8 to a string is pretty expensive. The code performs 10x better
 * when String.fromCodePoint is fed with all characters as arguments.
 * But most environments have a maximum number of arguments per functions.
 * For effiency reasons we apply a maximum of 10000 characters at once.
 *
 * @function
 * @param {Decoder} decoder
 * @return {String} The read String.
 */
const readVarString$2 = decoder => {
  let remainingLen = readVarUint$2(decoder);
  if (remainingLen === 0) {
    return ''
  } else {
    let encodedString = String.fromCodePoint(readUint8$2(decoder)); // remember to decrease remainingLen
    if (--remainingLen < 100) { // do not create a Uint8Array for small strings
      while (remainingLen--) {
        encodedString += String.fromCodePoint(readUint8$2(decoder));
      }
    } else {
      while (remainingLen > 0) {
        const nextLen = remainingLen < 10000 ? remainingLen : 10000;
        // this is dangerous, we create a fresh array view from the existing buffer
        const bytes = decoder.arr.subarray(decoder.pos, decoder.pos + nextLen);
        decoder.pos += nextLen;
        // Starting with ES5.1 we can supply a generic array-like object as arguments
        encodedString += String.fromCodePoint.apply(null, /** @type {any} */ (bytes));
        remainingLen -= nextLen;
      }
    }
    return decodeURIComponent(escape(encodedString))
  }
};

/**
 * @param {Decoder} decoder
 * @param {number} len
 * @return {DataView}
 */
const readFromDataView$2 = (decoder, len) => {
  const dv = new DataView(decoder.arr.buffer, decoder.arr.byteOffset + decoder.pos, len);
  decoder.pos += len;
  return dv
};

/**
 * @param {Decoder} decoder
 */
const readFloat32$2 = decoder => readFromDataView$2(decoder, 4).getFloat32(0, false);

/**
 * @param {Decoder} decoder
 */
const readFloat64$2 = decoder => readFromDataView$2(decoder, 8).getFloat64(0, false);

/**
 * @param {Decoder} decoder
 */
const readBigInt64$2 = decoder => /** @type {any} */ (readFromDataView$2(decoder, 8)).getBigInt64(0, false);

/**
 * @type {Array<function(Decoder):any>}
 */
const readAnyLookupTable$1 = [
  decoder => undefined, // CASE 127: undefined
  decoder => null, // CASE 126: null
  readVarInt$2, // CASE 125: integer
  readFloat32$2, // CASE 124: float32
  readFloat64$2, // CASE 123: float64
  readBigInt64$2, // CASE 122: bigint
  decoder => false, // CASE 121: boolean (false)
  decoder => true, // CASE 120: boolean (true)
  readVarString$2, // CASE 119: string
  decoder => { // CASE 118: object<string,any>
    const len = readVarUint$2(decoder);
    /**
     * @type {Object<string,any>}
     */
    const obj = {};
    for (let i = 0; i < len; i++) {
      const key = readVarString$2(decoder);
      obj[key] = readAny$2(decoder);
    }
    return obj
  },
  decoder => { // CASE 117: array<any>
    const len = readVarUint$2(decoder);
    const arr = [];
    for (let i = 0; i < len; i++) {
      arr.push(readAny$2(decoder));
    }
    return arr
  },
  readVarUint8Array$2 // CASE 116: Uint8Array
];

/**
 * @param {Decoder} decoder
 */
const readAny$2 = decoder => readAnyLookupTable$1[127 - readUint8$2(decoder)](decoder);

/**
 * T must not be null.
 *
 * @template T
 */
class RleDecoder$2 extends Decoder$2 {
  /**
   * @param {Uint8Array} uint8Array
   * @param {function(Decoder):T} reader
   */
  constructor (uint8Array, reader) {
    super(uint8Array);
    /**
     * The reader
     */
    this.reader = reader;
    /**
     * Current state
     * @type {T|null}
     */
    this.s = null;
    this.count = 0;
  }

  read () {
    if (this.count === 0) {
      this.s = this.reader(this);
      if (hasContent$2(this)) {
        this.count = readVarUint$2(this) + 1; // see encoder implementation for the reason why this is incremented
      } else {
        this.count = -1; // read the current value forever
      }
    }
    this.count--;
    return /** @type {T} */ (this.s)
  }
}

class UintOptRleDecoder$2 extends Decoder$2 {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor (uint8Array) {
    super(uint8Array);
    /**
     * @type {number}
     */
    this.s = 0;
    this.count = 0;
  }

  read () {
    if (this.count === 0) {
      this.s = readVarInt$2(this);
      // if the sign is negative, we read the count too, otherwise count is 1
      const isNegative = isNegativeZero$2(this.s);
      this.count = 1;
      if (isNegative) {
        this.s = -this.s;
        this.count = readVarUint$2(this) + 2;
      }
    }
    this.count--;
    return /** @type {number} */ (this.s)
  }
}

class IntDiffOptRleDecoder$2 extends Decoder$2 {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor (uint8Array) {
    super(uint8Array);
    /**
     * @type {number}
     */
    this.s = 0;
    this.count = 0;
    this.diff = 0;
  }

  /**
   * @return {number}
   */
  read () {
    if (this.count === 0) {
      const diff = readVarInt$2(this);
      // if the first bit is set, we read more data
      const hasCount = diff & 1;
      this.diff = diff >> 1;
      this.count = 1;
      if (hasCount) {
        this.count = readVarUint$2(this) + 2;
      }
    }
    this.s += this.diff;
    this.count--;
    return this.s
  }
}

class StringDecoder$4 {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor (uint8Array) {
    this.decoder = new UintOptRleDecoder$2(uint8Array);
    this.str = readVarString$2(this.decoder);
    /**
     * @type {number}
     */
    this.spos = 0;
  }

  /**
   * @return {string}
   */
  read () {
    const end = this.spos + this.decoder.read();
    const res = this.str.slice(this.spos, end);
    this.spos = end;
    return res
  }
}

/**
 * Utility functions to work with buffers (Uint8Array).
 *
 * @module buffer
 */

/**
 * @param {number} len
 */
const createUint8ArrayFromLen$2 = len => new Uint8Array(len);

/**
 * Create Uint8Array with initial content from buffer
 *
 * @param {ArrayBuffer} buffer
 * @param {number} byteOffset
 * @param {number} length
 */
const createUint8ArrayViewFromArrayBuffer$2 = (buffer, byteOffset, length) => new Uint8Array(buffer, byteOffset, length);

/**
 * Copy the content of an Uint8Array view to a new ArrayBuffer.
 *
 * @param {Uint8Array} uint8Array
 * @return {Uint8Array}
 */
const copyUint8Array$2 = uint8Array => {
  const newBuf = createUint8ArrayFromLen$2(uint8Array.byteLength);
  newBuf.set(uint8Array);
  return newBuf
};

/**
 * Encode anything as a UInt8Array. It's a pun on typescripts's `any` type.
 * See encoding.writeAny for more information.
 *
 * @param {any} data
 * @return {Uint8Array}
 */
const encodeAny$2 = data => {
  const encoder = createEncoder$2();
  writeAny$2(encoder, data);
  return toUint8Array$2(encoder)
};

/**
 * Decode an any-encoded value.
 *
 * @param {Uint8Array} buf
 * @return {any}
 */
const decodeAny$2 = buf => readAny$2(createDecoder$2(buf));

/**
 * Utility helpers for working with numbers.
 *
 * @module number
 */

/**
 * @module number
 */

/* istanbul ignore next */
const isInteger$1 = Number.isInteger || (num => typeof num === 'number' && isFinite(num) && floor$2(num) === num);

/**
 * Efficient schema-less binary encoding with support for variable length encoding.
 *
 * Use [lib0/encoding] with [lib0/decoding]. Every encoding function has a corresponding decoding function.
 *
 * Encodes numbers in little-endian order (least to most significant byte order)
 * and is compatible with Golang's binary encoding (https://golang.org/pkg/encoding/binary/)
 * which is also used in Protocol Buffers.
 *
 * ```js
 * // encoding step
 * const encoder = new encoding.createEncoder()
 * encoding.writeVarUint(encoder, 256)
 * encoding.writeVarString(encoder, 'Hello world!')
 * const buf = encoding.toUint8Array(encoder)
 * ```
 *
 * ```js
 * // decoding step
 * const decoder = new decoding.createDecoder(buf)
 * decoding.readVarUint(decoder) // => 256
 * decoding.readVarString(decoder) // => 'Hello world!'
 * decoding.hasContent(decoder) // => false - all data is read
 * ```
 *
 * @module encoding
 */

/**
 * A BinaryEncoder handles the encoding to an Uint8Array.
 */
class Encoder$2 {
  constructor () {
    this.cpos = 0;
    this.cbuf = new Uint8Array(100);
    /**
     * @type {Array<Uint8Array>}
     */
    this.bufs = [];
  }
}

/**
 * @function
 * @return {Encoder}
 */
const createEncoder$2 = () => new Encoder$2();

/**
 * The current length of the encoded data.
 *
 * @function
 * @param {Encoder} encoder
 * @return {number}
 */
const length$5 = encoder => {
  let len = encoder.cpos;
  for (let i = 0; i < encoder.bufs.length; i++) {
    len += encoder.bufs[i].length;
  }
  return len
};

/**
 * Transform to Uint8Array.
 *
 * @function
 * @param {Encoder} encoder
 * @return {Uint8Array} The created ArrayBuffer.
 */
const toUint8Array$2 = encoder => {
  const uint8arr = new Uint8Array(length$5(encoder));
  let curPos = 0;
  for (let i = 0; i < encoder.bufs.length; i++) {
    const d = encoder.bufs[i];
    uint8arr.set(d, curPos);
    curPos += d.length;
  }
  uint8arr.set(createUint8ArrayViewFromArrayBuffer$2(encoder.cbuf.buffer, 0, encoder.cpos), curPos);
  return uint8arr
};

/**
 * Verify that it is possible to write `len` bytes wtihout checking. If
 * necessary, a new Buffer with the required length is attached.
 *
 * @param {Encoder} encoder
 * @param {number} len
 */
const verifyLen$1 = (encoder, len) => {
  const bufferLen = encoder.cbuf.length;
  if (bufferLen - encoder.cpos < len) {
    encoder.bufs.push(createUint8ArrayViewFromArrayBuffer$2(encoder.cbuf.buffer, 0, encoder.cpos));
    encoder.cbuf = new Uint8Array(max$2(bufferLen, len) * 2);
    encoder.cpos = 0;
  }
};

/**
 * Write one byte to the encoder.
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} num The byte that is to be encoded.
 */
const write$2 = (encoder, num) => {
  const bufferLen = encoder.cbuf.length;
  if (encoder.cpos === bufferLen) {
    encoder.bufs.push(encoder.cbuf);
    encoder.cbuf = new Uint8Array(bufferLen * 2);
    encoder.cpos = 0;
  }
  encoder.cbuf[encoder.cpos++] = num;
};

/**
 * Write one byte as an unsigned integer.
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} num The number that is to be encoded.
 */
const writeUint8$2 = write$2;

/**
 * Write a variable length unsigned integer.
 *
 * Encodes integers in the range from [0, 4294967295] / [0, 0xffffffff]. (max 32 bit unsigned integer)
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} num The number that is to be encoded.
 */
const writeVarUint$2 = (encoder, num) => {
  while (num > BITS7$2) {
    write$2(encoder, BIT8$2 | (BITS7$2 & num));
    num >>>= 7;
  }
  write$2(encoder, BITS7$2 & num);
};

/**
 * Write a variable length integer.
 *
 * Encodes integers in the range from [-2147483648, -2147483647].
 *
 * We don't use zig-zag encoding because we want to keep the option open
 * to use the same function for BigInt and 53bit integers (doubles).
 *
 * We use the 7th bit instead for signaling that this is a negative number.
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} num The number that is to be encoded.
 */
const writeVarInt$2 = (encoder, num) => {
  const isNegative = isNegativeZero$2(num);
  if (isNegative) {
    num = -num;
  }
  //             |- whether to continue reading         |- whether is negative     |- number
  write$2(encoder, (num > BITS6$2 ? BIT8$2 : 0) | (isNegative ? BIT7$2 : 0) | (BITS6$2 & num));
  num >>>= 6;
  // We don't need to consider the case of num === 0 so we can use a different
  // pattern here than above.
  while (num > 0) {
    write$2(encoder, (num > BITS7$2 ? BIT8$2 : 0) | (BITS7$2 & num));
    num >>>= 7;
  }
};

/**
 * Write a variable length string.
 *
 * @function
 * @param {Encoder} encoder
 * @param {String} str The string that is to be encoded.
 */
const writeVarString$2 = (encoder, str) => {
  const encodedString = unescape(encodeURIComponent(str));
  const len = encodedString.length;
  writeVarUint$2(encoder, len);
  for (let i = 0; i < len; i++) {
    write$2(encoder, /** @type {number} */ (encodedString.codePointAt(i)));
  }
};

/**
 * Append fixed-length Uint8Array to the encoder.
 *
 * @function
 * @param {Encoder} encoder
 * @param {Uint8Array} uint8Array
 */
const writeUint8Array$2 = (encoder, uint8Array) => {
  const bufferLen = encoder.cbuf.length;
  const cpos = encoder.cpos;
  const leftCopyLen = min$2(bufferLen - cpos, uint8Array.length);
  const rightCopyLen = uint8Array.length - leftCopyLen;
  encoder.cbuf.set(uint8Array.subarray(0, leftCopyLen), cpos);
  encoder.cpos += leftCopyLen;
  if (rightCopyLen > 0) {
    // Still something to write, write right half..
    // Append new buffer
    encoder.bufs.push(encoder.cbuf);
    // must have at least size of remaining buffer
    encoder.cbuf = new Uint8Array(max$2(bufferLen * 2, rightCopyLen));
    // copy array
    encoder.cbuf.set(uint8Array.subarray(leftCopyLen));
    encoder.cpos = rightCopyLen;
  }
};

/**
 * Append an Uint8Array to Encoder.
 *
 * @function
 * @param {Encoder} encoder
 * @param {Uint8Array} uint8Array
 */
const writeVarUint8Array$2 = (encoder, uint8Array) => {
  writeVarUint$2(encoder, uint8Array.byteLength);
  writeUint8Array$2(encoder, uint8Array);
};

/**
 * Create an DataView of the next `len` bytes. Use it to write data after
 * calling this function.
 *
 * ```js
 * // write float32 using DataView
 * const dv = writeOnDataView(encoder, 4)
 * dv.setFloat32(0, 1.1)
 * // read float32 using DataView
 * const dv = readFromDataView(encoder, 4)
 * dv.getFloat32(0) // => 1.100000023841858 (leaving it to the reader to find out why this is the correct result)
 * ```
 *
 * @param {Encoder} encoder
 * @param {number} len
 * @return {DataView}
 */
const writeOnDataView$2 = (encoder, len) => {
  verifyLen$1(encoder, len);
  const dview = new DataView(encoder.cbuf.buffer, encoder.cpos, len);
  encoder.cpos += len;
  return dview
};

/**
 * @param {Encoder} encoder
 * @param {number} num
 */
const writeFloat32$2 = (encoder, num) => writeOnDataView$2(encoder, 4).setFloat32(0, num, false);

/**
 * @param {Encoder} encoder
 * @param {number} num
 */
const writeFloat64$2 = (encoder, num) => writeOnDataView$2(encoder, 8).setFloat64(0, num, false);

/**
 * @param {Encoder} encoder
 * @param {bigint} num
 */
const writeBigInt64$2 = (encoder, num) => /** @type {any} */ (writeOnDataView$2(encoder, 8)).setBigInt64(0, num, false);

const floatTestBed$1 = new DataView(new ArrayBuffer(4));
/**
 * Check if a number can be encoded as a 32 bit float.
 *
 * @param {number} num
 * @return {boolean}
 */
const isFloat32$1 = num => {
  floatTestBed$1.setFloat32(0, num);
  return floatTestBed$1.getFloat32(0) === num
};

/**
 * Encode data with efficient binary format.
 *
 * Differences to JSON:
 * • Transforms data to a binary format (not to a string)
 * • Encodes undefined, NaN, and ArrayBuffer (these can't be represented in JSON)
 * • Numbers are efficiently encoded either as a variable length integer, as a
 *   32 bit float, as a 64 bit float, or as a 64 bit bigint.
 *
 * Encoding table:
 *
 * | Data Type           | Prefix   | Encoding Method    | Comment |
 * | ------------------- | -------- | ------------------ | ------- |
 * | undefined           | 127      |                    | Functions, symbol, and everything that cannot be identified is encoded as undefined |
 * | null                | 126      |                    | |
 * | integer             | 125      | writeVarInt        | Only encodes 32 bit signed integers |
 * | float32             | 124      | writeFloat32       | |
 * | float64             | 123      | writeFloat64       | |
 * | bigint              | 122      | writeBigInt64      | |
 * | boolean (false)     | 121      |                    | True and false are different data types so we save the following byte |
 * | boolean (true)      | 120      |                    | - 0b01111000 so the last bit determines whether true or false |
 * | string              | 119      | writeVarString     | |
 * | object<string,any>  | 118      | custom             | Writes {length} then {length} key-value pairs |
 * | array<any>          | 117      | custom             | Writes {length} then {length} json values |
 * | Uint8Array          | 116      | writeVarUint8Array | We use Uint8Array for any kind of binary data |
 *
 * Reasons for the decreasing prefix:
 * We need the first bit for extendability (later we may want to encode the
 * prefix with writeVarUint). The remaining 7 bits are divided as follows:
 * [0-30]   the beginning of the data range is used for custom purposes
 *          (defined by the function that uses this library)
 * [31-127] the end of the data range is used for data encoding by
 *          lib0/encoding.js
 *
 * @param {Encoder} encoder
 * @param {undefined|null|number|bigint|boolean|string|Object<string,any>|Array<any>|Uint8Array} data
 */
const writeAny$2 = (encoder, data) => {
  switch (typeof data) {
    case 'string':
      // TYPE 119: STRING
      write$2(encoder, 119);
      writeVarString$2(encoder, data);
      break
    case 'number':
      if (isInteger$1(data) && data <= BITS31$2) {
        // TYPE 125: INTEGER
        write$2(encoder, 125);
        writeVarInt$2(encoder, data);
      } else if (isFloat32$1(data)) {
        // TYPE 124: FLOAT32
        write$2(encoder, 124);
        writeFloat32$2(encoder, data);
      } else {
        // TYPE 123: FLOAT64
        write$2(encoder, 123);
        writeFloat64$2(encoder, data);
      }
      break
    case 'bigint':
      // TYPE 122: BigInt
      write$2(encoder, 122);
      writeBigInt64$2(encoder, data);
      break
    case 'object':
      if (data === null) {
        // TYPE 126: null
        write$2(encoder, 126);
      } else if (data instanceof Array) {
        // TYPE 117: Array
        write$2(encoder, 117);
        writeVarUint$2(encoder, data.length);
        for (let i = 0; i < data.length; i++) {
          writeAny$2(encoder, data[i]);
        }
      } else if (data instanceof Uint8Array) {
        // TYPE 116: ArrayBuffer
        write$2(encoder, 116);
        writeVarUint8Array$2(encoder, data);
      } else {
        // TYPE 118: Object
        write$2(encoder, 118);
        const keys = Object.keys(data);
        writeVarUint$2(encoder, keys.length);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          writeVarString$2(encoder, key);
          writeAny$2(encoder, data[key]);
        }
      }
      break
    case 'boolean':
      // TYPE 120/121: boolean (true/false)
      write$2(encoder, data ? 120 : 121);
      break
    default:
      // TYPE 127: undefined
      write$2(encoder, 127);
  }
};

/**
 * Now come a few stateful encoder that have their own classes.
 */

/**
 * Basic Run Length Encoder - a basic compression implementation.
 *
 * Encodes [1,1,1,7] to [1,3,7,1] (3 times 1, 1 time 7). This encoder might do more harm than good if there are a lot of values that are not repeated.
 *
 * It was originally used for image compression. Cool .. article http://csbruce.com/cbm/transactor/pdfs/trans_v7_i06.pdf
 *
 * @note T must not be null!
 *
 * @template T
 */
class RleEncoder$2 extends Encoder$2 {
  /**
   * @param {function(Encoder, T):void} writer
   */
  constructor (writer) {
    super();
    /**
     * The writer
     */
    this.w = writer;
    /**
     * Current state
     * @type {T|null}
     */
    this.s = null;
    this.count = 0;
  }

  /**
   * @param {T} v
   */
  write (v) {
    if (this.s === v) {
      this.count++;
    } else {
      if (this.count > 0) {
        // flush counter, unless this is the first value (count = 0)
        writeVarUint$2(this, this.count - 1); // since count is always > 0, we can decrement by one. non-standard encoding ftw
      }
      this.count = 1;
      // write first value
      this.w(this, v);
      this.s = v;
    }
  }
}

/**
 * @param {UintOptRleEncoder} encoder
 */
const flushUintOptRleEncoder$1 = encoder => {
  /* istanbul ignore else */
  if (encoder.count > 0) {
    // flush counter, unless this is the first value (count = 0)
    // case 1: just a single value. set sign to positive
    // case 2: write several values. set sign to negative to indicate that there is a length coming
    writeVarInt$2(encoder.encoder, encoder.count === 1 ? encoder.s : -encoder.s);
    if (encoder.count > 1) {
      writeVarUint$2(encoder.encoder, encoder.count - 2); // since count is always > 1, we can decrement by one. non-standard encoding ftw
    }
  }
};

/**
 * Optimized Rle encoder that does not suffer from the mentioned problem of the basic Rle encoder.
 *
 * Internally uses VarInt encoder to write unsigned integers. If the input occurs multiple times, we write
 * write it as a negative number. The UintOptRleDecoder then understands that it needs to read a count.
 *
 * Encodes [1,2,3,3,3] as [1,2,-3,3] (once 1, once 2, three times 3)
 */
class UintOptRleEncoder$2 {
  constructor () {
    this.encoder = new Encoder$2();
    /**
     * @type {number}
     */
    this.s = 0;
    this.count = 0;
  }

  /**
   * @param {number} v
   */
  write (v) {
    if (this.s === v) {
      this.count++;
    } else {
      flushUintOptRleEncoder$1(this);
      this.count = 1;
      this.s = v;
    }
  }

  toUint8Array () {
    flushUintOptRleEncoder$1(this);
    return toUint8Array$2(this.encoder)
  }
}

/**
 * @param {IntDiffOptRleEncoder} encoder
 */
const flushIntDiffOptRleEncoder$1 = encoder => {
  if (encoder.count > 0) {
    //          31 bit making up the diff | wether to write the counter
    const encodedDiff = encoder.diff << 1 | (encoder.count === 1 ? 0 : 1);
    // flush counter, unless this is the first value (count = 0)
    // case 1: just a single value. set first bit to positive
    // case 2: write several values. set first bit to negative to indicate that there is a length coming
    writeVarInt$2(encoder.encoder, encodedDiff);
    if (encoder.count > 1) {
      writeVarUint$2(encoder.encoder, encoder.count - 2); // since count is always > 1, we can decrement by one. non-standard encoding ftw
    }
  }
};

/**
 * A combination of the IntDiffEncoder and the UintOptRleEncoder.
 *
 * The count approach is similar to the UintDiffOptRleEncoder, but instead of using the negative bitflag, it encodes
 * in the LSB whether a count is to be read. Therefore this Encoder only supports 31 bit integers!
 *
 * Encodes [1, 2, 3, 2] as [3, 1, 6, -1] (more specifically [(1 << 1) | 1, (3 << 0) | 0, -1])
 *
 * Internally uses variable length encoding. Contrary to normal UintVar encoding, the first byte contains:
 * * 1 bit that denotes whether the next value is a count (LSB)
 * * 1 bit that denotes whether this value is negative (MSB - 1)
 * * 1 bit that denotes whether to continue reading the variable length integer (MSB)
 *
 * Therefore, only five bits remain to encode diff ranges.
 *
 * Use this Encoder only when appropriate. In most cases, this is probably a bad idea.
 */
class IntDiffOptRleEncoder$2 {
  constructor () {
    this.encoder = new Encoder$2();
    /**
     * @type {number}
     */
    this.s = 0;
    this.count = 0;
    this.diff = 0;
  }

  /**
   * @param {number} v
   */
  write (v) {
    if (this.diff === v - this.s) {
      this.s = v;
      this.count++;
    } else {
      flushIntDiffOptRleEncoder$1(this);
      this.count = 1;
      this.diff = v - this.s;
      this.s = v;
    }
  }

  toUint8Array () {
    flushIntDiffOptRleEncoder$1(this);
    return toUint8Array$2(this.encoder)
  }
}

/**
 * Optimized String Encoder.
 *
 * Encoding many small strings in a simple Encoder is not very efficient. The function call to decode a string takes some time and creates references that must be eventually deleted.
 * In practice, when decoding several million small strings, the GC will kick in more and more often to collect orphaned string objects (or maybe there is another reason?).
 *
 * This string encoder solves the above problem. All strings are concatenated and written as a single string using a single encoding call.
 *
 * The lengths are encoded using a UintOptRleEncoder.
 */
class StringEncoder$2 {
  constructor () {
    /**
     * @type {Array<string>}
     */
    this.sarr = [];
    this.s = '';
    this.lensE = new UintOptRleEncoder$2();
  }

  /**
   * @param {string} string
   */
  write (string) {
    this.s += string;
    if (this.s.length > 19) {
      this.sarr.push(this.s);
      this.s = '';
    }
    this.lensE.write(string.length);
  }

  toUint8Array () {
    const encoder = new Encoder$2();
    this.sarr.push(this.s);
    this.s = '';
    writeVarString$2(encoder, this.sarr.join(''));
    writeUint8Array$2(encoder, this.lensE.toUint8Array());
    return toUint8Array$2(encoder)
  }
}

/* eslint-env browser */

const isoCrypto$1 = typeof crypto === 'undefined' ? null : crypto;

/**
 * @type {function(number):ArrayBuffer}
 */
const cryptoRandomBuffer$2 = isoCrypto$1 !== null
  ? len => {
    // browser
    const buf = new ArrayBuffer(len);
    const arr = new Uint8Array(buf);
    isoCrypto$1.getRandomValues(arr);
    return buf
  }
  : len => {
    // polyfill
    const buf = new ArrayBuffer(len);
    const arr = new Uint8Array(buf);
    for (let i = 0; i < len; i++) {
      arr[i] = Math.ceil((Math.random() * 0xFFFFFFFF) >>> 0);
    }
    return buf
  };

/* istanbul ignore next */
const uint32$1 = () => new Uint32Array(cryptoRandomBuffer$2(4))[0];

// @ts-ignore
const uuidv4Template$1 = [1e7] + -1e3 + -4e3 + -8e3 + -1e11;
const uuidv4$1 = () => uuidv4Template$1.replace(/[018]/g, /** @param {number} c */ c =>
  (c ^ uint32$1() & 15 >> c / 4).toString(16)
);

/**
 * Utility module to work with time.
 *
 * @module time
 */

/**
 * Return current unix time.
 *
 * @return {number}
 */
const getUnixTime$2 = Date.now;

/**
 * Utility helpers to work with promises.
 *
 * @module promise
 */

/**
 * @template T
 * @callback PromiseResolve
 * @param {T|PromiseLike<T>} [result]
 */

/**
 * @template T
 * @param {function(PromiseResolve<T>,function(Error):void):any} f
 * @return {Promise<T>}
 */
const create$h = f => /** @type {Promise<T>} */ (new Promise(f));

/**
 * @template T
 * @param {T|void} res
 * @return {Promise<T|void>}
 */
const resolve$2 = res => Promise.resolve(res);

/**
 * Error helpers.
 *
 * @module error
 */

/* istanbul ignore next */
/**
 * @param {string} s
 * @return {Error}
 */
const create$g = s => new Error(s);

/* istanbul ignore next */
/**
 * @throws {Error}
 * @return {never}
 */
const methodUnimplemented$2 = () => {
  throw create$g('Method unimplemented')
};

/* istanbul ignore next */
/**
 * @throws {Error}
 * @return {never}
 */
const unexpectedCase$2 = () => {
  throw create$g('Unexpected case')
};

/**
 * Utility functions for working with EcmaScript objects.
 *
 * @module object
 */

/**
 * @param {Object<string,any>} obj
 */
const keys$3 = Object.keys;

/**
 * @param {Object<string,any>} obj
 * @return {number}
 */
const length$4 = obj => keys$3(obj).length;

/**
 * @param {Object<string,any>} obj
 * @param {function(any,string):boolean} f
 * @return {boolean}
 */
const every$4 = (obj, f) => {
  for (const key in obj) {
    if (!f(obj[key], key)) {
      return false
    }
  }
  return true
};

/**
 * Calls `Object.prototype.hasOwnProperty`.
 *
 * @param {any} obj
 * @param {string|symbol} key
 * @return {boolean}
 */
const hasProperty$2 = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

/**
 * @param {Object<string,any>} a
 * @param {Object<string,any>} b
 * @return {boolean}
 */
const equalFlat$4 = (a, b) => a === b || (length$4(a) === length$4(b) && every$4(a, (val, key) => (val !== undefined || hasProperty$2(b, key)) && b[key] === val));

/**
 * Common functions and function call helpers.
 *
 * @module function
 */

/**
 * Calls all functions in `fs` with args. Only throws after all functions were called.
 *
 * @param {Array<function>} fs
 * @param {Array<any>} args
 */
const callAll$2 = (fs, args, i = 0) => {
  try {
    for (; i < fs.length; i++) {
      fs[i](...args);
    }
  } finally {
    if (i < fs.length) {
      callAll$2(fs, args, i + 1);
    }
  }
};

/**
 * Utility module to work with EcmaScript Symbols.
 *
 * @module symbol
 */

/**
 * Return fresh symbol.
 *
 * @return {Symbol}
 */
const create$f = Symbol;

/**
 * Working with value pairs.
 *
 * @module pair
 */

/**
 * @template L,R
 */
class Pair$1 {
  /**
   * @param {L} left
   * @param {R} right
   */
  constructor (left, right) {
    this.left = left;
    this.right = right;
  }
}

/**
 * @template L,R
 * @param {L} left
 * @param {R} right
 * @return {Pair<L,R>}
 */
const create$e = (left, right) => new Pair$1(left, right);

/* eslint-env browser */

/* istanbul ignore next */
/**
 * @type {Document}
 */
const doc$1 = /** @type {Document} */ (typeof document !== 'undefined' ? document : {});

/* istanbul ignore next */
/** @type {DOMParser} */ (typeof DOMParser !== 'undefined' ? new DOMParser() : null);

/**
 * @param {Map<string,string>} m
 * @return {string}
 */
/* istanbul ignore next */
const mapToStyleString$1 = m => map$6(m, (value, key) => `${key}:${value};`).join('');

doc$1.ELEMENT_NODE;
doc$1.TEXT_NODE;
doc$1.CDATA_SECTION_NODE;
doc$1.COMMENT_NODE;
doc$1.DOCUMENT_NODE;
doc$1.DOCUMENT_TYPE_NODE;
doc$1.DOCUMENT_FRAGMENT_NODE;

/**
 * Isomorphic logging module with support for colors!
 *
 * @module logging
 */

const BOLD$2 = create$f();
const UNBOLD$2 = create$f();
const BLUE$2 = create$f();
const GREY$2 = create$f();
const GREEN$2 = create$f();
const RED$2 = create$f();
const PURPLE$2 = create$f();
const ORANGE$2 = create$f();
const UNCOLOR$2 = create$f();

/**
 * @type {Object<Symbol,pair.Pair<string,string>>}
 */
const _browserStyleMap$1 = {
  [BOLD$2]: create$e('font-weight', 'bold'),
  [UNBOLD$2]: create$e('font-weight', 'normal'),
  [BLUE$2]: create$e('color', 'blue'),
  [GREEN$2]: create$e('color', 'green'),
  [GREY$2]: create$e('color', 'grey'),
  [RED$2]: create$e('color', 'red'),
  [PURPLE$2]: create$e('color', 'purple'),
  [ORANGE$2]: create$e('color', 'orange'), // not well supported in chrome when debugging node with inspector - TODO: deprecate
  [UNCOLOR$2]: create$e('color', 'black')
};

const _nodeStyleMap$1 = {
  [BOLD$2]: '\u001b[1m',
  [UNBOLD$2]: '\u001b[2m',
  [BLUE$2]: '\x1b[34m',
  [GREEN$2]: '\x1b[32m',
  [GREY$2]: '\u001b[37m',
  [RED$2]: '\x1b[31m',
  [PURPLE$2]: '\x1b[35m',
  [ORANGE$2]: '\x1b[38;5;208m',
  [UNCOLOR$2]: '\x1b[0m'
};

/* istanbul ignore next */
/**
 * @param {Array<string|Symbol|Object|number>} args
 * @return {Array<string|object|number>}
 */
const computeBrowserLoggingArgs$1 = args => {
  const strBuilder = [];
  const styles = [];
  const currentStyle = create$j();
  /**
   * @type {Array<string|Object|number>}
   */
  let logArgs = [];
  // try with formatting until we find something unsupported
  let i = 0;

  for (; i < args.length; i++) {
    const arg = args[i];
    // @ts-ignore
    const style = _browserStyleMap$1[arg];
    if (style !== undefined) {
      currentStyle.set(style.left, style.right);
    } else {
      if (arg.constructor === String || arg.constructor === Number) {
        const style = mapToStyleString$1(currentStyle);
        if (i > 0 || style.length > 0) {
          strBuilder.push('%c' + arg);
          styles.push(style);
        } else {
          strBuilder.push(arg);
        }
      } else {
        break
      }
    }
  }

  if (i > 0) {
    // create logArgs with what we have so far
    logArgs = styles;
    logArgs.unshift(strBuilder.join(''));
  }
  // append the rest
  for (; i < args.length; i++) {
    const arg = args[i];
    if (!(arg instanceof Symbol)) {
      logArgs.push(arg);
    }
  }
  return logArgs
};

/**
 * @param {Array<string|Symbol|Object|number>} args
 * @return {Array<string|object|number>}
 */
const computeNodeLoggingArgs$1 = args => {
  const strBuilder = [];
  const logArgs = [];

  // try with formatting until we find something unsupported
  let i = 0;

  for (; i < args.length; i++) {
    const arg = args[i];
    // @ts-ignore
    const style = _nodeStyleMap$1[arg];
    if (style !== undefined) {
      strBuilder.push(style);
    } else {
      if (arg.constructor === String || arg.constructor === Number) {
        strBuilder.push(arg);
      } else {
        break
      }
    }
  }
  if (i > 0) {
    // create logArgs with what we have so far
    strBuilder.push('\x1b[0m');
    logArgs.push(strBuilder.join(''));
  }
  // append the rest
  for (; i < args.length; i++) {
    const arg = args[i];
    /* istanbul ignore else */
    if (!(arg instanceof Symbol)) {
      logArgs.push(arg);
    }
  }
  return logArgs
};

/* istanbul ignore next */
const computeLoggingArgs$1 = isNode$2 ? computeNodeLoggingArgs$1 : computeBrowserLoggingArgs$1;

/**
 * @param {Array<string|Symbol|Object|number>} args
 */
const print$2 = (...args) => {
  console.log(...computeLoggingArgs$1(args));
  /* istanbul ignore next */
  vconsoles$2.forEach(vc => vc.print(args));
};

const vconsoles$2 = new Set();

/**
 * Utility module to create and manipulate Iterators.
 *
 * @module iterator
 */

/**
 * @template T
 * @param {function():IteratorResult<T>} next
 * @return {IterableIterator<T>}
 */
const createIterator$2 = next => ({
  /**
   * @return {IterableIterator<T>}
   */
  [Symbol.iterator] () {
    return this
  },
  // @ts-ignore
  next
});

/**
 * @template T
 * @param {Iterator<T>} iterator
 * @param {function(T):boolean} filter
 */
const iteratorFilter$2 = (iterator, filter) => createIterator$2(() => {
  let res;
  do {
    res = iterator.next();
  } while (!res.done && !filter(res.value))
  return res
});

/**
 * @template T,M
 * @param {Iterator<T>} iterator
 * @param {function(T):M} fmap
 */
const iteratorMap$2 = (iterator, fmap) => createIterator$2(() => {
  const { done, value } = iterator.next();
  return { done, value: done ? undefined : fmap(value) }
});

/**
 * This is an abstract interface that all Connectors should implement to keep them interchangeable.
 *
 * @note This interface is experimental and it is not advised to actually inherit this class.
 *       It just serves as typing information.
 *
 * @extends {Observable<any>}
 */
class AbstractConnector$1 extends Observable$1 {
  /**
   * @param {Doc} ydoc
   * @param {any} awareness
   */
  constructor (ydoc, awareness) {
    super();
    this.doc = ydoc;
    this.awareness = awareness;
  }
}

class DeleteItem$1 {
  /**
   * @param {number} clock
   * @param {number} len
   */
  constructor (clock, len) {
    /**
     * @type {number}
     */
    this.clock = clock;
    /**
     * @type {number}
     */
    this.len = len;
  }
}

/**
 * We no longer maintain a DeleteStore. DeleteSet is a temporary object that is created when needed.
 * - When created in a transaction, it must only be accessed after sorting, and merging
 *   - This DeleteSet is send to other clients
 * - We do not create a DeleteSet when we send a sync message. The DeleteSet message is created directly from StructStore
 * - We read a DeleteSet as part of a sync/update message. In this case the DeleteSet is already sorted and merged.
 */
class DeleteSet$1 {
  constructor () {
    /**
     * @type {Map<number,Array<DeleteItem>>}
     */
    this.clients = new Map();
  }
}

/**
 * Iterate over all structs that the DeleteSet gc's.
 *
 * @param {Transaction} transaction
 * @param {DeleteSet} ds
 * @param {function(GC|Item):void} f
 *
 * @function
 */
const iterateDeletedStructs$1 = (transaction, ds, f) =>
  ds.clients.forEach((deletes, clientid) => {
    const structs = /** @type {Array<GC|Item>} */ (transaction.doc.store.clients.get(clientid));
    for (let i = 0; i < deletes.length; i++) {
      const del = deletes[i];
      iterateStructs$1(transaction, structs, del.clock, del.len, f);
    }
  });

/**
 * @param {Array<DeleteItem>} dis
 * @param {number} clock
 * @return {number|null}
 *
 * @private
 * @function
 */
const findIndexDS$1 = (dis, clock) => {
  let left = 0;
  let right = dis.length - 1;
  while (left <= right) {
    const midindex = floor$2((left + right) / 2);
    const mid = dis[midindex];
    const midclock = mid.clock;
    if (midclock <= clock) {
      if (clock < midclock + mid.len) {
        return midindex
      }
      left = midindex + 1;
    } else {
      right = midindex - 1;
    }
  }
  return null
};

/**
 * @param {DeleteSet} ds
 * @param {ID} id
 * @return {boolean}
 *
 * @private
 * @function
 */
const isDeleted$1 = (ds, id) => {
  const dis = ds.clients.get(id.client);
  return dis !== undefined && findIndexDS$1(dis, id.clock) !== null
};

/**
 * @param {DeleteSet} ds
 *
 * @private
 * @function
 */
const sortAndMergeDeleteSet$1 = ds => {
  ds.clients.forEach(dels => {
    dels.sort((a, b) => a.clock - b.clock);
    // merge items without filtering or splicing the array
    // i is the current pointer
    // j refers to the current insert position for the pointed item
    // try to merge dels[i] into dels[j-1] or set dels[j]=dels[i]
    let i, j;
    for (i = 1, j = 1; i < dels.length; i++) {
      const left = dels[j - 1];
      const right = dels[i];
      if (left.clock + left.len >= right.clock) {
        left.len = max$2(left.len, right.clock + right.len - left.clock);
      } else {
        if (j < i) {
          dels[j] = right;
        }
        j++;
      }
    }
    dels.length = j;
  });
};

/**
 * @param {Array<DeleteSet>} dss
 * @return {DeleteSet} A fresh DeleteSet
 */
const mergeDeleteSets$1 = dss => {
  const merged = new DeleteSet$1();
  for (let dssI = 0; dssI < dss.length; dssI++) {
    dss[dssI].clients.forEach((delsLeft, client) => {
      if (!merged.clients.has(client)) {
        // Write all missing keys from current ds and all following.
        // If merged already contains `client` current ds has already been added.
        /**
         * @type {Array<DeleteItem>}
         */
        const dels = delsLeft.slice();
        for (let i = dssI + 1; i < dss.length; i++) {
          appendTo$2(dels, dss[i].clients.get(client) || []);
        }
        merged.clients.set(client, dels);
      }
    });
  }
  sortAndMergeDeleteSet$1(merged);
  return merged
};

/**
 * @param {DeleteSet} ds
 * @param {number} client
 * @param {number} clock
 * @param {number} length
 *
 * @private
 * @function
 */
const addToDeleteSet$1 = (ds, client, clock, length) => {
  setIfUndefined$2(ds.clients, client, () => []).push(new DeleteItem$1(clock, length));
};

const createDeleteSet$1 = () => new DeleteSet$1();

/**
 * @param {StructStore} ss
 * @return {DeleteSet} Merged and sorted DeleteSet
 *
 * @private
 * @function
 */
const createDeleteSetFromStructStore$1 = ss => {
  const ds = createDeleteSet$1();
  ss.clients.forEach((structs, client) => {
    /**
     * @type {Array<DeleteItem>}
     */
    const dsitems = [];
    for (let i = 0; i < structs.length; i++) {
      const struct = structs[i];
      if (struct.deleted) {
        const clock = struct.id.clock;
        let len = struct.length;
        if (i + 1 < structs.length) {
          for (let next = structs[i + 1]; i + 1 < structs.length && next.deleted; next = structs[++i + 1]) {
            len += next.length;
          }
        }
        dsitems.push(new DeleteItem$1(clock, len));
      }
    }
    if (dsitems.length > 0) {
      ds.clients.set(client, dsitems);
    }
  });
  return ds
};

/**
 * @param {DSEncoderV1 | DSEncoderV2} encoder
 * @param {DeleteSet} ds
 *
 * @private
 * @function
 */
const writeDeleteSet$1 = (encoder, ds) => {
  writeVarUint$2(encoder.restEncoder, ds.clients.size);
  ds.clients.forEach((dsitems, client) => {
    encoder.resetDsCurVal();
    writeVarUint$2(encoder.restEncoder, client);
    const len = dsitems.length;
    writeVarUint$2(encoder.restEncoder, len);
    for (let i = 0; i < len; i++) {
      const item = dsitems[i];
      encoder.writeDsClock(item.clock);
      encoder.writeDsLen(item.len);
    }
  });
};

/**
 * @param {DSDecoderV1 | DSDecoderV2} decoder
 * @return {DeleteSet}
 *
 * @private
 * @function
 */
const readDeleteSet$1 = decoder => {
  const ds = new DeleteSet$1();
  const numClients = readVarUint$2(decoder.restDecoder);
  for (let i = 0; i < numClients; i++) {
    decoder.resetDsCurVal();
    const client = readVarUint$2(decoder.restDecoder);
    const numberOfDeletes = readVarUint$2(decoder.restDecoder);
    if (numberOfDeletes > 0) {
      const dsField = setIfUndefined$2(ds.clients, client, () => []);
      for (let i = 0; i < numberOfDeletes; i++) {
        dsField.push(new DeleteItem$1(decoder.readDsClock(), decoder.readDsLen()));
      }
    }
  }
  return ds
};

/**
 * @todo YDecoder also contains references to String and other Decoders. Would make sense to exchange YDecoder.toUint8Array for YDecoder.DsToUint8Array()..
 */

/**
 * @param {DSDecoderV1 | DSDecoderV2} decoder
 * @param {Transaction} transaction
 * @param {StructStore} store
 * @return {Uint8Array|null} Returns a v2 update containing all deletes that couldn't be applied yet; or null if all deletes were applied successfully.
 *
 * @private
 * @function
 */
const readAndApplyDeleteSet$1 = (decoder, transaction, store) => {
  const unappliedDS = new DeleteSet$1();
  const numClients = readVarUint$2(decoder.restDecoder);
  for (let i = 0; i < numClients; i++) {
    decoder.resetDsCurVal();
    const client = readVarUint$2(decoder.restDecoder);
    const numberOfDeletes = readVarUint$2(decoder.restDecoder);
    const structs = store.clients.get(client) || [];
    const state = getState$1(store, client);
    for (let i = 0; i < numberOfDeletes; i++) {
      const clock = decoder.readDsClock();
      const clockEnd = clock + decoder.readDsLen();
      if (clock < state) {
        if (state < clockEnd) {
          addToDeleteSet$1(unappliedDS, client, state, clockEnd - state);
        }
        let index = findIndexSS$1(structs, clock);
        /**
         * We can ignore the case of GC and Delete structs, because we are going to skip them
         * @type {Item}
         */
        // @ts-ignore
        let struct = structs[index];
        // split the first item if necessary
        if (!struct.deleted && struct.id.clock < clock) {
          structs.splice(index + 1, 0, splitItem$1(transaction, struct, clock - struct.id.clock));
          index++; // increase we now want to use the next struct
        }
        while (index < structs.length) {
          // @ts-ignore
          struct = structs[index++];
          if (struct.id.clock < clockEnd) {
            if (!struct.deleted) {
              if (clockEnd < struct.id.clock + struct.length) {
                structs.splice(index, 0, splitItem$1(transaction, struct, clockEnd - struct.id.clock));
              }
              struct.delete(transaction);
            }
          } else {
            break
          }
        }
      } else {
        addToDeleteSet$1(unappliedDS, client, clock, clockEnd - clock);
      }
    }
  }
  if (unappliedDS.clients.size > 0) {
    const ds = new UpdateEncoderV2$1();
    writeVarUint$2(ds.restEncoder, 0); // encode 0 structs
    writeDeleteSet$1(ds, unappliedDS);
    return ds.toUint8Array()
  }
  return null
};

/**
 * @module Y
 */

const generateNewClientId$1 = uint32$1;

/**
 * @typedef {Object} DocOpts
 * @property {boolean} [DocOpts.gc=true] Disable garbage collection (default: gc=true)
 * @property {function(Item):boolean} [DocOpts.gcFilter] Will be called before an Item is garbage collected. Return false to keep the Item.
 * @property {string} [DocOpts.guid] Define a globally unique identifier for this document
 * @property {string | null} [DocOpts.collectionid] Associate this document with a collection. This only plays a role if your provider has a concept of collection.
 * @property {any} [DocOpts.meta] Any kind of meta information you want to associate with this document. If this is a subdocument, remote peers will store the meta information as well.
 * @property {boolean} [DocOpts.autoLoad] If a subdocument, automatically load document. If this is a subdocument, remote peers will load the document as well automatically.
 * @property {boolean} [DocOpts.shouldLoad] Whether the document should be synced by the provider now. This is toggled to true when you call ydoc.load()
 */

/**
 * A Yjs instance handles the state of shared data.
 * @extends Observable<string>
 */
class Doc$1 extends Observable$1 {
  /**
   * @param {DocOpts} [opts] configuration
   */
  constructor ({ guid = uuidv4$1(), collectionid = null, gc = true, gcFilter = () => true, meta = null, autoLoad = false, shouldLoad = true } = {}) {
    super();
    this.gc = gc;
    this.gcFilter = gcFilter;
    this.clientID = generateNewClientId$1();
    this.guid = guid;
    this.collectionid = collectionid;
    /**
     * @type {Map<string, AbstractType<YEvent>>}
     */
    this.share = new Map();
    this.store = new StructStore$1();
    /**
     * @type {Transaction | null}
     */
    this._transaction = null;
    /**
     * @type {Array<Transaction>}
     */
    this._transactionCleanups = [];
    /**
     * @type {Set<Doc>}
     */
    this.subdocs = new Set();
    /**
     * If this document is a subdocument - a document integrated into another document - then _item is defined.
     * @type {Item?}
     */
    this._item = null;
    this.shouldLoad = shouldLoad;
    this.autoLoad = autoLoad;
    this.meta = meta;
    this.isLoaded = false;
    this.whenLoaded = create$h(resolve => {
      this.on('load', () => {
        this.isLoaded = true;
        resolve(this);
      });
    });
  }

  /**
   * Notify the parent document that you request to load data into this subdocument (if it is a subdocument).
   *
   * `load()` might be used in the future to request any provider to load the most current data.
   *
   * It is safe to call `load()` multiple times.
   */
  load () {
    const item = this._item;
    if (item !== null && !this.shouldLoad) {
      transact$1(/** @type {any} */ (item.parent).doc, transaction => {
        transaction.subdocsLoaded.add(this);
      }, null, true);
    }
    this.shouldLoad = true;
  }

  getSubdocs () {
    return this.subdocs
  }

  getSubdocGuids () {
    return new Set(Array.from(this.subdocs).map(doc => doc.guid))
  }

  /**
   * Changes that happen inside of a transaction are bundled. This means that
   * the observer fires _after_ the transaction is finished and that all changes
   * that happened inside of the transaction are sent as one message to the
   * other peers.
   *
   * @param {function(Transaction):void} f The function that should be executed as a transaction
   * @param {any} [origin] Origin of who started the transaction. Will be stored on transaction.origin
   *
   * @public
   */
  transact (f, origin = null) {
    transact$1(this, f, origin);
  }

  /**
   * Define a shared data type.
   *
   * Multiple calls of `y.get(name, TypeConstructor)` yield the same result
   * and do not overwrite each other. I.e.
   * `y.define(name, Y.Array) === y.define(name, Y.Array)`
   *
   * After this method is called, the type is also available on `y.share.get(name)`.
   *
   * *Best Practices:*
   * Define all types right after the Yjs instance is created and store them in a separate object.
   * Also use the typed methods `getText(name)`, `getArray(name)`, ..
   *
   * @example
   *   const y = new Y(..)
   *   const appState = {
   *     document: y.getText('document')
   *     comments: y.getArray('comments')
   *   }
   *
   * @param {string} name
   * @param {Function} TypeConstructor The constructor of the type definition. E.g. Y.Text, Y.Array, Y.Map, ...
   * @return {AbstractType<any>} The created type. Constructed with TypeConstructor
   *
   * @public
   */
  get (name, TypeConstructor = AbstractType$1) {
    const type = setIfUndefined$2(this.share, name, () => {
      // @ts-ignore
      const t = new TypeConstructor();
      t._integrate(this, null);
      return t
    });
    const Constr = type.constructor;
    if (TypeConstructor !== AbstractType$1 && Constr !== TypeConstructor) {
      if (Constr === AbstractType$1) {
        // @ts-ignore
        const t = new TypeConstructor();
        t._map = type._map;
        type._map.forEach(/** @param {Item?} n */ n => {
          for (; n !== null; n = n.left) {
            // @ts-ignore
            n.parent = t;
          }
        });
        t._start = type._start;
        for (let n = t._start; n !== null; n = n.right) {
          n.parent = t;
        }
        t._length = type._length;
        this.share.set(name, t);
        t._integrate(this, null);
        return t
      } else {
        throw new Error(`Type with the name ${name} has already been defined with a different constructor`)
      }
    }
    return type
  }

  /**
   * @template T
   * @param {string} [name]
   * @return {YArray<T>}
   *
   * @public
   */
  getArray (name = '') {
    // @ts-ignore
    return this.get(name, YArray$1)
  }

  /**
   * @param {string} [name]
   * @return {YText}
   *
   * @public
   */
  getText (name = '') {
    // @ts-ignore
    return this.get(name, YText$1)
  }

  /**
   * @template T
   * @param {string} [name]
   * @return {YMap<T>}
   *
   * @public
   */
  getMap (name = '') {
    // @ts-ignore
    return this.get(name, YMap$1)
  }

  /**
   * @param {string} [name]
   * @return {YXmlFragment}
   *
   * @public
   */
  getXmlFragment (name = '') {
    // @ts-ignore
    return this.get(name, YXmlFragment$1)
  }

  /**
   * Converts the entire document into a js object, recursively traversing each yjs type
   * Doesn't log types that have not been defined (using ydoc.getType(..)).
   *
   * @deprecated Do not use this method and rather call toJSON directly on the shared types.
   *
   * @return {Object<string, any>}
   */
  toJSON () {
    /**
     * @type {Object<string, any>}
     */
    const doc = {};

    this.share.forEach((value, key) => {
      doc[key] = value.toJSON();
    });

    return doc
  }

  /**
   * Emit `destroy` event and unregister all event handlers.
   */
  destroy () {
    from$3(this.subdocs).forEach(subdoc => subdoc.destroy());
    const item = this._item;
    if (item !== null) {
      this._item = null;
      const content = /** @type {ContentDoc} */ (item.content);
      content.doc = new Doc$1({ guid: this.guid, ...content.opts, shouldLoad: false });
      content.doc._item = item;
      transact$1(/** @type {any} */ (item).parent.doc, transaction => {
        const doc = content.doc;
        if (!item.deleted) {
          transaction.subdocsAdded.add(doc);
        }
        transaction.subdocsRemoved.add(this);
      }, null, true);
    }
    this.emit('destroyed', [true]);
    this.emit('destroy', [this]);
    super.destroy();
  }

  /**
   * @param {string} eventName
   * @param {function(...any):any} f
   */
  on (eventName, f) {
    super.on(eventName, f);
  }

  /**
   * @param {string} eventName
   * @param {function} f
   */
  off (eventName, f) {
    super.off(eventName, f);
  }
}

class DSDecoderV1$1 {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor (decoder) {
    this.restDecoder = decoder;
  }

  resetDsCurVal () {
    // nop
  }

  /**
   * @return {number}
   */
  readDsClock () {
    return readVarUint$2(this.restDecoder)
  }

  /**
   * @return {number}
   */
  readDsLen () {
    return readVarUint$2(this.restDecoder)
  }
}

class UpdateDecoderV1$1 extends DSDecoderV1$1 {
  /**
   * @return {ID}
   */
  readLeftID () {
    return createID$1(readVarUint$2(this.restDecoder), readVarUint$2(this.restDecoder))
  }

  /**
   * @return {ID}
   */
  readRightID () {
    return createID$1(readVarUint$2(this.restDecoder), readVarUint$2(this.restDecoder))
  }

  /**
   * Read the next client id.
   * Use this in favor of readID whenever possible to reduce the number of objects created.
   */
  readClient () {
    return readVarUint$2(this.restDecoder)
  }

  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readInfo () {
    return readUint8$2(this.restDecoder)
  }

  /**
   * @return {string}
   */
  readString () {
    return readVarString$2(this.restDecoder)
  }

  /**
   * @return {boolean} isKey
   */
  readParentInfo () {
    return readVarUint$2(this.restDecoder) === 1
  }

  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readTypeRef () {
    return readVarUint$2(this.restDecoder)
  }

  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @return {number} len
   */
  readLen () {
    return readVarUint$2(this.restDecoder)
  }

  /**
   * @return {any}
   */
  readAny () {
    return readAny$2(this.restDecoder)
  }

  /**
   * @return {Uint8Array}
   */
  readBuf () {
    return copyUint8Array$2(readVarUint8Array$2(this.restDecoder))
  }

  /**
   * Legacy implementation uses JSON parse. We use any-decoding in v2.
   *
   * @return {any}
   */
  readJSON () {
    return JSON.parse(readVarString$2(this.restDecoder))
  }

  /**
   * @return {string}
   */
  readKey () {
    return readVarString$2(this.restDecoder)
  }
}

class DSDecoderV2$1 {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor (decoder) {
    /**
     * @private
     */
    this.dsCurrVal = 0;
    this.restDecoder = decoder;
  }

  resetDsCurVal () {
    this.dsCurrVal = 0;
  }

  /**
   * @return {number}
   */
  readDsClock () {
    this.dsCurrVal += readVarUint$2(this.restDecoder);
    return this.dsCurrVal
  }

  /**
   * @return {number}
   */
  readDsLen () {
    const diff = readVarUint$2(this.restDecoder) + 1;
    this.dsCurrVal += diff;
    return diff
  }
}

class UpdateDecoderV2$1 extends DSDecoderV2$1 {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor (decoder) {
    super(decoder);
    /**
     * List of cached keys. If the keys[id] does not exist, we read a new key
     * from stringEncoder and push it to keys.
     *
     * @type {Array<string>}
     */
    this.keys = [];
    readVarUint$2(decoder); // read feature flag - currently unused
    this.keyClockDecoder = new IntDiffOptRleDecoder$2(readVarUint8Array$2(decoder));
    this.clientDecoder = new UintOptRleDecoder$2(readVarUint8Array$2(decoder));
    this.leftClockDecoder = new IntDiffOptRleDecoder$2(readVarUint8Array$2(decoder));
    this.rightClockDecoder = new IntDiffOptRleDecoder$2(readVarUint8Array$2(decoder));
    this.infoDecoder = new RleDecoder$2(readVarUint8Array$2(decoder), readUint8$2);
    this.stringDecoder = new StringDecoder$4(readVarUint8Array$2(decoder));
    this.parentInfoDecoder = new RleDecoder$2(readVarUint8Array$2(decoder), readUint8$2);
    this.typeRefDecoder = new UintOptRleDecoder$2(readVarUint8Array$2(decoder));
    this.lenDecoder = new UintOptRleDecoder$2(readVarUint8Array$2(decoder));
  }

  /**
   * @return {ID}
   */
  readLeftID () {
    return new ID$1(this.clientDecoder.read(), this.leftClockDecoder.read())
  }

  /**
   * @return {ID}
   */
  readRightID () {
    return new ID$1(this.clientDecoder.read(), this.rightClockDecoder.read())
  }

  /**
   * Read the next client id.
   * Use this in favor of readID whenever possible to reduce the number of objects created.
   */
  readClient () {
    return this.clientDecoder.read()
  }

  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readInfo () {
    return /** @type {number} */ (this.infoDecoder.read())
  }

  /**
   * @return {string}
   */
  readString () {
    return this.stringDecoder.read()
  }

  /**
   * @return {boolean}
   */
  readParentInfo () {
    return this.parentInfoDecoder.read() === 1
  }

  /**
   * @return {number} An unsigned 8-bit integer
   */
  readTypeRef () {
    return this.typeRefDecoder.read()
  }

  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @return {number}
   */
  readLen () {
    return this.lenDecoder.read()
  }

  /**
   * @return {any}
   */
  readAny () {
    return readAny$2(this.restDecoder)
  }

  /**
   * @return {Uint8Array}
   */
  readBuf () {
    return readVarUint8Array$2(this.restDecoder)
  }

  /**
   * This is mainly here for legacy purposes.
   *
   * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
   *
   * @return {any}
   */
  readJSON () {
    return readAny$2(this.restDecoder)
  }

  /**
   * @return {string}
   */
  readKey () {
    const keyClock = this.keyClockDecoder.read();
    if (keyClock < this.keys.length) {
      return this.keys[keyClock]
    } else {
      const key = this.stringDecoder.read();
      this.keys.push(key);
      return key
    }
  }
}

class DSEncoderV1$1 {
  constructor () {
    this.restEncoder = createEncoder$2();
  }

  toUint8Array () {
    return toUint8Array$2(this.restEncoder)
  }

  resetDsCurVal () {
    // nop
  }

  /**
   * @param {number} clock
   */
  writeDsClock (clock) {
    writeVarUint$2(this.restEncoder, clock);
  }

  /**
   * @param {number} len
   */
  writeDsLen (len) {
    writeVarUint$2(this.restEncoder, len);
  }
}

class UpdateEncoderV1$1 extends DSEncoderV1$1 {
  /**
   * @param {ID} id
   */
  writeLeftID (id) {
    writeVarUint$2(this.restEncoder, id.client);
    writeVarUint$2(this.restEncoder, id.clock);
  }

  /**
   * @param {ID} id
   */
  writeRightID (id) {
    writeVarUint$2(this.restEncoder, id.client);
    writeVarUint$2(this.restEncoder, id.clock);
  }

  /**
   * Use writeClient and writeClock instead of writeID if possible.
   * @param {number} client
   */
  writeClient (client) {
    writeVarUint$2(this.restEncoder, client);
  }

  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeInfo (info) {
    writeUint8$2(this.restEncoder, info);
  }

  /**
   * @param {string} s
   */
  writeString (s) {
    writeVarString$2(this.restEncoder, s);
  }

  /**
   * @param {boolean} isYKey
   */
  writeParentInfo (isYKey) {
    writeVarUint$2(this.restEncoder, isYKey ? 1 : 0);
  }

  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeTypeRef (info) {
    writeVarUint$2(this.restEncoder, info);
  }

  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @param {number} len
   */
  writeLen (len) {
    writeVarUint$2(this.restEncoder, len);
  }

  /**
   * @param {any} any
   */
  writeAny (any) {
    writeAny$2(this.restEncoder, any);
  }

  /**
   * @param {Uint8Array} buf
   */
  writeBuf (buf) {
    writeVarUint8Array$2(this.restEncoder, buf);
  }

  /**
   * @param {any} embed
   */
  writeJSON (embed) {
    writeVarString$2(this.restEncoder, JSON.stringify(embed));
  }

  /**
   * @param {string} key
   */
  writeKey (key) {
    writeVarString$2(this.restEncoder, key);
  }
}

class DSEncoderV2$1 {
  constructor () {
    this.restEncoder = createEncoder$2(); // encodes all the rest / non-optimized
    this.dsCurrVal = 0;
  }

  toUint8Array () {
    return toUint8Array$2(this.restEncoder)
  }

  resetDsCurVal () {
    this.dsCurrVal = 0;
  }

  /**
   * @param {number} clock
   */
  writeDsClock (clock) {
    const diff = clock - this.dsCurrVal;
    this.dsCurrVal = clock;
    writeVarUint$2(this.restEncoder, diff);
  }

  /**
   * @param {number} len
   */
  writeDsLen (len) {
    if (len === 0) {
      unexpectedCase$2();
    }
    writeVarUint$2(this.restEncoder, len - 1);
    this.dsCurrVal += len;
  }
}

class UpdateEncoderV2$1 extends DSEncoderV2$1 {
  constructor () {
    super();
    /**
     * @type {Map<string,number>}
     */
    this.keyMap = new Map();
    /**
     * Refers to the next uniqe key-identifier to me used.
     * See writeKey method for more information.
     *
     * @type {number}
     */
    this.keyClock = 0;
    this.keyClockEncoder = new IntDiffOptRleEncoder$2();
    this.clientEncoder = new UintOptRleEncoder$2();
    this.leftClockEncoder = new IntDiffOptRleEncoder$2();
    this.rightClockEncoder = new IntDiffOptRleEncoder$2();
    this.infoEncoder = new RleEncoder$2(writeUint8$2);
    this.stringEncoder = new StringEncoder$2();
    this.parentInfoEncoder = new RleEncoder$2(writeUint8$2);
    this.typeRefEncoder = new UintOptRleEncoder$2();
    this.lenEncoder = new UintOptRleEncoder$2();
  }

  toUint8Array () {
    const encoder = createEncoder$2();
    writeVarUint$2(encoder, 0); // this is a feature flag that we might use in the future
    writeVarUint8Array$2(encoder, this.keyClockEncoder.toUint8Array());
    writeVarUint8Array$2(encoder, this.clientEncoder.toUint8Array());
    writeVarUint8Array$2(encoder, this.leftClockEncoder.toUint8Array());
    writeVarUint8Array$2(encoder, this.rightClockEncoder.toUint8Array());
    writeVarUint8Array$2(encoder, toUint8Array$2(this.infoEncoder));
    writeVarUint8Array$2(encoder, this.stringEncoder.toUint8Array());
    writeVarUint8Array$2(encoder, toUint8Array$2(this.parentInfoEncoder));
    writeVarUint8Array$2(encoder, this.typeRefEncoder.toUint8Array());
    writeVarUint8Array$2(encoder, this.lenEncoder.toUint8Array());
    // @note The rest encoder is appended! (note the missing var)
    writeUint8Array$2(encoder, toUint8Array$2(this.restEncoder));
    return toUint8Array$2(encoder)
  }

  /**
   * @param {ID} id
   */
  writeLeftID (id) {
    this.clientEncoder.write(id.client);
    this.leftClockEncoder.write(id.clock);
  }

  /**
   * @param {ID} id
   */
  writeRightID (id) {
    this.clientEncoder.write(id.client);
    this.rightClockEncoder.write(id.clock);
  }

  /**
   * @param {number} client
   */
  writeClient (client) {
    this.clientEncoder.write(client);
  }

  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeInfo (info) {
    this.infoEncoder.write(info);
  }

  /**
   * @param {string} s
   */
  writeString (s) {
    this.stringEncoder.write(s);
  }

  /**
   * @param {boolean} isYKey
   */
  writeParentInfo (isYKey) {
    this.parentInfoEncoder.write(isYKey ? 1 : 0);
  }

  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeTypeRef (info) {
    this.typeRefEncoder.write(info);
  }

  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @param {number} len
   */
  writeLen (len) {
    this.lenEncoder.write(len);
  }

  /**
   * @param {any} any
   */
  writeAny (any) {
    writeAny$2(this.restEncoder, any);
  }

  /**
   * @param {Uint8Array} buf
   */
  writeBuf (buf) {
    writeVarUint8Array$2(this.restEncoder, buf);
  }

  /**
   * This is mainly here for legacy purposes.
   *
   * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
   *
   * @param {any} embed
   */
  writeJSON (embed) {
    writeAny$2(this.restEncoder, embed);
  }

  /**
   * Property keys are often reused. For example, in y-prosemirror the key `bold` might
   * occur very often. For a 3d application, the key `position` might occur very often.
   *
   * We cache these keys in a Map and refer to them via a unique number.
   *
   * @param {string} key
   */
  writeKey (key) {
    const clock = this.keyMap.get(key);
    if (clock === undefined) {
      this.keyClockEncoder.write(this.keyClock++);
      this.stringEncoder.write(key);
    } else {
      this.keyClockEncoder.write(this.keyClock++);
    }
  }
}

/**
 * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
 * @param {Array<GC|Item>} structs All structs by `client`
 * @param {number} client
 * @param {number} clock write structs starting with `ID(client,clock)`
 *
 * @function
 */
const writeStructs$1 = (encoder, structs, client, clock) => {
  // write first id
  clock = max$2(clock, structs[0].id.clock); // make sure the first id exists
  const startNewStructs = findIndexSS$1(structs, clock);
  // write # encoded structs
  writeVarUint$2(encoder.restEncoder, structs.length - startNewStructs);
  encoder.writeClient(client);
  writeVarUint$2(encoder.restEncoder, clock);
  const firstStruct = structs[startNewStructs];
  // write first struct with an offset
  firstStruct.write(encoder, clock - firstStruct.id.clock);
  for (let i = startNewStructs + 1; i < structs.length; i++) {
    structs[i].write(encoder, 0);
  }
};

/**
 * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
 * @param {StructStore} store
 * @param {Map<number,number>} _sm
 *
 * @private
 * @function
 */
const writeClientsStructs$1 = (encoder, store, _sm) => {
  // we filter all valid _sm entries into sm
  const sm = new Map();
  _sm.forEach((clock, client) => {
    // only write if new structs are available
    if (getState$1(store, client) > clock) {
      sm.set(client, clock);
    }
  });
  getStateVector$1(store).forEach((clock, client) => {
    if (!_sm.has(client)) {
      sm.set(client, 0);
    }
  });
  // write # states that were updated
  writeVarUint$2(encoder.restEncoder, sm.size);
  // Write items with higher client ids first
  // This heavily improves the conflict algorithm.
  Array.from(sm.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, clock]) => {
    // @ts-ignore
    writeStructs$1(encoder, store.clients.get(client), client, clock);
  });
};

/**
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder The decoder object to read data from.
 * @param {Doc} doc
 * @return {Map<number, { i: number, refs: Array<Item | GC> }>}
 *
 * @private
 * @function
 */
const readClientsStructRefs$1 = (decoder, doc) => {
  /**
   * @type {Map<number, { i: number, refs: Array<Item | GC> }>}
   */
  const clientRefs = create$j();
  const numOfStateUpdates = readVarUint$2(decoder.restDecoder);
  for (let i = 0; i < numOfStateUpdates; i++) {
    const numberOfStructs = readVarUint$2(decoder.restDecoder);
    /**
     * @type {Array<GC|Item>}
     */
    const refs = new Array(numberOfStructs);
    const client = decoder.readClient();
    let clock = readVarUint$2(decoder.restDecoder);
    // const start = performance.now()
    clientRefs.set(client, { i: 0, refs });
    for (let i = 0; i < numberOfStructs; i++) {
      const info = decoder.readInfo();
      switch (BITS5$2 & info) {
        case 0: { // GC
          const len = decoder.readLen();
          refs[i] = new GC$1(createID$1(client, clock), len);
          clock += len;
          break
        }
        case 10: { // Skip Struct (nothing to apply)
          // @todo we could reduce the amount of checks by adding Skip struct to clientRefs so we know that something is missing.
          const len = readVarUint$2(decoder.restDecoder);
          refs[i] = new Skip$1(createID$1(client, clock), len);
          clock += len;
          break
        }
        default: { // Item with content
          /**
           * The optimized implementation doesn't use any variables because inlining variables is faster.
           * Below a non-optimized version is shown that implements the basic algorithm with
           * a few comments
           */
          const cantCopyParentInfo = (info & (BIT7$2 | BIT8$2)) === 0;
          // If parent = null and neither left nor right are defined, then we know that `parent` is child of `y`
          // and we read the next string as parentYKey.
          // It indicates how we store/retrieve parent from `y.share`
          // @type {string|null}
          const struct = new Item$2(
            createID$1(client, clock),
            null, // leftd
            (info & BIT8$2) === BIT8$2 ? decoder.readLeftID() : null, // origin
            null, // right
            (info & BIT7$2) === BIT7$2 ? decoder.readRightID() : null, // right origin
            cantCopyParentInfo ? (decoder.readParentInfo() ? doc.get(decoder.readString()) : decoder.readLeftID()) : null, // parent
            cantCopyParentInfo && (info & BIT6$2) === BIT6$2 ? decoder.readString() : null, // parentSub
            readItemContent$1(decoder, info) // item content
          );
          /* A non-optimized implementation of the above algorithm:

          // The item that was originally to the left of this item.
          const origin = (info & binary.BIT8) === binary.BIT8 ? decoder.readLeftID() : null
          // The item that was originally to the right of this item.
          const rightOrigin = (info & binary.BIT7) === binary.BIT7 ? decoder.readRightID() : null
          const cantCopyParentInfo = (info & (binary.BIT7 | binary.BIT8)) === 0
          const hasParentYKey = cantCopyParentInfo ? decoder.readParentInfo() : false
          // If parent = null and neither left nor right are defined, then we know that `parent` is child of `y`
          // and we read the next string as parentYKey.
          // It indicates how we store/retrieve parent from `y.share`
          // @type {string|null}
          const parentYKey = cantCopyParentInfo && hasParentYKey ? decoder.readString() : null

          const struct = new Item(
            createID(client, clock),
            null, // leftd
            origin, // origin
            null, // right
            rightOrigin, // right origin
            cantCopyParentInfo && !hasParentYKey ? decoder.readLeftID() : (parentYKey !== null ? doc.get(parentYKey) : null), // parent
            cantCopyParentInfo && (info & binary.BIT6) === binary.BIT6 ? decoder.readString() : null, // parentSub
            readItemContent(decoder, info) // item content
          )
          */
          refs[i] = struct;
          clock += struct.length;
        }
      }
    }
    // console.log('time to read: ', performance.now() - start) // @todo remove
  }
  return clientRefs
};

/**
 * Resume computing structs generated by struct readers.
 *
 * While there is something to do, we integrate structs in this order
 * 1. top element on stack, if stack is not empty
 * 2. next element from current struct reader (if empty, use next struct reader)
 *
 * If struct causally depends on another struct (ref.missing), we put next reader of
 * `ref.id.client` on top of stack.
 *
 * At some point we find a struct that has no causal dependencies,
 * then we start emptying the stack.
 *
 * It is not possible to have circles: i.e. struct1 (from client1) depends on struct2 (from client2)
 * depends on struct3 (from client1). Therefore the max stack size is eqaul to `structReaders.length`.
 *
 * This method is implemented in a way so that we can resume computation if this update
 * causally depends on another update.
 *
 * @param {Transaction} transaction
 * @param {StructStore} store
 * @param {Map<number, { i: number, refs: (GC | Item)[] }>} clientsStructRefs
 * @return { null | { update: Uint8Array, missing: Map<number,number> } }
 *
 * @private
 * @function
 */
const integrateStructs$1 = (transaction, store, clientsStructRefs) => {
  /**
   * @type {Array<Item | GC>}
   */
  const stack = [];
  // sort them so that we take the higher id first, in case of conflicts the lower id will probably not conflict with the id from the higher user.
  let clientsStructRefsIds = Array.from(clientsStructRefs.keys()).sort((a, b) => a - b);
  if (clientsStructRefsIds.length === 0) {
    return null
  }
  const getNextStructTarget = () => {
    if (clientsStructRefsIds.length === 0) {
      return null
    }
    let nextStructsTarget = /** @type {{i:number,refs:Array<GC|Item>}} */ (clientsStructRefs.get(clientsStructRefsIds[clientsStructRefsIds.length - 1]));
    while (nextStructsTarget.refs.length === nextStructsTarget.i) {
      clientsStructRefsIds.pop();
      if (clientsStructRefsIds.length > 0) {
        nextStructsTarget = /** @type {{i:number,refs:Array<GC|Item>}} */ (clientsStructRefs.get(clientsStructRefsIds[clientsStructRefsIds.length - 1]));
      } else {
        return null
      }
    }
    return nextStructsTarget
  };
  let curStructsTarget = getNextStructTarget();
  if (curStructsTarget === null && stack.length === 0) {
    return null
  }

  /**
   * @type {StructStore}
   */
  const restStructs = new StructStore$1();
  const missingSV = new Map();
  /**
   * @param {number} client
   * @param {number} clock
   */
  const updateMissingSv = (client, clock) => {
    const mclock = missingSV.get(client);
    if (mclock == null || mclock > clock) {
      missingSV.set(client, clock);
    }
  };
  /**
   * @type {GC|Item}
   */
  let stackHead = /** @type {any} */ (curStructsTarget).refs[/** @type {any} */ (curStructsTarget).i++];
  // caching the state because it is used very often
  const state = new Map();

  const addStackToRestSS = () => {
    for (const item of stack) {
      const client = item.id.client;
      const unapplicableItems = clientsStructRefs.get(client);
      if (unapplicableItems) {
        // decrement because we weren't able to apply previous operation
        unapplicableItems.i--;
        restStructs.clients.set(client, unapplicableItems.refs.slice(unapplicableItems.i));
        clientsStructRefs.delete(client);
        unapplicableItems.i = 0;
        unapplicableItems.refs = [];
      } else {
        // item was the last item on clientsStructRefs and the field was already cleared. Add item to restStructs and continue
        restStructs.clients.set(client, [item]);
      }
      // remove client from clientsStructRefsIds to prevent users from applying the same update again
      clientsStructRefsIds = clientsStructRefsIds.filter(c => c !== client);
    }
    stack.length = 0;
  };

  // iterate over all struct readers until we are done
  while (true) {
    if (stackHead.constructor !== Skip$1) {
      const localClock = setIfUndefined$2(state, stackHead.id.client, () => getState$1(store, stackHead.id.client));
      const offset = localClock - stackHead.id.clock;
      if (offset < 0) {
        // update from the same client is missing
        stack.push(stackHead);
        updateMissingSv(stackHead.id.client, stackHead.id.clock - 1);
        // hid a dead wall, add all items from stack to restSS
        addStackToRestSS();
      } else {
        const missing = stackHead.getMissing(transaction, store);
        if (missing !== null) {
          stack.push(stackHead);
          // get the struct reader that has the missing struct
          /**
           * @type {{ refs: Array<GC|Item>, i: number }}
           */
          const structRefs = clientsStructRefs.get(/** @type {number} */ (missing)) || { refs: [], i: 0 };
          if (structRefs.refs.length === structRefs.i) {
            // This update message causally depends on another update message that doesn't exist yet
            updateMissingSv(/** @type {number} */ (missing), getState$1(store, missing));
            addStackToRestSS();
          } else {
            stackHead = structRefs.refs[structRefs.i++];
            continue
          }
        } else if (offset === 0 || offset < stackHead.length) {
          // all fine, apply the stackhead
          stackHead.integrate(transaction, offset);
          state.set(stackHead.id.client, stackHead.id.clock + stackHead.length);
        }
      }
    }
    // iterate to next stackHead
    if (stack.length > 0) {
      stackHead = /** @type {GC|Item} */ (stack.pop());
    } else if (curStructsTarget !== null && curStructsTarget.i < curStructsTarget.refs.length) {
      stackHead = /** @type {GC|Item} */ (curStructsTarget.refs[curStructsTarget.i++]);
    } else {
      curStructsTarget = getNextStructTarget();
      if (curStructsTarget === null) {
        // we are done!
        break
      } else {
        stackHead = /** @type {GC|Item} */ (curStructsTarget.refs[curStructsTarget.i++]);
      }
    }
  }
  if (restStructs.clients.size > 0) {
    const encoder = new UpdateEncoderV2$1();
    writeClientsStructs$1(encoder, restStructs, new Map());
    // write empty deleteset
    // writeDeleteSet(encoder, new DeleteSet())
    writeVarUint$2(encoder.restEncoder, 0); // => no need for an extra function call, just write 0 deletes
    return { missing: missingSV, update: encoder.toUint8Array() }
  }
  return null
};

/**
 * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
 * @param {Transaction} transaction
 *
 * @private
 * @function
 */
const writeStructsFromTransaction$1 = (encoder, transaction) => writeClientsStructs$1(encoder, transaction.doc.store, transaction.beforeState);

/**
 * Read and apply a document update.
 *
 * This function has the same effect as `applyUpdate` but accepts an decoder.
 *
 * @param {decoding.Decoder} decoder
 * @param {Doc} ydoc
 * @param {any} [transactionOrigin] This will be stored on `transaction.origin` and `.on('update', (update, origin))`
 * @param {UpdateDecoderV1 | UpdateDecoderV2} [structDecoder]
 *
 * @function
 */
const readUpdateV2$1 = (decoder, ydoc, transactionOrigin, structDecoder = new UpdateDecoderV2$1(decoder)) =>
  transact$1(ydoc, transaction => {
    // force that transaction.local is set to non-local
    transaction.local = false;
    let retry = false;
    const doc = transaction.doc;
    const store = doc.store;
    // let start = performance.now()
    const ss = readClientsStructRefs$1(structDecoder, doc);
    // console.log('time to read structs: ', performance.now() - start) // @todo remove
    // start = performance.now()
    // console.log('time to merge: ', performance.now() - start) // @todo remove
    // start = performance.now()
    const restStructs = integrateStructs$1(transaction, store, ss);
    const pending = store.pendingStructs;
    if (pending) {
      // check if we can apply something
      for (const [client, clock] of pending.missing) {
        if (clock < getState$1(store, client)) {
          retry = true;
          break
        }
      }
      if (restStructs) {
        // merge restStructs into store.pending
        for (const [client, clock] of restStructs.missing) {
          const mclock = pending.missing.get(client);
          if (mclock == null || mclock > clock) {
            pending.missing.set(client, clock);
          }
        }
        pending.update = mergeUpdatesV2$1([pending.update, restStructs.update]);
      }
    } else {
      store.pendingStructs = restStructs;
    }
    // console.log('time to integrate: ', performance.now() - start) // @todo remove
    // start = performance.now()
    const dsRest = readAndApplyDeleteSet$1(structDecoder, transaction, store);
    if (store.pendingDs) {
      // @todo we could make a lower-bound state-vector check as we do above
      const pendingDSUpdate = new UpdateDecoderV2$1(createDecoder$2(store.pendingDs));
      readVarUint$2(pendingDSUpdate.restDecoder); // read 0 structs, because we only encode deletes in pendingdsupdate
      const dsRest2 = readAndApplyDeleteSet$1(pendingDSUpdate, transaction, store);
      if (dsRest && dsRest2) {
        // case 1: ds1 != null && ds2 != null
        store.pendingDs = mergeUpdatesV2$1([dsRest, dsRest2]);
      } else {
        // case 2: ds1 != null
        // case 3: ds2 != null
        // case 4: ds1 == null && ds2 == null
        store.pendingDs = dsRest || dsRest2;
      }
    } else {
      // Either dsRest == null && pendingDs == null OR dsRest != null
      store.pendingDs = dsRest;
    }
    // console.log('time to cleanup: ', performance.now() - start) // @todo remove
    // start = performance.now()

    // console.log('time to resume delete readers: ', performance.now() - start) // @todo remove
    // start = performance.now()
    if (retry) {
      const update = /** @type {{update: Uint8Array}} */ (store.pendingStructs).update;
      store.pendingStructs = null;
      applyUpdateV2$1(transaction.doc, update);
    }
  }, transactionOrigin, false);

/**
 * Apply a document update created by, for example, `y.on('update', update => ..)` or `update = encodeStateAsUpdate()`.
 *
 * This function has the same effect as `readUpdate` but accepts an Uint8Array instead of a Decoder.
 *
 * @param {Doc} ydoc
 * @param {Uint8Array} update
 * @param {any} [transactionOrigin] This will be stored on `transaction.origin` and `.on('update', (update, origin))`
 * @param {typeof UpdateDecoderV1 | typeof UpdateDecoderV2} [YDecoder]
 *
 * @function
 */
const applyUpdateV2$1 = (ydoc, update, transactionOrigin, YDecoder = UpdateDecoderV2$1) => {
  const decoder = createDecoder$2(update);
  readUpdateV2$1(decoder, ydoc, transactionOrigin, new YDecoder(decoder));
};

/**
 * Apply a document update created by, for example, `y.on('update', update => ..)` or `update = encodeStateAsUpdate()`.
 *
 * This function has the same effect as `readUpdate` but accepts an Uint8Array instead of a Decoder.
 *
 * @param {Doc} ydoc
 * @param {Uint8Array} update
 * @param {any} [transactionOrigin] This will be stored on `transaction.origin` and `.on('update', (update, origin))`
 *
 * @function
 */
const applyUpdate$1 = (ydoc, update, transactionOrigin) => applyUpdateV2$1(ydoc, update, transactionOrigin, UpdateDecoderV1$1);

/**
 * Write all the document as a single update message. If you specify the state of the remote client (`targetStateVector`) it will
 * only write the operations that are missing.
 *
 * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
 * @param {Doc} doc
 * @param {Map<number,number>} [targetStateVector] The state of the target that receives the update. Leave empty to write all known structs
 *
 * @function
 */
const writeStateAsUpdate$1 = (encoder, doc, targetStateVector = new Map()) => {
  writeClientsStructs$1(encoder, doc.store, targetStateVector);
  writeDeleteSet$1(encoder, createDeleteSetFromStructStore$1(doc.store));
};

/**
 * Write all the document as a single update message that can be applied on the remote document. If you specify the state of the remote client (`targetState`) it will
 * only write the operations that are missing.
 *
 * Use `writeStateAsUpdate` instead if you are working with lib0/encoding.js#Encoder
 *
 * @param {Doc} doc
 * @param {Uint8Array} [encodedTargetStateVector] The state of the target that receives the update. Leave empty to write all known structs
 * @param {UpdateEncoderV1 | UpdateEncoderV2} [encoder]
 * @return {Uint8Array}
 *
 * @function
 */
const encodeStateAsUpdateV2$1 = (doc, encodedTargetStateVector = new Uint8Array([0]), encoder = new UpdateEncoderV2$1()) => {
  const targetStateVector = decodeStateVector$1(encodedTargetStateVector);
  writeStateAsUpdate$1(encoder, doc, targetStateVector);
  const updates = [encoder.toUint8Array()];
  // also add the pending updates (if there are any)
  if (doc.store.pendingDs) {
    updates.push(doc.store.pendingDs);
  }
  if (doc.store.pendingStructs) {
    updates.push(diffUpdateV2$1(doc.store.pendingStructs.update, encodedTargetStateVector));
  }
  if (updates.length > 1) {
    if (encoder.constructor === UpdateEncoderV1$1) {
      return mergeUpdates$3(updates.map((update, i) => i === 0 ? update : convertUpdateFormatV2ToV1$1(update)))
    } else if (encoder.constructor === UpdateEncoderV2$1) {
      return mergeUpdatesV2$1(updates)
    }
  }
  return updates[0]
};

/**
 * Write all the document as a single update message that can be applied on the remote document. If you specify the state of the remote client (`targetState`) it will
 * only write the operations that are missing.
 *
 * Use `writeStateAsUpdate` instead if you are working with lib0/encoding.js#Encoder
 *
 * @param {Doc} doc
 * @param {Uint8Array} [encodedTargetStateVector] The state of the target that receives the update. Leave empty to write all known structs
 * @return {Uint8Array}
 *
 * @function
 */
const encodeStateAsUpdate$1 = (doc, encodedTargetStateVector) => encodeStateAsUpdateV2$1(doc, encodedTargetStateVector, new UpdateEncoderV1$1());

/**
 * Read state vector from Decoder and return as Map
 *
 * @param {DSDecoderV1 | DSDecoderV2} decoder
 * @return {Map<number,number>} Maps `client` to the number next expected `clock` from that client.
 *
 * @function
 */
const readStateVector$3 = decoder => {
  const ss = new Map();
  const ssLength = readVarUint$2(decoder.restDecoder);
  for (let i = 0; i < ssLength; i++) {
    const client = readVarUint$2(decoder.restDecoder);
    const clock = readVarUint$2(decoder.restDecoder);
    ss.set(client, clock);
  }
  return ss
};

/**
 * Read decodedState and return State as Map.
 *
 * @param {Uint8Array} decodedState
 * @return {Map<number,number>} Maps `client` to the number next expected `clock` from that client.
 *
 * @function
 */
// export const decodeStateVectorV2 = decodedState => readStateVector(new DSDecoderV2(decoding.createDecoder(decodedState)))

/**
 * Read decodedState and return State as Map.
 *
 * @param {Uint8Array} decodedState
 * @return {Map<number,number>} Maps `client` to the number next expected `clock` from that client.
 *
 * @function
 */
const decodeStateVector$1 = decodedState => readStateVector$3(new DSDecoderV1$1(createDecoder$2(decodedState)));

/**
 * @param {DSEncoderV1 | DSEncoderV2} encoder
 * @param {Map<number,number>} sv
 * @function
 */
const writeStateVector$3 = (encoder, sv) => {
  writeVarUint$2(encoder.restEncoder, sv.size);
  Array.from(sv.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, clock]) => {
    writeVarUint$2(encoder.restEncoder, client); // @todo use a special client decoder that is based on mapping
    writeVarUint$2(encoder.restEncoder, clock);
  });
  return encoder
};

/**
 * @param {DSEncoderV1 | DSEncoderV2} encoder
 * @param {Doc} doc
 *
 * @function
 */
const writeDocumentStateVector$1 = (encoder, doc) => writeStateVector$3(encoder, getStateVector$1(doc.store));

/**
 * Encode State as Uint8Array.
 *
 * @param {Doc|Map<number,number>} doc
 * @param {DSEncoderV1 | DSEncoderV2} [encoder]
 * @return {Uint8Array}
 *
 * @function
 */
const encodeStateVectorV2$1 = (doc, encoder = new DSEncoderV2$1()) => {
  if (doc instanceof Map) {
    writeStateVector$3(encoder, doc);
  } else {
    writeDocumentStateVector$1(encoder, doc);
  }
  return encoder.toUint8Array()
};

/**
 * Encode State as Uint8Array.
 *
 * @param {Doc|Map<number,number>} doc
 * @return {Uint8Array}
 *
 * @function
 */
const encodeStateVector$1 = doc => encodeStateVectorV2$1(doc, new DSEncoderV1$1());

/**
 * General event handler implementation.
 *
 * @template ARG0, ARG1
 *
 * @private
 */
class EventHandler$1 {
  constructor () {
    /**
     * @type {Array<function(ARG0, ARG1):void>}
     */
    this.l = [];
  }
}

/**
 * @template ARG0,ARG1
 * @returns {EventHandler<ARG0,ARG1>}
 *
 * @private
 * @function
 */
const createEventHandler$1 = () => new EventHandler$1();

/**
 * Adds an event listener that is called when
 * {@link EventHandler#callEventListeners} is called.
 *
 * @template ARG0,ARG1
 * @param {EventHandler<ARG0,ARG1>} eventHandler
 * @param {function(ARG0,ARG1):void} f The event handler.
 *
 * @private
 * @function
 */
const addEventHandlerListener$1 = (eventHandler, f) =>
  eventHandler.l.push(f);

/**
 * Removes an event listener.
 *
 * @template ARG0,ARG1
 * @param {EventHandler<ARG0,ARG1>} eventHandler
 * @param {function(ARG0,ARG1):void} f The event handler that was added with
 *                     {@link EventHandler#addEventListener}
 *
 * @private
 * @function
 */
const removeEventHandlerListener$1 = (eventHandler, f) => {
  const l = eventHandler.l;
  const len = l.length;
  eventHandler.l = l.filter(g => f !== g);
  if (len === eventHandler.l.length) {
    console.error('[yjs] Tried to remove event handler that doesn\'t exist.');
  }
};

/**
 * Call all event listeners that were added via
 * {@link EventHandler#addEventListener}.
 *
 * @template ARG0,ARG1
 * @param {EventHandler<ARG0,ARG1>} eventHandler
 * @param {ARG0} arg0
 * @param {ARG1} arg1
 *
 * @private
 * @function
 */
const callEventHandlerListeners$1 = (eventHandler, arg0, arg1) =>
  callAll$2(eventHandler.l, [arg0, arg1]);

class ID$1 {
  /**
   * @param {number} client client id
   * @param {number} clock unique per client id, continuous number
   */
  constructor (client, clock) {
    /**
     * Client id
     * @type {number}
     */
    this.client = client;
    /**
     * unique per client id, continuous number
     * @type {number}
     */
    this.clock = clock;
  }
}

/**
 * @param {ID | null} a
 * @param {ID | null} b
 * @return {boolean}
 *
 * @function
 */
const compareIDs$1 = (a, b) => a === b || (a !== null && b !== null && a.client === b.client && a.clock === b.clock);

/**
 * @param {number} client
 * @param {number} clock
 *
 * @private
 * @function
 */
const createID$1 = (client, clock) => new ID$1(client, clock);

/**
 * The top types are mapped from y.share.get(keyname) => type.
 * `type` does not store any information about the `keyname`.
 * This function finds the correct `keyname` for `type` and throws otherwise.
 *
 * @param {AbstractType<any>} type
 * @return {string}
 *
 * @private
 * @function
 */
const findRootTypeKey$1 = type => {
  // @ts-ignore _y must be defined, otherwise unexpected case
  for (const [key, value] of type.doc.share.entries()) {
    if (value === type) {
      return key
    }
  }
  throw unexpectedCase$2()
};

/**
 * Check if `parent` is a parent of `child`.
 *
 * @param {AbstractType<any>} parent
 * @param {Item|null} child
 * @return {Boolean} Whether `parent` is a parent of `child`.
 *
 * @private
 * @function
 */
const isParentOf$2 = (parent, child) => {
  while (child !== null) {
    if (child.parent === parent) {
      return true
    }
    child = /** @type {AbstractType<any>} */ (child.parent)._item;
  }
  return false
};

class Snapshot$1 {
  /**
   * @param {DeleteSet} ds
   * @param {Map<number,number>} sv state map
   */
  constructor (ds, sv) {
    /**
     * @type {DeleteSet}
     */
    this.ds = ds;
    /**
     * State Map
     * @type {Map<number,number>}
     */
    this.sv = sv;
  }
}

/**
 * @param {DeleteSet} ds
 * @param {Map<number,number>} sm
 * @return {Snapshot}
 */
const createSnapshot$1 = (ds, sm) => new Snapshot$1(ds, sm);

createSnapshot$1(createDeleteSet$1(), new Map());

/**
 * @param {Item} item
 * @param {Snapshot|undefined} snapshot
 *
 * @protected
 * @function
 */
const isVisible$1 = (item, snapshot) => snapshot === undefined
  ? !item.deleted
  : snapshot.sv.has(item.id.client) && (snapshot.sv.get(item.id.client) || 0) > item.id.clock && !isDeleted$1(snapshot.ds, item.id);

/**
 * @param {Transaction} transaction
 * @param {Snapshot} snapshot
 */
const splitSnapshotAffectedStructs$1 = (transaction, snapshot) => {
  const meta = setIfUndefined$2(transaction.meta, splitSnapshotAffectedStructs$1, create$i);
  const store = transaction.doc.store;
  // check if we already split for this snapshot
  if (!meta.has(snapshot)) {
    snapshot.sv.forEach((clock, client) => {
      if (clock < getState$1(store, client)) {
        getItemCleanStart$1(transaction, createID$1(client, clock));
      }
    });
    iterateDeletedStructs$1(transaction, snapshot.ds, item => {});
    meta.add(snapshot);
  }
};

class StructStore$1 {
  constructor () {
    /**
     * @type {Map<number,Array<GC|Item>>}
     */
    this.clients = new Map();
    /**
     * @type {null | { missing: Map<number, number>, update: Uint8Array }}
     */
    this.pendingStructs = null;
    /**
     * @type {null | Uint8Array}
     */
    this.pendingDs = null;
  }
}

/**
 * Return the states as a Map<client,clock>.
 * Note that clock refers to the next expected clock id.
 *
 * @param {StructStore} store
 * @return {Map<number,number>}
 *
 * @public
 * @function
 */
const getStateVector$1 = store => {
  const sm = new Map();
  store.clients.forEach((structs, client) => {
    const struct = structs[structs.length - 1];
    sm.set(client, struct.id.clock + struct.length);
  });
  return sm
};

/**
 * @param {StructStore} store
 * @param {number} client
 * @return {number}
 *
 * @public
 * @function
 */
const getState$1 = (store, client) => {
  const structs = store.clients.get(client);
  if (structs === undefined) {
    return 0
  }
  const lastStruct = structs[structs.length - 1];
  return lastStruct.id.clock + lastStruct.length
};

/**
 * @param {StructStore} store
 * @param {GC|Item} struct
 *
 * @private
 * @function
 */
const addStruct$1 = (store, struct) => {
  let structs = store.clients.get(struct.id.client);
  if (structs === undefined) {
    structs = [];
    store.clients.set(struct.id.client, structs);
  } else {
    const lastStruct = structs[structs.length - 1];
    if (lastStruct.id.clock + lastStruct.length !== struct.id.clock) {
      throw unexpectedCase$2()
    }
  }
  structs.push(struct);
};

/**
 * Perform a binary search on a sorted array
 * @param {Array<Item|GC>} structs
 * @param {number} clock
 * @return {number}
 *
 * @private
 * @function
 */
const findIndexSS$1 = (structs, clock) => {
  let left = 0;
  let right = structs.length - 1;
  let mid = structs[right];
  let midclock = mid.id.clock;
  if (midclock === clock) {
    return right
  }
  // @todo does it even make sense to pivot the search?
  // If a good split misses, it might actually increase the time to find the correct item.
  // Currently, the only advantage is that search with pivoting might find the item on the first try.
  let midindex = floor$2((clock / (midclock + mid.length - 1)) * right); // pivoting the search
  while (left <= right) {
    mid = structs[midindex];
    midclock = mid.id.clock;
    if (midclock <= clock) {
      if (clock < midclock + mid.length) {
        return midindex
      }
      left = midindex + 1;
    } else {
      right = midindex - 1;
    }
    midindex = floor$2((left + right) / 2);
  }
  // Always check state before looking for a struct in StructStore
  // Therefore the case of not finding a struct is unexpected
  throw unexpectedCase$2()
};

/**
 * Expects that id is actually in store. This function throws or is an infinite loop otherwise.
 *
 * @param {StructStore} store
 * @param {ID} id
 * @return {GC|Item}
 *
 * @private
 * @function
 */
const find$1 = (store, id) => {
  /**
   * @type {Array<GC|Item>}
   */
  // @ts-ignore
  const structs = store.clients.get(id.client);
  return structs[findIndexSS$1(structs, id.clock)]
};

/**
 * Expects that id is actually in store. This function throws or is an infinite loop otherwise.
 * @private
 * @function
 */
const getItem$1 = /** @type {function(StructStore,ID):Item} */ (find$1);

/**
 * @param {Transaction} transaction
 * @param {Array<Item|GC>} structs
 * @param {number} clock
 */
const findIndexCleanStart$1 = (transaction, structs, clock) => {
  const index = findIndexSS$1(structs, clock);
  const struct = structs[index];
  if (struct.id.clock < clock && struct instanceof Item$2) {
    structs.splice(index + 1, 0, splitItem$1(transaction, struct, clock - struct.id.clock));
    return index + 1
  }
  return index
};

/**
 * Expects that id is actually in store. This function throws or is an infinite loop otherwise.
 *
 * @param {Transaction} transaction
 * @param {ID} id
 * @return {Item}
 *
 * @private
 * @function
 */
const getItemCleanStart$1 = (transaction, id) => {
  const structs = /** @type {Array<Item>} */ (transaction.doc.store.clients.get(id.client));
  return structs[findIndexCleanStart$1(transaction, structs, id.clock)]
};

/**
 * Expects that id is actually in store. This function throws or is an infinite loop otherwise.
 *
 * @param {Transaction} transaction
 * @param {StructStore} store
 * @param {ID} id
 * @return {Item}
 *
 * @private
 * @function
 */
const getItemCleanEnd$1 = (transaction, store, id) => {
  /**
   * @type {Array<Item>}
   */
  // @ts-ignore
  const structs = store.clients.get(id.client);
  const index = findIndexSS$1(structs, id.clock);
  const struct = structs[index];
  if (id.clock !== struct.id.clock + struct.length - 1 && struct.constructor !== GC$1) {
    structs.splice(index + 1, 0, splitItem$1(transaction, struct, id.clock - struct.id.clock + 1));
  }
  return struct
};

/**
 * Replace `item` with `newitem` in store
 * @param {StructStore} store
 * @param {GC|Item} struct
 * @param {GC|Item} newStruct
 *
 * @private
 * @function
 */
const replaceStruct$1 = (store, struct, newStruct) => {
  const structs = /** @type {Array<GC|Item>} */ (store.clients.get(struct.id.client));
  structs[findIndexSS$1(structs, struct.id.clock)] = newStruct;
};

/**
 * Iterate over a range of structs
 *
 * @param {Transaction} transaction
 * @param {Array<Item|GC>} structs
 * @param {number} clockStart Inclusive start
 * @param {number} len
 * @param {function(GC|Item):void} f
 *
 * @function
 */
const iterateStructs$1 = (transaction, structs, clockStart, len, f) => {
  if (len === 0) {
    return
  }
  const clockEnd = clockStart + len;
  let index = findIndexCleanStart$1(transaction, structs, clockStart);
  let struct;
  do {
    struct = structs[index++];
    if (clockEnd < struct.id.clock + struct.length) {
      findIndexCleanStart$1(transaction, structs, clockEnd);
    }
    f(struct);
  } while (index < structs.length && structs[index].id.clock < clockEnd)
};

/**
 * A transaction is created for every change on the Yjs model. It is possible
 * to bundle changes on the Yjs model in a single transaction to
 * minimize the number on messages sent and the number of observer calls.
 * If possible the user of this library should bundle as many changes as
 * possible. Here is an example to illustrate the advantages of bundling:
 *
 * @example
 * const map = y.define('map', YMap)
 * // Log content when change is triggered
 * map.observe(() => {
 *   console.log('change triggered')
 * })
 * // Each change on the map type triggers a log message:
 * map.set('a', 0) // => "change triggered"
 * map.set('b', 0) // => "change triggered"
 * // When put in a transaction, it will trigger the log after the transaction:
 * y.transact(() => {
 *   map.set('a', 1)
 *   map.set('b', 1)
 * }) // => "change triggered"
 *
 * @public
 */
class Transaction$1 {
  /**
   * @param {Doc} doc
   * @param {any} origin
   * @param {boolean} local
   */
  constructor (doc, origin, local) {
    /**
     * The Yjs instance.
     * @type {Doc}
     */
    this.doc = doc;
    /**
     * Describes the set of deleted items by ids
     * @type {DeleteSet}
     */
    this.deleteSet = new DeleteSet$1();
    /**
     * Holds the state before the transaction started.
     * @type {Map<Number,Number>}
     */
    this.beforeState = getStateVector$1(doc.store);
    /**
     * Holds the state after the transaction.
     * @type {Map<Number,Number>}
     */
    this.afterState = new Map();
    /**
     * All types that were directly modified (property added or child
     * inserted/deleted). New types are not included in this Set.
     * Maps from type to parentSubs (`item.parentSub = null` for YArray)
     * @type {Map<AbstractType<YEvent>,Set<String|null>>}
     */
    this.changed = new Map();
    /**
     * Stores the events for the types that observe also child elements.
     * It is mainly used by `observeDeep`.
     * @type {Map<AbstractType<YEvent>,Array<YEvent>>}
     */
    this.changedParentTypes = new Map();
    /**
     * @type {Array<AbstractStruct>}
     */
    this._mergeStructs = [];
    /**
     * @type {any}
     */
    this.origin = origin;
    /**
     * Stores meta information on the transaction
     * @type {Map<any,any>}
     */
    this.meta = new Map();
    /**
     * Whether this change originates from this doc.
     * @type {boolean}
     */
    this.local = local;
    /**
     * @type {Set<Doc>}
     */
    this.subdocsAdded = new Set();
    /**
     * @type {Set<Doc>}
     */
    this.subdocsRemoved = new Set();
    /**
     * @type {Set<Doc>}
     */
    this.subdocsLoaded = new Set();
  }
}

/**
 * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
 * @param {Transaction} transaction
 * @return {boolean} Whether data was written.
 */
const writeUpdateMessageFromTransaction$1 = (encoder, transaction) => {
  if (transaction.deleteSet.clients.size === 0 && !any$2(transaction.afterState, (clock, client) => transaction.beforeState.get(client) !== clock)) {
    return false
  }
  sortAndMergeDeleteSet$1(transaction.deleteSet);
  writeStructsFromTransaction$1(encoder, transaction);
  writeDeleteSet$1(encoder, transaction.deleteSet);
  return true
};

/**
 * If `type.parent` was added in current transaction, `type` technically
 * did not change, it was just added and we should not fire events for `type`.
 *
 * @param {Transaction} transaction
 * @param {AbstractType<YEvent>} type
 * @param {string|null} parentSub
 */
const addChangedTypeToTransaction$1 = (transaction, type, parentSub) => {
  const item = type._item;
  if (item === null || (item.id.clock < (transaction.beforeState.get(item.id.client) || 0) && !item.deleted)) {
    setIfUndefined$2(transaction.changed, type, create$i).add(parentSub);
  }
};

/**
 * @param {Array<AbstractStruct>} structs
 * @param {number} pos
 */
const tryToMergeWithLeft$1 = (structs, pos) => {
  const left = structs[pos - 1];
  const right = structs[pos];
  if (left.deleted === right.deleted && left.constructor === right.constructor) {
    if (left.mergeWith(right)) {
      structs.splice(pos, 1);
      if (right instanceof Item$2 && right.parentSub !== null && /** @type {AbstractType<any>} */ (right.parent)._map.get(right.parentSub) === right) {
        /** @type {AbstractType<any>} */ (right.parent)._map.set(right.parentSub, /** @type {Item} */ (left));
      }
    }
  }
};

/**
 * @param {DeleteSet} ds
 * @param {StructStore} store
 * @param {function(Item):boolean} gcFilter
 */
const tryGcDeleteSet$1 = (ds, store, gcFilter) => {
  for (const [client, deleteItems] of ds.clients.entries()) {
    const structs = /** @type {Array<GC|Item>} */ (store.clients.get(client));
    for (let di = deleteItems.length - 1; di >= 0; di--) {
      const deleteItem = deleteItems[di];
      const endDeleteItemClock = deleteItem.clock + deleteItem.len;
      for (
        let si = findIndexSS$1(structs, deleteItem.clock), struct = structs[si];
        si < structs.length && struct.id.clock < endDeleteItemClock;
        struct = structs[++si]
      ) {
        const struct = structs[si];
        if (deleteItem.clock + deleteItem.len <= struct.id.clock) {
          break
        }
        if (struct instanceof Item$2 && struct.deleted && !struct.keep && gcFilter(struct)) {
          struct.gc(store, false);
        }
      }
    }
  }
};

/**
 * @param {DeleteSet} ds
 * @param {StructStore} store
 */
const tryMergeDeleteSet$1 = (ds, store) => {
  // try to merge deleted / gc'd items
  // merge from right to left for better efficiecy and so we don't miss any merge targets
  ds.clients.forEach((deleteItems, client) => {
    const structs = /** @type {Array<GC|Item>} */ (store.clients.get(client));
    for (let di = deleteItems.length - 1; di >= 0; di--) {
      const deleteItem = deleteItems[di];
      // start with merging the item next to the last deleted item
      const mostRightIndexToCheck = min$2(structs.length - 1, 1 + findIndexSS$1(structs, deleteItem.clock + deleteItem.len - 1));
      for (
        let si = mostRightIndexToCheck, struct = structs[si];
        si > 0 && struct.id.clock >= deleteItem.clock;
        struct = structs[--si]
      ) {
        tryToMergeWithLeft$1(structs, si);
      }
    }
  });
};

/**
 * @param {Array<Transaction>} transactionCleanups
 * @param {number} i
 */
const cleanupTransactions$1 = (transactionCleanups, i) => {
  if (i < transactionCleanups.length) {
    const transaction = transactionCleanups[i];
    const doc = transaction.doc;
    const store = doc.store;
    const ds = transaction.deleteSet;
    const mergeStructs = transaction._mergeStructs;
    try {
      sortAndMergeDeleteSet$1(ds);
      transaction.afterState = getStateVector$1(transaction.doc.store);
      doc._transaction = null;
      doc.emit('beforeObserverCalls', [transaction, doc]);
      /**
       * An array of event callbacks.
       *
       * Each callback is called even if the other ones throw errors.
       *
       * @type {Array<function():void>}
       */
      const fs = [];
      // observe events on changed types
      transaction.changed.forEach((subs, itemtype) =>
        fs.push(() => {
          if (itemtype._item === null || !itemtype._item.deleted) {
            itemtype._callObserver(transaction, subs);
          }
        })
      );
      fs.push(() => {
        // deep observe events
        transaction.changedParentTypes.forEach((events, type) =>
          fs.push(() => {
            // We need to think about the possibility that the user transforms the
            // Y.Doc in the event.
            if (type._item === null || !type._item.deleted) {
              events = events
                .filter(event =>
                  event.target._item === null || !event.target._item.deleted
                );
              events
                .forEach(event => {
                  event.currentTarget = type;
                });
              // sort events by path length so that top-level events are fired first.
              events
                .sort((event1, event2) => event1.path.length - event2.path.length);
              // We don't need to check for events.length
              // because we know it has at least one element
              callEventHandlerListeners$1(type._dEH, events, transaction);
            }
          })
        );
        fs.push(() => doc.emit('afterTransaction', [transaction, doc]));
      });
      callAll$2(fs, []);
    } finally {
      // Replace deleted items with ItemDeleted / GC.
      // This is where content is actually remove from the Yjs Doc.
      if (doc.gc) {
        tryGcDeleteSet$1(ds, store, doc.gcFilter);
      }
      tryMergeDeleteSet$1(ds, store);

      // on all affected store.clients props, try to merge
      transaction.afterState.forEach((clock, client) => {
        const beforeClock = transaction.beforeState.get(client) || 0;
        if (beforeClock !== clock) {
          const structs = /** @type {Array<GC|Item>} */ (store.clients.get(client));
          // we iterate from right to left so we can safely remove entries
          const firstChangePos = max$2(findIndexSS$1(structs, beforeClock), 1);
          for (let i = structs.length - 1; i >= firstChangePos; i--) {
            tryToMergeWithLeft$1(structs, i);
          }
        }
      });
      // try to merge mergeStructs
      // @todo: it makes more sense to transform mergeStructs to a DS, sort it, and merge from right to left
      //        but at the moment DS does not handle duplicates
      for (let i = 0; i < mergeStructs.length; i++) {
        const { client, clock } = mergeStructs[i].id;
        const structs = /** @type {Array<GC|Item>} */ (store.clients.get(client));
        const replacedStructPos = findIndexSS$1(structs, clock);
        if (replacedStructPos + 1 < structs.length) {
          tryToMergeWithLeft$1(structs, replacedStructPos + 1);
        }
        if (replacedStructPos > 0) {
          tryToMergeWithLeft$1(structs, replacedStructPos);
        }
      }
      if (!transaction.local && transaction.afterState.get(doc.clientID) !== transaction.beforeState.get(doc.clientID)) {
        print$2(ORANGE$2, BOLD$2, '[yjs] ', UNBOLD$2, RED$2, 'Changed the client-id because another client seems to be using it.');
        doc.clientID = generateNewClientId$1();
      }
      // @todo Merge all the transactions into one and provide send the data as a single update message
      doc.emit('afterTransactionCleanup', [transaction, doc]);
      if (doc._observers.has('update')) {
        const encoder = new UpdateEncoderV1$1();
        const hasContent = writeUpdateMessageFromTransaction$1(encoder, transaction);
        if (hasContent) {
          doc.emit('update', [encoder.toUint8Array(), transaction.origin, doc, transaction]);
        }
      }
      if (doc._observers.has('updateV2')) {
        const encoder = new UpdateEncoderV2$1();
        const hasContent = writeUpdateMessageFromTransaction$1(encoder, transaction);
        if (hasContent) {
          doc.emit('updateV2', [encoder.toUint8Array(), transaction.origin, doc, transaction]);
        }
      }
      const { subdocsAdded, subdocsLoaded, subdocsRemoved } = transaction;
      if (subdocsAdded.size > 0 || subdocsRemoved.size > 0 || subdocsLoaded.size > 0) {
        subdocsAdded.forEach(subdoc => {
          subdoc.clientID = doc.clientID;
          if (subdoc.collectionid == null) {
            subdoc.collectionid = doc.collectionid;
          }
          doc.subdocs.add(subdoc);
        });
        subdocsRemoved.forEach(subdoc => doc.subdocs.delete(subdoc));
        doc.emit('subdocs', [{ loaded: subdocsLoaded, added: subdocsAdded, removed: subdocsRemoved }, doc, transaction]);
        subdocsRemoved.forEach(subdoc => subdoc.destroy());
      }

      if (transactionCleanups.length <= i + 1) {
        doc._transactionCleanups = [];
        doc.emit('afterAllTransactions', [doc, transactionCleanups]);
      } else {
        cleanupTransactions$1(transactionCleanups, i + 1);
      }
    }
  }
};

/**
 * Implements the functionality of `y.transact(()=>{..})`
 *
 * @param {Doc} doc
 * @param {function(Transaction):void} f
 * @param {any} [origin=true]
 *
 * @function
 */
const transact$1 = (doc, f, origin = null, local = true) => {
  const transactionCleanups = doc._transactionCleanups;
  let initialCall = false;
  if (doc._transaction === null) {
    initialCall = true;
    doc._transaction = new Transaction$1(doc, origin, local);
    transactionCleanups.push(doc._transaction);
    if (transactionCleanups.length === 1) {
      doc.emit('beforeAllTransactions', [doc]);
    }
    doc.emit('beforeTransaction', [doc._transaction, doc]);
  }
  try {
    f(doc._transaction);
  } finally {
    if (initialCall && transactionCleanups[0] === doc._transaction) {
      // The first transaction ended, now process observer calls.
      // Observer call may create new transactions for which we need to call the observers and do cleanup.
      // We don't want to nest these calls, so we execute these calls one after
      // another.
      // Also we need to ensure that all cleanups are called, even if the
      // observes throw errors.
      // This file is full of hacky try {} finally {} blocks to ensure that an
      // event can throw errors and also that the cleanup is called.
      cleanupTransactions$1(transactionCleanups, 0);
    }
  }
};

class StackItem$1 {
  /**
   * @param {DeleteSet} deletions
   * @param {DeleteSet} insertions
   */
  constructor (deletions, insertions) {
    this.insertions = insertions;
    this.deletions = deletions;
    /**
     * Use this to save and restore metadata like selection range
     */
    this.meta = new Map();
  }
}

/**
 * @param {UndoManager} undoManager
 * @param {Array<StackItem>} stack
 * @param {string} eventType
 * @return {StackItem?}
 */
const popStackItem$1 = (undoManager, stack, eventType) => {
  /**
   * Whether a change happened
   * @type {StackItem?}
   */
  let result = null;
  /**
   * Keep a reference to the transaction so we can fire the event with the changedParentTypes
   * @type {any}
   */
  let _tr = null;
  const doc = undoManager.doc;
  const scope = undoManager.scope;
  transact$1(doc, transaction => {
    while (stack.length > 0 && result === null) {
      const store = doc.store;
      const stackItem = /** @type {StackItem} */ (stack.pop());
      /**
       * @type {Set<Item>}
       */
      const itemsToRedo = new Set();
      /**
       * @type {Array<Item>}
       */
      const itemsToDelete = [];
      let performedChange = false;
      iterateDeletedStructs$1(transaction, stackItem.insertions, struct => {
        if (struct instanceof Item$2) {
          if (struct.redone !== null) {
            let { item, diff } = followRedone$1(store, struct.id);
            if (diff > 0) {
              item = getItemCleanStart$1(transaction, createID$1(item.id.client, item.id.clock + diff));
            }
            struct = item;
          }
          if (!struct.deleted && scope.some(type => isParentOf$2(type, /** @type {Item} */ (struct)))) {
            itemsToDelete.push(struct);
          }
        }
      });
      iterateDeletedStructs$1(transaction, stackItem.deletions, struct => {
        if (
          struct instanceof Item$2 &&
          scope.some(type => isParentOf$2(type, struct)) &&
          // Never redo structs in stackItem.insertions because they were created and deleted in the same capture interval.
          !isDeleted$1(stackItem.insertions, struct.id)
        ) {
          itemsToRedo.add(struct);
        }
      });
      itemsToRedo.forEach(struct => {
        performedChange = redoItem$1(transaction, struct, itemsToRedo, itemsToDelete) !== null || performedChange;
      });
      // We want to delete in reverse order so that children are deleted before
      // parents, so we have more information available when items are filtered.
      for (let i = itemsToDelete.length - 1; i >= 0; i--) {
        const item = itemsToDelete[i];
        if (undoManager.deleteFilter(item)) {
          item.delete(transaction);
          performedChange = true;
        }
      }
      result = performedChange ? stackItem : null;
    }
    transaction.changed.forEach((subProps, type) => {
      // destroy search marker if necessary
      if (subProps.has(null) && type._searchMarker) {
        type._searchMarker.length = 0;
      }
    });
    _tr = transaction;
  }, undoManager);
  if (result != null) {
    const changedParentTypes = _tr.changedParentTypes;
    undoManager.emit('stack-item-popped', [{ stackItem: result, type: eventType, changedParentTypes }, undoManager]);
  }
  return result
};

/**
 * @typedef {Object} UndoManagerOptions
 * @property {number} [UndoManagerOptions.captureTimeout=500]
 * @property {function(Item):boolean} [UndoManagerOptions.deleteFilter=()=>true] Sometimes
 * it is necessary to filter whan an Undo/Redo operation can delete. If this
 * filter returns false, the type/item won't be deleted even it is in the
 * undo/redo scope.
 * @property {Set<any>} [UndoManagerOptions.trackedOrigins=new Set([null])]
 */

/**
 * Fires 'stack-item-added' event when a stack item was added to either the undo- or
 * the redo-stack. You may store additional stack information via the
 * metadata property on `event.stackItem.meta` (it is a `Map` of metadata properties).
 * Fires 'stack-item-popped' event when a stack item was popped from either the
 * undo- or the redo-stack. You may restore the saved stack information from `event.stackItem.meta`.
 *
 * @extends {Observable<'stack-item-added'|'stack-item-popped'>}
 */
class UndoManager$1 extends Observable$1 {
  /**
   * @param {AbstractType<any>|Array<AbstractType<any>>} typeScope Accepts either a single type, or an array of types
   * @param {UndoManagerOptions} options
   */
  constructor (typeScope, { captureTimeout = 500, deleteFilter = () => true, trackedOrigins = new Set([null]) } = {}) {
    super();
    this.scope = typeScope instanceof Array ? typeScope : [typeScope];
    this.deleteFilter = deleteFilter;
    trackedOrigins.add(this);
    this.trackedOrigins = trackedOrigins;
    /**
     * @type {Array<StackItem>}
     */
    this.undoStack = [];
    /**
     * @type {Array<StackItem>}
     */
    this.redoStack = [];
    /**
     * Whether the client is currently undoing (calling UndoManager.undo)
     *
     * @type {boolean}
     */
    this.undoing = false;
    this.redoing = false;
    this.doc = /** @type {Doc} */ (this.scope[0].doc);
    this.lastChange = 0;
    this.doc.on('afterTransaction', /** @param {Transaction} transaction */ transaction => {
      // Only track certain transactions
      if (!this.scope.some(type => transaction.changedParentTypes.has(type)) || (!this.trackedOrigins.has(transaction.origin) && (!transaction.origin || !this.trackedOrigins.has(transaction.origin.constructor)))) {
        return
      }
      const undoing = this.undoing;
      const redoing = this.redoing;
      const stack = undoing ? this.redoStack : this.undoStack;
      if (undoing) {
        this.stopCapturing(); // next undo should not be appended to last stack item
      } else if (!redoing) {
        // neither undoing nor redoing: delete redoStack
        this.redoStack = [];
      }
      const insertions = new DeleteSet$1();
      transaction.afterState.forEach((endClock, client) => {
        const startClock = transaction.beforeState.get(client) || 0;
        const len = endClock - startClock;
        if (len > 0) {
          addToDeleteSet$1(insertions, client, startClock, len);
        }
      });
      const now = getUnixTime$2();
      if (now - this.lastChange < captureTimeout && stack.length > 0 && !undoing && !redoing) {
        // append change to last stack op
        const lastOp = stack[stack.length - 1];
        lastOp.deletions = mergeDeleteSets$1([lastOp.deletions, transaction.deleteSet]);
        lastOp.insertions = mergeDeleteSets$1([lastOp.insertions, insertions]);
      } else {
        // create a new stack op
        stack.push(new StackItem$1(transaction.deleteSet, insertions));
      }
      if (!undoing && !redoing) {
        this.lastChange = now;
      }
      // make sure that deleted structs are not gc'd
      iterateDeletedStructs$1(transaction, transaction.deleteSet, /** @param {Item|GC} item */ item => {
        if (item instanceof Item$2 && this.scope.some(type => isParentOf$2(type, item))) {
          keepItem$1(item, true);
        }
      });
      this.emit('stack-item-added', [{ stackItem: stack[stack.length - 1], origin: transaction.origin, type: undoing ? 'redo' : 'undo', changedParentTypes: transaction.changedParentTypes }, this]);
    });
  }

  clear () {
    this.doc.transact(transaction => {
      /**
       * @param {StackItem} stackItem
       */
      const clearItem = stackItem => {
        iterateDeletedStructs$1(transaction, stackItem.deletions, item => {
          if (item instanceof Item$2 && this.scope.some(type => isParentOf$2(type, item))) {
            keepItem$1(item, false);
          }
        });
      };
      this.undoStack.forEach(clearItem);
      this.redoStack.forEach(clearItem);
    });
    this.undoStack = [];
    this.redoStack = [];
  }

  /**
   * UndoManager merges Undo-StackItem if they are created within time-gap
   * smaller than `options.captureTimeout`. Call `um.stopCapturing()` so that the next
   * StackItem won't be merged.
   *
   *
   * @example
   *     // without stopCapturing
   *     ytext.insert(0, 'a')
   *     ytext.insert(1, 'b')
   *     um.undo()
   *     ytext.toString() // => '' (note that 'ab' was removed)
   *     // with stopCapturing
   *     ytext.insert(0, 'a')
   *     um.stopCapturing()
   *     ytext.insert(0, 'b')
   *     um.undo()
   *     ytext.toString() // => 'a' (note that only 'b' was removed)
   *
   */
  stopCapturing () {
    this.lastChange = 0;
  }

  /**
   * Undo last changes on type.
   *
   * @return {StackItem?} Returns StackItem if a change was applied
   */
  undo () {
    this.undoing = true;
    let res;
    try {
      res = popStackItem$1(this, this.undoStack, 'undo');
    } finally {
      this.undoing = false;
    }
    return res
  }

  /**
   * Redo last undo operation.
   *
   * @return {StackItem?} Returns StackItem if a change was applied
   */
  redo () {
    this.redoing = true;
    let res;
    try {
      res = popStackItem$1(this, this.redoStack, 'redo');
    } finally {
      this.redoing = false;
    }
    return res
  }
}

/**
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 */
function * lazyStructReaderGenerator$1 (decoder) {
  const numOfStateUpdates = readVarUint$2(decoder.restDecoder);
  for (let i = 0; i < numOfStateUpdates; i++) {
    const numberOfStructs = readVarUint$2(decoder.restDecoder);
    const client = decoder.readClient();
    let clock = readVarUint$2(decoder.restDecoder);
    for (let i = 0; i < numberOfStructs; i++) {
      const info = decoder.readInfo();
      // @todo use switch instead of ifs
      if (info === 10) {
        const len = readVarUint$2(decoder.restDecoder);
        yield new Skip$1(createID$1(client, clock), len);
        clock += len;
      } else if ((BITS5$2 & info) !== 0) {
        const cantCopyParentInfo = (info & (BIT7$2 | BIT8$2)) === 0;
        // If parent = null and neither left nor right are defined, then we know that `parent` is child of `y`
        // and we read the next string as parentYKey.
        // It indicates how we store/retrieve parent from `y.share`
        // @type {string|null}
        const struct = new Item$2(
          createID$1(client, clock),
          null, // left
          (info & BIT8$2) === BIT8$2 ? decoder.readLeftID() : null, // origin
          null, // right
          (info & BIT7$2) === BIT7$2 ? decoder.readRightID() : null, // right origin
          // @ts-ignore Force writing a string here.
          cantCopyParentInfo ? (decoder.readParentInfo() ? decoder.readString() : decoder.readLeftID()) : null, // parent
          cantCopyParentInfo && (info & BIT6$2) === BIT6$2 ? decoder.readString() : null, // parentSub
          readItemContent$1(decoder, info) // item content
        );
        yield struct;
        clock += struct.length;
      } else {
        const len = decoder.readLen();
        yield new GC$1(createID$1(client, clock), len);
        clock += len;
      }
    }
  }
}

class LazyStructReader$1 {
  /**
   * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
   * @param {boolean} filterSkips
   */
  constructor (decoder, filterSkips) {
    this.gen = lazyStructReaderGenerator$1(decoder);
    /**
     * @type {null | Item | Skip | GC}
     */
    this.curr = null;
    this.done = false;
    this.filterSkips = filterSkips;
    this.next();
  }

  /**
   * @return {Item | GC | Skip |null}
   */
  next () {
    // ignore "Skip" structs
    do {
      this.curr = this.gen.next().value || null;
    } while (this.filterSkips && this.curr !== null && this.curr.constructor === Skip$1)
    return this.curr
  }
}

class LazyStructWriter$1 {
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  constructor (encoder) {
    this.currClient = 0;
    this.startClock = 0;
    this.written = 0;
    this.encoder = encoder;
    /**
     * We want to write operations lazily, but also we need to know beforehand how many operations we want to write for each client.
     *
     * This kind of meta-information (#clients, #structs-per-client-written) is written to the restEncoder.
     *
     * We fragment the restEncoder and store a slice of it per-client until we know how many clients there are.
     * When we flush (toUint8Array) we write the restEncoder using the fragments and the meta-information.
     *
     * @type {Array<{ written: number, restEncoder: Uint8Array }>}
     */
    this.clientStructs = [];
  }
}

/**
 * @param {Array<Uint8Array>} updates
 * @return {Uint8Array}
 */
const mergeUpdates$3 = updates => mergeUpdatesV2$1(updates, UpdateDecoderV1$1, UpdateEncoderV1$1);

/**
 * This method is intended to slice any kind of struct and retrieve the right part.
 * It does not handle side-effects, so it should only be used by the lazy-encoder.
 *
 * @param {Item | GC | Skip} left
 * @param {number} diff
 * @return {Item | GC}
 */
const sliceStruct$1 = (left, diff) => {
  if (left.constructor === GC$1) {
    const { client, clock } = left.id;
    return new GC$1(createID$1(client, clock + diff), left.length - diff)
  } else if (left.constructor === Skip$1) {
    const { client, clock } = left.id;
    return new Skip$1(createID$1(client, clock + diff), left.length - diff)
  } else {
    const leftItem = /** @type {Item} */ (left);
    const { client, clock } = leftItem.id;
    return new Item$2(
      createID$1(client, clock + diff),
      null,
      createID$1(client, clock + diff - 1),
      null,
      leftItem.rightOrigin,
      leftItem.parent,
      leftItem.parentSub,
      leftItem.content.splice(diff)
    )
  }
};

/**
 *
 * This function works similarly to `readUpdateV2`.
 *
 * @param {Array<Uint8Array>} updates
 * @param {typeof UpdateDecoderV1 | typeof UpdateDecoderV2} [YDecoder]
 * @param {typeof UpdateEncoderV1 | typeof UpdateEncoderV2} [YEncoder]
 * @return {Uint8Array}
 */
const mergeUpdatesV2$1 = (updates, YDecoder = UpdateDecoderV2$1, YEncoder = UpdateEncoderV2$1) => {
  if (updates.length === 1) {
    return updates[0]
  }
  const updateDecoders = updates.map(update => new YDecoder(createDecoder$2(update)));
  let lazyStructDecoders = updateDecoders.map(decoder => new LazyStructReader$1(decoder, true));

  /**
   * @todo we don't need offset because we always slice before
   * @type {null | { struct: Item | GC | Skip, offset: number }}
   */
  let currWrite = null;

  const updateEncoder = new YEncoder();
  // write structs lazily
  const lazyStructEncoder = new LazyStructWriter$1(updateEncoder);

  // Note: We need to ensure that all lazyStructDecoders are fully consumed
  // Note: Should merge document updates whenever possible - even from different updates
  // Note: Should handle that some operations cannot be applied yet ()

  while (true) {
    // Write higher clients first ⇒ sort by clientID & clock and remove decoders without content
    lazyStructDecoders = lazyStructDecoders.filter(dec => dec.curr !== null);
    lazyStructDecoders.sort(
      /** @type {function(any,any):number} */ (dec1, dec2) => {
        if (dec1.curr.id.client === dec2.curr.id.client) {
          const clockDiff = dec1.curr.id.clock - dec2.curr.id.clock;
          if (clockDiff === 0) {
            // @todo remove references to skip since the structDecoders must filter Skips.
            return dec1.curr.constructor === dec2.curr.constructor
              ? 0
              : dec1.curr.constructor === Skip$1 ? 1 : -1 // we are filtering skips anyway.
          } else {
            return clockDiff
          }
        } else {
          return dec2.curr.id.client - dec1.curr.id.client
        }
      }
    );
    if (lazyStructDecoders.length === 0) {
      break
    }
    const currDecoder = lazyStructDecoders[0];
    // write from currDecoder until the next operation is from another client or if filler-struct
    // then we need to reorder the decoders and find the next operation to write
    const firstClient = /** @type {Item | GC} */ (currDecoder.curr).id.client;

    if (currWrite !== null) {
      let curr = /** @type {Item | GC | null} */ (currDecoder.curr);
      let iterated = false;

      // iterate until we find something that we haven't written already
      // remember: first the high client-ids are written
      while (curr !== null && curr.id.clock + curr.length <= currWrite.struct.id.clock + currWrite.struct.length && curr.id.client >= currWrite.struct.id.client) {
        curr = currDecoder.next();
        iterated = true;
      }
      if (
        curr === null || // current decoder is empty
        curr.id.client !== firstClient || // check whether there is another decoder that has has updates from `firstClient`
        (iterated && curr.id.clock > currWrite.struct.id.clock + currWrite.struct.length) // the above while loop was used and we are potentially missing updates
      ) {
        continue
      }

      if (firstClient !== currWrite.struct.id.client) {
        writeStructToLazyStructWriter$1(lazyStructEncoder, currWrite.struct, currWrite.offset);
        currWrite = { struct: curr, offset: 0 };
        currDecoder.next();
      } else {
        if (currWrite.struct.id.clock + currWrite.struct.length < curr.id.clock) {
          // @todo write currStruct & set currStruct = Skip(clock = currStruct.id.clock + currStruct.length, length = curr.id.clock - self.clock)
          if (currWrite.struct.constructor === Skip$1) {
            // extend existing skip
            currWrite.struct.length = curr.id.clock + curr.length - currWrite.struct.id.clock;
          } else {
            writeStructToLazyStructWriter$1(lazyStructEncoder, currWrite.struct, currWrite.offset);
            const diff = curr.id.clock - currWrite.struct.id.clock - currWrite.struct.length;
            /**
             * @type {Skip}
             */
            const struct = new Skip$1(createID$1(firstClient, currWrite.struct.id.clock + currWrite.struct.length), diff);
            currWrite = { struct, offset: 0 };
          }
        } else { // if (currWrite.struct.id.clock + currWrite.struct.length >= curr.id.clock) {
          const diff = currWrite.struct.id.clock + currWrite.struct.length - curr.id.clock;
          if (diff > 0) {
            if (currWrite.struct.constructor === Skip$1) {
              // prefer to slice Skip because the other struct might contain more information
              currWrite.struct.length -= diff;
            } else {
              curr = sliceStruct$1(curr, diff);
            }
          }
          if (!currWrite.struct.mergeWith(/** @type {any} */ (curr))) {
            writeStructToLazyStructWriter$1(lazyStructEncoder, currWrite.struct, currWrite.offset);
            currWrite = { struct: curr, offset: 0 };
            currDecoder.next();
          }
        }
      }
    } else {
      currWrite = { struct: /** @type {Item | GC} */ (currDecoder.curr), offset: 0 };
      currDecoder.next();
    }
    for (
      let next = currDecoder.curr;
      next !== null && next.id.client === firstClient && next.id.clock === currWrite.struct.id.clock + currWrite.struct.length && next.constructor !== Skip$1;
      next = currDecoder.next()
    ) {
      writeStructToLazyStructWriter$1(lazyStructEncoder, currWrite.struct, currWrite.offset);
      currWrite = { struct: next, offset: 0 };
    }
  }
  if (currWrite !== null) {
    writeStructToLazyStructWriter$1(lazyStructEncoder, currWrite.struct, currWrite.offset);
    currWrite = null;
  }
  finishLazyStructWriting$1(lazyStructEncoder);

  const dss = updateDecoders.map(decoder => readDeleteSet$1(decoder));
  const ds = mergeDeleteSets$1(dss);
  writeDeleteSet$1(updateEncoder, ds);
  return updateEncoder.toUint8Array()
};

/**
 * @param {Uint8Array} update
 * @param {Uint8Array} sv
 * @param {typeof UpdateDecoderV1 | typeof UpdateDecoderV2} [YDecoder]
 * @param {typeof UpdateEncoderV1 | typeof UpdateEncoderV2} [YEncoder]
 */
const diffUpdateV2$1 = (update, sv, YDecoder = UpdateDecoderV2$1, YEncoder = UpdateEncoderV2$1) => {
  const state = decodeStateVector$1(sv);
  const encoder = new YEncoder();
  const lazyStructWriter = new LazyStructWriter$1(encoder);
  const decoder = new YDecoder(createDecoder$2(update));
  const reader = new LazyStructReader$1(decoder, false);
  while (reader.curr) {
    const curr = reader.curr;
    const currClient = curr.id.client;
    const svClock = state.get(currClient) || 0;
    if (reader.curr.constructor === Skip$1) {
      // the first written struct shouldn't be a skip
      reader.next();
      continue
    }
    if (curr.id.clock + curr.length > svClock) {
      writeStructToLazyStructWriter$1(lazyStructWriter, curr, max$2(svClock - curr.id.clock, 0));
      reader.next();
      while (reader.curr && reader.curr.id.client === currClient) {
        writeStructToLazyStructWriter$1(lazyStructWriter, reader.curr, 0);
        reader.next();
      }
    } else {
      // read until something new comes up
      while (reader.curr && reader.curr.id.client === currClient && reader.curr.id.clock + reader.curr.length <= svClock) {
        reader.next();
      }
    }
  }
  finishLazyStructWriting$1(lazyStructWriter);
  // write ds
  const ds = readDeleteSet$1(decoder);
  writeDeleteSet$1(encoder, ds);
  return encoder.toUint8Array()
};

/**
 * @param {LazyStructWriter} lazyWriter
 */
const flushLazyStructWriter$1 = lazyWriter => {
  if (lazyWriter.written > 0) {
    lazyWriter.clientStructs.push({ written: lazyWriter.written, restEncoder: toUint8Array$2(lazyWriter.encoder.restEncoder) });
    lazyWriter.encoder.restEncoder = createEncoder$2();
    lazyWriter.written = 0;
  }
};

/**
 * @param {LazyStructWriter} lazyWriter
 * @param {Item | GC} struct
 * @param {number} offset
 */
const writeStructToLazyStructWriter$1 = (lazyWriter, struct, offset) => {
  // flush curr if we start another client
  if (lazyWriter.written > 0 && lazyWriter.currClient !== struct.id.client) {
    flushLazyStructWriter$1(lazyWriter);
  }
  if (lazyWriter.written === 0) {
    lazyWriter.currClient = struct.id.client;
    // write next client
    lazyWriter.encoder.writeClient(struct.id.client);
    // write startClock
    writeVarUint$2(lazyWriter.encoder.restEncoder, struct.id.clock + offset);
  }
  struct.write(lazyWriter.encoder, offset);
  lazyWriter.written++;
};
/**
 * Call this function when we collected all parts and want to
 * put all the parts together. After calling this method,
 * you can continue using the UpdateEncoder.
 *
 * @param {LazyStructWriter} lazyWriter
 */
const finishLazyStructWriting$1 = (lazyWriter) => {
  flushLazyStructWriter$1(lazyWriter);

  // this is a fresh encoder because we called flushCurr
  const restEncoder = lazyWriter.encoder.restEncoder;

  /**
   * Now we put all the fragments together.
   * This works similarly to `writeClientsStructs`
   */

  // write # states that were updated - i.e. the clients
  writeVarUint$2(restEncoder, lazyWriter.clientStructs.length);

  for (let i = 0; i < lazyWriter.clientStructs.length; i++) {
    const partStructs = lazyWriter.clientStructs[i];
    /**
     * Works similarly to `writeStructs`
     */
    // write # encoded structs
    writeVarUint$2(restEncoder, partStructs.written);
    // write the rest of the fragment
    writeUint8Array$2(restEncoder, partStructs.restEncoder);
  }
};

/**
 * @param {Uint8Array} update
 * @param {typeof UpdateDecoderV2 | typeof UpdateDecoderV1} YDecoder
 * @param {typeof UpdateEncoderV2 | typeof UpdateEncoderV1 } YEncoder
 */
const convertUpdateFormat$1 = (update, YDecoder, YEncoder) => {
  const updateDecoder = new YDecoder(createDecoder$2(update));
  const lazyDecoder = new LazyStructReader$1(updateDecoder, false);
  const updateEncoder = new YEncoder();
  const lazyWriter = new LazyStructWriter$1(updateEncoder);

  for (let curr = lazyDecoder.curr; curr !== null; curr = lazyDecoder.next()) {
    writeStructToLazyStructWriter$1(lazyWriter, curr, 0);
  }
  finishLazyStructWriting$1(lazyWriter);
  const ds = readDeleteSet$1(updateDecoder);
  writeDeleteSet$1(updateEncoder, ds);
  return updateEncoder.toUint8Array()
};

/**
 * @param {Uint8Array} update
 */
const convertUpdateFormatV2ToV1$1 = update => convertUpdateFormat$1(update, UpdateDecoderV2$1, UpdateEncoderV1$1);

/**
 * YEvent describes the changes on a YType.
 */
class YEvent$1 {
  /**
   * @param {AbstractType<any>} target The changed type.
   * @param {Transaction} transaction
   */
  constructor (target, transaction) {
    /**
     * The type on which this event was created on.
     * @type {AbstractType<any>}
     */
    this.target = target;
    /**
     * The current target on which the observe callback is called.
     * @type {AbstractType<any>}
     */
    this.currentTarget = target;
    /**
     * The transaction that triggered this event.
     * @type {Transaction}
     */
    this.transaction = transaction;
    /**
     * @type {Object|null}
     */
    this._changes = null;
    /**
     * @type {null | Map<string, { action: 'add' | 'update' | 'delete', oldValue: any, newValue: any }>}
     */
    this._keys = null;
    /**
     * @type {null | Array<{ insert?: string | Array<any> | object | AbstractType<any>, retain?: number, delete?: number, attributes?: Object<string, any> }>}
     */
    this._delta = null;
  }

  /**
   * Computes the path from `y` to the changed type.
   *
   * @todo v14 should standardize on path: Array<{parent, index}> because that is easier to work with.
   *
   * The following property holds:
   * @example
   *   let type = y
   *   event.path.forEach(dir => {
   *     type = type.get(dir)
   *   })
   *   type === event.target // => true
   */
  get path () {
    // @ts-ignore _item is defined because target is integrated
    return getPathTo$1(this.currentTarget, this.target)
  }

  /**
   * Check if a struct is deleted by this event.
   *
   * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
   *
   * @param {AbstractStruct} struct
   * @return {boolean}
   */
  deletes (struct) {
    return isDeleted$1(this.transaction.deleteSet, struct.id)
  }

  /**
   * @type {Map<string, { action: 'add' | 'update' | 'delete', oldValue: any, newValue: any }>}
   */
  get keys () {
    if (this._keys === null) {
      const keys = new Map();
      const target = this.target;
      const changed = /** @type Set<string|null> */ (this.transaction.changed.get(target));
      changed.forEach(key => {
        if (key !== null) {
          const item = /** @type {Item} */ (target._map.get(key));
          /**
           * @type {'delete' | 'add' | 'update'}
           */
          let action;
          let oldValue;
          if (this.adds(item)) {
            let prev = item.left;
            while (prev !== null && this.adds(prev)) {
              prev = prev.left;
            }
            if (this.deletes(item)) {
              if (prev !== null && this.deletes(prev)) {
                action = 'delete';
                oldValue = last$2(prev.content.getContent());
              } else {
                return
              }
            } else {
              if (prev !== null && this.deletes(prev)) {
                action = 'update';
                oldValue = last$2(prev.content.getContent());
              } else {
                action = 'add';
                oldValue = undefined;
              }
            }
          } else {
            if (this.deletes(item)) {
              action = 'delete';
              oldValue = last$2(/** @type {Item} */ item.content.getContent());
            } else {
              return // nop
            }
          }
          keys.set(key, { action, oldValue });
        }
      });
      this._keys = keys;
    }
    return this._keys
  }

  /**
   * @type {Array<{insert?: string | Array<any> | object | AbstractType<any>, retain?: number, delete?: number, attributes?: Object<string, any>}>}
   */
  get delta () {
    return this.changes.delta
  }

  /**
   * Check if a struct is added by this event.
   *
   * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
   *
   * @param {AbstractStruct} struct
   * @return {boolean}
   */
  adds (struct) {
    return struct.id.clock >= (this.transaction.beforeState.get(struct.id.client) || 0)
  }

  /**
   * @type {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert?:Array<any>|string, delete?:number, retain?:number}>}}
   */
  get changes () {
    let changes = this._changes;
    if (changes === null) {
      const target = this.target;
      const added = create$i();
      const deleted = create$i();
      /**
       * @type {Array<{insert:Array<any>}|{delete:number}|{retain:number}>}
       */
      const delta = [];
      changes = {
        added,
        deleted,
        delta,
        keys: this.keys
      };
      const changed = /** @type Set<string|null> */ (this.transaction.changed.get(target));
      if (changed.has(null)) {
        /**
         * @type {any}
         */
        let lastOp = null;
        const packOp = () => {
          if (lastOp) {
            delta.push(lastOp);
          }
        };
        for (let item = target._start; item !== null; item = item.right) {
          if (item.deleted) {
            if (this.deletes(item) && !this.adds(item)) {
              if (lastOp === null || lastOp.delete === undefined) {
                packOp();
                lastOp = { delete: 0 };
              }
              lastOp.delete += item.length;
              deleted.add(item);
            } // else nop
          } else {
            if (this.adds(item)) {
              if (lastOp === null || lastOp.insert === undefined) {
                packOp();
                lastOp = { insert: [] };
              }
              lastOp.insert = lastOp.insert.concat(item.content.getContent());
              added.add(item);
            } else {
              if (lastOp === null || lastOp.retain === undefined) {
                packOp();
                lastOp = { retain: 0 };
              }
              lastOp.retain += item.length;
            }
          }
        }
        if (lastOp !== null && lastOp.retain === undefined) {
          packOp();
        }
      }
      this._changes = changes;
    }
    return /** @type {any} */ (changes)
  }
}

/**
 * Compute the path from this type to the specified target.
 *
 * @example
 *   // `child` should be accessible via `type.get(path[0]).get(path[1])..`
 *   const path = type.getPathTo(child)
 *   // assuming `type instanceof YArray`
 *   console.log(path) // might look like => [2, 'key1']
 *   child === type.get(path[0]).get(path[1])
 *
 * @param {AbstractType<any>} parent
 * @param {AbstractType<any>} child target
 * @return {Array<string|number>} Path to the target
 *
 * @private
 * @function
 */
const getPathTo$1 = (parent, child) => {
  const path = [];
  while (child._item !== null && child !== parent) {
    if (child._item.parentSub !== null) {
      // parent is map-ish
      path.unshift(child._item.parentSub);
    } else {
      // parent is array-ish
      let i = 0;
      let c = /** @type {AbstractType<any>} */ (child._item.parent)._start;
      while (c !== child._item && c !== null) {
        if (!c.deleted) {
          i++;
        }
        c = c.right;
      }
      path.unshift(i);
    }
    child = /** @type {AbstractType<any>} */ (child._item.parent);
  }
  return path
};

const maxSearchMarker$1 = 80;

/**
 * A unique timestamp that identifies each marker.
 *
 * Time is relative,.. this is more like an ever-increasing clock.
 *
 * @type {number}
 */
let globalSearchMarkerTimestamp$1 = 0;

class ArraySearchMarker$1 {
  /**
   * @param {Item} p
   * @param {number} index
   */
  constructor (p, index) {
    p.marker = true;
    this.p = p;
    this.index = index;
    this.timestamp = globalSearchMarkerTimestamp$1++;
  }
}

/**
 * @param {ArraySearchMarker} marker
 */
const refreshMarkerTimestamp$1 = marker => { marker.timestamp = globalSearchMarkerTimestamp$1++; };

/**
 * This is rather complex so this function is the only thing that should overwrite a marker
 *
 * @param {ArraySearchMarker} marker
 * @param {Item} p
 * @param {number} index
 */
const overwriteMarker$1 = (marker, p, index) => {
  marker.p.marker = false;
  marker.p = p;
  p.marker = true;
  marker.index = index;
  marker.timestamp = globalSearchMarkerTimestamp$1++;
};

/**
 * @param {Array<ArraySearchMarker>} searchMarker
 * @param {Item} p
 * @param {number} index
 */
const markPosition$1 = (searchMarker, p, index) => {
  if (searchMarker.length >= maxSearchMarker$1) {
    // override oldest marker (we don't want to create more objects)
    const marker = searchMarker.reduce((a, b) => a.timestamp < b.timestamp ? a : b);
    overwriteMarker$1(marker, p, index);
    return marker
  } else {
    // create new marker
    const pm = new ArraySearchMarker$1(p, index);
    searchMarker.push(pm);
    return pm
  }
};

/**
 * Search marker help us to find positions in the associative array faster.
 *
 * They speed up the process of finding a position without much bookkeeping.
 *
 * A maximum of `maxSearchMarker` objects are created.
 *
 * This function always returns a refreshed marker (updated timestamp)
 *
 * @param {AbstractType<any>} yarray
 * @param {number} index
 */
const findMarker$1 = (yarray, index) => {
  if (yarray._start === null || index === 0 || yarray._searchMarker === null) {
    return null
  }
  const marker = yarray._searchMarker.length === 0 ? null : yarray._searchMarker.reduce((a, b) => abs$2(index - a.index) < abs$2(index - b.index) ? a : b);
  let p = yarray._start;
  let pindex = 0;
  if (marker !== null) {
    p = marker.p;
    pindex = marker.index;
    refreshMarkerTimestamp$1(marker); // we used it, we might need to use it again
  }
  // iterate to right if possible
  while (p.right !== null && pindex < index) {
    if (!p.deleted && p.countable) {
      if (index < pindex + p.length) {
        break
      }
      pindex += p.length;
    }
    p = p.right;
  }
  // iterate to left if necessary (might be that pindex > index)
  while (p.left !== null && pindex > index) {
    p = p.left;
    if (!p.deleted && p.countable) {
      pindex -= p.length;
    }
  }
  // we want to make sure that p can't be merged with left, because that would screw up everything
  // in that cas just return what we have (it is most likely the best marker anyway)
  // iterate to left until p can't be merged with left
  while (p.left !== null && p.left.id.client === p.id.client && p.left.id.clock + p.left.length === p.id.clock) {
    p = p.left;
    if (!p.deleted && p.countable) {
      pindex -= p.length;
    }
  }

  // @todo remove!
  // assure position
  // {
  //   let start = yarray._start
  //   let pos = 0
  //   while (start !== p) {
  //     if (!start.deleted && start.countable) {
  //       pos += start.length
  //     }
  //     start = /** @type {Item} */ (start.right)
  //   }
  //   if (pos !== pindex) {
  //     debugger
  //     throw new Error('Gotcha position fail!')
  //   }
  // }
  // if (marker) {
  //   if (window.lengthes == null) {
  //     window.lengthes = []
  //     window.getLengthes = () => window.lengthes.sort((a, b) => a - b)
  //   }
  //   window.lengthes.push(marker.index - pindex)
  //   console.log('distance', marker.index - pindex, 'len', p && p.parent.length)
  // }
  if (marker !== null && abs$2(marker.index - pindex) < /** @type {YText|YArray<any>} */ (p.parent).length / maxSearchMarker$1) {
    // adjust existing marker
    overwriteMarker$1(marker, p, pindex);
    return marker
  } else {
    // create new marker
    return markPosition$1(yarray._searchMarker, p, pindex)
  }
};

/**
 * Update markers when a change happened.
 *
 * This should be called before doing a deletion!
 *
 * @param {Array<ArraySearchMarker>} searchMarker
 * @param {number} index
 * @param {number} len If insertion, len is positive. If deletion, len is negative.
 */
const updateMarkerChanges$1 = (searchMarker, index, len) => {
  for (let i = searchMarker.length - 1; i >= 0; i--) {
    const m = searchMarker[i];
    if (len > 0) {
      /**
       * @type {Item|null}
       */
      let p = m.p;
      p.marker = false;
      // Ideally we just want to do a simple position comparison, but this will only work if
      // search markers don't point to deleted items for formats.
      // Iterate marker to prev undeleted countable position so we know what to do when updating a position
      while (p && (p.deleted || !p.countable)) {
        p = p.left;
        if (p && !p.deleted && p.countable) {
          // adjust position. the loop should break now
          m.index -= p.length;
        }
      }
      if (p === null || p.marker === true) {
        // remove search marker if updated position is null or if position is already marked
        searchMarker.splice(i, 1);
        continue
      }
      m.p = p;
      p.marker = true;
    }
    if (index < m.index || (len > 0 && index === m.index)) { // a simple index <= m.index check would actually suffice
      m.index = max$2(index, m.index + len);
    }
  }
};

/**
 * Call event listeners with an event. This will also add an event to all
 * parents (for `.observeDeep` handlers).
 *
 * @template EventType
 * @param {AbstractType<EventType>} type
 * @param {Transaction} transaction
 * @param {EventType} event
 */
const callTypeObservers$1 = (type, transaction, event) => {
  const changedType = type;
  const changedParentTypes = transaction.changedParentTypes;
  while (true) {
    // @ts-ignore
    setIfUndefined$2(changedParentTypes, type, () => []).push(event);
    if (type._item === null) {
      break
    }
    type = /** @type {AbstractType<any>} */ (type._item.parent);
  }
  callEventHandlerListeners$1(changedType._eH, event, transaction);
};

/**
 * @template EventType
 * Abstract Yjs Type class
 */
class AbstractType$1 {
  constructor () {
    /**
     * @type {Item|null}
     */
    this._item = null;
    /**
     * @type {Map<string,Item>}
     */
    this._map = new Map();
    /**
     * @type {Item|null}
     */
    this._start = null;
    /**
     * @type {Doc|null}
     */
    this.doc = null;
    this._length = 0;
    /**
     * Event handlers
     * @type {EventHandler<EventType,Transaction>}
     */
    this._eH = createEventHandler$1();
    /**
     * Deep event handlers
     * @type {EventHandler<Array<YEvent>,Transaction>}
     */
    this._dEH = createEventHandler$1();
    /**
     * @type {null | Array<ArraySearchMarker>}
     */
    this._searchMarker = null;
  }

  /**
   * @return {AbstractType<any>|null}
   */
  get parent () {
    return this._item ? /** @type {AbstractType<any>} */ (this._item.parent) : null
  }

  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item|null} item
   */
  _integrate (y, item) {
    this.doc = y;
    this._item = item;
  }

  /**
   * @return {AbstractType<EventType>}
   */
  _copy () {
    throw methodUnimplemented$2()
  }

  /**
   * @return {AbstractType<EventType>}
   */
  clone () {
    throw methodUnimplemented$2()
  }

  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write (encoder) { }

  /**
   * The first non-deleted item
   */
  get _first () {
    let n = this._start;
    while (n !== null && n.deleted) {
      n = n.right;
    }
    return n
  }

  /**
   * Creates YEvent and calls all type observers.
   * Must be implemented by each type.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver (transaction, parentSubs) {
    if (!transaction.local && this._searchMarker) {
      this._searchMarker.length = 0;
    }
  }

  /**
   * Observe all events that are created on this type.
   *
   * @param {function(EventType, Transaction):void} f Observer function
   */
  observe (f) {
    addEventHandlerListener$1(this._eH, f);
  }

  /**
   * Observe all events that are created by this type and its children.
   *
   * @param {function(Array<YEvent>,Transaction):void} f Observer function
   */
  observeDeep (f) {
    addEventHandlerListener$1(this._dEH, f);
  }

  /**
   * Unregister an observer function.
   *
   * @param {function(EventType,Transaction):void} f Observer function
   */
  unobserve (f) {
    removeEventHandlerListener$1(this._eH, f);
  }

  /**
   * Unregister an observer function.
   *
   * @param {function(Array<YEvent>,Transaction):void} f Observer function
   */
  unobserveDeep (f) {
    removeEventHandlerListener$1(this._dEH, f);
  }

  /**
   * @abstract
   * @return {any}
   */
  toJSON () {}
}

/**
 * @param {AbstractType<any>} type
 * @param {number} start
 * @param {number} end
 * @return {Array<any>}
 *
 * @private
 * @function
 */
const typeListSlice$1 = (type, start, end) => {
  if (start < 0) {
    start = type._length + start;
  }
  if (end < 0) {
    end = type._length + end;
  }
  let len = end - start;
  const cs = [];
  let n = type._start;
  while (n !== null && len > 0) {
    if (n.countable && !n.deleted) {
      const c = n.content.getContent();
      if (c.length <= start) {
        start -= c.length;
      } else {
        for (let i = start; i < c.length && len > 0; i++) {
          cs.push(c[i]);
          len--;
        }
        start = 0;
      }
    }
    n = n.right;
  }
  return cs
};

/**
 * @param {AbstractType<any>} type
 * @return {Array<any>}
 *
 * @private
 * @function
 */
const typeListToArray$1 = type => {
  const cs = [];
  let n = type._start;
  while (n !== null) {
    if (n.countable && !n.deleted) {
      const c = n.content.getContent();
      for (let i = 0; i < c.length; i++) {
        cs.push(c[i]);
      }
    }
    n = n.right;
  }
  return cs
};

/**
 * Executes a provided function on once on overy element of this YArray.
 *
 * @param {AbstractType<any>} type
 * @param {function(any,number,any):void} f A function to execute on every element of this YArray.
 *
 * @private
 * @function
 */
const typeListForEach$1 = (type, f) => {
  let index = 0;
  let n = type._start;
  while (n !== null) {
    if (n.countable && !n.deleted) {
      const c = n.content.getContent();
      for (let i = 0; i < c.length; i++) {
        f(c[i], index++, type);
      }
    }
    n = n.right;
  }
};

/**
 * @template C,R
 * @param {AbstractType<any>} type
 * @param {function(C,number,AbstractType<any>):R} f
 * @return {Array<R>}
 *
 * @private
 * @function
 */
const typeListMap$1 = (type, f) => {
  /**
   * @type {Array<any>}
   */
  const result = [];
  typeListForEach$1(type, (c, i) => {
    result.push(f(c, i, type));
  });
  return result
};

/**
 * @param {AbstractType<any>} type
 * @return {IterableIterator<any>}
 *
 * @private
 * @function
 */
const typeListCreateIterator$1 = type => {
  let n = type._start;
  /**
   * @type {Array<any>|null}
   */
  let currentContent = null;
  let currentContentIndex = 0;
  return {
    [Symbol.iterator] () {
      return this
    },
    next: () => {
      // find some content
      if (currentContent === null) {
        while (n !== null && n.deleted) {
          n = n.right;
        }
        // check if we reached the end, no need to check currentContent, because it does not exist
        if (n === null) {
          return {
            done: true,
            value: undefined
          }
        }
        // we found n, so we can set currentContent
        currentContent = n.content.getContent();
        currentContentIndex = 0;
        n = n.right; // we used the content of n, now iterate to next
      }
      const value = currentContent[currentContentIndex++];
      // check if we need to empty currentContent
      if (currentContent.length <= currentContentIndex) {
        currentContent = null;
      }
      return {
        done: false,
        value
      }
    }
  }
};

/**
 * @param {AbstractType<any>} type
 * @param {number} index
 * @return {any}
 *
 * @private
 * @function
 */
const typeListGet$1 = (type, index) => {
  const marker = findMarker$1(type, index);
  let n = type._start;
  if (marker !== null) {
    n = marker.p;
    index -= marker.index;
  }
  for (; n !== null; n = n.right) {
    if (!n.deleted && n.countable) {
      if (index < n.length) {
        return n.content.getContent()[index]
      }
      index -= n.length;
    }
  }
};

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {Item?} referenceItem
 * @param {Array<Object<string,any>|Array<any>|boolean|number|null|string|Uint8Array>} content
 *
 * @private
 * @function
 */
const typeListInsertGenericsAfter$1 = (transaction, parent, referenceItem, content) => {
  let left = referenceItem;
  const doc = transaction.doc;
  const ownClientId = doc.clientID;
  const store = doc.store;
  const right = referenceItem === null ? parent._start : referenceItem.right;
  /**
   * @type {Array<Object|Array<any>|number|null>}
   */
  let jsonContent = [];
  const packJsonContent = () => {
    if (jsonContent.length > 0) {
      left = new Item$2(createID$1(ownClientId, getState$1(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentAny$1(jsonContent));
      left.integrate(transaction, 0);
      jsonContent = [];
    }
  };
  content.forEach(c => {
    if (c === null) {
      jsonContent.push(c);
    } else {
      switch (c.constructor) {
        case Number:
        case Object:
        case Boolean:
        case Array:
        case String:
          jsonContent.push(c);
          break
        default:
          packJsonContent();
          switch (c.constructor) {
            case Uint8Array:
            case ArrayBuffer:
              left = new Item$2(createID$1(ownClientId, getState$1(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentBinary$1(new Uint8Array(/** @type {Uint8Array} */ (c))));
              left.integrate(transaction, 0);
              break
            case Doc$1:
              left = new Item$2(createID$1(ownClientId, getState$1(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentDoc$1(/** @type {Doc} */ (c)));
              left.integrate(transaction, 0);
              break
            default:
              if (c instanceof AbstractType$1) {
                left = new Item$2(createID$1(ownClientId, getState$1(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentType$1(c));
                left.integrate(transaction, 0);
              } else {
                throw new Error('Unexpected content type in insert operation')
              }
          }
      }
    }
  });
  packJsonContent();
};

const lengthExceeded$1 = create$g('Length exceeded!');

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {number} index
 * @param {Array<Object<string,any>|Array<any>|number|null|string|Uint8Array>} content
 *
 * @private
 * @function
 */
const typeListInsertGenerics$1 = (transaction, parent, index, content) => {
  if (index > parent._length) {
    throw lengthExceeded$1
  }
  if (index === 0) {
    if (parent._searchMarker) {
      updateMarkerChanges$1(parent._searchMarker, index, content.length);
    }
    return typeListInsertGenericsAfter$1(transaction, parent, null, content)
  }
  const startIndex = index;
  const marker = findMarker$1(parent, index);
  let n = parent._start;
  if (marker !== null) {
    n = marker.p;
    index -= marker.index;
    // we need to iterate one to the left so that the algorithm works
    if (index === 0) {
      // @todo refactor this as it actually doesn't consider formats
      n = n.prev; // important! get the left undeleted item so that we can actually decrease index
      index += (n && n.countable && !n.deleted) ? n.length : 0;
    }
  }
  for (; n !== null; n = n.right) {
    if (!n.deleted && n.countable) {
      if (index <= n.length) {
        if (index < n.length) {
          // insert in-between
          getItemCleanStart$1(transaction, createID$1(n.id.client, n.id.clock + index));
        }
        break
      }
      index -= n.length;
    }
  }
  if (parent._searchMarker) {
    updateMarkerChanges$1(parent._searchMarker, startIndex, content.length);
  }
  return typeListInsertGenericsAfter$1(transaction, parent, n, content)
};

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {number} index
 * @param {number} length
 *
 * @private
 * @function
 */
const typeListDelete$1 = (transaction, parent, index, length) => {
  if (length === 0) { return }
  const startIndex = index;
  const startLength = length;
  const marker = findMarker$1(parent, index);
  let n = parent._start;
  if (marker !== null) {
    n = marker.p;
    index -= marker.index;
  }
  // compute the first item to be deleted
  for (; n !== null && index > 0; n = n.right) {
    if (!n.deleted && n.countable) {
      if (index < n.length) {
        getItemCleanStart$1(transaction, createID$1(n.id.client, n.id.clock + index));
      }
      index -= n.length;
    }
  }
  // delete all items until done
  while (length > 0 && n !== null) {
    if (!n.deleted) {
      if (length < n.length) {
        getItemCleanStart$1(transaction, createID$1(n.id.client, n.id.clock + length));
      }
      n.delete(transaction);
      length -= n.length;
    }
    n = n.right;
  }
  if (length > 0) {
    throw lengthExceeded$1
  }
  if (parent._searchMarker) {
    updateMarkerChanges$1(parent._searchMarker, startIndex, -startLength + length /* in case we remove the above exception */);
  }
};

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {string} key
 *
 * @private
 * @function
 */
const typeMapDelete$1 = (transaction, parent, key) => {
  const c = parent._map.get(key);
  if (c !== undefined) {
    c.delete(transaction);
  }
};

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {string} key
 * @param {Object|number|null|Array<any>|string|Uint8Array|AbstractType<any>} value
 *
 * @private
 * @function
 */
const typeMapSet$1 = (transaction, parent, key, value) => {
  const left = parent._map.get(key) || null;
  const doc = transaction.doc;
  const ownClientId = doc.clientID;
  let content;
  if (value == null) {
    content = new ContentAny$1([value]);
  } else {
    switch (value.constructor) {
      case Number:
      case Object:
      case Boolean:
      case Array:
      case String:
        content = new ContentAny$1([value]);
        break
      case Uint8Array:
        content = new ContentBinary$1(/** @type {Uint8Array} */ (value));
        break
      case Doc$1:
        content = new ContentDoc$1(/** @type {Doc} */ (value));
        break
      default:
        if (value instanceof AbstractType$1) {
          content = new ContentType$1(value);
        } else {
          throw new Error('Unexpected content type')
        }
    }
  }
  new Item$2(createID$1(ownClientId, getState$1(doc.store, ownClientId)), left, left && left.lastId, null, null, parent, key, content).integrate(transaction, 0);
};

/**
 * @param {AbstractType<any>} parent
 * @param {string} key
 * @return {Object<string,any>|number|null|Array<any>|string|Uint8Array|AbstractType<any>|undefined}
 *
 * @private
 * @function
 */
const typeMapGet$1 = (parent, key) => {
  const val = parent._map.get(key);
  return val !== undefined && !val.deleted ? val.content.getContent()[val.length - 1] : undefined
};

/**
 * @param {AbstractType<any>} parent
 * @return {Object<string,Object<string,any>|number|null|Array<any>|string|Uint8Array|AbstractType<any>|undefined>}
 *
 * @private
 * @function
 */
const typeMapGetAll$1 = (parent) => {
  /**
   * @type {Object<string,any>}
   */
  const res = {};
  parent._map.forEach((value, key) => {
    if (!value.deleted) {
      res[key] = value.content.getContent()[value.length - 1];
    }
  });
  return res
};

/**
 * @param {AbstractType<any>} parent
 * @param {string} key
 * @return {boolean}
 *
 * @private
 * @function
 */
const typeMapHas$1 = (parent, key) => {
  const val = parent._map.get(key);
  return val !== undefined && !val.deleted
};

/**
 * @param {Map<string,Item>} map
 * @return {IterableIterator<Array<any>>}
 *
 * @private
 * @function
 */
const createMapIterator$1 = map => iteratorFilter$2(map.entries(), /** @param {any} entry */ entry => !entry[1].deleted);

/**
 * @module YArray
 */

/**
 * Event that describes the changes on a YArray
 * @template T
 */
class YArrayEvent$1 extends YEvent$1 {
  /**
   * @param {YArray<T>} yarray The changed type
   * @param {Transaction} transaction The transaction object
   */
  constructor (yarray, transaction) {
    super(yarray, transaction);
    this._transaction = transaction;
  }
}

/**
 * A shared Array implementation.
 * @template T
 * @extends AbstractType<YArrayEvent<T>>
 * @implements {Iterable<T>}
 */
class YArray$1 extends AbstractType$1 {
  constructor () {
    super();
    /**
     * @type {Array<any>?}
     * @private
     */
    this._prelimContent = [];
    /**
     * @type {Array<ArraySearchMarker>}
     */
    this._searchMarker = [];
  }

  /**
   * Construct a new YArray containing the specified items.
   * @template T
   * @param {Array<T>} items
   * @return {YArray<T>}
   */
  static from (items) {
    const a = new YArray$1();
    a.push(items);
    return a
  }

  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate (y, item) {
    super._integrate(y, item);
    this.insert(0, /** @type {Array<any>} */ (this._prelimContent));
    this._prelimContent = null;
  }

  _copy () {
    return new YArray$1()
  }

  /**
   * @return {YArray<T>}
   */
  clone () {
    const arr = new YArray$1();
    arr.insert(0, this.toArray().map(el =>
      el instanceof AbstractType$1 ? el.clone() : el
    ));
    return arr
  }

  get length () {
    return this._prelimContent === null ? this._length : this._prelimContent.length
  }

  /**
   * Creates YArrayEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver (transaction, parentSubs) {
    super._callObserver(transaction, parentSubs);
    callTypeObservers$1(this, transaction, new YArrayEvent$1(this, transaction));
  }

  /**
   * Inserts new content at an index.
   *
   * Important: This function expects an array of content. Not just a content
   * object. The reason for this "weirdness" is that inserting several elements
   * is very efficient when it is done as a single operation.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  yarray.insert(0, ['a'])
   *  // Insert numbers 1, 2 at position 1
   *  yarray.insert(1, [1, 2])
   *
   * @param {number} index The index to insert content at.
   * @param {Array<T>} content The array of content
   */
  insert (index, content) {
    if (this.doc !== null) {
      transact$1(this.doc, transaction => {
        typeListInsertGenerics$1(transaction, this, index, content);
      });
    } else {
      /** @type {Array<any>} */ (this._prelimContent).splice(index, 0, ...content);
    }
  }

  /**
   * Appends content to this YArray.
   *
   * @param {Array<T>} content Array of content to append.
   */
  push (content) {
    this.insert(this.length, content);
  }

  /**
   * Preppends content to this YArray.
   *
   * @param {Array<T>} content Array of content to preppend.
   */
  unshift (content) {
    this.insert(0, content);
  }

  /**
   * Deletes elements starting from an index.
   *
   * @param {number} index Index at which to start deleting elements
   * @param {number} length The number of elements to remove. Defaults to 1.
   */
  delete (index, length = 1) {
    if (this.doc !== null) {
      transact$1(this.doc, transaction => {
        typeListDelete$1(transaction, this, index, length);
      });
    } else {
      /** @type {Array<any>} */ (this._prelimContent).splice(index, length);
    }
  }

  /**
   * Returns the i-th element from a YArray.
   *
   * @param {number} index The index of the element to return from the YArray
   * @return {T}
   */
  get (index) {
    return typeListGet$1(this, index)
  }

  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @return {Array<T>}
   */
  toArray () {
    return typeListToArray$1(this)
  }

  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @param {number} [start]
   * @param {number} [end]
   * @return {Array<T>}
   */
  slice (start = 0, end = this.length) {
    return typeListSlice$1(this, start, end)
  }

  /**
   * Transforms this Shared Type to a JSON object.
   *
   * @return {Array<any>}
   */
  toJSON () {
    return this.map(c => c instanceof AbstractType$1 ? c.toJSON() : c)
  }

  /**
   * Returns an Array with the result of calling a provided function on every
   * element of this YArray.
   *
   * @template M
   * @param {function(T,number,YArray<T>):M} f Function that produces an element of the new Array
   * @return {Array<M>} A new array with each element being the result of the
   *                 callback function
   */
  map (f) {
    return typeListMap$1(this, /** @type {any} */ (f))
  }

  /**
   * Executes a provided function on once on overy element of this YArray.
   *
   * @param {function(T,number,YArray<T>):void} f A function to execute on every element of this YArray.
   */
  forEach (f) {
    typeListForEach$1(this, f);
  }

  /**
   * @return {IterableIterator<T>}
   */
  [Symbol.iterator] () {
    return typeListCreateIterator$1(this)
  }

  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write (encoder) {
    encoder.writeTypeRef(YArrayRefID$1);
  }
}

/**
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 *
 * @private
 * @function
 */
const readYArray$1 = decoder => new YArray$1();

/**
 * @template T
 * Event that describes the changes on a YMap.
 */
class YMapEvent$1 extends YEvent$1 {
  /**
   * @param {YMap<T>} ymap The YArray that changed.
   * @param {Transaction} transaction
   * @param {Set<any>} subs The keys that changed.
   */
  constructor (ymap, transaction, subs) {
    super(ymap, transaction);
    this.keysChanged = subs;
  }
}

/**
 * @template MapType
 * A shared Map implementation.
 *
 * @extends AbstractType<YMapEvent<MapType>>
 * @implements {Iterable<MapType>}
 */
class YMap$1 extends AbstractType$1 {
  /**
   *
   * @param {Iterable<readonly [string, any]>=} entries - an optional iterable to initialize the YMap
   */
  constructor (entries) {
    super();
    /**
     * @type {Map<string,any>?}
     * @private
     */
    this._prelimContent = null;

    if (entries === undefined) {
      this._prelimContent = new Map();
    } else {
      this._prelimContent = new Map(entries);
    }
  }

  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate (y, item) {
    super._integrate(y, item)
    ;/** @type {Map<string, any>} */ (this._prelimContent).forEach((value, key) => {
      this.set(key, value);
    });
    this._prelimContent = null;
  }

  _copy () {
    return new YMap$1()
  }

  /**
   * @return {YMap<MapType>}
   */
  clone () {
    const map = new YMap$1();
    this.forEach((value, key) => {
      map.set(key, value instanceof AbstractType$1 ? value.clone() : value);
    });
    return map
  }

  /**
   * Creates YMapEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver (transaction, parentSubs) {
    callTypeObservers$1(this, transaction, new YMapEvent$1(this, transaction, parentSubs));
  }

  /**
   * Transforms this Shared Type to a JSON object.
   *
   * @return {Object<string,any>}
   */
  toJSON () {
    /**
     * @type {Object<string,MapType>}
     */
    const map = {};
    this._map.forEach((item, key) => {
      if (!item.deleted) {
        const v = item.content.getContent()[item.length - 1];
        map[key] = v instanceof AbstractType$1 ? v.toJSON() : v;
      }
    });
    return map
  }

  /**
   * Returns the size of the YMap (count of key/value pairs)
   *
   * @return {number}
   */
  get size () {
    return [...createMapIterator$1(this._map)].length
  }

  /**
   * Returns the keys for each element in the YMap Type.
   *
   * @return {IterableIterator<string>}
   */
  keys () {
    return iteratorMap$2(createMapIterator$1(this._map), /** @param {any} v */ v => v[0])
  }

  /**
   * Returns the values for each element in the YMap Type.
   *
   * @return {IterableIterator<any>}
   */
  values () {
    return iteratorMap$2(createMapIterator$1(this._map), /** @param {any} v */ v => v[1].content.getContent()[v[1].length - 1])
  }

  /**
   * Returns an Iterator of [key, value] pairs
   *
   * @return {IterableIterator<any>}
   */
  entries () {
    return iteratorMap$2(createMapIterator$1(this._map), /** @param {any} v */ v => [v[0], v[1].content.getContent()[v[1].length - 1]])
  }

  /**
   * Executes a provided function on once on every key-value pair.
   *
   * @param {function(MapType,string,YMap<MapType>):void} f A function to execute on every element of this YArray.
   */
  forEach (f) {
    /**
     * @type {Object<string,MapType>}
     */
    const map = {};
    this._map.forEach((item, key) => {
      if (!item.deleted) {
        f(item.content.getContent()[item.length - 1], key, this);
      }
    });
    return map
  }

  /**
   * @return {IterableIterator<MapType>}
   */
  [Symbol.iterator] () {
    return this.entries()
  }

  /**
   * Remove a specified element from this YMap.
   *
   * @param {string} key The key of the element to remove.
   */
  delete (key) {
    if (this.doc !== null) {
      transact$1(this.doc, transaction => {
        typeMapDelete$1(transaction, this, key);
      });
    } else {
      /** @type {Map<string, any>} */ (this._prelimContent).delete(key);
    }
  }

  /**
   * Adds or updates an element with a specified key and value.
   *
   * @param {string} key The key of the element to add to this YMap
   * @param {MapType} value The value of the element to add
   */
  set (key, value) {
    if (this.doc !== null) {
      transact$1(this.doc, transaction => {
        typeMapSet$1(transaction, this, key, value);
      });
    } else {
      /** @type {Map<string, any>} */ (this._prelimContent).set(key, value);
    }
    return value
  }

  /**
   * Returns a specified element from this YMap.
   *
   * @param {string} key
   * @return {MapType|undefined}
   */
  get (key) {
    return /** @type {any} */ (typeMapGet$1(this, key))
  }

  /**
   * Returns a boolean indicating whether the specified key exists or not.
   *
   * @param {string} key The key to test.
   * @return {boolean}
   */
  has (key) {
    return typeMapHas$1(this, key)
  }

  /**
   * Removes all elements from this YMap.
   */
  clear () {
    if (this.doc !== null) {
      transact$1(this.doc, transaction => {
        this.forEach(function (value, key, map) {
          typeMapDelete$1(transaction, map, key);
        });
      });
    } else {
      /** @type {Map<string, any>} */ (this._prelimContent).clear();
    }
  }

  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write (encoder) {
    encoder.writeTypeRef(YMapRefID$1);
  }
}

/**
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 *
 * @private
 * @function
 */
const readYMap$1 = decoder => new YMap$1();

/**
 * @param {any} a
 * @param {any} b
 * @return {boolean}
 */
const equalAttrs$1 = (a, b) => a === b || (typeof a === 'object' && typeof b === 'object' && a && b && equalFlat$4(a, b));

class ItemTextListPosition$1 {
  /**
   * @param {Item|null} left
   * @param {Item|null} right
   * @param {number} index
   * @param {Map<string,any>} currentAttributes
   */
  constructor (left, right, index, currentAttributes) {
    this.left = left;
    this.right = right;
    this.index = index;
    this.currentAttributes = currentAttributes;
  }

  /**
   * Only call this if you know that this.right is defined
   */
  forward () {
    if (this.right === null) {
      unexpectedCase$2();
    }
    switch (this.right.content.constructor) {
      case ContentFormat$1:
        if (!this.right.deleted) {
          updateCurrentAttributes$1(this.currentAttributes, /** @type {ContentFormat} */ (this.right.content));
        }
        break
      default:
        if (!this.right.deleted) {
          this.index += this.right.length;
        }
        break
    }
    this.left = this.right;
    this.right = this.right.right;
  }
}

/**
 * @param {Transaction} transaction
 * @param {ItemTextListPosition} pos
 * @param {number} count steps to move forward
 * @return {ItemTextListPosition}
 *
 * @private
 * @function
 */
const findNextPosition$1 = (transaction, pos, count) => {
  while (pos.right !== null && count > 0) {
    switch (pos.right.content.constructor) {
      case ContentFormat$1:
        if (!pos.right.deleted) {
          updateCurrentAttributes$1(pos.currentAttributes, /** @type {ContentFormat} */ (pos.right.content));
        }
        break
      default:
        if (!pos.right.deleted) {
          if (count < pos.right.length) {
            // split right
            getItemCleanStart$1(transaction, createID$1(pos.right.id.client, pos.right.id.clock + count));
          }
          pos.index += pos.right.length;
          count -= pos.right.length;
        }
        break
    }
    pos.left = pos.right;
    pos.right = pos.right.right;
    // pos.forward() - we don't forward because that would halve the performance because we already do the checks above
  }
  return pos
};

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {number} index
 * @return {ItemTextListPosition}
 *
 * @private
 * @function
 */
const findPosition$1 = (transaction, parent, index) => {
  const currentAttributes = new Map();
  const marker = findMarker$1(parent, index);
  if (marker) {
    const pos = new ItemTextListPosition$1(marker.p.left, marker.p, marker.index, currentAttributes);
    return findNextPosition$1(transaction, pos, index - marker.index)
  } else {
    const pos = new ItemTextListPosition$1(null, parent._start, 0, currentAttributes);
    return findNextPosition$1(transaction, pos, index)
  }
};

/**
 * Negate applied formats
 *
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {ItemTextListPosition} currPos
 * @param {Map<string,any>} negatedAttributes
 *
 * @private
 * @function
 */
const insertNegatedAttributes$1 = (transaction, parent, currPos, negatedAttributes) => {
  // check if we really need to remove attributes
  while (
    currPos.right !== null && (
      currPos.right.deleted === true || (
        currPos.right.content.constructor === ContentFormat$1 &&
        equalAttrs$1(negatedAttributes.get(/** @type {ContentFormat} */ (currPos.right.content).key), /** @type {ContentFormat} */ (currPos.right.content).value)
      )
    )
  ) {
    if (!currPos.right.deleted) {
      negatedAttributes.delete(/** @type {ContentFormat} */ (currPos.right.content).key);
    }
    currPos.forward();
  }
  const doc = transaction.doc;
  const ownClientId = doc.clientID;
  negatedAttributes.forEach((val, key) => {
    const left = currPos.left;
    const right = currPos.right;
    const nextFormat = new Item$2(createID$1(ownClientId, getState$1(doc.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentFormat$1(key, val));
    nextFormat.integrate(transaction, 0);
    currPos.right = nextFormat;
    currPos.forward();
  });
};

/**
 * @param {Map<string,any>} currentAttributes
 * @param {ContentFormat} format
 *
 * @private
 * @function
 */
const updateCurrentAttributes$1 = (currentAttributes, format) => {
  const { key, value } = format;
  if (value === null) {
    currentAttributes.delete(key);
  } else {
    currentAttributes.set(key, value);
  }
};

/**
 * @param {ItemTextListPosition} currPos
 * @param {Object<string,any>} attributes
 *
 * @private
 * @function
 */
const minimizeAttributeChanges$1 = (currPos, attributes) => {
  // go right while attributes[right.key] === right.value (or right is deleted)
  while (true) {
    if (currPos.right === null) {
      break
    } else if (currPos.right.deleted || (currPos.right.content.constructor === ContentFormat$1 && equalAttrs$1(attributes[(/** @type {ContentFormat} */ (currPos.right.content)).key] || null, /** @type {ContentFormat} */ (currPos.right.content).value))) ; else {
      break
    }
    currPos.forward();
  }
};

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {ItemTextListPosition} currPos
 * @param {Object<string,any>} attributes
 * @return {Map<string,any>}
 *
 * @private
 * @function
 **/
const insertAttributes$1 = (transaction, parent, currPos, attributes) => {
  const doc = transaction.doc;
  const ownClientId = doc.clientID;
  const negatedAttributes = new Map();
  // insert format-start items
  for (const key in attributes) {
    const val = attributes[key];
    const currentVal = currPos.currentAttributes.get(key) || null;
    if (!equalAttrs$1(currentVal, val)) {
      // save negated attribute (set null if currentVal undefined)
      negatedAttributes.set(key, currentVal);
      const { left, right } = currPos;
      currPos.right = new Item$2(createID$1(ownClientId, getState$1(doc.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentFormat$1(key, val));
      currPos.right.integrate(transaction, 0);
      currPos.forward();
    }
  }
  return negatedAttributes
};

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {ItemTextListPosition} currPos
 * @param {string|object|AbstractType<any>} text
 * @param {Object<string,any>} attributes
 *
 * @private
 * @function
 **/
const insertText$1 = (transaction, parent, currPos, text, attributes) => {
  currPos.currentAttributes.forEach((val, key) => {
    if (attributes[key] === undefined) {
      attributes[key] = null;
    }
  });
  const doc = transaction.doc;
  const ownClientId = doc.clientID;
  minimizeAttributeChanges$1(currPos, attributes);
  const negatedAttributes = insertAttributes$1(transaction, parent, currPos, attributes);
  // insert content
  const content = text.constructor === String ? new ContentString$1(/** @type {string} */ (text)) : (text instanceof AbstractType$1 ? new ContentType$1(text) : new ContentEmbed$1(text));
  let { left, right, index } = currPos;
  if (parent._searchMarker) {
    updateMarkerChanges$1(parent._searchMarker, currPos.index, content.getLength());
  }
  right = new Item$2(createID$1(ownClientId, getState$1(doc.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, content);
  right.integrate(transaction, 0);
  currPos.right = right;
  currPos.index = index;
  currPos.forward();
  insertNegatedAttributes$1(transaction, parent, currPos, negatedAttributes);
};

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {ItemTextListPosition} currPos
 * @param {number} length
 * @param {Object<string,any>} attributes
 *
 * @private
 * @function
 */
const formatText$1 = (transaction, parent, currPos, length, attributes) => {
  const doc = transaction.doc;
  const ownClientId = doc.clientID;
  minimizeAttributeChanges$1(currPos, attributes);
  const negatedAttributes = insertAttributes$1(transaction, parent, currPos, attributes);
  // iterate until first non-format or null is found
  // delete all formats with attributes[format.key] != null
  while (length > 0 && currPos.right !== null) {
    if (!currPos.right.deleted) {
      switch (currPos.right.content.constructor) {
        case ContentFormat$1: {
          const { key, value } = /** @type {ContentFormat} */ (currPos.right.content);
          const attr = attributes[key];
          if (attr !== undefined) {
            if (equalAttrs$1(attr, value)) {
              negatedAttributes.delete(key);
            } else {
              negatedAttributes.set(key, value);
            }
            currPos.right.delete(transaction);
          }
          break
        }
        default:
          if (length < currPos.right.length) {
            getItemCleanStart$1(transaction, createID$1(currPos.right.id.client, currPos.right.id.clock + length));
          }
          length -= currPos.right.length;
          break
      }
    }
    currPos.forward();
  }
  // Quill just assumes that the editor starts with a newline and that it always
  // ends with a newline. We only insert that newline when a new newline is
  // inserted - i.e when length is bigger than type.length
  if (length > 0) {
    let newlines = '';
    for (; length > 0; length--) {
      newlines += '\n';
    }
    currPos.right = new Item$2(createID$1(ownClientId, getState$1(doc.store, ownClientId)), currPos.left, currPos.left && currPos.left.lastId, currPos.right, currPos.right && currPos.right.id, parent, null, new ContentString$1(newlines));
    currPos.right.integrate(transaction, 0);
    currPos.forward();
  }
  insertNegatedAttributes$1(transaction, parent, currPos, negatedAttributes);
};

/**
 * Call this function after string content has been deleted in order to
 * clean up formatting Items.
 *
 * @param {Transaction} transaction
 * @param {Item} start
 * @param {Item|null} end exclusive end, automatically iterates to the next Content Item
 * @param {Map<string,any>} startAttributes
 * @param {Map<string,any>} endAttributes This attribute is modified!
 * @return {number} The amount of formatting Items deleted.
 *
 * @function
 */
const cleanupFormattingGap$1 = (transaction, start, end, startAttributes, endAttributes) => {
  while (end && (!end.countable || end.deleted)) {
    if (!end.deleted && end.content.constructor === ContentFormat$1) {
      updateCurrentAttributes$1(endAttributes, /** @type {ContentFormat} */ (end.content));
    }
    end = end.right;
  }
  let cleanups = 0;
  while (start !== end) {
    if (!start.deleted) {
      const content = start.content;
      switch (content.constructor) {
        case ContentFormat$1: {
          const { key, value } = /** @type {ContentFormat} */ (content);
          if ((endAttributes.get(key) || null) !== value || (startAttributes.get(key) || null) === value) {
            // Either this format is overwritten or it is not necessary because the attribute already existed.
            start.delete(transaction);
            cleanups++;
          }
          break
        }
      }
    }
    start = /** @type {Item} */ (start.right);
  }
  return cleanups
};

/**
 * @param {Transaction} transaction
 * @param {Item | null} item
 */
const cleanupContextlessFormattingGap$1 = (transaction, item) => {
  // iterate until item.right is null or content
  while (item && item.right && (item.right.deleted || !item.right.countable)) {
    item = item.right;
  }
  const attrs = new Set();
  // iterate back until a content item is found
  while (item && (item.deleted || !item.countable)) {
    if (!item.deleted && item.content.constructor === ContentFormat$1) {
      const key = /** @type {ContentFormat} */ (item.content).key;
      if (attrs.has(key)) {
        item.delete(transaction);
      } else {
        attrs.add(key);
      }
    }
    item = item.left;
  }
};

/**
 * This function is experimental and subject to change / be removed.
 *
 * Ideally, we don't need this function at all. Formatting attributes should be cleaned up
 * automatically after each change. This function iterates twice over the complete YText type
 * and removes unnecessary formatting attributes. This is also helpful for testing.
 *
 * This function won't be exported anymore as soon as there is confidence that the YText type works as intended.
 *
 * @param {YText} type
 * @return {number} How many formatting attributes have been cleaned up.
 */
const cleanupYTextFormatting$1 = type => {
  let res = 0;
  transact$1(/** @type {Doc} */ (type.doc), transaction => {
    let start = /** @type {Item} */ (type._start);
    let end = type._start;
    let startAttributes = create$j();
    const currentAttributes = copy$4(startAttributes);
    while (end) {
      if (end.deleted === false) {
        switch (end.content.constructor) {
          case ContentFormat$1:
            updateCurrentAttributes$1(currentAttributes, /** @type {ContentFormat} */ (end.content));
            break
          default:
            res += cleanupFormattingGap$1(transaction, start, end, startAttributes, currentAttributes);
            startAttributes = copy$4(currentAttributes);
            start = end;
            break
        }
      }
      end = end.right;
    }
  });
  return res
};

/**
 * @param {Transaction} transaction
 * @param {ItemTextListPosition} currPos
 * @param {number} length
 * @return {ItemTextListPosition}
 *
 * @private
 * @function
 */
const deleteText$1 = (transaction, currPos, length) => {
  const startLength = length;
  const startAttrs = copy$4(currPos.currentAttributes);
  const start = currPos.right;
  while (length > 0 && currPos.right !== null) {
    if (currPos.right.deleted === false) {
      switch (currPos.right.content.constructor) {
        case ContentType$1:
        case ContentEmbed$1:
        case ContentString$1:
          if (length < currPos.right.length) {
            getItemCleanStart$1(transaction, createID$1(currPos.right.id.client, currPos.right.id.clock + length));
          }
          length -= currPos.right.length;
          currPos.right.delete(transaction);
          break
      }
    }
    currPos.forward();
  }
  if (start) {
    cleanupFormattingGap$1(transaction, start, currPos.right, startAttrs, copy$4(currPos.currentAttributes));
  }
  const parent = /** @type {AbstractType<any>} */ (/** @type {Item} */ (currPos.left || currPos.right).parent);
  if (parent._searchMarker) {
    updateMarkerChanges$1(parent._searchMarker, currPos.index, -startLength + length);
  }
  return currPos
};

/**
 * The Quill Delta format represents changes on a text document with
 * formatting information. For mor information visit {@link https://quilljs.com/docs/delta/|Quill Delta}
 *
 * @example
 *   {
 *     ops: [
 *       { insert: 'Gandalf', attributes: { bold: true } },
 *       { insert: ' the ' },
 *       { insert: 'Grey', attributes: { color: '#cccccc' } }
 *     ]
 *   }
 *
 */

/**
  * Attributes that can be assigned to a selection of text.
  *
  * @example
  *   {
  *     bold: true,
  *     font-size: '40px'
  *   }
  *
  * @typedef {Object} TextAttributes
  */

/**
 * Event that describes the changes on a YText type.
 */
class YTextEvent$1 extends YEvent$1 {
  /**
   * @param {YText} ytext
   * @param {Transaction} transaction
   * @param {Set<any>} subs The keys that changed
   */
  constructor (ytext, transaction, subs) {
    super(ytext, transaction);
    /**
     * Whether the children changed.
     * @type {Boolean}
     * @private
     */
    this.childListChanged = false;
    /**
     * Set of all changed attributes.
     * @type {Set<string>}
     */
    this.keysChanged = new Set();
    subs.forEach((sub) => {
      if (sub === null) {
        this.childListChanged = true;
      } else {
        this.keysChanged.add(sub);
      }
    });
  }

  /**
   * @type {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert?:Array<any>|string, delete?:number, retain?:number}>}}
   */
  get changes () {
    if (this._changes === null) {
      /**
       * @type {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert?:Array<any>|string|AbstractType<any>|object, delete?:number, retain?:number}>}}
       */
      const changes = {
        keys: this.keys,
        delta: this.delta,
        added: new Set(),
        deleted: new Set()
      };
      this._changes = changes;
    }
    return /** @type {any} */ (this._changes)
  }

  /**
   * Compute the changes in the delta format.
   * A {@link https://quilljs.com/docs/delta/|Quill Delta}) that represents the changes on the document.
   *
   * @type {Array<{insert?:string|object|AbstractType<any>, delete?:number, retain?:number, attributes?: Object<string,any>}>}
   *
   * @public
   */
  get delta () {
    if (this._delta === null) {
      const y = /** @type {Doc} */ (this.target.doc);
      /**
       * @type {Array<{insert?:string|object|AbstractType<any>, delete?:number, retain?:number, attributes?: Object<string,any>}>}
       */
      const delta = [];
      transact$1(y, transaction => {
        const currentAttributes = new Map(); // saves all current attributes for insert
        const oldAttributes = new Map();
        let item = this.target._start;
        /**
         * @type {string?}
         */
        let action = null;
        /**
         * @type {Object<string,any>}
         */
        const attributes = {}; // counts added or removed new attributes for retain
        /**
         * @type {string|object}
         */
        let insert = '';
        let retain = 0;
        let deleteLen = 0;
        const addOp = () => {
          if (action !== null) {
            /**
             * @type {any}
             */
            let op;
            switch (action) {
              case 'delete':
                op = { delete: deleteLen };
                deleteLen = 0;
                break
              case 'insert':
                op = { insert };
                if (currentAttributes.size > 0) {
                  op.attributes = {};
                  currentAttributes.forEach((value, key) => {
                    if (value !== null) {
                      op.attributes[key] = value;
                    }
                  });
                }
                insert = '';
                break
              case 'retain':
                op = { retain };
                if (Object.keys(attributes).length > 0) {
                  op.attributes = {};
                  for (const key in attributes) {
                    op.attributes[key] = attributes[key];
                  }
                }
                retain = 0;
                break
            }
            delta.push(op);
            action = null;
          }
        };
        while (item !== null) {
          switch (item.content.constructor) {
            case ContentType$1:
            case ContentEmbed$1:
              if (this.adds(item)) {
                if (!this.deletes(item)) {
                  addOp();
                  action = 'insert';
                  insert = item.content.getContent()[0];
                  addOp();
                }
              } else if (this.deletes(item)) {
                if (action !== 'delete') {
                  addOp();
                  action = 'delete';
                }
                deleteLen += 1;
              } else if (!item.deleted) {
                if (action !== 'retain') {
                  addOp();
                  action = 'retain';
                }
                retain += 1;
              }
              break
            case ContentString$1:
              if (this.adds(item)) {
                if (!this.deletes(item)) {
                  if (action !== 'insert') {
                    addOp();
                    action = 'insert';
                  }
                  insert += /** @type {ContentString} */ (item.content).str;
                }
              } else if (this.deletes(item)) {
                if (action !== 'delete') {
                  addOp();
                  action = 'delete';
                }
                deleteLen += item.length;
              } else if (!item.deleted) {
                if (action !== 'retain') {
                  addOp();
                  action = 'retain';
                }
                retain += item.length;
              }
              break
            case ContentFormat$1: {
              const { key, value } = /** @type {ContentFormat} */ (item.content);
              if (this.adds(item)) {
                if (!this.deletes(item)) {
                  const curVal = currentAttributes.get(key) || null;
                  if (!equalAttrs$1(curVal, value)) {
                    if (action === 'retain') {
                      addOp();
                    }
                    if (equalAttrs$1(value, (oldAttributes.get(key) || null))) {
                      delete attributes[key];
                    } else {
                      attributes[key] = value;
                    }
                  } else {
                    item.delete(transaction);
                  }
                }
              } else if (this.deletes(item)) {
                oldAttributes.set(key, value);
                const curVal = currentAttributes.get(key) || null;
                if (!equalAttrs$1(curVal, value)) {
                  if (action === 'retain') {
                    addOp();
                  }
                  attributes[key] = curVal;
                }
              } else if (!item.deleted) {
                oldAttributes.set(key, value);
                const attr = attributes[key];
                if (attr !== undefined) {
                  if (!equalAttrs$1(attr, value)) {
                    if (action === 'retain') {
                      addOp();
                    }
                    if (value === null) {
                      delete attributes[key];
                    } else {
                      attributes[key] = value;
                    }
                  } else {
                    item.delete(transaction);
                  }
                }
              }
              if (!item.deleted) {
                if (action === 'insert') {
                  addOp();
                }
                updateCurrentAttributes$1(currentAttributes, /** @type {ContentFormat} */ (item.content));
              }
              break
            }
          }
          item = item.right;
        }
        addOp();
        while (delta.length > 0) {
          const lastOp = delta[delta.length - 1];
          if (lastOp.retain !== undefined && lastOp.attributes === undefined) {
            // retain delta's if they don't assign attributes
            delta.pop();
          } else {
            break
          }
        }
      });
      this._delta = delta;
    }
    return /** @type {any} */ (this._delta)
  }
}

/**
 * Type that represents text with formatting information.
 *
 * This type replaces y-richtext as this implementation is able to handle
 * block formats (format information on a paragraph), embeds (complex elements
 * like pictures and videos), and text formats (**bold**, *italic*).
 *
 * @extends AbstractType<YTextEvent>
 */
class YText$1 extends AbstractType$1 {
  /**
   * @param {String} [string] The initial value of the YText.
   */
  constructor (string) {
    super();
    /**
     * Array of pending operations on this type
     * @type {Array<function():void>?}
     */
    this._pending = string !== undefined ? [() => this.insert(0, string)] : [];
    /**
     * @type {Array<ArraySearchMarker>}
     */
    this._searchMarker = [];
  }

  /**
   * Number of characters of this text type.
   *
   * @type {number}
   */
  get length () {
    return this._length
  }

  /**
   * @param {Doc} y
   * @param {Item} item
   */
  _integrate (y, item) {
    super._integrate(y, item);
    try {
      /** @type {Array<function>} */ (this._pending).forEach(f => f());
    } catch (e) {
      console.error(e);
    }
    this._pending = null;
  }

  _copy () {
    return new YText$1()
  }

  /**
   * @return {YText}
   */
  clone () {
    const text = new YText$1();
    text.applyDelta(this.toDelta());
    return text
  }

  /**
   * Creates YTextEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver (transaction, parentSubs) {
    super._callObserver(transaction, parentSubs);
    const event = new YTextEvent$1(this, transaction, parentSubs);
    const doc = transaction.doc;
    callTypeObservers$1(this, transaction, event);
    // If a remote change happened, we try to cleanup potential formatting duplicates.
    if (!transaction.local) {
      // check if another formatting item was inserted
      let foundFormattingItem = false;
      for (const [client, afterClock] of transaction.afterState.entries()) {
        const clock = transaction.beforeState.get(client) || 0;
        if (afterClock === clock) {
          continue
        }
        iterateStructs$1(transaction, /** @type {Array<Item|GC>} */ (doc.store.clients.get(client)), clock, afterClock, item => {
          if (!item.deleted && /** @type {Item} */ (item).content.constructor === ContentFormat$1) {
            foundFormattingItem = true;
          }
        });
        if (foundFormattingItem) {
          break
        }
      }
      if (!foundFormattingItem) {
        iterateDeletedStructs$1(transaction, transaction.deleteSet, item => {
          if (item instanceof GC$1 || foundFormattingItem) {
            return
          }
          if (item.parent === this && item.content.constructor === ContentFormat$1) {
            foundFormattingItem = true;
          }
        });
      }
      transact$1(doc, (t) => {
        if (foundFormattingItem) {
          // If a formatting item was inserted, we simply clean the whole type.
          // We need to compute currentAttributes for the current position anyway.
          cleanupYTextFormatting$1(this);
        } else {
          // If no formatting attribute was inserted, we can make due with contextless
          // formatting cleanups.
          // Contextless: it is not necessary to compute currentAttributes for the affected position.
          iterateDeletedStructs$1(t, t.deleteSet, item => {
            if (item instanceof GC$1) {
              return
            }
            if (item.parent === this) {
              cleanupContextlessFormattingGap$1(t, item);
            }
          });
        }
      });
    }
  }

  /**
   * Returns the unformatted string representation of this YText type.
   *
   * @public
   */
  toString () {
    let str = '';
    /**
     * @type {Item|null}
     */
    let n = this._start;
    while (n !== null) {
      if (!n.deleted && n.countable && n.content.constructor === ContentString$1) {
        str += /** @type {ContentString} */ (n.content).str;
      }
      n = n.right;
    }
    return str
  }

  /**
   * Returns the unformatted string representation of this YText type.
   *
   * @return {string}
   * @public
   */
  toJSON () {
    return this.toString()
  }

  /**
   * Apply a {@link Delta} on this shared YText type.
   *
   * @param {any} delta The changes to apply on this element.
   * @param {object}  [opts]
   * @param {boolean} [opts.sanitize] Sanitize input delta. Removes ending newlines if set to true.
   *
   *
   * @public
   */
  applyDelta (delta, { sanitize = true } = {}) {
    if (this.doc !== null) {
      transact$1(this.doc, transaction => {
        const currPos = new ItemTextListPosition$1(null, this._start, 0, new Map());
        for (let i = 0; i < delta.length; i++) {
          const op = delta[i];
          if (op.insert !== undefined) {
            // Quill assumes that the content starts with an empty paragraph.
            // Yjs/Y.Text assumes that it starts empty. We always hide that
            // there is a newline at the end of the content.
            // If we omit this step, clients will see a different number of
            // paragraphs, but nothing bad will happen.
            const ins = (!sanitize && typeof op.insert === 'string' && i === delta.length - 1 && currPos.right === null && op.insert.slice(-1) === '\n') ? op.insert.slice(0, -1) : op.insert;
            if (typeof ins !== 'string' || ins.length > 0) {
              insertText$1(transaction, this, currPos, ins, op.attributes || {});
            }
          } else if (op.retain !== undefined) {
            formatText$1(transaction, this, currPos, op.retain, op.attributes || {});
          } else if (op.delete !== undefined) {
            deleteText$1(transaction, currPos, op.delete);
          }
        }
      });
    } else {
      /** @type {Array<function>} */ (this._pending).push(() => this.applyDelta(delta));
    }
  }

  /**
   * Returns the Delta representation of this YText type.
   *
   * @param {Snapshot} [snapshot]
   * @param {Snapshot} [prevSnapshot]
   * @param {function('removed' | 'added', ID):any} [computeYChange]
   * @return {any} The Delta representation of this type.
   *
   * @public
   */
  toDelta (snapshot, prevSnapshot, computeYChange) {
    /**
     * @type{Array<any>}
     */
    const ops = [];
    const currentAttributes = new Map();
    const doc = /** @type {Doc} */ (this.doc);
    let str = '';
    let n = this._start;
    function packStr () {
      if (str.length > 0) {
        // pack str with attributes to ops
        /**
         * @type {Object<string,any>}
         */
        const attributes = {};
        let addAttributes = false;
        currentAttributes.forEach((value, key) => {
          addAttributes = true;
          attributes[key] = value;
        });
        /**
         * @type {Object<string,any>}
         */
        const op = { insert: str };
        if (addAttributes) {
          op.attributes = attributes;
        }
        ops.push(op);
        str = '';
      }
    }
    // snapshots are merged again after the transaction, so we need to keep the
    // transalive until we are done
    transact$1(doc, transaction => {
      if (snapshot) {
        splitSnapshotAffectedStructs$1(transaction, snapshot);
      }
      if (prevSnapshot) {
        splitSnapshotAffectedStructs$1(transaction, prevSnapshot);
      }
      while (n !== null) {
        if (isVisible$1(n, snapshot) || (prevSnapshot !== undefined && isVisible$1(n, prevSnapshot))) {
          switch (n.content.constructor) {
            case ContentString$1: {
              const cur = currentAttributes.get('ychange');
              if (snapshot !== undefined && !isVisible$1(n, snapshot)) {
                if (cur === undefined || cur.user !== n.id.client || cur.state !== 'removed') {
                  packStr();
                  currentAttributes.set('ychange', computeYChange ? computeYChange('removed', n.id) : { type: 'removed' });
                }
              } else if (prevSnapshot !== undefined && !isVisible$1(n, prevSnapshot)) {
                if (cur === undefined || cur.user !== n.id.client || cur.state !== 'added') {
                  packStr();
                  currentAttributes.set('ychange', computeYChange ? computeYChange('added', n.id) : { type: 'added' });
                }
              } else if (cur !== undefined) {
                packStr();
                currentAttributes.delete('ychange');
              }
              str += /** @type {ContentString} */ (n.content).str;
              break
            }
            case ContentType$1:
            case ContentEmbed$1: {
              packStr();
              /**
               * @type {Object<string,any>}
               */
              const op = {
                insert: n.content.getContent()[0]
              };
              if (currentAttributes.size > 0) {
                const attrs = /** @type {Object<string,any>} */ ({});
                op.attributes = attrs;
                currentAttributes.forEach((value, key) => {
                  attrs[key] = value;
                });
              }
              ops.push(op);
              break
            }
            case ContentFormat$1:
              if (isVisible$1(n, snapshot)) {
                packStr();
                updateCurrentAttributes$1(currentAttributes, /** @type {ContentFormat} */ (n.content));
              }
              break
          }
        }
        n = n.right;
      }
      packStr();
    }, splitSnapshotAffectedStructs$1);
    return ops
  }

  /**
   * Insert text at a given index.
   *
   * @param {number} index The index at which to start inserting.
   * @param {String} text The text to insert at the specified position.
   * @param {TextAttributes} [attributes] Optionally define some formatting
   *                                    information to apply on the inserted
   *                                    Text.
   * @public
   */
  insert (index, text, attributes) {
    if (text.length <= 0) {
      return
    }
    const y = this.doc;
    if (y !== null) {
      transact$1(y, transaction => {
        const pos = findPosition$1(transaction, this, index);
        if (!attributes) {
          attributes = {};
          // @ts-ignore
          pos.currentAttributes.forEach((v, k) => { attributes[k] = v; });
        }
        insertText$1(transaction, this, pos, text, attributes);
      });
    } else {
      /** @type {Array<function>} */ (this._pending).push(() => this.insert(index, text, attributes));
    }
  }

  /**
   * Inserts an embed at a index.
   *
   * @param {number} index The index to insert the embed at.
   * @param {Object | AbstractType<any>} embed The Object that represents the embed.
   * @param {TextAttributes} attributes Attribute information to apply on the
   *                                    embed
   *
   * @public
   */
  insertEmbed (index, embed, attributes = {}) {
    const y = this.doc;
    if (y !== null) {
      transact$1(y, transaction => {
        const pos = findPosition$1(transaction, this, index);
        insertText$1(transaction, this, pos, embed, attributes);
      });
    } else {
      /** @type {Array<function>} */ (this._pending).push(() => this.insertEmbed(index, embed, attributes));
    }
  }

  /**
   * Deletes text starting from an index.
   *
   * @param {number} index Index at which to start deleting.
   * @param {number} length The number of characters to remove. Defaults to 1.
   *
   * @public
   */
  delete (index, length) {
    if (length === 0) {
      return
    }
    const y = this.doc;
    if (y !== null) {
      transact$1(y, transaction => {
        deleteText$1(transaction, findPosition$1(transaction, this, index), length);
      });
    } else {
      /** @type {Array<function>} */ (this._pending).push(() => this.delete(index, length));
    }
  }

  /**
   * Assigns properties to a range of text.
   *
   * @param {number} index The position where to start formatting.
   * @param {number} length The amount of characters to assign properties to.
   * @param {TextAttributes} attributes Attribute information to apply on the
   *                                    text.
   *
   * @public
   */
  format (index, length, attributes) {
    if (length === 0) {
      return
    }
    const y = this.doc;
    if (y !== null) {
      transact$1(y, transaction => {
        const pos = findPosition$1(transaction, this, index);
        if (pos.right === null) {
          return
        }
        formatText$1(transaction, this, pos, length, attributes);
      });
    } else {
      /** @type {Array<function>} */ (this._pending).push(() => this.format(index, length, attributes));
    }
  }

  /**
   * Removes an attribute.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that is to be removed.
   *
   * @public
   */
  removeAttribute (attributeName) {
    if (this.doc !== null) {
      transact$1(this.doc, transaction => {
        typeMapDelete$1(transaction, this, attributeName);
      });
    } else {
      /** @type {Array<function>} */ (this._pending).push(() => this.removeAttribute(attributeName));
    }
  }

  /**
   * Sets or updates an attribute.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that is to be set.
   * @param {any} attributeValue The attribute value that is to be set.
   *
   * @public
   */
  setAttribute (attributeName, attributeValue) {
    if (this.doc !== null) {
      transact$1(this.doc, transaction => {
        typeMapSet$1(transaction, this, attributeName, attributeValue);
      });
    } else {
      /** @type {Array<function>} */ (this._pending).push(() => this.setAttribute(attributeName, attributeValue));
    }
  }

  /**
   * Returns an attribute value that belongs to the attribute name.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that identifies the
   *                               queried value.
   * @return {any} The queried attribute value.
   *
   * @public
   */
  getAttribute (attributeName) {
    return /** @type {any} */ (typeMapGet$1(this, attributeName))
  }

  /**
   * Returns all attribute name/value pairs in a JSON Object.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {Snapshot} [snapshot]
   * @return {Object<string, any>} A JSON Object that describes the attributes.
   *
   * @public
   */
  getAttributes (snapshot) {
    return typeMapGetAll$1(this)
  }

  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write (encoder) {
    encoder.writeTypeRef(YTextRefID$1);
  }
}

/**
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 * @return {YText}
 *
 * @private
 * @function
 */
const readYText$1 = decoder => new YText$1();

/**
 * @module YXml
 */

/**
 * Define the elements to which a set of CSS queries apply.
 * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors|CSS_Selectors}
 *
 * @example
 *   query = '.classSelector'
 *   query = 'nodeSelector'
 *   query = '#idSelector'
 *
 * @typedef {string} CSS_Selector
 */

/**
 * Dom filter function.
 *
 * @callback domFilter
 * @param {string} nodeName The nodeName of the element
 * @param {Map} attributes The map of attributes.
 * @return {boolean} Whether to include the Dom node in the YXmlElement.
 */

/**
 * Represents a subset of the nodes of a YXmlElement / YXmlFragment and a
 * position within them.
 *
 * Can be created with {@link YXmlFragment#createTreeWalker}
 *
 * @public
 * @implements {Iterable<YXmlElement|YXmlText|YXmlElement|YXmlHook>}
 */
class YXmlTreeWalker$1 {
  /**
   * @param {YXmlFragment | YXmlElement} root
   * @param {function(AbstractType<any>):boolean} [f]
   */
  constructor (root, f = () => true) {
    this._filter = f;
    this._root = root;
    /**
     * @type {Item}
     */
    this._currentNode = /** @type {Item} */ (root._start);
    this._firstCall = true;
  }

  [Symbol.iterator] () {
    return this
  }

  /**
   * Get the next node.
   *
   * @return {IteratorResult<YXmlElement|YXmlText|YXmlHook>} The next node.
   *
   * @public
   */
  next () {
    /**
     * @type {Item|null}
     */
    let n = this._currentNode;
    let type = n && n.content && /** @type {any} */ (n.content).type;
    if (n !== null && (!this._firstCall || n.deleted || !this._filter(type))) { // if first call, we check if we can use the first item
      do {
        type = /** @type {any} */ (n.content).type;
        if (!n.deleted && (type.constructor === YXmlElement$1 || type.constructor === YXmlFragment$1) && type._start !== null) {
          // walk down in the tree
          n = type._start;
        } else {
          // walk right or up in the tree
          while (n !== null) {
            if (n.right !== null) {
              n = n.right;
              break
            } else if (n.parent === this._root) {
              n = null;
            } else {
              n = /** @type {AbstractType<any>} */ (n.parent)._item;
            }
          }
        }
      } while (n !== null && (n.deleted || !this._filter(/** @type {ContentType} */ (n.content).type)))
    }
    this._firstCall = false;
    if (n === null) {
      // @ts-ignore
      return { value: undefined, done: true }
    }
    this._currentNode = n;
    return { value: /** @type {any} */ (n.content).type, done: false }
  }
}

/**
 * Represents a list of {@link YXmlElement}.and {@link YXmlText} types.
 * A YxmlFragment is similar to a {@link YXmlElement}, but it does not have a
 * nodeName and it does not have attributes. Though it can be bound to a DOM
 * element - in this case the attributes and the nodeName are not shared.
 *
 * @public
 * @extends AbstractType<YXmlEvent>
 */
class YXmlFragment$1 extends AbstractType$1 {
  constructor () {
    super();
    /**
     * @type {Array<any>|null}
     */
    this._prelimContent = [];
  }

  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get firstChild () {
    const first = this._first;
    return first ? first.content.getContent()[0] : null
  }

  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate (y, item) {
    super._integrate(y, item);
    this.insert(0, /** @type {Array<any>} */ (this._prelimContent));
    this._prelimContent = null;
  }

  _copy () {
    return new YXmlFragment$1()
  }

  /**
   * @return {YXmlFragment}
   */
  clone () {
    const el = new YXmlFragment$1();
    // @ts-ignore
    el.insert(0, this.toArray().map(item => item instanceof AbstractType$1 ? item.clone() : item));
    return el
  }

  get length () {
    return this._prelimContent === null ? this._length : this._prelimContent.length
  }

  /**
   * Create a subtree of childNodes.
   *
   * @example
   * const walker = elem.createTreeWalker(dom => dom.nodeName === 'div')
   * for (let node in walker) {
   *   // `node` is a div node
   *   nop(node)
   * }
   *
   * @param {function(AbstractType<any>):boolean} filter Function that is called on each child element and
   *                          returns a Boolean indicating whether the child
   *                          is to be included in the subtree.
   * @return {YXmlTreeWalker} A subtree and a position within it.
   *
   * @public
   */
  createTreeWalker (filter) {
    return new YXmlTreeWalker$1(this, filter)
  }

  /**
   * Returns the first YXmlElement that matches the query.
   * Similar to DOM's {@link querySelector}.
   *
   * Query support:
   *   - tagname
   * TODO:
   *   - id
   *   - attribute
   *
   * @param {CSS_Selector} query The query on the children.
   * @return {YXmlElement|YXmlText|YXmlHook|null} The first element that matches the query or null.
   *
   * @public
   */
  querySelector (query) {
    query = query.toUpperCase();
    // @ts-ignore
    const iterator = new YXmlTreeWalker$1(this, element => element.nodeName && element.nodeName.toUpperCase() === query);
    const next = iterator.next();
    if (next.done) {
      return null
    } else {
      return next.value
    }
  }

  /**
   * Returns all YXmlElements that match the query.
   * Similar to Dom's {@link querySelectorAll}.
   *
   * @todo Does not yet support all queries. Currently only query by tagName.
   *
   * @param {CSS_Selector} query The query on the children
   * @return {Array<YXmlElement|YXmlText|YXmlHook|null>} The elements that match this query.
   *
   * @public
   */
  querySelectorAll (query) {
    query = query.toUpperCase();
    // @ts-ignore
    return Array.from(new YXmlTreeWalker$1(this, element => element.nodeName && element.nodeName.toUpperCase() === query))
  }

  /**
   * Creates YXmlEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver (transaction, parentSubs) {
    callTypeObservers$1(this, transaction, new YXmlEvent$1(this, parentSubs, transaction));
  }

  /**
   * Get the string representation of all the children of this YXmlFragment.
   *
   * @return {string} The string representation of all children.
   */
  toString () {
    return typeListMap$1(this, xml => xml.toString()).join('')
  }

  /**
   * @return {string}
   */
  toJSON () {
    return this.toString()
  }

  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM (_document = document, hooks = {}, binding) {
    const fragment = _document.createDocumentFragment();
    if (binding !== undefined) {
      binding._createAssociation(fragment, this);
    }
    typeListForEach$1(this, xmlType => {
      fragment.insertBefore(xmlType.toDOM(_document, hooks, binding), null);
    });
    return fragment
  }

  /**
   * Inserts new content at an index.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  xml.insert(0, [new Y.XmlText('text')])
   *
   * @param {number} index The index to insert content at
   * @param {Array<YXmlElement|YXmlText>} content The array of content
   */
  insert (index, content) {
    if (this.doc !== null) {
      transact$1(this.doc, transaction => {
        typeListInsertGenerics$1(transaction, this, index, content);
      });
    } else {
      // @ts-ignore _prelimContent is defined because this is not yet integrated
      this._prelimContent.splice(index, 0, ...content);
    }
  }

  /**
   * Inserts new content at an index.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  xml.insert(0, [new Y.XmlText('text')])
   *
   * @param {null|Item|YXmlElement|YXmlText} ref The index to insert content at
   * @param {Array<YXmlElement|YXmlText>} content The array of content
   */
  insertAfter (ref, content) {
    if (this.doc !== null) {
      transact$1(this.doc, transaction => {
        const refItem = (ref && ref instanceof AbstractType$1) ? ref._item : ref;
        typeListInsertGenericsAfter$1(transaction, this, refItem, content);
      });
    } else {
      const pc = /** @type {Array<any>} */ (this._prelimContent);
      const index = ref === null ? 0 : pc.findIndex(el => el === ref) + 1;
      if (index === 0 && ref !== null) {
        throw create$g('Reference item not found')
      }
      pc.splice(index, 0, ...content);
    }
  }

  /**
   * Deletes elements starting from an index.
   *
   * @param {number} index Index at which to start deleting elements
   * @param {number} [length=1] The number of elements to remove. Defaults to 1.
   */
  delete (index, length = 1) {
    if (this.doc !== null) {
      transact$1(this.doc, transaction => {
        typeListDelete$1(transaction, this, index, length);
      });
    } else {
      // @ts-ignore _prelimContent is defined because this is not yet integrated
      this._prelimContent.splice(index, length);
    }
  }

  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @return {Array<YXmlElement|YXmlText|YXmlHook>}
   */
  toArray () {
    return typeListToArray$1(this)
  }

  /**
   * Appends content to this YArray.
   *
   * @param {Array<YXmlElement|YXmlText>} content Array of content to append.
   */
  push (content) {
    this.insert(this.length, content);
  }

  /**
   * Preppends content to this YArray.
   *
   * @param {Array<YXmlElement|YXmlText>} content Array of content to preppend.
   */
  unshift (content) {
    this.insert(0, content);
  }

  /**
   * Returns the i-th element from a YArray.
   *
   * @param {number} index The index of the element to return from the YArray
   * @return {YXmlElement|YXmlText}
   */
  get (index) {
    return typeListGet$1(this, index)
  }

  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @param {number} [start]
   * @param {number} [end]
   * @return {Array<YXmlElement|YXmlText>}
   */
  slice (start = 0, end = this.length) {
    return typeListSlice$1(this, start, end)
  }

  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   */
  _write (encoder) {
    encoder.writeTypeRef(YXmlFragmentRefID$1);
  }
}

/**
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 * @return {YXmlFragment}
 *
 * @private
 * @function
 */
const readYXmlFragment$1 = decoder => new YXmlFragment$1();

/**
 * An YXmlElement imitates the behavior of a
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}.
 *
 * * An YXmlElement has attributes (key value pairs)
 * * An YXmlElement has childElements that must inherit from YXmlElement
 */
class YXmlElement$1 extends YXmlFragment$1 {
  constructor (nodeName = 'UNDEFINED') {
    super();
    this.nodeName = nodeName;
    /**
     * @type {Map<string, any>|null}
     */
    this._prelimAttrs = new Map();
  }

  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get nextSibling () {
    const n = this._item ? this._item.next : null;
    return n ? /** @type {YXmlElement|YXmlText} */ (/** @type {ContentType} */ (n.content).type) : null
  }

  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get prevSibling () {
    const n = this._item ? this._item.prev : null;
    return n ? /** @type {YXmlElement|YXmlText} */ (/** @type {ContentType} */ (n.content).type) : null
  }

  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate (y, item) {
    super._integrate(y, item)
    ;(/** @type {Map<string, any>} */ (this._prelimAttrs)).forEach((value, key) => {
      this.setAttribute(key, value);
    });
    this._prelimAttrs = null;
  }

  /**
   * Creates an Item with the same effect as this Item (without position effect)
   *
   * @return {YXmlElement}
   */
  _copy () {
    return new YXmlElement$1(this.nodeName)
  }

  /**
   * @return {YXmlElement}
   */
  clone () {
    const el = new YXmlElement$1(this.nodeName);
    const attrs = this.getAttributes();
    for (const key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
    // @ts-ignore
    el.insert(0, this.toArray().map(item => item instanceof AbstractType$1 ? item.clone() : item));
    return el
  }

  /**
   * Returns the XML serialization of this YXmlElement.
   * The attributes are ordered by attribute-name, so you can easily use this
   * method to compare YXmlElements
   *
   * @return {string} The string representation of this type.
   *
   * @public
   */
  toString () {
    const attrs = this.getAttributes();
    const stringBuilder = [];
    const keys = [];
    for (const key in attrs) {
      keys.push(key);
    }
    keys.sort();
    const keysLen = keys.length;
    for (let i = 0; i < keysLen; i++) {
      const key = keys[i];
      stringBuilder.push(key + '="' + attrs[key] + '"');
    }
    const nodeName = this.nodeName.toLocaleLowerCase();
    const attrsString = stringBuilder.length > 0 ? ' ' + stringBuilder.join(' ') : '';
    return `<${nodeName}${attrsString}>${super.toString()}</${nodeName}>`
  }

  /**
   * Removes an attribute from this YXmlElement.
   *
   * @param {String} attributeName The attribute name that is to be removed.
   *
   * @public
   */
  removeAttribute (attributeName) {
    if (this.doc !== null) {
      transact$1(this.doc, transaction => {
        typeMapDelete$1(transaction, this, attributeName);
      });
    } else {
      /** @type {Map<string,any>} */ (this._prelimAttrs).delete(attributeName);
    }
  }

  /**
   * Sets or updates an attribute.
   *
   * @param {String} attributeName The attribute name that is to be set.
   * @param {String} attributeValue The attribute value that is to be set.
   *
   * @public
   */
  setAttribute (attributeName, attributeValue) {
    if (this.doc !== null) {
      transact$1(this.doc, transaction => {
        typeMapSet$1(transaction, this, attributeName, attributeValue);
      });
    } else {
      /** @type {Map<string, any>} */ (this._prelimAttrs).set(attributeName, attributeValue);
    }
  }

  /**
   * Returns an attribute value that belongs to the attribute name.
   *
   * @param {String} attributeName The attribute name that identifies the
   *                               queried value.
   * @return {String} The queried attribute value.
   *
   * @public
   */
  getAttribute (attributeName) {
    return /** @type {any} */ (typeMapGet$1(this, attributeName))
  }

  /**
   * Returns whether an attribute exists
   *
   * @param {String} attributeName The attribute name to check for existence.
   * @return {boolean} whether the attribute exists.
   *
   * @public
   */
  hasAttribute (attributeName) {
    return /** @type {any} */ (typeMapHas$1(this, attributeName))
  }

  /**
   * Returns all attribute name/value pairs in a JSON Object.
   *
   * @param {Snapshot} [snapshot]
   * @return {Object<string, any>} A JSON Object that describes the attributes.
   *
   * @public
   */
  getAttributes (snapshot) {
    return typeMapGetAll$1(this)
  }

  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM (_document = document, hooks = {}, binding) {
    const dom = _document.createElement(this.nodeName);
    const attrs = this.getAttributes();
    for (const key in attrs) {
      dom.setAttribute(key, attrs[key]);
    }
    typeListForEach$1(this, yxml => {
      dom.appendChild(yxml.toDOM(_document, hooks, binding));
    });
    if (binding !== undefined) {
      binding._createAssociation(dom, this);
    }
    return dom
  }

  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   */
  _write (encoder) {
    encoder.writeTypeRef(YXmlElementRefID$1);
    encoder.writeKey(this.nodeName);
  }
}

/**
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 * @return {YXmlElement}
 *
 * @function
 */
const readYXmlElement$1 = decoder => new YXmlElement$1(decoder.readKey());

/**
 * An Event that describes changes on a YXml Element or Yxml Fragment
 */
class YXmlEvent$1 extends YEvent$1 {
  /**
   * @param {YXmlElement|YXmlText|YXmlFragment} target The target on which the event is created.
   * @param {Set<string|null>} subs The set of changed attributes. `null` is included if the
   *                   child list changed.
   * @param {Transaction} transaction The transaction instance with wich the
   *                                  change was created.
   */
  constructor (target, subs, transaction) {
    super(target, transaction);
    /**
     * Whether the children changed.
     * @type {Boolean}
     * @private
     */
    this.childListChanged = false;
    /**
     * Set of all changed attributes.
     * @type {Set<string>}
     */
    this.attributesChanged = new Set();
    subs.forEach((sub) => {
      if (sub === null) {
        this.childListChanged = true;
      } else {
        this.attributesChanged.add(sub);
      }
    });
  }
}

/**
 * You can manage binding to a custom type with YXmlHook.
 *
 * @extends {YMap<any>}
 */
class YXmlHook$1 extends YMap$1 {
  /**
   * @param {string} hookName nodeName of the Dom Node.
   */
  constructor (hookName) {
    super();
    /**
     * @type {string}
     */
    this.hookName = hookName;
  }

  /**
   * Creates an Item with the same effect as this Item (without position effect)
   */
  _copy () {
    return new YXmlHook$1(this.hookName)
  }

  /**
   * @return {YXmlHook}
   */
  clone () {
    const el = new YXmlHook$1(this.hookName);
    this.forEach((value, key) => {
      el.set(key, value);
    });
    return el
  }

  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object.<string, any>} [hooks] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type
   * @return {Element} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM (_document = document, hooks = {}, binding) {
    const hook = hooks[this.hookName];
    let dom;
    if (hook !== undefined) {
      dom = hook.createDom(this);
    } else {
      dom = document.createElement(this.hookName);
    }
    dom.setAttribute('data-yjs-hook', this.hookName);
    if (binding !== undefined) {
      binding._createAssociation(dom, this);
    }
    return dom
  }

  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   */
  _write (encoder) {
    encoder.writeTypeRef(YXmlHookRefID$1);
    encoder.writeKey(this.hookName);
  }
}

/**
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 * @return {YXmlHook}
 *
 * @private
 * @function
 */
const readYXmlHook$1 = decoder =>
  new YXmlHook$1(decoder.readKey());

/**
 * Represents text in a Dom Element. In the future this type will also handle
 * simple formatting information like bold and italic.
 */
class YXmlText$1 extends YText$1 {
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get nextSibling () {
    const n = this._item ? this._item.next : null;
    return n ? /** @type {YXmlElement|YXmlText} */ (/** @type {ContentType} */ (n.content).type) : null
  }

  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get prevSibling () {
    const n = this._item ? this._item.prev : null;
    return n ? /** @type {YXmlElement|YXmlText} */ (/** @type {ContentType} */ (n.content).type) : null
  }

  _copy () {
    return new YXmlText$1()
  }

  /**
   * @return {YXmlText}
   */
  clone () {
    const text = new YXmlText$1();
    text.applyDelta(this.toDelta());
    return text
  }

  /**
   * Creates a Dom Element that mirrors this YXmlText.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Text} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM (_document = document, hooks, binding) {
    const dom = _document.createTextNode(this.toString());
    if (binding !== undefined) {
      binding._createAssociation(dom, this);
    }
    return dom
  }

  toString () {
    // @ts-ignore
    return this.toDelta().map(delta => {
      const nestedNodes = [];
      for (const nodeName in delta.attributes) {
        const attrs = [];
        for (const key in delta.attributes[nodeName]) {
          attrs.push({ key, value: delta.attributes[nodeName][key] });
        }
        // sort attributes to get a unique order
        attrs.sort((a, b) => a.key < b.key ? -1 : 1);
        nestedNodes.push({ nodeName, attrs });
      }
      // sort node order to get a unique order
      nestedNodes.sort((a, b) => a.nodeName < b.nodeName ? -1 : 1);
      // now convert to dom string
      let str = '';
      for (let i = 0; i < nestedNodes.length; i++) {
        const node = nestedNodes[i];
        str += `<${node.nodeName}`;
        for (let j = 0; j < node.attrs.length; j++) {
          const attr = node.attrs[j];
          str += ` ${attr.key}="${attr.value}"`;
        }
        str += '>';
      }
      str += delta.insert;
      for (let i = nestedNodes.length - 1; i >= 0; i--) {
        str += `</${nestedNodes[i].nodeName}>`;
      }
      return str
    }).join('')
  }

  /**
   * @return {string}
   */
  toJSON () {
    return this.toString()
  }

  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write (encoder) {
    encoder.writeTypeRef(YXmlTextRefID$1);
  }
}

/**
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 * @return {YXmlText}
 *
 * @private
 * @function
 */
const readYXmlText$1 = decoder => new YXmlText$1();

class AbstractStruct$1 {
  /**
   * @param {ID} id
   * @param {number} length
   */
  constructor (id, length) {
    this.id = id;
    this.length = length;
  }

  /**
   * @type {boolean}
   */
  get deleted () {
    throw methodUnimplemented$2()
  }

  /**
   * Merge this struct with the item to the right.
   * This method is already assuming that `this.id.clock + this.length === this.id.clock`.
   * Also this method does *not* remove right from StructStore!
   * @param {AbstractStruct} right
   * @return {boolean} wether this merged with right
   */
  mergeWith (right) {
    return false
  }

  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   * @param {number} offset
   * @param {number} encodingRef
   */
  write (encoder, offset, encodingRef) {
    throw methodUnimplemented$2()
  }

  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate (transaction, offset) {
    throw methodUnimplemented$2()
  }
}

const structGCRefNumber$1 = 0;

/**
 * @private
 */
class GC$1 extends AbstractStruct$1 {
  get deleted () {
    return true
  }

  delete () {}

  /**
   * @param {GC} right
   * @return {boolean}
   */
  mergeWith (right) {
    if (this.constructor !== right.constructor) {
      return false
    }
    this.length += right.length;
    return true
  }

  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate (transaction, offset) {
    if (offset > 0) {
      this.id.clock += offset;
      this.length -= offset;
    }
    addStruct$1(transaction.doc.store, this);
  }

  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    encoder.writeInfo(structGCRefNumber$1);
    encoder.writeLen(this.length - offset);
  }

  /**
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing (transaction, store) {
    return null
  }
}

class ContentBinary$1 {
  /**
   * @param {Uint8Array} content
   */
  constructor (content) {
    this.content = content;
  }

  /**
   * @return {number}
   */
  getLength () {
    return 1
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return [this.content]
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return true
  }

  /**
   * @return {ContentBinary}
   */
  copy () {
    return new ContentBinary$1(this.content)
  }

  /**
   * @param {number} offset
   * @return {ContentBinary}
   */
  splice (offset) {
    throw methodUnimplemented$2()
  }

  /**
   * @param {ContentBinary} right
   * @return {boolean}
   */
  mergeWith (right) {
    return false
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {}
  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {}
  /**
   * @param {StructStore} store
   */
  gc (store) {}
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    encoder.writeBuf(this.content);
  }

  /**
   * @return {number}
   */
  getRef () {
    return 3
  }
}

/**
 * @param {UpdateDecoderV1 | UpdateDecoderV2 } decoder
 * @return {ContentBinary}
 */
const readContentBinary$1 = decoder => new ContentBinary$1(decoder.readBuf());

class ContentDeleted$1 {
  /**
   * @param {number} len
   */
  constructor (len) {
    this.len = len;
  }

  /**
   * @return {number}
   */
  getLength () {
    return this.len
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return []
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return false
  }

  /**
   * @return {ContentDeleted}
   */
  copy () {
    return new ContentDeleted$1(this.len)
  }

  /**
   * @param {number} offset
   * @return {ContentDeleted}
   */
  splice (offset) {
    const right = new ContentDeleted$1(this.len - offset);
    this.len = offset;
    return right
  }

  /**
   * @param {ContentDeleted} right
   * @return {boolean}
   */
  mergeWith (right) {
    this.len += right.len;
    return true
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {
    addToDeleteSet$1(transaction.deleteSet, item.id.client, item.id.clock, this.len);
    item.markDeleted();
  }

  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {}
  /**
   * @param {StructStore} store
   */
  gc (store) {}
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    encoder.writeLen(this.len - offset);
  }

  /**
   * @return {number}
   */
  getRef () {
    return 1
  }
}

/**
 * @private
 *
 * @param {UpdateDecoderV1 | UpdateDecoderV2 } decoder
 * @return {ContentDeleted}
 */
const readContentDeleted$1 = decoder => new ContentDeleted$1(decoder.readLen());

/**
 * @param {string} guid
 * @param {Object<string, any>} opts
 */
const createDocFromOpts$1 = (guid, opts) => new Doc$1({ guid, ...opts, shouldLoad: opts.shouldLoad || opts.autoLoad || false });

/**
 * @private
 */
class ContentDoc$1 {
  /**
   * @param {Doc} doc
   */
  constructor (doc) {
    if (doc._item) {
      console.error('This document was already integrated as a sub-document. You should create a second instance instead with the same guid.');
    }
    /**
     * @type {Doc}
     */
    this.doc = doc;
    /**
     * @type {any}
     */
    const opts = {};
    this.opts = opts;
    if (!doc.gc) {
      opts.gc = false;
    }
    if (doc.autoLoad) {
      opts.autoLoad = true;
    }
    if (doc.meta !== null) {
      opts.meta = doc.meta;
    }
  }

  /**
   * @return {number}
   */
  getLength () {
    return 1
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return [this.doc]
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return true
  }

  /**
   * @return {ContentDoc}
   */
  copy () {
    return new ContentDoc$1(createDocFromOpts$1(this.doc.guid, this.opts))
  }

  /**
   * @param {number} offset
   * @return {ContentDoc}
   */
  splice (offset) {
    throw methodUnimplemented$2()
  }

  /**
   * @param {ContentDoc} right
   * @return {boolean}
   */
  mergeWith (right) {
    return false
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {
    // this needs to be reflected in doc.destroy as well
    this.doc._item = item;
    transaction.subdocsAdded.add(this.doc);
    if (this.doc.shouldLoad) {
      transaction.subdocsLoaded.add(this.doc);
    }
  }

  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {
    if (transaction.subdocsAdded.has(this.doc)) {
      transaction.subdocsAdded.delete(this.doc);
    } else {
      transaction.subdocsRemoved.add(this.doc);
    }
  }

  /**
   * @param {StructStore} store
   */
  gc (store) { }

  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    encoder.writeString(this.doc.guid);
    encoder.writeAny(this.opts);
  }

  /**
   * @return {number}
   */
  getRef () {
    return 9
  }
}

/**
 * @private
 *
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 * @return {ContentDoc}
 */
const readContentDoc$1 = decoder => new ContentDoc$1(createDocFromOpts$1(decoder.readString(), decoder.readAny()));

/**
 * @private
 */
class ContentEmbed$1 {
  /**
   * @param {Object} embed
   */
  constructor (embed) {
    this.embed = embed;
  }

  /**
   * @return {number}
   */
  getLength () {
    return 1
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return [this.embed]
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return true
  }

  /**
   * @return {ContentEmbed}
   */
  copy () {
    return new ContentEmbed$1(this.embed)
  }

  /**
   * @param {number} offset
   * @return {ContentEmbed}
   */
  splice (offset) {
    throw methodUnimplemented$2()
  }

  /**
   * @param {ContentEmbed} right
   * @return {boolean}
   */
  mergeWith (right) {
    return false
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {}
  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {}
  /**
   * @param {StructStore} store
   */
  gc (store) {}
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    encoder.writeJSON(this.embed);
  }

  /**
   * @return {number}
   */
  getRef () {
    return 5
  }
}

/**
 * @private
 *
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 * @return {ContentEmbed}
 */
const readContentEmbed$1 = decoder => new ContentEmbed$1(decoder.readJSON());

/**
 * @private
 */
class ContentFormat$1 {
  /**
   * @param {string} key
   * @param {Object} value
   */
  constructor (key, value) {
    this.key = key;
    this.value = value;
  }

  /**
   * @return {number}
   */
  getLength () {
    return 1
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return []
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return false
  }

  /**
   * @return {ContentFormat}
   */
  copy () {
    return new ContentFormat$1(this.key, this.value)
  }

  /**
   * @param {number} offset
   * @return {ContentFormat}
   */
  splice (offset) {
    throw methodUnimplemented$2()
  }

  /**
   * @param {ContentFormat} right
   * @return {boolean}
   */
  mergeWith (right) {
    return false
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {
    // @todo searchmarker are currently unsupported for rich text documents
    /** @type {AbstractType<any>} */ (item.parent)._searchMarker = null;
  }

  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {}
  /**
   * @param {StructStore} store
   */
  gc (store) {}
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    encoder.writeKey(this.key);
    encoder.writeJSON(this.value);
  }

  /**
   * @return {number}
   */
  getRef () {
    return 6
  }
}

/**
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 * @return {ContentFormat}
 */
const readContentFormat$1 = decoder => new ContentFormat$1(decoder.readString(), decoder.readJSON());

/**
 * @private
 */
class ContentJSON$1 {
  /**
   * @param {Array<any>} arr
   */
  constructor (arr) {
    /**
     * @type {Array<any>}
     */
    this.arr = arr;
  }

  /**
   * @return {number}
   */
  getLength () {
    return this.arr.length
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return this.arr
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return true
  }

  /**
   * @return {ContentJSON}
   */
  copy () {
    return new ContentJSON$1(this.arr)
  }

  /**
   * @param {number} offset
   * @return {ContentJSON}
   */
  splice (offset) {
    const right = new ContentJSON$1(this.arr.slice(offset));
    this.arr = this.arr.slice(0, offset);
    return right
  }

  /**
   * @param {ContentJSON} right
   * @return {boolean}
   */
  mergeWith (right) {
    this.arr = this.arr.concat(right.arr);
    return true
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {}
  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {}
  /**
   * @param {StructStore} store
   */
  gc (store) {}
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    const len = this.arr.length;
    encoder.writeLen(len - offset);
    for (let i = offset; i < len; i++) {
      const c = this.arr[i];
      encoder.writeString(c === undefined ? 'undefined' : JSON.stringify(c));
    }
  }

  /**
   * @return {number}
   */
  getRef () {
    return 2
  }
}

/**
 * @private
 *
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 * @return {ContentJSON}
 */
const readContentJSON$1 = decoder => {
  const len = decoder.readLen();
  const cs = [];
  for (let i = 0; i < len; i++) {
    const c = decoder.readString();
    if (c === 'undefined') {
      cs.push(undefined);
    } else {
      cs.push(JSON.parse(c));
    }
  }
  return new ContentJSON$1(cs)
};

class ContentAny$1 {
  /**
   * @param {Array<any>} arr
   */
  constructor (arr) {
    /**
     * @type {Array<any>}
     */
    this.arr = arr;
  }

  /**
   * @return {number}
   */
  getLength () {
    return this.arr.length
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return this.arr
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return true
  }

  /**
   * @return {ContentAny}
   */
  copy () {
    return new ContentAny$1(this.arr)
  }

  /**
   * @param {number} offset
   * @return {ContentAny}
   */
  splice (offset) {
    const right = new ContentAny$1(this.arr.slice(offset));
    this.arr = this.arr.slice(0, offset);
    return right
  }

  /**
   * @param {ContentAny} right
   * @return {boolean}
   */
  mergeWith (right) {
    this.arr = this.arr.concat(right.arr);
    return true
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {}
  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {}
  /**
   * @param {StructStore} store
   */
  gc (store) {}
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    const len = this.arr.length;
    encoder.writeLen(len - offset);
    for (let i = offset; i < len; i++) {
      const c = this.arr[i];
      encoder.writeAny(c);
    }
  }

  /**
   * @return {number}
   */
  getRef () {
    return 8
  }
}

/**
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 * @return {ContentAny}
 */
const readContentAny$1 = decoder => {
  const len = decoder.readLen();
  const cs = [];
  for (let i = 0; i < len; i++) {
    cs.push(decoder.readAny());
  }
  return new ContentAny$1(cs)
};

/**
 * @private
 */
class ContentString$1 {
  /**
   * @param {string} str
   */
  constructor (str) {
    /**
     * @type {string}
     */
    this.str = str;
  }

  /**
   * @return {number}
   */
  getLength () {
    return this.str.length
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return this.str.split('')
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return true
  }

  /**
   * @return {ContentString}
   */
  copy () {
    return new ContentString$1(this.str)
  }

  /**
   * @param {number} offset
   * @return {ContentString}
   */
  splice (offset) {
    const right = new ContentString$1(this.str.slice(offset));
    this.str = this.str.slice(0, offset);

    // Prevent encoding invalid documents because of splitting of surrogate pairs: https://github.com/yjs/yjs/issues/248
    const firstCharCode = this.str.charCodeAt(offset - 1);
    if (firstCharCode >= 0xD800 && firstCharCode <= 0xDBFF) {
      // Last character of the left split is the start of a surrogate utf16/ucs2 pair.
      // We don't support splitting of surrogate pairs because this may lead to invalid documents.
      // Replace the invalid character with a unicode replacement character (� / U+FFFD)
      this.str = this.str.slice(0, offset - 1) + '�';
      // replace right as well
      right.str = '�' + right.str.slice(1);
    }
    return right
  }

  /**
   * @param {ContentString} right
   * @return {boolean}
   */
  mergeWith (right) {
    this.str += right.str;
    return true
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {}
  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {}
  /**
   * @param {StructStore} store
   */
  gc (store) {}
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    encoder.writeString(offset === 0 ? this.str : this.str.slice(offset));
  }

  /**
   * @return {number}
   */
  getRef () {
    return 4
  }
}

/**
 * @private
 *
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 * @return {ContentString}
 */
const readContentString$1 = decoder => new ContentString$1(decoder.readString());

/**
 * @type {Array<function(UpdateDecoderV1 | UpdateDecoderV2):AbstractType<any>>}
 * @private
 */
const typeRefs$1 = [
  readYArray$1,
  readYMap$1,
  readYText$1,
  readYXmlElement$1,
  readYXmlFragment$1,
  readYXmlHook$1,
  readYXmlText$1
];

const YArrayRefID$1 = 0;
const YMapRefID$1 = 1;
const YTextRefID$1 = 2;
const YXmlElementRefID$1 = 3;
const YXmlFragmentRefID$1 = 4;
const YXmlHookRefID$1 = 5;
const YXmlTextRefID$1 = 6;

/**
 * @private
 */
class ContentType$1 {
  /**
   * @param {AbstractType<YEvent>} type
   */
  constructor (type) {
    /**
     * @type {AbstractType<any>}
     */
    this.type = type;
  }

  /**
   * @return {number}
   */
  getLength () {
    return 1
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return [this.type]
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return true
  }

  /**
   * @return {ContentType}
   */
  copy () {
    return new ContentType$1(this.type._copy())
  }

  /**
   * @param {number} offset
   * @return {ContentType}
   */
  splice (offset) {
    throw methodUnimplemented$2()
  }

  /**
   * @param {ContentType} right
   * @return {boolean}
   */
  mergeWith (right) {
    return false
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {
    this.type._integrate(transaction.doc, item);
  }

  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {
    let item = this.type._start;
    while (item !== null) {
      if (!item.deleted) {
        item.delete(transaction);
      } else {
        // Whis will be gc'd later and we want to merge it if possible
        // We try to merge all deleted items after each transaction,
        // but we have no knowledge about that this needs to be merged
        // since it is not in transaction.ds. Hence we add it to transaction._mergeStructs
        transaction._mergeStructs.push(item);
      }
      item = item.right;
    }
    this.type._map.forEach(item => {
      if (!item.deleted) {
        item.delete(transaction);
      } else {
        // same as above
        transaction._mergeStructs.push(item);
      }
    });
    transaction.changed.delete(this.type);
  }

  /**
   * @param {StructStore} store
   */
  gc (store) {
    let item = this.type._start;
    while (item !== null) {
      item.gc(store, true);
      item = item.right;
    }
    this.type._start = null;
    this.type._map.forEach(/** @param {Item | null} item */ (item) => {
      while (item !== null) {
        item.gc(store, true);
        item = item.left;
      }
    });
    this.type._map = new Map();
  }

  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    this.type._write(encoder);
  }

  /**
   * @return {number}
   */
  getRef () {
    return 7
  }
}

/**
 * @private
 *
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 * @return {ContentType}
 */
const readContentType$1 = decoder => new ContentType$1(typeRefs$1[decoder.readTypeRef()](decoder));

/**
 * @todo This should return several items
 *
 * @param {StructStore} store
 * @param {ID} id
 * @return {{item:Item, diff:number}}
 */
const followRedone$1 = (store, id) => {
  /**
   * @type {ID|null}
   */
  let nextID = id;
  let diff = 0;
  let item;
  do {
    if (diff > 0) {
      nextID = createID$1(nextID.client, nextID.clock + diff);
    }
    item = getItem$1(store, nextID);
    diff = nextID.clock - item.id.clock;
    nextID = item.redone;
  } while (nextID !== null && item instanceof Item$2)
  return {
    item, diff
  }
};

/**
 * Make sure that neither item nor any of its parents is ever deleted.
 *
 * This property does not persist when storing it into a database or when
 * sending it to other peers
 *
 * @param {Item|null} item
 * @param {boolean} keep
 */
const keepItem$1 = (item, keep) => {
  while (item !== null && item.keep !== keep) {
    item.keep = keep;
    item = /** @type {AbstractType<any>} */ (item.parent)._item;
  }
};

/**
 * Split leftItem into two items
 * @param {Transaction} transaction
 * @param {Item} leftItem
 * @param {number} diff
 * @return {Item}
 *
 * @function
 * @private
 */
const splitItem$1 = (transaction, leftItem, diff) => {
  // create rightItem
  const { client, clock } = leftItem.id;
  const rightItem = new Item$2(
    createID$1(client, clock + diff),
    leftItem,
    createID$1(client, clock + diff - 1),
    leftItem.right,
    leftItem.rightOrigin,
    leftItem.parent,
    leftItem.parentSub,
    leftItem.content.splice(diff)
  );
  if (leftItem.deleted) {
    rightItem.markDeleted();
  }
  if (leftItem.keep) {
    rightItem.keep = true;
  }
  if (leftItem.redone !== null) {
    rightItem.redone = createID$1(leftItem.redone.client, leftItem.redone.clock + diff);
  }
  // update left (do not set leftItem.rightOrigin as it will lead to problems when syncing)
  leftItem.right = rightItem;
  // update right
  if (rightItem.right !== null) {
    rightItem.right.left = rightItem;
  }
  // right is more specific.
  transaction._mergeStructs.push(rightItem);
  // update parent._map
  if (rightItem.parentSub !== null && rightItem.right === null) {
    /** @type {AbstractType<any>} */ (rightItem.parent)._map.set(rightItem.parentSub, rightItem);
  }
  leftItem.length = diff;
  return rightItem
};

/**
 * Redoes the effect of this operation.
 *
 * @param {Transaction} transaction The Yjs instance.
 * @param {Item} item
 * @param {Set<Item>} redoitems
 * @param {Array<Item>} itemsToDelete
 *
 * @return {Item|null}
 *
 * @private
 */
const redoItem$1 = (transaction, item, redoitems, itemsToDelete) => {
  const doc = transaction.doc;
  const store = doc.store;
  const ownClientID = doc.clientID;
  const redone = item.redone;
  if (redone !== null) {
    return getItemCleanStart$1(transaction, redone)
  }
  let parentItem = /** @type {AbstractType<any>} */ (item.parent)._item;
  /**
   * @type {Item|null}
   */
  let left;
  /**
   * @type {Item|null}
   */
  let right;
  if (item.parentSub === null) {
    // Is an array item. Insert at the old position
    left = item.left;
    right = item;
  } else {
    // Is a map item. Insert as current value
    left = item;
    while (left.right !== null) {
      left = left.right;
      if (left.id.client !== ownClientID) {
        // It is not possible to redo this item because it conflicts with a
        // change from another client
        return null
      }
    }
    if (left.right !== null) {
      left = /** @type {Item} */ (/** @type {AbstractType<any>} */ (item.parent)._map.get(item.parentSub));
    }
    right = null;
  }
  // make sure that parent is redone
  if (parentItem !== null && parentItem.deleted === true && parentItem.redone === null) {
    // try to undo parent if it will be undone anyway
    if (!redoitems.has(parentItem) || redoItem$1(transaction, parentItem, redoitems, itemsToDelete) === null) {
      return null
    }
  }
  if (parentItem !== null && parentItem.redone !== null) {
    while (parentItem.redone !== null) {
      parentItem = getItemCleanStart$1(transaction, parentItem.redone);
    }
    // find next cloned_redo items
    while (left !== null) {
      /**
       * @type {Item|null}
       */
      let leftTrace = left;
      // trace redone until parent matches
      while (leftTrace !== null && /** @type {AbstractType<any>} */ (leftTrace.parent)._item !== parentItem) {
        leftTrace = leftTrace.redone === null ? null : getItemCleanStart$1(transaction, leftTrace.redone);
      }
      if (leftTrace !== null && /** @type {AbstractType<any>} */ (leftTrace.parent)._item === parentItem) {
        left = leftTrace;
        break
      }
      left = left.left;
    }
    while (right !== null) {
      /**
       * @type {Item|null}
       */
      let rightTrace = right;
      // trace redone until parent matches
      while (rightTrace !== null && /** @type {AbstractType<any>} */ (rightTrace.parent)._item !== parentItem) {
        rightTrace = rightTrace.redone === null ? null : getItemCleanStart$1(transaction, rightTrace.redone);
      }
      if (rightTrace !== null && /** @type {AbstractType<any>} */ (rightTrace.parent)._item === parentItem) {
        right = rightTrace;
        break
      }
      right = right.right;
    }
    // Iterate right while right is in itemsToDelete
    // If it is intended to delete right while item is redone, we can expect that item should replace right.
    while (left !== null && left.right !== null && left.right !== right && itemsToDelete.findIndex(d => d === /** @type {Item} */ (left).right) >= 0) {
      left = left.right;
    }
  }
  const nextClock = getState$1(store, ownClientID);
  const nextId = createID$1(ownClientID, nextClock);
  const redoneItem = new Item$2(
    nextId,
    left, left && left.lastId,
    right, right && right.id,
    parentItem === null ? item.parent : /** @type {ContentType} */ (parentItem.content).type,
    item.parentSub,
    item.content.copy()
  );
  item.redone = nextId;
  keepItem$1(redoneItem, true);
  redoneItem.integrate(transaction, 0);
  return redoneItem
};

/**
 * Abstract class that represents any content.
 */
class Item$2 extends AbstractStruct$1 {
  /**
   * @param {ID} id
   * @param {Item | null} left
   * @param {ID | null} origin
   * @param {Item | null} right
   * @param {ID | null} rightOrigin
   * @param {AbstractType<any>|ID|null} parent Is a type if integrated, is null if it is possible to copy parent from left or right, is ID before integration to search for it.
   * @param {string | null} parentSub
   * @param {AbstractContent} content
   */
  constructor (id, left, origin, right, rightOrigin, parent, parentSub, content) {
    super(id, content.getLength());
    /**
     * The item that was originally to the left of this item.
     * @type {ID | null}
     */
    this.origin = origin;
    /**
     * The item that is currently to the left of this item.
     * @type {Item | null}
     */
    this.left = left;
    /**
     * The item that is currently to the right of this item.
     * @type {Item | null}
     */
    this.right = right;
    /**
     * The item that was originally to the right of this item.
     * @type {ID | null}
     */
    this.rightOrigin = rightOrigin;
    /**
     * @type {AbstractType<any>|ID|null}
     */
    this.parent = parent;
    /**
     * If the parent refers to this item with some kind of key (e.g. YMap, the
     * key is specified here. The key is then used to refer to the list in which
     * to insert this item. If `parentSub = null` type._start is the list in
     * which to insert to. Otherwise it is `parent._map`.
     * @type {String | null}
     */
    this.parentSub = parentSub;
    /**
     * If this type's effect is reundone this type refers to the type that undid
     * this operation.
     * @type {ID | null}
     */
    this.redone = null;
    /**
     * @type {AbstractContent}
     */
    this.content = content;
    /**
     * bit1: keep
     * bit2: countable
     * bit3: deleted
     * bit4: mark - mark node as fast-search-marker
     * @type {number} byte
     */
    this.info = this.content.isCountable() ? BIT2$2 : 0;
  }

  /**
   * This is used to mark the item as an indexed fast-search marker
   *
   * @type {boolean}
   */
  set marker (isMarked) {
    if (((this.info & BIT4$2) > 0) !== isMarked) {
      this.info ^= BIT4$2;
    }
  }

  get marker () {
    return (this.info & BIT4$2) > 0
  }

  /**
   * If true, do not garbage collect this Item.
   */
  get keep () {
    return (this.info & BIT1$2) > 0
  }

  set keep (doKeep) {
    if (this.keep !== doKeep) {
      this.info ^= BIT1$2;
    }
  }

  get countable () {
    return (this.info & BIT2$2) > 0
  }

  /**
   * Whether this item was deleted or not.
   * @type {Boolean}
   */
  get deleted () {
    return (this.info & BIT3$2) > 0
  }

  set deleted (doDelete) {
    if (this.deleted !== doDelete) {
      this.info ^= BIT3$2;
    }
  }

  markDeleted () {
    this.info |= BIT3$2;
  }

  /**
   * Return the creator clientID of the missing op or define missing items and return null.
   *
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing (transaction, store) {
    if (this.origin && this.origin.client !== this.id.client && this.origin.clock >= getState$1(store, this.origin.client)) {
      return this.origin.client
    }
    if (this.rightOrigin && this.rightOrigin.client !== this.id.client && this.rightOrigin.clock >= getState$1(store, this.rightOrigin.client)) {
      return this.rightOrigin.client
    }
    if (this.parent && this.parent.constructor === ID$1 && this.id.client !== this.parent.client && this.parent.clock >= getState$1(store, this.parent.client)) {
      return this.parent.client
    }

    // We have all missing ids, now find the items

    if (this.origin) {
      this.left = getItemCleanEnd$1(transaction, store, this.origin);
      this.origin = this.left.lastId;
    }
    if (this.rightOrigin) {
      this.right = getItemCleanStart$1(transaction, this.rightOrigin);
      this.rightOrigin = this.right.id;
    }
    if ((this.left && this.left.constructor === GC$1) || (this.right && this.right.constructor === GC$1)) {
      this.parent = null;
    }
    // only set parent if this shouldn't be garbage collected
    if (!this.parent) {
      if (this.left && this.left.constructor === Item$2) {
        this.parent = this.left.parent;
        this.parentSub = this.left.parentSub;
      }
      if (this.right && this.right.constructor === Item$2) {
        this.parent = this.right.parent;
        this.parentSub = this.right.parentSub;
      }
    } else if (this.parent.constructor === ID$1) {
      const parentItem = getItem$1(store, this.parent);
      if (parentItem.constructor === GC$1) {
        this.parent = null;
      } else {
        this.parent = /** @type {ContentType} */ (parentItem.content).type;
      }
    }
    return null
  }

  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate (transaction, offset) {
    if (offset > 0) {
      this.id.clock += offset;
      this.left = getItemCleanEnd$1(transaction, transaction.doc.store, createID$1(this.id.client, this.id.clock - 1));
      this.origin = this.left.lastId;
      this.content = this.content.splice(offset);
      this.length -= offset;
    }

    if (this.parent) {
      if ((!this.left && (!this.right || this.right.left !== null)) || (this.left && this.left.right !== this.right)) {
        /**
         * @type {Item|null}
         */
        let left = this.left;

        /**
         * @type {Item|null}
         */
        let o;
        // set o to the first conflicting item
        if (left !== null) {
          o = left.right;
        } else if (this.parentSub !== null) {
          o = /** @type {AbstractType<any>} */ (this.parent)._map.get(this.parentSub) || null;
          while (o !== null && o.left !== null) {
            o = o.left;
          }
        } else {
          o = /** @type {AbstractType<any>} */ (this.parent)._start;
        }
        // TODO: use something like DeleteSet here (a tree implementation would be best)
        // @todo use global set definitions
        /**
         * @type {Set<Item>}
         */
        const conflictingItems = new Set();
        /**
         * @type {Set<Item>}
         */
        const itemsBeforeOrigin = new Set();
        // Let c in conflictingItems, b in itemsBeforeOrigin
        // ***{origin}bbbb{this}{c,b}{c,b}{o}***
        // Note that conflictingItems is a subset of itemsBeforeOrigin
        while (o !== null && o !== this.right) {
          itemsBeforeOrigin.add(o);
          conflictingItems.add(o);
          if (compareIDs$1(this.origin, o.origin)) {
            // case 1
            if (o.id.client < this.id.client) {
              left = o;
              conflictingItems.clear();
            } else if (compareIDs$1(this.rightOrigin, o.rightOrigin)) {
              // this and o are conflicting and point to the same integration points. The id decides which item comes first.
              // Since this is to the left of o, we can break here
              break
            } // else, o might be integrated before an item that this conflicts with. If so, we will find it in the next iterations
          } else if (o.origin !== null && itemsBeforeOrigin.has(getItem$1(transaction.doc.store, o.origin))) { // use getItem instead of getItemCleanEnd because we don't want / need to split items.
            // case 2
            if (!conflictingItems.has(getItem$1(transaction.doc.store, o.origin))) {
              left = o;
              conflictingItems.clear();
            }
          } else {
            break
          }
          o = o.right;
        }
        this.left = left;
      }
      // reconnect left/right + update parent map/start if necessary
      if (this.left !== null) {
        const right = this.left.right;
        this.right = right;
        this.left.right = this;
      } else {
        let r;
        if (this.parentSub !== null) {
          r = /** @type {AbstractType<any>} */ (this.parent)._map.get(this.parentSub) || null;
          while (r !== null && r.left !== null) {
            r = r.left;
          }
        } else {
          r = /** @type {AbstractType<any>} */ (this.parent)._start
          ;/** @type {AbstractType<any>} */ (this.parent)._start = this;
        }
        this.right = r;
      }
      if (this.right !== null) {
        this.right.left = this;
      } else if (this.parentSub !== null) {
        // set as current parent value if right === null and this is parentSub
        /** @type {AbstractType<any>} */ (this.parent)._map.set(this.parentSub, this);
        if (this.left !== null) {
          // this is the current attribute value of parent. delete right
          this.left.delete(transaction);
        }
      }
      // adjust length of parent
      if (this.parentSub === null && this.countable && !this.deleted) {
        /** @type {AbstractType<any>} */ (this.parent)._length += this.length;
      }
      addStruct$1(transaction.doc.store, this);
      this.content.integrate(transaction, this);
      // add parent to transaction.changed
      addChangedTypeToTransaction$1(transaction, /** @type {AbstractType<any>} */ (this.parent), this.parentSub);
      if ((/** @type {AbstractType<any>} */ (this.parent)._item !== null && /** @type {AbstractType<any>} */ (this.parent)._item.deleted) || (this.parentSub !== null && this.right !== null)) {
        // delete if parent is deleted or if this is not the current attribute value of parent
        this.delete(transaction);
      }
    } else {
      // parent is not defined. Integrate GC struct instead
      new GC$1(this.id, this.length).integrate(transaction, 0);
    }
  }

  /**
   * Returns the next non-deleted item
   */
  get next () {
    let n = this.right;
    while (n !== null && n.deleted) {
      n = n.right;
    }
    return n
  }

  /**
   * Returns the previous non-deleted item
   */
  get prev () {
    let n = this.left;
    while (n !== null && n.deleted) {
      n = n.left;
    }
    return n
  }

  /**
   * Computes the last content address of this Item.
   */
  get lastId () {
    // allocating ids is pretty costly because of the amount of ids created, so we try to reuse whenever possible
    return this.length === 1 ? this.id : createID$1(this.id.client, this.id.clock + this.length - 1)
  }

  /**
   * Try to merge two items
   *
   * @param {Item} right
   * @return {boolean}
   */
  mergeWith (right) {
    if (
      this.constructor === right.constructor &&
      compareIDs$1(right.origin, this.lastId) &&
      this.right === right &&
      compareIDs$1(this.rightOrigin, right.rightOrigin) &&
      this.id.client === right.id.client &&
      this.id.clock + this.length === right.id.clock &&
      this.deleted === right.deleted &&
      this.redone === null &&
      right.redone === null &&
      this.content.constructor === right.content.constructor &&
      this.content.mergeWith(right.content)
    ) {
      const searchMarker = /** @type {AbstractType<any>} */ (this.parent)._searchMarker;
      if (searchMarker) {
        searchMarker.forEach(marker => {
          if (marker.p === right) {
            // right is going to be "forgotten" so we need to update the marker
            marker.p = this;
            // adjust marker index
            if (!this.deleted && this.countable) {
              marker.index -= this.length;
            }
          }
        });
      }
      if (right.keep) {
        this.keep = true;
      }
      this.right = right.right;
      if (this.right !== null) {
        this.right.left = this;
      }
      this.length += right.length;
      return true
    }
    return false
  }

  /**
   * Mark this Item as deleted.
   *
   * @param {Transaction} transaction
   */
  delete (transaction) {
    if (!this.deleted) {
      const parent = /** @type {AbstractType<any>} */ (this.parent);
      // adjust the length of parent
      if (this.countable && this.parentSub === null) {
        parent._length -= this.length;
      }
      this.markDeleted();
      addToDeleteSet$1(transaction.deleteSet, this.id.client, this.id.clock, this.length);
      addChangedTypeToTransaction$1(transaction, parent, this.parentSub);
      this.content.delete(transaction);
    }
  }

  /**
   * @param {StructStore} store
   * @param {boolean} parentGCd
   */
  gc (store, parentGCd) {
    if (!this.deleted) {
      throw unexpectedCase$2()
    }
    this.content.gc(store);
    if (parentGCd) {
      replaceStruct$1(store, this, new GC$1(this.id, this.length));
    } else {
      this.content = new ContentDeleted$1(this.length);
    }
  }

  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   * @param {number} offset
   */
  write (encoder, offset) {
    const origin = offset > 0 ? createID$1(this.id.client, this.id.clock + offset - 1) : this.origin;
    const rightOrigin = this.rightOrigin;
    const parentSub = this.parentSub;
    const info = (this.content.getRef() & BITS5$2) |
      (origin === null ? 0 : BIT8$2) | // origin is defined
      (rightOrigin === null ? 0 : BIT7$2) | // right origin is defined
      (parentSub === null ? 0 : BIT6$2); // parentSub is non-null
    encoder.writeInfo(info);
    if (origin !== null) {
      encoder.writeLeftID(origin);
    }
    if (rightOrigin !== null) {
      encoder.writeRightID(rightOrigin);
    }
    if (origin === null && rightOrigin === null) {
      const parent = /** @type {AbstractType<any>} */ (this.parent);
      if (parent._item !== undefined) {
        const parentItem = parent._item;
        if (parentItem === null) {
          // parent type on y._map
          // find the correct key
          const ykey = findRootTypeKey$1(parent);
          encoder.writeParentInfo(true); // write parentYKey
          encoder.writeString(ykey);
        } else {
          encoder.writeParentInfo(false); // write parent id
          encoder.writeLeftID(parentItem.id);
        }
      } else if (parent.constructor === String) { // this edge case was added by differential updates
        encoder.writeParentInfo(true); // write parentYKey
        encoder.writeString(parent);
      } else if (parent.constructor === ID$1) {
        encoder.writeParentInfo(false); // write parent id
        encoder.writeLeftID(parent);
      } else {
        unexpectedCase$2();
      }
      if (parentSub !== null) {
        encoder.writeString(parentSub);
      }
    }
    this.content.write(encoder, offset);
  }
}

/**
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 * @param {number} info
 */
const readItemContent$1 = (decoder, info) => contentRefs$1[info & BITS5$2](decoder);

/**
 * A lookup map for reading Item content.
 *
 * @type {Array<function(UpdateDecoderV1 | UpdateDecoderV2):AbstractContent>}
 */
const contentRefs$1 = [
  () => { unexpectedCase$2(); }, // GC is not ItemContent
  readContentDeleted$1, // 1
  readContentJSON$1, // 2
  readContentBinary$1, // 3
  readContentString$1, // 4
  readContentEmbed$1, // 5
  readContentFormat$1, // 6
  readContentType$1, // 7
  readContentAny$1, // 8
  readContentDoc$1, // 9
  () => { unexpectedCase$2(); } // 10 - Skip is not ItemContent
];

const structSkipRefNumber$1 = 10;

/**
 * @private
 */
class Skip$1 extends AbstractStruct$1 {
  get deleted () {
    return true
  }

  delete () {}

  /**
   * @param {Skip} right
   * @return {boolean}
   */
  mergeWith (right) {
    if (this.constructor !== right.constructor) {
      return false
    }
    this.length += right.length;
    return true
  }

  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate (transaction, offset) {
    // skip structs cannot be integrated
    unexpectedCase$2();
  }

  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    encoder.writeInfo(structSkipRefNumber$1);
    // write as VarUint because Skips can't make use of predictable length-encoding
    writeVarUint$2(encoder.restEncoder, this.length - offset);
  }

  /**
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing (transaction, store) {
    return null
  }
}

/** eslint-env browser */

const glo$1 = /** @type {any} */ (typeof window !== 'undefined'
  ? window
  // @ts-ignore
  : typeof global !== 'undefined' ? global : {});

const importIdentifier$1 = '__ $YJS$ __';

if (glo$1[importIdentifier$1] === true) {
  /**
   * Dear reader of this warning message. Please take this seriously.
   *
   * If you see this message, please make sure that you only import one version of Yjs. In many cases,
   * your package manager installs two versions of Yjs that are used by different packages within your project.
   * Another reason for this message is that some parts of your project use the commonjs version of Yjs
   * and others use the EcmaScript version of Yjs.
   *
   * This often leads to issues that are hard to debug. We often need to perform constructor checks,
   * e.g. `struct instanceof GC`. If you imported different versions of Yjs, it is impossible for us to
   * do the constructor checks anymore - which might break the CRDT algorithm.
   */
  console.warn('Yjs was already imported. Importing different versions of Yjs often leads to issues.');
}
glo$1[importIdentifier$1] = true;

var immutable = extend$1;

var hasOwnProperty$2 = Object.prototype.hasOwnProperty;

function extend$1() {
    var target = {};

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
            if (hasOwnProperty$2.call(source, key)) {
                target[key] = source[key];
            }
        }
    }

    return target
}

var mutable = extend;

var hasOwnProperty$1 = Object.prototype.hasOwnProperty;

function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
            if (hasOwnProperty$1.call(source, key)) {
                target[key] = source[key];
            }
        }
    }

    return target
}

// For (old) browser support



var levelSupports = function supports () {
  var manifest = immutable.apply(null, arguments);

  return mutable(manifest, {
    // Features of abstract-leveldown
    bufferKeys: manifest.bufferKeys || false,
    snapshots: manifest.snapshots || false,
    permanence: manifest.permanence || false,
    seek: manifest.seek || false,
    clear: manifest.clear || false,

    // Features of abstract-leveldown that levelup doesn't have
    status: manifest.status || false,

    // Features of disk-based implementations
    createIfMissing: manifest.createIfMissing || false,
    errorIfExists: manifest.errorIfExists || false,

    // Features of level(up) that abstract-leveldown doesn't have yet
    deferredOpen: manifest.deferredOpen || false,
    openCallback: manifest.openCallback || false,
    promises: manifest.promises || false,
    streams: manifest.streams || false,
    encodings: manifest.encodings || false,

    // Methods that are not part of abstract-leveldown or levelup
    additionalMethods: immutable(manifest.additionalMethods)
  })
};

var _nodeResolve_empty = {};

var _nodeResolve_empty$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': _nodeResolve_empty
});

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getAugmentedNamespace(n) {
	if (n.__esModule) return n;
	var a = Object.defineProperty({}, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

var test$4 = function () {
  return typeof commonjsGlobal.queueMicrotask === 'function';
};

var install$4 = function (func) {
  return function () {
    commonjsGlobal.queueMicrotask(func);
  };
};

var queueMicrotask = {
	test: test$4,
	install: install$4
};

//based off rsvp https://github.com/tildeio/rsvp.js
//license https://github.com/tildeio/rsvp.js/blob/master/LICENSE
//https://github.com/tildeio/rsvp.js/blob/master/lib/rsvp/asap.js

var Mutation = commonjsGlobal.MutationObserver || commonjsGlobal.WebKitMutationObserver;

var test$3 = function () {
  return Mutation;
};

var install$3 = function (handle) {
  var called = 0;
  var observer = new Mutation(handle);
  var element = commonjsGlobal.document.createTextNode('');
  observer.observe(element, {
    characterData: true
  });
  return function () {
    element.data = (called = ++called % 2);
  };
};

var mutation = {
	test: test$3,
	install: install$3
};

var test$2 = function () {
  if (commonjsGlobal.setImmediate) {
    // we can only get here in IE10
    // which doesn't handel postMessage well
    return false;
  }
  return typeof commonjsGlobal.MessageChannel !== 'undefined';
};

var install$2 = function (func) {
  var channel = new commonjsGlobal.MessageChannel();
  channel.port1.onmessage = func;
  return function () {
    channel.port2.postMessage(0);
  };
};

var messageChannel = {
	test: test$2,
	install: install$2
};

var test$1 = function () {
  return 'document' in commonjsGlobal && 'onreadystatechange' in commonjsGlobal.document.createElement('script');
};

var install$1 = function (handle) {
  return function () {

    // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
    // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
    var scriptEl = commonjsGlobal.document.createElement('script');
    scriptEl.onreadystatechange = function () {
      handle();

      scriptEl.onreadystatechange = null;
      scriptEl.parentNode.removeChild(scriptEl);
      scriptEl = null;
    };
    commonjsGlobal.document.documentElement.appendChild(scriptEl);

    return handle;
  };
};

var stateChange = {
	test: test$1,
	install: install$1
};

var test = function () {
  return true;
};

var install = function (t) {
  return function () {
    setTimeout(t, 0);
  };
};

var timeout$1 = {
	test: test,
	install: install
};

var debugUtil = /*@__PURE__*/getAugmentedNamespace(_nodeResolve_empty$1);

var types = [
  debugUtil,
  queueMicrotask,
  mutation,
  messageChannel,
  stateChange,
  timeout$1
];
var draining;
var currentQueue;
var queueIndex = -1;
var queue$1 = [];
var scheduled = false;
function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }
  draining = false;
  if (currentQueue.length) {
    queue$1 = currentQueue.concat(queue$1);
  } else {
    queueIndex = -1;
  }
  if (queue$1.length) {
    nextTick();
  }
}

//named nextTick for less confusing stack traces
function nextTick() {
  if (draining) {
    return;
  }
  scheduled = false;
  draining = true;
  var len = queue$1.length;
  var timeout = setTimeout(cleanUpNextTick);
  while (len) {
    currentQueue = queue$1;
    queue$1 = [];
    while (currentQueue && ++queueIndex < len) {
      currentQueue[queueIndex].run();
    }
    queueIndex = -1;
    len = queue$1.length;
  }
  currentQueue = null;
  queueIndex = -1;
  draining = false;
  clearTimeout(timeout);
}
var scheduleDrain;
var i = -1;
var len = types.length;
while (++i < len) {
  if (types[i] && types[i].test && types[i].test()) {
    scheduleDrain = types[i].install(nextTick);
    break;
  }
}
// v8 likes predictible objects
function Item$1(fun, array) {
  this.fun = fun;
  this.array = array;
}
Item$1.prototype.run = function () {
  var fun = this.fun;
  var array = this.array;
  switch (array.length) {
  case 0:
    return fun();
  case 1:
    return fun(array[0]);
  case 2:
    return fun(array[0], array[1]);
  case 3:
    return fun(array[0], array[1], array[2]);
  default:
    return fun.apply(null, array);
  }

};
var lib = immediate;
function immediate(task) {
  var args = new Array(arguments.length - 1);
  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }
  queue$1.push(new Item$1(task, args));
  if (!scheduled && !draining) {
    scheduled = true;
    scheduleDrain();
  }
}

var nextTickBrowser = lib;

function AbstractIterator$4 (db) {
  if (typeof db !== 'object' || db === null) {
    throw new TypeError('First argument must be an abstract-leveldown compliant store')
  }

  this.db = db;
  this._ended = false;
  this._nexting = false;
}

AbstractIterator$4.prototype.next = function (callback) {
  var self = this;

  if (typeof callback !== 'function') {
    throw new Error('next() requires a callback argument')
  }

  if (self._ended) {
    nextTickBrowser(callback, new Error('cannot call next() after end()'));
    return self
  }

  if (self._nexting) {
    nextTickBrowser(callback, new Error('cannot call next() before previous next() has completed'));
    return self
  }

  self._nexting = true;
  self._next(function () {
    self._nexting = false;
    callback.apply(null, arguments);
  });

  return self
};

AbstractIterator$4.prototype._next = function (callback) {
  nextTickBrowser(callback);
};

AbstractIterator$4.prototype.seek = function (target) {
  if (this._ended) {
    throw new Error('cannot call seek() after end()')
  }
  if (this._nexting) {
    throw new Error('cannot call seek() before next() has completed')
  }

  target = this.db._serializeKey(target);
  this._seek(target);
};

AbstractIterator$4.prototype._seek = function (target) {};

AbstractIterator$4.prototype.end = function (callback) {
  if (typeof callback !== 'function') {
    throw new Error('end() requires a callback argument')
  }

  if (this._ended) {
    return nextTickBrowser(callback, new Error('end() already called on iterator'))
  }

  this._ended = true;
  this._end(callback);
};

AbstractIterator$4.prototype._end = function (callback) {
  nextTickBrowser(callback);
};

// Expose browser-compatible nextTick for dependents
AbstractIterator$4.prototype._nextTick = nextTickBrowser;

var abstractIterator = AbstractIterator$4;

function AbstractChainedBatch$2 (db) {
  if (typeof db !== 'object' || db === null) {
    throw new TypeError('First argument must be an abstract-leveldown compliant store')
  }

  this.db = db;
  this._operations = [];
  this._written = false;
}

AbstractChainedBatch$2.prototype._checkWritten = function () {
  if (this._written) {
    throw new Error('write() already called on this batch')
  }
};

AbstractChainedBatch$2.prototype.put = function (key, value) {
  this._checkWritten();

  var err = this.db._checkKey(key) || this.db._checkValue(value);
  if (err) throw err

  key = this.db._serializeKey(key);
  value = this.db._serializeValue(value);

  this._put(key, value);

  return this
};

AbstractChainedBatch$2.prototype._put = function (key, value) {
  this._operations.push({ type: 'put', key: key, value: value });
};

AbstractChainedBatch$2.prototype.del = function (key) {
  this._checkWritten();

  var err = this.db._checkKey(key);
  if (err) throw err

  key = this.db._serializeKey(key);
  this._del(key);

  return this
};

AbstractChainedBatch$2.prototype._del = function (key) {
  this._operations.push({ type: 'del', key: key });
};

AbstractChainedBatch$2.prototype.clear = function () {
  this._checkWritten();
  this._clear();

  return this
};

AbstractChainedBatch$2.prototype._clear = function () {
  this._operations = [];
};

AbstractChainedBatch$2.prototype.write = function (options, callback) {
  this._checkWritten();

  if (typeof options === 'function') { callback = options; }
  if (typeof callback !== 'function') {
    throw new Error('write() requires a callback argument')
  }
  if (typeof options !== 'object' || options === null) {
    options = {};
  }

  this._written = true;
  this._write(options, callback);
};

AbstractChainedBatch$2.prototype._write = function (options, callback) {
  this.db._batch(this._operations, options, callback);
};

// Expose browser-compatible nextTick for dependents
AbstractChainedBatch$2.prototype._nextTick = nextTickBrowser;

var abstractChainedBatch = AbstractChainedBatch$2;

var Buffer$7 = require$$0__default["default"].Buffer;



var hasOwnProperty = Object.prototype.hasOwnProperty;
var rangeOptions = 'start end gt gte lt lte'.split(' ');

function AbstractLevelDOWN$4 (manifest) {
  this.status = 'new';

  // TODO (next major): make this mandatory
  this.supports = levelSupports(manifest, {
    status: true
  });
}

AbstractLevelDOWN$4.prototype.open = function (options, callback) {
  var self = this;
  var oldStatus = this.status;

  if (typeof options === 'function') callback = options;

  if (typeof callback !== 'function') {
    throw new Error('open() requires a callback argument')
  }

  if (typeof options !== 'object' || options === null) options = {};

  options.createIfMissing = options.createIfMissing !== false;
  options.errorIfExists = !!options.errorIfExists;

  this.status = 'opening';
  this._open(options, function (err) {
    if (err) {
      self.status = oldStatus;
      return callback(err)
    }
    self.status = 'open';
    callback();
  });
};

AbstractLevelDOWN$4.prototype._open = function (options, callback) {
  nextTickBrowser(callback);
};

AbstractLevelDOWN$4.prototype.close = function (callback) {
  var self = this;
  var oldStatus = this.status;

  if (typeof callback !== 'function') {
    throw new Error('close() requires a callback argument')
  }

  this.status = 'closing';
  this._close(function (err) {
    if (err) {
      self.status = oldStatus;
      return callback(err)
    }
    self.status = 'closed';
    callback();
  });
};

AbstractLevelDOWN$4.prototype._close = function (callback) {
  nextTickBrowser(callback);
};

AbstractLevelDOWN$4.prototype.get = function (key, options, callback) {
  if (typeof options === 'function') callback = options;

  if (typeof callback !== 'function') {
    throw new Error('get() requires a callback argument')
  }

  var err = this._checkKey(key);
  if (err) return nextTickBrowser(callback, err)

  key = this._serializeKey(key);

  if (typeof options !== 'object' || options === null) options = {};

  options.asBuffer = options.asBuffer !== false;

  this._get(key, options, callback);
};

AbstractLevelDOWN$4.prototype._get = function (key, options, callback) {
  nextTickBrowser(function () { callback(new Error('NotFound')); });
};

AbstractLevelDOWN$4.prototype.put = function (key, value, options, callback) {
  if (typeof options === 'function') callback = options;

  if (typeof callback !== 'function') {
    throw new Error('put() requires a callback argument')
  }

  var err = this._checkKey(key) || this._checkValue(value);
  if (err) return nextTickBrowser(callback, err)

  key = this._serializeKey(key);
  value = this._serializeValue(value);

  if (typeof options !== 'object' || options === null) options = {};

  this._put(key, value, options, callback);
};

AbstractLevelDOWN$4.prototype._put = function (key, value, options, callback) {
  nextTickBrowser(callback);
};

AbstractLevelDOWN$4.prototype.del = function (key, options, callback) {
  if (typeof options === 'function') callback = options;

  if (typeof callback !== 'function') {
    throw new Error('del() requires a callback argument')
  }

  var err = this._checkKey(key);
  if (err) return nextTickBrowser(callback, err)

  key = this._serializeKey(key);

  if (typeof options !== 'object' || options === null) options = {};

  this._del(key, options, callback);
};

AbstractLevelDOWN$4.prototype._del = function (key, options, callback) {
  nextTickBrowser(callback);
};

AbstractLevelDOWN$4.prototype.batch = function (array, options, callback) {
  if (!arguments.length) return this._chainedBatch()

  if (typeof options === 'function') callback = options;

  if (typeof array === 'function') callback = array;

  if (typeof callback !== 'function') {
    throw new Error('batch(array) requires a callback argument')
  }

  if (!Array.isArray(array)) {
    return nextTickBrowser(callback, new Error('batch(array) requires an array argument'))
  }

  if (array.length === 0) {
    return nextTickBrowser(callback)
  }

  if (typeof options !== 'object' || options === null) options = {};

  var serialized = new Array(array.length);

  for (var i = 0; i < array.length; i++) {
    if (typeof array[i] !== 'object' || array[i] === null) {
      return nextTickBrowser(callback, new Error('batch(array) element must be an object and not `null`'))
    }

    var e = immutable(array[i]);

    if (e.type !== 'put' && e.type !== 'del') {
      return nextTickBrowser(callback, new Error("`type` must be 'put' or 'del'"))
    }

    var err = this._checkKey(e.key);
    if (err) return nextTickBrowser(callback, err)

    e.key = this._serializeKey(e.key);

    if (e.type === 'put') {
      var valueErr = this._checkValue(e.value);
      if (valueErr) return nextTickBrowser(callback, valueErr)

      e.value = this._serializeValue(e.value);
    }

    serialized[i] = e;
  }

  this._batch(serialized, options, callback);
};

AbstractLevelDOWN$4.prototype._batch = function (array, options, callback) {
  nextTickBrowser(callback);
};

AbstractLevelDOWN$4.prototype.clear = function (options, callback) {
  if (typeof options === 'function') {
    callback = options;
  } else if (typeof callback !== 'function') {
    throw new Error('clear() requires a callback argument')
  }

  options = cleanRangeOptions(this, options);
  options.reverse = !!options.reverse;
  options.limit = 'limit' in options ? options.limit : -1;

  this._clear(options, callback);
};

AbstractLevelDOWN$4.prototype._clear = function (options, callback) {
  // Avoid setupIteratorOptions, would serialize range options a second time.
  options.keys = true;
  options.values = false;
  options.keyAsBuffer = true;
  options.valueAsBuffer = true;

  var iterator = this._iterator(options);
  var emptyOptions = {};
  var self = this;

  var next = function (err) {
    if (err) {
      return iterator.end(function () {
        callback(err);
      })
    }

    iterator.next(function (err, key) {
      if (err) return next(err)
      if (key === undefined) return iterator.end(callback)

      // This could be optimized by using a batch, but the default _clear
      // is not meant to be fast. Implementations have more room to optimize
      // if they override _clear. Note: using _del bypasses key serialization.
      self._del(key, emptyOptions, next);
    });
  };

  next();
};

AbstractLevelDOWN$4.prototype._setupIteratorOptions = function (options) {
  options = cleanRangeOptions(this, options);

  options.reverse = !!options.reverse;
  options.keys = options.keys !== false;
  options.values = options.values !== false;
  options.limit = 'limit' in options ? options.limit : -1;
  options.keyAsBuffer = options.keyAsBuffer !== false;
  options.valueAsBuffer = options.valueAsBuffer !== false;

  return options
};

function cleanRangeOptions (db, options) {
  var result = {};

  for (var k in options) {
    if (!hasOwnProperty.call(options, k)) continue

    var opt = options[k];

    if (isRangeOption(k)) {
      // Note that we don't reject nullish and empty options here. While
      // those types are invalid as keys, they are valid as range options.
      opt = db._serializeKey(opt);
    }

    result[k] = opt;
  }

  return result
}

function isRangeOption (k) {
  return rangeOptions.indexOf(k) !== -1
}

AbstractLevelDOWN$4.prototype.iterator = function (options) {
  if (typeof options !== 'object' || options === null) options = {};
  options = this._setupIteratorOptions(options);
  return this._iterator(options)
};

AbstractLevelDOWN$4.prototype._iterator = function (options) {
  return new abstractIterator(this)
};

AbstractLevelDOWN$4.prototype._chainedBatch = function () {
  return new abstractChainedBatch(this)
};

AbstractLevelDOWN$4.prototype._serializeKey = function (key) {
  return key
};

AbstractLevelDOWN$4.prototype._serializeValue = function (value) {
  return value
};

AbstractLevelDOWN$4.prototype._checkKey = function (key) {
  if (key === null || key === undefined) {
    return new Error('key cannot be `null` or `undefined`')
  } else if (Buffer$7.isBuffer(key) && key.length === 0) {
    return new Error('key cannot be an empty Buffer')
  } else if (key === '') {
    return new Error('key cannot be an empty String')
  } else if (Array.isArray(key) && key.length === 0) {
    return new Error('key cannot be an empty Array')
  }
};

AbstractLevelDOWN$4.prototype._checkValue = function (value) {
  if (value === null || value === undefined) {
    return new Error('value cannot be `null` or `undefined`')
  }
};

// Expose browser-compatible nextTick for dependents
AbstractLevelDOWN$4.prototype._nextTick = nextTickBrowser;

var abstractLeveldown$1 = AbstractLevelDOWN$4;

var AbstractLevelDOWN$3 = abstractLeveldown$1;
var AbstractIterator$3 = abstractIterator;
var AbstractChainedBatch$1 = abstractChainedBatch;

var abstractLeveldown = {
	AbstractLevelDOWN: AbstractLevelDOWN$3,
	AbstractIterator: AbstractIterator$3,
	AbstractChainedBatch: AbstractChainedBatch$1
};

var inherits_browser = createCommonjsModule(function (module) {
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function () {};
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    }
  };
}
});

var AbstractIterator$2 = abstractLeveldown.AbstractIterator;


function DeferredIterator (db, options) {
  AbstractIterator$2.call(this, db);

  this._options = options;
  this._iterator = null;
  this._operations = [];
}

inherits_browser(DeferredIterator, AbstractIterator$2);

DeferredIterator.prototype.setDb = function (db) {
  var it = this._iterator = db.iterator(this._options);
  this._operations.forEach(function (op) {
    it[op.method].apply(it, op.args);
  });
};

DeferredIterator.prototype._operation = function (method, args) {
  if (this._iterator) return this._iterator[method].apply(this._iterator, args)
  this._operations.push({ method: method, args: args });
};

'next end'.split(' ').forEach(function (m) {
  DeferredIterator.prototype['_' + m] = function () {
    this._operation(m, arguments);
  };
});

// Must defer seek() rather than _seek() because it requires db._serializeKey to be available
DeferredIterator.prototype.seek = function () {
  this._operation('seek', arguments);
};

var deferredIterator = DeferredIterator;

var AbstractLevelDOWN$2 = abstractLeveldown.AbstractLevelDOWN;


var deferrables = 'put get del batch clear'.split(' ');
var optionalDeferrables = 'approximateSize compactRange'.split(' ');

function DeferredLevelDOWN (db) {
  AbstractLevelDOWN$2.call(this, db.supports || {});

  // TODO (future major): remove this fallback; db must have manifest that
  // declares approximateSize and compactRange in additionalMethods.
  optionalDeferrables.forEach(function (m) {
    if (typeof db[m] === 'function' && !this.supports.additionalMethods[m]) {
      this.supports.additionalMethods[m] = true;
    }
  }, this);

  this._db = db;
  this._operations = [];
  closed(this);
}

inherits_browser(DeferredLevelDOWN, AbstractLevelDOWN$2);

DeferredLevelDOWN.prototype.type = 'deferred-leveldown';

DeferredLevelDOWN.prototype._open = function (options, callback) {
  var self = this;

  this._db.open(options, function (err) {
    if (err) return callback(err)

    self._operations.forEach(function (op) {
      if (op.iterator) {
        op.iterator.setDb(self._db);
      } else {
        self._db[op.method].apply(self._db, op.args);
      }
    });
    self._operations = [];

    open(self);
    callback();
  });
};

DeferredLevelDOWN.prototype._close = function (callback) {
  var self = this;

  this._db.close(function (err) {
    if (err) return callback(err)
    closed(self);
    callback();
  });
};

function open (self) {
  deferrables.concat('iterator').forEach(function (m) {
    self['_' + m] = function () {
      return this._db[m].apply(this._db, arguments)
    };
  });
  Object.keys(self.supports.additionalMethods).forEach(function (m) {
    self[m] = function () {
      return this._db[m].apply(this._db, arguments)
    };
  });
}

function closed (self) {
  deferrables.forEach(function (m) {
    self['_' + m] = function () {
      this._operations.push({ method: m, args: arguments });
    };
  });
  Object.keys(self.supports.additionalMethods).forEach(function (m) {
    self[m] = function () {
      this._operations.push({ method: m, args: arguments });
    };
  });
  self._iterator = function (options) {
    var it = new deferredIterator(self, options);
    this._operations.push({ iterator: it });
    return it
  };
}

DeferredLevelDOWN.prototype._serializeKey = function (key) {
  return key
};

DeferredLevelDOWN.prototype._serializeValue = function (value) {
  return value
};

var deferredLeveldown = DeferredLevelDOWN;
var DeferredIterator_1 = deferredIterator;
deferredLeveldown.DeferredIterator = DeferredIterator_1;

var streamBrowser = require$$0__default$1["default"].EventEmitter;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty$1(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Buffer$6 = require$$0__default["default"].Buffer;

var inspect = debugUtil.inspect;

var custom$1 = inspect && inspect.custom || 'inspect';

function copyBuffer(src, target, offset) {
  Buffer$6.prototype.copy.call(src, target, offset);
}

var buffer_list =
/*#__PURE__*/
function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  _createClass(BufferList, [{
    key: "push",
    value: function push(v) {
      var entry = {
        data: v,
        next: null
      };
      if (this.length > 0) this.tail.next = entry;else this.head = entry;
      this.tail = entry;
      ++this.length;
    }
  }, {
    key: "unshift",
    value: function unshift(v) {
      var entry = {
        data: v,
        next: this.head
      };
      if (this.length === 0) this.tail = entry;
      this.head = entry;
      ++this.length;
    }
  }, {
    key: "shift",
    value: function shift() {
      if (this.length === 0) return;
      var ret = this.head.data;
      if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
      --this.length;
      return ret;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.head = this.tail = null;
      this.length = 0;
    }
  }, {
    key: "join",
    value: function join(s) {
      if (this.length === 0) return '';
      var p = this.head;
      var ret = '' + p.data;

      while (p = p.next) {
        ret += s + p.data;
      }

      return ret;
    }
  }, {
    key: "concat",
    value: function concat(n) {
      if (this.length === 0) return Buffer$6.alloc(0);
      var ret = Buffer$6.allocUnsafe(n >>> 0);
      var p = this.head;
      var i = 0;

      while (p) {
        copyBuffer(p.data, ret, i);
        i += p.data.length;
        p = p.next;
      }

      return ret;
    } // Consumes a specified amount of bytes or characters from the buffered data.

  }, {
    key: "consume",
    value: function consume(n, hasStrings) {
      var ret;

      if (n < this.head.data.length) {
        // `slice` is the same for buffers and strings.
        ret = this.head.data.slice(0, n);
        this.head.data = this.head.data.slice(n);
      } else if (n === this.head.data.length) {
        // First chunk is a perfect match.
        ret = this.shift();
      } else {
        // Result spans more than one buffer.
        ret = hasStrings ? this._getString(n) : this._getBuffer(n);
      }

      return ret;
    }
  }, {
    key: "first",
    value: function first() {
      return this.head.data;
    } // Consumes a specified amount of characters from the buffered data.

  }, {
    key: "_getString",
    value: function _getString(n) {
      var p = this.head;
      var c = 1;
      var ret = p.data;
      n -= ret.length;

      while (p = p.next) {
        var str = p.data;
        var nb = n > str.length ? str.length : n;
        if (nb === str.length) ret += str;else ret += str.slice(0, n);
        n -= nb;

        if (n === 0) {
          if (nb === str.length) {
            ++c;
            if (p.next) this.head = p.next;else this.head = this.tail = null;
          } else {
            this.head = p;
            p.data = str.slice(nb);
          }

          break;
        }

        ++c;
      }

      this.length -= c;
      return ret;
    } // Consumes a specified amount of bytes from the buffered data.

  }, {
    key: "_getBuffer",
    value: function _getBuffer(n) {
      var ret = Buffer$6.allocUnsafe(n);
      var p = this.head;
      var c = 1;
      p.data.copy(ret);
      n -= p.data.length;

      while (p = p.next) {
        var buf = p.data;
        var nb = n > buf.length ? buf.length : n;
        buf.copy(ret, ret.length - n, 0, nb);
        n -= nb;

        if (n === 0) {
          if (nb === buf.length) {
            ++c;
            if (p.next) this.head = p.next;else this.head = this.tail = null;
          } else {
            this.head = p;
            p.data = buf.slice(nb);
          }

          break;
        }

        ++c;
      }

      this.length -= c;
      return ret;
    } // Make sure the linked list only shows the minimal necessary information.

  }, {
    key: custom$1,
    value: function value(_, options) {
      return inspect(this, _objectSpread({}, options, {
        // Only inspect one level.
        depth: 0,
        // It should not recurse.
        customInspect: false
      }));
    }
  }]);

  return BufferList;
}();

function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err) {
      if (!this._writableState) {
        process.nextTick(emitErrorNT, this, err);
      } else if (!this._writableState.errorEmitted) {
        this._writableState.errorEmitted = true;
        process.nextTick(emitErrorNT, this, err);
      }
    }

    return this;
  } // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks


  if (this._readableState) {
    this._readableState.destroyed = true;
  } // if this is a duplex stream mark the writable part as destroyed as well


  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      if (!_this._writableState) {
        process.nextTick(emitErrorAndCloseNT, _this, err);
      } else if (!_this._writableState.errorEmitted) {
        _this._writableState.errorEmitted = true;
        process.nextTick(emitErrorAndCloseNT, _this, err);
      } else {
        process.nextTick(emitCloseNT, _this);
      }
    } else if (cb) {
      process.nextTick(emitCloseNT, _this);
      cb(err);
    } else {
      process.nextTick(emitCloseNT, _this);
    }
  });

  return this;
}

function emitErrorAndCloseNT(self, err) {
  emitErrorNT(self, err);
  emitCloseNT(self);
}

function emitCloseNT(self) {
  if (self._writableState && !self._writableState.emitClose) return;
  if (self._readableState && !self._readableState.emitClose) return;
  self.emit('close');
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finalCalled = false;
    this._writableState.prefinished = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

function errorOrDestroy$2(stream, err) {
  // We have tests that rely on errors being emitted
  // in the same tick, so changing this is semver major.
  // For now when you opt-in to autoDestroy we allow
  // the error to be emitted nextTick. In a future
  // semver major update we should change the default to this.
  var rState = stream._readableState;
  var wState = stream._writableState;
  if (rState && rState.autoDestroy || wState && wState.autoDestroy) stream.destroy(err);else stream.emit('error', err);
}

var destroy_1 = {
  destroy: destroy,
  undestroy: undestroy,
  errorOrDestroy: errorOrDestroy$2
};

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var codes = {};

function createErrorType(code, message, Base) {
  if (!Base) {
    Base = Error;
  }

  function getMessage(arg1, arg2, arg3) {
    if (typeof message === 'string') {
      return message;
    } else {
      return message(arg1, arg2, arg3);
    }
  }

  var NodeError =
  /*#__PURE__*/
  function (_Base) {
    _inheritsLoose(NodeError, _Base);

    function NodeError(arg1, arg2, arg3) {
      return _Base.call(this, getMessage(arg1, arg2, arg3)) || this;
    }

    return NodeError;
  }(Base);

  NodeError.prototype.name = Base.name;
  NodeError.prototype.code = code;
  codes[code] = NodeError;
} // https://github.com/nodejs/node/blob/v10.8.0/lib/internal/errors.js


function oneOf$1(expected, thing) {
  if (Array.isArray(expected)) {
    var len = expected.length;
    expected = expected.map(function (i) {
      return String(i);
    });

    if (len > 2) {
      return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(', '), ", or ") + expected[len - 1];
    } else if (len === 2) {
      return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
    } else {
      return "of ".concat(thing, " ").concat(expected[0]);
    }
  } else {
    return "of ".concat(thing, " ").concat(String(expected));
  }
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith


function startsWith(str, search, pos) {
  return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith


function endsWith(str, search, this_len) {
  if (this_len === undefined || this_len > str.length) {
    this_len = str.length;
  }

  return str.substring(this_len - search.length, this_len) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes


function includes(str, search, start) {
  if (typeof start !== 'number') {
    start = 0;
  }

  if (start + search.length > str.length) {
    return false;
  } else {
    return str.indexOf(search, start) !== -1;
  }
}

createErrorType('ERR_INVALID_OPT_VALUE', function (name, value) {
  return 'The value "' + value + '" is invalid for option "' + name + '"';
}, TypeError);
createErrorType('ERR_INVALID_ARG_TYPE', function (name, expected, actual) {
  // determiner: 'must be' or 'must not be'
  var determiner;

  if (typeof expected === 'string' && startsWith(expected, 'not ')) {
    determiner = 'must not be';
    expected = expected.replace(/^not /, '');
  } else {
    determiner = 'must be';
  }

  var msg;

  if (endsWith(name, ' argument')) {
    // For cases like 'first argument'
    msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf$1(expected, 'type'));
  } else {
    var type = includes(name, '.') ? 'property' : 'argument';
    msg = "The \"".concat(name, "\" ").concat(type, " ").concat(determiner, " ").concat(oneOf$1(expected, 'type'));
  }

  msg += ". Received type ".concat(typeof actual);
  return msg;
}, TypeError);
createErrorType('ERR_STREAM_PUSH_AFTER_EOF', 'stream.push() after EOF');
createErrorType('ERR_METHOD_NOT_IMPLEMENTED', function (name) {
  return 'The ' + name + ' method is not implemented';
});
createErrorType('ERR_STREAM_PREMATURE_CLOSE', 'Premature close');
createErrorType('ERR_STREAM_DESTROYED', function (name) {
  return 'Cannot call ' + name + ' after a stream was destroyed';
});
createErrorType('ERR_MULTIPLE_CALLBACK', 'Callback called multiple times');
createErrorType('ERR_STREAM_CANNOT_PIPE', 'Cannot pipe, not readable');
createErrorType('ERR_STREAM_WRITE_AFTER_END', 'write after end');
createErrorType('ERR_STREAM_NULL_VALUES', 'May not write null values to stream', TypeError);
createErrorType('ERR_UNKNOWN_ENCODING', function (arg) {
  return 'Unknown encoding: ' + arg;
}, TypeError);
createErrorType('ERR_STREAM_UNSHIFT_AFTER_END_EVENT', 'stream.unshift() after end event');
var codes_1 = codes;

var errorsBrowser = {
	codes: codes_1
};

var ERR_INVALID_OPT_VALUE = errorsBrowser.codes.ERR_INVALID_OPT_VALUE;

function highWaterMarkFrom(options, isDuplex, duplexKey) {
  return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
}

function getHighWaterMark$2(state, options, duplexKey, isDuplex) {
  var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);

  if (hwm != null) {
    if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
      var name = isDuplex ? duplexKey : 'highWaterMark';
      throw new ERR_INVALID_OPT_VALUE(name, hwm);
    }

    return Math.floor(hwm);
  } // Default value


  return state.objectMode ? 16 : 16 * 1024;
}

var state = {
  getHighWaterMark: getHighWaterMark$2
};

/**
 * Module exports.
 */

var browser$2 = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!commonjsGlobal.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = commonjsGlobal.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

var require$$2$1 = _stream_duplex;

var _stream_writable = Writable;
// there will be only 2 of these for each stream


function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;

  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/


var Duplex$2;
/*</replacement>*/

Writable.WritableState = WritableState;
/*<replacement>*/

var internalUtil = {
  deprecate: browser$2
};
/*</replacement>*/

/*<replacement>*/


/*</replacement>*/


var Buffer$5 = require$$0__default["default"].Buffer;

var OurUint8Array$1 = commonjsGlobal.Uint8Array || function () {};

function _uint8ArrayToBuffer$1(chunk) {
  return Buffer$5.from(chunk);
}

function _isUint8Array$1(obj) {
  return Buffer$5.isBuffer(obj) || obj instanceof OurUint8Array$1;
}



var getHighWaterMark$1 = state.getHighWaterMark;

var _require$codes$3 = errorsBrowser.codes,
    ERR_INVALID_ARG_TYPE$1 = _require$codes$3.ERR_INVALID_ARG_TYPE,
    ERR_METHOD_NOT_IMPLEMENTED$2 = _require$codes$3.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_MULTIPLE_CALLBACK$1 = _require$codes$3.ERR_MULTIPLE_CALLBACK,
    ERR_STREAM_CANNOT_PIPE = _require$codes$3.ERR_STREAM_CANNOT_PIPE,
    ERR_STREAM_DESTROYED$1 = _require$codes$3.ERR_STREAM_DESTROYED,
    ERR_STREAM_NULL_VALUES = _require$codes$3.ERR_STREAM_NULL_VALUES,
    ERR_STREAM_WRITE_AFTER_END = _require$codes$3.ERR_STREAM_WRITE_AFTER_END,
    ERR_UNKNOWN_ENCODING = _require$codes$3.ERR_UNKNOWN_ENCODING;

var errorOrDestroy$1 = destroy_1.errorOrDestroy;

inherits_browser(Writable, streamBrowser);

function nop$2() {}

function WritableState(options, stream, isDuplex) {
  Duplex$2 = Duplex$2 || require$$2$1;
  options = options || {}; // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream,
  // e.g. options.readableObjectMode vs. options.writableObjectMode, etc.

  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex$2; // object stream flag to indicate whether or not this stream
  // contains buffers or objects.

  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode; // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()

  this.highWaterMark = getHighWaterMark$1(this, options, 'writableHighWaterMark', isDuplex); // if _final has been called

  this.finalCalled = false; // drain event flag.

  this.needDrain = false; // at the start of calling end()

  this.ending = false; // when end() has been called, and returned

  this.ended = false; // when 'finish' is emitted

  this.finished = false; // has it been destroyed

  this.destroyed = false; // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.

  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode; // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.

  this.defaultEncoding = options.defaultEncoding || 'utf8'; // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.

  this.length = 0; // a flag to see when we're in the middle of a write.

  this.writing = false; // when true all writes will be buffered until .uncork() call

  this.corked = 0; // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.

  this.sync = true; // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.

  this.bufferProcessing = false; // the callback that's passed to _write(chunk,cb)

  this.onwrite = function (er) {
    onwrite(stream, er);
  }; // the callback that the user supplies to write(chunk,encoding,cb)


  this.writecb = null; // the amount that is being written when _write is called.

  this.writelen = 0;
  this.bufferedRequest = null;
  this.lastBufferedRequest = null; // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted

  this.pendingcb = 0; // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams

  this.prefinished = false; // True if the error was already emitted and should not be thrown again

  this.errorEmitted = false; // Should close be emitted on destroy. Defaults to true.

  this.emitClose = options.emitClose !== false; // Should .destroy() be called after 'finish' (and potentially 'end')

  this.autoDestroy = !!options.autoDestroy; // count buffered requests

  this.bufferedRequestCount = 0; // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two

  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];

  while (current) {
    out.push(current);
    current = current.next;
  }

  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function writableStateBufferGetter() {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})(); // Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.


var realHasInstance;

if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function value(object) {
      if (realHasInstance.call(this, object)) return true;
      if (this !== Writable) return false;
      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function realHasInstance(object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex$2 = Duplex$2 || require$$2$1; // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.
  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  // Checking for a Stream.Duplex instance is faster here instead of inside
  // the WritableState constructor, at least with V8 6.5

  var isDuplex = this instanceof Duplex$2;
  if (!isDuplex && !realHasInstance.call(Writable, this)) return new Writable(options);
  this._writableState = new WritableState(options, this, isDuplex); // legacy.

  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;
    if (typeof options.writev === 'function') this._writev = options.writev;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
    if (typeof options.final === 'function') this._final = options.final;
  }

  streamBrowser.call(this);
} // Otherwise people can pipe Writable streams, which is just wrong.


Writable.prototype.pipe = function () {
  errorOrDestroy$1(this, new ERR_STREAM_CANNOT_PIPE());
};

function writeAfterEnd(stream, cb) {
  var er = new ERR_STREAM_WRITE_AFTER_END(); // TODO: defer error events consistently everywhere, not just the cb

  errorOrDestroy$1(stream, er);
  process.nextTick(cb, er);
} // Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.


function validChunk(stream, state, chunk, cb) {
  var er;

  if (chunk === null) {
    er = new ERR_STREAM_NULL_VALUES();
  } else if (typeof chunk !== 'string' && !state.objectMode) {
    er = new ERR_INVALID_ARG_TYPE$1('chunk', ['string', 'Buffer'], chunk);
  }

  if (er) {
    errorOrDestroy$1(stream, er);
    process.nextTick(cb, er);
    return false;
  }

  return true;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  var isBuf = !state.objectMode && _isUint8Array$1(chunk);

  if (isBuf && !Buffer$5.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer$1(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;
  if (typeof cb !== 'function') cb = nop$2;
  if (state.ending) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }
  return ret;
};

Writable.prototype.cork = function () {
  this._writableState.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;
    if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new ERR_UNKNOWN_ENCODING(encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

Object.defineProperty(Writable.prototype, 'writableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState && this._writableState.getBuffer();
  }
});

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer$5.from(chunk, encoding);
  }

  return chunk;
}

Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
}); // if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.

function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);

    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }

  var len = state.objectMode ? 1 : chunk.length;
  state.length += len;
  var ret = state.length < state.highWaterMark; // we must ensure that previous needDrain will not be reset to false.

  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };

    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }

    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (state.destroyed) state.onwrite(new ERR_STREAM_DESTROYED$1('write'));else if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    process.nextTick(cb, er); // this can emit finish, and it will always happen
    // after error

    process.nextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    errorOrDestroy$1(stream, er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    errorOrDestroy$1(stream, er); // this can emit finish, but finish must
    // always follow error

    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;
  if (typeof cb !== 'function') throw new ERR_MULTIPLE_CALLBACK$1();
  onwriteStateUpdate(state);
  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state) || stream.destroyed;

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      process.nextTick(afterWrite, stream, state, finished, cb);
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
} // Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.


function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
} // if there's something in the buffer waiting, then process it


function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;
    var count = 0;
    var allBuffers = true;

    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }

    buffer.allBuffers = allBuffers;
    doWrite(stream, state, true, state.length, buffer, '', holder.finish); // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite

    state.pendingcb++;
    state.lastBufferedRequest = null;

    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }

    state.bufferedRequestCount = 0;
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;
      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      state.bufferedRequestCount--; // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.

      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new ERR_METHOD_NOT_IMPLEMENTED$2('_write()'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding); // .end() fully uncorks

  if (state.corked) {
    state.corked = 1;
    this.uncork();
  } // ignore unnecessary end() calls.


  if (!state.ending) endWritable(this, state, cb);
  return this;
};

Object.defineProperty(Writable.prototype, 'writableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.length;
  }
});

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}

function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;

    if (err) {
      errorOrDestroy$1(stream, err);
    }

    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}

function prefinish$1(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function' && !state.destroyed) {
      state.pendingcb++;
      state.finalCalled = true;
      process.nextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);

  if (need) {
    prefinish$1(stream, state);

    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');

      if (state.autoDestroy) {
        // In case of duplex streams we need a way to detect
        // if the readable side is ready for autoDestroy as well
        var rState = stream._readableState;

        if (!rState || rState.autoDestroy && rState.endEmitted) {
          stream.destroy();
        }
      }
    }
  }

  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);

  if (cb) {
    if (state.finished) process.nextTick(cb);else stream.once('finish', cb);
  }

  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;

  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  } // reuse the free corkReq.


  state.corkedRequestsFree.next = corkReq;
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._writableState === undefined) {
      return false;
    }

    return this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._writableState.destroyed = value;
  }
});
Writable.prototype.destroy = destroy_1.destroy;
Writable.prototype._undestroy = destroy_1.undestroy;

Writable.prototype._destroy = function (err, cb) {
  cb(err);
};

var require$$0$1 = _stream_readable;

/*<replacement>*/

var objectKeys = Object.keys || function (obj) {
  var keys = [];

  for (var key in obj) {
    keys.push(key);
  }

  return keys;
};
/*</replacement>*/


var _stream_duplex = Duplex$1;





inherits_browser(Duplex$1, require$$0$1);

{
  // Allow the keys array to be GC'ed.
  var keys$2 = objectKeys(_stream_writable.prototype);

  for (var v = 0; v < keys$2.length; v++) {
    var method = keys$2[v];
    if (!Duplex$1.prototype[method]) Duplex$1.prototype[method] = _stream_writable.prototype[method];
  }
}

function Duplex$1(options) {
  if (!(this instanceof Duplex$1)) return new Duplex$1(options);
  require$$0$1.call(this, options);
  _stream_writable.call(this, options);
  this.allowHalfOpen = true;

  if (options) {
    if (options.readable === false) this.readable = false;
    if (options.writable === false) this.writable = false;

    if (options.allowHalfOpen === false) {
      this.allowHalfOpen = false;
      this.once('end', onend);
    }
  }
}

Object.defineProperty(Duplex$1.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
});
Object.defineProperty(Duplex$1.prototype, 'writableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState && this._writableState.getBuffer();
  }
});
Object.defineProperty(Duplex$1.prototype, 'writableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.length;
  }
}); // the no-half-open enforcer

function onend() {
  // If the writable side ended, then we're ok.
  if (this._writableState.ended) return; // no more data can be written.
  // But allow more writes to happen in this tick.

  process.nextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex$1.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }

    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});

/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */

var safeBuffer = createCommonjsModule(function (module, exports) {
/* eslint-disable node/no-deprecated-api */

var Buffer = require$$0__default["default"].Buffer;

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key];
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = require$$0__default["default"];
} else {
  // Copy properties from require('buffer')
  copyProps(require$$0__default["default"], exports);
  exports.Buffer = SafeBuffer;
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.prototype = Object.create(Buffer.prototype);

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer);

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
};

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size);
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding);
    } else {
      buf.fill(fill);
    }
  } else {
    buf.fill(0);
  }
  return buf
};

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
};

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return require$$0__default["default"].SlowBuffer(size)
};
});

/*<replacement>*/

var Buffer$4 = safeBuffer.Buffer;
/*</replacement>*/

var isEncoding = Buffer$4.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
}
// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer$4.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
var StringDecoder_1$1 = StringDecoder$3;
function StringDecoder$3(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer$4.allocUnsafe(nb);
}

StringDecoder$3.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder$3.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder$3.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder$3.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd';
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd';
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}

var string_decoder = {
	StringDecoder: StringDecoder_1$1
};

var ERR_STREAM_PREMATURE_CLOSE = errorsBrowser.codes.ERR_STREAM_PREMATURE_CLOSE;

function once$1(callback) {
  var called = false;
  return function () {
    if (called) return;
    called = true;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    callback.apply(this, args);
  };
}

function noop$2() {}

function isRequest$1(stream) {
  return stream.setHeader && typeof stream.abort === 'function';
}

function eos$1(stream, opts, callback) {
  if (typeof opts === 'function') return eos$1(stream, null, opts);
  if (!opts) opts = {};
  callback = once$1(callback || noop$2);
  var readable = opts.readable || opts.readable !== false && stream.readable;
  var writable = opts.writable || opts.writable !== false && stream.writable;

  var onlegacyfinish = function onlegacyfinish() {
    if (!stream.writable) onfinish();
  };

  var writableEnded = stream._writableState && stream._writableState.finished;

  var onfinish = function onfinish() {
    writable = false;
    writableEnded = true;
    if (!readable) callback.call(stream);
  };

  var readableEnded = stream._readableState && stream._readableState.endEmitted;

  var onend = function onend() {
    readable = false;
    readableEnded = true;
    if (!writable) callback.call(stream);
  };

  var onerror = function onerror(err) {
    callback.call(stream, err);
  };

  var onclose = function onclose() {
    var err;

    if (readable && !readableEnded) {
      if (!stream._readableState || !stream._readableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
      return callback.call(stream, err);
    }

    if (writable && !writableEnded) {
      if (!stream._writableState || !stream._writableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
      return callback.call(stream, err);
    }
  };

  var onrequest = function onrequest() {
    stream.req.on('finish', onfinish);
  };

  if (isRequest$1(stream)) {
    stream.on('complete', onfinish);
    stream.on('abort', onclose);
    if (stream.req) onrequest();else stream.on('request', onrequest);
  } else if (writable && !stream._writableState) {
    // legacy streams
    stream.on('end', onlegacyfinish);
    stream.on('close', onlegacyfinish);
  }

  stream.on('end', onend);
  stream.on('finish', onfinish);
  if (opts.error !== false) stream.on('error', onerror);
  stream.on('close', onclose);
  return function () {
    stream.removeListener('complete', onfinish);
    stream.removeListener('abort', onclose);
    stream.removeListener('request', onrequest);
    if (stream.req) stream.req.removeListener('finish', onfinish);
    stream.removeListener('end', onlegacyfinish);
    stream.removeListener('close', onlegacyfinish);
    stream.removeListener('finish', onfinish);
    stream.removeListener('end', onend);
    stream.removeListener('error', onerror);
    stream.removeListener('close', onclose);
  };
}

var endOfStream = eos$1;

var _Object$setPrototypeO;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var kLastResolve = Symbol('lastResolve');
var kLastReject = Symbol('lastReject');
var kError = Symbol('error');
var kEnded = Symbol('ended');
var kLastPromise = Symbol('lastPromise');
var kHandlePromise = Symbol('handlePromise');
var kStream = Symbol('stream');

function createIterResult(value, done) {
  return {
    value: value,
    done: done
  };
}

function readAndResolve(iter) {
  var resolve = iter[kLastResolve];

  if (resolve !== null) {
    var data = iter[kStream].read(); // we defer if data is null
    // we can be expecting either 'end' or
    // 'error'

    if (data !== null) {
      iter[kLastPromise] = null;
      iter[kLastResolve] = null;
      iter[kLastReject] = null;
      resolve(createIterResult(data, false));
    }
  }
}

function onReadable(iter) {
  // we wait for the next tick, because it might
  // emit an error with process.nextTick
  process.nextTick(readAndResolve, iter);
}

function wrapForNext(lastPromise, iter) {
  return function (resolve, reject) {
    lastPromise.then(function () {
      if (iter[kEnded]) {
        resolve(createIterResult(undefined, true));
        return;
      }

      iter[kHandlePromise](resolve, reject);
    }, reject);
  };
}

var AsyncIteratorPrototype = Object.getPrototypeOf(function () {});
var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
  get stream() {
    return this[kStream];
  },

  next: function next() {
    var _this = this;

    // if we have detected an error in the meanwhile
    // reject straight away
    var error = this[kError];

    if (error !== null) {
      return Promise.reject(error);
    }

    if (this[kEnded]) {
      return Promise.resolve(createIterResult(undefined, true));
    }

    if (this[kStream].destroyed) {
      // We need to defer via nextTick because if .destroy(err) is
      // called, the error will be emitted via nextTick, and
      // we cannot guarantee that there is no error lingering around
      // waiting to be emitted.
      return new Promise(function (resolve, reject) {
        process.nextTick(function () {
          if (_this[kError]) {
            reject(_this[kError]);
          } else {
            resolve(createIterResult(undefined, true));
          }
        });
      });
    } // if we have multiple next() calls
    // we will wait for the previous Promise to finish
    // this logic is optimized to support for await loops,
    // where next() is only called once at a time


    var lastPromise = this[kLastPromise];
    var promise;

    if (lastPromise) {
      promise = new Promise(wrapForNext(lastPromise, this));
    } else {
      // fast path needed to support multiple this.push()
      // without triggering the next() queue
      var data = this[kStream].read();

      if (data !== null) {
        return Promise.resolve(createIterResult(data, false));
      }

      promise = new Promise(this[kHandlePromise]);
    }

    this[kLastPromise] = promise;
    return promise;
  }
}, _defineProperty(_Object$setPrototypeO, Symbol.asyncIterator, function () {
  return this;
}), _defineProperty(_Object$setPrototypeO, "return", function _return() {
  var _this2 = this;

  // destroy(err, cb) is a private API
  // we can guarantee we have that here, because we control the
  // Readable class this is attached to
  return new Promise(function (resolve, reject) {
    _this2[kStream].destroy(null, function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve(createIterResult(undefined, true));
    });
  });
}), _Object$setPrototypeO), AsyncIteratorPrototype);

var createReadableStreamAsyncIterator$1 = function createReadableStreamAsyncIterator(stream) {
  var _Object$create;

  var iterator = Object.create(ReadableStreamAsyncIteratorPrototype, (_Object$create = {}, _defineProperty(_Object$create, kStream, {
    value: stream,
    writable: true
  }), _defineProperty(_Object$create, kLastResolve, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kLastReject, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kError, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kEnded, {
    value: stream._readableState.endEmitted,
    writable: true
  }), _defineProperty(_Object$create, kHandlePromise, {
    value: function value(resolve, reject) {
      var data = iterator[kStream].read();

      if (data) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        resolve(createIterResult(data, false));
      } else {
        iterator[kLastResolve] = resolve;
        iterator[kLastReject] = reject;
      }
    },
    writable: true
  }), _Object$create));
  iterator[kLastPromise] = null;
  endOfStream(stream, function (err) {
    if (err && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
      var reject = iterator[kLastReject]; // reject if we are waiting for data in the Promise
      // returned by next() and store the error

      if (reject !== null) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        reject(err);
      }

      iterator[kError] = err;
      return;
    }

    var resolve = iterator[kLastResolve];

    if (resolve !== null) {
      iterator[kLastPromise] = null;
      iterator[kLastResolve] = null;
      iterator[kLastReject] = null;
      resolve(createIterResult(undefined, true));
    }

    iterator[kEnded] = true;
  });
  stream.on('readable', onReadable.bind(null, iterator));
  return iterator;
};

var async_iterator = createReadableStreamAsyncIterator$1;

var fromBrowser = function () {
  throw new Error('Readable.from is not available in the browser')
};

var _stream_readable = Readable$1;
/*<replacement>*/

var Duplex;
/*</replacement>*/

Readable$1.ReadableState = ReadableState;
/*<replacement>*/

require$$0__default$1["default"].EventEmitter;

var EElistenerCount = function EElistenerCount(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/



/*</replacement>*/


var Buffer$3 = require$$0__default["default"].Buffer;

var OurUint8Array = commonjsGlobal.Uint8Array || function () {};

function _uint8ArrayToBuffer(chunk) {
  return Buffer$3.from(chunk);
}

function _isUint8Array(obj) {
  return Buffer$3.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*<replacement>*/




var debug;

if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function debug() {};
}
/*</replacement>*/






var getHighWaterMark = state.getHighWaterMark;

var _require$codes$2 = errorsBrowser.codes,
    ERR_INVALID_ARG_TYPE = _require$codes$2.ERR_INVALID_ARG_TYPE,
    ERR_STREAM_PUSH_AFTER_EOF = _require$codes$2.ERR_STREAM_PUSH_AFTER_EOF,
    ERR_METHOD_NOT_IMPLEMENTED$1 = _require$codes$2.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes$2.ERR_STREAM_UNSHIFT_AFTER_END_EVENT; // Lazy loaded to improve the startup performance.


var StringDecoder$2;
var createReadableStreamAsyncIterator;
var from$2;

inherits_browser(Readable$1, streamBrowser);

var errorOrDestroy = destroy_1.errorOrDestroy;
var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn); // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.

  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (Array.isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}

function ReadableState(options, stream, isDuplex) {
  Duplex = Duplex || require$$2$1;
  options = options || {}; // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.

  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex; // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away

  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode; // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"

  this.highWaterMark = getHighWaterMark(this, options, 'readableHighWaterMark', isDuplex); // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()

  this.buffer = new buffer_list();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false; // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.

  this.sync = true; // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.

  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;
  this.paused = true; // Should close be emitted on destroy. Defaults to true.

  this.emitClose = options.emitClose !== false; // Should .destroy() be called after 'end' (and potentially 'finish')

  this.autoDestroy = !!options.autoDestroy; // has it been destroyed

  this.destroyed = false; // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.

  this.defaultEncoding = options.defaultEncoding || 'utf8'; // the number of writers that are awaiting a drain event in .pipe()s

  this.awaitDrain = 0; // if true, a maybeReadMore has been scheduled

  this.readingMore = false;
  this.decoder = null;
  this.encoding = null;

  if (options.encoding) {
    if (!StringDecoder$2) StringDecoder$2 = string_decoder.StringDecoder;
    this.decoder = new StringDecoder$2(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable$1(options) {
  Duplex = Duplex || require$$2$1;
  if (!(this instanceof Readable$1)) return new Readable$1(options); // Checking for a Stream.Duplex instance is faster here instead of inside
  // the ReadableState constructor, at least with V8 6.5

  var isDuplex = this instanceof Duplex;
  this._readableState = new ReadableState(options, this, isDuplex); // legacy

  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  streamBrowser.call(this);
}

Object.defineProperty(Readable$1.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._readableState === undefined) {
      return false;
    }

    return this._readableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._readableState.destroyed = value;
  }
});
Readable$1.prototype.destroy = destroy_1.destroy;
Readable$1.prototype._undestroy = destroy_1.undestroy;

Readable$1.prototype._destroy = function (err, cb) {
  cb(err);
}; // Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.


Readable$1.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;

      if (encoding !== state.encoding) {
        chunk = Buffer$3.from(chunk, encoding);
        encoding = '';
      }

      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
}; // Unshift should *always* be something directly out of read()


Readable$1.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  debug('readableAddChunk', chunk);
  var state = stream._readableState;

  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);

    if (er) {
      errorOrDestroy(stream, er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer$3.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
      } else if (state.destroyed) {
        return false;
      } else {
        state.reading = false;

        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
      maybeReadMore(stream, state);
    }
  } // We can push more data if we are below the highWaterMark.
  // Also, if we have no data yet, we can stand some more bytes.
  // This is to work around cases where hwm=0, such as the repl.


  return !state.ended && (state.length < state.highWaterMark || state.length === 0);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    state.awaitDrain = 0;
    stream.emit('data', chunk);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);
    if (state.needReadable) emitReadable(stream);
  }

  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;

  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer', 'Uint8Array'], chunk);
  }

  return er;
}

Readable$1.prototype.isPaused = function () {
  return this._readableState.flowing === false;
}; // backwards compatibility.


Readable$1.prototype.setEncoding = function (enc) {
  if (!StringDecoder$2) StringDecoder$2 = string_decoder.StringDecoder;
  var decoder = new StringDecoder$2(enc);
  this._readableState.decoder = decoder; // If setEncoding(null), decoder.encoding equals utf8

  this._readableState.encoding = this._readableState.decoder.encoding; // Iterate over current buffer to convert already stored Buffers:

  var p = this._readableState.buffer.head;
  var content = '';

  while (p !== null) {
    content += decoder.write(p.data);
    p = p.next;
  }

  this._readableState.buffer.clear();

  if (content !== '') this._readableState.buffer.push(content);
  this._readableState.length = content.length;
  return this;
}; // Don't raise the hwm > 1GB


var MAX_HWM = 0x40000000;

function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    // TODO(ronag): Throw ERR_VALUE_OUT_OF_RANGE.
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }

  return n;
} // This function is designed to be inlinable, so please take care when making
// changes to the function body.


function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;

  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  } // If we're asking for more than the current hwm, then raise the hwm.


  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n; // Don't have enough

  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }

  return state.length;
} // you can override either this method, or the async _read(n) below.


Readable$1.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;
  if (n !== 0) state.emittedReadable = false; // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.

  if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state); // if we've ended, and we're now clear, then finish it up.

  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  } // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.
  // if we need a readable event, then we need to do some reading.


  var doRead = state.needReadable;
  debug('need readable', doRead); // if we currently have less than the highWaterMark, then also read some

  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  } // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.


  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true; // if the length is currently zero, then we *need* a readable event.

    if (state.length === 0) state.needReadable = true; // call internal read method

    this._read(state.highWaterMark);

    state.sync = false; // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.

    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = state.length <= state.highWaterMark;
    n = 0;
  } else {
    state.length -= n;
    state.awaitDrain = 0;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true; // If we tried to read() past the EOF, then emit end on the next tick.

    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);
  return ret;
};

function onEofChunk(stream, state) {
  debug('onEofChunk');
  if (state.ended) return;

  if (state.decoder) {
    var chunk = state.decoder.end();

    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }

  state.ended = true;

  if (state.sync) {
    // if we are sync, wait until next tick to emit the data.
    // Otherwise we risk emitting data in the flow()
    // the readable code triggers during a read() call
    emitReadable(stream);
  } else {
    // emit 'readable' now to make sure it gets picked up.
    state.needReadable = false;

    if (!state.emittedReadable) {
      state.emittedReadable = true;
      emitReadable_(stream);
    }
  }
} // Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.


function emitReadable(stream) {
  var state = stream._readableState;
  debug('emitReadable', state.needReadable, state.emittedReadable);
  state.needReadable = false;

  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    process.nextTick(emitReadable_, stream);
  }
}

function emitReadable_(stream) {
  var state = stream._readableState;
  debug('emitReadable_', state.destroyed, state.length, state.ended);

  if (!state.destroyed && (state.length || state.ended)) {
    stream.emit('readable');
    state.emittedReadable = false;
  } // The stream needs another readable event if
  // 1. It is not flowing, as the flow mechanism will take
  //    care of it.
  // 2. It is not ended.
  // 3. It is below the highWaterMark, so we can schedule
  //    another readable later.


  state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
  flow(stream);
} // at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.


function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    process.nextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  // Attempt to read more data if we should.
  //
  // The conditions for reading more data are (one of):
  // - Not enough data buffered (state.length < state.highWaterMark). The loop
  //   is responsible for filling the buffer with enough data if such data
  //   is available. If highWaterMark is 0 and we are not in the flowing mode
  //   we should _not_ attempt to buffer any extra data. We'll get more data
  //   when the stream consumer calls read() instead.
  // - No data in the buffer, and the stream is in flowing mode. In this mode
  //   the loop below is responsible for ensuring read() is called. Failing to
  //   call read here would abort the flow and there's no other mechanism for
  //   continuing the flow if the stream consumer has just subscribed to the
  //   'data' event.
  //
  // In addition to the above conditions to keep reading data, the following
  // conditions prevent the data from being read:
  // - The stream has ended (state.ended).
  // - There is already a pending 'read' operation (state.reading). This is a
  //   case where the the stream has called the implementation defined _read()
  //   method, but they are processing the call asynchronously and have _not_
  //   called push() with new data. In this case we skip performing more
  //   read()s. The execution ends in this method again after the _read() ends
  //   up calling push() with more data.
  while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
    var len = state.length;
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length) // didn't get any data, stop spinning.
      break;
  }

  state.readingMore = false;
} // abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.


Readable$1.prototype._read = function (n) {
  errorOrDestroy(this, new ERR_METHOD_NOT_IMPLEMENTED$1('_read()'));
};

Readable$1.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;

    case 1:
      state.pipes = [state.pipes, dest];
      break;

    default:
      state.pipes.push(dest);
      break;
  }

  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) process.nextTick(endFn);else src.once('end', endFn);
  dest.on('unpipe', onunpipe);

  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');

    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  } // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.


  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);
  var cleanedUp = false;

  function cleanup() {
    debug('cleanup'); // cleanup event handlers once the pipe is broken

    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);
    cleanedUp = true; // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.

    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  src.on('data', ondata);

  function ondata(chunk) {
    debug('ondata');
    var ret = dest.write(chunk);
    debug('dest.write', ret);

    if (ret === false) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', state.awaitDrain);
        state.awaitDrain++;
      }

      src.pause();
    }
  } // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.


  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) errorOrDestroy(dest, er);
  } // Make sure our error handler is attached before userland ones.


  prependListener(dest, 'error', onerror); // Both close and finish should trigger unpipe, but only once.

  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }

  dest.once('close', onclose);

  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }

  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  } // tell the dest that it's being piped to


  dest.emit('pipe', src); // start the flow if it hasn't been started already.

  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function pipeOnDrainFunctionResult() {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;

    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable$1.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = {
    hasUnpiped: false
  }; // if we're not piping anywhere, then do nothing.

  if (state.pipesCount === 0) return this; // just one destination.  most common case.

  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;
    if (!dest) dest = state.pipes; // got a match.

    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  } // slow case. multiple pipe destinations.


  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, {
        hasUnpiped: false
      });
    }

    return this;
  } // try to find the right one.


  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;
  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];
  dest.emit('unpipe', this, unpipeInfo);
  return this;
}; // set up data events if they are asked for
// Ensure readable listeners eventually get something


Readable$1.prototype.on = function (ev, fn) {
  var res = streamBrowser.prototype.on.call(this, ev, fn);
  var state = this._readableState;

  if (ev === 'data') {
    // update readableListening so that resume() may be a no-op
    // a few lines down. This is needed to support once('readable').
    state.readableListening = this.listenerCount('readable') > 0; // Try start flowing on next tick if stream isn't explicitly paused

    if (state.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.flowing = false;
      state.emittedReadable = false;
      debug('on readable', state.length, state.reading);

      if (state.length) {
        emitReadable(this);
      } else if (!state.reading) {
        process.nextTick(nReadingNextTick, this);
      }
    }
  }

  return res;
};

Readable$1.prototype.addListener = Readable$1.prototype.on;

Readable$1.prototype.removeListener = function (ev, fn) {
  var res = streamBrowser.prototype.removeListener.call(this, ev, fn);

  if (ev === 'readable') {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    process.nextTick(updateReadableListening, this);
  }

  return res;
};

Readable$1.prototype.removeAllListeners = function (ev) {
  var res = streamBrowser.prototype.removeAllListeners.apply(this, arguments);

  if (ev === 'readable' || ev === undefined) {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    process.nextTick(updateReadableListening, this);
  }

  return res;
};

function updateReadableListening(self) {
  var state = self._readableState;
  state.readableListening = self.listenerCount('readable') > 0;

  if (state.resumeScheduled && !state.paused) {
    // flowing needs to be set to true now, otherwise
    // the upcoming resume will not flow.
    state.flowing = true; // crude way to check if we should resume
  } else if (self.listenerCount('data') > 0) {
    self.resume();
  }
}

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
} // pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.


Readable$1.prototype.resume = function () {
  var state = this._readableState;

  if (!state.flowing) {
    debug('resume'); // we flow only if there is no one listening
    // for readable, but we still have to call
    // resume()

    state.flowing = !state.readableListening;
    resume(this, state);
  }

  state.paused = false;
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    process.nextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  debug('resume', state.reading);

  if (!state.reading) {
    stream.read(0);
  }

  state.resumeScheduled = false;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable$1.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);

  if (this._readableState.flowing !== false) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }

  this._readableState.paused = true;
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);

  while (state.flowing && stream.read() !== null) {
  }
} // wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.


Readable$1.prototype.wrap = function (stream) {
  var _this = this;

  var state = this._readableState;
  var paused = false;
  stream.on('end', function () {
    debug('wrapped end');

    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) _this.push(chunk);
    }

    _this.push(null);
  });
  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk); // don't skip over falsy values in objectMode

    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = _this.push(chunk);

    if (!ret) {
      paused = true;
      stream.pause();
    }
  }); // proxy all the other methods.
  // important when wrapping filters and duplexes.

  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function methodWrap(method) {
        return function methodWrapReturnFunction() {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  } // proxy certain important events.


  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
  } // when we try to consume some more bytes, simply unpause the
  // underlying stream.


  this._read = function (n) {
    debug('wrapped _read', n);

    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return this;
};

if (typeof Symbol === 'function') {
  Readable$1.prototype[Symbol.asyncIterator] = function () {
    if (createReadableStreamAsyncIterator === undefined) {
      createReadableStreamAsyncIterator = async_iterator;
    }

    return createReadableStreamAsyncIterator(this);
  };
}

Object.defineProperty(Readable$1.prototype, 'readableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.highWaterMark;
  }
});
Object.defineProperty(Readable$1.prototype, 'readableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState && this._readableState.buffer;
  }
});
Object.defineProperty(Readable$1.prototype, 'readableFlowing', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.flowing;
  },
  set: function set(state) {
    if (this._readableState) {
      this._readableState.flowing = state;
    }
  }
}); // exposed for testing purposes only.

Readable$1._fromList = fromList;
Object.defineProperty(Readable$1.prototype, 'readableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.length;
  }
}); // Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.

function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;
  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.first();else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = state.buffer.consume(n, state.decoder);
  }
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;
  debug('endReadable', state.endEmitted);

  if (!state.endEmitted) {
    state.ended = true;
    process.nextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  debug('endReadableNT', state.endEmitted, state.length); // Check that we didn't get one last unshift.

  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');

    if (state.autoDestroy) {
      // In case of duplex streams we need a way to detect
      // if the writable side is ready for autoDestroy as well
      var wState = stream._writableState;

      if (!wState || wState.autoDestroy && wState.finished) {
        stream.destroy();
      }
    }
  }
}

if (typeof Symbol === 'function') {
  Readable$1.from = function (iterable, opts) {
    if (from$2 === undefined) {
      from$2 = fromBrowser;
    }

    return from$2(Readable$1, iterable, opts);
  };
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }

  return -1;
}

var _stream_transform = Transform;

var _require$codes$1 = errorsBrowser.codes,
    ERR_METHOD_NOT_IMPLEMENTED = _require$codes$1.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_MULTIPLE_CALLBACK = _require$codes$1.ERR_MULTIPLE_CALLBACK,
    ERR_TRANSFORM_ALREADY_TRANSFORMING = _require$codes$1.ERR_TRANSFORM_ALREADY_TRANSFORMING,
    ERR_TRANSFORM_WITH_LENGTH_0 = _require$codes$1.ERR_TRANSFORM_WITH_LENGTH_0;



inherits_browser(Transform, require$$2$1);

function afterTransform(er, data) {
  var ts = this._transformState;
  ts.transforming = false;
  var cb = ts.writecb;

  if (cb === null) {
    return this.emit('error', new ERR_MULTIPLE_CALLBACK());
  }

  ts.writechunk = null;
  ts.writecb = null;
  if (data != null) // single equals check for both `null` and `undefined`
    this.push(data);
  cb(er);
  var rs = this._readableState;
  rs.reading = false;

  if (rs.needReadable || rs.length < rs.highWaterMark) {
    this._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);
  require$$2$1.call(this, options);
  this._transformState = {
    afterTransform: afterTransform.bind(this),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    writeencoding: null
  }; // start out asking for a readable event once data is transformed.

  this._readableState.needReadable = true; // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.

  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;
    if (typeof options.flush === 'function') this._flush = options.flush;
  } // When the writable side finishes, then flush out anything remaining.


  this.on('prefinish', prefinish);
}

function prefinish() {
  var _this = this;

  if (typeof this._flush === 'function' && !this._readableState.destroyed) {
    this._flush(function (er, data) {
      done(_this, er, data);
    });
  } else {
    done(this, null, null);
  }
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return require$$2$1.prototype.push.call(this, chunk, encoding);
}; // This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.


Transform.prototype._transform = function (chunk, encoding, cb) {
  cb(new ERR_METHOD_NOT_IMPLEMENTED('_transform()'));
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;

  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
}; // Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.


Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && !ts.transforming) {
    ts.transforming = true;

    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform.prototype._destroy = function (err, cb) {
  require$$2$1.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);
  if (data != null) // single equals check for both `null` and `undefined`
    stream.push(data); // TODO(BridgeAR): Write a test for these two error cases
  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided

  if (stream._writableState.length) throw new ERR_TRANSFORM_WITH_LENGTH_0();
  if (stream._transformState.transforming) throw new ERR_TRANSFORM_ALREADY_TRANSFORMING();
  return stream.push(null);
}

var _stream_passthrough = PassThrough;



inherits_browser(PassThrough, _stream_transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);
  _stream_transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};

var eos;

function once(callback) {
  var called = false;
  return function () {
    if (called) return;
    called = true;
    callback.apply(void 0, arguments);
  };
}

var _require$codes = errorsBrowser.codes,
    ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS,
    ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;

function noop$1(err) {
  // Rethrow the error if it exists to avoid swallowing it
  if (err) throw err;
}

function isRequest(stream) {
  return stream.setHeader && typeof stream.abort === 'function';
}

function destroyer(stream, reading, writing, callback) {
  callback = once(callback);
  var closed = false;
  stream.on('close', function () {
    closed = true;
  });
  if (eos === undefined) eos = endOfStream;
  eos(stream, {
    readable: reading,
    writable: writing
  }, function (err) {
    if (err) return callback(err);
    closed = true;
    callback();
  });
  var destroyed = false;
  return function (err) {
    if (closed) return;
    if (destroyed) return;
    destroyed = true; // request.destroy just do .end - .abort is what we want

    if (isRequest(stream)) return stream.abort();
    if (typeof stream.destroy === 'function') return stream.destroy();
    callback(err || new ERR_STREAM_DESTROYED('pipe'));
  };
}

function call(fn) {
  fn();
}

function pipe(from, to) {
  return from.pipe(to);
}

function popCallback(streams) {
  if (!streams.length) return noop$1;
  if (typeof streams[streams.length - 1] !== 'function') return noop$1;
  return streams.pop();
}

function pipeline() {
  for (var _len = arguments.length, streams = new Array(_len), _key = 0; _key < _len; _key++) {
    streams[_key] = arguments[_key];
  }

  var callback = popCallback(streams);
  if (Array.isArray(streams[0])) streams = streams[0];

  if (streams.length < 2) {
    throw new ERR_MISSING_ARGS('streams');
  }

  var error;
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1;
    var writing = i > 0;
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err;
      if (err) destroys.forEach(call);
      if (reading) return;
      destroys.forEach(call);
      callback(error);
    });
  });
  return streams.reduce(pipe);
}

var pipeline_1 = pipeline;

var readableBrowser = createCommonjsModule(function (module, exports) {
exports = module.exports = require$$0$1;
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = _stream_writable;
exports.Duplex = require$$2$1;
exports.Transform = _stream_transform;
exports.PassThrough = _stream_passthrough;
exports.finished = endOfStream;
exports.pipeline = pipeline_1;
});

var Readable = readableBrowser.Readable;


var levelIteratorStream = ReadStream;
inherits_browser(ReadStream, Readable);

function ReadStream (iterator, options) {
  if (!(this instanceof ReadStream)) return new ReadStream(iterator, options)
  options = options || {};
  Readable.call(this, immutable(options, {
    objectMode: true
  }));
  this._iterator = iterator;
  this._options = options;
  this.on('end', this.destroy.bind(this, null, null));
}

ReadStream.prototype._read = function () {
  var self = this;
  var options = this._options;
  if (this.destroyed) return

  this._iterator.next(function (err, key, value) {
    if (self.destroyed) return
    if (err) return self.destroy(err)

    if (key === undefined && value === undefined) {
      self.push(null);
    } else if (options.keys !== false && options.values === false) {
      self.push(key);
    } else if (options.keys === false && options.values !== false) {
      self.push(value);
    } else {
      self.push({ key: key, value: value });
    }
  });
};

ReadStream.prototype._destroy = function (err, callback) {
  this._iterator.end(function (err2) {
    callback(err || err2);
  });
};

/*!
  * prr
  * (c) 2013 Rod Vagg <rod@vagg.org>
  * https://github.com/rvagg/prr
  * License: MIT
  */

var prr = createCommonjsModule(function (module) {
(function (name, context, definition) {
  if (module.exports)
    module.exports = definition();
  else
    context[name] = definition();
})('prr', commonjsGlobal, function() {

  var setProperty = typeof Object.defineProperty == 'function'
      ? function (obj, key, options) {
          Object.defineProperty(obj, key, options);
          return obj
        }
      : function (obj, key, options) { // < es5
          obj[key] = options.value;
          return obj
        }

    , makeOptions = function (value, options) {
        var oo = typeof options == 'object'
          , os = !oo && typeof options == 'string'
          , op = function (p) {
              return oo
                ? !!options[p]
                : os
                  ? options.indexOf(p[0]) > -1
                  : false
            };

        return {
            enumerable   : op('enumerable')
          , configurable : op('configurable')
          , writable     : op('writable')
          , value        : value
        }
      }

    , prr = function (obj, key, value, options) {
        var k;

        options = makeOptions(value, options);

        if (typeof key == 'object') {
          for (k in key) {
            if (Object.hasOwnProperty.call(key, k)) {
              options.value = key[k];
              setProperty(obj, k, options);
            }
          }
          return obj
        }

        return setProperty(obj, key, options)
      };

  return prr
});
});

function init (type, message, cause) {
  if (!!message && typeof message != 'string') {
    message = message.message || message.name;
  }
  prr(this, {
      type    : type
    , name    : type
      // can be passed just a 'cause'
    , cause   : typeof message != 'string' ? message : cause
    , message : message
  }, 'ewr');
}

// generic prototype, not intended to be actually used - helpful for `instanceof`
function CustomError (message, cause) {
  Error.call(this);
  if (Error.captureStackTrace)
    Error.captureStackTrace(this, this.constructor);
  init.call(this, 'CustomError', message, cause);
}

CustomError.prototype = new Error();

function createError$1 (errno, type, proto) {
  var err = function (message, cause) {
    init.call(this, type, message, cause);
    //TODO: the specificity here is stupid, errno should be available everywhere
    if (type == 'FilesystemError') {
      this.code    = this.cause.code;
      this.path    = this.cause.path;
      this.errno   = this.cause.errno;
      this.message =
        (errno.errno[this.cause.errno]
          ? errno.errno[this.cause.errno].description
          : this.cause.message)
        + (this.cause.path ? ' [' + this.cause.path + ']' : '');
    }
    Error.call(this);
    if (Error.captureStackTrace)
      Error.captureStackTrace(this, err);
  };
  err.prototype = !!proto ? new proto() : new CustomError();
  return err
}

var custom = function (errno) {
  var ce = function (type, proto) {
    return createError$1(errno, type, proto)
  };
  return {
      CustomError     : CustomError
    , FilesystemError : ce('FilesystemError')
    , createError     : ce
  }
};

var errno = createCommonjsModule(function (module) {
var all = module.exports.all = [
  {
    errno: -2,
    code: 'ENOENT',
    description: 'no such file or directory'
  },
  {
    errno: -1,
    code: 'UNKNOWN',
    description: 'unknown error'
  },
  {
    errno: 0,
    code: 'OK',
    description: 'success'
  },
  {
    errno: 1,
    code: 'EOF',
    description: 'end of file'
  },
  {
    errno: 2,
    code: 'EADDRINFO',
    description: 'getaddrinfo error'
  },
  {
    errno: 3,
    code: 'EACCES',
    description: 'permission denied'
  },
  {
    errno: 4,
    code: 'EAGAIN',
    description: 'resource temporarily unavailable'
  },
  {
    errno: 5,
    code: 'EADDRINUSE',
    description: 'address already in use'
  },
  {
    errno: 6,
    code: 'EADDRNOTAVAIL',
    description: 'address not available'
  },
  {
    errno: 7,
    code: 'EAFNOSUPPORT',
    description: 'address family not supported'
  },
  {
    errno: 8,
    code: 'EALREADY',
    description: 'connection already in progress'
  },
  {
    errno: 9,
    code: 'EBADF',
    description: 'bad file descriptor'
  },
  {
    errno: 10,
    code: 'EBUSY',
    description: 'resource busy or locked'
  },
  {
    errno: 11,
    code: 'ECONNABORTED',
    description: 'software caused connection abort'
  },
  {
    errno: 12,
    code: 'ECONNREFUSED',
    description: 'connection refused'
  },
  {
    errno: 13,
    code: 'ECONNRESET',
    description: 'connection reset by peer'
  },
  {
    errno: 14,
    code: 'EDESTADDRREQ',
    description: 'destination address required'
  },
  {
    errno: 15,
    code: 'EFAULT',
    description: 'bad address in system call argument'
  },
  {
    errno: 16,
    code: 'EHOSTUNREACH',
    description: 'host is unreachable'
  },
  {
    errno: 17,
    code: 'EINTR',
    description: 'interrupted system call'
  },
  {
    errno: 18,
    code: 'EINVAL',
    description: 'invalid argument'
  },
  {
    errno: 19,
    code: 'EISCONN',
    description: 'socket is already connected'
  },
  {
    errno: 20,
    code: 'EMFILE',
    description: 'too many open files'
  },
  {
    errno: 21,
    code: 'EMSGSIZE',
    description: 'message too long'
  },
  {
    errno: 22,
    code: 'ENETDOWN',
    description: 'network is down'
  },
  {
    errno: 23,
    code: 'ENETUNREACH',
    description: 'network is unreachable'
  },
  {
    errno: 24,
    code: 'ENFILE',
    description: 'file table overflow'
  },
  {
    errno: 25,
    code: 'ENOBUFS',
    description: 'no buffer space available'
  },
  {
    errno: 26,
    code: 'ENOMEM',
    description: 'not enough memory'
  },
  {
    errno: 27,
    code: 'ENOTDIR',
    description: 'not a directory'
  },
  {
    errno: 28,
    code: 'EISDIR',
    description: 'illegal operation on a directory'
  },
  {
    errno: 29,
    code: 'ENONET',
    description: 'machine is not on the network'
  },
  {
    errno: 31,
    code: 'ENOTCONN',
    description: 'socket is not connected'
  },
  {
    errno: 32,
    code: 'ENOTSOCK',
    description: 'socket operation on non-socket'
  },
  {
    errno: 33,
    code: 'ENOTSUP',
    description: 'operation not supported on socket'
  },
  {
    errno: 34,
    code: 'ENOENT',
    description: 'no such file or directory'
  },
  {
    errno: 35,
    code: 'ENOSYS',
    description: 'function not implemented'
  },
  {
    errno: 36,
    code: 'EPIPE',
    description: 'broken pipe'
  },
  {
    errno: 37,
    code: 'EPROTO',
    description: 'protocol error'
  },
  {
    errno: 38,
    code: 'EPROTONOSUPPORT',
    description: 'protocol not supported'
  },
  {
    errno: 39,
    code: 'EPROTOTYPE',
    description: 'protocol wrong type for socket'
  },
  {
    errno: 40,
    code: 'ETIMEDOUT',
    description: 'connection timed out'
  },
  {
    errno: 41,
    code: 'ECHARSET',
    description: 'invalid Unicode character'
  },
  {
    errno: 42,
    code: 'EAIFAMNOSUPPORT',
    description: 'address family for hostname not supported'
  },
  {
    errno: 44,
    code: 'EAISERVICE',
    description: 'servname not supported for ai_socktype'
  },
  {
    errno: 45,
    code: 'EAISOCKTYPE',
    description: 'ai_socktype not supported'
  },
  {
    errno: 46,
    code: 'ESHUTDOWN',
    description: 'cannot send after transport endpoint shutdown'
  },
  {
    errno: 47,
    code: 'EEXIST',
    description: 'file already exists'
  },
  {
    errno: 48,
    code: 'ESRCH',
    description: 'no such process'
  },
  {
    errno: 49,
    code: 'ENAMETOOLONG',
    description: 'name too long'
  },
  {
    errno: 50,
    code: 'EPERM',
    description: 'operation not permitted'
  },
  {
    errno: 51,
    code: 'ELOOP',
    description: 'too many symbolic links encountered'
  },
  {
    errno: 52,
    code: 'EXDEV',
    description: 'cross-device link not permitted'
  },
  {
    errno: 53,
    code: 'ENOTEMPTY',
    description: 'directory not empty'
  },
  {
    errno: 54,
    code: 'ENOSPC',
    description: 'no space left on device'
  },
  {
    errno: 55,
    code: 'EIO',
    description: 'i/o error'
  },
  {
    errno: 56,
    code: 'EROFS',
    description: 'read-only file system'
  },
  {
    errno: 57,
    code: 'ENODEV',
    description: 'no such device'
  },
  {
    errno: 58,
    code: 'ESPIPE',
    description: 'invalid seek'
  },
  {
    errno: 59,
    code: 'ECANCELED',
    description: 'operation canceled'
  }
];

module.exports.errno = {};
module.exports.code = {};

all.forEach(function (error) {
  module.exports.errno[error.errno] = error;
  module.exports.code[error.code] = error;
});

module.exports.custom = custom(module.exports);
module.exports.create = module.exports.custom.createError;
});

var createError = errno.create;
var LevelUPError = createError('LevelUPError');
var NotFoundError$1 = createError('NotFoundError', LevelUPError);

NotFoundError$1.prototype.notFound = true;
NotFoundError$1.prototype.status = 404;

var errors = {
  LevelUPError: LevelUPError,
  InitializationError: createError('InitializationError', LevelUPError),
  OpenError: createError('OpenError', LevelUPError),
  ReadError: createError('ReadError', LevelUPError),
  WriteError: createError('WriteError', LevelUPError),
  NotFoundError: NotFoundError$1,
  EncodingError: createError('EncodingError', LevelUPError)
};

function promisify () {
  var callback;
  var promise = new Promise(function (resolve, reject) {
    callback = function callback (err, value) {
      if (err) reject(err);
      else resolve(value);
    };
  });
  callback.promise = promise;
  return callback
}

var promisify_1 = promisify;

var getCallback$2 = function (options, callback) {
  return typeof options === 'function' ? options : callback
};

var getOptions$2 = function (options) {
  return typeof options === 'object' && options !== null ? options : {}
};

var common = {
	getCallback: getCallback$2,
	getOptions: getOptions$2
};

var WriteError$1 = errors.WriteError;

var getCallback$1 = common.getCallback;
var getOptions$1 = common.getOptions;

function Batch$1 (levelup) {
  // TODO (next major): remove this._levelup alias
  this.db = this._levelup = levelup;
  this.batch = levelup.db.batch();
  this.ops = [];
  this.length = 0;
}

Batch$1.prototype.put = function (key, value) {
  try {
    this.batch.put(key, value);
  } catch (e) {
    throw new WriteError$1(e)
  }

  this.ops.push({ type: 'put', key: key, value: value });
  this.length++;

  return this
};

Batch$1.prototype.del = function (key) {
  try {
    this.batch.del(key);
  } catch (err) {
    throw new WriteError$1(err)
  }

  this.ops.push({ type: 'del', key: key });
  this.length++;

  return this
};

Batch$1.prototype.clear = function () {
  try {
    this.batch.clear();
  } catch (err) {
    throw new WriteError$1(err)
  }

  this.ops = [];
  this.length = 0;

  return this
};

Batch$1.prototype.write = function (options, callback) {
  var levelup = this._levelup;
  var ops = this.ops;
  var promise;

  callback = getCallback$1(options, callback);

  if (!callback) {
    callback = promisify_1();
    promise = callback.promise;
  }

  options = getOptions$1(options);

  try {
    this.batch.write(options, function (err) {
      if (err) { return callback(new WriteError$1(err)) }
      levelup.emit('batch', ops);
      callback();
    });
  } catch (err) {
    throw new WriteError$1(err)
  }

  return promise
};

var batch = Batch$1;

var EventEmitter = require$$0__default$1["default"].EventEmitter;
var inherits = require$$1__default["default"].inherits;








var getCallback = common.getCallback;
var getOptions = common.getOptions;

var WriteError = errors.WriteError;
var ReadError = errors.ReadError;
var NotFoundError = errors.NotFoundError;
var OpenError = errors.OpenError;
var InitializationError = errors.InitializationError;

// Possible AbstractLevelDOWN#status values:
//  - 'new'     - newly created, not opened or closed
//  - 'opening' - waiting for the database to be opened, post open()
//  - 'open'    - successfully opened the database, available for use
//  - 'closing' - waiting for the database to be closed, post close()
//  - 'closed'  - database has been successfully closed, should not be
//                 used except for another open() operation

function LevelUP (db, options, callback) {
  if (!(this instanceof LevelUP)) {
    return new LevelUP(db, options, callback)
  }

  var error;
  var self = this;

  EventEmitter.call(this);
  this.setMaxListeners(Infinity);

  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  options = options || {};

  if (!db || typeof db !== 'object') {
    error = new InitializationError('First argument must be an abstract-leveldown compliant store');
    if (typeof callback === 'function') {
      return process.nextTick(callback, error)
    }
    throw error
  }

  assert__default["default"].strictEqual(typeof db.status, 'string', '.status required, old abstract-leveldown');

  this.options = getOptions(options);
  this._db = db;
  this.db = new deferredLeveldown(db);
  this.open(callback || function (err) {
    if (err) self.emit('error', err);
  });

  // Create manifest based on deferred-leveldown's
  this.supports = levelSupports(this.db.supports, {
    status: false,
    deferredOpen: true,
    openCallback: true,
    promises: true,
    streams: true
  });

  // Experimental: enrich levelup interface
  Object.keys(this.supports.additionalMethods).forEach(function (method) {
    if (this[method] != null) return

    // Don't do this.db[method].bind() because this.db is dynamic.
    this[method] = function () {
      return this.db[method].apply(this.db, arguments)
    };
  }, this);
}

LevelUP.prototype.emit = EventEmitter.prototype.emit;
LevelUP.prototype.once = EventEmitter.prototype.once;
inherits(LevelUP, EventEmitter);

LevelUP.prototype.open = function (opts, callback) {
  var self = this;
  var promise;

  if (typeof opts === 'function') {
    callback = opts;
    opts = null;
  }

  if (!callback) {
    callback = promisify_1();
    promise = callback.promise;
  }

  if (!opts) {
    opts = this.options;
  }

  if (this.isOpen()) {
    process.nextTick(callback, null, self);
    return promise
  }

  if (this._isOpening()) {
    this.once('open', function () { callback(null, self); });
    return promise
  }

  this.emit('opening');

  this.db.open(opts, function (err) {
    if (err) {
      return callback(new OpenError(err))
    }
    self.db = self._db;
    callback(null, self);
    self.emit('open');
    self.emit('ready');
  });

  return promise
};

LevelUP.prototype.close = function (callback) {
  var self = this;
  var promise;

  if (!callback) {
    callback = promisify_1();
    promise = callback.promise;
  }

  if (this.isOpen()) {
    this.db.close(function () {
      self.emit('closed');
      callback.apply(null, arguments);
    });
    this.emit('closing');
    this.db = new deferredLeveldown(this._db);
  } else if (this.isClosed()) {
    process.nextTick(callback);
  } else if (this.db.status === 'closing') {
    this.once('closed', callback);
  } else if (this._isOpening()) {
    this.once('open', function () {
      self.close(callback);
    });
  }

  return promise
};

LevelUP.prototype.isOpen = function () {
  return this.db.status === 'open'
};

LevelUP.prototype._isOpening = function () {
  return this.db.status === 'opening'
};

LevelUP.prototype.isClosed = function () {
  return (/^clos|new/).test(this.db.status)
};

LevelUP.prototype.get = function (key, options, callback) {
  var promise;

  callback = getCallback(options, callback);

  if (!callback) {
    callback = promisify_1();
    promise = callback.promise;
  }

  if (maybeError(this, callback)) { return promise }

  options = getOptions(options);

  this.db.get(key, options, function (err, value) {
    if (err) {
      if ((/notfound/i).test(err) || err.notFound) {
        err = new NotFoundError('Key not found in database [' + key + ']', err);
      } else {
        err = new ReadError(err);
      }
      return callback(err)
    }
    callback(null, value);
  });

  return promise
};

LevelUP.prototype.put = function (key, value, options, callback) {
  var self = this;
  var promise;

  callback = getCallback(options, callback);

  if (!callback) {
    callback = promisify_1();
    promise = callback.promise;
  }

  if (maybeError(this, callback)) { return promise }

  options = getOptions(options);

  this.db.put(key, value, options, function (err) {
    if (err) {
      return callback(new WriteError(err))
    }
    self.emit('put', key, value);
    callback();
  });

  return promise
};

LevelUP.prototype.del = function (key, options, callback) {
  var self = this;
  var promise;

  callback = getCallback(options, callback);

  if (!callback) {
    callback = promisify_1();
    promise = callback.promise;
  }

  if (maybeError(this, callback)) { return promise }

  options = getOptions(options);

  this.db.del(key, options, function (err) {
    if (err) {
      return callback(new WriteError(err))
    }
    self.emit('del', key);
    callback();
  });

  return promise
};

LevelUP.prototype.batch = function (arr, options, callback) {
  if (!arguments.length) {
    return new batch(this)
  }

  var self = this;
  var promise;

  if (typeof arr === 'function') callback = arr;
  else callback = getCallback(options, callback);

  if (!callback) {
    callback = promisify_1();
    promise = callback.promise;
  }

  if (maybeError(this, callback)) { return promise }

  options = getOptions(options);

  this.db.batch(arr, options, function (err) {
    if (err) {
      return callback(new WriteError(err))
    }
    self.emit('batch', arr);
    callback();
  });

  return promise
};

LevelUP.prototype.iterator = function (options) {
  return this.db.iterator(options)
};

LevelUP.prototype.clear = function (options, callback) {
  var self = this;
  var promise;

  callback = getCallback(options, callback);
  options = getOptions(options);

  if (!callback) {
    callback = promisify_1();
    promise = callback.promise;
  }

  if (maybeError(this, callback)) {
    return promise
  }

  this.db.clear(options, function (err) {
    if (err) {
      return callback(new WriteError(err))
    }
    self.emit('clear', options);
    callback();
  });

  return promise
};

LevelUP.prototype.readStream =
LevelUP.prototype.createReadStream = function (options) {
  options = immutable({ keys: true, values: true }, options);
  if (typeof options.limit !== 'number') { options.limit = -1; }
  return new levelIteratorStream(this.db.iterator(options), options)
};

LevelUP.prototype.keyStream =
LevelUP.prototype.createKeyStream = function (options) {
  return this.createReadStream(immutable(options, { keys: true, values: false }))
};

LevelUP.prototype.valueStream =
LevelUP.prototype.createValueStream = function (options) {
  return this.createReadStream(immutable(options, { keys: false, values: true }))
};

LevelUP.prototype.toString = function () {
  return 'LevelUP'
};

LevelUP.prototype.type = 'levelup';

function maybeError (db, callback) {
  if (!db._isOpening() && !db.isOpen()) {
    process.nextTick(callback, new ReadError('Database is not open'));
    return true
  }
}

LevelUP.errors = errors;
var levelup = LevelUP.default = LevelUP;

var encodings = createCommonjsModule(function (module, exports) {
var Buffer = require$$0__default["default"].Buffer;

exports.utf8 = exports['utf-8'] = {
  encode: function (data) {
    return isBinary(data) ? data : String(data)
  },
  decode: identity,
  buffer: false,
  type: 'utf8'
};

exports.json = {
  encode: JSON.stringify,
  decode: JSON.parse,
  buffer: false,
  type: 'json'
};

exports.binary = {
  encode: function (data) {
    return isBinary(data) ? data : Buffer.from(data)
  },
  decode: identity,
  buffer: true,
  type: 'binary'
};

exports.none = {
  encode: identity,
  decode: identity,
  buffer: false,
  type: 'id'
};

exports.id = exports.none;

var bufferEncodings = [
  'hex',
  'ascii',
  'base64',
  'ucs2',
  'ucs-2',
  'utf16le',
  'utf-16le'
];

bufferEncodings.forEach(function (type) {
  exports[type] = {
    encode: function (data) {
      return isBinary(data) ? data : Buffer.from(data, type)
    },
    decode: function (buffer) {
      return buffer.toString(type)
    },
    buffer: true,
    type: type
  };
});

function identity (value) {
  return value
}

function isBinary (data) {
  return data === undefined || data === null || Buffer.isBuffer(data)
}
});

var levelCodec = Codec;

function Codec (opts) {
  if (!(this instanceof Codec)) {
    return new Codec(opts)
  }
  this.opts = opts || {};
  this.encodings = encodings;
}

Codec.prototype._encoding = function (encoding) {
  if (typeof encoding === 'string') encoding = encodings[encoding];
  if (!encoding) encoding = encodings.id;
  return encoding
};

Codec.prototype._keyEncoding = function (opts, batchOpts) {
  return this._encoding((batchOpts && batchOpts.keyEncoding) ||
                        (opts && opts.keyEncoding) ||
                        this.opts.keyEncoding)
};

Codec.prototype._valueEncoding = function (opts, batchOpts) {
  return this._encoding((batchOpts && (batchOpts.valueEncoding || batchOpts.encoding)) ||
                        (opts && (opts.valueEncoding || opts.encoding)) ||
                        (this.opts.valueEncoding || this.opts.encoding))
};

Codec.prototype.encodeKey = function (key, opts, batchOpts) {
  return this._keyEncoding(opts, batchOpts).encode(key)
};

Codec.prototype.encodeValue = function (value, opts, batchOpts) {
  return this._valueEncoding(opts, batchOpts).encode(value)
};

Codec.prototype.decodeKey = function (key, opts) {
  return this._keyEncoding(opts).decode(key)
};

Codec.prototype.decodeValue = function (value, opts) {
  return this._valueEncoding(opts).decode(value)
};

Codec.prototype.encodeBatch = function (ops, opts) {
  var self = this;

  return ops.map(function (_op) {
    var op = {
      type: _op.type,
      key: self.encodeKey(_op.key, opts, _op)
    };
    if (self.keyAsBuffer(opts, _op)) op.keyEncoding = 'binary';
    if (_op.prefix) op.prefix = _op.prefix;
    if ('value' in _op) {
      op.value = self.encodeValue(_op.value, opts, _op);
      if (self.valueAsBuffer(opts, _op)) op.valueEncoding = 'binary';
    }
    return op
  })
};

var ltgtKeys = ['lt', 'gt', 'lte', 'gte', 'start', 'end'];

Codec.prototype.encodeLtgt = function (ltgt) {
  var self = this;
  var ret = {};
  Object.keys(ltgt).forEach(function (key) {
    ret[key] = ltgtKeys.indexOf(key) > -1
      ? self.encodeKey(ltgt[key], ltgt)
      : ltgt[key];
  });
  return ret
};

Codec.prototype.createStreamDecoder = function (opts) {
  var self = this;

  if (opts.keys && opts.values) {
    return function (key, value) {
      return {
        key: self.decodeKey(key, opts),
        value: self.decodeValue(value, opts)
      }
    }
  } else if (opts.keys) {
    return function (key) {
      return self.decodeKey(key, opts)
    }
  } else if (opts.values) {
    return function (_, value) {
      return self.decodeValue(value, opts)
    }
  } else {
    return function () {}
  }
};

Codec.prototype.keyAsBuffer = function (opts) {
  return this._keyEncoding(opts).buffer
};

Codec.prototype.valueAsBuffer = function (opts) {
  return this._valueEncoding(opts).buffer
};

var AbstractLevelDOWN$1 = abstractLeveldown.AbstractLevelDOWN;
var AbstractChainedBatch = abstractLeveldown.AbstractChainedBatch;
var AbstractIterator$1 = abstractLeveldown.AbstractIterator;


var EncodingError = errors.EncodingError;
var rangeMethods = ['approximateSize', 'compactRange'];

var encodingDown = DB.default = DB;

function DB (db, opts) {
  if (!(this instanceof DB)) return new DB(db, opts)

  var manifest = db.supports || {};
  var additionalMethods = manifest.additionalMethods || {};

  AbstractLevelDOWN$1.call(this, manifest);

  this.supports.encodings = true;
  this.supports.additionalMethods = {};

  rangeMethods.forEach(function (m) {
    // TODO (future major): remove this fallback
    var fallback = typeof db[m] === 'function';

    if (additionalMethods[m] || fallback) {
      this.supports.additionalMethods[m] = true;

      this[m] = function (start, end, opts, cb) {
        start = this.codec.encodeKey(start, opts);
        end = this.codec.encodeKey(end, opts);
        return this.db[m](start, end, opts, cb)
      };
    }
  }, this);

  opts = opts || {};
  if (typeof opts.keyEncoding === 'undefined') opts.keyEncoding = 'utf8';
  if (typeof opts.valueEncoding === 'undefined') opts.valueEncoding = 'utf8';

  this.db = db;
  this.codec = new levelCodec(opts);
}

inherits_browser(DB, AbstractLevelDOWN$1);

DB.prototype.type = 'encoding-down';

DB.prototype._serializeKey =
DB.prototype._serializeValue = function (datum) {
  return datum
};

DB.prototype._open = function (opts, cb) {
  this.db.open(opts, cb);
};

DB.prototype._close = function (cb) {
  this.db.close(cb);
};

DB.prototype._put = function (key, value, opts, cb) {
  key = this.codec.encodeKey(key, opts);
  value = this.codec.encodeValue(value, opts);
  this.db.put(key, value, opts, cb);
};

DB.prototype._get = function (key, opts, cb) {
  var self = this;
  key = this.codec.encodeKey(key, opts);
  opts.asBuffer = this.codec.valueAsBuffer(opts);
  this.db.get(key, opts, function (err, value) {
    if (err) return cb(err)
    try {
      value = self.codec.decodeValue(value, opts);
    } catch (err) {
      return cb(new EncodingError(err))
    }
    cb(null, value);
  });
};

DB.prototype._del = function (key, opts, cb) {
  key = this.codec.encodeKey(key, opts);
  this.db.del(key, opts, cb);
};

DB.prototype._chainedBatch = function () {
  return new Batch(this)
};

DB.prototype._batch = function (ops, opts, cb) {
  ops = this.codec.encodeBatch(ops, opts);
  this.db.batch(ops, opts, cb);
};

DB.prototype._iterator = function (opts) {
  opts.keyAsBuffer = this.codec.keyAsBuffer(opts);
  opts.valueAsBuffer = this.codec.valueAsBuffer(opts);
  return new Iterator$1(this, opts)
};

DB.prototype._clear = function (opts, callback) {
  opts = this.codec.encodeLtgt(opts);
  this.db.clear(opts, callback);
};

function Iterator$1 (db, opts) {
  AbstractIterator$1.call(this, db);
  this.codec = db.codec;
  this.keys = opts.keys;
  this.values = opts.values;
  this.opts = this.codec.encodeLtgt(opts);
  this.it = db.db.iterator(this.opts);
}

inherits_browser(Iterator$1, AbstractIterator$1);

Iterator$1.prototype._next = function (cb) {
  var self = this;
  this.it.next(function (err, key, value) {
    if (err) return cb(err)
    try {
      if (self.keys && typeof key !== 'undefined') {
        key = self.codec.decodeKey(key, self.opts);
      } else {
        key = undefined;
      }

      if (self.values && typeof value !== 'undefined') {
        value = self.codec.decodeValue(value, self.opts);
      } else {
        value = undefined;
      }
    } catch (err) {
      return cb(new EncodingError(err))
    }
    cb(null, key, value);
  });
};

Iterator$1.prototype._seek = function (key) {
  key = this.codec.encodeKey(key, this.opts);
  this.it.seek(key);
};

Iterator$1.prototype._end = function (cb) {
  this.it.end(cb);
};

function Batch (db, codec) {
  AbstractChainedBatch.call(this, db);
  this.codec = db.codec;
  this.batch = db.db.batch();
}

inherits_browser(Batch, AbstractChainedBatch);

Batch.prototype._put = function (key, value) {
  key = this.codec.encodeKey(key);
  value = this.codec.encodeValue(value);
  this.batch.put(key, value);
};

Batch.prototype._del = function (key) {
  key = this.codec.encodeKey(key);
  this.batch.del(key);
};

Batch.prototype._clear = function () {
  this.batch.clear();
};

Batch.prototype._write = function (opts, cb) {
  this.batch.write(opts, cb);
};

function packager (leveldown) {
  function Level (location, options, callback) {
    if (typeof location === 'function') {
      callback = location;
    } else if (typeof options === 'function') {
      callback = options;
    }

    if (!isObject(options)) {
      options = isObject(location) ? location : {};
    }

    return levelup(encodingDown(leveldown(location, options), options), options, callback)
  }

  function isObject (o) {
    return typeof o === 'object' && o !== null
  }

  ['destroy', 'repair'].forEach(function (m) {
    if (typeof leveldown[m] === 'function') {
      Level[m] = function () {
        leveldown[m].apply(leveldown, arguments);
      };
    }
  });

  Level.errors = levelup.errors;

  return Level
}

var levelPackager = packager;

var ltgt = createCommonjsModule(function (module, exports) {
exports.compare = function (a, b) {

  if(Buffer.isBuffer(a)) {
    var l = Math.min(a.length, b.length);
    for(var i = 0; i < l; i++) {
      var cmp = a[i] - b[i];
      if(cmp) return cmp
    }
    return a.length - b.length
  }

  return a < b ? -1 : a > b ? 1 : 0
};

// to be compatible with the current abstract-leveldown tests
// nullish or empty strings.
// I could use !!val but I want to permit numbers and booleans,
// if possible.

function isDef (val) {
  return val !== undefined && val !== ''
}

function has (range, name) {
  return Object.hasOwnProperty.call(range, name)
}

function hasKey(range, name) {
  return Object.hasOwnProperty.call(range, name) && name
}

var lowerBoundKey = exports.lowerBoundKey = function (range) {
    return (
       hasKey(range, 'gt')
    || hasKey(range, 'gte')
    || hasKey(range, 'min')
    || (range.reverse ? hasKey(range, 'end') : hasKey(range, 'start'))
    || undefined
    )
};

var lowerBound = exports.lowerBound = function (range, def) {
  var k = lowerBoundKey(range);
  return k ? range[k] : def
};

var lowerBoundInclusive = exports.lowerBoundInclusive = function (range) {
  return has(range, 'gt') ? false : true
};

var upperBoundInclusive = exports.upperBoundInclusive =
  function (range) {
    return (has(range, 'lt') /*&& !range.maxEx*/) ? false : true
  };

var lowerBoundExclusive = exports.lowerBoundExclusive =
  function (range) {
    return !lowerBoundInclusive(range)
  };

var upperBoundExclusive = exports.upperBoundExclusive =
  function (range) {
    return !upperBoundInclusive(range)
  };

var upperBoundKey = exports.upperBoundKey = function (range) {
    return (
       hasKey(range, 'lt')
    || hasKey(range, 'lte')
    || hasKey(range, 'max')
    || (range.reverse ? hasKey(range, 'start') : hasKey(range, 'end'))
    || undefined
    )
};

var upperBound = exports.upperBound = function (range, def) {
  var k = upperBoundKey(range);
  return k ? range[k] : def
};

exports.start = function (range, def) {
  return range.reverse ? upperBound(range, def) : lowerBound(range, def)
};
exports.end = function (range, def) {
  return range.reverse ? lowerBound(range, def) : upperBound(range, def)
};
exports.startInclusive = function (range) {
  return (
    range.reverse
  ? upperBoundInclusive(range)
  : lowerBoundInclusive(range)
  )
};
exports.endInclusive = function (range) {
  return (
    range.reverse
  ? lowerBoundInclusive(range)
  : upperBoundInclusive(range)
  )
};

function id (e) { return e }

exports.toLtgt = function (range, _range, map, lower, upper) {
  _range = _range || {};
  map = map || id;
  var defaults = arguments.length > 3;
  var lb = exports.lowerBoundKey(range);
  var ub = exports.upperBoundKey(range);
  if(lb) {
    if(lb === 'gt') _range.gt = map(range.gt, false);
    else            _range.gte = map(range[lb], false);
  }
  else if(defaults)
    _range.gte = map(lower, false);

  if(ub) {
    if(ub === 'lt') _range.lt = map(range.lt, true);
    else            _range.lte = map(range[ub], true);
  }
  else if(defaults)
    _range.lte = map(upper, true);

  if(range.reverse != null)
    _range.reverse = !!range.reverse;

  //if range was used mutably
  //(in level-sublevel it's part of an options object
  //that has more properties on it.)
  if(has(_range, 'max'))   delete _range.max;
  if(has(_range, 'min'))   delete _range.min;
  if(has(_range, 'start')) delete _range.start;
  if(has(_range, 'end'))   delete _range.end;

  return _range
};

exports.contains = function (range, key, compare) {
  compare = compare || exports.compare;

  var lb = lowerBound(range);
  if(isDef(lb)) {
    var cmp = compare(key, lb);
    if(cmp < 0 || (cmp === 0 && lowerBoundExclusive(range)))
      return false
  }

  var ub = upperBound(range);
  if(isDef(ub)) {
    var cmp = compare(key, ub);
    if(cmp > 0 || (cmp === 0) && upperBoundExclusive(range))
      return false
  }

  return true
};

exports.filter = function (range, compare) {
  return function (key) {
    return exports.contains(range, key, compare)
  }
};
});

/* global IDBKeyRange */


var NONE = {};

var keyRange = function createKeyRange (options) {
  var lower = ltgt.lowerBound(options, NONE);
  var upper = ltgt.upperBound(options, NONE);
  var lowerOpen = ltgt.lowerBoundExclusive(options, NONE);
  var upperOpen = ltgt.upperBoundExclusive(options, NONE);

  if (lower !== NONE && upper !== NONE) {
    return IDBKeyRange.bound(lower, upper, lowerOpen, upperOpen)
  } else if (lower !== NONE) {
    return IDBKeyRange.lowerBound(lower, lowerOpen)
  } else if (upper !== NONE) {
    return IDBKeyRange.upperBound(upper, upperOpen)
  } else {
    return null
  }
};

var Buffer$2 = require$$0__default["default"].Buffer;
var ta2str = (function () {
  if (commonjsGlobal.TextDecoder) {
    var decoder = new TextDecoder('utf-8');
    return decoder.decode.bind(decoder)
  } else {
    return function ta2str (ta) {
      return ta2buf(ta).toString()
    }
  }
})();

var ab2str = (function () {
  if (commonjsGlobal.TextDecoder) {
    var decoder = new TextDecoder('utf-8');
    return decoder.decode.bind(decoder)
  } else {
    return function ab2str (ab) {
      return Buffer$2.from(ab).toString()
    }
  }
})();

function ta2buf (ta) {
  var buf = Buffer$2.from(ta.buffer);

  if (ta.byteLength === ta.buffer.byteLength) {
    return buf
  } else {
    return buf.slice(ta.byteOffset, ta.byteOffset + ta.byteLength)
  }
}

var deserialize = function (data, asBuffer) {
  if (data instanceof Uint8Array) {
    return asBuffer ? ta2buf(data) : ta2str(data)
  } else if (data instanceof ArrayBuffer) {
    return asBuffer ? Buffer$2.from(data) : ab2str(data)
  } else {
    return asBuffer ? Buffer$2.from(String(data)) : String(data)
  }
};

var AbstractIterator = abstractLeveldown.AbstractIterator;


var noop = function () {};

var iterator$3 = Iterator;

function Iterator (db, location, options) {
  AbstractIterator.call(this, db);

  this._limit = options.limit;
  this._count = 0;
  this._callback = null;
  this._cache = [];
  this._completed = false;
  this._aborted = false;
  this._error = null;
  this._transaction = null;

  this._keys = options.keys;
  this._values = options.values;
  this._keyAsBuffer = options.keyAsBuffer;
  this._valueAsBuffer = options.valueAsBuffer;

  if (this._limit === 0) {
    this._completed = true;
    return
  }

  try {
    var keyRange$1 = keyRange(options);
  } catch (e) {
    // The lower key is greater than the upper key.
    // IndexedDB throws an error, but we'll just return 0 results.
    this._completed = true;
    return
  }

  this.createIterator(location, keyRange$1, options.reverse);
}

inherits_browser(Iterator, AbstractIterator);

Iterator.prototype.createIterator = function (location, keyRange, reverse) {
  var self = this;
  var transaction = this.db.db.transaction([location], 'readonly');
  var store = transaction.objectStore(location);
  var req = store.openCursor(keyRange, reverse ? 'prev' : 'next');

  req.onsuccess = function (ev) {
    var cursor = ev.target.result;
    if (cursor) self.onItem(cursor);
  };

  this._transaction = transaction;

  // If an error occurs (on the request), the transaction will abort.
  transaction.onabort = function () {
    self.onAbort(self._transaction.error || new Error('aborted by user'));
  };

  transaction.oncomplete = function () {
    self.onComplete();
  };
};

Iterator.prototype.onItem = function (cursor) {
  this._cache.push(cursor.key, cursor.value);

  if (this._limit <= 0 || ++this._count < this._limit) {
    cursor.continue();
  }

  this.maybeNext();
};

Iterator.prototype.onAbort = function (err) {
  this._aborted = true;
  this._error = err;
  this.maybeNext();
};

Iterator.prototype.onComplete = function () {
  this._completed = true;
  this.maybeNext();
};

Iterator.prototype.maybeNext = function () {
  if (this._callback) {
    this._next(this._callback);
    this._callback = null;
  }
};

Iterator.prototype._next = function (callback) {
  if (this._aborted) {
    // The error should be picked up by either next() or end().
    var err = this._error;
    this._error = null;
    this._nextTick(callback, err);
  } else if (this._cache.length > 0) {
    var key = this._cache.shift();
    var value = this._cache.shift();

    if (this._keys && key !== undefined) {
      key = this._deserializeKey(key, this._keyAsBuffer);
    } else {
      key = undefined;
    }

    if (this._values && value !== undefined) {
      value = this._deserializeValue(value, this._valueAsBuffer);
    } else {
      value = undefined;
    }

    this._nextTick(callback, null, key, value);
  } else if (this._completed) {
    this._nextTick(callback);
  } else {
    this._callback = callback;
  }
};

// Exposed for the v4 to v5 upgrade utility
Iterator.prototype._deserializeKey = deserialize;
Iterator.prototype._deserializeValue = deserialize;

Iterator.prototype._end = function (callback) {
  if (this._aborted || this._completed) {
    return this._nextTick(callback, this._error)
  }

  // Don't advance the cursor anymore, and the transaction will complete
  // on its own in the next tick. This approach is much cleaner than calling
  // transaction.abort() with its unpredictable event order.
  this.onItem = noop;
  this.onAbort = callback;
  this.onComplete = callback;
};

var Buffer$1 = require$$0__default["default"].Buffer;
// Returns either a Uint8Array or Buffer (doesn't matter to
// IndexedDB, because Buffer is a subclass of Uint8Array)
var str2bin = (function () {
  if (commonjsGlobal.TextEncoder) {
    var encoder = new TextEncoder('utf-8');
    return encoder.encode.bind(encoder)
  } else {
    return Buffer$1.from
  }
})();

var serialize = function (data, asBuffer) {
  if (asBuffer) {
    return Buffer$1.isBuffer(data) ? data : str2bin(String(data))
  } else {
    return String(data)
  }
};

var support = createCommonjsModule(function (module, exports) {

var Buffer = require$$0__default["default"].Buffer;

exports.test = function (key) {
  return function test (impl) {
    try {
      impl.cmp(key, 0);
      return true
    } catch (err) {
      return false
    }
  }
};

// Detect binary key support (IndexedDB Second Edition)
exports.bufferKeys = exports.test(Buffer.alloc(0));
});

var clear = function clear (db, location, keyRange, options, callback) {
  if (options.limit === 0) return db._nextTick(callback)

  var transaction = db.db.transaction([location], 'readwrite');
  var store = transaction.objectStore(location);
  var count = 0;

  transaction.oncomplete = function () {
    callback();
  };

  transaction.onabort = function () {
    callback(transaction.error || new Error('aborted by user'));
  };

  // A key cursor is faster (skips reading values) but not supported by IE
  var method = store.openKeyCursor ? 'openKeyCursor' : 'openCursor';
  var direction = options.reverse ? 'prev' : 'next';

  store[method](keyRange, direction).onsuccess = function (ev) {
    var cursor = ev.target.result;

    if (cursor) {
      // Wait for a request to complete before continuing, saving CPU.
      store.delete(cursor.key).onsuccess = function () {
        if (options.limit <= 0 || ++count < options.limit) {
          cursor.continue();
        }
      };
    }
  };
};

/* global indexedDB */

var levelJs = Level;

var AbstractLevelDOWN = abstractLeveldown.AbstractLevelDOWN;








var DEFAULT_PREFIX = 'level-js-';

function Level (location, opts) {
  if (!(this instanceof Level)) return new Level(location, opts)

  AbstractLevelDOWN.call(this, {
    bufferKeys: support.bufferKeys(indexedDB),
    snapshots: true,
    permanence: true,
    clear: true
  });

  opts = opts || {};

  if (typeof location !== 'string') {
    throw new Error('constructor requires a location string argument')
  }

  this.location = location;
  this.prefix = opts.prefix == null ? DEFAULT_PREFIX : opts.prefix;
  this.version = parseInt(opts.version || 1, 10);
}

inherits_browser(Level, AbstractLevelDOWN);

Level.prototype.type = 'level-js';

Level.prototype._open = function (options, callback) {
  var req = indexedDB.open(this.prefix + this.location, this.version);
  var self = this;

  req.onerror = function () {
    callback(req.error || new Error('unknown error'));
  };

  req.onsuccess = function () {
    self.db = req.result;
    callback();
  };

  req.onupgradeneeded = function (ev) {
    var db = ev.target.result;

    if (!db.objectStoreNames.contains(self.location)) {
      db.createObjectStore(self.location);
    }
  };
};

Level.prototype.store = function (mode) {
  var transaction = this.db.transaction([this.location], mode);
  return transaction.objectStore(this.location)
};

Level.prototype.await = function (request, callback) {
  var transaction = request.transaction;

  // Take advantage of the fact that a non-canceled request error aborts
  // the transaction. I.e. no need to listen for "request.onerror".
  transaction.onabort = function () {
    callback(transaction.error || new Error('aborted by user'));
  };

  transaction.oncomplete = function () {
    callback(null, request.result);
  };
};

Level.prototype._get = function (key, options, callback) {
  var store = this.store('readonly');

  try {
    var req = store.get(key);
  } catch (err) {
    return this._nextTick(callback, err)
  }

  this.await(req, function (err, value) {
    if (err) return callback(err)

    if (value === undefined) {
      // 'NotFound' error, consistent with LevelDOWN API
      return callback(new Error('NotFound'))
    }

    callback(null, deserialize(value, options.asBuffer));
  });
};

Level.prototype._del = function (key, options, callback) {
  var store = this.store('readwrite');

  try {
    var req = store.delete(key);
  } catch (err) {
    return this._nextTick(callback, err)
  }

  this.await(req, callback);
};

Level.prototype._put = function (key, value, options, callback) {
  var store = this.store('readwrite');

  try {
    // Will throw a DataError or DataCloneError if the environment
    // does not support serializing the key or value respectively.
    var req = store.put(value, key);
  } catch (err) {
    return this._nextTick(callback, err)
  }

  this.await(req, callback);
};

Level.prototype._serializeKey = function (key) {
  return serialize(key, this.supports.bufferKeys)
};

Level.prototype._serializeValue = function (value) {
  return serialize(value, true)
};

Level.prototype._iterator = function (options) {
  return new iterator$3(this, this.location, options)
};

Level.prototype._batch = function (operations, options, callback) {
  if (operations.length === 0) return this._nextTick(callback)

  var store = this.store('readwrite');
  var transaction = store.transaction;
  var index = 0;
  var error;

  transaction.onabort = function () {
    callback(error || transaction.error || new Error('aborted by user'));
  };

  transaction.oncomplete = function () {
    callback();
  };

  // Wait for a request to complete before making the next, saving CPU.
  function loop () {
    var op = operations[index++];
    var key = op.key;

    try {
      var req = op.type === 'del' ? store.delete(key) : store.put(op.value, key);
    } catch (err) {
      error = err;
      transaction.abort();
      return
    }

    if (index < operations.length) {
      req.onsuccess = loop;
    }
  }

  loop();
};

Level.prototype._clear = function (options, callback) {
  try {
    var keyRange$1 = keyRange(options);
  } catch (e) {
    // The lower key is greater than the upper key.
    // IndexedDB throws an error, but we'll just do nothing.
    return this._nextTick(callback)
  }

  if (options.limit >= 0) {
    // IDBObjectStore#delete(range) doesn't have such an option.
    // Fall back to cursor-based implementation.
    return clear(this, this.location, keyRange$1, options, callback)
  }

  try {
    var store = this.store('readwrite');
    var req = keyRange$1 ? store.delete(keyRange$1) : store.clear();
  } catch (err) {
    return this._nextTick(callback, err)
  }

  this.await(req, callback);
};

Level.prototype._close = function (callback) {
  this.db.close();
  this._nextTick(callback);
};

// NOTE: remove in a next major release
Level.prototype.upgrade = function (callback) {
  if (this.status !== 'open') {
    return this._nextTick(callback, new Error('cannot upgrade() before open()'))
  }

  var it = this.iterator();
  var batchOptions = {};
  var self = this;

  it._deserializeKey = it._deserializeValue = identity;
  next();

  function next (err) {
    if (err) return finish(err)
    it.next(each);
  }

  function each (err, key, value) {
    if (err || key === undefined) {
      return finish(err)
    }

    var newKey = self._serializeKey(deserialize(key, true));
    var newValue = self._serializeValue(deserialize(value, true));

    // To bypass serialization on the old key, use _batch() instead of batch().
    // NOTE: if we disable snapshotting (#86) this could lead to a loop of
    // inserting and then iterating those same entries, because the new keys
    // possibly sort after the old keys.
    self._batch([
      { type: 'del', key: key },
      { type: 'put', key: newKey, value: newValue }
    ], batchOptions, next);
  }

  function finish (err) {
    it.end(function (err2) {
      callback(err || err2);
    });
  }

  function identity (data) {
    return data
  }
};

Level.destroy = function (location, prefix, callback) {
  if (typeof prefix === 'function') {
    callback = prefix;
    prefix = DEFAULT_PREFIX;
  }
  var request = indexedDB.deleteDatabase(prefix + location);
  request.onsuccess = function () {
    callback();
  };
  request.onerror = function (err) {
    callback(err);
  };
};

var browser$1 = levelPackager(levelJs);

const PREFERRED_TRIM_SIZE$1 = 500;

const YEncodingString$1 = 0;
const YEncodingUint32$1 = 1;

const valueEncoding$1 = {
  buffer: true,
  type: 'y-value',
  encode: /** @param {any} data */ data => data,
  decode: /** @param {any} data */ data => data
};

/**
 * Write two bytes as an unsigned integer in big endian order.
 * (most significant byte first)
 *
 * @function
 * @param {encoding.Encoder} encoder
 * @param {number} num The number that is to be encoded.
 */
const writeUint32BigEndian$3 = (encoder, num) => {
  for (let i = 3; i >= 0; i--) {
    write$2(encoder, (num >>> (8 * i)) & BITS8$2);
  }
};

/**
 * Read 4 bytes as unsigned integer in big endian order.
 * (most significant byte first)
 *
 * @todo use lib0/decoding instead
 *
 * @function
 * @param {decoding.Decoder} decoder
 * @return {number} An unsigned integer.
 */
const readUint32BigEndian$3 = decoder => {
  const uint =
    (decoder.arr[decoder.pos + 3] +
    (decoder.arr[decoder.pos + 2] << 8) +
    (decoder.arr[decoder.pos + 1] << 16) +
    (decoder.arr[decoder.pos] << 24)) >>> 0;
  decoder.pos += 4;
  return uint
};

const keyEncoding$1 = {
  buffer: true,
  type: 'y-keys',
  /* istanbul ignore next */
  encode: /** @param {Array<string|number>} arr */  arr => {
    const encoder = createEncoder$2();
    for (let i = 0; i < arr.length; i++) {
      const v = arr[i];
      if (typeof v === 'string') {
        writeUint8$2(encoder, YEncodingString$1);
        writeVarString$2(encoder, v);
      } else /* istanbul ignore else */ if (typeof v === 'number') {
        writeUint8$2(encoder, YEncodingUint32$1);
        writeUint32BigEndian$3(encoder, v);
      } else {
        throw new Error('Unexpected key value')
      }
    }
    return require$$0$2.Buffer.from(toUint8Array$2(encoder))
  },
  decode: /** @param {Uint8Array} buf */ buf => {
    const decoder = createDecoder$2(buf);
    const key = [];
    while (hasContent$2(decoder)) {
      switch (readUint8$2(decoder)) {
        case YEncodingString$1:
          key.push(readVarString$2(decoder));
          break
        case YEncodingUint32$1:
          key.push(readUint32BigEndian$3(decoder));
          break
      }
    }
    return key
  }
};

/**
 * level returns an error if a value is not found.
 *
 * This helper method for level returns `null` instead if the key is not found.
 *
 * @param {any} db
 * @param {any} key
 */
const levelGet$1 = async (db, key) => {
  let res;
  try {
    res = await db.get(key);
  } catch (err) {
    /* istanbul ignore else */
    if (err.notFound) {
      return null
    } else {
      throw err
    }
  }
  return res
};

/**
 * Level expects a Buffer, but in Yjs we typically work with Uint8Arrays.
 *
 * Since Level thinks that these are two entirely different things,
 * we transform the Uint8array to a Buffer before storing it.
 *
 * @param {any} db
 * @param {any} key
 * @param {Uint8Array} val
 */
const levelPut$1 = async (db, key, val) => db.put(key, require$$0$2.Buffer.from(val));

/**
 * A "bulkier" implementation of level streams. Returns the result in one flush.
 *
 * @param {any} db
 * @param {object} opts
 * @return {Promise<Array<any>>}
 */
const getLevelBulkData$1 = (db, opts) => create$h((resolve, reject) => {
  /**
   * @type {Array<any>} result
   */
  const result = [];
  db.createReadStream(
    opts
  ).on('data', /** @param {any} data */ data =>
    result.push(data)
  ).on('end', () =>
    resolve(result)
  ).on('error', reject);
});

/**
 * Get all document updates for a specific document.
 *
 * @param {any} db
 * @param {string} docName
 * @param {any} [opts]
 * @return {Promise<Array<Buffer>>}
 */
const getLevelUpdates$1 = (db, docName, opts = { values: true, keys: false }) => getLevelBulkData$1(db, {
  gte: createDocumentUpdateKey$1(docName, 0),
  lt: createDocumentUpdateKey$1(docName, BITS32$2),
  ...opts
});

/**
 * Get all document updates for a specific document.
 *
 * @param {any} db
 * @param {boolean} values
 * @param {boolean} keys
 * @return {Promise<Array<any>>}
 */
const getAllDocs$1 = (db, values, keys) => getLevelBulkData$1(db, {
  gte: ['v1_sv'],
  lt: ['v1_sw'],
  keys,
  values
});

/**
 * @param {any} db
 * @param {string} docName
 * @return {Promise<number>} Returns -1 if this document doesn't exist yet
 */
const getCurrentUpdateClock$1 = (db, docName) => getLevelUpdates$1(db, docName, { keys: true, values: false, reverse: true, limit: 1 }).then(keys => {
  if (keys.length === 0) {
    return -1
  } else {
    return keys[0][3]
  }
});

/**
 * @param {any} db
 * @param {Array<string|number>} gte Greater than or equal
 * @param {Array<string|number>} lt lower than (not equal)
 * @return {Promise<void>}
 */
const clearRange$1 = async (db, gte, lt) => {
  /* istanbul ignore else */
  if (db.supports.clear) {
    await db.clear({ gte, lt });
  } else {
    const keys = await getLevelBulkData$1(db, { values: false, keys: true, gte, lt });
    const ops = keys.map(key => ({ type: 'del', key }));
    await db.batch(ops);
  }
};

/**
 * @param {any} db
 * @param {string} docName
 * @param {number} from Greater than or equal
 * @param {number} to lower than (not equal)
 * @return {Promise<void>}
 */
const clearUpdatesRange$1 = async (db, docName, from, to) => clearRange$1(db, createDocumentUpdateKey$1(docName, from), createDocumentUpdateKey$1(docName, to));

/**
 * Create a unique key for a update message.
 * We encode the result using `keyEncoding` which expects an array.
 *
 * @param {string} docName
 * @param {number} clock must be unique
 * @return {Array<string|number>}
 */
const createDocumentUpdateKey$1 = (docName, clock) => ['v1', docName, 'update', clock];

/**
 * @param {string} docName
 * @param {string} metaKey
 */
const createDocumentMetaKey$1 = (docName, metaKey) => ['v1', docName, 'meta', metaKey];

/**
 * @param {string} docName
 */
const createDocumentMetaEndKey$1 = (docName) => ['v1', docName, 'metb']; // simple trick

/**
 * We have a separate state vector key so we can iterate efficiently over all documents
 * @param {string} docName
 */
const createDocumentStateVectorKey$1 = (docName) => ['v1_sv', docName];

/**
 * @param {string} docName
 */
const createDocumentFirstKey$1 = (docName) => ['v1', docName];

/**
 * We use this key as the upper limit of all keys that can be written.
 * Make sure that all document keys are smaller! Strings are encoded using varLength string encoding,
 * so we need to make sure that this key has the biggest size!
 *
 * @param {string} docName
 */
const createDocumentLastKey$1 = (docName) => ['v1', docName, 'zzzzzzz'];

// const emptyStateVector = (() => Y.encodeStateVector(new Y.Doc()))()

/**
 * For now this is a helper method that creates a Y.Doc and then re-encodes a document update.
 * In the future this will be handled by Yjs without creating a Y.Doc (constant memory consumption).
 *
 * @param {Array<Uint8Array>} updates
 * @return {{update:Uint8Array, sv: Uint8Array}}
 */
const mergeUpdates$2 = (updates) => {
  const ydoc = new Doc$1();
  ydoc.transact(() => {
    for (let i = 0; i < updates.length; i++) {
      applyUpdate$1(ydoc, updates[i]);
    }
  });
  return { update: encodeStateAsUpdate$1(ydoc), sv: encodeStateVector$1(ydoc) }
};

/**
 * @param {any} db
 * @param {string} docName
 * @param {Uint8Array} sv state vector
 * @param {number} clock current clock of the document so we can determine when this statevector was created
 */
const writeStateVector$2 = async (db, docName, sv, clock) => {
  const encoder = createEncoder$2();
  writeVarUint$2(encoder, clock);
  writeVarUint8Array$2(encoder, sv);
  await levelPut$1(db, createDocumentStateVectorKey$1(docName), toUint8Array$2(encoder));
};

/**
 * @param {Uint8Array} buf
 * @return {{ sv: Uint8Array, clock: number }}
 */
const decodeLeveldbStateVector$1 = buf => {
  const decoder = createDecoder$2(buf);
  const clock = readVarUint$2(decoder);
  const sv = readVarUint8Array$2(decoder);
  return { sv, clock }
};

/**
 * @param {any} db
 * @param {string} docName
 */
const readStateVector$2 = async (db, docName) => {
  const buf = await levelGet$1(db, createDocumentStateVectorKey$1(docName));
  if (buf === null) {
    // no state vector created yet or no document exists
    return { sv: null, clock: -1 }
  }
  return decodeLeveldbStateVector$1(buf)
};

/**
 * @param {any} db
 * @param {string} docName
 * @param {Uint8Array} stateAsUpdate
 * @param {Uint8Array} stateVector
 * @return {Promise<number>} returns the clock of the flushed doc
 */
const flushDocument$1 = async (db, docName, stateAsUpdate, stateVector) => {
  const clock = await storeUpdate$1(db, docName, stateAsUpdate);
  await writeStateVector$2(db, docName, stateVector, clock);
  await clearUpdatesRange$1(db, docName, 0, clock); // intentionally not waiting for the promise to resolve!
  return clock
};

/**
 * @param {any} db
 * @param {string} docName
 * @param {Uint8Array} update
 * @return {Promise<number>} Returns the clock of the stored update
 */
const storeUpdate$1 = async (db, docName, update) => {
  const clock = await getCurrentUpdateClock$1(db, docName);
  if (clock === -1) {
    // make sure that a state vector is aways written, so we can search for available documents
    const ydoc = new Doc$1();
    applyUpdate$1(ydoc, update);
    const sv = encodeStateVector$1(ydoc);
    await writeStateVector$2(db, docName, sv, 0);
  }
  await levelPut$1(db, createDocumentUpdateKey$1(docName, clock + 1), update);
  return clock + 1
};

class LeveldbPersistence$1 {
  /**
   * @param {string} location
   * @param {object} [opts]
   * @param {any} [opts.level] Level-compatible adapter. E.g. leveldown, level-rem, level-indexeddb. Defaults to `level`
   * @param {object} [opts.levelOptions] Options that are passed down to the level instance
   */
  constructor (location, /* istanbul ignore next */ { level = browser$1, levelOptions = {} } = {}) {
    const db = level(location, { ...levelOptions, valueEncoding: valueEncoding$1, keyEncoding: keyEncoding$1 });
    this.tr = resolve$2();
    /**
     * Execute an transaction on a database. This will ensure that other processes are currently not writing.
     *
     * This is a private method and might change in the future.
     *
     * @todo only transact on the same room-name. Allow for concurrency of different rooms.
     *
     * @template T
     *
     * @param {function(any):Promise<T>} f A transaction that receives the db object
     * @return {Promise<T>}
     */
    this._transact = f => {
      const currTr = this.tr;
      this.tr = (async () => {
        await currTr;
        let res = /** @type {any} */ (null);
        try {
          res = await f(db);
        } catch (err) {
          /* istanbul ignore next */
          console.warn('Error during y-leveldb transaction', err);
        }
        return res
      })();
      return this.tr
    };
  }

  /**
   * @param {string} docName
   */
  flushDocument (docName) {
    return this._transact(async db => {
      const updates = await getLevelUpdates$1(db, docName);
      const { update, sv } = mergeUpdates$2(updates);
      await flushDocument$1(db, docName, update, sv);
    })
  }

  /**
   * @param {string} docName
   * @return {Promise<Y.Doc>}
   */
  getYDoc (docName) {
    return this._transact(async db => {
      const updates = await getLevelUpdates$1(db, docName);
      const ydoc = new Doc$1();
      ydoc.transact(() => {
        for (let i = 0; i < updates.length; i++) {
          applyUpdate$1(ydoc, updates[i]);
        }
      });
      if (updates.length > PREFERRED_TRIM_SIZE$1) {
        await flushDocument$1(db, docName, encodeStateAsUpdate$1(ydoc), encodeStateVector$1(ydoc));
      }
      return ydoc
    })
  }

  /**
   * @param {string} docName
   * @return {Promise<Uint8Array>}
   */
  getStateVector (docName) {
    return this._transact(async db => {
      const { clock, sv } = await readStateVector$2(db, docName);
      let curClock = -1;
      if (sv !== null) {
        curClock = await getCurrentUpdateClock$1(db, docName);
      }
      if (sv !== null && clock === curClock) {
        return sv
      } else {
        // current state vector is outdated
        const updates = await getLevelUpdates$1(db, docName);
        const { update, sv } = mergeUpdates$2(updates);
        await flushDocument$1(db, docName, update, sv);
        return sv
      }
    })
  }

  /**
   * @param {string} docName
   * @param {Uint8Array} update
   * @return {Promise<number>} Returns the clock of the stored update
   */
  storeUpdate (docName, update) {
    return this._transact(db => storeUpdate$1(db, docName, update))
  }

  /**
   * @param {string} docName
   * @param {Uint8Array} stateVector
   */
  async getDiff (docName, stateVector) {
    const ydoc = await this.getYDoc(docName);
    return encodeStateAsUpdate$1(ydoc, stateVector)
  }

  /**
   * @param {string} docName
   * @return {Promise<void>}
   */
  clearDocument (docName) {
    return this._transact(async db => {
      await db.del(createDocumentStateVectorKey$1(docName));
      await clearRange$1(db, createDocumentFirstKey$1(docName), createDocumentLastKey$1(docName));
    })
  }

  /**
   * @param {string} docName
   * @param {string} metaKey
   * @param {any} value
   * @return {Promise<void>}
   */
  setMeta (docName, metaKey, value) {
    return this._transact(db => levelPut$1(db, createDocumentMetaKey$1(docName, metaKey), encodeAny$2(value)))
  }

  /**
   * @param {string} docName
   * @param {string} metaKey
   * @return {Promise<any>}
   */
  delMeta (docName, metaKey) {
    return this._transact(db => db.del(createDocumentMetaKey$1(docName, metaKey)))
  }

  /**
   * @param {string} docName
   * @param {string} metaKey
   * @return {Promise<any>}
   */
  getMeta (docName, metaKey) {
    return this._transact(async db => {
      const res = await levelGet$1(db, createDocumentMetaKey$1(docName, metaKey));
      if (res === null) {
        return// return void
      }
      return decodeAny$2(res)
    })
  }

  /**
   * @return {Promise<Array<string>>}
   */
  getAllDocNames () {
    return this._transact(async db => {
      const docKeys = await getAllDocs$1(db, false, true);
      return docKeys.map(key => key[1])
    })
  }

  /**
   * @return {Promise<Array<{ name: string, sv: Uint8Array, clock: number }>>}
   */
  getAllDocStateVecors () {
    return this._transact(async db => {
      const docs = /** @type {any} */ (await getAllDocs$1(db, true, true));
      return docs.map(doc => {
        const { sv, clock } = decodeLeveldbStateVector$1(doc.value);
        return { name: doc.key[1], sv, clock }
      })
    })
  }

  /**
   * @param {string} docName
   * @return {Promise<Map<string, any>>}
   */
  getMetas (docName) {
    return this._transact(async db => {
      const data = await getLevelBulkData$1(db, {
        gte: createDocumentMetaKey$1(docName, ''),
        lt: createDocumentMetaEndKey$1(docName),
        keys: true,
        values: true
      });
      const metas = new Map();
      data.forEach(v => { metas.set(v.key[3], decodeAny$2(v.value)); });
      return metas
    })
  }

  /**
   * Close connection to a leveldb database and discard all state and bindings
   *
   * @return {Promise<void>}
   */
  destroy () {
    return this._transact(db => db.close())
  }

  /**
   * Delete all data in database.
   */
  clearAll () {
    return this._transact(async db => db.clear())
  }
}

/**
 * Utility module to work with key-value stores.
 *
 * @module map
 */

/**
 * Creates a new Map instance.
 *
 * @function
 * @return {Map<any, any>}
 *
 * @function
 */
const create$d = () => new Map();

/**
 * Copy a Map object into a fresh Map object.
 *
 * @function
 * @template X,Y
 * @param {Map<X,Y>} m
 * @return {Map<X,Y>}
 */
const copy$3 = m => {
  const r = create$d();
  m.forEach((v, k) => { r.set(k, v); });
  return r
};

/**
 * Get map property. Create T if property is undefined and set T on map.
 *
 * ```js
 * const listeners = map.setIfUndefined(events, 'eventName', set.create)
 * listeners.add(listener)
 * ```
 *
 * @function
 * @template T,K
 * @param {Map<K, T>} map
 * @param {K} key
 * @param {function():T} createT
 * @return {T}
 */
const setIfUndefined$1 = (map, key, createT) => {
  let set = map.get(key);
  if (set === undefined) {
    map.set(key, set = createT());
  }
  return set
};

/**
 * Creates an Array and populates it with the content of all key-value pairs using the `f(value, key)` function.
 *
 * @function
 * @template K
 * @template V
 * @template R
 * @param {Map<K,V>} m
 * @param {function(V,K):R} f
 * @return {Array<R>}
 */
const map$5 = (m, f) => {
  const res = [];
  for (const [key, value] of m) {
    res.push(f(value, key));
  }
  return res
};

/**
 * Tests whether any key-value pairs pass the test implemented by `f(value, key)`.
 *
 * @todo should rename to some - similarly to Array.some
 *
 * @function
 * @template K
 * @template V
 * @param {Map<K,V>} m
 * @param {function(V,K):boolean} f
 * @return {boolean}
 */
const any$1 = (m, f) => {
  for (const [key, value] of m) {
    if (f(value, key)) {
      return true
    }
  }
  return false
};

/**
 * Tests whether all key-value pairs pass the test implemented by `f(value, key)`.
 *
 * @function
 * @template K
 * @template V
 * @param {Map<K,V>} m
 * @param {function(V,K):boolean} f
 * @return {boolean}
 */
const all$3 = (m, f) => {
  for (const [key, value] of m) {
    if (!f(value, key)) {
      return false
    }
  }
  return true
};

var map$1$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$d,
  copy: copy$3,
  setIfUndefined: setIfUndefined$1,
  map: map$5,
  any: any$1,
  all: all$3
});

var all_1$1 = all$3;
var any_1 = any$1;
var copy_1$1 = copy$3;
var create_1$7 = create$d;
var map_1$3 = map$5;
var map$1_1 = map$1$1;
var setIfUndefined_1 = setIfUndefined$1;


var map28a001c9 = {
	all: all_1$1,
	any: any_1,
	copy: copy_1$1,
	create: create_1$7,
	map: map_1$3,
	map$1: map$1_1,
	setIfUndefined: setIfUndefined_1
};

/**
 * Utility module to work with sets.
 *
 * @module set
 */

const create$c = () => new Set();

/**
 * @template T
 * @param {Set<T>} set
 * @return {Array<T>}
 */
const toArray$1 = set => Array.from(set);

var set$4 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	create: create$c,
	toArray: toArray$1
});

var create_1$6 = create$c;
var set_1$2 = set$4;
var toArray_1 = toArray$1;


var set7ae96d21 = {
	create: create_1$6,
	set: set_1$2,
	toArray: toArray_1
};

/**
 * Utility module to work with Arrays.
 *
 * @module array
 */

/**
 * Return the last element of an array. The element must exist
 *
 * @template L
 * @param {Array<L>} arr
 * @return {L}
 */
const last$1 = arr => arr[arr.length - 1];

/**
 * @template C
 * @return {Array<C>}
 */
const create$b = () => /** @type {Array<C>} */ ([]);

/**
 * @template D
 * @param {Array<D>} a
 * @return {Array<D>}
 */
const copy$2 = a => /** @type {Array<D>} */ (a.slice());

/**
 * Append elements from src to dest
 *
 * @template M
 * @param {Array<M>} dest
 * @param {Array<M>} src
 */
const appendTo$1 = (dest, src) => {
  for (let i = 0; i < src.length; i++) {
    dest.push(src[i]);
  }
};

/**
 * Transforms something array-like to an actual Array.
 *
 * @function
 * @template T
 * @param {ArrayLike<T>|Iterable<T>} arraylike
 * @return {T}
 */
const from$1 = Array.from;

/**
 * True iff condition holds on every element in the Array.
 *
 * @function
 * @template ITEM
 *
 * @param {Array<ITEM>} arr
 * @param {function(ITEM, number, Array<ITEM>):boolean} f
 * @return {boolean}
 */
const every$3 = (arr, f) => arr.every(f);

/**
 * True iff condition holds on some element in the Array.
 *
 * @function
 * @template S
 * @param {Array<S>} arr
 * @param {function(S, number, Array<S>):boolean} f
 * @return {boolean}
 */
const some$3 = (arr, f) => arr.some(f);

/**
 * @template ELEM
 *
 * @param {Array<ELEM>} a
 * @param {Array<ELEM>} b
 * @return {boolean}
 */
const equalFlat$3 = (a, b) => a.length === b.length && every$3(a, (item, index) => item === b[index]);

/**
 * @template ELEM
 * @param {Array<Array<ELEM>>} arr
 * @return {Array<ELEM>}
 */
const flatten$1 = arr => arr.reduce((acc, val) => acc.concat(val), []);

var array$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  last: last$1,
  create: create$b,
  copy: copy$2,
  appendTo: appendTo$1,
  from: from$1,
  every: every$3,
  some: some$3,
  equalFlat: equalFlat$3,
  flatten: flatten$1
});

var appendTo_1 = appendTo$1;
var array_1$1 = array$2;
var copy_1 = copy$2;
var create_1$5 = create$b;
var equalFlat_1$1 = equalFlat$3;
var every_1$1 = every$3;
var flatten_1 = flatten$1;
var from_1 = from$1;
var last_1 = last$1;
var some_1$1 = some$3;


var arrayB2d24238 = {
	appendTo: appendTo_1,
	array: array_1$1,
	copy: copy_1,
	create: create_1$5,
	equalFlat: equalFlat_1$1,
	every: every_1$1,
	flatten: flatten_1,
	from: from_1,
	last: last_1,
	some: some_1$1
};

var map$4 = map28a001c9;

var set$3 = set7ae96d21;

var array$1 = arrayB2d24238;

/**
 * Observable class prototype.
 *
 * @module observable
 */

/**
 * Handles named events.
 *
 * @template N
 */
class Observable {
  constructor () {
    /**
     * Some desc.
     * @type {Map<N, any>}
     */
    this._observers = map$4.create();
  }

  /**
   * @param {N} name
   * @param {function} f
   */
  on (name, f) {
    map$4.setIfUndefined(this._observers, name, set$3.create).add(f);
  }

  /**
   * @param {N} name
   * @param {function} f
   */
  once (name, f) {
    /**
     * @param  {...any} args
     */
    const _f = (...args) => {
      this.off(name, _f);
      f(...args);
    };
    this.on(name, _f);
  }

  /**
   * @param {N} name
   * @param {function} f
   */
  off (name, f) {
    const observers = this._observers.get(name);
    if (observers !== undefined) {
      observers.delete(f);
      if (observers.size === 0) {
        this._observers.delete(name);
      }
    }
  }

  /**
   * Emit a named event. All registered event listeners that listen to the
   * specified name will receive the event.
   *
   * @todo This should catch exceptions
   *
   * @param {N} name The event name.
   * @param {Array<any>} args The arguments that are applied to the event listener.
   */
  emit (name, args) {
    // copy all listeners to an array first to make sure that no event is emitted to listeners that are subscribed while the event handler is called.
    return array$1.from((this._observers.get(name) || map$4.create()).values()).forEach(f => f(...args))
  }

  destroy () {
    this._observers = map$4.create();
  }
}

var Observable_1 = Observable;


var observable$1 = /*#__PURE__*/Object.defineProperty({
	Observable: Observable_1
}, '__esModule', {value: true});

var appendTo = array$1.appendTo;
var copy$1 = array$1.copy;
var create$a = array$1.create;
var equalFlat$2 = array$1.equalFlat;
var every$2 = array$1.every;
var flatten = array$1.flatten;
var from = array$1.from;
var last = array$1.last;
var some$2 = array$1.some;


var array_1 = /*#__PURE__*/Object.defineProperty({
	appendTo: appendTo,
	copy: copy$1,
	create: create$a,
	equalFlat: equalFlat$2,
	every: every$2,
	flatten: flatten,
	from: from,
	last: last,
	some: some$2
}, '__esModule', {value: true});

/**
 * Common Math expressions.
 *
 * @module math
 */

const floor$1 = Math.floor;
const ceil$1 = Math.ceil;
const abs$1 = Math.abs;
const imul$1 = Math.imul;
const round$1 = Math.round;
const log10$1 = Math.log10;
const log2$1 = Math.log2;
const log$1 = Math.log;
const sqrt$1 = Math.sqrt;

/**
 * @function
 * @param {number} a
 * @param {number} b
 * @return {number} The sum of a and b
 */
const add$1 = (a, b) => a + b;

/**
 * @function
 * @param {number} a
 * @param {number} b
 * @return {number} The smaller element of a and b
 */
const min$1 = (a, b) => a < b ? a : b;

/**
 * @function
 * @param {number} a
 * @param {number} b
 * @return {number} The bigger element of a and b
 */
const max$1 = (a, b) => a > b ? a : b;

const isNaN$1 = Number.isNaN;

const pow$1 = Math.pow;
/**
 * Base 10 exponential function. Returns the value of 10 raised to the power of pow.
 *
 * @param {number} exp
 * @return {number}
 */
const exp10$1 = exp => Math.pow(10, exp);

const sign$1 = Math.sign;

/**
 * @param {number} n
 * @return {boolean} Wether n is negative. This function also differentiates between -0 and +0
 */
const isNegativeZero$1 = n => n !== 0 ? n < 0 : 1 / n < 0;

var math$2 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	floor: floor$1,
	ceil: ceil$1,
	abs: abs$1,
	imul: imul$1,
	round: round$1,
	log10: log10$1,
	log2: log2$1,
	log: log$1,
	sqrt: sqrt$1,
	add: add$1,
	min: min$1,
	max: max$1,
	isNaN: isNaN$1,
	pow: pow$1,
	exp10: exp10$1,
	sign: sign$1,
	isNegativeZero: isNegativeZero$1
});

var abs_1 = abs$1;
var add_1 = add$1;
var ceil_1 = ceil$1;
var exp10_1 = exp10$1;
var floor_1 = floor$1;
var imul_1 = imul$1;
var _isNaN$2 = isNaN$1;
var isNegativeZero_1 = isNegativeZero$1;
var log_1 = log$1;
var log10_1 = log10$1;
var log2_1 = log2$1;
var math_1$1 = math$2;
var max_1 = max$1;
var min_1 = min$1;
var pow_1 = pow$1;
var round_1 = round$1;
var sign_1 = sign$1;
var sqrt_1 = sqrt$1;


var math08e068f9 = {
	abs: abs_1,
	add: add_1,
	ceil: ceil_1,
	exp10: exp10_1,
	floor: floor_1,
	imul: imul_1,
	isNaN: _isNaN$2,
	isNegativeZero: isNegativeZero_1,
	log: log_1,
	log10: log10_1,
	log2: log2_1,
	math: math_1$1,
	max: max_1,
	min: min_1,
	pow: pow_1,
	round: round_1,
	sign: sign_1,
	sqrt: sqrt_1
};

var math$1 = math08e068f9;

var abs = math$1.abs;
var add = math$1.add;
var ceil = math$1.ceil;
var exp10 = math$1.exp10;
var floor = math$1.floor;
var imul = math$1.imul;
var _isNaN$1 = math$1.isNaN;
var isNegativeZero = math$1.isNegativeZero;
var log = math$1.log;
var log10 = math$1.log10;
var log2 = math$1.log2;
var max = math$1.max;
var min = math$1.min;
var pow = math$1.pow;
var round = math$1.round;
var sign = math$1.sign;
var sqrt = math$1.sqrt;


var math_1 = /*#__PURE__*/Object.defineProperty({
	abs: abs,
	add: add,
	ceil: ceil,
	exp10: exp10,
	floor: floor,
	imul: imul,
	isNaN: _isNaN$1,
	isNegativeZero: isNegativeZero,
	log: log,
	log10: log10,
	log2: log2,
	max: max,
	min: min,
	pow: pow,
	round: round,
	sign: sign,
	sqrt: sqrt
}, '__esModule', {value: true});

var all$2 = map$4.all;
var any = map$4.any;
var copy = map$4.copy;
var create$9 = map$4.create;
var map_2 = map$4.map;
var setIfUndefined = map$4.setIfUndefined;


var map_1$2 = /*#__PURE__*/Object.defineProperty({
	all: all$2,
	any: any,
	copy: copy,
	create: create$9,
	map: map_2,
	setIfUndefined: setIfUndefined
}, '__esModule', {value: true});

var stringF3c3d805 = createCommonjsModule(function (module, exports) {

/**
 * Utility module to work with strings.
 *
 * @module string
 */

const fromCharCode = String.fromCharCode;
const fromCodePoint = String.fromCodePoint;

/**
 * @param {string} s
 * @return {string}
 */
const toLowerCase = s => s.toLowerCase();

const trimLeftRegex = /^\s*/g;

/**
 * @param {string} s
 * @return {string}
 */
const trimLeft = s => s.replace(trimLeftRegex, '');

const fromCamelCaseRegex = /([A-Z])/g;

/**
 * @param {string} s
 * @param {string} separator
 * @return {string}
 */
const fromCamelCase = (s, separator) => trimLeft(s.replace(fromCamelCaseRegex, match => `${separator}${toLowerCase(match)}`));

/**
 * Compute the utf8ByteLength
 * @param {string} str
 * @return {number}
 */
const utf8ByteLength = str => unescape(encodeURIComponent(str)).length;

/**
 * @param {string} str
 * @return {Uint8Array}
 */
const _encodeUtf8Polyfill = str => {
  const encodedString = unescape(encodeURIComponent(str));
  const len = encodedString.length;
  const buf = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    buf[i] = /** @type {number} */ (encodedString.codePointAt(i));
  }
  return buf
};

/* istanbul ignore next */
const utf8TextEncoder = /** @type {TextEncoder} */ (typeof TextEncoder !== 'undefined' ? new TextEncoder() : null);

/**
 * @param {string} str
 * @return {Uint8Array}
 */
const _encodeUtf8Native = str => utf8TextEncoder.encode(str);

/**
 * @param {string} str
 * @return {Uint8Array}
 */
/* istanbul ignore next */
const encodeUtf8 = utf8TextEncoder ? _encodeUtf8Native : _encodeUtf8Polyfill;

/**
 * @param {Uint8Array} buf
 * @return {string}
 */
const _decodeUtf8Polyfill = buf => {
  let remainingLen = buf.length;
  let encodedString = '';
  let bufPos = 0;
  while (remainingLen > 0) {
    const nextLen = remainingLen < 10000 ? remainingLen : 10000;
    const bytes = buf.subarray(bufPos, bufPos + nextLen);
    bufPos += nextLen;
    // Starting with ES5.1 we can supply a generic array-like object as arguments
    encodedString += String.fromCodePoint.apply(null, /** @type {any} */ (bytes));
    remainingLen -= nextLen;
  }
  return decodeURIComponent(escape(encodedString))
};

/* istanbul ignore next */
exports.utf8TextDecoder = typeof TextDecoder === 'undefined' ? null : new TextDecoder('utf-8', { fatal: true, ignoreBOM: true });

/* istanbul ignore next */
if (exports.utf8TextDecoder && exports.utf8TextDecoder.decode(new Uint8Array()).length === 1) {
  // Safari doesn't handle BOM correctly.
  // This fixes a bug in Safari 13.0.5 where it produces a BOM the first time it is called.
  // utf8TextDecoder.decode(new Uint8Array()).length === 1 on the first call and
  // utf8TextDecoder.decode(new Uint8Array()).length === 1 on the second call
  // Another issue is that from then on no BOM chars are recognized anymore
  /* istanbul ignore next */
  exports.utf8TextDecoder = null;
}

/**
 * @param {Uint8Array} buf
 * @return {string}
 */
const _decodeUtf8Native = buf => /** @type {TextDecoder} */ (exports.utf8TextDecoder).decode(buf);

/**
 * @param {Uint8Array} buf
 * @return {string}
 */
/* istanbul ignore next */
const decodeUtf8 = exports.utf8TextDecoder ? _decodeUtf8Native : _decodeUtf8Polyfill;

var string = /*#__PURE__*/Object.freeze({
  __proto__: null,
  fromCharCode: fromCharCode,
  fromCodePoint: fromCodePoint,
  trimLeft: trimLeft,
  fromCamelCase: fromCamelCase,
  utf8ByteLength: utf8ByteLength,
  _encodeUtf8Polyfill: _encodeUtf8Polyfill,
  utf8TextEncoder: utf8TextEncoder,
  _encodeUtf8Native: _encodeUtf8Native,
  encodeUtf8: encodeUtf8,
  _decodeUtf8Polyfill: _decodeUtf8Polyfill,
  get utf8TextDecoder () { return exports.utf8TextDecoder; },
  _decodeUtf8Native: _decodeUtf8Native,
  decodeUtf8: decodeUtf8
});

exports._decodeUtf8Native = _decodeUtf8Native;
exports._decodeUtf8Polyfill = _decodeUtf8Polyfill;
exports._encodeUtf8Native = _encodeUtf8Native;
exports._encodeUtf8Polyfill = _encodeUtf8Polyfill;
exports.decodeUtf8 = decodeUtf8;
exports.encodeUtf8 = encodeUtf8;
exports.fromCamelCase = fromCamelCase;
exports.fromCharCode = fromCharCode;
exports.fromCodePoint = fromCodePoint;
exports.string = string;
exports.trimLeft = trimLeft;
exports.utf8ByteLength = utf8ByteLength;
exports.utf8TextEncoder = utf8TextEncoder;

});

/**
 * Often used conditions.
 *
 * @module conditions
 */

/**
 * @template T
 * @param {T|null|undefined} v
 * @return {T|null}
 */
/* istanbul ignore next */
const undefinedToNull = v => v === undefined ? null : v;

var conditions$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	undefinedToNull: undefinedToNull
});

var conditions_1 = conditions$1;
var undefinedToNull_1 = undefinedToNull;


var conditionsFb475c70 = {
	conditions: conditions_1,
	undefinedToNull: undefinedToNull_1
};

/* global localStorage, addEventListener */

/**
 * Isomorphic variable storage.
 *
 * Uses LocalStorage in the browser and falls back to in-memory storage.
 *
 * @module storage
 */

/* istanbul ignore next */
class VarStoragePolyfill {
  constructor () {
    this.map = new Map();
  }

  /**
   * @param {string} key
   * @param {any} newValue
   */
  setItem (key, newValue) {
    this.map.set(key, newValue);
  }

  /**
   * @param {string} key
   */
  getItem (key) {
    return this.map.get(key)
  }
}

/* istanbul ignore next */
/**
 * @type {any}
 */
let _localStorage = new VarStoragePolyfill();
let usePolyfill = true;

try {
  // if the same-origin rule is violated, accessing localStorage might thrown an error
  /* istanbul ignore next */
  if (typeof localStorage !== 'undefined') {
    _localStorage = localStorage;
    usePolyfill = false;
  }
} catch (e) { }

/* istanbul ignore next */
/**
 * This is basically localStorage in browser, or a polyfill in nodejs
 */
const varStorage = _localStorage;

/* istanbul ignore next */
/**
 * A polyfill for `addEventListener('storage', event => {..})` that does nothing if the polyfill is being used.
 *
 * @param {function({ key: string, newValue: string, oldValue: string }): void} eventHandler
 * @function
 */
const onChange = eventHandler => usePolyfill || addEventListener('storage', /** @type {any} */ (eventHandler));

var onChange_1 = onChange;
var varStorage_1 = varStorage;


var storage$1 = /*#__PURE__*/Object.defineProperty({
	onChange: onChange_1,
	varStorage: varStorage_1
}, '__esModule', {value: true});

var string = stringF3c3d805;

var conditions = conditionsFb475c70;

var storage = storage$1;

/**
 * Isomorphic module to work access the environment (query params, env variables).
 *
 * @module map
 */

/* istanbul ignore next */
// @ts-ignore
const isNode$1 = typeof process !== 'undefined' && process.release && /node|io\.js/.test(process.release.name);
/* istanbul ignore next */
const isBrowser = typeof window !== 'undefined' && !isNode$1;
/* istanbul ignore next */
const isMac = typeof navigator !== 'undefined' ? /Mac/.test(navigator.platform) : false;

/**
 * @type {Map<string,string>}
 */
let params;

/* istanbul ignore next */
const computeParams = () => {
  if (params === undefined) {
    if (isNode$1) {
      params = map$4.create();
      const pargs = process.argv;
      let currParamName = null;
      /* istanbul ignore next */
      for (let i = 0; i < pargs.length; i++) {
        const parg = pargs[i];
        if (parg[0] === '-') {
          if (currParamName !== null) {
            params.set(currParamName, '');
          }
          currParamName = parg;
        } else {
          if (currParamName !== null) {
            params.set(currParamName, parg);
            currParamName = null;
          }
        }
      }
      if (currParamName !== null) {
        params.set(currParamName, '');
      }
    // in ReactNative for example this would not be true (unless connected to the Remote Debugger)
    } else if (typeof location === 'object') {
      params = map$4.create()
      // eslint-disable-next-line no-undef
      ;(location.search || '?').slice(1).split('&').forEach(kv => {
        if (kv.length !== 0) {
          const [key, value] = kv.split('=');
          params.set(`--${string.fromCamelCase(key, '-')}`, value);
          params.set(`-${string.fromCamelCase(key, '-')}`, value);
        }
      });
    } else {
      params = map$4.create();
    }
  }
  return params
};

/**
 * @param {string} name
 * @return {boolean}
 */
/* istanbul ignore next */
const hasParam = name => computeParams().has(name);

/**
 * @param {string} name
 * @param {string} defaultVal
 * @return {string}
 */
/* istanbul ignore next */
const getParam = (name, defaultVal) => computeParams().get(name) || defaultVal;
// export const getArgs = name => computeParams() && args

/**
 * @param {string} name
 * @return {string|null}
 */
/* istanbul ignore next */
const getVariable = name => isNode$1 ? conditions.undefinedToNull(process.env[name.toUpperCase()]) : conditions.undefinedToNull(storage.varStorage.getItem(name));

/**
 * @param {string} name
 * @return {string|null}
 */
const getConf = name => computeParams().get('--' + name) || getVariable(name);

/**
 * @param {string} name
 * @return {boolean}
 */
/* istanbul ignore next */
const hasConf = name => hasParam('--' + name) || getVariable(name) !== null;

/* istanbul ignore next */
const production = hasConf('production');

var environment$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  isNode: isNode$1,
  isBrowser: isBrowser,
  isMac: isMac,
  hasParam: hasParam,
  getParam: getParam,
  getVariable: getVariable,
  getConf: getConf,
  hasConf: hasConf,
  production: production
});

var environment_1 = environment$1;
var getConf_1 = getConf;
var getParam_1 = getParam;
var getVariable_1 = getVariable;
var hasConf_1 = hasConf;
var hasParam_1 = hasParam;
var isBrowser_1 = isBrowser;
var isMac_1 = isMac;
var isNode_1 = isNode$1;
var production_1 = production;


var environment7e2ffaea = {
	environment: environment_1,
	getConf: getConf_1,
	getParam: getParam_1,
	getVariable: getVariable_1,
	hasConf: hasConf_1,
	hasParam: hasParam_1,
	isBrowser: isBrowser_1,
	isMac: isMac_1,
	isNode: isNode_1,
	production: production_1
};

/* eslint-env browser */

/**
 * Binary data constants.
 *
 * @module binary
 */

/**
 * n-th bit activated.
 *
 * @type {number}
 */
const BIT1$1 = 1;
const BIT2$1 = 2;
const BIT3$1 = 4;
const BIT4$1 = 8;
const BIT5$1 = 16;
const BIT6$1 = 32;
const BIT7$1 = 64;
const BIT8$1 = 128;
const BIT9$1 = 256;
const BIT10$1 = 512;
const BIT11$1 = 1024;
const BIT12$1 = 2048;
const BIT13$1 = 4096;
const BIT14$1 = 8192;
const BIT15$1 = 16384;
const BIT16$1 = 32768;
const BIT17$1 = 65536;
const BIT18$1 = 1 << 17;
const BIT19$1 = 1 << 18;
const BIT20$1 = 1 << 19;
const BIT21$1 = 1 << 20;
const BIT22$1 = 1 << 21;
const BIT23$1 = 1 << 22;
const BIT24$1 = 1 << 23;
const BIT25$1 = 1 << 24;
const BIT26$1 = 1 << 25;
const BIT27$1 = 1 << 26;
const BIT28$1 = 1 << 27;
const BIT29$1 = 1 << 28;
const BIT30$1 = 1 << 29;
const BIT31$1 = 1 << 30;
const BIT32$1 = 1 << 31;

/**
 * First n bits activated.
 *
 * @type {number}
 */
const BITS0$1 = 0;
const BITS1$1 = 1;
const BITS2$1 = 3;
const BITS3$1 = 7;
const BITS4$1 = 15;
const BITS5$1 = 31;
const BITS6$1 = 63;
const BITS7$1 = 127;
const BITS8$1 = 255;
const BITS9$1 = 511;
const BITS10$1 = 1023;
const BITS11$1 = 2047;
const BITS12$1 = 4095;
const BITS13$1 = 8191;
const BITS14$1 = 16383;
const BITS15$1 = 32767;
const BITS16$1 = 65535;
const BITS17$1 = BIT18$1 - 1;
const BITS18$1 = BIT19$1 - 1;
const BITS19$1 = BIT20$1 - 1;
const BITS20$1 = BIT21$1 - 1;
const BITS21$1 = BIT22$1 - 1;
const BITS22$1 = BIT23$1 - 1;
const BITS23$1 = BIT24$1 - 1;
const BITS24$1 = BIT25$1 - 1;
const BITS25$1 = BIT26$1 - 1;
const BITS26$1 = BIT27$1 - 1;
const BITS27$1 = BIT28$1 - 1;
const BITS28$1 = BIT29$1 - 1;
const BITS29$1 = BIT30$1 - 1;
const BITS30$1 = BIT31$1 - 1;
/**
 * @type {number}
 */
const BITS31$1 = 0x7FFFFFFF;
/**
 * @type {number}
 */
const BITS32$1 = 0xFFFFFFFF;

var binary$2 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	BIT1: BIT1$1,
	BIT2: BIT2$1,
	BIT3: BIT3$1,
	BIT4: BIT4$1,
	BIT5: BIT5$1,
	BIT6: BIT6$1,
	BIT7: BIT7$1,
	BIT8: BIT8$1,
	BIT9: BIT9$1,
	BIT10: BIT10$1,
	BIT11: BIT11$1,
	BIT12: BIT12$1,
	BIT13: BIT13$1,
	BIT14: BIT14$1,
	BIT15: BIT15$1,
	BIT16: BIT16$1,
	BIT17: BIT17$1,
	BIT18: BIT18$1,
	BIT19: BIT19$1,
	BIT20: BIT20$1,
	BIT21: BIT21$1,
	BIT22: BIT22$1,
	BIT23: BIT23$1,
	BIT24: BIT24$1,
	BIT25: BIT25$1,
	BIT26: BIT26$1,
	BIT27: BIT27$1,
	BIT28: BIT28$1,
	BIT29: BIT29$1,
	BIT30: BIT30$1,
	BIT31: BIT31$1,
	BIT32: BIT32$1,
	BITS0: BITS0$1,
	BITS1: BITS1$1,
	BITS2: BITS2$1,
	BITS3: BITS3$1,
	BITS4: BITS4$1,
	BITS5: BITS5$1,
	BITS6: BITS6$1,
	BITS7: BITS7$1,
	BITS8: BITS8$1,
	BITS9: BITS9$1,
	BITS10: BITS10$1,
	BITS11: BITS11$1,
	BITS12: BITS12$1,
	BITS13: BITS13$1,
	BITS14: BITS14$1,
	BITS15: BITS15$1,
	BITS16: BITS16$1,
	BITS17: BITS17$1,
	BITS18: BITS18$1,
	BITS19: BITS19$1,
	BITS20: BITS20$1,
	BITS21: BITS21$1,
	BITS22: BITS22$1,
	BITS23: BITS23$1,
	BITS24: BITS24$1,
	BITS25: BITS25$1,
	BITS26: BITS26$1,
	BITS27: BITS27$1,
	BITS28: BITS28$1,
	BITS29: BITS29$1,
	BITS30: BITS30$1,
	BITS31: BITS31$1,
	BITS32: BITS32$1
});

var BIT1_1 = BIT1$1;
var BIT10_1 = BIT10$1;
var BIT11_1 = BIT11$1;
var BIT12_1 = BIT12$1;
var BIT13_1 = BIT13$1;
var BIT14_1 = BIT14$1;
var BIT15_1 = BIT15$1;
var BIT16_1 = BIT16$1;
var BIT17_1 = BIT17$1;
var BIT18_1 = BIT18$1;
var BIT19_1 = BIT19$1;
var BIT2_1 = BIT2$1;
var BIT20_1 = BIT20$1;
var BIT21_1 = BIT21$1;
var BIT22_1 = BIT22$1;
var BIT23_1 = BIT23$1;
var BIT24_1 = BIT24$1;
var BIT25_1 = BIT25$1;
var BIT26_1 = BIT26$1;
var BIT27_1 = BIT27$1;
var BIT28_1 = BIT28$1;
var BIT29_1 = BIT29$1;
var BIT3_1 = BIT3$1;
var BIT30_1 = BIT30$1;
var BIT31_1 = BIT31$1;
var BIT32_1 = BIT32$1;
var BIT4_1 = BIT4$1;
var BIT5_1 = BIT5$1;
var BIT6_1 = BIT6$1;
var BIT7_1 = BIT7$1;
var BIT8_1 = BIT8$1;
var BIT9_1 = BIT9$1;
var BITS0_1 = BITS0$1;
var BITS1_1 = BITS1$1;
var BITS10_1 = BITS10$1;
var BITS11_1 = BITS11$1;
var BITS12_1 = BITS12$1;
var BITS13_1 = BITS13$1;
var BITS14_1 = BITS14$1;
var BITS15_1 = BITS15$1;
var BITS16_1 = BITS16$1;
var BITS17_1 = BITS17$1;
var BITS18_1 = BITS18$1;
var BITS19_1 = BITS19$1;
var BITS2_1 = BITS2$1;
var BITS20_1 = BITS20$1;
var BITS21_1 = BITS21$1;
var BITS22_1 = BITS22$1;
var BITS23_1 = BITS23$1;
var BITS24_1 = BITS24$1;
var BITS25_1 = BITS25$1;
var BITS26_1 = BITS26$1;
var BITS27_1 = BITS27$1;
var BITS28_1 = BITS28$1;
var BITS29_1 = BITS29$1;
var BITS3_1 = BITS3$1;
var BITS30_1 = BITS30$1;
var BITS31_1 = BITS31$1;
var BITS32_1 = BITS32$1;
var BITS4_1 = BITS4$1;
var BITS5_1 = BITS5$1;
var BITS6_1 = BITS6$1;
var BITS7_1 = BITS7$1;
var BITS8_1 = BITS8$1;
var BITS9_1 = BITS9$1;
var binary_1$1 = binary$2;


var binaryAc8e39e2 = {
	BIT1: BIT1_1,
	BIT10: BIT10_1,
	BIT11: BIT11_1,
	BIT12: BIT12_1,
	BIT13: BIT13_1,
	BIT14: BIT14_1,
	BIT15: BIT15_1,
	BIT16: BIT16_1,
	BIT17: BIT17_1,
	BIT18: BIT18_1,
	BIT19: BIT19_1,
	BIT2: BIT2_1,
	BIT20: BIT20_1,
	BIT21: BIT21_1,
	BIT22: BIT22_1,
	BIT23: BIT23_1,
	BIT24: BIT24_1,
	BIT25: BIT25_1,
	BIT26: BIT26_1,
	BIT27: BIT27_1,
	BIT28: BIT28_1,
	BIT29: BIT29_1,
	BIT3: BIT3_1,
	BIT30: BIT30_1,
	BIT31: BIT31_1,
	BIT32: BIT32_1,
	BIT4: BIT4_1,
	BIT5: BIT5_1,
	BIT6: BIT6_1,
	BIT7: BIT7_1,
	BIT8: BIT8_1,
	BIT9: BIT9_1,
	BITS0: BITS0_1,
	BITS1: BITS1_1,
	BITS10: BITS10_1,
	BITS11: BITS11_1,
	BITS12: BITS12_1,
	BITS13: BITS13_1,
	BITS14: BITS14_1,
	BITS15: BITS15_1,
	BITS16: BITS16_1,
	BITS17: BITS17_1,
	BITS18: BITS18_1,
	BITS19: BITS19_1,
	BITS2: BITS2_1,
	BITS20: BITS20_1,
	BITS21: BITS21_1,
	BITS22: BITS22_1,
	BITS23: BITS23_1,
	BITS24: BITS24_1,
	BITS25: BITS25_1,
	BITS26: BITS26_1,
	BITS27: BITS27_1,
	BITS28: BITS28_1,
	BITS29: BITS29_1,
	BITS3: BITS3_1,
	BITS30: BITS30_1,
	BITS31: BITS31_1,
	BITS32: BITS32_1,
	BITS4: BITS4_1,
	BITS5: BITS5_1,
	BITS6: BITS6_1,
	BITS7: BITS7_1,
	BITS8: BITS8_1,
	BITS9: BITS9_1,
	binary: binary_1$1
};

var binary$1 = binaryAc8e39e2;

/**
 * Utility helpers for working with numbers.
 *
 * @module number
 */

const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
const MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER;

const LOWEST_INT32 = 1 << 31;
/**
 * @type {number}
 */
const HIGHEST_INT32 = binary$1.BITS31;

/**
 * @module number
 */

/* istanbul ignore next */
const isInteger = Number.isInteger || (num => typeof num === 'number' && isFinite(num) && math$1.floor(num) === num);
const isNaN = Number.isNaN;
const parseInt$1 = Number.parseInt;

var number$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	MAX_SAFE_INTEGER: MAX_SAFE_INTEGER,
	MIN_SAFE_INTEGER: MIN_SAFE_INTEGER,
	LOWEST_INT32: LOWEST_INT32,
	HIGHEST_INT32: HIGHEST_INT32,
	isInteger: isInteger,
	isNaN: isNaN,
	parseInt: parseInt$1
});

var HIGHEST_INT32_1 = HIGHEST_INT32;
var LOWEST_INT32_1 = LOWEST_INT32;
var MAX_SAFE_INTEGER_1 = MAX_SAFE_INTEGER;
var MIN_SAFE_INTEGER_1 = MIN_SAFE_INTEGER;
var isInteger_1 = isInteger;
var _isNaN = isNaN;
var number_1 = number$1;
var _parseInt = parseInt$1;


var numberE62129bc = {
	HIGHEST_INT32: HIGHEST_INT32_1,
	LOWEST_INT32: LOWEST_INT32_1,
	MAX_SAFE_INTEGER: MAX_SAFE_INTEGER_1,
	MIN_SAFE_INTEGER: MIN_SAFE_INTEGER_1,
	isInteger: isInteger_1,
	isNaN: _isNaN,
	number: number_1,
	parseInt: _parseInt
};

var environment = environment7e2ffaea;

var number = numberE62129bc;

/**
 * Efficient schema-less binary encoding with support for variable length encoding.
 *
 * Use [lib0/encoding] with [lib0/decoding]. Every encoding function has a corresponding decoding function.
 *
 * Encodes numbers in little-endian order (least to most significant byte order)
 * and is compatible with Golang's binary encoding (https://golang.org/pkg/encoding/binary/)
 * which is also used in Protocol Buffers.
 *
 * ```js
 * // encoding step
 * const encoder = new encoding.createEncoder()
 * encoding.writeVarUint(encoder, 256)
 * encoding.writeVarString(encoder, 'Hello world!')
 * const buf = encoding.toUint8Array(encoder)
 * ```
 *
 * ```js
 * // decoding step
 * const decoder = new decoding.createDecoder(buf)
 * decoding.readVarUint(decoder) // => 256
 * decoding.readVarString(decoder) // => 'Hello world!'
 * decoding.hasContent(decoder) // => false - all data is read
 * ```
 *
 * @module encoding
 */

/**
 * A BinaryEncoder handles the encoding to an Uint8Array.
 */
class Encoder$1 {
  constructor () {
    this.cpos = 0;
    this.cbuf = new Uint8Array(100);
    /**
     * @type {Array<Uint8Array>}
     */
    this.bufs = [];
  }
}

/**
 * @function
 * @return {Encoder}
 */
const createEncoder$1 = () => new Encoder$1();

/**
 * The current length of the encoded data.
 *
 * @function
 * @param {Encoder} encoder
 * @return {number}
 */
const length$3 = encoder => {
  let len = encoder.cpos;
  for (let i = 0; i < encoder.bufs.length; i++) {
    len += encoder.bufs[i].length;
  }
  return len
};

/**
 * Transform to Uint8Array.
 *
 * @function
 * @param {Encoder} encoder
 * @return {Uint8Array} The created ArrayBuffer.
 */
const toUint8Array$1 = encoder => {
  const uint8arr = new Uint8Array(length$3(encoder));
  let curPos = 0;
  for (let i = 0; i < encoder.bufs.length; i++) {
    const d = encoder.bufs[i];
    uint8arr.set(d, curPos);
    curPos += d.length;
  }
  uint8arr.set(createUint8ArrayViewFromArrayBuffer$1(encoder.cbuf.buffer, 0, encoder.cpos), curPos);
  return uint8arr
};

/**
 * Verify that it is possible to write `len` bytes wtihout checking. If
 * necessary, a new Buffer with the required length is attached.
 *
 * @param {Encoder} encoder
 * @param {number} len
 */
const verifyLen = (encoder, len) => {
  const bufferLen = encoder.cbuf.length;
  if (bufferLen - encoder.cpos < len) {
    encoder.bufs.push(createUint8ArrayViewFromArrayBuffer$1(encoder.cbuf.buffer, 0, encoder.cpos));
    encoder.cbuf = new Uint8Array(math$1.max(bufferLen, len) * 2);
    encoder.cpos = 0;
  }
};

/**
 * Write one byte to the encoder.
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} num The byte that is to be encoded.
 */
const write$1 = (encoder, num) => {
  const bufferLen = encoder.cbuf.length;
  if (encoder.cpos === bufferLen) {
    encoder.bufs.push(encoder.cbuf);
    encoder.cbuf = new Uint8Array(bufferLen * 2);
    encoder.cpos = 0;
  }
  encoder.cbuf[encoder.cpos++] = num;
};

/**
 * Write one byte at a specific position.
 * Position must already be written (i.e. encoder.length > pos)
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} pos Position to which to write data
 * @param {number} num Unsigned 8-bit integer
 */
const set$2 = (encoder, pos, num) => {
  let buffer = null;
  // iterate all buffers and adjust position
  for (let i = 0; i < encoder.bufs.length && buffer === null; i++) {
    const b = encoder.bufs[i];
    if (pos < b.length) {
      buffer = b; // found buffer
    } else {
      pos -= b.length;
    }
  }
  if (buffer === null) {
    // use current buffer
    buffer = encoder.cbuf;
  }
  buffer[pos] = num;
};

/**
 * Write one byte as an unsigned integer.
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} num The number that is to be encoded.
 */
const writeUint8$1 = write$1;

/**
 * Write one byte as an unsigned Integer at a specific location.
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} pos The location where the data will be written.
 * @param {number} num The number that is to be encoded.
 */
const setUint8$1 = set$2;

/**
 * Write two bytes as an unsigned integer.
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} num The number that is to be encoded.
 */
const writeUint16$1 = (encoder, num) => {
  write$1(encoder, num & binary$1.BITS8);
  write$1(encoder, (num >>> 8) & binary$1.BITS8);
};
/**
 * Write two bytes as an unsigned integer at a specific location.
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} pos The location where the data will be written.
 * @param {number} num The number that is to be encoded.
 */
const setUint16$1 = (encoder, pos, num) => {
  set$2(encoder, pos, num & binary$1.BITS8);
  set$2(encoder, pos + 1, (num >>> 8) & binary$1.BITS8);
};

/**
 * Write two bytes as an unsigned integer
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} num The number that is to be encoded.
 */
const writeUint32$1 = (encoder, num) => {
  for (let i = 0; i < 4; i++) {
    write$1(encoder, num & binary$1.BITS8);
    num >>>= 8;
  }
};

/**
 * Write two bytes as an unsigned integer in big endian order.
 * (most significant byte first)
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} num The number that is to be encoded.
 */
const writeUint32BigEndian$2 = (encoder, num) => {
  for (let i = 3; i >= 0; i--) {
    write$1(encoder, (num >>> (8 * i)) & binary$1.BITS8);
  }
};

/**
 * Write two bytes as an unsigned integer at a specific location.
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} pos The location where the data will be written.
 * @param {number} num The number that is to be encoded.
 */
const setUint32$1 = (encoder, pos, num) => {
  for (let i = 0; i < 4; i++) {
    set$2(encoder, pos + i, num & binary$1.BITS8);
    num >>>= 8;
  }
};

/**
 * Write a variable length unsigned integer.
 *
 * Encodes integers in the range from [0, 4294967295] / [0, 0xffffffff]. (max 32 bit unsigned integer)
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} num The number that is to be encoded.
 */
const writeVarUint$1 = (encoder, num) => {
  while (num > binary$1.BITS7) {
    write$1(encoder, binary$1.BIT8 | (binary$1.BITS7 & num));
    num >>>= 7;
  }
  write$1(encoder, binary$1.BITS7 & num);
};

/**
 * Write a variable length integer.
 *
 * Encodes integers in the range from [-2147483648, -2147483647].
 *
 * We don't use zig-zag encoding because we want to keep the option open
 * to use the same function for BigInt and 53bit integers (doubles).
 *
 * We use the 7th bit instead for signaling that this is a negative number.
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} num The number that is to be encoded.
 */
const writeVarInt$1 = (encoder, num) => {
  const isNegative = math$1.isNegativeZero(num);
  if (isNegative) {
    num = -num;
  }
  //             |- whether to continue reading         |- whether is negative     |- number
  write$1(encoder, (num > binary$1.BITS6 ? binary$1.BIT8 : 0) | (isNegative ? binary$1.BIT7 : 0) | (binary$1.BITS6 & num));
  num >>>= 6;
  // We don't need to consider the case of num === 0 so we can use a different
  // pattern here than above.
  while (num > 0) {
    write$1(encoder, (num > binary$1.BITS7 ? binary$1.BIT8 : 0) | (binary$1.BITS7 & num));
    num >>>= 7;
  }
};

/**
 * Write a variable length string.
 *
 * @function
 * @param {Encoder} encoder
 * @param {String} str The string that is to be encoded.
 */
const writeVarString$1 = (encoder, str) => {
  const encodedString = unescape(encodeURIComponent(str));
  const len = encodedString.length;
  writeVarUint$1(encoder, len);
  for (let i = 0; i < len; i++) {
    write$1(encoder, /** @type {number} */ (encodedString.codePointAt(i)));
  }
};

/**
 * Write the content of another Encoder.
 *
 * @TODO: can be improved!
 *        - Note: Should consider that when appending a lot of small Encoders, we should rather clone than referencing the old structure.
 *                Encoders start with a rather big initial buffer.
 *
 * @function
 * @param {Encoder} encoder The enUint8Arr
 * @param {Encoder} append The BinaryEncoder to be written.
 */
const writeBinaryEncoder$1 = (encoder, append) => writeUint8Array$1(encoder, toUint8Array$1(append));

/**
 * Append fixed-length Uint8Array to the encoder.
 *
 * @function
 * @param {Encoder} encoder
 * @param {Uint8Array} uint8Array
 */
const writeUint8Array$1 = (encoder, uint8Array) => {
  const bufferLen = encoder.cbuf.length;
  const cpos = encoder.cpos;
  const leftCopyLen = math$1.min(bufferLen - cpos, uint8Array.length);
  const rightCopyLen = uint8Array.length - leftCopyLen;
  encoder.cbuf.set(uint8Array.subarray(0, leftCopyLen), cpos);
  encoder.cpos += leftCopyLen;
  if (rightCopyLen > 0) {
    // Still something to write, write right half..
    // Append new buffer
    encoder.bufs.push(encoder.cbuf);
    // must have at least size of remaining buffer
    encoder.cbuf = new Uint8Array(math$1.max(bufferLen * 2, rightCopyLen));
    // copy array
    encoder.cbuf.set(uint8Array.subarray(leftCopyLen));
    encoder.cpos = rightCopyLen;
  }
};

/**
 * Append an Uint8Array to Encoder.
 *
 * @function
 * @param {Encoder} encoder
 * @param {Uint8Array} uint8Array
 */
const writeVarUint8Array$1 = (encoder, uint8Array) => {
  writeVarUint$1(encoder, uint8Array.byteLength);
  writeUint8Array$1(encoder, uint8Array);
};

/**
 * Create an DataView of the next `len` bytes. Use it to write data after
 * calling this function.
 *
 * ```js
 * // write float32 using DataView
 * const dv = writeOnDataView(encoder, 4)
 * dv.setFloat32(0, 1.1)
 * // read float32 using DataView
 * const dv = readFromDataView(encoder, 4)
 * dv.getFloat32(0) // => 1.100000023841858 (leaving it to the reader to find out why this is the correct result)
 * ```
 *
 * @param {Encoder} encoder
 * @param {number} len
 * @return {DataView}
 */
const writeOnDataView$1 = (encoder, len) => {
  verifyLen(encoder, len);
  const dview = new DataView(encoder.cbuf.buffer, encoder.cpos, len);
  encoder.cpos += len;
  return dview
};

/**
 * @param {Encoder} encoder
 * @param {number} num
 */
const writeFloat32$1 = (encoder, num) => writeOnDataView$1(encoder, 4).setFloat32(0, num, false);

/**
 * @param {Encoder} encoder
 * @param {number} num
 */
const writeFloat64$1 = (encoder, num) => writeOnDataView$1(encoder, 8).setFloat64(0, num, false);

/**
 * @param {Encoder} encoder
 * @param {bigint} num
 */
const writeBigInt64$1 = (encoder, num) => /** @type {any} */ (writeOnDataView$1(encoder, 8)).setBigInt64(0, num, false);

/**
 * @param {Encoder} encoder
 * @param {bigint} num
 */
const writeBigUint64$1 = (encoder, num) => /** @type {any} */ (writeOnDataView$1(encoder, 8)).setBigUint64(0, num, false);

const floatTestBed = new DataView(new ArrayBuffer(4));
/**
 * Check if a number can be encoded as a 32 bit float.
 *
 * @param {number} num
 * @return {boolean}
 */
const isFloat32 = num => {
  floatTestBed.setFloat32(0, num);
  return floatTestBed.getFloat32(0) === num
};

/**
 * Encode data with efficient binary format.
 *
 * Differences to JSON:
 * • Transforms data to a binary format (not to a string)
 * • Encodes undefined, NaN, and ArrayBuffer (these can't be represented in JSON)
 * • Numbers are efficiently encoded either as a variable length integer, as a
 *   32 bit float, as a 64 bit float, or as a 64 bit bigint.
 *
 * Encoding table:
 *
 * | Data Type           | Prefix   | Encoding Method    | Comment |
 * | ------------------- | -------- | ------------------ | ------- |
 * | undefined           | 127      |                    | Functions, symbol, and everything that cannot be identified is encoded as undefined |
 * | null                | 126      |                    | |
 * | integer             | 125      | writeVarInt        | Only encodes 32 bit signed integers |
 * | float32             | 124      | writeFloat32       | |
 * | float64             | 123      | writeFloat64       | |
 * | bigint              | 122      | writeBigInt64      | |
 * | boolean (false)     | 121      |                    | True and false are different data types so we save the following byte |
 * | boolean (true)      | 120      |                    | - 0b01111000 so the last bit determines whether true or false |
 * | string              | 119      | writeVarString     | |
 * | object<string,any>  | 118      | custom             | Writes {length} then {length} key-value pairs |
 * | array<any>          | 117      | custom             | Writes {length} then {length} json values |
 * | Uint8Array          | 116      | writeVarUint8Array | We use Uint8Array for any kind of binary data |
 *
 * Reasons for the decreasing prefix:
 * We need the first bit for extendability (later we may want to encode the
 * prefix with writeVarUint). The remaining 7 bits are divided as follows:
 * [0-30]   the beginning of the data range is used for custom purposes
 *          (defined by the function that uses this library)
 * [31-127] the end of the data range is used for data encoding by
 *          lib0/encoding.js
 *
 * @param {Encoder} encoder
 * @param {undefined|null|number|bigint|boolean|string|Object<string,any>|Array<any>|Uint8Array} data
 */
const writeAny$1 = (encoder, data) => {
  switch (typeof data) {
    case 'string':
      // TYPE 119: STRING
      write$1(encoder, 119);
      writeVarString$1(encoder, data);
      break
    case 'number':
      if (number.isInteger(data) && data <= binary$1.BITS31) {
        // TYPE 125: INTEGER
        write$1(encoder, 125);
        writeVarInt$1(encoder, data);
      } else if (isFloat32(data)) {
        // TYPE 124: FLOAT32
        write$1(encoder, 124);
        writeFloat32$1(encoder, data);
      } else {
        // TYPE 123: FLOAT64
        write$1(encoder, 123);
        writeFloat64$1(encoder, data);
      }
      break
    case 'bigint':
      // TYPE 122: BigInt
      write$1(encoder, 122);
      writeBigInt64$1(encoder, data);
      break
    case 'object':
      if (data === null) {
        // TYPE 126: null
        write$1(encoder, 126);
      } else if (data instanceof Array) {
        // TYPE 117: Array
        write$1(encoder, 117);
        writeVarUint$1(encoder, data.length);
        for (let i = 0; i < data.length; i++) {
          writeAny$1(encoder, data[i]);
        }
      } else if (data instanceof Uint8Array) {
        // TYPE 116: ArrayBuffer
        write$1(encoder, 116);
        writeVarUint8Array$1(encoder, data);
      } else {
        // TYPE 118: Object
        write$1(encoder, 118);
        const keys = Object.keys(data);
        writeVarUint$1(encoder, keys.length);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          writeVarString$1(encoder, key);
          writeAny$1(encoder, data[key]);
        }
      }
      break
    case 'boolean':
      // TYPE 120/121: boolean (true/false)
      write$1(encoder, data ? 120 : 121);
      break
    default:
      // TYPE 127: undefined
      write$1(encoder, 127);
  }
};

/**
 * Now come a few stateful encoder that have their own classes.
 */

/**
 * Basic Run Length Encoder - a basic compression implementation.
 *
 * Encodes [1,1,1,7] to [1,3,7,1] (3 times 1, 1 time 7). This encoder might do more harm than good if there are a lot of values that are not repeated.
 *
 * It was originally used for image compression. Cool .. article http://csbruce.com/cbm/transactor/pdfs/trans_v7_i06.pdf
 *
 * @note T must not be null!
 *
 * @template T
 */
class RleEncoder$1 extends Encoder$1 {
  /**
   * @param {function(Encoder, T):void} writer
   */
  constructor (writer) {
    super();
    /**
     * The writer
     */
    this.w = writer;
    /**
     * Current state
     * @type {T|null}
     */
    this.s = null;
    this.count = 0;
  }

  /**
   * @param {T} v
   */
  write (v) {
    if (this.s === v) {
      this.count++;
    } else {
      if (this.count > 0) {
        // flush counter, unless this is the first value (count = 0)
        writeVarUint$1(this, this.count - 1); // since count is always > 0, we can decrement by one. non-standard encoding ftw
      }
      this.count = 1;
      // write first value
      this.w(this, v);
      this.s = v;
    }
  }
}

/**
 * Basic diff decoder using variable length encoding.
 *
 * Encodes the values [3, 1100, 1101, 1050, 0] to [3, 1097, 1, -51, -1050] using writeVarInt.
 */
class IntDiffEncoder$1 extends Encoder$1 {
  /**
   * @param {number} start
   */
  constructor (start) {
    super();
    /**
     * Current state
     * @type {number}
     */
    this.s = start;
  }

  /**
   * @param {number} v
   */
  write (v) {
    writeVarInt$1(this, v - this.s);
    this.s = v;
  }
}

/**
 * A combination of IntDiffEncoder and RleEncoder.
 *
 * Basically first writes the IntDiffEncoder and then counts duplicate diffs using RleEncoding.
 *
 * Encodes the values [1,1,1,2,3,4,5,6] as [1,1,0,2,1,5] (RLE([1,0,0,1,1,1,1,1]) ⇒ RleIntDiff[1,1,0,2,1,5])
 */
class RleIntDiffEncoder$1 extends Encoder$1 {
  /**
   * @param {number} start
   */
  constructor (start) {
    super();
    /**
     * Current state
     * @type {number}
     */
    this.s = start;
    this.count = 0;
  }

  /**
   * @param {number} v
   */
  write (v) {
    if (this.s === v && this.count > 0) {
      this.count++;
    } else {
      if (this.count > 0) {
        // flush counter, unless this is the first value (count = 0)
        writeVarUint$1(this, this.count - 1); // since count is always > 0, we can decrement by one. non-standard encoding ftw
      }
      this.count = 1;
      // write first value
      writeVarInt$1(this, v - this.s);
      this.s = v;
    }
  }
}

/**
 * @param {UintOptRleEncoder} encoder
 */
const flushUintOptRleEncoder = encoder => {
  /* istanbul ignore else */
  if (encoder.count > 0) {
    // flush counter, unless this is the first value (count = 0)
    // case 1: just a single value. set sign to positive
    // case 2: write several values. set sign to negative to indicate that there is a length coming
    writeVarInt$1(encoder.encoder, encoder.count === 1 ? encoder.s : -encoder.s);
    if (encoder.count > 1) {
      writeVarUint$1(encoder.encoder, encoder.count - 2); // since count is always > 1, we can decrement by one. non-standard encoding ftw
    }
  }
};

/**
 * Optimized Rle encoder that does not suffer from the mentioned problem of the basic Rle encoder.
 *
 * Internally uses VarInt encoder to write unsigned integers. If the input occurs multiple times, we write
 * write it as a negative number. The UintOptRleDecoder then understands that it needs to read a count.
 *
 * Encodes [1,2,3,3,3] as [1,2,-3,3] (once 1, once 2, three times 3)
 */
class UintOptRleEncoder$1 {
  constructor () {
    this.encoder = new Encoder$1();
    /**
     * @type {number}
     */
    this.s = 0;
    this.count = 0;
  }

  /**
   * @param {number} v
   */
  write (v) {
    if (this.s === v) {
      this.count++;
    } else {
      flushUintOptRleEncoder(this);
      this.count = 1;
      this.s = v;
    }
  }

  toUint8Array () {
    flushUintOptRleEncoder(this);
    return toUint8Array$1(this.encoder)
  }
}

/**
 * Increasing Uint Optimized RLE Encoder
 *
 * The RLE encoder counts the number of same occurences of the same value.
 * The IncUintOptRle encoder counts if the value increases.
 * I.e. 7, 8, 9, 10 will be encoded as [-7, 4]. 1, 3, 5 will be encoded
 * as [1, 3, 5].
 */
class IncUintOptRleEncoder$1 {
  constructor () {
    this.encoder = new Encoder$1();
    /**
     * @type {number}
     */
    this.s = 0;
    this.count = 0;
  }

  /**
   * @param {number} v
   */
  write (v) {
    if (this.s + this.count === v) {
      this.count++;
    } else {
      flushUintOptRleEncoder(this);
      this.count = 1;
      this.s = v;
    }
  }

  toUint8Array () {
    flushUintOptRleEncoder(this);
    return toUint8Array$1(this.encoder)
  }
}

/**
 * @param {IntDiffOptRleEncoder} encoder
 */
const flushIntDiffOptRleEncoder = encoder => {
  if (encoder.count > 0) {
    //          31 bit making up the diff | wether to write the counter
    const encodedDiff = encoder.diff << 1 | (encoder.count === 1 ? 0 : 1);
    // flush counter, unless this is the first value (count = 0)
    // case 1: just a single value. set first bit to positive
    // case 2: write several values. set first bit to negative to indicate that there is a length coming
    writeVarInt$1(encoder.encoder, encodedDiff);
    if (encoder.count > 1) {
      writeVarUint$1(encoder.encoder, encoder.count - 2); // since count is always > 1, we can decrement by one. non-standard encoding ftw
    }
  }
};

/**
 * A combination of the IntDiffEncoder and the UintOptRleEncoder.
 *
 * The count approach is similar to the UintDiffOptRleEncoder, but instead of using the negative bitflag, it encodes
 * in the LSB whether a count is to be read. Therefore this Encoder only supports 31 bit integers!
 *
 * Encodes [1, 2, 3, 2] as [3, 1, 6, -1] (more specifically [(1 << 1) | 1, (3 << 0) | 0, -1])
 *
 * Internally uses variable length encoding. Contrary to normal UintVar encoding, the first byte contains:
 * * 1 bit that denotes whether the next value is a count (LSB)
 * * 1 bit that denotes whether this value is negative (MSB - 1)
 * * 1 bit that denotes whether to continue reading the variable length integer (MSB)
 *
 * Therefore, only five bits remain to encode diff ranges.
 *
 * Use this Encoder only when appropriate. In most cases, this is probably a bad idea.
 */
class IntDiffOptRleEncoder$1 {
  constructor () {
    this.encoder = new Encoder$1();
    /**
     * @type {number}
     */
    this.s = 0;
    this.count = 0;
    this.diff = 0;
  }

  /**
   * @param {number} v
   */
  write (v) {
    if (this.diff === v - this.s) {
      this.s = v;
      this.count++;
    } else {
      flushIntDiffOptRleEncoder(this);
      this.count = 1;
      this.diff = v - this.s;
      this.s = v;
    }
  }

  toUint8Array () {
    flushIntDiffOptRleEncoder(this);
    return toUint8Array$1(this.encoder)
  }
}

/**
 * Optimized String Encoder.
 *
 * Encoding many small strings in a simple Encoder is not very efficient. The function call to decode a string takes some time and creates references that must be eventually deleted.
 * In practice, when decoding several million small strings, the GC will kick in more and more often to collect orphaned string objects (or maybe there is another reason?).
 *
 * This string encoder solves the above problem. All strings are concatenated and written as a single string using a single encoding call.
 *
 * The lengths are encoded using a UintOptRleEncoder.
 */
class StringEncoder$1 {
  constructor () {
    /**
     * @type {Array<string>}
     */
    this.sarr = [];
    this.s = '';
    this.lensE = new UintOptRleEncoder$1();
  }

  /**
   * @param {string} string
   */
  write (string) {
    this.s += string;
    if (this.s.length > 19) {
      this.sarr.push(this.s);
      this.s = '';
    }
    this.lensE.write(string.length);
  }

  toUint8Array () {
    const encoder = new Encoder$1();
    this.sarr.push(this.s);
    this.s = '';
    writeVarString$1(encoder, this.sarr.join(''));
    writeUint8Array$1(encoder, this.lensE.toUint8Array());
    return toUint8Array$1(encoder)
  }
}

var encoding$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Encoder: Encoder$1,
  createEncoder: createEncoder$1,
  length: length$3,
  toUint8Array: toUint8Array$1,
  write: write$1,
  set: set$2,
  writeUint8: writeUint8$1,
  setUint8: setUint8$1,
  writeUint16: writeUint16$1,
  setUint16: setUint16$1,
  writeUint32: writeUint32$1,
  writeUint32BigEndian: writeUint32BigEndian$2,
  setUint32: setUint32$1,
  writeVarUint: writeVarUint$1,
  writeVarInt: writeVarInt$1,
  writeVarString: writeVarString$1,
  writeBinaryEncoder: writeBinaryEncoder$1,
  writeUint8Array: writeUint8Array$1,
  writeVarUint8Array: writeVarUint8Array$1,
  writeOnDataView: writeOnDataView$1,
  writeFloat32: writeFloat32$1,
  writeFloat64: writeFloat64$1,
  writeBigInt64: writeBigInt64$1,
  writeBigUint64: writeBigUint64$1,
  writeAny: writeAny$1,
  RleEncoder: RleEncoder$1,
  IntDiffEncoder: IntDiffEncoder$1,
  RleIntDiffEncoder: RleIntDiffEncoder$1,
  UintOptRleEncoder: UintOptRleEncoder$1,
  IncUintOptRleEncoder: IncUintOptRleEncoder$1,
  IntDiffOptRleEncoder: IntDiffOptRleEncoder$1,
  StringEncoder: StringEncoder$1
});

/**
 * Efficient schema-less binary decoding with support for variable length encoding.
 *
 * Use [lib0/decoding] with [lib0/encoding]. Every encoding function has a corresponding decoding function.
 *
 * Encodes numbers in little-endian order (least to most significant byte order)
 * and is compatible with Golang's binary encoding (https://golang.org/pkg/encoding/binary/)
 * which is also used in Protocol Buffers.
 *
 * ```js
 * // encoding step
 * const encoder = new encoding.createEncoder()
 * encoding.writeVarUint(encoder, 256)
 * encoding.writeVarString(encoder, 'Hello world!')
 * const buf = encoding.toUint8Array(encoder)
 * ```
 *
 * ```js
 * // decoding step
 * const decoder = new decoding.createDecoder(buf)
 * decoding.readVarUint(decoder) // => 256
 * decoding.readVarString(decoder) // => 'Hello world!'
 * decoding.hasContent(decoder) // => false - all data is read
 * ```
 *
 * @module decoding
 */

/**
 * A Decoder handles the decoding of an Uint8Array.
 */
class Decoder$1 {
  /**
   * @param {Uint8Array} uint8Array Binary data to decode
   */
  constructor (uint8Array) {
    /**
     * Decoding target.
     *
     * @type {Uint8Array}
     */
    this.arr = uint8Array;
    /**
     * Current decoding position.
     *
     * @type {number}
     */
    this.pos = 0;
  }
}

/**
 * @function
 * @param {Uint8Array} uint8Array
 * @return {Decoder}
 */
const createDecoder$1 = uint8Array => new Decoder$1(uint8Array);

/**
 * @function
 * @param {Decoder} decoder
 * @return {boolean}
 */
const hasContent$1 = decoder => decoder.pos !== decoder.arr.length;

/**
 * Clone a decoder instance.
 * Optionally set a new position parameter.
 *
 * @function
 * @param {Decoder} decoder The decoder instance
 * @param {number} [newPos] Defaults to current position
 * @return {Decoder} A clone of `decoder`
 */
const clone$1 = (decoder, newPos = decoder.pos) => {
  const _decoder = createDecoder$1(decoder.arr);
  _decoder.pos = newPos;
  return _decoder
};

/**
 * Create an Uint8Array view of the next `len` bytes and advance the position by `len`.
 *
 * Important: The Uint8Array still points to the underlying ArrayBuffer. Make sure to discard the result as soon as possible to prevent any memory leaks.
 *            Use `buffer.copyUint8Array` to copy the result into a new Uint8Array.
 *
 * @function
 * @param {Decoder} decoder The decoder instance
 * @param {number} len The length of bytes to read
 * @return {Uint8Array}
 */
const readUint8Array$1 = (decoder, len) => {
  const view = createUint8ArrayViewFromArrayBuffer$1(decoder.arr.buffer, decoder.pos + decoder.arr.byteOffset, len);
  decoder.pos += len;
  return view
};

/**
 * Read variable length Uint8Array.
 *
 * Important: The Uint8Array still points to the underlying ArrayBuffer. Make sure to discard the result as soon as possible to prevent any memory leaks.
 *            Use `buffer.copyUint8Array` to copy the result into a new Uint8Array.
 *
 * @function
 * @param {Decoder} decoder
 * @return {Uint8Array}
 */
const readVarUint8Array$1 = decoder => readUint8Array$1(decoder, readVarUint$1(decoder));

/**
 * Read the rest of the content as an ArrayBuffer
 * @function
 * @param {Decoder} decoder
 * @return {Uint8Array}
 */
const readTailAsUint8Array$1 = decoder => readUint8Array$1(decoder, decoder.arr.length - decoder.pos);

/**
 * Skip one byte, jump to the next position.
 * @function
 * @param {Decoder} decoder The decoder instance
 * @return {number} The next position
 */
const skip8$1 = decoder => decoder.pos++;

/**
 * Read one byte as unsigned integer.
 * @function
 * @param {Decoder} decoder The decoder instance
 * @return {number} Unsigned 8-bit integer
 */
const readUint8$1 = decoder => decoder.arr[decoder.pos++];

/**
 * Read 2 bytes as unsigned integer.
 *
 * @function
 * @param {Decoder} decoder
 * @return {number} An unsigned integer.
 */
const readUint16$1 = decoder => {
  const uint =
    decoder.arr[decoder.pos] +
    (decoder.arr[decoder.pos + 1] << 8);
  decoder.pos += 2;
  return uint
};

/**
 * Read 4 bytes as unsigned integer.
 *
 * @function
 * @param {Decoder} decoder
 * @return {number} An unsigned integer.
 */
const readUint32$1 = decoder => {
  const uint =
    (decoder.arr[decoder.pos] +
    (decoder.arr[decoder.pos + 1] << 8) +
    (decoder.arr[decoder.pos + 2] << 16) +
    (decoder.arr[decoder.pos + 3] << 24)) >>> 0;
  decoder.pos += 4;
  return uint
};

/**
 * Read 4 bytes as unsigned integer in big endian order.
 * (most significant byte first)
 *
 * @function
 * @param {Decoder} decoder
 * @return {number} An unsigned integer.
 */
const readUint32BigEndian$2 = decoder => {
  const uint =
    (decoder.arr[decoder.pos + 3] +
    (decoder.arr[decoder.pos + 2] << 8) +
    (decoder.arr[decoder.pos + 1] << 16) +
    (decoder.arr[decoder.pos] << 24)) >>> 0;
  decoder.pos += 4;
  return uint
};

/**
 * Look ahead without incrementing the position
 * to the next byte and read it as unsigned integer.
 *
 * @function
 * @param {Decoder} decoder
 * @return {number} An unsigned integer.
 */
const peekUint8$1 = decoder => decoder.arr[decoder.pos];

/**
 * Look ahead without incrementing the position
 * to the next byte and read it as unsigned integer.
 *
 * @function
 * @param {Decoder} decoder
 * @return {number} An unsigned integer.
 */
const peekUint16$1 = decoder =>
  decoder.arr[decoder.pos] +
  (decoder.arr[decoder.pos + 1] << 8);

/**
 * Look ahead without incrementing the position
 * to the next byte and read it as unsigned integer.
 *
 * @function
 * @param {Decoder} decoder
 * @return {number} An unsigned integer.
 */
const peekUint32$1 = decoder => (
  decoder.arr[decoder.pos] +
  (decoder.arr[decoder.pos + 1] << 8) +
  (decoder.arr[decoder.pos + 2] << 16) +
  (decoder.arr[decoder.pos + 3] << 24)
) >>> 0;

/**
 * Read unsigned integer (32bit) with variable length.
 * 1/8th of the storage is used as encoding overhead.
 *  * numbers < 2^7 is stored in one bytlength
 *  * numbers < 2^14 is stored in two bylength
 *
 * @function
 * @param {Decoder} decoder
 * @return {number} An unsigned integer.length
 */
const readVarUint$1 = decoder => {
  let num = 0;
  let len = 0;
  while (true) {
    const r = decoder.arr[decoder.pos++];
    num = num | ((r & binary$1.BITS7) << len);
    len += 7;
    if (r < binary$1.BIT8) {
      return num >>> 0 // return unsigned number!
    }
    /* istanbul ignore if */
    if (len > 35) {
      throw new Error('Integer out of range!')
    }
  }
};

/**
 * Read signed integer (32bit) with variable length.
 * 1/8th of the storage is used as encoding overhead.
 *  * numbers < 2^7 is stored in one bytlength
 *  * numbers < 2^14 is stored in two bylength
 * @todo This should probably create the inverse ~num if number is negative - but this would be a breaking change.
 *
 * @function
 * @param {Decoder} decoder
 * @return {number} An unsigned integer.length
 */
const readVarInt$1 = decoder => {
  let r = decoder.arr[decoder.pos++];
  let num = r & binary$1.BITS6;
  let len = 6;
  const sign = (r & binary$1.BIT7) > 0 ? -1 : 1;
  if ((r & binary$1.BIT8) === 0) {
    // don't continue reading
    return sign * num
  }
  while (true) {
    r = decoder.arr[decoder.pos++];
    num = num | ((r & binary$1.BITS7) << len);
    len += 7;
    if (r < binary$1.BIT8) {
      return sign * (num >>> 0)
    }
    /* istanbul ignore if */
    if (len > 41) {
      throw new Error('Integer out of range!')
    }
  }
};

/**
 * Look ahead and read varUint without incrementing position
 *
 * @function
 * @param {Decoder} decoder
 * @return {number}
 */
const peekVarUint$1 = decoder => {
  const pos = decoder.pos;
  const s = readVarUint$1(decoder);
  decoder.pos = pos;
  return s
};

/**
 * Look ahead and read varUint without incrementing position
 *
 * @function
 * @param {Decoder} decoder
 * @return {number}
 */
const peekVarInt$1 = decoder => {
  const pos = decoder.pos;
  const s = readVarInt$1(decoder);
  decoder.pos = pos;
  return s
};

/**
 * Read string of variable length
 * * varUint is used to store the length of the string
 *
 * Transforming utf8 to a string is pretty expensive. The code performs 10x better
 * when String.fromCodePoint is fed with all characters as arguments.
 * But most environments have a maximum number of arguments per functions.
 * For effiency reasons we apply a maximum of 10000 characters at once.
 *
 * @function
 * @param {Decoder} decoder
 * @return {String} The read String.
 */
const readVarString$1 = decoder => {
  let remainingLen = readVarUint$1(decoder);
  if (remainingLen === 0) {
    return ''
  } else {
    let encodedString = String.fromCodePoint(readUint8$1(decoder)); // remember to decrease remainingLen
    if (--remainingLen < 100) { // do not create a Uint8Array for small strings
      while (remainingLen--) {
        encodedString += String.fromCodePoint(readUint8$1(decoder));
      }
    } else {
      while (remainingLen > 0) {
        const nextLen = remainingLen < 10000 ? remainingLen : 10000;
        // this is dangerous, we create a fresh array view from the existing buffer
        const bytes = decoder.arr.subarray(decoder.pos, decoder.pos + nextLen);
        decoder.pos += nextLen;
        // Starting with ES5.1 we can supply a generic array-like object as arguments
        encodedString += String.fromCodePoint.apply(null, /** @type {any} */ (bytes));
        remainingLen -= nextLen;
      }
    }
    return decodeURIComponent(escape(encodedString))
  }
};

/**
 * Look ahead and read varString without incrementing position
 *
 * @function
 * @param {Decoder} decoder
 * @return {string}
 */
const peekVarString$1 = decoder => {
  const pos = decoder.pos;
  const s = readVarString$1(decoder);
  decoder.pos = pos;
  return s
};

/**
 * @param {Decoder} decoder
 * @param {number} len
 * @return {DataView}
 */
const readFromDataView$1 = (decoder, len) => {
  const dv = new DataView(decoder.arr.buffer, decoder.arr.byteOffset + decoder.pos, len);
  decoder.pos += len;
  return dv
};

/**
 * @param {Decoder} decoder
 */
const readFloat32$1 = decoder => readFromDataView$1(decoder, 4).getFloat32(0, false);

/**
 * @param {Decoder} decoder
 */
const readFloat64$1 = decoder => readFromDataView$1(decoder, 8).getFloat64(0, false);

/**
 * @param {Decoder} decoder
 */
const readBigInt64$1 = decoder => /** @type {any} */ (readFromDataView$1(decoder, 8)).getBigInt64(0, false);

/**
 * @param {Decoder} decoder
 */
const readBigUint64$1 = decoder => /** @type {any} */ (readFromDataView$1(decoder, 8)).getBigUint64(0, false);

/**
 * @type {Array<function(Decoder):any>}
 */
const readAnyLookupTable = [
  decoder => undefined, // CASE 127: undefined
  decoder => null, // CASE 126: null
  readVarInt$1, // CASE 125: integer
  readFloat32$1, // CASE 124: float32
  readFloat64$1, // CASE 123: float64
  readBigInt64$1, // CASE 122: bigint
  decoder => false, // CASE 121: boolean (false)
  decoder => true, // CASE 120: boolean (true)
  readVarString$1, // CASE 119: string
  decoder => { // CASE 118: object<string,any>
    const len = readVarUint$1(decoder);
    /**
     * @type {Object<string,any>}
     */
    const obj = {};
    for (let i = 0; i < len; i++) {
      const key = readVarString$1(decoder);
      obj[key] = readAny$1(decoder);
    }
    return obj
  },
  decoder => { // CASE 117: array<any>
    const len = readVarUint$1(decoder);
    const arr = [];
    for (let i = 0; i < len; i++) {
      arr.push(readAny$1(decoder));
    }
    return arr
  },
  readVarUint8Array$1 // CASE 116: Uint8Array
];

/**
 * @param {Decoder} decoder
 */
const readAny$1 = decoder => readAnyLookupTable[127 - readUint8$1(decoder)](decoder);

/**
 * T must not be null.
 *
 * @template T
 */
class RleDecoder$1 extends Decoder$1 {
  /**
   * @param {Uint8Array} uint8Array
   * @param {function(Decoder):T} reader
   */
  constructor (uint8Array, reader) {
    super(uint8Array);
    /**
     * The reader
     */
    this.reader = reader;
    /**
     * Current state
     * @type {T|null}
     */
    this.s = null;
    this.count = 0;
  }

  read () {
    if (this.count === 0) {
      this.s = this.reader(this);
      if (hasContent$1(this)) {
        this.count = readVarUint$1(this) + 1; // see encoder implementation for the reason why this is incremented
      } else {
        this.count = -1; // read the current value forever
      }
    }
    this.count--;
    return /** @type {T} */ (this.s)
  }
}

class IntDiffDecoder$1 extends Decoder$1 {
  /**
   * @param {Uint8Array} uint8Array
   * @param {number} start
   */
  constructor (uint8Array, start) {
    super(uint8Array);
    /**
     * Current state
     * @type {number}
     */
    this.s = start;
  }

  /**
   * @return {number}
   */
  read () {
    this.s += readVarInt$1(this);
    return this.s
  }
}

class RleIntDiffDecoder$1 extends Decoder$1 {
  /**
   * @param {Uint8Array} uint8Array
   * @param {number} start
   */
  constructor (uint8Array, start) {
    super(uint8Array);
    /**
     * Current state
     * @type {number}
     */
    this.s = start;
    this.count = 0;
  }

  /**
   * @return {number}
   */
  read () {
    if (this.count === 0) {
      this.s += readVarInt$1(this);
      if (hasContent$1(this)) {
        this.count = readVarUint$1(this) + 1; // see encoder implementation for the reason why this is incremented
      } else {
        this.count = -1; // read the current value forever
      }
    }
    this.count--;
    return /** @type {number} */ (this.s)
  }
}

class UintOptRleDecoder$1 extends Decoder$1 {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor (uint8Array) {
    super(uint8Array);
    /**
     * @type {number}
     */
    this.s = 0;
    this.count = 0;
  }

  read () {
    if (this.count === 0) {
      this.s = readVarInt$1(this);
      // if the sign is negative, we read the count too, otherwise count is 1
      const isNegative = math$1.isNegativeZero(this.s);
      this.count = 1;
      if (isNegative) {
        this.s = -this.s;
        this.count = readVarUint$1(this) + 2;
      }
    }
    this.count--;
    return /** @type {number} */ (this.s)
  }
}

class IncUintOptRleDecoder$1 extends Decoder$1 {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor (uint8Array) {
    super(uint8Array);
    /**
     * @type {number}
     */
    this.s = 0;
    this.count = 0;
  }

  read () {
    if (this.count === 0) {
      this.s = readVarInt$1(this);
      // if the sign is negative, we read the count too, otherwise count is 1
      const isNegative = math$1.isNegativeZero(this.s);
      this.count = 1;
      if (isNegative) {
        this.s = -this.s;
        this.count = readVarUint$1(this) + 2;
      }
    }
    this.count--;
    return /** @type {number} */ (this.s++)
  }
}

class IntDiffOptRleDecoder$1 extends Decoder$1 {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor (uint8Array) {
    super(uint8Array);
    /**
     * @type {number}
     */
    this.s = 0;
    this.count = 0;
    this.diff = 0;
  }

  /**
   * @return {number}
   */
  read () {
    if (this.count === 0) {
      const diff = readVarInt$1(this);
      // if the first bit is set, we read more data
      const hasCount = diff & 1;
      this.diff = diff >> 1;
      this.count = 1;
      if (hasCount) {
        this.count = readVarUint$1(this) + 2;
      }
    }
    this.s += this.diff;
    this.count--;
    return this.s
  }
}

class StringDecoder$1 {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor (uint8Array) {
    this.decoder = new UintOptRleDecoder$1(uint8Array);
    this.str = readVarString$1(this.decoder);
    /**
     * @type {number}
     */
    this.spos = 0;
  }

  /**
   * @return {string}
   */
  read () {
    const end = this.spos + this.decoder.read();
    const res = this.str.slice(this.spos, end);
    this.spos = end;
    return res
  }
}

var decoding$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Decoder: Decoder$1,
  createDecoder: createDecoder$1,
  hasContent: hasContent$1,
  clone: clone$1,
  readUint8Array: readUint8Array$1,
  readVarUint8Array: readVarUint8Array$1,
  readTailAsUint8Array: readTailAsUint8Array$1,
  skip8: skip8$1,
  readUint8: readUint8$1,
  readUint16: readUint16$1,
  readUint32: readUint32$1,
  readUint32BigEndian: readUint32BigEndian$2,
  peekUint8: peekUint8$1,
  peekUint16: peekUint16$1,
  peekUint32: peekUint32$1,
  readVarUint: readVarUint$1,
  readVarInt: readVarInt$1,
  peekVarUint: peekVarUint$1,
  peekVarInt: peekVarInt$1,
  readVarString: readVarString$1,
  peekVarString: peekVarString$1,
  readFromDataView: readFromDataView$1,
  readFloat32: readFloat32$1,
  readFloat64: readFloat64$1,
  readBigInt64: readBigInt64$1,
  readBigUint64: readBigUint64$1,
  readAny: readAny$1,
  RleDecoder: RleDecoder$1,
  IntDiffDecoder: IntDiffDecoder$1,
  RleIntDiffDecoder: RleIntDiffDecoder$1,
  UintOptRleDecoder: UintOptRleDecoder$1,
  IncUintOptRleDecoder: IncUintOptRleDecoder$1,
  IntDiffOptRleDecoder: IntDiffOptRleDecoder$1,
  StringDecoder: StringDecoder$1
});

/**
 * Utility functions to work with buffers (Uint8Array).
 *
 * @module buffer
 */

/**
 * @param {number} len
 */
const createUint8ArrayFromLen$1 = len => new Uint8Array(len);

/**
 * Create Uint8Array with initial content from buffer
 *
 * @param {ArrayBuffer} buffer
 * @param {number} byteOffset
 * @param {number} length
 */
const createUint8ArrayViewFromArrayBuffer$1 = (buffer, byteOffset, length) => new Uint8Array(buffer, byteOffset, length);

/**
 * Create Uint8Array with initial content from buffer
 *
 * @param {ArrayBuffer} buffer
 */
const createUint8ArrayFromArrayBuffer$1 = buffer => new Uint8Array(buffer);

/* istanbul ignore next */
/**
 * @param {Uint8Array} bytes
 * @return {string}
 */
const toBase64Browser = bytes => {
  let s = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    s += string.fromCharCode(bytes[i]);
  }
  // eslint-disable-next-line no-undef
  return btoa(s)
};

/**
 * @param {Uint8Array} bytes
 * @return {string}
 */
const toBase64Node = bytes => Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString('base64');

/* istanbul ignore next */
/**
 * @param {string} s
 * @return {Uint8Array}
 */
const fromBase64Browser = s => {
  // eslint-disable-next-line no-undef
  const a = atob(s);
  const bytes = createUint8ArrayFromLen$1(a.length);
  for (let i = 0; i < a.length; i++) {
    bytes[i] = a.charCodeAt(i);
  }
  return bytes
};

/**
 * @param {string} s
 */
const fromBase64Node = s => {
  const buf = Buffer.from(s, 'base64');
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)
};

/* istanbul ignore next */
const toBase64$1 = environment.isBrowser ? toBase64Browser : toBase64Node;

/* istanbul ignore next */
const fromBase64$1 = environment.isBrowser ? fromBase64Browser : fromBase64Node;

/**
 * Copy the content of an Uint8Array view to a new ArrayBuffer.
 *
 * @param {Uint8Array} uint8Array
 * @return {Uint8Array}
 */
const copyUint8Array$1 = uint8Array => {
  const newBuf = createUint8ArrayFromLen$1(uint8Array.byteLength);
  newBuf.set(uint8Array);
  return newBuf
};

/**
 * Encode anything as a UInt8Array. It's a pun on typescripts's `any` type.
 * See encoding.writeAny for more information.
 *
 * @param {any} data
 * @return {Uint8Array}
 */
const encodeAny$1 = data => {
  const encoder = createEncoder$1();
  writeAny$1(encoder, data);
  return toUint8Array$1(encoder)
};

/**
 * Decode an any-encoded value.
 *
 * @param {Uint8Array} buf
 * @return {any}
 */
const decodeAny$1 = buf => readAny$1(createDecoder$1(buf));

var buffer$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  createUint8ArrayFromLen: createUint8ArrayFromLen$1,
  createUint8ArrayViewFromArrayBuffer: createUint8ArrayViewFromArrayBuffer$1,
  createUint8ArrayFromArrayBuffer: createUint8ArrayFromArrayBuffer$1,
  toBase64: toBase64$1,
  fromBase64: fromBase64$1,
  copyUint8Array: copyUint8Array$1,
  encodeAny: encodeAny$1,
  decodeAny: decodeAny$1
});

var Decoder_1 = Decoder$1;
var Encoder_1 = Encoder$1;
var IncUintOptRleDecoder_1 = IncUintOptRleDecoder$1;
var IncUintOptRleEncoder_1 = IncUintOptRleEncoder$1;
var IntDiffDecoder_1 = IntDiffDecoder$1;
var IntDiffEncoder_1 = IntDiffEncoder$1;
var IntDiffOptRleDecoder_1 = IntDiffOptRleDecoder$1;
var IntDiffOptRleEncoder_1 = IntDiffOptRleEncoder$1;
var RleDecoder_1 = RleDecoder$1;
var RleEncoder_1 = RleEncoder$1;
var RleIntDiffDecoder_1 = RleIntDiffDecoder$1;
var RleIntDiffEncoder_1 = RleIntDiffEncoder$1;
var StringDecoder_1 = StringDecoder$1;
var StringEncoder_1 = StringEncoder$1;
var UintOptRleDecoder_1 = UintOptRleDecoder$1;
var UintOptRleEncoder_1 = UintOptRleEncoder$1;
var buffer_1 = buffer$2;
var clone_1 = clone$1;
var copyUint8Array_1 = copyUint8Array$1;
var createDecoder_1 = createDecoder$1;
var createEncoder_1 = createEncoder$1;
var createUint8ArrayFromArrayBuffer_1 = createUint8ArrayFromArrayBuffer$1;
var createUint8ArrayFromLen_1 = createUint8ArrayFromLen$1;
var createUint8ArrayViewFromArrayBuffer_1 = createUint8ArrayViewFromArrayBuffer$1;
var decodeAny_1 = decodeAny$1;
var decoding_1 = decoding$2;
var encodeAny_1 = encodeAny$1;
var encoding_1$1 = encoding$2;
var fromBase64_1 = fromBase64$1;
var hasContent_1 = hasContent$1;
var length_1$1 = length$3;
var peekUint16_1 = peekUint16$1;
var peekUint32_1 = peekUint32$1;
var peekUint8_1 = peekUint8$1;
var peekVarInt_1 = peekVarInt$1;
var peekVarString_1 = peekVarString$1;
var peekVarUint_1 = peekVarUint$1;
var readAny_1 = readAny$1;
var readBigInt64_1 = readBigInt64$1;
var readBigUint64_1 = readBigUint64$1;
var readFloat32_1 = readFloat32$1;
var readFloat64_1 = readFloat64$1;
var readFromDataView_1 = readFromDataView$1;
var readTailAsUint8Array_1 = readTailAsUint8Array$1;
var readUint16_1 = readUint16$1;
var readUint32_1 = readUint32$1;
var readUint32BigEndian_1$1 = readUint32BigEndian$2;
var readUint8_1 = readUint8$1;
var readUint8Array_1 = readUint8Array$1;
var readVarInt_1 = readVarInt$1;
var readVarString_1 = readVarString$1;
var readVarUint_1 = readVarUint$1;
var readVarUint8Array_1 = readVarUint8Array$1;
var set_1$1 = set$2;
var setUint16_1 = setUint16$1;
var setUint32_1 = setUint32$1;
var setUint8_1 = setUint8$1;
var skip8_1 = skip8$1;
var toBase64_1 = toBase64$1;
var toUint8Array_1 = toUint8Array$1;
var write_1 = write$1;
var writeAny_1 = writeAny$1;
var writeBigInt64_1 = writeBigInt64$1;
var writeBigUint64_1 = writeBigUint64$1;
var writeBinaryEncoder_1 = writeBinaryEncoder$1;
var writeFloat32_1 = writeFloat32$1;
var writeFloat64_1 = writeFloat64$1;
var writeOnDataView_1 = writeOnDataView$1;
var writeUint16_1 = writeUint16$1;
var writeUint32_1 = writeUint32$1;
var writeUint32BigEndian_1$1 = writeUint32BigEndian$2;
var writeUint8_1 = writeUint8$1;
var writeUint8Array_1 = writeUint8Array$1;
var writeVarInt_1 = writeVarInt$1;
var writeVarString_1 = writeVarString$1;
var writeVarUint_1 = writeVarUint$1;
var writeVarUint8Array_1 = writeVarUint8Array$1;


var buffer49880125 = {
	Decoder: Decoder_1,
	Encoder: Encoder_1,
	IncUintOptRleDecoder: IncUintOptRleDecoder_1,
	IncUintOptRleEncoder: IncUintOptRleEncoder_1,
	IntDiffDecoder: IntDiffDecoder_1,
	IntDiffEncoder: IntDiffEncoder_1,
	IntDiffOptRleDecoder: IntDiffOptRleDecoder_1,
	IntDiffOptRleEncoder: IntDiffOptRleEncoder_1,
	RleDecoder: RleDecoder_1,
	RleEncoder: RleEncoder_1,
	RleIntDiffDecoder: RleIntDiffDecoder_1,
	RleIntDiffEncoder: RleIntDiffEncoder_1,
	StringDecoder: StringDecoder_1,
	StringEncoder: StringEncoder_1,
	UintOptRleDecoder: UintOptRleDecoder_1,
	UintOptRleEncoder: UintOptRleEncoder_1,
	buffer: buffer_1,
	clone: clone_1,
	copyUint8Array: copyUint8Array_1,
	createDecoder: createDecoder_1,
	createEncoder: createEncoder_1,
	createUint8ArrayFromArrayBuffer: createUint8ArrayFromArrayBuffer_1,
	createUint8ArrayFromLen: createUint8ArrayFromLen_1,
	createUint8ArrayViewFromArrayBuffer: createUint8ArrayViewFromArrayBuffer_1,
	decodeAny: decodeAny_1,
	decoding: decoding_1,
	encodeAny: encodeAny_1,
	encoding: encoding_1$1,
	fromBase64: fromBase64_1,
	hasContent: hasContent_1,
	length: length_1$1,
	peekUint16: peekUint16_1,
	peekUint32: peekUint32_1,
	peekUint8: peekUint8_1,
	peekVarInt: peekVarInt_1,
	peekVarString: peekVarString_1,
	peekVarUint: peekVarUint_1,
	readAny: readAny_1,
	readBigInt64: readBigInt64_1,
	readBigUint64: readBigUint64_1,
	readFloat32: readFloat32_1,
	readFloat64: readFloat64_1,
	readFromDataView: readFromDataView_1,
	readTailAsUint8Array: readTailAsUint8Array_1,
	readUint16: readUint16_1,
	readUint32: readUint32_1,
	readUint32BigEndian: readUint32BigEndian_1$1,
	readUint8: readUint8_1,
	readUint8Array: readUint8Array_1,
	readVarInt: readVarInt_1,
	readVarString: readVarString_1,
	readVarUint: readVarUint_1,
	readVarUint8Array: readVarUint8Array_1,
	set: set_1$1,
	setUint16: setUint16_1,
	setUint32: setUint32_1,
	setUint8: setUint8_1,
	skip8: skip8_1,
	toBase64: toBase64_1,
	toUint8Array: toUint8Array_1,
	write: write_1,
	writeAny: writeAny_1,
	writeBigInt64: writeBigInt64_1,
	writeBigUint64: writeBigUint64_1,
	writeBinaryEncoder: writeBinaryEncoder_1,
	writeFloat32: writeFloat32_1,
	writeFloat64: writeFloat64_1,
	writeOnDataView: writeOnDataView_1,
	writeUint16: writeUint16_1,
	writeUint32: writeUint32_1,
	writeUint32BigEndian: writeUint32BigEndian_1$1,
	writeUint8: writeUint8_1,
	writeUint8Array: writeUint8Array_1,
	writeVarInt: writeVarInt_1,
	writeVarString: writeVarString_1,
	writeVarUint: writeVarUint_1,
	writeVarUint8Array: writeVarUint8Array_1
};

var encoding$1 = buffer49880125;

var Encoder = encoding$1.Encoder;
var IncUintOptRleEncoder = encoding$1.IncUintOptRleEncoder;
var IntDiffEncoder = encoding$1.IntDiffEncoder;
var IntDiffOptRleEncoder = encoding$1.IntDiffOptRleEncoder;
var RleEncoder = encoding$1.RleEncoder;
var RleIntDiffEncoder = encoding$1.RleIntDiffEncoder;
var StringEncoder = encoding$1.StringEncoder;
var UintOptRleEncoder = encoding$1.UintOptRleEncoder;
var createEncoder = encoding$1.createEncoder;
var length$2 = encoding$1.length;
var set$1 = encoding$1.set;
var setUint16 = encoding$1.setUint16;
var setUint32 = encoding$1.setUint32;
var setUint8 = encoding$1.setUint8;
var toUint8Array = encoding$1.toUint8Array;
var write = encoding$1.write;
var writeAny = encoding$1.writeAny;
var writeBigInt64 = encoding$1.writeBigInt64;
var writeBigUint64 = encoding$1.writeBigUint64;
var writeBinaryEncoder = encoding$1.writeBinaryEncoder;
var writeFloat32 = encoding$1.writeFloat32;
var writeFloat64 = encoding$1.writeFloat64;
var writeOnDataView = encoding$1.writeOnDataView;
var writeUint16 = encoding$1.writeUint16;
var writeUint32 = encoding$1.writeUint32;
var writeUint32BigEndian$1 = encoding$1.writeUint32BigEndian;
var writeUint8 = encoding$1.writeUint8;
var writeUint8Array = encoding$1.writeUint8Array;
var writeVarInt = encoding$1.writeVarInt;
var writeVarString = encoding$1.writeVarString;
var writeVarUint = encoding$1.writeVarUint;
var writeVarUint8Array = encoding$1.writeVarUint8Array;


var encoding_1 = /*#__PURE__*/Object.defineProperty({
	Encoder: Encoder,
	IncUintOptRleEncoder: IncUintOptRleEncoder,
	IntDiffEncoder: IntDiffEncoder,
	IntDiffOptRleEncoder: IntDiffOptRleEncoder,
	RleEncoder: RleEncoder,
	RleIntDiffEncoder: RleIntDiffEncoder,
	StringEncoder: StringEncoder,
	UintOptRleEncoder: UintOptRleEncoder,
	createEncoder: createEncoder,
	length: length$2,
	set: set$1,
	setUint16: setUint16,
	setUint32: setUint32,
	setUint8: setUint8,
	toUint8Array: toUint8Array,
	write: write,
	writeAny: writeAny,
	writeBigInt64: writeBigInt64,
	writeBigUint64: writeBigUint64,
	writeBinaryEncoder: writeBinaryEncoder,
	writeFloat32: writeFloat32,
	writeFloat64: writeFloat64,
	writeOnDataView: writeOnDataView,
	writeUint16: writeUint16,
	writeUint32: writeUint32,
	writeUint32BigEndian: writeUint32BigEndian$1,
	writeUint8: writeUint8,
	writeUint8Array: writeUint8Array,
	writeVarInt: writeVarInt,
	writeVarString: writeVarString,
	writeVarUint: writeVarUint,
	writeVarUint8Array: writeVarUint8Array
}, '__esModule', {value: true});

var Decoder = encoding$1.Decoder;
var IncUintOptRleDecoder = encoding$1.IncUintOptRleDecoder;
var IntDiffDecoder = encoding$1.IntDiffDecoder;
var IntDiffOptRleDecoder = encoding$1.IntDiffOptRleDecoder;
var RleDecoder = encoding$1.RleDecoder;
var RleIntDiffDecoder = encoding$1.RleIntDiffDecoder;
var StringDecoder = encoding$1.StringDecoder;
var UintOptRleDecoder = encoding$1.UintOptRleDecoder;
var clone = encoding$1.clone;
var createDecoder = encoding$1.createDecoder;
var hasContent = encoding$1.hasContent;
var peekUint16 = encoding$1.peekUint16;
var peekUint32 = encoding$1.peekUint32;
var peekUint8 = encoding$1.peekUint8;
var peekVarInt = encoding$1.peekVarInt;
var peekVarString = encoding$1.peekVarString;
var peekVarUint = encoding$1.peekVarUint;
var readAny = encoding$1.readAny;
var readBigInt64 = encoding$1.readBigInt64;
var readBigUint64 = encoding$1.readBigUint64;
var readFloat32 = encoding$1.readFloat32;
var readFloat64 = encoding$1.readFloat64;
var readFromDataView = encoding$1.readFromDataView;
var readTailAsUint8Array = encoding$1.readTailAsUint8Array;
var readUint16 = encoding$1.readUint16;
var readUint32 = encoding$1.readUint32;
var readUint32BigEndian$1 = encoding$1.readUint32BigEndian;
var readUint8 = encoding$1.readUint8;
var readUint8Array = encoding$1.readUint8Array;
var readVarInt = encoding$1.readVarInt;
var readVarString = encoding$1.readVarString;
var readVarUint = encoding$1.readVarUint;
var readVarUint8Array = encoding$1.readVarUint8Array;
var skip8 = encoding$1.skip8;


var decoding$1 = /*#__PURE__*/Object.defineProperty({
	Decoder: Decoder,
	IncUintOptRleDecoder: IncUintOptRleDecoder,
	IntDiffDecoder: IntDiffDecoder,
	IntDiffOptRleDecoder: IntDiffOptRleDecoder,
	RleDecoder: RleDecoder,
	RleIntDiffDecoder: RleIntDiffDecoder,
	StringDecoder: StringDecoder,
	UintOptRleDecoder: UintOptRleDecoder,
	clone: clone,
	createDecoder: createDecoder,
	hasContent: hasContent,
	peekUint16: peekUint16,
	peekUint32: peekUint32,
	peekUint8: peekUint8,
	peekVarInt: peekVarInt,
	peekVarString: peekVarString,
	peekVarUint: peekVarUint,
	readAny: readAny,
	readBigInt64: readBigInt64,
	readBigUint64: readBigUint64,
	readFloat32: readFloat32,
	readFloat64: readFloat64,
	readFromDataView: readFromDataView,
	readTailAsUint8Array: readTailAsUint8Array,
	readUint16: readUint16,
	readUint32: readUint32,
	readUint32BigEndian: readUint32BigEndian$1,
	readUint8: readUint8,
	readUint8Array: readUint8Array,
	readVarInt: readVarInt,
	readVarString: readVarString,
	readVarUint: readVarUint,
	readVarUint8Array: readVarUint8Array,
	skip8: skip8
}, '__esModule', {value: true});

/* eslint-env browser */
const perf$1 = typeof performance === 'undefined' ? null : performance;

const isoCrypto = typeof crypto === 'undefined' ? null : crypto;

/**
 * @type {function(number):ArrayBuffer}
 */
const cryptoRandomBuffer$1 = isoCrypto !== null
  ? len => {
    // browser
    const buf = new ArrayBuffer(len);
    const arr = new Uint8Array(buf);
    isoCrypto.getRandomValues(arr);
    return buf
  }
  : len => {
    // polyfill
    const buf = new ArrayBuffer(len);
    const arr = new Uint8Array(buf);
    for (let i = 0; i < len; i++) {
      arr[i] = Math.ceil((Math.random() * 0xFFFFFFFF) >>> 0);
    }
    return buf
  };

var performance_1 = perf$1;
var cryptoRandomBuffer_1$1 = cryptoRandomBuffer$1;

var browser = {
	performance: performance_1,
	cryptoRandomBuffer: cryptoRandomBuffer_1$1
};

var isoBrowser = browser;

const isNode = typeof process !== 'undefined' && process.release && /node|io\.js/.test(process.release.name);



const perf = isNode ? require$$0__default$2["default"].performance : isoBrowser.performance;
const nodeCrypto = isNode ? require$$1__default$1["default"] : null;

/**
 * @type {function(number):ArrayBuffer}
 */
const cryptoRandomBuffer = nodeCrypto
  // node
  ? len => nodeCrypto.randomBytes(len).buffer
  : isoBrowser.cryptoRandomBuffer;

var performance$1 = perf;
var cryptoRandomBuffer_1 = cryptoRandomBuffer;

var iso = {
	performance: performance$1,
	cryptoRandomBuffer: cryptoRandomBuffer_1
};

var isomorphic_js = iso;

const rand = Math.random;

/* istanbul ignore next */
const uint32 = () => new Uint32Array(isomorphic_js.cryptoRandomBuffer(4))[0];

/**
 * @template T
 * @param {Array<T>} arr
 * @return {T}
 */
const oneOf = arr => arr[math$1.floor(rand() * arr.length)];

// @ts-ignore
const uuidv4Template = [1e7] + -1e3 + -4e3 + -8e3 + -1e11;
const uuidv4 = () => uuidv4Template.replace(/[018]/g, /** @param {number} c */ c =>
  (c ^ uint32() & 15 >> c / 4).toString(16)
);

var oneOf_1 = oneOf;
var rand_1 = rand;
var uint32_1 = uint32;
var uuidv4_1 = uuidv4;


var random$1 = /*#__PURE__*/Object.defineProperty({
	oneOf: oneOf_1,
	rand: rand_1,
	uint32: uint32_1,
	uuidv4: uuidv4_1
}, '__esModule', {value: true});

/**
 * Utility module to convert metric values.
 *
 * @module metric
 */

const yotta = 1e24;
const zetta = 1e21;
const exa = 1e18;
const peta = 1e15;
const tera = 1e12;
const giga = 1e9;
const mega = 1e6;
const kilo = 1e3;
const hecto = 1e2;
const deca = 10;
const deci = 0.1;
const centi = 0.01;
const milli = 1e-3;
const micro = 1e-6;
const nano = 1e-9;
const pico = 1e-12;
const femto = 1e-15;
const atto = 1e-18;
const zepto = 1e-21;
const yocto = 1e-24;

const prefixUp = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
const prefixDown = ['', 'm', 'μ', 'n', 'p', 'f', 'a', 'z', 'y'];

/**
 * Calculate the metric prefix for a number. Assumes E.g. `prefix(1000) = { n: 1, prefix: 'k' }`
 *
 * @param {number} n
 * @param {number} [baseMultiplier] Multiplier of the base (10^(3*baseMultiplier)). E.g. `convert(time, -3)` if time is already in milli seconds
 * @return {{n:number,prefix:string}}
 */
const prefix = (n, baseMultiplier = 0) => {
  const nPow = n === 0 ? 0 : math$1.log10(n);
  let mult = 0;
  while (nPow < mult * 3 && baseMultiplier > -8) {
    baseMultiplier--;
    mult--;
  }
  while (nPow >= 3 + mult * 3 && baseMultiplier < 8) {
    baseMultiplier++;
    mult++;
  }
  const prefix = baseMultiplier < 0 ? prefixDown[-baseMultiplier] : prefixUp[baseMultiplier];
  return {
    n: math$1.round((mult > 0 ? n / math$1.exp10(mult * 3) : n * math$1.exp10(mult * -3)) * 1e12) / 1e12,
    prefix
  }
};

var atto_1 = atto;
var centi_1 = centi;
var deca_1 = deca;
var deci_1 = deci;
var exa_1 = exa;
var femto_1 = femto;
var giga_1 = giga;
var hecto_1 = hecto;
var kilo_1 = kilo;
var mega_1 = mega;
var micro_1 = micro;
var milli_1 = milli;
var nano_1 = nano;
var peta_1 = peta;
var pico_1 = pico;
var prefix_1 = prefix;
var tera_1 = tera;
var yocto_1 = yocto;
var yotta_1 = yotta;
var zepto_1 = zepto;
var zetta_1 = zetta;


var metric$1 = /*#__PURE__*/Object.defineProperty({
	atto: atto_1,
	centi: centi_1,
	deca: deca_1,
	deci: deci_1,
	exa: exa_1,
	femto: femto_1,
	giga: giga_1,
	hecto: hecto_1,
	kilo: kilo_1,
	mega: mega_1,
	micro: micro_1,
	milli: milli_1,
	nano: nano_1,
	peta: peta_1,
	pico: pico_1,
	prefix: prefix_1,
	tera: tera_1,
	yocto: yocto_1,
	yotta: yotta_1,
	zepto: zepto_1,
	zetta: zetta_1
}, '__esModule', {value: true});

var metric = metric$1;

/**
 * Utility module to work with time.
 *
 * @module time
 */

/**
 * Return current time.
 *
 * @return {Date}
 */
const getDate$1 = () => new Date();

/**
 * Return current unix time.
 *
 * @return {number}
 */
const getUnixTime$1 = Date.now;

/**
 * Transform time (in ms) to a human readable format. E.g. 1100 => 1.1s. 60s => 1min. .001 => 10μs.
 *
 * @param {number} d duration in milliseconds
 * @return {string} humanized approximation of time
 */
const humanizeDuration$1 = d => {
  if (d < 60000) {
    const p = metric.prefix(d, -1);
    return math$1.round(p.n * 100) / 100 + p.prefix + 's'
  }
  d = math$1.floor(d / 1000);
  const seconds = d % 60;
  const minutes = math$1.floor(d / 60) % 60;
  const hours = math$1.floor(d / 3600) % 24;
  const days = math$1.floor(d / 86400);
  if (days > 0) {
    return days + 'd' + ((hours > 0 || minutes > 30) ? ' ' + (minutes > 30 ? hours + 1 : hours) + 'h' : '')
  }
  if (hours > 0) {
    /* istanbul ignore next */
    return hours + 'h' + ((minutes > 0 || seconds > 30) ? ' ' + (seconds > 30 ? minutes + 1 : minutes) + 'min' : '')
  }
  return minutes + 'min' + (seconds > 0 ? ' ' + seconds + 's' : '')
};

var time$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getDate: getDate$1,
  getUnixTime: getUnixTime$1,
  humanizeDuration: humanizeDuration$1
});

var getDate_1 = getDate$1;
var getUnixTime_1 = getUnixTime$1;
var humanizeDuration_1 = humanizeDuration$1;
var time_1$1 = time$2;


var timeE00067da = {
	getDate: getDate_1,
	getUnixTime: getUnixTime_1,
	humanizeDuration: humanizeDuration_1,
	time: time_1$1
};

var time$1 = timeE00067da;

/**
 * Utility helpers to work with promises.
 *
 * @module promise
 */

/**
 * @template T
 * @callback PromiseResolve
 * @param {T|PromiseLike<T>} [result]
 */

/**
 * @template T
 * @param {function(PromiseResolve<T>,function(Error):void):any} f
 * @return {Promise<T>}
 */
const create$8 = f => /** @type {Promise<T>} */ (new Promise(f));

/**
 * @param {function(function():void,function(Error):void):void} f
 * @return {Promise<void>}
 */
const createEmpty$1 = f => new Promise(f);

/**
 * `Promise.all` wait for all promises in the array to resolve and return the result
 * @template T
 * @param {Array<Promise<T>>} arrp
 * @return {Promise<Array<T>>}
 */
const all$1 = arrp => Promise.all(arrp);

/**
 * @param {Error} [reason]
 * @return {Promise<never>}
 */
const reject$1 = reason => Promise.reject(reason);

/**
 * @template T
 * @param {T|void} res
 * @return {Promise<T|void>}
 */
const resolve$1 = res => Promise.resolve(res);

/**
 * @template T
 * @param {T} res
 * @return {Promise<T>}
 */
const resolveWith$1 = res => Promise.resolve(res);

/**
 * @todo Next version, reorder parameters: check, [timeout, [intervalResolution]]
 *
 * @param {number} timeout
 * @param {function():boolean} check
 * @param {number} [intervalResolution]
 * @return {Promise<void>}
 */
const until$1 = (timeout, check, intervalResolution = 10) => create$8((resolve, reject) => {
  const startTime = time$1.getUnixTime();
  const hasTimeout = timeout > 0;
  const untilInterval = () => {
    if (check()) {
      clearInterval(intervalHandle);
      resolve();
    } else if (hasTimeout) {
      /* istanbul ignore else */
      if (time$1.getUnixTime() - startTime > timeout) {
        clearInterval(intervalHandle);
        reject(new Error('Timeout'));
      }
    }
  };
  const intervalHandle = setInterval(untilInterval, intervalResolution);
});

/**
 * @param {number} timeout
 * @return {Promise<undefined>}
 */
const wait$1 = timeout => create$8((resolve, reject) => setTimeout(resolve, timeout));

/**
 * Checks if an object is a promise using ducktyping.
 *
 * Promises are often polyfilled, so it makes sense to add some additional guarantees if the user of this
 * library has some insane environment where global Promise objects are overwritten.
 *
 * @param {any} p
 * @return {boolean}
 */
const isPromise$1 = p => p instanceof Promise || (p && p.then && p.catch && p.finally);

var promise$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$8,
  createEmpty: createEmpty$1,
  all: all$1,
  reject: reject$1,
  resolve: resolve$1,
  resolveWith: resolveWith$1,
  until: until$1,
  wait: wait$1,
  isPromise: isPromise$1
});

var all_1 = all$1;
var create_1$4 = create$8;
var createEmpty_1 = createEmpty$1;
var isPromise_1 = isPromise$1;
var promise_1$1 = promise$2;
var reject_1 = reject$1;
var resolve_1 = resolve$1;
var resolveWith_1 = resolveWith$1;
var until_1 = until$1;
var wait_1 = wait$1;


var promise1a9fe712 = {
	all: all_1,
	create: create_1$4,
	createEmpty: createEmpty_1,
	isPromise: isPromise_1,
	promise: promise_1$1,
	reject: reject_1,
	resolve: resolve_1,
	resolveWith: resolveWith_1,
	until: until_1,
	wait: wait_1
};

var promise$1 = promise1a9fe712;

var all = promise$1.all;
var create$7 = promise$1.create;
var createEmpty = promise$1.createEmpty;
var isPromise = promise$1.isPromise;
var reject = promise$1.reject;
var resolve = promise$1.resolve;
var resolveWith = promise$1.resolveWith;
var until = promise$1.until;
var wait = promise$1.wait;


var promise_1 = /*#__PURE__*/Object.defineProperty({
	all: all,
	create: create$7,
	createEmpty: createEmpty,
	isPromise: isPromise,
	reject: reject,
	resolve: resolve,
	resolveWith: resolveWith,
	until: until,
	wait: wait
}, '__esModule', {value: true});

var copyUint8Array = encoding$1.copyUint8Array;
var createUint8ArrayFromArrayBuffer = encoding$1.createUint8ArrayFromArrayBuffer;
var createUint8ArrayFromLen = encoding$1.createUint8ArrayFromLen;
var createUint8ArrayViewFromArrayBuffer = encoding$1.createUint8ArrayViewFromArrayBuffer;
var decodeAny = encoding$1.decodeAny;
var encodeAny = encoding$1.encodeAny;
var fromBase64 = encoding$1.fromBase64;
var toBase64 = encoding$1.toBase64;


var buffer$1 = /*#__PURE__*/Object.defineProperty({
	copyUint8Array: copyUint8Array,
	createUint8ArrayFromArrayBuffer: createUint8ArrayFromArrayBuffer,
	createUint8ArrayFromLen: createUint8ArrayFromLen,
	createUint8ArrayViewFromArrayBuffer: createUint8ArrayViewFromArrayBuffer,
	decodeAny: decodeAny,
	encodeAny: encodeAny,
	fromBase64: fromBase64,
	toBase64: toBase64
}, '__esModule', {value: true});

/**
 * Error helpers.
 *
 * @module error
 */

/* istanbul ignore next */
/**
 * @param {string} s
 * @return {Error}
 */
const create$6 = s => new Error(s);

/* istanbul ignore next */
/**
 * @throws {Error}
 * @return {never}
 */
const methodUnimplemented$1 = () => {
  throw create$6('Method unimplemented')
};

/* istanbul ignore next */
/**
 * @throws {Error}
 * @return {never}
 */
const unexpectedCase$1 = () => {
  throw create$6('Unexpected case')
};

var error$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$6,
  methodUnimplemented: methodUnimplemented$1,
  unexpectedCase: unexpectedCase$1
});

var create_1$3 = create$6;
var error_1$1 = error$2;
var methodUnimplemented_1 = methodUnimplemented$1;
var unexpectedCase_1 = unexpectedCase$1;


var error873c9cbf = {
	create: create_1$3,
	error: error_1$1,
	methodUnimplemented: methodUnimplemented_1,
	unexpectedCase: unexpectedCase_1
};

var error$1 = error873c9cbf;

var create$5 = error$1.create;
var methodUnimplemented = error$1.methodUnimplemented;
var unexpectedCase = error$1.unexpectedCase;


var error_1 = /*#__PURE__*/Object.defineProperty({
	create: create$5,
	methodUnimplemented: methodUnimplemented,
	unexpectedCase: unexpectedCase
}, '__esModule', {value: true});

var BIT1 = binary$1.BIT1;
var BIT10 = binary$1.BIT10;
var BIT11 = binary$1.BIT11;
var BIT12 = binary$1.BIT12;
var BIT13 = binary$1.BIT13;
var BIT14 = binary$1.BIT14;
var BIT15 = binary$1.BIT15;
var BIT16 = binary$1.BIT16;
var BIT17 = binary$1.BIT17;
var BIT18 = binary$1.BIT18;
var BIT19 = binary$1.BIT19;
var BIT2 = binary$1.BIT2;
var BIT20 = binary$1.BIT20;
var BIT21 = binary$1.BIT21;
var BIT22 = binary$1.BIT22;
var BIT23 = binary$1.BIT23;
var BIT24 = binary$1.BIT24;
var BIT25 = binary$1.BIT25;
var BIT26 = binary$1.BIT26;
var BIT27 = binary$1.BIT27;
var BIT28 = binary$1.BIT28;
var BIT29 = binary$1.BIT29;
var BIT3 = binary$1.BIT3;
var BIT30 = binary$1.BIT30;
var BIT31 = binary$1.BIT31;
var BIT32 = binary$1.BIT32;
var BIT4 = binary$1.BIT4;
var BIT5 = binary$1.BIT5;
var BIT6 = binary$1.BIT6;
var BIT7 = binary$1.BIT7;
var BIT8 = binary$1.BIT8;
var BIT9 = binary$1.BIT9;
var BITS0 = binary$1.BITS0;
var BITS1 = binary$1.BITS1;
var BITS10 = binary$1.BITS10;
var BITS11 = binary$1.BITS11;
var BITS12 = binary$1.BITS12;
var BITS13 = binary$1.BITS13;
var BITS14 = binary$1.BITS14;
var BITS15 = binary$1.BITS15;
var BITS16 = binary$1.BITS16;
var BITS17 = binary$1.BITS17;
var BITS18 = binary$1.BITS18;
var BITS19 = binary$1.BITS19;
var BITS2 = binary$1.BITS2;
var BITS20 = binary$1.BITS20;
var BITS21 = binary$1.BITS21;
var BITS22 = binary$1.BITS22;
var BITS23 = binary$1.BITS23;
var BITS24 = binary$1.BITS24;
var BITS25 = binary$1.BITS25;
var BITS26 = binary$1.BITS26;
var BITS27 = binary$1.BITS27;
var BITS28 = binary$1.BITS28;
var BITS29 = binary$1.BITS29;
var BITS3 = binary$1.BITS3;
var BITS30 = binary$1.BITS30;
var BITS31 = binary$1.BITS31;
var BITS32 = binary$1.BITS32;
var BITS4 = binary$1.BITS4;
var BITS5 = binary$1.BITS5;
var BITS6 = binary$1.BITS6;
var BITS7 = binary$1.BITS7;
var BITS8 = binary$1.BITS8;
var BITS9 = binary$1.BITS9;


var binary_1 = /*#__PURE__*/Object.defineProperty({
	BIT1: BIT1,
	BIT10: BIT10,
	BIT11: BIT11,
	BIT12: BIT12,
	BIT13: BIT13,
	BIT14: BIT14,
	BIT15: BIT15,
	BIT16: BIT16,
	BIT17: BIT17,
	BIT18: BIT18,
	BIT19: BIT19,
	BIT2: BIT2,
	BIT20: BIT20,
	BIT21: BIT21,
	BIT22: BIT22,
	BIT23: BIT23,
	BIT24: BIT24,
	BIT25: BIT25,
	BIT26: BIT26,
	BIT27: BIT27,
	BIT28: BIT28,
	BIT29: BIT29,
	BIT3: BIT3,
	BIT30: BIT30,
	BIT31: BIT31,
	BIT32: BIT32,
	BIT4: BIT4,
	BIT5: BIT5,
	BIT6: BIT6,
	BIT7: BIT7,
	BIT8: BIT8,
	BIT9: BIT9,
	BITS0: BITS0,
	BITS1: BITS1,
	BITS10: BITS10,
	BITS11: BITS11,
	BITS12: BITS12,
	BITS13: BITS13,
	BITS14: BITS14,
	BITS15: BITS15,
	BITS16: BITS16,
	BITS17: BITS17,
	BITS18: BITS18,
	BITS19: BITS19,
	BITS2: BITS2,
	BITS20: BITS20,
	BITS21: BITS21,
	BITS22: BITS22,
	BITS23: BITS23,
	BITS24: BITS24,
	BITS25: BITS25,
	BITS26: BITS26,
	BITS27: BITS27,
	BITS28: BITS28,
	BITS29: BITS29,
	BITS3: BITS3,
	BITS30: BITS30,
	BITS31: BITS31,
	BITS32: BITS32,
	BITS4: BITS4,
	BITS5: BITS5,
	BITS6: BITS6,
	BITS7: BITS7,
	BITS8: BITS8,
	BITS9: BITS9
}, '__esModule', {value: true});

/**
 * Utility functions for working with EcmaScript objects.
 *
 * @module object
 */

/**
 * @return {Object<string,any>} obj
 */
const create$4 = () => Object.create(null);

/**
 * Object.assign
 */
const assign$1 = Object.assign;

/**
 * @param {Object<string,any>} obj
 */
const keys$1 = Object.keys;

/**
 * @param {Object<string,any>} obj
 * @param {function(any,string):any} f
 */
const forEach$2 = (obj, f) => {
  for (const key in obj) {
    f(obj[key], key);
  }
};

/**
 * @template R
 * @param {Object<string,any>} obj
 * @param {function(any,string):R} f
 * @return {Array<R>}
 */
const map$3 = (obj, f) => {
  const results = [];
  for (const key in obj) {
    results.push(f(obj[key], key));
  }
  return results
};

/**
 * @param {Object<string,any>} obj
 * @return {number}
 */
const length$1 = obj => keys$1(obj).length;

/**
 * @param {Object<string,any>} obj
 * @param {function(any,string):boolean} f
 * @return {boolean}
 */
const some$1 = (obj, f) => {
  for (const key in obj) {
    if (f(obj[key], key)) {
      return true
    }
  }
  return false
};

/**
 * @param {Object<string,any>} obj
 * @param {function(any,string):boolean} f
 * @return {boolean}
 */
const every$1 = (obj, f) => {
  for (const key in obj) {
    if (!f(obj[key], key)) {
      return false
    }
  }
  return true
};

/**
 * Calls `Object.prototype.hasOwnProperty`.
 *
 * @param {any} obj
 * @param {string|symbol} key
 * @return {boolean}
 */
const hasProperty$1 = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

/**
 * @param {Object<string,any>} a
 * @param {Object<string,any>} b
 * @return {boolean}
 */
const equalFlat$1 = (a, b) => a === b || (length$1(a) === length$1(b) && every$1(a, (val, key) => (val !== undefined || hasProperty$1(b, key)) && b[key] === val));

var object$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$4,
  assign: assign$1,
  keys: keys$1,
  forEach: forEach$2,
  map: map$3,
  length: length$1,
  some: some$1,
  every: every$1,
  hasProperty: hasProperty$1,
  equalFlat: equalFlat$1
});

var assign_1 = assign$1;
var create_1$2 = create$4;
var equalFlat_1 = equalFlat$1;
var every_1 = every$1;
var forEach_1$1 = forEach$2;
var hasProperty_1 = hasProperty$1;
var keys_1 = keys$1;
var length_1 = length$1;
var map_1$1 = map$3;
var object_1$1 = object$2;
var some_1 = some$1;


var objectDcdd6eed = {
	assign: assign_1,
	create: create_1$2,
	equalFlat: equalFlat_1,
	every: every_1,
	forEach: forEach_1$1,
	hasProperty: hasProperty_1,
	keys: keys_1,
	length: length_1,
	map: map_1$1,
	object: object_1$1,
	some: some_1
};

var object$1 = objectDcdd6eed;

/**
 * Common functions and function call helpers.
 *
 * @module function
 */

/**
 * Calls all functions in `fs` with args. Only throws after all functions were called.
 *
 * @param {Array<function>} fs
 * @param {Array<any>} args
 */
const callAll$1 = (fs, args, i = 0) => {
  try {
    for (; i < fs.length; i++) {
      fs[i](...args);
    }
  } finally {
    if (i < fs.length) {
      callAll$1(fs, args, i + 1);
    }
  }
};

const nop$1 = () => {};

/**
 * @template T
 * @param {function():T} f
 * @return {T}
 */
const apply$1 = f => f();

/**
 * @template A
 *
 * @param {A} a
 * @return {A}
 */
const id$1 = a => a;

/**
 * @template T
 *
 * @param {T} a
 * @param {T} b
 * @return {boolean}
 */
const equalityStrict$1 = (a, b) => a === b;

/**
 * @template T
 *
 * @param {Array<T>|object} a
 * @param {Array<T>|object} b
 * @return {boolean}
 */
const equalityFlat$1 = (a, b) => a === b || (a != null && b != null && a.constructor === b.constructor && ((a instanceof Array && array$1.equalFlat(a, /** @type {Array<T>} */ (b))) || (typeof a === 'object' && object$1.equalFlat(a, b))));

/**
 * @param {any} a
 * @param {any} b
 * @return {boolean}
 */
const equalityDeep$1 = (a, b) => {
  if (a == null || b == null) {
    return equalityStrict$1(a, b)
  }
  if (a.constructor !== b.constructor) {
    return false
  }
  if (a === b) {
    return true
  }
  switch (a.constructor) {
    case ArrayBuffer:
      a = new Uint8Array(a);
      b = new Uint8Array(b);
    // eslint-disable-next-line no-fallthrough
    case Uint8Array: {
      if (a.byteLength !== b.byteLength) {
        return false
      }
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
          return false
        }
      }
      break
    }
    case Set: {
      if (a.size !== b.size) {
        return false
      }
      for (const value of a) {
        if (!b.has(value)) {
          return false
        }
      }
      break
    }
    case Map: {
      if (a.size !== b.size) {
        return false
      }
      for (const key of a.keys()) {
        if (!b.has(key) || !equalityDeep$1(a.get(key), b.get(key))) {
          return false
        }
      }
      break
    }
    case Object:
      if (object$1.length(a) !== object$1.length(b)) {
        return false
      }
      for (const key in a) {
        if (!object$1.hasProperty(a, key) || !equalityDeep$1(a[key], b[key])) {
          return false
        }
      }
      break
    case Array:
      if (a.length !== b.length) {
        return false
      }
      for (let i = 0; i < a.length; i++) {
        if (!equalityDeep$1(a[i], b[i])) {
          return false
        }
      }
      break
    default:
      return false
  }
  return true
};

var _function$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  callAll: callAll$1,
  nop: nop$1,
  apply: apply$1,
  id: id$1,
  equalityStrict: equalityStrict$1,
  equalityFlat: equalityFlat$1,
  equalityDeep: equalityDeep$1
});

var _function_1$1 = _function$1;
var apply_1 = apply$1;
var callAll_1 = callAll$1;
var equalityDeep_1 = equalityDeep$1;
var equalityFlat_1 = equalityFlat$1;
var equalityStrict_1 = equalityStrict$1;
var id_1 = id$1;
var nop_1 = nop$1;


var functionF8acb5f5 = {
	_function: _function_1$1,
	apply: apply_1,
	callAll: callAll_1,
	equalityDeep: equalityDeep_1,
	equalityFlat: equalityFlat_1,
	equalityStrict: equalityStrict_1,
	id: id_1,
	nop: nop_1
};

var _function = functionF8acb5f5;

var apply = _function.apply;
var callAll = _function.callAll;
var equalityDeep = _function.equalityDeep;
var equalityFlat = _function.equalityFlat;
var equalityStrict = _function.equalityStrict;
var id = _function.id;
var nop = _function.nop;


var _function_1 = /*#__PURE__*/Object.defineProperty({
	apply: apply,
	callAll: callAll,
	equalityDeep: equalityDeep,
	equalityFlat: equalityFlat,
	equalityStrict: equalityStrict,
	id: id,
	nop: nop
}, '__esModule', {value: true});

var create$3 = set$3.create;
var toArray = set$3.toArray;


var set_1 = /*#__PURE__*/Object.defineProperty({
	create: create$3,
	toArray: toArray
}, '__esModule', {value: true});

/**
 * Utility module to work with EcmaScript Symbols.
 *
 * @module symbol
 */

/**
 * Return fresh symbol.
 *
 * @return {Symbol}
 */
const create$2 = Symbol;

/**
 * @param {any} s
 * @return {boolean}
 */
const isSymbol$1 = s => typeof s === 'symbol';

var symbol$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	create: create$2,
	isSymbol: isSymbol$1
});

var create_1$1 = create$2;
var isSymbol_1 = isSymbol$1;
var symbol_1 = symbol$1;


var symbolC5caa724 = {
	create: create_1$1,
	isSymbol: isSymbol_1,
	symbol: symbol_1
};

/**
 * Working with value pairs.
 *
 * @module pair
 */

/**
 * @template L,R
 */
class Pair {
  /**
   * @param {L} left
   * @param {R} right
   */
  constructor (left, right) {
    this.left = left;
    this.right = right;
  }
}

/**
 * @template L,R
 * @param {L} left
 * @param {R} right
 * @return {Pair<L,R>}
 */
const create$1 = (left, right) => new Pair(left, right);

/**
 * @template L,R
 * @param {R} right
 * @param {L} left
 * @return {Pair<L,R>}
 */
const createReversed = (right, left) => new Pair(left, right);

/**
 * @template L,R
 * @param {Array<Pair<L,R>>} arr
 * @param {function(L, R):any} f
 */
const forEach$1 = (arr, f) => arr.forEach(p => f(p.left, p.right));

/**
 * @template L,R,X
 * @param {Array<Pair<L,R>>} arr
 * @param {function(L, R):X} f
 * @return {Array<X>}
 */
const map$2 = (arr, f) => arr.map(p => f(p.left, p.right));

var pair$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Pair: Pair,
  create: create$1,
  createReversed: createReversed,
  forEach: forEach$1,
  map: map$2
});

var Pair_1 = Pair;
var create_1 = create$1;
var createReversed_1 = createReversed;
var forEach_1 = forEach$1;
var map_1 = map$2;
var pair_1 = pair$1;


var pairAb022bc3 = {
	Pair: Pair_1,
	create: create_1,
	createReversed: createReversed_1,
	forEach: forEach_1,
	map: map_1,
	pair: pair_1
};

var pair = pairAb022bc3;

/* eslint-env browser */

/* istanbul ignore next */
/**
 * @type {Document}
 */
const doc = /** @type {Document} */ (typeof document !== 'undefined' ? document : {});

/**
 * @param {string} name
 * @return {HTMLElement}
 */
/* istanbul ignore next */
const createElement = name => doc.createElement(name);

/**
 * @return {DocumentFragment}
 */
/* istanbul ignore next */
const createDocumentFragment = () => doc.createDocumentFragment();

/**
 * @param {string} text
 * @return {Text}
 */
/* istanbul ignore next */
const createTextNode = text => doc.createTextNode(text);

/* istanbul ignore next */
const domParser = /** @type {DOMParser} */ (typeof DOMParser !== 'undefined' ? new DOMParser() : null);

/**
 * @param {HTMLElement} el
 * @param {string} name
 * @param {Object} opts
 */
/* istanbul ignore next */
const emitCustomEvent = (el, name, opts) => el.dispatchEvent(new CustomEvent(name, opts));

/**
 * @param {Element} el
 * @param {Array<pair.Pair<string,string|boolean>>} attrs Array of key-value pairs
 * @return {Element}
 */
/* istanbul ignore next */
const setAttributes = (el, attrs) => {
  pair.forEach(attrs, (key, value) => {
    if (value === false) {
      el.removeAttribute(key);
    } else if (value === true) {
      el.setAttribute(key, '');
    } else {
      // @ts-ignore
      el.setAttribute(key, value);
    }
  });
  return el
};

/**
 * @param {Element} el
 * @param {Map<string, string>} attrs Array of key-value pairs
 * @return {Element}
 */
/* istanbul ignore next */
const setAttributesMap = (el, attrs) => {
  attrs.forEach((value, key) => { el.setAttribute(key, value); });
  return el
};

/**
 * @param {Array<Node>|HTMLCollection} children
 * @return {DocumentFragment}
 */
/* istanbul ignore next */
const fragment = children => {
  const fragment = createDocumentFragment();
  for (let i = 0; i < children.length; i++) {
    appendChild(fragment, children[i]);
  }
  return fragment
};

/**
 * @param {Element} parent
 * @param {Array<Node>} nodes
 * @return {Element}
 */
/* istanbul ignore next */
const append = (parent, nodes) => {
  appendChild(parent, fragment(nodes));
  return parent
};

/**
 * @param {HTMLElement} el
 */
/* istanbul ignore next */
const remove = el => el.remove();

/**
 * @param {EventTarget} el
 * @param {string} name
 * @param {EventListener} f
 */
/* istanbul ignore next */
const addEventListener$1 = (el, name, f) => el.addEventListener(name, f);

/**
 * @param {EventTarget} el
 * @param {string} name
 * @param {EventListener} f
 */
/* istanbul ignore next */
const removeEventListener = (el, name, f) => el.removeEventListener(name, f);

/**
 * @param {Node} node
 * @param {Array<pair.Pair<string,EventListener>>} listeners
 * @return {Node}
 */
/* istanbul ignore next */
const addEventListeners = (node, listeners) => {
  pair.forEach(listeners, (name, f) => addEventListener$1(node, name, f));
  return node
};

/**
 * @param {Node} node
 * @param {Array<pair.Pair<string,EventListener>>} listeners
 * @return {Node}
 */
/* istanbul ignore next */
const removeEventListeners = (node, listeners) => {
  pair.forEach(listeners, (name, f) => removeEventListener(node, name, f));
  return node
};

/**
 * @param {string} name
 * @param {Array<pair.Pair<string,string>|pair.Pair<string,boolean>>} attrs Array of key-value pairs
 * @param {Array<Node>} children
 * @return {Element}
 */
/* istanbul ignore next */
const element = (name, attrs = [], children = []) =>
  append(setAttributes(createElement(name), attrs), children);

/**
 * @param {number} width
 * @param {number} height
 */
/* istanbul ignore next */
const canvas = (width, height) => {
  const c = /** @type {HTMLCanvasElement} */ (createElement('canvas'));
  c.height = height;
  c.width = width;
  return c
};

/**
 * @param {string} t
 * @return {Text}
 */
/* istanbul ignore next */
const text = createTextNode;

/**
 * @param {pair.Pair<string,string>} pair
 */
/* istanbul ignore next */
const pairToStyleString = pair => `${pair.left}:${pair.right};`;

/**
 * @param {Array<pair.Pair<string,string>>} pairs
 * @return {string}
 */
/* istanbul ignore next */
const pairsToStyleString = pairs => pairs.map(pairToStyleString).join('');

/**
 * @param {Map<string,string>} m
 * @return {string}
 */
/* istanbul ignore next */
const mapToStyleString = m => map$4.map(m, (value, key) => `${key}:${value};`).join('');

/**
 * @todo should always query on a dom element
 *
 * @param {HTMLElement|ShadowRoot} el
 * @param {string} query
 * @return {HTMLElement | null}
 */
/* istanbul ignore next */
const querySelector = (el, query) => el.querySelector(query);

/**
 * @param {HTMLElement|ShadowRoot} el
 * @param {string} query
 * @return {NodeListOf<HTMLElement>}
 */
/* istanbul ignore next */
const querySelectorAll = (el, query) => el.querySelectorAll(query);

/**
 * @param {string} id
 * @return {HTMLElement}
 */
/* istanbul ignore next */
const getElementById = id => /** @type {HTMLElement} */ (doc.getElementById(id));

/**
 * @param {string} html
 * @return {HTMLElement}
 */
/* istanbul ignore next */
const _parse = html => domParser.parseFromString(`<html><body>${html}</body></html>`, 'text/html').body;

/**
 * @param {string} html
 * @return {DocumentFragment}
 */
/* istanbul ignore next */
const parseFragment = html => fragment(/** @type {any} */ (_parse(html).childNodes));

/**
 * @param {string} html
 * @return {HTMLElement}
 */
/* istanbul ignore next */
const parseElement = html => /** @type HTMLElement */ (_parse(html).firstElementChild);

/**
 * @param {HTMLElement} oldEl
 * @param {HTMLElement|DocumentFragment} newEl
 */
/* istanbul ignore next */
const replaceWith = (oldEl, newEl) => oldEl.replaceWith(newEl);

/**
 * @param {HTMLElement} parent
 * @param {HTMLElement} el
 * @param {Node|null} ref
 * @return {HTMLElement}
 */
/* istanbul ignore next */
const insertBefore = (parent, el, ref) => parent.insertBefore(el, ref);

/**
 * @param {Node} parent
 * @param {Node} child
 * @return {Node}
 */
/* istanbul ignore next */
const appendChild = (parent, child) => parent.appendChild(child);

const ELEMENT_NODE = doc.ELEMENT_NODE;
const TEXT_NODE = doc.TEXT_NODE;
const CDATA_SECTION_NODE = doc.CDATA_SECTION_NODE;
const COMMENT_NODE = doc.COMMENT_NODE;
const DOCUMENT_NODE = doc.DOCUMENT_NODE;
const DOCUMENT_TYPE_NODE = doc.DOCUMENT_TYPE_NODE;
const DOCUMENT_FRAGMENT_NODE = doc.DOCUMENT_FRAGMENT_NODE;

/**
 * @param {any} node
 * @param {number} type
 */
const checkNodeType = (node, type) => node.nodeType === type;

/**
 * @param {Node} parent
 * @param {HTMLElement} child
 */
const isParentOf$1 = (parent, child) => {
  let p = child.parentNode;
  while (p && p !== parent) {
    p = p.parentNode;
  }
  return p === parent
};

var dom$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  doc: doc,
  createElement: createElement,
  createDocumentFragment: createDocumentFragment,
  createTextNode: createTextNode,
  domParser: domParser,
  emitCustomEvent: emitCustomEvent,
  setAttributes: setAttributes,
  setAttributesMap: setAttributesMap,
  fragment: fragment,
  append: append,
  remove: remove,
  addEventListener: addEventListener$1,
  removeEventListener: removeEventListener,
  addEventListeners: addEventListeners,
  removeEventListeners: removeEventListeners,
  element: element,
  canvas: canvas,
  text: text,
  pairToStyleString: pairToStyleString,
  pairsToStyleString: pairsToStyleString,
  mapToStyleString: mapToStyleString,
  querySelector: querySelector,
  querySelectorAll: querySelectorAll,
  getElementById: getElementById,
  parseFragment: parseFragment,
  parseElement: parseElement,
  replaceWith: replaceWith,
  insertBefore: insertBefore,
  appendChild: appendChild,
  ELEMENT_NODE: ELEMENT_NODE,
  TEXT_NODE: TEXT_NODE,
  CDATA_SECTION_NODE: CDATA_SECTION_NODE,
  COMMENT_NODE: COMMENT_NODE,
  DOCUMENT_NODE: DOCUMENT_NODE,
  DOCUMENT_TYPE_NODE: DOCUMENT_TYPE_NODE,
  DOCUMENT_FRAGMENT_NODE: DOCUMENT_FRAGMENT_NODE,
  checkNodeType: checkNodeType,
  isParentOf: isParentOf$1
});

var CDATA_SECTION_NODE_1 = CDATA_SECTION_NODE;
var COMMENT_NODE_1 = COMMENT_NODE;
var DOCUMENT_FRAGMENT_NODE_1 = DOCUMENT_FRAGMENT_NODE;
var DOCUMENT_NODE_1 = DOCUMENT_NODE;
var DOCUMENT_TYPE_NODE_1 = DOCUMENT_TYPE_NODE;
var ELEMENT_NODE_1 = ELEMENT_NODE;
var TEXT_NODE_1 = TEXT_NODE;
var addEventListener_1 = addEventListener$1;
var addEventListeners_1 = addEventListeners;
var append_1 = append;
var appendChild_1 = appendChild;
var canvas_1 = canvas;
var checkNodeType_1 = checkNodeType;
var createDocumentFragment_1 = createDocumentFragment;
var createElement_1 = createElement;
var createTextNode_1 = createTextNode;
var doc_1 = doc;
var dom_1 = dom$1;
var domParser_1 = domParser;
var element_1 = element;
var emitCustomEvent_1 = emitCustomEvent;
var fragment_1 = fragment;
var getElementById_1 = getElementById;
var insertBefore_1 = insertBefore;
var isParentOf_1$1 = isParentOf$1;
var mapToStyleString_1 = mapToStyleString;
var pairToStyleString_1 = pairToStyleString;
var pairsToStyleString_1 = pairsToStyleString;
var parseElement_1 = parseElement;
var parseFragment_1 = parseFragment;
var querySelector_1 = querySelector;
var querySelectorAll_1 = querySelectorAll;
var remove_1 = remove;
var removeEventListener_1 = removeEventListener;
var removeEventListeners_1 = removeEventListeners;
var replaceWith_1 = replaceWith;
var setAttributes_1 = setAttributes;
var setAttributesMap_1 = setAttributesMap;
var text_1 = text;


var dom58958c04 = {
	CDATA_SECTION_NODE: CDATA_SECTION_NODE_1,
	COMMENT_NODE: COMMENT_NODE_1,
	DOCUMENT_FRAGMENT_NODE: DOCUMENT_FRAGMENT_NODE_1,
	DOCUMENT_NODE: DOCUMENT_NODE_1,
	DOCUMENT_TYPE_NODE: DOCUMENT_TYPE_NODE_1,
	ELEMENT_NODE: ELEMENT_NODE_1,
	TEXT_NODE: TEXT_NODE_1,
	addEventListener: addEventListener_1,
	addEventListeners: addEventListeners_1,
	append: append_1,
	appendChild: appendChild_1,
	canvas: canvas_1,
	checkNodeType: checkNodeType_1,
	createDocumentFragment: createDocumentFragment_1,
	createElement: createElement_1,
	createTextNode: createTextNode_1,
	doc: doc_1,
	dom: dom_1,
	domParser: domParser_1,
	element: element_1,
	emitCustomEvent: emitCustomEvent_1,
	fragment: fragment_1,
	getElementById: getElementById_1,
	insertBefore: insertBefore_1,
	isParentOf: isParentOf_1$1,
	mapToStyleString: mapToStyleString_1,
	pairToStyleString: pairToStyleString_1,
	pairsToStyleString: pairsToStyleString_1,
	parseElement: parseElement_1,
	parseFragment: parseFragment_1,
	querySelector: querySelector_1,
	querySelectorAll: querySelectorAll_1,
	remove: remove_1,
	removeEventListener: removeEventListener_1,
	removeEventListeners: removeEventListeners_1,
	replaceWith: replaceWith_1,
	setAttributes: setAttributes_1,
	setAttributesMap: setAttributesMap_1,
	text: text_1
};

/**
 * JSON utility functions.
 *
 * @module json
 */

/**
 * Transform JavaScript object to JSON.
 *
 * @param {any} object
 * @return {string}
 */
const stringify = JSON.stringify;

/**
 * Parse JSON object.
 *
 * @param {string} json
 * @return {any}
 */
const parse = JSON.parse;

var json$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	stringify: stringify,
	parse: parse
});

var json_1 = json$1;
var parse_1 = parse;
var stringify_1 = stringify;


var json092190a1 = {
	json: json_1,
	parse: parse_1,
	stringify: stringify_1
};

/* global requestIdleCallback, requestAnimationFrame, cancelIdleCallback, cancelAnimationFrame */

/**
 * Utility module to work with EcmaScript's event loop.
 *
 * @module eventloop
 */

/**
 * @type {Array<function>}
 */
let queue = [];

const _runQueue = () => {
  for (let i = 0; i < queue.length; i++) {
    queue[i]();
  }
  queue = [];
};

/**
 * @param {function():void} f
 */
const enqueue = f => {
  queue.push(f);
  if (queue.length === 1) {
    setTimeout(_runQueue, 0);
  }
};

/**
 * @typedef {Object} TimeoutObject
 * @property {function} TimeoutObject.destroy
 */

/**
 * @param {function(number):void} clearFunction
 */
const createTimeoutClass = clearFunction => class TT {
  /**
   * @param {number} timeoutId
   */
  constructor (timeoutId) {
    this._ = timeoutId;
  }

  destroy () {
    clearFunction(this._);
  }
};

const Timeout = createTimeoutClass(clearTimeout);

/**
 * @param {number} timeout
 * @param {function} callback
 * @return {TimeoutObject}
 */
const timeout = (timeout, callback) => new Timeout(setTimeout(callback, timeout));

const Interval = createTimeoutClass(clearInterval);

/**
 * @param {number} timeout
 * @param {function} callback
 * @return {TimeoutObject}
 */
const interval = (timeout, callback) => new Interval(setInterval(callback, timeout));

/* istanbul ignore next */
const Animation = createTimeoutClass(arg => typeof requestAnimationFrame !== 'undefined' && cancelAnimationFrame(arg));

/* istanbul ignore next */
/**
 * @param {function(number):void} cb
 * @return {TimeoutObject}
 */
const animationFrame = cb => typeof requestAnimationFrame === 'undefined' ? timeout(0, cb) : new Animation(requestAnimationFrame(cb));

/* istanbul ignore next */
// @ts-ignore
const Idle = createTimeoutClass(arg => typeof cancelIdleCallback !== 'undefined' && cancelIdleCallback(arg));

/* istanbul ignore next */
/**
 * Note: this is experimental and is probably only useful in browsers.
 *
 * @param {function} cb
 * @return {TimeoutObject}
 */
// @ts-ignore
const idleCallback = cb => typeof requestIdleCallback !== 'undefined' ? new Idle(requestIdleCallback(cb)) : timeout(1000, cb);

/**
 * @param {number} timeout Timeout of the debounce action
 * @return {function(function():void):void}
 */
const createDebouncer = timeout => {
  let timer = -1;
  return f => {
    clearTimeout(timer);
    if (f) {
      timer = /** @type {any} */ (setTimeout(f, timeout));
    }
  }
};

var eventloop$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  enqueue: enqueue,
  timeout: timeout,
  interval: interval,
  Animation: Animation,
  animationFrame: animationFrame,
  idleCallback: idleCallback,
  createDebouncer: createDebouncer
});

var Animation_1 = Animation;
var animationFrame_1 = animationFrame;
var createDebouncer_1 = createDebouncer;
var enqueue_1 = enqueue;
var eventloop_1 = eventloop$1;
var idleCallback_1 = idleCallback;
var interval_1 = interval;
var timeout_1 = timeout;


var eventloopC60b5658 = {
	Animation: Animation_1,
	animationFrame: animationFrame_1,
	createDebouncer: createDebouncer_1,
	enqueue: enqueue_1,
	eventloop: eventloop_1,
	idleCallback: idleCallback_1,
	interval: interval_1,
	timeout: timeout_1
};

var symbol = symbolC5caa724;

var dom = dom58958c04;

var json = json092190a1;

var eventloop = eventloopC60b5658;

/**
 * Isomorphic logging module with support for colors!
 *
 * @module logging
 */

const BOLD$1 = symbol.create();
const UNBOLD$1 = symbol.create();
const BLUE$1 = symbol.create();
const GREY$1 = symbol.create();
const GREEN$1 = symbol.create();
const RED$1 = symbol.create();
const PURPLE$1 = symbol.create();
const ORANGE$1 = symbol.create();
const UNCOLOR$1 = symbol.create();

/**
 * @type {Object<Symbol,pair.Pair<string,string>>}
 */
const _browserStyleMap = {
  [BOLD$1]: pair.create('font-weight', 'bold'),
  [UNBOLD$1]: pair.create('font-weight', 'normal'),
  [BLUE$1]: pair.create('color', 'blue'),
  [GREEN$1]: pair.create('color', 'green'),
  [GREY$1]: pair.create('color', 'grey'),
  [RED$1]: pair.create('color', 'red'),
  [PURPLE$1]: pair.create('color', 'purple'),
  [ORANGE$1]: pair.create('color', 'orange'), // not well supported in chrome when debugging node with inspector - TODO: deprecate
  [UNCOLOR$1]: pair.create('color', 'black')
};

const _nodeStyleMap = {
  [BOLD$1]: '\u001b[1m',
  [UNBOLD$1]: '\u001b[2m',
  [BLUE$1]: '\x1b[34m',
  [GREEN$1]: '\x1b[32m',
  [GREY$1]: '\u001b[37m',
  [RED$1]: '\x1b[31m',
  [PURPLE$1]: '\x1b[35m',
  [ORANGE$1]: '\x1b[38;5;208m',
  [UNCOLOR$1]: '\x1b[0m'
};

/* istanbul ignore next */
/**
 * @param {Array<string|Symbol|Object|number>} args
 * @return {Array<string|object|number>}
 */
const computeBrowserLoggingArgs = args => {
  const strBuilder = [];
  const styles = [];
  const currentStyle = map$4.create();
  /**
   * @type {Array<string|Object|number>}
   */
  let logArgs = [];
  // try with formatting until we find something unsupported
  let i = 0;

  for (; i < args.length; i++) {
    const arg = args[i];
    // @ts-ignore
    const style = _browserStyleMap[arg];
    if (style !== undefined) {
      currentStyle.set(style.left, style.right);
    } else {
      if (arg.constructor === String || arg.constructor === Number) {
        const style = dom.mapToStyleString(currentStyle);
        if (i > 0 || style.length > 0) {
          strBuilder.push('%c' + arg);
          styles.push(style);
        } else {
          strBuilder.push(arg);
        }
      } else {
        break
      }
    }
  }

  if (i > 0) {
    // create logArgs with what we have so far
    logArgs = styles;
    logArgs.unshift(strBuilder.join(''));
  }
  // append the rest
  for (; i < args.length; i++) {
    const arg = args[i];
    if (!(arg instanceof Symbol)) {
      logArgs.push(arg);
    }
  }
  return logArgs
};

/**
 * @param {Array<string|Symbol|Object|number>} args
 * @return {Array<string|object|number>}
 */
const computeNodeLoggingArgs = args => {
  const strBuilder = [];
  const logArgs = [];

  // try with formatting until we find something unsupported
  let i = 0;

  for (; i < args.length; i++) {
    const arg = args[i];
    // @ts-ignore
    const style = _nodeStyleMap[arg];
    if (style !== undefined) {
      strBuilder.push(style);
    } else {
      if (arg.constructor === String || arg.constructor === Number) {
        strBuilder.push(arg);
      } else {
        break
      }
    }
  }
  if (i > 0) {
    // create logArgs with what we have so far
    strBuilder.push('\x1b[0m');
    logArgs.push(strBuilder.join(''));
  }
  // append the rest
  for (; i < args.length; i++) {
    const arg = args[i];
    /* istanbul ignore else */
    if (!(arg instanceof Symbol)) {
      logArgs.push(arg);
    }
  }
  return logArgs
};

/* istanbul ignore next */
const computeLoggingArgs = environment.isNode ? computeNodeLoggingArgs : computeBrowserLoggingArgs;

/**
 * @param {Array<string|Symbol|Object|number>} args
 */
const print$1 = (...args) => {
  console.log(...computeLoggingArgs(args));
  /* istanbul ignore next */
  vconsoles$1.forEach(vc => vc.print(args));
};

/* istanbul ignore next */
/**
 * @param {Array<string|Symbol|Object|number>} args
 */
const warn$1 = (...args) => {
  console.warn(...computeLoggingArgs(args));
  args.unshift(ORANGE$1);
  vconsoles$1.forEach(vc => vc.print(args));
};

/* istanbul ignore next */
/**
 * @param {Error} err
 */
const printError$1 = err => {
  console.error(err);
  vconsoles$1.forEach(vc => vc.printError(err));
};

/* istanbul ignore next */
/**
 * @param {string} url image location
 * @param {number} height height of the image in pixel
 */
const printImg$1 = (url, height) => {
  if (environment.isBrowser) {
    console.log('%c                      ', `font-size: ${height}px; background-size: contain; background-repeat: no-repeat; background-image: url(${url})`);
    // console.log('%c                ', `font-size: ${height}x; background: url(${url}) no-repeat;`)
  }
  vconsoles$1.forEach(vc => vc.printImg(url, height));
};

/* istanbul ignore next */
/**
 * @param {string} base64
 * @param {number} height
 */
const printImgBase64$1 = (base64, height) => printImg$1(`data:image/gif;base64,${base64}`, height);

/**
 * @param {Array<string|Symbol|Object|number>} args
 */
const group$1 = (...args) => {
  console.group(...computeLoggingArgs(args));
  /* istanbul ignore next */
  vconsoles$1.forEach(vc => vc.group(args));
};

/**
 * @param {Array<string|Symbol|Object|number>} args
 */
const groupCollapsed$1 = (...args) => {
  console.groupCollapsed(...computeLoggingArgs(args));
  /* istanbul ignore next */
  vconsoles$1.forEach(vc => vc.groupCollapsed(args));
};

const groupEnd$1 = () => {
  console.groupEnd();
  /* istanbul ignore next */
  vconsoles$1.forEach(vc => vc.groupEnd());
};

/* istanbul ignore next */
/**
 * @param {function():Node} createNode
 */
const printDom$1 = createNode =>
  vconsoles$1.forEach(vc => vc.printDom(createNode()));

/* istanbul ignore next */
/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} height
 */
const printCanvas$1 = (canvas, height) => printImg$1(canvas.toDataURL(), height);

const vconsoles$1 = new Set();

/* istanbul ignore next */
/**
 * @param {Array<string|Symbol|Object|number>} args
 * @return {Array<Element>}
 */
const _computeLineSpans = args => {
  const spans = [];
  const currentStyle = new Map();
  // try with formatting until we find something unsupported
  let i = 0;
  for (; i < args.length; i++) {
    const arg = args[i];
    // @ts-ignore
    const style = _browserStyleMap[arg];
    if (style !== undefined) {
      currentStyle.set(style.left, style.right);
    } else {
      if (arg.constructor === String || arg.constructor === Number) {
        // @ts-ignore
        const span = dom.element('span', [pair.create('style', dom.mapToStyleString(currentStyle))], [dom.text(arg)]);
        if (span.innerHTML === '') {
          span.innerHTML = '&nbsp;';
        }
        spans.push(span);
      } else {
        break
      }
    }
  }
  // append the rest
  for (; i < args.length; i++) {
    let content = args[i];
    if (!(content instanceof Symbol)) {
      if (content.constructor !== String && content.constructor !== Number) {
        content = ' ' + json.stringify(content) + ' ';
      }
      spans.push(dom.element('span', [], [dom.text(/** @type {string} */ (content))]));
    }
  }
  return spans
};

const lineStyle = 'font-family:monospace;border-bottom:1px solid #e2e2e2;padding:2px;';

/* istanbul ignore next */
class VConsole$1 {
  /**
   * @param {Element} dom
   */
  constructor (dom) {
    this.dom = dom;
    /**
     * @type {Element}
     */
    this.ccontainer = this.dom;
    this.depth = 0;
    vconsoles$1.add(this);
  }

  /**
   * @param {Array<string|Symbol|Object|number>} args
   * @param {boolean} collapsed
   */
  group (args, collapsed = false) {
    eventloop.enqueue(() => {
      const triangleDown = dom.element('span', [pair.create('hidden', collapsed), pair.create('style', 'color:grey;font-size:120%;')], [dom.text('▼')]);
      const triangleRight = dom.element('span', [pair.create('hidden', !collapsed), pair.create('style', 'color:grey;font-size:125%;')], [dom.text('▶')]);
      const content = dom.element('div', [pair.create('style', `${lineStyle};padding-left:${this.depth * 10}px`)], [triangleDown, triangleRight, dom.text(' ')].concat(_computeLineSpans(args)));
      const nextContainer = dom.element('div', [pair.create('hidden', collapsed)]);
      const nextLine = dom.element('div', [], [content, nextContainer]);
      dom.append(this.ccontainer, [nextLine]);
      this.ccontainer = nextContainer;
      this.depth++;
      // when header is clicked, collapse/uncollapse container
      dom.addEventListener(content, 'click', event => {
        nextContainer.toggleAttribute('hidden');
        triangleDown.toggleAttribute('hidden');
        triangleRight.toggleAttribute('hidden');
      });
    });
  }

  /**
   * @param {Array<string|Symbol|Object|number>} args
   */
  groupCollapsed (args) {
    this.group(args, true);
  }

  groupEnd () {
    eventloop.enqueue(() => {
      if (this.depth > 0) {
        this.depth--;
        // @ts-ignore
        this.ccontainer = this.ccontainer.parentElement.parentElement;
      }
    });
  }

  /**
   * @param {Array<string|Symbol|Object|number>} args
   */
  print (args) {
    eventloop.enqueue(() => {
      dom.append(this.ccontainer, [dom.element('div', [pair.create('style', `${lineStyle};padding-left:${this.depth * 10}px`)], _computeLineSpans(args))]);
    });
  }

  /**
   * @param {Error} err
   */
  printError (err) {
    this.print([RED$1, BOLD$1, err.toString()]);
  }

  /**
   * @param {string} url
   * @param {number} height
   */
  printImg (url, height) {
    eventloop.enqueue(() => {
      dom.append(this.ccontainer, [dom.element('img', [pair.create('src', url), pair.create('height', `${math$1.round(height * 1.5)}px`)])]);
    });
  }

  /**
   * @param {Node} node
   */
  printDom (node) {
    eventloop.enqueue(() => {
      dom.append(this.ccontainer, [node]);
    });
  }

  destroy () {
    eventloop.enqueue(() => {
      vconsoles$1.delete(this);
    });
  }
}

/* istanbul ignore next */
/**
 * @param {Element} dom
 */
const createVConsole$1 = dom => new VConsole$1(dom);

const loggingColors = [GREEN$1, PURPLE$1, ORANGE$1, BLUE$1];
let nextColor = 0;
let lastLoggingTime = time$1.getUnixTime();

/**
 * @param {string} moduleName
 * @return {function(...any):void}
 */
const createModuleLogger$1 = moduleName => {
  const color = loggingColors[nextColor];
  const debugRegexVar = environment.getVariable('log');
  const doLogging = debugRegexVar !== null && (debugRegexVar === '*' || debugRegexVar === 'true' || new RegExp(debugRegexVar, 'gi').test(moduleName));
  nextColor = (nextColor + 1) % loggingColors.length;
  moduleName += ': ';

  return !doLogging ? _function.nop : (...args) => {
    const timeNow = time$1.getUnixTime();
    const timeDiff = timeNow - lastLoggingTime;
    lastLoggingTime = timeNow;
    print$1(color, moduleName, UNCOLOR$1, ...args.map(arg => (typeof arg === 'string' || typeof arg === 'symbol') ? arg : JSON.stringify(arg)), color, ' +' + timeDiff + 'ms');
  }
};

var logging$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  BOLD: BOLD$1,
  UNBOLD: UNBOLD$1,
  BLUE: BLUE$1,
  GREY: GREY$1,
  GREEN: GREEN$1,
  RED: RED$1,
  PURPLE: PURPLE$1,
  ORANGE: ORANGE$1,
  UNCOLOR: UNCOLOR$1,
  print: print$1,
  warn: warn$1,
  printError: printError$1,
  printImg: printImg$1,
  printImgBase64: printImgBase64$1,
  group: group$1,
  groupCollapsed: groupCollapsed$1,
  groupEnd: groupEnd$1,
  printDom: printDom$1,
  printCanvas: printCanvas$1,
  vconsoles: vconsoles$1,
  VConsole: VConsole$1,
  createVConsole: createVConsole$1,
  createModuleLogger: createModuleLogger$1
});

var BLUE_1 = BLUE$1;
var BOLD_1 = BOLD$1;
var GREEN_1 = GREEN$1;
var GREY_1 = GREY$1;
var ORANGE_1 = ORANGE$1;
var PURPLE_1 = PURPLE$1;
var RED_1 = RED$1;
var UNBOLD_1 = UNBOLD$1;
var UNCOLOR_1 = UNCOLOR$1;
var VConsole_1 = VConsole$1;
var createModuleLogger_1 = createModuleLogger$1;
var createVConsole_1 = createVConsole$1;
var group_1 = group$1;
var groupCollapsed_1 = groupCollapsed$1;
var groupEnd_1 = groupEnd$1;
var logging_1$1 = logging$2;
var print_1 = print$1;
var printCanvas_1 = printCanvas$1;
var printDom_1 = printDom$1;
var printError_1 = printError$1;
var printImg_1 = printImg$1;
var printImgBase64_1 = printImgBase64$1;
var vconsoles_1 = vconsoles$1;
var warn_1 = warn$1;


var logging7cc36806 = {
	BLUE: BLUE_1,
	BOLD: BOLD_1,
	GREEN: GREEN_1,
	GREY: GREY_1,
	ORANGE: ORANGE_1,
	PURPLE: PURPLE_1,
	RED: RED_1,
	UNBOLD: UNBOLD_1,
	UNCOLOR: UNCOLOR_1,
	VConsole: VConsole_1,
	createModuleLogger: createModuleLogger_1,
	createVConsole: createVConsole_1,
	group: group_1,
	groupCollapsed: groupCollapsed_1,
	groupEnd: groupEnd_1,
	logging: logging_1$1,
	print: print_1,
	printCanvas: printCanvas_1,
	printDom: printDom_1,
	printError: printError_1,
	printImg: printImg_1,
	printImgBase64: printImgBase64_1,
	vconsoles: vconsoles_1,
	warn: warn_1
};

var logging$1 = logging7cc36806;

var BLUE = logging$1.BLUE;
var BOLD = logging$1.BOLD;
var GREEN = logging$1.GREEN;
var GREY = logging$1.GREY;
var ORANGE = logging$1.ORANGE;
var PURPLE = logging$1.PURPLE;
var RED = logging$1.RED;
var UNBOLD = logging$1.UNBOLD;
var UNCOLOR = logging$1.UNCOLOR;
var VConsole = logging$1.VConsole;
var createModuleLogger = logging$1.createModuleLogger;
var createVConsole = logging$1.createVConsole;
var group = logging$1.group;
var groupCollapsed = logging$1.groupCollapsed;
var groupEnd = logging$1.groupEnd;
var print = logging$1.print;
var printCanvas = logging$1.printCanvas;
var printDom = logging$1.printDom;
var printError = logging$1.printError;
var printImg = logging$1.printImg;
var printImgBase64 = logging$1.printImgBase64;
var vconsoles = logging$1.vconsoles;
var warn = logging$1.warn;


var logging_1 = /*#__PURE__*/Object.defineProperty({
	BLUE: BLUE,
	BOLD: BOLD,
	GREEN: GREEN,
	GREY: GREY,
	ORANGE: ORANGE,
	PURPLE: PURPLE,
	RED: RED,
	UNBOLD: UNBOLD,
	UNCOLOR: UNCOLOR,
	VConsole: VConsole,
	createModuleLogger: createModuleLogger,
	createVConsole: createVConsole,
	group: group,
	groupCollapsed: groupCollapsed,
	groupEnd: groupEnd,
	print: print,
	printCanvas: printCanvas,
	printDom: printDom,
	printError: printError,
	printImg: printImg,
	printImgBase64: printImgBase64,
	vconsoles: vconsoles,
	warn: warn
}, '__esModule', {value: true});

var getDate = time$1.getDate;
var getUnixTime = time$1.getUnixTime;
var humanizeDuration = time$1.humanizeDuration;


var time_1 = /*#__PURE__*/Object.defineProperty({
	getDate: getDate,
	getUnixTime: getUnixTime,
	humanizeDuration: humanizeDuration
}, '__esModule', {value: true});

/**
 * Utility module to create and manipulate Iterators.
 *
 * @module iterator
 */

/**
 * @template T,R
 * @param {Iterator<T>} iterator
 * @param {function(T):R} f
 * @return {IterableIterator<R>}
 */
const mapIterator$1 = (iterator, f) => ({
  /**
   * @param {function(T):R} f
   */
  [Symbol.iterator] () {
    return this
  },
  // @ts-ignore
  next () {
    const r = iterator.next();
    return { value: r.done ? undefined : f(r.value), done: r.done }
  }
});

/**
 * @template T
 * @param {function():IteratorResult<T>} next
 * @return {IterableIterator<T>}
 */
const createIterator$1 = next => ({
  /**
   * @return {IterableIterator<T>}
   */
  [Symbol.iterator] () {
    return this
  },
  // @ts-ignore
  next
});

/**
 * @template T
 * @param {Iterator<T>} iterator
 * @param {function(T):boolean} filter
 */
const iteratorFilter$1 = (iterator, filter) => createIterator$1(() => {
  let res;
  do {
    res = iterator.next();
  } while (!res.done && !filter(res.value))
  return res
});

/**
 * @template T,M
 * @param {Iterator<T>} iterator
 * @param {function(T):M} fmap
 */
const iteratorMap$1 = (iterator, fmap) => createIterator$1(() => {
  const { done, value } = iterator.next();
  return { done, value: done ? undefined : fmap(value) }
});

var iterator$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  mapIterator: mapIterator$1,
  createIterator: createIterator$1,
  iteratorFilter: iteratorFilter$1,
  iteratorMap: iteratorMap$1
});

var createIterator_1 = createIterator$1;
var iterator_1$1 = iterator$2;
var iteratorFilter_1 = iteratorFilter$1;
var iteratorMap_1 = iteratorMap$1;
var mapIterator_1 = mapIterator$1;


var iteratorFe01d209 = {
	createIterator: createIterator_1,
	iterator: iterator_1$1,
	iteratorFilter: iteratorFilter_1,
	iteratorMap: iteratorMap_1,
	mapIterator: mapIterator_1
};

var iterator$1 = iteratorFe01d209;

var createIterator = iterator$1.createIterator;
var iteratorFilter = iterator$1.iteratorFilter;
var iteratorMap = iterator$1.iteratorMap;
var mapIterator = iterator$1.mapIterator;


var iterator_1 = /*#__PURE__*/Object.defineProperty({
	createIterator: createIterator,
	iteratorFilter: iteratorFilter,
	iteratorMap: iteratorMap,
	mapIterator: mapIterator
}, '__esModule', {value: true});

var assign = object$1.assign;
var create = object$1.create;
var equalFlat = object$1.equalFlat;
var every = object$1.every;
var forEach = object$1.forEach;
var hasProperty = object$1.hasProperty;
var keys = object$1.keys;
var length = object$1.length;
var map$1 = object$1.map;
var some = object$1.some;


var object_1 = /*#__PURE__*/Object.defineProperty({
	assign: assign,
	create: create,
	equalFlat: equalFlat,
	every: every,
	forEach: forEach,
	hasProperty: hasProperty,
	keys: keys,
	length: length,
	map: map$1,
	some: some
}, '__esModule', {value: true});

var observable = observable$1;

var array = array_1;

var math = math_1;

var map = map_1$2;

var encoding = encoding_1;

var decoding = decoding$1;

var random = random$1;

var promise = promise_1;

var buffer = buffer$1;

var error = error_1;

var binary = binary_1;

var f = _function_1;

var set = set_1;

var logging = logging_1;

var time = time_1;

var iterator = iterator_1;

var object = object_1;

function _interopNamespace$3(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var array__namespace = /*#__PURE__*/_interopNamespace$3(array);
var math__namespace$1 = /*#__PURE__*/_interopNamespace$3(math);
var map__namespace = /*#__PURE__*/_interopNamespace$3(map);
var encoding__namespace$2 = /*#__PURE__*/_interopNamespace$3(encoding);
var decoding__namespace$2 = /*#__PURE__*/_interopNamespace$3(decoding);
var random__namespace = /*#__PURE__*/_interopNamespace$3(random);
var promise__namespace = /*#__PURE__*/_interopNamespace$3(promise);
var buffer__namespace = /*#__PURE__*/_interopNamespace$3(buffer);
var error__namespace = /*#__PURE__*/_interopNamespace$3(error);
var binary__namespace = /*#__PURE__*/_interopNamespace$3(binary);
var f__namespace$1 = /*#__PURE__*/_interopNamespace$3(f);
var set__namespace = /*#__PURE__*/_interopNamespace$3(set);
var logging__namespace = /*#__PURE__*/_interopNamespace$3(logging);
var time__namespace$1 = /*#__PURE__*/_interopNamespace$3(time);
var iterator__namespace = /*#__PURE__*/_interopNamespace$3(iterator);
var object__namespace = /*#__PURE__*/_interopNamespace$3(object);

/**
 * This is an abstract interface that all Connectors should implement to keep them interchangeable.
 *
 * @note This interface is experimental and it is not advised to actually inherit this class.
 *       It just serves as typing information.
 *
 * @extends {Observable<any>}
 */
class AbstractConnector extends observable.Observable {
  /**
   * @param {Doc} ydoc
   * @param {any} awareness
   */
  constructor (ydoc, awareness) {
    super();
    this.doc = ydoc;
    this.awareness = awareness;
  }
}

class DeleteItem {
  /**
   * @param {number} clock
   * @param {number} len
   */
  constructor (clock, len) {
    /**
     * @type {number}
     */
    this.clock = clock;
    /**
     * @type {number}
     */
    this.len = len;
  }
}

/**
 * We no longer maintain a DeleteStore. DeleteSet is a temporary object that is created when needed.
 * - When created in a transaction, it must only be accessed after sorting, and merging
 *   - This DeleteSet is send to other clients
 * - We do not create a DeleteSet when we send a sync message. The DeleteSet message is created directly from StructStore
 * - We read a DeleteSet as part of a sync/update message. In this case the DeleteSet is already sorted and merged.
 */
class DeleteSet {
  constructor () {
    /**
     * @type {Map<number,Array<DeleteItem>>}
     */
    this.clients = new Map();
  }
}

/**
 * Iterate over all structs that the DeleteSet gc's.
 *
 * @param {Transaction} transaction
 * @param {DeleteSet} ds
 * @param {function(GC|Item):void} f
 *
 * @function
 */
const iterateDeletedStructs = (transaction, ds, f) =>
  ds.clients.forEach((deletes, clientid) => {
    const structs = /** @type {Array<GC|Item>} */ (transaction.doc.store.clients.get(clientid));
    for (let i = 0; i < deletes.length; i++) {
      const del = deletes[i];
      iterateStructs(transaction, structs, del.clock, del.len, f);
    }
  });

/**
 * @param {Array<DeleteItem>} dis
 * @param {number} clock
 * @return {number|null}
 *
 * @private
 * @function
 */
const findIndexDS = (dis, clock) => {
  let left = 0;
  let right = dis.length - 1;
  while (left <= right) {
    const midindex = math__namespace$1.floor((left + right) / 2);
    const mid = dis[midindex];
    const midclock = mid.clock;
    if (midclock <= clock) {
      if (clock < midclock + mid.len) {
        return midindex
      }
      left = midindex + 1;
    } else {
      right = midindex - 1;
    }
  }
  return null
};

/**
 * @param {DeleteSet} ds
 * @param {ID} id
 * @return {boolean}
 *
 * @private
 * @function
 */
const isDeleted = (ds, id) => {
  const dis = ds.clients.get(id.client);
  return dis !== undefined && findIndexDS(dis, id.clock) !== null
};

/**
 * @param {DeleteSet} ds
 *
 * @private
 * @function
 */
const sortAndMergeDeleteSet = ds => {
  ds.clients.forEach(dels => {
    dels.sort((a, b) => a.clock - b.clock);
    // merge items without filtering or splicing the array
    // i is the current pointer
    // j refers to the current insert position for the pointed item
    // try to merge dels[i] into dels[j-1] or set dels[j]=dels[i]
    let i, j;
    for (i = 1, j = 1; i < dels.length; i++) {
      const left = dels[j - 1];
      const right = dels[i];
      if (left.clock + left.len >= right.clock) {
        left.len = math__namespace$1.max(left.len, right.clock + right.len - left.clock);
      } else {
        if (j < i) {
          dels[j] = right;
        }
        j++;
      }
    }
    dels.length = j;
  });
};

/**
 * @param {Array<DeleteSet>} dss
 * @return {DeleteSet} A fresh DeleteSet
 */
const mergeDeleteSets = dss => {
  const merged = new DeleteSet();
  for (let dssI = 0; dssI < dss.length; dssI++) {
    dss[dssI].clients.forEach((delsLeft, client) => {
      if (!merged.clients.has(client)) {
        // Write all missing keys from current ds and all following.
        // If merged already contains `client` current ds has already been added.
        /**
         * @type {Array<DeleteItem>}
         */
        const dels = delsLeft.slice();
        for (let i = dssI + 1; i < dss.length; i++) {
          array__namespace.appendTo(dels, dss[i].clients.get(client) || []);
        }
        merged.clients.set(client, dels);
      }
    });
  }
  sortAndMergeDeleteSet(merged);
  return merged
};

/**
 * @param {DeleteSet} ds
 * @param {number} client
 * @param {number} clock
 * @param {number} length
 *
 * @private
 * @function
 */
const addToDeleteSet = (ds, client, clock, length) => {
  map__namespace.setIfUndefined(ds.clients, client, () => []).push(new DeleteItem(clock, length));
};

const createDeleteSet = () => new DeleteSet();

/**
 * @param {StructStore} ss
 * @return {DeleteSet} Merged and sorted DeleteSet
 *
 * @private
 * @function
 */
const createDeleteSetFromStructStore = ss => {
  const ds = createDeleteSet();
  ss.clients.forEach((structs, client) => {
    /**
     * @type {Array<DeleteItem>}
     */
    const dsitems = [];
    for (let i = 0; i < structs.length; i++) {
      const struct = structs[i];
      if (struct.deleted) {
        const clock = struct.id.clock;
        let len = struct.length;
        if (i + 1 < structs.length) {
          for (let next = structs[i + 1]; i + 1 < structs.length && next.deleted; next = structs[++i + 1]) {
            len += next.length;
          }
        }
        dsitems.push(new DeleteItem(clock, len));
      }
    }
    if (dsitems.length > 0) {
      ds.clients.set(client, dsitems);
    }
  });
  return ds
};

/**
 * @param {DSEncoderV1 | DSEncoderV2} encoder
 * @param {DeleteSet} ds
 *
 * @private
 * @function
 */
const writeDeleteSet = (encoder, ds) => {
  encoding__namespace$2.writeVarUint(encoder.restEncoder, ds.clients.size);
  ds.clients.forEach((dsitems, client) => {
    encoder.resetDsCurVal();
    encoding__namespace$2.writeVarUint(encoder.restEncoder, client);
    const len = dsitems.length;
    encoding__namespace$2.writeVarUint(encoder.restEncoder, len);
    for (let i = 0; i < len; i++) {
      const item = dsitems[i];
      encoder.writeDsClock(item.clock);
      encoder.writeDsLen(item.len);
    }
  });
};

/**
 * @param {DSDecoderV1 | DSDecoderV2} decoder
 * @return {DeleteSet}
 *
 * @private
 * @function
 */
const readDeleteSet = decoder => {
  const ds = new DeleteSet();
  const numClients = decoding__namespace$2.readVarUint(decoder.restDecoder);
  for (let i = 0; i < numClients; i++) {
    decoder.resetDsCurVal();
    const client = decoding__namespace$2.readVarUint(decoder.restDecoder);
    const numberOfDeletes = decoding__namespace$2.readVarUint(decoder.restDecoder);
    if (numberOfDeletes > 0) {
      const dsField = map__namespace.setIfUndefined(ds.clients, client, () => []);
      for (let i = 0; i < numberOfDeletes; i++) {
        dsField.push(new DeleteItem(decoder.readDsClock(), decoder.readDsLen()));
      }
    }
  }
  return ds
};

/**
 * @todo YDecoder also contains references to String and other Decoders. Would make sense to exchange YDecoder.toUint8Array for YDecoder.DsToUint8Array()..
 */

/**
 * @param {DSDecoderV1 | DSDecoderV2} decoder
 * @param {Transaction} transaction
 * @param {StructStore} store
 * @return {Uint8Array|null} Returns a v2 update containing all deletes that couldn't be applied yet; or null if all deletes were applied successfully.
 *
 * @private
 * @function
 */
const readAndApplyDeleteSet = (decoder, transaction, store) => {
  const unappliedDS = new DeleteSet();
  const numClients = decoding__namespace$2.readVarUint(decoder.restDecoder);
  for (let i = 0; i < numClients; i++) {
    decoder.resetDsCurVal();
    const client = decoding__namespace$2.readVarUint(decoder.restDecoder);
    const numberOfDeletes = decoding__namespace$2.readVarUint(decoder.restDecoder);
    const structs = store.clients.get(client) || [];
    const state = getState(store, client);
    for (let i = 0; i < numberOfDeletes; i++) {
      const clock = decoder.readDsClock();
      const clockEnd = clock + decoder.readDsLen();
      if (clock < state) {
        if (state < clockEnd) {
          addToDeleteSet(unappliedDS, client, state, clockEnd - state);
        }
        let index = findIndexSS(structs, clock);
        /**
         * We can ignore the case of GC and Delete structs, because we are going to skip them
         * @type {Item}
         */
        // @ts-ignore
        let struct = structs[index];
        // split the first item if necessary
        if (!struct.deleted && struct.id.clock < clock) {
          structs.splice(index + 1, 0, splitItem(transaction, struct, clock - struct.id.clock));
          index++; // increase we now want to use the next struct
        }
        while (index < structs.length) {
          // @ts-ignore
          struct = structs[index++];
          if (struct.id.clock < clockEnd) {
            if (!struct.deleted) {
              if (clockEnd < struct.id.clock + struct.length) {
                structs.splice(index, 0, splitItem(transaction, struct, clockEnd - struct.id.clock));
              }
              struct.delete(transaction);
            }
          } else {
            break
          }
        }
      } else {
        addToDeleteSet(unappliedDS, client, clock, clockEnd - clock);
      }
    }
  }
  if (unappliedDS.clients.size > 0) {
    const ds = new UpdateEncoderV2();
    encoding__namespace$2.writeVarUint(ds.restEncoder, 0); // encode 0 structs
    writeDeleteSet(ds, unappliedDS);
    return ds.toUint8Array()
  }
  return null
};

/**
 * @module Y
 */

const generateNewClientId = random__namespace.uint32;

/**
 * @typedef {Object} DocOpts
 * @property {boolean} [DocOpts.gc=true] Disable garbage collection (default: gc=true)
 * @property {function(Item):boolean} [DocOpts.gcFilter] Will be called before an Item is garbage collected. Return false to keep the Item.
 * @property {string} [DocOpts.guid] Define a globally unique identifier for this document
 * @property {string | null} [DocOpts.collectionid] Associate this document with a collection. This only plays a role if your provider has a concept of collection.
 * @property {any} [DocOpts.meta] Any kind of meta information you want to associate with this document. If this is a subdocument, remote peers will store the meta information as well.
 * @property {boolean} [DocOpts.autoLoad] If a subdocument, automatically load document. If this is a subdocument, remote peers will load the document as well automatically.
 * @property {boolean} [DocOpts.shouldLoad] Whether the document should be synced by the provider now. This is toggled to true when you call ydoc.load()
 */

/**
 * A Yjs instance handles the state of shared data.
 * @extends Observable<string>
 */
class Doc extends observable.Observable {
  /**
   * @param {DocOpts} [opts] configuration
   */
  constructor ({ guid = random__namespace.uuidv4(), collectionid = null, gc = true, gcFilter = () => true, meta = null, autoLoad = false, shouldLoad = true } = {}) {
    super();
    this.gc = gc;
    this.gcFilter = gcFilter;
    this.clientID = generateNewClientId();
    this.guid = guid;
    this.collectionid = collectionid;
    /**
     * @type {Map<string, AbstractType<YEvent>>}
     */
    this.share = new Map();
    this.store = new StructStore();
    /**
     * @type {Transaction | null}
     */
    this._transaction = null;
    /**
     * @type {Array<Transaction>}
     */
    this._transactionCleanups = [];
    /**
     * @type {Set<Doc>}
     */
    this.subdocs = new Set();
    /**
     * If this document is a subdocument - a document integrated into another document - then _item is defined.
     * @type {Item?}
     */
    this._item = null;
    this.shouldLoad = shouldLoad;
    this.autoLoad = autoLoad;
    this.meta = meta;
    this.isLoaded = false;
    this.whenLoaded = promise__namespace.create(resolve => {
      this.on('load', () => {
        this.isLoaded = true;
        resolve(this);
      });
    });
  }

  /**
   * Notify the parent document that you request to load data into this subdocument (if it is a subdocument).
   *
   * `load()` might be used in the future to request any provider to load the most current data.
   *
   * It is safe to call `load()` multiple times.
   */
  load () {
    const item = this._item;
    if (item !== null && !this.shouldLoad) {
      transact(/** @type {any} */ (item.parent).doc, transaction => {
        transaction.subdocsLoaded.add(this);
      }, null, true);
    }
    this.shouldLoad = true;
  }

  getSubdocs () {
    return this.subdocs
  }

  getSubdocGuids () {
    return new Set(Array.from(this.subdocs).map(doc => doc.guid))
  }

  /**
   * Changes that happen inside of a transaction are bundled. This means that
   * the observer fires _after_ the transaction is finished and that all changes
   * that happened inside of the transaction are sent as one message to the
   * other peers.
   *
   * @param {function(Transaction):void} f The function that should be executed as a transaction
   * @param {any} [origin] Origin of who started the transaction. Will be stored on transaction.origin
   *
   * @public
   */
  transact (f, origin = null) {
    transact(this, f, origin);
  }

  /**
   * Define a shared data type.
   *
   * Multiple calls of `y.get(name, TypeConstructor)` yield the same result
   * and do not overwrite each other. I.e.
   * `y.define(name, Y.Array) === y.define(name, Y.Array)`
   *
   * After this method is called, the type is also available on `y.share.get(name)`.
   *
   * *Best Practices:*
   * Define all types right after the Yjs instance is created and store them in a separate object.
   * Also use the typed methods `getText(name)`, `getArray(name)`, ..
   *
   * @example
   *   const y = new Y(..)
   *   const appState = {
   *     document: y.getText('document')
   *     comments: y.getArray('comments')
   *   }
   *
   * @param {string} name
   * @param {Function} TypeConstructor The constructor of the type definition. E.g. Y.Text, Y.Array, Y.Map, ...
   * @return {AbstractType<any>} The created type. Constructed with TypeConstructor
   *
   * @public
   */
  get (name, TypeConstructor = AbstractType) {
    const type = map__namespace.setIfUndefined(this.share, name, () => {
      // @ts-ignore
      const t = new TypeConstructor();
      t._integrate(this, null);
      return t
    });
    const Constr = type.constructor;
    if (TypeConstructor !== AbstractType && Constr !== TypeConstructor) {
      if (Constr === AbstractType) {
        // @ts-ignore
        const t = new TypeConstructor();
        t._map = type._map;
        type._map.forEach(/** @param {Item?} n */ n => {
          for (; n !== null; n = n.left) {
            // @ts-ignore
            n.parent = t;
          }
        });
        t._start = type._start;
        for (let n = t._start; n !== null; n = n.right) {
          n.parent = t;
        }
        t._length = type._length;
        this.share.set(name, t);
        t._integrate(this, null);
        return t
      } else {
        throw new Error(`Type with the name ${name} has already been defined with a different constructor`)
      }
    }
    return type
  }

  /**
   * @template T
   * @param {string} [name]
   * @return {YArray<T>}
   *
   * @public
   */
  getArray (name = '') {
    // @ts-ignore
    return this.get(name, YArray)
  }

  /**
   * @param {string} [name]
   * @return {YText}
   *
   * @public
   */
  getText (name = '') {
    // @ts-ignore
    return this.get(name, YText)
  }

  /**
   * @template T
   * @param {string} [name]
   * @return {YMap<T>}
   *
   * @public
   */
  getMap (name = '') {
    // @ts-ignore
    return this.get(name, YMap)
  }

  /**
   * @param {string} [name]
   * @return {YXmlFragment}
   *
   * @public
   */
  getXmlFragment (name = '') {
    // @ts-ignore
    return this.get(name, YXmlFragment)
  }

  /**
   * Converts the entire document into a js object, recursively traversing each yjs type
   * Doesn't log types that have not been defined (using ydoc.getType(..)).
   *
   * @deprecated Do not use this method and rather call toJSON directly on the shared types.
   *
   * @return {Object<string, any>}
   */
  toJSON () {
    /**
     * @type {Object<string, any>}
     */
    const doc = {};

    this.share.forEach((value, key) => {
      doc[key] = value.toJSON();
    });

    return doc
  }

  /**
   * Emit `destroy` event and unregister all event handlers.
   */
  destroy () {
    array__namespace.from(this.subdocs).forEach(subdoc => subdoc.destroy());
    const item = this._item;
    if (item !== null) {
      this._item = null;
      const content = /** @type {ContentDoc} */ (item.content);
      content.doc = new Doc({ guid: this.guid, ...content.opts, shouldLoad: false });
      content.doc._item = item;
      transact(/** @type {any} */ (item).parent.doc, transaction => {
        const doc = content.doc;
        if (!item.deleted) {
          transaction.subdocsAdded.add(doc);
        }
        transaction.subdocsRemoved.add(this);
      }, null, true);
    }
    this.emit('destroyed', [true]);
    this.emit('destroy', [this]);
    super.destroy();
  }

  /**
   * @param {string} eventName
   * @param {function(...any):any} f
   */
  on (eventName, f) {
    super.on(eventName, f);
  }

  /**
   * @param {string} eventName
   * @param {function} f
   */
  off (eventName, f) {
    super.off(eventName, f);
  }
}

class DSDecoderV1 {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor (decoder) {
    this.restDecoder = decoder;
  }

  resetDsCurVal () {
    // nop
  }

  /**
   * @return {number}
   */
  readDsClock () {
    return decoding__namespace$2.readVarUint(this.restDecoder)
  }

  /**
   * @return {number}
   */
  readDsLen () {
    return decoding__namespace$2.readVarUint(this.restDecoder)
  }
}

class UpdateDecoderV1 extends DSDecoderV1 {
  /**
   * @return {ID}
   */
  readLeftID () {
    return createID(decoding__namespace$2.readVarUint(this.restDecoder), decoding__namespace$2.readVarUint(this.restDecoder))
  }

  /**
   * @return {ID}
   */
  readRightID () {
    return createID(decoding__namespace$2.readVarUint(this.restDecoder), decoding__namespace$2.readVarUint(this.restDecoder))
  }

  /**
   * Read the next client id.
   * Use this in favor of readID whenever possible to reduce the number of objects created.
   */
  readClient () {
    return decoding__namespace$2.readVarUint(this.restDecoder)
  }

  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readInfo () {
    return decoding__namespace$2.readUint8(this.restDecoder)
  }

  /**
   * @return {string}
   */
  readString () {
    return decoding__namespace$2.readVarString(this.restDecoder)
  }

  /**
   * @return {boolean} isKey
   */
  readParentInfo () {
    return decoding__namespace$2.readVarUint(this.restDecoder) === 1
  }

  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readTypeRef () {
    return decoding__namespace$2.readVarUint(this.restDecoder)
  }

  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @return {number} len
   */
  readLen () {
    return decoding__namespace$2.readVarUint(this.restDecoder)
  }

  /**
   * @return {any}
   */
  readAny () {
    return decoding__namespace$2.readAny(this.restDecoder)
  }

  /**
   * @return {Uint8Array}
   */
  readBuf () {
    return buffer__namespace.copyUint8Array(decoding__namespace$2.readVarUint8Array(this.restDecoder))
  }

  /**
   * Legacy implementation uses JSON parse. We use any-decoding in v2.
   *
   * @return {any}
   */
  readJSON () {
    return JSON.parse(decoding__namespace$2.readVarString(this.restDecoder))
  }

  /**
   * @return {string}
   */
  readKey () {
    return decoding__namespace$2.readVarString(this.restDecoder)
  }
}

class DSDecoderV2 {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor (decoder) {
    /**
     * @private
     */
    this.dsCurrVal = 0;
    this.restDecoder = decoder;
  }

  resetDsCurVal () {
    this.dsCurrVal = 0;
  }

  /**
   * @return {number}
   */
  readDsClock () {
    this.dsCurrVal += decoding__namespace$2.readVarUint(this.restDecoder);
    return this.dsCurrVal
  }

  /**
   * @return {number}
   */
  readDsLen () {
    const diff = decoding__namespace$2.readVarUint(this.restDecoder) + 1;
    this.dsCurrVal += diff;
    return diff
  }
}

class UpdateDecoderV2 extends DSDecoderV2 {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor (decoder) {
    super(decoder);
    /**
     * List of cached keys. If the keys[id] does not exist, we read a new key
     * from stringEncoder and push it to keys.
     *
     * @type {Array<string>}
     */
    this.keys = [];
    decoding__namespace$2.readVarUint(decoder); // read feature flag - currently unused
    this.keyClockDecoder = new decoding__namespace$2.IntDiffOptRleDecoder(decoding__namespace$2.readVarUint8Array(decoder));
    this.clientDecoder = new decoding__namespace$2.UintOptRleDecoder(decoding__namespace$2.readVarUint8Array(decoder));
    this.leftClockDecoder = new decoding__namespace$2.IntDiffOptRleDecoder(decoding__namespace$2.readVarUint8Array(decoder));
    this.rightClockDecoder = new decoding__namespace$2.IntDiffOptRleDecoder(decoding__namespace$2.readVarUint8Array(decoder));
    this.infoDecoder = new decoding__namespace$2.RleDecoder(decoding__namespace$2.readVarUint8Array(decoder), decoding__namespace$2.readUint8);
    this.stringDecoder = new decoding__namespace$2.StringDecoder(decoding__namespace$2.readVarUint8Array(decoder));
    this.parentInfoDecoder = new decoding__namespace$2.RleDecoder(decoding__namespace$2.readVarUint8Array(decoder), decoding__namespace$2.readUint8);
    this.typeRefDecoder = new decoding__namespace$2.UintOptRleDecoder(decoding__namespace$2.readVarUint8Array(decoder));
    this.lenDecoder = new decoding__namespace$2.UintOptRleDecoder(decoding__namespace$2.readVarUint8Array(decoder));
  }

  /**
   * @return {ID}
   */
  readLeftID () {
    return new ID(this.clientDecoder.read(), this.leftClockDecoder.read())
  }

  /**
   * @return {ID}
   */
  readRightID () {
    return new ID(this.clientDecoder.read(), this.rightClockDecoder.read())
  }

  /**
   * Read the next client id.
   * Use this in favor of readID whenever possible to reduce the number of objects created.
   */
  readClient () {
    return this.clientDecoder.read()
  }

  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readInfo () {
    return /** @type {number} */ (this.infoDecoder.read())
  }

  /**
   * @return {string}
   */
  readString () {
    return this.stringDecoder.read()
  }

  /**
   * @return {boolean}
   */
  readParentInfo () {
    return this.parentInfoDecoder.read() === 1
  }

  /**
   * @return {number} An unsigned 8-bit integer
   */
  readTypeRef () {
    return this.typeRefDecoder.read()
  }

  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @return {number}
   */
  readLen () {
    return this.lenDecoder.read()
  }

  /**
   * @return {any}
   */
  readAny () {
    return decoding__namespace$2.readAny(this.restDecoder)
  }

  /**
   * @return {Uint8Array}
   */
  readBuf () {
    return decoding__namespace$2.readVarUint8Array(this.restDecoder)
  }

  /**
   * This is mainly here for legacy purposes.
   *
   * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
   *
   * @return {any}
   */
  readJSON () {
    return decoding__namespace$2.readAny(this.restDecoder)
  }

  /**
   * @return {string}
   */
  readKey () {
    const keyClock = this.keyClockDecoder.read();
    if (keyClock < this.keys.length) {
      return this.keys[keyClock]
    } else {
      const key = this.stringDecoder.read();
      this.keys.push(key);
      return key
    }
  }
}

class DSEncoderV1 {
  constructor () {
    this.restEncoder = encoding__namespace$2.createEncoder();
  }

  toUint8Array () {
    return encoding__namespace$2.toUint8Array(this.restEncoder)
  }

  resetDsCurVal () {
    // nop
  }

  /**
   * @param {number} clock
   */
  writeDsClock (clock) {
    encoding__namespace$2.writeVarUint(this.restEncoder, clock);
  }

  /**
   * @param {number} len
   */
  writeDsLen (len) {
    encoding__namespace$2.writeVarUint(this.restEncoder, len);
  }
}

class UpdateEncoderV1 extends DSEncoderV1 {
  /**
   * @param {ID} id
   */
  writeLeftID (id) {
    encoding__namespace$2.writeVarUint(this.restEncoder, id.client);
    encoding__namespace$2.writeVarUint(this.restEncoder, id.clock);
  }

  /**
   * @param {ID} id
   */
  writeRightID (id) {
    encoding__namespace$2.writeVarUint(this.restEncoder, id.client);
    encoding__namespace$2.writeVarUint(this.restEncoder, id.clock);
  }

  /**
   * Use writeClient and writeClock instead of writeID if possible.
   * @param {number} client
   */
  writeClient (client) {
    encoding__namespace$2.writeVarUint(this.restEncoder, client);
  }

  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeInfo (info) {
    encoding__namespace$2.writeUint8(this.restEncoder, info);
  }

  /**
   * @param {string} s
   */
  writeString (s) {
    encoding__namespace$2.writeVarString(this.restEncoder, s);
  }

  /**
   * @param {boolean} isYKey
   */
  writeParentInfo (isYKey) {
    encoding__namespace$2.writeVarUint(this.restEncoder, isYKey ? 1 : 0);
  }

  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeTypeRef (info) {
    encoding__namespace$2.writeVarUint(this.restEncoder, info);
  }

  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @param {number} len
   */
  writeLen (len) {
    encoding__namespace$2.writeVarUint(this.restEncoder, len);
  }

  /**
   * @param {any} any
   */
  writeAny (any) {
    encoding__namespace$2.writeAny(this.restEncoder, any);
  }

  /**
   * @param {Uint8Array} buf
   */
  writeBuf (buf) {
    encoding__namespace$2.writeVarUint8Array(this.restEncoder, buf);
  }

  /**
   * @param {any} embed
   */
  writeJSON (embed) {
    encoding__namespace$2.writeVarString(this.restEncoder, JSON.stringify(embed));
  }

  /**
   * @param {string} key
   */
  writeKey (key) {
    encoding__namespace$2.writeVarString(this.restEncoder, key);
  }
}

class DSEncoderV2 {
  constructor () {
    this.restEncoder = encoding__namespace$2.createEncoder(); // encodes all the rest / non-optimized
    this.dsCurrVal = 0;
  }

  toUint8Array () {
    return encoding__namespace$2.toUint8Array(this.restEncoder)
  }

  resetDsCurVal () {
    this.dsCurrVal = 0;
  }

  /**
   * @param {number} clock
   */
  writeDsClock (clock) {
    const diff = clock - this.dsCurrVal;
    this.dsCurrVal = clock;
    encoding__namespace$2.writeVarUint(this.restEncoder, diff);
  }

  /**
   * @param {number} len
   */
  writeDsLen (len) {
    if (len === 0) {
      error__namespace.unexpectedCase();
    }
    encoding__namespace$2.writeVarUint(this.restEncoder, len - 1);
    this.dsCurrVal += len;
  }
}

class UpdateEncoderV2 extends DSEncoderV2 {
  constructor () {
    super();
    /**
     * @type {Map<string,number>}
     */
    this.keyMap = new Map();
    /**
     * Refers to the next uniqe key-identifier to me used.
     * See writeKey method for more information.
     *
     * @type {number}
     */
    this.keyClock = 0;
    this.keyClockEncoder = new encoding__namespace$2.IntDiffOptRleEncoder();
    this.clientEncoder = new encoding__namespace$2.UintOptRleEncoder();
    this.leftClockEncoder = new encoding__namespace$2.IntDiffOptRleEncoder();
    this.rightClockEncoder = new encoding__namespace$2.IntDiffOptRleEncoder();
    this.infoEncoder = new encoding__namespace$2.RleEncoder(encoding__namespace$2.writeUint8);
    this.stringEncoder = new encoding__namespace$2.StringEncoder();
    this.parentInfoEncoder = new encoding__namespace$2.RleEncoder(encoding__namespace$2.writeUint8);
    this.typeRefEncoder = new encoding__namespace$2.UintOptRleEncoder();
    this.lenEncoder = new encoding__namespace$2.UintOptRleEncoder();
  }

  toUint8Array () {
    const encoder = encoding__namespace$2.createEncoder();
    encoding__namespace$2.writeVarUint(encoder, 0); // this is a feature flag that we might use in the future
    encoding__namespace$2.writeVarUint8Array(encoder, this.keyClockEncoder.toUint8Array());
    encoding__namespace$2.writeVarUint8Array(encoder, this.clientEncoder.toUint8Array());
    encoding__namespace$2.writeVarUint8Array(encoder, this.leftClockEncoder.toUint8Array());
    encoding__namespace$2.writeVarUint8Array(encoder, this.rightClockEncoder.toUint8Array());
    encoding__namespace$2.writeVarUint8Array(encoder, encoding__namespace$2.toUint8Array(this.infoEncoder));
    encoding__namespace$2.writeVarUint8Array(encoder, this.stringEncoder.toUint8Array());
    encoding__namespace$2.writeVarUint8Array(encoder, encoding__namespace$2.toUint8Array(this.parentInfoEncoder));
    encoding__namespace$2.writeVarUint8Array(encoder, this.typeRefEncoder.toUint8Array());
    encoding__namespace$2.writeVarUint8Array(encoder, this.lenEncoder.toUint8Array());
    // @note The rest encoder is appended! (note the missing var)
    encoding__namespace$2.writeUint8Array(encoder, encoding__namespace$2.toUint8Array(this.restEncoder));
    return encoding__namespace$2.toUint8Array(encoder)
  }

  /**
   * @param {ID} id
   */
  writeLeftID (id) {
    this.clientEncoder.write(id.client);
    this.leftClockEncoder.write(id.clock);
  }

  /**
   * @param {ID} id
   */
  writeRightID (id) {
    this.clientEncoder.write(id.client);
    this.rightClockEncoder.write(id.clock);
  }

  /**
   * @param {number} client
   */
  writeClient (client) {
    this.clientEncoder.write(client);
  }

  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeInfo (info) {
    this.infoEncoder.write(info);
  }

  /**
   * @param {string} s
   */
  writeString (s) {
    this.stringEncoder.write(s);
  }

  /**
   * @param {boolean} isYKey
   */
  writeParentInfo (isYKey) {
    this.parentInfoEncoder.write(isYKey ? 1 : 0);
  }

  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeTypeRef (info) {
    this.typeRefEncoder.write(info);
  }

  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @param {number} len
   */
  writeLen (len) {
    this.lenEncoder.write(len);
  }

  /**
   * @param {any} any
   */
  writeAny (any) {
    encoding__namespace$2.writeAny(this.restEncoder, any);
  }

  /**
   * @param {Uint8Array} buf
   */
  writeBuf (buf) {
    encoding__namespace$2.writeVarUint8Array(this.restEncoder, buf);
  }

  /**
   * This is mainly here for legacy purposes.
   *
   * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
   *
   * @param {any} embed
   */
  writeJSON (embed) {
    encoding__namespace$2.writeAny(this.restEncoder, embed);
  }

  /**
   * Property keys are often reused. For example, in y-prosemirror the key `bold` might
   * occur very often. For a 3d application, the key `position` might occur very often.
   *
   * We cache these keys in a Map and refer to them via a unique number.
   *
   * @param {string} key
   */
  writeKey (key) {
    const clock = this.keyMap.get(key);
    if (clock === undefined) {
      this.keyClockEncoder.write(this.keyClock++);
      this.stringEncoder.write(key);
    } else {
      this.keyClockEncoder.write(this.keyClock++);
    }
  }
}

/**
 * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
 * @param {Array<GC|Item>} structs All structs by `client`
 * @param {number} client
 * @param {number} clock write structs starting with `ID(client,clock)`
 *
 * @function
 */
const writeStructs = (encoder, structs, client, clock) => {
  // write first id
  clock = math__namespace$1.max(clock, structs[0].id.clock); // make sure the first id exists
  const startNewStructs = findIndexSS(structs, clock);
  // write # encoded structs
  encoding__namespace$2.writeVarUint(encoder.restEncoder, structs.length - startNewStructs);
  encoder.writeClient(client);
  encoding__namespace$2.writeVarUint(encoder.restEncoder, clock);
  const firstStruct = structs[startNewStructs];
  // write first struct with an offset
  firstStruct.write(encoder, clock - firstStruct.id.clock);
  for (let i = startNewStructs + 1; i < structs.length; i++) {
    structs[i].write(encoder, 0);
  }
};

/**
 * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
 * @param {StructStore} store
 * @param {Map<number,number>} _sm
 *
 * @private
 * @function
 */
const writeClientsStructs = (encoder, store, _sm) => {
  // we filter all valid _sm entries into sm
  const sm = new Map();
  _sm.forEach((clock, client) => {
    // only write if new structs are available
    if (getState(store, client) > clock) {
      sm.set(client, clock);
    }
  });
  getStateVector(store).forEach((clock, client) => {
    if (!_sm.has(client)) {
      sm.set(client, 0);
    }
  });
  // write # states that were updated
  encoding__namespace$2.writeVarUint(encoder.restEncoder, sm.size);
  // Write items with higher client ids first
  // This heavily improves the conflict algorithm.
  Array.from(sm.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, clock]) => {
    // @ts-ignore
    writeStructs(encoder, store.clients.get(client), client, clock);
  });
};

/**
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder The decoder object to read data from.
 * @param {Doc} doc
 * @return {Map<number, { i: number, refs: Array<Item | GC> }>}
 *
 * @private
 * @function
 */
const readClientsStructRefs = (decoder, doc) => {
  /**
   * @type {Map<number, { i: number, refs: Array<Item | GC> }>}
   */
  const clientRefs = map__namespace.create();
  const numOfStateUpdates = decoding__namespace$2.readVarUint(decoder.restDecoder);
  for (let i = 0; i < numOfStateUpdates; i++) {
    const numberOfStructs = decoding__namespace$2.readVarUint(decoder.restDecoder);
    /**
     * @type {Array<GC|Item>}
     */
    const refs = new Array(numberOfStructs);
    const client = decoder.readClient();
    let clock = decoding__namespace$2.readVarUint(decoder.restDecoder);
    // const start = performance.now()
    clientRefs.set(client, { i: 0, refs });
    for (let i = 0; i < numberOfStructs; i++) {
      const info = decoder.readInfo();
      switch (binary__namespace.BITS5 & info) {
        case 0: { // GC
          const len = decoder.readLen();
          refs[i] = new GC(createID(client, clock), len);
          clock += len;
          break
        }
        case 10: { // Skip Struct (nothing to apply)
          // @todo we could reduce the amount of checks by adding Skip struct to clientRefs so we know that something is missing.
          const len = decoding__namespace$2.readVarUint(decoder.restDecoder);
          refs[i] = new Skip(createID(client, clock), len);
          clock += len;
          break
        }
        default: { // Item with content
          /**
           * The optimized implementation doesn't use any variables because inlining variables is faster.
           * Below a non-optimized version is shown that implements the basic algorithm with
           * a few comments
           */
          const cantCopyParentInfo = (info & (binary__namespace.BIT7 | binary__namespace.BIT8)) === 0;
          // If parent = null and neither left nor right are defined, then we know that `parent` is child of `y`
          // and we read the next string as parentYKey.
          // It indicates how we store/retrieve parent from `y.share`
          // @type {string|null}
          const struct = new Item(
            createID(client, clock),
            null, // leftd
            (info & binary__namespace.BIT8) === binary__namespace.BIT8 ? decoder.readLeftID() : null, // origin
            null, // right
            (info & binary__namespace.BIT7) === binary__namespace.BIT7 ? decoder.readRightID() : null, // right origin
            cantCopyParentInfo ? (decoder.readParentInfo() ? doc.get(decoder.readString()) : decoder.readLeftID()) : null, // parent
            cantCopyParentInfo && (info & binary__namespace.BIT6) === binary__namespace.BIT6 ? decoder.readString() : null, // parentSub
            readItemContent(decoder, info) // item content
          );
          /* A non-optimized implementation of the above algorithm:

          // The item that was originally to the left of this item.
          const origin = (info & binary.BIT8) === binary.BIT8 ? decoder.readLeftID() : null
          // The item that was originally to the right of this item.
          const rightOrigin = (info & binary.BIT7) === binary.BIT7 ? decoder.readRightID() : null
          const cantCopyParentInfo = (info & (binary.BIT7 | binary.BIT8)) === 0
          const hasParentYKey = cantCopyParentInfo ? decoder.readParentInfo() : false
          // If parent = null and neither left nor right are defined, then we know that `parent` is child of `y`
          // and we read the next string as parentYKey.
          // It indicates how we store/retrieve parent from `y.share`
          // @type {string|null}
          const parentYKey = cantCopyParentInfo && hasParentYKey ? decoder.readString() : null

          const struct = new Item(
            createID(client, clock),
            null, // leftd
            origin, // origin
            null, // right
            rightOrigin, // right origin
            cantCopyParentInfo && !hasParentYKey ? decoder.readLeftID() : (parentYKey !== null ? doc.get(parentYKey) : null), // parent
            cantCopyParentInfo && (info & binary.BIT6) === binary.BIT6 ? decoder.readString() : null, // parentSub
            readItemContent(decoder, info) // item content
          )
          */
          refs[i] = struct;
          clock += struct.length;
        }
      }
    }
    // console.log('time to read: ', performance.now() - start) // @todo remove
  }
  return clientRefs
};

/**
 * Resume computing structs generated by struct readers.
 *
 * While there is something to do, we integrate structs in this order
 * 1. top element on stack, if stack is not empty
 * 2. next element from current struct reader (if empty, use next struct reader)
 *
 * If struct causally depends on another struct (ref.missing), we put next reader of
 * `ref.id.client` on top of stack.
 *
 * At some point we find a struct that has no causal dependencies,
 * then we start emptying the stack.
 *
 * It is not possible to have circles: i.e. struct1 (from client1) depends on struct2 (from client2)
 * depends on struct3 (from client1). Therefore the max stack size is eqaul to `structReaders.length`.
 *
 * This method is implemented in a way so that we can resume computation if this update
 * causally depends on another update.
 *
 * @param {Transaction} transaction
 * @param {StructStore} store
 * @param {Map<number, { i: number, refs: (GC | Item)[] }>} clientsStructRefs
 * @return { null | { update: Uint8Array, missing: Map<number,number> } }
 *
 * @private
 * @function
 */
const integrateStructs = (transaction, store, clientsStructRefs) => {
  /**
   * @type {Array<Item | GC>}
   */
  const stack = [];
  // sort them so that we take the higher id first, in case of conflicts the lower id will probably not conflict with the id from the higher user.
  let clientsStructRefsIds = Array.from(clientsStructRefs.keys()).sort((a, b) => a - b);
  if (clientsStructRefsIds.length === 0) {
    return null
  }
  const getNextStructTarget = () => {
    if (clientsStructRefsIds.length === 0) {
      return null
    }
    let nextStructsTarget = /** @type {{i:number,refs:Array<GC|Item>}} */ (clientsStructRefs.get(clientsStructRefsIds[clientsStructRefsIds.length - 1]));
    while (nextStructsTarget.refs.length === nextStructsTarget.i) {
      clientsStructRefsIds.pop();
      if (clientsStructRefsIds.length > 0) {
        nextStructsTarget = /** @type {{i:number,refs:Array<GC|Item>}} */ (clientsStructRefs.get(clientsStructRefsIds[clientsStructRefsIds.length - 1]));
      } else {
        return null
      }
    }
    return nextStructsTarget
  };
  let curStructsTarget = getNextStructTarget();
  if (curStructsTarget === null && stack.length === 0) {
    return null
  }

  /**
   * @type {StructStore}
   */
  const restStructs = new StructStore();
  const missingSV = new Map();
  /**
   * @param {number} client
   * @param {number} clock
   */
  const updateMissingSv = (client, clock) => {
    const mclock = missingSV.get(client);
    if (mclock == null || mclock > clock) {
      missingSV.set(client, clock);
    }
  };
  /**
   * @type {GC|Item}
   */
  let stackHead = /** @type {any} */ (curStructsTarget).refs[/** @type {any} */ (curStructsTarget).i++];
  // caching the state because it is used very often
  const state = new Map();

  const addStackToRestSS = () => {
    for (const item of stack) {
      const client = item.id.client;
      const unapplicableItems = clientsStructRefs.get(client);
      if (unapplicableItems) {
        // decrement because we weren't able to apply previous operation
        unapplicableItems.i--;
        restStructs.clients.set(client, unapplicableItems.refs.slice(unapplicableItems.i));
        clientsStructRefs.delete(client);
        unapplicableItems.i = 0;
        unapplicableItems.refs = [];
      } else {
        // item was the last item on clientsStructRefs and the field was already cleared. Add item to restStructs and continue
        restStructs.clients.set(client, [item]);
      }
      // remove client from clientsStructRefsIds to prevent users from applying the same update again
      clientsStructRefsIds = clientsStructRefsIds.filter(c => c !== client);
    }
    stack.length = 0;
  };

  // iterate over all struct readers until we are done
  while (true) {
    if (stackHead.constructor !== Skip) {
      const localClock = map__namespace.setIfUndefined(state, stackHead.id.client, () => getState(store, stackHead.id.client));
      const offset = localClock - stackHead.id.clock;
      if (offset < 0) {
        // update from the same client is missing
        stack.push(stackHead);
        updateMissingSv(stackHead.id.client, stackHead.id.clock - 1);
        // hid a dead wall, add all items from stack to restSS
        addStackToRestSS();
      } else {
        const missing = stackHead.getMissing(transaction, store);
        if (missing !== null) {
          stack.push(stackHead);
          // get the struct reader that has the missing struct
          /**
           * @type {{ refs: Array<GC|Item>, i: number }}
           */
          const structRefs = clientsStructRefs.get(/** @type {number} */ (missing)) || { refs: [], i: 0 };
          if (structRefs.refs.length === structRefs.i) {
            // This update message causally depends on another update message that doesn't exist yet
            updateMissingSv(/** @type {number} */ (missing), getState(store, missing));
            addStackToRestSS();
          } else {
            stackHead = structRefs.refs[structRefs.i++];
            continue
          }
        } else if (offset === 0 || offset < stackHead.length) {
          // all fine, apply the stackhead
          stackHead.integrate(transaction, offset);
          state.set(stackHead.id.client, stackHead.id.clock + stackHead.length);
        }
      }
    }
    // iterate to next stackHead
    if (stack.length > 0) {
      stackHead = /** @type {GC|Item} */ (stack.pop());
    } else if (curStructsTarget !== null && curStructsTarget.i < curStructsTarget.refs.length) {
      stackHead = /** @type {GC|Item} */ (curStructsTarget.refs[curStructsTarget.i++]);
    } else {
      curStructsTarget = getNextStructTarget();
      if (curStructsTarget === null) {
        // we are done!
        break
      } else {
        stackHead = /** @type {GC|Item} */ (curStructsTarget.refs[curStructsTarget.i++]);
      }
    }
  }
  if (restStructs.clients.size > 0) {
    const encoder = new UpdateEncoderV2();
    writeClientsStructs(encoder, restStructs, new Map());
    // write empty deleteset
    // writeDeleteSet(encoder, new DeleteSet())
    encoding__namespace$2.writeVarUint(encoder.restEncoder, 0); // => no need for an extra function call, just write 0 deletes
    return { missing: missingSV, update: encoder.toUint8Array() }
  }
  return null
};

/**
 * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
 * @param {Transaction} transaction
 *
 * @private
 * @function
 */
const writeStructsFromTransaction = (encoder, transaction) => writeClientsStructs(encoder, transaction.doc.store, transaction.beforeState);

/**
 * Read and apply a document update.
 *
 * This function has the same effect as `applyUpdate` but accepts an decoder.
 *
 * @param {decoding.Decoder} decoder
 * @param {Doc} ydoc
 * @param {any} [transactionOrigin] This will be stored on `transaction.origin` and `.on('update', (update, origin))`
 * @param {UpdateDecoderV1 | UpdateDecoderV2} [structDecoder]
 *
 * @function
 */
const readUpdateV2 = (decoder, ydoc, transactionOrigin, structDecoder = new UpdateDecoderV2(decoder)) =>
  transact(ydoc, transaction => {
    // force that transaction.local is set to non-local
    transaction.local = false;
    let retry = false;
    const doc = transaction.doc;
    const store = doc.store;
    // let start = performance.now()
    const ss = readClientsStructRefs(structDecoder, doc);
    // console.log('time to read structs: ', performance.now() - start) // @todo remove
    // start = performance.now()
    // console.log('time to merge: ', performance.now() - start) // @todo remove
    // start = performance.now()
    const restStructs = integrateStructs(transaction, store, ss);
    const pending = store.pendingStructs;
    if (pending) {
      // check if we can apply something
      for (const [client, clock] of pending.missing) {
        if (clock < getState(store, client)) {
          retry = true;
          break
        }
      }
      if (restStructs) {
        // merge restStructs into store.pending
        for (const [client, clock] of restStructs.missing) {
          const mclock = pending.missing.get(client);
          if (mclock == null || mclock > clock) {
            pending.missing.set(client, clock);
          }
        }
        pending.update = mergeUpdatesV2([pending.update, restStructs.update]);
      }
    } else {
      store.pendingStructs = restStructs;
    }
    // console.log('time to integrate: ', performance.now() - start) // @todo remove
    // start = performance.now()
    const dsRest = readAndApplyDeleteSet(structDecoder, transaction, store);
    if (store.pendingDs) {
      // @todo we could make a lower-bound state-vector check as we do above
      const pendingDSUpdate = new UpdateDecoderV2(decoding__namespace$2.createDecoder(store.pendingDs));
      decoding__namespace$2.readVarUint(pendingDSUpdate.restDecoder); // read 0 structs, because we only encode deletes in pendingdsupdate
      const dsRest2 = readAndApplyDeleteSet(pendingDSUpdate, transaction, store);
      if (dsRest && dsRest2) {
        // case 1: ds1 != null && ds2 != null
        store.pendingDs = mergeUpdatesV2([dsRest, dsRest2]);
      } else {
        // case 2: ds1 != null
        // case 3: ds2 != null
        // case 4: ds1 == null && ds2 == null
        store.pendingDs = dsRest || dsRest2;
      }
    } else {
      // Either dsRest == null && pendingDs == null OR dsRest != null
      store.pendingDs = dsRest;
    }
    // console.log('time to cleanup: ', performance.now() - start) // @todo remove
    // start = performance.now()

    // console.log('time to resume delete readers: ', performance.now() - start) // @todo remove
    // start = performance.now()
    if (retry) {
      const update = /** @type {{update: Uint8Array}} */ (store.pendingStructs).update;
      store.pendingStructs = null;
      applyUpdateV2(transaction.doc, update);
    }
  }, transactionOrigin, false);

/**
 * Read and apply a document update.
 *
 * This function has the same effect as `applyUpdate` but accepts an decoder.
 *
 * @param {decoding.Decoder} decoder
 * @param {Doc} ydoc
 * @param {any} [transactionOrigin] This will be stored on `transaction.origin` and `.on('update', (update, origin))`
 *
 * @function
 */
const readUpdate$1 = (decoder, ydoc, transactionOrigin) => readUpdateV2(decoder, ydoc, transactionOrigin, new UpdateDecoderV1(decoder));

/**
 * Apply a document update created by, for example, `y.on('update', update => ..)` or `update = encodeStateAsUpdate()`.
 *
 * This function has the same effect as `readUpdate` but accepts an Uint8Array instead of a Decoder.
 *
 * @param {Doc} ydoc
 * @param {Uint8Array} update
 * @param {any} [transactionOrigin] This will be stored on `transaction.origin` and `.on('update', (update, origin))`
 * @param {typeof UpdateDecoderV1 | typeof UpdateDecoderV2} [YDecoder]
 *
 * @function
 */
const applyUpdateV2 = (ydoc, update, transactionOrigin, YDecoder = UpdateDecoderV2) => {
  const decoder = decoding__namespace$2.createDecoder(update);
  readUpdateV2(decoder, ydoc, transactionOrigin, new YDecoder(decoder));
};

/**
 * Apply a document update created by, for example, `y.on('update', update => ..)` or `update = encodeStateAsUpdate()`.
 *
 * This function has the same effect as `readUpdate` but accepts an Uint8Array instead of a Decoder.
 *
 * @param {Doc} ydoc
 * @param {Uint8Array} update
 * @param {any} [transactionOrigin] This will be stored on `transaction.origin` and `.on('update', (update, origin))`
 *
 * @function
 */
const applyUpdate = (ydoc, update, transactionOrigin) => applyUpdateV2(ydoc, update, transactionOrigin, UpdateDecoderV1);

/**
 * Write all the document as a single update message. If you specify the state of the remote client (`targetStateVector`) it will
 * only write the operations that are missing.
 *
 * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
 * @param {Doc} doc
 * @param {Map<number,number>} [targetStateVector] The state of the target that receives the update. Leave empty to write all known structs
 *
 * @function
 */
const writeStateAsUpdate = (encoder, doc, targetStateVector = new Map()) => {
  writeClientsStructs(encoder, doc.store, targetStateVector);
  writeDeleteSet(encoder, createDeleteSetFromStructStore(doc.store));
};

/**
 * Write all the document as a single update message that can be applied on the remote document. If you specify the state of the remote client (`targetState`) it will
 * only write the operations that are missing.
 *
 * Use `writeStateAsUpdate` instead if you are working with lib0/encoding.js#Encoder
 *
 * @param {Doc} doc
 * @param {Uint8Array} [encodedTargetStateVector] The state of the target that receives the update. Leave empty to write all known structs
 * @param {UpdateEncoderV1 | UpdateEncoderV2} [encoder]
 * @return {Uint8Array}
 *
 * @function
 */
const encodeStateAsUpdateV2 = (doc, encodedTargetStateVector = new Uint8Array([0]), encoder = new UpdateEncoderV2()) => {
  const targetStateVector = decodeStateVector(encodedTargetStateVector);
  writeStateAsUpdate(encoder, doc, targetStateVector);
  const updates = [encoder.toUint8Array()];
  // also add the pending updates (if there are any)
  if (doc.store.pendingDs) {
    updates.push(doc.store.pendingDs);
  }
  if (doc.store.pendingStructs) {
    updates.push(diffUpdateV2(doc.store.pendingStructs.update, encodedTargetStateVector));
  }
  if (updates.length > 1) {
    if (encoder.constructor === UpdateEncoderV1) {
      return mergeUpdates$1(updates.map((update, i) => i === 0 ? update : convertUpdateFormatV2ToV1(update)))
    } else if (encoder.constructor === UpdateEncoderV2) {
      return mergeUpdatesV2(updates)
    }
  }
  return updates[0]
};

/**
 * Write all the document as a single update message that can be applied on the remote document. If you specify the state of the remote client (`targetState`) it will
 * only write the operations that are missing.
 *
 * Use `writeStateAsUpdate` instead if you are working with lib0/encoding.js#Encoder
 *
 * @param {Doc} doc
 * @param {Uint8Array} [encodedTargetStateVector] The state of the target that receives the update. Leave empty to write all known structs
 * @return {Uint8Array}
 *
 * @function
 */
const encodeStateAsUpdate = (doc, encodedTargetStateVector) => encodeStateAsUpdateV2(doc, encodedTargetStateVector, new UpdateEncoderV1());

/**
 * Read state vector from Decoder and return as Map
 *
 * @param {DSDecoderV1 | DSDecoderV2} decoder
 * @return {Map<number,number>} Maps `client` to the number next expected `clock` from that client.
 *
 * @function
 */
const readStateVector$1 = decoder => {
  const ss = new Map();
  const ssLength = decoding__namespace$2.readVarUint(decoder.restDecoder);
  for (let i = 0; i < ssLength; i++) {
    const client = decoding__namespace$2.readVarUint(decoder.restDecoder);
    const clock = decoding__namespace$2.readVarUint(decoder.restDecoder);
    ss.set(client, clock);
  }
  return ss
};

/**
 * Read decodedState and return State as Map.
 *
 * @param {Uint8Array} decodedState
 * @return {Map<number,number>} Maps `client` to the number next expected `clock` from that client.
 *
 * @function
 */
// export const decodeStateVectorV2 = decodedState => readStateVector(new DSDecoderV2(decoding.createDecoder(decodedState)))

/**
 * Read decodedState and return State as Map.
 *
 * @param {Uint8Array} decodedState
 * @return {Map<number,number>} Maps `client` to the number next expected `clock` from that client.
 *
 * @function
 */
const decodeStateVector = decodedState => readStateVector$1(new DSDecoderV1(decoding__namespace$2.createDecoder(decodedState)));

/**
 * @param {DSEncoderV1 | DSEncoderV2} encoder
 * @param {Map<number,number>} sv
 * @function
 */
const writeStateVector$1 = (encoder, sv) => {
  encoding__namespace$2.writeVarUint(encoder.restEncoder, sv.size);
  Array.from(sv.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, clock]) => {
    encoding__namespace$2.writeVarUint(encoder.restEncoder, client); // @todo use a special client decoder that is based on mapping
    encoding__namespace$2.writeVarUint(encoder.restEncoder, clock);
  });
  return encoder
};

/**
 * @param {DSEncoderV1 | DSEncoderV2} encoder
 * @param {Doc} doc
 *
 * @function
 */
const writeDocumentStateVector = (encoder, doc) => writeStateVector$1(encoder, getStateVector(doc.store));

/**
 * Encode State as Uint8Array.
 *
 * @param {Doc|Map<number,number>} doc
 * @param {DSEncoderV1 | DSEncoderV2} [encoder]
 * @return {Uint8Array}
 *
 * @function
 */
const encodeStateVectorV2 = (doc, encoder = new DSEncoderV2()) => {
  if (doc instanceof Map) {
    writeStateVector$1(encoder, doc);
  } else {
    writeDocumentStateVector(encoder, doc);
  }
  return encoder.toUint8Array()
};

/**
 * Encode State as Uint8Array.
 *
 * @param {Doc|Map<number,number>} doc
 * @return {Uint8Array}
 *
 * @function
 */
const encodeStateVector = doc => encodeStateVectorV2(doc, new DSEncoderV1());

/**
 * General event handler implementation.
 *
 * @template ARG0, ARG1
 *
 * @private
 */
class EventHandler {
  constructor () {
    /**
     * @type {Array<function(ARG0, ARG1):void>}
     */
    this.l = [];
  }
}

/**
 * @template ARG0,ARG1
 * @returns {EventHandler<ARG0,ARG1>}
 *
 * @private
 * @function
 */
const createEventHandler = () => new EventHandler();

/**
 * Adds an event listener that is called when
 * {@link EventHandler#callEventListeners} is called.
 *
 * @template ARG0,ARG1
 * @param {EventHandler<ARG0,ARG1>} eventHandler
 * @param {function(ARG0,ARG1):void} f The event handler.
 *
 * @private
 * @function
 */
const addEventHandlerListener = (eventHandler, f) =>
  eventHandler.l.push(f);

/**
 * Removes an event listener.
 *
 * @template ARG0,ARG1
 * @param {EventHandler<ARG0,ARG1>} eventHandler
 * @param {function(ARG0,ARG1):void} f The event handler that was added with
 *                     {@link EventHandler#addEventListener}
 *
 * @private
 * @function
 */
const removeEventHandlerListener = (eventHandler, f) => {
  const l = eventHandler.l;
  const len = l.length;
  eventHandler.l = l.filter(g => f !== g);
  if (len === eventHandler.l.length) {
    console.error('[yjs] Tried to remove event handler that doesn\'t exist.');
  }
};

/**
 * Call all event listeners that were added via
 * {@link EventHandler#addEventListener}.
 *
 * @template ARG0,ARG1
 * @param {EventHandler<ARG0,ARG1>} eventHandler
 * @param {ARG0} arg0
 * @param {ARG1} arg1
 *
 * @private
 * @function
 */
const callEventHandlerListeners = (eventHandler, arg0, arg1) =>
  f__namespace$1.callAll(eventHandler.l, [arg0, arg1]);

class ID {
  /**
   * @param {number} client client id
   * @param {number} clock unique per client id, continuous number
   */
  constructor (client, clock) {
    /**
     * Client id
     * @type {number}
     */
    this.client = client;
    /**
     * unique per client id, continuous number
     * @type {number}
     */
    this.clock = clock;
  }
}

/**
 * @param {ID | null} a
 * @param {ID | null} b
 * @return {boolean}
 *
 * @function
 */
const compareIDs = (a, b) => a === b || (a !== null && b !== null && a.client === b.client && a.clock === b.clock);

/**
 * @param {number} client
 * @param {number} clock
 *
 * @private
 * @function
 */
const createID = (client, clock) => new ID(client, clock);

/**
 * @param {encoding.Encoder} encoder
 * @param {ID} id
 *
 * @private
 * @function
 */
const writeID = (encoder, id) => {
  encoding__namespace$2.writeVarUint(encoder, id.client);
  encoding__namespace$2.writeVarUint(encoder, id.clock);
};

/**
 * Read ID.
 * * If first varUint read is 0xFFFFFF a RootID is returned.
 * * Otherwise an ID is returned
 *
 * @param {decoding.Decoder} decoder
 * @return {ID}
 *
 * @private
 * @function
 */
const readID = decoder =>
  createID(decoding__namespace$2.readVarUint(decoder), decoding__namespace$2.readVarUint(decoder));

/**
 * The top types are mapped from y.share.get(keyname) => type.
 * `type` does not store any information about the `keyname`.
 * This function finds the correct `keyname` for `type` and throws otherwise.
 *
 * @param {AbstractType<any>} type
 * @return {string}
 *
 * @private
 * @function
 */
const findRootTypeKey = type => {
  // @ts-ignore _y must be defined, otherwise unexpected case
  for (const [key, value] of type.doc.share.entries()) {
    if (value === type) {
      return key
    }
  }
  throw error__namespace.unexpectedCase()
};

/**
 * Check if `parent` is a parent of `child`.
 *
 * @param {AbstractType<any>} parent
 * @param {Item|null} child
 * @return {Boolean} Whether `parent` is a parent of `child`.
 *
 * @private
 * @function
 */
const isParentOf = (parent, child) => {
  while (child !== null) {
    if (child.parent === parent) {
      return true
    }
    child = /** @type {AbstractType<any>} */ (child.parent)._item;
  }
  return false
};

/**
 * Convenient helper to log type information.
 *
 * Do not use in productive systems as the output can be immense!
 *
 * @param {AbstractType<any>} type
 */
const logType = type => {
  const res = [];
  let n = type._start;
  while (n) {
    res.push(n);
    n = n.right;
  }
  console.log('Children: ', res);
  console.log('Children content: ', res.filter(m => !m.deleted).map(m => m.content));
};

class PermanentUserData {
  /**
   * @param {Doc} doc
   * @param {YMap<any>} [storeType]
   */
  constructor (doc, storeType = doc.getMap('users')) {
    /**
     * @type {Map<string,DeleteSet>}
     */
    const dss = new Map();
    this.yusers = storeType;
    this.doc = doc;
    /**
     * Maps from clientid to userDescription
     *
     * @type {Map<number,string>}
     */
    this.clients = new Map();
    this.dss = dss;
    /**
     * @param {YMap<any>} user
     * @param {string} userDescription
     */
    const initUser = (user, userDescription) => {
      /**
       * @type {YArray<Uint8Array>}
       */
      const ds = user.get('ds');
      const ids = user.get('ids');
      const addClientId = /** @param {number} clientid */ clientid => this.clients.set(clientid, userDescription);
      ds.observe(/** @param {YArrayEvent<any>} event */ event => {
        event.changes.added.forEach(item => {
          item.content.getContent().forEach(encodedDs => {
            if (encodedDs instanceof Uint8Array) {
              this.dss.set(userDescription, mergeDeleteSets([this.dss.get(userDescription) || createDeleteSet(), readDeleteSet(new DSDecoderV1(decoding__namespace$2.createDecoder(encodedDs)))]));
            }
          });
        });
      });
      this.dss.set(userDescription, mergeDeleteSets(ds.map(encodedDs => readDeleteSet(new DSDecoderV1(decoding__namespace$2.createDecoder(encodedDs))))));
      ids.observe(/** @param {YArrayEvent<any>} event */ event =>
        event.changes.added.forEach(item => item.content.getContent().forEach(addClientId))
      );
      ids.forEach(addClientId);
    };
    // observe users
    storeType.observe(event => {
      event.keysChanged.forEach(userDescription =>
        initUser(storeType.get(userDescription), userDescription)
      );
    });
    // add intial data
    storeType.forEach(initUser);
  }

  /**
   * @param {Doc} doc
   * @param {number} clientid
   * @param {string} userDescription
   * @param {Object} [conf]
   * @param {function(Transaction, DeleteSet):boolean} [conf.filter]
   */
  setUserMapping (doc, clientid, userDescription, { filter = () => true } = {}) {
    const users = this.yusers;
    let user = users.get(userDescription);
    if (!user) {
      user = new YMap();
      user.set('ids', new YArray());
      user.set('ds', new YArray());
      users.set(userDescription, user);
    }
    user.get('ids').push([clientid]);
    users.observe(event => {
      setTimeout(() => {
        const userOverwrite = users.get(userDescription);
        if (userOverwrite !== user) {
          // user was overwritten, port all data over to the next user object
          // @todo Experiment with Y.Sets here
          user = userOverwrite;
          // @todo iterate over old type
          this.clients.forEach((_userDescription, clientid) => {
            if (userDescription === _userDescription) {
              user.get('ids').push([clientid]);
            }
          });
          const encoder = new DSEncoderV1();
          const ds = this.dss.get(userDescription);
          if (ds) {
            writeDeleteSet(encoder, ds);
            user.get('ds').push([encoder.toUint8Array()]);
          }
        }
      }, 0);
    });
    doc.on('afterTransaction', /** @param {Transaction} transaction */ transaction => {
      setTimeout(() => {
        const yds = user.get('ds');
        const ds = transaction.deleteSet;
        if (transaction.local && ds.clients.size > 0 && filter(transaction, ds)) {
          const encoder = new DSEncoderV1();
          writeDeleteSet(encoder, ds);
          yds.push([encoder.toUint8Array()]);
        }
      });
    });
  }

  /**
   * @param {number} clientid
   * @return {any}
   */
  getUserByClientId (clientid) {
    return this.clients.get(clientid) || null
  }

  /**
   * @param {ID} id
   * @return {string | null}
   */
  getUserByDeletedId (id) {
    for (const [userDescription, ds] of this.dss.entries()) {
      if (isDeleted(ds, id)) {
        return userDescription
      }
    }
    return null
  }
}

/**
 * A relative position is based on the Yjs model and is not affected by document changes.
 * E.g. If you place a relative position before a certain character, it will always point to this character.
 * If you place a relative position at the end of a type, it will always point to the end of the type.
 *
 * A numeric position is often unsuited for user selections, because it does not change when content is inserted
 * before or after.
 *
 * ```Insert(0, 'x')('a|bc') = 'xa|bc'``` Where | is the relative position.
 *
 * One of the properties must be defined.
 *
 * @example
 *   // Current cursor position is at position 10
 *   const relativePosition = createRelativePositionFromIndex(yText, 10)
 *   // modify yText
 *   yText.insert(0, 'abc')
 *   yText.delete(3, 10)
 *   // Compute the cursor position
 *   const absolutePosition = createAbsolutePositionFromRelativePosition(y, relativePosition)
 *   absolutePosition.type === yText // => true
 *   console.log('cursor location is ' + absolutePosition.index) // => cursor location is 3
 *
 */
class RelativePosition {
  /**
   * @param {ID|null} type
   * @param {string|null} tname
   * @param {ID|null} item
   * @param {number} assoc
   */
  constructor (type, tname, item, assoc = 0) {
    /**
     * @type {ID|null}
     */
    this.type = type;
    /**
     * @type {string|null}
     */
    this.tname = tname;
    /**
     * @type {ID | null}
     */
    this.item = item;
    /**
     * A relative position is associated to a specific character. By default
     * assoc >= 0, the relative position is associated to the character
     * after the meant position.
     * I.e. position 1 in 'ab' is associated to character 'b'.
     *
     * If assoc < 0, then the relative position is associated to the caharacter
     * before the meant position.
     *
     * @type {number}
     */
    this.assoc = assoc;
  }
}

/**
 * @param {RelativePosition} rpos
 * @return {any}
 */
const relativePositionToJSON = rpos => {
  const json = {};
  if (rpos.type) {
    json.type = rpos.type;
  }
  if (rpos.tname) {
    json.tname = rpos.tname;
  }
  if (rpos.item) {
    json.item = rpos.item;
  }
  if (rpos.assoc != null) {
    json.assoc = rpos.assoc;
  }
  return json
};

/**
 * @param {any} json
 * @return {RelativePosition}
 *
 * @function
 */
const createRelativePositionFromJSON = json => new RelativePosition(json.type == null ? null : createID(json.type.client, json.type.clock), json.tname || null, json.item == null ? null : createID(json.item.client, json.item.clock), json.assoc == null ? 0 : json.assoc);

class AbsolutePosition {
  /**
   * @param {AbstractType<any>} type
   * @param {number} index
   * @param {number} [assoc]
   */
  constructor (type, index, assoc = 0) {
    /**
     * @type {AbstractType<any>}
     */
    this.type = type;
    /**
     * @type {number}
     */
    this.index = index;
    this.assoc = assoc;
  }
}

/**
 * @param {AbstractType<any>} type
 * @param {number} index
 * @param {number} [assoc]
 *
 * @function
 */
const createAbsolutePosition = (type, index, assoc = 0) => new AbsolutePosition(type, index, assoc);

/**
 * @param {AbstractType<any>} type
 * @param {ID|null} item
 * @param {number} [assoc]
 *
 * @function
 */
const createRelativePosition = (type, item, assoc) => {
  let typeid = null;
  let tname = null;
  if (type._item === null) {
    tname = findRootTypeKey(type);
  } else {
    typeid = createID(type._item.id.client, type._item.id.clock);
  }
  return new RelativePosition(typeid, tname, item, assoc)
};

/**
 * Create a relativePosition based on a absolute position.
 *
 * @param {AbstractType<any>} type The base type (e.g. YText or YArray).
 * @param {number} index The absolute position.
 * @param {number} [assoc]
 * @return {RelativePosition}
 *
 * @function
 */
const createRelativePositionFromTypeIndex = (type, index, assoc = 0) => {
  let t = type._start;
  if (assoc < 0) {
    // associated to the left character or the beginning of a type, increment index if possible.
    if (index === 0) {
      return createRelativePosition(type, null, assoc)
    }
    index--;
  }
  while (t !== null) {
    if (!t.deleted && t.countable) {
      if (t.length > index) {
        // case 1: found position somewhere in the linked list
        return createRelativePosition(type, createID(t.id.client, t.id.clock + index), assoc)
      }
      index -= t.length;
    }
    if (t.right === null && assoc < 0) {
      // left-associated position, return last available id
      return createRelativePosition(type, t.lastId, assoc)
    }
    t = t.right;
  }
  return createRelativePosition(type, null, assoc)
};

/**
 * @param {encoding.Encoder} encoder
 * @param {RelativePosition} rpos
 *
 * @function
 */
const writeRelativePosition = (encoder, rpos) => {
  const { type, tname, item, assoc } = rpos;
  if (item !== null) {
    encoding__namespace$2.writeVarUint(encoder, 0);
    writeID(encoder, item);
  } else if (tname !== null) {
    // case 2: found position at the end of the list and type is stored in y.share
    encoding__namespace$2.writeUint8(encoder, 1);
    encoding__namespace$2.writeVarString(encoder, tname);
  } else if (type !== null) {
    // case 3: found position at the end of the list and type is attached to an item
    encoding__namespace$2.writeUint8(encoder, 2);
    writeID(encoder, type);
  } else {
    throw error__namespace.unexpectedCase()
  }
  encoding__namespace$2.writeVarInt(encoder, assoc);
  return encoder
};

/**
 * @param {RelativePosition} rpos
 * @return {Uint8Array}
 */
const encodeRelativePosition = rpos => {
  const encoder = encoding__namespace$2.createEncoder();
  writeRelativePosition(encoder, rpos);
  return encoding__namespace$2.toUint8Array(encoder)
};

/**
 * @param {decoding.Decoder} decoder
 * @return {RelativePosition}
 *
 * @function
 */
const readRelativePosition = decoder => {
  let type = null;
  let tname = null;
  let itemID = null;
  switch (decoding__namespace$2.readVarUint(decoder)) {
    case 0:
      // case 1: found position somewhere in the linked list
      itemID = readID(decoder);
      break
    case 1:
      // case 2: found position at the end of the list and type is stored in y.share
      tname = decoding__namespace$2.readVarString(decoder);
      break
    case 2: {
      // case 3: found position at the end of the list and type is attached to an item
      type = readID(decoder);
    }
  }
  const assoc = decoding__namespace$2.hasContent(decoder) ? decoding__namespace$2.readVarInt(decoder) : 0;
  return new RelativePosition(type, tname, itemID, assoc)
};

/**
 * @param {Uint8Array} uint8Array
 * @return {RelativePosition}
 */
const decodeRelativePosition = uint8Array => readRelativePosition(decoding__namespace$2.createDecoder(uint8Array));

/**
 * @param {RelativePosition} rpos
 * @param {Doc} doc
 * @return {AbsolutePosition|null}
 *
 * @function
 */
const createAbsolutePositionFromRelativePosition = (rpos, doc) => {
  const store = doc.store;
  const rightID = rpos.item;
  const typeID = rpos.type;
  const tname = rpos.tname;
  const assoc = rpos.assoc;
  let type = null;
  let index = 0;
  if (rightID !== null) {
    if (getState(store, rightID.client) <= rightID.clock) {
      return null
    }
    const res = followRedone(store, rightID);
    const right = res.item;
    if (!(right instanceof Item)) {
      return null
    }
    type = /** @type {AbstractType<any>} */ (right.parent);
    if (type._item === null || !type._item.deleted) {
      index = (right.deleted || !right.countable) ? 0 : (res.diff + (assoc >= 0 ? 0 : 1)); // adjust position based on left association if necessary
      let n = right.left;
      while (n !== null) {
        if (!n.deleted && n.countable) {
          index += n.length;
        }
        n = n.left;
      }
    }
  } else {
    if (tname !== null) {
      type = doc.get(tname);
    } else if (typeID !== null) {
      if (getState(store, typeID.client) <= typeID.clock) {
        // type does not exist yet
        return null
      }
      const { item } = followRedone(store, typeID);
      if (item instanceof Item && item.content instanceof ContentType) {
        type = item.content.type;
      } else {
        // struct is garbage collected
        return null
      }
    } else {
      throw error__namespace.unexpectedCase()
    }
    if (assoc >= 0) {
      index = type._length;
    } else {
      index = 0;
    }
  }
  return createAbsolutePosition(type, index, rpos.assoc)
};

/**
 * @param {RelativePosition|null} a
 * @param {RelativePosition|null} b
 * @return {boolean}
 *
 * @function
 */
const compareRelativePositions = (a, b) => a === b || (
  a !== null && b !== null && a.tname === b.tname && compareIDs(a.item, b.item) && compareIDs(a.type, b.type) && a.assoc === b.assoc
);

class Snapshot {
  /**
   * @param {DeleteSet} ds
   * @param {Map<number,number>} sv state map
   */
  constructor (ds, sv) {
    /**
     * @type {DeleteSet}
     */
    this.ds = ds;
    /**
     * State Map
     * @type {Map<number,number>}
     */
    this.sv = sv;
  }
}

/**
 * @param {Snapshot} snap1
 * @param {Snapshot} snap2
 * @return {boolean}
 */
const equalSnapshots = (snap1, snap2) => {
  const ds1 = snap1.ds.clients;
  const ds2 = snap2.ds.clients;
  const sv1 = snap1.sv;
  const sv2 = snap2.sv;
  if (sv1.size !== sv2.size || ds1.size !== ds2.size) {
    return false
  }
  for (const [key, value] of sv1.entries()) {
    if (sv2.get(key) !== value) {
      return false
    }
  }
  for (const [client, dsitems1] of ds1.entries()) {
    const dsitems2 = ds2.get(client) || [];
    if (dsitems1.length !== dsitems2.length) {
      return false
    }
    for (let i = 0; i < dsitems1.length; i++) {
      const dsitem1 = dsitems1[i];
      const dsitem2 = dsitems2[i];
      if (dsitem1.clock !== dsitem2.clock || dsitem1.len !== dsitem2.len) {
        return false
      }
    }
  }
  return true
};

/**
 * @param {Snapshot} snapshot
 * @param {DSEncoderV1 | DSEncoderV2} [encoder]
 * @return {Uint8Array}
 */
const encodeSnapshotV2 = (snapshot, encoder = new DSEncoderV2()) => {
  writeDeleteSet(encoder, snapshot.ds);
  writeStateVector$1(encoder, snapshot.sv);
  return encoder.toUint8Array()
};

/**
 * @param {Snapshot} snapshot
 * @return {Uint8Array}
 */
const encodeSnapshot = snapshot => encodeSnapshotV2(snapshot, new DSEncoderV1());

/**
 * @param {Uint8Array} buf
 * @param {DSDecoderV1 | DSDecoderV2} [decoder]
 * @return {Snapshot}
 */
const decodeSnapshotV2 = (buf, decoder = new DSDecoderV2(decoding__namespace$2.createDecoder(buf))) => {
  return new Snapshot(readDeleteSet(decoder), readStateVector$1(decoder))
};

/**
 * @param {Uint8Array} buf
 * @return {Snapshot}
 */
const decodeSnapshot = buf => decodeSnapshotV2(buf, new DSDecoderV1(decoding__namespace$2.createDecoder(buf)));

/**
 * @param {DeleteSet} ds
 * @param {Map<number,number>} sm
 * @return {Snapshot}
 */
const createSnapshot = (ds, sm) => new Snapshot(ds, sm);

const emptySnapshot = createSnapshot(createDeleteSet(), new Map());

/**
 * @param {Doc} doc
 * @return {Snapshot}
 */
const snapshot = doc => createSnapshot(createDeleteSetFromStructStore(doc.store), getStateVector(doc.store));

/**
 * @param {Item} item
 * @param {Snapshot|undefined} snapshot
 *
 * @protected
 * @function
 */
const isVisible = (item, snapshot) => snapshot === undefined
  ? !item.deleted
  : snapshot.sv.has(item.id.client) && (snapshot.sv.get(item.id.client) || 0) > item.id.clock && !isDeleted(snapshot.ds, item.id);

/**
 * @param {Transaction} transaction
 * @param {Snapshot} snapshot
 */
const splitSnapshotAffectedStructs = (transaction, snapshot) => {
  const meta = map__namespace.setIfUndefined(transaction.meta, splitSnapshotAffectedStructs, set__namespace.create);
  const store = transaction.doc.store;
  // check if we already split for this snapshot
  if (!meta.has(snapshot)) {
    snapshot.sv.forEach((clock, client) => {
      if (clock < getState(store, client)) {
        getItemCleanStart(transaction, createID(client, clock));
      }
    });
    iterateDeletedStructs(transaction, snapshot.ds, item => {});
    meta.add(snapshot);
  }
};

/**
 * @param {Doc} originDoc
 * @param {Snapshot} snapshot
 * @param {Doc} [newDoc] Optionally, you may define the Yjs document that receives the data from originDoc
 * @return {Doc}
 */
const createDocFromSnapshot = (originDoc, snapshot, newDoc = new Doc()) => {
  if (originDoc.gc) {
    // we should not try to restore a GC-ed document, because some of the restored items might have their content deleted
    throw new Error('originDoc must not be garbage collected')
  }
  const { sv, ds } = snapshot;

  const encoder = new UpdateEncoderV2();
  originDoc.transact(transaction => {
    let size = 0;
    sv.forEach(clock => {
      if (clock > 0) {
        size++;
      }
    });
    encoding__namespace$2.writeVarUint(encoder.restEncoder, size);
    // splitting the structs before writing them to the encoder
    for (const [client, clock] of sv) {
      if (clock === 0) {
        continue
      }
      if (clock < getState(originDoc.store, client)) {
        getItemCleanStart(transaction, createID(client, clock));
      }
      const structs = originDoc.store.clients.get(client) || [];
      const lastStructIndex = findIndexSS(structs, clock - 1);
      // write # encoded structs
      encoding__namespace$2.writeVarUint(encoder.restEncoder, lastStructIndex + 1);
      encoder.writeClient(client);
      // first clock written is 0
      encoding__namespace$2.writeVarUint(encoder.restEncoder, 0);
      for (let i = 0; i <= lastStructIndex; i++) {
        structs[i].write(encoder, 0);
      }
    }
    writeDeleteSet(encoder, ds);
  });

  applyUpdateV2(newDoc, encoder.toUint8Array(), 'snapshot');
  return newDoc
};

class StructStore {
  constructor () {
    /**
     * @type {Map<number,Array<GC|Item>>}
     */
    this.clients = new Map();
    /**
     * @type {null | { missing: Map<number, number>, update: Uint8Array }}
     */
    this.pendingStructs = null;
    /**
     * @type {null | Uint8Array}
     */
    this.pendingDs = null;
  }
}

/**
 * Return the states as a Map<client,clock>.
 * Note that clock refers to the next expected clock id.
 *
 * @param {StructStore} store
 * @return {Map<number,number>}
 *
 * @public
 * @function
 */
const getStateVector = store => {
  const sm = new Map();
  store.clients.forEach((structs, client) => {
    const struct = structs[structs.length - 1];
    sm.set(client, struct.id.clock + struct.length);
  });
  return sm
};

/**
 * @param {StructStore} store
 * @param {number} client
 * @return {number}
 *
 * @public
 * @function
 */
const getState = (store, client) => {
  const structs = store.clients.get(client);
  if (structs === undefined) {
    return 0
  }
  const lastStruct = structs[structs.length - 1];
  return lastStruct.id.clock + lastStruct.length
};

/**
 * @param {StructStore} store
 * @param {GC|Item} struct
 *
 * @private
 * @function
 */
const addStruct = (store, struct) => {
  let structs = store.clients.get(struct.id.client);
  if (structs === undefined) {
    structs = [];
    store.clients.set(struct.id.client, structs);
  } else {
    const lastStruct = structs[structs.length - 1];
    if (lastStruct.id.clock + lastStruct.length !== struct.id.clock) {
      throw error__namespace.unexpectedCase()
    }
  }
  structs.push(struct);
};

/**
 * Perform a binary search on a sorted array
 * @param {Array<Item|GC>} structs
 * @param {number} clock
 * @return {number}
 *
 * @private
 * @function
 */
const findIndexSS = (structs, clock) => {
  let left = 0;
  let right = structs.length - 1;
  let mid = structs[right];
  let midclock = mid.id.clock;
  if (midclock === clock) {
    return right
  }
  // @todo does it even make sense to pivot the search?
  // If a good split misses, it might actually increase the time to find the correct item.
  // Currently, the only advantage is that search with pivoting might find the item on the first try.
  let midindex = math__namespace$1.floor((clock / (midclock + mid.length - 1)) * right); // pivoting the search
  while (left <= right) {
    mid = structs[midindex];
    midclock = mid.id.clock;
    if (midclock <= clock) {
      if (clock < midclock + mid.length) {
        return midindex
      }
      left = midindex + 1;
    } else {
      right = midindex - 1;
    }
    midindex = math__namespace$1.floor((left + right) / 2);
  }
  // Always check state before looking for a struct in StructStore
  // Therefore the case of not finding a struct is unexpected
  throw error__namespace.unexpectedCase()
};

/**
 * Expects that id is actually in store. This function throws or is an infinite loop otherwise.
 *
 * @param {StructStore} store
 * @param {ID} id
 * @return {GC|Item}
 *
 * @private
 * @function
 */
const find = (store, id) => {
  /**
   * @type {Array<GC|Item>}
   */
  // @ts-ignore
  const structs = store.clients.get(id.client);
  return structs[findIndexSS(structs, id.clock)]
};

/**
 * Expects that id is actually in store. This function throws or is an infinite loop otherwise.
 * @private
 * @function
 */
const getItem = /** @type {function(StructStore,ID):Item} */ (find);

/**
 * @param {Transaction} transaction
 * @param {Array<Item|GC>} structs
 * @param {number} clock
 */
const findIndexCleanStart = (transaction, structs, clock) => {
  const index = findIndexSS(structs, clock);
  const struct = structs[index];
  if (struct.id.clock < clock && struct instanceof Item) {
    structs.splice(index + 1, 0, splitItem(transaction, struct, clock - struct.id.clock));
    return index + 1
  }
  return index
};

/**
 * Expects that id is actually in store. This function throws or is an infinite loop otherwise.
 *
 * @param {Transaction} transaction
 * @param {ID} id
 * @return {Item}
 *
 * @private
 * @function
 */
const getItemCleanStart = (transaction, id) => {
  const structs = /** @type {Array<Item>} */ (transaction.doc.store.clients.get(id.client));
  return structs[findIndexCleanStart(transaction, structs, id.clock)]
};

/**
 * Expects that id is actually in store. This function throws or is an infinite loop otherwise.
 *
 * @param {Transaction} transaction
 * @param {StructStore} store
 * @param {ID} id
 * @return {Item}
 *
 * @private
 * @function
 */
const getItemCleanEnd = (transaction, store, id) => {
  /**
   * @type {Array<Item>}
   */
  // @ts-ignore
  const structs = store.clients.get(id.client);
  const index = findIndexSS(structs, id.clock);
  const struct = structs[index];
  if (id.clock !== struct.id.clock + struct.length - 1 && struct.constructor !== GC) {
    structs.splice(index + 1, 0, splitItem(transaction, struct, id.clock - struct.id.clock + 1));
  }
  return struct
};

/**
 * Replace `item` with `newitem` in store
 * @param {StructStore} store
 * @param {GC|Item} struct
 * @param {GC|Item} newStruct
 *
 * @private
 * @function
 */
const replaceStruct = (store, struct, newStruct) => {
  const structs = /** @type {Array<GC|Item>} */ (store.clients.get(struct.id.client));
  structs[findIndexSS(structs, struct.id.clock)] = newStruct;
};

/**
 * Iterate over a range of structs
 *
 * @param {Transaction} transaction
 * @param {Array<Item|GC>} structs
 * @param {number} clockStart Inclusive start
 * @param {number} len
 * @param {function(GC|Item):void} f
 *
 * @function
 */
const iterateStructs = (transaction, structs, clockStart, len, f) => {
  if (len === 0) {
    return
  }
  const clockEnd = clockStart + len;
  let index = findIndexCleanStart(transaction, structs, clockStart);
  let struct;
  do {
    struct = structs[index++];
    if (clockEnd < struct.id.clock + struct.length) {
      findIndexCleanStart(transaction, structs, clockEnd);
    }
    f(struct);
  } while (index < structs.length && structs[index].id.clock < clockEnd)
};

/**
 * A transaction is created for every change on the Yjs model. It is possible
 * to bundle changes on the Yjs model in a single transaction to
 * minimize the number on messages sent and the number of observer calls.
 * If possible the user of this library should bundle as many changes as
 * possible. Here is an example to illustrate the advantages of bundling:
 *
 * @example
 * const map = y.define('map', YMap)
 * // Log content when change is triggered
 * map.observe(() => {
 *   console.log('change triggered')
 * })
 * // Each change on the map type triggers a log message:
 * map.set('a', 0) // => "change triggered"
 * map.set('b', 0) // => "change triggered"
 * // When put in a transaction, it will trigger the log after the transaction:
 * y.transact(() => {
 *   map.set('a', 1)
 *   map.set('b', 1)
 * }) // => "change triggered"
 *
 * @public
 */
class Transaction {
  /**
   * @param {Doc} doc
   * @param {any} origin
   * @param {boolean} local
   */
  constructor (doc, origin, local) {
    /**
     * The Yjs instance.
     * @type {Doc}
     */
    this.doc = doc;
    /**
     * Describes the set of deleted items by ids
     * @type {DeleteSet}
     */
    this.deleteSet = new DeleteSet();
    /**
     * Holds the state before the transaction started.
     * @type {Map<Number,Number>}
     */
    this.beforeState = getStateVector(doc.store);
    /**
     * Holds the state after the transaction.
     * @type {Map<Number,Number>}
     */
    this.afterState = new Map();
    /**
     * All types that were directly modified (property added or child
     * inserted/deleted). New types are not included in this Set.
     * Maps from type to parentSubs (`item.parentSub = null` for YArray)
     * @type {Map<AbstractType<YEvent>,Set<String|null>>}
     */
    this.changed = new Map();
    /**
     * Stores the events for the types that observe also child elements.
     * It is mainly used by `observeDeep`.
     * @type {Map<AbstractType<YEvent>,Array<YEvent>>}
     */
    this.changedParentTypes = new Map();
    /**
     * @type {Array<AbstractStruct>}
     */
    this._mergeStructs = [];
    /**
     * @type {any}
     */
    this.origin = origin;
    /**
     * Stores meta information on the transaction
     * @type {Map<any,any>}
     */
    this.meta = new Map();
    /**
     * Whether this change originates from this doc.
     * @type {boolean}
     */
    this.local = local;
    /**
     * @type {Set<Doc>}
     */
    this.subdocsAdded = new Set();
    /**
     * @type {Set<Doc>}
     */
    this.subdocsRemoved = new Set();
    /**
     * @type {Set<Doc>}
     */
    this.subdocsLoaded = new Set();
  }
}

/**
 * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
 * @param {Transaction} transaction
 * @return {boolean} Whether data was written.
 */
const writeUpdateMessageFromTransaction = (encoder, transaction) => {
  if (transaction.deleteSet.clients.size === 0 && !map__namespace.any(transaction.afterState, (clock, client) => transaction.beforeState.get(client) !== clock)) {
    return false
  }
  sortAndMergeDeleteSet(transaction.deleteSet);
  writeStructsFromTransaction(encoder, transaction);
  writeDeleteSet(encoder, transaction.deleteSet);
  return true
};

/**
 * If `type.parent` was added in current transaction, `type` technically
 * did not change, it was just added and we should not fire events for `type`.
 *
 * @param {Transaction} transaction
 * @param {AbstractType<YEvent>} type
 * @param {string|null} parentSub
 */
const addChangedTypeToTransaction = (transaction, type, parentSub) => {
  const item = type._item;
  if (item === null || (item.id.clock < (transaction.beforeState.get(item.id.client) || 0) && !item.deleted)) {
    map__namespace.setIfUndefined(transaction.changed, type, set__namespace.create).add(parentSub);
  }
};

/**
 * @param {Array<AbstractStruct>} structs
 * @param {number} pos
 */
const tryToMergeWithLeft = (structs, pos) => {
  const left = structs[pos - 1];
  const right = structs[pos];
  if (left.deleted === right.deleted && left.constructor === right.constructor) {
    if (left.mergeWith(right)) {
      structs.splice(pos, 1);
      if (right instanceof Item && right.parentSub !== null && /** @type {AbstractType<any>} */ (right.parent)._map.get(right.parentSub) === right) {
        /** @type {AbstractType<any>} */ (right.parent)._map.set(right.parentSub, /** @type {Item} */ (left));
      }
    }
  }
};

/**
 * @param {DeleteSet} ds
 * @param {StructStore} store
 * @param {function(Item):boolean} gcFilter
 */
const tryGcDeleteSet = (ds, store, gcFilter) => {
  for (const [client, deleteItems] of ds.clients.entries()) {
    const structs = /** @type {Array<GC|Item>} */ (store.clients.get(client));
    for (let di = deleteItems.length - 1; di >= 0; di--) {
      const deleteItem = deleteItems[di];
      const endDeleteItemClock = deleteItem.clock + deleteItem.len;
      for (
        let si = findIndexSS(structs, deleteItem.clock), struct = structs[si];
        si < structs.length && struct.id.clock < endDeleteItemClock;
        struct = structs[++si]
      ) {
        const struct = structs[si];
        if (deleteItem.clock + deleteItem.len <= struct.id.clock) {
          break
        }
        if (struct instanceof Item && struct.deleted && !struct.keep && gcFilter(struct)) {
          struct.gc(store, false);
        }
      }
    }
  }
};

/**
 * @param {DeleteSet} ds
 * @param {StructStore} store
 */
const tryMergeDeleteSet = (ds, store) => {
  // try to merge deleted / gc'd items
  // merge from right to left for better efficiecy and so we don't miss any merge targets
  ds.clients.forEach((deleteItems, client) => {
    const structs = /** @type {Array<GC|Item>} */ (store.clients.get(client));
    for (let di = deleteItems.length - 1; di >= 0; di--) {
      const deleteItem = deleteItems[di];
      // start with merging the item next to the last deleted item
      const mostRightIndexToCheck = math__namespace$1.min(structs.length - 1, 1 + findIndexSS(structs, deleteItem.clock + deleteItem.len - 1));
      for (
        let si = mostRightIndexToCheck, struct = structs[si];
        si > 0 && struct.id.clock >= deleteItem.clock;
        struct = structs[--si]
      ) {
        tryToMergeWithLeft(structs, si);
      }
    }
  });
};

/**
 * @param {DeleteSet} ds
 * @param {StructStore} store
 * @param {function(Item):boolean} gcFilter
 */
const tryGc = (ds, store, gcFilter) => {
  tryGcDeleteSet(ds, store, gcFilter);
  tryMergeDeleteSet(ds, store);
};

/**
 * @param {Array<Transaction>} transactionCleanups
 * @param {number} i
 */
const cleanupTransactions = (transactionCleanups, i) => {
  if (i < transactionCleanups.length) {
    const transaction = transactionCleanups[i];
    const doc = transaction.doc;
    const store = doc.store;
    const ds = transaction.deleteSet;
    const mergeStructs = transaction._mergeStructs;
    try {
      sortAndMergeDeleteSet(ds);
      transaction.afterState = getStateVector(transaction.doc.store);
      doc._transaction = null;
      doc.emit('beforeObserverCalls', [transaction, doc]);
      /**
       * An array of event callbacks.
       *
       * Each callback is called even if the other ones throw errors.
       *
       * @type {Array<function():void>}
       */
      const fs = [];
      // observe events on changed types
      transaction.changed.forEach((subs, itemtype) =>
        fs.push(() => {
          if (itemtype._item === null || !itemtype._item.deleted) {
            itemtype._callObserver(transaction, subs);
          }
        })
      );
      fs.push(() => {
        // deep observe events
        transaction.changedParentTypes.forEach((events, type) =>
          fs.push(() => {
            // We need to think about the possibility that the user transforms the
            // Y.Doc in the event.
            if (type._item === null || !type._item.deleted) {
              events = events
                .filter(event =>
                  event.target._item === null || !event.target._item.deleted
                );
              events
                .forEach(event => {
                  event.currentTarget = type;
                });
              // sort events by path length so that top-level events are fired first.
              events
                .sort((event1, event2) => event1.path.length - event2.path.length);
              // We don't need to check for events.length
              // because we know it has at least one element
              callEventHandlerListeners(type._dEH, events, transaction);
            }
          })
        );
        fs.push(() => doc.emit('afterTransaction', [transaction, doc]));
      });
      f.callAll(fs, []);
    } finally {
      // Replace deleted items with ItemDeleted / GC.
      // This is where content is actually remove from the Yjs Doc.
      if (doc.gc) {
        tryGcDeleteSet(ds, store, doc.gcFilter);
      }
      tryMergeDeleteSet(ds, store);

      // on all affected store.clients props, try to merge
      transaction.afterState.forEach((clock, client) => {
        const beforeClock = transaction.beforeState.get(client) || 0;
        if (beforeClock !== clock) {
          const structs = /** @type {Array<GC|Item>} */ (store.clients.get(client));
          // we iterate from right to left so we can safely remove entries
          const firstChangePos = math__namespace$1.max(findIndexSS(structs, beforeClock), 1);
          for (let i = structs.length - 1; i >= firstChangePos; i--) {
            tryToMergeWithLeft(structs, i);
          }
        }
      });
      // try to merge mergeStructs
      // @todo: it makes more sense to transform mergeStructs to a DS, sort it, and merge from right to left
      //        but at the moment DS does not handle duplicates
      for (let i = 0; i < mergeStructs.length; i++) {
        const { client, clock } = mergeStructs[i].id;
        const structs = /** @type {Array<GC|Item>} */ (store.clients.get(client));
        const replacedStructPos = findIndexSS(structs, clock);
        if (replacedStructPos + 1 < structs.length) {
          tryToMergeWithLeft(structs, replacedStructPos + 1);
        }
        if (replacedStructPos > 0) {
          tryToMergeWithLeft(structs, replacedStructPos);
        }
      }
      if (!transaction.local && transaction.afterState.get(doc.clientID) !== transaction.beforeState.get(doc.clientID)) {
        logging__namespace.print(logging__namespace.ORANGE, logging__namespace.BOLD, '[yjs] ', logging__namespace.UNBOLD, logging__namespace.RED, 'Changed the client-id because another client seems to be using it.');
        doc.clientID = generateNewClientId();
      }
      // @todo Merge all the transactions into one and provide send the data as a single update message
      doc.emit('afterTransactionCleanup', [transaction, doc]);
      if (doc._observers.has('update')) {
        const encoder = new UpdateEncoderV1();
        const hasContent = writeUpdateMessageFromTransaction(encoder, transaction);
        if (hasContent) {
          doc.emit('update', [encoder.toUint8Array(), transaction.origin, doc, transaction]);
        }
      }
      if (doc._observers.has('updateV2')) {
        const encoder = new UpdateEncoderV2();
        const hasContent = writeUpdateMessageFromTransaction(encoder, transaction);
        if (hasContent) {
          doc.emit('updateV2', [encoder.toUint8Array(), transaction.origin, doc, transaction]);
        }
      }
      const { subdocsAdded, subdocsLoaded, subdocsRemoved } = transaction;
      if (subdocsAdded.size > 0 || subdocsRemoved.size > 0 || subdocsLoaded.size > 0) {
        subdocsAdded.forEach(subdoc => {
          subdoc.clientID = doc.clientID;
          if (subdoc.collectionid == null) {
            subdoc.collectionid = doc.collectionid;
          }
          doc.subdocs.add(subdoc);
        });
        subdocsRemoved.forEach(subdoc => doc.subdocs.delete(subdoc));
        doc.emit('subdocs', [{ loaded: subdocsLoaded, added: subdocsAdded, removed: subdocsRemoved }, doc, transaction]);
        subdocsRemoved.forEach(subdoc => subdoc.destroy());
      }

      if (transactionCleanups.length <= i + 1) {
        doc._transactionCleanups = [];
        doc.emit('afterAllTransactions', [doc, transactionCleanups]);
      } else {
        cleanupTransactions(transactionCleanups, i + 1);
      }
    }
  }
};

/**
 * Implements the functionality of `y.transact(()=>{..})`
 *
 * @param {Doc} doc
 * @param {function(Transaction):void} f
 * @param {any} [origin=true]
 *
 * @function
 */
const transact = (doc, f, origin = null, local = true) => {
  const transactionCleanups = doc._transactionCleanups;
  let initialCall = false;
  if (doc._transaction === null) {
    initialCall = true;
    doc._transaction = new Transaction(doc, origin, local);
    transactionCleanups.push(doc._transaction);
    if (transactionCleanups.length === 1) {
      doc.emit('beforeAllTransactions', [doc]);
    }
    doc.emit('beforeTransaction', [doc._transaction, doc]);
  }
  try {
    f(doc._transaction);
  } finally {
    if (initialCall && transactionCleanups[0] === doc._transaction) {
      // The first transaction ended, now process observer calls.
      // Observer call may create new transactions for which we need to call the observers and do cleanup.
      // We don't want to nest these calls, so we execute these calls one after
      // another.
      // Also we need to ensure that all cleanups are called, even if the
      // observes throw errors.
      // This file is full of hacky try {} finally {} blocks to ensure that an
      // event can throw errors and also that the cleanup is called.
      cleanupTransactions(transactionCleanups, 0);
    }
  }
};

class StackItem {
  /**
   * @param {DeleteSet} deletions
   * @param {DeleteSet} insertions
   */
  constructor (deletions, insertions) {
    this.insertions = insertions;
    this.deletions = deletions;
    /**
     * Use this to save and restore metadata like selection range
     */
    this.meta = new Map();
  }
}

/**
 * @param {UndoManager} undoManager
 * @param {Array<StackItem>} stack
 * @param {string} eventType
 * @return {StackItem?}
 */
const popStackItem = (undoManager, stack, eventType) => {
  /**
   * Whether a change happened
   * @type {StackItem?}
   */
  let result = null;
  /**
   * Keep a reference to the transaction so we can fire the event with the changedParentTypes
   * @type {any}
   */
  let _tr = null;
  const doc = undoManager.doc;
  const scope = undoManager.scope;
  transact(doc, transaction => {
    while (stack.length > 0 && result === null) {
      const store = doc.store;
      const stackItem = /** @type {StackItem} */ (stack.pop());
      /**
       * @type {Set<Item>}
       */
      const itemsToRedo = new Set();
      /**
       * @type {Array<Item>}
       */
      const itemsToDelete = [];
      let performedChange = false;
      iterateDeletedStructs(transaction, stackItem.insertions, struct => {
        if (struct instanceof Item) {
          if (struct.redone !== null) {
            let { item, diff } = followRedone(store, struct.id);
            if (diff > 0) {
              item = getItemCleanStart(transaction, createID(item.id.client, item.id.clock + diff));
            }
            struct = item;
          }
          if (!struct.deleted && scope.some(type => isParentOf(type, /** @type {Item} */ (struct)))) {
            itemsToDelete.push(struct);
          }
        }
      });
      iterateDeletedStructs(transaction, stackItem.deletions, struct => {
        if (
          struct instanceof Item &&
          scope.some(type => isParentOf(type, struct)) &&
          // Never redo structs in stackItem.insertions because they were created and deleted in the same capture interval.
          !isDeleted(stackItem.insertions, struct.id)
        ) {
          itemsToRedo.add(struct);
        }
      });
      itemsToRedo.forEach(struct => {
        performedChange = redoItem(transaction, struct, itemsToRedo, itemsToDelete) !== null || performedChange;
      });
      // We want to delete in reverse order so that children are deleted before
      // parents, so we have more information available when items are filtered.
      for (let i = itemsToDelete.length - 1; i >= 0; i--) {
        const item = itemsToDelete[i];
        if (undoManager.deleteFilter(item)) {
          item.delete(transaction);
          performedChange = true;
        }
      }
      result = performedChange ? stackItem : null;
    }
    transaction.changed.forEach((subProps, type) => {
      // destroy search marker if necessary
      if (subProps.has(null) && type._searchMarker) {
        type._searchMarker.length = 0;
      }
    });
    _tr = transaction;
  }, undoManager);
  if (result != null) {
    const changedParentTypes = _tr.changedParentTypes;
    undoManager.emit('stack-item-popped', [{ stackItem: result, type: eventType, changedParentTypes }, undoManager]);
  }
  return result
};

/**
 * @typedef {Object} UndoManagerOptions
 * @property {number} [UndoManagerOptions.captureTimeout=500]
 * @property {function(Item):boolean} [UndoManagerOptions.deleteFilter=()=>true] Sometimes
 * it is necessary to filter whan an Undo/Redo operation can delete. If this
 * filter returns false, the type/item won't be deleted even it is in the
 * undo/redo scope.
 * @property {Set<any>} [UndoManagerOptions.trackedOrigins=new Set([null])]
 */

/**
 * Fires 'stack-item-added' event when a stack item was added to either the undo- or
 * the redo-stack. You may store additional stack information via the
 * metadata property on `event.stackItem.meta` (it is a `Map` of metadata properties).
 * Fires 'stack-item-popped' event when a stack item was popped from either the
 * undo- or the redo-stack. You may restore the saved stack information from `event.stackItem.meta`.
 *
 * @extends {Observable<'stack-item-added'|'stack-item-popped'>}
 */
class UndoManager extends observable.Observable {
  /**
   * @param {AbstractType<any>|Array<AbstractType<any>>} typeScope Accepts either a single type, or an array of types
   * @param {UndoManagerOptions} options
   */
  constructor (typeScope, { captureTimeout = 500, deleteFilter = () => true, trackedOrigins = new Set([null]) } = {}) {
    super();
    this.scope = typeScope instanceof Array ? typeScope : [typeScope];
    this.deleteFilter = deleteFilter;
    trackedOrigins.add(this);
    this.trackedOrigins = trackedOrigins;
    /**
     * @type {Array<StackItem>}
     */
    this.undoStack = [];
    /**
     * @type {Array<StackItem>}
     */
    this.redoStack = [];
    /**
     * Whether the client is currently undoing (calling UndoManager.undo)
     *
     * @type {boolean}
     */
    this.undoing = false;
    this.redoing = false;
    this.doc = /** @type {Doc} */ (this.scope[0].doc);
    this.lastChange = 0;
    this.doc.on('afterTransaction', /** @param {Transaction} transaction */ transaction => {
      // Only track certain transactions
      if (!this.scope.some(type => transaction.changedParentTypes.has(type)) || (!this.trackedOrigins.has(transaction.origin) && (!transaction.origin || !this.trackedOrigins.has(transaction.origin.constructor)))) {
        return
      }
      const undoing = this.undoing;
      const redoing = this.redoing;
      const stack = undoing ? this.redoStack : this.undoStack;
      if (undoing) {
        this.stopCapturing(); // next undo should not be appended to last stack item
      } else if (!redoing) {
        // neither undoing nor redoing: delete redoStack
        this.redoStack = [];
      }
      const insertions = new DeleteSet();
      transaction.afterState.forEach((endClock, client) => {
        const startClock = transaction.beforeState.get(client) || 0;
        const len = endClock - startClock;
        if (len > 0) {
          addToDeleteSet(insertions, client, startClock, len);
        }
      });
      const now = time__namespace$1.getUnixTime();
      if (now - this.lastChange < captureTimeout && stack.length > 0 && !undoing && !redoing) {
        // append change to last stack op
        const lastOp = stack[stack.length - 1];
        lastOp.deletions = mergeDeleteSets([lastOp.deletions, transaction.deleteSet]);
        lastOp.insertions = mergeDeleteSets([lastOp.insertions, insertions]);
      } else {
        // create a new stack op
        stack.push(new StackItem(transaction.deleteSet, insertions));
      }
      if (!undoing && !redoing) {
        this.lastChange = now;
      }
      // make sure that deleted structs are not gc'd
      iterateDeletedStructs(transaction, transaction.deleteSet, /** @param {Item|GC} item */ item => {
        if (item instanceof Item && this.scope.some(type => isParentOf(type, item))) {
          keepItem(item, true);
        }
      });
      this.emit('stack-item-added', [{ stackItem: stack[stack.length - 1], origin: transaction.origin, type: undoing ? 'redo' : 'undo', changedParentTypes: transaction.changedParentTypes }, this]);
    });
  }

  clear () {
    this.doc.transact(transaction => {
      /**
       * @param {StackItem} stackItem
       */
      const clearItem = stackItem => {
        iterateDeletedStructs(transaction, stackItem.deletions, item => {
          if (item instanceof Item && this.scope.some(type => isParentOf(type, item))) {
            keepItem(item, false);
          }
        });
      };
      this.undoStack.forEach(clearItem);
      this.redoStack.forEach(clearItem);
    });
    this.undoStack = [];
    this.redoStack = [];
  }

  /**
   * UndoManager merges Undo-StackItem if they are created within time-gap
   * smaller than `options.captureTimeout`. Call `um.stopCapturing()` so that the next
   * StackItem won't be merged.
   *
   *
   * @example
   *     // without stopCapturing
   *     ytext.insert(0, 'a')
   *     ytext.insert(1, 'b')
   *     um.undo()
   *     ytext.toString() // => '' (note that 'ab' was removed)
   *     // with stopCapturing
   *     ytext.insert(0, 'a')
   *     um.stopCapturing()
   *     ytext.insert(0, 'b')
   *     um.undo()
   *     ytext.toString() // => 'a' (note that only 'b' was removed)
   *
   */
  stopCapturing () {
    this.lastChange = 0;
  }

  /**
   * Undo last changes on type.
   *
   * @return {StackItem?} Returns StackItem if a change was applied
   */
  undo () {
    this.undoing = true;
    let res;
    try {
      res = popStackItem(this, this.undoStack, 'undo');
    } finally {
      this.undoing = false;
    }
    return res
  }

  /**
   * Redo last undo operation.
   *
   * @return {StackItem?} Returns StackItem if a change was applied
   */
  redo () {
    this.redoing = true;
    let res;
    try {
      res = popStackItem(this, this.redoStack, 'redo');
    } finally {
      this.redoing = false;
    }
    return res
  }
}

/**
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 */
function * lazyStructReaderGenerator (decoder) {
  const numOfStateUpdates = decoding__namespace$2.readVarUint(decoder.restDecoder);
  for (let i = 0; i < numOfStateUpdates; i++) {
    const numberOfStructs = decoding__namespace$2.readVarUint(decoder.restDecoder);
    const client = decoder.readClient();
    let clock = decoding__namespace$2.readVarUint(decoder.restDecoder);
    for (let i = 0; i < numberOfStructs; i++) {
      const info = decoder.readInfo();
      // @todo use switch instead of ifs
      if (info === 10) {
        const len = decoding__namespace$2.readVarUint(decoder.restDecoder);
        yield new Skip(createID(client, clock), len);
        clock += len;
      } else if ((binary__namespace.BITS5 & info) !== 0) {
        const cantCopyParentInfo = (info & (binary__namespace.BIT7 | binary__namespace.BIT8)) === 0;
        // If parent = null and neither left nor right are defined, then we know that `parent` is child of `y`
        // and we read the next string as parentYKey.
        // It indicates how we store/retrieve parent from `y.share`
        // @type {string|null}
        const struct = new Item(
          createID(client, clock),
          null, // left
          (info & binary__namespace.BIT8) === binary__namespace.BIT8 ? decoder.readLeftID() : null, // origin
          null, // right
          (info & binary__namespace.BIT7) === binary__namespace.BIT7 ? decoder.readRightID() : null, // right origin
          // @ts-ignore Force writing a string here.
          cantCopyParentInfo ? (decoder.readParentInfo() ? decoder.readString() : decoder.readLeftID()) : null, // parent
          cantCopyParentInfo && (info & binary__namespace.BIT6) === binary__namespace.BIT6 ? decoder.readString() : null, // parentSub
          readItemContent(decoder, info) // item content
        );
        yield struct;
        clock += struct.length;
      } else {
        const len = decoder.readLen();
        yield new GC(createID(client, clock), len);
        clock += len;
      }
    }
  }
}

class LazyStructReader {
  /**
   * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
   * @param {boolean} filterSkips
   */
  constructor (decoder, filterSkips) {
    this.gen = lazyStructReaderGenerator(decoder);
    /**
     * @type {null | Item | Skip | GC}
     */
    this.curr = null;
    this.done = false;
    this.filterSkips = filterSkips;
    this.next();
  }

  /**
   * @return {Item | GC | Skip |null}
   */
  next () {
    // ignore "Skip" structs
    do {
      this.curr = this.gen.next().value || null;
    } while (this.filterSkips && this.curr !== null && this.curr.constructor === Skip)
    return this.curr
  }
}

/**
 * @param {Uint8Array} update
 *
 */
const logUpdate = update => logUpdateV2(update, UpdateDecoderV1);

/**
 * @param {Uint8Array} update
 * @param {typeof UpdateDecoderV2 | typeof UpdateDecoderV1} [YDecoder]
 *
 */
const logUpdateV2 = (update, YDecoder = UpdateDecoderV2) => {
  const structs = [];
  const updateDecoder = new YDecoder(decoding__namespace$2.createDecoder(update));
  const lazyDecoder = new LazyStructReader(updateDecoder, false);
  for (let curr = lazyDecoder.curr; curr !== null; curr = lazyDecoder.next()) {
    structs.push(curr);
  }
  logging__namespace.print('Structs: ', structs);
  const ds = readDeleteSet(updateDecoder);
  logging__namespace.print('DeleteSet: ', ds);
};

class LazyStructWriter {
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  constructor (encoder) {
    this.currClient = 0;
    this.startClock = 0;
    this.written = 0;
    this.encoder = encoder;
    /**
     * We want to write operations lazily, but also we need to know beforehand how many operations we want to write for each client.
     *
     * This kind of meta-information (#clients, #structs-per-client-written) is written to the restEncoder.
     *
     * We fragment the restEncoder and store a slice of it per-client until we know how many clients there are.
     * When we flush (toUint8Array) we write the restEncoder using the fragments and the meta-information.
     *
     * @type {Array<{ written: number, restEncoder: Uint8Array }>}
     */
    this.clientStructs = [];
  }
}

/**
 * @param {Array<Uint8Array>} updates
 * @return {Uint8Array}
 */
const mergeUpdates$1 = updates => mergeUpdatesV2(updates, UpdateDecoderV1, UpdateEncoderV1);

/**
 * @param {Uint8Array} update
 * @param {typeof DSEncoderV1 | typeof DSEncoderV2} YEncoder
 * @param {typeof UpdateDecoderV1 | typeof UpdateDecoderV2} YDecoder
 * @return {Uint8Array}
 */
const encodeStateVectorFromUpdateV2 = (update, YEncoder = DSEncoderV2, YDecoder = UpdateDecoderV2) => {
  const encoder = new YEncoder();
  const updateDecoder = new LazyStructReader(new YDecoder(decoding__namespace$2.createDecoder(update)), false);
  let curr = updateDecoder.curr;
  if (curr !== null) {
    let size = 0;
    let currClient = curr.id.client;
    let stopCounting = curr.id.clock !== 0; // must start at 0
    let currClock = stopCounting ? 0 : curr.id.clock + curr.length;
    for (; curr !== null; curr = updateDecoder.next()) {
      if (currClient !== curr.id.client) {
        if (currClock !== 0) {
          size++;
          // We found a new client
          // write what we have to the encoder
          encoding__namespace$2.writeVarUint(encoder.restEncoder, currClient);
          encoding__namespace$2.writeVarUint(encoder.restEncoder, currClock);
        }
        currClient = curr.id.client;
        currClock = 0;
        stopCounting = curr.id.clock !== 0;
      }
      // we ignore skips
      if (curr.constructor === Skip) {
        stopCounting = true;
      }
      if (!stopCounting) {
        currClock = curr.id.clock + curr.length;
      }
    }
    // write what we have
    if (currClock !== 0) {
      size++;
      encoding__namespace$2.writeVarUint(encoder.restEncoder, currClient);
      encoding__namespace$2.writeVarUint(encoder.restEncoder, currClock);
    }
    // prepend the size of the state vector
    const enc = encoding__namespace$2.createEncoder();
    encoding__namespace$2.writeVarUint(enc, size);
    encoding__namespace$2.writeBinaryEncoder(enc, encoder.restEncoder);
    encoder.restEncoder = enc;
    return encoder.toUint8Array()
  } else {
    encoding__namespace$2.writeVarUint(encoder.restEncoder, 0);
    return encoder.toUint8Array()
  }
};

/**
 * @param {Uint8Array} update
 * @return {Uint8Array}
 */
const encodeStateVectorFromUpdate = update => encodeStateVectorFromUpdateV2(update, DSEncoderV1, UpdateDecoderV1);

/**
 * @param {Uint8Array} update
 * @param {typeof UpdateDecoderV1 | typeof UpdateDecoderV2} YDecoder
 * @return {{ from: Map<number,number>, to: Map<number,number> }}
 */
const parseUpdateMetaV2 = (update, YDecoder = UpdateDecoderV2) => {
  /**
   * @type {Map<number, number>}
   */
  const from = new Map();
  /**
   * @type {Map<number, number>}
   */
  const to = new Map();
  const updateDecoder = new LazyStructReader(new YDecoder(decoding__namespace$2.createDecoder(update)), false);
  let curr = updateDecoder.curr;
  if (curr !== null) {
    let currClient = curr.id.client;
    let currClock = curr.id.clock;
    // write the beginning to `from`
    from.set(currClient, currClock);
    for (; curr !== null; curr = updateDecoder.next()) {
      if (currClient !== curr.id.client) {
        // We found a new client
        // write the end to `to`
        to.set(currClient, currClock);
        // write the beginning to `from`
        from.set(curr.id.client, curr.id.clock);
        // update currClient
        currClient = curr.id.client;
      }
      currClock = curr.id.clock + curr.length;
    }
    // write the end to `to`
    to.set(currClient, currClock);
  }
  return { from, to }
};

/**
 * @param {Uint8Array} update
 * @return {{ from: Map<number,number>, to: Map<number,number> }}
 */
const parseUpdateMeta = update => parseUpdateMetaV2(update, UpdateDecoderV1);

/**
 * This method is intended to slice any kind of struct and retrieve the right part.
 * It does not handle side-effects, so it should only be used by the lazy-encoder.
 *
 * @param {Item | GC | Skip} left
 * @param {number} diff
 * @return {Item | GC}
 */
const sliceStruct = (left, diff) => {
  if (left.constructor === GC) {
    const { client, clock } = left.id;
    return new GC(createID(client, clock + diff), left.length - diff)
  } else if (left.constructor === Skip) {
    const { client, clock } = left.id;
    return new Skip(createID(client, clock + diff), left.length - diff)
  } else {
    const leftItem = /** @type {Item} */ (left);
    const { client, clock } = leftItem.id;
    return new Item(
      createID(client, clock + diff),
      null,
      createID(client, clock + diff - 1),
      null,
      leftItem.rightOrigin,
      leftItem.parent,
      leftItem.parentSub,
      leftItem.content.splice(diff)
    )
  }
};

/**
 *
 * This function works similarly to `readUpdateV2`.
 *
 * @param {Array<Uint8Array>} updates
 * @param {typeof UpdateDecoderV1 | typeof UpdateDecoderV2} [YDecoder]
 * @param {typeof UpdateEncoderV1 | typeof UpdateEncoderV2} [YEncoder]
 * @return {Uint8Array}
 */
const mergeUpdatesV2 = (updates, YDecoder = UpdateDecoderV2, YEncoder = UpdateEncoderV2) => {
  if (updates.length === 1) {
    return updates[0]
  }
  const updateDecoders = updates.map(update => new YDecoder(decoding__namespace$2.createDecoder(update)));
  let lazyStructDecoders = updateDecoders.map(decoder => new LazyStructReader(decoder, true));

  /**
   * @todo we don't need offset because we always slice before
   * @type {null | { struct: Item | GC | Skip, offset: number }}
   */
  let currWrite = null;

  const updateEncoder = new YEncoder();
  // write structs lazily
  const lazyStructEncoder = new LazyStructWriter(updateEncoder);

  // Note: We need to ensure that all lazyStructDecoders are fully consumed
  // Note: Should merge document updates whenever possible - even from different updates
  // Note: Should handle that some operations cannot be applied yet ()

  while (true) {
    // Write higher clients first ⇒ sort by clientID & clock and remove decoders without content
    lazyStructDecoders = lazyStructDecoders.filter(dec => dec.curr !== null);
    lazyStructDecoders.sort(
      /** @type {function(any,any):number} */ (dec1, dec2) => {
        if (dec1.curr.id.client === dec2.curr.id.client) {
          const clockDiff = dec1.curr.id.clock - dec2.curr.id.clock;
          if (clockDiff === 0) {
            // @todo remove references to skip since the structDecoders must filter Skips.
            return dec1.curr.constructor === dec2.curr.constructor
              ? 0
              : dec1.curr.constructor === Skip ? 1 : -1 // we are filtering skips anyway.
          } else {
            return clockDiff
          }
        } else {
          return dec2.curr.id.client - dec1.curr.id.client
        }
      }
    );
    if (lazyStructDecoders.length === 0) {
      break
    }
    const currDecoder = lazyStructDecoders[0];
    // write from currDecoder until the next operation is from another client or if filler-struct
    // then we need to reorder the decoders and find the next operation to write
    const firstClient = /** @type {Item | GC} */ (currDecoder.curr).id.client;

    if (currWrite !== null) {
      let curr = /** @type {Item | GC | null} */ (currDecoder.curr);
      let iterated = false;

      // iterate until we find something that we haven't written already
      // remember: first the high client-ids are written
      while (curr !== null && curr.id.clock + curr.length <= currWrite.struct.id.clock + currWrite.struct.length && curr.id.client >= currWrite.struct.id.client) {
        curr = currDecoder.next();
        iterated = true;
      }
      if (
        curr === null || // current decoder is empty
        curr.id.client !== firstClient || // check whether there is another decoder that has has updates from `firstClient`
        (iterated && curr.id.clock > currWrite.struct.id.clock + currWrite.struct.length) // the above while loop was used and we are potentially missing updates
      ) {
        continue
      }

      if (firstClient !== currWrite.struct.id.client) {
        writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
        currWrite = { struct: curr, offset: 0 };
        currDecoder.next();
      } else {
        if (currWrite.struct.id.clock + currWrite.struct.length < curr.id.clock) {
          // @todo write currStruct & set currStruct = Skip(clock = currStruct.id.clock + currStruct.length, length = curr.id.clock - self.clock)
          if (currWrite.struct.constructor === Skip) {
            // extend existing skip
            currWrite.struct.length = curr.id.clock + curr.length - currWrite.struct.id.clock;
          } else {
            writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
            const diff = curr.id.clock - currWrite.struct.id.clock - currWrite.struct.length;
            /**
             * @type {Skip}
             */
            const struct = new Skip(createID(firstClient, currWrite.struct.id.clock + currWrite.struct.length), diff);
            currWrite = { struct, offset: 0 };
          }
        } else { // if (currWrite.struct.id.clock + currWrite.struct.length >= curr.id.clock) {
          const diff = currWrite.struct.id.clock + currWrite.struct.length - curr.id.clock;
          if (diff > 0) {
            if (currWrite.struct.constructor === Skip) {
              // prefer to slice Skip because the other struct might contain more information
              currWrite.struct.length -= diff;
            } else {
              curr = sliceStruct(curr, diff);
            }
          }
          if (!currWrite.struct.mergeWith(/** @type {any} */ (curr))) {
            writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
            currWrite = { struct: curr, offset: 0 };
            currDecoder.next();
          }
        }
      }
    } else {
      currWrite = { struct: /** @type {Item | GC} */ (currDecoder.curr), offset: 0 };
      currDecoder.next();
    }
    for (
      let next = currDecoder.curr;
      next !== null && next.id.client === firstClient && next.id.clock === currWrite.struct.id.clock + currWrite.struct.length && next.constructor !== Skip;
      next = currDecoder.next()
    ) {
      writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
      currWrite = { struct: next, offset: 0 };
    }
  }
  if (currWrite !== null) {
    writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
    currWrite = null;
  }
  finishLazyStructWriting(lazyStructEncoder);

  const dss = updateDecoders.map(decoder => readDeleteSet(decoder));
  const ds = mergeDeleteSets(dss);
  writeDeleteSet(updateEncoder, ds);
  return updateEncoder.toUint8Array()
};

/**
 * @param {Uint8Array} update
 * @param {Uint8Array} sv
 * @param {typeof UpdateDecoderV1 | typeof UpdateDecoderV2} [YDecoder]
 * @param {typeof UpdateEncoderV1 | typeof UpdateEncoderV2} [YEncoder]
 */
const diffUpdateV2 = (update, sv, YDecoder = UpdateDecoderV2, YEncoder = UpdateEncoderV2) => {
  const state = decodeStateVector(sv);
  const encoder = new YEncoder();
  const lazyStructWriter = new LazyStructWriter(encoder);
  const decoder = new YDecoder(decoding__namespace$2.createDecoder(update));
  const reader = new LazyStructReader(decoder, false);
  while (reader.curr) {
    const curr = reader.curr;
    const currClient = curr.id.client;
    const svClock = state.get(currClient) || 0;
    if (reader.curr.constructor === Skip) {
      // the first written struct shouldn't be a skip
      reader.next();
      continue
    }
    if (curr.id.clock + curr.length > svClock) {
      writeStructToLazyStructWriter(lazyStructWriter, curr, math__namespace$1.max(svClock - curr.id.clock, 0));
      reader.next();
      while (reader.curr && reader.curr.id.client === currClient) {
        writeStructToLazyStructWriter(lazyStructWriter, reader.curr, 0);
        reader.next();
      }
    } else {
      // read until something new comes up
      while (reader.curr && reader.curr.id.client === currClient && reader.curr.id.clock + reader.curr.length <= svClock) {
        reader.next();
      }
    }
  }
  finishLazyStructWriting(lazyStructWriter);
  // write ds
  const ds = readDeleteSet(decoder);
  writeDeleteSet(encoder, ds);
  return encoder.toUint8Array()
};

/**
 * @param {Uint8Array} update
 * @param {Uint8Array} sv
 */
const diffUpdate = (update, sv) => diffUpdateV2(update, sv, UpdateDecoderV1, UpdateEncoderV1);

/**
 * @param {LazyStructWriter} lazyWriter
 */
const flushLazyStructWriter = lazyWriter => {
  if (lazyWriter.written > 0) {
    lazyWriter.clientStructs.push({ written: lazyWriter.written, restEncoder: encoding__namespace$2.toUint8Array(lazyWriter.encoder.restEncoder) });
    lazyWriter.encoder.restEncoder = encoding__namespace$2.createEncoder();
    lazyWriter.written = 0;
  }
};

/**
 * @param {LazyStructWriter} lazyWriter
 * @param {Item | GC} struct
 * @param {number} offset
 */
const writeStructToLazyStructWriter = (lazyWriter, struct, offset) => {
  // flush curr if we start another client
  if (lazyWriter.written > 0 && lazyWriter.currClient !== struct.id.client) {
    flushLazyStructWriter(lazyWriter);
  }
  if (lazyWriter.written === 0) {
    lazyWriter.currClient = struct.id.client;
    // write next client
    lazyWriter.encoder.writeClient(struct.id.client);
    // write startClock
    encoding__namespace$2.writeVarUint(lazyWriter.encoder.restEncoder, struct.id.clock + offset);
  }
  struct.write(lazyWriter.encoder, offset);
  lazyWriter.written++;
};
/**
 * Call this function when we collected all parts and want to
 * put all the parts together. After calling this method,
 * you can continue using the UpdateEncoder.
 *
 * @param {LazyStructWriter} lazyWriter
 */
const finishLazyStructWriting = (lazyWriter) => {
  flushLazyStructWriter(lazyWriter);

  // this is a fresh encoder because we called flushCurr
  const restEncoder = lazyWriter.encoder.restEncoder;

  /**
   * Now we put all the fragments together.
   * This works similarly to `writeClientsStructs`
   */

  // write # states that were updated - i.e. the clients
  encoding__namespace$2.writeVarUint(restEncoder, lazyWriter.clientStructs.length);

  for (let i = 0; i < lazyWriter.clientStructs.length; i++) {
    const partStructs = lazyWriter.clientStructs[i];
    /**
     * Works similarly to `writeStructs`
     */
    // write # encoded structs
    encoding__namespace$2.writeVarUint(restEncoder, partStructs.written);
    // write the rest of the fragment
    encoding__namespace$2.writeUint8Array(restEncoder, partStructs.restEncoder);
  }
};

/**
 * @param {Uint8Array} update
 * @param {typeof UpdateDecoderV2 | typeof UpdateDecoderV1} YDecoder
 * @param {typeof UpdateEncoderV2 | typeof UpdateEncoderV1 } YEncoder
 */
const convertUpdateFormat = (update, YDecoder, YEncoder) => {
  const updateDecoder = new YDecoder(decoding__namespace$2.createDecoder(update));
  const lazyDecoder = new LazyStructReader(updateDecoder, false);
  const updateEncoder = new YEncoder();
  const lazyWriter = new LazyStructWriter(updateEncoder);

  for (let curr = lazyDecoder.curr; curr !== null; curr = lazyDecoder.next()) {
    writeStructToLazyStructWriter(lazyWriter, curr, 0);
  }
  finishLazyStructWriting(lazyWriter);
  const ds = readDeleteSet(updateDecoder);
  writeDeleteSet(updateEncoder, ds);
  return updateEncoder.toUint8Array()
};

/**
 * @param {Uint8Array} update
 */
const convertUpdateFormatV1ToV2 = update => convertUpdateFormat(update, UpdateDecoderV1, UpdateEncoderV2);

/**
 * @param {Uint8Array} update
 */
const convertUpdateFormatV2ToV1 = update => convertUpdateFormat(update, UpdateDecoderV2, UpdateEncoderV1);

/**
 * YEvent describes the changes on a YType.
 */
class YEvent {
  /**
   * @param {AbstractType<any>} target The changed type.
   * @param {Transaction} transaction
   */
  constructor (target, transaction) {
    /**
     * The type on which this event was created on.
     * @type {AbstractType<any>}
     */
    this.target = target;
    /**
     * The current target on which the observe callback is called.
     * @type {AbstractType<any>}
     */
    this.currentTarget = target;
    /**
     * The transaction that triggered this event.
     * @type {Transaction}
     */
    this.transaction = transaction;
    /**
     * @type {Object|null}
     */
    this._changes = null;
    /**
     * @type {null | Map<string, { action: 'add' | 'update' | 'delete', oldValue: any, newValue: any }>}
     */
    this._keys = null;
    /**
     * @type {null | Array<{ insert?: string | Array<any> | object | AbstractType<any>, retain?: number, delete?: number, attributes?: Object<string, any> }>}
     */
    this._delta = null;
  }

  /**
   * Computes the path from `y` to the changed type.
   *
   * @todo v14 should standardize on path: Array<{parent, index}> because that is easier to work with.
   *
   * The following property holds:
   * @example
   *   let type = y
   *   event.path.forEach(dir => {
   *     type = type.get(dir)
   *   })
   *   type === event.target // => true
   */
  get path () {
    // @ts-ignore _item is defined because target is integrated
    return getPathTo(this.currentTarget, this.target)
  }

  /**
   * Check if a struct is deleted by this event.
   *
   * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
   *
   * @param {AbstractStruct} struct
   * @return {boolean}
   */
  deletes (struct) {
    return isDeleted(this.transaction.deleteSet, struct.id)
  }

  /**
   * @type {Map<string, { action: 'add' | 'update' | 'delete', oldValue: any, newValue: any }>}
   */
  get keys () {
    if (this._keys === null) {
      const keys = new Map();
      const target = this.target;
      const changed = /** @type Set<string|null> */ (this.transaction.changed.get(target));
      changed.forEach(key => {
        if (key !== null) {
          const item = /** @type {Item} */ (target._map.get(key));
          /**
           * @type {'delete' | 'add' | 'update'}
           */
          let action;
          let oldValue;
          if (this.adds(item)) {
            let prev = item.left;
            while (prev !== null && this.adds(prev)) {
              prev = prev.left;
            }
            if (this.deletes(item)) {
              if (prev !== null && this.deletes(prev)) {
                action = 'delete';
                oldValue = array__namespace.last(prev.content.getContent());
              } else {
                return
              }
            } else {
              if (prev !== null && this.deletes(prev)) {
                action = 'update';
                oldValue = array__namespace.last(prev.content.getContent());
              } else {
                action = 'add';
                oldValue = undefined;
              }
            }
          } else {
            if (this.deletes(item)) {
              action = 'delete';
              oldValue = array__namespace.last(/** @type {Item} */ item.content.getContent());
            } else {
              return // nop
            }
          }
          keys.set(key, { action, oldValue });
        }
      });
      this._keys = keys;
    }
    return this._keys
  }

  /**
   * @type {Array<{insert?: string | Array<any> | object | AbstractType<any>, retain?: number, delete?: number, attributes?: Object<string, any>}>}
   */
  get delta () {
    return this.changes.delta
  }

  /**
   * Check if a struct is added by this event.
   *
   * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
   *
   * @param {AbstractStruct} struct
   * @return {boolean}
   */
  adds (struct) {
    return struct.id.clock >= (this.transaction.beforeState.get(struct.id.client) || 0)
  }

  /**
   * @type {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert?:Array<any>|string, delete?:number, retain?:number}>}}
   */
  get changes () {
    let changes = this._changes;
    if (changes === null) {
      const target = this.target;
      const added = set__namespace.create();
      const deleted = set__namespace.create();
      /**
       * @type {Array<{insert:Array<any>}|{delete:number}|{retain:number}>}
       */
      const delta = [];
      changes = {
        added,
        deleted,
        delta,
        keys: this.keys
      };
      const changed = /** @type Set<string|null> */ (this.transaction.changed.get(target));
      if (changed.has(null)) {
        /**
         * @type {any}
         */
        let lastOp = null;
        const packOp = () => {
          if (lastOp) {
            delta.push(lastOp);
          }
        };
        for (let item = target._start; item !== null; item = item.right) {
          if (item.deleted) {
            if (this.deletes(item) && !this.adds(item)) {
              if (lastOp === null || lastOp.delete === undefined) {
                packOp();
                lastOp = { delete: 0 };
              }
              lastOp.delete += item.length;
              deleted.add(item);
            } // else nop
          } else {
            if (this.adds(item)) {
              if (lastOp === null || lastOp.insert === undefined) {
                packOp();
                lastOp = { insert: [] };
              }
              lastOp.insert = lastOp.insert.concat(item.content.getContent());
              added.add(item);
            } else {
              if (lastOp === null || lastOp.retain === undefined) {
                packOp();
                lastOp = { retain: 0 };
              }
              lastOp.retain += item.length;
            }
          }
        }
        if (lastOp !== null && lastOp.retain === undefined) {
          packOp();
        }
      }
      this._changes = changes;
    }
    return /** @type {any} */ (changes)
  }
}

/**
 * Compute the path from this type to the specified target.
 *
 * @example
 *   // `child` should be accessible via `type.get(path[0]).get(path[1])..`
 *   const path = type.getPathTo(child)
 *   // assuming `type instanceof YArray`
 *   console.log(path) // might look like => [2, 'key1']
 *   child === type.get(path[0]).get(path[1])
 *
 * @param {AbstractType<any>} parent
 * @param {AbstractType<any>} child target
 * @return {Array<string|number>} Path to the target
 *
 * @private
 * @function
 */
const getPathTo = (parent, child) => {
  const path = [];
  while (child._item !== null && child !== parent) {
    if (child._item.parentSub !== null) {
      // parent is map-ish
      path.unshift(child._item.parentSub);
    } else {
      // parent is array-ish
      let i = 0;
      let c = /** @type {AbstractType<any>} */ (child._item.parent)._start;
      while (c !== child._item && c !== null) {
        if (!c.deleted) {
          i++;
        }
        c = c.right;
      }
      path.unshift(i);
    }
    child = /** @type {AbstractType<any>} */ (child._item.parent);
  }
  return path
};

const maxSearchMarker = 80;

/**
 * A unique timestamp that identifies each marker.
 *
 * Time is relative,.. this is more like an ever-increasing clock.
 *
 * @type {number}
 */
let globalSearchMarkerTimestamp = 0;

class ArraySearchMarker {
  /**
   * @param {Item} p
   * @param {number} index
   */
  constructor (p, index) {
    p.marker = true;
    this.p = p;
    this.index = index;
    this.timestamp = globalSearchMarkerTimestamp++;
  }
}

/**
 * @param {ArraySearchMarker} marker
 */
const refreshMarkerTimestamp = marker => { marker.timestamp = globalSearchMarkerTimestamp++; };

/**
 * This is rather complex so this function is the only thing that should overwrite a marker
 *
 * @param {ArraySearchMarker} marker
 * @param {Item} p
 * @param {number} index
 */
const overwriteMarker = (marker, p, index) => {
  marker.p.marker = false;
  marker.p = p;
  p.marker = true;
  marker.index = index;
  marker.timestamp = globalSearchMarkerTimestamp++;
};

/**
 * @param {Array<ArraySearchMarker>} searchMarker
 * @param {Item} p
 * @param {number} index
 */
const markPosition = (searchMarker, p, index) => {
  if (searchMarker.length >= maxSearchMarker) {
    // override oldest marker (we don't want to create more objects)
    const marker = searchMarker.reduce((a, b) => a.timestamp < b.timestamp ? a : b);
    overwriteMarker(marker, p, index);
    return marker
  } else {
    // create new marker
    const pm = new ArraySearchMarker(p, index);
    searchMarker.push(pm);
    return pm
  }
};

/**
 * Search marker help us to find positions in the associative array faster.
 *
 * They speed up the process of finding a position without much bookkeeping.
 *
 * A maximum of `maxSearchMarker` objects are created.
 *
 * This function always returns a refreshed marker (updated timestamp)
 *
 * @param {AbstractType<any>} yarray
 * @param {number} index
 */
const findMarker = (yarray, index) => {
  if (yarray._start === null || index === 0 || yarray._searchMarker === null) {
    return null
  }
  const marker = yarray._searchMarker.length === 0 ? null : yarray._searchMarker.reduce((a, b) => math__namespace$1.abs(index - a.index) < math__namespace$1.abs(index - b.index) ? a : b);
  let p = yarray._start;
  let pindex = 0;
  if (marker !== null) {
    p = marker.p;
    pindex = marker.index;
    refreshMarkerTimestamp(marker); // we used it, we might need to use it again
  }
  // iterate to right if possible
  while (p.right !== null && pindex < index) {
    if (!p.deleted && p.countable) {
      if (index < pindex + p.length) {
        break
      }
      pindex += p.length;
    }
    p = p.right;
  }
  // iterate to left if necessary (might be that pindex > index)
  while (p.left !== null && pindex > index) {
    p = p.left;
    if (!p.deleted && p.countable) {
      pindex -= p.length;
    }
  }
  // we want to make sure that p can't be merged with left, because that would screw up everything
  // in that cas just return what we have (it is most likely the best marker anyway)
  // iterate to left until p can't be merged with left
  while (p.left !== null && p.left.id.client === p.id.client && p.left.id.clock + p.left.length === p.id.clock) {
    p = p.left;
    if (!p.deleted && p.countable) {
      pindex -= p.length;
    }
  }

  // @todo remove!
  // assure position
  // {
  //   let start = yarray._start
  //   let pos = 0
  //   while (start !== p) {
  //     if (!start.deleted && start.countable) {
  //       pos += start.length
  //     }
  //     start = /** @type {Item} */ (start.right)
  //   }
  //   if (pos !== pindex) {
  //     debugger
  //     throw new Error('Gotcha position fail!')
  //   }
  // }
  // if (marker) {
  //   if (window.lengthes == null) {
  //     window.lengthes = []
  //     window.getLengthes = () => window.lengthes.sort((a, b) => a - b)
  //   }
  //   window.lengthes.push(marker.index - pindex)
  //   console.log('distance', marker.index - pindex, 'len', p && p.parent.length)
  // }
  if (marker !== null && math__namespace$1.abs(marker.index - pindex) < /** @type {YText|YArray<any>} */ (p.parent).length / maxSearchMarker) {
    // adjust existing marker
    overwriteMarker(marker, p, pindex);
    return marker
  } else {
    // create new marker
    return markPosition(yarray._searchMarker, p, pindex)
  }
};

/**
 * Update markers when a change happened.
 *
 * This should be called before doing a deletion!
 *
 * @param {Array<ArraySearchMarker>} searchMarker
 * @param {number} index
 * @param {number} len If insertion, len is positive. If deletion, len is negative.
 */
const updateMarkerChanges = (searchMarker, index, len) => {
  for (let i = searchMarker.length - 1; i >= 0; i--) {
    const m = searchMarker[i];
    if (len > 0) {
      /**
       * @type {Item|null}
       */
      let p = m.p;
      p.marker = false;
      // Ideally we just want to do a simple position comparison, but this will only work if
      // search markers don't point to deleted items for formats.
      // Iterate marker to prev undeleted countable position so we know what to do when updating a position
      while (p && (p.deleted || !p.countable)) {
        p = p.left;
        if (p && !p.deleted && p.countable) {
          // adjust position. the loop should break now
          m.index -= p.length;
        }
      }
      if (p === null || p.marker === true) {
        // remove search marker if updated position is null or if position is already marked
        searchMarker.splice(i, 1);
        continue
      }
      m.p = p;
      p.marker = true;
    }
    if (index < m.index || (len > 0 && index === m.index)) { // a simple index <= m.index check would actually suffice
      m.index = math__namespace$1.max(index, m.index + len);
    }
  }
};

/**
 * Accumulate all (list) children of a type and return them as an Array.
 *
 * @param {AbstractType<any>} t
 * @return {Array<Item>}
 */
const getTypeChildren = t => {
  let s = t._start;
  const arr = [];
  while (s) {
    arr.push(s);
    s = s.right;
  }
  return arr
};

/**
 * Call event listeners with an event. This will also add an event to all
 * parents (for `.observeDeep` handlers).
 *
 * @template EventType
 * @param {AbstractType<EventType>} type
 * @param {Transaction} transaction
 * @param {EventType} event
 */
const callTypeObservers = (type, transaction, event) => {
  const changedType = type;
  const changedParentTypes = transaction.changedParentTypes;
  while (true) {
    // @ts-ignore
    map__namespace.setIfUndefined(changedParentTypes, type, () => []).push(event);
    if (type._item === null) {
      break
    }
    type = /** @type {AbstractType<any>} */ (type._item.parent);
  }
  callEventHandlerListeners(changedType._eH, event, transaction);
};

/**
 * @template EventType
 * Abstract Yjs Type class
 */
class AbstractType {
  constructor () {
    /**
     * @type {Item|null}
     */
    this._item = null;
    /**
     * @type {Map<string,Item>}
     */
    this._map = new Map();
    /**
     * @type {Item|null}
     */
    this._start = null;
    /**
     * @type {Doc|null}
     */
    this.doc = null;
    this._length = 0;
    /**
     * Event handlers
     * @type {EventHandler<EventType,Transaction>}
     */
    this._eH = createEventHandler();
    /**
     * Deep event handlers
     * @type {EventHandler<Array<YEvent>,Transaction>}
     */
    this._dEH = createEventHandler();
    /**
     * @type {null | Array<ArraySearchMarker>}
     */
    this._searchMarker = null;
  }

  /**
   * @return {AbstractType<any>|null}
   */
  get parent () {
    return this._item ? /** @type {AbstractType<any>} */ (this._item.parent) : null
  }

  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item|null} item
   */
  _integrate (y, item) {
    this.doc = y;
    this._item = item;
  }

  /**
   * @return {AbstractType<EventType>}
   */
  _copy () {
    throw error__namespace.methodUnimplemented()
  }

  /**
   * @return {AbstractType<EventType>}
   */
  clone () {
    throw error__namespace.methodUnimplemented()
  }

  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write (encoder) { }

  /**
   * The first non-deleted item
   */
  get _first () {
    let n = this._start;
    while (n !== null && n.deleted) {
      n = n.right;
    }
    return n
  }

  /**
   * Creates YEvent and calls all type observers.
   * Must be implemented by each type.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver (transaction, parentSubs) {
    if (!transaction.local && this._searchMarker) {
      this._searchMarker.length = 0;
    }
  }

  /**
   * Observe all events that are created on this type.
   *
   * @param {function(EventType, Transaction):void} f Observer function
   */
  observe (f) {
    addEventHandlerListener(this._eH, f);
  }

  /**
   * Observe all events that are created by this type and its children.
   *
   * @param {function(Array<YEvent>,Transaction):void} f Observer function
   */
  observeDeep (f) {
    addEventHandlerListener(this._dEH, f);
  }

  /**
   * Unregister an observer function.
   *
   * @param {function(EventType,Transaction):void} f Observer function
   */
  unobserve (f) {
    removeEventHandlerListener(this._eH, f);
  }

  /**
   * Unregister an observer function.
   *
   * @param {function(Array<YEvent>,Transaction):void} f Observer function
   */
  unobserveDeep (f) {
    removeEventHandlerListener(this._dEH, f);
  }

  /**
   * @abstract
   * @return {any}
   */
  toJSON () {}
}

/**
 * @param {AbstractType<any>} type
 * @param {number} start
 * @param {number} end
 * @return {Array<any>}
 *
 * @private
 * @function
 */
const typeListSlice = (type, start, end) => {
  if (start < 0) {
    start = type._length + start;
  }
  if (end < 0) {
    end = type._length + end;
  }
  let len = end - start;
  const cs = [];
  let n = type._start;
  while (n !== null && len > 0) {
    if (n.countable && !n.deleted) {
      const c = n.content.getContent();
      if (c.length <= start) {
        start -= c.length;
      } else {
        for (let i = start; i < c.length && len > 0; i++) {
          cs.push(c[i]);
          len--;
        }
        start = 0;
      }
    }
    n = n.right;
  }
  return cs
};

/**
 * @param {AbstractType<any>} type
 * @return {Array<any>}
 *
 * @private
 * @function
 */
const typeListToArray = type => {
  const cs = [];
  let n = type._start;
  while (n !== null) {
    if (n.countable && !n.deleted) {
      const c = n.content.getContent();
      for (let i = 0; i < c.length; i++) {
        cs.push(c[i]);
      }
    }
    n = n.right;
  }
  return cs
};

/**
 * @param {AbstractType<any>} type
 * @param {Snapshot} snapshot
 * @return {Array<any>}
 *
 * @private
 * @function
 */
const typeListToArraySnapshot = (type, snapshot) => {
  const cs = [];
  let n = type._start;
  while (n !== null) {
    if (n.countable && isVisible(n, snapshot)) {
      const c = n.content.getContent();
      for (let i = 0; i < c.length; i++) {
        cs.push(c[i]);
      }
    }
    n = n.right;
  }
  return cs
};

/**
 * Executes a provided function on once on overy element of this YArray.
 *
 * @param {AbstractType<any>} type
 * @param {function(any,number,any):void} f A function to execute on every element of this YArray.
 *
 * @private
 * @function
 */
const typeListForEach = (type, f) => {
  let index = 0;
  let n = type._start;
  while (n !== null) {
    if (n.countable && !n.deleted) {
      const c = n.content.getContent();
      for (let i = 0; i < c.length; i++) {
        f(c[i], index++, type);
      }
    }
    n = n.right;
  }
};

/**
 * @template C,R
 * @param {AbstractType<any>} type
 * @param {function(C,number,AbstractType<any>):R} f
 * @return {Array<R>}
 *
 * @private
 * @function
 */
const typeListMap = (type, f) => {
  /**
   * @type {Array<any>}
   */
  const result = [];
  typeListForEach(type, (c, i) => {
    result.push(f(c, i, type));
  });
  return result
};

/**
 * @param {AbstractType<any>} type
 * @return {IterableIterator<any>}
 *
 * @private
 * @function
 */
const typeListCreateIterator = type => {
  let n = type._start;
  /**
   * @type {Array<any>|null}
   */
  let currentContent = null;
  let currentContentIndex = 0;
  return {
    [Symbol.iterator] () {
      return this
    },
    next: () => {
      // find some content
      if (currentContent === null) {
        while (n !== null && n.deleted) {
          n = n.right;
        }
        // check if we reached the end, no need to check currentContent, because it does not exist
        if (n === null) {
          return {
            done: true,
            value: undefined
          }
        }
        // we found n, so we can set currentContent
        currentContent = n.content.getContent();
        currentContentIndex = 0;
        n = n.right; // we used the content of n, now iterate to next
      }
      const value = currentContent[currentContentIndex++];
      // check if we need to empty currentContent
      if (currentContent.length <= currentContentIndex) {
        currentContent = null;
      }
      return {
        done: false,
        value
      }
    }
  }
};

/**
 * @param {AbstractType<any>} type
 * @param {number} index
 * @return {any}
 *
 * @private
 * @function
 */
const typeListGet = (type, index) => {
  const marker = findMarker(type, index);
  let n = type._start;
  if (marker !== null) {
    n = marker.p;
    index -= marker.index;
  }
  for (; n !== null; n = n.right) {
    if (!n.deleted && n.countable) {
      if (index < n.length) {
        return n.content.getContent()[index]
      }
      index -= n.length;
    }
  }
};

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {Item?} referenceItem
 * @param {Array<Object<string,any>|Array<any>|boolean|number|null|string|Uint8Array>} content
 *
 * @private
 * @function
 */
const typeListInsertGenericsAfter = (transaction, parent, referenceItem, content) => {
  let left = referenceItem;
  const doc = transaction.doc;
  const ownClientId = doc.clientID;
  const store = doc.store;
  const right = referenceItem === null ? parent._start : referenceItem.right;
  /**
   * @type {Array<Object|Array<any>|number|null>}
   */
  let jsonContent = [];
  const packJsonContent = () => {
    if (jsonContent.length > 0) {
      left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentAny(jsonContent));
      left.integrate(transaction, 0);
      jsonContent = [];
    }
  };
  content.forEach(c => {
    if (c === null) {
      jsonContent.push(c);
    } else {
      switch (c.constructor) {
        case Number:
        case Object:
        case Boolean:
        case Array:
        case String:
          jsonContent.push(c);
          break
        default:
          packJsonContent();
          switch (c.constructor) {
            case Uint8Array:
            case ArrayBuffer:
              left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentBinary(new Uint8Array(/** @type {Uint8Array} */ (c))));
              left.integrate(transaction, 0);
              break
            case Doc:
              left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentDoc(/** @type {Doc} */ (c)));
              left.integrate(transaction, 0);
              break
            default:
              if (c instanceof AbstractType) {
                left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentType(c));
                left.integrate(transaction, 0);
              } else {
                throw new Error('Unexpected content type in insert operation')
              }
          }
      }
    }
  });
  packJsonContent();
};

const lengthExceeded = error__namespace.create('Length exceeded!');

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {number} index
 * @param {Array<Object<string,any>|Array<any>|number|null|string|Uint8Array>} content
 *
 * @private
 * @function
 */
const typeListInsertGenerics = (transaction, parent, index, content) => {
  if (index > parent._length) {
    throw lengthExceeded
  }
  if (index === 0) {
    if (parent._searchMarker) {
      updateMarkerChanges(parent._searchMarker, index, content.length);
    }
    return typeListInsertGenericsAfter(transaction, parent, null, content)
  }
  const startIndex = index;
  const marker = findMarker(parent, index);
  let n = parent._start;
  if (marker !== null) {
    n = marker.p;
    index -= marker.index;
    // we need to iterate one to the left so that the algorithm works
    if (index === 0) {
      // @todo refactor this as it actually doesn't consider formats
      n = n.prev; // important! get the left undeleted item so that we can actually decrease index
      index += (n && n.countable && !n.deleted) ? n.length : 0;
    }
  }
  for (; n !== null; n = n.right) {
    if (!n.deleted && n.countable) {
      if (index <= n.length) {
        if (index < n.length) {
          // insert in-between
          getItemCleanStart(transaction, createID(n.id.client, n.id.clock + index));
        }
        break
      }
      index -= n.length;
    }
  }
  if (parent._searchMarker) {
    updateMarkerChanges(parent._searchMarker, startIndex, content.length);
  }
  return typeListInsertGenericsAfter(transaction, parent, n, content)
};

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {number} index
 * @param {number} length
 *
 * @private
 * @function
 */
const typeListDelete = (transaction, parent, index, length) => {
  if (length === 0) { return }
  const startIndex = index;
  const startLength = length;
  const marker = findMarker(parent, index);
  let n = parent._start;
  if (marker !== null) {
    n = marker.p;
    index -= marker.index;
  }
  // compute the first item to be deleted
  for (; n !== null && index > 0; n = n.right) {
    if (!n.deleted && n.countable) {
      if (index < n.length) {
        getItemCleanStart(transaction, createID(n.id.client, n.id.clock + index));
      }
      index -= n.length;
    }
  }
  // delete all items until done
  while (length > 0 && n !== null) {
    if (!n.deleted) {
      if (length < n.length) {
        getItemCleanStart(transaction, createID(n.id.client, n.id.clock + length));
      }
      n.delete(transaction);
      length -= n.length;
    }
    n = n.right;
  }
  if (length > 0) {
    throw lengthExceeded
  }
  if (parent._searchMarker) {
    updateMarkerChanges(parent._searchMarker, startIndex, -startLength + length /* in case we remove the above exception */);
  }
};

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {string} key
 *
 * @private
 * @function
 */
const typeMapDelete = (transaction, parent, key) => {
  const c = parent._map.get(key);
  if (c !== undefined) {
    c.delete(transaction);
  }
};

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {string} key
 * @param {Object|number|null|Array<any>|string|Uint8Array|AbstractType<any>} value
 *
 * @private
 * @function
 */
const typeMapSet = (transaction, parent, key, value) => {
  const left = parent._map.get(key) || null;
  const doc = transaction.doc;
  const ownClientId = doc.clientID;
  let content;
  if (value == null) {
    content = new ContentAny([value]);
  } else {
    switch (value.constructor) {
      case Number:
      case Object:
      case Boolean:
      case Array:
      case String:
        content = new ContentAny([value]);
        break
      case Uint8Array:
        content = new ContentBinary(/** @type {Uint8Array} */ (value));
        break
      case Doc:
        content = new ContentDoc(/** @type {Doc} */ (value));
        break
      default:
        if (value instanceof AbstractType) {
          content = new ContentType(value);
        } else {
          throw new Error('Unexpected content type')
        }
    }
  }
  new Item(createID(ownClientId, getState(doc.store, ownClientId)), left, left && left.lastId, null, null, parent, key, content).integrate(transaction, 0);
};

/**
 * @param {AbstractType<any>} parent
 * @param {string} key
 * @return {Object<string,any>|number|null|Array<any>|string|Uint8Array|AbstractType<any>|undefined}
 *
 * @private
 * @function
 */
const typeMapGet = (parent, key) => {
  const val = parent._map.get(key);
  return val !== undefined && !val.deleted ? val.content.getContent()[val.length - 1] : undefined
};

/**
 * @param {AbstractType<any>} parent
 * @return {Object<string,Object<string,any>|number|null|Array<any>|string|Uint8Array|AbstractType<any>|undefined>}
 *
 * @private
 * @function
 */
const typeMapGetAll = (parent) => {
  /**
   * @type {Object<string,any>}
   */
  const res = {};
  parent._map.forEach((value, key) => {
    if (!value.deleted) {
      res[key] = value.content.getContent()[value.length - 1];
    }
  });
  return res
};

/**
 * @param {AbstractType<any>} parent
 * @param {string} key
 * @return {boolean}
 *
 * @private
 * @function
 */
const typeMapHas = (parent, key) => {
  const val = parent._map.get(key);
  return val !== undefined && !val.deleted
};

/**
 * @param {AbstractType<any>} parent
 * @param {string} key
 * @param {Snapshot} snapshot
 * @return {Object<string,any>|number|null|Array<any>|string|Uint8Array|AbstractType<any>|undefined}
 *
 * @private
 * @function
 */
const typeMapGetSnapshot = (parent, key, snapshot) => {
  let v = parent._map.get(key) || null;
  while (v !== null && (!snapshot.sv.has(v.id.client) || v.id.clock >= (snapshot.sv.get(v.id.client) || 0))) {
    v = v.left;
  }
  return v !== null && isVisible(v, snapshot) ? v.content.getContent()[v.length - 1] : undefined
};

/**
 * @param {Map<string,Item>} map
 * @return {IterableIterator<Array<any>>}
 *
 * @private
 * @function
 */
const createMapIterator = map => iterator__namespace.iteratorFilter(map.entries(), /** @param {any} entry */ entry => !entry[1].deleted);

/**
 * @module YArray
 */

/**
 * Event that describes the changes on a YArray
 * @template T
 */
class YArrayEvent extends YEvent {
  /**
   * @param {YArray<T>} yarray The changed type
   * @param {Transaction} transaction The transaction object
   */
  constructor (yarray, transaction) {
    super(yarray, transaction);
    this._transaction = transaction;
  }
}

/**
 * A shared Array implementation.
 * @template T
 * @extends AbstractType<YArrayEvent<T>>
 * @implements {Iterable<T>}
 */
class YArray extends AbstractType {
  constructor () {
    super();
    /**
     * @type {Array<any>?}
     * @private
     */
    this._prelimContent = [];
    /**
     * @type {Array<ArraySearchMarker>}
     */
    this._searchMarker = [];
  }

  /**
   * Construct a new YArray containing the specified items.
   * @template T
   * @param {Array<T>} items
   * @return {YArray<T>}
   */
  static from (items) {
    const a = new YArray();
    a.push(items);
    return a
  }

  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate (y, item) {
    super._integrate(y, item);
    this.insert(0, /** @type {Array<any>} */ (this._prelimContent));
    this._prelimContent = null;
  }

  _copy () {
    return new YArray()
  }

  /**
   * @return {YArray<T>}
   */
  clone () {
    const arr = new YArray();
    arr.insert(0, this.toArray().map(el =>
      el instanceof AbstractType ? el.clone() : el
    ));
    return arr
  }

  get length () {
    return this._prelimContent === null ? this._length : this._prelimContent.length
  }

  /**
   * Creates YArrayEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver (transaction, parentSubs) {
    super._callObserver(transaction, parentSubs);
    callTypeObservers(this, transaction, new YArrayEvent(this, transaction));
  }

  /**
   * Inserts new content at an index.
   *
   * Important: This function expects an array of content. Not just a content
   * object. The reason for this "weirdness" is that inserting several elements
   * is very efficient when it is done as a single operation.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  yarray.insert(0, ['a'])
   *  // Insert numbers 1, 2 at position 1
   *  yarray.insert(1, [1, 2])
   *
   * @param {number} index The index to insert content at.
   * @param {Array<T>} content The array of content
   */
  insert (index, content) {
    if (this.doc !== null) {
      transact(this.doc, transaction => {
        typeListInsertGenerics(transaction, this, index, content);
      });
    } else {
      /** @type {Array<any>} */ (this._prelimContent).splice(index, 0, ...content);
    }
  }

  /**
   * Appends content to this YArray.
   *
   * @param {Array<T>} content Array of content to append.
   */
  push (content) {
    this.insert(this.length, content);
  }

  /**
   * Preppends content to this YArray.
   *
   * @param {Array<T>} content Array of content to preppend.
   */
  unshift (content) {
    this.insert(0, content);
  }

  /**
   * Deletes elements starting from an index.
   *
   * @param {number} index Index at which to start deleting elements
   * @param {number} length The number of elements to remove. Defaults to 1.
   */
  delete (index, length = 1) {
    if (this.doc !== null) {
      transact(this.doc, transaction => {
        typeListDelete(transaction, this, index, length);
      });
    } else {
      /** @type {Array<any>} */ (this._prelimContent).splice(index, length);
    }
  }

  /**
   * Returns the i-th element from a YArray.
   *
   * @param {number} index The index of the element to return from the YArray
   * @return {T}
   */
  get (index) {
    return typeListGet(this, index)
  }

  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @return {Array<T>}
   */
  toArray () {
    return typeListToArray(this)
  }

  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @param {number} [start]
   * @param {number} [end]
   * @return {Array<T>}
   */
  slice (start = 0, end = this.length) {
    return typeListSlice(this, start, end)
  }

  /**
   * Transforms this Shared Type to a JSON object.
   *
   * @return {Array<any>}
   */
  toJSON () {
    return this.map(c => c instanceof AbstractType ? c.toJSON() : c)
  }

  /**
   * Returns an Array with the result of calling a provided function on every
   * element of this YArray.
   *
   * @template M
   * @param {function(T,number,YArray<T>):M} f Function that produces an element of the new Array
   * @return {Array<M>} A new array with each element being the result of the
   *                 callback function
   */
  map (f) {
    return typeListMap(this, /** @type {any} */ (f))
  }

  /**
   * Executes a provided function on once on overy element of this YArray.
   *
   * @param {function(T,number,YArray<T>):void} f A function to execute on every element of this YArray.
   */
  forEach (f) {
    typeListForEach(this, f);
  }

  /**
   * @return {IterableIterator<T>}
   */
  [Symbol.iterator] () {
    return typeListCreateIterator(this)
  }

  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write (encoder) {
    encoder.writeTypeRef(YArrayRefID);
  }
}

/**
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 *
 * @private
 * @function
 */
const readYArray = decoder => new YArray();

/**
 * @template T
 * Event that describes the changes on a YMap.
 */
class YMapEvent extends YEvent {
  /**
   * @param {YMap<T>} ymap The YArray that changed.
   * @param {Transaction} transaction
   * @param {Set<any>} subs The keys that changed.
   */
  constructor (ymap, transaction, subs) {
    super(ymap, transaction);
    this.keysChanged = subs;
  }
}

/**
 * @template MapType
 * A shared Map implementation.
 *
 * @extends AbstractType<YMapEvent<MapType>>
 * @implements {Iterable<MapType>}
 */
class YMap extends AbstractType {
  /**
   *
   * @param {Iterable<readonly [string, any]>=} entries - an optional iterable to initialize the YMap
   */
  constructor (entries) {
    super();
    /**
     * @type {Map<string,any>?}
     * @private
     */
    this._prelimContent = null;

    if (entries === undefined) {
      this._prelimContent = new Map();
    } else {
      this._prelimContent = new Map(entries);
    }
  }

  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate (y, item) {
    super._integrate(y, item)
    ;/** @type {Map<string, any>} */ (this._prelimContent).forEach((value, key) => {
      this.set(key, value);
    });
    this._prelimContent = null;
  }

  _copy () {
    return new YMap()
  }

  /**
   * @return {YMap<MapType>}
   */
  clone () {
    const map = new YMap();
    this.forEach((value, key) => {
      map.set(key, value instanceof AbstractType ? value.clone() : value);
    });
    return map
  }

  /**
   * Creates YMapEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver (transaction, parentSubs) {
    callTypeObservers(this, transaction, new YMapEvent(this, transaction, parentSubs));
  }

  /**
   * Transforms this Shared Type to a JSON object.
   *
   * @return {Object<string,any>}
   */
  toJSON () {
    /**
     * @type {Object<string,MapType>}
     */
    const map = {};
    this._map.forEach((item, key) => {
      if (!item.deleted) {
        const v = item.content.getContent()[item.length - 1];
        map[key] = v instanceof AbstractType ? v.toJSON() : v;
      }
    });
    return map
  }

  /**
   * Returns the size of the YMap (count of key/value pairs)
   *
   * @return {number}
   */
  get size () {
    return [...createMapIterator(this._map)].length
  }

  /**
   * Returns the keys for each element in the YMap Type.
   *
   * @return {IterableIterator<string>}
   */
  keys () {
    return iterator__namespace.iteratorMap(createMapIterator(this._map), /** @param {any} v */ v => v[0])
  }

  /**
   * Returns the values for each element in the YMap Type.
   *
   * @return {IterableIterator<any>}
   */
  values () {
    return iterator__namespace.iteratorMap(createMapIterator(this._map), /** @param {any} v */ v => v[1].content.getContent()[v[1].length - 1])
  }

  /**
   * Returns an Iterator of [key, value] pairs
   *
   * @return {IterableIterator<any>}
   */
  entries () {
    return iterator__namespace.iteratorMap(createMapIterator(this._map), /** @param {any} v */ v => [v[0], v[1].content.getContent()[v[1].length - 1]])
  }

  /**
   * Executes a provided function on once on every key-value pair.
   *
   * @param {function(MapType,string,YMap<MapType>):void} f A function to execute on every element of this YArray.
   */
  forEach (f) {
    /**
     * @type {Object<string,MapType>}
     */
    const map = {};
    this._map.forEach((item, key) => {
      if (!item.deleted) {
        f(item.content.getContent()[item.length - 1], key, this);
      }
    });
    return map
  }

  /**
   * @return {IterableIterator<MapType>}
   */
  [Symbol.iterator] () {
    return this.entries()
  }

  /**
   * Remove a specified element from this YMap.
   *
   * @param {string} key The key of the element to remove.
   */
  delete (key) {
    if (this.doc !== null) {
      transact(this.doc, transaction => {
        typeMapDelete(transaction, this, key);
      });
    } else {
      /** @type {Map<string, any>} */ (this._prelimContent).delete(key);
    }
  }

  /**
   * Adds or updates an element with a specified key and value.
   *
   * @param {string} key The key of the element to add to this YMap
   * @param {MapType} value The value of the element to add
   */
  set (key, value) {
    if (this.doc !== null) {
      transact(this.doc, transaction => {
        typeMapSet(transaction, this, key, value);
      });
    } else {
      /** @type {Map<string, any>} */ (this._prelimContent).set(key, value);
    }
    return value
  }

  /**
   * Returns a specified element from this YMap.
   *
   * @param {string} key
   * @return {MapType|undefined}
   */
  get (key) {
    return /** @type {any} */ (typeMapGet(this, key))
  }

  /**
   * Returns a boolean indicating whether the specified key exists or not.
   *
   * @param {string} key The key to test.
   * @return {boolean}
   */
  has (key) {
    return typeMapHas(this, key)
  }

  /**
   * Removes all elements from this YMap.
   */
  clear () {
    if (this.doc !== null) {
      transact(this.doc, transaction => {
        this.forEach(function (value, key, map) {
          typeMapDelete(transaction, map, key);
        });
      });
    } else {
      /** @type {Map<string, any>} */ (this._prelimContent).clear();
    }
  }

  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write (encoder) {
    encoder.writeTypeRef(YMapRefID);
  }
}

/**
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 *
 * @private
 * @function
 */
const readYMap = decoder => new YMap();

/**
 * @param {any} a
 * @param {any} b
 * @return {boolean}
 */
const equalAttrs = (a, b) => a === b || (typeof a === 'object' && typeof b === 'object' && a && b && object__namespace.equalFlat(a, b));

class ItemTextListPosition {
  /**
   * @param {Item|null} left
   * @param {Item|null} right
   * @param {number} index
   * @param {Map<string,any>} currentAttributes
   */
  constructor (left, right, index, currentAttributes) {
    this.left = left;
    this.right = right;
    this.index = index;
    this.currentAttributes = currentAttributes;
  }

  /**
   * Only call this if you know that this.right is defined
   */
  forward () {
    if (this.right === null) {
      error__namespace.unexpectedCase();
    }
    switch (this.right.content.constructor) {
      case ContentFormat:
        if (!this.right.deleted) {
          updateCurrentAttributes(this.currentAttributes, /** @type {ContentFormat} */ (this.right.content));
        }
        break
      default:
        if (!this.right.deleted) {
          this.index += this.right.length;
        }
        break
    }
    this.left = this.right;
    this.right = this.right.right;
  }
}

/**
 * @param {Transaction} transaction
 * @param {ItemTextListPosition} pos
 * @param {number} count steps to move forward
 * @return {ItemTextListPosition}
 *
 * @private
 * @function
 */
const findNextPosition = (transaction, pos, count) => {
  while (pos.right !== null && count > 0) {
    switch (pos.right.content.constructor) {
      case ContentFormat:
        if (!pos.right.deleted) {
          updateCurrentAttributes(pos.currentAttributes, /** @type {ContentFormat} */ (pos.right.content));
        }
        break
      default:
        if (!pos.right.deleted) {
          if (count < pos.right.length) {
            // split right
            getItemCleanStart(transaction, createID(pos.right.id.client, pos.right.id.clock + count));
          }
          pos.index += pos.right.length;
          count -= pos.right.length;
        }
        break
    }
    pos.left = pos.right;
    pos.right = pos.right.right;
    // pos.forward() - we don't forward because that would halve the performance because we already do the checks above
  }
  return pos
};

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {number} index
 * @return {ItemTextListPosition}
 *
 * @private
 * @function
 */
const findPosition = (transaction, parent, index) => {
  const currentAttributes = new Map();
  const marker = findMarker(parent, index);
  if (marker) {
    const pos = new ItemTextListPosition(marker.p.left, marker.p, marker.index, currentAttributes);
    return findNextPosition(transaction, pos, index - marker.index)
  } else {
    const pos = new ItemTextListPosition(null, parent._start, 0, currentAttributes);
    return findNextPosition(transaction, pos, index)
  }
};

/**
 * Negate applied formats
 *
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {ItemTextListPosition} currPos
 * @param {Map<string,any>} negatedAttributes
 *
 * @private
 * @function
 */
const insertNegatedAttributes = (transaction, parent, currPos, negatedAttributes) => {
  // check if we really need to remove attributes
  while (
    currPos.right !== null && (
      currPos.right.deleted === true || (
        currPos.right.content.constructor === ContentFormat &&
        equalAttrs(negatedAttributes.get(/** @type {ContentFormat} */ (currPos.right.content).key), /** @type {ContentFormat} */ (currPos.right.content).value)
      )
    )
  ) {
    if (!currPos.right.deleted) {
      negatedAttributes.delete(/** @type {ContentFormat} */ (currPos.right.content).key);
    }
    currPos.forward();
  }
  const doc = transaction.doc;
  const ownClientId = doc.clientID;
  negatedAttributes.forEach((val, key) => {
    const left = currPos.left;
    const right = currPos.right;
    const nextFormat = new Item(createID(ownClientId, getState(doc.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentFormat(key, val));
    nextFormat.integrate(transaction, 0);
    currPos.right = nextFormat;
    currPos.forward();
  });
};

/**
 * @param {Map<string,any>} currentAttributes
 * @param {ContentFormat} format
 *
 * @private
 * @function
 */
const updateCurrentAttributes = (currentAttributes, format) => {
  const { key, value } = format;
  if (value === null) {
    currentAttributes.delete(key);
  } else {
    currentAttributes.set(key, value);
  }
};

/**
 * @param {ItemTextListPosition} currPos
 * @param {Object<string,any>} attributes
 *
 * @private
 * @function
 */
const minimizeAttributeChanges = (currPos, attributes) => {
  // go right while attributes[right.key] === right.value (or right is deleted)
  while (true) {
    if (currPos.right === null) {
      break
    } else if (currPos.right.deleted || (currPos.right.content.constructor === ContentFormat && equalAttrs(attributes[(/** @type {ContentFormat} */ (currPos.right.content)).key] || null, /** @type {ContentFormat} */ (currPos.right.content).value))) ; else {
      break
    }
    currPos.forward();
  }
};

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {ItemTextListPosition} currPos
 * @param {Object<string,any>} attributes
 * @return {Map<string,any>}
 *
 * @private
 * @function
 **/
const insertAttributes = (transaction, parent, currPos, attributes) => {
  const doc = transaction.doc;
  const ownClientId = doc.clientID;
  const negatedAttributes = new Map();
  // insert format-start items
  for (const key in attributes) {
    const val = attributes[key];
    const currentVal = currPos.currentAttributes.get(key) || null;
    if (!equalAttrs(currentVal, val)) {
      // save negated attribute (set null if currentVal undefined)
      negatedAttributes.set(key, currentVal);
      const { left, right } = currPos;
      currPos.right = new Item(createID(ownClientId, getState(doc.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentFormat(key, val));
      currPos.right.integrate(transaction, 0);
      currPos.forward();
    }
  }
  return negatedAttributes
};

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {ItemTextListPosition} currPos
 * @param {string|object|AbstractType<any>} text
 * @param {Object<string,any>} attributes
 *
 * @private
 * @function
 **/
const insertText = (transaction, parent, currPos, text, attributes) => {
  currPos.currentAttributes.forEach((val, key) => {
    if (attributes[key] === undefined) {
      attributes[key] = null;
    }
  });
  const doc = transaction.doc;
  const ownClientId = doc.clientID;
  minimizeAttributeChanges(currPos, attributes);
  const negatedAttributes = insertAttributes(transaction, parent, currPos, attributes);
  // insert content
  const content = text.constructor === String ? new ContentString(/** @type {string} */ (text)) : (text instanceof AbstractType ? new ContentType(text) : new ContentEmbed(text));
  let { left, right, index } = currPos;
  if (parent._searchMarker) {
    updateMarkerChanges(parent._searchMarker, currPos.index, content.getLength());
  }
  right = new Item(createID(ownClientId, getState(doc.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, content);
  right.integrate(transaction, 0);
  currPos.right = right;
  currPos.index = index;
  currPos.forward();
  insertNegatedAttributes(transaction, parent, currPos, negatedAttributes);
};

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {ItemTextListPosition} currPos
 * @param {number} length
 * @param {Object<string,any>} attributes
 *
 * @private
 * @function
 */
const formatText = (transaction, parent, currPos, length, attributes) => {
  const doc = transaction.doc;
  const ownClientId = doc.clientID;
  minimizeAttributeChanges(currPos, attributes);
  const negatedAttributes = insertAttributes(transaction, parent, currPos, attributes);
  // iterate until first non-format or null is found
  // delete all formats with attributes[format.key] != null
  while (length > 0 && currPos.right !== null) {
    if (!currPos.right.deleted) {
      switch (currPos.right.content.constructor) {
        case ContentFormat: {
          const { key, value } = /** @type {ContentFormat} */ (currPos.right.content);
          const attr = attributes[key];
          if (attr !== undefined) {
            if (equalAttrs(attr, value)) {
              negatedAttributes.delete(key);
            } else {
              negatedAttributes.set(key, value);
            }
            currPos.right.delete(transaction);
          }
          break
        }
        default:
          if (length < currPos.right.length) {
            getItemCleanStart(transaction, createID(currPos.right.id.client, currPos.right.id.clock + length));
          }
          length -= currPos.right.length;
          break
      }
    }
    currPos.forward();
  }
  // Quill just assumes that the editor starts with a newline and that it always
  // ends with a newline. We only insert that newline when a new newline is
  // inserted - i.e when length is bigger than type.length
  if (length > 0) {
    let newlines = '';
    for (; length > 0; length--) {
      newlines += '\n';
    }
    currPos.right = new Item(createID(ownClientId, getState(doc.store, ownClientId)), currPos.left, currPos.left && currPos.left.lastId, currPos.right, currPos.right && currPos.right.id, parent, null, new ContentString(newlines));
    currPos.right.integrate(transaction, 0);
    currPos.forward();
  }
  insertNegatedAttributes(transaction, parent, currPos, negatedAttributes);
};

/**
 * Call this function after string content has been deleted in order to
 * clean up formatting Items.
 *
 * @param {Transaction} transaction
 * @param {Item} start
 * @param {Item|null} end exclusive end, automatically iterates to the next Content Item
 * @param {Map<string,any>} startAttributes
 * @param {Map<string,any>} endAttributes This attribute is modified!
 * @return {number} The amount of formatting Items deleted.
 *
 * @function
 */
const cleanupFormattingGap = (transaction, start, end, startAttributes, endAttributes) => {
  while (end && (!end.countable || end.deleted)) {
    if (!end.deleted && end.content.constructor === ContentFormat) {
      updateCurrentAttributes(endAttributes, /** @type {ContentFormat} */ (end.content));
    }
    end = end.right;
  }
  let cleanups = 0;
  while (start !== end) {
    if (!start.deleted) {
      const content = start.content;
      switch (content.constructor) {
        case ContentFormat: {
          const { key, value } = /** @type {ContentFormat} */ (content);
          if ((endAttributes.get(key) || null) !== value || (startAttributes.get(key) || null) === value) {
            // Either this format is overwritten or it is not necessary because the attribute already existed.
            start.delete(transaction);
            cleanups++;
          }
          break
        }
      }
    }
    start = /** @type {Item} */ (start.right);
  }
  return cleanups
};

/**
 * @param {Transaction} transaction
 * @param {Item | null} item
 */
const cleanupContextlessFormattingGap = (transaction, item) => {
  // iterate until item.right is null or content
  while (item && item.right && (item.right.deleted || !item.right.countable)) {
    item = item.right;
  }
  const attrs = new Set();
  // iterate back until a content item is found
  while (item && (item.deleted || !item.countable)) {
    if (!item.deleted && item.content.constructor === ContentFormat) {
      const key = /** @type {ContentFormat} */ (item.content).key;
      if (attrs.has(key)) {
        item.delete(transaction);
      } else {
        attrs.add(key);
      }
    }
    item = item.left;
  }
};

/**
 * This function is experimental and subject to change / be removed.
 *
 * Ideally, we don't need this function at all. Formatting attributes should be cleaned up
 * automatically after each change. This function iterates twice over the complete YText type
 * and removes unnecessary formatting attributes. This is also helpful for testing.
 *
 * This function won't be exported anymore as soon as there is confidence that the YText type works as intended.
 *
 * @param {YText} type
 * @return {number} How many formatting attributes have been cleaned up.
 */
const cleanupYTextFormatting = type => {
  let res = 0;
  transact(/** @type {Doc} */ (type.doc), transaction => {
    let start = /** @type {Item} */ (type._start);
    let end = type._start;
    let startAttributes = map__namespace.create();
    const currentAttributes = map__namespace.copy(startAttributes);
    while (end) {
      if (end.deleted === false) {
        switch (end.content.constructor) {
          case ContentFormat:
            updateCurrentAttributes(currentAttributes, /** @type {ContentFormat} */ (end.content));
            break
          default:
            res += cleanupFormattingGap(transaction, start, end, startAttributes, currentAttributes);
            startAttributes = map__namespace.copy(currentAttributes);
            start = end;
            break
        }
      }
      end = end.right;
    }
  });
  return res
};

/**
 * @param {Transaction} transaction
 * @param {ItemTextListPosition} currPos
 * @param {number} length
 * @return {ItemTextListPosition}
 *
 * @private
 * @function
 */
const deleteText = (transaction, currPos, length) => {
  const startLength = length;
  const startAttrs = map__namespace.copy(currPos.currentAttributes);
  const start = currPos.right;
  while (length > 0 && currPos.right !== null) {
    if (currPos.right.deleted === false) {
      switch (currPos.right.content.constructor) {
        case ContentType:
        case ContentEmbed:
        case ContentString:
          if (length < currPos.right.length) {
            getItemCleanStart(transaction, createID(currPos.right.id.client, currPos.right.id.clock + length));
          }
          length -= currPos.right.length;
          currPos.right.delete(transaction);
          break
      }
    }
    currPos.forward();
  }
  if (start) {
    cleanupFormattingGap(transaction, start, currPos.right, startAttrs, map__namespace.copy(currPos.currentAttributes));
  }
  const parent = /** @type {AbstractType<any>} */ (/** @type {Item} */ (currPos.left || currPos.right).parent);
  if (parent._searchMarker) {
    updateMarkerChanges(parent._searchMarker, currPos.index, -startLength + length);
  }
  return currPos
};

/**
 * The Quill Delta format represents changes on a text document with
 * formatting information. For mor information visit {@link https://quilljs.com/docs/delta/|Quill Delta}
 *
 * @example
 *   {
 *     ops: [
 *       { insert: 'Gandalf', attributes: { bold: true } },
 *       { insert: ' the ' },
 *       { insert: 'Grey', attributes: { color: '#cccccc' } }
 *     ]
 *   }
 *
 */

/**
  * Attributes that can be assigned to a selection of text.
  *
  * @example
  *   {
  *     bold: true,
  *     font-size: '40px'
  *   }
  *
  * @typedef {Object} TextAttributes
  */

/**
 * Event that describes the changes on a YText type.
 */
class YTextEvent extends YEvent {
  /**
   * @param {YText} ytext
   * @param {Transaction} transaction
   * @param {Set<any>} subs The keys that changed
   */
  constructor (ytext, transaction, subs) {
    super(ytext, transaction);
    /**
     * Whether the children changed.
     * @type {Boolean}
     * @private
     */
    this.childListChanged = false;
    /**
     * Set of all changed attributes.
     * @type {Set<string>}
     */
    this.keysChanged = new Set();
    subs.forEach((sub) => {
      if (sub === null) {
        this.childListChanged = true;
      } else {
        this.keysChanged.add(sub);
      }
    });
  }

  /**
   * @type {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert?:Array<any>|string, delete?:number, retain?:number}>}}
   */
  get changes () {
    if (this._changes === null) {
      /**
       * @type {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert?:Array<any>|string|AbstractType<any>|object, delete?:number, retain?:number}>}}
       */
      const changes = {
        keys: this.keys,
        delta: this.delta,
        added: new Set(),
        deleted: new Set()
      };
      this._changes = changes;
    }
    return /** @type {any} */ (this._changes)
  }

  /**
   * Compute the changes in the delta format.
   * A {@link https://quilljs.com/docs/delta/|Quill Delta}) that represents the changes on the document.
   *
   * @type {Array<{insert?:string|object|AbstractType<any>, delete?:number, retain?:number, attributes?: Object<string,any>}>}
   *
   * @public
   */
  get delta () {
    if (this._delta === null) {
      const y = /** @type {Doc} */ (this.target.doc);
      /**
       * @type {Array<{insert?:string|object|AbstractType<any>, delete?:number, retain?:number, attributes?: Object<string,any>}>}
       */
      const delta = [];
      transact(y, transaction => {
        const currentAttributes = new Map(); // saves all current attributes for insert
        const oldAttributes = new Map();
        let item = this.target._start;
        /**
         * @type {string?}
         */
        let action = null;
        /**
         * @type {Object<string,any>}
         */
        const attributes = {}; // counts added or removed new attributes for retain
        /**
         * @type {string|object}
         */
        let insert = '';
        let retain = 0;
        let deleteLen = 0;
        const addOp = () => {
          if (action !== null) {
            /**
             * @type {any}
             */
            let op;
            switch (action) {
              case 'delete':
                op = { delete: deleteLen };
                deleteLen = 0;
                break
              case 'insert':
                op = { insert };
                if (currentAttributes.size > 0) {
                  op.attributes = {};
                  currentAttributes.forEach((value, key) => {
                    if (value !== null) {
                      op.attributes[key] = value;
                    }
                  });
                }
                insert = '';
                break
              case 'retain':
                op = { retain };
                if (Object.keys(attributes).length > 0) {
                  op.attributes = {};
                  for (const key in attributes) {
                    op.attributes[key] = attributes[key];
                  }
                }
                retain = 0;
                break
            }
            delta.push(op);
            action = null;
          }
        };
        while (item !== null) {
          switch (item.content.constructor) {
            case ContentType:
            case ContentEmbed:
              if (this.adds(item)) {
                if (!this.deletes(item)) {
                  addOp();
                  action = 'insert';
                  insert = item.content.getContent()[0];
                  addOp();
                }
              } else if (this.deletes(item)) {
                if (action !== 'delete') {
                  addOp();
                  action = 'delete';
                }
                deleteLen += 1;
              } else if (!item.deleted) {
                if (action !== 'retain') {
                  addOp();
                  action = 'retain';
                }
                retain += 1;
              }
              break
            case ContentString:
              if (this.adds(item)) {
                if (!this.deletes(item)) {
                  if (action !== 'insert') {
                    addOp();
                    action = 'insert';
                  }
                  insert += /** @type {ContentString} */ (item.content).str;
                }
              } else if (this.deletes(item)) {
                if (action !== 'delete') {
                  addOp();
                  action = 'delete';
                }
                deleteLen += item.length;
              } else if (!item.deleted) {
                if (action !== 'retain') {
                  addOp();
                  action = 'retain';
                }
                retain += item.length;
              }
              break
            case ContentFormat: {
              const { key, value } = /** @type {ContentFormat} */ (item.content);
              if (this.adds(item)) {
                if (!this.deletes(item)) {
                  const curVal = currentAttributes.get(key) || null;
                  if (!equalAttrs(curVal, value)) {
                    if (action === 'retain') {
                      addOp();
                    }
                    if (equalAttrs(value, (oldAttributes.get(key) || null))) {
                      delete attributes[key];
                    } else {
                      attributes[key] = value;
                    }
                  } else {
                    item.delete(transaction);
                  }
                }
              } else if (this.deletes(item)) {
                oldAttributes.set(key, value);
                const curVal = currentAttributes.get(key) || null;
                if (!equalAttrs(curVal, value)) {
                  if (action === 'retain') {
                    addOp();
                  }
                  attributes[key] = curVal;
                }
              } else if (!item.deleted) {
                oldAttributes.set(key, value);
                const attr = attributes[key];
                if (attr !== undefined) {
                  if (!equalAttrs(attr, value)) {
                    if (action === 'retain') {
                      addOp();
                    }
                    if (value === null) {
                      delete attributes[key];
                    } else {
                      attributes[key] = value;
                    }
                  } else {
                    item.delete(transaction);
                  }
                }
              }
              if (!item.deleted) {
                if (action === 'insert') {
                  addOp();
                }
                updateCurrentAttributes(currentAttributes, /** @type {ContentFormat} */ (item.content));
              }
              break
            }
          }
          item = item.right;
        }
        addOp();
        while (delta.length > 0) {
          const lastOp = delta[delta.length - 1];
          if (lastOp.retain !== undefined && lastOp.attributes === undefined) {
            // retain delta's if they don't assign attributes
            delta.pop();
          } else {
            break
          }
        }
      });
      this._delta = delta;
    }
    return /** @type {any} */ (this._delta)
  }
}

/**
 * Type that represents text with formatting information.
 *
 * This type replaces y-richtext as this implementation is able to handle
 * block formats (format information on a paragraph), embeds (complex elements
 * like pictures and videos), and text formats (**bold**, *italic*).
 *
 * @extends AbstractType<YTextEvent>
 */
class YText extends AbstractType {
  /**
   * @param {String} [string] The initial value of the YText.
   */
  constructor (string) {
    super();
    /**
     * Array of pending operations on this type
     * @type {Array<function():void>?}
     */
    this._pending = string !== undefined ? [() => this.insert(0, string)] : [];
    /**
     * @type {Array<ArraySearchMarker>}
     */
    this._searchMarker = [];
  }

  /**
   * Number of characters of this text type.
   *
   * @type {number}
   */
  get length () {
    return this._length
  }

  /**
   * @param {Doc} y
   * @param {Item} item
   */
  _integrate (y, item) {
    super._integrate(y, item);
    try {
      /** @type {Array<function>} */ (this._pending).forEach(f => f());
    } catch (e) {
      console.error(e);
    }
    this._pending = null;
  }

  _copy () {
    return new YText()
  }

  /**
   * @return {YText}
   */
  clone () {
    const text = new YText();
    text.applyDelta(this.toDelta());
    return text
  }

  /**
   * Creates YTextEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver (transaction, parentSubs) {
    super._callObserver(transaction, parentSubs);
    const event = new YTextEvent(this, transaction, parentSubs);
    const doc = transaction.doc;
    callTypeObservers(this, transaction, event);
    // If a remote change happened, we try to cleanup potential formatting duplicates.
    if (!transaction.local) {
      // check if another formatting item was inserted
      let foundFormattingItem = false;
      for (const [client, afterClock] of transaction.afterState.entries()) {
        const clock = transaction.beforeState.get(client) || 0;
        if (afterClock === clock) {
          continue
        }
        iterateStructs(transaction, /** @type {Array<Item|GC>} */ (doc.store.clients.get(client)), clock, afterClock, item => {
          if (!item.deleted && /** @type {Item} */ (item).content.constructor === ContentFormat) {
            foundFormattingItem = true;
          }
        });
        if (foundFormattingItem) {
          break
        }
      }
      if (!foundFormattingItem) {
        iterateDeletedStructs(transaction, transaction.deleteSet, item => {
          if (item instanceof GC || foundFormattingItem) {
            return
          }
          if (item.parent === this && item.content.constructor === ContentFormat) {
            foundFormattingItem = true;
          }
        });
      }
      transact(doc, (t) => {
        if (foundFormattingItem) {
          // If a formatting item was inserted, we simply clean the whole type.
          // We need to compute currentAttributes for the current position anyway.
          cleanupYTextFormatting(this);
        } else {
          // If no formatting attribute was inserted, we can make due with contextless
          // formatting cleanups.
          // Contextless: it is not necessary to compute currentAttributes for the affected position.
          iterateDeletedStructs(t, t.deleteSet, item => {
            if (item instanceof GC) {
              return
            }
            if (item.parent === this) {
              cleanupContextlessFormattingGap(t, item);
            }
          });
        }
      });
    }
  }

  /**
   * Returns the unformatted string representation of this YText type.
   *
   * @public
   */
  toString () {
    let str = '';
    /**
     * @type {Item|null}
     */
    let n = this._start;
    while (n !== null) {
      if (!n.deleted && n.countable && n.content.constructor === ContentString) {
        str += /** @type {ContentString} */ (n.content).str;
      }
      n = n.right;
    }
    return str
  }

  /**
   * Returns the unformatted string representation of this YText type.
   *
   * @return {string}
   * @public
   */
  toJSON () {
    return this.toString()
  }

  /**
   * Apply a {@link Delta} on this shared YText type.
   *
   * @param {any} delta The changes to apply on this element.
   * @param {object}  [opts]
   * @param {boolean} [opts.sanitize] Sanitize input delta. Removes ending newlines if set to true.
   *
   *
   * @public
   */
  applyDelta (delta, { sanitize = true } = {}) {
    if (this.doc !== null) {
      transact(this.doc, transaction => {
        const currPos = new ItemTextListPosition(null, this._start, 0, new Map());
        for (let i = 0; i < delta.length; i++) {
          const op = delta[i];
          if (op.insert !== undefined) {
            // Quill assumes that the content starts with an empty paragraph.
            // Yjs/Y.Text assumes that it starts empty. We always hide that
            // there is a newline at the end of the content.
            // If we omit this step, clients will see a different number of
            // paragraphs, but nothing bad will happen.
            const ins = (!sanitize && typeof op.insert === 'string' && i === delta.length - 1 && currPos.right === null && op.insert.slice(-1) === '\n') ? op.insert.slice(0, -1) : op.insert;
            if (typeof ins !== 'string' || ins.length > 0) {
              insertText(transaction, this, currPos, ins, op.attributes || {});
            }
          } else if (op.retain !== undefined) {
            formatText(transaction, this, currPos, op.retain, op.attributes || {});
          } else if (op.delete !== undefined) {
            deleteText(transaction, currPos, op.delete);
          }
        }
      });
    } else {
      /** @type {Array<function>} */ (this._pending).push(() => this.applyDelta(delta));
    }
  }

  /**
   * Returns the Delta representation of this YText type.
   *
   * @param {Snapshot} [snapshot]
   * @param {Snapshot} [prevSnapshot]
   * @param {function('removed' | 'added', ID):any} [computeYChange]
   * @return {any} The Delta representation of this type.
   *
   * @public
   */
  toDelta (snapshot, prevSnapshot, computeYChange) {
    /**
     * @type{Array<any>}
     */
    const ops = [];
    const currentAttributes = new Map();
    const doc = /** @type {Doc} */ (this.doc);
    let str = '';
    let n = this._start;
    function packStr () {
      if (str.length > 0) {
        // pack str with attributes to ops
        /**
         * @type {Object<string,any>}
         */
        const attributes = {};
        let addAttributes = false;
        currentAttributes.forEach((value, key) => {
          addAttributes = true;
          attributes[key] = value;
        });
        /**
         * @type {Object<string,any>}
         */
        const op = { insert: str };
        if (addAttributes) {
          op.attributes = attributes;
        }
        ops.push(op);
        str = '';
      }
    }
    // snapshots are merged again after the transaction, so we need to keep the
    // transalive until we are done
    transact(doc, transaction => {
      if (snapshot) {
        splitSnapshotAffectedStructs(transaction, snapshot);
      }
      if (prevSnapshot) {
        splitSnapshotAffectedStructs(transaction, prevSnapshot);
      }
      while (n !== null) {
        if (isVisible(n, snapshot) || (prevSnapshot !== undefined && isVisible(n, prevSnapshot))) {
          switch (n.content.constructor) {
            case ContentString: {
              const cur = currentAttributes.get('ychange');
              if (snapshot !== undefined && !isVisible(n, snapshot)) {
                if (cur === undefined || cur.user !== n.id.client || cur.state !== 'removed') {
                  packStr();
                  currentAttributes.set('ychange', computeYChange ? computeYChange('removed', n.id) : { type: 'removed' });
                }
              } else if (prevSnapshot !== undefined && !isVisible(n, prevSnapshot)) {
                if (cur === undefined || cur.user !== n.id.client || cur.state !== 'added') {
                  packStr();
                  currentAttributes.set('ychange', computeYChange ? computeYChange('added', n.id) : { type: 'added' });
                }
              } else if (cur !== undefined) {
                packStr();
                currentAttributes.delete('ychange');
              }
              str += /** @type {ContentString} */ (n.content).str;
              break
            }
            case ContentType:
            case ContentEmbed: {
              packStr();
              /**
               * @type {Object<string,any>}
               */
              const op = {
                insert: n.content.getContent()[0]
              };
              if (currentAttributes.size > 0) {
                const attrs = /** @type {Object<string,any>} */ ({});
                op.attributes = attrs;
                currentAttributes.forEach((value, key) => {
                  attrs[key] = value;
                });
              }
              ops.push(op);
              break
            }
            case ContentFormat:
              if (isVisible(n, snapshot)) {
                packStr();
                updateCurrentAttributes(currentAttributes, /** @type {ContentFormat} */ (n.content));
              }
              break
          }
        }
        n = n.right;
      }
      packStr();
    }, splitSnapshotAffectedStructs);
    return ops
  }

  /**
   * Insert text at a given index.
   *
   * @param {number} index The index at which to start inserting.
   * @param {String} text The text to insert at the specified position.
   * @param {TextAttributes} [attributes] Optionally define some formatting
   *                                    information to apply on the inserted
   *                                    Text.
   * @public
   */
  insert (index, text, attributes) {
    if (text.length <= 0) {
      return
    }
    const y = this.doc;
    if (y !== null) {
      transact(y, transaction => {
        const pos = findPosition(transaction, this, index);
        if (!attributes) {
          attributes = {};
          // @ts-ignore
          pos.currentAttributes.forEach((v, k) => { attributes[k] = v; });
        }
        insertText(transaction, this, pos, text, attributes);
      });
    } else {
      /** @type {Array<function>} */ (this._pending).push(() => this.insert(index, text, attributes));
    }
  }

  /**
   * Inserts an embed at a index.
   *
   * @param {number} index The index to insert the embed at.
   * @param {Object | AbstractType<any>} embed The Object that represents the embed.
   * @param {TextAttributes} attributes Attribute information to apply on the
   *                                    embed
   *
   * @public
   */
  insertEmbed (index, embed, attributes = {}) {
    const y = this.doc;
    if (y !== null) {
      transact(y, transaction => {
        const pos = findPosition(transaction, this, index);
        insertText(transaction, this, pos, embed, attributes);
      });
    } else {
      /** @type {Array<function>} */ (this._pending).push(() => this.insertEmbed(index, embed, attributes));
    }
  }

  /**
   * Deletes text starting from an index.
   *
   * @param {number} index Index at which to start deleting.
   * @param {number} length The number of characters to remove. Defaults to 1.
   *
   * @public
   */
  delete (index, length) {
    if (length === 0) {
      return
    }
    const y = this.doc;
    if (y !== null) {
      transact(y, transaction => {
        deleteText(transaction, findPosition(transaction, this, index), length);
      });
    } else {
      /** @type {Array<function>} */ (this._pending).push(() => this.delete(index, length));
    }
  }

  /**
   * Assigns properties to a range of text.
   *
   * @param {number} index The position where to start formatting.
   * @param {number} length The amount of characters to assign properties to.
   * @param {TextAttributes} attributes Attribute information to apply on the
   *                                    text.
   *
   * @public
   */
  format (index, length, attributes) {
    if (length === 0) {
      return
    }
    const y = this.doc;
    if (y !== null) {
      transact(y, transaction => {
        const pos = findPosition(transaction, this, index);
        if (pos.right === null) {
          return
        }
        formatText(transaction, this, pos, length, attributes);
      });
    } else {
      /** @type {Array<function>} */ (this._pending).push(() => this.format(index, length, attributes));
    }
  }

  /**
   * Removes an attribute.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that is to be removed.
   *
   * @public
   */
  removeAttribute (attributeName) {
    if (this.doc !== null) {
      transact(this.doc, transaction => {
        typeMapDelete(transaction, this, attributeName);
      });
    } else {
      /** @type {Array<function>} */ (this._pending).push(() => this.removeAttribute(attributeName));
    }
  }

  /**
   * Sets or updates an attribute.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that is to be set.
   * @param {any} attributeValue The attribute value that is to be set.
   *
   * @public
   */
  setAttribute (attributeName, attributeValue) {
    if (this.doc !== null) {
      transact(this.doc, transaction => {
        typeMapSet(transaction, this, attributeName, attributeValue);
      });
    } else {
      /** @type {Array<function>} */ (this._pending).push(() => this.setAttribute(attributeName, attributeValue));
    }
  }

  /**
   * Returns an attribute value that belongs to the attribute name.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that identifies the
   *                               queried value.
   * @return {any} The queried attribute value.
   *
   * @public
   */
  getAttribute (attributeName) {
    return /** @type {any} */ (typeMapGet(this, attributeName))
  }

  /**
   * Returns all attribute name/value pairs in a JSON Object.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {Snapshot} [snapshot]
   * @return {Object<string, any>} A JSON Object that describes the attributes.
   *
   * @public
   */
  getAttributes (snapshot) {
    return typeMapGetAll(this)
  }

  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write (encoder) {
    encoder.writeTypeRef(YTextRefID);
  }
}

/**
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 * @return {YText}
 *
 * @private
 * @function
 */
const readYText = decoder => new YText();

/**
 * @module YXml
 */

/**
 * Define the elements to which a set of CSS queries apply.
 * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors|CSS_Selectors}
 *
 * @example
 *   query = '.classSelector'
 *   query = 'nodeSelector'
 *   query = '#idSelector'
 *
 * @typedef {string} CSS_Selector
 */

/**
 * Dom filter function.
 *
 * @callback domFilter
 * @param {string} nodeName The nodeName of the element
 * @param {Map} attributes The map of attributes.
 * @return {boolean} Whether to include the Dom node in the YXmlElement.
 */

/**
 * Represents a subset of the nodes of a YXmlElement / YXmlFragment and a
 * position within them.
 *
 * Can be created with {@link YXmlFragment#createTreeWalker}
 *
 * @public
 * @implements {Iterable<YXmlElement|YXmlText|YXmlElement|YXmlHook>}
 */
class YXmlTreeWalker {
  /**
   * @param {YXmlFragment | YXmlElement} root
   * @param {function(AbstractType<any>):boolean} [f]
   */
  constructor (root, f = () => true) {
    this._filter = f;
    this._root = root;
    /**
     * @type {Item}
     */
    this._currentNode = /** @type {Item} */ (root._start);
    this._firstCall = true;
  }

  [Symbol.iterator] () {
    return this
  }

  /**
   * Get the next node.
   *
   * @return {IteratorResult<YXmlElement|YXmlText|YXmlHook>} The next node.
   *
   * @public
   */
  next () {
    /**
     * @type {Item|null}
     */
    let n = this._currentNode;
    let type = n && n.content && /** @type {any} */ (n.content).type;
    if (n !== null && (!this._firstCall || n.deleted || !this._filter(type))) { // if first call, we check if we can use the first item
      do {
        type = /** @type {any} */ (n.content).type;
        if (!n.deleted && (type.constructor === YXmlElement || type.constructor === YXmlFragment) && type._start !== null) {
          // walk down in the tree
          n = type._start;
        } else {
          // walk right or up in the tree
          while (n !== null) {
            if (n.right !== null) {
              n = n.right;
              break
            } else if (n.parent === this._root) {
              n = null;
            } else {
              n = /** @type {AbstractType<any>} */ (n.parent)._item;
            }
          }
        }
      } while (n !== null && (n.deleted || !this._filter(/** @type {ContentType} */ (n.content).type)))
    }
    this._firstCall = false;
    if (n === null) {
      // @ts-ignore
      return { value: undefined, done: true }
    }
    this._currentNode = n;
    return { value: /** @type {any} */ (n.content).type, done: false }
  }
}

/**
 * Represents a list of {@link YXmlElement}.and {@link YXmlText} types.
 * A YxmlFragment is similar to a {@link YXmlElement}, but it does not have a
 * nodeName and it does not have attributes. Though it can be bound to a DOM
 * element - in this case the attributes and the nodeName are not shared.
 *
 * @public
 * @extends AbstractType<YXmlEvent>
 */
class YXmlFragment extends AbstractType {
  constructor () {
    super();
    /**
     * @type {Array<any>|null}
     */
    this._prelimContent = [];
  }

  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get firstChild () {
    const first = this._first;
    return first ? first.content.getContent()[0] : null
  }

  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate (y, item) {
    super._integrate(y, item);
    this.insert(0, /** @type {Array<any>} */ (this._prelimContent));
    this._prelimContent = null;
  }

  _copy () {
    return new YXmlFragment()
  }

  /**
   * @return {YXmlFragment}
   */
  clone () {
    const el = new YXmlFragment();
    // @ts-ignore
    el.insert(0, this.toArray().map(item => item instanceof AbstractType ? item.clone() : item));
    return el
  }

  get length () {
    return this._prelimContent === null ? this._length : this._prelimContent.length
  }

  /**
   * Create a subtree of childNodes.
   *
   * @example
   * const walker = elem.createTreeWalker(dom => dom.nodeName === 'div')
   * for (let node in walker) {
   *   // `node` is a div node
   *   nop(node)
   * }
   *
   * @param {function(AbstractType<any>):boolean} filter Function that is called on each child element and
   *                          returns a Boolean indicating whether the child
   *                          is to be included in the subtree.
   * @return {YXmlTreeWalker} A subtree and a position within it.
   *
   * @public
   */
  createTreeWalker (filter) {
    return new YXmlTreeWalker(this, filter)
  }

  /**
   * Returns the first YXmlElement that matches the query.
   * Similar to DOM's {@link querySelector}.
   *
   * Query support:
   *   - tagname
   * TODO:
   *   - id
   *   - attribute
   *
   * @param {CSS_Selector} query The query on the children.
   * @return {YXmlElement|YXmlText|YXmlHook|null} The first element that matches the query or null.
   *
   * @public
   */
  querySelector (query) {
    query = query.toUpperCase();
    // @ts-ignore
    const iterator = new YXmlTreeWalker(this, element => element.nodeName && element.nodeName.toUpperCase() === query);
    const next = iterator.next();
    if (next.done) {
      return null
    } else {
      return next.value
    }
  }

  /**
   * Returns all YXmlElements that match the query.
   * Similar to Dom's {@link querySelectorAll}.
   *
   * @todo Does not yet support all queries. Currently only query by tagName.
   *
   * @param {CSS_Selector} query The query on the children
   * @return {Array<YXmlElement|YXmlText|YXmlHook|null>} The elements that match this query.
   *
   * @public
   */
  querySelectorAll (query) {
    query = query.toUpperCase();
    // @ts-ignore
    return Array.from(new YXmlTreeWalker(this, element => element.nodeName && element.nodeName.toUpperCase() === query))
  }

  /**
   * Creates YXmlEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver (transaction, parentSubs) {
    callTypeObservers(this, transaction, new YXmlEvent(this, parentSubs, transaction));
  }

  /**
   * Get the string representation of all the children of this YXmlFragment.
   *
   * @return {string} The string representation of all children.
   */
  toString () {
    return typeListMap(this, xml => xml.toString()).join('')
  }

  /**
   * @return {string}
   */
  toJSON () {
    return this.toString()
  }

  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM (_document = document, hooks = {}, binding) {
    const fragment = _document.createDocumentFragment();
    if (binding !== undefined) {
      binding._createAssociation(fragment, this);
    }
    typeListForEach(this, xmlType => {
      fragment.insertBefore(xmlType.toDOM(_document, hooks, binding), null);
    });
    return fragment
  }

  /**
   * Inserts new content at an index.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  xml.insert(0, [new Y.XmlText('text')])
   *
   * @param {number} index The index to insert content at
   * @param {Array<YXmlElement|YXmlText>} content The array of content
   */
  insert (index, content) {
    if (this.doc !== null) {
      transact(this.doc, transaction => {
        typeListInsertGenerics(transaction, this, index, content);
      });
    } else {
      // @ts-ignore _prelimContent is defined because this is not yet integrated
      this._prelimContent.splice(index, 0, ...content);
    }
  }

  /**
   * Inserts new content at an index.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  xml.insert(0, [new Y.XmlText('text')])
   *
   * @param {null|Item|YXmlElement|YXmlText} ref The index to insert content at
   * @param {Array<YXmlElement|YXmlText>} content The array of content
   */
  insertAfter (ref, content) {
    if (this.doc !== null) {
      transact(this.doc, transaction => {
        const refItem = (ref && ref instanceof AbstractType) ? ref._item : ref;
        typeListInsertGenericsAfter(transaction, this, refItem, content);
      });
    } else {
      const pc = /** @type {Array<any>} */ (this._prelimContent);
      const index = ref === null ? 0 : pc.findIndex(el => el === ref) + 1;
      if (index === 0 && ref !== null) {
        throw error__namespace.create('Reference item not found')
      }
      pc.splice(index, 0, ...content);
    }
  }

  /**
   * Deletes elements starting from an index.
   *
   * @param {number} index Index at which to start deleting elements
   * @param {number} [length=1] The number of elements to remove. Defaults to 1.
   */
  delete (index, length = 1) {
    if (this.doc !== null) {
      transact(this.doc, transaction => {
        typeListDelete(transaction, this, index, length);
      });
    } else {
      // @ts-ignore _prelimContent is defined because this is not yet integrated
      this._prelimContent.splice(index, length);
    }
  }

  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @return {Array<YXmlElement|YXmlText|YXmlHook>}
   */
  toArray () {
    return typeListToArray(this)
  }

  /**
   * Appends content to this YArray.
   *
   * @param {Array<YXmlElement|YXmlText>} content Array of content to append.
   */
  push (content) {
    this.insert(this.length, content);
  }

  /**
   * Preppends content to this YArray.
   *
   * @param {Array<YXmlElement|YXmlText>} content Array of content to preppend.
   */
  unshift (content) {
    this.insert(0, content);
  }

  /**
   * Returns the i-th element from a YArray.
   *
   * @param {number} index The index of the element to return from the YArray
   * @return {YXmlElement|YXmlText}
   */
  get (index) {
    return typeListGet(this, index)
  }

  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @param {number} [start]
   * @param {number} [end]
   * @return {Array<YXmlElement|YXmlText>}
   */
  slice (start = 0, end = this.length) {
    return typeListSlice(this, start, end)
  }

  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   */
  _write (encoder) {
    encoder.writeTypeRef(YXmlFragmentRefID);
  }
}

/**
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 * @return {YXmlFragment}
 *
 * @private
 * @function
 */
const readYXmlFragment = decoder => new YXmlFragment();

/**
 * An YXmlElement imitates the behavior of a
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}.
 *
 * * An YXmlElement has attributes (key value pairs)
 * * An YXmlElement has childElements that must inherit from YXmlElement
 */
class YXmlElement extends YXmlFragment {
  constructor (nodeName = 'UNDEFINED') {
    super();
    this.nodeName = nodeName;
    /**
     * @type {Map<string, any>|null}
     */
    this._prelimAttrs = new Map();
  }

  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get nextSibling () {
    const n = this._item ? this._item.next : null;
    return n ? /** @type {YXmlElement|YXmlText} */ (/** @type {ContentType} */ (n.content).type) : null
  }

  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get prevSibling () {
    const n = this._item ? this._item.prev : null;
    return n ? /** @type {YXmlElement|YXmlText} */ (/** @type {ContentType} */ (n.content).type) : null
  }

  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate (y, item) {
    super._integrate(y, item)
    ;(/** @type {Map<string, any>} */ (this._prelimAttrs)).forEach((value, key) => {
      this.setAttribute(key, value);
    });
    this._prelimAttrs = null;
  }

  /**
   * Creates an Item with the same effect as this Item (without position effect)
   *
   * @return {YXmlElement}
   */
  _copy () {
    return new YXmlElement(this.nodeName)
  }

  /**
   * @return {YXmlElement}
   */
  clone () {
    const el = new YXmlElement(this.nodeName);
    const attrs = this.getAttributes();
    for (const key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
    // @ts-ignore
    el.insert(0, this.toArray().map(item => item instanceof AbstractType ? item.clone() : item));
    return el
  }

  /**
   * Returns the XML serialization of this YXmlElement.
   * The attributes are ordered by attribute-name, so you can easily use this
   * method to compare YXmlElements
   *
   * @return {string} The string representation of this type.
   *
   * @public
   */
  toString () {
    const attrs = this.getAttributes();
    const stringBuilder = [];
    const keys = [];
    for (const key in attrs) {
      keys.push(key);
    }
    keys.sort();
    const keysLen = keys.length;
    for (let i = 0; i < keysLen; i++) {
      const key = keys[i];
      stringBuilder.push(key + '="' + attrs[key] + '"');
    }
    const nodeName = this.nodeName.toLocaleLowerCase();
    const attrsString = stringBuilder.length > 0 ? ' ' + stringBuilder.join(' ') : '';
    return `<${nodeName}${attrsString}>${super.toString()}</${nodeName}>`
  }

  /**
   * Removes an attribute from this YXmlElement.
   *
   * @param {String} attributeName The attribute name that is to be removed.
   *
   * @public
   */
  removeAttribute (attributeName) {
    if (this.doc !== null) {
      transact(this.doc, transaction => {
        typeMapDelete(transaction, this, attributeName);
      });
    } else {
      /** @type {Map<string,any>} */ (this._prelimAttrs).delete(attributeName);
    }
  }

  /**
   * Sets or updates an attribute.
   *
   * @param {String} attributeName The attribute name that is to be set.
   * @param {String} attributeValue The attribute value that is to be set.
   *
   * @public
   */
  setAttribute (attributeName, attributeValue) {
    if (this.doc !== null) {
      transact(this.doc, transaction => {
        typeMapSet(transaction, this, attributeName, attributeValue);
      });
    } else {
      /** @type {Map<string, any>} */ (this._prelimAttrs).set(attributeName, attributeValue);
    }
  }

  /**
   * Returns an attribute value that belongs to the attribute name.
   *
   * @param {String} attributeName The attribute name that identifies the
   *                               queried value.
   * @return {String} The queried attribute value.
   *
   * @public
   */
  getAttribute (attributeName) {
    return /** @type {any} */ (typeMapGet(this, attributeName))
  }

  /**
   * Returns whether an attribute exists
   *
   * @param {String} attributeName The attribute name to check for existence.
   * @return {boolean} whether the attribute exists.
   *
   * @public
   */
  hasAttribute (attributeName) {
    return /** @type {any} */ (typeMapHas(this, attributeName))
  }

  /**
   * Returns all attribute name/value pairs in a JSON Object.
   *
   * @param {Snapshot} [snapshot]
   * @return {Object<string, any>} A JSON Object that describes the attributes.
   *
   * @public
   */
  getAttributes (snapshot) {
    return typeMapGetAll(this)
  }

  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM (_document = document, hooks = {}, binding) {
    const dom = _document.createElement(this.nodeName);
    const attrs = this.getAttributes();
    for (const key in attrs) {
      dom.setAttribute(key, attrs[key]);
    }
    typeListForEach(this, yxml => {
      dom.appendChild(yxml.toDOM(_document, hooks, binding));
    });
    if (binding !== undefined) {
      binding._createAssociation(dom, this);
    }
    return dom
  }

  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   */
  _write (encoder) {
    encoder.writeTypeRef(YXmlElementRefID);
    encoder.writeKey(this.nodeName);
  }
}

/**
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 * @return {YXmlElement}
 *
 * @function
 */
const readYXmlElement = decoder => new YXmlElement(decoder.readKey());

/**
 * An Event that describes changes on a YXml Element or Yxml Fragment
 */
class YXmlEvent extends YEvent {
  /**
   * @param {YXmlElement|YXmlText|YXmlFragment} target The target on which the event is created.
   * @param {Set<string|null>} subs The set of changed attributes. `null` is included if the
   *                   child list changed.
   * @param {Transaction} transaction The transaction instance with wich the
   *                                  change was created.
   */
  constructor (target, subs, transaction) {
    super(target, transaction);
    /**
     * Whether the children changed.
     * @type {Boolean}
     * @private
     */
    this.childListChanged = false;
    /**
     * Set of all changed attributes.
     * @type {Set<string>}
     */
    this.attributesChanged = new Set();
    subs.forEach((sub) => {
      if (sub === null) {
        this.childListChanged = true;
      } else {
        this.attributesChanged.add(sub);
      }
    });
  }
}

/**
 * You can manage binding to a custom type with YXmlHook.
 *
 * @extends {YMap<any>}
 */
class YXmlHook extends YMap {
  /**
   * @param {string} hookName nodeName of the Dom Node.
   */
  constructor (hookName) {
    super();
    /**
     * @type {string}
     */
    this.hookName = hookName;
  }

  /**
   * Creates an Item with the same effect as this Item (without position effect)
   */
  _copy () {
    return new YXmlHook(this.hookName)
  }

  /**
   * @return {YXmlHook}
   */
  clone () {
    const el = new YXmlHook(this.hookName);
    this.forEach((value, key) => {
      el.set(key, value);
    });
    return el
  }

  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object.<string, any>} [hooks] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type
   * @return {Element} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM (_document = document, hooks = {}, binding) {
    const hook = hooks[this.hookName];
    let dom;
    if (hook !== undefined) {
      dom = hook.createDom(this);
    } else {
      dom = document.createElement(this.hookName);
    }
    dom.setAttribute('data-yjs-hook', this.hookName);
    if (binding !== undefined) {
      binding._createAssociation(dom, this);
    }
    return dom
  }

  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   */
  _write (encoder) {
    encoder.writeTypeRef(YXmlHookRefID);
    encoder.writeKey(this.hookName);
  }
}

/**
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 * @return {YXmlHook}
 *
 * @private
 * @function
 */
const readYXmlHook = decoder =>
  new YXmlHook(decoder.readKey());

/**
 * Represents text in a Dom Element. In the future this type will also handle
 * simple formatting information like bold and italic.
 */
class YXmlText extends YText {
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get nextSibling () {
    const n = this._item ? this._item.next : null;
    return n ? /** @type {YXmlElement|YXmlText} */ (/** @type {ContentType} */ (n.content).type) : null
  }

  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get prevSibling () {
    const n = this._item ? this._item.prev : null;
    return n ? /** @type {YXmlElement|YXmlText} */ (/** @type {ContentType} */ (n.content).type) : null
  }

  _copy () {
    return new YXmlText()
  }

  /**
   * @return {YXmlText}
   */
  clone () {
    const text = new YXmlText();
    text.applyDelta(this.toDelta());
    return text
  }

  /**
   * Creates a Dom Element that mirrors this YXmlText.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Text} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM (_document = document, hooks, binding) {
    const dom = _document.createTextNode(this.toString());
    if (binding !== undefined) {
      binding._createAssociation(dom, this);
    }
    return dom
  }

  toString () {
    // @ts-ignore
    return this.toDelta().map(delta => {
      const nestedNodes = [];
      for (const nodeName in delta.attributes) {
        const attrs = [];
        for (const key in delta.attributes[nodeName]) {
          attrs.push({ key, value: delta.attributes[nodeName][key] });
        }
        // sort attributes to get a unique order
        attrs.sort((a, b) => a.key < b.key ? -1 : 1);
        nestedNodes.push({ nodeName, attrs });
      }
      // sort node order to get a unique order
      nestedNodes.sort((a, b) => a.nodeName < b.nodeName ? -1 : 1);
      // now convert to dom string
      let str = '';
      for (let i = 0; i < nestedNodes.length; i++) {
        const node = nestedNodes[i];
        str += `<${node.nodeName}`;
        for (let j = 0; j < node.attrs.length; j++) {
          const attr = node.attrs[j];
          str += ` ${attr.key}="${attr.value}"`;
        }
        str += '>';
      }
      str += delta.insert;
      for (let i = nestedNodes.length - 1; i >= 0; i--) {
        str += `</${nestedNodes[i].nodeName}>`;
      }
      return str
    }).join('')
  }

  /**
   * @return {string}
   */
  toJSON () {
    return this.toString()
  }

  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write (encoder) {
    encoder.writeTypeRef(YXmlTextRefID);
  }
}

/**
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 * @return {YXmlText}
 *
 * @private
 * @function
 */
const readYXmlText = decoder => new YXmlText();

class AbstractStruct {
  /**
   * @param {ID} id
   * @param {number} length
   */
  constructor (id, length) {
    this.id = id;
    this.length = length;
  }

  /**
   * @type {boolean}
   */
  get deleted () {
    throw error__namespace.methodUnimplemented()
  }

  /**
   * Merge this struct with the item to the right.
   * This method is already assuming that `this.id.clock + this.length === this.id.clock`.
   * Also this method does *not* remove right from StructStore!
   * @param {AbstractStruct} right
   * @return {boolean} wether this merged with right
   */
  mergeWith (right) {
    return false
  }

  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   * @param {number} offset
   * @param {number} encodingRef
   */
  write (encoder, offset, encodingRef) {
    throw error__namespace.methodUnimplemented()
  }

  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate (transaction, offset) {
    throw error__namespace.methodUnimplemented()
  }
}

const structGCRefNumber = 0;

/**
 * @private
 */
class GC extends AbstractStruct {
  get deleted () {
    return true
  }

  delete () {}

  /**
   * @param {GC} right
   * @return {boolean}
   */
  mergeWith (right) {
    if (this.constructor !== right.constructor) {
      return false
    }
    this.length += right.length;
    return true
  }

  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate (transaction, offset) {
    if (offset > 0) {
      this.id.clock += offset;
      this.length -= offset;
    }
    addStruct(transaction.doc.store, this);
  }

  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    encoder.writeInfo(structGCRefNumber);
    encoder.writeLen(this.length - offset);
  }

  /**
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing (transaction, store) {
    return null
  }
}

class ContentBinary {
  /**
   * @param {Uint8Array} content
   */
  constructor (content) {
    this.content = content;
  }

  /**
   * @return {number}
   */
  getLength () {
    return 1
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return [this.content]
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return true
  }

  /**
   * @return {ContentBinary}
   */
  copy () {
    return new ContentBinary(this.content)
  }

  /**
   * @param {number} offset
   * @return {ContentBinary}
   */
  splice (offset) {
    throw error__namespace.methodUnimplemented()
  }

  /**
   * @param {ContentBinary} right
   * @return {boolean}
   */
  mergeWith (right) {
    return false
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {}
  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {}
  /**
   * @param {StructStore} store
   */
  gc (store) {}
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    encoder.writeBuf(this.content);
  }

  /**
   * @return {number}
   */
  getRef () {
    return 3
  }
}

/**
 * @param {UpdateDecoderV1 | UpdateDecoderV2 } decoder
 * @return {ContentBinary}
 */
const readContentBinary = decoder => new ContentBinary(decoder.readBuf());

class ContentDeleted {
  /**
   * @param {number} len
   */
  constructor (len) {
    this.len = len;
  }

  /**
   * @return {number}
   */
  getLength () {
    return this.len
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return []
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return false
  }

  /**
   * @return {ContentDeleted}
   */
  copy () {
    return new ContentDeleted(this.len)
  }

  /**
   * @param {number} offset
   * @return {ContentDeleted}
   */
  splice (offset) {
    const right = new ContentDeleted(this.len - offset);
    this.len = offset;
    return right
  }

  /**
   * @param {ContentDeleted} right
   * @return {boolean}
   */
  mergeWith (right) {
    this.len += right.len;
    return true
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {
    addToDeleteSet(transaction.deleteSet, item.id.client, item.id.clock, this.len);
    item.markDeleted();
  }

  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {}
  /**
   * @param {StructStore} store
   */
  gc (store) {}
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    encoder.writeLen(this.len - offset);
  }

  /**
   * @return {number}
   */
  getRef () {
    return 1
  }
}

/**
 * @private
 *
 * @param {UpdateDecoderV1 | UpdateDecoderV2 } decoder
 * @return {ContentDeleted}
 */
const readContentDeleted = decoder => new ContentDeleted(decoder.readLen());

/**
 * @param {string} guid
 * @param {Object<string, any>} opts
 */
const createDocFromOpts = (guid, opts) => new Doc({ guid, ...opts, shouldLoad: opts.shouldLoad || opts.autoLoad || false });

/**
 * @private
 */
class ContentDoc {
  /**
   * @param {Doc} doc
   */
  constructor (doc) {
    if (doc._item) {
      console.error('This document was already integrated as a sub-document. You should create a second instance instead with the same guid.');
    }
    /**
     * @type {Doc}
     */
    this.doc = doc;
    /**
     * @type {any}
     */
    const opts = {};
    this.opts = opts;
    if (!doc.gc) {
      opts.gc = false;
    }
    if (doc.autoLoad) {
      opts.autoLoad = true;
    }
    if (doc.meta !== null) {
      opts.meta = doc.meta;
    }
  }

  /**
   * @return {number}
   */
  getLength () {
    return 1
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return [this.doc]
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return true
  }

  /**
   * @return {ContentDoc}
   */
  copy () {
    return new ContentDoc(createDocFromOpts(this.doc.guid, this.opts))
  }

  /**
   * @param {number} offset
   * @return {ContentDoc}
   */
  splice (offset) {
    throw error__namespace.methodUnimplemented()
  }

  /**
   * @param {ContentDoc} right
   * @return {boolean}
   */
  mergeWith (right) {
    return false
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {
    // this needs to be reflected in doc.destroy as well
    this.doc._item = item;
    transaction.subdocsAdded.add(this.doc);
    if (this.doc.shouldLoad) {
      transaction.subdocsLoaded.add(this.doc);
    }
  }

  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {
    if (transaction.subdocsAdded.has(this.doc)) {
      transaction.subdocsAdded.delete(this.doc);
    } else {
      transaction.subdocsRemoved.add(this.doc);
    }
  }

  /**
   * @param {StructStore} store
   */
  gc (store) { }

  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    encoder.writeString(this.doc.guid);
    encoder.writeAny(this.opts);
  }

  /**
   * @return {number}
   */
  getRef () {
    return 9
  }
}

/**
 * @private
 *
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 * @return {ContentDoc}
 */
const readContentDoc = decoder => new ContentDoc(createDocFromOpts(decoder.readString(), decoder.readAny()));

/**
 * @private
 */
class ContentEmbed {
  /**
   * @param {Object} embed
   */
  constructor (embed) {
    this.embed = embed;
  }

  /**
   * @return {number}
   */
  getLength () {
    return 1
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return [this.embed]
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return true
  }

  /**
   * @return {ContentEmbed}
   */
  copy () {
    return new ContentEmbed(this.embed)
  }

  /**
   * @param {number} offset
   * @return {ContentEmbed}
   */
  splice (offset) {
    throw error__namespace.methodUnimplemented()
  }

  /**
   * @param {ContentEmbed} right
   * @return {boolean}
   */
  mergeWith (right) {
    return false
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {}
  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {}
  /**
   * @param {StructStore} store
   */
  gc (store) {}
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    encoder.writeJSON(this.embed);
  }

  /**
   * @return {number}
   */
  getRef () {
    return 5
  }
}

/**
 * @private
 *
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 * @return {ContentEmbed}
 */
const readContentEmbed = decoder => new ContentEmbed(decoder.readJSON());

/**
 * @private
 */
class ContentFormat {
  /**
   * @param {string} key
   * @param {Object} value
   */
  constructor (key, value) {
    this.key = key;
    this.value = value;
  }

  /**
   * @return {number}
   */
  getLength () {
    return 1
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return []
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return false
  }

  /**
   * @return {ContentFormat}
   */
  copy () {
    return new ContentFormat(this.key, this.value)
  }

  /**
   * @param {number} offset
   * @return {ContentFormat}
   */
  splice (offset) {
    throw error__namespace.methodUnimplemented()
  }

  /**
   * @param {ContentFormat} right
   * @return {boolean}
   */
  mergeWith (right) {
    return false
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {
    // @todo searchmarker are currently unsupported for rich text documents
    /** @type {AbstractType<any>} */ (item.parent)._searchMarker = null;
  }

  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {}
  /**
   * @param {StructStore} store
   */
  gc (store) {}
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    encoder.writeKey(this.key);
    encoder.writeJSON(this.value);
  }

  /**
   * @return {number}
   */
  getRef () {
    return 6
  }
}

/**
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 * @return {ContentFormat}
 */
const readContentFormat = decoder => new ContentFormat(decoder.readString(), decoder.readJSON());

/**
 * @private
 */
class ContentJSON {
  /**
   * @param {Array<any>} arr
   */
  constructor (arr) {
    /**
     * @type {Array<any>}
     */
    this.arr = arr;
  }

  /**
   * @return {number}
   */
  getLength () {
    return this.arr.length
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return this.arr
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return true
  }

  /**
   * @return {ContentJSON}
   */
  copy () {
    return new ContentJSON(this.arr)
  }

  /**
   * @param {number} offset
   * @return {ContentJSON}
   */
  splice (offset) {
    const right = new ContentJSON(this.arr.slice(offset));
    this.arr = this.arr.slice(0, offset);
    return right
  }

  /**
   * @param {ContentJSON} right
   * @return {boolean}
   */
  mergeWith (right) {
    this.arr = this.arr.concat(right.arr);
    return true
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {}
  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {}
  /**
   * @param {StructStore} store
   */
  gc (store) {}
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    const len = this.arr.length;
    encoder.writeLen(len - offset);
    for (let i = offset; i < len; i++) {
      const c = this.arr[i];
      encoder.writeString(c === undefined ? 'undefined' : JSON.stringify(c));
    }
  }

  /**
   * @return {number}
   */
  getRef () {
    return 2
  }
}

/**
 * @private
 *
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 * @return {ContentJSON}
 */
const readContentJSON = decoder => {
  const len = decoder.readLen();
  const cs = [];
  for (let i = 0; i < len; i++) {
    const c = decoder.readString();
    if (c === 'undefined') {
      cs.push(undefined);
    } else {
      cs.push(JSON.parse(c));
    }
  }
  return new ContentJSON(cs)
};

class ContentAny {
  /**
   * @param {Array<any>} arr
   */
  constructor (arr) {
    /**
     * @type {Array<any>}
     */
    this.arr = arr;
  }

  /**
   * @return {number}
   */
  getLength () {
    return this.arr.length
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return this.arr
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return true
  }

  /**
   * @return {ContentAny}
   */
  copy () {
    return new ContentAny(this.arr)
  }

  /**
   * @param {number} offset
   * @return {ContentAny}
   */
  splice (offset) {
    const right = new ContentAny(this.arr.slice(offset));
    this.arr = this.arr.slice(0, offset);
    return right
  }

  /**
   * @param {ContentAny} right
   * @return {boolean}
   */
  mergeWith (right) {
    this.arr = this.arr.concat(right.arr);
    return true
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {}
  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {}
  /**
   * @param {StructStore} store
   */
  gc (store) {}
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    const len = this.arr.length;
    encoder.writeLen(len - offset);
    for (let i = offset; i < len; i++) {
      const c = this.arr[i];
      encoder.writeAny(c);
    }
  }

  /**
   * @return {number}
   */
  getRef () {
    return 8
  }
}

/**
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 * @return {ContentAny}
 */
const readContentAny = decoder => {
  const len = decoder.readLen();
  const cs = [];
  for (let i = 0; i < len; i++) {
    cs.push(decoder.readAny());
  }
  return new ContentAny(cs)
};

/**
 * @private
 */
class ContentString {
  /**
   * @param {string} str
   */
  constructor (str) {
    /**
     * @type {string}
     */
    this.str = str;
  }

  /**
   * @return {number}
   */
  getLength () {
    return this.str.length
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return this.str.split('')
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return true
  }

  /**
   * @return {ContentString}
   */
  copy () {
    return new ContentString(this.str)
  }

  /**
   * @param {number} offset
   * @return {ContentString}
   */
  splice (offset) {
    const right = new ContentString(this.str.slice(offset));
    this.str = this.str.slice(0, offset);

    // Prevent encoding invalid documents because of splitting of surrogate pairs: https://github.com/yjs/yjs/issues/248
    const firstCharCode = this.str.charCodeAt(offset - 1);
    if (firstCharCode >= 0xD800 && firstCharCode <= 0xDBFF) {
      // Last character of the left split is the start of a surrogate utf16/ucs2 pair.
      // We don't support splitting of surrogate pairs because this may lead to invalid documents.
      // Replace the invalid character with a unicode replacement character (� / U+FFFD)
      this.str = this.str.slice(0, offset - 1) + '�';
      // replace right as well
      right.str = '�' + right.str.slice(1);
    }
    return right
  }

  /**
   * @param {ContentString} right
   * @return {boolean}
   */
  mergeWith (right) {
    this.str += right.str;
    return true
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {}
  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {}
  /**
   * @param {StructStore} store
   */
  gc (store) {}
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    encoder.writeString(offset === 0 ? this.str : this.str.slice(offset));
  }

  /**
   * @return {number}
   */
  getRef () {
    return 4
  }
}

/**
 * @private
 *
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 * @return {ContentString}
 */
const readContentString = decoder => new ContentString(decoder.readString());

/**
 * @type {Array<function(UpdateDecoderV1 | UpdateDecoderV2):AbstractType<any>>}
 * @private
 */
const typeRefs = [
  readYArray,
  readYMap,
  readYText,
  readYXmlElement,
  readYXmlFragment,
  readYXmlHook,
  readYXmlText
];

const YArrayRefID = 0;
const YMapRefID = 1;
const YTextRefID = 2;
const YXmlElementRefID = 3;
const YXmlFragmentRefID = 4;
const YXmlHookRefID = 5;
const YXmlTextRefID = 6;

/**
 * @private
 */
class ContentType {
  /**
   * @param {AbstractType<YEvent>} type
   */
  constructor (type) {
    /**
     * @type {AbstractType<any>}
     */
    this.type = type;
  }

  /**
   * @return {number}
   */
  getLength () {
    return 1
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return [this.type]
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return true
  }

  /**
   * @return {ContentType}
   */
  copy () {
    return new ContentType(this.type._copy())
  }

  /**
   * @param {number} offset
   * @return {ContentType}
   */
  splice (offset) {
    throw error__namespace.methodUnimplemented()
  }

  /**
   * @param {ContentType} right
   * @return {boolean}
   */
  mergeWith (right) {
    return false
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {
    this.type._integrate(transaction.doc, item);
  }

  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {
    let item = this.type._start;
    while (item !== null) {
      if (!item.deleted) {
        item.delete(transaction);
      } else {
        // Whis will be gc'd later and we want to merge it if possible
        // We try to merge all deleted items after each transaction,
        // but we have no knowledge about that this needs to be merged
        // since it is not in transaction.ds. Hence we add it to transaction._mergeStructs
        transaction._mergeStructs.push(item);
      }
      item = item.right;
    }
    this.type._map.forEach(item => {
      if (!item.deleted) {
        item.delete(transaction);
      } else {
        // same as above
        transaction._mergeStructs.push(item);
      }
    });
    transaction.changed.delete(this.type);
  }

  /**
   * @param {StructStore} store
   */
  gc (store) {
    let item = this.type._start;
    while (item !== null) {
      item.gc(store, true);
      item = item.right;
    }
    this.type._start = null;
    this.type._map.forEach(/** @param {Item | null} item */ (item) => {
      while (item !== null) {
        item.gc(store, true);
        item = item.left;
      }
    });
    this.type._map = new Map();
  }

  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    this.type._write(encoder);
  }

  /**
   * @return {number}
   */
  getRef () {
    return 7
  }
}

/**
 * @private
 *
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 * @return {ContentType}
 */
const readContentType = decoder => new ContentType(typeRefs[decoder.readTypeRef()](decoder));

/**
 * @todo This should return several items
 *
 * @param {StructStore} store
 * @param {ID} id
 * @return {{item:Item, diff:number}}
 */
const followRedone = (store, id) => {
  /**
   * @type {ID|null}
   */
  let nextID = id;
  let diff = 0;
  let item;
  do {
    if (diff > 0) {
      nextID = createID(nextID.client, nextID.clock + diff);
    }
    item = getItem(store, nextID);
    diff = nextID.clock - item.id.clock;
    nextID = item.redone;
  } while (nextID !== null && item instanceof Item)
  return {
    item, diff
  }
};

/**
 * Make sure that neither item nor any of its parents is ever deleted.
 *
 * This property does not persist when storing it into a database or when
 * sending it to other peers
 *
 * @param {Item|null} item
 * @param {boolean} keep
 */
const keepItem = (item, keep) => {
  while (item !== null && item.keep !== keep) {
    item.keep = keep;
    item = /** @type {AbstractType<any>} */ (item.parent)._item;
  }
};

/**
 * Split leftItem into two items
 * @param {Transaction} transaction
 * @param {Item} leftItem
 * @param {number} diff
 * @return {Item}
 *
 * @function
 * @private
 */
const splitItem = (transaction, leftItem, diff) => {
  // create rightItem
  const { client, clock } = leftItem.id;
  const rightItem = new Item(
    createID(client, clock + diff),
    leftItem,
    createID(client, clock + diff - 1),
    leftItem.right,
    leftItem.rightOrigin,
    leftItem.parent,
    leftItem.parentSub,
    leftItem.content.splice(diff)
  );
  if (leftItem.deleted) {
    rightItem.markDeleted();
  }
  if (leftItem.keep) {
    rightItem.keep = true;
  }
  if (leftItem.redone !== null) {
    rightItem.redone = createID(leftItem.redone.client, leftItem.redone.clock + diff);
  }
  // update left (do not set leftItem.rightOrigin as it will lead to problems when syncing)
  leftItem.right = rightItem;
  // update right
  if (rightItem.right !== null) {
    rightItem.right.left = rightItem;
  }
  // right is more specific.
  transaction._mergeStructs.push(rightItem);
  // update parent._map
  if (rightItem.parentSub !== null && rightItem.right === null) {
    /** @type {AbstractType<any>} */ (rightItem.parent)._map.set(rightItem.parentSub, rightItem);
  }
  leftItem.length = diff;
  return rightItem
};

/**
 * Redoes the effect of this operation.
 *
 * @param {Transaction} transaction The Yjs instance.
 * @param {Item} item
 * @param {Set<Item>} redoitems
 * @param {Array<Item>} itemsToDelete
 *
 * @return {Item|null}
 *
 * @private
 */
const redoItem = (transaction, item, redoitems, itemsToDelete) => {
  const doc = transaction.doc;
  const store = doc.store;
  const ownClientID = doc.clientID;
  const redone = item.redone;
  if (redone !== null) {
    return getItemCleanStart(transaction, redone)
  }
  let parentItem = /** @type {AbstractType<any>} */ (item.parent)._item;
  /**
   * @type {Item|null}
   */
  let left;
  /**
   * @type {Item|null}
   */
  let right;
  if (item.parentSub === null) {
    // Is an array item. Insert at the old position
    left = item.left;
    right = item;
  } else {
    // Is a map item. Insert as current value
    left = item;
    while (left.right !== null) {
      left = left.right;
      if (left.id.client !== ownClientID) {
        // It is not possible to redo this item because it conflicts with a
        // change from another client
        return null
      }
    }
    if (left.right !== null) {
      left = /** @type {Item} */ (/** @type {AbstractType<any>} */ (item.parent)._map.get(item.parentSub));
    }
    right = null;
  }
  // make sure that parent is redone
  if (parentItem !== null && parentItem.deleted === true && parentItem.redone === null) {
    // try to undo parent if it will be undone anyway
    if (!redoitems.has(parentItem) || redoItem(transaction, parentItem, redoitems, itemsToDelete) === null) {
      return null
    }
  }
  if (parentItem !== null && parentItem.redone !== null) {
    while (parentItem.redone !== null) {
      parentItem = getItemCleanStart(transaction, parentItem.redone);
    }
    // find next cloned_redo items
    while (left !== null) {
      /**
       * @type {Item|null}
       */
      let leftTrace = left;
      // trace redone until parent matches
      while (leftTrace !== null && /** @type {AbstractType<any>} */ (leftTrace.parent)._item !== parentItem) {
        leftTrace = leftTrace.redone === null ? null : getItemCleanStart(transaction, leftTrace.redone);
      }
      if (leftTrace !== null && /** @type {AbstractType<any>} */ (leftTrace.parent)._item === parentItem) {
        left = leftTrace;
        break
      }
      left = left.left;
    }
    while (right !== null) {
      /**
       * @type {Item|null}
       */
      let rightTrace = right;
      // trace redone until parent matches
      while (rightTrace !== null && /** @type {AbstractType<any>} */ (rightTrace.parent)._item !== parentItem) {
        rightTrace = rightTrace.redone === null ? null : getItemCleanStart(transaction, rightTrace.redone);
      }
      if (rightTrace !== null && /** @type {AbstractType<any>} */ (rightTrace.parent)._item === parentItem) {
        right = rightTrace;
        break
      }
      right = right.right;
    }
    // Iterate right while right is in itemsToDelete
    // If it is intended to delete right while item is redone, we can expect that item should replace right.
    while (left !== null && left.right !== null && left.right !== right && itemsToDelete.findIndex(d => d === /** @type {Item} */ (left).right) >= 0) {
      left = left.right;
    }
  }
  const nextClock = getState(store, ownClientID);
  const nextId = createID(ownClientID, nextClock);
  const redoneItem = new Item(
    nextId,
    left, left && left.lastId,
    right, right && right.id,
    parentItem === null ? item.parent : /** @type {ContentType} */ (parentItem.content).type,
    item.parentSub,
    item.content.copy()
  );
  item.redone = nextId;
  keepItem(redoneItem, true);
  redoneItem.integrate(transaction, 0);
  return redoneItem
};

/**
 * Abstract class that represents any content.
 */
class Item extends AbstractStruct {
  /**
   * @param {ID} id
   * @param {Item | null} left
   * @param {ID | null} origin
   * @param {Item | null} right
   * @param {ID | null} rightOrigin
   * @param {AbstractType<any>|ID|null} parent Is a type if integrated, is null if it is possible to copy parent from left or right, is ID before integration to search for it.
   * @param {string | null} parentSub
   * @param {AbstractContent} content
   */
  constructor (id, left, origin, right, rightOrigin, parent, parentSub, content) {
    super(id, content.getLength());
    /**
     * The item that was originally to the left of this item.
     * @type {ID | null}
     */
    this.origin = origin;
    /**
     * The item that is currently to the left of this item.
     * @type {Item | null}
     */
    this.left = left;
    /**
     * The item that is currently to the right of this item.
     * @type {Item | null}
     */
    this.right = right;
    /**
     * The item that was originally to the right of this item.
     * @type {ID | null}
     */
    this.rightOrigin = rightOrigin;
    /**
     * @type {AbstractType<any>|ID|null}
     */
    this.parent = parent;
    /**
     * If the parent refers to this item with some kind of key (e.g. YMap, the
     * key is specified here. The key is then used to refer to the list in which
     * to insert this item. If `parentSub = null` type._start is the list in
     * which to insert to. Otherwise it is `parent._map`.
     * @type {String | null}
     */
    this.parentSub = parentSub;
    /**
     * If this type's effect is reundone this type refers to the type that undid
     * this operation.
     * @type {ID | null}
     */
    this.redone = null;
    /**
     * @type {AbstractContent}
     */
    this.content = content;
    /**
     * bit1: keep
     * bit2: countable
     * bit3: deleted
     * bit4: mark - mark node as fast-search-marker
     * @type {number} byte
     */
    this.info = this.content.isCountable() ? binary__namespace.BIT2 : 0;
  }

  /**
   * This is used to mark the item as an indexed fast-search marker
   *
   * @type {boolean}
   */
  set marker (isMarked) {
    if (((this.info & binary__namespace.BIT4) > 0) !== isMarked) {
      this.info ^= binary__namespace.BIT4;
    }
  }

  get marker () {
    return (this.info & binary__namespace.BIT4) > 0
  }

  /**
   * If true, do not garbage collect this Item.
   */
  get keep () {
    return (this.info & binary__namespace.BIT1) > 0
  }

  set keep (doKeep) {
    if (this.keep !== doKeep) {
      this.info ^= binary__namespace.BIT1;
    }
  }

  get countable () {
    return (this.info & binary__namespace.BIT2) > 0
  }

  /**
   * Whether this item was deleted or not.
   * @type {Boolean}
   */
  get deleted () {
    return (this.info & binary__namespace.BIT3) > 0
  }

  set deleted (doDelete) {
    if (this.deleted !== doDelete) {
      this.info ^= binary__namespace.BIT3;
    }
  }

  markDeleted () {
    this.info |= binary__namespace.BIT3;
  }

  /**
   * Return the creator clientID of the missing op or define missing items and return null.
   *
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing (transaction, store) {
    if (this.origin && this.origin.client !== this.id.client && this.origin.clock >= getState(store, this.origin.client)) {
      return this.origin.client
    }
    if (this.rightOrigin && this.rightOrigin.client !== this.id.client && this.rightOrigin.clock >= getState(store, this.rightOrigin.client)) {
      return this.rightOrigin.client
    }
    if (this.parent && this.parent.constructor === ID && this.id.client !== this.parent.client && this.parent.clock >= getState(store, this.parent.client)) {
      return this.parent.client
    }

    // We have all missing ids, now find the items

    if (this.origin) {
      this.left = getItemCleanEnd(transaction, store, this.origin);
      this.origin = this.left.lastId;
    }
    if (this.rightOrigin) {
      this.right = getItemCleanStart(transaction, this.rightOrigin);
      this.rightOrigin = this.right.id;
    }
    if ((this.left && this.left.constructor === GC) || (this.right && this.right.constructor === GC)) {
      this.parent = null;
    }
    // only set parent if this shouldn't be garbage collected
    if (!this.parent) {
      if (this.left && this.left.constructor === Item) {
        this.parent = this.left.parent;
        this.parentSub = this.left.parentSub;
      }
      if (this.right && this.right.constructor === Item) {
        this.parent = this.right.parent;
        this.parentSub = this.right.parentSub;
      }
    } else if (this.parent.constructor === ID) {
      const parentItem = getItem(store, this.parent);
      if (parentItem.constructor === GC) {
        this.parent = null;
      } else {
        this.parent = /** @type {ContentType} */ (parentItem.content).type;
      }
    }
    return null
  }

  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate (transaction, offset) {
    if (offset > 0) {
      this.id.clock += offset;
      this.left = getItemCleanEnd(transaction, transaction.doc.store, createID(this.id.client, this.id.clock - 1));
      this.origin = this.left.lastId;
      this.content = this.content.splice(offset);
      this.length -= offset;
    }

    if (this.parent) {
      if ((!this.left && (!this.right || this.right.left !== null)) || (this.left && this.left.right !== this.right)) {
        /**
         * @type {Item|null}
         */
        let left = this.left;

        /**
         * @type {Item|null}
         */
        let o;
        // set o to the first conflicting item
        if (left !== null) {
          o = left.right;
        } else if (this.parentSub !== null) {
          o = /** @type {AbstractType<any>} */ (this.parent)._map.get(this.parentSub) || null;
          while (o !== null && o.left !== null) {
            o = o.left;
          }
        } else {
          o = /** @type {AbstractType<any>} */ (this.parent)._start;
        }
        // TODO: use something like DeleteSet here (a tree implementation would be best)
        // @todo use global set definitions
        /**
         * @type {Set<Item>}
         */
        const conflictingItems = new Set();
        /**
         * @type {Set<Item>}
         */
        const itemsBeforeOrigin = new Set();
        // Let c in conflictingItems, b in itemsBeforeOrigin
        // ***{origin}bbbb{this}{c,b}{c,b}{o}***
        // Note that conflictingItems is a subset of itemsBeforeOrigin
        while (o !== null && o !== this.right) {
          itemsBeforeOrigin.add(o);
          conflictingItems.add(o);
          if (compareIDs(this.origin, o.origin)) {
            // case 1
            if (o.id.client < this.id.client) {
              left = o;
              conflictingItems.clear();
            } else if (compareIDs(this.rightOrigin, o.rightOrigin)) {
              // this and o are conflicting and point to the same integration points. The id decides which item comes first.
              // Since this is to the left of o, we can break here
              break
            } // else, o might be integrated before an item that this conflicts with. If so, we will find it in the next iterations
          } else if (o.origin !== null && itemsBeforeOrigin.has(getItem(transaction.doc.store, o.origin))) { // use getItem instead of getItemCleanEnd because we don't want / need to split items.
            // case 2
            if (!conflictingItems.has(getItem(transaction.doc.store, o.origin))) {
              left = o;
              conflictingItems.clear();
            }
          } else {
            break
          }
          o = o.right;
        }
        this.left = left;
      }
      // reconnect left/right + update parent map/start if necessary
      if (this.left !== null) {
        const right = this.left.right;
        this.right = right;
        this.left.right = this;
      } else {
        let r;
        if (this.parentSub !== null) {
          r = /** @type {AbstractType<any>} */ (this.parent)._map.get(this.parentSub) || null;
          while (r !== null && r.left !== null) {
            r = r.left;
          }
        } else {
          r = /** @type {AbstractType<any>} */ (this.parent)._start
          ;/** @type {AbstractType<any>} */ (this.parent)._start = this;
        }
        this.right = r;
      }
      if (this.right !== null) {
        this.right.left = this;
      } else if (this.parentSub !== null) {
        // set as current parent value if right === null and this is parentSub
        /** @type {AbstractType<any>} */ (this.parent)._map.set(this.parentSub, this);
        if (this.left !== null) {
          // this is the current attribute value of parent. delete right
          this.left.delete(transaction);
        }
      }
      // adjust length of parent
      if (this.parentSub === null && this.countable && !this.deleted) {
        /** @type {AbstractType<any>} */ (this.parent)._length += this.length;
      }
      addStruct(transaction.doc.store, this);
      this.content.integrate(transaction, this);
      // add parent to transaction.changed
      addChangedTypeToTransaction(transaction, /** @type {AbstractType<any>} */ (this.parent), this.parentSub);
      if ((/** @type {AbstractType<any>} */ (this.parent)._item !== null && /** @type {AbstractType<any>} */ (this.parent)._item.deleted) || (this.parentSub !== null && this.right !== null)) {
        // delete if parent is deleted or if this is not the current attribute value of parent
        this.delete(transaction);
      }
    } else {
      // parent is not defined. Integrate GC struct instead
      new GC(this.id, this.length).integrate(transaction, 0);
    }
  }

  /**
   * Returns the next non-deleted item
   */
  get next () {
    let n = this.right;
    while (n !== null && n.deleted) {
      n = n.right;
    }
    return n
  }

  /**
   * Returns the previous non-deleted item
   */
  get prev () {
    let n = this.left;
    while (n !== null && n.deleted) {
      n = n.left;
    }
    return n
  }

  /**
   * Computes the last content address of this Item.
   */
  get lastId () {
    // allocating ids is pretty costly because of the amount of ids created, so we try to reuse whenever possible
    return this.length === 1 ? this.id : createID(this.id.client, this.id.clock + this.length - 1)
  }

  /**
   * Try to merge two items
   *
   * @param {Item} right
   * @return {boolean}
   */
  mergeWith (right) {
    if (
      this.constructor === right.constructor &&
      compareIDs(right.origin, this.lastId) &&
      this.right === right &&
      compareIDs(this.rightOrigin, right.rightOrigin) &&
      this.id.client === right.id.client &&
      this.id.clock + this.length === right.id.clock &&
      this.deleted === right.deleted &&
      this.redone === null &&
      right.redone === null &&
      this.content.constructor === right.content.constructor &&
      this.content.mergeWith(right.content)
    ) {
      const searchMarker = /** @type {AbstractType<any>} */ (this.parent)._searchMarker;
      if (searchMarker) {
        searchMarker.forEach(marker => {
          if (marker.p === right) {
            // right is going to be "forgotten" so we need to update the marker
            marker.p = this;
            // adjust marker index
            if (!this.deleted && this.countable) {
              marker.index -= this.length;
            }
          }
        });
      }
      if (right.keep) {
        this.keep = true;
      }
      this.right = right.right;
      if (this.right !== null) {
        this.right.left = this;
      }
      this.length += right.length;
      return true
    }
    return false
  }

  /**
   * Mark this Item as deleted.
   *
   * @param {Transaction} transaction
   */
  delete (transaction) {
    if (!this.deleted) {
      const parent = /** @type {AbstractType<any>} */ (this.parent);
      // adjust the length of parent
      if (this.countable && this.parentSub === null) {
        parent._length -= this.length;
      }
      this.markDeleted();
      addToDeleteSet(transaction.deleteSet, this.id.client, this.id.clock, this.length);
      addChangedTypeToTransaction(transaction, parent, this.parentSub);
      this.content.delete(transaction);
    }
  }

  /**
   * @param {StructStore} store
   * @param {boolean} parentGCd
   */
  gc (store, parentGCd) {
    if (!this.deleted) {
      throw error__namespace.unexpectedCase()
    }
    this.content.gc(store);
    if (parentGCd) {
      replaceStruct(store, this, new GC(this.id, this.length));
    } else {
      this.content = new ContentDeleted(this.length);
    }
  }

  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   * @param {number} offset
   */
  write (encoder, offset) {
    const origin = offset > 0 ? createID(this.id.client, this.id.clock + offset - 1) : this.origin;
    const rightOrigin = this.rightOrigin;
    const parentSub = this.parentSub;
    const info = (this.content.getRef() & binary__namespace.BITS5) |
      (origin === null ? 0 : binary__namespace.BIT8) | // origin is defined
      (rightOrigin === null ? 0 : binary__namespace.BIT7) | // right origin is defined
      (parentSub === null ? 0 : binary__namespace.BIT6); // parentSub is non-null
    encoder.writeInfo(info);
    if (origin !== null) {
      encoder.writeLeftID(origin);
    }
    if (rightOrigin !== null) {
      encoder.writeRightID(rightOrigin);
    }
    if (origin === null && rightOrigin === null) {
      const parent = /** @type {AbstractType<any>} */ (this.parent);
      if (parent._item !== undefined) {
        const parentItem = parent._item;
        if (parentItem === null) {
          // parent type on y._map
          // find the correct key
          const ykey = findRootTypeKey(parent);
          encoder.writeParentInfo(true); // write parentYKey
          encoder.writeString(ykey);
        } else {
          encoder.writeParentInfo(false); // write parent id
          encoder.writeLeftID(parentItem.id);
        }
      } else if (parent.constructor === String) { // this edge case was added by differential updates
        encoder.writeParentInfo(true); // write parentYKey
        encoder.writeString(parent);
      } else if (parent.constructor === ID) {
        encoder.writeParentInfo(false); // write parent id
        encoder.writeLeftID(parent);
      } else {
        error__namespace.unexpectedCase();
      }
      if (parentSub !== null) {
        encoder.writeString(parentSub);
      }
    }
    this.content.write(encoder, offset);
  }
}

/**
 * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
 * @param {number} info
 */
const readItemContent = (decoder, info) => contentRefs[info & binary__namespace.BITS5](decoder);

/**
 * A lookup map for reading Item content.
 *
 * @type {Array<function(UpdateDecoderV1 | UpdateDecoderV2):AbstractContent>}
 */
const contentRefs = [
  () => { error__namespace.unexpectedCase(); }, // GC is not ItemContent
  readContentDeleted, // 1
  readContentJSON, // 2
  readContentBinary, // 3
  readContentString, // 4
  readContentEmbed, // 5
  readContentFormat, // 6
  readContentType, // 7
  readContentAny, // 8
  readContentDoc, // 9
  () => { error__namespace.unexpectedCase(); } // 10 - Skip is not ItemContent
];

const structSkipRefNumber = 10;

/**
 * @private
 */
class Skip extends AbstractStruct {
  get deleted () {
    return true
  }

  delete () {}

  /**
   * @param {Skip} right
   * @return {boolean}
   */
  mergeWith (right) {
    if (this.constructor !== right.constructor) {
      return false
    }
    this.length += right.length;
    return true
  }

  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate (transaction, offset) {
    // skip structs cannot be integrated
    error__namespace.unexpectedCase();
  }

  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    encoder.writeInfo(structSkipRefNumber);
    // write as VarUint because Skips can't make use of predictable length-encoding
    encoding__namespace$2.writeVarUint(encoder.restEncoder, this.length - offset);
  }

  /**
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing (transaction, store) {
    return null
  }
}

/** eslint-env browser */

const glo = /** @type {any} */ (typeof window !== 'undefined'
  ? window
  // @ts-ignore
  : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : {});

const importIdentifier = '__ $YJS$ __';

if (glo[importIdentifier] === true) {
  /**
   * Dear reader of this warning message. Please take this seriously.
   *
   * If you see this message, please make sure that you only import one version of Yjs. In many cases,
   * your package manager installs two versions of Yjs that are used by different packages within your project.
   * Another reason for this message is that some parts of your project use the commonjs version of Yjs
   * and others use the EcmaScript version of Yjs.
   *
   * This often leads to issues that are hard to debug. We often need to perform constructor checks,
   * e.g. `struct instanceof GC`. If you imported different versions of Yjs, it is impossible for us to
   * do the constructor checks anymore - which might break the CRDT algorithm.
   */
  console.warn('Yjs was already imported. Importing different versions of Yjs often leads to issues.');
}
glo[importIdentifier] = true;

var AbsolutePosition_1 = AbsolutePosition;
var AbstractConnector_1 = AbstractConnector;
var AbstractStruct_1 = AbstractStruct;
var AbstractType_1 = AbstractType;
var _Array = YArray;
var ContentAny_1 = ContentAny;
var ContentBinary_1 = ContentBinary;
var ContentDeleted_1 = ContentDeleted;
var ContentEmbed_1 = ContentEmbed;
var ContentFormat_1 = ContentFormat;
var ContentJSON_1 = ContentJSON;
var ContentString_1 = ContentString;
var ContentType_1 = ContentType;
var Doc_1 = Doc;
var GC_1 = GC;
var ID_1 = ID;
var Item_1 = Item;
var _Map = YMap;
var PermanentUserData_1 = PermanentUserData;
var RelativePosition_1 = RelativePosition;
var Snapshot_1 = Snapshot;
var Text = YText;
var Transaction_1 = Transaction;
var UndoManager_1 = UndoManager;
var XmlElement = YXmlElement;
var XmlFragment = YXmlFragment;
var XmlHook = YXmlHook;
var XmlText = YXmlText;
var YArrayEvent_1 = YArrayEvent;
var YEvent_1 = YEvent;
var YMapEvent_1 = YMapEvent;
var YTextEvent_1 = YTextEvent;
var YXmlEvent_1 = YXmlEvent;
var applyUpdate_1 = applyUpdate;
var applyUpdateV2_1 = applyUpdateV2;
var cleanupYTextFormatting_1 = cleanupYTextFormatting;
var compareIDs_1 = compareIDs;
var compareRelativePositions_1 = compareRelativePositions;
var convertUpdateFormatV1ToV2_1 = convertUpdateFormatV1ToV2;
var convertUpdateFormatV2ToV1_1 = convertUpdateFormatV2ToV1;
var createAbsolutePositionFromRelativePosition_1 = createAbsolutePositionFromRelativePosition;
var createDeleteSet_1 = createDeleteSet;
var createDeleteSetFromStructStore_1 = createDeleteSetFromStructStore;
var createDocFromSnapshot_1 = createDocFromSnapshot;
var createID_1 = createID;
var createRelativePositionFromJSON_1 = createRelativePositionFromJSON;
var createRelativePositionFromTypeIndex_1 = createRelativePositionFromTypeIndex;
var createSnapshot_1 = createSnapshot;
var decodeRelativePosition_1 = decodeRelativePosition;
var decodeSnapshot_1 = decodeSnapshot;
var decodeSnapshotV2_1 = decodeSnapshotV2;
var decodeStateVector_1 = decodeStateVector;
var diffUpdate_1 = diffUpdate;
var diffUpdateV2_1 = diffUpdateV2;
var emptySnapshot_1 = emptySnapshot;
var encodeRelativePosition_1 = encodeRelativePosition;
var encodeSnapshot_1 = encodeSnapshot;
var encodeSnapshotV2_1 = encodeSnapshotV2;
var encodeStateAsUpdate_1 = encodeStateAsUpdate;
var encodeStateAsUpdateV2_1 = encodeStateAsUpdateV2;
var encodeStateVector_1 = encodeStateVector;
var encodeStateVectorFromUpdate_1 = encodeStateVectorFromUpdate;
var encodeStateVectorFromUpdateV2_1 = encodeStateVectorFromUpdateV2;
var equalSnapshots_1 = equalSnapshots;
var findIndexSS_1 = findIndexSS;
var findRootTypeKey_1 = findRootTypeKey;
var getItem_1 = getItem;
var getState_1 = getState;
var getTypeChildren_1 = getTypeChildren;
var isDeleted_1 = isDeleted;
var isParentOf_1 = isParentOf;
var iterateDeletedStructs_1 = iterateDeletedStructs;
var logType_1 = logType;
var logUpdate_1 = logUpdate;
var logUpdateV2_1 = logUpdateV2;
var mergeUpdates_1 = mergeUpdates$1;
var mergeUpdatesV2_1 = mergeUpdatesV2;
var parseUpdateMeta_1 = parseUpdateMeta;
var parseUpdateMetaV2_1 = parseUpdateMetaV2;
var readUpdate_1$1 = readUpdate$1;
var readUpdateV2_1 = readUpdateV2;
var relativePositionToJSON_1 = relativePositionToJSON;
var snapshot_1 = snapshot;
var transact_1 = transact;
var tryGc_1 = tryGc;
var typeListToArraySnapshot_1 = typeListToArraySnapshot;
var typeMapGetSnapshot_1 = typeMapGetSnapshot;


var yjs = /*#__PURE__*/Object.defineProperty({
	AbsolutePosition: AbsolutePosition_1,
	AbstractConnector: AbstractConnector_1,
	AbstractStruct: AbstractStruct_1,
	AbstractType: AbstractType_1,
	Array: _Array,
	ContentAny: ContentAny_1,
	ContentBinary: ContentBinary_1,
	ContentDeleted: ContentDeleted_1,
	ContentEmbed: ContentEmbed_1,
	ContentFormat: ContentFormat_1,
	ContentJSON: ContentJSON_1,
	ContentString: ContentString_1,
	ContentType: ContentType_1,
	Doc: Doc_1,
	GC: GC_1,
	ID: ID_1,
	Item: Item_1,
	Map: _Map,
	PermanentUserData: PermanentUserData_1,
	RelativePosition: RelativePosition_1,
	Snapshot: Snapshot_1,
	Text: Text,
	Transaction: Transaction_1,
	UndoManager: UndoManager_1,
	XmlElement: XmlElement,
	XmlFragment: XmlFragment,
	XmlHook: XmlHook,
	XmlText: XmlText,
	YArrayEvent: YArrayEvent_1,
	YEvent: YEvent_1,
	YMapEvent: YMapEvent_1,
	YTextEvent: YTextEvent_1,
	YXmlEvent: YXmlEvent_1,
	applyUpdate: applyUpdate_1,
	applyUpdateV2: applyUpdateV2_1,
	cleanupYTextFormatting: cleanupYTextFormatting_1,
	compareIDs: compareIDs_1,
	compareRelativePositions: compareRelativePositions_1,
	convertUpdateFormatV1ToV2: convertUpdateFormatV1ToV2_1,
	convertUpdateFormatV2ToV1: convertUpdateFormatV2ToV1_1,
	createAbsolutePositionFromRelativePosition: createAbsolutePositionFromRelativePosition_1,
	createDeleteSet: createDeleteSet_1,
	createDeleteSetFromStructStore: createDeleteSetFromStructStore_1,
	createDocFromSnapshot: createDocFromSnapshot_1,
	createID: createID_1,
	createRelativePositionFromJSON: createRelativePositionFromJSON_1,
	createRelativePositionFromTypeIndex: createRelativePositionFromTypeIndex_1,
	createSnapshot: createSnapshot_1,
	decodeRelativePosition: decodeRelativePosition_1,
	decodeSnapshot: decodeSnapshot_1,
	decodeSnapshotV2: decodeSnapshotV2_1,
	decodeStateVector: decodeStateVector_1,
	diffUpdate: diffUpdate_1,
	diffUpdateV2: diffUpdateV2_1,
	emptySnapshot: emptySnapshot_1,
	encodeRelativePosition: encodeRelativePosition_1,
	encodeSnapshot: encodeSnapshot_1,
	encodeSnapshotV2: encodeSnapshotV2_1,
	encodeStateAsUpdate: encodeStateAsUpdate_1,
	encodeStateAsUpdateV2: encodeStateAsUpdateV2_1,
	encodeStateVector: encodeStateVector_1,
	encodeStateVectorFromUpdate: encodeStateVectorFromUpdate_1,
	encodeStateVectorFromUpdateV2: encodeStateVectorFromUpdateV2_1,
	equalSnapshots: equalSnapshots_1,
	findIndexSS: findIndexSS_1,
	findRootTypeKey: findRootTypeKey_1,
	getItem: getItem_1,
	getState: getState_1,
	getTypeChildren: getTypeChildren_1,
	isDeleted: isDeleted_1,
	isParentOf: isParentOf_1,
	iterateDeletedStructs: iterateDeletedStructs_1,
	logType: logType_1,
	logUpdate: logUpdate_1,
	logUpdateV2: logUpdateV2_1,
	mergeUpdates: mergeUpdates_1,
	mergeUpdatesV2: mergeUpdatesV2_1,
	parseUpdateMeta: parseUpdateMeta_1,
	parseUpdateMetaV2: parseUpdateMetaV2_1,
	readUpdate: readUpdate_1$1,
	readUpdateV2: readUpdateV2_1,
	relativePositionToJSON: relativePositionToJSON_1,
	snapshot: snapshot_1,
	transact: transact_1,
	tryGc: tryGc_1,
	typeListToArraySnapshot: typeListToArraySnapshot_1,
	typeMapGetSnapshot: typeMapGetSnapshot_1
}, '__esModule', {value: true});

var Y = yjs;

function _interopNamespace$2(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

var encoding__namespace$1 = /*#__PURE__*/_interopNamespace$2(encoding);
var decoding__namespace$1 = /*#__PURE__*/_interopNamespace$2(decoding);
var Y__namespace = /*#__PURE__*/_interopNamespace$2(Y);

/**
 * @module sync-protocol
 */

/**
 * @typedef {Map<number, number>} StateMap
 */

/**
 * Core Yjs defines two message types:
 * • YjsSyncStep1: Includes the State Set of the sending client. When received, the client should reply with YjsSyncStep2.
 * • YjsSyncStep2: Includes all missing structs and the complete delete set. When received, the client is assured that it
 *   received all information from the remote client.
 *
 * In a peer-to-peer network, you may want to introduce a SyncDone message type. Both parties should initiate the connection
 * with SyncStep1. When a client received SyncStep2, it should reply with SyncDone. When the local client received both
 * SyncStep2 and SyncDone, it is assured that it is synced to the remote client.
 *
 * In a client-server model, you want to handle this differently: The client should initiate the connection with SyncStep1.
 * When the server receives SyncStep1, it should reply with SyncStep2 immediately followed by SyncStep1. The client replies
 * with SyncStep2 when it receives SyncStep1. Optionally the server may send a SyncDone after it received SyncStep2, so the
 * client knows that the sync is finished.  There are two reasons for this more elaborated sync model: 1. This protocol can
 * easily be implemented on top of http and websockets. 2. The server should only reply to requests, and not initiate them.
 * Therefore it is necesarry that the client initiates the sync.
 *
 * Construction of a message:
 * [messageType : varUint, message definition..]
 *
 * Note: A message does not include information about the room name. This must to be handled by the upper layer protocol!
 *
 * stringify[messageType] stringifies a message definition (messageType is already read from the bufffer)
 */

const messageYjsSyncStep1 = 0;
const messageYjsSyncStep2 = 1;
const messageYjsUpdate = 2;

/**
 * Create a sync step 1 message based on the state of the current shared document.
 *
 * @param {encoding.Encoder} encoder
 * @param {Y.Doc} doc
 */
const writeSyncStep1 = (encoder, doc) => {
  encoding__namespace$1.writeVarUint(encoder, messageYjsSyncStep1);
  const sv = Y__namespace.encodeStateVector(doc);
  encoding__namespace$1.writeVarUint8Array(encoder, sv);
};

/**
 * @param {encoding.Encoder} encoder
 * @param {Y.Doc} doc
 * @param {Uint8Array} [encodedStateVector]
 */
const writeSyncStep2 = (encoder, doc, encodedStateVector) => {
  encoding__namespace$1.writeVarUint(encoder, messageYjsSyncStep2);
  encoding__namespace$1.writeVarUint8Array(encoder, Y__namespace.encodeStateAsUpdate(doc, encodedStateVector));
};

/**
 * Read SyncStep1 message and reply with SyncStep2.
 *
 * @param {decoding.Decoder} decoder The reply to the received message
 * @param {encoding.Encoder} encoder The received message
 * @param {Y.Doc} doc
 */
const readSyncStep1 = (decoder, encoder, doc) =>
  writeSyncStep2(encoder, doc, decoding__namespace$1.readVarUint8Array(decoder));

/**
 * Read and apply Structs and then DeleteStore to a y instance.
 *
 * @param {decoding.Decoder} decoder
 * @param {Y.Doc} doc
 * @param {any} transactionOrigin
 */
const readSyncStep2 = (decoder, doc, transactionOrigin) => {
  try {
    Y__namespace.applyUpdate(doc, decoding__namespace$1.readVarUint8Array(decoder), transactionOrigin);
  } catch (error) {
    // This catches errors that are thrown by event handlers
    console.error('Caught error while handling a Yjs update', error);
  }
};

/**
 * @param {encoding.Encoder} encoder
 * @param {Uint8Array} update
 */
const writeUpdate = (encoder, update) => {
  encoding__namespace$1.writeVarUint(encoder, messageYjsUpdate);
  encoding__namespace$1.writeVarUint8Array(encoder, update);
};

/**
 * Read and apply Structs and then DeleteStore to a y instance.
 *
 * @param {decoding.Decoder} decoder
 * @param {Y.Doc} doc
 * @param {any} transactionOrigin
 */
const readUpdate = readSyncStep2;

/**
 * @param {decoding.Decoder} decoder A message received from another client
 * @param {encoding.Encoder} encoder The reply message. Will not be sent if empty.
 * @param {Y.Doc} doc
 * @param {any} transactionOrigin
 */
const readSyncMessage = (decoder, encoder, doc, transactionOrigin) => {
  const messageType = decoding__namespace$1.readVarUint(decoder);
  switch (messageType) {
    case messageYjsSyncStep1:
      readSyncStep1(decoder, encoder, doc);
      break
    case messageYjsSyncStep2:
      if (!transactionOrigin.isReadOnly) readSyncStep2(decoder, doc, transactionOrigin);
      break
    case messageYjsUpdate:
      if (!transactionOrigin.isReadOnly) readUpdate(decoder, doc, transactionOrigin);
      break
    default:
      throw new Error('Unknown message type')
  }
  return messageType
};

var messageYjsSyncStep1_1 = messageYjsSyncStep1;
var messageYjsSyncStep2_1 = messageYjsSyncStep2;
var messageYjsUpdate_1 = messageYjsUpdate;
var readSyncMessage_1 = readSyncMessage;
var readSyncStep1_1 = readSyncStep1;
var readSyncStep2_1 = readSyncStep2;
var readUpdate_1 = readUpdate;
var writeSyncStep1_1 = writeSyncStep1;
var writeSyncStep2_1 = writeSyncStep2;
var writeUpdate_1 = writeUpdate;


var sync = /*#__PURE__*/Object.defineProperty({
	messageYjsSyncStep1: messageYjsSyncStep1_1,
	messageYjsSyncStep2: messageYjsSyncStep2_1,
	messageYjsUpdate: messageYjsUpdate_1,
	readSyncMessage: readSyncMessage_1,
	readSyncStep1: readSyncStep1_1,
	readSyncStep2: readSyncStep2_1,
	readUpdate: readUpdate_1,
	writeSyncStep1: writeSyncStep1_1,
	writeSyncStep2: writeSyncStep2_1,
	writeUpdate: writeUpdate_1
}, '__esModule', {value: true});

function _interopNamespace$1(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

var encoding__namespace = /*#__PURE__*/_interopNamespace$1(encoding);
var decoding__namespace = /*#__PURE__*/_interopNamespace$1(decoding);
var time__namespace = /*#__PURE__*/_interopNamespace$1(time);
var math__namespace = /*#__PURE__*/_interopNamespace$1(math);
var f__namespace = /*#__PURE__*/_interopNamespace$1(f);

/**
 * @module awareness-protocol
 */

const outdatedTimeout = 30000;

/**
 * @typedef {Object} MetaClientState
 * @property {number} MetaClientState.clock
 * @property {number} MetaClientState.lastUpdated unix timestamp
 */

/**
 * The Awareness class implements a simple shared state protocol that can be used for non-persistent data like awareness information
 * (cursor, username, status, ..). Each client can update its own local state and listen to state changes of
 * remote clients. Every client may set a state of a remote peer to `null` to mark the client as offline.
 *
 * Each client is identified by a unique client id (something we borrow from `doc.clientID`). A client can override
 * its own state by propagating a message with an increasing timestamp (`clock`). If such a message is received, it is
 * applied if the known state of that client is older than the new state (`clock < newClock`). If a client thinks that
 * a remote client is offline, it may propagate a message with
 * `{ clock: currentClientClock, state: null, client: remoteClient }`. If such a
 * message is received, and the known clock of that client equals the received clock, it will override the state with `null`.
 *
 * Before a client disconnects, it should propagate a `null` state with an updated clock.
 *
 * Awareness states must be updated every 30 seconds. Otherwise the Awareness instance will delete the client state.
 *
 * @extends {Observable<string>}
 */
class Awareness extends observable.Observable {
  /**
   * @param {Y.Doc} doc
   */
  constructor (doc) {
    super();
    this.doc = doc;
    /**
     * @type {number}
     */
    this.clientID = doc.clientID;
    /**
     * Maps from client id to client state
     * @type {Map<number, Object<string, any>>}
     */
    this.states = new Map();
    /**
     * @type {Map<number, MetaClientState>}
     */
    this.meta = new Map();
    this._checkInterval = /** @type {any} */ (setInterval(() => {
      const now = time__namespace.getUnixTime();
      if (this.getLocalState() !== null && (outdatedTimeout / 2 <= now - /** @type {{lastUpdated:number}} */ (this.meta.get(this.clientID)).lastUpdated)) {
        // renew local clock
        this.setLocalState(this.getLocalState());
      }
      /**
       * @type {Array<number>}
       */
      const remove = [];
      this.meta.forEach((meta, clientid) => {
        if (clientid !== this.clientID && outdatedTimeout <= now - meta.lastUpdated && this.states.has(clientid)) {
          remove.push(clientid);
        }
      });
      if (remove.length > 0) {
        removeAwarenessStates(this, remove, 'timeout');
      }
    }, math__namespace.floor(outdatedTimeout / 10)));
    doc.on('destroy', () => {
      this.destroy();
    });
    this.setLocalState({});
  }

  destroy () {
    this.emit('destroy', [this]);
    this.setLocalState(null);
    super.destroy();
    clearInterval(this._checkInterval);
  }

  /**
   * @return {Object<string,any>|null}
   */
  getLocalState () {
    return this.states.get(this.clientID) || null
  }

  /**
   * @param {Object<string,any>|null} state
   */
  setLocalState (state) {
    const clientID = this.clientID;
    const currLocalMeta = this.meta.get(clientID);
    const clock = currLocalMeta === undefined ? 0 : currLocalMeta.clock + 1;
    const prevState = this.states.get(clientID);
    if (state === null) {
      this.states.delete(clientID);
    } else {
      this.states.set(clientID, state);
    }
    this.meta.set(clientID, {
      clock,
      lastUpdated: time__namespace.getUnixTime()
    });
    const added = [];
    const updated = [];
    const filteredUpdated = [];
    const removed = [];
    if (state === null) {
      removed.push(clientID);
    } else if (prevState == null) {
      if (state != null) {
        added.push(clientID);
      }
    } else {
      updated.push(clientID);
      if (!f__namespace.equalityDeep(prevState, state)) {
        filteredUpdated.push(clientID);
      }
    }
    if (added.length > 0 || filteredUpdated.length > 0 || removed.length > 0) {
      this.emit('change', [{ added, updated: filteredUpdated, removed }, 'local']);
    }
    this.emit('update', [{ added, updated, removed }, 'local']);
  }

  /**
   * @param {string} field
   * @param {any} value
   */
  setLocalStateField (field, value) {
    const state = this.getLocalState();
    if (state !== null) {
      this.setLocalState({
        ...state,
        [field]: value
      });
    }
  }

  /**
   * @return {Map<number,Object<string,any>>}
   */
  getStates () {
    return this.states
  }
}

/**
 * Mark (remote) clients as inactive and remove them from the list of active peers.
 * This change will be propagated to remote clients.
 *
 * @param {Awareness} awareness
 * @param {Array<number>} clients
 * @param {any} origin
 */
const removeAwarenessStates = (awareness, clients, origin) => {
  const removed = [];
  for (let i = 0; i < clients.length; i++) {
    const clientID = clients[i];
    if (awareness.states.has(clientID)) {
      awareness.states.delete(clientID);
      if (clientID === awareness.clientID) {
        const curMeta = /** @type {MetaClientState} */ (awareness.meta.get(clientID));
        awareness.meta.set(clientID, {
          clock: curMeta.clock + 1,
          lastUpdated: time__namespace.getUnixTime()
        });
      }
      removed.push(clientID);
    }
  }
  if (removed.length > 0) {
    awareness.emit('change', [{ added: [], updated: [], removed }, origin]);
    awareness.emit('update', [{ added: [], updated: [], removed }, origin]);
  }
};

/**
 * @param {Awareness} awareness
 * @param {Array<number>} clients
 * @return {Uint8Array}
 */
const encodeAwarenessUpdate = (awareness, clients, states = awareness.states) => {
  const len = clients.length;
  const encoder = encoding__namespace.createEncoder();
  encoding__namespace.writeVarUint(encoder, len);
  for (let i = 0; i < len; i++) {
    const clientID = clients[i];
    const state = states.get(clientID) || null;
    const clock = /** @type {MetaClientState} */ (awareness.meta.get(clientID)).clock;
    encoding__namespace.writeVarUint(encoder, clientID);
    encoding__namespace.writeVarUint(encoder, clock);
    encoding__namespace.writeVarString(encoder, JSON.stringify(state));
  }
  return encoding__namespace.toUint8Array(encoder)
};

/**
 * Modify the content of an awareness update before re-encoding it to an awareness update.
 *
 * This might be useful when you have a central server that wants to ensure that clients
 * cant hijack somebody elses identity.
 *
 * @param {Uint8Array} update
 * @param {function(any):any} modify
 * @return {Uint8Array}
 */
const modifyAwarenessUpdate = (update, modify) => {
  const decoder = decoding__namespace.createDecoder(update);
  const encoder = encoding__namespace.createEncoder();
  const len = decoding__namespace.readVarUint(decoder);
  encoding__namespace.writeVarUint(encoder, len);
  for (let i = 0; i < len; i++) {
    const clientID = decoding__namespace.readVarUint(decoder);
    const clock = decoding__namespace.readVarUint(decoder);
    const state = JSON.parse(decoding__namespace.readVarString(decoder));
    const modifiedState = modify(state);
    encoding__namespace.writeVarUint(encoder, clientID);
    encoding__namespace.writeVarUint(encoder, clock);
    encoding__namespace.writeVarString(encoder, JSON.stringify(modifiedState));
  }
  return encoding__namespace.toUint8Array(encoder)
};

/**
 * @param {Awareness} awareness
 * @param {Uint8Array} update
 * @param {any} origin This will be added to the emitted change event
 */
const applyAwarenessUpdate = (awareness, update, origin) => {
  const decoder = decoding__namespace.createDecoder(update);
  const timestamp = time__namespace.getUnixTime();
  const added = [];
  const updated = [];
  const filteredUpdated = [];
  const removed = [];
  const len = decoding__namespace.readVarUint(decoder);
  for (let i = 0; i < len; i++) {
    const clientID = decoding__namespace.readVarUint(decoder);
    let clock = decoding__namespace.readVarUint(decoder);
    const state = JSON.parse(decoding__namespace.readVarString(decoder));
    const clientMeta = awareness.meta.get(clientID);
    const prevState = awareness.states.get(clientID);
    const currClock = clientMeta === undefined ? 0 : clientMeta.clock;
    if (currClock < clock || (currClock === clock && state === null && awareness.states.has(clientID))) {
      if (state === null) {
        // never let a remote client remove this local state
        if (clientID === awareness.clientID && awareness.getLocalState() != null) {
          // remote client removed the local state. Do not remote state. Broadcast a message indicating
          // that this client still exists by increasing the clock
          clock++;
        } else {
          awareness.states.delete(clientID);
        }
      } else {
        awareness.states.set(clientID, state);
      }
      awareness.meta.set(clientID, {
        clock,
        lastUpdated: timestamp
      });
      if (clientMeta === undefined && state !== null) {
        added.push(clientID);
      } else if (clientMeta !== undefined && state === null) {
        removed.push(clientID);
      } else if (state !== null) {
        if (!f__namespace.equalityDeep(state, prevState)) {
          filteredUpdated.push(clientID);
        }
        updated.push(clientID);
      }
    }
  }
  if (added.length > 0 || filteredUpdated.length > 0 || removed.length > 0) {
    awareness.emit('change', [{
      added, updated: filteredUpdated, removed
    }, origin]);
  }
  if (added.length > 0 || updated.length > 0 || removed.length > 0) {
    awareness.emit('update', [{
      added, updated, removed
    }, origin]);
  }
};

var Awareness_1 = Awareness;
var applyAwarenessUpdate_1 = applyAwarenessUpdate;
var encodeAwarenessUpdate_1 = encodeAwarenessUpdate;
var modifyAwarenessUpdate_1 = modifyAwarenessUpdate;
var outdatedTimeout_1 = outdatedTimeout;
var removeAwarenessStates_1 = removeAwarenessStates;


var awareness = /*#__PURE__*/Object.defineProperty({
	Awareness: Awareness_1,
	applyAwarenessUpdate: applyAwarenessUpdate_1,
	encodeAwarenessUpdate: encodeAwarenessUpdate_1,
	modifyAwarenessUpdate: modifyAwarenessUpdate_1,
	outdatedTimeout: outdatedTimeout_1,
	removeAwarenessStates: removeAwarenessStates_1
}, '__esModule', {value: true});

/**
 * Mutual exclude for JavaScript.
 *
 * @module mutex
 */

/**
 * @callback mutex
 * @param {function():void} cb Only executed when this mutex is not in the current stack
 * @param {function():void} [elseCb] Executed when this mutex is in the current stack
 */

/**
 * Creates a mutual exclude function with the following property:
 *
 * ```js
 * const mutex = createMutex()
 * mutex(() => {
 *   // This function is immediately executed
 *   mutex(() => {
 *     // This function is not executed, as the mutex is already active.
 *   })
 * })
 * ```
 *
 * @return {mutex} A mutual exclude function
 * @public
 */
const createMutex$1 = () => {
  let token = true;
  return (f, g) => {
    if (token) {
      token = false;
      try {
        f();
      } finally {
        token = true;
      }
    } else if (g !== undefined) {
      g();
    }
  }
};

var mutex$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  createMutex: createMutex$1
});

var createMutex_1 = createMutex$1;
var mutex_1$1 = mutex$2;


var mutex63f09c81 = {
	createMutex: createMutex_1,
	mutex: mutex_1$1
};

var mutex$1 = mutex63f09c81;

var createMutex = mutex$1.createMutex;


var mutex_1 = /*#__PURE__*/Object.defineProperty({
	createMutex: createMutex
}, '__esModule', {value: true});

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var lodash_debounce = debounce;

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

const fs = require('graceful-fs');
const path = require('path');
const assert = require('assert');

const isWindows = (process.platform === 'win32');

function defaults (options) {
  const methods = [
    'unlink',
    'chmod',
    'stat',
    'lstat',
    'rmdir',
    'readdir'
  ];
  methods.forEach(m => {
    options[m] = options[m] || fs[m];
    m = m + 'Sync';
    options[m] = options[m] || fs[m];
  });

  options.maxBusyTries = options.maxBusyTries || 3;
}

function rimraf (p, options, cb) {
  let busyTries = 0;

  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  assert(p, 'rimraf: missing path');
  assert.strictEqual(typeof p, 'string', 'rimraf: path should be a string');
  assert.strictEqual(typeof cb, 'function', 'rimraf: callback function required');
  assert(options, 'rimraf: invalid options argument provided');
  assert.strictEqual(typeof options, 'object', 'rimraf: options should be object');

  defaults(options);

  rimraf_(p, options, function CB (er) {
    if (er) {
      if ((er.code === 'EBUSY' || er.code === 'ENOTEMPTY' || er.code === 'EPERM') &&
          busyTries < options.maxBusyTries) {
        busyTries++;
        const time = busyTries * 100;
        // try again, with the same exact callback as this one.
        return setTimeout(() => rimraf_(p, options, CB), time)
      }

      // already gone
      if (er.code === 'ENOENT') er = null;
    }

    cb(er);
  });
}

// Two possible strategies.
// 1. Assume it's a file.  unlink it, then do the dir stuff on EPERM or EISDIR
// 2. Assume it's a directory.  readdir, then do the file stuff on ENOTDIR
//
// Both result in an extra syscall when you guess wrong.  However, there
// are likely far more normal files in the world than directories.  This
// is based on the assumption that a the average number of files per
// directory is >= 1.
//
// If anyone ever complains about this, then I guess the strategy could
// be made configurable somehow.  But until then, YAGNI.
function rimraf_ (p, options, cb) {
  assert(p);
  assert(options);
  assert(typeof cb === 'function');

  // sunos lets the root user unlink directories, which is... weird.
  // so we have to lstat here and make sure it's not a dir.
  options.lstat(p, (er, st) => {
    if (er && er.code === 'ENOENT') {
      return cb(null)
    }

    // Windows can EPERM on stat.  Life is suffering.
    if (er && er.code === 'EPERM' && isWindows) {
      return fixWinEPERM(p, options, er, cb)
    }

    if (st && st.isDirectory()) {
      return rmdir(p, options, er, cb)
    }

    options.unlink(p, er => {
      if (er) {
        if (er.code === 'ENOENT') {
          return cb(null)
        }
        if (er.code === 'EPERM') {
          return (isWindows)
            ? fixWinEPERM(p, options, er, cb)
            : rmdir(p, options, er, cb)
        }
        if (er.code === 'EISDIR') {
          return rmdir(p, options, er, cb)
        }
      }
      return cb(er)
    });
  });
}

function fixWinEPERM (p, options, er, cb) {
  assert(p);
  assert(options);
  assert(typeof cb === 'function');

  options.chmod(p, 0o666, er2 => {
    if (er2) {
      cb(er2.code === 'ENOENT' ? null : er);
    } else {
      options.stat(p, (er3, stats) => {
        if (er3) {
          cb(er3.code === 'ENOENT' ? null : er);
        } else if (stats.isDirectory()) {
          rmdir(p, options, er, cb);
        } else {
          options.unlink(p, cb);
        }
      });
    }
  });
}

function fixWinEPERMSync (p, options, er) {
  let stats;

  assert(p);
  assert(options);

  try {
    options.chmodSync(p, 0o666);
  } catch (er2) {
    if (er2.code === 'ENOENT') {
      return
    } else {
      throw er
    }
  }

  try {
    stats = options.statSync(p);
  } catch (er3) {
    if (er3.code === 'ENOENT') {
      return
    } else {
      throw er
    }
  }

  if (stats.isDirectory()) {
    rmdirSync(p, options, er);
  } else {
    options.unlinkSync(p);
  }
}

function rmdir (p, options, originalEr, cb) {
  assert(p);
  assert(options);
  assert(typeof cb === 'function');

  // try to rmdir first, and only readdir on ENOTEMPTY or EEXIST (SunOS)
  // if we guessed wrong, and it's not a directory, then
  // raise the original error.
  options.rmdir(p, er => {
    if (er && (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM')) {
      rmkids(p, options, cb);
    } else if (er && er.code === 'ENOTDIR') {
      cb(originalEr);
    } else {
      cb(er);
    }
  });
}

function rmkids (p, options, cb) {
  assert(p);
  assert(options);
  assert(typeof cb === 'function');

  options.readdir(p, (er, files) => {
    if (er) return cb(er)

    let n = files.length;
    let errState;

    if (n === 0) return options.rmdir(p, cb)

    files.forEach(f => {
      rimraf(path.join(p, f), options, er => {
        if (errState) {
          return
        }
        if (er) return cb(errState = er)
        if (--n === 0) {
          options.rmdir(p, cb);
        }
      });
    });
  });
}

// this looks simpler, and is strictly *faster*, but will
// tie up the JavaScript thread and fail on excessively
// deep directory trees.
function rimrafSync (p, options) {
  let st;

  options = options || {};
  defaults(options);

  assert(p, 'rimraf: missing path');
  assert.strictEqual(typeof p, 'string', 'rimraf: path should be a string');
  assert(options, 'rimraf: missing options');
  assert.strictEqual(typeof options, 'object', 'rimraf: options should be object');

  try {
    st = options.lstatSync(p);
  } catch (er) {
    if (er.code === 'ENOENT') {
      return
    }

    // Windows can EPERM on stat.  Life is suffering.
    if (er.code === 'EPERM' && isWindows) {
      fixWinEPERMSync(p, options, er);
    }
  }

  try {
    // sunos lets the root user unlink directories, which is... weird.
    if (st && st.isDirectory()) {
      rmdirSync(p, options, null);
    } else {
      options.unlinkSync(p);
    }
  } catch (er) {
    if (er.code === 'ENOENT') {
      return
    } else if (er.code === 'EPERM') {
      return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er)
    } else if (er.code !== 'EISDIR') {
      throw er
    }
    rmdirSync(p, options, er);
  }
}

function rmdirSync (p, options, originalEr) {
  assert(p);
  assert(options);

  try {
    options.rmdirSync(p);
  } catch (er) {
    if (er.code === 'ENOTDIR') {
      throw originalEr
    } else if (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM') {
      rmkidsSync(p, options);
    } else if (er.code !== 'ENOENT') {
      throw er
    }
  }
}

function rmkidsSync (p, options) {
  assert(p);
  assert(options);
  options.readdirSync(p).forEach(f => rimrafSync(path.join(p, f), options));

  if (isWindows) {
    // We only end up here once we got ENOTEMPTY at least once, and
    // at this point, we are guaranteed to have removed all the kids.
    // So, we know that it won't be ENOENT or ENOTDIR or anything else.
    // try really hard to delete stuff on windows, because it has a
    // PROFOUNDLY annoying habit of not closing handles promptly when
    // files are deleted, resulting in spurious ENOTEMPTY errors.
    const startTime = Date.now();
    do {
      try {
        const ret = options.rmdirSync(p, options);
        return ret
      } catch {}
    } while (Date.now() - startTime < 500) // give up after 500ms
  } else {
    const ret = options.rmdirSync(p, options);
    return ret
  }
}

module.exports = rimraf;
rimraf.sync = rimrafSync;

function _interopDefault$1 (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }







var defaultLevel = _interopDefault$1(browser$1);


const PREFERRED_TRIM_SIZE = 500;

const YEncodingString = 0;
const YEncodingUint32 = 1;

const valueEncoding = {
  buffer: true,
  type: 'y-value',
  encode: /** @param {any} data */ data => data,
  decode: /** @param {any} data */ data => data
};

/**
 * Write two bytes as an unsigned integer in big endian order.
 * (most significant byte first)
 *
 * @function
 * @param {encoding.Encoder} encoder
 * @param {number} num The number that is to be encoded.
 */
const writeUint32BigEndian = (encoder, num) => {
  for (let i = 3; i >= 0; i--) {
    encoding.write(encoder, (num >>> (8 * i)) & binary.BITS8);
  }
};

/**
 * Read 4 bytes as unsigned integer in big endian order.
 * (most significant byte first)
 *
 * @todo use lib0/decoding instead
 *
 * @function
 * @param {decoding.Decoder} decoder
 * @return {number} An unsigned integer.
 */
const readUint32BigEndian = decoder => {
  const uint =
    (decoder.arr[decoder.pos + 3] +
    (decoder.arr[decoder.pos + 2] << 8) +
    (decoder.arr[decoder.pos + 1] << 16) +
    (decoder.arr[decoder.pos] << 24)) >>> 0;
  decoder.pos += 4;
  return uint
};

const keyEncoding = {
  buffer: true,
  type: 'y-keys',
  /* istanbul ignore next */
  encode: /** @param {Array<string|number>} arr */  arr => {
    const encoder = encoding.createEncoder();
    for (let i = 0; i < arr.length; i++) {
      const v = arr[i];
      if (typeof v === 'string') {
        encoding.writeUint8(encoder, YEncodingString);
        encoding.writeVarString(encoder, v);
      } else /* istanbul ignore else */ if (typeof v === 'number') {
        encoding.writeUint8(encoder, YEncodingUint32);
        writeUint32BigEndian(encoder, v);
      } else {
        throw new Error('Unexpected key value')
      }
    }
    return require$$0__default["default"].Buffer.from(encoding.toUint8Array(encoder))
  },
  decode: /** @param {Uint8Array} buf */ buf => {
    const decoder = decoding.createDecoder(buf);
    const key = [];
    while (decoding.hasContent(decoder)) {
      switch (decoding.readUint8(decoder)) {
        case YEncodingString:
          key.push(decoding.readVarString(decoder));
          break
        case YEncodingUint32:
          key.push(readUint32BigEndian(decoder));
          break
      }
    }
    return key
  }
};

/**
 * level returns an error if a value is not found.
 *
 * This helper method for level returns `null` instead if the key is not found.
 *
 * @param {any} db
 * @param {any} key
 */
const levelGet = async (db, key) => {
  let res;
  try {
    res = await db.get(key);
  } catch (err) {
    /* istanbul ignore else */
    if (err.notFound) {
      return null
    } else {
      throw err
    }
  }
  return res
};

/**
 * Level expects a Buffer, but in Yjs we typically work with Uint8Arrays.
 *
 * Since Level thinks that these are two entirely different things,
 * we transform the Uint8array to a Buffer before storing it.
 *
 * @param {any} db
 * @param {any} key
 * @param {Uint8Array} val
 */
const levelPut = async (db, key, val) => db.put(key, require$$0__default["default"].Buffer.from(val));

/**
 * A "bulkier" implementation of level streams. Returns the result in one flush.
 *
 * @param {any} db
 * @param {object} opts
 * @return {Promise<Array<any>>}
 */
const getLevelBulkData = (db, opts) => promise.create((resolve, reject) => {
  /**
   * @type {Array<any>} result
   */
  const result = [];
  db.createReadStream(
    opts
  ).on('data', /** @param {any} data */ data =>
    result.push(data)
  ).on('end', () =>
    resolve(result)
  ).on('error', reject);
});

/**
 * Get all document updates for a specific document.
 *
 * @param {any} db
 * @param {string} docName
 * @param {any} [opts]
 * @return {Promise<Array<Buffer>>}
 */
const getLevelUpdates = (db, docName, opts = { values: true, keys: false }) => getLevelBulkData(db, {
  gte: createDocumentUpdateKey(docName, 0),
  lt: createDocumentUpdateKey(docName, binary.BITS32),
  ...opts
});

/**
 * Get all document updates for a specific document.
 *
 * @param {any} db
 * @param {boolean} values
 * @param {boolean} keys
 * @return {Promise<Array<any>>}
 */
const getAllDocs = (db, values, keys) => getLevelBulkData(db, {
  gte: ['v1_sv'],
  lt: ['v1_sw'],
  keys,
  values
});

/**
 * @param {any} db
 * @param {string} docName
 * @return {Promise<number>} Returns -1 if this document doesn't exist yet
 */
const getCurrentUpdateClock = (db, docName) => getLevelUpdates(db, docName, { keys: true, values: false, reverse: true, limit: 1 }).then(keys => {
  if (keys.length === 0) {
    return -1
  } else {
    return keys[0][3]
  }
});

/**
 * @param {any} db
 * @param {Array<string|number>} gte Greater than or equal
 * @param {Array<string|number>} lt lower than (not equal)
 * @return {Promise<void>}
 */
const clearRange = async (db, gte, lt) => {
  /* istanbul ignore else */
  if (db.supports.clear) {
    await db.clear({ gte, lt });
  } else {
    const keys = await getLevelBulkData(db, { values: false, keys: true, gte, lt });
    const ops = keys.map(key => ({ type: 'del', key }));
    await db.batch(ops);
  }
};

/**
 * @param {any} db
 * @param {string} docName
 * @param {number} from Greater than or equal
 * @param {number} to lower than (not equal)
 * @return {Promise<void>}
 */
const clearUpdatesRange = async (db, docName, from, to) => clearRange(db, createDocumentUpdateKey(docName, from), createDocumentUpdateKey(docName, to));

/**
 * Create a unique key for a update message.
 * We encode the result using `keyEncoding` which expects an array.
 *
 * @param {string} docName
 * @param {number} clock must be unique
 * @return {Array<string|number>}
 */
const createDocumentUpdateKey = (docName, clock) => ['v1', docName, 'update', clock];

/**
 * @param {string} docName
 * @param {string} metaKey
 */
const createDocumentMetaKey = (docName, metaKey) => ['v1', docName, 'meta', metaKey];

/**
 * @param {string} docName
 */
const createDocumentMetaEndKey = (docName) => ['v1', docName, 'metb']; // simple trick

/**
 * We have a separate state vector key so we can iterate efficiently over all documents
 * @param {string} docName
 */
const createDocumentStateVectorKey = (docName) => ['v1_sv', docName];

/**
 * @param {string} docName
 */
const createDocumentFirstKey = (docName) => ['v1', docName];

/**
 * We use this key as the upper limit of all keys that can be written.
 * Make sure that all document keys are smaller! Strings are encoded using varLength string encoding,
 * so we need to make sure that this key has the biggest size!
 *
 * @param {string} docName
 */
const createDocumentLastKey = (docName) => ['v1', docName, 'zzzzzzz'];

// const emptyStateVector = (() => Y.encodeStateVector(new Y.Doc()))()

/**
 * For now this is a helper method that creates a Y.Doc and then re-encodes a document update.
 * In the future this will be handled by Yjs without creating a Y.Doc (constant memory consumption).
 *
 * @param {Array<Uint8Array>} updates
 * @return {{update:Uint8Array, sv: Uint8Array}}
 */
const mergeUpdates = (updates) => {
  const ydoc = new Y.Doc();
  ydoc.transact(() => {
    for (let i = 0; i < updates.length; i++) {
      Y.applyUpdate(ydoc, updates[i]);
    }
  });
  return { update: Y.encodeStateAsUpdate(ydoc), sv: Y.encodeStateVector(ydoc) }
};

/**
 * @param {any} db
 * @param {string} docName
 * @param {Uint8Array} sv state vector
 * @param {number} clock current clock of the document so we can determine when this statevector was created
 */
const writeStateVector = async (db, docName, sv, clock) => {
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, clock);
  encoding.writeVarUint8Array(encoder, sv);
  await levelPut(db, createDocumentStateVectorKey(docName), encoding.toUint8Array(encoder));
};

/**
 * @param {Uint8Array} buf
 * @return {{ sv: Uint8Array, clock: number }}
 */
const decodeLeveldbStateVector = buf => {
  const decoder = decoding.createDecoder(buf);
  const clock = decoding.readVarUint(decoder);
  const sv = decoding.readVarUint8Array(decoder);
  return { sv, clock }
};

/**
 * @param {any} db
 * @param {string} docName
 */
const readStateVector = async (db, docName) => {
  const buf = await levelGet(db, createDocumentStateVectorKey(docName));
  if (buf === null) {
    // no state vector created yet or no document exists
    return { sv: null, clock: -1 }
  }
  return decodeLeveldbStateVector(buf)
};

/**
 * @param {any} db
 * @param {string} docName
 * @param {Uint8Array} stateAsUpdate
 * @param {Uint8Array} stateVector
 * @return {Promise<number>} returns the clock of the flushed doc
 */
const flushDocument = async (db, docName, stateAsUpdate, stateVector) => {
  const clock = await storeUpdate(db, docName, stateAsUpdate);
  await writeStateVector(db, docName, stateVector, clock);
  await clearUpdatesRange(db, docName, 0, clock); // intentionally not waiting for the promise to resolve!
  return clock
};

/**
 * @param {any} db
 * @param {string} docName
 * @param {Uint8Array} update
 * @return {Promise<number>} Returns the clock of the stored update
 */
const storeUpdate = async (db, docName, update) => {
  const clock = await getCurrentUpdateClock(db, docName);
  if (clock === -1) {
    // make sure that a state vector is aways written, so we can search for available documents
    const ydoc = new Y.Doc();
    Y.applyUpdate(ydoc, update);
    const sv = Y.encodeStateVector(ydoc);
    await writeStateVector(db, docName, sv, 0);
  }
  await levelPut(db, createDocumentUpdateKey(docName, clock + 1), update);
  return clock + 1
};

class LeveldbPersistence {
  /**
   * @param {string} location
   * @param {object} [opts]
   * @param {any} [opts.level] Level-compatible adapter. E.g. leveldown, level-rem, level-indexeddb. Defaults to `level`
   * @param {object} [opts.levelOptions] Options that are passed down to the level instance
   */
  constructor (location, /* istanbul ignore next */ { level = defaultLevel, levelOptions = {} } = {}) {
    const db = level(location, { ...levelOptions, valueEncoding, keyEncoding });
    this.tr = promise.resolve();
    /**
     * Execute an transaction on a database. This will ensure that other processes are currently not writing.
     *
     * This is a private method and might change in the future.
     *
     * @todo only transact on the same room-name. Allow for concurrency of different rooms.
     *
     * @template T
     *
     * @param {function(any):Promise<T>} f A transaction that receives the db object
     * @return {Promise<T>}
     */
    this._transact = f => {
      const currTr = this.tr;
      this.tr = (async () => {
        await currTr;
        let res = /** @type {any} */ (null);
        try {
          res = await f(db);
        } catch (err) {
          /* istanbul ignore next */
          console.warn('Error during y-leveldb transaction', err);
        }
        return res
      })();
      return this.tr
    };
  }

  /**
   * @param {string} docName
   */
  flushDocument (docName) {
    return this._transact(async db => {
      const updates = await getLevelUpdates(db, docName);
      const { update, sv } = mergeUpdates(updates);
      await flushDocument(db, docName, update, sv);
    })
  }

  /**
   * @param {string} docName
   * @return {Promise<Y.Doc>}
   */
  getYDoc (docName) {
    return this._transact(async db => {
      const updates = await getLevelUpdates(db, docName);
      const ydoc = new Y.Doc();
      ydoc.transact(() => {
        for (let i = 0; i < updates.length; i++) {
          Y.applyUpdate(ydoc, updates[i]);
        }
      });
      if (updates.length > PREFERRED_TRIM_SIZE) {
        await flushDocument(db, docName, Y.encodeStateAsUpdate(ydoc), Y.encodeStateVector(ydoc));
      }
      return ydoc
    })
  }

  /**
   * @param {string} docName
   * @return {Promise<Uint8Array>}
   */
  getStateVector (docName) {
    return this._transact(async db => {
      const { clock, sv } = await readStateVector(db, docName);
      let curClock = -1;
      if (sv !== null) {
        curClock = await getCurrentUpdateClock(db, docName);
      }
      if (sv !== null && clock === curClock) {
        return sv
      } else {
        // current state vector is outdated
        const updates = await getLevelUpdates(db, docName);
        const { update, sv } = mergeUpdates(updates);
        await flushDocument(db, docName, update, sv);
        return sv
      }
    })
  }

  /**
   * @param {string} docName
   * @param {Uint8Array} update
   * @return {Promise<number>} Returns the clock of the stored update
   */
  storeUpdate (docName, update) {
    return this._transact(db => storeUpdate(db, docName, update))
  }

  /**
   * @param {string} docName
   * @param {Uint8Array} stateVector
   */
  async getDiff (docName, stateVector) {
    const ydoc = await this.getYDoc(docName);
    return Y.encodeStateAsUpdate(ydoc, stateVector)
  }

  /**
   * @param {string} docName
   * @return {Promise<void>}
   */
  clearDocument (docName) {
    return this._transact(async db => {
      await db.del(createDocumentStateVectorKey(docName));
      await clearRange(db, createDocumentFirstKey(docName), createDocumentLastKey(docName));
    })
  }

  /**
   * @param {string} docName
   * @param {string} metaKey
   * @param {any} value
   * @return {Promise<void>}
   */
  setMeta (docName, metaKey, value) {
    return this._transact(db => levelPut(db, createDocumentMetaKey(docName, metaKey), buffer.encodeAny(value)))
  }

  /**
   * @param {string} docName
   * @param {string} metaKey
   * @return {Promise<any>}
   */
  delMeta (docName, metaKey) {
    return this._transact(db => db.del(createDocumentMetaKey(docName, metaKey)))
  }

  /**
   * @param {string} docName
   * @param {string} metaKey
   * @return {Promise<any>}
   */
  getMeta (docName, metaKey) {
    return this._transact(async db => {
      const res = await levelGet(db, createDocumentMetaKey(docName, metaKey));
      if (res === null) {
        return// return void
      }
      return buffer.decodeAny(res)
    })
  }

  /**
   * @return {Promise<Array<string>>}
   */
  getAllDocNames () {
    return this._transact(async db => {
      const docKeys = await getAllDocs(db, false, true);
      return docKeys.map(key => key[1])
    })
  }

  /**
   * @return {Promise<Array<{ name: string, sv: Uint8Array, clock: number }>>}
   */
  getAllDocStateVecors () {
    return this._transact(async db => {
      const docs = /** @type {any} */ (await getAllDocs(db, true, true));
      return docs.map(doc => {
        const { sv, clock } = decodeLeveldbStateVector(doc.value);
        return { name: doc.key[1], sv, clock }
      })
    })
  }

  /**
   * @param {string} docName
   * @return {Promise<Map<string, any>>}
   */
  getMetas (docName) {
    return this._transact(async db => {
      const data = await getLevelBulkData(db, {
        gte: createDocumentMetaKey(docName, ''),
        lt: createDocumentMetaEndKey(docName),
        keys: true,
        values: true
      });
      const metas = new Map();
      data.forEach(v => { metas.set(v.key[3], buffer.decodeAny(v.value)); });
      return metas
    })
  }

  /**
   * Close connection to a leveldb database and discard all state and bindings
   *
   * @return {Promise<void>}
   */
  destroy () {
    return this._transact(db => db.close())
  }

  /**
   * Delete all data in database.
   */
  clearAll () {
    return this._transact(async db => db.clear())
  }
}

var LeveldbPersistence_1 = LeveldbPersistence;
var PREFERRED_TRIM_SIZE_1 = PREFERRED_TRIM_SIZE;
var getAllDocs_1 = getAllDocs;
var getCurrentUpdateClock_1 = getCurrentUpdateClock;
var getLevelBulkData_1 = getLevelBulkData;
var getLevelUpdates_1 = getLevelUpdates;
var keyEncoding_1 = keyEncoding;
var readUint32BigEndian_1 = readUint32BigEndian;
var writeUint32BigEndian_1 = writeUint32BigEndian;


var yLeveldb = /*#__PURE__*/Object.defineProperty({
	LeveldbPersistence: LeveldbPersistence_1,
	PREFERRED_TRIM_SIZE: PREFERRED_TRIM_SIZE_1,
	getAllDocs: getAllDocs_1,
	getCurrentUpdateClock: getCurrentUpdateClock_1,
	getLevelBulkData: getLevelBulkData_1,
	getLevelUpdates: getLevelUpdates_1,
	keyEncoding: keyEncoding_1,
	readUint32BigEndian: readUint32BigEndian_1,
	writeUint32BigEndian: writeUint32BigEndian_1
}, '__esModule', {value: true});

var mutex = mutex_1;

var require$$0 = callback;

var require$$2 = yLeveldb;

const callbackHandler = require$$0.callbackHandler;
const isCallbackSet = require$$0.isCallbackSet;

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
  const LeveldbPersistence = require$$2.LeveldbPersistence;
  const ldb = new LeveldbPersistence(persistenceDir);
  persistence = {
    provider: ldb,
    bindState: async (docName, ydoc) => {
      const persistedYdoc = await ldb.getYDoc(docName);
      const newUpdates = Y.encodeStateAsUpdate(ydoc);
      ldb.storeUpdate(docName, newUpdates);
      Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc));
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
  // This example sets conn.isReadOnly to false.
  conn.isReadyOnly = false;
  // You can set conn.authStatus to a denied reason and return false
  // if (doc.name !== token) {
  //    conn.authStatus = "403 Forbidden" //Auto-terminates the websocket provider
  //    return false
  // }
  return true
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
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, messageSync);
  sync.writeUpdate(encoder, update);
  const message = encoding.toUint8Array(encoder);
  doc.conns.forEach((_, conn) => send(doc, conn, message));
};

class WSSharedDoc extends Y.Doc {
  /**
   * @param {string} name
   */
  constructor (name) {
    super({ gc: gcEnabled });
    this.name = name;
    this.mux = mutex.createMutex();
    /**
     * Maps from conn to set of controlled user ids. Delete all user ids from awareness when this conn is closed
     * @type {Map<Object, Set<number>>}
     */
    this.conns = new Map();
    /**
     * @type {awarenessProtocol.Awareness}
     */
    this.awareness = new awareness.Awareness(this);
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
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageAwareness);
      encoding.writeVarUint8Array(encoder, awareness.encodeAwarenessUpdate(this.awareness, changedClients));
      const buff = encoding.toUint8Array(encoder);
      this.conns.forEach((_, c) => {
        send(this, c, buff);
      });
    };
    this.awareness.on('update', awarenessChangeHandler);
    this.on('update', updateHandler);
    if (isCallbackSet) {
      this.on('update', lodash_debounce(
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
const getYDoc = (docname, gc = true) => map.setIfUndefined(docs, docname, () => {
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
    const encoder = encoding.createEncoder();
    const decoder = decoding.createDecoder(message);
    const messageType = decoding.readVarUint(decoder);
    switch (messageType) {
      case messageSync:
        encoding.writeVarUint(encoder, messageSync);
        sync.readSyncMessage(decoder, encoder, doc, conn);
        if (encoding.length(encoder) > 1) {
          send(doc, conn, encoding.toUint8Array(encoder));
        }
        break
      case messageAwareness: {
        awareness.applyAwarenessUpdate(doc.awareness, decoding.readVarUint8Array(decoder), conn);
        break
      }
      case messageAuth: {
        encoding.writeVarUint(encoder, messageAuth);
        const authorized = authProtocol.verifyAuthMessage(decoder, doc, conn, authorize);
        conn.authorized = authorized;
        if (authorized) {
          authProtocol.writePermissionApproved(encoder, conn.authStatus);
          send(doc, conn, encoding.toUint8Array(encoder));
          sendSync(doc, conn);
        } else {
          authProtocol.writePermissionDenied(encoder, conn.authStatus);
          conn.destroy();
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
    awareness.removeAwarenessStates(doc.awareness, Array.from(controlledIds), null);
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
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, messageSync);
  sync.writeSyncStep1(encoder, doc);
  send(doc, conn, encoding.toUint8Array(encoder));
  const awarenessStates = doc.awareness.getStates();
  if (awarenessStates.size > 0) {
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageAwareness);
    encoding.writeVarUint8Array(encoder, awareness.encodeAwarenessUpdate(doc.awareness, Array.from(awarenessStates.keys())));
    send(doc, conn, encoding.toUint8Array(encoder));
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

exports.LeveldbPersistence = LeveldbPersistence$1;
exports.WSUtils = utils.WSUtils;
//# sourceMappingURL=y-tiddlywiki-server.cjs.map