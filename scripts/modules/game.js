/**
 * Game plumbing code
 */
define(function () {

	var renderer = new THREE.WebGLRenderer({ antialias: true });

	var camera = new THREE.PerspectiveCamera(90, 1, 0.1, 2000);

	var scene = new THREE.Scene();

	scene.add(camera);

	return {
		// placeholder for assets
		assets : {},

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
		},

		markPoint : function(x, y, z, c) {
			scene.add(new THREE.ArrowHelper (new THREE.Vector3(0, -1, 0), new THREE.Vector3(x, y + 0.5, z), 0.5, c));
		}
	};
});