var unit = require('../poisson-process.js');
var math = require('mathjs');
var jstat = require('jstat').jStat;
var should = require('should');

describe('PoissonProcess', function () {

  describe('#create', function () {
    it('should be a function', function () {
      unit.create.should.be.a.Function;
    });

    it('should require an interval and a function', function () {
      (function () {
        unit.create(100, {});
      }).should.throw(unit.TriggerFunctionError);

      (function () {
        unit.create('100');
      }).should.throw(unit.IntervalError);

      (function () {
        unit.create();
      }).should.throw(unit.IntervalError);
    });

    it('should not accept negative interval', function () {
      (function () {
        unit.create(-100, function () {})
      }).should.throw(unit.IntervalError);
    });

    it('should accept zero interval', function (done) {
      (function () {
        var p = unit.create(0, function () {
          p.stop();
          done();
        });
        p.start();
      }).should.not.throw();
    });
  });

  describe('instance', function () {
    it('should be startable and stoppable', function (done) {
      var p = unit.create(50, function () {
        p.stop();
        done();
      });
      p.start();
    });
  });

  describe('.sample', function () {
    // Let us inspect the sampled intervals by taking a sample of 1000
    // with rate 1.
    // Interarrival times in homogeneous Poisson process are exponential
    // random variables with mean 1 / rate and variance 1 / rate^2.
    var N = 100000;
    var alpha = 0.05;  // 100(1 - alpha)% confidence interval
    var rate = 2;
    var samples = [];
    var i;

    for (i = 0; i < N; i += 1) {
      samples.push(unit.sample(1 / rate));
    }

    it('should have correct mean', function () {
      var sampleMean = math.mean(samples);
      var popMean = 1 / rate;

      // 95% Confidence intervals for mean of exponential variables
      // https://en.wikipedia.org/wiki/Exponential_distribution
      // #Confidence_intervals
      var percLo = jstat.chisquare.inv(1 - alpha / 2, 2 * N);
      var percHi = jstat.chisquare.inv(alpha / 2, 2 * N);
      var meanLo = 2 * N * sampleMean / percLo;
      var meanHi = 2 * N * sampleMean / percHi;

      console.log('Sample mean:', sampleMean);
      console.log('Pop mean:', popMean);
      console.log('Sample mean confidence lo:', meanLo);
      console.log('Sample mean confidence hi:', meanHi);
      popMean.should.be.above(meanLo);
      popMean.should.be.below(meanHi);
    });

    it('should have correct variance', function () {
      // The sampled mean and variance should match with the known population
      // mean and variance.

      var sampleMean = math.mean(samples);
      var sampleVariance = math.var(samples);  // unbiased
      var estimateOfPopVariance = sampleMean * sampleMean;
      var popMeanIfGeneratorIsOk = 1 / rate;
      var popVarianceIfGeneratorIsOk = 1 / (rate * rate);
      var difference = Math.abs(sampleVariance * estimateOfPopVariance);

      console.log('----');

      console.log('rate =', rate);
      console.log('sampleMean =', sampleMean);
      console.log('popMeanIfGeneratorIsOk =', popMeanIfGeneratorIsOk);
      console.log('sampleVariance =', sampleVariance);
      console.log('estimateOfPopVariance = sampleMean^2 =',
                  estimateOfPopVariance);
      console.log('popVarianceIfGeneratorIsOk =',
                  popVarianceIfGeneratorIsOk);

      console.log('----');

      console.log('sampleMean - popMeanIfGeneratorIsOk =',
                  sampleMean - popMeanIfGeneratorIsOk);
      console.log('sampleVariance - popVarianceIfGeneratorIsOk =',
                  sampleVariance - popVarianceIfGeneratorIsOk);
      console.log('sampleVariance - estimateOfPopVariance =',
                  sampleVariance - estimateOfPopVariance);
      console.log('estimateOfPopVariance - popVarianceIfGeneratorIsOk =',
                  estimateOfPopVariance - popVarianceIfGeneratorIsOk);
    });

    it('should generate poisson distribution', function () {

      // We arrange the samples into bins. Each bin has width "interval".
      // We answer to how many samples each interval captures.

      // Approach (lets think in seconds for convenience):
      // - choose interval width: 10 s
      // - rate: 1 event/s
      // - 10 events in an interval on average.
      // - begin from x = 0, x_j = Sum(samples)_0..j
      // - take first sample: e.g 0.8 s
      // - how many intervals does it conquer: sample/interval e.g. b = 0.08
      // - if b < 1 i.e. <=> if less than one interval
      // - index for intervals : r,  interval_r, r = 0 => first interval

      var meanIntervalSize = 10;  // this many events in one interval in average
      var intervalWidth = meanIntervalSize / rate;

      var sum = function (k) {
        // Sum until k:th element.
        // sum(0) = 0.
        // sum(1) = value of first element
        return math.sum(samples.slice(0, k));
      };

      var total = function () {
        return math.sum(samples);
      };

      var normalize = function (arr) {
        // Normalize a discrete positive distribution
        // return the resulting discrete probability distribution.

        var s = math.sum(arr);

        if (s <= 0) {
          return [];
        }

        return arr.map(function (x) {
          return x / s;
        });
      };

      var numberOfNonEmptyIntervals = function (width) {
        return Math.floor(total() / width);
      };

      var beginOfInterval = function (r, width) {
        return r * width;
      };
      var endOfInterval = function (r, width) {
        return (r + 1) * width;
      };

      var numberOfEventsInInterval = function (r, width) {
        // Parameters:
        //   r
        //     interval index

        var intBegin = beginOfInterval(r, width);
        var intEnd = endOfInterval(r, width);

        var n = 0; // number of events in interval
        var x = 0; // progression

        var i, j, s;

        for (i = 0; i < samples.length && x < intBegin; i += 1) {
          s = samples[i];
          x += s;
          // it:h sample at x
        }
        // i at the index of first sample after the intreval begin
        // x at the position of first sample in the time dimension

        // Test if the event skipped the whole interval
        // We do this explicitly for clarity; the test is
        // duplicated in the following for loop.
        if (intEnd < x) {
          return 0;
        }

        // At least the first event is in the interval
        // Count events in the interval.
        for (j = i + 1; j < samples.length && x < intEnd; j += 1) {
          n += 1;
          x += samples[j];
        }

        return n;
      };

      var generatePoissonBins = function (numOfBins, lambda) {
        // Parameters
        //   numOfBins
        //     number of bins. Returned array has this size.
        //   lambda
        //     expected number of occurences in a bin, i.e.
        //     average number of events in a bin
        //
        // See
        //   https://en.wikipedia.org/wiki/Poisson_distribution

        var bn = [];
        var k;

        for (k = 0; k < numOfBins; k += 1) {
          bn[k] = jstat.poisson.pdf(k, lambda);
        }

        return bn;
      };

      var m = numberOfNonEmptyIntervals(intervalWidth);
      var l;

      var bins = [];
      var intervals = [];
      for (l = 0; l < m; l += 1) {
        p = numberOfEventsInInterval(l, intervalWidth);

        if (typeof bins[p] === 'undefined') {
          bins[p] = 1;
        } else {
          bins[p] = bins[p] + 1;
        }

        // Store for sample mean
        intervals[l] = p;
      }

      console.log('----');
      console.log('rate:', rate);
      console.log('interval width:', intervalWidth);
      console.log('# of non-empty intervals:', m);

      var iSize = math.mean(intervals);  // interval size sample mean
      console.log('sample mean of # of events in an interval:', iSize);
      console.log('popul. mean of # of events in an interval:', meanIntervalSize);

      console.log('----');
      for (b = 0; b < bins.length; b += 1) {

        // Some might still be empty.
        if (typeof bins[b] === 'undefined') {
          bins[b] = 0;
        }

        console.log('Bin ' + b + ':', bins[b]);
      }
      console.log('----');

      console.log('Is this distribution Poisson distributed?');

      // Let us compute a Poisson distribution with the same
      var poissonRate = meanIntervalSize;  // average number of events in a bin
      var poissonBins = generatePoissonBins(bins.length, poissonRate);

      var sampledBinsProb = normalize(bins);

      console.log('poissonRate:', poissonRate);
      console.log('numberOfBins:', bins.length);
      console.log('numberOfPoissonBins:', poissonBins.length);

      console.log('----');

      poissonBins.forEach(function (bin, index) {
        console.log('poissonBins[' + index + ']:', bin);
        console.log('sampledBins[' + index + ']:', sampledBinsProb[index]);
      });

      console.log('----');

      // Compute mean squared error, MSE
      var sumSE = poissonBins.reduce(function (acc, bin, index) {
        var sampleBin = sampledBinsProb[index];

        var d = bin - sampleBin;
        var d2 = d * d;
        return acc + d2;
      }, 0);
      var MSE = sumSE / poissonBins.length;

      console.log('Mean Squared Error:', MSE);

      MSE.should.be.below(0.0001);  // just a small threshold, no theory
    });
  });

  it('should have a version with the format #.#.#', function() {
    unit.version.should.match(/^\d+\.\d+\.\d+$/);
  });
});
