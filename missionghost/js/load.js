Game = {};

var w = 600;
var h = 400;
var score = 0;
var monedas = 0;
var vidas = 3;
var label_load;
var load;
var load2;
var logo;
var cursors;
var fanta;
var label;
var plataforma;
var base;
var labelScore;
var labelVidas;
var labelMonedas;
var bonus;
var enemys;
var music;
var bonus_s;
var jump_s;
var dead_s;
var ground;
var emitter;
var next_platform = 10;
var update = 0;
var plata;
var defensa;
var con_defensa = false;
var con = 0;

function rand(num){ return Math.floor(Math.random() * num) };

Game.Boot = function(game) {};

Game.Boot.prototype = {
	preload: function() {
		game.stage.backgroundColor = '#4682B4';
		game.load.image('loading', 'assets/img/loading.png');
		game.load.image('loading2', 'assets/img/loading2.png');
	},
	create: function() {
		this.game.state.start('Load');
	}
};

Game.Load = function(game) {};

Game.Load.prototype = {
	preload: function() {
		
		label_load = game.add.text(Math.floor(w/2)+0.5, Math.floor(h/2)-15+0.5, 'cargando...', { font: '30px Arial', fill: '#fff' });
		label_load.anchor.setTo(0.5, 0.5);
		
		load2 = game.add.sprite(w/2, h/2+15, 'loading2');
		load2.x -= load2.width/2;
		
		load = game.add.sprite(w/2, h/2+15, 'loading');
		load.x = load.width/2;
		game.load.setPreloadSprite(load);

		game.load.image('logo', 'assets/img/logo.png');
		game.load.image('player', 'assets/img/player.png');
		game.load.image('enemy', 'assets/img/fantasma.png');
		game.load.image('bonus', 'assets/img/bonus.png');
		game.load.image('piso', 'assets/img/piso.png');
		game.load.image('chispa', 'assets/img/chispa.png');
		game.load.image('defensa', 'assets/img/defensa.png');
		
		game.load.audio('jump', 'assets/audio/jump.wav');
		game.load.audio('dead', 'assets/audio/dead.wav');
		game.load.audio('bonus', 'assets/audio/bonus.wav');
		game.load.audio('music', ['assets/audio/oedipus_ark_pandora.mp3', 'assets/audio/oedipus_ark_pandora.ogg']);
	},
	create: function() {
		game.state.start('Menu');
	}
};