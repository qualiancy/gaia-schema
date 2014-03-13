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
  });

  test('should parse embedded multipath schemas', function() {
    var schema = Schema({
      list1: [ { name: String } ]
    });
  });

  test('should parse embedded singlepath schemas', function() {
    var schema = Schema({
      list1: [ String ]
    });
  });
});
