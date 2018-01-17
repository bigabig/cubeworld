var gl;
var programInfo;

var camera;

let objects = [];

main();

function main() {
    camera = new Camera(10);
    console.log(radToDeg(vec3.angle(camera.target, camera.eye)));

    var redLight = new Light();
    redLight.setPosition({x: 0.0, y: 5.0, z: 0.0});
    redLight.setDiffuse({r: 0.1, g: 0.1, b: 0.1, a: 1.0});
    //redLight.setSpecular({r: 1, g: 1, b: 1, a: 1.0});
    redLight.setSpecular({r: 1, g: 1, b: 1, a: 1.0});

    var blueLight = new Light();
    blueLight.setPosition({x: -7, y: 5, z: 7});
    blueLight.setDiffuse({r: .2, g: .2, b: 1, a: 1.0});
    blueLight.setSpecular({r: .5, g: .5, b: .5, a: 1.0});

    var greenLight = new Light();
    greenLight.setPosition({x: 7, y: 5, z: -7});
    greenLight.setDiffuse({r: .2, g: 1, b: .2, a: 1.0});
    greenLight.setSpecular({r: .5, g: .5, b: .5, a: 1.0});

    var lighting = new Lighting();
    lighting.setAmbient({r: .5, g: .5, b: .5, a: 1.0});
    lighting.setSpecularExponent(128);

    lighting.addLight(redLight);
    //lighting.addLight(blueLight);
    //lighting.addLight(greenLight);
    lighting.Update();

    /*
    for(let y = -10; y <= 10; y = y+2 ) {
        for(let x = -10; x <= 10; x = x + 2) {
            var cube = new Cube("textures/grass_top.png", "textures/grass_top.png");
            cube.SetPositionAndOrientation({x: x, y: 0, z: y});
            objects.push(cube);
        }
    }
    */

    var generator = new Generator(objects);
    //generator.GenerateTree({x:5, y: 2, z: 5}, 0);
    //generator.GenerateTree({x:-5, y: 2, z: -5}, 1);
    generator.GenerateTerrain(50, 30, 50);
    objects = generator.GetObjects();

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