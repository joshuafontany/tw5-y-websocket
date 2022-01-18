import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

// If truthy, it expects all y-* dependencies in the upper directory.
// This is only necessary if you want to test and make changes to several repositories.
const localImports = process.env.LOCALIMPORTS

const externalModules = new Set([
  'yjs',
  'y-protocols',
  'lib0',
  'lodash.debounce',
  'fs-extra',
  'y-leveldb',
  'http',
  'buffer'
])

const customModules = new Set([
  'y-websocket',
  'y-tiddlywiki'
])
/**
 * @type {Set<any>}
 */
const customLibModules = new Set([
  'lib0',
  'y-protocols'
])

const ytiddlywikiResolve = {
  resolveId (importee) {
    if (importee === 'y-tiddlywiki') {
      return `${process.cwd()}/src/y-tiddlywiki.js`
    }
    if (importee === 'yjs') {
      return `${process.cwd()}/node_modules/yjs/src/index.js`
    }
    return null
  }
}

const debugResolve = {
  resolveId (importee) {
    if (localImports) {
      if (importee === 'yjs/tests/testHelper.js') {
        return `${process.cwd()}/../yjs/tests/testHelper.js`
      }
      if (importee === 'yjs') {
        return `${process.cwd()}/../yjs/src/index.js`
      }
      if (customModules.has(importee.split('/')[0])) {
        return `${process.cwd()}/../${importee}/src/${importee}.js`
      }
      if (customLibModules.has(importee.split('/')[0])) {
        return `${process.cwd()}/../${importee}`
      }
    }
    return null
  }
}

export default [{
  input: './rollup/y-tiddlywiki-core.js',
  output: [{
    name: 'YCore',
    file: 'src/modules/y-tiddlywiki-core.js',
    format: 'umd',
    sourcemap: true
  }],
  plugins: [
    //ytiddlywikiResolve,
    debugResolve,
    nodeResolve(),
    commonjs({
      include: 'node_modules/**'
    })
  ]
},{
  input: 'node_modules/y-websocket/bin/utils.js',
  output: [{
    file: 'src/modules/wsutils.cjs',
    format: 'cjs',
    exports: 'named',
    sourcemap: true
  }],
  plugins: [
    //ytiddlywikiResolve,
    debugResolve,
    //nodeResolve(),
    commonjs({
      include: 'node_modules/**'
    })
  ]
}]
