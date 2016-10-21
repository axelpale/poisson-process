
var bg = document.body;
var bgState = true;

var p = PoissonProcess.create(80, function () {
  console.log('tick');
  if (bgState) {
    bg.style.backgroundColor = 'black';
  } else {
    bg.style.backgroundColor = 'red';
  }
  bgState = !bgState;
});

p.start();
