var game = new Phaser.Game("100", "100", Phaser.AUTO, '', { preload: preload, create: create, update: update });
var trees, treeDisplayGroup, treeCollisionGroup, otherCollisionGroup, treeDestroyer, wind;
function preload() {
  game.stage.backgroundColor = "#ffffff";
  game.world.setBounds(-1000, -1000, 2000, 2000);
  //game.camera.setBoundsToWorld();
  //game.camera.setSize(1000, 400);

  game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
  function resetView() {
    game.scale.setMaximum();
    game.camera.x = -game.width/2;
    game.camera.y = -game.height - 100;
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
  treeCollisionGroup = game.physics.p2.createCollisionGroup();
  otherCollisionGroup = game.physics.p2.createCollisionGroup();

  game.input.mouse.capture = true;

  game.physics.p2.updateBoundsCollisionGroup();
  game.physics.p2.gravity.y = 100;
  game.physics.p2.restitution = 0.6;

  cursors = game.input.keyboard.createCursorKeys();

  ground = game.add.sprite(0, 0, "white");
  game.physics.p2.enable(ground);
  ground.width = 2000;
  ground.height = 300;
  ground.body.y = 140;
  ground.body.x = 0;
  ground.body.motionState = p2.Body.KINEMATIC;
  ground.body.static = true;
  ground.body.moving = false;


  treeDisplayGroup = game.add.group();
  trees = [];

  treeDestroyer = treeDestroyer(treeDisplayGroup);
  wind = windBlower(game);

  function getHashValue(key) {
    var matches = location.hash.match(new RegExp(key+'=([^&]*)'));
    return matches ? matches[1] : null;
  }

  var pageLoadSeed = parseInt(getHashValue("seed")) || null;
  recreateTrees(pageLoadSeed);

  game.input.onTap.add(recreateTrees);
  window.onpopstate = function(popevent) {
    if(popevent.state && typeof(popevent.state.seed) === 'number') {
      recreateTrees(popevent.state.seed);
    }
  }
}

function recreateTrees(seed) {
  trees.forEach(function(tree) {
    treeDestroyer.destroyTree(tree);
  });

  if(history && typeof(seed) !== 'number') {
    var seed = Math.round(Math.random() * 10000000);
    history.pushState({seed: seed}, "page 2", "#seed=" + seed);
  }
  var grower = treeGrower(game, createRandomGenes(seed), "bark", "leaf", "flower", treeCollisionGroup, [otherCollisionGroup], treeDisplayGroup);
  trees.push(grower.constructFullTree(ground, 0));

  if(window.innerWidth > 500) {
    trees.push(grower.constructFullTree(ground, -400));
    trees.push(grower.constructFullTree(ground, 400));
  }
}


function update() {
  wind.updateWind(game.time.totalElapsedSeconds());
}
