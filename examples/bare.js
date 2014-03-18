/*!
 * Module dependencies
 */

var HashMap = require('gaia-hash').Hash;
var struct = require('struct')('struct:examples:bare');

/*!
 * Embedded `PhoneNumber` struct
 */

var PhoneNumber = struct('phone_number', {
  number: { type: Number, required: true },
  type: {
    type: Number,
    enum: { 0: 'MOBILE', 1: 'HOME', 2: 'WORK' },
    default: 'HOME'
  }
});

/*!
 * Top-level `Person` struct
 */

var Person = struct('person', {
  id: { type: Number, required: true, primaryIndex: true },
  name: { type: String, required: true },
  email: { type: 'email', index: true },
  phone: [ PhoneNumber /* or 'phone_number' */ ]
});

/*!
 * Example usage
 */

(function main() {
  var people = new HashMap(null, {
    key: 'id',
    type: Person // or struct.type('person')
  });

  // alt: new Person({
  var jdoe = struct.create('person', {
    id: 1234,
    name: 'John Doe',
    email: 'jdoes@example.com'
  });

  // `push` = add no matter what
  // `union` = only push if does not exist
  // ...
  jdoe.set('phone').union({
    number: '55555555555',
    type: 'MOBILE'
  });

  // since we specified key on create, can just set object
  people.set(jdoe);

  (function() {
    var jdoe = people.get(1234); // can also specify index if schema has path as unique
    var jdoes = people.getAll('jdoe@example.com', { index: 'email' }); // returns HashMap

    assert(jdoe instanceof Person);
    assert(jdoes.length === 1);
    assert.deepEqual(jdoe, jdoes.at(0));
  })();
})();
