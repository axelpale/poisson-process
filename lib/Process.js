var sample = require('./sample');

var Process = function (interval, fn) {
  // Parameters:
  //   interval
  //     number of milliseconds
  if (typeof interval !== 'number') {
    throw new Error(interval + ' should be a number.');
  }
  if (typeof fn !== 'function') {
    throw new Error('Callee ' + fn + ' should be a function.');
  }
  if (interval < 0) {
    throw new Error(interval + ' should be a non-negative number.');
  }
  this.interval = interval;
  this.fn = fn;
  this.timeout = null;
};

Process.prototype.start = function () {
  var dt = sample(this.interval);
  var self = this;
  this.timeout = setTimeout(function () {
    self.start();
    self.fn();
  }, dt);
};

Process.prototype.stop = function () {
  clearTimeout(this.timeout);
};

module.exports = Process;
