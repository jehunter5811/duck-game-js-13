//  Animating Sprites Tutorial:
//  https://dev.to/martyhimmel/animating-sprite-sheets-with-javascript-ag3

let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let x = canvas.width / 2;
let y = canvas.height / 2;
let img = new Image();
img.src = "sprite.png";
img.onload = () => {
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);

  requestAnimationFrame(gameLoop);
};

const KEY_PRESSES = {
  right: false,
  left: false,
  jump: false,
};

let facingRight = true;

let gameOver = false;

const SCALE = 2;
const WIDTH = 16;
const HEIGHT = 18;
const SCALED_WIDTH = SCALE * WIDTH;
const SCALED_HEIGHT = SCALE * HEIGHT;

const groundHeight = canvas.height - 80;
const FPS = 25;

const GRAVITY = 10;
const JUMP_POWER = 20;
const MAX_JUMP = 60;
const VELOCITY = 15;

const player = {
  x: 20,
  y: groundHeight - HEIGHT / 2,
  collider: {
    top: false,
    bottom: false,
    right: false,
    left: false,
  },
};

let isJumping = false;
let touchingDown = true;

const cycleLoop = [0, 1, 0, 2];
let currentLoopIndex = 0;
let currentJumpHeight = 0;

const MAX_PLATFORMS = 5;
const MIN_PLATFORM_WIDTH = 10;
const MAX_PLATFORM_WIDTH = 20;
const MAX_PLATFORM_HEIGHT = 8;
const levelPlatforms = [];

//  Draw the platforms

let initialY = groundHeight;

for (i = 0; i < MAX_PLATFORMS; i++) {
  try {
    initialY = initialY - 20;
    const y = initialY;
    const x = Math.floor(Math.random() * canvas.width) + 1;
    const w = 50;
    const h = 10;
    const newPlatform = {
      x,
      y,
      w,
      h,
    };
    levelPlatforms.push(newPlatform);
  } catch (error) {
    console.log(error);
  }
}

const keyDownHandler = (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") {
    KEY_PRESSES.right = true;
    facingRight = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    KEY_PRESSES.left = true;
    facingRight = false;
  } else if (e.key === "Space" || e.key === " ") {
    if (
      !isJumping &&
      (touchingDown || player.collider.bottom) &&
      KEY_PRESSES.jump !== true
    ) {
      KEY_PRESSES.jump = true;
      isJumping = true;
    }
  }
};

const keyUpHandler = (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") {
    KEY_PRESSES.right = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    KEY_PRESSES.left = false;
  } else if (e.jey === "Space" || e.key === " ") {
    KEY_PRESSES.jump = false;
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

const jump = () => {
  currentJumpHeight += JUMP_POWER;
  if (currentJumpHeight < MAX_JUMP) {
    player.y -= JUMP_POWER;
    requestAnimationFrame(jump);
  } else {
    if (touchingDown) {
      currentJumpHeight = 0;
    }
  }
};

const checkCollisions = () => {
  for (const platform of levelPlatforms) {
    if (
      player.x + SCALED_HEIGHT > platform.x &&
      player.x + SCALED_WIDTH < platform.x + platform.w
    ) {
      player.collider.right = true;
    } else {
      player.collider.right = false;
    }

    if (player.x < platform.x + platform.w && player.x > platform.x) {
      player.collider.left = true;
    } else {
      player.collider.left = false;
    }

    if (
      player.y + SCALED_HEIGHT >
        platform.y - (platform.h + platform.h / 2) - 1 &&
      player.y - SCALED_HEIGHT < platform.y + platform.h &&
      player.x > platform.x - platform.w / 2 &&
      player.x < platform.x + platform.w / 2
    ) {
      player.collider.bottom = true;
    } else {
      player.collider.bottom = false;
    }
  }
};

const isTouchingDown = () => {
  if (player.y === groundHeight - HEIGHT / 2 || player.collider.bottom) {
    isJumping = false;
    return true;
  } else {
    isJumping = true;
    return false;
  }
};

const gameLoop = () => {
  touchingDown = isTouchingDown();
  //  Clear the canvas before each repaint
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //  Draw the platforms
  for (const platform of levelPlatforms) {
    ctx.beginPath();
    ctx.rect(platform.x, platform.y, platform.w, platform.h);
    ctx.stroke();
  }

  checkCollisions();

  const rightAnimation = KEY_PRESSES.right && !KEY_PRESSES.jump;
  const leftAnimation = KEY_PRESSES.left && !KEY_PRESSES.jump;

  if (!touchingDown) {
    player.y += GRAVITY;
  }

  if (KEY_PRESSES.right && KEY_PRESSES.jump) {
    rightAnimation
      ? drawFrame(cycleLoop[currentLoopIndex], 3, player.x, player.y)
      : drawFrame(2, 3, player.x, player.y);
    player.x += VELOCITY;
    jump();
  } else if (KEY_PRESSES.left && KEY_PRESSES.jump) {
    leftAnimation
      ? drawFrame(cycleLoop[currentLoopIndex], 2, player.x, player.y)
      : drawFrame(2, 2, player.x, player.y);
    player.x -= VELOCITY;
    jump();
  } else if (KEY_PRESSES.right) {
    rightAnimation
      ? drawFrame(cycleLoop[currentLoopIndex], 3, player.x, player.y)
      : drawFrame(2, 3, player.x, player.y);
    player.x += VELOCITY;
  } else if (KEY_PRESSES.left) {
    leftAnimation
      ? drawFrame(cycleLoop[currentLoopIndex], 2, player.x, player.y)
      : drawFrame(2, 2, player.x, player.y);
    player.x -= VELOCITY;
  } else if (KEY_PRESSES.jump && !KEY_PRESSES.right && !KEY_PRESSES.left) {
    drawFrame(1, 1, player.x, player.y);
    jump();
  } else {
    const standingYFrame = facingRight ? 3 : 2;
    drawFrame(0, standingYFrame, player.x, player.y);
  }
  currentLoopIndex++;
  if (currentLoopIndex >= cycleLoop.length) {
    currentLoopIndex = 0;
  }

  // //  Recursively call this function over and over
  if (!gameOver) {
    // frameCount = 0;
    // requestAnimationFrame(gameLoop);
    setTimeout(() => {
      requestAnimationFrame(gameLoop);
    }, 1000 / FPS);
  }
};
