let flaps = 0;
const dropItem = (itemType) => {
  const item = document.createElement("div");
  if(itemType === 'rock') {
    item.setAttribute('class', 'rock dropped-item spin');
  } else {
    item.style.width = "15px";
    item.style.height = "19px";
    
    item.style.backgroundImage = `url(${itemType}.png)`;
    item.style.backgroundSize = "cover";
    item.setAttribute("class", "dropped-item spin");
  }  
  item.style.position = "absolute";
  item.style.zIndex = "2000";
  item.style.left = `${
    Math.floor(Math.random() * gameVariables.GAME_WIDTH) + 1
  }px`;
  item.style.bottom = `${
    parseInt(gameVariables.player.style.bottom.split("px")[0], 10) + 400
  }px`;
  gameVariables.game.appendChild(item);
};

const detectOverlap = (() => {
  const getPositions = (elem) => {
    let pos = elem.getBoundingClientRect();
    return [
      [pos.left, pos.right],
      [pos.top, pos.bottom],
    ];
  };
  const comparePositions = (p1, p2) => {
    let r1, r2;
    if (p1[0] < p2[0]) {
      r1 = p1;
      r2 = p2;
    } else {
      r1 = p2;
      r2 = p1;
    }
    return r1[1] > r2[0] || r1[0] === r2[0];
  };
  return (a, b) => {
    let pos1 = getPositions(a),
      pos2 = getPositions(b);
    return (
      comparePositions(pos1[0], pos2[0]) && comparePositions(pos1[1], pos2[1])
    );
  };
})();

const drawFrame = (frameX, frameY) => {  
  const x = `${gameVariables.SPRITE_WIDTH * gameVariables.SCALE * frameX}px`;
  const y = `${gameVariables.SPRITE_HEIGHT * gameVariables.SCALE * frameY}px`;
  if (gameVariables.player) {
    gameVariables.player.style.backgroundPosition = `${x} ${y}`;
  }
  if(gameVariables.facingRight) {
    gameVariables.player.classList.add('flipped');
  } else {
    gameVariables.player.classList.remove('flipped');
  }
};

const drawBird = (frameX, frameY) => {
  if(flaps >= 10) {
    const x = `${gameVariables.BIRD_WIDTH * gameVariables.SCALE * frameX}px`;
    const y = `${gameVariables.BIRD_HEIGHT * gameVariables.SCALE * frameY}px`;
    const birds = document.getElementsByClassName('birds');
    for(let i=0;i<birds.length;i++) {
     birds[i].style.backgroundPosition = `${x} ${y}`;
    }
  }  
}

const jump = async (dir) => {
  if (dir === "right") {
    for (fr of gameVariables.jumpLoop) {
      drawFrame(fr, 0);
      await timeoutPromise(100);
    }
  } else {
    for (fr of gameVariables.jumpLoop) {
      drawFrame(fr, 1);
      await timeoutPromise(100);
    }
  }
};

const layEgg = async () => {
  if (gameVariables.eggTimer === gameVariables.MAX_EGG_TIMER) {
    gameVariables.eggTimer = 0;
    gameVariables.eggTimerBar.style.width = "0%";
    gameVariables.layingEgg = true;
    const dir = gameVariables.facingRight ? 0 : 1;
    for (fr of gameVariables.eggLoop) {
      drawFrame(fr, dir);
      await timeoutPromise(100);
    }
    gameVariables.layingEgg = false;
    gameVariables.eggLoopIndex = 0;
    const egg = document.createElement("div");
    egg.style.height = `${gameVariables.SPRITE_WIDTH}px`;
    egg.style.width = `${gameVariables.SPRITE_HEIGHT}px`;
    egg.style.background = "url(sprites.png)";
    const x = `${gameVariables.SPRITE_WIDTH * gameVariables.SCALE * 16}px`;
    const y = `${gameVariables.SPRITE_HEIGHT * gameVariables.SCALE}px`;
    egg.style.backgroundPosition = `${x} ${y}`;
    egg.style.position = "absolute";
    egg.style.left = gameVariables.player.style.left;
    egg.style.bottom = gameVariables.player.style.bottom;
    egg.style.zIndex = 1024;
    egg.setAttribute("id", "egg-1");
    gameVariables.eggs.push(egg);
    gameVariables.game.appendChild(egg);
    gameVariables.playerVelY =
      -gameVariables.PLAYER_SPEED * (gameVariables.JUMP_POWER + 0.5);
  }
};

