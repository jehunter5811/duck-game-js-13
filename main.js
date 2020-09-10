window.onload = () => {
  //  Check local storage
  let level = localStorage.getItem('level');
  if(!level) {
    localStorage.setItem('level', JSON.stringify(0));    
    level = 0;
    document.getElementById('start').style.display = 'block'
  } else {
    document.getElementById('continue').style.display = 'block';
    level = parseInt(level, 10);
  }
  window.level = level;
  gameVariables.img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVIAAAAgCAMAAAB3lgCjAAAAWlBMVEUAAAD87iHduZL/kQ28XgDbdyZrLBVZIhH/eQC8YyD55M/iYQA/IQCHOB+oeBj5tyP/2Lv/XH/////dxh2tjgv/9ZT/n1fMqhtI9A+K/19E0w8gdwAfaAD/tXizfGotAAAAAXRSTlMAQObYZgAAAo5JREFUaN7t2Ot2qjAQhuGZPanarQV3wUMP+/5vsylUJjB8QmpBtLxd9kcCq/I0hKU0N3dpXAQn4Pjcd0g3m82IpCu6lzxcF6kdn0lhIqKkjQklNeNDkK5Wd2T6GZxA43gP+VWkgk3BBLbGpN8VvUVTEWrJ/XOOGUzA8VoRpE8/RfonjAYNX5YAUu8DSKVmxsw6XivYZbtIF5j0eZqkgkmdFBK972Ou01Wi5JywCeyy2lPQYmFlxZPKJEmFc0jKebvdV81Bsxr1b5iC/w4mXWgRpO9vu7d3AKpF7ejIAJFyDkgZkhpUZiVtyDk/acbBtgxJl8v+pBkzZ9ci5UY6butD6vqS6rYs8GLUE5DKs1jSlJIyShukf33XImVQ60nVgmZhEY4jFW9ylnSpAVJrutu9JC+7nYpi0tpTMm67HIcUnOP8pFSZtwJJVTOKlI7MCfOxAVqRavh52718r0naGT74MYz63vgpF6Scpn1I1RSTDnTj41klrfoh0of9/qGqjXTrSW185MS/zG2PH1Dsgo8i/Um1AUjxI2180jQrVmmWRpCGmT32GqS4y0g95P4M6Xq9Xa+tKGXZa/KaZdS88c+RYlNMGnYJKaaOz3WRVuleikm1wyE5HEjDpA6uOPzckrZzboWUyIBCUlw8qeZ8HARI85m0m1TjLtI8zye0Sou4lkF9VNABSM1bkK8wkZxizRVNgLQMXE2Vgpq2ZMOkMU98SHrmnAmS6o1lGogUhUlj9jEZkRQ3dVKKIJVwAZcDNnLlGXL/pFpNKOr46ZBG9H9qpM6/pPx9+kLoxkhjigO1VEImaHo6Wkntt3Fl5Uw4d0Oo45CS8z9SHRzAcFvBzC0uUzKgF5PidWrDbqOIfgA2Hh7wc3gqYwAAAABJRU5ErkJggg==";
  gameVariables.img.onload = () => {
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


