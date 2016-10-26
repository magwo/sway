var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update });

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


  var constraint = game.physics.p2.createLockConstraint(sprite1, sprite2, [5*16/2, 0], 0, 100);

  sprite1.body.velocity.y = 1000;

  game.physics.p2.gravity.y = 100;
  game.physics.p2.restitution = 0.8;

  cursors = game.input.keyboard.createCursorKeys();
}

function update() {
}
