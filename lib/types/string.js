/*!
 * gaia-schema - string schema type
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

module.exports = TypeString;

/*!
 * Noop constructor function
 */

function TypeString() {}

/*!
 * Mixin SchemaType
 */

SchemaType('string', TypeString.prototype);

/**
 * ### Validation
 *
 * Validates the value as a string and against the
 * user defined specifications.
 *
 * **Validation Specifications:**
 * - `length` _{Number|Object}_ if number, exact length
 *   - `length.min` _{Number}_ minimum length, inclusive
 *   - `length.max` _{Number}_ maximum length, inclusive
 *   - `length.eq` _{Number}_ exact length
 * - `re` _{RegExp}_ test regexp using `re.test(value)`
 * - `validate` _{Function}_ user defined validation function
 *
 * **User Defined Validation**
 * - **@param** _{String}_ value
 * - **@param** _{Object}_ specification
 * - **@param** _{Function}_ assert
 *
 * You can use a function to hook into the validation
 * sequence. In addition to the value and specification
 * an `assert` function is provided for simple assertions.
 * If you choose to use your own assertion framework the
 * only requirement is that an `Error` be thrown when the
 * value is not valid.
 *
 * ```js
 * var schema = Schema({
 *     direction: {
 *         type: String
 *       , validate: function (value, spec, assert) {
 *           var directions = [ 'north', 'south', 'east', 'west', 'n', 's', 'e', 'w' ];
 *           assert(
 *               ~directions.indexOf(value.toLowerCase())
 *             , 'Expected direction to be one of ' + JSON.stringify(directions) + '.'
 *           );
 *         }
 *     }
 * });
 * ```
 *
 * @param {Mixed} value
 * @param {Object} specification
 * @throws {AssertionError} on assert error
 */

TypeString.prototype._validate = function (value, spec) {
  var assert = this.assert.bind(this);
  assertions.type('string', value, assert);
  assertions.lengthOf(value, spec, assert);

  if ('regexp' === typeOf(spec.re)) {
    assert(
        re.test(value)
      , 'Expected value to pass regular expression: ' + re
    );
  }

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
 * **User Defined Casting**
 * - **@param** _{String}_ value
 * - **@param** _{Object}_ specification
 *
 * Normally when casting native JavaScript types will
 * simple return the original value. You can hook into
 * the casting sequence to provide your own logic. Building
 * on the previous examples.
 *
 * ```js
 * var schema = Schema({
 *     direction: {
 *         type: String
 *       , validate: function (value, spec, assert) { ... }
 *       , cast: function (value, spec) {
 *           return value.charAt(0).toUpperCase();
 *         }
 *     }
 * });
 * ```
 *
 * @param {String} value
 * @param {Object} specification
 * @return {String} result
 */

TypeString.prototype._cast = function (value, _spec) {
  var res = value;

  if ('function' === typeOf(spec.cast)) {
    res = spec.cast(res, spec);
  }

  return res;
};
