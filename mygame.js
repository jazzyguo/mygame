function preload() {

    game.load.image('sky', 'assets/sky.png');
    game.load.image('ledge', 'assets/platform.png');
    game.load.image('ground', 'assets/ground.png');
    game.load.image('floor', 'assets/floor.png');
    game.load.spritesheet('Villain', 'assets/Villain_spritesheet.png', 64, 96)
    game.load.spritesheet('Fireball', 'assets/fireball.png', 32, 32);
}

var bg;
var ground;
var floor;
var villain;
var platforms;
var cursors;

var spacebar,
    zKey, xKey,
    qKey, wKey,
    dKey;

var canFireL = true;
var canFireR = true;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    bg = game.add.tileSprite(0, 0, 1300, game.cache.getImage('sky').height, 'sky');
    ground = game.add.tileSprite(0, game.world.height - 64, 1300, game.cache.getImage('ground').height, 'ground');
    ground.scale.setTo(3, 3);
    floor = game.add.sprite(0, game.world.height - 64, 'floor');
    game.physics.arcade.enable(floor);
    floor.scale.setTo(3, 3);
    floor.body.immovable = true;

    platforms = game.add.group();
    platforms.enableBody = true;
    var ledge = platforms.create(0, 400, 'ledge');
    ledge.body.immovable = true;
    ledge = platforms.create(800, 400, 'ledge');
    ledge.body.immovable = true;

    importAPSprite(game, 'assets/Villain_spritesheet.png', 'assets/Villain_json.json');

    cursors = game.input.keyboard.createCursorKeys();
    spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    zKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    xKey = game.input.keyboard.addKey(Phaser.Keyboard.X);
    qKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
}

function update() {
    bg.tilePosition.x -= 1;
    ground.tilePosition.x -= 1;
    platforms.children.forEach(function(platform) {
        platform.position.x -= 1;
        if (platform.x < game.camera.x - 400) {
            platform.destroy();
            var ledge = platforms.create(game.width, 400, 'ledge');
            ledge.body.immovable = true;
        }
    });
    game.physics.arcade.collide(villain, platforms);
    game.physics.arcade.collide(villain, floor);
    villain.body.velocity.x = 0;
    if (cursors.left.isDown) {
        villain.animations.play('WALKING_LEFT', 30, false);
        villain.body.velocity.x = -200;
        if (spacebar.isDown && villain.body.touching.down) {
            villain.body.velocity.y = -500;
        }
        villain.animations.currentAnim.onComplete.add(function() {
            villain.animations.play('default', 10, true);
        }, this);
    } else if (cursors.right.isDown) {
        villain.animations.play('walk_right', 30, false);
        villain.body.velocity.x = 200;
        if (spacebar.isDown && villain.body.touching.down) {
            villain.body.velocity.y = -500;
        }
        villain.animations.currentAnim.onComplete.add(function() {
            villain.animations.play('default', 10, true);
        }, this);
    }
    if (zKey.isDown) {
        villain.animations.play('ATTACKING_LEFT', 10, false);
        game.time.events.add(1100, function() {
            fire('left');
        }, this);
        villain.animations.currentAnim.onComplete.add(function() {
            villain.animations.play('default', 10, true);
        }, this);
    }
    if (xKey.isDown) {
        villain.animations.play('ATTACKING_RIGHT', 10, false);
        game.time.events.add(1100, function() {
            fire('right');
        }, this);
        villain.animations.currentAnim.onComplete.add(function() {
            villain.animations.play('default', 10, true);
        }, this);
    }
    if (qKey.isDown) {
        villain.animations.play('DAMAGED_LEFT', 10, false);
        villain.animations.currentAnim.onComplete.add(function() {
            villain.animations.play('default', 10, true);
        }, this);
    } else if (wKey.isDown) {
        villain.animations.play('DAMAGED_RIGHT', 10, false);
        villain.animations.currentAnim.onComplete.add(function() {
            villain.animations.play('default', 10, true);
        }, this);
    }
    if (dKey.isDown) {
        villain.animations.play('DYING', 10, false);
        villain.animations.currentAnim.onComplete.add(function() {
            game.time.events.add(500, function() {
                villain.animations.play('default', 10, true);
            }, this);
        }, this);
    }
    if(spacebar.isDown && cursors.right.isDown && !villain.body.touching.down){
      villain.animations.play('JUMPING_RIGHT', 10, false);
      villain.animations.currentAnim.onComplete.add(function() {
          villain.animations.play('default', 10, true);
      }, this);
    }
    if(spacebar.isDown && cursors.left.isDown && !villain.body.touching.down){
      villain.animations.play('JUMPING_LEFT', 10, false);
      villain.animations.currentAnim.onComplete.add(function() {
          villain.animations.play('default', 10, true);
      }, this);
    }
}

function makeFireball(direction) {
    var fireball = game.add.sprite(villain.x, villain.y + 25, 'Fireball');
    game.physics.arcade.enable(fireball);
    fireball.scale.setTo(1.5, 1.5);
    fireball.animations.add('default', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 10, true);
    fireball.animations.add('right', [17, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32], 10, true);
    fireball.checkWorldBounds = true;
    fireball.outOfBoundsKill = true;
    if (direction == 'right') {
        fireball.body.velocity.x = 250;
        fireball.animations.play('right', 10, false, true);
    } else if (direction == 'left') {
        fireball.body.velocity.x = -250;
        fireball.animations.play('default', 10, false, true);
    }
}

function fire(direction) {
    if (direction == 'left') {
        if (canFireL) {
            canFireL = false;
            makeFireball('left');
            game.time.events.add(2100, function() {
                canFireL = true
            }, game);
        }
    } else if (direction == 'right') {
        if (canFireR) {
            canFireR = false;
            makeFireball('right');
            game.time.events.add(2100, function() {
                canFireR = true
            }, game);
        }
    }
}
