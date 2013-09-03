var typeOf = require('type-detect');

exports.type = function (type, value, assert, msg) {
  var actual = typeOf(value);

  assert(
      type === actual
    , msg || 'Expected a ' + type + ' but got ' + actual + '.'
    , { actual: actual, expected: type, operator: '===' }
  );
};

exports.lengthOf = function (value, spec, assert) {
  var len = value.length
    , spec_len = spec.length || spec.lengthOf
    , exact;

  // not checking length
  if (!spec_len) return;

  // check for length
  exports.type('number', len, assert, 'Expected value to have a numeric length.');

  // assert exact value length
  if ('number' === typeOf(spec_len) || 'number' === typeOf(spec_len.eq)) {
    exact = 'number' === typeOf(spec_len) ? spec_len : spec_len.eq;
    assert(
        exact === len
      , 'Expected exact length of ' + exact + ' but got ' + len + '.'
      , { actual: len, expected: exact, operator: '===' }
    );
  }

  // assert minimum value length
  if ('number' === typeOf(spec_len.min)) {
    assert(
        spec_len.min <= len
      , 'Expected minimum length of ' + spec_len.min + ' but got ' + len + '.'
      , { actual: len, expected: spec_len.min, operator: '<=' }
    );
  }

  // assert maximum value length
  if ('number' === typeOf(spec_len.max)) {
    assert(
        spec_len.max >= len
      , 'Expected maximum length of ' + spec_len.max + ' but got ' + len + '.'
      , { actual: len, expected: spec_len.max, operator: '>=' }
    );
  }
};

exports.minmax = function (value, spec, assert) {
  if ('number' === typeof(spec.min)) {
    assert(
        spec.min <= value
      , 'Expected minimum of ' + spec.min + ' but got ' + value + '.'
      , { actual: value, expected: spec.min, operator: '<=' }
    );
  }

  if ('number' === typeof(spec.max)) {
    assert(
        spec.max <= value
      , 'Expected maximum of ' + spec.max + ' but got ' + value + '.'
      , { actual: value, expected: spec.max , operator: '>=' }
    );
  }
};

exports.custom = function (value, spec, assert) {
  if ('function' === typeOf(spec.validate)) {
    spec.validate(value, spec, assert);
  }
};
