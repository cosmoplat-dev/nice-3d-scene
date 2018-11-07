n.d(e, "PopModel ",
    function() {
        return i.l
    }),
    n.d(e, "PopModelBlock ",
    function() {
        return i.m
    }),
    n.d(e, "PopMesh ",
    function() {
        return i.k
    }),
    n.d(e, "PopGeometry ",
    function() {
        return i.j
    }),
    n.d(e, "PopPhongMaterial ",
    function() {
        return i.n
    }),

PopModel: function(t, e, n) {
        "use strict";

        function i(t) {
            if (!h.includes(t)) throw new l(t)
        }

        function r(t) {
            return t > 65535 ? Uint32Array: Uint16Array
        }
        n.d(e, "a",
        function() {
            return f
        });
        var a = n("PopModelItem1"),
        o = n("PopModelData"),
        s = n("PopModelBlock"),
        u = this && this.__extends ||
        function() {
            var t = Object.setPrototypeOf || {
                __proto__: []
            }
            instanceof Array &&
            function(t, e) {
                t.__proto__ = e
            } ||
            function(t, e) {
                for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
            };
            return function(e, n) {
                function i() {
                    this.constructor = e
                }
                t(e, n),
                e.prototype = null === n ? Object.create(n) : (i.prototype = n.prototype, new i)
            }
        } (),
        c = this && this.__assign || Object.assign ||
        function(t) {
            for (var e, n = 1,
            i = arguments.length; n < i; n++) {
                e = arguments[n];
                for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r])
            }
            return t
        },
        h = [0, 1],
        l = function(t) {
            function e(e) {
                return t.call(this, "Unknown popbuffer version: " + e) || this
            }
            return u(e, t),
            e
        } (Error),
        f = function() {
            function t(t) {
                this.version = t.version,
                this.attributes = c({},
                t.attributes),
                this.initialize(),
                i(this.version)
            }
            return t.prototype.initialize = function() {
                var t = this.attributes,
                e = t.faceCount,
                n = t.vertexCount,
                i = t.blockNames,
                a = t.blockFaceCounts,
                o = r(n - 1);
                this.indices = new o(3 * e),
                this.vertices = new Float32Array(3 * n),
                this.normals = new Float32Array(3 * n),
                this.textures = new Float32Array(2 * n);
                var u = 0;
                this.blocks = i.map(function(t, e) {
                    var n = u,
                    i = 3 * a[e];
                    return u += i,
                    new PopModelBlock(e, t, n, i)
                }),
                this.levelPrecisions = [],
                this.currentVertexCount = 0,
                this.currentBlockFaceCounts = new Array(i.length).fill(0)
            },
            t.prototype.addGroup = function(t) {
                var e = this,
                n = t.chunks,
                i = new Array(this.blocks.length).fill(0);
                n.forEach(function(t) {
                    var n = t.content,
                    r = t.header.objIndex,
                    a = n.indices,
                    o = e.processNormals(n.normals),
                    s = e.processTextures(n.textures),
                    u = e.processMaxLevelVertices(n.vertices),
                    c = e.blocks[r],
                    h = e.currentVertexCount,
                    l = e.currentBlockFaceCounts[r],
                    f = a.length / 3,
                    p = u.length / 3;
                    e.vertices.set(u, 3 * h),
                    e.normals.set(o, 3 * h),
                    e.textures.set(s, 2 * h),
                    e.indices.set(a, c.start + 3 * l),
                    e.currentBlockFaceCounts[r] += f,
                    e.currentVertexCount += p,
                    i[r] += f
                }),
                this.blocks.forEach(function(t, e) {
                    t.levelFaceCounts.push(i[e])
                });
                var r = this.levelPrecisions.length + 1 === this.attributes.groupCount,
                a = r ? 0 : Math.max(1, t.minLevel) - 1;
                this.levelPrecisions.push(a)
            },
            t.prototype.processNormals = function(t) {
                for (var e = this.attributes.normalScale,
                n = 0; n < t.length; n++) t[n] /= e;
                return t
            },
            t.prototype.processTextures = function(t) {
                for (var e = this.attributes.textureScale,
                n = 0; n < t.length; n++) t[n] /= e;
                return t
            },
            t.prototype.processMaxLevelVertices = function(t) {
                for (var e = this.attributes,
                n = e.vertexGridSize,
                i = e.boxMin,
                r = 0; r < t.length; r += 3) t[r] = (t[r] + .5) * n + i.x,
                t[r + 1] = (t[r + 1] + .5) * n + i.y,
                t[r + 2] = (t[r + 2] + .5) * n + i.z;
                return t
            },
            t.decode = function(e) {
                var n = new Uint8Array(e),
                i = new PopModelItem1();
                i.readFromStream(new PopModelData(n));
                var r = new PopModel(i.header);
                return i.groups.forEach(function(t) {
                    return r.addGroup(t)
                }),
                r
            },
            t
        } ()
    },

    "PopModelItem1": function(t, e, n) {
        "use strict";
        n.d(e, "a",
        function() {
            return a
        });
        // var i = n("PopModelHeader"),
        r = n("PopGroups"),
        a = function() {
            function t() {}
            return t.prototype.readFromStream = function(t) {
                this.header = new PopModelHeader(),
                this.header.readFromStream(t),
                this.groups = [];
                for (var e = 0; e < this.header.attributes.groupCount; e++) {
                    var n = new PopGroups();
                    n.readFromStream(t),
                    this.groups.push(n)
                }
                this.computeAdditionalFileAttributes()
            },
            t.prototype.computeAdditionalFileAttributes = function() {
                var t = this.header.attributes;
                t.faceCount = 0,
                t.vertexCount = 0,
                t.blockFaceCounts = new Array(t.blockNames.length).fill(0),
                this.groups.forEach(function(e) {
                    return e.chunks.forEach(function(e) {
                        var n = e.header,
                        i = e.content,
                        r = i.indices.length / 3,
                        a = i.vertices.length / 3;
                        t.faceCount += r,
                        t.blockFaceCounts[n.objIndex] += r,
                        t.vertexCount += a
                    })
                })
            },
            t
        } ()
    },

