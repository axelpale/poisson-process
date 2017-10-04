module.exports = function (mean) {
  // Generate exponentially distributed variate.
  //
  // Inter-arrival times of events in Poisson process
  // are exponentially distributed.
  // mean = 1 / rate
  // Math.log(x) = natural logarithm of x
  return -Math.log(Math.random()) * mean;
};
