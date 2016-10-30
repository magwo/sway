var game = new Phaser.Game("100", "100", Phaser.AUTO, '', { preload: preload, create: create, update: update });
var sprite1, sprite2, revoConstraint;
function preload() {
  game.stage.backgroundColor = "#ffffff";
  game.world.setBounds(-1000, -1000, 2000, 2000);
  //game.camera.setBoundsToWorld();
  //game.camera.setSize(1000, 400);

  game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
  function resetView() {
    game.scale.setMaximum();
    game.camera.x = -game.width/2;
    game.camera.y = -game.height;
  };
  game.scale.setResizeCallback(function() { resetView() });

  resetView();

  game.physics.startSystem(Phaser.Physics.P2JS);

  game.load.image('bark', 'images/bark3.png');
  game.load.image('leaf', 'images/flower3.png');
  game.load.image('flower', 'images/flower4.png');
  game.load.image('white', 'images/bark.png');
}

function create() {
  //  Create our collision groups. One for the player, one for the pandas
  var treeCollisionGroup = game.physics.p2.createCollisionGroup();
  var otherCollisionGroup = game.physics.p2.createCollisionGroup();

  game.physics.p2.updateBoundsCollisionGroup();
  game.physics.p2.gravity.y = 100;
  game.physics.p2.restitution = 0.6;

  cursors = game.input.keyboard.createCursorKeys();

  var ground = game.add.sprite(0, 0, "white");
  game.physics.p2.enable(ground);
  ground.width = 2000;
  ground.height = 100;
  ground.body.y = 0;
  ground.body.x = 0;
  ground.body.motionState = p2.Body.KINEMATIC;

  var grower = treeGrower(game, createRandomGenes(), "bark", "leaf", "flower", treeCollisionGroup, [otherCollisionGroup]);
  grower.constructFullTree(ground, -400);
  grower.constructFullTree(ground, 0);
  grower.constructFullTree(ground, 400);
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
