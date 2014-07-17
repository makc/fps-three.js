define(["ecs", "game", "components", "systems/handleShotgun"], function (ecs, game, components, handleShotgun) {
	return { update: function(dt) {
		// temorary system to bring our hero back on the platform
		ecs.for_each([components.Hero, components.Motion], function(player) {
			var health = player.get(components.Hero).health;
			var motion = player.get(components.Motion);
			if((motion.position.y < -123) || (health <= 0)) {
				if (health <= 0) {
					game.assets.death[(Math.random() < 0.7) ? 0 : 1].cloneNode().play();
				}

				player.add(new components.PendingAddition());
				motion.velocity.multiplyScalar(0);

				player.remove(components.Hero).add(new components.Hero());

				player.remove(components.Shotgun); handleShotgun.reset();
			}
			return true;
		});
	}};
});