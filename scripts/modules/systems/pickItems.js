define(["ecs", "game", "components"], function (ecs, game, components) {
	return { update: function(dt) {
		ecs.for_each([components.Hero, components.Motion], function(player) {
			var playerPosition = player.get(components.Motion).position;
			ecs.for_each([components.Item, components.Motion], function(item) {
				var itemPosition = item.get(components.Motion).position;
				if (itemPosition.distanceToSquared(playerPosition) < 1) {
					// collect the item
					console.log("picking item: " + player.get(components.Hero).shells + " += " + item.get(components.Item).shells);
					player.get(components.Hero).shells += item.get(components.Item).shells;
					// mark the item for removal
					item.add(new components.PendingRemoval(game.assets.itemPicked.cloneNode()));
				}
			});
			return true;
		});
	}};
});