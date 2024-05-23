// // You can access a <canvas> element with the HTML DOM method getElementById().
// const canvas = document.getElementById('canvas');

// // To draw in the canvas you need to create a 2D context object:
// const context = canvas.getContext('2d');

// //set up the ball
// var radius = 20;
// var color = "#33ccff";

// //set up physic vars
// var g = 0.5; // acceleration due to gravity
// var x = 50; // initial horizontal position
// var y = 50; // initial vertical position
// // =0 : bounce in place; >0 : bounce to the right; <0 : bounce left
// var vx = 0; // initial horizontal speed
// var vy = 0; // initial vertical speed

// //load ball
// window.onload = init;

// //on windows creation
// function init() {
//     setInterval(onEachStep, 1000 / 60); // 60 fps
// };

// //
// function onEachStep() {
//     vy += g; // gravity increases the vertical speed
//     x += vx; // horizontal speed increases horizontal position
//     y += vy; // vertical speed increases vertical position
//     if (y > canvas.height - radius) { // if ball hits the ground
//         y = canvas.height - radius; // reposition it at the ground
//         vy *= -0.8; // then reverse and reduce its vertical speed
//     }
//     if (x > canvas.width + radius) { // if ball goes beyond canvas
//         x = -radius; // wrap it around
//     }
//     drawBall(); // draw the ball
// };


// function drawBall() {
//     with (context) {
//         clearRect(0, 0, canvas.width, canvas.height);
//         fillStyle = color;
//         beginPath();
//         arc(x, y, radius, 0, 2 * Math.PI, true);
//         closePath();
//         fill();
//     };
// };

/////////////////////////////////////////////////
//vector object
function Vector2D(x, y) {
    this.x = x;
    this.y = y;
}
// PUBLIC METHODS
Vector2D.prototype = {
    lengthSquared: function () {
        return this.x * this.x + this.y * this.y;
    },
    length: function () {
        return Math.sqrt(this.lengthSquared());
    },
    // clone: function () {
    //     return new Vector2D(this.x, this.y);
    // },
    negate: function () {
        this.x = - this.x;
        this.y = - this.y;
    },
    // normalize: function () {
    //     var length = this.length();
    //     if (length > 0) {
    //         this.x /= length;
    //         this.y /= length;
    //     }
    //     return this.length();
    // },
    // add: function (vec) {
    //     return new Vector2D(this.x + vec.x, this.y + vec.y);
    // },
    // incrementBy: function (vec) {
    //     this.x += vec.x;
    //     this.y += vec.y;
    // },
    subtract: function (vec) {
        return new Vector2D(this.x - vec.x, this.y - vec.y);
    },
    // decrementBy: function (vec) {
    //     this.x -= vec.x;
    //     this.y -= vec.y;
    // },
    // multiply: function (k) {
    //     return new Vector2D(k * this.x, k * this.y);
    // },
    addScaled: function (vec, k) {
        return new Vector2D(this.x + k * vec.x, this.y + k * vec.y);
    },
    // scaleBy: function (k) {
    //     this.x *= k;
    //     this.y *= k;
    // },
    dotProduct: function (vec) {
        return this.x * vec.x + this.y * vec.y;
    }
};
// STATIC METHODS
Vector2D.distance = function (vec1, vec2) {
    return (vec1.subtract(vec2)).length();
}
Vector2D.angleBetween = function (vec1, vec2) {
    return Math.acos(vec1.dotProduct(vec2) / (vec1.length() * vec2.length()));
}
////////////////////////////////////////////////////

//ball object
function Ball(radius, color) {
    this.radius = radius;
    this.color = color;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
}
Ball.prototype = {
    // get x() {
    //     return this.x;
    // },
    // get y() {
    //     return this.y;
    // },
    get pos2D() {
        return new Vector2D(this.x, this.y);
    },
    set pos2D(pos) {
        this.x = pos.x;
        this.y = pos.y;
    },
    get velo2D() {
        return new Vector2D(this.vx, this.vy);
    },
    set velo2D(velo) {
        this.vx = velo.x;
        this.vy = velo.y;
    },
    draw: function (context) {
        context.fillStyle = 'red';
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
    },
    redraw: function (context, radius) {
        context.fillStyle = 'red';
        context.beginPath();
        context.arc(this.x, this.y, radius, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
    }
};
////////////////////////////////////////////////////

//equation variables
var g = 9.807;// accélération gravitationnelle
var x0 = 100;// position x initiale
var y0 = 100;// position y initiale
var angle = 70;// angle
var vi = 90;// vitesse initiale
var t = 0;// temps d'animation
/////////////////

//global vars
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var ball1;
var ball2;
var t0; // temps initiale
var dt;
var animId;
var radius = 10;

var radians = angle * Math.PI / 180;
var vx = Math.cos(radians) * vi;
var vy = Math.sin(radians) * vi;
var velo0 = new Vector2D(vx, -vy);// (force horizontale: vx, force vertical: vy)

var pos0 = new Vector2D(x0, y0 * -1);// position initiale
var acc = new Vector2D(0, g); // (0, g),  g: acceleration due to gravity
var animTime = 15;

window.addEventListener('resize', resizeCanvas);

window.onload = init;

function init() {
    resizeCanvas();
    drawLandingStrip(context, canvas.width);

    ball1 = new Ball(radius, '#0080ff');
    ball1.pos2D = pos0;
    ball1.velo2D = velo0;

    ball1.draw(context);
    t0 = new Date().getTime();
}

function animFrame() {
    animId = requestAnimationFrame(animFrame, canvas);
    onTimer();
}

function onTimer() {
    var t1 = new Date().getTime();
    dt = 0.01 * (t1 - t0); // vitesse d'animation par seconde
    t0 = t1;
    if (dt > 0.2) { dt = 0; }; // fix for bug if user switches tabs
    t += dt;

    if (ball1.pos2D.y < (-radius - 30)) {
        move();
    }
}

function move() {
    // numerical solution - Euler scheme
    ball1.pos2D = ball1.pos2D.addScaled(ball1.velo2D, dt);
    ball1.velo2D = ball1.velo2D.addScaled(acc, dt);

    resizeCanvas();

    // display
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawLandingStrip(context, canvas.width);
    ball1.redraw(context, radius);
}

function resizeCanvas() {
    // Get the device pixel ratio (for high-DPI devices)
    var dpr = window.devicePixelRatio || 1;

    // Set the size of the canvas in CSS pixels
    canvas.style.width = (window.innerWidth * 0.75 + 'px');
    canvas.style.height = (window.innerHeight * 0.75 + 'px');

    // Set the size of the canvas in device pixels
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    // Scale the drawing context to ensure correct drawing operations
    context.scale(dpr, dpr);

    // Transform the context to have a bottom-left origin
    context.translate(0, canvas.height / dpr); // Move origin to bottom-left
}

function drawLandingStrip(context, canvasWidth) {
    const rectHeight = 100;
    context.beginPath();
    context.fillStyle = 'green';
    context.fillRect(0, -rectHeight, canvasWidth, rectHeight);
}
