define(["ecs", "game", "components"], function (ecs, game, components) {
	return { update: function(dt) {
		ecs.for_each([components.Motion, components.Plate], function(entity) {
			var plate = entity.get(components.Plate).plate;

			// adjust position
			plate.position.copy(entity.get(components.Motion).position);

			// glow
			plate.material.opacity =
				0.9 * plate.material.opacity +
				0.1 * (0.5 + 0.7 * Math.sin((Date.now() % 6283) * 5e-3));

		});
	}};
});