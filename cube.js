var gl;
var programInfo;

var camera;

class Cube {
    constructor(texture, ka = {r: 0.3, g: 0.3, b: 0.3, a: 1.0}, kd = {r: 0.8, g: 0.8, b: 0.0, a: 1.0}, ks = {r: 1.0, g: 1.0, b: 1.0, a: 1.0}) {
        this.positions;
        this.textures;
        this.normals;
        this.indices;

        this.position = {x: 0, y: 0, z: 0};
        this.orientation = {x: 0, y: 0, z: 0};

        this.texture = loadTexture(texture);

        this.ka = ka;
        this.kd = kd;
        this.ks = ks;
        this.specularExponent = 4.0;

        this.InitBuffers();
        this.SetPositionAndOrientation();
    }

    /**
     * Sets the model matrix
     * @param {Object} position x,y,z
     * @param {Object} orientation x,y,z - angles in degree
     */
    SetPositionAndOrientation (position = this.position, orientation = this.orientation) {

        this.position = position;
        this.orientation.x = orientation.x % 360;
        this.orientation.y = orientation.y % 360;
        this.orientation.z = orientation.z % 360;

        // Convert the orientation to RAD
        orientation = {x: degToRad(orientation.x), y: degToRad(orientation.y), z: degToRad(orientation.z)};

        // Set the transformation matrix
        this.modelMatrix = mat4.create();
        mat4.translate(this.modelMatrix, this.modelMatrix, [position.x, position.y, position.z]);
        mat4.rotate(this.modelMatrix, this.modelMatrix, orientation.x, [1, 0, 0]);
        mat4.rotate(this.modelMatrix, this.modelMatrix, orientation.y, [0, 1, 0]);
        mat4.rotate(this.modelMatrix, this.modelMatrix, orientation.z, [0, 0, 1]);

        // Set the normal matrix
        let modelViewMatrix = mat4.create();
        mat4.multiply(modelViewMatrix, camera.viewMatrix, this.modelMatrix);
        this.normalMatrix = mat4.create();

        mat4.invert(this.normalMatrix, this.modelMatrix);
        mat4.transpose(this.normalMatrix, this.normalMatrix);

        //mat4.transpose(this.normalMatrix, modelViewMatrix);
        //mat4.invert(this.normalMatrix, this.normalMatrix);
    }

    InitBuffers() {
        // POSITIONS
        const positionBuffer = gl.createBuffer();

        // Select the positionBuffer as the one to apply buffer operations to from here out.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Now create an array of positions for the square.
        const positions = [
            // Front face
            -1.0, -1.0,  1.0,
            1.0, -1.0,  1.0,
            1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0, -1.0, -1.0,

            // Top face
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
            1.0,  1.0,  1.0,
            1.0,  1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,

            // Right face
            1.0, -1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0,  1.0,  1.0,
            1.0, -1.0,  1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0,
        ];

        // Now pass the list of positions into WebGL to build the shape.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        // TEXTURES
        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

        const textureCoordinates = [
            // Front
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Back
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
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
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Left
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
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

        // This array defines each face as two triangles, using the indices into the vertex array to specify each triangle's position.
        const indices = [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23,   // left
        ];

        // Now send the element array to GL
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        // Set the corresponding variables
        this.positions = positionBuffer;
        this.indices = indexBuffer;
        this.textures = textureCoordBuffer;
        this.normals = normalBuffer;
    }

    Render() {
        // Tell WebGL how to pull out the positions from the position buffer into the vertexPosition attribute.
        {
            const numComponents = 3;  // pull out 3 values per iteration
            const type = gl.FLOAT;    // the data in the buffer is 32bit floats
            const normalize = false;  // don't normalize
            const stride = 0;         // how many bytes to get from one set of values to the next
                                      // 0 = use type and numComponents above
            const offset = 0;         // how many bytes inside the buffer to start from
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positions);
            gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
            gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
        }

        // tell webgl how to pull out the texture coordinates from buffer
        {
            const num = 2; // every coordinate composed of 2 values
            const type = gl.FLOAT; // the data in the buffer is 32 bit float
            const normalize = false; // don't normalize
            const stride = 0; // how many bytes to get from one set to the next
            const offset = 0; // how many butes inside the buffer to start from
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textures);
            gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, num, type, normalize, stride, offset);
            gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
        }

        // tell webgl how to pull out the texture coordinates from buffer
        {
            const num = 3; // every coordinate composed of 2 values
            const type = gl.FLOAT; // the data in the buffer is 32 bit float
            const normalize = false; // don't normalize
            const stride = 0; // how many bytes to get from one set to the next
            const offset = 0; // how many butes inside the buffer to start from
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normals);
            gl.vertexAttribPointer(programInfo.attribLocations.normal, num, type, normalize, stride, offset);
            gl.enableVertexAttribArray(programInfo.attribLocations.normal);
        }

        // use texture
        // Tell WebGL we want to affect texture unit 0
        gl.activeTexture(gl.TEXTURE0);
        // Bind the texture to texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        // Tell the shader we bound the texture to texture unit 0
        gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

        // Tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);

        // Set the shader uniforms
        gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, this.modelMatrix);
        gl.uniformMatrix4fv(programInfo.uniformLocations.normalMatrix, false, this.normalMatrix);
        gl.uniform4fv(programInfo.uniformLocations.uKa, Object.values(this.ka));
        gl.uniform4fv(programInfo.uniformLocations.uKd, Object.values(this.kd));
        gl.uniform4fv(programInfo.uniformLocations.uKs, Object.values(this.ks));
        gl.uniform1f(programInfo.uniformLocations.uSpecularExponent, this.specularExponent);

        {
            const vertexCount = 36;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    }

    Update(deltaTime) {
        //this.SetPositionAndOrientation(this.position, {x: this.orientation.x + deltaTime * 180, y: this.orientation.y, z: this.orientation.z});
    }
}