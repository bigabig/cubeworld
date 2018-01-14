var gl;
var programInfo;

var camera;

let objects = [];

main();

function main() {
    camera = new Camera(10);
    console.log(radToDeg(vec3.angle(camera.target, camera.eye)));

    gl.uniform3fv(programInfo.uniformLocations.uLightPosition, [0.0, 6.0, 0.0]);
    gl.uniform4fv(programInfo.uniformLocations.uIa, [0.3, 0.3, 0.3, 1.0]);
    gl.uniform4fv(programInfo.uniformLocations.uId, [0.5, 0.5, 0.5, 1.0]);
    gl.uniform4fv(programInfo.uniformLocations.uIs, [0.7, 0.7, 0.7, 1.0]);

    var cube = new Cube();
    cube.SetPositionAndOrientation({x: 0, y: 7, z: 0});
    objects.push(cube);

    for(let y = -10; y <= 10; y = y+2 ) {
        for(let x = -10; x <= 10; x = x + 2) {
            var cube = new Cube("textures/grass_top.png");
            cube.SetPositionAndOrientation({x: x, y: 0, z: y});
            objects.push(cube);
        }
    }


    var cube = new Cube("textures/leaves_oak_opaque.png");
    cube.SetPositionAndOrientation({x: 2, y: 2, z: 2});
    objects.push(cube);

    var cube = new Cube("textures/log_spruce.png");
    cube.SetPositionAndOrientation({x: 4, y: 2, z: 4});
    objects.push(cube);

    var cube = new Cube("textures/sand.png");
    cube.SetPositionAndOrientation({x: -3, y: 2, z: -3});
    objects.push(cube);


    requestAnimationFrame(gameLoop);
}

function render() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    objects.forEach(function(object) {
        object.Render();
    });
}

function update(deltaTime) {
    camera.Update(deltaTime);

    objects.forEach(function(object) {
        object.Update(deltaTime);
    });
}

var then = 0;
function gameLoop(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    update(deltaTime);
    render();
    requestAnimationFrame(gameLoop);
}