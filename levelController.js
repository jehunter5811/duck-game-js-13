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

const handleReload = () => {
  const currentLevel = parseInt(localStorage.getItem('level'), 10);
  handleNextLevel(currentLevel - 1);
}

const continueGame = () => {
  document.getElementById('home').style.display = 'none';  
  const world = document.getElementById("world");
  world.style.display = 'block';
  gameVariables.pause = false;
  requestAnimationFrame(window.gameLoop);
}

window.continueGame = continueGame;

const selectLevel = () => {
  const home = document.getElementById('home');
  home.style.display = 'none';
  const world = document.getElementById("world");
  world.style.display = 'none';
  const pauseScreen = document.getElementById('pause-screen')
  pauseScreen.style.display = 'block';
}

window.selectLevel = selectLevel;

const toggleStoryScreen = () => {
  const story = document.getElementById('story');
  const home = document.getElementById('home');
  if(story && story.style.display !== 'none') {
    story.style.display = 'none';
    home.style.display = 'block';
  } else {
    home.style.display = 'none';
    story.style.display = 'block';
  }
}

window.toggleStoryScreen = toggleStoryScreen;

const loadLevel = (level) => {
  const world = document.getElementById("world");
  if (isMobile()) {
    gameVariables.GAME_WIDTH = window.innerWidth;
    world.style.width = `${window.innerWidth}px`;
    const controls = document.getElementById("controls");
    controls.style.display = "block";

    const up = document.getElementById("up");
    const down = document.getElementById("down");
    const left = document.getElementById("left");
    const right = document.getElementById("right");
    const leftJump = document.getElementById("left-jump");
    const rightJump = document.getElementById("right-jump");

    controls.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
      },
      false
    );

    up.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      gameVariables.keys[38] = true;
    });
    down.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      gameVariables.keys[40] = true;
    });
    right.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      gameVariables.keys[39] = true;
    });
    left.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      gameVariables.keys[37] = true;
    });
    leftJump.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      gameVariables.keys[38] = true;
      gameVariables.keys[37] = true;
    });

    rightJump.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      gameVariables.keys[38] = true;
      gameVariables.keys[39] = true;
    });


    document.addEventListener("pointerup", (e) => {
      e.preventDefault();
      gameVariables.keys[39] = false;
      gameVariables.keys[38] = false;
      gameVariables.keys[37] = false;
      gameVariables.keys[40] = false;
    });
  }
  world.style.margin = "0px";
  world.style.padding = "0px";

  const navButtons = document.createElement("div");
  navButtons.style.height = "75px";
  navButtons.style.width = gameVariables.MAX_WIDTH;
  navButtons.style.margin = "auto";
  navButtons.style.position = "fixed";
  navButtons.style.top = '10px';
  navButtons.style.display = "flex";
  navButtons.style.alignItems = "center";
  navButtons.style.zIndex = 1024;
  navButtons.style.justifyContent = "space-between";
  const refresh = document.createElement("button");
  refresh.innerText = "Reload";
  refresh.onclick = () => handleReload();
  const pauseButton = document.createElement('button');
  pauseButton.innerText = 'Levels';
  pauseButton.onclick = () => selectLevel();
  navButtons.appendChild(refresh);
  navButtons.appendChild(pauseButton);
  world.appendChild(navButtons);

  let game = document.getElementById("game");
  game.style.height = gameVariables.GAME_HEIGHT;
  game.style.width = gameVariables.GAME_WIDTH;

  // //  Draw Background  
  // const prevBG = document.getElementById(`level-bg-${level - 1}`)

  // if(prevBG) {
  //   prevBG.style.display = 'none';
  // }

  // const currentBG = document.getElementById(`level-bg-${level}`)

  // if(currentBG) {
  //   currentBG.style.display = 'block';  
  //   currentBG.style.position = 'absolute';
  //   currentBG.style.zIndex = 980;
  //   currentBG.style.bottom = '255px';
  //   currentBG.style.height = '100%';
  //   currentBG.style.width = '100%';
  // }

  //  Draw the map
  const thisLevel = levels[level];
  const columnWidth = gameVariables.GAME_WIDTH / thisLevel[0].length;
  const rowHeight = gameVariables.GAME_HEIGHT / thisLevel.length;
  for (const row of thisLevel) {
    for (let i = 0; i < row.length; i++) {
      if(row[i] !== 0) {
        let platform;
        if(level === 2) {
          platform = document.createElement("div");
        } else {
          platform = document.createElement("p");
        }
        platform.style.width = `${columnWidth}px`;
        platform.style.position = "absolute";
        platform.style.top = `${thisLevel.indexOf(row) * rowHeight}px`;
        platform.style.left = `${i * columnWidth}px`;
        platform.style.margin = "0px";
        if (row[i] === 2) {
          
            platform.style.height = "10px";
            platform.style.background = "#000";
            platform.setAttribute("class", "collider platform");
                
        } else if (row[i] === 1) {
          platform.style.height = `${rowHeight}px`;
          platform.setAttribute("class", "collider platform");
          if(level === 2) {
            platform.style.background = 'brown';
          }
        } else if (row[i] === 3) {
          platform.setAttribute("class", "embankment");
          platform.style.background = "none";
          platform.style.height = `${rowHeight}px`;
        } else if(row[i] === 4) {
          if(level === 2) {
            platform.setAttribute("class", "collider platform birds");
            platform.style.backgroundImage = 'url(bird.png)';
            platform.style.height = '38px';
            platform.style.width = '50.33px';
          } else {
            platform.style.height = "10px";
            platform.style.background = "#000";
            platform.setAttribute("class", "collider platform");
          }
          //  Now create the collectible
          const coll = document.createElement('div');
          coll.style.backgroundImage = 'url(bug.png)';
          coll.style.width = '11px';
          coll.style.height = '12px';
          coll.style.position = 'absolute';
          coll.style.top = `${(thisLevel.indexOf(row) * rowHeight) - 10}px`;
          coll.style.left = `${(i * columnWidth) + (columnWidth/2)}px`;
          coll.setAttribute('class', 'small-bug');
          coll.style.zIndex = 1024;
          game.appendChild(coll);
        } else if(row[i] === 5) {
          platform.style.height = "10px";
          platform.style.background = "#000";
          platform.setAttribute("class", "collider platform");
          const feather = document.createElement('div');
          feather.setAttribute('class', 'feather');
          feather.style.position = 'absolute';
          feather.style.top = `${parseInt(platform.style.top.split('px')[0] - 27, 10)}px`;
          feather.style.left = `${(i * columnWidth) + (columnWidth/2)}px`;
          feather.style.height = '27px';
          feather.style.width = '5px';
          feather.style.zIndex = 1024;
          feather.style.backgroundImage = 'url(feather.png)';
          game.appendChild(feather);
          //  Attach the owl
          const owl = document.createElement('div');
          owl.style.width = '62px';
          owl.style.height = '54px';
          owl.style.position = 'absolute';
          owl.style.top = `${parseInt(platform.style.top.split('px')[0] - 27 - 30, 10)}px`;
          owl.style.left = `${(i * columnWidth) + (columnWidth/2)}px`;
          owl.style.zIndex = 999;
          owl.style.backgroundImage = 'url(owl.png)';
          game.appendChild(owl);  
        } else if(row[i] === 6) {
          platform.style.height = `${rowHeight}px`;
          platform.style.width = '40px';
          platform.style.background = 'brown';
          platform.style.border = '1px solid black';
          platform.setAttribute('class','collider platform refill');
        }
        platform.style.zIndex = 1024;
        game.appendChild(platform);
      }
    }
    
  }

  const eggTimerBarContainer = document.createElement("div");
  eggTimerBarContainer.style.position = "fixed";
  eggTimerBarContainer.style.zIndex = "2000";
  eggTimerBarContainer.style.top = "65px";
  eggTimerBarContainer.style.width = `${gameVariables.GAME_WIDTH / 2 - 10}px`;
  eggTimerBarContainer.style.height = "20px";
  eggTimerBarContainer.style.border = "1px solid #282828";
  eggTimerBarContainer.setAttribute('id', 'timer')

  gameVariables.eggTimerBar = document.createElement("div");
  gameVariables.eggTimerBar.style.margin = "0px";
  gameVariables.eggTimerBar.style.height = "100%";
  gameVariables.eggTimerBar.style.width = "0%";
  gameVariables.eggTimerBar.style.background = "black";
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

  gameVariables.player.style.bottom = `300px`;
  gameVariables.player.style.left = "150px";
  gameVariables.player.style.zIndex = "1024";
  gameVariables.player.setAttribute('id', 'player');

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