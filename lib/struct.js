
var debug = require('sherlock')('struct');
var inherits = require('super');
var pathval = require('pathval');

var Schema = exports.Schema = require('./schema').Schema;


var Struct = exports.Struct = function Struct(attr, opts) {
  this.__obj = {};
};

Object.defineProperty(Struct, 'type', {
  get: function() { return this.prototype.__type; },
  enumerable: true
});

Struct.extend = function(type, _schema) {
  if (!(type && 'string' === typeof type)) {
    _schema = type;
    type = 'Struct';
  }

  var Klass = (function(self, schema) {
    return function() {
      this.schema = schema;
      self.apply(this, arguments);
    };
  })(this, new Schema(_schema));

  inherits.merge([ Klass, this ]);
  inherits.inherits(Klass, this);
  inherits.merge([ Klass.prototype, this.prototype ]);

  Object.defineProperty(Klass, 'type', {
    get: function() { return this.prototype.__type; },
    enumerable: true
  });

  Klass.extend = this.extend;
  Klass.prototype.__type = type;
  Klass.prototype.constructor = Klass;

  return Klass;
};


Struct.prototype = {

  constructor: Struct,

  __type: 'Struct',

  get: function(path) {
    return pathval.get(this.__obj, path);
  },

  set: function(path, value) {
    return pathval.set(this.__obj, path, value);
  }

};