"PopGroups": function(t, e, n) {
        "use strict";
        n.d(e, "a",
        function() {
            return r
        });
        var i = n("PopChunks"),
        r = function() {
            function t() {}
            return t.prototype.readFromStream = function(t) {
                this.chunks = [],
                this.minLevel = t.readSwappedInt(),
                this.maxLevel = t.readSwappedInt();
                for (var e = t.readSwappedInt(), n = 0; n < e; n++) {
                    var r = new PopChunks();
                    r.readFromStream(t),
                    this.chunks.push(r)
                }
            },
            t
        } ()
    },

PopChunks: function(t, e, n) {
    "use strict";
    n.d(e, "a",
    function() {
        return o
    });
    var i = n("PopModelData"),
    r = n("PopChunksContent"),
    a = n("PopChunksHeader"),
    o = function() {
        function t() {}
        return t.prototype.readFromStream = function(t) {
            this.header = new PopChunksHeader(),
            this.header.readFromStream(t);
            var e = this.header.chunkDataLength,
            n = t.readBytes(e),
            o = n.length;
            if (o < e) throw new Error("not enough data! we need " + e + " bytes, but only read " + o + " bytes");
            var s = this.decompress(n, this.header.compressType);
            this.content = new PopChunksContent(),
            this.content.readFromStream(new PopModelData(s))
        },
        t.prototype.decompress = function(t, e) {
            return t
        },
        t
    } ()
},

PopChunksHeader: function(t, e, n) {
    "use strict";
    n.d(e, "a",
    function() {
        return i
    });
    var i = function() {
        function t() {}
        return t.prototype.readFromStream = function(t) {
            this.currentLevel = t.readSwappedInt(),
            this.chunkDataLength = t.readSwappedInt(),
            this.objIndex = t.readSwappedShort(),
            this.compressType = t.readByte()
        },
        t
    } ()
},

