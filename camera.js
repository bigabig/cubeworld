var gl;
var programInfo;

var keyPressed = {
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false,
    ShiftLeft: false
};

var mouseMove = {
    x: 0,
    y: 0,
};

let upVector = vec3.fromValues(0.0, 1.0, 0.0);

class Camera {
    constructor(speed) {
        this.normalSpeed = speed;
        this.sprintSpeed = 2 * speed;
        this.speed

        this.pitch  = -90;
        this.yaw = 0;

        this.position = vec3.fromValues(5.0, 10.0, 5.0);
        this.direction = vec3.create();
        this.front = vec3.create();
        this.up = upVector;

        this.fieldOfView = 45;
        this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        this.zNear = 0.1;
        this.zFar = 100.0;

        this.viewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();

        mat4.lookAt(this.viewMatrix, this.position, this.position, this.up);
        gl.uniformMatrix4fv(programInfo.uniformLocations.viewMatrix, false, this.viewMatrix);
        this.CreateProjectionMatrix();
    }

    CreateProjectionMatrix() {
        mat4.perspective(this.projectionMatrix, this.fieldOfView * Math.PI / 180, this.aspect, this.zNear, this.zFar);
        gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, this.projectionMatrix);
    }

    Update(deltaTime) {
        if(mouseMove.x !== 0 || mouseMove.y !== 0) {

            this.yaw = this.yaw - mouseMove.x * 0.05;
            this.pitch = this.pitch - mouseMove.y * 0.05;

            if(this.pitch > 89.0)
                this.pitch = 89.0;
            if(this.pitch < -89.0)
                this.pitch = -89.0;

            let q = quat.create();
            quat.fromEuler(q, this.pitch, this.yaw, 0);

            let front = vec3.fromValues(0, 0, -1);
            vec3.transformQuat(front, front, q);
            vec3.normalize(front, front);
            this.front = front;

            let up = vec3.fromValues(0, 1, 0);
            vec3.transformQuat(up, up, q);
            vec3.normalize(up, up);
            this.up = up;

            mouseMove.x = 0;
            mouseMove.y = 0;
        }

        if(keyPressed.ShiftLeft) {
            this.speed = this.sprintSpeed;
        } else {
            this.speed = this.normalSpeed;
        }
        if(keyPressed.KeyW) {
            let movement = vec3.create();
            vec3.scale(movement, this.front, deltaTime * this.speed);
            vec3.add(this.position, this.position, movement);
        }
        if(keyPressed.KeyS) {
            let movement = vec3.create();
            vec3.scale(movement, this.front, deltaTime * this.speed);
            vec3.subtract(this.position, this.position, movement);
        }
        if(keyPressed.KeyA) {
            let movement = vec3.create();
            vec3.cross(movement, this.front, upVector);
            vec3.normalize(movement, movement);
            vec3.scale(movement, movement, deltaTime * this.speed);
            vec3.subtract(this.position, this.position, movement);
        }
        if(keyPressed.KeyD) {
            let movement = vec3.create();
            vec3.cross(movement, this.front, upVector);
            vec3.normalize(movement, movement);
            vec3.scale(movement, movement, deltaTime * this.speed);
            vec3.add(this.position, this.position, movement);
        }

        vec3.add(this.direction, this.position, this.front);

        // console.log("DIRECTION:"+this.direction);
        // console.log("RIGHT:"+right);
        // console.log("POSITION:"+this.position);
        // console.log("UP:"+this.up);
        // console.log("FRONT:"+this.front);

        mat4.lookAt(this.viewMatrix, this.position, this.direction, this.up);

        // Set view matrix
        gl.uniformMatrix4fv(programInfo.uniformLocations.viewMatrix, false, this.viewMatrix);
    }
}