// GLOBALS FOR ANIMATE FUNCTION
var effMass, vx, vy, obj1, obj2;

var particleCanvas = {
    drawEdge : function(start, end, strength){
        g.strokeStyle = edgeColor;
        g.globalAlpha = strength;
        g.beginPath();
        g.lineWidth = edgeThickness;
        g.moveTo(start.x, start.y);
        g.lineTo(end.x, end.y);
        g.stroke();
    },
    animate : function(){
        // THE ANIMATOR FUNCTION
        g.clearRect(0, 0, canvasBoundX, canvasBoundY);
        particleArray.forEach((particle) => {
            particle.update(refreshInterval / 1000);
            particle.draw();
        });

        // DRAW ALL THE EDGES
        for(let i = 0; i < particleCount; i++){
            for(let j = i + 1; j < particleCount; j++){
                let dist = Vector.distance(particleArray[i].pos, particleArray[j].pos);
                if(dist < edgeThreshold){
                    particleCanvas.drawEdge(particleArray[i].pos, particleArray[j].pos, Math.pow((1 - dist / edgeThreshold), gammaCorrection) * edgeAlpha);
                    if(dist < (particleArray[i].radius + particleArray[j].radius)){
                        obj1 = particleArray[i], obj2 = particleArray[j];
                        // EMULATE REAL LIFE ELASTIC COLLISION
                        effMass = (obj1.mass - obj2.mass) / (obj1.mass + obj2.mass);
                        ({x:vx, y:vy} = obj1.vel); 
                        obj1.vel.x = effMass * obj1.vel.x + (1 - effMass) * obj2.vel.x * obj2.speed / obj1.speed;
                        obj1.vel.y = effMass * obj1.vel.y + (1 - effMass) * obj2.vel.y * obj2.speed / obj1.speed;
                        obj2.vel.x = (1 + effMass) * vx * obj1.speed / obj2.speed - effMass * obj2.vel.x;
                        obj2.vel.y = (1 + effMass) * vy * obj1.speed / obj2.speed - effMass * obj2.vel.y;
                    }
                }
            }
        }

        if(mouseState && PARTICLE_MODE == FOCUS){
            mouseParticle.update(refreshInterval / 1000);
            particleArray.forEach((particle) => {
                if(Vector.distance(particle.pos, mouseParticle.pos) < edgeThreshold)
                particleCanvas.drawEdge(particle.pos, mouseParticle.pos, 1);
            })
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
        canvas.addEventListener('mouseout', () => {mouseState = false;});


        var dist = 0;
        canvas.addEventListener('mousemove', (e) => {
            if(PARTICLE_MODE === DRIFT_TO){
                lastMouseX = mouseParticle.pos.x;
                lastMouseY = mouseParticle.pos.y;
            }
            mouseParticle.pos = new Vector(e.offsetX, e.offsetY);
            if(PARTICLE_MODE === DRIFT_AWAY){
                particleArray.forEach((particle) => {
                    dist = Vector.distance(particle.pos, mouseParticle.pos);
                    if(dist < driftThreshold){
                        particle.driftAway(dist);
                    }
                })
            }
            else if(PARTICLE_MODE === DRIFT_TO){
                particleArray.forEach((particle) => {
                    dist = Vector.distance(particle.pos, mouseParticle.pos);
                    if(dist < driftThreshold){
                        particle.driftTo(dist, new Vector(mouseParticle.pos.x - lastMouseX, mouseParticle.pos.y - lastMouseY));
                    }
                })
            }
        });
    
        canvasBoundY = window.innerHeight;
        canvas.height = canvasBoundY;
        canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight);
        canvasBoundX = canvas.width;
        canvas.style.backgroundColor = colorArray[Math.round(Math.random() * (colorArray.length - 1))];

    
        for(let i of Array(particleCount).keys()){
            let theta = Math.random() * 2 * PI;
            let posX = Math.random() * canvasBoundX;
            let posY = Math.random() * canvasBoundY;
            let radius = 4 + Math.random() * 3;
            let particle = new Particle(posX, posY, Math.cos(theta), Math.sin(theta), theta, radius);
            particleArray.push(particle);
            distArray[i] = new Array(particleCount);
        }


        // REFLECTION TESTING
        /*const theta = -60 * DEG_TO_RAD;
        g.beginPath();
        g.strokeStyle = "#000000"
        g.strokeWidth = 10.0;
        g.moveTo(800, 400);
        g.lineTo(800 + 150 * Math.cos(theta), 400 + 150 * Math.sin(theta));
        g.moveTo(800, 400);
        g.lineTo(800 - 150 * Math.cos(theta), 400 - 150 * Math.sin(theta));
        g.stroke();

        var phi = 90 * DEG_TO_RAD;
        g.beginPath();
        g.strokeStyle = "#ffffff"
        g.moveTo(800, 400);
        g.lineTo(800 - 100 * Math.cos(phi), 400 - 100* Math.sin(phi));
        g.stroke();

        phi = 2 * theta  - phi;

        g.beginPath();
        g.strokeStyle = "#ff0000"
        g.moveTo(800, 400);
        g.lineTo(800 + 100 * Math.cos(phi), 400 + 100* Math.sin(phi));
        g.stroke();*/
    }
}
