/*!
 * Module dependencies
 */

var HashMap = require('gaia-hash').Hash;
var Struct = require('../').Struct;

/*!
 * Embedded `PhoneNumber` struct
 */

var PhoneNumber = Struct.extend('PhoneNumber', {
  number: { type: Number, required: true },
  type: {
    type: Number,
    enum: [ 'MOBILE', 'HOME', 'WORK' ],
    default: 'HOME'
  }
});

/*!
 * Top-level `Person` struct
 */

var Person = Struct.extend('Person', {
  name: { type: String, required: true },
  id: { type: Number, required: true, primaryIndex: true },
  email: { type: String, match: EMAIL_RE, index: true },
  phone: [ PhoneNumber ]
});

/*!
 * Example usage
 */

(function main() {
  var people = new HashMap(null, {
    key: 'id',
    type: Person
  });

  var jdoe = new Person();
  jdoe.set('name', 'John Doe');
  jdoe.set('id', 1234);
  jdoe.set('email', 'jdoe@example.com');

  people.insert(jdoe);

  function() {
    var jdoe = people.get(1234); // can also specify index if schema has path as unique
    var jdoes = people.getAll('jdoe@example.com', { index: 'email' }); // returns HashMap

    assert(jdoe instanceof Person);
    assert(jdoes.length === 1);
    assert.deepEqual(jdoe, jdoes.at(0));
  }();

})();
