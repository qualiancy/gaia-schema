/*!
 * schema constructor
 * Copyright(c) 2013-2014 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var debug = require('sherlock')('struct');
var hash = require('gaia-hash');
var merge = require('tea-merge');
var properties = require('pathval');
var typeOf = require('type-detect');

/*!
 * Internal dependencies
 */

var parse = require('./parse');

function hasValue(val) {
  return 'undefined' !== typeOf(val)
    && 'null' !== typeOf(val);
}

/*!
 * Constants
 */

var DEFAULTS = {
  partials: false,    // should validate with missing required fields
  immediate: true     // should validate on set; `false` means only on {un}wrap
};

/**
 * ### Schema(spec)
 *
 * @param {Object} specification
 * @return {Schema}
 */

var Schema = exports.Schema = function Schema(spec, opts) {
  if (!(this instanceof Schema)) return new Schema(spec, opts);
  this._opts = merge({}, DEFAULTS, opts || {});
  this._spec = spec;
  this.paths = new hash.Hash();
  this.types = new hash.Hash();
  parse.spec(this, this._spec);
};

Schema.Type = require('./type');

Schema.prototype = {

  constructor: Schema,

  /**
   * #### .validate(data)
   *
   * Validate an object against the schema.
   *
   * @param {Object} data
   * @return {Object} result
   */

  validate: function(data) {
    var self = this;
    var errors = [];

    this.paths.each(function(spec, path) {
      var datum = properties.get({ __root: data }, path);
      try { self.validatePath(path, datum); }
      catch(e) { errors.push(e); }
    });

    if (errors.length) {
      throw new AssertionError('validation failed due to error(s)', {
        expected: [],
        actual: errors
      });
    }

    return true;
  },

  validatePath: function(path, datum) {
    var spec = this.paths.get(path);
    var type = this.types.get(spec.type);

    if (!hasValue(datum) && hasValue(spec.default)) {
      datum = spec.default;
    }

    // TODO: options
    if (!hasValue(datum) && true === spec.required) {
      throw new AssertionError('missing required field at ' + path + '.', {
        actual: typeof datum,
        expected: spec.type,
      });
    }

    if (!hasValue(datum)) return true;
    var err = type.rejected(datum, spec);
    if (err) throw err;
    return true;
  },

  /**
   * #### .extract(data)
   *
   * Invoke the schema's extract rules on a given
   * object. Result includes a new object that
   * is compliant with the schema's validation
   * rules.
   *
   * @param {Object} data
   * @return {Object} result
   */

  // wrap
  wrap: function(data) {
    var types = this.types;
    var errors = [];
    var obj = {};

    this.paths.each(function(spec, path) {
      var type = types.get(spec.type);
      var datum = properties.get({ __root: data }, path);
      var wrapped;

      try {
        wrapped = type.wrap(datum, spec);
      } catch(ex) {
        errors.push(ex);
        return;
      }

      properties.set(obj, path, wrapped);
    });

    var res = {};
    res.valid = errors.length ? false : true;
    res.errors = errors;
    res.object = obj;
    return res;
  },

  /**
   * #### .cast(data)
   *
   * Invoke the schema's cast rules on a given
   * object. Result includes a new object.
   *
   * @param {Object} data
   * @return {Object} result
   */

  // unwrap
  unwrap: function(data) {
    var pre = this.validate(data);
    var types = this.types;

    if (!pre.valid) {
      pre.object = null;
      return pre;
    }

    var errors = [];
    var obj = {};

    this.paths.each(function(spec, path) {
      var type = types.get(spec.type);
      var datum = properties.get({ __root: data }, path);
      var unwrapped;

      if (!hasValue(datum) && hasValue(spec.default)) {
        datum = spec.default;
      }

      if (!hasValue(datum)) return;

      try {
        unwrapped = type.cast(datum, spec);
      } catch(ex) {
        errors.push(ex);
        return;
      }

      properties.set(obj, path, unwrapped);
    });

    var res = {};
    res.valid = errors.length ? false : true;
    res.errors = errors;
    res.casted = obj.__root;
    return res;
  },

};
