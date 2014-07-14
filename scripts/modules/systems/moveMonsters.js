define(["ecs", "game", "map", "components"], function (ecs, game, map, components) {

	var playerPosition = new THREE.Vector3(), target = new THREE.Vector3(), distance = new THREE.Vector3();

	return { update: function(dt) {
		// get player position
		ecs.for_each([components.Hero, components.Motion], function(player) {
			playerPosition.copy(player.get(components.Motion).position);
			return true;
		});

		ecs.for_each([components.Body, components.Motion, components.Monster, components.AnimatedObject], function(monster) {
			if (monster.get(components.PendingRemoval)) return;

			var body = monster.get(components.Body);
			var motion = monster.get(components.Motion);

			var destination = monster.get(components.Destination);

			target.copy(map.getDestinationVector3(destination.index));

			// are we there yet?
			distance.subVectors(target, motion.position);
			if(distance.lengthSq() < 0.5) {
				// yes
				body.object.setDefaultAnimation("stand", 2600);

				target.copy(playerPosition);

				// move once every 4 seconds, or N = 4000/dt calls
				// with probability P per call, P * N ~ 1, or P ~ 1 / N
				if(Math.random() < dt / 4000) {
					destination.index = map.requestRandomDestinationIndex(destination.index);

					// if it still has its plate attached, remove it
					var plateComponent = monster.get(components.PlateEntity);
					if(plateComponent) {
						plateComponent.entity.add(new components.PlatePendingRemoval);
						monster.remove(components.PlateEntity);
					}
				}
			} else {
				// move to it
				body.object.setDefaultAnimation("walk", 666);

				distance.normalize().multiplyScalar(0.09);
				motion.position.add(distance);
			}

			// rotate monster towards its target
			target.sub(motion.position).normalize();

			var dot = target.x * Math.sin(motion.rotation.y) + target.z * Math.cos(motion.rotation.y);

			motion.rotation.y += dot * Math.abs(dot) * 0.4;
		});
	}};
});