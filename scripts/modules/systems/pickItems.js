define(["ecs", "game", "components", "systems/handleShotgun"], function (ecs, game, components, handleShotgun) {
	return { update: function(dt) {
		ecs.for_each([components.Hero, components.Motion], function(player) {
			var playerPosition = player.get(components.Motion).position;
			ecs.for_each([components.Item, components.Motion, components.PlateEntity], function(item) {
				if (item.get(components.PendingRemoval)) return;

				var itemPosition = item.get(components.Motion).position;
				if (itemPosition.distanceToSquared(playerPosition) < 1) {
					// collect the item
					var hero = player.get(components.Hero);
					hero.shells += item.get(components.Item).shells;

					var shotgun = player.get(components.Shotgun);
					if(!shotgun && item.get(components.Item).givesShotgun) {
						player.add(shotgun = new components.Shotgun());
					}
					if(shotgun) {
						handleShotgun.reload();
					}

					// mark the item for removal
					item.add(new components.PendingRemoval(game.assets.itemPicked.cloneNode()));

					// mark its plate for removal
					item.get(components.PlateEntity).entity.add(new components.PlatePendingRemoval);
				}
			});
			return true;
		});
	}};
});