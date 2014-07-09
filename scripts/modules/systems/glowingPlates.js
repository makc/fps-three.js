define(["ecs", "components"], function (ecs, components) {
	var euler = new THREE.Euler(-0.5 * Math.PI, 0, 0, 'YXZ');

	// rules to animate light pillar by
	var lightScale = function (y, r) {
		return Math.min(1, Math.max(1e-3, y / r));
	};
	var lightOpacity = function (y, r) {
		return Math.min(1, Math.max(0, 1 - (y - r) * 0.5));
	};

	return { update: function(dt) {
		ecs.for_each([components.Plate], function(entity) {
			var plateComponent = entity.get(components.Plate);
			var plate = plateComponent.plate;

			// adjust rotation
			euler.setFromQuaternion(plate.parent.quaternion);
			euler.x = -0.5 * Math.PI;
			euler.y = -euler.y;
			plate.quaternion.setFromEuler(euler);

			// glow
			plate.material.opacity =
				0.9 * plate.material.opacity +
				0.1 * (0.7 + 0.5 * Math.sin((Date.now() % 6283) * 5e-3));

			var i, n, ray;
			if (plateComponent.pillar) {
				// animate light pillar
				for (i = 0, n = plateComponent.pillar.length; i < n; i++) {
					ray = plateComponent.pillar[i];

					ray.position.y += 5e-3 * dt;
					ray.scale.y = lightScale(ray.position.y, ray.geometry.boundingSphere.radius);
					ray.material.opacity = lightOpacity(ray.position.y, ray.geometry.boundingSphere.radius);
					if (ray.material.opacity < 1e-3) {
						ray.position.y = plate.position.y;
					}
				}
			} else if (plateComponent.light) {
				// create light pillar
				plateComponent.pillar = [];

				var R = 0.3 * plateComponent.plate.geometry.boundingSphere.radius;

				for (i = 0, n = 5 + 10 * R * Math.random(); i < n; i++) {
					ray = plateComponent.light.clone();
					ray.material = plateComponent.light.material.clone();

					ray.position.y -= 2 * ray.geometry.boundingSphere.radius * Math.random();

					var a = 2 * Math.PI * i / n, r = R * Math.random();
					ray.position.x += r * Math.cos(a);
					ray.position.z += r * Math.sin(a);

					ray.rotation.y = Math.random() * 2 * Math.PI;

					plate.parent.add(ray);

					plateComponent.pillar[i] = ray;
				}
			}
		});
	}};
});