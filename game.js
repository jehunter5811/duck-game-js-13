const SCALE = 4;
const WIDTH = 16;
let GAME_WIDTH = 600;
const HEIGHT = 18;
const SCALED_WIDTH = SCALE * WIDTH;
const SCALED_HEIGHT = SCALE * HEIGHT;
let WORLD = {
  minX: 0,
  maxX: window.innerWidth,
  minY: 0,
  maxY: window.innerHeight,
};

const GROUND_HEIGHT = 50;

const JUMP_POWER = 4.5;

const cycleLoop = [0, 1, 0, 2];
let currentLoopIndex = 0;
let facingRight = true;
let anyCollisions = false;

let img = new Image();
img.src = "sprite.png";
img.onload = () => {
  GAME_WIDTH = isMobile() ? window.innerWidth : 600;
  WORLD = {
    minX: 0,
    maxX: GAME_WIDTH,
    minY: 0,
    maxY: 3000,
  };

  if(!isMobile()) {
    const width = window.innerWidth;
    const worldDiv = document.getElementById('world');
    worldDiv.style.width = "600px";
    worldDiv.style.marginLeft = `${(width - 600)/2}px`;
  }

  requestAnimationFrame(update);
};

const isMobile = () => {
  if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/iPhone|iPod/i) ||
    navigator.userAgent.match(/Opera Mini/i) ||
    navigator.userAgent.match(/IEMobile/i) ||
    navigator.userAgent.match(/WPDesktop/i)
  ) {
    return true;
  } else {
    return false;
  }
};

const drawFrame = (frameX, frameY, canvasX, canvasY) => {
  ctx.drawImage(
    img,
    frameX * WIDTH,
    frameY * HEIGHT,
    WIDTH,
    HEIGHT,
    canvasX,
    canvasY,
    SCALED_WIDTH,
    SCALED_HEIGHT
  );
};

