describe('Schema', function () {
  describe('specifications', function () {
    function testSpecs (schema) {
      var paths = schema.paths
        , types = schema.types;

      // paths
      paths.has('list1').should.be.true;
      paths.get('list1').should.have.property('type', 'array');
      paths.has('list2').should.be.true;
      paths.get('list2').should.have.property('type', 'array');

      // types
      types.has('array').should.be.true;
      types.get('array').should.itself.respondTo('valid');
    }

    it('should parse basic native types', function () {
      var schema = Schema({
          list1: Array
        , list2: 'array'
      });

      testSpecs(schema);
    });

    it('should parse complex native types', function () {
      var schema = Schema({
          list1: { type: Array, index: true }
        , list2: { type: 'array', index: true }
      });

      testSpecs(schema);

      var paths = schema.paths;

      paths.get('list1').should.have.property('index', true);
      paths.get('list2').should.have.property('index', true);
    });

    it('should parse embedded multipath schemas', function () {
      var schema = Schema({
          list1: [ { name: String } ]
      });
    });

    it('should parse embedded singlepath schemas', function () {
      var schema = Schema({
          list1: [ String ]
      });
    });
  });
});
