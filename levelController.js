const loadLevel = (level) => {
  let game = document.getElementById("game");
  game.style.height = gameVariables.GAME_HEIGHT;
  game.style.width = gameVariables.GAME_WIDTH;

  //  Draw the map
  const thisLevel = levels[level];
  const columnWidth = gameVariables.GAME_WIDTH / thisLevel[0].length;
  const rowHeight = gameVariables.GAME_HEIGHT / thisLevel.length;
  for (const row of thisLevel) {
    for (let i = 0; i < row.length; i++) {
      const platform = document.createElement("p");
      platform.style.width = `${columnWidth}px`;
      platform.style.position = "absolute";
      platform.style.top = `${thisLevel.indexOf(row) * rowHeight}px`;
      platform.style.left = `${i * columnWidth}px`;
      platform.style.margin = "0px";
      if (row[i] === 2) {
        platform.style.height = "20px";
        platform.style.background = "#000";
        platform.setAttribute("class", "collider platform");
      } else if (row[i] === 1) {
        platform.style.background = "blue";
        platform.style.height = `${rowHeight}px`;
        platform.setAttribute("class", "collider platform");
      } else if (row[i] === 3) {
        platform.setAttribute("class", "embankment");
        platform.style.background = "yellow";
        platform.style.height = `${rowHeight}px`;
      } else {
        platform.style.height = `${rowHeight}px`;
      }
      game.appendChild(platform);
    }
  }

  const eggTimerBarContainer = document.createElement("div");
  eggTimerBarContainer.style.position = "fixed";
  eggTimerBarContainer.style.zIndex = "2000";
  eggTimerBarContainer.style.top = "50px";
  eggTimerBarContainer.style.width = `${gameVariables.MAX_WIDTH / 2 - 10}px`;
  eggTimerBarContainer.style.height = "20px";
  eggTimerBarContainer.style.border = "1px solid #282828";

  gameVariables.eggTimerBar = document.createElement("div");
  gameVariables.eggTimerBar.style.margin = "0px";
  gameVariables.eggTimerBar.style.height = "100%";
  gameVariables.eggTimerBar.style.width = "100%";
  gameVariables.eggTimerBar.style.background = "yellow";
  gameVariables.eggTimerBar.style.opacity = "0.5";
  eggTimerBarContainer.appendChild(gameVariables.eggTimerBar);

  gameVariables.player = document.createElement("div");
  gameVariables.player.style.height = `${
    gameVariables.SPRITE_HEIGHT * gameVariables.SCALE
  }px`;
  gameVariables.player.style.width = `${
    gameVariables.SPRITE_WIDTH * gameVariables.SCALE
  }px`;
  gameVariables.player.style.backgroundImage = `url(${gameVariables.img.src})`;
  gameVariables.player.style.backgroundPosition = `0px ${
    gameVariables.SPRITE_HEIGHT * gameVariables.SCALE
  }px `;
  gameVariables.player.style.position = "absolute";
  console.log(gameVariables.GAME_HEIGHT);
  gameVariables.player.style.bottom = `500px`;
  gameVariables.player.style.left = "100px";
  gameVariables.player.style.zIndex = "1024";

  platforms = document.getElementsByClassName("platform");

  //  Attach gameVariables.player game view
  game = document.getElementById("world");
  game.style.position = "relative";

  game.appendChild(gameVariables.player);

  game.appendChild(eggTimerBarContainer);

  gameVariables.pause = false;
  gameVariables.game = game;
  requestAnimationFrame(gameLoop);
};

window.loadLevel = loadLevel;