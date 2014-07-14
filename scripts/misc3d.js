/**
 * Sky box
 * http://blog.romanliutikov.com/post/58705840698/skybox-and-environment-map-in-three-js
 */
SkyBox = function(images, side) {

	var skyboxTexture = new THREE.Texture(images);
	skyboxTexture.flipY = false;
	skyboxTexture.format = THREE.RGBFormat;
	skyboxTexture.needsUpdate = true;

	var skyboxShader = THREE.ShaderLib['cube'];
	skyboxShader.uniforms['tCube'].value = skyboxTexture;

	THREE.Mesh.call(this,
		new THREE.BoxGeometry(side, side, side),
		new THREE.ShaderMaterial({
			fragmentShader: skyboxShader.fragmentShader, vertexShader: skyboxShader.vertexShader,
			uniforms: skyboxShader.uniforms, depthWrite: false, side: THREE.BackSide
		})
	);
};

SkyBox.prototype = Object.create(THREE.Mesh.prototype);


/**
 * Classes to work with MD2 files (pre-converted to JSON)
 * http://oos.moxiecode.com/js_webgl/md2_converter/
 */
AnimatedMD2Model = function(json, image, defaultAnimation, defaultAnimationTime) {
	if (json.constructor == THREE.Geometry) {
		// avoid needless re-init in clone() call
		THREE.MorphAnimMesh.call(this, json, image);

	} else {
		var texture = new THREE.Texture(image);
		texture.needsUpdate = true;

		var material = new THREE.MeshBasicMaterial({ map: texture, morphTargets: true });

		var loader = new THREE.JSONLoader();
		var model = loader.parse(json);
		var geometry = model.geometry;
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();

		geometry.computeMorphNormals();
		THREE.MorphAnimMesh.call(this, geometry, material);

		this.parseAnimations();
	}

	this.playingAnimation = null;
	this.defaultAnimation = defaultAnimation ? { animation: defaultAnimation, time: defaultAnimationTime, callback: null } : null;

	this.playOnce(this.defaultAnimation);
};

AnimatedMD2Model.prototype = Object.create(THREE.MorphAnimMesh.prototype);

AnimatedMD2Model.prototype.interpolateTargets = function(a, b, t) {
	for(var i = 0, n = this.morphTargetInfluences.length; i < n; i++) {
		this.morphTargetInfluences[i] = 0;
	}
	if(a > -1) this.morphTargetInfluences[a] = 1 - t;
	if(b > -1) this.morphTargetInfluences[b] = t;
};

AnimatedMD2Model.prototype.playOnce = function(animation, time, callback) {
	var animationObject = (arguments.length > 1) ? { animation: animation, time: time, callback: callback } : animation;

	// set (or clear) playingAnimation
	this.playingAnimation = animationObject;

	if(animationObject) {
		// select requested animation
		this.playAnimation(animationObject.animation, 1);
		// fix duration, miscalculated in playAnimation() call above
		this.duration = animationObject.time;
		// store actual time in this.time
		this.time = Date.now();
		// show first frame of requested animation
		this.interpolateTargets(this.startKeyframe, -1, 0);
	}
};

AnimatedMD2Model.prototype.update = function() {
	if(this.playingAnimation) {
		// calculate current frame
		var frame = this.startKeyframe + (this.endKeyframe - this.startKeyframe) * (Date.now() - this.time) / this.duration

		// update the animation
		if(frame < this.endKeyframe) {
			// seek to frame
			this.interpolateTargets(Math.floor(frame), Math.ceil(frame), frame - Math.floor(frame));
		} else {
			// show last frame
			this.interpolateTargets(this.endKeyframe, -1, 0);
			// if there is callback, call it
			if(this.playingAnimation.callback) this.playingAnimation.callback();
			// set animation back to default
			this.playOnce(this.defaultAnimation);
		}
	}
};

AnimatedMD2Model.prototype.clone = function() {

	var a = this.defaultAnimation ? this.defaultAnimation.animation : undefined;
	var t = this.defaultAnimation ? this.defaultAnimation.time : undefined;
	var o = new AnimatedMD2Model(this.geometry, this.material, a, t);

	THREE.MorphAnimMesh.prototype.clone.call(this, o);

	return o;
};


StaticMD2Model = function(json, image) {
	var texture = new THREE.Texture(image);
	texture.needsUpdate = true;

	var material = new THREE.MeshBasicMaterial({ map: texture });

	var loader = new THREE.JSONLoader();
	var model = loader.parse(json);
	var geometry = model.geometry;
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();

	THREE.Mesh.call(this, geometry, material);
};

StaticMD2Model.prototype = Object.create(THREE.Mesh.prototype);


/**
 * Glowing plate helper
 */
function createMeshForPlate(image, materialParams) {
	var texture = new THREE.Texture(image);
	texture.needsUpdate = true;

	materialParams.map = texture;
	materialParams.opacity = 0;
	materialParams.transparent = true;
	materialParams.blending = THREE.AdditiveBlending;
	materialParams.depthWrite = false;

	var width = 9e-3 * image.width, height = 9e-3 * image.height;
	var plate = new THREE.Mesh(
		new THREE.PlaneGeometry(width, height),
		new THREE.MeshBasicMaterial(materialParams)
	);

	plate.geometry.computeBoundingSphere();

	return plate;
};