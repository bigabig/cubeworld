var keyPressed;
var mouseMove;

function keydown(e) { keyPressed[e.code] = true; }

function keyup(e) { keyPressed[e.code] = false; }

function changeView(e)
{
    mouseMove.x += e.movementX;
    mouseMove.y += e.movementY;
}

document.addEventListener("keydown", keydown);
document.addEventListener("keyup", keyup);

const canvas = document.querySelector("#gl-canvas");
canvas.addEventListener("mousemove", changeView);

canvas.onmousedown = function() {
    canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;

    canvas.requestPointerLock();
};