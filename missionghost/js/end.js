Game.End = function (game) { };

Game.End.prototype = {

	create: function () {
	    game.add.text(Math.floor(w/2)+0.5, 80, 'Game Over', { font: '80px Arial', fill: '#fff' })
			.anchor.setTo(0.5, 0.5);

	    game.add.text(Math.floor(w/2)+0.5, 240, 'Score: '+score, { font: '50px Arial', fill: '#fff', align: 'center' })
			.anchor.setTo(0.5, 0.5);

		fanta = game.add.sprite(Math.floor(w/2)+0.5, 250, 'enemy');
		fanta.anchor.setTo(0.5, 0.5);
		game.add.tween(fanta).to({ y: 150 }, 1000, Phaser.Easing.Bounce.Out).start();
		game.add.tween(fanta.scale).to({x:1.1, y:1.1 }, 300).to({x:1, y:1 }, 300).loop().start();
	}
};