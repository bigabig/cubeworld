class MyNoise {
    constructor() {
        this.simplex = new SimplexNoise();
    }

    SimpleNoise(x, y, z) {
        return this.simplex.noise3D(x, y, z);
    }

    Noise(x, y, z, height, exp) {
        let noise = (this.simplex.noise3D(x, y, z) + 1) / 2;
        noise = noise * height;
        noise = Math.pow(noise, exp);
        noise = Math.round(noise);

        console.log(noise);

        return noise;
    }

    NewNoise(x, y, z, height, freq) {
        let noise = (this.simplex.noise3D(x * freq, y * freq, z * freq) + 1) / 2;
        noise = noise * height;
        noise = Math.round(noise);

        console.log(noise);

        return noise;
    }

    MultipleNoises(x, y, z, height, exp, freq, count) {
        let result = 0;

        for(let i = 0; i < count; i++) {
            let n = (1 / Math.pow(2, i));
            let noise = (this.simplex.noise3D(x * freq * n, y * freq * n, z * freq * n) + 1) / 2;
            noise = n * noise;
            result = result + noise;
            noise = noise + (1 / Math.pow(2, i)) * this.NewNoise(x, y, z, height,  Math.pow(2, i))
        }

        result = result * height;
        result = Math.pow(result, exp);
        result = Math.round(result);

        return result;
    }
}

class Generator {
    constructor(objects) {
        this.objects = objects;
    }

    GenerateTree(position = {x: 0, y: 0, z: 0}, variant = 0) {
        let stamm = [
            [0, 0, 0],
            [0, 1, 0],
            [0, 2, 0],
            [0, 3, 0],
            [0, 4, 0],
            [0, 5, 0],
            [0, 6, 0],
        ];

        let leaves = [
            [
                [1, 8, 0],
                [-1, 8, 0],
                [0, 8, 1],
                [0, 8, -1],
                [0, 8, 0],

                [0, 7, 0],

                [1, 6, 0],
                [-1, 6, 0],
                [0, 6, 1],
                [0, 6, -1],

                [1, 5, 0],
                [-1, 5, 0],
                [0, 5, 1],
                [0, 5, -1],
                [1, 5, 1],
                [1, 5, -1],
                [-1, 5, 1],
                [-1, 5, -1],

                [-1, 5, 2],
                [0, 5, 2],
                [1, 5, 2],
                [-1, 5, -2],
                [0, 5, -2],
                [1, 5, -2],

                [2, 5, -1],
                [2, 5, 0],
                [2, 5, 1],
                [-2, 5, -1],
                [-2, 5, 0],
                [-2, 5, 1],

                [1, 4, 0],
                [-1, 4, 0],
                [0, 4, 1],
                [0, 4, -1],

                [1, 3, 0],
                [-1, 3, 0],
                [0, 3, 1],
                [0, 3, -1],
                [1, 3, 1],
                [1, 3, -1],
                [-1, 3, 1],
                [-1, 3, -1],

                [-1, 3, 2],
                [0, 3, 2],
                [1, 3, 2],
                [-1, 3, -2],
                [0, 3, -2],
                [1, 3, -2],

                [2, 3, -1],
                [2, 3, 0],
                [2, 3, 1],
                [-2, 3, -1],
                [-2, 3, 0],
                [-2, 3, 1],

                [1, 2, 0],
                [-1, 2, 0],
                [0, 2, 1],
                [0, 2, -1],
            ],[
                [1, 8, 0],
                [-1, 8, 0],
                [0, 8, 1],
                [0, 8, -1],
                [0, 8, 0],

                [0, 7, 0],

                [1, 6, 0],
                [-1, 6, 0],
                [0, 6, 1],
                [0, 6, -1],

                [1, 5, 0],
                [-1, 5, 0],
                [0, 5, 1],
                [0, 5, -1],
                [1, 5, 1],
                [1, 5, -1],
                [-1, 5, 1],
                [-1, 5, -1],

                [-1, 5, 2],
                [0, 5, 2],
                [1, 5, 2],
                [-1, 5, -2],
                [0, 5, -2],
                [1, 5, -2],

                [2, 5, -1],
                [2, 5, 0],
                [2, 5, 1],
                [-2, 5, -1],
                [-2, 5, 0],
                [-2, 5, 1],

                [1, 4, 0],
                [-1, 4, 0],
                [0, 4, 1],
                [0, 4, -1],

                [1, 3, 0],
                [-1, 3, 0],
                [0, 3, 1],
                [0, 3, -1],
                [1, 3, 1],
                [1, 3, -1],
                [-1, 3, 1],
                [-1, 3, -1],

                [-1, 3, 2],
                [0, 3, 2],
                [1, 3, 2],
                [-1, 3, -2],
                [0, 3, -2],
                [1, 3, -2],

                [2, 3, -1],
                [2, 3, 0],
                [2, 3, 1],
                [-2, 3, -1],
                [-2, 3, 0],
                [-2, 3, 1],

                [1, 2, 0],
                [-1, 2, 0],
                [0, 2, 1],
                [0, 2, -1],
                [1, 2, 1],
                [1, 2, -1],
                [-1, 2, 1],
                [-1, 2, -1],

                [2, 2, 0],
                [-2, 2, 0],
                [0, 2, 2],
                [0, 2, -2],
                [2, 2, 2],
                [2, 2, -2],
                [-2, 2, 2],
                [-2, 2, -2],

                [-1, 2, 2],
                [1, 2, 2],
                [2, 2, 1],
                [-2, 2, 1],

                [-2, 2, -1],
                [2, 2, -1],
                [-1, 2, -2],
                [1, 2, -2],

                [-1, 2, -3],
                [0, 2, -3],
                [1, 2, -3],
                [-1, 2, 3],
                [0, 2, 3],
                [1, 2, 3],
                [3, 2, -1],
                [3, 2, 0],
                [3, 2, 1],
                [-3, 2, -1],
                [-3, 2, 0],
                [-3, 2, 1],
            ]
    ];
        let tree = [];

        stamm.forEach(function(t) {
            var cube = new Cube("textures/log_spruce.png", "textures/log_spruce_top.png");
            cube.SetPositionAndOrientation({x: position.x + t[0] * 2, y: position.y + t[1] * 2, z: position.z + t[2] * 2});
            tree.push(cube);
        });

        leaves[variant].forEach(function(l) {
            var cube = new Cube("textures/leaves_oak_opaque.png", "textures/leaves_oak_opaque.png");
            cube.SetPositionAndOrientation({x: position.x + l[0] * 2, y: position.y + l[1] * 2, z: position.z + l[2] * 2});
            tree.push(cube);
        });

        this.objects = this.objects.concat(tree);
    }

