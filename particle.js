const particleCount = 80;
const edgeThreshold = 250;
const edgeAlpha = 0.3;
const particleColor = "#ffffff";
const edgeColor = "#ffffff";
const edgeThickness = 0.5;

var canvas, g;
const PI = Math.PI;
var canvasBoundX, canvasBoundY;
var refreshInterval = 1000/60;
var particleArray = new Array();
var globalID;
var mouseState = false;
var animationState = false;

var mouseParticle = new Particle(0, 0, 0, 0, 0);
mouseParticle.status = "special";
mouseParticle.radius = 4;

function Vector(x, y){
    this.x = x;
    this.y = y;
    this.Length = function(){
        return sqrt(this.squareLength());
    }
    this.squareLength = function(){
        return this.x * this.x + this.y * this.y;
    }
    this.add = function(vec){
        this.x += vec.x;
        this.y += vec.y;
    }
    this.subtract = function(vec){
        this.x -= vec.x;
        this.y -= vec.y;
    }
    this.multiply = function(scalar){
        this.x *= scalar;
        this.y *= scalar;
    }
    this.divide = function(scalar){
        this.x /= scalar;
        this.y /= scalar;
    }
    this.reflectX = function(){
        this.y = -this.y;
    }
    this.reflectY = function(){
        this.x = -this.x;
    }
    this.copy = function(){
        return new Vector(this.x, this.y);
    }
}

Vector.dot = function(vec1, vec2){
    return vec1.x * vec2.x + vec1.y * vec2.y;
}
Vector.cross = function(vec1, vec2){
    return vec1.x * vec2.y - vec1.y * vec2.x;
}
Vector.sqrDistance = function(vec1, vec2){
    var x = vec1.x - vec2.x;
    var y = vec1.y - vec2.y;
    return (x * x + y * y);
}
Vector.distance = function(vec1, vec2){
    return Math.sqrt(Vector.sqrDistance(vec1, vec2));
}



function Particle(x, y, vx, vy, radius){
    this.status = "normal"
    this.pos = new Vector(x, y);
    this.vel = new Vector(vx, vy);
    this.speed = 30 + Math.random() * 30;
    this.radius = radius;
    this.mass = Math.pow(radius, 3);
    this.color = particleColor;
    this.time = 0;

    this.edgeMetric = function(d){
        return this.status == "normal" ? (1.0 - d / edgeThreshold) * edgeAlpha : 1;
    }

    this.drawEdge = function(end, strength){
        g.strokeStyle = edgeColor;
        g.globalAlpha = strength;
        g.beginPath();
        g.lineWidth = edgeThickness;
        g.moveTo(this.pos.x, this.pos.y);
        g.lineTo(end.pos.x, end.pos.y);
        g.stroke();
    }

    this.update = function(dt){
        this.time += dt;
        if(this.pos.x < 0 || this.pos.x > canvasBoundX){
            this.vel.reflectY();
            this.time = 0;
        }
        if(this.pos.y < 0 || this.pos.y > canvasBoundY){
            this.vel.reflectX();
            this.time = 0;
        }
        this.pos.add(new Vector(this.speed * this.vel.x * dt, this.speed * this.vel.y * dt));
        particleArray.forEach((particle) => {
            var dist = Vector.distance(particle.pos, this.pos);
            if(dist < edgeThreshold){
                this.drawEdge(particle, this.edgeMetric(dist));
                if(dist < (this.radius + particle.radius) && this.status == "normal"){
                    // EMULATE REAL LIFE ELASTIC COLLISION
                    let a = (this.mass - particle.mass) / (this.mass + particle.mass);
                    let b = (2*this.mass) / (this.mass + particle.mass);
                    let c = (2*particle.mass) / (this.mass + particle.mass);

                    let temp = this.vel.copy();
                    this.vel = new Vector(a * this.vel.x + c * particle.vel.x, a * this.vel.y + c * particle.vel.y);
                    particle.vel = new Vector(b * temp.x - a * particle.vel.x, b * temp.y - a * particle.vel.y);
                }
            }
        })
    }

    this.draw = function(){
        // DRAW THE PARTICLE
        g.globalAlpha = 1;
        g.fillStyle = this.color;
        g.beginPath();
        g.arc(this.pos.x, this.pos.y, this.radius, 0, 2*PI);
        g.fill();
    }
}

var particleCanvas = {
    animate : function(){
        // THE ANIMATOR FUNCTION
        g.clearRect(0, 0, canvasBoundX, canvasBoundY);
        particleArray.forEach((particle) => {
            particle.update(refreshInterval / 1000);
            particle.draw();
        });
        if(mouseState){
            mouseParticle.update(refreshInterval / 1000);
            mouseParticle.draw();
        }
        globalID = requestAnimationFrame(particleCanvas.animate);
    },
    start : function(){
        // START ANIMATION
        if(!animationState){
            globalID = requestAnimationFrame(particleCanvas.animate);
            animationState = true;
        }
    },
    stop : function(){
        // STOP ANIMATION
        if(animationState){
            cancelAnimationFrame(globalID);
            animationState = false;
        }
    },
    initiate : function(){
        // CALLED AFTER MARKUP LOADS
        canvas = document.getElementById('particleCanvas');
        g = canvas.getContext('2d');
        canvas.addEventListener('mouseover', () => {mouseState = true});
        canvas.addEventListener('mouseout', () => {mouseState = false});
        canvas.addEventListener('mousemove', (e) => {
            mouseParticle.pos = new Vector(e.offsetX, e.offsetY);
        });
    
        canvasBoundX = window.outerWidth;
        canvasBoundY = window.outerHeight;
        canvas.width = canvasBoundX;
        canvas.height = canvasBoundY;
    
        for(let i of Array(particleCount).keys()){
            var theta = Math.random() * 2 * PI;
            var posX = Math.random() * canvasBoundX;
            var posY = Math.random() * canvasBoundY;
            var radius = 2 + Math.random() * 2;
            var particle = new Particle(posX, posY, Math.cos(theta), Math.sin(theta), radius);
            particleArray.push(particle);
        }
    }
}

