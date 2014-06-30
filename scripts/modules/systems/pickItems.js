define(["ecs", "game", "components"], function (ecs, game, components) {
	return { update: function(dt) {
		ecs.for_each([components.Hero, components.Motion], function(player) {
			var playerPosition = player.get(components.Motion).position;
			ecs.for_each([components.Item, components.Motion], function(item) {
				var itemPosition = item.get(components.Motion).position;
				if (itemPosition.distanceToSquared(playerPosition) < 1) {
					// collect the item
					var hero = player.get(components.Hero);
					var shells = item.get(components.Item).shells;

					hero.hasShotgun = hero.hasShotgun || (shells == 8);
					hero.shells = hero.shells + shells;

					if (hero.hasShotgun) {
						$(game.assets.shotgunModel.rotation)
							.animate({ x: -0.7 }, { duration: 400 })
							.animate({ x:  0   }, { duration: 400 });
					}

					// mark the item for removal
					item.add(new components.PendingRemoval(game.assets.itemPicked.cloneNode()));
				}
			});
			return true;
		});
	}};
});