PopChunksContent: function(t, e, n) {
    "use strict";
    n.d(e, "a",
    function() {
        return r
    });
    // var i = n("u0MW"),
    var o = function() {
        function t() {}
        return t.prototype.read = function(t, e) {
            if (e <= 0) return [];
            for (var n = [], i = 0; i < e; i++) n.push(t.readSwappedInt());
            return n
        },
        t
    } (),
    s = function() {
        function t() {}
        return t.prototype.read = function(t, e) {
            if (e <= 0) return [];
            for (var n = [], i = 0; i < e; i++) n.push(t.readSwappedShort());
            return n
        },
        t
    } (),
    u = function() {
        function t() {}
        return t.prototype.read = function(t, e) {
            if (e <= 0) return [];
            for (var n = [], i = 0; i < e; i++) n.push(t.readSwappedShort() + 32767);
            return n
        },
        t
    } (),
    c = function() {
        function t() {}
        return t.prototype.read = function(t, e) {
            if (e <= 0) return [];
            var n = [],
            i = t.readZigzag(),
            r = t.readZigzag(),
            a = t.readZigzag();
            if (n.push(i, r, a), e % 3 != 0) throw new Error("Invalid VriantArray data ");
            for (var o = 1; o < e / 3; o++) i += t.readZigzag(),
            n.push(i),
            r += t.readZigzag(),
            n.push(r),
            a += t.readZigzag(),
            n.push(a);
            return n
        },
        t
    } (),
    h = function() {
        function t() {}
        return t.prototype.read = function(t, e) {
            if (e <= 0) return [];
            var n = [],
            i = t.readZigzag(),
            r = t.readZigzag();
            if (n.push(i, r), e % 2 != 0) throw new Error("Invalid TwoStepVriantArray data ");
            for (var a = 1; a < e / 2; a++) i += t.readZigzag(),
            n.push(i),
            r += t.readZigzag(),
            n.push(r);
            return n
        },
        t
    } (),
    l = function() {
        function t() {}
        return t.prototype.read = function(e, n) {
            if (n <= 0) return [];
            for (var i = t.BITS,
            a = new r.a(e), o = [], s = 0; s < n; s++) o.push(a.read(i));
            for (var u = 0,
            c = [], s = 0; s < n; s++) if (0 === o[s]) c.push(u);
            else {
                var h = a.read(o[s]),
                l = 1 << o[s] - 1;
                h < l && (h = -h - l),
                h += u,
                c.push(h),
                u = h
            }
            return c
        },
        t.BITS = 5,
        t
    } (),
    f = function() {
        function t() {}
        return t.prototype.read = function(e, n) {
            if (n <= 0) return [];
            for (var i = t.BITS,
            a = t.STRIDE,
            o = new r.a(e), s = [0, 0], u = [], c = 0; c < n / a; c++) u.push(o.read(i));
            for (var h = [], c = 0; c < n / a; c++) {
                var l = u[c];
                if (0 === l) for (var f = 0; f < a; f++) h.push(s[f]);
                else for (var f = 0; f < a; f++) {
                    var p = o.read(l),
                    d = 1 << l - 1;
                    p = p - d + s[f],
                    h.push(p),
                    s[f] = p
                }
            }
            return h
        },
        t.BITS = 5,
        t.STRIDE = 2,
        t
    } (),
    p = function() {
        function t() {}
        return t.prototype.read = function(e, n) {
            if (n <= 0) return [];
            for (var i = t.BITS,
            a = t.STRIDE,
            o = new r.a(e), s = [0, 0, 0], u = [], c = 0; c < n / a; c++) u.push(o.read(i));
            for (var h = [], c = 0; c < n / a; c++) {
                var l = u[c];
                if (0 === l) for (var f = 0; f < a; f++) h.push(s[f]);
                else for (var f = 0; f < a; f++) {
                    var p = o.read(l),
                    d = 1 << l - 1;
                    p = p - d + s[f],
                    h.push(p),
                    s[f] = p
                }
            }
            return h
        },
        t.BITS = 5,
        t.STRIDE = 3,
        t
    } (),
    d = {
        0 : new o,
        1 : new s,
        2 : new u,
        3 : new c,
        4 : new h,
        5 : new l,
        6 : new f,
        7 : new p
    }

    function inlineFunction(t) {
        var e = t.readByte(),
        n = t.readSwappedInt(),
        i = t.readSwappedInt();
        if (i < 0) throw new Error("Illegal data array length " + i);
        if (0 === i) return [];
        var r = t.readBytes(n),
        o = r.length;
        if (o < n) throw new Error("Not enough data!we need " + n + "bytes, but only read " + o + "bytes.type is " + e);
        var s = new PopModelData(r),
        u = d[e];
        if (u) return u.read(s, i);
        throw new Error("Illegal data array type ")
    }

    r = function() {
        function t() {}
        return t.prototype.readFromStream = function(t) {
            this.vertices = inlineFunction(t),
            this.normals = inlineFunction(t),
            this.textures = inlineFunction(t),
            this.indices = inlineFunction(t)
        },
        t
    } ()
},


