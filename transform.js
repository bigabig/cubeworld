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
        //orientation = {x: degToRad(orientation.x), y: degToRad(orientation.y), z: degToRad(orientation.z)};

        // Set the transformation matrix
        this.modelMatrix = mat4.create();

        // rotation
        let q = quat.create();
        quat.fromEuler(q, orientation.x, orientation.y, orientation.z);
        // translation
        let v = vec3.fromValues(position.x, position.y, position.z);
        // scale
        let s = vec3.fromValues(scale.x, scale.y, scale.z);

        // calculate modelmatrix
        mat4.fromRotationTranslationScale(this.modelMatrix, q, v, s);

        // console.log("Model Matrix" + this.modelMatrix);
        //
        // let test = mat4.create();
        // mat4.translate(test, test, [position.x, position.y, position.z]);
        // mat4.scale(test, test, [scale.x, scale.y, scale.z]);
        // mat4.rotate(test, test, orientation.x, [1, 0, 0]);
        // mat4.rotate(test, test, orientation.y, [0, 1, 0]);
        // mat4.rotate(test, test, orientation.z, [0, 0, 1]);
        // console.log("TEST: "+test);

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