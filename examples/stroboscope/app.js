
// This is the background element whose color we are about to change.
var bg = document.body;

// This is the background color state. True means black, false means red.
var bgState = true;

// This is the interval between color changes. As we are discussing about
// poisson distributed flickering, this value means the average interval.
// The actual intervals are sampled from an interval form of poisson
// distribution, and can vary from almost zero to almost infinity but both
// ends are impossibly rare. However, regardless the smallness or bigness of
// actual intervals, their average will approach the specified interval.
var interval = 500;

// Here we define the function that we are about to call after each interval.
// In other words, we are defining the process.
var p = poissonProcess.create(interval, function () {

  // If you are looking at the developer console, you will see these ticks.
  console.log('tick');

  // We change the background color according to the current color state.
  if (bgState) {
    bg.style.backgroundColor = '#6666FF';
  } else {
    bg.style.backgroundColor = '#0000FF';
  }

  // We change the color state.
  bgState = !bgState;
});

// Finally, we must start the process. Before this part, background stays
// dull gray.
p.start();
