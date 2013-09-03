/*!
 * Attach chai to global should
 */

global.chai = require('chai');
global.should = global.chai.should();

/*!
 * Chai Plugins
 */

//global.chai.use(require('chai-spies'));
//global.chai.use(require('chai-http'));

/*!
 * Import project
 */

global.Schema = require('../..');

/*!
 * Helper to load internals for cov unit tests
 */

function req (name) {
  return process.env.schema_COV
    ? require('../../lib-cov/schema/' + name)
    : require('../../lib/schema/' + name);
}

/*!
 * Load unexposed modules for unit tests
 */

global.__schema = {};
