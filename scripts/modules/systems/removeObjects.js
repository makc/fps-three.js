define(["ecs", "map", "components"], function (ecs, map, components) {
	return { update: function(dt) {
		ecs.for_each([components.Body, components.PendingRemoval, components.Destination], function(entity) {
			map.releaseDestinationIndex(entity.get(components.Destination).index);

			var pr = entity.get(components.PendingRemoval); if (pr.sound) { pr.sound.play(); }

			var dc = entity.get(components.Dissolving); if (dc) { dc.effect.dispose(); }

			var object = entity.get(components.Body).object; object.parent.remove(object);
			entity.remove();
		});
	}};
});