"PopModelData": function(t, e, n) {
        "use strict";
        n.d(e, "a",
        function() {
            return a
        });
        // var i = n("lUBy")
        function inlineFunction1(t) {
            for (var e = "",
            n = 0; n < t.length; n++) {
                var i = t[n];
                if (i < 128) e += String.fromCharCode(i);
                else if (i > 191 && i < 224) e += String.fromCharCode((31 & i) << 6 | 63 & t[n + 1]),
                n += 1;
                else if (i > 223 && i < 240) e += String.fromCharCode((15 & i) << 12 | (63 & t[n + 1]) << 6 | 63 & t[n + 2]),
                n += 2;
                else {
                    var r = ((7 & i) << 18 | (63 & t[n + 1]) << 12 | (63 & t[n + 2]) << 6 | 63 & t[n + 3]) - 65536;
                    e += String.fromCharCode(r >> 10 | 55296, 1023 & r | 56320),
                    n += 3
                }
            }
            return e
        }
        // r = n("Q2ls"),
        function inlineFunction2(t) {
            var r = new Int8Array(4);
            a = new Int32Array(r.buffer, 0, 1);
            o = new Float32Array(r.buffer, 0, 1);
            return a[0] = t, o[0]
        }

        a = function() {
            function t(t) {
                this.data = t,
                this.position = 0
            }
            return t.prototype.flip = function() {
                this.data = this.data.reverse(),
                this.position = 0
            },
            t.prototype.readByte = function() {
                return this.data[this.position++]
            },
            t.prototype.readBytes = function(t) {
                return this.position += t,
                this.data.slice(this.position - t, this.position)
            },
            t.prototype.readSwappedShort = function() {
                return this.readByte() | this.readByte() << 8
            },
            t.prototype.readSwappedInt = function() {
                return this.readByte() | this.readByte() << 8 | this.readByte() << 16 | this.readByte() << 24
            },
            t.prototype.readSwappedFloat = function() {
                return inlineFunction1(this.readSwappedInt())
            },
            t.prototype.readUTFBytes = function(t) {
                return inlineFunction2(this.readBytes(t))
            },
            t.prototype.readZigzag = function() {
                var t = this.readVarint();
                return t % 2 == 0 ? .5 * t: -.5 * (t + 1)
            },
            t.prototype.readVarint = function() {
                for (var t = 0,
                e = 0; e < 32; e += 7) {
                    var n = this.readByte();
                    if (t |= (127 & n) << e, 0 == (128 & n)) break
                }
                return t
            },
            t.prototype.readByte3 = function() {
                return {
                    x: this.readByte(),
                    y: this.readByte(),
                    z: this.readByte()
                }
            },
            t.prototype.readFloat3 = function() {
                return {
                    x: this.readSwappedFloat(),
                    y: this.readSwappedFloat(),
                    z: this.readSwappedFloat()
                }
            },
            t
        } ()
    },

PopModelBlock: function(t, e, n) {
    "use strict ";
    n.d(e, "a ",
    function() {
        return i
    });
    var i = function() {
        // function t(t, e, n, i) {
        function t(index, name, start, count) {
            this.index = t,
            this.name = e,
            this.start = n,
            this.count = i,
            this.levelFaceCounts = []
        }
        return t
    } ()
},



