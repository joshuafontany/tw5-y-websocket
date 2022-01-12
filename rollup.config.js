import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

// If truthy, it expects all y-* dependencies in the upper directory.
// This is only necessary if you want to test and make changes to several repositories.
const localImports = process.env.LOCALIMPORTS

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
  input: './rollup/y-tiddlywiki-client.js',
  output: [{
    name: 'YClient',
    file: 'src/modules/y-tiddlywiki-client.js',
    format: 'umd',
    sourcemap: true
  }],
  plugins: [
    //ytiddlywikiResolve,
    debugResolve,
    nodeResolve({
      mainFields: ['module', 'browser', 'main']
    }),
    commonjs({
      include: 'node_modules/**'
    })
  ]
},{
  input: './rollup/y-tiddlywiki-server.js',
  output: [{
    name: 'YServer',
    file: 'src/modules/y-tiddlywiki-server.cjs',
    format: 'cjs',
    sourcemap: true
  }],
  plugins: [
    //ytiddlywikiResolve,
    debugResolve,
    nodeResolve({
      mainFields: ['module', 'browser', 'main']
    }),
    commonjs({
      include: 'node_modules/**'
    })
  ]
}]
