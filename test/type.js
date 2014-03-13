/*!
 * Custom Schema Type
 */

var CustomType = Schema.Type.extend({
  name: 'custom',

  _validate: function (value, spec) {
    this.assert(
      'string' === typeof value,
      'Expected type to be a string but got ' + typeof value + '.',
      { actual: typeof value, expected: value, operator: '===' }
    );
  },

  _wrap: function (value, spec) {
    var scen = spec && spec.case ? spec.case : null;
    return scen === 'upper' ? value.toUpperCase() : value;
  },

  _unwrap: function (value, spec) {
    var scen = spec && spec.case ? spec.case : null;
    return scen === 'upper' ? value.toLowerCase() : value;
  }
});

/*!
 * Test Constants
 */

var str = new CustomType();
var TEST_STR = 'hello universe';
var TEST_STR_UPPER = 'HELLO UNIVERSE';

/*!
 * Tests
 */

suite('constructor', function() {
  test('mixin all methods', function () {
    var keys = Object.keys(SchemaType.prototype);
    function Noop () {};
    SchemaType('custom', Noop.prototype);
    keys.forEach(function (key) {
      Noop.should.respondTo(key);
    });
  });
});

suite('new CustomType()', function () {
  test('assign "name" property', function () {
    str.should.have.property('name', 'custom');
  });
});

suite('.rejected()', function () {
  test('return null on pass', function () {
    should.equal(str.rejected(TEST_STR), null);
  });

  test('return error on fail', function () {
    var err = str.rejected(42);
    should.exist(err);
    err.should.be.instanceof(Error);
    err.should.have.property('name', 'AssertionError');
  });
});

suite('.valid()', function () {
  test('return true on pass', function () {
    str.valid(TEST_STR).should.equal.true;
  });

  test('return false on fail', function () {
    str.valid(42).should.equal.false;
  });
});

suite('.cast()', function () {
  test('return the correct value', function () {
    str.cast(TEST_STR, { case: 'upper' }).should.equal(TEST_STR_UPPER);
    str.cast(TEST_STR, { case: 'other' }).should.equal(TEST_STR);
  });
});

suite('.extract()', function () {
  test('return the correct value', function () {
    str.extract(TEST_STR_UPPER, { case: 'upper' }).should.equal(TEST_STR);
    str.extract(TEST_STR_UPPER, { case: 'lower' }).should.equal(TEST_STR_UPPER);
  });
});
