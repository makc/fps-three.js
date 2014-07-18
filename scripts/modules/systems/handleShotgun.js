define(["ecs", "game", "components"], function (ecs, game, components) {
	var swayFactor = 0;
	return { update: function(dt) {
		ecs.for_each([components.Hero, components.Motion, components.Shotgun, components.AnimatedObject], function(player) {
			var hero = player.get(components.Hero);
			var motion = player.get(components.Motion);
			var shotgun = player.get(components.Shotgun);
			var shotgunModel = player.get(components.AnimatedObject).object;

			// sway the shotgun as you go
			var t = 5e-3 * (Date.now() % 6283);
			var a = motion.airborne ? 0 : motion.velocity.length(), b;
			swayFactor *= 0.8; swayFactor += 0.2 * a; a = swayFactor; b = 0.5 * a;
			shotgunModel.position.x =  0.235 + a * Math.cos(t);
			shotgunModel.position.y = -0.2   + b * (Math.cos(t * 2) - 1);

			// fire?
			if(shotgun.pullingTrigger && !shotgun.loading && !shotgun.firing && (hero.shells > 0)) {
				// fire!
				shotgun.firing = true;

				game.assets.shotgunFired.cloneNode().play();

				// play shotgun animation
				shotgunModel.playOnce("pow", 600, function() {
					shotgun.firing = false;
				});

				hero.shells--;

				// create Shot entity
				var origin = motion.position.clone();
				origin.y += player.get(components.Body).height;

				var direction = new THREE.Vector3(0, 0, -1);
				direction.applyEuler(new THREE.Euler(
					motion.rotation.x, motion.rotation.y, motion.rotation.z, 'YXZ'
				));

				new ecs.Entity().add(new components.Shot(new THREE.Ray(origin, direction)));
			}

			return true;
		});
	},
	reload: function() {
		ecs.for_each([components.Shotgun, components.AnimatedObject], function(player) {
			var shotgun = player.get(components.Shotgun);
			var shotgunModel = player.get(components.AnimatedObject).object;

			if(!shotgun.loading) {
				shotgun.loading = true;
				$(shotgunModel.rotation)
					.animate({ x: -0.7 }, { duration: 400 })
					.animate({ x:  0   }, { duration: 400, complete: function() {
						shotgun.loading = false;
					}});
			}

			return true;
		});
	},
	reset: function() {
		ecs.for_each([components.Hero, components.AnimatedObject], function(player) {
			var shotgunModel = player.get(components.AnimatedObject).object;
			shotgunModel.playOnce(null);

			var shotgunRotation = shotgunModel.rotation;
			$(shotgunRotation).stop(true); shotgunRotation.x = -0.7;

			return true;
		});
	}};
});