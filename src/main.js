var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var sprite1, sprite2, revoConstraint;
function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
  game.scale.setResizeCallback(function() {
    game.scale.setMaximum();
  });
  game.scale.setMaximum();

  game.physics.startSystem(Phaser.Physics.P2JS);

  game.load.image('whitesquare', 'images/white.png');
}

function create() {

  //  Add 2 sprites which we'll join with a spring
  sprite1 = game.add.sprite(400, 300, 'whitesquare');
  sprite2 = game.add.sprite(400+5*16/2, 300, 'whitesquare');

  //  Create our collision groups. One for the player, one for the pandas
  var treeCollisionGroup = game.physics.p2.createCollisionGroup();
  var otherCollisionGroup = game.physics.p2.createCollisionGroup();

  game.physics.p2.updateBoundsCollisionGroup();

  sprite1.scale.setTo(5,0.5);
  sprite2.scale.setTo(5,0.5);

  game.physics.p2.enable([sprite1, sprite2]);

  sprite1.body.setCollisionGroup(treeCollisionGroup);
  sprite2.body.setCollisionGroup(treeCollisionGroup);

  sprite1.body.collides([otherCollisionGroup]);
  sprite2.body.collides([otherCollisionGroup]);

  sprite1.body.collideWorldBounds = true;
  sprite2.body.collideWorldBounds = true;

  sprite1.body.angularDamping = 0.1;
  sprite2.body.angularDamping = 0.1;

  sprite1.body.damping = 0.2;
  sprite2.body.damping = 0.2;


  revoConstraint = game.physics.p2.createRevoluteConstraint(sprite1, [5*16/4, 0], sprite2, [5*16/4, 0]);
  var gearConstraint = game.physics.p2.createGearConstraint(sprite1, sprite2, Math.PI);
  gearConstraint.setStiffness(30);
  gearConstraint.setMaxTorque(100);
  sprite1.body.velocity.y = 1000;

  game.physics.p2.gravity.y = 100;
  game.physics.p2.restitution = 0.6;

  cursors = game.input.keyboard.createCursorKeys();
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
