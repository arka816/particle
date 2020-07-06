var canvas, gl;

function initiate(){
    canvas = document.querySelector('#particleCanvas')
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if(gl == null){
        alert("no hardware support for webgl found");
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // STEP 2 : DEFINE THE GEOMETRY AND STORE IT IN BUFFER OBJECTS
    var vertices = [-0.5, 0.5, -0.5, -0.5, 0.0, -0.5,]
    var vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    // STEP 3: CREATE AND COMPILE SHADER PROGRAMS
    // vertex shader
    var vertexCode = 'attribute vec2 coordinates;' + 'void main(void){' + ' gl_Position = vec4(coordinates, 0.0, 1.0);' + '}';
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexCode);
    gl.compileShader(vertexShader);
    // fragment shader
    var fragmentCode = 'void main(void) {' + 'gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' + '}';
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentCode);
    gl.compileShader(fragmentShader);
    // create and use a combined shader program
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);


    // STEP 4 : ASSOCIATE THE SHADER PROGRAM TO BUFFER OBJECTS
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);


    // STEP 5: DRAWING THE REQUIRED OBJECT
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}