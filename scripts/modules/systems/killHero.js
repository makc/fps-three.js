define(["ecs", "game", "components"], function (ecs, game, components) {

	var playerHeight = 0, distance = new THREE.Vector3(), push = new THREE.Vector3(), underFire = false;

	return { update: function(dt) {
		// get player position
		var playerHero, playerMotion;
		ecs.for_each([components.Hero, components.Motion, components.Body], function(player) {
			playerHero = player.get(components.Hero);
			playerMotion = player.get(components.Motion);
			playerHeight = player.get(components.Body).height;
			return true;
		});

		var damage = 0; push.set(0, 0, 0);

		ecs.for_each([components.Plasma], function(plasma) {
			distance.subVectors(playerMotion.position, plasma.get(components.Plasma).object.position);
			distance.y += playerHeight;

			// collect damage
			damage += Math.max(1 - 0.3 * distance.lengthSq(), 0);

			// push the player a little
			push.add(distance.normalize().multiplyScalar(damage * 0.01));
		});

		push.y = 0; playerMotion.velocity.add(push);

		// apply damage
		if(damage > 0) {
			playerHero.health -= damage;

			if((playerHero.health > 0) && !underFire) {
				game.assets.pain[(Math.random() < 0.8) ? 0 : 1].cloneNode().play();
			}

			underFire = true;
		} else {
			underFire = false;
		}
	}};
});