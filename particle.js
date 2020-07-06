const particleCount = 100;
const edgeThreshold = 250;
const driftThreshold = 200;
const edgeAlpha = 0.3;
const particleColor = "#ffffff";
const edgeColor = "#ffffff";
const edgeThickness = 1;
const colorArray = ["#0c7bc9", "#b61924", "#0c0140", "#8a0641", "#2f6103", "#068c7d"];
const gammaCorrection = 1.6;
const PI = Math.PI;
const RAD_TO_DEG = 180 / PI;
const DEG_TO_RAD = PI / 180;

var canvas, g;
var canvasBoundX, canvasBoundY;
var forcedFPS = 25;
var refreshInterval = 1000/forcedFPS;
var particleArray = new Array();
var globalID;
var mouseState = false;
var animationState = false;

var lastMouseX, lastMouseY;

var distArray = new Array(particleCount);

// MODES
const DRIFT_AWAY = 1;
const DRIFT_TO = 2;
const FOCUS = 3;
const BUBBLE = 4;

const PARTICLE_MODE = DRIFT_AWAY;

var slope;


function Particle(x, y, vx, vy, theta, radius){
    var x, y, p, projection;
    this.mouseFlag = false;
    this.pos = new Vector(x, y);
    this.vel = new Vector(vx, vy);
    this.gradient = theta;
    this.speed = 30 + Math.random() * 30;
    this.radius = radius;
    this.inflationFactor = 1;
    this.mass = Math.pow(radius, 3);
    this.color = particleColor;

    this.update = function(dt){
        // HANDLES REFLECTION OFF WALLS
        if(this.pos.x < 0 || this.pos.x > canvasBoundX){
            this.vel.reflectY();
        }
        if(this.pos.y < 0 || this.pos.y > canvasBoundY){
            this.vel.reflectX();
        }
        // HANDLES DRIFTING AWAY OF PARTICLES
        if(PARTICLE_MODE == DRIFT_AWAY){
            if(Vector.distance(this.pos, mouseParticle.pos) < driftThreshold){
                if(!this.mouseFlag){
                    p = new Vector(this.pos.x - mouseParticle.pos.x, this.pos.y - mouseParticle.pos.y);
                    projection = 2 * Vector.dot(p, this.vel) / p.squareLength();
                    p.multiply(projection);
                    this.vel.subtract(p);
                }
                this.mouseFlag = true;
            }
            else{
                this.mouseFlag = false;
            }
        }
        // HANDLES INFLATION OF PARTICLES
        if(PARTICLE_MODE == BUBBLE){
            if(mouseState) this.inflationFactor = 600 / (20 + Vector.distance(mouseParticle.pos, this.pos));
            else this.inflationFactor = 1;
        }
        // UPDATES THE POSITION
        this.pos.add(new Vector(this.speed * this.vel.x * dt, this.speed * this.vel.y * dt));
    }

    this.driftAway = function(dist){
        let shift = new Vector(this.pos.x - mouseParticle.pos.x, this.pos.y - mouseParticle.pos.y);
        shift.divide(dist);
        shift.multiply(8000 / (25 + dist));
        x = this.pos.x + shift.x;
        y = this.pos.y + shift.y;
        this.pos.x = shift.x < 0 ? Math.max(2, x) : Math.min(canvasBoundX - 2, x);
        this.pos.y = shift.y < 0 ? Math.max(2, y) : Math.min(canvasBoundY - 2, y);
    }

    this.driftTo = function(dist, shift){
        shift.multiply(20 / (1 + dist));
        x = this.pos.x + shift.x;
        y = this.pos.y + shift.y;
        this.pos.x = shift.x < 0 ? Math.max(2, x) : Math.min(canvasBoundX - 2, x);
        this.pos.y = shift.y < 0 ? Math.max(2, y) : Math.min(canvasBoundY - 2, y);
    }

    this.draw = function(){
        // DRAW THE PARTICLE
        g.globalAlpha = Math.pow(this.radius/8, 0.7);
        g.fillStyle = this.color;
        g.beginPath();
        g.arc(this.pos.x, this.pos.y, this.radius * this.inflationFactor, 0, 2*PI);
        g.fill();
    }
}

var mouseParticle = new Particle(0, 0, 0, 0, 0);
mouseParticle.radius = 8;
