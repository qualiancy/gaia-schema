/*!
 * gaia-schema - schema specifications parser
 * Copyright(c) 2013 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var debug = require('sherlock')('struct:parse');
var extend = require('tea-extend');
var typeOf = require('type-detect');

/*!
 * Local dependencies
 */

var natives = require('./types');

/**
 * Parse a spec using a recursive walk.
 *
 * @param {Schema} schema for paths
 * @param {String} base path
 * @param {Object} specs to parse
 * @throws {Error} on error
 * @api public
 */

exports.spec = function(schema, base, specs) {
  if ('string' !== typeOf(base)) {
    specs = { __root: base };
    base = ''
  }

  var key, path, spec;

  for (key in specs) {
    spec = specs[key];
    path = base + key;

    if (isBasic(spec)) {
      exports.basic(schema, path, spec);
    } else if (isComplex(spec)) {
      exports.complex(schema, path, spec);
    } else if (isEmbedded(spec)) {
      exports.embedded(schema, path, spec);
    } else if ('object' === typeOf(spec)) {
      exports.spec(schema, path + '.', spec);
    } else {
      // something went wrong
    }
  }
};

/**
 * Parse a sub-spec of basic difficulty.
 *
 * ```js
 * { first_name: String }
 * { first_name: 'string' }
 * ```
 *
 * @param {Schema} schema for paths
 * @param {String} base path
 * @param {Object} specs to parse
 * @api public
 */

exports.basic = function(schema, path, spec) {
  var type = exports.type(schema, spec);
  var def = { type: type };
  debug('+ (path.basic) %s', path, def);
  schema.paths.set(path, def);
};

/**
 * Parse a sub-spec of complex difficulty.
 *
 * ```js
 * {
 *   first_name: {
 *       type: 'string' // or String
 *     , index: true
 *   }
 * }
 * ```
 *
 * @param {Schema} schema for paths
 * @param {String} base path
 * @param {Object} specs to parse
 * @api public
 */

exports.complex = function(schema, path, spec) {
  var type = exports.type(schema, spec.type);
  var def = extend({}, spec, { type: type });
  debug('+ (path.complex) %s', path, def);
  schema.paths.set(path, def);
};

/**
 * Parse a sub-spec this is an embedded schema.
 *
 * ```js
 * // as array (simple)
 * { tags: [ String ] }
 *
 * // as array (sub-schema)
 * { tags: [ Schema({ tag: String, created: Date }) ] }
 *
 * // as array (sub-object)
 * { tags: [ { tag: String, created: Date } ] }
 *
 * // with additional parameters
 * {
 *   points: {
 *       type: 'embedded'
 *     , length: 3
 *     , schema: Schema({ x: Number, y: Number })
 *   }
 * }
 * ```
 *
 * @param {Schema} schema for paths
 * @param {String} base path
 * @param {Object} specs to parse
 * @throws {Error} on error
 * @api public

 */
exports.embedded = function(schema, path, spec) {
  var res = 'object' === typeOf(spec) ? spec : {};
  var type = exports.type(schema, 'embedded');
  var usable = 'array' === typeOf(spec) ? spec[0] : spec.schema;

  // check for def
  if (!usable) {
    var err = new Error('Missing specification for embedded schema at path ' + path + '.');
    debug('! (path.embedded) %s', err.message);
    throw err;
  }

  // embedded schema
  var newschema = usable instanceof schema.constructor
    ? usable
    : new schema.constructor(usable);

  // proper type
  delete res.schema;
  res.type = 'embedded';

  // add to paths
  var def = extend({}, res);
  debug('+ (path.embedded) %s', path, def);
  schema.paths.set(path, extend(def, { schema: newschema }));
};

/**
 * Extract the name of the type and construct its
 * validation instance if it does not already
 * exist on the `Schema`.
 *
 * @param {Schema} schema for validation instances
 * @param {Mixed} type input from sub-spec
 * @return {String} validation instance key
 * @throws {Error} on error
 * @api public
 */

exports.type = function(schema, type) {
  var name = 'string' === typeOf(type) ? type : type.name;
  var Klass, klass;

  // gather name and constructor
  if (name && natives[name.toLowerCase()]) {
    name = name.toLowerCase();
    Klass = natives[name];
  } else if ('function' === typeOf(type)) {
    Klass = type;
    klass = new Klass();
    name = klass.name || null;
  }

  // no name, inform user
  if (!name || !Klass) {
    var err = new Error('Unknown schema type: ' + JSON.stringify(type));
    debug('! (schema.type) %s', err.message);
    throw err;
  }

  // add to schema
  if (!schema.types.has(name)) {
    debug('+ (schema.type) %s', name);
    klass = klass || new Klass();
    schema.types.set(name, klass);
  }

  return name;
}

/*!
 * Determine if a sub-spec is of basic type.
 *
 * @param {Object} sub-spec
 * @return {Boolean} is basic
 * @api private
 */

function isBasic(spec) {
  if ('string' === typeOf(spec) && spec !== 'embedded') return true;
  if ('function' === typeOf(spec)) return true;
  return false;
}

/*!
 * Determine if a sub-spec is of complex type.
 *
 * @param {Object} sub-spec
 * @return {Boolean} is complex
 * @api private
 */

function isComplex(spec) {
  var type = spec.type || null;
  if (!type) return false;
  if ('string' === typeOf(type) && type !== 'embedded') return true;
  if ('function' === typeOf(type)) return true;
  return false;
}

/*!
 * Determine if a sub-spec is for an embedded schema.
 *
 * @param {Object} sub-spec
 * @return {Boolean} is embedded
 * @api private
 */

function isEmbedded(spec) {
  if ('array' === typeOf(spec)) {
    if (spec.length === 1 && spec[0]) return true;
  } else if ('object' === typeOf(spec)) {
    if (spec.type && spec.type === 'embedded') return true;
    if (spec.schema) return true;
  }

  return false;
}
