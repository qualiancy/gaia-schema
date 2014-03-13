
var debug = require('sherlock')('struct');
var inherits = require('super');

var Schema = require('./lib/schema').Schema;


var Struct = exports.Struct = function Struct(attr, opts) {

};

Struct.extend = function(name, _schema) {
  if (!(name && 'string' === typeof name)) {
    schema = name;
    name = 'Struct';
  }

  var Klass = (function(self, schema) {
    return function() {
      this.schema = schema;
      self.apply(this, arguments);
    };
  })(this, new Schema(_schema));

  inherits.merge([ Klass, this ]);
  inherits.inherits(Klass, this);
  Klass.extend = this.extend;
  Klass.name = name;
  Klass.prototype.constructor = Klass;

  return Klass;
};


Struct.prototype = {

  constructor: Struct,

  get: function(key) {

  },

  set: function(key, value) {

  }

};
