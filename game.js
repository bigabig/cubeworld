var gl;
var programInfo;

var camera;

let objects = [];
let lighting;

main();

function main() {
    var redLight = new Light();
    redLight.setPosition({x: 15, y: 15, z: 15});
    redLight.setDiffuse({r: 0.7, g: 0.7, b: 0.7, a: 1.0});
    //redLight.setSpecular({r: 1, g: 1, b: 1, a: 1.0});
    redLight.setSpecular({r: 0.4, g: 0.4, b: 0.4, a: 1.0});

    var blueLight = new Light();
    blueLight.setPosition({x: -7, y: 5, z: 7});
    blueLight.setDiffuse({r: .2, g: .2, b: 1, a: 1.0});
    blueLight.setSpecular({r: .5, g: .5, b: .5, a: 1.0});

    var greenLight = new Light();
    greenLight.setPosition({x: 7, y: 5, z: -7});
    greenLight.setDiffuse({r: .2, g: 1, b: .2, a: 1.0});
    greenLight.setSpecular({r: .5, g: .5, b: .5, a: 1.0});

    lighting = new Lighting();
    lighting.setAmbient({r: .5, g: .5, b: .5, a: 1.0});

    lighting.addLight(redLight);
    //lighting.addLight(blueLight);
    //lighting.addLight(greenLight);

    lighting.Init();

    camera = new Camera(10);

    let c = new Cube([
        "textures/skybox_posx.jpg", "textures/skybox_negx.jpg",
        "textures/skybox_posy.jpg", "textures/skybox_negy.jpg",
        "textures/skybox_posz.jpg", "textures/skybox_negz.jpg"
    ], "textures/skybox_posx.jpg", null, true);
    c.transform.position = {x: 21, y: 10, z: 21};
    c.transform.scale = {x: 50, y: 50, z: 50};
    c.transform.SetPositionScaleOrientation();
    objects.push(c);

    let n = new GameObject("textures/water.png", "textures/water.png", "textures/water_NORM.png");
    objects.push(n);
    let f = new GameObject("textures/water.png", "textures/water.png", "textures/water_NORM.png");
    f.transform.position = {x: 2.5, y: 0, z: 2.5};
    f.transform.SetPositionScaleOrientation();
    objects.push(f);
    f = new GameObject("textures/water.png", "textures/water.png", "textures/water_NORM.png");
    f.transform.position = {x: 0, y: 0, z: 2};
    f.transform.SetPositionScaleOrientation();
    objects.push(f);
    f = new GameObject("textures/water.png", "textures/water.png", "textures/water_NORM.png");
    f.transform.position = {x: 2, y: 0, z: 0};
    f.transform.SetPositionScaleOrientation();
    objects.push(f);
    // var generator = new Generator(objects);
    // generator.GenerateTree({x:5, y: 2, z: 5}, 0);
    // generator.GenerateTree({x:-5, y: 2, z: -5}, 1);
    // generator.GenerateTerrain(20, 30, 20);
    // objects = generator.GetObjects();

    requestAnimationFrame(gameLoop);
}

function render() {
    //gl.enable(gl.CULL_FACE);
    //gl.cullFace(gl.BACK);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    objects.forEach(function(object) {
        lighting.UpdateUniforms(object.shader);
        camera.UpdateUniforms(object.shader);
        object.Render();
    });
}

function update(deltaTime) {
    objects.forEach(function(object) {
        object.Update(deltaTime);
    });

    camera.Update(deltaTime);
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