var gl;

class Cube {
    constructor(texture_side, texture_top, cubemapped = false, ka = {r: 0.2, g: 0.2, b: 0.2, a: 1.0}, kd = {r: 0.7, g: 0.7, b: 0.7, a: 1.0}, ks = {r: 0.4, g: 0.4, b: 0.4, a: 1.0}, specularExponent = 4) {
        this.positions;
        this.textures;
        this.normals;
        this.indices;

        this.cubemapped = cubemapped;

        this.shader = new Shader(cubemapped);
        this.transform = new Transform(this.shader, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0});
        this.material = new Material(this.shader, texture_side, texture_top, cubemapped, ka, kd, ks, specularExponent);

        this.InitBuffers();
    }

    InitBuffers() {
        // POSITIONS
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = [
            // Front face
            -1.0, -1.0,  1.0,
            1.0, -1.0,  1.0,
            1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,

            // Back face
            1.0, -1.0, -1.0,
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
            1.0,  1.0, -1.0,

            // Top face
            -1.0,  1.0,  1.0,
            1.0,  1.0,  1.0,
            1.0,  1.0, -1.0,
            -1.0,  1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,

            // Right face
            1.0, -1.0,  1.0,
            1.0, -1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0,  1.0,  1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        // TEXTURES
        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        const textureCoordinates = [
            // Front
            0.0,  1.0,
            1.0,  1.0,
            1.0,  0.0,
            0.0,  0.0,
            // Back
            0.0,  1.0,
            1.0,  1.0,
            1.0,  0.0,
            0.0,  0.0,
            // Top
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Bottom
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Right
            0.0,  1.0,
            1.0,  1.0,
            1.0,  0.0,
            0.0,  0.0,
            // Left
            0.0,  1.0,
            1.0,  1.0,
            1.0,  0.0,
            0.0,  0.0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

        // NORMALS
        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        const vertexNormals = [
            // Front
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,

            // Back
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,

            // Top
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,

            // Bottom
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,

            // Right
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,

            // Left
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);

        // INDICES
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        const indices = [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23,   // left
        ];
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        // Set the corresponding variables
        this.positions = positionBuffer;
        this.indices = indexBuffer;
        this.textures = textureCoordBuffer;
        this.normals = normalBuffer;
    }

    UpdateAttributs() {
        gl.useProgram(this.shader.program);

        // Tell WebGL how to pull out the positions from the position buffer into the vertexPosition attribute.
        {
            const numComponents = 3;  // pull out 3 values per iteration
            const type = gl.FLOAT;    // the data in the buffer is 32bit floats
            const normalize = false;  // don't normalize
            const stride = 0;         // how many bytes to get from one set of values to the next
                                      // 0 = use type and numComponents above
            const offset = 0;         // how many bytes inside the buffer to start from
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positions);
            gl.vertexAttribPointer(this.shader.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
            gl.enableVertexAttribArray(this.shader.attribLocations.vertexPosition);
        }

        if(!this.cubemapped) {
            // tell webgl how to pull out the texture coordinates from buffer
            {
                const num = 2; // every coordinate composed of 2 values
                const type = gl.FLOAT; // the data in the buffer is 32 bit float
                const normalize = false; // don't normalize
                const stride = 0; // how many bytes to get from one set to the next
                const offset = 0; // how many butes inside the buffer to start from
                gl.bindBuffer(gl.ARRAY_BUFFER, this.textures);
                gl.vertexAttribPointer(this.shader.attribLocations.textureCoord, num, type, normalize, stride, offset);
                gl.enableVertexAttribArray(this.shader.attribLocations.textureCoord);
            }

            // tell webgl how to pull out the normals from buffer
            {
                const num = 3; // every coordinate composed of 2 values
                const type = gl.FLOAT; // the data in the buffer is 32 bit float
                const normalize = false; // don't normalize
                const stride = 0; // how many bytes to get from one set to the next
                const offset = 0; // how many butes inside the buffer to start from
                gl.bindBuffer(gl.ARRAY_BUFFER, this.normals);
                gl.vertexAttribPointer(this.shader.attribLocations.normal, num, type, normalize, stride, offset);
                gl.enableVertexAttribArray(this.shader.attribLocations.normal);
            }
        }

        // Tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
    }

    Render() {
        // Set the attributes
        this.UpdateAttributs();

        // Set the uniforms
        this.transform.UpdateUniforms();
        this.material.UpdateUniforms();

        if(!this.cubemapped) {
            this.material.ActivateTexture1();
            gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_SHORT, 0);

            this.material.ActivateTexture2();
            gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_SHORT, 24);

            this.material.ActivateTexture1();
            gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_SHORT, 48);
        } else {
            this.material.ActivateTexturCubemap();
            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
        }
    }

    Update(deltaTime) {
        //this.SetPositionAndOrientation(this.position, {x: this.orientation.x + deltaTime * 180, y: this.orientation.y, z: this.orientation.z});
    }
}