const timeoutPromise = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

const handleNextLevel = (current) => {
  gameVariables.eggTimer = 0;
  const pauseScreen = document.getElementById('pause-screen')
  if(pauseScreen) {
    pauseScreen.style.display = 'none';
  }
  const world = document.getElementById('world');
  world.style.display = 'block';
  const game = document.getElementById("game");
  let level = current;
  gameVariables.pause = true;
  //  @TODO - We'll do an animation here
  while (game.firstChild) {
    game.removeChild(game.firstChild);
  }

  for(let i=0; i< gameVariables.eggs.length;i++) {
    gameVariables.eggs[i].remove();
  }

  gameVariables.player = undefined;
  const player = document.getElementById("player");
  if (player) {
    player.remove();
  }
  if ((gameVariables.eggs, length > 0)) {
    gameVariables.eggs[0].remove();
  }

  if(level === 4) {
    const titleDiv = document.createElement('div');
    titleDiv.style.width = '85%';
    titleDiv.style.position = 'fixed';
    titleDiv.style.margin = 'auto';
    titleDiv.style.textAlign = 'center';
    titleDiv.style.top = '40px';
    const title = document.createElement('h3');
    title.innerText = "Congrats you collected all your feathers!";
    titleDiv.append(title);
    gameVariables.game.appendChild(titleDiv);
  } else {
    level++;
    localStorage.setItem('level', JSON.stringify(level));
  }
  setTimeout(() => loadLevel(level), 1500);
};

