
var Process = require('./lib/Process');

// Raw sampling function
exports.sample = require('./lib/sample');

// Semantic version, useful for inspection when version is not known.
exports.version = require('./lib/version');

// .create style contstructor
exports.create = function (avgIntervalMs, triggedFn) {
  return new Process(avgIntervalMs, triggedFn);
};
