class Model {
    constructor(shader, size, lod) {
        this.shader = shader;

        this.size = size;
        this.lod = lod; // level of detail;

        this.positions;
        this.textures;
        this.normals;
        this.indices;

        this.vertexCount;

        this.InitBuffers();
    }

    GetVertexCount() {
        return this.vertexCount;
    }

    InitBuffers() {
        let size = this.size;

        let count = 0;
        let vertexCoords = [];
        let textureCoords = [];
        let normalCoords = [];
        let indices = [];
        console.log(1.0/this.lod);

        for (let i = 0; i < size; i = i + 1 / this.lod) {
            for (let j = 0; j < size; j = j + 1 / this.lod) {
                vertexCoords = vertexCoords.concat([
                    0.0 + i, 0.0, 1.0 / this.lod + j,
                    1.0 / this.lod + i, 0.0, 1.0 / this.lod + j,
                    1.0 / this.lod + i, 0.0, 0.0 + j,
                    0.0 + i, 0.0, 0.0 + j,
                ]);

                let t = 1.0 / (size * this.lod);

                textureCoords = textureCoords.concat([
                    0.0 + t * i * this.lod, 1 - t - t * j * this.lod,
                    0.0 + t + t * i * this.lod, 1 - t - t * j * this.lod,
                    0.0 + t + t * i * this.lod, 1 - t * j * this.lod,
                    0 + t * i * this.lod, 1 - t * j * this.lod
                ]);

                normalCoords = normalCoords.concat([
                    0.0, 1.0, 0.0,
                    0.0, 1.0, 0.0,
                    0.0, 1.0, 0.0,
                    0.0, 1.0, 0.0,
                ]);

                indices = indices.concat([
                    0 + count * 4, 1 + count * 4, 2 + count * 4, 0 + count * 4, 2 + count * 4, 3 + count * 4,    // front
                ]);

                count = count + 1;
            }
        }

        console.log(vertexCoords);
        console.log(textureCoords);
        // console.log(normalCoords);
        // console.log(indices);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexCoords), gl.STATIC_DRAW);
        this.vertexCount = vertexCoords.length;

        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);

        // NORMALS
        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalCoords), gl.STATIC_DRAW);

        // INDICES
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

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

        // Tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
    }
}