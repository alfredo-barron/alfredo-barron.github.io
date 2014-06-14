Game.Play = function(game) {};

Game.Play.prototype = {
	create: function() {

		game.world.setBounds(0, -100000, w, h+100000);

		cursors = game.input.keyboard.createCursorKeys();

		game.physics.startSystem(Phaser.Physics.ARCADE);

		//plataforma.enableBody = true;

		//var piso = plataforma.create(0, game.world.height -20, 'piso'); 
		//piso.scale.setTo(1, 1);
		//piso.body.immovable = true;

		/*var plata = plataforma.create(100, 290, 'piso');
		plata.body.immovable = true; 

		plata = plataforma.create(-150, 200, 'piso');
		plata.body.immovable = true; 

		plata = plataforma.create(150, 110, 'piso');
		plata.body.immovable = true;  */

		plataforma = game.add.group();
		plataforma.enableBody = true;
		plataforma.createMultiple(15, 'piso');
		plataforma.setAll('body.immovable', true);

	    bonus = game.add.group();
		bonus.createMultiple(50, 'bonus');
		bonus.enableBody = true;
		game.physics.arcade.enable(bonus,true);

    	enemys = game.add.group();
    	enemys.createMultiple(45, 'enemy');
    	enemys.enableBody = true;
    	game.physics.arcade.enable(enemys,true);

    	defensa = game.add.group();
    	defensa.createMultiple(25, 'defensa');
    	defensa.enableBody = true;
    	game.physics.arcade.enable(defensa,true);
    	defensa.setAll('outOfBoundsKill', true);

		this.emitter = game.add.emitter(0, 0, 200);
	    this.emitter.makeParticles('chispa');
	    this.emitter.gravity = 0;
	    this.emitter.minParticleSpeed.setTo(-200, -200);
	    this.emitter.maxParticleSpeed.setTo(200, 200);

    	player = game.add.sprite(0, h/2+116, 'player');
		game.physics.arcade.enable(player);
		player.body.bounce.y = 0;
		player.body.gravity.y = 150;
		player.body.collideWorldBounds = false;

		ground = game.add.group(); 
		ground.enableBody = true;
		var pise = ground.create(0, h-20, 'piso');
		pise.scale.setTo(1, 1);
		pise.body.immovable = true;
		pise.outOfBoundsKill = true;

    	music = game.add.audio('music');
    	music.play('', 0, 0.2, true);

    	bonus_s = game.add.audio('bonus');
		bonus_s.volume = 0.2;

		jump_s = game.add.audio('jump');
		jump_s.volume = 0.2;

		dead_s = game.add.audio('dead');
		dead_s.volume = 0.2;

		labelScore = game.add.text(80, 30, 'Score: 0', { font: '25px Arial', fill: '#fff', align: 'center' });
		labelScore.anchor.setTo(0.5, 0.5);
		labelMonedas = game.add.text(300, 30, 'Monedas: 0', { font: '25px Arial', fill: '#fff', align: 'center' });
		labelMonedas.anchor.setTo(0.5, 0.5);
		labelVidas = game.add.text(520, 30, 'Vidas: 3', { font: '25px Arial', fill: '#fff', align: 'center' });
		labelVidas.anchor.setTo(0.5, 0.5);

		this.iniciar_level();
	},
	update: function() {
		if(player.alive){ 
				game.physics.arcade.collide(player, ground);
				game.physics.arcade.collide(player, plataforma);
				game.physics.arcade.collide(enemys, plataforma);
				game.physics.arcade.overlap(player, bonus, this.tomar_bonus, null, this);
				game.physics.arcade.overlap(player, enemys, this.contra_enemys, null, this);
				game.physics.arcade.overlap(player, defensa, this.ataque_defensa, null, this);
		}
		if (player.body.y < game.camera.y + h/2) {
			this.move_screen_down();
			this.generar_level();				
		}
		if (update == 20) {
			update = 0;
			plataforma.forEachAlive(this.update_plataforma, this);
		    bonus.forEachAlive(this.update_bonus, this);
			enemys.forEachAlive(this.update_enemys, this);
			defensa.forEachAlive(this.update_defensa, this);
		}
		else 
			update += 1;

		this.player_movimientos();

		if(con == 3){
			con_defensa = false;
			con = 0;
		}
	},
	iniciar_level: function() {
		this.agregar_plataforma(h-100, 50);
		this.agregar_plataforma(h-100, 750);	
		this.agregar_plataforma(h-200, -200);
		this.agregar_plataforma(h-200, 500);
		this.agregar_plataforma(h-300, 100);
		this.agregar_plataforma(h-300, 800);
	},
	move_screen_down: function() {		
		var delta = game.camera.y + Math.floor(h/2) - player.body.y;
		game.camera.y -= delta;
		labelScore.y = game.camera.y + 18;
		labelVidas.y = game.camera.y + 18;
		labelMonedas.y = game.camera.y + 18;
		score = - Math.floor(game.camera.y/10);
		labelScore.text = 'Score: ' + score;
	},
	player_movimientos: function() {
		if (player.y > game.camera.y+h){
			music.stop();
			game.state.start('End');	
		}
		
		player.body.velocity.x = 0;

    	if (cursors.left.isDown){
        	player.body.velocity.x = -300;
        	player.angle = -5;
    	}
    	else if (cursors.right.isDown){
        	player.body.velocity.x = 300;
        	player.angle = 5;
    	}
    	else{
    		player.angle = 0;
    	}
        if (cursors.up.isDown && player.body.touching.down) {
	       player.body.velocity.y = -250; 
	       jump_s.play();
	    } 
	    if(con_defensa == true){
	    	this.emitter.x = player.x+player.width/2;
			this.emitter.y = player.y+player.height/2;
			this.emitter.start(true, 300, null, 8);
			this.emitter.on = true;
	    }
	    else if(con_defensa == false){
	    	this.emitter.on = false;
	    }
	},
	generar_level: function() {

	if (next_platform < -game.camera.y) {
			
			if (score < 500){
				var level = [1, 1, 2, 2, 3, 3, 2, 2, 1, 1];
			}
			else if (score < 750){
				var level = [1, 1, 2, 3, 2, 3, 3, 2, 2, 1];
				player.body.gravity.y = 160; }
			else if (score < 1000){
				var level = [1, 2, 3, 3, 2, 1, 2, 2, 3, 1];
				player.body.gravity.y = 170; }
			else if (score < 1250){
				var level = [1, 1, 2, 1, 2, 3, 3, 2, 2, 1];
				player.body.gravity.y = 180;}
			else if (score < 1500){
				var level = [1, 1, 2, 3, 2, 3, 3, 2, 2, 1];
				player.body.gravity.y = 200;}
			else{
				var level = [1, 1, 3, 2, 1, 1, 1, 2, 3, 3];
				player.body.gravity.y = 250;}
	
			var type = level[rand(level.length)];
			//alert(type);
			
			var y = game.camera.y+10;
			var x = rand(9);
			if(x == 0) x=10;
			
			next_platform += rand(10)+100;

			if (type == 1) {
				this.agregar_plataforma(y, x);
				this.agregar_plataforma1(y, x);
				this.agregar_bonus(y, x);	
			} 
			 else if (type == 2){
				this.agregar_plataforma(y, x);
				this.agregar_plataforma1(y, x);
				this.agregar_defensa(y, x);
				//this.agregar_bonus(y, x);
			} 			
			else if (type == 3){
				this.agregar_plataforma(y, x);
				this.agregar_plataforma1(y, x);
				this.agregar_enemigo(y, x);
				
			} /*
			else if (type == 4) {
				if (rand(3) > 0){ 
				this.agregar_plataforma(y, x);
				this.agregar_plataforma1(y, x);
				this.agregar_enemigo(y, x);
			}
			else{ 
				this.agregar_plataforma(y, x);
				this.agregar_plataforma1(y, x);
				this.agregar_defensa(y, x)
				this.agregar_enemigo(y, x);
			}
			}
			else if (type == 5)
				this.agregar_plataforma(y, x);
				this.agregar_plataforma1(y, x);
				this.agregar_bonus(y, x);
				this.agregar_enemigo(y, x);
			} */}
	},
	agregar_plataforma: function(y, x) {
		var platform = plataforma.getFirstExists(false);
		switch(x){
			case 10: x = 200; break;
			case 1: x = -250; break;
			case 2: x = -200; break;
			case 3: x = -150; break;
			case 4: x = -100; break;
			case 5: x = -50; break;
			case 6: x = 0; break;
			case 7: x = 50; break;
			case 8: x = 100; break;
			case 9: x = 150; break;
		}
		if (platform) {
			x = typeof x !== 'undefined' ? x : x;

			platform.reset(x, y);
			platform.anchor.setTo(0.5, 0.5);
			platform.body.velocity.x = 0;

			return platform;
		}
		else console.log("plat");

	},
	agregar_plataforma1: function(y, x) {
		var platform = plataforma.getFirstExists(false);
		switch(x){
			case 10: x = 900; break;
			case 1: x = 450; break;
			case 2: x = 500; break;
			case 3: x = 550; break;
			case 4: x = 600; break;
			case 5: x = 650; break;
			case 6: x = 700; break;
			case 7: x = 750; break;
			case 8: x = 800; break;
			case 9: x = 850; break;
		}
		if (platform) {
			x = typeof x !== 'undefined' ? x :  x;

			platform.reset(x, y);
			platform.anchor.setTo(0.5, 0.5);
			platform.body.velocity.x = 0;

			return platform;
		}
		else console.log("plat");

	},
	agregar_bonus: function(y, x) {
		var b = bonus.getFirstExists(false);

		if (b) {
			b.anchor.setTo(0.5, 0.5);
			switch(x){
				case 10: x = w/3; break;
				case 1: x = w/2; break;
				case 2: x = w/2-50; break;
				case 3: x = w/2+50; break;
				case 4: x = w/2-100; break;
				case 5: x = w/2+100; break;
				case 6: x = w/2-150; break;
				case 7: x = w/2+150; break;
				case 8: x = w/2-200; break;
				case 9: x = w/2+200; break;
			}
			b.reset(x, y-50);
		}
	},
	agregar_defensa: function(y, x) {
		var d = defensa.getFirstExists(false);

		if (d) {
			d.anchor.setTo(0.5, 0.5);
			switch(x){
				case 10: x = w/3; break;
				case 1: x = w/2; break;
				case 2: x = w/2-50; break;
				case 3: x = w/2+50; break;
				case 4: x = w/2-100; break;
				case 5: x = w/2+100; break;
				case 6: x = w/2-150; break;
				case 7: x = w/2+150; break;
				case 8: x = w/2-200; break;
				case 9: x = w/2+200; break;
			}
			d.reset(x, y-50);
		}
	},
	agregar_enemigo: function(y, x) {
		var e = enemys.getFirstExists(false);

		if (e) {
			e.anchor.setTo(0.5, 0.5);
			switch(x){
				case 9: x = w/3; break;
				case 4: x = w/2; break;
				case 3: x = w/2-50; break;
				case 5: x = w/2+50; break;
				case 8: x = w/2-100; break;
				case 7: x = w/2+100; break;
				case 10: x = w/2-150; break;
				case 6: x = w/2+150; break;
				case 1: x = w/2-200; break;
				case 2: x = w/2+200; break;
			}
			e.reset(x, y+50);
			dead_s.play();
			e.body.gravity.y = 5;
			e.body.velocity.x *= -1;

			if (e.body.velocity.x == 0 && e.body.touching.down) {
		    e.body.velocity.x = -70;	
			}
			if (e.alive == true && e.y >= h + e.height/2) {
				e.alive = false;
			}

		}
	},
	tomar_bonus: function(player, b) {
		b.kill();
		bonus_s.play();
		score += 10;
		labelScore.text = 'Score: ' + score;
		monedas += 1;
		labelMonedas.text = 'Monedas: ' + monedas;
		if(monedas == 5){
			vidas += 1;
			labelVidas.text = 'Vidas: ' + vidas;
			monedas = 0;
			labelMonedas.text = 'Monedas: ' + monedas;
		}
	},
	ataque_defensa: function(player, d){
		d.kill();
		bonus_s.play();
		this.emitter.x = player.x+player.width/2;
		this.emitter.y = player.y+player.height/2;
		this.emitter.start(true, 300, null, 8);
		this.emitter.on = true;
		con_defensa = true;
	},
	contra_enemys: function(player, e) {
			if(con_defensa == false) {
				if(vidas > 1) {
					e.kill();
					this.emitter.x = e.x+e.width/2;
		    		this.emitter.y = e.y+e.height/2;
		    		this.emitter.start(true, 300, null, 8);
					dead_s.play();
					vidas -=1;
					labelVidas.text = 'Vidas: ' + vidas;
				}
				else {
					if (player.alive){
						vidas -= 1;
						labelVidas.text = 'Vidas: ' + vidas;
						dead_s.play();
						player.alive = false;
						this.emitter.x = player.x+player.width/2;
		    			this.emitter.y = player.y+player.height/2;
		    			this.emitter.start(true, 300, null, 8);
						this.initPlayer();
						music.stop();
						game.state.start('End');
					}	
				}
			}
			else if(con_defensa == true) {
				e.kill();
				this.emitter.x = e.x+e.width/2;
		    	this.emitter.y = e.y+e.height/2;
		    	this.emitter.start(true, 300, null, 8);
				dead_s.play();
				score += 15;
				labelScore.text = 'Score: ' + score;
				con ++;
			}
	},
	initPlayer: function() {
		player.body.gravity.y = 0;
		player.x = 60;
		player.y = h*2/3-player.height/2-30;
		player.body.velocity.x = 0;
		player.body.velocity.y = 0;
		player.angle = 0;
	},
	update_plataforma: function(p) {
		if (p.x + p.width/2 >= w && p.body.velocity.x > 0) 
			p.body.velocity.x = -120;

		else if (p.x - p.width/2 <= 0 && p.body.velocity.x < 0) 
			p.body.velocity.x = 120;

		if (p.y - p.height > game.camera.y+h)
			p.kill();
	},
	update_bonus: function(b) {
		if (b.y - h.height > game.camera.y+h)
			b.kill();
	},
	update_enemys: function(e) {
		if (e.y - h.height > game.camera.y+h)
			e.kill();
	},
	update_defensa: function(d) {
		if (d.y - h.height > game.camera.y+h)
			d.kill();
	}/*
	render: function() {
		game.debug.cameraInfo(game.camera, 32, 32);
		 game.debug.spriteInfo(player, 302, 302);

	}*/
}