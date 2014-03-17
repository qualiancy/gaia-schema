/*!
 * Module dependencies
 */

var co = require('co');
var Struct = require('../');

/*!
 * Embedded `PhoneNumber` struct
 */

var PhoneNumber = new Struct('PhoneNumber', [
  [ 'number', { type: Number, required: true } ],
  [ 'type', {
    type: Number,
    enum: [ 'MOBILE', 'HOME', 'WORK' ],
    default: 'HOME'
  }]
]);

/*!
 * Top-level `Person` struct
 */

var Person = new Struct('Person', [
  [ 'name', { type: String, required: true } ],
  [ 'id', { type: Number, required: true } ],
  [ 'email', { type: String, match: EMAIL_RE } ],
  [ 'phone', [ PhoneNumber ]]
]);

/*!
 * Example usage
 */

co(function *main() {
  var protobuf = require('orchid');
  var ns = new protobuf.namespace('top', Person);
  var pbout = new ns.Encoder();
  var pbin = new ns.Decoder();

  pbin.on('readable', function() {
    var person = this.read();
    assert(person instanceof Person);
    assert(person.get('name') === 'John Doe');
  })

  pbout.pipe(pbin);

  var jdoe = new Person();
  jdoe.set('name', 'John Doe');
  jdoe.set('id', 1234);
  jdoe.set('email', 'jdoe@example.com');

  pbout.write(jdoe);
  yield function(done) { pb.end(done); };
})();
