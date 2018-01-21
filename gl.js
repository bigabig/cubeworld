var gl;
var programInfo;

main();

function main() {
    const canvas = document.querySelector("#gl-canvas");
    // Initialize the GL context
    gl = canvas.getContext("webgl");

    // Only continue if WebGL is available and working
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    const program = initShaders(gl, "vertex-shader-phong", "fragment-shader-phong");

    programInfo = {
        program: program,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
            normal: gl.getAttribLocation(program, 'aNormal'),
            textureCoord: gl.getAttribLocation(program, 'aTextureCoord'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix'),
            modelMatrix: gl.getUniformLocation(program, 'uModelMatrix'),
            viewMatrix: gl.getUniformLocation(program, 'uViewMatrix'),
            normalMatrix: gl.getUniformLocation(program, 'uNormalMatrix'),
            uSampler: gl.getUniformLocation(program, 'uSampler'),
            uKa: gl.getUniformLocation(program, 'uKa'),
            uKd: gl.getUniformLocation(program, 'uKd'),
            uKs: gl.getUniformLocation(program, 'uKs'),
            uSpecularExponent: gl.getUniformLocation(program, 'uSpecularExponent'),
            uLightPosition: gl.getUniformLocation(program, 'uLightPosition'),
            uIa: gl.getUniformLocation(program, 'uIa'),
            uId: gl.getUniformLocation(program, 'uId'),
            uIs: gl.getUniformLocation(program, 'uIs'),
        },
    };

    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);
}