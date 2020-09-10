let flaps = 0;
const dropItem = (itemType) => {
  const item = document.createElement("div");
  if(itemType === 'rock') {
    item.setAttribute('class', 'rock dropped-item spin');
  } else {
    item.style.width = "26px";
    item.style.height = "33px";
    
    item.style.backgroundImage = `url(sprites.png)`;
    const x = `${gameVariables.SPRITE_WIDTH * gameVariables.SCALE * 13}px`;
    const y = `${gameVariables.SPRITE_HEIGHT * gameVariables.SCALE}px`;
    item.style.backgroundPosition = `${x} ${y}`;
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
  drawFrame(1, 1);
};

const layEgg = async () => {
  if (gameVariables.eggTimer === gameVariables.MAX_EGG_TIMER) {
    gameVariables.eggTimer = 0;
    gameVariables.eggTimerBar.style.width = "0%";
    gameVariables.layingEgg = true;
    for (fr of gameVariables.eggLoop) {
      drawFrame(fr, 1);
      await timeoutPromise(100);
    }
    gameVariables.layingEgg = false;
    gameVariables.eggLoopIndex = 0;
    const egg = document.createElement("div");
    egg.style.height = `${gameVariables.SPRITE_HEIGHT}px`;
    egg.style.width = `${gameVariables.SPRITE_WIDTH}px`;
    egg.style.background = "url(sprites.png)";
    const x = `${gameVariables.SPRITE_WIDTH * gameVariables.SCALE * 10}px`;
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
  if(current === 4) {
    const world = document.getElementById('world');
    world.style.display = 'none';
    const win = document.getElementById('win')
    win.style.display = 'block';
  } else {
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
  
    
    level++;
    localStorage.setItem('level', JSON.stringify(level));
  
    setTimeout(() => loadLevel(level),1500);
  }  
};

const handlePlayMusic = () => {     
  // Audio Library
  let zzfxM = (f,n,o,t=125)=>{let z,e,l,r,g,h,x,a,u,c,d,i,m,p,G,M,R=[],b=[],j=[],k=0,q=1,s={},v=zzfxR/t*60>>2;for(;q;k++)R=[q=a=d=m=0],o.map((t,d)=>{for(x=n[t][k]||[0,0,0],q|=!!n[t][k],G=m+(n[t][0].length-2-!a)*v,e=2,r=m;e<x.length+(d==o.length-1);a=++e){for(g=x[e],u=c!=(x[0]||0)|g|0,l=0;l<v&&a;l++>v-99&&u?i+=(i<1)/99:0)h=(1-i)*R[p++]/2||0,b[r]=(b[r]||0)+h*M-h,j[r]=(j[r++]||0)+h*M+h;g&&(i=g%1,M=x[1]||0,(g|=0)&&(R=s[[c=x[p=0]||0,g]]=s[[c,g]]||(z=[...f[c]],z[2]*=2**((g-12)/12),zzfxG(...z))))}m=G});return[b,j]};
  let zzfx = (...t)=>zzfxP(zzfxG(...t));
  let zzfxP = (...t)=>{let e=zzfxX.createBufferSource(),f=zzfxX.createBuffer(t.length,t[0].length,zzfxR);t.map((d,i)=>f.getChannelData(i).set(d)),e.buffer=f,e.connect(zzfxX.destination),e.start();return e}
  let zzfxG = (a=1,t=.05,h=220,M=0,n=0,s=.1,i=0,r=1,o=0,z=0,e=0,f=0,m=0,x=0,b=0,d=0,u=0,c=1,G=0,I=zzfxR,P=99+M*I,V=n*I,g=s*I,j=G*I,k=u*I,l=2*Math.PI,p=(a=>0<a?1:-1),q=P+j+V+g+k,v=(o*=500*l/I**2),w=(h*=(1+2*t*Math.random()-t)*l/I),y=p(b)*l/4,A=0,B=0,C=0,D=0,E=0,F=0,H=1,J=[])=>{for(;C<q;J[C++]=F)++E>100*d&&(E=0,F=A*h*Math.sin(B*b*l/I-y),F=p(F=i?1<i?2<i?3<i?Math.sin((F%l)**3):Math.max(Math.min(Math.tan(F),1),-1):1-(2*F/l%2+2)%2:1-4*Math.abs(Math.round(F/l)-F/l):Math.sin(F))*Math.abs(F)**r*a*zzfxV*(C<P?C/P:C<P+j?1-(C-P)/j*(1-c):C<P+j+V?c:C<q-k?(q-C-k)/g*c:0),F=k?F/2+(k>C?0:(C<q-k?1:(C-q)/k)*J[C-k|0]/2):F),A+=1-x+1e9*(Math.sin(C)+1)%2*x,B+=1-x+1e9*(Math.sin(C)**2+1)%2*x,h+=o+=500*z*l/I**3,H&&++H>f*I&&(h+=e*l/I,w+=e*l/I,H=0),m&&++D>m*I&&(h=w,o=v,D=1,H=H||1);return J};
  // Audio Volume
  let zzfxV = .1;
  // Audio Sample Rate
  let zzfxR = 44100;
  // Play the song (returns a AudioBufferSourceNode)
  // Common Audio Context
  let zzfxX = new(top.AudioContext||webkitAudioContext);
  let song = [[[1.8,0,72,,,.2,,4,-2,6,50,.15,,6],[,0,655,,,.09,3,1.65,,,,,.02,3.8,-.1,,.2],[1.2,0,23,,,.2,3,4,,,3,.9,.05,],[1.5,0,740,,,.15,2,.2,-.1,-.15,9,.02,,.1,.12,,.06]],[[[3,-1,13,13,13,8,13,,,,,,,,,,,,11,11,11,6,11,,,,,,,,,,,,10,10,10,6,10,,,,,,,,,6,8,10,8,8,8,5,13,,8,8,8,5,13,,,,,,],[,1,25,,25,,,,,,,,,,,,,25,25,,25,,,,,,,25,,,25,,25,25,25,,25,,,,,,,,,,,25,25,25,25,,25,,,,,,,,,,,,,,],[2,-1,13,,25,,13,13,25,13,,13,25,13,13,13,25,,13,,25,,13,13,25,13,,13,25,13,13,13,,,13,,25,,13,13,25,13,,13,25,13,13,13,25,,13,,25,,13,13,25,13,,13,25,13,13,13,25,,]],[[3,-1,13,13,13,8,13,,,,,,,,,,,,11,11,11,6,11,,,,,,,,,,,,10,10,10,6,10,,,,,,,,,6,8,10,8,8,8,5,13,,8,8,8,5,13,8,8,8,5,13],[2,-1,13,,25,,13,13,25,13,,13,25,13,13,13,25,27,11,,23,,11,11,23,11,,11,23,11,11,11,23,22,18,,30,,18,18,30,18,,18,30,18,18,18,30,22,13,,25,,13,13,25,13,,13,25,13,13,13,25,,],[,1,25,,25,,,,,,,,,,,,,25,25,,25,,,,,,,,,,,,,,25,,25,,,,,,,,,,,25,25,25,25,,25,,,,,,,,,,,,,,],[1,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,13,13,13,13,13,13,13,13]],[[3,-1,13,13,13,8,13,,13,15,17,17,15,13,20,20,18,17,18,,,,17,,15,,,,17,,18,,22,22,22,,18,,,,25,25,25,,22,,,18,20,22,20,,,,,,,,,,,,,,,,],[2,-1,13,,25,,13,13,25,13,,13,25,13,13,13,25,27,11,,23,,11,11,23,11,,11,23,11,11,11,23,22,18,,30,,18,18,30,18,,18,30,18,18,18,30,22,13,,25,,13,13,25,13,,13,25,13,13,13,25,,],[,1,25,,,,,,25,25,,25,25,,,,,,25,,,,,,25,25,,25,25,,,,,,25,,,,,,25,25,,25,25,,,,,,25,,,,,,25,25,,25,25,,,,,,],[1,1,,,,,13,,,,,,,,13,,,,,,,,13,,,,,,,,13,,13,,,,,,13,,,,,,,,13,,,,,,,,13,,,,,,,,13,13,,13]],[[3,-1,13,,25,,13,13,25,13,,13,25,13,13,13,25,,11,,23,,11,11,23,11,,11,23,11,11,11,23,,10,,22,,10,10,22,10,,10,22,10,10,6,8,10,20,25,20,20,25,20,,20,25,20,20,20,25,,20,,],[2,-1,13,,25,,13,13,25,13,,13,25,13,13,13,25,,13,,25,,13,13,25,13,,13,25,13,13,13,25,,13,,25,,13,13,25,13,,13,25,13,13,13,25,,13,,25,,13,13,25,13,,13,25,13,13,13,25,,],[,1,25,,,,,,25,25,,25,25,,,,,,25,,,,,,25,25,,25,25,,,,,,25,,,,,,25,25,,25,25,,,,,,25,,,,,,25,25,,25,25,,,,,,],[1,1,,,,,13,,,,,,,,13,,,,,,,,13,,,,,,,,13,,13,,,,,,13,,,,,,,,13,,,,,,,,13,,,,,,,,13,13,,13]],[[3,-1,13,,,,,,8,,17,15,13,,17,15,13,,15,,,,10,13,15,10,13,15,10,13,15,10,13,15,12,,,,,,8,15,,,,,17,15,13,8,13,,,,,,10,8,,20,20,20,20,20,20,20],[2,-1,13,,25,,13,13,25,13,,13,25,13,13,13,25,,15,,27,,15,15,27,15,,15,27,15,15,15,27,32,20,,32,,20,20,32,20,,20,32,20,20,20,32,,13,,25,,13,13,25,20,,20,32,20,20,20,32,,],[,1,25,,,,,,25,25,,25,25,,,,,,25,,,,,,25,25,,25,25,,,,,,25,,,,,,25,25,,25,25,,,,,,25,,,,,,25,25,,25,25,,,,,,],[1,1,,,,,13,,,,,,,,13,,,,,,,,13,,,,,,,,13,,13,,,,,,13,,,,,,,,13,,,,,,,,13,,,,,,,,13,13,,13]],[[3,-1,13,,,,,,8,,17,,,,18,17,15,,18,,,,13,,,,10,,,,6,,,,8,12,15,12,20,,8,12,15,12,20,,22,20,15,,13,,,,,,10,,8,,,,,8,20,8],[2,-1,13,,25,25,13,,25,25,13,,25,25,13,,25,25,15,,27,27,15,,27,27,15,,27,27,15,,27,27,20,,32,32,20,,32,32,20,,32,32,20,,32,32,13,,25,25,13,,25,25,20,,32,32,20,,32,34],[,1,25,,,,,,25,25,,25,25,,,,,,25,,,,,,25,25,,25,25,,,,,,25,,,,,,25,25,,25,25,,,,,,25,,,,,,25,25,,25,25,,,,,,],[1,1,,,,,13,,,,,,,,13,,,,,,,,13,,,,,,,,13,,13,,,,,,13,,,,,,,,13,,,,,,,,13,,,,,,,,13,13,,13]],[[3,-1,13,,,,,,8,,17,,,,18,17,15,,18,,,,13,,,,10,,,,6,,,,8,12,15,12,20,,8,12,15,12,20,,22,20,15,,13,,,,,,10,,8,,,,,8,20,8],[,1,25,,,,,,25,25,,25,25,,,,,,25,,,,,,25,25,,25,25,,,,,,25,,,,,,25,25,,25,25,,,,,,25,,,,,,25,25,,25,25,,,,,,],[1,1,,,,,13,,,,,,,,13,,,,,,,,13,,,,,,,,13,,13,,,,,,13,,,,,,,,13,,,,,,,,13,,,,,,,,13,13,,13]],[[,1,25,,,,,,25,25,,25,25,,,,,,25,,,,,,25,25,,25,25,,,,,,25,,,,,,25,25,,25,25,,,,,,25,,,,25,,,25,,,,25,25,25,25,25],[1,1,,,,,13,,,,,,,,13,,,,,,,,13,,,,,,,,13,,13,,,,,,13,,,,,,,,13,,,,,,,,13,13,,13,,13,13,13,13,13,13,13]]],[0,1,2,2,3,3,2,2,4,4,5,6,6,7,2,2,3],,];

  let mySongData = zzfxM(...song);
  gameVariables.myAudioNode = zzfxP(...mySongData);
}

window.handlePlayMusic = handlePlayMusic;

const gameLoop = async () => {
  if(!gameVariables.musicPlaying && !gameVariables.pauseMusic) {
    handlePlayMusic();
    gameVariables.musicPlaying = true;
  }
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
        dropItem("acorn");
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
      const owlX = `${62 * gameVariables.SCALE * 2}px`;
      const owlY = `${54 * gameVariables.SCALE}px`;
      const owl = document.getElementById('owl');
      owl.style.backgroundPosition = `${owlX} ${owlY}`;  
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
          drawFrame(3, 1);
          gameVariables.eggTimer = 0;
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
          drawFrame(8, 1);
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
        drawFrame(8, 1);
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
