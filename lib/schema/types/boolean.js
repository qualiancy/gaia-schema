/*!
 * gaia-schema - boolean schema type
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

module.exports = TypeBoolean;

/*!
 * Noop constructor function
 */

function TypeBoolean () {}

/*!
 * Mixin SchemaType
 */

SchemaType('boolean', TypeBoolean.prototype);

/**
 * ### Validation
 *
 * Validates the value as a boolean and against the
 * user defined specifications.
 *
 * **Validation Specifications:**
 * - `validate` _{Function}_ user defined validation function
 *
 * @param {Mixed} value
 * @param {Object} specification
 * @throws {AssertionError} on assert error
 */

TypeBoolean.prototype._validate = function (value, spec) {
  var assert = this.assert.bind(this);
  assertions.type('boolean', value, assert);
  assertions.custom(value, spec, assert);
};

/**
 * ### Casting
 *
 * Provide the scrubbed value of this type when data
 * passes through it via the `Schema`.
 *
 * **Casting Specifications:**
 * - `cast` _{Function}_ user defined casting function
 *
 * @param {String} value
 * @param {Object} specification
 * @return {String} result
 */

TypeBoolean.prototype._wrap = function (value, spec) {
  var res = value;

  if ('function' === typeOf(spec.wrap)) {
    res = spec.wrap(res, spec);
  }

  return res;
};

TypeBoolean.prototype._unwrap = function (value, spec) {
  var res = value;

  if ('function' === typeOf(spec.unwrap)) {
    res = spec.unwrap(res, spec);
  }

  return res;
};
