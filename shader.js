var gl;

class Shader {
    constructor(cubemapped, temp = false) {
        this.AssignProgram(cubemapped, temp);
        this.SaveLocations();
    }

    AssignProgram(cubemapped, temp) {
        if (temp) {
            this.program = initShaders(gl, "vertex-shader-water", "fragment-shader-water");
        } else if(!cubemapped) {
            this.program = initShaders(gl, "vertex-shader-phong", "fragment-shader-phong");
        } else {
            this.program = initShaders(gl, "vertex-shader-skybox", "fragment-shader-skybox");
        }
    }

    SaveLocations() {
        gl.useProgram(this.program);

        this.attribLocations =  {
            vertexPosition: gl.getAttribLocation(this.program, 'aVertexPosition'),
                normal: gl.getAttribLocation(this.program, 'aNormal'),
                textureCoord: gl.getAttribLocation(this.program, 'aTextureCoord'),
        };
        this.uniformLocations = {
            projectionMatrix: gl.getUniformLocation(this.program, 'uProjectionMatrix'),
                modelMatrix: gl.getUniformLocation(this.program, 'uModelMatrix'),
                viewMatrix: gl.getUniformLocation(this.program, 'uViewMatrix'),
                normalMatrix: gl.getUniformLocation(this.program, 'uNormalMatrix'),
                uIsNormalMapped: gl.getUniformLocation(this.program, 'uIsNormalMapped'),
                uSampler: gl.getUniformLocation(this.program, 'uSampler'),
                uSamplerNormal: gl.getUniformLocation(this.program, 'uSamplerNormal'),
                uSamplerSkybox: gl.getUniformLocation(this.program, 'uSamplerSkybox'),
                uKa: gl.getUniformLocation(this.program, 'uKa'),
                uKd: gl.getUniformLocation(this.program, 'uKd'),
                uKs: gl.getUniformLocation(this.program, 'uKs'),
                uSpecularExponent: gl.getUniformLocation(this.program, 'uSpecularExponent'),
                uLightPosition: gl.getUniformLocation(this.program, 'uLightPosition'),
                uIa: gl.getUniformLocation(this.program, 'uIa'),
                uId: gl.getUniformLocation(this.program, 'uId'),
                uIs: gl.getUniformLocation(this.program, 'uIs'),
                uTime: gl.getUniformLocation(this.program, 'uTime'),
        };
    }
}