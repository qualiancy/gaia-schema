/*!
 * schema constructor
 * Copyright(c) 2013-2014 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var AssertionError = require('assertion-error');
var debug = require('sherlock')('struct');
var hash = require('gaia-hash');
var merge = require('tea-merge');
var properties = require('pathval');
var typeOf = require('type-detect');

/*!
 * Internal dependencies
 */

var parse = require('./parse');
var types = require('./types');

function hasValue(val) {
  return 'undefined' !== typeOf(val) && 'null' !== typeOf(val);
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

Schema.Type = require('gaia-schematype');

Schema.type = function(key) {
  return types[key.toLowerCase()];
};

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

  validate: function(data, ignore_missing) {
    var self = this;
    var errors = [];

    this.paths.each(function(spec, path) {
      var datum = properties.get({ __root: data }, path);
      try { self.validatePath(path, datum); }
      catch(e) { return errors.push(e); }
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
      throw new AssertionError('missing required field at ' + path, {
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
    var self = this;
    var types = this.types;
    var errors = [];
    var obj = {};

    this.paths.each(function(spec, path) {
      var datum = properties.get({ __root: data }, path);
      try { var wrapped = self.wrapPath(path, datum); }
      catch (e) { return errors.push(e); }
      properties.set(obj, path, wrapped);
    });

    // TODO: options
    if (errors.length) {
      throw new AssertionError('wrap failed due to error(s)', {
        expected: [],
        actual: errors
      });
    }

    this.validate(obj.__root);
    return obj.__root;
  },

  wrapPath: function(path, datum) {
    var spec = this.paths.get(path);
    var type = this.types.get(spec.type);
    return type.wrap(datum, spec);
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

  unwrap: function(data) {
    var self = this;
    var errors = [];
    var obj = {};

    this.validate(data);
    this.paths.each(function(spec, path) {
      var datum = properties.get({ __root: data }, path);
      try { var unwrapped = self.unwrapPath(path, datum) }
      catch (e) { return errors.push(e); }
      properties.set(obj, path, unwrapped);
    });

    if (errors.length) {
      throw new AssertionError('unwrap failed due to error(s)', {
        expected: [],
        actual: errors
      });
    }

    return obj.__root;
  },

  unwrapPath: function(path, datum) {
    var spec = this.paths.get(path);
    var type = this.types.get(spec.type);

    if (!hasValue(datum) && hasValue(spec.default)) {
      datum = spec.default;
    } else if (!hasValue(datum)) {
      return datum;
    }

    return type.unwrap(datum, spec);
  }

};
