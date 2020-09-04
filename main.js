window.onload = () => {
  //  Check local storage
  const level = localStorage.getItem('level');
  if(!level) {
    localStorage.setItem('level', JSON.stringify(0));
  }
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

    loadLevel(0);
  };
};


