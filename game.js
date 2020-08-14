// //  Animating Sprites Tutorial:
// //  https://dev.to/martyhimmel/animating-sprite-sheets-with-javascript-ag3

// let canvas = document.getElementById("gameCanvas");
// let ctx = canvas.getContext("2d");
// let x = canvas.width / 2;
// let y = canvas.height / 2;
// let img = new Image();
// img.src = "sprite.png";
// img.onload = () => {
//   document.addEventListener("keydown", keyDownHandler, false);
//   document.addEventListener("keyup", keyUpHandler, false);

//   requestAnimationFrame(gameLoop);
// };

// const KEY_PRESSES = {
//   right: false,
//   left: false,
//   jump: false,
// };

let facingRight = true;

// let gameOver = false;

const SCALE = 2;
const WIDTH = 16;
const HEIGHT = 18;
const SCALED_WIDTH = SCALE * WIDTH;
const SCALED_HEIGHT = SCALE * HEIGHT;

// const groundHeight = canvas.height - 80;
// const FPS = 25;

// const GRAVITY = 10;
// const JUMP_POWER = 20;
// const MAX_JUMP = 60;
// const VELOCITY = 15;

// const player = {
//   x: 20,
//   y: groundHeight - HEIGHT / 2,
//   collider: {
//     top: false,
//     bottom: false,
//     right: false,
//     left: false,
//   },
// };

// let isJumping = false;
// let touchingDown = true;

const cycleLoop = [0, 1, 0, 2];
let currentLoopIndex = 0;
// let currentJumpHeight = 0;

// const MAX_PLATFORMS = 5;
// const MIN_PLATFORM_WIDTH = 10;
// const MAX_PLATFORM_WIDTH = 20;
// const MAX_PLATFORM_HEIGHT = 8;
// const levelPlatforms = [];

// //  Draw the platforms

// let initialY = groundHeight;

// for (i = 0; i < MAX_PLATFORMS; i++) {
//   try {
//     initialY = initialY - 20;
//     const y = initialY;
//     const x = Math.floor(Math.random() * canvas.width) + 1;
//     const w = 50;
//     const h = 10;
//     const newPlatform = {
//       x,
//       y,
//       w,
//       h,
//     };
//     levelPlatforms.push(newPlatform);
//   } catch (error) {
//     console.log(error);
//   }
// }

// const keyDownHandler = (e) => {
//   if (e.key === "Right" || e.key === "ArrowRight") {
//     KEY_PRESSES.right = true;
//     facingRight = true;
//   } else if (e.key === "Left" || e.key === "ArrowLeft") {
//     KEY_PRESSES.left = true;
//     facingRight = false;
//   } else if (e.key === "Space" || e.key === " ") {
//     if (
//       !isJumping &&
//       (touchingDown || player.collider.bottom) &&
//       KEY_PRESSES.jump !== true
//     ) {
//       KEY_PRESSES.jump = true;
//       isJumping = true;
//     }
//   }
// };

// const keyUpHandler = (e) => {
//   if (e.key === "Right" || e.key === "ArrowRight") {
//     KEY_PRESSES.right = false;
//   } else if (e.key === "Left" || e.key === "ArrowLeft") {
//     KEY_PRESSES.left = false;
//   } else if (e.jey === "Space" || e.key === " ") {
//     KEY_PRESSES.jump = false;
//   }
// };

