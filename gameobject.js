var gl;

class GameObject {
    constructor(texture_side, texture_top, normalmap = null, cubemapped = false, ka = {r: 0.2, g: 0.2, b: 0.2, a: 1.0}, kd = {r: 0.7, g: 0.7, b: 0.7, a: 1.0}, ks = {r: 0.4, g: 0.4, b: 0.4, a: 1.0}, specularExponent = 4) {
        this.cubemapped = cubemapped;

        this.shader = new Shader(cubemapped, true);
        this.transform = new Transform(this.shader, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0});
        this.material = new Material(this.shader, texture_side, texture_top, normalmap, cubemapped, ka, kd, ks, specularExponent);
        this.model = new Model(this.shader, 30);

        this.t = 0;

        console.log("TEST");
    }

    Render() {
        // Set the attributes
        this.model.UpdateAttributs();

        // Set the uniforms
        this.transform.UpdateUniforms();
        this.material.UpdateUniforms();

        if(!this.cubemapped) {
            this.material.ActivateNormalMap();

            this.material.ActivateTexture1();
            gl.drawElements(gl.TRIANGLES, 6 * this.model.size * this.model.size, gl.UNSIGNED_SHORT, 0);
        } else {
            this.material.ActivateTexturCubemap();
            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
        }
    }

    Update(deltaTime) {
        this.t = this.t + 5.0 * deltaTime;
        if ( this.t > 360)
            this.t = this.t -360;

        gl.uniform1f(this.shader.uniformLocations.uTime, this.t);
    }
}