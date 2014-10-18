define(["ecs", "components"], function (ecs, components) {
	var keys = { SP: 32, W: 87, A: 65, S: 83, D: 68, UP: 38, LT: 37, DN: 40, RT: 39 };

	var keysPressed = {};

	(function(watchedKeyCodes) {
		var handler = function(down) {
			return function(e) {
				var index = watchedKeyCodes.indexOf(e.keyCode);
				if (index >= 0) {
					keysPressed[watchedKeyCodes[index]] = down; e.preventDefault();
				}
			};
		}
		$(document).keydown(handler(true));
		$(document).keyup(handler(false));
	})([
		keys.SP, keys.W, keys.A, keys.S, keys.D, keys.UP, keys.LT, keys.DN, keys.RT
	]);


	var forward = new THREE.Vector3();
	var sideways = new THREE.Vector3();

	// alternative controls for touch screens
	// inspired by https://github.com/sebleedelisle/JSTouchController/blob/master/TouchControl.html

	var firstTouch = -1, otherTouches = 0;
	var firstTouchOrigin = new THREE.Vector2();
	var firstTouchVector = new THREE.Vector2();

	document.addEventListener ('touchstart', function (e) {
		for (var i = 0; i < e.changedTouches.length; i++) {
			var touch = e.changedTouches[i];
			if ((firstTouch < 0) && (touch.clientX > 0.5 * window.innerWidth)) {
				firstTouch = touch.identifier;
				firstTouchOrigin.set (touch.clientX, touch.clientY);
			} else {
				otherTouches++;
			}
		}
	});
	document.addEventListener ('touchmove', function (e) {
		e.preventDefault ();
		for (var i = 0; i < e.changedTouches.length; i++) {
			var touch = e.changedTouches[i];
			if (touch.identifier == firstTouch) {
				firstTouchVector.set (touch.clientX, touch.clientY).sub (firstTouchOrigin);
				break;
			}
		}
	});
	document.addEventListener ('touchend', function (e) {
		for (var i = 0; i < e.changedTouches.length; i++) {
			var touch = e.changedTouches[i];
			if (touch.identifier == firstTouch) {
				firstTouch = -1;
				firstTouchVector.set (0, 0);
			} else {
				otherTouches--;
			}
		}
	});

	return { update: function (dt) {
		ecs.for_each([components.Hero, components.Motion], function(player) {
			var motion = player.get(components.Motion);
			if(!motion.airborne) {

				// interpret touch vector
				var rotationTouchInput = firstTouchVector.x;
				if (rotationTouchInput > 0) rotationTouchInput = Math.max (0, rotationTouchInput - 0.02 * window.innerWidth);
				if (rotationTouchInput < 0) rotationTouchInput = Math.min (0, rotationTouchInput + 0.02 * window.innerWidth);
				rotationTouchInput = Math.max (-1, Math.min (1, rotationTouchInput / (0.2 * window.innerWidth)));

				var movementTouchInput = firstTouchVector.y;
				movementTouchInput = Math.max (-1, Math.min (1, movementTouchInput / (0.1 * window.innerWidth)));

				// there is no easy way to look up or down using touch screen only
				var lookDownTouchInput = (Math.abs (rotationTouchInput) + Math.abs (movementTouchInput) > 0) ? 1 : 0; 

				// look around
				var sx = (keysPressed[keys.UP] ? 0.04 : (keysPressed[keys.DN] ? -0.04 : 0)) - 0.04 * lookDownTouchInput;
				var sy = (keysPressed[keys.LT] ? 0.04 : (keysPressed[keys.RT] ? -0.04 : 0)) - 0.04 * rotationTouchInput;

				if(Math.abs(sx) >= Math.abs(motion.spinning.x)) motion.spinning.x = sx;
				if(Math.abs(sy) >= Math.abs(motion.spinning.y)) motion.spinning.y = sy;

				// move around
				// calculate forward direction in the horizontal plane from rotation
				forward.set(Math.sin(motion.rotation.y), 0, Math.cos(motion.rotation.y));
				// calculate sideways direction from forward direction
				sideways.set(forward.z, 0, -forward.x);

				forward.multiplyScalar((keysPressed[keys.W] ? -0.1 : (keysPressed[keys.S] ? 0.1 : 0)) + 0.1 * movementTouchInput);
				sideways.multiplyScalar(keysPressed[keys.A] ? -0.1 : (keysPressed[keys.D] ? 0.1 : 0));

				var combined = forward.add(sideways);
				if(Math.abs(combined.x) >= Math.abs(motion.velocity.x)) motion.velocity.x = combined.x;
				if(Math.abs(combined.y) >= Math.abs(motion.velocity.y)) motion.velocity.y = combined.y;
				if(Math.abs(combined.z) >= Math.abs(motion.velocity.z)) motion.velocity.z = combined.z;

			}

			// if player has the shotgun...
			var shotgun = player.get(components.Shotgun);
			if(shotgun) {

				// ...try to use it
				shotgun.pullingTrigger = keysPressed[keys.SP] || (otherTouches > 0);
			}

			return true;
		});
	}};
});