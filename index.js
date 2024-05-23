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
        context.fillStyle = 'blue';
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
    },
    redraw: function (context, radius) {
        context.fillStyle = 'blue';
        context.beginPath();
        context.arc(this.x, this.y, radius, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
    }
};
//////////////////////////////////////////////////////////

// variables pour l'equation 
var g = 9.807; // accélération gravitationnelle
var x0 = 100; // position x initiale
var y0 = 100; // position y initiale
var angle = 70; // angle en degrees
var vi = 90; // vitesse initiale
var t0; // temps initiale

////////////////////////////////////////////////////////////

/* global vars */
//variables pour canvas
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

//variables pour la balle
var balle;
var degrade;
var rayon = 15;
var pos0 = new Vector2D(x0, y0 * -1);// position initiale

// variables d'animation
var animId;
var dt;// delta temps

// variables de vecteurs
var radians = angle * Math.PI / 180; // convertire les degrees en radians
var vx = Math.cos(radians) * vi; // velocité horizontale
var vy = Math.sin(radians) * vi; // velocité verticale
var velo = new Vector2D(vx, -vy); // vecteur des velocités
var acc = new Vector2D(0, g); // vecteur de la force gravitationnelle

// variables window
window.addEventListener('resize', resizeCanvas);
window.onload = init;

function init() {
    resizeCanvas();
    drawLandingStrip(context, canvas.width);

    balle = new Ball(rayon, '#0080ff');
    balle.pos2D = pos0;
    balle.velo2D = velo;

    balle.draw(context);
    t0 = new Date().getTime(); // temps maintenant
}

function animFrame() {
    animId = requestAnimationFrame(animFrame, canvas);
    onTimer();
}

function onTimer() {
    var t1 = new Date().getTime(); // temps maintenant (plus tard que le premier)
    dt = 0.01 * (t1 - t0); // vitesse d'animation par seconde
    t0 = t1;
    if (dt > 0.2) { dt = 0; }; // correction d'un bug si l'utilisateur change d'onglet

    // tant que la balle ne touche pas a terre
    if (balle.pos2D.y < (-rayon - 40)) {
        move(); // animer la prochaine seconde de la balle
    }
}

function move() {
    // numerical solution - Euler scheme
    balle.pos2D = balle.pos2D.addScaled(balle.velo2D, dt);
    balle.velo2D = balle.velo2D.addScaled(acc, dt);

    resizeCanvas();

    // afficher la balle
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawLandingStrip(context, canvas.width);
    balle.redraw(context, rayon);
}

function resizeCanvas() {
    // le rapport de pixels de l'appareil (pour les appareils à haut DPI (point par pouce))
    var dpr = window.devicePixelRatio || 1;

    // la taille du canvas en pixels CSS
    canvas.style.width = (window.innerWidth * 0.75 + 'px');
    canvas.style.height = (window.innerHeight * 0.75 + 'px');

    // la taille du canvas en pixels de l'appareil
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    // Mettre à l'échelle le context pour garantir des opérations de dessin correctes
    context.scale(dpr, dpr);

    // Transformer le context pour avoir une origine en bas à gauche
    context.translate(0, canvas.height / dpr);
}

function drawLandingStrip(context, canvasWidth) {
    const rectHeight = 100;
    context.beginPath();
    context.fillStyle = '#5cd65c';
    context.fillRect(0, -rectHeight, canvasWidth, rectHeight);
}