let img = new Image();
img.src = "sprite.png";
img.onload = () => {
  // document.addEventListener("keydown", keyDownHandler, false);
  // document.addEventListener("keyup", keyUpHandler, false);

  requestAnimationFrame(update);
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

// const jump = () => {
//   currentJumpHeight += JUMP_POWER;
//   if (currentJumpHeight < MAX_JUMP) {
//     player.y -= JUMP_POWER;
//     requestAnimationFrame(jump);
//   } else {
//     if (touchingDown) {
//       currentJumpHeight = 0;
//     }
//   }
// };

// const checkCollisions = () => {
//   for(let i=0; i < levelPlatforms.length; i++) {
//     if (
//       player.x + SCALED_HEIGHT > levelPlatforms[i].x &&
//       player.x + SCALED_WIDTH < levelPlatforms[i].x + levelPlatforms[i].w
//     ) {
//       player.collider.right = true;
//     } else {
//       player.collider.right = false;
//     }

//     if (player.x < levelPlatforms[i].x + levelPlatforms[i].w && player.x > levelPlatforms[i].x) {
//       player.collider.left = true;
//     } else {
//       player.collider.left = false;
//     }

//     if (
//       player.y + SCALED_HEIGHT >
//         levelPlatforms[i].y - (levelPlatforms[i].h + levelPlatforms[i].h / 2) - 1 &&
//       player.y - SCALED_HEIGHT < levelPlatforms[i].y + levelPlatforms[i].h &&
//       player.x > levelPlatforms[i].x - levelPlatforms[i].w / 2 &&
//       player.x < levelPlatforms[i].x + levelPlatforms[i].w / 2
//     ) {
//       player.collider.bottom = true;
//     } else {
//       player.collider.bottom = false;
//     }
//   }
// };

// const isTouchingDown = () => {
//   if (player.y === groundHeight - HEIGHT / 2 || player.collider.bottom) {
//     isJumping = false;
//     return true;
//   } else {
//     isJumping = true;
//     return false;
//   }
// };

// const gameLoop = () => {
//   touchingDown = isTouchingDown();
//   //  Clear the canvas before each repaint
//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   //  Draw the platforms
//   for (const platform of levelPlatforms) {
//     ctx.beginPath();
//     ctx.rect(platform.x, platform.y, platform.w, platform.h);
//     ctx.stroke();
//   }

//   checkCollisions();

//   const rightAnimation = KEY_PRESSES.right && !KEY_PRESSES.jump;
//   const leftAnimation = KEY_PRESSES.left && !KEY_PRESSES.jump;

//   if (!touchingDown) {
//     player.y += GRAVITY;
//   }

//   if (KEY_PRESSES.right && KEY_PRESSES.jump) {
//     rightAnimation
//       ? drawFrame(cycleLoop[currentLoopIndex], 3, player.x, player.y)
//       : drawFrame(2, 3, player.x, player.y);
//     player.x += VELOCITY;
//     jump();
//   } else if (KEY_PRESSES.left && KEY_PRESSES.jump) {
//     leftAnimation
//       ? drawFrame(cycleLoop[currentLoopIndex], 2, player.x, player.y)
//       : drawFrame(2, 2, player.x, player.y);
//     player.x -= VELOCITY;
//     jump();
//   } else if (KEY_PRESSES.right) {
//     rightAnimation
//       ? drawFrame(cycleLoop[currentLoopIndex], 3, player.x, player.y)
//       : drawFrame(2, 3, player.x, player.y);
//     player.x += VELOCITY;
//   } else if (KEY_PRESSES.left) {
//     leftAnimation
//       ? drawFrame(cycleLoop[currentLoopIndex], 2, player.x, player.y)
//       : drawFrame(2, 2, player.x, player.y);
//     player.x -= VELOCITY;
//   } else if (KEY_PRESSES.jump && !KEY_PRESSES.right && !KEY_PRESSES.left) {
//     drawFrame(1, 1, player.x, player.y);
//     jump();
//   } else {
// const standingYFrame = facingRight ? 3 : 2;
// drawFrame(0, standingYFrame, player.x, player.y);
//   }
// currentLoopIndex++;
// if (currentLoopIndex >= cycleLoop.length) {
//   currentLoopIndex = 0;
// }

//   // //  Recursively call this function over and over
//   if (!gameOver) {
//     // frameCount = 0;
//     // requestAnimationFrame(gameLoop);
//     setTimeout(() => {
//       requestAnimationFrame(gameLoop);
//     }, 1000 / FPS);
//   }
// };

(function () {
  var requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  width = 1000,
  height = 400,
  player = {
    x: width / 2,
    y: 200,
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
  boxes = [],
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

// dimensions
boxes.push({
  //box on left
  x: 0,
  y: height / 4 + 10,
  width: 10,
  height: height,
  color: "green",
});
boxes.push({
  //box on left
  x: 0,
  y: 0,
  width: 10,
  height: height / 4 - 15,
  color: "green",
});
boxes.push({
  //box for the ground
  x: 0,
  y: height - 10,
  width: width,
  height: 50,
  color: "orange",
});
boxes.push({
  //box on right
  x: width - 10,
  y: 0,
  width: 50,
  height: height,
  color: "yellow",
});
boxes.push({
  x: 290,
  y: 200,
  width: 260,
  height: 10,
  color: "blue",
});
boxes.push({
  x: 590,
  y: 200,
  width: 80,
  height: 10,
  color: "blue",
});
boxes.push({
  x: 120,
  y: 250,
  width: 150,
  height: 10,
  color: "red",
});
boxes.push({
  x: 220,
  y: 300,
  width: 80,
  height: 10,
  color: "black",
});
boxes.push({
  x: 340,
  y: 350,
  width: 90,
  height: 10,
  color: "#655643",
});
boxes.push({
  x: 740,
  y: 300,
  width: 160,
  height: 10,
  color: "#655643",
});
boxes.push({
  x: 0,
  y: 350,
  width: 90,
  height: 10,
  color: "#655643",
});
boxes.push({
  x: 90,
  y: 350,
  width: 10,
  height: 50,
  color: "#655643",
});

canvas.width = width;
canvas.height = height;

function update() {
  // check keys
  const jumpKey = keys[38] || keys[32] || keys[87];
  const rightKey = keys[39] || keys[68];
  const leftKey = keys[37] || keys[65];

  if(jumpKey && rightKey) {
    if (!player.jumping && player.grounded) {
      player.jumping = true;
      player.grounded = false;
      player.velY = -player.speed * 2.5; //how high to jump
    }
    if (player.velX < player.speed) {
      player.velX++;
    }
  } else if(jumpKey && leftKey) {
    if (!player.jumping && player.grounded) {
      player.jumping = true;
      player.grounded = false;
      player.velY = -player.speed * 2.5; //how high to jump
    }
    if (player.velX > -player.speed) {
      player.velX--;
    }
  } else if (jumpKey) {
    // up arrow or space
    if (!player.jumping && player.grounded) {
      player.jumping = true;
      player.grounded = false;
      player.velY = -player.speed * 2.5; //how high to jump
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
  player.velY += gravity;

  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();

  player.grounded = false;

  // check keys
  if(jumpKey && rightKey) {
    const standingYFrame = facingRight ? 3 : 2;
    drawFrame(0, standingYFrame, player.x, player.y);
  } else if(jumpKey && leftKey) {
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

  for (var i = 0; i < boxes.length; i++) {
    //print boxes
    ctx.fillStyle = boxes[i].color;
    ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);

    var dir = colCheck(player, boxes[i]);
    if (dir === "l" || dir === "r") {
      player.velX = 0;
      player.jumping = false;
    } else if (dir === "b") {
      player.grounded = true;
      player.jumping = false;
    } else if (dir === "t") {
      player.velY *= -1;
    }
  }

  if (player.grounded) {
    player.velY = 0;
  }

  player.x += player.velX;
  player.y += player.velY;

  ctx.fill(); //  Draw charater
  ctx.fillStyle = player.color;

  //  draw powerup stuff
  for (var j = 0; j < powerup.length; j++) {
    ctx.save();
    var cx = powerup[j].x + 0.5 * powerup[j].width, // x of shape center
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
      //   var r = confirm("You win! Play again?");
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

  requestAnimationFrame(update);
}

function colCheck(shapeA, shapeB) {
  // get the vectors to check against
  var vX = shapeA.x + shapeA.width / 2 - (shapeB.x + shapeB.width / 2),
    vY = shapeA.y + shapeA.height / 2 - (shapeB.y + shapeB.height / 2),
    // add the half widths and half heights of the objects
    hWidths = shapeA.width / 2 + shapeB.width / 2,
    hHeights = shapeA.height / 2 + shapeB.height / 2,
    colDir = null;

  // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
  if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
    // figures out on which side we are colliding (top, bottom, left, or right)
    var oX = hWidths - Math.abs(vX),
      oY = hHeights - Math.abs(vY);
    if (oX >= oY) {
      if (vY > 0) {
        colDir = "t";
        shapeA.y += oY;
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
  update();
});
