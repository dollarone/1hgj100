var PlatfomerGame = PlatformerGame || {};

//title screen
PlatformerGame.Game = function(){};

PlatformerGame.Game.prototype = {
  create: function() {

    this.player;
    this.platforms;
    this.cursors;
    this.stars;

    //  We're going to be using physics, so enable the Arcade Physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    this.game.add.sprite(0, 0, 'sky');

    this.stalks = this.game.add.group();
    //  The platforms group contains the ground and the 2 ledges we can jump on
    this.platforms = this.game.add.group();

    //  We will enable physics for any object that is created in this group
    this.platforms.enableBody = true;

    // Here we create the ground.
    this.ground = this.platforms.create(20, this.game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    this.ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    this.ground.body.immovable = true;

    //  Now let's create two ledges
    this.ledge = this.platforms.create(400, 400, 'ground');
    this.ledge.body.immovable = true;

    this.ledge = this.platforms.create(-150, 350, 'ground');
    this.ledge.body.immovable = true;

    // The player and its settings
    this.player = this.game.add.sprite(132, this.game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    this.game.physics.arcade.enable(this.player);

    //  Player physics properties. Give the little guy a slight bounce.
    this.player.body.bounce.y = 0.02;
    this.player.body.gravity.y = 700;
    this.player.body.collideWorldBounds = false;
    this.player.anchor.setTo(0.5);
    this.player.scale.x *= -1; // we only run right
    this.player.animations.add('run', [12,13,14,15,0,1,2,3,4,5,6,7,8,9,10,11], 10, true);



    //  The score
    scoreText = this.game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    score = 0;


    //  Our controls.
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jump = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.rkey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
    this.jump.onDown.add(this.actionOnClick, this);
    this.rkey.onDown.add(this.reset, this);
    

    this.game.camera.follow(this.player);
    this.playerSpeed = 0;
    this.player.animations.play('run');
    this.scrollSpeed = 3;

    this.button2 = this.game.add.button(570, 50, 'button2', this.reset, this, 0, 0, 1, 0);
    this.button = this.game.add.button(570, 500, 'button', this.actionOnClick, this, 0, 0, 1, 0);
    //this.button.fixedToCamera = true;
    this.player.checkWorldBounds = true;
    this.player.events.onOutOfBounds.add(this.playerOut, this);
    this.gameOver = false;
    this.step = 0;
    this.createStartTerrain(450, 400, 11);
    this.createStartTerrain(680, 300, 9);
    this.createStartTerrain(920, 350, 9);
  },

  goingUp: function() {
    return this.player.body.velocity.y > 0;

  },

  update: function() {
    this.step ++;
    if (!this.gameOver) {
        score += 1;
        scoreText.text = 'Score: ' + score;
    }
    this.platforms.x -= this.scrollSpeed;
    this.stalks.x -= this.scrollSpeed;

    //  Collide the player and the stars with the platforms
    this.game.physics.arcade.collide(this.player, this.platforms, null, this.goingUp, this);


    //  Reset the players velocity (movement)
    this.player.body.velocity.x = this.playerSpeed;

    if (this.step % 3 == 0) {
        //this.playerSpeed++;
        this.scrollSpeed+= 0.01;
    }

    if (this.step % 16 == 0) {
       this.createRandomTerrain();
    }
  },
  reset : function() {
    this.state.start('Game');   
  },
  actionOnClick : function(player) {
    if (this.player.body.touching.down) {
        this.player.body.velocity.y = -500;
    }
  },
  createStartTerrain : function(x, y, size) {
    
    var offsetX = x;
    var offsetY = y;
    var size = size
    var colour = this.game.rnd.integerInRange(0, 1);

    this.ledge = this.platforms.create(500 + score*3 + offsetX - 16, 4 + offsetY, 'tiles');
    this.ledge.body.immovable = true;
    this.ledge.frame = 9 + colour*3;
    for (var a = 0; a < size; a++) {

        this.ledge = this.platforms.create(500 + score*3 + offsetX + a*16, 4 + offsetY, 'tiles');
        this.ledge.body.immovable = true;
        this.ledge.frame = 10 + colour*3;
    }
    
    for (var a = 4 + offsetY + 16; a < this.game.height; a+=16) {
        var stalk = this.stalks.create(500 + score*3 + offsetX + 16*size/2-8, a, 'tiles');
        stalk.frame = 29;

    }
    
    this.ledge = this.platforms.create(500 + score*3 + offsetX + 16*size, 4 + offsetY, 'tiles');
    this.ledge.body.immovable = true;
    this.ledge.frame = 11 + colour*3;
 
    
  },


  createRandomTerrain : function() {
    
    var offsetX = (this.scrollSpeed*this.scrollSpeed*100) + this.game.rnd.integerInRange(1, 200);
    var offsetY = this.game.rnd.integerInRange(1, 620);
    var size = this.game.rnd.integerInRange(3, 13);
    var colour = this.game.rnd.integerInRange(0, 1);

    this.ledge = this.platforms.create(500 + score*3 + offsetX - 16, 4 + offsetY, 'tiles');
    this.ledge.body.immovable = true;
    this.ledge.frame = 9 + colour*3;
    for (var a = 0; a < size; a++) {

        this.ledge = this.platforms.create(500 + score*3 + offsetX + a*16, 4 + offsetY, 'tiles');
        this.ledge.body.immovable = true;
        this.ledge.frame = 10 + colour*3;
    }
    
    for (var a = 4 + offsetY + 16; a < this.game.height; a+=16) {
        var stalk = this.stalks.create(500 + score*3 + offsetX + 16*size/2-8, a, 'tiles');
        stalk.frame = 29;

    }
    
    this.ledge = this.platforms.create(500 + score*3 + offsetX + 16*size, 4 + offsetY, 'tiles');
    this.ledge.body.immovable = true;
    this.ledge.frame = 11 + colour*3;
 
    
  },

  playerOut : function() {
    if (this.player.y > 0) {
        //this.scrollSpeed = 0;
        this.gameOver = true;
        scoreText.text = 'Score: ' + score + "\n\n\n\n\n\n\n\n\n\n                                        GAME OVER";
        promptForNameAndSubmitHighscore(score);
    }
  }
};
