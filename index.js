// You can access a <canvas> element with the HTML DOM method getElementById().
const canvas = document.getElementById('canvas');

// To draw in the canvas you need to create a 2D context object:
const context = canvas.getContext('2d');

//set up the ball
var radius = 20;
var color = "#33ccff";

//set up physic vars
var g = 0.5; // acceleration due to gravity
var x = 50; // initial horizontal position
var y = 50; // initial vertical position
// =0 : bounce in place; >0 : bounce to the right; <0 : bounce left
var vx = 0; // initial horizontal speed
var vy = 0; // initial vertical speed

//load ball
window.onload = init;

//on windows creation
function init() {
    setInterval(onEachStep, 1000 / 60); // 60 fps
};

// 
function onEachStep() {
    vy += g; // gravity increases the vertical speed
    x += vx; // horizontal speed increases horizontal position
    y += vy; // vertical speed increases vertical position
    if (y > canvas.height - radius) { // if ball hits the ground
        y = canvas.height - radius; // reposition it at the ground
        vy *= -0.8; // then reverse and reduce its vertical speed
    }
    if (x > canvas.width + radius) { // if ball goes beyond canvas
        x = -radius; // wrap it around
    }
    drawBall(); // draw the ball
};


function drawBall() {
    with (context) {
        clearRect(0, 0, canvas.width, canvas.height);
        fillStyle = color;
        beginPath();
        arc(x, y, radius, 0, 2 * Math.PI, true);
        closePath();
        fill();
    };
};
