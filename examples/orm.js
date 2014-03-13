/*!
 * Module dependencies
 */

var co = require('co');
var Struct = require('../');

/*!
 * Embedded `PhoneNumber` struct
 */

var PhoneNumber = new Struct('PhoneNumber', {
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

var Person = new Struct('Person', {
  name: { type: String, required: true },
  id: { type: Number, required: true, primaryIndex: true },
  email: { type: String, match: EMAIL_RE, index: true },
  phone: [ PhoneNumber ]
});

/*!
 * Example usage
 */

co(function *main() {
  var DB_CONN_STR = process.env.DB_CONN_STR || 'localStorage://app';
  var seed = require('seed');

  var db = yield seed.connect(DB_CONN_STR); // handles connection pooling
  var people = yield db.collection('people', People, db);

  var jdoe = new Person();
  jdoe.set('name', 'John Doe');
  jdoe.set('id', 1234);
  jdoe.set('email', 'jdoe@example.com');

  yield people.insert(jdoe);

  yield function *() {
    var jdoe = yield people.get(1234); // can also specify index if schema has path as unique
    var jdoes = yield people.getAll('jdoe@example.com', { index: 'email' }); // returns HashMap

    assert(jdoe instanceof Person);
    assert(jdoes.length === 1);
    assert.deepEqual(jdoe, jdoes.at(0));
  };

})();
