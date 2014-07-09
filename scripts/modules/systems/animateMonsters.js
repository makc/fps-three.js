define(["ecs", "components"], function (ecs, components) {
	return { update: function(dt) {
		ecs.for_each([components.Monster, components.Body], function(entity) {
			entity.get(components.Body).object.updateAnimation(dt);
		});
	}};
});