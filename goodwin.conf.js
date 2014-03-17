module.exports = function(config) {
  config.set({
    globals: {
      AssertionError: require('assertion-error'),
      Struct: require('./index').Struct,
      Schema: require('./index').Schema
    },

    tests: [
      'test/schema.js',
      'test/types.js'
    ]
  });
};
