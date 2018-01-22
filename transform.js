var camera;

class Transform {
    constructor(shader, position = {x: 0, y: 0, z: 0}, orientation = {x: 0, y: 0, z: 0}, scale = {x: 1, y: 1, z: 1}) {
        this.position = position;
        this.orientation = orientation;
        this.scale = scale;

        this.modelMatrix;
        this.normalMatrix;

        this.shader = shader;

        this.SetPositionScaleOrientation();
    }

    /**
     * Sets the model matrix
     * @param {Object} position x,y,z
     * @param {Object} orientation x,y,z - angles in degree
     */
    SetPositionScaleOrientation (position = this.position, orientation = this.orientation, scale = this.scale) {

        this.position = position;
        this.orientation.x = orientation.x % 360;
        this.orientation.y = orientation.y % 360;
        this.orientation.z = orientation.z % 360;

        // Convert the orientation to RAD
        orientation = {x: degToRad(orientation.x), y: degToRad(orientation.y), z: degToRad(orientation.z)};

        // Set the transformation matrix
        this.modelMatrix = mat4.create();
        mat4.translate(this.modelMatrix, this.modelMatrix, [position.x, position.y, position.z]);
        mat4.scale(this.modelMatrix, this.modelMatrix, [scale.x, scale.y, scale.z]);
        mat4.rotate(this.modelMatrix, this.modelMatrix, orientation.x, [1, 0, 0]);
        mat4.rotate(this.modelMatrix, this.modelMatrix, orientation.y, [0, 1, 0]);
        mat4.rotate(this.modelMatrix, this.modelMatrix, orientation.z, [0, 0, 1]);

        // Set the normal matrix
        let modelViewMatrix = mat4.create();
        mat4.multiply(modelViewMatrix, camera.viewMatrix, this.modelMatrix);
        this.normalMatrix = mat4.create();

        mat4.invert(this.normalMatrix, modelViewMatrix);
        mat4.transpose(this.normalMatrix, this.normalMatrix);
    }

    UpdateUniforms() {
        gl.useProgram(this.shader.program);

        // Set the normal matrix
        let modelViewMatrix = mat4.create();
        mat4.multiply(modelViewMatrix, camera.viewMatrix, this.modelMatrix);
        this.normalMatrix = mat4.create();

        mat4.invert(this.normalMatrix, modelViewMatrix);
        mat4.transpose(this.normalMatrix, this.normalMatrix);

        gl.uniformMatrix4fv(this.shader.uniformLocations.modelMatrix, false, this.modelMatrix);
        gl.uniformMatrix4fv(this.shader.uniformLocations.normalMatrix, false, this.normalMatrix);
    }
}