(function () {
  let requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

let canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  width = WORLD.maxX,
  height = WORLD.maxY,
  player = {
    x: canvas.width / 2,
    y: window.innerHeight - GROUND_HEIGHT - SCALED_HEIGHT,
    width: SCALED_WIDTH,
    height: SCALED_HEIGHT,
    speed: 3,
    velX: 0,
    velY: 0,
    jumping: false,
    grounded: false,
  },
  keys = [],
  friction = 0.8,
  gravity = 0.4,
  platforms = [
    {
      //  Ground platform
      x: 0,
      y: WORLD.maxY - 20,
      width: WORLD.maxX,
      height: 50,
      velY: 0,
    },
    {
      x: 20,
      y: WORLD.maxY - 200,
      width: 100,
      height: 20,
      velY: 0,
    },
    {
      x: 90,
      y: WORLD.maxY - 400,
      width: 100,
      height: 20,
      velY: 0,
    },
    {
      x: 200,
      y: WORLD.maxY - 600,
      width: 100,
      height: 20,
      velY: 0,
    },
    {
      x: 320,
      y: WORLD.maxY - 800,
      width: 100,
      height: 20,
      velY: 0,
    },
    {
      x: 500,
      y: WORLD.maxY - 1000,
      width: 100,
      height: 20,
      velY: 0,
    },
    {
      x: 700,
      y: WORLD.maxY - 1200,
      width: 100,
      height: 20,
      velY: 0,
    },
    {
      x: 500,
      y: WORLD.maxY - 1400,
      width: 100,
      height: 20,
      velY: 0,
    },
    {
      x: 300,
      y: WORLD.maxY - 1600,
      width: 100,
      height: 20,
      velY: 0,
    },
    {
      x: 500,
      y: WORLD.maxY - 1800,
      width: 100,
      height: 20,
      velY: 0,
    },
    {
      x: 700,
      y: WORLD.maxY - 2000,
      width: 100,
      height: 20,
      velY: 0,
    },
    {
      x: 900,
      y: WORLD.maxY - 2200,
      width: 100,
      height: 20,
      velY: 0,
    },
  ],
  powerup = [];

powerup.push({
  x: 810,
  y: 250,
  width: 20,
  height: 20,
  color: "#BF4D28",
  effect: "shrink",
});
powerup.push({
  x: 400,
  y: 150,
  width: 20,
  height: 20,
  color: "#BF4D28",
  effect: "gravity",
});
powerup.push({
  x: -15,
  y: 88,
  width: 20,
  height: 20,
  color: "#222",
  effect: "tele",
  rotate: 20,
  px: 20, //where they get teleported
  py: 370,
  stay: true,
});
powerup.push({
  x: 60,
  y: 365,
  width: 20,
  height: 20,
  color: "#2A5D77",
  effect: "win",
  stay: true,
});

const handleJump = () => {
  //  Check player position against the world height
  platforms.forEach((platform) => {
    if (!platform.oldY) {
      platform.oldY = platform.y;
    }
    platform.velY = -player.speed * JUMP_POWER;
  });
};

function update() {
  // check keys
  canvas.width = GAME_WIDTH;
  canvas.height = height;

  const jumpKey = keys[38] || keys[32] || keys[87];
  const rightKey = keys[39] || keys[68];
  const leftKey = keys[37] || keys[65];

  if (jumpKey && rightKey) {
    if (!player.jumping && player.grounded) {
      player.jumping = true;
      player.grounded = false;
      handleJump();
    }
    if (player.velX < player.speed) {
      player.velX++;
    }
  } else if (jumpKey && leftKey) {
    if (!player.jumping && player.grounded) {
      player.jumping = true;
      player.grounded = false;
      handleJump();
    }
    if (player.velX > -player.speed) {
      player.velX--;
    }
  } else if (jumpKey) {
    // up arrow or space
    if (!player.jumping && player.grounded) {
      console.log(player.jumping)
      player.jumping = true;
      player.grounded = false;
      handleJump();
    }
  } else if (rightKey) {
    // right arrow
    facingRight = true;
    if (player.velX < player.speed) {
      player.velX++;
    }
  } else if (leftKey) {
    // left arrow
    facingRight = false;
    if (player.velX > -player.speed) {
      player.velX--;
    }
  }

  player.velX *= friction;
  
  platforms.forEach((platform) => {
    if (!player.grounded) {
      platform.velY += gravity;
    } else {
      platform.velY = 0;
    }
  });

  ctx.clearRect(0, 0, width, height);

  ctx.save();

  ctx.translate(-(player.w / 2), -(player.h / 2));

  // player.grounded = false;

  ctx.beginPath();

  // check keys
  if (jumpKey && rightKey) {
    const standingYFrame = facingRight ? 3 : 2;
    drawFrame(0, standingYFrame, player.x, player.y);
  } else if (jumpKey && leftKey) {
    const standingYFrame = facingRight ? 3 : 2;
    drawFrame(0, standingYFrame, player.x, player.y);
  } else if (jumpKey) {
    // up arrow or space
    drawFrame(1, 1, player.x, player.y);
  } else if (rightKey) {
    // right arrow
    facingRight = true;
    drawFrame(cycleLoop[currentLoopIndex], 3, player.x, player.y);
  } else if (leftKey) {
    // left arrow
    facingRight = false;
    drawFrame(cycleLoop[currentLoopIndex], 2, player.x, player.y);
  } else {
    const standingYFrame = facingRight ? 3 : 2;
    drawFrame(0, standingYFrame, player.x, player.y);
  }

  currentLoopIndex++;
  if (currentLoopIndex >= cycleLoop.length) {
    currentLoopIndex = 0;
  }

  for (let i = 0; i < platforms.length; i++) {
    ctx.fillStyle = platforms[i].color;
    ctx.rect(
      platforms[i].x,
      platforms[i].y,
      platforms[i].width,
      platforms[i].height
    );

    let dir = colCheck(player, platforms[i]);
    
    if (dir === "l" || dir === "r") {
      player.velX = 0;
      player.jumping = false;
    } else if (dir === "b") {
      player.grounded = true;
      player.jumping = false;
    } else if (dir === "t") {
      player.velY = player.velY;
    } 
  }


  if (player.grounded) {
    player.velY = 0;
    platforms.forEach((platform) => {
      platform.velY = 0;
    });
  }

  player.x += player.velX;
  
  //  Gravity
  platforms.forEach((platform) => {
    platform.y -= platform.velY;
  });

  ctx.fill(); //  Draw charater
  ctx.fillStyle = player.color;

  //  draw powerup stuff
  for (let j = 0; j < powerup.length; j++) {
    ctx.save();
    let cx = powerup[j].x + 0.5 * powerup[j].width, // x of shape center
      cy = powerup[j].y + 0.5 * powerup[j].height; //y of shape center
    ctx.translate(cx, cy); //translate to center of shape
    ctx.rotate((Math.PI / 180) * 45); //rotate 25 degrees.
    if (powerup[j].effect === "tele") {
      ctx.rotate((Math.PI / 180) * powerup[j].rotate); //rotate 25 degrees.
      powerup[j].rotate = (Math.PI / 180) * powerup[j].rotate;
    }
    ctx.translate(-cx, -cy); //translate center back to 0,0
    ctx.fillStyle = powerup[j].color;
    ctx.fillRect(
      powerup[j].x,
      powerup[j].y,
      powerup[j].width,
      powerup[j].height
    );
    ctx.restore();

    //powerup collision
    if (colCheck(player, powerup[j]) !== null) {
      //touched power up!
      powerup.splice(j, 1);
      // if (powerup[j].effect === "gravity") {
      //   // gravity = 0.4; //decrease gravity
      //   // player.speed = 4;
      //   // player.color = "white";
      // } else if (powerup[j].effect === "shrink") {
      //   // player.width = 10;
      //   // player.height = 10;
      //   // player.speed = 5;
      // } else if (powerup[j].effect === "tele") {
      //   player.x = powerup[j].px;
      //   player.y = powerup[j].py;
      // } else if (powerup[j].effect === "win") {
      //   let r = confirm("You win! Play again?");
      //   if (r == false) {
      //     player.x = 200;
      //     player.y = 200;
      //   } else {
      //     window.location.href = window.location.href;
      //   }
      // }
      // if (powerup[j].stay !== true) powerup[j].width = 0; //make power up go away
    }
  }

  ctx.restore();
  requestAnimationFrame(update);
}

function colCheck(shapeA, shapeB) {
  // get the vectors to check against
  let vX = shapeA.x + shapeA.width / 2 - (shapeB.x + shapeB.width / 2),
    vY = shapeA.y + shapeA.height / 2 - (shapeB.y + shapeB.height / 2),
    // add the half widths and half heights of the objects
    hWidths = shapeA.width / 2 + shapeB.width / 2,
    hHeights = shapeA.height / 2 + shapeB.height / 2,
    colDir = null;

  let oX = hWidths - Math.abs(vX),
    oY = hHeights - Math.abs(vY);
  
  // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
  
  if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
    // figures out on which side we are colliding (top, bottom, left, or right)
    if (oX >= oY) {
      if (vY > 0) {
        colDir = "t";
        // shapeA.y += oY;
      } else {
        colDir = "b";
        shapeA.y -= oY;
      }
    } else {
      if (vX > 0) {
        colDir = "l";
        shapeA.x += oX;
      } else {
        colDir = "r";
        shapeA.x -= oX;
      }
    }
  }
  return colDir;
}

document.body.addEventListener("keydown", function (e) {
  keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function (e) {
  keys[e.keyCode] = false;
});

window.addEventListener("load", function () {
  if(isMobile()) {

  }
  const up = document.getElementById('up');
  const down = document.getElementById('down');
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  up.addEventListener('pointerdown', () => {
    keys[38] = true;
  });
  down.addEventListener('pointerdown', () => {
    console.log("down")
  });
  right.addEventListener('pointerdown', () => {
    keys[39] = true;
  });
  left.addEventListener('pointerdown', () => {
    keys[37] = true;
  });

  document.addEventListener('pointerup', () => {
    keys[39] = false;
    keys[38] = false;
    keys[37] = false;
  })
});
