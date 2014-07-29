define(["ecs", "components"], function (ecs, components) {
	return { update: function(dt) {
		ecs.for_each([components.Dissolving], function(entity) {
			if(entity.get(components.Dissolving).effect.update(dt)) {
				entity.remove(components.Dissolving);
			}
		});
	}};
});