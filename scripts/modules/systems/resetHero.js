define(["ecs", "game", "components"], function (ecs, game, components) {
	return { update: function(dt) {
		// temorary system to bring our hero back on the platform
		ecs.for_each([components.Hero, components.Motion], function(player) {
			var motion = player.get(components.Motion);
			if(motion.position.y < -123) {
				player.add(new components.PendingAddition());
				motion.velocity.multiplyScalar(0);

				player.remove(components.Hero).add(new components.Hero());

				var shotgunRotation = game.assets.shotgunModel.rotation;
				$(shotgunRotation).stop(true); shotgunRotation.x = -0.7;
			}
			return true;
		});
	}};
})();