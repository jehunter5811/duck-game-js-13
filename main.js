window.onload = () => {
  //  Check local storage
  let level = localStorage.getItem('level');
  if(!level) {
    localStorage.setItem('level', JSON.stringify(0));    
    level = 0;
    // document.getElementById('start').style.display = 'block'
  } else {
    // document.getElementById('continue').style.display = 'block';
    level = parseInt(level, 10);
  }
  window.level = level;
  gameVariables.img.src = "sprites.png";
  gameVariables.img.onload = () => {
    console.log("Sprite sheet loaded");

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

    loadLevel(level);
  };
};


