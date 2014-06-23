define(["ecs", "components"], function (ecs, components) {
	return { update: function(dt) {
		// temorary system to bring our hero back on the platform
		ecs.for_each([components.Hero, components.Motion], function(player) {
			var motion = player.get(components.Motion);
			if(motion.position.y < -123) {
				player.add(new components.PendingAddition());
				motion.velocity.multiplyScalar(0);
			}
			return true;
		});
	}};
})();