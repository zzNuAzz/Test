$(document).ready(function() {
    function ImprovedNoise() {
        let p = [
            151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10,
            23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87,
            174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211,
            133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208,
            89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250,
            124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170,
            213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79,
            113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145,
            235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
            138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
        ];

        function fade(t) {
            return t * t * t * (t * (t * 6 - 15) + 10);
        }

        function lerp(t, a, b) {
            return a + t * (b - a);
        }

        function grad(hash, x, y, z) {
            const h = hash & 15;
            const u = h < 8 ? x : y,
                v = h < 4 ? y : h == 12 || h == 14 ? x : z;
            return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
        }

        return {
            noise(x, y, z) {
                const floorX = Math.floor(x),
                    floorY = Math.floor(y),
                    floorZ = Math.floor(z);

                const X = floorX & 255,
                    Y = floorY & 255,
                    Z = floorZ & 255;

                x -= floorX;
                y -= floorY;
                z -= floorZ;

                const xMinus1 = x - 1,
                    yMinus1 = y - 1,
                    zMinus1 = z - 1;

                const u = fade(x),
                    v = fade(y),
                    w = fade(z);

                const A = p[X] + Y,
                    AA = p[A] + Z,
                    AB = p[A + 1] + Z,
                    B = p[X + 1] + Y,
                    BA = p[B] + Z,
                    BB = p[B + 1] + Z;

                return lerp(
                    w,
                    lerp(
                        v,
                        lerp(u, grad(p[AA], x, y, z), grad(p[BA], xMinus1, y, z)),
                        lerp(u, grad(p[AB], x, yMinus1, z), grad(p[BB], xMinus1, yMinus1, z))
                    ),
                    lerp(
                        v,
                        lerp(
                            u,
                            grad(p[AA + 1], x, y, zMinus1),
                            grad(p[BA + 1], xMinus1, y, z - 1)
                        ),
                        lerp(
                            u,
                            grad(p[AB + 1], x, yMinus1, zMinus1),
                            grad(p[BB + 1], xMinus1, yMinus1, zMinus1)
                        )
                    )
                );
            }
        };
    };

    // Pseudo-random generator
    function Marsaglia(i1, i2) {
        // from http://www.math.uni-bielefeld.de/~sillke/ALGORITHMS/random/marsaglia-c
        let z = i1 || 362436069,
            w = i2 || 521288629;
        let nextInt = function() {
            z = (36969 * (z & 65535) + (z >>> 16)) & 0xffffffff;
            w = (18000 * (w & 65535) + (w >>> 16)) & 0xffffffff;
            return (((z & 0xffff) << 16) | (w & 0xffff)) & 0xffffffff;
        };

        this.nextDouble = function() {
            const i = nextInt() / 4294967296;
            return i < 0 ? 1 + i : i;
        };
        this.nextInt = nextInt;
    }
    Marsaglia.createRandomized = function() {
        const now = new Date();
        return new Marsaglia((now / 60000) & 0xffffffff, now & 0xffffffff);
    };

    // Noise functions and helpers
    function PerlinNoise(seed) {
        const rnd =
            seed !== undefined ? new Marsaglia(seed) : Marsaglia.createRandomized();

        // http://www.noisemachine.com/talk1/17b.html
        // http://mrl.nyu.edu/~perlin/noise/
        // generate permutation
        const p = new Array(512);
        for (let i = 0; i < 256; ++i) {
            p[i] = i;
        }
        for (let i = 0; i < 256; ++i) {
            const t = p[(j = rnd.nextInt() & 0xff)];
            p[j] = p[i];
            p[i] = t;
        }
        // copy to avoid taking mod in p[0];
        for (let i = 0; i < 256; ++i) {
            p[i + 256] = p[i];
        }

        function grad3d(i, x, y, z) {
            const h = i & 15; // convert into 12 gradient directions
            const u = h < 8 ? x : y,
                v = h < 4 ? y : h === 12 || h === 14 ? x : z;
            return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
        }

        function grad2d(i, x, y) {
            const v = (i & 1) === 0 ? x : y;
            return (i & 2) === 0 ? -v : v;
        }

        function grad1d(i, x) {
            return (i & 1) === 0 ? -x : x;
        }

        function lerp(t, a, b) {
            return a + t * (b - a);
        }

        this.noise3d = function(x, y, z) {
            const X = Math.floor(x) & 255,
                Y = Math.floor(y) & 255,
                Z = Math.floor(z) & 255;
            x -= Math.floor(x);
            y -= Math.floor(y);
            z -= Math.floor(z);
            const fx = (3 - 2 * x) * x * x,
                fy = (3 - 2 * y) * y * y,
                fz = (3 - 2 * z) * z * z;
            const p0 = p[X] + Y,
                p00 = p[p0] + Z,
                p01 = p[p0 + 1] + Z,
                p1 = p[X + 1] + Y,
                p10 = p[p1] + Z,
                p11 = p[p1 + 1] + Z;
            return lerp(
                fz,
                lerp(
                    fy,
                    lerp(fx, grad3d(p[p00], x, y, z), grad3d(p[p10], x - 1, y, z)),
                    lerp(fx, grad3d(p[p01], x, y - 1, z), grad3d(p[p11], x - 1, y - 1, z))
                ),
                lerp(
                    fy,
                    lerp(
                        fx,
                        grad3d(p[p00 + 1], x, y, z - 1),
                        grad3d(p[p10 + 1], x - 1, y, z - 1)
                    ),
                    lerp(
                        fx,
                        grad3d(p[p01 + 1], x, y - 1, z - 1),
                        grad3d(p[p11 + 1], x - 1, y - 1, z - 1)
                    )
                )
            );
        };

        this.noise2d = function(x, y) {
            const X = Math.floor(x) & 255,
                Y = Math.floor(y) & 255;
            x -= Math.floor(x);
            y -= Math.floor(y);
            const fx = (3 - 2 * x) * x * x,
                fy = (3 - 2 * y) * y * y;
            const p0 = p[X] + Y,
                p1 = p[X + 1] + Y;
            return lerp(
                fy,
                lerp(fx, grad2d(p[p0], x, y), grad2d(p[p1], x - 1, y)),
                lerp(fx, grad2d(p[p0 + 1], x, y - 1), grad2d(p[p1 + 1], x - 1, y - 1))
            );
        };

        this.noise1d = function(x) {
            const X = Math.floor(x) & 255;
            x -= Math.floor(x);
            const fx = (3 - 2 * x) * x * x;
            return lerp(fx, grad1d(p[X], x), grad1d(p[X + 1], x - 1));
        };
    }


    //  these are lifted from Processing.js
    // processing defaults
    let noiseProfile = {
        generator: undefined,
        octaves: 4,
        fallout: 0.5,
        seed: undefined
    };

    function noise(x, y, z) {
        if (noiseProfile.generator === undefined) {
            // caching
            noiseProfile.generator = new PerlinNoise(noiseProfile.seed);
        }
        const generator = noiseProfile.generator;
        let effect = 1,
            k = 1,
            sum = 0;
        for (let i = 0; i < noiseProfile.octaves; ++i) {
            effect *= noiseProfile.fallout;
            switch (arguments.length) {
                case 1:
                    sum += (effect * (1 + generator.noise1d(k * x))) / 2;
                    break;
                case 2:
                    sum += (effect * (1 + generator.noise2d(k * x, k * y))) / 2;
                    break;
                case 3:
                    sum += (effect * (1 + generator.noise3d(k * x, k * y, k * z))) / 2;
                    break;
            }
            k *= 2;
        }
        return sum;
    }

    function FizzyText(id, message, gs, msize, ns, s, font) {
        this.growthSpeed = gs; // how fast do particles change size?
        this.maxSize = msize; // how big can they get?
        this.noiseStrength = ns; // how turbulent is the flow?
        this.speed = s; // how fast do particles move?
        this.displayOutline = false; // should we draw the message as a stroke?
        this.framesRendered = 0;

        // __defineGetter__ and __defineSetter__ makes JavaScript believe that
        // we've defined a variable 'this.message'. This way, whenever we
        // change the message variable, we can call some more functions.

        this.__defineGetter__("message", function() {
            return message;
        });

        this.__defineSetter__("message", function(m) {
            message = m;
            createBitmap(message);
        });

        // We can even add functions to the DAT.GUI! As long as they have
        // 0 arguments, we can call them from the dat-gui panel.

        this.explode = function() {
            const tmpspeed = this.speed;
            const mag = Math.random() * 100 + 50;
            this.speed = tmpspeed / 3;
            for (let i in particles) {
                const angle = Math.random() * Math.PI * 3.14;
                particles[i].vx = Math.cos(angle) * mag;
                particles[i].vy = Math.sin(angle) * mag;
            }
            this.speed = tmpspeed;
        };

        ////////////////////////////////////////////////////////////////

        const _this = this;
        const width = 900;
        const height = 300;
        const textAscent = 210;
        const textOffsetLeft = 0;
        const noiseScale = 200;
        const colors = ["#AB5BD6", "#19BCA0", "#FFBC63"];

        const r = document.createElement("canvas");
        var s = r.getContext("2d");

        // This is the context we actually use to draw.
        const c = document.createElement("canvas");
        var g = c.getContext("2d");
        r.setAttribute("width", width);
        c.setAttribute("width", width);
        r.setAttribute("height", height);
        c.setAttribute("height", height);

        // Add our demo to the HTML
        document.getElementById(id).appendChild(c);

        // Stores bitmap image
        let pixels = [];

        // Stores a list of particles
        const particles = [];

        // Set g.font to the same font as the bitmap canvas, incase we
        // want to draw some outlines.
        s.font = g.font = font;

        // Instantiate some particles
        for (let i = 0; i < 3000; i++) {
            particles.push(new Particle(Math.random() * width, Math.random() * height));
        }

        // This function creates a bitmap of pixels based on your message
        // It's called every time we change the message property.
        function createBitmap(msg) {
            s.fillStyle = "#fff";
            s.fillRect(0, 0, width, height);

            s.fillStyle = "#222";
            s.fillText(msg, textOffsetLeft, textAscent);

            // Pull reference
            var imageData = s.getImageData(0, 0, width, height);
            pixels = imageData.data;
        }
        this.message = message;
        // Called once per frame, updates the animation.
        const render = function() {
            _this.framesRendered++;

            g.clearRect(0, 0, width, height);

            if (_this.displayOutline) {
                g.globalCompositeOperation = "source-over";
                g.strokeStyle = "#000";
                g.lineWidth = 0.5;
                g.strokeText(message, textOffsetLeft, textAscent);
            }

            g.globalCompositeOperation = "darker";

            for (let i = 0; i < Math.floor(particles.length / 3); i++) {
                g.fillStyle = colors[0];
                particles[i].render();
            }
            for (
                let i = Math.floor(particles.length / 3); i < Math.floor((particles.length * 2) / 3); i++
            ) {
                g.fillStyle = colors[1];
                particles[i].render();
            }
            for (
                let i = Math.floor((particles.length * 2) / 3); i < Math.floor(particles.length); i++
            ) {
                g.fillStyle = colors[2];
                particles[i].render();
            }
        };

        // Returns x, y coordinates for a given index in the pixel array.
        function getPosition(i) {
            return {
                x: (i - width * 4 * Math.floor(i / (width * 4))) / 4,
                y: Math.floor(i / (width * 4))
            };
        }

        // Returns a color for a given pixel in the pixel array.
        function getColor(x, y) {
            const base = (Math.floor(y) * width + Math.floor(x)) * 4;
            const c = {
                r: pixels[base + 0],
                g: pixels[base + 1],
                b: pixels[base + 2],
                a: pixels[base + 3]
            };

            return "rgb(" + c.r + "," + c.g + "," + c.b + ")";
        }

        // This calls the setter we've defined above, so it also calls
        // the createBitmap function.

        function loop() {
            setTimeout(() => {
                requestAnimationFrame(loop);
                render();
            }, 1000 / 15);
        }

        // This calls the render function every 30 milliseconds.
        loop();

        // This class is responsible for drawing and moving those little
        // colored dots.
        function Particle(x, y, c) {
            // Position
            this.x = x;
            this.y = y;

            // Size of particle
            this.r = 0;

            // This velocity is used by the explode function.
            this.vx = 0;
            this.vy = 0;

            this.constrain = function(v, o1, o2) {
                if (v < o1) {
                    v = o1;
                } else if (v > o2) {
                    v = o2;
                }
                return v;
            };

            // Called every frame
            this.render = function() {
                // What color is the pixel we're sitting on top of?
                const c = getColor(this.x, this.y);

                // Where should we move?
                const angle = noise(
                    this.x / (Math.random() * noiseScale),
                    this.y / (Math.random() * noiseScale)
                ); // * _this.noiseStrength;

                // Are we within the boundaries of the image?
                const onScreen =
                    this.x > 0 && this.x < width && this.y > 0 && this.y < height;

                const isBlack = c !== "rgb(255,255,255)" && onScreen;

                // If we're on top of a black pixel, grow.
                // If not, shrink.
                if (isBlack) {
                    this.r += _this.growthSpeed;
                } else {
                    this.r -= _this.growthSpeed;
                }

                // This velocity is used by the explode function.
                this.vx *= 0.5;
                this.vy *= 0.5;

                // Change our position based on the flow field and our
                // explode velocity.
                this.x += Math.cos(angle) * _this.speed + this.vx * 1.3;
                this.y += -Math.sin(angle) * _this.speed + this.vy * 1.3;

                // this.r = 3;
                // debugger
                // console.log(DAT.GUI.constrain(this.r, 0, _this.maxSize));
                this.r = this.constrain(this.r, 0, _this.maxSize);

                // If we're tiny, keep moving around until we find a black
                // pixel.
                if (this.r <= 0) {
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                    return; // Don't draw!
                }

                // Draw the circle.
                g.beginPath();
                g.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
                g.fill();
            };
        }
    }

    const message = '   NguyễnÂn  ';
    // start with a large font size

    const id = 'fizzytext';
    const FT = new FizzyText(id, message, 0.2, 4., 10, 0.3, "italic 150px Times New Roman, Times");


    const dom = document.getElementById(id);
    dom.addEventListener('click', () => {
        FT.explode();
    })
});