<?php require_once 'head.php' ?>
	<style>
		input{
			margin-left: 450px;
			margin-top: 240px;
			height: 40px;
		}
	</style>
	<div class="row">
		<div class="col-md-6 col-md-offset-3 text-center">
			<h1>Janko Adventure's</h1>	
		</div>
	</div>
		<div id="div_game" class="col-md-1"><!--<input type="text" id="name" name="name">--></div>	

	<script>
		var w = 900;
		var h = 500;
		
		//Player
		var player;
		var puntos_vida = 15;
		var min_j = 1;
		var max_j = 3;
		var max_puntos_vida = 50;
		var max_hp = 0;
		var maxVida = 0;
		var espadas;
		
		//Map
		var layer;
		var map;
		var tesoros;
		var puertas;
		var escaleras;
		var enemys1;
		var enemys2;
		var enemys3;
		var tesoros1;
		var tesoros2;
		var level;
		var maxLevel;
		
		//Monstruos
		var vida_m1 = 8;
		var min_m1 = 1;
		var max_m1 = 2;

		var vida_m2 = 10;
		var min_m2 = 1;
		var max_m2 = 4;

		var vida_m3 = 12;
		var min_m3 = 1;
		var max_m3 = 6;

		var vida_astrid = 65;
		var min_astrid = 1;
		var max_astrid = 9;

		//Tesoros
		var mochila = 0;
		var tipo_j;
		var extra_j;
		var tipo_p;
		var hp_p;

		//Batalla final
		var land;
		var map1;
		var layer1;
		var astrid;
		var janko;
		var start_label;
		var frase;
		var bulletTime = 0;

		var game = new Phaser.Game(w, h, Phaser.AUTO, 'game_div');

		function rand(num){ return Math.floor(Math.random() * num) };

		function range(min, max){ return (Math.floor(Math.random() * max) + min ) };

		Game = {};

		Game.Boot = function(game) {};

		Game.Boot.prototype = {
			preload: function() {
				game.stage.backgroundColor = '#000000';
				game.load.image('fondo', '<?php echo $root; ?>public/assets/img/fondo.png');
				game.load.image('loading', '<?php echo $root; ?>public/assets/img/loading1.png');
				//game.load.image('loading2', '<?php echo $root; ?>public/assets/img/loading.png');
			},
			create: function() {
				this.game.state.start('Load');
			}
		};

		Game.Load = function(game) {};

		Game.Load.prototype = {
			preload: function() {

				land = game.add.tileSprite(0, 0, 900, 500, 'fondo');
		
				label_load = game.add.text(Math.floor(w/2)+0.5, Math.floor(h/2)-15+0.5, 'cargando...', { font: '50px Arial', fill: '#fff' });
				label_load.anchor.setTo(0.5, 0.5);
		
				//load2 = game.add.sprite(w/2, h/2+15, 'loading2');
				//load2.x -= load2.width/2;
		
				load = game.add.sprite(w/2, h/2+15, 'loading');
				load.x = load.width/2;
				game.load.setPreloadSprite(load);

				game.load.image('fondobatalla', '<?php echo $root; ?>public/assets/img/fondobatalla.png');
				game.load.image('batallafinal', '<?php echo $root; ?>public/assets/img/fondocas.jpg');
				game.load.image('logo', '<?php echo $root; ?>public/assets/img/logoja.png');
				game.load.image('btnjugar', '<?php echo $root; ?>public/assets/img/btnjugar.png');
				game.load.image('btnopcion', '<?php echo $root; ?>public/assets/img/btnopcion.png');
				game.load.image('btnacerca', '<?php echo $root; ?>public/assets/img/btnacerca.png');
				game.load.image('btnpuntuaje', '<?php echo $root; ?>public/assets/img/btnpuntuaje.png');
				
				game.load.image("piso", "<?php echo $root; ?>public/assets/img/piso.png");
				game.load.image("player", "<?php echo $root; ?>public/assets/img/player.png");
				game.load.image("puerta", "<?php echo $root; ?>public/assets/img/puerta.png");
				game.load.image("escalera", "<?php echo $root; ?>public/assets/img/escalera.png");
				game.load.image("m1", "<?php echo $root; ?>public/assets/img/m1.png");
				game.load.image("m2", "<?php echo $root; ?>public/assets/img/m2.png");
				game.load.image("m3", "<?php echo $root; ?>public/assets/img/m3.png");
				game.load.image("m4", "<?php echo $root; ?>public/assets/img/m4.png");
				game.load.image("pocion", "<?php echo $root; ?>public/assets/img/pocion.png");
				game.load.image("joya", "<?php echo $root; ?>public/assets/img/gema.png");
				game.load.image("cofre", "<?php echo $root; ?>public/assets/img/cofre.png");
				game.load.image("espada", "<?php echo $root; ?>public/assets/img/espada.png");
				game.load.image("base", "<?php echo $root; ?>public/assets/img/13.png");

				game.load.audio('music', '<?php echo $root; ?>public/assets/sounds/Dungeon_Theme.ogg');
				game.load.audio('joya_s', '<?php echo $root; ?>public/assets/sounds/coin.wav');
				game.load.audio('pocion_s', '<?php echo $root; ?>public/assets/sounds/key.wav');
				game.load.audio('esca_s', '<?php echo $root; ?>public/assets/sounds/heart.wav');
				game.load.audio('dead_s', '<?php echo $root; ?>public/assets/sounds/dead.wav');

				maxLevel = 7;
				
				var i;
				for (i = 1; i <= maxLevel; i++) {
					game.load.tilemap("level"+i, "<?php echo $root; ?>public/assets/levels/"+i+".json", null, Phaser.Tilemap.TILED_JSON);
				}
			    game.load.tilemap("final", "<?php echo $root; ?>public/assets/levels/final.json", null, Phaser.Tilemap.TILED_JSON);
			 /*	game.load.tilemap("level3", "<?php echo $root; ?>public/assets/levels/3.json", null, Phaser.Tilemap.TILED_JSON);
				game.load.tilemap("level4", "<?php echo $root; ?>public/assets/levels/4.json", null, Phaser.Tilemap.TILED_JSON);
				game.load.tilemap("level5", "<?php echo $root; ?>public/assets/levels/5.json", null, Phaser.Tilemap.TILED_JSON);
				game.load.tilemap("level6", "<?php echo $root; ?>public/assets/levels/6.json", null, Phaser.Tilemap.TILED_JSON);
				game.load.tilemap("level7", "<?php echo $root; ?>public/assets/levels/7.json", null, Phaser.Tilemap.TILED_JSON); */
				game.load.image("tiles", "<?php echo $root; ?>public/assets/img/Tilesmapa.png");
			},
			create: function() {
				game.state.start('Menu');
			}
		};

		Game.Menu = function(game) {};

		Game.Menu.prototype = {
			create: function() {

				game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
				game.input.onDown.add(this.gofull, this);

				land = game.add.tileSprite(0, 0, 900, 500, 'fondo');

				cursors = game.input.keyboard.createCursorKeys();

				logo = game.add.sprite(w/2, -195, 'logo');
				logo.anchor.setTo(0.5, 0.5);
				game.add.tween(logo).to({ y: 150 }, 1000, Phaser.Easing.Bounce.Out).start();

				btnjugar = game.add.button(game.world.centerX - 95, 300, 'btnjugar', this.play, this, 2, 1, 0);

				//btnopcion = game.add.button(150, 410, 'btnopcion', this.hola, this, 2, 1, 0);

				//btnpuntuaje = game.add.button(360, 410, 'btnpuntuaje', this.hola, this, 2, 1, 0);

				//btnacerca = game.add.button(570, 410, 'btnacerca', this.hola, this, 2, 1, 0);
			},
			hola: function() {
				alert("hola");
			},
			play: function() {
				game.state.start('Play');
			},
			gofull: function(){
    			game.scale.startFullScreen();
			}
		};

		Game.Play = function(game){};

		Game.Play.prototype = {
			create: function(){
				game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
				game.input.onDown.add(this.gofull, this);

				level = 1;

				max_hp = puntos_vida;

				cursors = game.input.keyboard.createCursorKeys();

				this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

				game.physics.startSystem(Phaser.Physics.ARCADE);
				game.physics.startSystem(Phaser.Physics.P2JS);

				game.physics.p2.restitution = 0.9;

				game.add.tileSprite(0, 0, 2000, 2000, 'piso');
			
				music = game.add.audio('music'); 
    			music.play('', 0, 0.2, true);

    			joya_s = game.add.audio('joya_s');
				joya_s.volume = 0.2;

				pocion_s = game.add.audio('pocion_s');
				pocion_s.volume = 0.2;

				esca_s = game.add.audio('esca_s');
				esca_s.volume = 0.2;

				dead_s = game.add.audio('dead_s');
				dead_s.volume = 0.2;

				this.load_level(level);

				player = game.add.sprite(480, 480, "player");
				game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);
				game.camera.deadzone = new Phaser.Rectangle(200, 50, 400, 300);
				game.camera.focusOnXY(0, 0);
				player.direction = 2;
				player.alive = true;
				game.physics.arcade.enable(player);

				espadas = game.add.group();
				espadas.enableBody = true;
				espadas.physicsBodyType = Phaser.Physics.ARCADE;
				espadas.createMultiple(150, 'espada');
				//espadas.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetEspada, this);
    			espadas.setAll('checkWorldBounds', true);
			},
			update: function(){
				game.physics.arcade.collide(layer, player);
				game.physics.arcade.collide(layer, enemys1);
				game.physics.arcade.collide(layer, enemys2);
				game.physics.arcade.collide(layer, enemys3);
				game.physics.arcade.collide(player, enemys1);
				game.physics.arcade.collide(player, enemys2);
				game.physics.arcade.collide(player, enemys3);
				game.physics.arcade.overlap(player, escaleras, this.siguiente_nivel, null, this);
				game.physics.arcade.overlap(espadas, enemys1, this.batalla1, null, this);
				game.physics.arcade.overlap(espadas, enemys2, this.batalla2, null, this);
				game.physics.arcade.overlap(espadas, enemys3, this.batalla3, null, this);
				game.physics.arcade.overlap(player, tesoros1, this.tomar_joya, null, this);
				game.physics.arcade.overlap(player, tesoros2, this.tomar_pocion, null, this);

				this.player_movements();
			},
			gofull: function(){
    			game.scale.startFullScreen();
			},
			player_movements: function(){
				player.body.velocity.x = 0;
				player.body.velocity.y = 0;
					if (cursors.left.isDown){
	        				player.body.velocity.x = -150;
	        			}
					if (cursors.right.isDown){
	        				player.body.velocity.x = 150;
	        			}
					if (cursors.up.isDown){
	        				player.body.velocity.y = -150;
	     			}
	     			if (cursors.down.isDown){
	        				player.body.velocity.y = 150;
	     			}
	     			if(cursors.right.isDown && this.spaceKey.isDown){
	     				this.new_espada1();
	     				dead_s.play();
	     			}
	     			if(cursors.left.isDown && this.spaceKey.isDown){
	     				this.new_espada2();
	     				dead_s.play();
	     			}
	     			if(cursors.down.isDown && this.spaceKey.isDown){
	     				this.new_espada3();
	     				dead_s.play();
	     			}
	     			if(cursors.up.isDown && this.spaceKey.isDown){
	     				this.new_espada4();
	     				dead_s.play();
	     			}
			},
			new_espada1: function(){
	        	if (game.time.now > bulletTime) {
       	 			espa = espadas.getFirstExists(false);
					if (espa) {
            			espa.reset(player.x + 6, player.y - 8);
            			espa.body.velocity.x = 300;
            			bulletTime = game.time.now + 250;
       	 			}
    		}
	        },
	        new_espada2: function(){
	        	if (game.time.now > bulletTime) {
       	 			espa = espadas.getFirstExists(false);
					if (espa) {
            			espa.reset(player.x + 6, player.y - 8);
            			espa.body.velocity.x = -300;
            			bulletTime = game.time.now + 250;
       	 			}
    		}
	        },
	        new_espada3: function(){
	        	if (game.time.now > bulletTime) {
       	 			espa = espadas.getFirstExists(false);
					if (espa) {
            			espa.reset(player.x + 6, player.y - 8);
            			espa.body.velocity.y = 300;
            			bulletTime = game.time.now + 250;
       	 			}
    		}
	        },
	        new_espada4: function(){
	        	if (game.time.now > bulletTime) {
       	 			espa = espadas.getFirstExists(false);
					if (espa) {
            			espa.reset(player.x + 6, player.y - 8);
            			espa.body.velocity.y = -300;
            			bulletTime = game.time.now + 250;
       	 			}
    		}
	        },
			load_level: function(number){
				if(map != null ){
					layer.destroy();
					map.destroy();
					puertas.destroy();
					escaleras.destroy();
					tesoros1.destroy();
					tesoros2.destroy();
					enemys1.destroy();
					enemys2.destroy();
					enemys3.destroy();

				}
				map = game.add.tilemap('level'+number);
				map.addTilesetImage('Tilesmapa', 'tiles');
				//map.addTilesetImage('Tilesmapa', 'escalera');
				map.setCollisionBetween(1, 24);
				layer = map.createLayer('Nivel 1');
				layer.resizeWorld();
				
				escaleras = game.add.group();
				escaleras.enableBody = true;

				puertas = game.add.group();
				puertas.enableBody = true;

				enemys1 = game.add.group();
    			enemys1.enableBody = true;
    			game.physics.arcade.enable(enemys1);

    			enemys2 = game.add.group();
    			enemys2.enableBody = true;
    			game.physics.arcade.enable(enemys2);

    			enemys3 = game.add.group();
    			enemys3.enableBody = true;
    			game.physics.arcade.enable(enemys3);

    			tesoros1 = game.add.group();
    			tesoros1.enableBody = true;
    			game.physics.arcade.enable(tesoros1);

    			tesoros2 = game.add.group();
    			tesoros2.enableBody = true;
    			game.physics.arcade.enable(tesoros2);

				map.createFromObjects('Capa de Objetos 1', 25, 'escalera', 0, true, false, escaleras);
				map.createFromObjects('Puerta', 26, 'puerta', 0, true, false, puertas);
				map.createFromObjects('Monstruo', 27, 'm1', 0, true, false, enemys1);
				map.createFromObjects('Joya', 28, 'cofre', 0, true, false, tesoros1);
				map.createFromObjects('Pocion', 29, 'cofre', 0, true, false, tesoros2);
				map.createFromObjects('Monstruo2', 30, 'm2', 0, true, false, enemys2);
				map.createFromObjects('Monstruo3', 31, 'm3', 0, true, false, enemys3);

				var t = game.add.tween(enemys1).to({y:"-5"}, 300).to({y:"+5"}, 300);
			    t.loop(true).start();

			    var t2 = game.add.tween(enemys2).to({y:"-5"}, 300).to({y:"+5"}, 300);
			    t2.loop(true).start();

			    var t3 = game.add.tween(enemys3).to({y:"-5"}, 300).to({y:"+5"}, 300);
			    t3.loop(true).start();

			   enemys1.forEach(function(e1) {
			   		game.physics.enable(e1, Phaser.Physics.ARCADE);
					game.physics.arcade.enable(e1);
					e1.body.velocity.setTo(200, 200);
			    	e1.body.collideWorldBounds = true;
			    	e1.body.bounce.setTo(0.8, 0.8);
				}, this); 

			    enemys2.forEach(function(e2) {
			   		game.physics.enable(e2, Phaser.Physics.ARCADE);
					game.physics.arcade.enable(e2);
					e2.body.velocity.setTo(200, 200);
			    	e2.body.collideWorldBounds = true;
			    	e2.body.bounce.setTo(0.8, 0.8);
					/* if (e.move == 1)
						e.body.velocity.x = 200;
					else
						e.body.velocity.y = 200; */
				}, this); 

				enemys3.forEach(function(e3) {
			   		game.physics.enable(e3, Phaser.Physics.ARCADE);
					game.physics.arcade.enable(e3);
					e3.body.velocity.setTo(200, 200);
			    	e3.body.collideWorldBounds = true;
			    	e3.body.bounce.setTo(0.8, 0.8);
					/* if (e.move == 1)
						e.body.velocity.x = 200;
					else
						e.body.velocity.y = 200; */
				}, this); 

			},
			siguiente_nivel: function(player, escalera){
				esca_s.play();
				this.win();
			},
			win: function(){
				 if (level < maxLevel) {
    				level++;
    				if(puntos_vida >= 50){
    					puntos_vida = puntos_vida;
    					max_hp = puntos_vida;
    				}
    				else{
    					max_hp += 5;
    					puntos_vida = max_hp;
    				}
  				 } else {
    				game.state.start('Batalla');
    				puntos_vida = 50;
  				}
  				if(level == 1){
  					espada = 3;
  				}
  				else if(level == 3){
  					espada = 4;
  				}
  				else if(level == 5){
  					espada = 5;
  				}
  				else if(level == 7){
  					espada = 7;
  				}
  				//load the next (or first) level
  				this.load_level(level);
			},
			tomar_joya: function(player, j){
				joya_s.play();
				j.destroy();
				//this.j = game.add.sprite(player.y, player.x, "joya");
				//s = game.add.tween(this.j.scale);
    			//s.to({x: 2, y:2}, 100, Phaser.Easing.Linear.None);
    			//s.onComplete.addOnce(theEnd, this);
    			//s.start();
			
    			//tween = game.add.tween(this.j).to( { x: 800 - this.j.width }, 2000, Phaser.Easing.Exponential.Out, true);
    			

				tipo_j = range(1,2);
				if(tipo_j == 1){
					min_j += 1; 
				}
				else{
					max_j += 1;
				}

				if(min_j > max_j){
					var temp = max_j;
					max_j = min_j;
					min_j = temp;
				}
				//Aumenta 2 opciones con el ataque, el minimo 
				
			},
			tomar_pocion: function(player, p){
				pocion_s.play();
				p.destroy();
				mochila++;
				tipo_p = range(1,5);
					tipo_p = (tipo_p * 10);
					hp_p = Math.floor((tipo_p * max_hp)/100);
					var puntos_total = puntos_vida + hp_p;

					if(puntos_total < max_hp){
						puntos_vida = puntos_total;
					}
					else{
						puntos_vida = max_hp;
					}
			},
			batalla1: function(player, m1, espa){
				this.modo_batalla(player, m1, min_m1, max_m1, vida_m1);
			},
			batalla2: function(player, m2, espa){
				this.modo_batalla(player, m2, min_m2, max_m2, vida_m2);
			},
			batalla3: function(player, m3, espa){
				this.modo_batalla(player, m3, min_m3, max_m3, vida_m3);
			},
			modo_batalla: function(player, m, min_m, max_m, vida_m) {
				m.destroy();
				if(min_j > max_j){
					var temp = max_j;
					max_j = min_j;
					min_j = temp;
				}
				var cont = false;
				do{
					var moneda1, moneda2;
					var ataque;
					var atk1 = range(min_j,max_j);
					var atk2 = range(min_m,max_m);
				
					if(atk1 == max_j){
						moneda1 = range(0,1);			
						if(moneda1 == 1){
							vida_m -= atk1;
						}
					}
					else{
						vida_m -= atk1;
					}

					if(atk2 == max_m){
						moneda2 = range(0,1);		
						if(moneda2 == 1){
							puntos_vida -= atk2
						}
					}
					else{
						puntos_vida -= atk2;
					} 
					var cont = (puntos_vida > 0) && (vida_m > 0);
				}
				while(cont);
				if(puntos_vida <= 0){
					music.stop();
					game.state.start('End');
				}
				if(vida_m <= 0){
					m.destroy();
					dead_s.play();
				}
			}, 
			render: function(){
				game.debug.text('Nivel: '+level, 100, 32);
				game.debug.text('Vida: '+puntos_vida+'/'+max_hp, 240, 32);
				game.debug.text('Ataque: '+min_j+' ~ '+max_j, 420, 32);
				game.debug.text('Pociones: '+mochila, 600, 32);
				//game.debug.button(570, 410, 'btnacerca', this.hola, this, 2, 1, 0);
			}
		};

		Game.Batalla = function(game) {};

		Game.Batalla.prototype = {
			create: function() {

				game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
				game.input.onDown.add(this.gofull, this);

				land = game.add.tileSprite(0, 0, 900, 500, 'batallafinal');
				
				janko = game.add.sprite(280, 370, "player");
				janko.direction = 2;
				janko.alive = true;
				//janko.body.gravity.y = 150;
				//janko.body.bounce.y = 0;
				//janko.body.collideWorldBounds = false;
				game.physics.arcade.enable(janko);

				astrid = game.add.sprite(480, 275, "m4");
				//astrid.body.immovable = true;
				game.physics.arcade.enable(astrid);
				
				espadas = game.add.group();
				espadas.enableBody = true;
				espadas.physicsBodyType = Phaser.Physics.ARCADE;
				espadas.createMultiple(25, 'espada');
				espadas.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetEspada, this);
    			espadas.setAll('checkWorldBounds', true);

				cursors = game.input.keyboard.createCursorKeys();

			},
			update: function() {
				game.physics.arcade.collide(layer1, janko);
				//game.physics.arcade.collide(layer1, astrid);
				//game.physics.arcade.collide(janko, astrid);
				game.physics.arcade.collide(espadas, astrid, this.ataque, null, this);
				this.load_final();
				this.movimientos();
			},
			movimientos: function(){
				janko.body.velocity.x = 0;
				   	if (cursors.right.isDown){
        				//janko.body.velocity.x = 150;
        				//janko.angle = -5;
        				this.new_espada();
    				}	
			},
			ataque: function(){
				if(min_j > max_j){
					var temp = max_j;
					max_j = min_j;
					min_j = temp;
				}
				var cont = false;
				do{
					var moneda1, moneda2;
					var ataque;
					var atk1 = range(min_j,max_j);
					var atk2 = range(min_astrid,max_astrid);
				
					if(atk1 == max_j){
						moneda1 = range(0,1);			
						if(moneda1 == 1){
							vida_astrid -= atk1;
						}
					}
					else{
						vida_astrid -= atk1;
					}

					if(atk2 == max_astrid){
						moneda2 = range(0,1);		
						if(moneda2 == 1){
							puntos_vida -= atk2
						}
					}
					else{
						puntos_vida -= atk2;
					} 
					var cont = (puntos_vida > 0) && (vida_astrid > 0);
				}
				while(cont);
				if(puntos_vida <= 0){
					music.stop();
					game.state.start('End');
				}
				if(vida_astrid <= 0){
					vida_astrid = 0;
					astrid.destroy();
					dead_s.play();
					start_label = game.add.text(w/2+0.5, 130, "Has ganado", { font: "60px Arial", fill: "#ffffff", align: "left" });
					start_label.anchor.setTo(0.5, 0.5);

    				emitter = game.add.emitter(game.world.centerX, 200, 200);
				    emitter.makeParticles(['joya', 'pocion']);
					emitter.start(false, 5000, 20);
				}
	        },
	        load_final: function(){
	        	map1 = game.add.tilemap('final');
				map1.addTilesetImage('Tilesmapa', 'tiles');
				map1.setCollisionBetween(5, 22);
				layer1 = map1.createLayer('Nivel 1');
				layer1.resizeWorld();
	        },
	        new_espada: function(){
	        	if (game.time.now > bulletTime) {
       	 			espa = espadas.getFirstExists(false);
					if (espa) {
            			espa.reset(janko.x + 6, janko.y - 8);
            			espa.body.velocity.x = 300;
            			bulletTime = game.time.now + 250;
       	 			}
    		}
	        },
	         resetEspada: function(espa){
	        	espa.kill();
	        },
	        gofull: function(){
    			game.scale.startFullScreen();
			},
	        render: function(){
	        	game.debug.text('Janko: '+puntos_vida, 150, 32);
	        	game.debug.text('Ataque: '+min_j+' ~ '+max_j, 150, 62);
				game.debug.text('Astrid: '+vida_astrid, 600, 32);
				game.debug.text('Ataque: '+min_astrid+' ~ '+max_astrid, 600, 62);

				//game.debug.text(frase, 300, 150);
	        }			
		};

		Game.End = function(game) {};

		Game.End.prototype = {
			create: function() {

				game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
				game.input.onDown.add(this.gofull, this);

				land = game.add.tileSprite(0, 0, 900, 500, 'fondo');

				label_load = game.add.text(Math.floor(w/2)+0.5, Math.floor(h/3)-15+0.5, 'Game Over', { font: '50px Arial', fill: '#fff' });
				label_load.anchor.setTo(0.5, 0.5);

				label_load = game.add.text(Math.floor(w/2)+0.5, Math.floor(h/2)-15+0.5, 'Nivel: '+level+'\nVida maxima: '+max_hp+' \nAtaque: '+min_j+' ~ '+max_j, { font: '30px Arial', fill: '#fff' });
				label_load.anchor.setTo(0.5, 0.5);

				btnjugar = game.add.button(350, 350, 'btnjugar', this.play, this, 2, 1, 0);	
			},
			play: function() {
				this.resetear();
				game.state.start('Play');
			},
			gofull: function(){
    			game.scale.startFullScreen();
			},
			resetear: function(){
				puntos_vida = 15;
				//espada = 3;
				mochila = 0;
				min_j = 1;
				max_j = 3;
			}
		};

		game.state.add('Boot', Game.Boot);
		game.state.add('Load', Game.Load);
		game.state.add('Menu', Game.Menu);
		game.state.add('Play', Game.Play);
		game.state.add('Batalla', Game.Batalla);
		game.state.add('End', Game.End);
		game.state.start('Boot');

	</script>
<?php require_once 'footer.php' ?>
