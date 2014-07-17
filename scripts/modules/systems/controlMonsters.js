define(["ecs", "game", "map", "components"], function (ecs, game, map, components) {

	var playerPosition = new THREE.Vector3(), playerHeight = 0, target = new THREE.Vector3(), distance = new THREE.Vector3();

	return { update: function(dt) {
		// get player position
		ecs.for_each([components.Hero, components.Motion, components.Body], function(player) {
			playerPosition.copy(player.get(components.Motion).position);
			playerHeight = player.get(components.Body).height;
			return true;
		});

		ecs.for_each([components.Body, components.Motion, components.Monster, components.AnimatedObject], function(monster) {
			if (monster.get(components.PendingRemoval)) return;

			var body = monster.get(components.Body);
			var motion = monster.get(components.Motion);
			var underFire = monster.get(components.UnderFire);
			var hasPlasma = monster.get(components.Plasma);

			var destination = monster.get(components.Destination);

			target.copy(map.getDestinationVector3(destination.index));

			// are we there yet?
			distance.subVectors(target, motion.position);
			if((distance.lengthSq() < 0.5) || underFire || hasPlasma) {
				// yes
				body.object.setDefaultAnimation("stand", 2600);

				target.copy(playerPosition);

				if(!(underFire || hasPlasma)) {
					// move once every 4 seconds when not under fire or throwing plasma balls
					if(Math.random() < dt / 4000) {
						destination.index = map.requestRandomDestinationIndex(destination.index);

						// if it still has its plate attached, remove it
						var plateComponent = monster.get(components.PlateEntity);
						if(plateComponent) {
							plateComponent.entity.add(new components.PlatePendingRemoval);
							monster.remove(components.PlateEntity);
						}
					} else {
						// otherwise maybe throw another plasma ball
						if(Math.random() < dt / 3000) {
							var plasmaBall = game.assets.plasmaBall.clone(); game.scene.add(plasmaBall);
							var plasmaComponent = new components.Plasma(plasmaBall);
							monster.add(plasmaComponent);

							body.object.playOnce("attack", 666, function() {
								// disconnect plasma ball from the monster
								monster.remove(components.Plasma);

								plasmaComponent.velocity.copy(playerPosition).sub(plasmaBall.position);
								plasmaComponent.velocity.y += playerHeight;
								plasmaComponent.velocity.normalize().multiplyScalar(0.2);

								new ecs.Entity().add(plasmaComponent);
							});
						}
					}
				}
			} else {
				// move to it
				body.object.setDefaultAnimation("walk", 666);

				distance.normalize().multiplyScalar(0.05);
				motion.position.add(distance);
			}

			// rotate monster towards its target
			target.sub(motion.position).normalize();

			var dot = target.x * Math.sin(motion.rotation.y) + target.z * Math.cos(motion.rotation.y);

			motion.rotation.y += dot * Math.abs(dot) * 0.4;
		});
	}};
});