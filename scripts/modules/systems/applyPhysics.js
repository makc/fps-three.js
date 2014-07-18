define(["ecs", "game", "components"], function (ecs, game, components) {
	var timeStep = 5;
	var timeLeft = timeStep + 1;

	var birdsEye = 100;
	var kneeDeep = 0.4;

	var raycaster = new THREE.Raycaster();
	raycaster.ray.direction.set(0, -1, 0);

	var angles = new THREE.Vector2();
	var displacement = new THREE.Vector3();

	var motions = [], i, n, collectMotions = function(entity) {
		motions[i] = entity.get(components.Motion); i++;
	};

	var platform = null;

	return { update: function(dt) {
		timeLeft += dt;

		if (platform == null) {
			platform = new THREE.Mesh(topSide(game.assets.arenaModel.geometry));
		}

		// collect motions once
		i = 0;
		ecs.for_each([components.Motion], collectMotions);
		n = motions.length = i;

		// run several fixed-step iterations to approximate varying-step

		dt = 5;
		while(timeLeft >= dt) {

			for(i = 0; i < n; i++) {
				// implement very simple platformer physics
				var time = 0.3;

				var motion = motions[i];

				raycaster.ray.origin.copy(motion.position);
				raycaster.ray.origin.y += birdsEye;
				var hits = raycaster.intersectObject(platform);


				motion.airborne = true;
				// are we above, or at most knee deep in, the platform?
				if(hits.length > 0) {
					var actualHeight = hits[0].distance - birdsEye;
					// collision: stick to the surface if landing on it
					if((motion.velocity.y <= 0) && (Math.abs(actualHeight) < kneeDeep)) {
						motion.position.y -= actualHeight;
						motion.velocity.y = 0;
						motion.airborne = false;
					}
				}

				if(motion.airborne) {
					// free fall: apply the gravity
					motion.velocity.y -= 0.01;
				}


				angles.copy(motion.spinning).multiplyScalar(time);
				if(!motion.airborne) motion.spinning.multiplyScalar(motion.damping);

				displacement.copy(motion.velocity).multiplyScalar(time);
				if(!motion.airborne) motion.velocity.multiplyScalar(motion.damping);

				motion.rotation.add(angles);
				motion.position.add(displacement);

				// limit the tilt at ±0.4 radians
				motion.rotation.x = Math.max(-0.4, Math.min (0.4, motion.rotation.x));
				// wrap horizontal rotation to 0...2π
				motion.rotation.y += 2 * Math.PI; motion.rotation.y %= 2 * Math.PI;
			}

			timeLeft -= dt;
		}
	}};
});