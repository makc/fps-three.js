define(["ecs", "game", "components"], function (ecs, game, components) {
	var displacement = new THREE.Vector3();

	return { update: function(dt) {
		ecs.for_each([components.Plasma], function(entity) {
			var plasma = entity.get(components.Plasma);
			var object = plasma.object;

			var body = entity.get(components.Body);
			if (body) {
				// we're still attached to the monster
				body.object.getVertexCoordinates(225, object.position).applyMatrix4(body.object.matrix);

				// allow gunshots to counter monster attack
				if(entity.get(components.UnderFire)) {
					object.parent.remove(object);
					entity.remove(components.Plasma);
					return;
				}
			} else {
				// flight mode on
				displacement.copy(plasma.velocity).multiplyScalar(dt * 0.03);
				object.position.add(displacement);

				// is it too far?
				if(object.position.lengthSq() > 4000) {
					object.parent.remove(object);
					entity.remove();
					return;
				}
			}

			// animate plasma ball
			var i, n = object.children.length, a = 0.02, b = -0.5 * (n - 1) * a;
			for(i = 0; i < n; i++) {
				object.children[i].rotation.z += a * i + b;
			}

			object.lookAt(game.camera.position);
		});
	}};
});