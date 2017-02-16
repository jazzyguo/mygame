function importAPSprite(game, sheetPath, animPath) {
  villain = game.add.sprite(game.world.centerX, 585, 'Villain');
  game.physics.arcade.enable(villain);
  villain.body.bounce.y = 0.2;
  villain.body.gravity.y = 300;
  villain.body.collideWorldBounds = true;
    $.getJSON(animPath, function(json) {
        villainData = json.frameData;
        game.load.spritesheet(json.name, sheetPath, json.width, json.height);
        importAnimations(game, villain, json.frameData);
      });
}

//extracts all animations using the json
function importAnimations(game, sprite, json){
  var state = json[0].state; //current animation state being read
  var frames = new Array(); //frames of current state
  frames.push(json[0].frame);
  for (var i = 1; i < json.length; i++) {
      if (json[i].state == state) {
          frames.push(json.indexOf(json[i]));
      } else {
        //add current array of frames, and start a new animation state
          sprite.animations.add(state, frames, 10, true);
          state = json[i].state;
          while (frames.length > 0) {
              frames.pop();
          }
          frames.push(json.indexOf(json[i]));
      }
      sprite.animations.add(state, frames, 10, true);
  }
  sprite.animations.play('default');
}
