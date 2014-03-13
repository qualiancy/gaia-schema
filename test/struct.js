suite('.extend(name, schema)', function() {
  test('success', function() {
    var Person = Struct.extend('Person', { field: String });
    console.log(Person);
  });
});
