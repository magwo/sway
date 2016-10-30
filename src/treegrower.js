

function treeGrower(game, genes, barkTex, leafTex, flowerTex, collisionGroup, collidesWith, treeDisplayGroup) {
  var grower = {};

  function getEndpoint(sprite) {
    return [0.0, sprite.body.width];
  }

  function createPart(parent, position, texture, angle, startLength, startWidth, isNotBranch) {
    position = position || [parent.sprite.body.x, parent.sprite.body.y];
    var sprite = treeDisplayGroup.create(position[0], position[1], texture);
    //sprite.rotation = angle;
    sprite.width = startLength;
    sprite.height = startWidth;

    if(isNotBranch) {
      parent.sprite.addChild(sprite);
      sprite.width = sprite.width / parent.sprite.scale.x;
      sprite.height = sprite.height / parent.sprite.scale.y;
      sprite.x = -(parent.sprite.width/parent.sprite.scale.x) / 2 - sprite.width*0.8;
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
        sprite.body.rotation = parent.sprite.body.rotation + angle;
        sprite.body.mass = parent.sprite.body.mass * (sprite.width * sprite.height) / (parent.sprite.width * parent.sprite.height);
        var revoConstraint = game.physics.p2.createRevoluteConstraint(parent.sprite, [-parent.sprite.width*0.96/2, 0], sprite, [sprite.width*0.96/2, 0]);
        var gearConstraint = game.physics.p2.createGearConstraint(parent.sprite, sprite, angle);
        //revoConstraint.setStiffness(300000000000000);
        revoConstraint.stiffness = 3000000000000;
        gearConstraint.setStiffness(30000 * sprite.body.mass * genes.stiffness);
      } else {
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


  grower.constructFullTree = function(ground, xPos) {

    var barkTint = Phaser.Color.getColor(genes.barkColor[0], genes.barkColor[1], genes.barkColor[2]);
    var leafTint = Phaser.Color.getColor(genes.leafColor[0], genes.leafColor[1], genes.leafColor[2]);
    var flowerTint = Phaser.Color.getColor(genes.flowerColor[0], genes.flowerColor[1], genes.flowerColor[2]);

    function recursiveCreateBranches(part, levels) {
      if(levels <= 0) {
        return;
      }
      var numChildren = (levels === 1 ? 1 : Math.round(1.1 + Math.random() * 2.5));
      for(var i=0; i<numChildren; i++) {
        var angle = (-0.6 + 1.2 * Math.random()) * genes.crookedness;
        var length = part.sprite.width / 1.6;
        var width = part.sprite.height / 1.3;
        var texture = barkTex;
        newLevels = ((Math.random() > 0.5 && levels > 4) ? levels - 3 : levels - 1);
        var newPart = createPart(part, null, texture, angle, length, width, false);
        newPart.sprite.tint = barkTint;
        recursiveCreateBranches(newPart, newLevels);
      }
    }

    function recursiveAddLeavesAndFlowers(part) {
      var numChildren = part.children.length;
      if(numChildren === 0 || Math.random() < 0.1) {
        // Leaf or flower
        var angle = (-0.6 + 1.2 * Math.random()) * genes.crookedness;
        var isFlower = Math.random() < genes.flowerFrequency;
        var texture = isFlower ? flowerTex : leafTex;
        var width = isFlower ? genes.flowerSize : genes.leafSize;
        var length = width;
        var newPart = createPart(part, null, texture, angle, length, width, true);
        newPart.sprite.tint = isFlower ? flowerTint : leafTint;
      }

      for(var i=0; i<numChildren; i++) {
        recursiveAddLeavesAndFlowers(part.children[i]);
      }
    }

    function recursiveBringToTop(part) {
      for(var i=0; i<part.children.length; i++) {
        if(part.children[i].isNotBranch) {
          part.children[i].sprite.bringToTop();
        } else {
          part.children[i].sprite.sendToBack();
        }
      }

      for(var i=0; i<part.children.length; i++) {
          recursiveBringToTop(part.children[i]);
      }

    }

    var rootAngle = Math.PI / 2 + (-0.2 + 0.4 * Math.random()) * genes.crookedness;
    var root = createPart(null, [ground.x + xPos, ground.body.y - ground.height/2], barkTex, rootAngle, 240, 24 * genes.slimness, false);

    var revoConstraint = game.physics.p2.createRevoluteConstraint(ground, [xPos, -ground.height/2], root.sprite, [root.sprite.width*0.96/2, 0]);
    var gearConstraint = game.physics.p2.createGearConstraint(ground, root.sprite, rootAngle);

    root.sprite.tint = barkTint;
    recursiveCreateBranches(root, 6);
    root.revoConstraint = revoConstraint;
    root.gearConstraint = gearConstraint;
    recursiveAddLeavesAndFlowers(root);
    recursiveBringToTop(root);
    return root;
  }


  // TODO: Implement continuous grower
  return grower;
}

function treeDestroyer(treeDisplayGroup) {
  var destroyer = {};


  function delayedFade(part) {
    game.add.tween(part.sprite).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None, true);
    for(var i=0; i<part.children.length; i++) {
      delayedFade(part.children[i]);
    }
  }

  function delayedRemoval(part) {
    treeDisplayGroup.removeChild(part.sprite);
    part.sprite.pendingDestroy = true;
    if(part.sprite.body) {
      part.sprite.body.destroy();
    }
    for(var i=0; i<part.children.length; i++) {
      delayedRemoval(part.children[i]);
    }
  }

  function destroyTreeRecursive(part) {
    for(var i=0; i<part.children.length; i++) {
      destroyTreeRecursive(part.children[i]);
    }

    if(part.body) {
      part.body.collideWorldBounds = false;
    }
    if(part.revoConstraint) { game.physics.p2.removeConstraint(part.revoConstraint); }
    if(part.gearConstraint) { game.physics.p2.removeConstraint(part.gearConstraint); }
  }

  destroyer.destroyTree = function(root) {
    destroyTreeRecursive(root);
    game.time.events.add(Phaser.Timer.SECOND * 0, function() { delayedFade(root) }, this);
    game.time.events.add(Phaser.Timer.SECOND * 1.5, function() { delayedRemoval(root) }, this);
  }

  return destroyer;
}
