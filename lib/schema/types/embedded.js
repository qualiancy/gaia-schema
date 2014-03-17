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

  var exists = 'null' !== typeOf(schema) && 'undefined' !== typeOf(schema)
  assert(exists, 'Expected embedded schema to include schema definition.');

  assertions.type('array', value, assert);
  assertions.lengthOf(value, spec, assert);

  for (; i < value.length; i++) {
    datum = value[i];
    schema.validate(datum);
  }
};

TypeEmbedded.prototype._wrap = function(value, spec) {
  var schema = spec.schema;
  var res = [];
  var i = 0;
  var datum;

  for (; i < value.length; i++) {
    datum = schema.wrap(value[i]);
    res.push(datum);
  }

  return res;
};

TypeEmbedded.prototype._unwrap = function(value, spec) {
  var schema = spec.schema;
  var res = [];
  var i = 0;
  var datum;

  for (; i < value.length; i++) {
    datum = schema.unwrap(value[i]);
    res.push(datum);
  }

  return res;
};
