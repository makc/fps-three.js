/**
 * Define components
 */
define({

	Hero : function Hero () {
		this.health = 100;
		this.shells = 0;
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

	PendingAddition : function PendingAddition (color, light, plate, sound) {
		this.color = color;
		this.light = light;
		this.plate = plate;
		this.sound = sound;
	},

	PendingRemoval : function PendingRemoval (sound) {
		this.sound = sound;
	},

	Item : function Item (shells, givesShotgun) {
		this.shells = shells;
		this.givesShotgun = givesShotgun;
	},

	Plate : function Plate () {
		this.opacityMultiplier = 0;
	},

	PlatePendingAddition : function PlatePendingAddition (light, plate) {
		this.light = light;
		this.plate = plate;
	},

	PlatePendingRemoval : function PlatePendingRemoval () {
	},

	PlateEntity : function PlateEntity (entity) {
		this.entity = entity
	},

	Shot : function Shot (ray) {
		this.ray = ray;
	},

	Shotgun : function Shotgun () {
		this.firing = false;
		this.loading = false;
		this.pullingTrigger = false;
	},

	Monster : function Monster () {
		this.health = 100;
	},

	AnimatedObject : function AnimatedObject (object) {
		this.object = object;
	},

	Destination : function Destination (index) {
		this.index = index;
	},

	UnderFire : function UnderFire () {
	},

	Plasma : function Plasma (object) {
		this.velocity = new THREE.Vector3();
		this.object = object;
	},

	Dissolving : function Dissolving (effect) {
		this.effect = effect;
	}

});