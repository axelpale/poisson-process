# poisson-process.js

[![npm](https://img.shields.io/npm/v/poisson-process.svg?style=flat)](https://www.npmjs.com/package/poisson-process)
![dependencies](https://img.shields.io/badge/dependencies-none-green.svg?style=flat) [![licence](https://img.shields.io/npm/l/poisson-process.svg?style=flat)](https://www.npmjs.com/package/poisson-process)

A JavaScript library to generate naturally varying time intervals. It __improves realism and natural unpredictability in your games or animations__ like aliens walking by a window, or cars trying to drive over your character on a busy road. It __removes bottlenecks in distributed systems__ by adding [jitter](http://highscalability.com/blog/2012/4/17/youtube-strategy-adding-jitter-isnt-a-bug.html) that prevents [thundering herd problem](https://en.wikipedia.org/wiki/Thundering_herd_problem). It can also simulate the frequency of chat messages, page loads or arriving emails as well as queues, traffic and earthquakes. The underlying mathematical concept is called the [Poisson process](https://en.wikipedia.org/wiki/Poisson_process).

![Constant vs Poisson process](../master/doc/cars.gif?raw=true)

In the animation above, the blue cars drive by in constant time intervals and the red ones in more natural, randomized intervals typical for the Poisson process.



## Examples

- [Poisson's Stroboscope](https://rawgit.com/axelpale/poisson-process/master/examples/stroboscope/index.html)
- [Sprinkler.js](https://github.com/axelpale/sprinkler#examples) depends on poisson-process.js. Look for the examples section.


## Installation

### Browsers

First download [poisson-process.min.js](https://unpkg.com/poisson-process/dist/poisson-process.min.js) and then:

    <script src="poisson-process.min.js"></script>

### Node.js & CommonJS

First `$ npm install poisson-process` and then:

    var poissonProcess = require('poisson-process');

### AMD & Require.js

First download [poisson-process.min.js](https://unpkg.com/poisson-process/dist/poisson-process.min.js) and then:

    define(['scripts/poisson-process'], function (poissonProcess) { ... });



## Usage

It is simple; you specify an __average call interval__ in milliseconds, a __function to be called__ and then __start__ the process.

    > var p = poissonProcess.create(500, function message() {
      console.log('A message arrived.')
    })
    > p.start()

Now the `message` function will be called each 500 milliseconds __in average__. The delay from a previous call can vary from near 0 milliseconds to a time that is significantly longer than the given average, even though the both ends are increasingly unlikely.

The process is paused by:

    > p.stop()

If you desire just numbers, generate intervals by:

    > poissonProcess.sample(500)
    389.33242512
    > poissonProcess.sample(500)
    506.58621391


## API

### poissonProcess.create(averageIntervalMs, triggerFunction)

The `create` constructor takes in two parameters. The `averageIntervalMs` is an integer and the average interval in milliseconds to call the `triggerFunction`. The `triggerFunction` takes no parameters and does not have to return anything.

    var p = poissonProcess.create(500, function message() {
      console.log('A message arrived.')
    })

### p.start()

Start the process; begin to call the `triggerFunction`.

    p.start()

### p.stop()

Stop the process; do not anymore call the `triggerFunction`.

    p.stop()

### poissonProcess.sample(average)

The `sample` provides a raw access to the underlying generator for the call intervals. It returns a number; a sample from the exponential distribution with the rate `1 / average`.

    > poissonProcess.sample(500)
    323.02...
    > poissonProcess.sample(500)
    returns 941.33...
    > poissonProcess.sample(500)
    returns 609.86...


## Theory

The poisson-process.js is based on the mathematical concept of the [Poisson process](https://en.wikipedia.org/wiki/Poisson_process). It is a stochastic process that is usually perceived in the frequency of earthquakes, arriving mail and, in general, the other series of events where a single event, like an arriving letter, does not much depend on the other events, like the preceding or following letters.

It is known that inter-arrival times of the events in a Poisson process follow an [exponential probability distribution](https://en.wikipedia.org/wiki/Exponential_distribution) with a rate parameter *r*. It is also known that the multiplicative inverse of *r*, *1/r* is the mean of the inter-arrival times. Therefore to generate an event each *m* milliseconds in average, we sample the exponential distribution of the rate *1/m*. Sampling the exponential distribution is rather simple as it follows the rule:

![Sampling from an exponential distribution](doc/sampling.png?raw=true)

In our test suite, we __proof__ by simulation that our sampling method forms an exponential distribution with correct mean and variance. The variance of an exponential distribution is known to be _1/(r*r)_. We also proof that this leads to a Poisson distributed behavior. Run the test suite by first `$ npm install` and then `$ npm test`.

A detailed and __enjoyable introduction__ to the theory is given by [Jeff Preshing](http://preshing.com/) at [How to Generate Random Timings for a Poisson Process](http://preshing.com/20111007/how-to-generate-random-timings-for-a-poisson-process/). Wikipedia's article [Poisson point process](https://en.wikipedia.org/wiki/Poisson_point_process) also provides a comprehensive introduction and a set of references.



## Contribute

Issues and pull request are warmly welcome. Run tests with `$ npm test` before submitting.

Build bundle and source maps with `$ npm run build`.



## Versioning

[Semantic Versioning 2.0.0](http://semver.org/)



## License

[MIT License](LICENSE)
