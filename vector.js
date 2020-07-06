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
    let x = vec1.x - vec2.x;
    let y = vec1.y - vec2.y;
    return (x * x + y * y);
}
Vector.distance = function(vec1, vec2){
    return Math.sqrt(Vector.sqrDistance(vec1, vec2));
}
