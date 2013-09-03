module.exports = process.env.schema_COV
  ? require('./lib-cov/schema')
  : require('./lib/schema');
