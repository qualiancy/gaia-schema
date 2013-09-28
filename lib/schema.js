/*!
 * gaia-schema - schema constructor
 * Copyright(c) 2013 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var debug = require('sherlock')('gaia-schema:schema');
var hash = require('gaia-hash');
var properties = require('tea-properties');
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
 * Primary exports
 */

module.exports = Schema;

/**
 * ### Schema(spec)
 *
 * @param {Object} specification
 * @return {Schema}
 */

function Schema(spec) {
  if (!(this instanceof Schema)) return new Schema(spec);
  this._spec = spec;
  this.paths = new hash.Hash();
  this.types = new hash.Hash();
  parse.spec(this, this._spec);
}

/**
 * #### .validate(data)
 *
 * Validate an object against the schema.
 *
 * @param {Object} data
 * @return {Object} result
 */

Schema.prototype.validate = function(data) {
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
};

/**
 * #### .cast(data)
 *
 * Invoke the schema's cast rules on a given
 * object. Result includes a new object.
 *
 * @param {Object} data
 * @return {Object} result
 */

Schema.prototype.cast = function(data) {
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
};

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

Schema.prototype.extract = function(data) {
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
};
