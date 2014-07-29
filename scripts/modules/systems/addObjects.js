define(["ecs", "game", "map", "components"], function (ecs, game, map, components) {
	return { update: function(dt) {
		ecs.for_each([components.Body, components.Motion, components.PendingAddition], function(entity) {
			// select random spawn location
			var destinationIndex = map.requestRandomDestinationIndex();
			var destination = map.getDestinationVector3(destinationIndex);
			entity.add(new components.Destination(destinationIndex));
			entity.get(components.Motion).position.copy(destination);
			// if this is hero, release the location immediately
			if(entity.get(components.Hero)) map.releaseDestinationIndex(destinationIndex);
			// add 3D object to the scene
			var object = entity.get(components.Body).object; game.scene.add(object);
			// play sound to notify the player we have spawned something
			var pa = entity.get(components.PendingAddition); if (pa.sound) { pa.sound.cloneNode().play(); }
			// fade the object in
			if(object.material) { entity.add(new components.Dissolving(new DissolvingEffect(object, pa.color, 2000, false))); }
			// create new entity with Plate component for glowingPlates system to handle
			if(pa.plate) {
				object = new THREE.Object3D(); game.scene.add(object);
				entity.add(new components.PlateEntity(
					new ecs.Entity()
						.add(new components.Plate())
						.add(new components.Body(object))
						.add(new components.PlatePendingAddition(pa.light, pa.plate))
						.add(new components.Motion(destination.x, destination.y, destination.z))
				));
			}
			// remove PendingAddition component
			entity.remove(components.PendingAddition);
		});
	}};
});