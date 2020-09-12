const isMobile = () => {
  if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/iPhone|iPod/i) ||
    navigator.userAgent.match(/Opera Mini/i) ||
    navigator.userAgent.match(/IEMobile/i)
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
  const win = document.getElementById('win');
  if(win) {
    win.style.display = 'none';
  }
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
  refresh.setAttribute('class', 'eightbit-btn')
  refresh.innerText = "Reload";
  refresh.onclick = () => handleReload();
  const pauseButton = document.createElement('button');
  pauseButton.setAttribute('class', 'eightbit-btn')
  pauseButton.innerText = 'Levels';
  pauseButton.onclick = () => selectLevel();

  const musicToggle = document.createElement('button');
  musicToggle.innerText = gameVariables.musicPlaying && !gameVariables.pauseMusic ? "🔇" : "🔈";
  musicToggle.setAttribute('class', 'eightbit-btn')
  musicToggle.onclick = () => {
    if(gameVariables.pauseMusic) {
      gameVariables.pauseMusic = false;
      handlePlayMusic();
      musicToggle.innerText = '🔈'
    } else {
      gameVariables.pauseMusic = true;
      gameVariables.myAudioNode.stop();
      musicToggle.innerText = '🔇'
    }
  }
  navButtons.appendChild(refresh);
  navButtons.appendChild(pauseButton);
  navButtons.appendChild(musicToggle);
  world.appendChild(navButtons);

  let game = document.getElementById("game");
  game.style.height = gameVariables.GAME_HEIGHT;
  game.style.width = gameVariables.GAME_WIDTH;

  const backgrounds = document.getElementsByClassName('level-bgs');
  if(backgrounds.length) {
    for(let i=0;i<backgrounds.length;i++) {
      backgrounds[i].style.display = 'none';
    }
  }  

  const currentBG = document.getElementById(`level-bg-${level}`)

  if(currentBG) {
    currentBG.style.display = 'block';  
    currentBG.style.position = 'absolute';
    currentBG.style.zIndex = 980;
    currentBG.style.bottom = '255px';
    currentBG.style.height = '100%';
    currentBG.style.width = '100%';
  }

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
            if(level === 0) {
              platform.style.background = "#4C352C";
              platform.style.borderTop = 'solid 1px #B77B5E';
              platform.style.borderBottom = 'solid 1px #3F2A23';
            } else if(level===1) {
              platform.style.background = "#9E0000";
              platform.style.borderTop = 'solid 1px #FFB0B0';
              platform.style.borderBottom = 'solid 1px #700815';
            } else if(level===2) {
              platform.style.background = "#AA297F";
              platform.style.borderTop = 'solid 1px #FFA9E5';
              platform.style.borderBottom = 'solid 1px #3F1B33';
            } else if(level===3){
              platform.style.background = "#96520F";
              platform.style.borderTop = 'solid 1px #FFAE55';
              platform.style.borderBottom = 'solid 1px #66380E';
            } else if(level===4) {
              platform.style.background = "#48FFF6";
              platform.style.borderTop = 'solid 1px #C0FFFC';
              platform.style.borderBottom = 'solid 1px #00FFEC';
            } else {
              platform.style.background = '#000';
            }         
            platform.setAttribute("class", "collider platform");
                
        } else if (row[i] === 1) {
          if(level === 0) {
            platform.style.background = '#B24800';
          } else if(level === 2) {
            platform.style.background = '#5B1A52';
          } else if(level===4) {
            platform.style.background = '#cccccc';
          }
          platform.style.height = `${rowHeight}px`;
          platform.setAttribute("class", "collider platform");         
        } else if (row[i] === 3) {
          platform.setAttribute("class", "embankment");
          platform.style.background = "none";
          platform.style.height = `${rowHeight}px`;
        } else if(row[i] === 4) {
          if(level === 2) {
            
            platform.setAttribute("class", "collider platform birds");
            platform.style.backgroundImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJcAAAAlCAMAAAB4Q4s1AAAAP1BMVEUAAADYzsArKyu1q6BjY2Ogl40ZGRn/kQ3/79zGAACgAAD/Pj5/AAC8XgD/zJkCAgJKLxSbSgD/XH+CenM/IQBy7tf3AAAAAXRSTlMAQObYZgAAAYpJREFUWMPtk+1ugzAMAB0bCDA+Rrv3f9bZJloWhWZhXYV/7KqqaqSTD6eF39IoqAAKzQ5cjSN+CdwlH/odbEDfuggMQXuXtSwO0y5zWRwmXS/JanYwwCe40wSKdtgXvAT5KwW0ywX4/LJ9xbTYlUZds68IJV109e8L3phh0Bmxi2qM+n1Fox4WxnEMGwtdVGMo2lU542zXxIBAoYtqjOquJRonWIbpg51x4FX32DDOvTcRTDkw0DXMY8Mv+YyioVney9WP0zgOQ8+HjrMwo1fg0ECHWDS8X1JDKc8Q5O4nlkhmtG3rckR4ZKBzBUNIjENSQ5lv8wxKx5A7BBJjPmtst22LBu4UDX0YKE/xmQMnjfn2NSOG5UZpyhGenjTmLXl2VBKhjUbGurYP8E8a3icGKplxkpnf/u+M9X5HJTMuDNOuFrGXLltha0vcxWFgK6wjF7sy47qud+nCHjtrXU67OmtdWOy6htiFHRhj7+r+u+q7LF6jdFlcl+kug1nS1dnsAotZgAA/ZX0CNBwU72akJJEAAAAASUVORK5CYII=)';
            platform.style.height = '37px';
            platform.style.width = '50px';
          } else {
            platform.style.height = "10px";
            if(level === 0) {
              platform.style.background = "#4C352C";
              platform.style.borderTop = 'solid 1px #B77B5E';
              platform.style.borderBottom = 'solid 1px #3F2A23';
            } else if(level===1){
              platform.style.background = "#9E0000";
              platform.style.borderTop = 'solid 1px #FFB0B0';
              platform.style.borderBottom = 'solid 1px #700815';
            } else if(level===3) {
              platform.style.background = "#96520F";
              platform.style.borderTop = 'solid 1px #FFAE55';
              platform.style.borderBottom = 'solid 1px #66380E';
            } else if(level===4) {
              platform.style.background = "#48FFF6";
              platform.style.borderTop = 'solid 1px #C0FFFC';
              platform.style.borderBottom = 'solid 1px #00FFEC';
            } else {
              platform.style.background = '#000';
            } 
            platform.setAttribute("class", "collider platform");
          }
          //  Now create the collectible
          const coll = document.createElement('div');
          coll.style.backgroundImage = `url(${gameVariables.img.src})`;
          const x = `${gameVariables.SPRITE_WIDTH * 11}px`;
          const y = `${gameVariables.SPRITE_HEIGHT}px`;
          coll.style.backgroundPosition = `${x} ${y}`;
          coll.style.width = `${gameVariables.SPRITE_WIDTH}px`;
          coll.style.height = '33px';
          coll.style.position = 'absolute';
          coll.style.top = `${(thisLevel.indexOf(row) * rowHeight) - 20}px`;
          coll.style.left = `${(i * columnWidth) + (columnWidth/2)}px`;
          coll.setAttribute('class', 'small-bug');
          coll.style.zIndex = 1024;
          game.appendChild(coll);
        } else if(row[i] === 5) {
          platform.style.height = "10px";
          if(level === 0) {
            platform.style.background = "#4C352C";
            platform.style.borderTop = 'solid 1px #B77B5E';
            platform.style.borderBottom = 'solid 1px #3F2A23';
          } else if(level===2) {
            platform.style.background = "#AA297F";
            platform.style.borderTop = 'solid 1px #FFA9E5';
            platform.style.borderBottom = 'solid 1px #3F1B33';
          } else if(level===3) {
            platform.style.background = "#96520F";
            platform.style.borderTop = 'solid 1px #FFAE55';
            platform.style.borderBottom = 'solid 1px #66380E';
          } else if(level===4) {
            platform.style.background = "#48FFF6";
            platform.style.borderTop = 'solid 1px #C0FFFC';
            platform.style.borderBottom = 'solid 1px #00FFEC';
          } else {
            platform.style.background = '#000';
          } 
          platform.setAttribute("class", "collider platform");
          const feather = document.createElement('div');
          feather.setAttribute('class', 'feather');
          feather.style.position = 'absolute';
          feather.style.backgroundImage = `url(${gameVariables.img.src})`;
          const x = `${gameVariables.SPRITE_WIDTH * 12}px`;
          const y = `${gameVariables.SPRITE_HEIGHT}px`;
          feather.style.backgroundPosition = `${x} ${y}`;
          feather.style.top = `${parseInt(platform.style.top.split('px')[0] - 27, 10)}px`;
          feather.style.left = `${(i * columnWidth) + (columnWidth/2) - 10}px`;
          feather.style.height = '33px';
          feather.style.width = '26px';
          feather.style.zIndex = 1024;          
          game.appendChild(feather);
          //  Attach the owl          
          const owl = document.createElement('div');
          owl.style.width = '62px';
          owl.style.height = '54px';
          owl.style.position = 'absolute';
          owl.style.backgroundImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHwAAAA2BAMAAAD38+CHAAAAMFBMVEUAAADBYBD/tXj/2LviYQD87iH/eQCeThiZRwrWkWNgRTOlTw//kQ0AAAC8XgDguaCrh8xTAAAAAXRSTlMAQObYZgAAAaZJREFUSMft1D9Lw1AUBfCUgktFe6uDf6bcgINTmyfuhdcW3BwenQQHyeBc6dwtq2MmEZw61Q/j6HdwdfO+PutLz+AjYKBID02g/d3DbRJIVEqDjvI8J2r7nyqxcz8QYnTK85n3EKOrHs3k5Lwyk5j9ELXDjNnRaUxKmC+Gt5VZ/MFcU4+MmYiHGX1kjOnHA2PGzoOM/m76NLh58x5mcmk714ff3iCX1Riwz/5TIVlYN9bdv2sVks+PnyngUtI0ZV5ETbk3Y/0ysvemG7WYkyTxQ8BlSNjVR9PJ1VxPp9rVOS2NAeN6qWda6/v5ndbDTOqwHBjXS/0yy7Lz+ZmcldRhOTCuX0SNA8V8Mu9wouQ5tGA5MK6XOtk8k8TWYTkwrqfTV/KRL7Ic6j5Yb3JRPJb8uCi4+2sd17PUeZlY6izLse7Z1vHql65UunS4cskaRxjVbSzZDbSbCgfWGCzs4Xpn5QyOvK3/fZ0tgyPXWGdh72FGZ3Dkbb2GOnVWDI68gfXVuzQmohBvZJ06TDYV2Q/ElRjdJcC11CV77ghwXfVdewT4/9S/AJfi1TC022oIAAAAAElFTkSuQmCC)';
          owl.setAttribute('id', 'owl');
          const owlX = `${62 * 2}px`;
          const owlY = `${54}px`;
          owl.style.backgroundPosition = `${owlX} ${owlY}`;     
          owl.style.top = `${parseInt(platform.style.top.split('px')[0] - 27 - 30, 10)}px`;
          owl.style.left = `${(i * columnWidth) + (columnWidth/2) - 20}px`;
          owl.style.zIndex = 999;          
          game.appendChild(owl);  
        } else if(row[i] === 6) {
          platform.style.height = `40px`;
          platform.style.width = '40px';
          platform.style.marginTop = '20px'
          platform.style.backgroundColor = '#e1eb34';
          platform.setAttribute('class','collider platform refill eightbit-btn');
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
  eggTimerBarContainer.setAttribute('class', 'egg-timer');

  gameVariables.eggTimerBar = document.createElement("div");
  gameVariables.eggTimerBar.style.margin = "0px";
  gameVariables.eggTimerBar.style.height = "100%";
  gameVariables.eggTimerBar.style.width = "0%";
  gameVariables.eggTimerBar.style.background = "#e1eb34";
  gameVariables.eggTimerBar.style.opacity = "0.8";
  eggTimerBarContainer.appendChild(gameVariables.eggTimerBar);

  gameVariables.player = document.createElement("div");
  gameVariables.player.style.height = `${
    gameVariables.SPRITE_HEIGHT
  }px`;
  gameVariables.player.style.width = `${
    gameVariables.SPRITE_WIDTH
  }px`;
  gameVariables.player.style.backgroundImage = `url(${gameVariables.img.src})`;
  gameVariables.player.style.backgroundPosition = `${8*gameVariables.SPRITE_WIDTH}px ${
    gameVariables.SPRITE_HEIGHT
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