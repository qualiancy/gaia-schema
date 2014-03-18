/*!
 * Module dependencies
 */

var debug = require('sherlock')('struct');
var Hash = require('gaia-hash').Hash;
var Namespace = require('./lib/namespace').Namespace;

/*!
 * Primary exports
 */

var exports = module.exports = createNamespace;

/*!
 * Spaces `HashMap`
 */

var spaces = exports.spaces = new Hash();

/*!
 *
 */

exports.Namespace = Namespace;
exports.Struct = require('./lib/struct').Struct;
exports.Schema = require('./lib/schema').Schema;

/**
 * Create a namespace.
 *
 * @param {String} namespace key
 */

function createNamespace(key) {
  var ns = new Namespace(ns);
  spaces.set(key, ns);
  debug('(namespace) create: %s', key);
  return ns;
}
