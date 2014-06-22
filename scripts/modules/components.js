/**
 * Define components
 */
define({

	Hero : function Hero () {
		// all the properties unique to our hero shall go here
	},

	Body : function Body (object, height) {
		// 3d object representing our entity
		this.object = object;
		// its height above the platform
		this.height = height || 0;
	},

	Motion : function Motion (px, py, pz, vx, vy, vz, rx, ry, sx, sy, d) {
		// basic entity motion information
		this.airborne = false;
		this.position = new THREE.Vector3(px || 0, py || 0, pz || 0);
		this.velocity = new THREE.Vector3(vx || 0, vy || 0, vz || 0);
		this.rotation = new THREE.Vector2(rx || 0, ry || 0);
		this.spinning = new THREE.Vector2(sx || 0, sy || 0);
		this.damping = d || 0.93;
	},

	PendingAddition : function PendingAddition () {
		// object initial animation params may go here
	},

	Item : function Item (shells) {
		this.shells = shells;
	}

});