    GenerateTerrain(xSize, ySize, zSize) {
        let blocks = [];

        var myNoise = new MyNoise();

        for(let x = 0; x <= xSize; x++) {
            for(let z = 0; z <= zSize; z++) {
                //let height = myNoise.Noise(x/50, 0, z/50, 5, 1);

                let height = myNoise.MultipleNoises(x, 0, z, 7, 1, 1/50, 1);
                let max = 0;
                let R = this.GetR(height);

                if(R !== -1) {
                    for(let zn = z - R; zn <= z + R; zn++) {
                        for(let xn = x - R; xn <= x + R; xn++) {
                            let e = myNoise.SimpleNoise(xn, 0, zn);
                            if(e > max)
                                max = e;
                        }
                    }
                    if(myNoise.SimpleNoise(x, 0, z) == max) {
                        this.GenerateTree({x: x * 2, y: (height + 1) * 2, z: z * 2}, 0);
                    }
                }

                /*
                let stone = myNoise.Noise(x, 0, z, 3, .5);
                stone = stone + myNoise.Noise(x, 0, z, 4, .5);
                let dirt = myNoise.Noise(x, 100, z, 2, .5) + 1;
                */

                for(let y = 0; y <= ySize; y++) {

                    if(y == height) {
                        var cube = this.GetBlock(height);
                        cube.SetPositionAndOrientation({x: x * 2, y: y * 2, z: z * 2});
                        blocks.push(cube);
                    }

                    if((x == 0 || z == 0 || x == xSize || z == zSize) && y < height) {
                        var cube = this.GetBlock(height);
                        cube.SetPositionAndOrientation({x: x * 2, y: y * 2, z: z * 2});
                        blocks.push(cube);
                    }


                    /*
                    if(y <= stone) {
                        var cube = new Cube("textures/sand.png", "textures/sand.png");
                        cube.SetPositionAndOrientation({x: x * 2, y: y * 2, z: z * 2});
                        blocks.push(cube);
                    } else if (y <= dirt+stone) {
                        var cube = new Cube("textures/grass_top.png", "textures/grass_top.png");
                        cube.SetPositionAndOrientation({x: x * 2, y: y * 2, z: z * 2});
                        blocks.push(cube);
                    }
                    */
                }

            }
        }

        this.objects = this.objects.concat(blocks);
    }

    GetR(height) {
        var r;
        if(height <= 1) {
            r = -1;
        } else if (height <= 3) {
            r = 16;
        } else if (height <= 8) {
            r = 8;
        } else if (height <= 13) {
            r = 16;
        } else {
            r = 20;
        }
        return r;
    }

    GetBlock(height) {
        var cube;
        if(height <= 1) {
            cube = new Cube("textures/water.png", "textures/water.png");
        } else if (height <= 3) {
            cube = new Cube("textures/sand.png", "textures/sand.png");
        } else if (height <= 8) {
            cube = new Cube("textures/grass_side.png", "textures/grass_top.png");
        } else if (height <= 13) {
            cube = new Cube("textures/stone.png", "textures/stone.png");
        } else {
            cube = new Cube("textures/snow.png", "textures/snow.png");
        }
        return cube;
    }

    GetObjects() { return this.objects; }
}