//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

// variables pour l'équation 
var g = 9.807; // accélération gravitationnelle
var x0 = 100; // position x initiale
var y0 = 100; // position y initiale
var angle = 45; // angle en degrés
var vi = 100; // velocité initiale
var t0; // temps initiale

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

//vector object
function Vector2D(x, y) {
    this.x = x;
    this.y = y;
}
// METHODES PUBLIQUES
Vector2D.prototype = {
    lengthSquared: function () {
        return this.x * this.x + this.y * this.y;
    },
    length: function () {
        return Math.sqrt(this.lengthSquared());
    },

    negate: function () {
        this.x = - this.x;
        this.y = - this.y;
    },

    subtract: function (vec) {
        return new Vector2D(this.x - vec.x, this.y - vec.y);
    },

    addScaled: function (vec, k) {
        return new Vector2D(this.x + k * vec.x, this.y + k * vec.y);
    },

    dotProduct: function (vec) {
        return this.x * vec.x + this.y * vec.y;
    }
};
// METHODES STATIQUES
Vector2D.distance = function (vec1, vec2) {
    return (vec1.subtract(vec2)).length();
}
Vector2D.angleBetween = function (vec1, vec2) {
    return Math.acos(vec1.dotProduct(vec2) / (vec1.length() * vec2.length()));
}

//////////////////////////////////////////////////////////

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
        context.arc(this.x, this.y, radius, 0, Math.PI * 2);
        context.closePath();
        context.fill();
    }
};

//////////////////////////////////////////////////////////

/* variables globales */
//variables pour canvas
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

//variables pour la balle
var balle;
var rayon = 15;
var pos0 = new Vector2D(x0, y0 * -1);// position initiale

// variables d'animation
var animId;
var dt;// delta temps

// variables de vecteurs
var radians = angle * Math.PI / 180; // convertire les degrés en radians
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

    // tant que la balle ne touche pas à terre
    if (balle.pos2D.y < (-rayon - 40)) {
        move(); // animer la prochaine seconde de la balle
    }
}

function move() {
    // solution numérique - Schéma d'Euler
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
