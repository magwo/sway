

function windBlower(game) {
  blower = {};

  var elapsedPhysicsTimeTot = 0.0;
  var magnitude = 0.0;

  blower.updateWind = function() {
    var dt = game.time.physicsElapsed;
    elapsedPhysicsTimeTot += dt;

    magnitude = magnitude + (-0.5 + Math.random()) * 5 * dt;
    magnitude = Math.max(0, Math.min(2, magnitude));

    var lowFreq = magnitude * Math.sin(elapsedPhysicsTimeTot / 13) + magnitude * Math.sin(elapsedPhysicsTimeTot / 3);

    var len = game.physics.p2.world.bodies.length;
    for(var i=0; i<len; i++) {
      var body = game.physics.p2.world.bodies[i];

      if(body.motionState !== p2.Body.KINEMATIC) {
        //console.log(body.position);
        //var localForce = 1 * Math.sin(body.position[0]/5 - elapsedPhysicsTimeTot*2);
        body.applyForce([lowFreq, 0]);
      }
    };
  }
  return blower;
}
