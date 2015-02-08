define(["ecs", "game", "components"], function (ecs, game, components) {
	return { update: function(dt) {
		var itemCount = 0;
		ecs.for_each([components.Item], function(entity) {
			itemCount++;
		});

		// if there are less than 4 items...
		if(itemCount < 4) {
			// ...spawn one every 4 seconds, or N = 4000/dt calls
			// with probability P per call, P * N ~ 1, or P ~ 1 / N

			var spawnShotgun = (itemCount < 1) || (Math.random () < 0.2);

			if(Math.random() < dt / 4000) {

				var shells = spawnShotgun ? 8 : 4;
				var rotate = spawnShotgun ? ((Math.random() < 0.5) ? -0.01 : +0.01) : 0;
				var object = spawnShotgun ? game.assets.itemShotgunModel.clone() : game.assets.itemShellsModel.clone();

				var item = new ecs.Entity()
					.add(new components.Item(shells, shells == 8))
					.add(new components.Body(object))
					.add(new components.Motion(0, 0, 0, 0, 0, 0, 0, Math.random() * 2 * Math.PI, 0, rotate, 1))
					.add(new components.PendingAddition(
						0xeeff,
						game.assets.itemLight,
						game.assets.itemPlate,
						game.assets.itemAppeared
					));
			}
		}
	}};
});