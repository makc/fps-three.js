define(function () {
	var locations = [
		new THREE.Vector3(-2, 7.7, 25), new THREE.Vector3(+2, 7.7, 25),
		new THREE.Vector3(-5, 7.7, 28), new THREE.Vector3(+5, 7.7, 28), new THREE.Vector3(0, 7.7, 28),
		new THREE.Vector3(-6, 7.7, 24), new THREE.Vector3(+6, 7.7, 24),
		new THREE.Vector3(-8, 7.7, 26), new THREE.Vector3(+8, 7.7, 26),
		new THREE.Vector3(-16, 2.9, 14), new THREE.Vector3(+16, 2.9, 14),
		new THREE.Vector3(-14, 2.9, 10), new THREE.Vector3(+14, 2.9, 10),
		new THREE.Vector3(-5, 0.1, 5), new THREE.Vector3(+5, 0.1, 5), new THREE.Vector3(0, 0.1, 8)
	];

	var n = locations.length, i;
	var m = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), 2 * Math.PI / 3), v;
	for (i = 0; i < n; i++) {
		v = locations[i].clone(); v.applyMatrix4(m); locations.push(v);
		v = v.clone(); v.applyMatrix4(m); locations.push(v);
	}

	n = locations.length;
	var indices = []; for (i = 0; i < n; i++) indices[i] = i;

	var used = {};

	// http://jsbin.com/naqebocu/1/
	var destinations = [[5,1,4,2],[0,6,3,4],[4,7,0],[8,4,1],[3,2,1,0],[7,0,9,11],[1,8,10,12],[2,5,9],[3,6,10],[37,11,7,5],[34,12,8,6],[41,9,5,13],[10,38,6,14],[15,45,11],[42,15,12],[14,13],[26,18,24,20],[27,19,25,21],[16,28,22,24],[17,29,23,25],[24,30,16],[25,31,17],[32,24,18],[33,25,19],[22,20,18,16],[23,21,19,17],[30,16,34,38],[31,17,35,39],[18,32,36,40],[19,33,37,41],[20,26,34],[21,27,35],[22,28,36],[23,29,37],[10,38,30,26],[36,39,31,27],[35,40,32,28],[9,41,33,29],[12,34,26,42],[40,35,27,43],[36,39,28,44],[37,11,29,45],[14,46,38],[47,44,39],[43,46,40],[13,47,41],[44,42],[45,43]];

	return {
		requestRandomDestinationIndex : function(currentIndex) {
			var candidates = (arguments.length < 1) ? indices : destinations[currentIndex];
			var freeCandidates = [];
			for(var i = 0, n = candidates.length; i < n; i++) {
				var j = candidates[i]; if (used[j]) continue; freeCandidates.push(j);
			}
			if((n = freeCandidates.length) > 0) {
				j = freeCandidates[ Math.round (Math.random() * n) % n ];
				used[j] = true; delete used[currentIndex];
				return j;
			}
			// all neighbour destinations are taken - nowhere to go
			return currentIndex;
		},
		releaseDestinationIndex : function(index) {
			delete used[index];
		},
		getDestinationVector3 : function(index) {
			return locations[index];
		}
	};
});