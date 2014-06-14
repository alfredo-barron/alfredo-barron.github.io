Game = {};

var tile_size = 50;
var w = tile_size*12;
var h = tile_size*10;
var sound = 1;
var score = 0;

function rand(num){ return Math.floor(Math.random() * num) };


Game.Boot = function (game) { };

Game.Boot.prototype = {
	preload: function () {
		game.stage.backgroundColor = '#a9a9a9';
		game.load.image('loading', 'images/loading.png');
		game.load.image('loading2', 'images/loading2.png');
	},
	create: function() {
		this.game.state.start('Load');
	}
};

Game.Load = function (game) { };

Game.Load.prototype = {
	preload: function () {
	    label2 = game.add.text(Math.floor(w/2)+0.5, Math.floor(h/2)-15+0.5, 'loading...', { font: '30px Arial', fill: '#fff' });
		label2.anchor.setTo(0.5, 0.5);

		preloading2 = game.add.sprite(w/2, h/2+15, 'loading2');
		preloading2.x -= preloading2.width/2;
		preloading = game.add.sprite(w/2, h/2+19, 'loading');
		preloading.x -= preloading.width/2;
		game.load.setPreloadSprite(preloading);

 		game.load.tilemap('map1', 'levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
    	game.load.image('tiles', 'images/wall-tiles-40x40.png');
    	game.load.image('menu', 'images/menu.png');
    	game.load.image('dead', 'images/dead.png');
		game.load.spritesheet('sound', 'images/sound.png', 28, 22);

		game.load.spritesheet('player', 'images/player.png', 40, 40);
		game.load.image('enemy', 'images/enemy.png');
		//game.load.image('bullet', 'images/bullet2.png');
		game.load.image('key', 'images/key.png');
		game.load.image('door', 'images/door.png');
		game.load.image('heart', 'images/heart.png');

		game.load.audio('music', 'sounds/music.wav');
		game.load.audio('key', 'sounds/key.wav');
		game.load.audio('heart', 'sounds/heart.wav');
		game.load.audio('dead', 'sounds/dead.wav');

	},
	create: function () {
		game.state.start('Menu');
	}
};
this 