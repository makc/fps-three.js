define(["ecs", "game", "components"], function (ecs, game, components) {

	// rules to animate light pillar by
	var lightScale = function (y, y0, r) {
		return Math.min(1, Math.max(1e-3, (y - y0) / r));
	};
	var lightOpacity = function (y, y0, r) {
		return Math.min(1, Math.max(0, 1 - (y - y0 - r) * 0.5));
	};

	return { update: function(dt) {
		ecs.for_each([components.Motion, components.Plate], function(entity) {
			var plateComponent = entity.get(components.Plate);
			var plate = plateComponent.plate;

			// adjust position
			plate.position.copy(entity.get(components.Motion).position);

			// glow
			plate.material.opacity =
				0.9 * plate.material.opacity +
				0.1 * (0.7 + 0.3 * Math.sin((Date.now() % 6283) * 5e-3));

			var i, n, ray;
			if (plateComponent.pillar) {
				// animate light pillar
				for (i = 0, n = plateComponent.pillar.length; i < n; i++) {
					ray = plateComponent.pillar[i];

					ray.position.y += 5e-3 * dt;
					ray.scale.y = lightScale(ray.position.y, plate.position.y, ray.geometry.boundingSphere.radius);
					ray.material.opacity = lightOpacity(ray.position.y, plate.position.y, ray.geometry.boundingSphere.radius);
					if (ray.material.opacity < 1e-3) {
						ray.position.y = plate.position.y;
					}
				}
			} else if (plateComponent.light) {
				// create light pillar
				plateComponent.pillar = [];
				for (i = 0, n = 5 + 4 * Math.random(); i < n; i++) {
					ray = plateComponent.light.clone();
					ray.material = plateComponent.light.material.clone();

					ray.position.copy(plate.position);
					ray.position.y -= 2 * ray.geometry.boundingSphere.radius * Math.random();

					var a = 2 * Math.PI * i / n, r = 0.2 * Math.random();
					ray.position.x += r * Math.cos(a);
					ray.position.z += r * Math.sin(a);

					ray.rotation.y = Math.random() * 2 * Math.PI;

					game.scene.add(ray);

					plateComponent.pillar[i] = ray;
				}
			}
		});
	}};
});