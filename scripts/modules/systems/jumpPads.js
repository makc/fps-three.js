define(["ecs", "components"], function (ecs, components) {
	var pads = [ new THREE.Vector3(-17.5, 8, -10), new THREE.Vector3(17.5, 8, -10), new THREE.Vector3(0, 8, +21) ];
	var temp = new THREE.Vector3();

	return { update: function(dt) {
		ecs.for_each([components.Motion], function(entity) {
			var motion = entity.get(components.Motion);
			if(!motion.airborne) {
				for (var j = 0, n = pads.length; j < n; j++) {
					if (pads[j].distanceToSquared(motion.position) < 2.3) {

						// calculate velocity towards another side of platform from jump pad position
						temp.copy(pads[j]); temp.y = 0; temp.setLength(-0.8); temp.y = 0.7;

						motion.airborne = true; motion.velocity.copy(temp); break;
					}
				}
			}
		});
	}};
});