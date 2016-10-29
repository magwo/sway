

function treeGrower(game, genes, barkTex, leafTex, flowerTex, collisionGroup, collidesWith) {
  var grower = {};

  function getEndpoint(sprite) {
    return [0.0, sprite.body.width];
  }

  function createPart(parent, position, texture, angle, startLength, startWidth, isNotBranch) {
    position = position || [parent.sprite.body.x, parent.sprite.body.y];
    var sprite = game.add.sprite(position[0], position[1], texture);
    //sprite.rotation = angle;
    sprite.width = startLength;
    sprite.height = startWidth;

    if(isNotBranch) {
      parent.sprite.addChild(sprite);
      sprite.width = sprite.width / parent.sprite.scale.x;
      sprite.height = sprite.height / parent.sprite.scale.y;
      sprite.x = -parent.sprite.width / 2 - sprite.width;
      sprite.y = -parent.sprite.height / 2 - sprite.height/2;
    } else {
      game.physics.p2.enable(sprite);

      sprite.body.angularDamping = 0.1;
      sprite.body.damping = 0.2;
      sprite.body.rotation = angle;
      sprite.body.setCollisionGroup(collisionGroup);
      sprite.body.collides(collidesWith);
      sprite.body.collideWorldBounds = true;

      if(parent) {
        // TODO: Position sprite at end of parent (don't make simulation explode)
        sprite.body.mass = parent.sprite.body.mass * (sprite.width * sprite.height) / (parent.sprite.width * parent.sprite.height);
        var revoConstraint = game.physics.p2.createRevoluteConstraint(parent.sprite, [-parent.sprite.width*0.98/2, 0], sprite, [sprite.width*0.98/2, 0]);
        var gearConstraint = game.physics.p2.createGearConstraint(parent.sprite, sprite, angle);
        gearConstraint.setStiffness(1000);
      } else {
        // TODO: This is a root node, fixate in place
        console.log("Root", sprite);
        //sprite.body.static = true;
      }
    }



    var part = {
      sprite: sprite,
      revoConstraint: revoConstraint,
      gearConstraint: gearConstraint,
      isNotBranch: isNotBranch,
      children: [],
    }
    if(parent) {
      parent.children.push(part);
    }
    return part;
  }


  grower.constructFullTree = function(rootPos) {

    // TODO: Flowers and leaves could be non-physical

    var barkTint = Phaser.Color.getColor(genes.barkColor[0], genes.barkColor[1], genes.barkColor[2]);
    var leafTint = Phaser.Color.getColor(genes.leafColor[0], genes.leafColor[1], genes.leafColor[2]);
    var flowerTint = Phaser.Color.getColor(genes.flowerColor[0], genes.flowerColor[1], genes.flowerColor[2]);

    function recursiveBranch(part, levels) {
      if(levels <= 0) {
        return;
      }
      var numChildren = (levels === 1 ? 1 : Math.round(1.1 + Math.random() * 3));
      for(var i=0; i<numChildren; i++) {
        var angle = -0.6 + 1.2 * Math.random();
        var length = part.sprite.width / 1.6;
        var width = part.sprite.height / 1.3;
        var isNotBranch = false;

        var newLevel = levels;
        if(levels === 1 || Math.random() < 0.1) {
          // Leaf or flower
          var texture = Math.random() < 0.1 ? flowerTex : leafTex;
          width = 30;
          length = width;
          newLevels = 0;
          isNotBranch = true;
        } else {
          var texture =  barkTex;
          newLevels = levels - 1;
        }
        var newPart = createPart(part, null, texture, angle, length, width, isNotBranch);
        newPart.sprite.tint = isNotBranch ? (texture === flowerTex ? flowerTint : leafTint) : barkTint;
        recursiveBranch(newPart, newLevels);
      }
    }

    function recursiveBringToTop(part) {
      if(part.isNotBranch) {
        part.sprite.bringToTop();
      } else {
        part.sprite.sendToBack();
      }
      for(var i=0; i<part.children.length; i++) {
        recursiveBringToTop(part.children[i]);
      }
    }

    var root = createPart(null, rootPos, barkTex, 90, 200, 20, false)
    root.sprite.tint = barkTint;
    recursiveBranch(root, 6);
    recursiveBringToTop(root);

    // TODO: Put leaves, flowers and children on top
  }





  // TODO: Implement continuous grower
  return grower;
}