PopMesh: function(t, e, n) {
    "use strict ";
    function i(t) {
        var e;
        return function() {
            return e || (e = t())
        }
    }
    function r(t, e, n) {
        for (var i = 0,
        r = e; r <= n; r++) i += t[r];
        return i
    }
    function a(t, e) {
        for (var n = t.length,
        i = n - 1,
        r = 0; r < n; r++) if (t[r] <= e) {
            i = r;
            break
        }
        return i
    }
    n.d(e, "a ",
    function() {
        return f
    });
    var o = n(.D:ShaderLib.G:UniformsUtils.C:Scene.q:Mesh.h:DataTexture.x:PlaneBufferGeometry.
.r:MeshBasicMaterial.s:MeshDepthMaterial.E:ShaderMaterial.w:OrthographicCamera.
.e:BufferGeometry.d:BufferAttribute.m:EventDispatcher.M:_Math.n:Frustum.p:Matrix4.
.c:Box3.l:Euler.K:Vector4.J:Vector3.I:Vector2.f:Color.),
    s = n("M4fF "),
    u = (n.n(s), this && this.__extends ||
    function() {
        var t = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array &&
        function(t, e) {
            t.__proto__ = e
        } ||
        function(t, e) {
            for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
        };
        return function(e, n) {
            function i() {
                this.constructor = e
            }
            t(e, n),
            e.prototype = null === n ? Object.create(n) : (i.prototype = n.prototype, new i)
        }
    } ()),
    c = Math.PI / 180,
    h = Object(s.memoize)(function(t) {
        return 2 * Math.tan(t * c / 2)
    }),
    l = Object(s.memoize)(function(t) {
        return Math.pow(2, t)
    }),


    f = function(t) {
        function e(e, n) {
            var i = t.call(this) || this;
            return i.isPopMesh = true,
            i.type = "PopMesh ",
            i.minLevel = -Infinity,
            i.computed = false,
            i.renderCount = 0,
            i.levelFactor = -1,
            i.levelIndex = -1,
            i.onBeforeRender = function(t, e, n, r, a, o) {

                i.computed || 
                (i.computed = true, i.updateLevelFactor(t, n), 
                    i.updateLevelIndex(), i.updateMaterials()),
                ++i.renderCount === i.geometry.groups.length && (i.computed = false, i.renderCount = 0),
                i.updateGroup(o)
            },
            i.geometry = e,
            i.material = n,
            i
        }
        return u(e, t),
        e.prototype.updateLevelFactor = function(t, n) {
            var i = e.updateLevelFactor_cache(),
            r = i.v1,
            a = i.v2,
            s = this.geometry.metadata.boxSizeMagnitude;
            r.setFromMatrixPosition(n.matrixWorld),
            a.setFromMatrixPosition(this.matrixWorld);
            var u = r.distanceTo(a),
            c = h(n.fov),
            l = t.getSize().height,
            f = u * (c / l),
            p = s * this.matrixWorld.getMaxScaleOnAxis(),
            d = p / f,
            m = Math.ceil(Math.log(d) / Math.LN2) + 6;
            m = Math.max(m, this.minLevel),
            m = _Math.clamp(m, 1, 16),
            this.levelFactor = m
        },
        e.prototype.updateLevelIndex = function() {
            var t = this.geometry.model.levelPrecisions,
            e = 16 - this.levelFactor;
            this.levelIndex = a(t, e)
        },
        e.prototype.updateMaterials = function() {
            for (var t = this.geometry,
            e = t.model.levelPrecisions,
            n = t.metadata,
            i = n.vertexConstant,
            r = n.vertexGridSize,
            a = l(e[this.levelIndex]), o = 0, s = this.material; o < s.length; o++) {
                var u = s[o];
                u.uniforms.vertexConstant.value.copy(i),
                u.uniforms.vertexParameters.value.set(r, a)
            }

            var t = this.geometry；
            var e = t.model.levelPrecisions;
            var n = t.metadata;
            var i = n.vertexConstant;
            var r = n.vertexGridSize;
            var a = l(e[this.levelIndex]);
            var s = this.material;

            for (var o = 0; o < s.length; o++) {
                var u = s[o];
                u.uniforms.vertexConstant.value.copy(i),
                u.uniforms.vertexParameters.value.set(r, a)
            }
        },
        e.prototype.updateGroup = function(t) {
            var e = this.geometry.model.blocks;
            t.count = 3 * r(e[t.index].levelFaceCounts, 0, this.levelIndex)
        },
        e.prototype.clone = function() {
            return new e(this.geometry, this.material).copy(this)
        },
        e.prototype.toJSON = function(t) {
            function e(e, n) {
                return undefined === e[n.uuid] && (e[n.uuid] = n.toJSON(t)),
                n.uuid
            }
            if (!t) throw "export error: popmesh cant be root object ";
            var n = {},
            i = {};
            if (i.uuid = this.uuid, i.type = this.type, "" !== 
                this.name && (i.name = this.name), true === this.castShadow && 
                (i.castShadow = true), true === this.receiveShadow && 
                (i.receiveShadow = true), false === this.visible && (i.visible = false), 
                " {}" !== JSON.stringify(this.userData) && (i.userData = this.userData), 
                i.matrix = this.matrix.toArray(), undefined !== this.geometry && (undefined === 
                    t.models && (t.models = {}), i.geometry = e(t.models, this.geometry)), 
                undefined !== this.material) {
                undefined === t.popMaterial && (t.popMaterial = {});
                for (var r = [], a = 0, o = this.material.length; a < o; a++) r.push(e(t.popMaterial, this.material[a])),
                i.material = r
            }
            if (this.children.length > 0) {
                i.children = [];
                for (var a = 0; a < this.children.length; a++) i.children.push(this.children[a].toJSON(t).object)
            }
            return n.object = i,
            n
        },
        e.updateLevelFactor_cache = i(function() {
            return {
                v1: new Vector3(),
                v2: new Vector3()
            }
        }),
        e
    } (o.q)
},


