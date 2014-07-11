define(["ecs", "game", "map", "components"], function (ecs, game, map, components) {
	return { update: function(dt) {
		ecs.for_each([components.Body, components.Motion, components.PendingAddition], function(entity) {
			// select random spawn location
			var destinationIndex = map.requestRandomDestinationIndex();
			entity.add(new components.Destination(destinationIndex));
			entity.get(components.Motion).position.copy(
				map.getDestinationVector3(destinationIndex)
			);
			// if this is hero, release the location immediately
			if(entity.get(components.Hero)) map.releaseDestinationIndex(destinationIndex);
			// add 3D object to the scene
			var object = entity.get(components.Body).object; game.scene.add(object);
			// play sound to notify the player we have spawned something
			var pa = entity.get(components.PendingAddition); if (pa.sound) { pa.sound.play(); }
			// add the plate and move it to Plate component for glowingPlates system to handle
			if(pa.plate) { object.add(pa.plate); entity.add(new components.Plate(pa.light, pa.plate)); }
			// remove PendingAddition component
			entity.remove(components.PendingAddition);
		});
	}};
});