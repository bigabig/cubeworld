var gl;
var programInfo;

var keyPressed = {
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false
};

class Camera {
    constructor(speed) {
        this.speed = speed;
        this.yaw = -90.0;
        this.pitch = -89.0;

        this.viewMatrix;
        this.projectionMatrix;

        // view Matrix
        this.eye = vec3.fromValues(0.0, 20, 1.0);
        this.target = vec3.fromValues(0.0, 2.0, 0.0);
        this.up = vec3.fromValues(0.0, 1.0, 0.0);

        // projection matrix (a perspective matrix)
        this.fieldOfView = 45;   // in radians
        this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        this.zNear = 0.1;
        this.zFar = 100.0;

        this.CreateProjectionMatrix();
        this.CreateViewMatrix();
    }

    CreateProjectionMatrix() {
        this.projectionMatrix = mat4.create();
        mat4.perspective(this.projectionMatrix, this.fieldOfView * Math.PI / 180, this.aspect, this.zNear, this.zFar);
        gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, this.projectionMatrix);
    }

    CreateViewMatrix() {
        this.viewMatrix = mat4.create();
        mat4.lookAt(this.viewMatrix, this.eye, this.target, this.up);
    }

    Update(deltaTime) {
        /*
        let look = [(this.target[0] - this.eye[0]) * this.speed * deltaTime,
            (this.target[1] - this.eye[1]) * this.speed * deltaTime,
            (this.target[2] - this.eye[2]) * this.speed * deltaTime];
            */

        let look = vec3.create();
        vec3.sub(look, this.target, this.eye);
        vec3.scale(look, look, this.speed * deltaTime);

        if(keyPressed.KeyW) {
            vec3.add(this.eye, this.eye, look);
            vec3.add(this.target, this.target, look);
        }
        if(keyPressed.KeyS) {
            vec3.sub(this.eye, this.eye, look);
            vec3.sub(this.target, this.target, look);
        }
        if(keyPressed.KeyA) {
            this.eye[0] += look[2];
            this.eye[2] -= look[0];
            this.target[0] += look[2];
            this.target[2] -= look[0];
        }
        if(keyPressed.KeyD) {
            this.eye[0] -= look[2];
            this.eye[2] += look[0];
            this.target[0] -= look[2];
            this.target[2] += look[0];
        }
        mat4.lookAt(this.viewMatrix, this.eye, this.target, this.up);

        // Set view matrix
        gl.uniformMatrix4fv(programInfo.uniformLocations.viewMatrix, false, this.viewMatrix);
    }
}