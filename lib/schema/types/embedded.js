/*!
 * gaia-schema - embedded schema type
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

module.exports = TypeEmbedded;

/*!
 * Noop constructor function
 */

function TypeEmbedded () {}

/*!
 * Mixin SchemaType
 */

SchemaType('embedded', TypeEmbedded.prototype);

TypeEmbedded.prototype._validate = function (value, spec) {
  var assert = this.assert.bind(this);
  var schema = spec.schema;
  var i = 0;
  var datum;
  var res;

  assert(
      'null' !== typeOf(schema) && 'undefined' !== typeOf(schema)
    , 'Expected embedded schema to include schema definition.'
  );

  assertions.type('array', value, assert);
  assertions.lengthOf(value, spec, assert);

  for (; i < value.length; i++) {
    datum = value[i];
    res = schema.validate(datum, true);
    if (!res.valid) throw res.errors[0];
  }
};

TypeEmbedded.prototype._cast = function (value, spec) {
  var schema = spec.schema;
  var res = [];
  var i = 0;
  var datum;

  for (; i < value.length; i++) {
    datum = schema.cast(value[i]);
    res.push(datum.casted);
  }

  return res;
};
