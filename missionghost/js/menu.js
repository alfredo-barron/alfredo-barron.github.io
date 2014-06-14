Game.Menu = function(game) {};

Game.Menu.prototype = {
	create: function() {
		cursors = game.input.keyboard.createCursorKeys();

		logo = game.add.sprite(w/2, -150, 'logo');
		logo.anchor.setTo(0.5, 0.5);
		game.add.tween(logo).to({ y: 150 }, 1000, Phaser.Easing.Bounce.Out).start();
		
		fanta = game.add.sprite(70, -200, 'enemy');
		fanta.anchor.setTo(0.5, 0.5);
		game.add.tween(fanta).to({ y: 150 }, 1000, Phaser.Easing.Bounce.Out).start();
		game.add.tween(fanta.scale).to({x:1.1, y:1.1 }, 300).to({x:1, y:1 }, 300).loop().start();
		
		label = game.add.text(w/2, h-50, 'presiona la tecla flecha \n arriba para comenzar', { font: '20px Courier', fill: '#fff' });
		label.anchor.setTo(0.5, 0.5);
		game.add.tween(label.scale).to({x:1.1, y:1.1 }, 300).to({x:1, y:1 }, 300).loop().start();
	},
	update: function() {
		if (cursors.up.isDown)
			game.state.start('Play');
	}
};