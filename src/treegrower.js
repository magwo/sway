

function treeGrower(game, barkTex, leafTex, flowerTex, collisionGroup, collidesWith) {
  var grower = {};

  function getEndpoint(sprite) {
    return [0.0, sprite.body.width];
  }

  function createPart(parent, position, texture, angle, startLength, startWidth, isNotBranch) {
    position = position || [parent.sprite.body.x, parent.sprite.body.y];
    var sprite = game.add.sprite(position[0], position[1], texture);
    //sprite.rotation = angle;
    sprite.width = startLength;
    sprite.height = startWidth; // TODO: Set starting height to some fraction of parent height


    game.physics.p2.enable(sprite);
    sprite.body.angularDamping = 0.1;
    sprite.body.damping = 0.2;
    sprite.body.rotation = angle;

    sprite.body.setCollisionGroup(collisionGroup);
    sprite.body.collides(collidesWith);
    sprite.body.collideWorldBounds = true;

    if(parent) {
      // TODO: Position sprite at end of parent

      sprite.body.mass = parent.sprite.body.mass * (sprite.width * sprite.height) / (parent.sprite.width * parent.sprite.height);
      if(isNotBranch) {
        // TODO: Make non-physical object
        sprite.body.mass /= 20.0;
        sprite.body.collideWorldBounds = false;
      }
      console.log("WIdth", sprite.width);
      var revoConstraint = game.physics.p2.createRevoluteConstraint(parent.sprite, [-parent.sprite.width*0.97/2, 0], sprite, [sprite.width*0.97/2, 0]);
      var gearConstraint = game.physics.p2.createGearConstraint(parent.sprite, sprite, angle);
      gearConstraint.setStiffness(1000);
    } else {
      // This is a root node, use position
      console.log(sprite.body);
      //sprite.body.static = true;
    }

    var part = {
      sprite: sprite,
      revoConstraint: revoConstraint,
      gearConstraint: gearConstraint,
      children: [],
    }
    if(parent) {
      parent.children.push(part);
    }
    return part;
  }


  grower.constructFullTree = function(rootPos) {

    // TODO: Flowers and leaves could be non-physical

    function recursiveBranch(part, levels) {
      if(levels <= 0) {
        return;
      }
      var numChildren = (levels === 1 ? 1 : Math.round(1.3 + Math.random() * 4));
      for(var i=0; i<numChildren; i++) {
        var angle = -0.6 + 1.2 * Math.random();
        var length = part.sprite.width / 1.6;
        var width = part.sprite.height / 1.3;
        var isNotBranch = false;

        var newLevel = levels;
        if(levels === 1 || Math.random() < 0.1) {
          // Leaf or flower
          var texture = Math.random() < 0.1 ? flowerTex : leafTex;
          width *= 2;
          length = width * 1.2;
          newLevels = 0;
          isNotBranch = true;
        } else {
          var texture =  barkTex;
          newLevels = levels - 1;
        }
        var newPart = createPart(part, null, texture, angle, length, width, isNotBranch);
        recursiveBranch(newPart, newLevels);
      }
    }

    var root = createPart(null, rootPos, barkTex, 90, 200, 20, false)
    recursiveBranch(root, 5);
  }





  // TODO: Implement continuous grower
  return grower;
}
