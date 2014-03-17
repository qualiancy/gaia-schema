suite('schema specifications', function() {
  function testSpecs(schema) {
    var paths = schema.paths;
    var types = schema.types;

    // paths
    paths.has('__root.list1').should.be.true;
    paths.get('__root.list1').should.have.property('type', 'array');
    paths.has('__root.list2').should.be.true;
    paths.get('__root.list2').should.have.property('type', 'array');

    // types
    types.has('array').should.be.true;
    types.get('array').should.itself.respondTo('valid');
  }

  test('should parse basic native types', function() {
    var schema = Schema({
      list1: Array,
      list2: 'array'
    });

    testSpecs(schema);
  });

  test('should parse complex native types', function() {
    var schema = Schema({
      list1: { type: Array, index: true },
      list2: { type: 'array', index: true }
    });

    testSpecs(schema);

    var paths = schema.paths;

    paths.get('__root.list1').should.have.property('index', true);
    paths.get('__root.list2').should.have.property('index', true);

    var passed = {
      list1: [ 1, 2, 3 ],
      list2: [ 4, 5, 6 ]
    };

    schema.validate(passed).should.be.true;
    schema.wrap(passed).should.deep.equal(passed);
    schema.unwrap(passed).should.deep.equal(passed);

    (function() { schema.validate({
      list1: true,
      list2: [ 4, 5, 6 ]
    }); }).should.throw(AssertionError, 'validation failed due to error(s)');
  });

  test('should parse embedded multipath schemas', function() {
    var schema = Schema({
      list1: [ { name: String } ]
    });

    var paths = schema.paths;
    var types = schema.types;

    paths.has('__root.list1').should.be.true;
    paths.get('__root.list1').should.have.property('type', 'embedded');
    paths.get('__root.list1').should.have.property('schema')
      .an.instanceof(Schema);

    var emb = paths.get('__root.list1').schema;
    emb.paths.has('__root.name').should.be.true;
    emb.paths.get('__root.name').should.have.property('type', 'string');

    types.has('embedded').should.be.true;
    types.get('embedded').should.itself.respondTo('valid');

    var passed = {
      list1: [ { name: 'Amy' }, { name: 'Rory' } ]
    };

    schema.validate(passed).should.be.true;
    schema.wrap(passed).should.deep.equal(passed);
    schema.unwrap(passed).should.deep.equal(passed);

    (function() {
      schema.validate({ list1: [ { name: 42 } ] });
    }).should.throw(AssertionError, 'validation failed due to error(s)');
  });

  test('should parse embedded singlepath schemas', function() {
    var schema = Schema({
      list1: [ String ]
    });

    var paths = schema.paths;
    var types = schema.types;

    paths.has('__root.list1').should.be.true;
    paths.get('__root.list1').should.have.property('type', 'embedded');
    paths.get('__root.list1').should.have.property('schema')
      .an.instanceof(Schema);

    var emb = paths.get('__root.list1').schema;
    emb.paths.has('__root').should.be.true;
    emb.paths.get('__root').should.have.property('type', 'string');

    types.has('embedded').should.be.true;
    types.get('embedded').should.itself.respondTo('valid');

    var passed = {
      list1: [ 'hello', 'universe' ]
    };

    schema.validate(passed).should.be.true;
    schema.wrap(passed).should.deep.equal(passed);
    schema.unwrap(passed).should.deep.equal(passed);

    (function() {
      schema.validate({ list1: [ 1, 2 ] });
    }).should.throw(AssertionError, 'validation failed due to error(s)');
  });
});
