var gl;

class Material {
    constructor(shader, texture1, texture2, normalmap = null, cubemapped = false, ka = {r: 0.2, g: 0.2, b: 0.2, a: 1.0}, kd = {r: 0.7, g: 0.7, b: 0.7, a: 1.0}, ks = {r: 0.4, g: 0.4, b: 0.4, a: 1.0}, specularExponent = 4,) {
        this.ka = ka;
        this.kd = kd;
        this.ks = ks;
        this.specularExponent = specularExponent;

        this.texture1;
        this.texture2;
        this.cubemapped = cubemapped;
        this.normalmapped = normalmap != null;
        this.normalmap;

        if(cubemapped) {
            this.texture1 = loadSkyboxTexture(texture1);
        } else {
            this.texture1 = loadTexture(texture1);
            this.texture2 = loadTexture(texture2);
        }
        if(this.normalmapped)
            this.normalmap = loadTexture(normalmap);

        this.shader = shader;
    }

    ActivateTexture1() {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture1);
        gl.uniform1i(this.shader.uniformLocations.uSampler, 0);
    }

    ActivateTexture2() {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture2);
        gl.uniform1i(this.shader.uniformLocations.uSampler, 0);
    }

    ActivateNormalMap() {
        if(this.normalmapped) {
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, this.normalmap);
            gl.uniform1i(this.shader.uniformLocations.uSamplerNormal, 1);
            gl.uniform1i(this.shader.uniformLocations.uIsNormalMapped, 1);
        }
    }

    ActivateTexturCubemap() {
        if(this.cubemapped) {
            //gl.activeTexture(gl.TEXTURE_CUBE_MAP);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture1);
            gl.uniform1i(this.shader.uSamplerSkybox, 0);
        }
    }

    UpdateUniforms() {
        gl.useProgram(this.shader.program);

        gl.uniform4fv(this.shader.uniformLocations.uKa, Object.values(this.ka));
        gl.uniform4fv(this.shader.uniformLocations.uKd, Object.values(this.kd));
        gl.uniform4fv(this.shader.uniformLocations.uKs, Object.values(this.ks));
        gl.uniform1f(this.shader.uniformLocations.uSpecularExponent, this.specularExponent);
    }
}