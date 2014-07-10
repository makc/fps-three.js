define(["ecs", "components"], function (ecs, components) {
	return { update: function(dt) {
		ecs.for_each([components.AnimatedObject], function(entity) {
			entity.get(components.AnimatedObject).object.update();
		});
	}};
});