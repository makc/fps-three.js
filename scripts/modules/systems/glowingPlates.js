define(["ecs", "components"], function (ecs, components) {

	// rules to animate light pillar by
	var lightScale = function (y, r) {
		return Math.min(1, Math.max(1e-3, y / r));
	};
	var lightOpacity = function (y, r) {
		return Math.min(1, Math.max(0, 1 - (y - r) * 0.5));
	};

	return { update: function(dt) {
		ecs.for_each([components.Body, components.Plate, components.PlatePendingAddition], function(entity) {
			var object = entity.get(components.Body).object;
			var pillar = new THREE.Object3D(); object.add(pillar);

			var pa = entity.get(components.PlatePendingAddition);
			var light = pa.light, plate = pa.plate;

			var R = 0.3 * plate.geometry.boundingSphere.radius;

			for (var i = 0, n = 5 + 10 * R * Math.random(); i < n; i++) {
				var ray = light.clone();
				ray.material = light.material.clone();

				ray.position.y -= 2 * ray.geometry.boundingSphere.radius * Math.random();

				var a = 2 * Math.PI * i / n, r = R * Math.random();
				ray.position.x += r * Math.cos(a);
				ray.position.z += r * Math.sin(a);

				ray.rotation.y = Math.random() * 2 * Math.PI;

				pillar.add(ray);
			}

			object.add(plate = plate.clone());
			plate.rotation.x = -0.5 * Math.PI; plate.material = plate.material.clone();

			$(entity.get(components.Plate)).animate({ opacityMultiplier: 1 }, { duration: 1000 });

			entity.remove(components.PlatePendingAddition);
		});

		ecs.for_each([components.Body, components.Plate], function(entity) {
			var object = entity.get(components.Body).object;
			var pillar = object.children[0];
			var plate = object.children[1];

			// glow
			var opacityMultiplier = entity.get(components.Plate).opacityMultiplier;
			plate.material.opacity = opacityMultiplier * (0.7 + 0.5 * Math.sin((Date.now() % 6283) * 5e-3));

			// animate light pillar
			for (var i = 0, n = pillar.children.length; i < n; i++) {
				var ray = pillar.children[i];

				ray.position.y += 5e-3 * dt;
				ray.scale.y = lightScale(ray.position.y, ray.geometry.boundingSphere.radius);
				ray.material.opacity = lightOpacity(ray.position.y, ray.geometry.boundingSphere.radius);
				if (ray.material.opacity < 1e-3) {
					ray.position.y = plate.position.y;
				}
				ray.material.opacity *= opacityMultiplier;
			}
		});

		ecs.for_each([components.Body, components.Plate, components.PlatePendingRemoval], function(entity) {
			var plateComponent = entity.get(components.Plate);
			$(plateComponent).stop(true);
			$(plateComponent).animate({ opacityMultiplier: 0 }, { duration: 2000,
				complete: function() {
					var object = entity.get(components.Body).object;

					// materials were cloned, so they need to be disposed
					object.traverse(function(child) {
						if(child.material) child.material.dispose();
					});

					object.parent.remove(object);
					entity.remove();
				}
			});

			entity.remove(components.PlatePendingRemoval);
		});
	}};
});