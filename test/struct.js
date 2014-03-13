suite('.extend(type, schema)', function() {
  var Person = Struct.extend('Person', { name: String });

  test('{construction}', function() {
    var person = new Person();
    person.should.be.instanceof(Person);
    person.should.be.instanceof(Struct);
  });

  test('.type', function() {
    Person.should.have.property('type', 'Person');
  });

  test('.extend() (again)', function() {
    Person.should.itself.respondTo('extend');
    var Traveler = Person.extend('Traveler', {});
    var traveller = new Traveler();
    traveller.should.be.instanceof(Traveler);
    traveller.should.be.instanceof(Person);
    traveller.should.be.instanceof(Struct);
  });
});

suite('.set(path, val)', function() {
  test('sets internal value for path', function() {
    var Person = Struct.extend('Person', { name: String });
    var person = new Person();
    person.set('name', 'hello universe');
    person.__obj.should.have.property('name', 'hello universe');
  });
});

suite('.get(path)', function() {
  test('gets internal value for path', function() {
    var Person = Struct.extend('Person', { name: String });
    var person = new Person();
    person.__obj.name = 'hello universe';
    person.get('name').should.equal('hello universe');
  });
});
