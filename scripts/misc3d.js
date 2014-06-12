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
AnimatedMD2Model = function(json, image) {
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

AnimatedMD2Model.prototype = Object.create(THREE.MorphAnimMesh.prototype);


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
}

StaticMD2Model.prototype = Object.create(THREE.Mesh.prototype);


/**
 * Game plumbing code
 */
var game = (function() {

	var renderer = new THREE.WebGLRenderer({ antialias: true });

	var camera = new THREE.PerspectiveCamera(90, 1, 0.1, 2000);

	var scene = new THREE.Scene();

	scene.add(camera);

	return {
		// going to work with these directly
		camera : camera,
		scene : scene,
		
		// few things we are going to need from renderer
		domElement : renderer.domElement,
		maxAnisotropy : renderer.getMaxAnisotropy(),

		// methods
		start : function(gameLoop, gameViewportSize) {
			var resize = function() {
				var viewport = gameViewportSize();
				renderer.setSize(viewport.width, viewport.height);
				camera.aspect = viewport.width / viewport.height;
				camera.updateProjectionMatrix();
			};

			window.addEventListener('resize', resize, false);
			resize();

			var lastTimeStamp;
			var render = function(timeStamp) {
				var timeElapsed = lastTimeStamp ? timeStamp - lastTimeStamp : 0; lastTimeStamp = timeStamp;

				// call our game loop with the time elapsed since last rendering, in ms
				gameLoop(timeElapsed);
				
				renderer.render (scene, camera);
				requestAnimationFrame (render);
			};

			requestAnimationFrame (render);
		}
	};
})();