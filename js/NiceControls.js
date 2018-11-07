/*
 * @author jack / https://github.com/wjacker
 */
(function () {
	'use strict';

	THREE.NiceComponent = function(parameters) {
		THREE.Group.call( this );

		this.visible = false;
		this.scaleFactor = 7;
		this.rotationZ = 0;
		this.isHovered = false;
		this.boxSize = new THREE.Vector3();
		this.attribute = {};
		this.groupName = "";

		this.setValues = function(values){
			if ( values === undefined ) return;

			for ( var key in values ) {

				var newValue = values[ key ];

				if ( newValue === undefined ) {

					console.warn( "THREE.NiceComponent: '" + key + "' parameter is undefined." );
					continue;

				}

				var currentValue = this[ key ];

				if ( currentValue === undefined ) {

					console.warn( "THREE." + this.name + ": '" + key + "' is not a property of this material." );
					continue;

				}

				if ( currentValue && currentValue.isColor ) {

					currentValue.set( newValue );

				} else if ( ( currentValue && currentValue.isVector3 ) && ( newValue && newValue.isVector3 ) ) {

					currentValue.copy( newValue );

				} else {

					this[ key ] = newValue;

				}

			}
		}

		this.setValues( parameters );

		this.componentDidMount = function () {
			this.mesh.setAttribute("outline", false),
	        this.componentDidUpdate({})
		};

		this.componentDidUpdate = function () {
			if(this.shouldUpdateComponentsVisibility(this.attribute)) {
				this.updateComponentsVisibility();
			}

			if(this.shouldUpdateTransform(this.attribute)) {
				this.updateTransform()
			}

			if(this.shouldUpdateView(this.attribute)) {
				this.updateView();
			}
		};

		this.shouldUpdateComponentsVisibility = function (e) {
			return e.isHovered !== this.isHovered;
		};

		this.updateComponentsVisibility = function(){
			//TODO
		};

		this.shouldUpdateTransform = function (e) {
			return e.rotationZ !== this.rotationZ || e.isOnTop !== this.isOnTop
			// 	|| this.scaleFactor !== e.scaleFactor
		};

		this.updateTransform = function(){
			//TODO
		};
		
		this.shouldUpdateView = function (e) {
			return e.visible !== this.visible || e.scaleFactor !== this.scaleFactor;
		};

		// this.updateView = function(){
		// 	//TODO
		// };

		this.buildMaterial = function(){
			return new THREE.MeshBasicMaterial({ transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide });
		};
	}

	THREE.NiceComponent.prototype = Object.create( THREE.Group.prototype );
	THREE.NiceComponent.prototype.constructor = THREE.NiceComponent;

	THREE.NiceComponentVertial = function() {
		THREE.NiceComponent.call( this );
		
		function r(e) {
	        if (Array.isArray(e)) {
	            for (var t = 0, n = Array(e.length); t < e.length; t++)
	                n[t] = e[t];
	            return n
	        }
	        return Array.from(e)
	    }

	    this.getSize = function () {
			var e = this.scaleFactor;
			return 10 * Math.sqrt(3) * e;
		};

		this.getAllPoints = function (e, t, n) {
			return [].concat(r(e), r(t), r(n), 
				[n[0], -n[1], 
				t[0], -t[1], 
				e[0], -e[1], 
				-t[0], -t[1], 
				-n[0], -n[1], 
				-n[0], n[1], 
				-t[0], t[1]]);
		};

		this.buildArrow = function (e) {
			var shape = new THREE.Shape();
			var n = [e[e.length - 2], e[e.length - 1]];
	        shape.moveTo(n[0], n[1]);

	        var a,b;
	        for (var i = 0; i < e.length - 1; i= i + 2) {
	        	a = e[i];
	        	b = e[i+1];
	        	shape.lineTo(a, b);
	        }
	        var shapeGeometry = new THREE.ShapeGeometry(shape);
	        var material = this.buildMaterial();
	        var mesh = new THREE.Mesh(shapeGeometry,material);
	        mesh.rotation.x = Math.PI / 2;
	        return mesh;
		};

		this.arrowPoints = function (){
			var e = this.getSize();
			var t = [0, 3.5 * e];
			var n = [e, 2.1 * e];
			var r = [.4 * e, 2.1 * e];
	        return this.getAllPoints(t, n, r)
		};

		this.arrowOuterPoints = function () {
			function e(e) {
	            return [i * (e[0] - a[0]) + a[0], i * (e[1] - a[1]) + a[1]]
	        }
	        var t = this.arrowPoints();
	        var n = [t[0], t[1]];
	        var r = [t[2], t[3]]
	        var o = [t[4], t[5]]
	        var i = 1.15
	        var a = [(n[0] + r[0] - r[0]) / 3, (n[1] + r[1] + r[1]) / 3]
	        var s = e(n)
	        var c = e(r)
	        var u = [o[0] * i, c[1]];
	        return this.getAllPoints(s, c, u)
	  	};

	  	this.buildView = function (){
	  		var n = this.buildArrow(this.arrowOuterPoints());
	        n.name = "ARROW_BORDER";
	        n.material.color.set( 0xFFFFFF )
	        n.opacity = 1;
	        // n.opacity = 1;
	        // n.visible = false;

	        var r = this.buildArrow(this.arrowPoints());
	        // r.opacity = 0.6;
	        r.material.color.set( 4096759 )
	        r.opacity = 0.6
	        r.name = "ARROW";

	        this.editZPanel = new THREE.Group();
	        this.editZPanel.name = "Z"
	        this.editZPanel.add(n);
	        this.editZPanel.add(r);

	        this.add(this.editZPanel);
	        this.editZPanel.traverse(function(e) {
	            e.groupName = "Z";
	        });
	  	};

	  	this.buildView();
	}

	THREE.NiceComponentVertial.prototype = Object.create( THREE.NiceComponent.prototype );
	THREE.NiceComponentVertial.prototype.constructor = THREE.NiceComponentVertial;


	THREE.NiceComponentRotate = function() {
		THREE.NiceComponent.call( this );

		function r(e) {
            if (Array.isArray(e)) {
                for (var t = 0, n = Array(e.length); t < e.length; t++)
                    n[t] = e[t];
                return n
            }
            return Array.from(e)
        }

		this.getSize = function () {
			return {
                handleWidth: 100,
                circleRadius: 500,
                borderThickness: 15
            }
		};

		this.buildView = function () {
            var n = this.componentsName
            var raing = this.buildRing();
            raing.name = "RULER_BASE";
            this.add(raing);

            var handlerOver = new THREE.Object3D();

            [this.buildOneForthRingBorder()].concat(
            	r(this.buildArrowBorders()), 
            	r(this.buildArrows({
	                color: 4096759,
	                opacity: 1
	            })), 
	            [this.buildOneForthRing({
	                color: 4096759,
	                opacity: 1
	            })]
	            ).forEach(function(e) {
                return handlerOver.add(e)
            }),
            handlerOver.name = "HANDLER_HOVER",
            handlerOver.traverse(function(e) {
	            e.groupName = "R";
	        });
            this.add(handlerOver);

            var ruler = this.buildRuler();
            ruler.name = "RULER";
            ruler.renderOrder = 1
            this.add(ruler);
            // var handlerNormal = new THREE.Object3D();
            // [].concat(r(this.buildArrows({
            //     color: 4096759,
            //     opacity: .6
            // })), [this.buildOneForthRing({
            //     color: 4096759,
            //     opacity: .6
            // })]).forEach(function(e) {
            //     return handlerNormal.add(e)
            // }),
            // handlerNormal.name = "HANDLER_NORMAL",
            // this.add(handlerNormal);

         //    var handlerDrag = new THREE.Object3D();
         //    [this.buildOneForthRingBorder(), this.buildOneForthRing({
         //        color: 4096759,
         //        opacity: 1
         //    })].forEach(function(e) {
         //        return handlerDrag.add(e)
         //    }),
         //    handlerDrag.name = "HANDLER_DRAG",
         //    handlerDrag.traverse(function(e) {
	        //     e.groupName = "R";
	        // });
         //    this.add(handlerDrag);

            
	        this.traverse(function(e) {
	        	0 === e.renderOrder && (e.renderOrder = 2)
	        })
		};

		

		this.buildArrow = function(e) {
			var t = this.getSize();
            var n = t.circleRadius;
            var r = t.handleWidth;
            var o = new THREE.Shape();
            o.lineTo(n + r, 0);
            o.lineTo(n, 1.2 * r);
            o.lineTo(n - r, 0);
            var geometry = new THREE.ShapeGeometry(o);
            var material = new THREE.MeshBasicMaterial({
                transparent: true,
                depthTest: false,
                depthWrite: false,
                side: THREE.DoubleSide
            });//this.buildMaterial();
            material.setValues(e);
            return new THREE.Mesh(geometry, material);
		};

		this.buildArrows = function(e){
			var arrow1 = this.buildArrow(e);
	        arrow1.rotateZ(Math.PI / 4);
	        var arrow2 = this.buildArrow(e);
	        arrow2.rotateZ(-Math.PI / 4);
	        arrow2.rotateX(Math.PI);
	        return [arrow1, arrow2]
		};

		this.buildArrowBorder = function (){
			var e = this.getSize();
            var t = e.circleRadius;
            var n = e.handleWidth;
            var r = e.borderThickness;
            var o = new THREE.Shape();
            o.lineTo(t + n + 1.5 * r, 0);
            o.lineTo(t, 1.2 * n + 2 * r);
            o.lineTo(t - n - 1.5 * r, 0);
            var geometry = new THREE.ShapeGeometry(o);
            var material = this.buildMaterial();
            material.setValues({
                color: 0xFFFFFF,
                opacity: 1
            });
            var mesh = new THREE.Mesh(geometry, material);
            mesh.renderOrder = 1;
            return mesh;
		};

		this.buildArrowBorders = function () {
			var e = this.getSize();
            var t = e.borderThickness;
           	var n = this.buildArrowBorder();
            n.rotateZ(Math.PI / 4);
            n.position.x = .5 * t;
            n.position.y = .5 * -t;
            var r = this.buildArrowBorder();
            r.rotateZ(-Math.PI / 4);
            r.rotateX(Math.PI);
            r.position.x = .5 * t;
            r.position.y = .5 * t;

            return [n, r];
		};

		this.buildRing = function (){
			var e = this.getSize();
            var t = e.handleWidth
            var n = e.circleRadius;
            var r = n - t / 2;
            var o = n + t / 2;
            var geometry = new THREE.RingBufferGeometry(r,o,32,1,0,2 * Math.PI)
            var material = this.buildMaterial();
            material.setValues({
                color: 4096759,
                opacity: .3
            });
            return new THREE.Mesh(geometry, material);
        };

        this.buildRuler = function(){
        	var e = this.getSize();
            var t = e.handleWidth;
            var n = e.circleRadius;
            var r = n - t / 2
            var o = n + t / 2
            var group = new THREE.Group()
            var a = 1.5 / (r + o) * 2
            var material = this.buildMaterial();
            material.setValues({
                color: 0xFFFFFF,
                opacity: 1
            });

            for (var u = 0; u < 8; u++) {
                var l = new THREE.RingBufferGeometry(r,o,32,1,0,a);
                l.rotateZ(2 * Math.PI / 8 * u - a / 2),
                group.add(new THREE.Mesh(l, material))
            }
            return group;
        };

        this.buildOneForthRing = function (e) {
        	var t = this.getSize()
            var n = t.handleWidth
            var r = t.circleRadius
            var material = this.buildMaterial();
            material.setValues(e);
            var geometry = new THREE.RingBufferGeometry(r - n / 2,r + n / 2,32,1,0,Math.PI / 2)
            var mesh = new THREE.Mesh(geometry,material);
            mesh.rotation.z = -Math.PI / 4
            return mesh;
        };

        this.buildOneForthRingBorder = function() {
        	var e = this.getSize();
            var t = e.handleWidth;
            var n = e.circleRadius;
            var r = e.borderThickness;
            var o = n - t / 2 - r;
            var i = n + t / 2 + r;
            var a = 2 * r / (i + o) * 2 + Math.PI / 2;
            var geometry = new THREE.RingBufferGeometry(o,i,32,1,0,a);
            var material = this.buildMaterial();
            material.setValues({
                color: 0xFFFFFF,
                opacity: 1
            });
            var mesh = new THREE.Mesh(geometry,material);
            mesh.rotation.z = -a / 2;
            mesh.renderOrder = 1;
            return mesh;
        };

        this.update = function (rotation, eye) {
        	if(this.rotation.z != rotation.y) {
        		this.rotation.z = rotation.y;
        	}
        }

		this.buildView();
	}

	THREE.NiceComponentRotate.prototype = Object.create( THREE.NiceComponent.prototype );
	THREE.NiceComponentRotate.prototype.constructor = THREE.NiceComponentRotate;

	THREE.NiceControls = function ( camera, domElement, scene) {

		THREE.Group.call( this );

		this.object = undefined;
		this.objectSize = new THREE.Vector3();
		
		this.addObject = undefined;

		this.isOnTop = true;
		
		this.editZPanel = undefined;
		this.rotateControl = undefined;
		
		this.boxHelper = undefined;
		this.box = new THREE.Box3();
		this.boxSize = new THREE.Vector3();
		this.boxCenter = new THREE.Vector3();
		this.moveRange = undefined;


		this.rotationSnap = null;


		var scope = this;
		var axis = null;
		var _dragging = false;



		var activePlane = undefined;

		var changeEvent = { type: "change" };
		var mouseDownEvent = { type: "mouseDown" };
		var mouseDownOnControlEvent = { type: "mouseDownOnControl" };
		var objectChangeEvent = { type: "objectChange" };
		var mouseUpEvent = { type: "mouseUp"};

		var dragStartEvent = { type: "dragStart"};
		var dragEndEvent = { type: "dragEnd"};

		var ray = new THREE.Raycaster();
		var pointerVector = new THREE.Vector2();

		var point = new THREE.Vector3();
		var offset = new THREE.Vector3();

		var rotation = new THREE.Vector3();
		var offsetRotation = new THREE.Vector3();
		var scale = 1;

		var lookAtMatrix = new THREE.Matrix4();
		var eye = new THREE.Vector3();

		var oldPosition = new THREE.Vector3();
		var oldScale = new THREE.Vector3();
		var oldRotationMatrix = new THREE.Matrix4();

		var parentRotationMatrix = new THREE.Matrix4();
		var parentScale = new THREE.Vector3();

		var worldPosition = new THREE.Vector3();
		var worldRotation = new THREE.Euler();
		var worldRotationMatrix = new THREE.Matrix4();
		var camPosition = new THREE.Vector3();
		var camRotation = new THREE.Euler();

		var rotationZ = undefined;

		var unitX = new THREE.Vector3( 1, 0, 0 );
		var unitY = new THREE.Vector3( 0, 1, 0 );
		var unitZ = new THREE.Vector3( 0, 0, 1 );

		var quaternionXYZ = new THREE.Quaternion();
		var quaternionX = new THREE.Quaternion();
		var quaternionY = new THREE.Quaternion();
		var quaternionZ = new THREE.Quaternion();
		var quaternionE = new THREE.Quaternion();

		var tempMatrix = new THREE.Matrix4();
		var tempVector = new THREE.Vector3();
		var tempQuaternion = new THREE.Quaternion();
		// var unitZ = new THREE.Vector3( 0, 0, 1 );

		var marker = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({
		  color: "red"
		}));
		scene.add(marker);

		domElement.addEventListener( "mousedown", onPointerDown, false );
		domElement.addEventListener( "touchstart", onPointerDown, false );

		domElement.addEventListener( "mousemove", onPointerHover, false );
		domElement.addEventListener( "touchmove", onPointerHover, false );

		domElement.addEventListener( "mousemove", onPointerMove, false );
		domElement.addEventListener( "touchmove", onPointerMove, false );

		domElement.addEventListener( "mouseup", onPointerUp, false );
		domElement.addEventListener( "mouseout", onMouseOut, false );
		domElement.addEventListener( "touchend", onPointerUp, false );
		domElement.addEventListener( "touchcancel", onPointerUp, false );
		domElement.addEventListener( "touchleave", onPointerUp, false );

		var domOffset = domElement.getBoundingClientRect();
		var clientWidth = domElement.clientWidth;
		var clientHeight = domElement.clientHeight;



		this.buildBoxBorder = function() {
			var t = e.circleRadius;
            var n = e.handleWidth;
            var r = e.borderThickness;
            
            var shape = new THREE.Shape();
            o.lineTo(t + n + 1.5 * r, 0);
            o.lineTo(t, 1.2 * n + 2 * r);
            o.lineTo(t - n - 1.5 * r, 0);
            var geometry = new THREE.ShapeGeometry(o);
            var material = this.buildMaterial();
            material.setValues({
                color: 0xFFFFFF,
                opacity: 1
            });
            var mesh = new THREE.Mesh(geometry, material);
            mesh.renderOrder = 1;
		}

		this.setAddObject = function(addObject){
			if(addObject != undefined) {
				this.addObject = addObject;
				this.axis = "XY";
				oldPosition.copy( this.addObject.position );
				oldScale.copy( this.addObject.scale );

				oldRotationMatrix.extractRotation( this.addObject.matrix );
				worldRotationMatrix.extractRotation( this.addObject.matrixWorld );

				parentRotationMatrix.extractRotation( this.addObject.parent.matrixWorld );
				parentScale.setFromMatrixScale( tempMatrix.getInverse( this.addObject.parent.matrixWorld ) );

				var planeIntersect = new THREE.Vector3();
				offset.copy( planeIntersect );
			}
		}

		this.buildView = function() {
			if(this.rotateControl) {
				this.remove(this.rotateControl);
			}

			if(this.editZPanel) {
				this.remove(this.editZPanel);
			}

			if(this.boxHelper) {
				scene.remove(this.boxHelper);
			}

			if ( scope.object === undefined ) return;

			

			this.boxHelper = new THREE.BoxHelper(scope.object, 4096759);
			this.boxHelper.material.setValues({
				transparent: true,
                depthTest: false,
                depthWrite: false,
                side: THREE.DoubleSide
			})
			scene.add(this.boxHelper);

			rotationZ = this.object.rotation.y;
			this.object.rotation.y = 0;
			this.objectSize = this.box.setFromObject(scope.object).getSize();
			this.object.rotation.y = rotationZ;
			this.updateBoxSize();
			// this.boxSize = this.box.setFromObject(scope.object).getSize();
			// this.boxCenter = this.box.getCenter();

			this.editZPanel = new THREE.NiceComponentVertial();
			this.editZPanel.position.set(0, 0, this.boxSize.z + 400);
			this.add(this.editZPanel);

			this.rotateControl = new THREE.NiceComponentRotate();
			this.rotateControl.rotationZ = rotationZ;
			this.add(this.rotateControl);
		}

		this.updateBoxSize = function() {
			if ( scope.object == undefined ) return;
			this.boxSize = this.box.setFromObject(scope.object).getSize();
			this.boxHelper.setFromObject(scope.object);
		}

		this.dispose = function () {

			domElement.removeEventListener( "mousedown", onPointerDown );
			domElement.removeEventListener( "touchstart", onPointerDown );

			domElement.removeEventListener( "mousemove", onPointerHover );
			domElement.removeEventListener( "touchmove", onPointerHover );

			domElement.removeEventListener( "mousemove", onPointerMove );
			domElement.removeEventListener( "touchmove", onPointerMove );

			domElement.removeEventListener( "mouseup", onPointerUp );
			domElement.removeEventListener( "mouseout", onMouseOut );
			domElement.removeEventListener( "touchend", onPointerUp );
			domElement.removeEventListener( "touchcancel", onPointerUp );
			domElement.removeEventListener( "touchleave", onPointerUp );

		};

		this.setRotationSnap = function ( rotationSnap ) {
			scope.rotationSnap = rotationSnap;
		};

		this.setActivePlane = function(axis, eye) {
			if(axis == "Z") {
				this.activePlane = this.editZPanel;
			} else if(axis == "XY") {
				// this.activePlane = this.XYPanel;
			} else if(axis == "R") {
				this.activePlane = this.rotateControl;
			}
			
		}

		this.setMoveRange = function (minX, maxX, minY, maxY, minZ, maxZ) {
			this.moveRange = {
				minX: minX,
				maxX: maxX,
				minY: minY,
				maxY: maxY,
				minZ: minZ,
				maxZ: maxZ,
			};
		}


	  	this.attach = function ( object ) {
			this.object = object;
			this.visible = true;
			this.buildView();
			this.update();
		};

		this.detach = function () {
			this.object = undefined;
			this.visible = false;
			this.axis = null;
			if(this.boxHelper) {
	    		scene.remove(this.boxHelper);
	    		this.boxHelper = null;
	    	}
		};

		this.calculatePosition = function() {

			if(this.moveRange != undefined){

				if(scope.axis == "XY") {
					scope.object.position.x = Math.max(this.moveRange.minX + this.boxSize.x / 2, Math.min(this.moveRange.maxX - this.boxSize.x / 2, scope.object.position.x));
					scope.object.position.y = Math.max(this.moveRange.minY + this.boxSize.y / 2, Math.min(this.moveRange.maxY - this.boxSize.y / 2, scope.object.position.y));
				} else if(scope.axis == "Z") {
					scope.object.position.z = Math.max(this.moveRange.minZ, Math.min(this.moveRange.maxZ - this.boxSize.z, scope.object.position.z));
				}
			}

			return false;
		};

		this.update = function () {

			if ( scope.object == undefined ) return;

			scope.object.updateMatrixWorld();
			worldPosition.setFromMatrixPosition( scope.object.matrixWorld );
			worldRotation.setFromRotationMatrix( tempMatrix.extractRotation( scope.object.matrixWorld ) );

			// scale = worldPosition.distanceTo( camPosition ) / 6 * scope.size;

			// this.position.copy( worldPosition );
			// this.scale.set( scale, scale, scale );

			// if ( camera instanceof THREE.PerspectiveCamera ) {
			// 	eye.copy( camPosition ).sub( worldPosition ).normalize();
			// }

			this.calculatePosition();
			
			
			scope.position.x = scope.object.position.x;
			scope.position.y = scope.object.position.y;
			scope.position.z = scope.object.position.z;

			if(this.editZPanel != undefined) {
				this.editZPanel.setValues({visible: this.visible});
			}

			if(this.rotateControl != undefined) {
				// scope.object.rotation.y = rotationZ;
				this.rotateControl.setValues({visible: this.visible});
				this.rotateControl.update(scope.object.rotation);
				// this.rotateControl.update( new THREE.Euler(), eye );
			}

			if(this.boxHelper !== undefined) {
				// this.boxHelper.position.set(scope.object.position);
				this.boxHelper.setFromObject(scope.object);
				this.boxSize = this.box.setFromObject(scope.object).getSize();
				// this.boxHelper.rotation.z = scope.object.rotation.y;
			}


		};

		function onPointerHover( event ) {

			// if ( scope.object === undefined || _dragging === true || ( event.button !== undefined && event.button !== 0 ) ) return;

			// var pointer = event.changedTouches ? event.changedTouches[ 0 ] : event;

			// var intersect = intersectObjects( pointer, scope.children );

			// var axis = null;

			// if ( intersect && intersect.object.groupName != undefined) {

			// 	axis = intersect.object.groupName;

			// 	event.preventDefault();

			// }

			// if ( scope.axis !== axis ) {
			// 	scope.axis = axis;
			// 	scope.update();
			// 	scope.dispatchEvent( changeEvent );
			// }

		}

		function onPointerDown( event ) {
			console.log("onPointerDown");

			if(scope.addObject != undefined) {
				event.preventDefault();
				event.stopPropagation();

				scope.attach(scope.addObject);
				scope.addObject = undefined;
				scope.dispatchEvent( changeEvent );
				scope.dispatchEvent( mouseDownOnControlEvent );
				return;
			}

			if ( scope.object === undefined || _dragging === true || ( event.button !== undefined && event.button !== 0 ) ) {
				return;
			}

			var pointer = event.changedTouches ? event.changedTouches[ 0 ] : event;

			if ( pointer.button === 0 || pointer.button === undefined ) {

				var intersect = intersectObjects( pointer, scope.children );
				if ( intersect && intersect.object.groupName != undefined) {

					event.preventDefault();
					event.stopPropagation();

					scope.axis = intersect.object.groupName;

					scope.dispatchEvent( mouseDownOnControlEvent );

					scope.update();

					eye.copy( camPosition ).sub( worldPosition ).normalize();

					scope.setActivePlane( scope.axis, eye );
					var plane
					if(scope.axis == "Z") {
						plane = new THREE.Plane(new THREE.Vector3(1, 1, 0), 0);
					} else {
						plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -scope.object.position.z);
					}
					
					var planeIntersect = intersectPlane( pointer, plane);
					// var planeIntersect = intersectObjects( pointer, scope.activePlane.children );

					if ( planeIntersect ) {

						oldPosition.copy( scope.object.position );
						oldScale.copy( scope.object.scale );

						oldRotationMatrix.extractRotation( scope.object.matrix );
						worldRotationMatrix.extractRotation( scope.object.matrixWorld );

						parentRotationMatrix.extractRotation( scope.object.parent.matrixWorld );
						parentScale.setFromMatrixScale( tempMatrix.getInverse( scope.object.parent.matrixWorld ) );

						offset.copy( planeIntersect );

					}

					scope.dispatchEvent( dragStartEvent );
					_dragging = true;

				} else {
					var intersect = intersectObjects( pointer, [scope.object] );
					if ( intersect ) {
						event.preventDefault();
						event.stopPropagation();
						scope.axis = "XY";
						scope.dispatchEvent( mouseDownOnControlEvent );
						scope.update();

						eye.copy( camPosition ).sub( worldPosition ).normalize();

						scope.setActivePlane( scope.axis, eye );

						var plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
						var planeIntersect = intersectPlane( pointer, plane);
						// var planeIntersect = intersectObjects( pointer, scope.activePlane.children );

						if ( planeIntersect ) {

							oldPosition.copy( scope.object.position );
							oldScale.copy( scope.object.scale );

							oldRotationMatrix.extractRotation( scope.object.matrix );
							worldRotationMatrix.extractRotation( scope.object.matrixWorld );

							parentRotationMatrix.extractRotation( scope.object.parent.matrixWorld );
							parentScale.setFromMatrixScale( tempMatrix.getInverse( scope.object.parent.matrixWorld ) );

							offset.copy( planeIntersect );

						}
						scope.dispatchEvent( dragStartEvent );
						_dragging = true;
					} else {
						_dragging = false;
						// scope.dispatchEvent( mouseDownEvent );
					}
				}

			}

			

		}

		function onPointerMove( event ) {

			if (scope.addObject == undefined 
				&& (scope.object === undefined 
					|| scope.axis === null || _dragging === false 
					|| ( event.button !== undefined && event.button !== 0 ) ) ) 
				return;

			var pointer = event.changedTouches ? event.changedTouches[ 0 ] : event;

			var plane;
			var planeIntersect = new THREE.Vector3();

			event.preventDefault();
			event.stopPropagation();

			if(scope.addObject != undefined) {
				scope.axis = "XY";
			}

			if ( scope.axis === "Z" || scope.axis === "XY") {
				if(scope.axis === "Z") {
					plane = new THREE.Plane(new THREE.Vector3(1, 1, 0), 0);
				} else {
					plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
				}
				
			 	planeIntersect = intersectPlane( pointer, plane);

			 	point.copy( planeIntersect );

				point.sub( offset );
				point.multiply( parentScale );

				if ( scope.axis.search( "X" ) === - 1 ) point.x = 0;
				if ( scope.axis.search( "Y" ) === - 1 ) point.y = 0;
				if ( scope.axis.search( "Z" ) === - 1 ) point.z = 0;

				point.applyMatrix4( tempMatrix.getInverse( parentRotationMatrix ) );

				var object;
				if(scope.addObject != undefined) {
					object = scope.addObject;
				} else {
					object = scope.object;
				}
				object.position.copy( oldPosition );
				object.position.add( point );
			} else if ( scope.axis === "R" ) {
				plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -oldPosition.z);
				mouse.x = ((event.clientX - domOffset.left)/ clientWidth) * 2 - 1;
				mouse.y = -((event.clientY - domOffset.top) / clientHeight) * 2 + 1;
				// mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			 //  	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
			  	ray.setFromCamera(mouse, camera);
			  	ray.ray.intersectPlane(plane, planeIntersect);

			  	var angle1 = Math.atan((planeIntersect.y - oldPosition.y)/(planeIntersect.x - oldPosition.x));
			  	if((planeIntersect.x - oldPosition.x) < 0) {
			  		angle1 = Math.PI + angle1;
			  	}
			  	console.log("angle1:" + angle1 );
			  	scope.object.rotation.y = angle1;
			 	marker.position.copy(planeIntersect);
			}

			scope.update();
			scope.dispatchEvent( changeEvent );
			scope.dispatchEvent( objectChangeEvent );
		}

		function onPointerUp( event ) {

			event.preventDefault(); // Prevent MouseEvent on mobile

			if(scope.addObject != undefined) {
				event.preventDefault();
				event.stopPropagation();

				scope.attach(scope.addObject);
				scope.addObject = undefined;
				scope.dispatchEvent( changeEvent );
				scope.dispatchEvent( mouseUpEvent );
				scope.dispatchEvent( dragEndEvent );
				return;
			}


			if ( event.button !== undefined && event.button !== 0 ) return;

			if ( _dragging && ( scope.axis !== null ) ) {

				scope.dispatchEvent( mouseUpEvent );
				scope.dispatchEvent( dragEndEvent );

			}

			_dragging = false;

			if ( 'TouchEvent' in window && event instanceof TouchEvent ) {

				scope.axis = null;
				scope.update();
				scope.dispatchEvent( changeEvent );

			} else {

				onPointerHover( event );

			}

		}

		function onMouseOut( event ) {

			event.preventDefault(); // Prevent MouseEvent on mobile


			if ( event.button !== undefined && event.button !== 0 ) return;


			if ( 'TouchEvent' in window && event instanceof TouchEvent ) {

				scope.axis = null;
				scope.update();
				scope.dispatchEvent( changeEvent );

			} else {

				onPointerHover( event );

			}

		}

		function intersectObjects( pointer, objects ) {

			var rect = domElement.getBoundingClientRect();
			var x = ( pointer.clientX - rect.left ) / rect.width;
			var y = ( pointer.clientY - rect.top ) / rect.height;

			pointerVector.set( ( x * 2 ) - 1, - ( y * 2 ) + 1 );
			ray.setFromCamera( pointerVector, camera );

			var intersections = ray.intersectObjects( objects, true );

			if(intersections[1] && intersections[0].object.name == "RULER_BASE") {
				return intersections[1];
			}
			return intersections[ 0 ] ? intersections[ 0 ] : false;

		}

		function intersectPlane( pointer , plane ) {

			var rect = domElement.getBoundingClientRect();
			var x = ( pointer.clientX - rect.left ) / rect.width;
			var y = ( pointer.clientY - rect.top ) / rect.height;

			pointerVector.set( ( x * 2 ) - 1, - ( y * 2 ) + 1 );
			ray.setFromCamera( pointerVector, camera );
			var intersection = new THREE.Vector3();
			ray.ray.intersectPlane( plane, intersection )
			return intersection;
		}

	  	// this.buildView();

	};
	THREE.NiceControls.prototype = Object.create( THREE.Group.prototype );
	THREE.NiceControls.prototype.constructor = THREE.NiceControls;
}());