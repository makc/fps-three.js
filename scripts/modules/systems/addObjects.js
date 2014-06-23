define(["ecs", "game", "components"], function (ecs, game, components) {
	var locations = [
		new THREE.Vector3(-2, 7.7, 25), new THREE.Vector3(+2, 7.7, 25),
		new THREE.Vector3(-5, 7.7, 28), new THREE.Vector3(+5, 7.7, 28), new THREE.Vector3(0, 7.7, 28),
		new THREE.Vector3(-6, 7.7, 24), new THREE.Vector3(+6, 7.7, 24),
		new THREE.Vector3(-8, 7.7, 26), new THREE.Vector3(+8, 7.7, 26),
		new THREE.Vector3(-16, 2.9, 14), new THREE.Vector3(+16, 2.9, 14),
		new THREE.Vector3(-14, 2.9, 10), new THREE.Vector3(+14, 2.9, 10),
		new THREE.Vector3(-5, 0.1, 5), new THREE.Vector3(+5, 0.1, 5), new THREE.Vector3(0, 0.1, 8)
	];

	var n = locations.length;
	var m = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), 2 * Math.PI / 3), v;
	for (var i = 0; i < n; i++) {
		v = locations[i].clone(); v.applyMatrix4(m); locations.push(v);
		v = v.clone(); v.applyMatrix4(m); locations.push(v);
	}

	return { update: function(dt) {
		ecs.for_each([components.Body, components.Motion, components.PendingAddition], function(entity) {
			// select random spawn location
			entity.get(components.Motion).position.copy(
				locations[ Math.floor(Math.random() * locations.length) % locations.length ]
			);
			// add 3D object to the scene
			game.scene.add(entity.get(components.Body).object);
			// play sound to notify the player we have spawned something
			var pa = entity.get(components.PendingAddition); if (pa.sound) { pa.sound.play(); }
			// add the plate and move it to Plate component for glowingPlates system to handle
			if(pa.plate) { pa.plate.rotation.x = -0.5 * Math.PI; game.scene.add(pa.plate); entity.add(new components.Plate(pa.light, pa.plate)); }
			// remove PendingAddition component
			entity.remove(components.PendingAddition);
		});
	}};
});