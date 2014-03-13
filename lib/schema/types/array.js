/*!
 * gaia-schema - array schema type
 * Copyright(c) 2013 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var SchemaType = require('gaia-schematype');
var typeOf = require('type-detect');

/*!
 * Local dependencies
 */

var assertions = require('../assertions');

/*!
 * Primary exports
 */

module.exports = TypeArray;

/*!
 * Noop constructor function
 */

function TypeArray () {}

/*!
 * Mixin SchemaType
 */

SchemaType('array', TypeArray.prototype);

/**
 * ### Validate
 *
 * Validates the value as a string and against the
 * user defined specifications.
 *
 * **Validation Specifications:**
 * - `length` _{Number|Object}_ if number, exact length
 *   - `length.min` _{Number}_ minimum length, inclusive
 *   - `length.max` _{Number}_ maximum length, inclusive
 *   - `length.eq` _{Number}_ exact length
 * - `validate` _{Function}_ user defined validation function
 *
 * @param {Mixed} value
 * @param {Object} specification
 * @throws {AssertionError} on assert error
 */

TypeArray.prototype._validate = function (value, spec) {
  var assert = this.assert.bind(this);
  assertions.type('array', value, assert);
  assertions.lengthOf(value, spec, assert);
  assertions.custom(value, spec, assert);
};

/**
 * ### Cast
 *
 * Provide the scrubbed value of this type when data
 * passes through it via `Schema#cast`.
 *
 * **Casting Specifications:**
 * - `cast` _{Function}_ user defined casting function
 *
 * @param {String} value
 * @param {Object} specification
 * @return {String} result
 */

TypeArray.prototype._cast = function (value, spec) {
  var res = [];
  var i = 0;
  var datum;

  // TODO: deep merge to deref objects?
  for (; i < value.length; i++) {
    datum = value[i];
    res.push(datum);
  }

  if ('function' === typeOf(spec.cast)) {
    res = spec.cast(res, spec);
  }

  return res;
};

/**
 * ### Extract
 *
 * Provide the scrubbed value of this type when data
 * passes through it via `Schema#extract`.
 *
 * **Casting Specifications:**
 * - `cast` _{Function}_ user defined casting function
 *
 * @param {String} value
 * @param {Object} specification
 * @return {String} result
 */

TypeArray.prototype._extract = function (value, spec) {
  var res = [];
  var i = 0;
  var datum;

  for (; i < value.length; i++) {
    datum = value[i];
    res.push(datum);
  }

  if ('function' === typeOf(spec.extract)) {
    res = spec.extract(res, spec);
  }

  return res;
};