PopGeometry: function(t, model, n) {
    "use strict ";
    var i = n("PopModel "),
    r = n("PopModelBlock "),
    a = function(BufferGeometry) {
            function e(model) {
                var n = BufferGeometry.call(this) || this;
                return n.isPopGeometry = true,
                n.setModel(model),
                n
            }
            return r(model, BufferGeometry),
            e.prototype.setModel = function(model) {
                var e = this;
                model && (this.model = model, 
                    this.setIndex(new new BufferAttribute(model.indices, 1, false)), 
                    this.addAttribute("uv", new BufferAttribute(model.textures, 2, false)), 
                    this.addAttribute("normal", new BufferAttribute(model.normals, 3, false)), 
                    this.addAttribute("position", new BufferAttribute(model.vertices, 3, false)), 
                    model.blocks.forEach(function(t) {
                    return e.addGroup(t.start, t.count, t.index)
                    }), 
                    this.computeBoundingBox(), this.computeMetadata())
            },
            e.prototype.computeMetadata = function() {
                var t = this.model.attributes,
                e = (new i.J).copy(t.boxMin),
                n = this.boundingBox.getSize().length(),
                r = t.vertexGridSize,
                a = e.clone().addScalar(.5 * r);
                this.metadata = {
                    boxMin: e,
                    boxSizeMagnitude: n,
                    vertexGridSize: r,
                    vertexConstant: a
                }
            },
            e.prototype.addGroup = function(t, e, n) {
                this.groups.push({
                    start: t,
                    count: e,
                    index: this.groups.length,
                    materialIndex: undefined !== n ? n: 0
                })
            },
            e.prototype.copy = function(e) {
                return t.prototype.copy.call(this, e),
                this.model = e.model,
                this.metadata = e.metadata,
                this
            },
            e.prototype.clone = function() {
                return (new e).copy(this)
            },
            e.prototype.toJSON = function() {
                var t = {
                    metadata: {
                        version: 4.5,
                        type: "PopGeometry",
                        generator: "PopGeometry.toJSON"
                    }
                },
                e = this.model,
                n = {
                    version: e.version,
                    attributes: e.attributes,
                    indices: Uint32Array,
                    vertices: [],
                    normals: [],
                    textures: [],
                    blocks: e.blocks,
                    levelPrecisions: e.levelPrecisions,
                    currentVertexCount: e.currentVertexCount,
                    currentBlockFaceCounts: e.currentBlockFaceCounts
                };
                return n.uuid = this.uuid,
                n.verticesDataLength = this.model.vertices.byteLength,
                n.normalDataLength = this.model.normals.byteLength,
                n.uvDataLength = this.model.textures.byteLength,
                n.indexDataLength = this.model.indices.byteLength,
                this.model.indices.byteLength / this.model.indices.length == 4 
                ? n.indexFormat = "32": n.indexFormat = "16",
                t.model = n,
                t.model
            },
            e
        } (i.e),
    o = n("PopMesh "),
    s = n("DLHX ");
    n.d(e, "c ",
    function() {
        return i.a
    }),
    n.d(e, "d ",
    function() {
        return r.a
    }),
    n.d(e, "b ",
    function() {
        return PopMesh()
    }),
    n.d(e, "a ",
    function() {
        return a.a
    }),
    n.d(e, "e ",
    function() {
        return s.a
    })
},


