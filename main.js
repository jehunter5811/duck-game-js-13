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

window.onload = () => {
  gameVariables.img.src = "sprites.png";
  gameVariables.img.onload = () => {
    console.log("Sprite sheet loaded");
    //  Get level/checkpoint
    currentLevel = localStorage.getItem("level")
      ? parseInt(localStorage.getItem("level"), 10)
      : 0;
    if (isMobile()) {
      gameVariables.GAME_WIDTH = window.innerWidth;

      const world = document.getElementById("world");
      world.style.width = `${window.innerWidth}px`;
      const controls = document.getElementById("controls");
      controls.style.display = "block";

      const up = document.getElementById("up");
      const down = document.getElementById("down");
      const left = document.getElementById("left");
      const right = document.getElementById("right");

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
    navButtons.style.top = 0;
    navButtons.style.display = "flex";
    navButtons.style.alignItems = "center";
    navButtons.style.zIndex = 1024;
    navButtons.style.justifyContent = "space-between";
    const refresh = document.createElement("button");
    refresh.innerText = "Reload";
    refresh.onclick = () => handleReload();
    const pauseButton = document.createElement("button");
    pauseButton.innerText = gameVariables.pause ? "Start" : "Pause";
    pauseButton.onclick = () => handlePause();
    const playGameButton = document.createElement("button");
    playGameButton.innerText = "Play Game (**Plays Music**)";
    playGameButton.onclick = () => handlePlayMusic();
    navButtons.appendChild(refresh);
    navButtons.appendChild(pauseButton);
    navButtons.appendChild(playGameButton);
    world.appendChild(navButtons);

    document.body.addEventListener("keydown", function (e) {
      e.target.click();
      gameVariables.keys[e.keyCode] = true;
    });

    document.body.addEventListener("keyup", function (e) {
      gameVariables.keys[e.keyCode] = false;
    });

    document.addEventListener("gesturestart", function (e) {
      e.preventDefault();
    });

    document.addEventListener("gesturechange", function (e) {
      e.preventDefault();
    });

    document.addEventListener("gestureend", function (e) {
      e.preventDefault();
    });

    loadLevel(0);
  };
};


