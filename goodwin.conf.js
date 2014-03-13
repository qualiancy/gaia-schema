module.exports = function(config) {
  config.set({
    globals: {
      Schema: require('./index').Schema
    },

    tests: [
      'test/*.js'
    ]
  });
};
