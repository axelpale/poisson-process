// *****************************
// UMD pattern commonjsStrict.js
// https://github.com/umdjs/umd
// *****************************
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['exports'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS & Node
    factory(exports);
  } else {
    // Browser globals
    factory((root.PoissonProcess = {}));
  }
}(this, function (exports) {
  'use strict';



  // ****************
  // Helper functions
  // ****************
  var sample = function (mean) {
    // Generate exponentially distributed variate.
    //
    // Inter-arrival times of events in Poisson process
    // are exponentially distributed.
    // mean = 1 / rate
    // Math.log(x) = natural logarithm of x
    return -Math.log(Math.random()) * mean;
  };



  // ***********
  // Constructor
  // ***********

  var Process = function (interval, fn) {
    this.interval = interval;
    this.fn = fn;
    this.timeout = null;
  };

  exports.create = function (averageIntervalMs, triggerFunction) {
    return new Process(averageIntervalMs, triggerFunction);
  };



  // ****************
  // Instance methods
  // ****************

  Process.prototype.start = function () {
    var dt = sample(this.interval);
    var that = this;
    this.timeout = setTimeout(function () {
      that.start();
      that.fn();
    }, dt);
  };

  Process.prototype.stop = function () {
    clearTimeout(this.timeout);
  };



  // **************
  // Module methods
  // **************

  exports.sample = sample;



  // *************
  // Extendability
  // *************
  // Usage
  //   var p = PoissonProcess.create(time, fn)
  //   PoissonProcess.extension.myFunction = function (...) {...}
  //   p.myFunction()
  exports.extension = Process.prototype;



  // *******
  // Version
  // *******
  exports.version = '0.1.0';

}));
