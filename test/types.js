
function isRegistered(key) {
  test('Schema.type(\'' + key + '\')', function() {
    var Klass = Schema.type(key);
    should.exist(Klass);
    var klass = new Klass();
    klass.should.have.property('name', key);
  });
}

suite('array', function() {
  isRegistered('array');

  test('.valid()', function() {
    var Arr = Schema.type('array');
    var arr = new Arr();
    arr.valid([], { lengthOf: { min: 1 }}).should.be.false;
    arr.valid([ 1 ], { lengthOf: { min: 1 }}).should.be.true;
  });

  test('.wrap()', function() {
    var Arr = Schema.type('array');
    var arr = new Arr();
    var obj = arr.wrap([ 1, 2, 3]);
    obj.should.deep.equal([ 1, 2, 3 ]);
    obj = arr.wrap([ 1, 2, 3], { wrap: function(a, s) {
      return a.map(function(n) { return n + 1; });
    }});
    obj.should.deep.equal([ 2, 3, 4 ]);
  });

  test('.unwrap()', function() {
    var Arr = Schema.type('array');
    var arr = new Arr();
    var obj = arr.unwrap([ 1, 2, 3]);
    obj.should.deep.equal([ 1, 2, 3 ]);
    obj = arr.unwrap([ 1, 2, 3], { unwrap: function(a, s) {
      return a.map(function(n) { return n + 1; });
    }});
    obj.should.deep.equal([ 2, 3, 4 ]);
  });
});

suite('boolean', function() {
  isRegistered('boolean');

  test('.valid()', function() {
    var Bln = Schema.type('boolean');
    var bln = new Bln();
    bln.valid(true).should.be.true;
    bln.valid(false).should.be.true;
    bln.valid('x').should.be.false;
  });

  test('.wrap()', function() {
    var Bln = Schema.type('boolean');
    var bln = new Bln();
    var obj = bln.wrap(true);
    obj.should.equal(true);
    obj = bln.wrap(true, { wrap: function(a, s) {
      return a === true ? 1 : 0;
    }});
    obj.should.equal(1);
  });

  test('.unwrap()', function() {
    var Bln = Schema.type('boolean');
    var bln = new Bln();
    var obj = bln.unwrap(true);
    obj.should.equal(true);
    obj = bln.unwrap(1, { unwrap: function(a, s) {
      return 1 === a ? true : false;
    }});
    obj.should.be.true;
  });
});

suite('number', function() {
  isRegistered('number');

  test('.valid()', function() {
    var Num = Schema.type('number');
    var num = new Num();
    num.valid(42).should.be.true;
    num.valid(Infinity).should.be.true;
    num.valid('x').should.be.false;
    num.valid(42, { enum: [ 42, 24 ] }).should.be.true;
    num.valid(42, { enum: [ 41, 25 ] }).should.be.false;
  });

  test('.wrap()', function() {
    var Num = Schema.type('number');
    var num = new Num();
    var obj = num.wrap(42);
    obj.should.equal(42);
    obj = num.wrap(42, { wrap: function(a, s) {
      return a * 2;
    }});
    obj.should.equal(84);
  });

  test('.unwrap()', function() {
    var Num = Schema.type('number');
    var num = new Num();
    var obj = num.unwrap(42);
    obj.should.equal(42);
    obj = num.unwrap(42, { unwrap: function(a, s) {
      return a / 2;
    }});
    obj.should.equal(21);
  });
});

suite('string', function() {
  isRegistered('string');

  test('.valid()', function() {
    var Str = Schema.type('string');
    var str = new Str();
    str.valid('hello universe').should.be.true;
    str.valid(42).should.be.false;
    str.valid('x', { enum: [ 'x', 'y' ] }).should.be.true;
    str.valid('z', { enum: [ 'x', 'y' ] }).should.be.false;
    str.valid('abc', { re: /^[a-z0-9_]{3,16}$/ }).should.be.true;
  });

  test('.wrap()', function() {
    var Str = Schema.type('string');
    var str = new Str();
    var obj = str.wrap('hello universe');
    obj.should.equal('hello universe');
    obj = str.wrap('hello universe', { wrap: function(a, s) {
      return a.toUpperCase();
    }});
    obj.should.equal('HELLO UNIVERSE');
  });

  test('.unwrap()', function() {
    var Str = Schema.type('string');
    var str = new Str();
    var obj = str.wrap('hello universe');
    obj.should.equal('hello universe');
    obj = str.wrap('hello universe', { wrap: function(a, s) {
      return a.toUpperCase();
    }});
    obj.should.equal('HELLO UNIVERSE');
  });
});

suite('embedded', function() {
  isRegistered('embedded');
});
