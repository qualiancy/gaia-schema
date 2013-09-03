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

  assert(
      'null' !== typeOf(schema) && 'undefined' !== typeOf(schema)
    , 'Expected embedded schema to include schema definition.'
  );

  assertions.type('array', value, assert);
  assertions.lengthOf(value, spec, assert);

  for (; i < value.length; i++) {
    datum = value[i];
    schema.validate(datum, true);
  }
};

TypeEmbedded.prototype._cast = function (value, spec) {
  var schema = spec.schema;
  var res = [];
  var i = 0;
  var datum;

  for (; i < value.length; i++) {
    datum = schema.cast(value[i]);
    res.push(datum);
  }

  return res;
};
