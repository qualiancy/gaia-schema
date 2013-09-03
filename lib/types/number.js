/*!
 * gaia-schema - number schema type
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

module.exports = TypeNumber;

/*!
 * Noop constructor function
 */

function TypeNumber () {}

/*!
 * Mixin SchemaType
 */

SchemaType('number', TypeNumber.prototype);

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

TypeNumber.prototype._validate = function (value, spec) {
  var assert = this.assert.bind(this);
  assertions.type('number', value, assert);
  assertions.minmax(value, spec, assert);
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
 * @param {Number} value
 * @param {Object} specification
 * @return {Number} result
 */

TypeNumber.prototype._cast = function (value, spec) {
  var res = value;

  if ('function' === typeOf(spec.cast)) {
    res = spec.cast(res, spec);
  }

  return res;
};
