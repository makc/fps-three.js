requirejs.config({
	baseUrl: "scripts/modules"
});

require([
	 "ecs"
	,"game"
	,"components"
	,"systems/resetHero"
	,"systems/spawnItems"
	,"systems/addObjects"
	,"systems/jumpPads"
	,"systems/keyboardControls"
	,"systems/applyPhysics"
	,"systems/renderBodies"
	,"systems/footSteps"
	,"systems/glowingPlates"
	,"systems/pickItems"
	,"systems/removeObjects"
], function(
	 ecs
	,game
	,components
	,resetHero
	,spawnItems
	,addObjects
	,jumpPads
	,keyboardControls
	,applyPhysics
	,renderBodies
	,footSteps
	,glowingPlates
	,pickItems
	,removeObjects
) {

	// load game assets
	// http://css-tricks.com/multiple-simultaneous-ajax-requests-one-callback-jquery/
	$.when(
		 $.loadImage("assets/skybox/Side1.jpg")
		,$.loadImage("assets/skybox/Side2.jpg")
		,$.loadImage("assets/skybox/Side3.jpg")
		,$.loadImage("assets/skybox/Side4.jpg")
		,$.loadImage("assets/skybox/Side5.jpg")
		,$.loadImage("assets/skybox/Side6.jpg")
		,$.getJSON("assets/arena/arena.json")
		,$.loadImage("assets/arena/arena.jpg")
		,$.getJSON("assets/shotgun/hud/Dreadus-Shotgun.json")
		,$.loadImage("assets/shotgun/hud/Dreadus-Shotgun.jpg")
		,$.loadAudio("assets/sounds/step1.mp3")
		,$.loadAudio("assets/sounds/step2.mp3")
		,$.loadAudio("assets/sounds/step3.mp3")
		,$.getJSON("assets/shells/shells.json")
		,$.loadImage("assets/shells/shells.jpg")
		,$.getJSON("assets/shotgun/item/W-Shotgun.json")
		,$.loadImage("assets/shotgun/item/W-Shotgun.jpg")
		,$.loadImage("assets/misc/itemLight.jpg")
		,$.loadImage("assets/misc/itemPlate.jpg")
		,$.loadAudio("assets/sounds/itemAppeared.mp3")
		,$.loadAudio("assets/sounds/itemPicked.mp3")
	).then(function(
		 skyboxSide1
		,skyboxSide2
		,skyboxSide3
		,skyboxSide4
		,skyboxSide5
		,skyboxSide6
		,arenaModel
		,arenaTexture
		,shotgunModel
		,shotgunTexture
		,step1
		,step2
		,step3
		,itemShellsModel
		,itemShellsTexture
		,itemShotgunModel
		,itemShotgunTexture
		,itemLightTexture
		,itemPlateTexture
		,itemAppeared
		,itemPicked
	){
		// create and store various stuff on game.assets

		game.scene.add(new SkyBox([
			skyboxSide3, skyboxSide5, skyboxSide6, skyboxSide1, skyboxSide2, skyboxSide4
		], 1400));

		arenaModel = new StaticMD2Model(arenaModel[0], arenaTexture);
		arenaModel.material.map.anisotropy = game.maxAnisotropy;
		game.scene.add(arenaModel);

		shotgunModel = new AnimatedMD2Model(shotgunModel[0], shotgunTexture);
		shotgunModel.rotation.y = -Math.PI / 2;
		shotgunModel.position.x = 0.235; // center
		shotgunModel.position.y = -0.2; // take less space on screen
		game.camera.add(shotgunModel);

		game.assets.arenaModel = arenaModel;
		game.assets.shotgunModel = shotgunModel;

		game.assets.itemShellsModel = new StaticMD2Model(itemShellsModel[0], itemShellsTexture);

		game.assets.itemShotgunModel = new StaticMD2Model(itemShotgunModel[0], itemShotgunTexture);

		game.assets.steps = [step1, step2, step3];

		itemLightTexture = new THREE.Texture(itemLightTexture);
		itemLightTexture.needsUpdate = true;
		game.assets.itemLight = new THREE.Mesh(
			new THREE.PlaneGeometry(0.1, 6),
			new THREE.MeshBasicMaterial({
				map: itemLightTexture, side: THREE.DoubleSide, opacity: 0,
				transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
			})
		);

		game.assets.itemLight.geometry.computeBoundingSphere();

		itemPlateTexture = new THREE.Texture(itemPlateTexture);
		itemPlateTexture.needsUpdate = true;
		game.assets.itemPlate = new THREE.Mesh(
			new THREE.PlaneGeometry(1.3, 1.3),
			new THREE.MeshBasicMaterial({
				map: itemPlateTexture, opacity: 0,
				polygonOffset: true, polygonOffsetFactor: -0.1,
				transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
			})
		);

		game.assets.itemAppeared = itemAppeared;
		game.assets.itemPicked = itemPicked;


		// add 3D scene to the webpage

		$("body").empty().append(game.domElement);
		var gameViewportSize = function() { return {
			width: window.innerWidth, height: window.innerHeight
		}};


		// create entities

		new ecs.Entity()
			.add(new components.Hero())
			.add(new components.Body(game.camera, 3.0))
			.add(new components.Motion(0, -321, 0));


		// start the game

		var gameLoop = function(dt) {

			resetHero.update(dt);
			spawnItems.update(dt);
			addObjects.update(dt);
			jumpPads.update(dt);
			keyboardControls.update(dt);
			applyPhysics.update(dt);
			renderBodies.update(dt);
			footSteps.update(dt);
			glowingPlates.update(dt);
			pickItems.update(dt);
			removeObjects.update(dt);

		};

		game.start(gameLoop, gameViewportSize);

	}).fail(function(err, msg) {
		console.log(err, msg);
	});
});