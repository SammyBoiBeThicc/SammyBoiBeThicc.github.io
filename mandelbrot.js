"use strict";

//
// Display a Mandelbrot set
//
var canvas;
var gl;

/* default data*/
var scale = 0.25;
var cx = 0.0;  /* center of window in complex plane */
var cy = 0.0;

var isClick = false;
var prevX = 0.0;
var prevY = 0.0;
var currX = 0.0;
var currY = 0.0;
var resVal = -1;
var program;

//----------------------------------------------------------------------------

onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );


    // Create and initialize a buffer object

    var points = [

        vec4(-1.0, -1.0, 0.0, 1.0),
        vec4(-1.0, 1.0, 0.0, 1.0),
        vec4(1.0, 1.0, 0.0, 1.0),
        vec4(1.0, 1.0, 0.0, 1.0),
        vec4(1.0, -1.0, 0.0, 1.0),
        vec4(-1.0, -1.0, 0.0, 1.0)
    ];

    // Load shaders and use the resulting shader program

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // set up vertex arrays
    var buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    var vPosition = gl.getAttribLocation( program, "vPosition" );

    gl.enableVertexAttribArray( vPosition );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0,0);
    gl.bufferData( gl.ARRAY_BUFFER,  flatten(points), gl.STATIC_DRAW );

    cx = -(canvas.width/canvas.height)*0.25;  /* center of window in complex plane */
    cy = 0.0;

    gl.uniform1f( gl.getUniformLocation(program, "scale"), scale);
    gl.uniform1f( gl.getUniformLocation(program, "cx"), cx);
    gl.uniform1f( gl.getUniformLocation(program, "cy"), cy);
    gl.uniform1i(gl.getUniformLocation(program,'res'),(resVal));

    canvas.onmousedown = function(event){
        prevX = ((event.x - event.target.getBoundingClientRect().left) - canvas.width/2)/(canvas.width/2);
        prevY = (canvas.height/2 - (event.y - event.target.getBoundingClientRect().top))/(canvas.height/2);
        isClick = true;
        drag(event);
    }
    canvas.onmouseup = function(event){
        isClick = false;
    }
    canvas.onmousemove = function (event) {
        currX = ((event.x - event.target.getBoundingClientRect().left) - canvas.width/2)/(canvas.width/2);
        currY = (canvas.height/2 - (event.y - event.target.getBoundingClientRect().top))/(canvas.height/2);
    }

    window.addEventListener('wheel',function(event){
        scale += 0.15 * scale * (event.deltaY/Math.abs(event.deltaY));
        console.log(resVal)
        resVal += 2*(event.deltaY/Math.abs(event.deltaY));
        gl.uniform1f(gl.getUniformLocation(program,"scale"),scale);
        gl.uniform1i(gl.getUniformLocation(program,'res'),(resVal));
    }, false);
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.viewport(0, 0, canvas.width, canvas.height);
    render();


    function drag(event) {
        if(isClick) {
            cx += (prevX - currX)/(scale);
            cy += (prevY - currY)/(scale+scale*0.5);
            prevX = currX;
            prevY = currY;
            gl.uniform1f( gl.getUniformLocation(program, "cx"), cx);
            gl.uniform1f( gl.getUniformLocation(program, "cy"), cy);
        }
        requestAnimFrame(drag);
    }
}

//----------------------------------------------------------------------------

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 6 );
    requestAnimFrame(render);
}
