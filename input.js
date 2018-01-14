var camera;
var keyPressed;

function keydown(e) { keyPressed[e.code] = true; }

function keyup(e) { keyPressed[e.code] = false; }

function changeView(e)
{
    console.log(e.movementX);

    camera.yaw += e.movementX * 0.05;
    camera.pitch += -e.movementY * 0.05;

    if(camera.pitch > 89.0)
        camera.pitch = 89.0;
    if(camera.pitch < -89.0)
        camera.pitch = -89.0;

    vec3.set(camera.target,
        Math.cos(degToRad(camera.yaw)) * Math.cos(degToRad(camera.pitch)),
        Math.sin(degToRad(camera.pitch)),
        Math.sin(degToRad(camera.yaw)) * Math.cos(degToRad(camera.pitch)));
    vec3.normalize(camera.target, camera.target);
    vec3.add(camera.target, camera.target, camera.eye);

    mat4.lookAt(camera.viewMatrix, camera.eye, camera.target, camera.up);
}

document.addEventListener("keydown", keydown);
document.addEventListener("keyup", keyup);
const canvas = document.querySelector("#gl-canvas");
canvas.addEventListener("mousemove", changeView);
canvas.onmousedown = function() {
    canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;

    canvas.requestPointerLock();
};