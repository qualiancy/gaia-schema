module.exports = function(config) {
  config.set({
    globals: {
      Struct: require('./index').Struct
    },

    tests: [
      'test/struct.js'
    ]
  });
};
