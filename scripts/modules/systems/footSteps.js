define(["ecs", "game", "components"], function (ecs, game, components) {
	var lastPosition = new THREE.Vector3();

	return { update: function(dt) {
		ecs.for_each([components.Hero, components.Motion], function(player) {
			var motion = player.get(components.Motion);
			if(!motion.airborne) {
				if(lastPosition.distanceToSquared(motion.position) > 3) {
					lastPosition.copy(motion.position);
					game.assets.steps[ Math.round(game.assets.steps.length * Math.random()) % game.assets.steps.length ].cloneNode().play();
				}
			}
			return true;
		});
	}};
});
