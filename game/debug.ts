//DEBUG

(function () {
  let debugHUD = document.createElement('div');
  document.body.appendChild(debugHUD);
  let s = debugHUD.style;
  s.zIndex = '1000';
  s.position = 'absolute';
  s.right = '0';
  s.top = '0';
  s.background = 'rgba(0,0,0,0.3)';
  s.color = '#fff';
  s.padding = '0.5em';
  s.font = '10pt monospace';
  s.whiteSpace = 'pre';

  let fix3 = (n: number) => n !== undefined ? n.toFixed(1).padStart(5, ' ') : 'N/A';
  let fix = (n: number) => n !== undefined ? n.toFixed(1) : 'N/A';
  let int = (n: number) => n !== undefined ? n.toFixed(0) : 'N/A';


  let animStyle = (i) => ['nloop', ' loop', ' revr', ' ping', ' pong'][i];

  let hudTick = () => {

    let en = enemies.filter(e => e.anim == coinAnim)[0];

    let lines = [
      `guy: p${fix(guy.x)},${fix(guy.y)}, f${int(findFloor([guy.x, guy.y]))}`,
      `guystate: ${guy.state} d${fix3(guy.dx)},${fix3(guy.dy)}`,
      `guy fr:${guy.inst.frame} t:${fix3(guy.inst.time)} dur:${guy.anim.cels[guy.inst.frame].duration} m:${animStyle(guy.inst.loop)}`,
      `tile: ${floor(guy.x / 8)},${floor(guy.y / 8)}`,
      `camera: ${camera[0]},${camera[1]}`,
      `${fix3(1.0 / ds)}fps`,
    ]
      
    if (en) {
      lines = lines.concat(
        [
          `enmy fr:${en.inst.frame} t:${fix3(en.inst.time)} dur:${en.anim.cels[en.inst.frame].duration} m:${animStyle(en.inst.loop)}`,
          `enmy st:${en.state} tm:${fix3(en.timer)} hlt:${en.health}`,
        ])
    } 

    debugHUD.innerText = lines.join('\n');

    applyCamera();

    const debugCapsule = (c: Capsule, col: string) => {
      ctx.strokeStyle = col;
      //ctx.strokeRect(round(c.x - c.w) - 0.5, round(-c.y) - 0.5, round(c.w *   2), round(-c.h));
    }

    ctx.save();

    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1;
    ctx.imageSmoothingEnabled = false;

    let intersecting = false;
    enemies.forEach(e => {
      if (e.detect) {
        debugCapsule(e.detect, '#0aa');
      }
      if (!e.danger) {
        return;
      }
      if (intersectCapsules(e, guy.gardeCheck)) {
        intersecting = true;
      }
    })

    debugCapsule(guy, '#ff0');
    debugCapsule(guy.gardeCheck, intersecting ? '#009' : '#09f');
    enemies.forEach(e => {
      debugCapsule(e, '#ff0');
    })

    let attack = guy.attackBox;
    if (attack != 0) {
      debugCapsule(attack, '#f09');
    }

    ctx.restore();
    
    requestAnimationFrame(hudTick);
  }

  hudTick();
})()


//ENDDEBUG
