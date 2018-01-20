var gl;
var programInfo;

class Lighting {
    constructor(ambient = {r: 0.45, g: 0.23, b: 0.8, a: 1.0}) {
        this.lightings = [];
        this.ambient = ambient;

        this.positions;
        this.diffuse;
        this.specular;
    }

    setAmbient(ambient) { this.ambient = ambient; }

    addLight(light) {
        this.lightings.push(light);
    }

    Init() {
        let positions = [];
        let diffuse = [];
        let specular = [];

        this.lightings.forEach(function(light) {
            positions = positions.concat(light.getPosition());
            diffuse = diffuse.concat(light.getDiffuse());
            specular = specular.concat(light.getSpecular());
        });

        this.positions = positions;
        this.diffuse = diffuse;
        this.specular = specular;
    }

    Update() {
        gl.uniform3fv(programInfo.uniformLocations.uLightPosition, this.positions);
        gl.uniform4fv(programInfo.uniformLocations.uIa, Object.values(this.ambient));
        gl.uniform4fv(programInfo.uniformLocations.uId, this.diffuse);
        gl.uniform4fv(programInfo.uniformLocations.uIs, this.specular);
    }
}

class Light {
    constructor(position = {x: 0, y: 0, z: 0}, diffuse = {r: 0.3, g: 0.3, b: 0.3, a: 1.0}, specular = {r: 0.6, g: 0.6, b: 0.6, a: 1.0}) {
        this.position = position;
        this.diffuse = diffuse;
        this.specular = specular;
    }

    setPosition(position) { this.position = position; }
    getPosition() { return Object.values(this.position); }
    setDiffuse(diffuse) { this.diffuse = diffuse; }
    getDiffuse() { return Object.values(this.diffuse);}
    setSpecular(specular) { this.specular = specular; }
    getSpecular() { return Object.values(this.specular);}
}