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