PopPhongMaterial: function(t, e, n) {
        "use strict";
        n.d(e, "a",
        function() {
            return p
        });
//         var i = n(.D:ShaderLib.G:UniformsUtils.C:Scene.q:Mesh.h:DataTexture.x:PlaneBufferGeometry.
// .r:MeshBasicMaterial.s:MeshDepthMaterial.E:ShaderMaterial.w:OrthographicCamera.
// .e:BufferGeometry.d:BufferAttribute.m:EventDispatcher.M:_Math.n:Frustum.p:Matrix4.
// .c:Box3.l:Euler.K:Vector4.J:Vector3.I:Vector2.f:Color.),
        // r = n("R+Hm"),
        // a = n("9aRV"),
        // o = n("DtoS"),
        var s,extendsMethod,decorateMethod;
        if("function" == typeof Symbol && "symbol" == typeof Symbol.iterator) {
            s = function(t) {
                return typeof t
            }
        } else {
            s = function(t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol": typeof t
            }
        }

        if(this && this.__extends) {
            extendsMethod = this.__extends;
        } else {
            extendsMethod = function() {
                var t = Object.setPrototypeOf || {
                    __proto__: []
                }
                instanceof Array &&
                function(t, e) {
                    t.__proto__ = e
                } ||
                function(t, e) {
                    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
                };
                return function(e, n) {
                    function i() {
                        this.constructor = e
                    }
                    t(e, n),
                    e.prototype = null === n ? Object.create(n) : (i.prototype = n.prototype, new i)
                }
            } ();
        }

        if(this && this.__decorate) {
            decorateMethod = this.__decorate;
        } else {
            decorateMethod = function(t, e, n, i) {
                var r, a = arguments.length,
                o = a < 3 ? e : (null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i);

                if ("object" === ("undefined" == typeof Reflect ? "undefined": s(Reflect)) && "function" == typeof Reflect.decorate) {
                    o = Reflect.decorate(t, e, n, i);
                } else {
                    for (var u = t.length - 1; u >= 0; u--) {
                        if(r = t[u]) {
                            o = (a < 3 ? r(o) : a > 3 ? r(e, n, o) : r(e, n)) || o;
                        }
                    }
                } 
                return a > 3 && o && Object.defineProperty(e, n, o),
                o
            }
        }

        h = {
            uvMatrix: {
                value: null
            },
            vertexConstant: {
                value: new Vector3(0, 0, 0)
            },
            vertexParameters: {
                value: new Vector2(0, 0)
            }
        },
        getDefineToggle = function a() {
            return function(t, e) {
                var n = e ||
                function(t) {
                    return !! t
                };
                return function(e, i) {
                    var r = "_" + i + "_" + Date.now(),
                    a = Object.getOwnPropertyDescriptor(e, i),
                    o = a && a.get ||
                    function() {
                        return this[r]
                    },
                    s = function(e) {
                        a && a.set && a.set.call(this, e),
                        this[r] !== e && (this[r] = e, n(e) ? this.defines[t] = "": delete this.defines[t])
                    };
                    Object.defineProperty(e, i, {
                        configurable: true,
                        enumerable: true,
                        get: o,
                        set: s
                    })
                }
            }
        },
        getUniformMapping = function r() {
            return function(t) {
                return function(e, n) {
                    var i = t || n,
                    r = Object.getOwnPropertyDescriptor(e, n);
                    Object.defineProperty(e, n, {
                        configurable: true,
                        enumerable: true,
                        get: function() {
                            return this.uniforms[i].value
                        },
                        set: function(t) {
                            r && r.set && r.set.call(this, t),
                            this.uniforms[i].value = t
                        }
                    })
                }
            }
        },
        cloneUniforms = function i(t) {
            for (var e = {},
            n = 0,
            i = Object.keys(t); n < i.length; n++) {
                var r = i[n];
                e[r] = {};
                for (var a = 0,
                o = Object.keys(t[r]); a < o.length; a++) {
                    var s = o[a],
                    u = t[r][s];
                    u && (u.isColor || u.isMatrix3 || u.isMatrix4 || u.isVector2 || u.isVector3 || u.isVector4) ? e[r][s] = u.clone() : Array.isArray(u) ? e[r][s] = u.slice() : e[r][s] = u
                }
            }
            return e
        },
        p = function(t) {
            function e(e) {
                var n = t.call(this, {
                    vertexShader: "#define PHONG\\nvarying vec3 vViewPosition;\\n#ifndef FLAT_SHADED\\n\\tvarying vec3 vNormal;\\n#endif\\n#include <common>\\n#ifdef USE_UV_MATRIX\\n#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )\\n\\tvarying vec2 vUv;\\n\\tuniform mat3 uvMatrix;\\n#endif\\n#else\\n#include <uv_pars_vertex>\\n#endif\\n#include <uv2_pars_vertex>\\n#include <displacementmap_pars_vertex>\\n#include <envmap_pars_vertex>\\n#include <color_pars_vertex>\\n#include <fog_pars_vertex>\\n#include <morphtarget_pars_vertex>\\n#include <skinning_pars_vertex>\\n#include <shadowmap_pars_vertex>\\n#include <logdepthbuf_pars_vertex>\\n#include <clipping_planes_pars_vertex>\\nuniform vec3 vertexConstant;\\nuniform vec2 vertexParameters;\\nvec3 transformPosition(in vec3 maxLevelPosition) {\\n    float vertexGridSize = vertexParameters.x;\\n    float powPrecision = vertexParameters.y;\\n    vec3 gridPosition = (maxLevelPosition - vertexConstant) / vertexGridSize;\\n    return floor(gridPosition / powPrecision) * powPrecision * vertexGridSize + vertexConstant;\\n}\\nvoid main() {\\n    vec3 position = transformPosition(position);\\n#ifdef USE_UV_MATRIX\\n#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )\\n    vUv = ( uvMatrix * vec3( uv, 1 ) ).xy;\\n#endif\\n#else\\n    #include <uv_vertex>\\n#endif\\n\\t#include <uv2_vertex>\\n\\t#include <color_vertex>\\n\\t#include <beginnormal_vertex>\\n\\t#include <morphnormal_vertex>\\n\\t#include <skinbase_vertex>\\n\\t#include <skinnormal_vertex>\\n\\t#include <defaultnormal_vertex>\\n#ifndef FLAT_SHADED\\n\\tvNormal = normalize( transformedNormal );\\n#endif\\n\\t#include <begin_vertex>\\n\\t#include <displacementmap_vertex>\\n\\t#include <morphtarget_vertex>\\n\\t#include <skinning_vertex>\\n\\t#include <project_vertex>\\n\\t#include <logdepthbuf_vertex>\\n\\t#include <clipping_planes_vertex>\\n\\tvViewPosition = - mvPosition.xyz;\\n\\t#include <worldpos_vertex>\\n\\t#include <envmap_vertex>\\n\\t#include <shadowmap_vertex>\\n\\t#include <fog_vertex>\\n}\\n",
                    fragmentShader: "#define PHONG\\nuniform vec3 diffuse;\\nuniform vec3 emissive;\\nuniform vec3 specular;\\nuniform float shininess;\\nuniform float opacity;\\n#include <common>\\n#include <packing>\\n#include <color_pars_fragment>\\n#include <uv_pars_fragment>\\n#include <uv2_pars_fragment>\\n#include <map_pars_fragment>\\n#include <alphamap_pars_fragment>\\n#include <aomap_pars_fragment>\\n#include <lightmap_pars_fragment>\\n#include <emissivemap_pars_fragment>\\n#include <envmap_pars_fragment>\\n#include <gradientmap_pars_fragment>\\n#include <fog_pars_fragment>\\n#include <bsdfs>\\n#include <lights_pars>\\n#include <lights_phong_pars_fragment>\\n#include <shadowmap_pars_fragment>\\n#include <bumpmap_pars_fragment>\\n#include <normalmap_pars_fragment>\\n#include <specularmap_pars_fragment>\\n#include <logdepthbuf_pars_fragment>\\n#include <clipping_planes_pars_fragment>\\nvoid main() {\\n\\t#include <clipping_planes_fragment>\\n\\tvec4 diffuseColor = vec4( diffuse, opacity );\\n\\tReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\\n\\tvec3 totalEmissiveRadiance = emissive;\\n\\t#include <logdepthbuf_fragment>\\n\\t#include <map_fragment>\\n\\t#include <color_fragment>\\n\\t#include <alphamap_fragment>\\n\\t#include <alphatest_fragment>\\n\\t#include <specularmap_fragment>\\n\\t#include <normal_flip>\\n\\t#include <normal_fragment>\\n\\t#include <emissivemap_fragment>\\n\\t#include <lights_phong_fragment>\\n\\t#include <lights_template>\\n\\t#include <aomap_fragment>\\n\\tvec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\\n\\t#include <envmap_fragment>\\n    gl_FragColor = vec4( outgoingLight, diffuseColor.a );\\n\\t#include <premultiplied_alpha_fragment>\\n\\t#include <tonemapping_fragment>\\n\\t#include <encodings_fragment>\\n\\t#include <fog_fragment>\\n}\\n",
                    uniforms: cloneUniforms(h)
                }) || this;
                n.uvMatrix = null;
                if(e) {
                    n.setValues(e);
                }
                return n;
    
                // return n.uvMatrix = null,
                // e && n.setValues(e),
                // n
            }
            return extendsMethod(e, t),
            e.prototype.copy = function(e) {
                return t.prototype.copy.call(this, e),
                this.uvMatrix = e.uvMatrix,
                this
            },
            e.prototype.myStringfy = function(t) {
                return {
                    r: t.r,
                    g: t.g,
                    b: t.b
                }
            },
            e.prototype.toJSON = function(t) {
                var e = {};
                return e.uuid = this.uuid,
                e.name = this.name,
                e.diffuseTextureUrl = this.diffuseTextureUrl,
                e.map = null,
                e.opacity = this.uniforms.opacity.value,
                e.color = this.myStringfy(this.uniforms.diffuse.value),
                this.uniforms.map && this.uniforms.map.value && (e.map = this.uniforms.map.value.toJSON(t).uuid),
                e
            },
            decorateMethod([getDefineToggle("USE_UV_MATRIX"), getUniformMapping()], e.prototype, "uvMatrix", undefined),
            decorateMethod([getUniformMapping()], e.prototype, "vertexConstant", undefined),
            decorateMethod([getUniformMapping()], e.prototype, "vertexParameters", undefined),
            e
        } (o.a)
    },