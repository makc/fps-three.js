define(["ecs", "game", "map", "components"], function (ecs, game, map, components) {
	return { update: function(dt) {
		ecs.for_each([components.Body, components.PendingRemoval, components.Destination], function(entity) {
			map.releaseDestinationIndex(entity.get(components.Destination).index);

			var pr = entity.get(components.PendingRemoval); if (pr.sound) { pr.sound.play(); }

			game.scene.remove(entity.get(components.Body).object); entity.remove();
		});
	}};
});