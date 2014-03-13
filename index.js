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

var parse = require('./lib/parse');

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
    var errors = [];
    var types = this.types;

    this.paths.each(function(spec, path) {
      var type = types.get(spec.type);
      var datum = properties.get({ __root: data }, path);
      var err;

      if (!hasValue(datum) && hasValue(spec.default)) {
        datum = spec.default;
      }

      if (!hasValue(datum) && true === spec.required) {
        // TODO: assertion-error
        err = { required: true, path: path };
        errors.push(err);
        return;
      }

      if (!hasValue(datum)) return;

      if (err = type.rejected(datum, spec)) {
        err.path = path;
        errors.push(err);
      }
    });

    var res = {};
    res.valid = errors.length ? false : true;
    res.errors = errors;
    return res;
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
    var extracted = {};
    var errors = [];

    this.paths.each(function(spec, path) {
      var type = types.get(spec.type);
      var datum = properties.get({ __root: data }, path);
      var extract;

      try {
        extract = type.extract(datum, spec);
      } catch(ex) {
        errors.push(ex);
        return;
      }

      properties.set(extracted, path, extract);
    });

    var res = {};
    res.valid = errors.length ? false : true;
    res.errors = errors;
    res.extracted = extracted;
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
      pre.casted = null;
      return pre;
    }

    var casted = {};
    var errors = [];

    this.paths.each(function(spec, path) {
      var type = types.get(spec.type);
      var datum = properties.get({ __root: data }, path);
      var cast;

      if (!hasValue(datum) && hasValue(spec.default)) {
        datum = spec.default;
      }

      if (!hasValue(datum)) return;

      try {
        cast = type.cast(datum, spec);
      } catch(ex) {
        errors.push(ex);
        return;
      }

      properties.set(casted, path, cast);
    });

    var res = {};
    res.valid = errors.length ? false : true;
    res.errors = errors;
    res.casted = casted.__root;
    return res;
  },

};
