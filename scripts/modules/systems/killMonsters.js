define(["ecs", "components"], function (ecs, components) {
	return { update: function(dt) {
		ecs.for_each([components.Shot], function(shot) {
			var ray = shot.get(components.Shot).ray;
			var i = 0;
			ecs.for_each([components.Monster, components.Motion, components.Body, components.AnimatedObject], function(monster) {
				if (monster.get(components.UnderFire)) return;

				var monsterCenter = monster.get(components.Motion).position.clone();
				monsterCenter.y += monster.get(components.Body).object.geometry.boundingSphere.radius;

				var monsterDirection = monsterCenter.sub(ray.origin);

				// http://www.wolframalpha.com/input/?i=contour+plot+x%2F%28x*x%2By*y%29^p+%3E+0.92+for+x+from+0+to+60%2C+y+from+-30+to+30%2C+p+%3D+0.51
				var dot = monsterDirection.dot(ray.direction), l2 = monsterDirection.lengthSq();
				var damage = Math.max(0, 100 * (dot / Math.pow(l2, 0.51) - 0.92) / (0.96 - 0.92));

				// the above formula is problematic at close range, so...
				damage += Math.max(0, 100 * (dot / l2 - 0.2));

				if (damage > 0) {
					monster.add(new components.UnderFire());

					var monsterComponent = monster.get(components.Monster);
					monsterComponent.health -= damage;

					var object = monster.get(components.AnimatedObject).object;

					if(monsterComponent.health <= 0) {
						// make sure previous effect is disposed
						var dc = monster.get(components.Dissolving); if (dc) { dc.effect.dispose(); }

						monster.add(new components.Dissolving(new DissolvingEffect(object, 0xff7700, 2000, true)));

						object.defaultAnimation = null;
						object.playOnce("die", 500, function() {
							// wait for dissolving effect to end
							setTimeout(function(){
								monster.add(new components.PendingRemoval());
							}, 2000 - 500);

							// if it still has its plate attached, remove it
							var plateComponent = monster.get(components.PlateEntity);
							if(plateComponent) {
								plateComponent.entity.add(new components.PlatePendingRemoval);
								monster.remove(components.PlateEntity);
							}
						});
					} else {
						object.playOnce("pain", 300, function() {
							monster.remove(components.UnderFire);
						});
					}
				}
			});
			shot.remove();
		});
	}};
});