const gameLoop = async () => {
  const homeScreen = document.getElementById('home');
  const world = document.getElementById('world');
  if (!gameVariables.pause && homeScreen.style.display === 'none' && world.style.display !== 'none') {
    if(flaps < 10) {
      flaps++
    } else {
      flaps = 0;
    }
    if (gameVariables.droppingItems) {
      const droppedItems = document.getElementsByClassName("dropped-item");
      if (!droppedItems || droppedItems.length === 0) {
        dropItem("rock");
        gameVariables.dropCount = 0;
      }
    }

    const birds = document.getElementsByClassName('birds');
    if(birds) {
      drawBird(gameVariables.birdLoop[gameVariables.currentBirdIndex], 0);
      if(gameVariables.currentBirdIndex < 2) {
        gameVariables.currentBirdIndex++;
      } else {
        gameVariables.currentBirdIndex = 0;
      }
    }

    const jumpKey =
      gameVariables.keys[38] ||
      gameVariables.keys[32] ||
      gameVariables.keys[87];
    const rightKey = gameVariables.keys[39] || gameVariables.keys[68];
    const leftKey = gameVariables.keys[37] || gameVariables.keys[65];
    const layEggKey = gameVariables.keys[40] || gameVariables.keys[83];

    gameVariables.playerVelX *= gameVariables.FRICTION;

    if (!gameVariables.jumpingOff && !gameVariables.layingEgg) {
      gameVariables.playerVelY += gameVariables.GRAVITY;
    } else {
      if (gameVariables.playerVelY > 0) {
        gameVariables.playerVelY--;
      }
    }

    let touching = [];

    const platforms = document.getElementsByClassName("platform");
    const embankments = document.getElementsByClassName("embankment");
    const feathers = document.getElementsByClassName("feather");
    const smallBugs = document.getElementsByClassName("small-bug");
    const refillStation = document.getElementsByClassName('refill');
    const station = refillStation[0];
    const feather = feathers[0]; //Always only one;
    let featherTouching = [];
    const a = gameVariables.player.getBoundingClientRect();
    // const c = feather.getBoundingClientRect();
    if (feather) {
      if (detectOverlap(gameVariables.player, feather)) {
        featherTouching.push(feather);
      }
    }

    if(station) {
      if(detectOverlap(gameVariables.player, station)) {
        //  Respawn bugs
        for(let i=0;i < smallBugs.length;i++) {
          if(smallBugs[i].style.display === 'none') {
            smallBugs[i].style.display = 'inline'
          }
        }

      }
    }

    for (var i = 0; i < platforms.length; i++) {
      const p = platforms[i];
      const b = p.getBoundingClientRect();

      if (detectOverlap(gameVariables.player, p)) {
        if (!(a.bottom > b.top + parseInt(p.style.height.split("px")[0]))) {
          gameVariables.jumpingOff = false;
          droppingItems = false;
          touching.push(p.id);

          if (a.bottom > b.top && p.id !== "1" && !gameVariables.jumpingOff) {
            gameVariables.player.style.bottom = `${
              parseInt(gameVariables.player.style.bottom.split("px")[0]) +
              (a.bottom - b.top)
            }px`;
            gameVariables.playerVelY = 0;
          }
        }
      }
    }

    let embankmentTouching = [];
    for (var i = 0; i < embankments.length; i++) {
      const p = embankments[i];
      if (detectOverlap(gameVariables.player, p)) {
        embankmentTouching.push(p);
      }
    }

    if (embankmentTouching.length > 0) {
      gameVariables.droppingItems = true;
      gameVariables.jumpingOff = true;
    } else {
      gameVariables.jumpingOff = false;
      gameVariables.droppingItems = false;
    }

    if (featherTouching.length > 0) {
      const currentLevel = parseInt(localStorage.getItem("level"), 10);
      handleNextLevel(currentLevel);
    }

    for (var i = 0; i < smallBugs.length; i++) {
      const p = smallBugs[i];
      if (detectOverlap(gameVariables.player, p)) {
        if (gameVariables.eggTimer < gameVariables.MAX_EGG_TIMER) {
          gameVariables.eggTimer = gameVariables.eggTimer + 10;
          gameVariables.eggTimerBar.style.width = `${
            (gameVariables.eggTimer / gameVariables.MAX_EGG_TIMER) * 100
          }%`;
        }
        smallBugs[i].style.display = 'none';
      }
    }

    const droppedItems = document.getElementsByClassName("dropped-item");
    if (droppedItems && droppedItems.length > 0) {
      for (const item of droppedItems) {
        const touching = detectOverlap(gameVariables.player, item);
        if (touching) {
          const dir = gameVariables.facingRight ? 0 : 1;
          drawFrame(9, dir);
          navigator.vibrate =
            navigator.vibrate ||
            navigator.webkitVibrate ||
            navigator.mozVibrate ||
            navigator.msVibrate;
          if (navigator.vibrate) {
            navigator.vibrate(1000);
          }
          world.classList.add("shake");
          await timeoutPromise(100);
          drawFrame(15, dir);
          world.classList.remove("shake");
          item.remove();
        }

        item.style.bottom = `${
          parseInt(item.style.bottom.split("px")[0], 10) -
          gameVariables.itemVelY
        }px`;
        if (
          parseInt(item.style.bottom.split("px")[0], 10) < -window.innerHeight
        ) {
          item.remove();
          gameVariables.itemVelY = 0;
        }
        if (gameVariables.itemVelY < 10) {
          gameVariables.itemVelY += gameVariables.GRAVITY;
        }
      }
    }

    gameVariables.eggs.forEach((egg) => {
      egg.style.bottom = `${
        parseInt(egg.style.bottom.split("px")[0], 10) - gameVariables.eggVelY
      }px`;
      if (parseInt(egg.style.bottom.split("px")[0], 10) < -window.innerHeight) {
        gameVariables.eggs = [];
        gameVariables.eggVelY = 0;
        egg.remove();
      }
      gameVariables.eggVelY += gameVariables.GRAVITY;
    });

    if (touching.length) {
      gameVariables.GROUNDED = true;
      gameVariables.JUMPING = false;
    }

    if (gameVariables.GROUNDED && !gameVariables.jumpingOff) {
      gameVariables.playerVelY = 0;
    } else if (gameVariables.jumpingOff) {
      gameVariables.playerVelY *= gameVariables.FRICTION;
    }

    if (layEggKey) {
      if (!gameVariables.jumpingOff) {
        layEgg();
      } else if (gameVariables.jumpingOff) {
        gameVariables.playerVelY++;
        if (
          gameVariables.facingRight &&
          gameVariables.playerVelX < gameVariables.PLAYER_SPEED
        ) {
          gameVariables.playerVelX++;
        } else if (
          !gameVariables.facingRight &&
          gameVariables.playerVelX > -gameVariables.PLAYER_SPEED
        ) {
          gameVariables.playerVelX--;
        }
      }
    }

    if (jumpKey && rightKey) {
      gameVariables.facingRight = true;
      if (!gameVariables.JUMPING && gameVariables.GROUNDED && !gameVariables.jumpingOff) {
        gameVariables.GROUNDED = false;
        
          gameVariables.playerVelY = -gameVariables.PLAYER_SPEED * gameVariables.JUMP_POWER;
       
        
      }

      if (
        !gameVariables.JUMPING &&
        gameVariables.GROUNDED &&
        !gameVariables.jumpingOff
      ) {
        gameVariables.GROUNDED = false;
        gameVariables.playerVelY =
          -gameVariables.PLAYER_SPEED * gameVariables.JUMP_POWER;
      }
      if (gameVariables.playerVelX < gameVariables.PLAYER_SPEED) {
        gameVariables.playerVelX++;
      }

      if (!gameVariables.layingEgg && !gameVariables.JUMPING) {
        gameVariables.JUMPING = true;
        jump("right");
      }
    } else if (jumpKey && leftKey) {
      gameVariables.facingRight = false;
      if (
        !gameVariables.JUMPING &&
        gameVariables.GROUNDED &&
        !gameVariables.jumpingOff
      ) {
        gameVariables.GROUNDED = false;
        
          gameVariables.playerVelY =
          -gameVariables.PLAYER_SPEED * gameVariables.JUMP_POWER;
      
      }
      if (gameVariables.playerVelX > -gameVariables.PLAYER_SPEED) {
        gameVariables.playerVelX--;
      }

      if (!gameVariables.layingEgg && !gameVariables.JUMPING) {
        jump("left");
      }
    } else if (jumpKey) {
      if (
        !gameVariables.JUMPING &&
        gameVariables.GROUNDED &&
        !gameVariables.jumpingOff
      ) {
        gameVariables.GROUNDED = false;
       
          gameVariables.playerVelY =
          -gameVariables.PLAYER_SPEED * gameVariables.JUMP_POWER;
        
      }

      if (!gameVariables.layingEgg && !gameVariables.JUMPING) {
        gameVariables.JUMPING = true;

        const dir = gameVariables.facingRight ? "right" : "left";
        jump(dir);
      }
    } else if (rightKey) {
      gameVariables.facingRight = true;
      if (gameVariables.playerVelX < gameVariables.PLAYER_SPEED) {
        gameVariables.playerVelX++;
        if (gameVariables.jumpingOff) {
          gameVariables.playerVelY--;
        }
      }
      if (
        !gameVariables.layingEgg &&
        (!gameVariables.JUMPING || gameVariables.jumpingOff)
      ) {
        drawFrame(gameVariables.cycleLoop[gameVariables.currentLoopIndex], 0);
      }
    } else if (leftKey) {
      gameVariables.facingRight = false;
      if (gameVariables.playerVelX > -gameVariables.PLAYER_SPEED) {
        gameVariables.playerVelX--;
        if (gameVariables.jumpingOff) {
          gameVariables.playerVelY--;
        }
      }
      if (
        !gameVariables.layingEgg &&
        (!gameVariables.JUMPING || gameVariables.jumpingOff)
      ) {
        drawFrame(gameVariables.cycleLoop[gameVariables.currentLoopIndex], 1);
      }
    } else {

      if (!gameVariables.layingEgg && !gameVariables.JUMPING) {
        drawFrame(10, 1);
      }
    }

    if (rightKey || leftKey) {
      gameVariables.frame++;
      if (gameVariables.frame >= gameVariables.FPS) {
        gameVariables.frame = 0;
        gameVariables.currentLoopIndex++;
      }
    }

    if (gameVariables.currentLoopIndex >= gameVariables.cycleLoop.length) {
      gameVariables.currentLoopIndex = 0;
    }

    gameVariables.player.style.left = `${
      parseInt(gameVariables.player.style.left.split("px")[0], 10) +
      gameVariables.playerVelX
    }px`;
    gameVariables.player.style.bottom = `${
      parseInt(gameVariables.player.style.bottom.split("px")[0], 10) -
      gameVariables.playerVelY
    }px`;

    if(gameVariables.flapCount === 2 && gameVariables.GROUNDED) {
      gameVariables.flapCount = 0;
    }
    gameVariables.GROUNDED = false;

    if (gameVariables.player) {
      // gameVariables.player.scrollIntoView();
      window.scrollTo(0, gameVariables.player.offsetTop - 200);
    }

    if (
      parseInt(gameVariables.player.style.left.split("px")[0], 10) >
      gameVariables.GAME_WIDTH
    ) {
      gameVariables.player.style.left = "0px";
    }

    if (parseInt(gameVariables.player.style.left.split("px")[0], 10) < -10) {
      gameVariables.player.style.left = `${gameVariables.GAME_WIDTH}px`;
    }

    requestAnimationFrame(gameLoop);
  }
};

window.gameLoop = gameLoop;
window.handleNextLevel = handleNextLevel;
