/*!
 * Module dependencies
 */

var debug = require('sherlock')('struct:namespace');
var Hash = require('gaia-hash').Hash;

var Struct = require('./struct').Struct;

/**
 * Namespace constructors.
 *
 * @param {String} key
 */

var Namespace = exports.Namespace = function(key) {
  if (!(this instanceof Namespace)) return new Namespace(key);
  this.structs = new Hash();
};

/*!
 * Prototype
 */

Namespace.prototype = {

  constructor: Namespace,

  /**
   * Define a struct in this namespace
   *
   * @param {String} key
   * @param {Object} schema specification
   * @api public
   */

  define: function(key, spec) {
    key = key.toLowerCase();
    var Klass = Struct.extend(key, spec);
    this.structs.set(key, Klass);
    debug('(define) struct: %s', key);
    return Klass;
  },

  /**
   * Create a struct instance
   *
   * @param {String} key
   * @param {Object} attributes
   * @api public
   */

  create: function(key, attr) {
    key = key.toLowerCase();
    var Klass = this.structs.get(key);
    if (!Klass) throw new Error('struct "' + key + '" does not exist');
    debug('(create) struct: %s', key);
    return new Klass(attr);
  }

}
