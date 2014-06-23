define(["ecs", "game", "components"], function (ecs, game, components) {
	return { update: function(dt) {
		ecs.for_each([components.Body, components.PendingRemoval], function(entity) {
			var pr = entity.get(components.PendingRemoval); if (pr.sound) { pr.sound.play(); }

			game.scene.remove(entity.get(components.Body).object); entity.remove();
		});
	}};
});