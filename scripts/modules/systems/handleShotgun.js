define(["ecs", "game", "components"], function (ecs, game, components) {
	var swayFactor = 0;
	return { update: function(dt) {
		ecs.for_each([components.Hero, components.Motion, components.Shotgun], function(player) {
			var hero = player.get(components.Hero);
			var motion = player.get(components.Motion);
			var shotgun = player.get(components.Shotgun);

			// sway the shotgun as you go
			var t = 5e-3 * (Date.now() % 6283);
			var a = motion.airborne ? 0 : motion.velocity.length(), b;
			swayFactor *= 0.8; swayFactor += 0.2 * a; a = swayFactor; b = 0.5 * a;
			game.assets.shotgunModel.position.x =  0.235 + a * Math.cos(t);
			game.assets.shotgunModel.position.y = -0.2   + b * (Math.cos(t * 2) - 1);

			// fire?
			if(shotgun.pullingTrigger && !shotgun.loading && !shotgun.firing && (hero.shells > 1)) {
				// fire!
				shotgun.firing = true;

				game.assets.shotgunFired.cloneNode().play();

				// three.js can be nominated for the crappiest animation api ever
				$({ t: 0 }).animate({ t: 1 }, { duration: 600, step: function(t) {
					var model = game.assets.shotgunModel;
					var length = model.geometry.morphTargets.length;
					var position = length * t, frame = Math.floor(position), spill = position - frame;
					var a = frame % length, b = (frame + 1) % length;
					for (var i = 0; i < model.morphTargetInfluences.length; i++) {
						switch (i) {
							case a: model.morphTargetInfluences[i] = 1 - spill; break;
							case b: model.morphTargetInfluences[i] = spill; break;
							default: model.morphTargetInfluences[i] = 0; break;
						}
					}
				}, complete: function() {
					shotgun.firing = false;
				}});

				hero.shells--;
			}

			return true;
		});
	},
	reload: function() {
		ecs.for_each([components.Shotgun], function(player) {
			var shotgun = player.get(components.Shotgun);

			if(!shotgun.loading) {
				shotgun.loading = true;
				console.log(0)
				$(game.assets.shotgunModel.rotation)
					.animate({ x: -0.7 }, { duration: 400 })
					.animate({ x:  0   }, { duration: 400, complete: function() {
						shotgun.loading = false;
					}});
			}

			return true;
		});
	},
	reset: function() {
		var shotgunRotation = game.assets.shotgunModel.rotation;
		$(shotgunRotation).stop(true); shotgunRotation.x = -0.7;
	}};
});