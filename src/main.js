var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var sprite1, sprite2, revoConstraint;
function preload() {
  game.stage.backgroundColor = "#ffffff";
  game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
  game.scale.setResizeCallback(function() {
    game.scale.setMaximum();
  });
  game.scale.setMaximum();

  game.physics.startSystem(Phaser.Physics.P2JS);

  game.load.image('bark', 'images/bark3.png');
  game.load.image('leaf', 'images/flower3.png');
  game.load.image('flower', 'images/flower3.png');
}

function create() {
  //  Create our collision groups. One for the player, one for the pandas
  var treeCollisionGroup = game.physics.p2.createCollisionGroup();
  var otherCollisionGroup = game.physics.p2.createCollisionGroup();

  game.physics.p2.updateBoundsCollisionGroup();
  game.physics.p2.gravity.y = 100;
  game.physics.p2.restitution = 0.6;

  cursors = game.input.keyboard.createCursorKeys();

  var grower = treeGrower(game, createRandomGenes(), "bark", "leaf", "flower", treeCollisionGroup, [otherCollisionGroup]);
  grower.constructFullTree([300, 400]);
  grower.constructFullTree([700, 400]);
}

function update() {

  if(cursors.up.isDown) {

  }
  if(cursors.down.isDown) {
    sprite1.scale.setTo(10,1);
    sprite2.scale.setTo(10,1);

    revoConstraint.pivotA[0] = -2;
    revoConstraint.pivotB[0] = -2;
    console.log(revoConstraint);
  }

}
