Game.Menu = function (game) { };

Game.Menu.prototype = {

	create: function() {
		this.cursor = this.game.input.keyboard.createCursorKeys();

		var logo = game.add.sprite(w/2, -150, 'menu');
		logo.anchor.setTo(0.5, 0.5);
		game.add.tween(logo).to({ y: h/2-20 }, 1000, Phaser.Easing.Bounce.Out).start();

		var label = game.add.text(w/2, h-60, 'press the UP arrow key to start', { font: '25px Arial', fill: '#fff' });
		label.anchor.setTo(0.5, 0.5);
		label.alpha = 0;
		game.add.tween(label).delay(500).to({ alpha: 1}, 500).start();
		game.add.tween(label).to({y: h-70}, 500).to({y: h-50}, 500).loop().start();

		this.sound_toggle = this.game.add.button(w-50, 50, 'sound', this.toggle_sound, this);
		this.sound_toggle.anchor.setTo(1, 0);
		this.sound_toggle.alpha = 0;
		game.add.tween(this.sound_toggle).delay(500).to({ alpha: 1}, 500).start();
	},

	update: function() {
		if (this.cursor.up.isDown)
			this.game.state.start('Play');		
	},

	toggle_sound: function() {
		if (this.sound_toggle.frame == 0) {
			this.sound_toggle.frame = 1;
			sound = false;
		}
		else {
			this.sound_toggle.frame = 0;
			sound = true;			
		}
	}
};