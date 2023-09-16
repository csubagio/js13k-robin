const round = Math.round;
const floor = Math.floor;
const ceil = Math.ceil;
const pow = Math.pow;
const abs = Math.abs;
const min = Math.min;
const max = Math.max;
const sin = Math.sin;
const cos = Math.cos;
const random = Math.random;
const clamp = (minx, maxx, x) => min(minx, max(maxx, x));
const PI = Math.PI;
const byteAt = (s, i) => s.charCodeAt(i);
let ds = 0;
let clck = 0;
function pick(arr) {
    return arr[floor(random() * arr.length)];
}
function pickIntRange(arr) {
    return round(arr[0] + (arr[1] - arr[0]) * random());
}
function randomRange(v0, v1) {
    return v0 + (v1 - v0) * random();
}
function repeat(count, fn) {
    for (let i = 0; i < count; ++i)
        fn(i);
}
function repeatXY(xc, yc, fn) {
    for (let y = 0; y < yc; ++y)
        for (let x = 0; x < xc; ++x)
            fn(x, y);
}
;
function intersectCapsules(a, b) {
    if (!(a && b)) {
        return false;
    }
    if (abs(b.x - a.x) > (a.w + b.w)) {
        return false;
    }
    if (b.y - a.y > a.h) {
        return false;
    }
    if (a.y - b.y > b.h) {
        return false;
    }
    return true;
}
function capsuleAhead(e, ox1, ox2) {
    let w = (ox2 - ox1) / 2;
    return { x: e.x + e.facing * (ox1 + w), y: e.y, w: abs(w), h: e.h };
}
function lerpInRange(from, to, v) {
    let t = (v - from) / (to - from);
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    return t * t * (3 - 2 * t);
}
function contains(arr, x) {
    return arr.indexOf(x) >= 0;
}
function globalAlph(alpha) {
    ctx.globalAlpha = alpha;
}
function fillStyl(styl, c) {
    (c || ctx).fillStyle = styl;
}
function drawImage(img, x, y) {
    ctx.drawImage(img, x, y);
}
const get2DContext = (ctx) => ctx.getContext('2d');
const noop = () => { };
// zzfx() - the universal entry point -- returns a AudioBufferSourceNode
const zzfx = (...t) => zzfxP(zzfxG(...t));
// zzfxP() - the sound player -- returns a AudioBufferSourceNode
const zzfxP = (...t) => { let e = zzfxX.createBufferSource(), f = zzfxX.createBuffer(t.length, t[0].length, zzfxR); t.map((d, i) => f.getChannelData(i).set(d)), e.buffer = f, e.connect(zzfxX.destination), e.start(); return e; };
// zzfxG() - the sound generator -- returns an array of sample data
const zzfxG = (q = 1, k = .05, c = 220, e = 0, t = 0, u = .1, r = 0, F = 1, v = 0, z = 0, w = 0, A = 0, l = 0, B = 0, x = 0, G = 0, d = 0, y = 1, m = 0, C = 0) => { let b = 2 * Math.PI, H = v *= 500 * b / zzfxR ** 2, I = (0 < x ? 1 : -1) * b / 4, D = c *= (1 + 2 * k * Math.random() - k) * b / zzfxR, Z = [], g = 0, E = 0, a = 0, n = 1, J = 0, K = 0, f = 0, p, h; e = 99 + zzfxR * e; m *= zzfxR; t *= zzfxR; u *= zzfxR; d *= zzfxR; z *= 500 * b / zzfxR ** 3; x *= b / zzfxR; w *= b / zzfxR; A *= zzfxR; l = zzfxR * l | 0; for (h = e + m + t + u + d | 0; a < h; Z[a++] = f)
    ++K % (100 * G | 0) || (f = r ? 1 < r ? 2 < r ? 3 < r ? Math.sin((g % b) ** 3) : Math.max(Math.min(Math.tan(g), 1), -1) : 1 - (2 * g / b % 2 + 2) % 2 : 1 - 4 * Math.abs(Math.round(g / b) - g / b) : Math.sin(g), f = (l ? 1 - C + C * Math.sin(2 * Math.PI * a / l) : 1) * (0 < f ? 1 : -1) * Math.abs(f) ** F * q * zzfxV * (a < e ? a / e : a < e + m ? 1 - (a - e) / m * (1 - y) : a < e + m + t ? y : a < h - d ? (h - a - d) / u * y : 0), f = d ? f / 2 + (d > a ? 0 : (a < h - d ? 1 : (h - a) / d) * Z[a - d | 0] / 2) : f), p = (c += v += z) * Math.sin(E * x - I), g += p - p * B * (1 - 1E9 * (Math.sin(a) + 1) % 2), E += p - p * B * (1 - 1E9 * (Math.sin(a) ** 2 + 1) % 2), n && ++n > A && (c += w, D += w, n = 0), !l || ++J % l || (c = D, v = H, n = n || 1); return Z; };
// zzfxV - global volume
const zzfxV = .3;
// zzfxR - global sample rate
const zzfxR = 44100;
// zzfxX - the common audio context
const zzfxX = new window.AudioContext;
const audioContext = new AudioContext();
let guitarNaturalTuning = [82, 110, 147, 196, 247, 330, 1000];
let workletCode = `data:text/javascript,class r extends AudioWorkletProcessor{constructor(r){super(),this.o=r.processorOptions.t.map((r=>{let s=0|44e3/r,e={i:new Float32Array(s),h:0,u:0,l:r,v:s,M:0};return e.i.fill(0),e})),this.port.onmessage=r=>{let[s,e]=r.data;s.map(((r,s)=>{if(+r===r){let t=this.o[s],a=0|44e3/(t.l*Math.pow(1.059,r));t.h=0,t.u=a,t.M=0;let o=t.i;o.map(((r,s)=>{o[s]=(e||1)*(2*Math.random()-1)}))}}))}}process(r,s,e){return s[0].map((r=>{r.map(((s,e)=>{r[e]=0,this.o.map((s=>{let t=s.i[s.h];s.h=++s.h%s.v,t=(t+s.i[s.h])/2*.997,s.u=++s.u%s.v,s.i[s.u]=t,s.M++,r[e]+=t*Math.min(1,s.M/500)}))}))})),!0}}registerProcessor("G",r)`;
async function startGuitar() {
    await audioContext.audioWorklet.addModule(workletCode);
    let guitar = new AudioWorkletNode(audioContext, "G", { processorOptions: { "t": guitarNaturalTuning } });
    guitar.connect(audioContext.destination);
    return guitar;
}
let guitarRequests = [];
function guitarClearRequests() {
    guitarRequests = [];
}
function guitarPluck(guitar, strings, intensity) {
    //audioContext.resume();
    guitarRequests.push([guitarBeat + 1, guitar, strings, intensity]);
}
let guitars = [];
(async () => {
    guitars[0] = await startGuitar();
    guitars[1] = await startGuitar();
})();
let chordG = [3, 2, 0, 0, 0, 3];
let chordF = [1, 3, 3, 2, 1, 1];
let chordBm = [, 1, 3, 3, 2, 1];
let chordGm = [1, 3, 3, 1, 1, 1];
let chordEm7 = [0, 2, 0, 0, 0, 0];
let chordAm = [0, 0, 2, 2, 1, 0];
let activeChord = chordG;
function strumSingle(chord, string) {
    let strum = [];
    strum[string] = chord[string];
    return strum;
}
function strumSeveral(chord, strings) {
    let strum = [];
    strings.map((n, string) => n ? strum[string] = chord[string] : 0);
    return strum;
}
function guitarSingleString(guitar, strings, intensity = 0.5) {
    let string = pick(strings);
    guitarPluck(guitar, strumSingle(activeChord, string), intensity);
}
function guitarTwoStrings(guitar, intensity = 0.5) {
    let strings = pick([[0, 4], [1, 3], [2, 4]]);
    let strum = [];
    strings.map(s => strum[s] = activeChord[s]);
    guitarPluck(guitar, strum, intensity);
}
function guitarRaiseChord(guitar, chord) {
    let b = guitarBeat;
    repeat(6, i => { guitarRequests.push([b, guitar, strumSingle(chord, i), 1]); b += 4; });
}
function guitarArp(guitar, chord) {
    let b = guitarBeat;
    repeat(6, i => { guitarRequests.push([b, guitar, strumSingle(chord, 5 - i), 1]); b += 4; });
    repeat(6, i => { guitarRequests.push([b, guitar, strumSingle(chord, i), 1]); b += 2; });
}
function guitarSchedule(chord, strum, delay, intensity) {
    guitarRequests.push([guitarBeat + delay, 1, strum, intensity, chord]);
}
let jangleTime = 0;
function guitarJangle(chord, repeats) {
    repeat(repeats, () => {
        guitarSchedule(chord, strumSingle(chord, 0), jangleTime, 0.2);
        jangleTime += 7;
        guitarSchedule(chord, strumSeveral(chord, [, , 1,]), jangleTime, 0.2);
        jangleTime++;
        guitarSchedule(chord, strumSeveral(chord, [, , , 1, 1, 1]), jangleTime, 0.2);
        jangleTime += 8;
        guitarSchedule(chord, strumSingle(chord, 1), jangleTime, 0.2);
        jangleTime += 7;
        guitarSchedule(chord, strumSeveral(chord, [, , 1,]), jangleTime, 0.2);
        jangleTime++;
        guitarSchedule(chord, strumSeveral(chord, [, , , 1, 1, 1]), jangleTime, 0.2);
        jangleTime += 8;
    });
}
let guitarPeriod = 0.05;
let guitarBeat = 0;
let guitarTime = 0;
function guitarBeater() {
    guitarTime -= ds;
    if (guitarTime < 0) {
        guitarTime += guitarPeriod;
        guitarBeat++;
        guitarRequests = guitarRequests.filter(g => {
            if (g[0] > guitarBeat)
                return true;
            //console.log(g[2])
            guitars[g[1]].port.postMessage([g[2], min(0.1, 0.1 * g[3])]);
            if (g[4]) {
                activeChord = g[4];
            }
            return false;
        });
    }
}
let illctx;
function makeIllustration(w, h) {
    let cnvs = new OffscreenCanvas(w, h);
    let ctx = get2DContext(cnvs);
    ctx.imageSmoothingEnabled = false;
    illctx = ctx;
    //illctx.filter = 'blur(1px)'
    return { cnvs, ctx };
}
function circle(color, x, y, r) {
    illctx.beginPath();
    fillStyl(cssPalette[color], illctx);
    illctx.arc(x, y, r, 0, 6.3);
    illctx.fill();
}
function rect(color, x, y, w, h) {
    fillStyl(cssPalette[color], illctx);
    illctx.fillRect(x, y, w, h);
}
const instructions = [
    "PRESS SPACE TO START",
    "PRESS <> TO MOVE",
    "PRESS ^ TO JUMP",
    "EXIT AT THE GATE",
    "APPROACH TO ENGAGE",
    "PRESS SPACE TO LUNGE",
    "WHEN ATTACKED, PRESS ^ TO PARRY",
    "PRESS # TO FEINT, ENEMY MIGHT FLINCH",
    "PRESS ^ IN AIR TO JUMP ONCE AGAIN"
];
let instructionsCapture = [];
let instructionsComplete = [];
let showingInstruction = -1;
function reportEvent(event) {
    instructionsComplete[event] = true;
    if (showingInstruction === event) {
        dialogClear();
    }
}
function instructionsSnapshot() {
    instructionsCapture = instructionsComplete.slice(0);
}
function instructionsRestore() {
    instructionsComplete = instructionsCapture.slice(0);
}
function instructionsShow(need) {
    if (dialogIsComplete()) {
        need.map(i => {
            if (showingInstruction === -1 && !instructionsComplete[i]) {
                makeDialog(`|${instructions[i]}|2`);
                showingInstruction = i;
            }
        });
    }
}
const cameraTarget = [0, 0];
const cameraIntermediate = [0, 0];
const camera = [0, 0];
function resetTransform() {
    ctx.resetTransform();
}
function cameraSetTarget(x, y) {
    cameraTarget[0] = x;
    cameraTarget[1] = y;
}
function cameraCutTo(x, y) {
    cameraIntermediate[0] = cameraTarget[0] = x;
    cameraIntermediate[1] = cameraTarget[1] = y;
}
function cameraUpdate() {
    cameraIntermediate[0] += (cameraTarget[0] - cameraIntermediate[0]) * (1 - pow(0.001, ds));
    cameraIntermediate[1] += (cameraTarget[1] - cameraIntermediate[1]) * (1 - pow(0.01, ds));
    camera[0] = round(cameraIntermediate[0]) - screenWidth / 2;
    camera[1] = -round(cameraIntermediate[1]) + screenHeight / 2;
}
function applyCamera() {
    resetTransform();
    ctx.translate(-camera[0], 80 - camera[1]);
}
function applyCameraPos(x, y) {
    applyCamera();
    ctx.translate(round(x), round(-y));
}
function applyCameraParallax(x, y) {
    resetTransform();
    ctx.translate(round(-camera[0] * x), round(80 - camera[1] * y));
}
function flipHorizontal() {
    ctx.scale(-1, 1);
}
function unpackBytes(data) {
    const binstring = atob(data);
    const bin = binstring.split('').map(c => byteAt(c, 0));
    return bin;
}
function makeAnim(data) {
    const bin = unpackBytes(data);
    const cels = [];
    let i = 0;
    while (i < bin.length) {
        let x = 0, y = 0, w = 0, h = 0, dur = 0;
        x = bin[i++];
        y = bin[i++];
        w = bin[i++];
        h = bin[i++];
        dur = bin[i++];
        const cel = { x, y, dur, planes: [] };
        cels.push(cel);
        const bitDepth = bin[i++];
        const colorCount = pow(2, bitDepth);
        let colors = [];
        if (bitDepth === 1) {
            colors = [palette[bin[0]], palette[bin[i++]]];
        }
        else {
            repeat(colorCount, (ii) => colors[ii] = palette[bin[i++]]);
        }
        const bitMask = (1 << bitDepth) - 1;
        const { cnvs, ctx } = makeIllustration(w, h);
        const plane = { cnvs };
        cel.planes.push(plane);
        const byteCount = ceil(w * h / 8 * bitDepth);
        const img = ctx.getImageData(0, 0, w, h);
        const data = img.data;
        let di = 0;
        repeat(byteCount, (imgbi) => {
            let byte = bin[i++];
            repeat(8 / bitDepth, (biti) => {
                let set = (byte >> (biti * bitDepth)) & bitMask;
                let cc = colors[set];
                data[di] = cc[0];
                data[di + 1] = cc[1];
                data[di + 2] = cc[2];
                data[di + 3] = set ? 255 : 0;
                di += 4;
            });
        });
        ctx.putImageData(img, 0, 0);
    }
    return { cels };
}
function recolorCel(cel, colorIndex) {
    cel.planes.map(p => {
        let cnvs = p.cnvs;
        let ctx = get2DContext(cnvs);
        let [w, h] = [cnvs.width, cnvs.height];
        let img = ctx.getImageData(0, 0, w, h);
        let data = img.data;
        let color = palette[colorIndex];
        repeatXY(w, h, (x, y) => {
            let i = 4 * (y * w + x);
            if (data[i + 3]) {
                data[i] = color[0];
                data[i + 1] = color[1];
                data[i + 2] = color[2];
                data[i + 3] = 255;
            }
        });
        ctx.putImageData(img, 0, 0);
    });
}
function recolorCels(anim, colorIndex) {
    anim.cels.map(c => recolorCel(c, colorIndex));
}
function fillCel(cel, colorIndex) {
    cel.planes.map(p => {
        let cnvs = p.cnvs;
        let ctx = get2DContext(cnvs);
        let [w, h] = [cnvs.width, cnvs.height];
        let img = ctx.getImageData(0, 0, w, h);
        let data = img.data;
        let color = palette[colorIndex];
        let base = (x, y) => 4 * (y * w + x);
        repeatXY(w, h, (x, y) => {
            let inside = 0;
            for (let xx = x - 1; xx >= 0; --xx) {
                if (data[base(xx, y) + 3]) {
                    inside += 1;
                    break;
                }
            }
            for (let xx = x + 1; xx < w; ++xx) {
                if (data[base(xx, y) + 3]) {
                    inside += 1;
                    break;
                }
            }
            for (let yy = y - 1; yy >= 0; --yy) {
                if (data[base(x, yy) + 3]) {
                    inside += 1;
                    break;
                }
            }
            for (let yy = y + 1; yy < h; ++yy) {
                if (data[base(x, yy) + 3]) {
                    inside += 1;
                    break;
                }
            }
            let i = base(x, y);
            if (inside == 4 && !data[i + 3]) {
                data[i] = color[0];
                data[i + 1] = color[1];
                data[i + 2] = color[2];
                data[i + 3] = 255;
            }
        });
        ctx.putImageData(img, 0, 0);
    });
}
function fillCels(anim, colorIndex) {
    anim.cels.map(c => fillCel(c, colorIndex));
}
function makeAnimInstance(rnge, styl) {
    let frm = pickIntRange(rnge);
    let tme = random() * 100;
    return {
        rnge, styl, frm, tme
    };
}
function animInstanceTick(anim, inst) {
    let dur = anim.cels[inst.frm]?.dur;
    inst.tme += ds * 100;
    if (inst.tme >= dur) {
        inst.tme -= dur;
        if (contains([4 /* AnimStyle.PingPongReverse */, 2 /* AnimStyle.LoopReverse */, 5 /* AnimStyle.NoLoopReverse */], inst.styl)) {
            inst.frm--;
        }
        else {
            inst.frm++;
        }
        if (inst.frm > inst.rnge[1]) {
            inst.onLoop?.();
            [
                // NoLoop
                () => {
                    inst.frm = inst.rnge[1];
                    inst.tme = dur;
                },
                // Loop
                () => {
                    inst.frm = inst.rnge[0];
                },
                // LoopReverse
                noop,
                // PingPong
                () => {
                    inst.frm = inst.rnge[1] - 1;
                    inst.styl = 4 /* AnimStyle.PingPongReverse */;
                },
                // PingPongReverse
                noop,
                // NoLoopReverse
                noop
            ][inst.styl]();
        }
        if (inst.frm < inst.rnge[0]) {
            [
                // NoLoop
                noop,
                // Loop
                noop,
                // LoopReverse
                () => inst.frm = inst.rnge[1],
                // PingPong
                noop,
                // PingPongReverse
                () => {
                    inst.frm = inst.rnge[0] + 1;
                    inst.styl = 3 /* AnimStyle.PingPong */;
                },
                // NoLoopReverse
                () => {
                    inst.frm = inst.rnge[0];
                }
            ][inst.styl]();
        }
    }
}
function drawAnim(anim, frm, x, y) {
    let cel = anim.cels[frm];
    cel.planes.map(p => {
        drawImage(p.cnvs, round(cel.x + x), round(cel.y + y));
    });
}
function animInstanceSetRange(inst, rnge, styl) {
    inst.rnge = rnge;
    if (inst.frm < inst.rnge[0] || inst.frm > inst.rnge[1]) {
        inst.frm = rnge[0];
    }
    inst.styl = styl;
}
function animInstanceResetRange(inst, rnge, styl) {
    inst.rnge = rnge;
    inst.frm = rnge[0];
    inst.styl = styl;
    inst.tme = 0;
}
function animIsFinished(e) {
    let dur = e.anim.cels[e.inst.frm].dur;
    return e.inst.frm >= e.inst.rnge[1] && e.inst.tme >= dur;
}
function animIsRelativeFrame(inst, frm) {
    return (inst.frm - inst.rnge[0]) === frm;
}
let tilemap;
let tilePlanes = [];
const DeathFloor = -100;
function tilemapsClear() {
    tilemap = undefined;
    tilePlanes = [];
}
function makeTilemap(wdth, hight) {
    let t = { wdth, hight, tiles: [] };
    repeatXY(wdth, hight, (x, y) => {
        t.tiles[y * wdth + x] = { index: -1, collision: 0 /* CollisionType.None */ };
    });
    tilemap = t;
    return t;
}
function tilePut(x, y, indices, collision) {
    let tile = tilemap.tiles[y * tilemap.wdth + x];
    tile.index = pickIntRange(indices);
    tile.collision = collision;
}
function tileHLine(height, start, end, indices, collision) {
    let x = start;
    for (; x < end; ++x) {
        let tile = tilemap.tiles[height * tilemap.wdth + x];
        tile.index = pickIntRange(indices);
        tile.collision = collision;
    }
}
function tileVLine(x, start, height, indices, collision) {
    let y = start;
    let end = start + (height <= 0 ? tilemap.hight - 1 : height);
    for (; y <= end; ++y) {
        let tile = tilemap.tiles[y * tilemap.wdth + x];
        tile.index = pickIntRange(indices);
        tile.collision = collision;
    }
}
function tilePillar(x, y, h, lower, upper, collision = 2 /* CollisionType.Solid */) {
    tileVLine(x, y, h - 1, lower, collision);
    tilePut(x, y + h - 1, upper, collision);
}
function worldToTileCoords(pos) {
    return [floor(pos[0] / 8), floor(pos[1] / 8)];
}
function clampToTilemapBounds(pos) {
    if (!tilemap) {
        return pos;
    }
    return [clamp(0, tilemap.wdth * 8, pos[0]), clamp(0, tilemap.hight * 8, pos[1])];
}
function getCollision(pos) {
    if (!tilemap) {
        return 0 /* CollisionType.None */;
    }
    let tp = worldToTileCoords(pos);
    let tile = tilemap.tiles[tp[1] * tilemap.wdth + tp[0]];
    if (!tile) {
        return 0 /* CollisionType.None */;
    }
    return tile.collision;
}
function findFloor(pos) {
    if (!tilemap) {
        return 0;
    }
    let x = floor(pos[0] / 8);
    if (x < 0 || x >= tilemap.wdth) {
        return DeathFloor;
    }
    let y = floor((pos[1]) / 8);
    let tile = tilemap.tiles[y * tilemap.wdth + x];
    if (tile && contains([2 /* CollisionType.Solid */], tile.collision)) {
        return DeathFloor;
    }
    for (; y >= 0; --y) {
        tile = tilemap.tiles[y * tilemap.wdth + x];
        if (tile && contains([1 /* CollisionType.Floor */, 2 /* CollisionType.Solid */], tile.collision)) {
            let fl = y * 8 + 8;
            if (fl < pos[1] + 0.05) {
                return fl;
            }
        }
    }
    return DeathFloor;
}
function effectTile(x, y, rnge, parallax) {
    tilePlanes.push({
        parallax: parallax || [1, 1],
        x, y,
        effectTile: { rnge: rnge, frm: pickIntRange(rnge), tme: 0 }
    });
}
function moveHorizontalAgainstTilemap(x, y, w, dx) {
    if (!tilemap) {
        return x;
    }
    let cox = x + dx;
    let ox = x + dx + (dx < 0 ? -w : w);
    x -= dx * 0.001;
    let tx = floor(x / 8);
    let otx = floor(ox / 8);
    if (tx === otx) {
        return cox;
    }
    let ty = floor(y / 8);
    if (ty < 0) {
        return cox;
    }
    if (tx > otx) {
        while (tx !== otx) {
            tx--;
            if (tx < 0)
                return w;
            let tile = tilemap.tiles[ty * tilemap.wdth + tx];
            if (tile.collision === 2 /* CollisionType.Solid */) {
                return tx * 8 + 8 + w;
            }
        }
    }
    else {
        while (tx !== otx) {
            tx++;
            if (tx >= tilemap.wdth)
                return tilemap.wdth * 8 - w;
            let tile = tilemap.tiles[ty * tilemap.wdth + tx];
            if (tile.collision === 2 /* CollisionType.Solid */) {
                return tx * 8 - w;
            }
        }
    }
    return cox;
}
let tiles;
let parallax = [1, 1];
function drawTile(cid, x, y) {
    applyCameraParallax(parallax[0], parallax[1]);
    let cel = tiles.cels[cid];
    drawImage(cel.planes[0].cnvs, x * 8 + cel.x, y * -8 + cel.y - 8);
}
function tilemapDraw() {
    tilePlanes.forEach(p => {
        parallax = p.parallax;
        let tm = p.tilemap;
        if (tm) {
            repeatXY(tm.wdth, tm.hight, (x, y) => {
                let tile = tm.tiles[y * tm.wdth + x];
                if (tile && tile.index >= 0) {
                    drawTile(tile.index, p.x + x, p.y + y);
                }
            });
        }
        let ill = p.illustration;
        if (ill) {
            applyCameraParallax(parallax[0], parallax[1]);
            ctx.scale(1, -1);
            drawImage(ill.cnvs, p.x, p.y);
        }
        let eff = p.effectTile;
        if (eff) {
            eff.tme += ds * 100;
            let dur = tiles.cels[eff.frm].dur;
            if (eff.tme > dur) {
                eff.tme -= dur;
                eff.frm++;
                if (eff.frm > eff.rnge[1]) {
                    eff.frm = eff.rnge[0];
                }
            }
            drawTile(eff.frm, p.x, p.y);
        }
    });
}
function composeTiles(tiles, ox, oy, w, h, indices) {
    let cnvs = new OffscreenCanvas(w * 8, h * 8);
    let ctx = get2DContext(cnvs);
    //ctx.strokeStyle = '#f00';
    //ctx.strokeRect(0, 0, w * 8, h * 8);
    let i = 0;
    repeatXY(w, h, (x, y) => {
        let tile = tiles.cels[indices[i++]];
        ctx.drawImage(tile.planes[0].cnvs, x * 8 + tile.x, y * 8 + tile.y);
    });
    return {
        x: ox, y: oy, dur: 100, planes: [{ cnvs: cnvs }]
    };
}
const palette = [];
const cssPalette = [];
function loadPalette() {
    let bin = unpackBytes(paletteData);
    repeat(bin.length / 3, (i) => {
        let c = bin.slice(i * 3, i * 3 + 3);
        palette.push(c);
        cssPalette.push(`rgb(${c.join(',')})`);
    });
}
const paletteData = "IRgbcmdrR0FrbIxQ49JF+KRet0hGTigumkB+qspT+fXvmZ7XkWxSIzkq3b6L";
loadPalette();
const guyData = "DAkIDwUCAAMFBxAAQABAAFAB8AvwCqAKkAZUhVEVQgXMD/A/ADAAwA0JBw8FAgADBQcFAARABfALvAKqABpQhVQFVUA/4A/AAwADwAANCAUQBQIAAwUHBERABb+8ogoKVFRRBRXc/MIDDAwNCAYQBQIAAwUHBQABVMAvvIIqoAAVVEEVVIn/8A8/MMAADQgGEAUCAAMFBwFAABBABfzCK6gCClRRFVVZFfID/8wzAA0IBRAMAgADBQcFQEAFv7yiCgpVVFFFFf7wwAMzzA0IBRAMAgADBQcBEAABFfzyiiooVFFFFVX4wwMzzA0KBQ4MAgADBQcFQEAFv7yiShpVVFGFPzwwwwwNCQUPDAIAAwUHBERABb+8okoaVVRRhT888MAMMwoHCg8KAgADBQcABQBUAQC/APAKAKoAlQJEVSBQFQAVBVCBAD0A9AMwDwD8AMAAAAsHCQ8KAgADBQdQAQAVAPwC8AqAKkApQFVBUBVCBQEVCPUA8APMA8APAAMACgULEQoCAAMFBwABAAABAEAAAFQAAL8AwCsAoApApQFEVYFAFQFQAQL0AwD/A8DDAPAwADAAAAwACwULEQoCAAMFBxAAABAAABAAABUAwC8A8AoAqAJAaQFUFUVQBShUAAD9AMD/APAwADwMAAwAAAMACwgQEBACAAMFB1AAAAAAAQAAQAUAAMIvAEDBKwAUgSpAAQQKoABQFQUAQFUAAEAVAABABQAAwA8AAMAwAADAwAAAMMAAAAzAAAALCBAQEAIAAwUHEAAAAEAAAAAAAQAAQgUAQMEvABTBK0ABhCqgAFAaBQBAVQAAQBUAAEAFAADADwAAwDAAAMDAAAAwwAAADMAAAAsJEA8QAgADBQdQAAAAAAEAAEAFAADCLwBAwSsAFIEqQAEECqAAUBoFAEBVAABAFQAAQAUAAMAwAADAwAAAwMAAADzAAAALCBAQDQIAAwUHUAAAAAABAABABQAAwi8AQMErABSBKkABBAqgAFAVBQBAVQAAQBUAAEAFAADADwAAwDAAAMDAAAAwwAAADMAAAAoHERENAgADBQcABAAAAEQAAABABQAAAL8AQAK8AlAEoAoUQIACKABUFQUAAFUBAABUAQAAUAEAAMAPAAAA/wAAAAwMAAAMwAAADAAMAAwAAAAACgcREQ0CAAMFB0AAAAAABAAAAEAAAABABQAACL8AABG8AkBBoApQAAQKoABAVRQAAFQFAABQBQAAQAUAAAA/AAAADAMAAAwwAAAPwAAAAwADAAAMChQOCgIAAwUHAEABAAAAVQUAAAD8LwAAAPArAAAKoCoAAFSACgAAUFVVVlUAVQUAAEBVAAAAAP8AAADA/wMAAPDADwAAPAAPAAAMAAwAAA0KEw4KAgADBQcAVAAAAABUAAAAAL8AAADAKwAAAqAKAAAFoAAAAFRVWVUBVAUAAAAVAAAAwA8AAAD8DwAAwAAMAAAMAAMAwADAAAAACQgLEA8CAAMFB0ABAFQBAPwCAK8AgCoAgAIAVVVRVYECFQRARQDwBwBMAwDDAMDAAAwwAAMwDAkIDwgCAAMFB1UAUAP0CrAKoAuAAlAFVBVERWAlwD/AMMDwwADwAAwICBAIAgADBQdUAFED9AqwCqALoAuAAlAFVBVERWAlwD/AMMDwwADwAAwICBAIAgADBQdVAFAD9AqwCqALgAJQBVQVREVgJcAPwD/AMMDwwADwAAwHCBEIAgADBQcBAFQAUAP0CrAKoAugC4ACUAVUFURFYCXAP8AwwPDAAPAACgkSEQoCAAMFBwAFAAAAAAEAAABUAAAAwC8AAAK8AgBAgSoAEEClAQAAQFUAVABUBQAAQFUJVQD8aEEFMDBVAQADXFUBDMBVVTAAU1UBAABVAQAAUAAACggJEBQCAAMFBwABABEAUAHALwKvBKhCgAJUFQBVAVQFUBXAjwBDAUMNTDFMwQkGEhIUAgADBQcAAAABAAAAUAAAAEAVAAEAVAFAAFBVABAAVRVABVRVAPyCVgDAK5VABahWQFVQWgAAQFABAFQCFQAABVABAADA/wNAAAMwAAAwAAwAwADAAAALBQkTHgIAAwUHAAABAAQAEAVAQABBBQS/ILxCoAoBCgFVAVEBRAUEFSD8ADAMMMDAAAwDMA==";
const guyTags = {
    run: [0, 4],
    idle: [5, 8],
    jump: [9, 10],
    fall: [11, 12],
    garde: [13, 15],
    advance: [16, 18],
    lunge: [19, 20],
    draw: [21, 21],
    victory: [22, 25],
    feint: [26, 27],
    parry: [28, 29],
};
const guyAnim = makeAnim(guyData);
const fontData = "AAABBgoBBS8AAAQDCgEFqgUAAAYGCgEFDMO0HgMAAAUFCgEG6n9HAAAABQUKAQeqRkUAAAAEBgoBBVKltQAAAgIKAQUGAAADBgoBBVQiAgAAAwYKAQURqQAAAAQGCgEF////AAIDAwoBBboAAAQCAgoBBQYAAwMBCgEFBwAFAQEKAQUBAAADBgoBBaSUAAAAAwYKAQVqWwEAAAMGCgEFk6QDAAADBgoBBaOTAwAAAwYKAQWjyAEAAAMGCgEFrUkCAAADBgoBBc/IAQAAAwYKAQXOWgEAAAMGCgEFJ0kCAAADBgoBBapaAQAAAwYKAQWqyQEAAQEECgEFCQABAQUKAQUZAAAFBgoBBUT8LwgAAQMDCgEFxwEAAAUGCgEFBP2PCAAAAwYKAQUvBQEAAAQGCgEFn93xAAAEBgoBBZf5mQAABAYKAQWXefkAAAQGCgEFHhHhAAAEBgoBBZeZeQAABAYKAQUfF/EAAAQGCgEFHxcRAAAEBgoBBR6deQAABAYKAQWZn5kAAAMGCgEFl6QDAAADBgoBBSbZAwAABAYKAQWZNZUAAAQGCgEFERHxAAAFBgoBBXHXWisAAAUGCgEFcdaaIwAABQYKAQUuxhgdAAAEBgoBBZd5EQAABQYKAQUuxpgsAAAEBgoBBZd5mQAABAYKAQUeYfgAAAUGCgEFnxBCCAAABAYKAQWZmWkAAAUGCgEFMSpFCAAABQYKAQUxxlodAAAFBgoBBVERoiIAAAUGCgEFMUZHCAAABAYKAQXPJPMAAAMGCgEFT5IDAAADBgoBBYlEAgAAAwYKAQUnyQMAAAYGCgEFjNcyDAM=";
const fontAnim = makeAnim(fontData);
const forestTilesData = "AAAICAoBCf/M//+dDQQEAAAIBwoBCf9s///95iYAAAgICgEJ/7T/7/l5ODACAAQIAAEM73///gAACAgAAQ7//3z/P348PAACCAYKAQ0gtf////8AAAgHCgEBPH7w7l8/fgAACAgKAQF27w9g/v//fgAACAgKAQE4fH7+/fvnXgAGCAIKAQFm9wAACAgKAQEpOekpLykpKQAACAgKAQFA4EBETkTk/wAACAgKAQ3//////////w==";
const forestTilesTags = {
    ground: [0, 2],
    stump: [3, 3],
    stumpCap: [4, 4],
    grass: [5, 5],
    stone: [6, 7],
    stoneCap: [8, 8],
    stoneTrim: [9, 9],
    gate: [10, 10],
    gateCap: [11, 12],
    solidGrass: [12, 12],
};
const forestTilesAnim = makeAnim(forestTilesData);
const dummyData = "CggKERkBBThQwQcXOEAIIW58TAADBCCAAAQYQAAJBw0SGQEF4AAqwAe4AA6AIDjDH0cACAADIAAEAAEwAASAABAACwgOERkBBeAAVAAVwAcwAUwADtzn+AcQAAwAAUAACAADgAAgAAkFDhRkAQUAB6ACqAA+gAvgA3AA4PcPfgAEgAEgAAQAAUAAIAAYAAgAAggICREPAQXgQMOHDHkyO3hAwEBGBAggYIAAAQcODQsPAQUAyDd9w0r4sTJCRnAQAANAAAgGEhAHDwEFDgC/gdVCn0QZNhkEDgQEERMIDwEFDgCoAEAFAD4YkQGJr4w4RhggAgISFgcPAQUOAMAHAPABAnwAARViwEeQ6SyEAQ==";
const dummyTags = {
    idle: [0, 2],
    hit: [3, 3],
    death: [4, 8],
};
const dummyAnim = makeAnim(dummyData);
const targetData = "CQgNEAoBCOABQiATkkStlKlKVamVulKXabUuyck8woffCQkODwoBCEAA6ABBICcIEmVFnQr9WnW1rtlr8mQewge/AQ==";
const targetTags = {
    idle: [0, 0],
    hit: [1, 1],
};
const targetAnim = makeAnim(targetData);
const coinData = "DRAGCAoBBIwUtmkoMQ4QBAgKAQTW/b9rDxACCAoBBP//";
const coinTags = {
    idle: [0, 2],
};
const coinAnim = makeAnim(coinData);
const portraitData = "AAAWGQoBBADgAIA/APgegJ8H4MEBEGAAdAuAkQBgAAEYwAD2N4D9D8DDA/B/APgPcP4b4jxZMEAIEAgg+CEAAAAAAAB3dQDVFTBXBQAAFhkKAQQA4ACAPwD4HoCfB+DBARBgAHQLgJEAYAABGMAA9jeADQ/AwwPweQD4D3D+G+I8WTBACBAIIPghAAAAAAAAd3UA1RUwVwUBAhMXCgEEwAYAXwAMBDBAgLgDICBASAEBCChAQAAChBEgjIADDv77+OEvL56QYwAIAEAAAADA1RWkYiB3BQECExcKAQTABgBfAAwEMECAuAMgIEBIAQEIKEBAAALEESCAgAMO/vv44S8vnpBjAAgAQAAAAMDVFaRiIHcFAQAUGQoBBIA/AP4P8P8BBxAwPwD4FxgA4gRoJ7N+I+o3gG4DaCSAxsJoSECDDRJYv8EMGr6/8wd+//8HAAB8d0V1cVQVAgEAFBkKAQSAPwD+D/D/AQcQMD8A+BcYAOIEaCezfiPqN4BuA2gkgMbCaEhMgw0SWKHB7Bu+v/MHfv//BwAAfHdFdXFUFQI=";
const portraitTags = {
    John: [0, 1],
    Tuck: [2, 3],
    Mary: [4, 5],
};
const portraitAnim = makeAnim(portraitData);
const merryData = "DQcJEQoBCT74sMCDBwYefrZp4sODAwUJEmMADQYJEgoBCTz8sMCDBwYMPPxs08SHBwcKEiXEAA0GCRIKAQk++LDAgwcGHn62aeLDAwMHChIkxgANBQkTCgEJAnjwYYEHDww8/GzTxIcHBg4UJEiMAQgHEREOAQl8APABYAGABwAPAAwgPCB8IPQgxiaAMYAEABEAIgCEAAgBGAYACQcREQ4BCQQA8ADgA8ACAA8AHiAYIHwg9CDGJoAxgAQAEQAhAEIAhAAMAwAKBxERDgEJeAD4AWABgAcADwAMIDwgfCD0IMYmgDGABIAIABEAIQBCAIYBAAoHERESAQkEAPAA4APAAgAPAB4gGCB8IPQgxiaAMQADwAeABAAEAAgAMAAACQYREhIBCXgA+AFgAYAHAA8ADCA8IHwg9CDGJoAxAA8AHgAUABgACAAIADAAAAgHEhESAQn4AMAHAAsAeADgAQADCB4QfiDnQQCbAIwBMABAAQAJAEMAAgEYDAACBxERGQEJgA+ADwAaAB4AOADgAOADYAewB9AP8P/x/9D/3wAI/BcAIMDAAAQHDhEyAQnAA/gBNIAH4AEwAD5AFogDYUAwCAwCTzAUAyFAGDAFBA4UKAEJgABAABCAC3AFdIGGBCGBifDBPwAPgAHAADAAFAAJMAQCgcECBhESEgEJABAAIACAAA4BLwJ0BDAQQCAAIwA//B8APADwAMACAAmAIYBAAAMDCAUQExIBCQCAAIAAQMBB8ENgQcAjgCOAEfAPzAPDA4ABgAOABUAEMAIIAhgGCAULEx4BCQIgAA/8wAJ84AVGfNR33mIQAyhAAiIQgRCGAQkIFhAUAQkQAAB4AAA+AIAFAMADAPAAAAwA4H8A5vF/eAAADADABwAIAQAiAEAIABgGAAgHEBEPAQkCADwAfAAsAHgAeAAwAPwA+gB5ATECOQxIMEjAiACIAIwBBwUREw8BCQAQAGAAwBGAwwOPDx4LPjz8eHxh/OJ/5f9KRlUMajxQRIAIASACYAwABgQOFCgBCQAgAAgAAoB8ID6IBcFD8AgYAT/gA8TAMAAeQAQQAYQAIsAYCgcQERQBCR8APgAWADwAHAAYBjwB/gA+AF4AHAAkwEQwSAyIAIQAhgEJChIOMgEJ+AHAAgA/AHgB4AkAIwBeAPwA8AHADwA/AEwAMwF07Q8HFBUEGQEJAOADwPs8//+49g8=";
const merryTags = {
    idle: [0, 3],
    garde: [4, 6],
    advance: [7, 9],
    flinch: [10, 11],
    hit: [12, 14],
    windup: [15, 15],
    lunge: [16, 17],
    parry: [18, 19],
    death: [20, 22],
};
const merryAnim = makeAnim(merryData);
const piggyData = "BQ0VCwoBCAAEAYAxwNeF/f/BPz/4VyX/quS/f/z3g2sGoIgABQwVDAoBCAAEAYAxANAF+P6BPz/+VyX/quS/f/z3g/8GsNkAIQoABQwVDBQBCAAEAYAxANAF+P6xPz/4VyX/quS/f/z3g/8GsFkAEgoABQ0VCxQBCAAEAYAxwNeF/P7hPz/4VyX/quS/f/z3g40CkEAABQUUExQBCAAgAAACACAAAAAAIAAAAAAEAcAYAPwBwD/wo4K/qv+ryn9//P/DfwH8FcBGACQEAAULFA0UAQgABAHAGAD8AcA/8OOTv6r+q8p/f/z/w38B/BXARgAkBAA=";
const piggyTags = {
    run: [0, 1],
    idle: [2, 3],
    sniff: [4, 5],
};
const piggyAnim = makeAnim(piggyData);
const spikeData = "CBcQAQoBDv//CBAQCAoBDhAQODi4OJAQUBR8fHg4//8IChAOCgEOEBA4OFRUEBAQERERERGSEJISlJKUVFhUWDn//w==";
const spikeTags = {
    pop: [0, 2],
};
const spikeAnim = makeAnim(spikeData);
const flamesData = "DRIIBgoBBgQEDJ7//w0QCAgKAQYIDAwMiMIe/w4QBwgKAQYEBgYKEhgeDRAICAoBBhAwoAAEDBx/DRAHCAoBBigAgEBw+P4=";
const flamesTags = {
    burning: [0, 4],
};
const flamesAnim = makeAnim(flamesData);
const font = makeAnim(fontData);
function printText(x, y, text, onlyMeasure = false) {
    let xx = x;
    repeat(text.length, (i) => {
        let c = byteAt(text, i);
        if (c === 32) {
            xx += 4;
        }
        else if (c === 10) {
            xx = x;
            y += 8;
        }
        else {
            let cel = font.cels[c - 33];
            let cnvs = cel.planes[0].cnvs;
            if (!onlyMeasure) {
                drawImage(cnvs, xx, y + cel.y);
            }
            xx += cnvs.width + 1;
        }
    });
    return xx - x;
}
function forestBackground() {
    tiles = forestTilesAnim;
    let trees = makeIllustration(60, 80);
    rect(13, 23, 0, 14, 40);
    rect(0, 24, 0, 7, 40);
    repeat(10, (i) => {
        let a = i * 1.173;
        let x = 30 + sin(a) * 17;
        let y = 45 + cos(a) * 14;
        circle(13, x, y, 16 - i);
        circle(0, x - pick([1, 2]), y + 2, 14 - i);
    });
    repeat(20, (i) => {
        let x = floor(30 * i + randomRange(-7, 8));
        let y = floor(randomRange(2, 12));
        tilePlanes.push({ illustration: trees, parallax: [0.4, 1], x, y });
    });
    let backMap = makeTilemap(80, 4);
    tileHLine(0, 0, 80, forestTilesTags.solidGrass, 0 /* CollisionType.None */);
    tileHLine(1, 0, 80, forestTilesTags.solidGrass, 0 /* CollisionType.None */);
    tileHLine(2, 0, 80, forestTilesTags.solidGrass, 0 /* CollisionType.None */);
    tileHLine(3, 0, 80, forestTilesTags.grass, 0 /* CollisionType.None */);
    tilePlanes.push({ tilemap: backMap, parallax: [0.5, 0.9], x: 0, y: -2 });
}
function placeGate(x, y) {
    tilePillar(x, y, 5, forestTilesTags.stone, forestTilesTags.stoneCap, 0 /* CollisionType.None */);
    tileHLine(y, x + 1, x + 4, forestTilesTags.stoneTrim, 0 /* CollisionType.None */);
    tilePillar(x + 4, y, 5, forestTilesTags.stone, forestTilesTags.stoneCap, 0 /* CollisionType.None */);
    spawnGate((x + 2) * 8 + 3, onGround);
}
const onGround = 8;
function makeLevel1() {
    forestBackground();
    let foreMap = makeTilemap(100, 20);
    tilePlanes.push({ tilemap: foreMap, parallax: [1, 1], x: 0, y: 0 });
    let x = 26;
    let y = 1;
    let cx = () => x * 8 + 4;
    let cy = () => y * 8;
    // floor parts
    tileHLine(0, 0, 24, forestTilesTags.ground, 1 /* CollisionType.Floor */);
    tilePillar(7, 1, 5, forestTilesTags.stump, forestTilesTags.stumpCap);
    x = 10;
    spawnGuy(cx(), 3 * 8);
    x += 6;
    spawnCoin(cx(), onGround);
    x += 6;
    repeat(4, (i) => {
        tileHLine(y, x, x + 3, forestTilesTags.ground, 1 /* CollisionType.Floor */);
        spawnCoin((x + 1) * 8 + 4, (y + 1) * 8, true, () => reportEvent(2 /* EventTypes.Jump */));
        x += 5;
        y += 2;
    });
    y = 1;
    tileHLine(0, x, x + 24, forestTilesTags.ground, 1 /* CollisionType.Floor */);
    x += 12;
    placeGate(x, y);
    //spawnGuy(421, 3 * 8);
    spawnCoin(400, onGround);
}
function makeLevel2() {
    forestBackground();
    let foreMap = makeTilemap(100, 20);
    tilePlanes.push({ tilemap: foreMap, parallax: [1, 1], x: 0, y: 0 });
    let x = 26;
    let y = 1;
    let cx = () => x * 8 + 4;
    let cy = () => y * 8;
    tileHLine(0, 0, 48, forestTilesTags.ground, 1 /* CollisionType.Floor */);
    x = 3;
    spawnGuy(cx(), 3 * 8);
    x += 6;
    placeGate(x, y);
    x += 12;
    spawnDummy(cx(), cy());
    x += 6;
    spawnDummy(cx(), cy());
    x += 6;
    spawnDummy(cx(), cy());
}
function makeLevel3() {
    forestBackground();
    let foreMap = makeTilemap(100, 20);
    tilePlanes.push({ tilemap: foreMap, parallax: [1, 1], x: 0, y: 0 });
    let x = 3;
    let y = 1;
    let cx = () => x * 8 + 4;
    let cy = () => y * 8;
    tileHLine(0, x, 48, forestTilesTags.ground, 1 /* CollisionType.Floor */);
    x += 3;
    spawnGuy(cx(), 3 * 8);
    x += 6;
    placeGate(x, y);
    x += 12;
    spawnMerry(cx(), cy());
}
function makeLevel4() {
    forestBackground();
    let foreMap = makeTilemap(128, 30);
    tilePlanes.push({ tilemap: foreMap, parallax: [1, 1], x: 0, y: 0 });
    let x = 3;
    let y = 1;
    let cx = () => x * 8 + 4;
    let cy = () => y * 8;
    let fl = x;
    x += 3;
    spawnGuy(cx(), 3 * 8);
    x += 6;
    /*
    repeat(7, () => {
      effectTile(x++, 1, forestTilesTags.fire);
    })
    x -= 8
    */
    // 3 pillar steps
    tilePut(x, 1, forestTilesTags.stumpCap, 1 /* CollisionType.Floor */);
    spawnCoin(cx(), cy() + 8);
    x += 4;
    tilePillar(x, 1, 2, forestTilesTags.stump, forestTilesTags.stumpCap);
    spawnCoin(cx(), cy() + 16);
    x += 4;
    tilePillar(x, 1, 4, forestTilesTags.stump, forestTilesTags.stumpCap);
    spawnCoin(cx(), cy() + 32);
    // 3 platforms to dead end 
    x += 4;
    y = 6;
    tileHLine(y, x, x + 4, forestTilesTags.ground, 1 /* CollisionType.Floor */);
    x += 4 + 6;
    tileHLine(y, x, x + 4, forestTilesTags.ground, 1 /* CollisionType.Floor */);
    x += 2;
    spawnCoin(cx(), cy() + 8);
    tileHLine(0, fl, x - 2, forestTilesTags.ground, 1 /* CollisionType.Floor */);
    fl = x + 6;
    x += 2 + 6;
    tileHLine(6, x, x + 5, forestTilesTags.ground, 1 /* CollisionType.Floor */);
    x += 2;
    spawnCoin(cx(), cy() + 8);
    x += 2 + 6;
    tileHLine(6, x, x + 5, forestTilesTags.ground, 1 /* CollisionType.Floor */);
    x += 2;
    spawnCoin(cx(), cy() + 8);
    x += 2;
    tilePillar(x, y + 1, y + 10, forestTilesTags.stump, forestTilesTags.stumpCap);
    x -= 13;
    y = 1;
    spawnPiggy(cx(), cy(), 1);
    x += 12;
    spawnPiggy(cx(), cy(), -1);
    x += 10;
    tileHLine(0, fl, x, forestTilesTags.ground, 1 /* CollisionType.Floor */);
    x += 4;
    fl = x;
    x += 5;
    spawnSpikes(cx() + 5, cy(), 0);
    x += 5;
    repeat(7, (i) => {
        spawnSpikes(cx() + 5, cy(), 2.9 - i * 0.15);
        x += 2;
    });
    x += 4;
    tilePillar(x, y, y + 8, forestTilesTags.stump, forestTilesTags.stumpCap);
    x -= 8;
    tileHLine(5, x, x + 4, forestTilesTags.ground, 1 /* CollisionType.Floor */);
    x -= 8;
    tileHLine(6, x, x + 4, forestTilesTags.ground, 1 /* CollisionType.Floor */);
    x -= 8;
    tileHLine(10, x, x + 4, forestTilesTags.ground, 1 /* CollisionType.Floor */);
    x += 4;
    y = 15;
    tileHLine(15, x, x + 4, forestTilesTags.ground, 1 /* CollisionType.Floor */);
    x += 2;
    spawnCoin(cx(), cy() + 8);
    x += 5;
    tileHLine(15, x, x + 4, forestTilesTags.ground, 1 /* CollisionType.Floor */);
    x += 2;
    spawnCoin(cx(), cy() + 8);
    x += 5;
    tileHLine(15, x, x + 4, forestTilesTags.ground, 1 /* CollisionType.Floor */);
    x += 2;
    spawnCoin(cx(), cy() + 8);
    x += 6;
    x += 5;
    placeGate(x, 1);
    x += 10;
    tileHLine(0, fl, x, forestTilesTags.ground, 1 /* CollisionType.Floor */);
    // spawnGuy(776, 20)
}
function makeLevel5() {
    forestBackground();
    let foreMap = makeTilemap(128, 30);
    tilePlanes.push({ tilemap: foreMap, parallax: [1, 1], x: 0, y: 0 });
    let x = 3;
    let y = 1;
    let cx = () => x * 8 + 4;
    let cy = () => y * 8;
    let fl = x;
    tilePillar(x, 1, 4, forestTilesTags.stump, forestTilesTags.stumpCap);
    x += 20;
    spawnGuy(cx(), 3 * 8);
    x -= 8;
    spawnSherrif(cx(), cy());
    x += 16;
    spawnSherrif(cx(), cy());
    x += 12;
    tilePillar(x, 1, 4, forestTilesTags.stump, forestTilesTags.stumpCap);
    x += 5;
    let lt = x;
    repeat(10, () => {
        spawnFlames(cx(), cy());
        x++;
    });
    tilePillar(x, 1, 10, forestTilesTags.stump, forestTilesTags.stumpCap);
    spawnCoin(cx(), 11 * 8);
    x++;
    repeat(11, () => {
        spawnFlames(cx(), cy());
        x++;
    });
    x = lt + 2;
    y = 5;
    tileHLine(y, x, x + 4, forestTilesTags.ground, 1 /* CollisionType.Floor */);
    x += 13;
    tileHLine(y, x, x + 4, forestTilesTags.ground, 1 /* CollisionType.Floor */);
    x += 20;
    y = 1;
    spawnSherrif(cx(), cy());
    x += 12;
    placeGate(x, 1);
    x += 8;
    tileHLine(0, fl, x, forestTilesTags.ground, 1 /* CollisionType.Floor */);
    //spawnGuy(342, 3 * 8);
}
const KeyAliases = {
    87: 38 /* Keys.Up */,
    65: 37 /* Keys.Left */,
    83: 40 /* Keys.Down */,
    68: 39 /* Keys.Right */, // d
};
let pressed = [];
let justPressed = [];
window.addEventListener('keydown', (ev) => {
    audioContext.resume();
    let code = ev.keyCode;
    if (!pressed[code]) {
        pressed[code] = true;
        justPressed[code] = true;
        code = KeyAliases[code];
        pressed[code] = true;
        justPressed[code] = true;
    }
});
window.addEventListener('keyup', (ev) => {
    let code = ev.keyCode;
    pressed[code] = false;
    code = KeyAliases[code];
    pressed[code] = false;
});
const guyGardeSmall = 26;
const guyGardeLarge = 52;
const guyAnimRed = makeAnim(guyData);
recolorCels(guyAnimRed, 6);
const guy = {
    actv: false,
    anim: guyAnim,
    inst: makeAnimInstance(guyTags.idle, 1 /* AnimStyle.Loop */),
    x: 10, y: 8,
    facing: 1,
    w: 2, h: 12,
    dx: 0, dy: 0,
    timer: 0,
    jumpCount: 0,
    lastFloor: 0,
    stat: 1 /* GuyState.Idle */,
    gardeCheck: { x: 0, y: 0, w: guyGardeSmall, h: 12 },
    focus: 0,
    fallTransition: 4 /* GuyState.Fall */,
    beforeJump: 1 /* GuyState.Idle */,
    attackBox: 0,
    parryBox: 0,
    feintBox: 0,
    inGarde: false,
    parryTime: 0,
    feintTime: 0,
    wasParried: false,
    damage: [],
    health: 3,
};
let firstGuy = true;
let spawnGuyLoc = 0;
let guyRequestedState = null;
let guyCelebratePosition = [0, 0];
function tickGuy(guy) {
    if (!guy.actv)
        return;
    const speed = 500 * ds;
    const floor = max(findFloor([guy.x - 2, guy.y]), findFloor([guy.x + 2, guy.y]));
    const jump = () => {
        if (justPressed[38 /* Keys.Up */] && guy.jumpCount < 2) {
            if (!guy.jumpCount) {
                guy.beforeJump = guy.stat;
            }
            guy.y += 0.1;
            guy.dy = 150;
            guy.jumpCount++;
            if (guy.jumpCount > 1) {
                reportEvent(8 /* EventTypes.DoubleJump */);
            }
            guy.fallTransition = 4 /* GuyState.Fall */;
            return true;
        }
        return false;
    };
    const horizontal = (mult) => {
        if (pressed[37 /* Keys.Left */]) {
            guy.dx -= speed * mult;
            return true;
        }
        if (pressed[39 /* Keys.Right */]) {
            guy.dx += speed * mult;
            return true;
        }
        return false;
    };
    const fall = () => {
        if (guy.y > floor || guy.dy != 0) {
            guy.dy -= ds * 500;
            guy.y += guy.dy * ds;
            if (guy.dy < 0) {
                toState(guy.fallTransition);
            }
            return true;
        }
        return false;
    };
    const land = () => {
        if (guy.y <= floor && guy.dy <= 0) {
            guy.y = floor;
            guy.dy = 0;
            guy.lastFloor = floor;
            guy.jumpCount = 0;
            if (guy.beforeJump !== 10 /* GuyState.Knockback */) {
                guitarTwoStrings(0);
            }
            return true;
        }
        return false;
    };
    const checkGardeBox = () => {
        let detected = false;
        enemies.forEach(e => {
            if (e.fighter && e.actv && intersectCapsules(e, guy.gardeCheck)) {
                detected = true;
            }
        });
        return detected;
    };
    const checkEnterGarde = () => {
        if (checkGardeBox()) {
            if (!guy.inGarde) {
                activeChord = chordEm7;
            }
            guy.inGarde = true;
            toState(8 /* GuyState.DrawGarde */);
            guy.gardeCheck.w = guyGardeLarge;
        }
    };
    const checkExitGarde = () => {
        if (!checkGardeBox()) {
            if (guy.inGarde) {
                activeChord = chordG;
            }
            guy.inGarde = false;
            toState(9 /* GuyState.DrawIdle */);
            guy.gardeCheck.w = guyGardeSmall;
        }
    };
    const checkAttack = () => {
        return justPressed[32 /* Keys.Attack */] ? toState(7 /* GuyState.Lunge */) : false;
    };
    const checkFeint = () => {
        return justPressed[40 /* Keys.Down */] ? toState(12 /* GuyState.Feint */) : false;
    };
    const checkParry = () => {
        return justPressed[38 /* Keys.Up */] ? toState(13 /* GuyState.Parry */) : false;
    };
    const checkRPS = () => {
        return checkAttack() || checkFeint() || checkParry();
    };
    const takeDamage = () => {
        if (guy.damage.length > 0) {
            guy.health -= 1;
            if (guy.health <= 0) {
                sceneDeath();
            }
        }
        guy.damage.map(d => {
            toState(10 /* GuyState.Knockback */);
            guy.dx = guy.x < d.x ? -150 : 150;
            guy.dy = 100;
        });
    };
    const faceFocus = () => {
        let f = guy.focus;
        if (f !== 0) {
            guy.facing = guy.x < f.x ? 1 : -1;
        }
    };
    const absx = abs(guy.dx * ds);
    const toState = (stat) => {
        if (guy.stat === stat)
            return;
        guy.anim = guyAnim;
        guy.stat = stat;
        guy.timer = 0;
        //console.log(`guy to stat ${stat}`);
        [
            // Limbo
            noop,
            // Idle
            () => {
                animInstanceSetRange(guy.inst, guyTags.idle, 1 /* AnimStyle.Loop */);
                if (absx > 0.2) {
                    toState(2 /* GuyState.Walk */);
                }
                checkEnterGarde();
            },
            // Walk
            () => {
                animInstanceSetRange(guy.inst, guyTags.run, 1 /* AnimStyle.Loop */);
            },
            // Jump
            () => {
                guitarSingleString(0, [0, 1]);
                animInstanceResetRange(guy.inst, guyTags.jump, 1 /* AnimStyle.Loop */);
            },
            // Fall
            () => {
                animInstanceSetRange(guy.inst, guyTags.fall, 1 /* AnimStyle.Loop */);
            },
            // Garde
            () => {
                guy.wasParried = false;
                animInstanceSetRange(guy.inst, guyTags.garde, 1 /* AnimStyle.Loop */);
            },
            // Advance
            () => {
                animInstanceSetRange(guy.inst, guyTags.advance, 1 /* AnimStyle.Loop */);
            },
            // Lunge
            () => {
                guy.wasParried = false;
                guy.dx = guy.facing * (clck - guy.parryTime < 2 ? 250 : 175);
                animInstanceResetRange(guy.inst, guyTags.lunge, 0 /* AnimStyle.NoLoop */);
            },
            // DrawGarde
            () => {
                animInstanceResetRange(guy.inst, guyTags.draw, 0 /* AnimStyle.NoLoop */);
            },
            // DrawIdle
            () => {
                animInstanceResetRange(guy.inst, guyTags.draw, 0 /* AnimStyle.NoLoop */);
            },
            // Knockback
            () => {
                guy.beforeJump = 10 /* GuyState.Knockback */;
                activeChord = chordGm;
                guitarPluck(0, chordGm, 1);
                guy.fallTransition = 10 /* GuyState.Knockback */;
                animInstanceSetRange(guy.inst, guyTags.fall, 1 /* AnimStyle.Loop */);
            },
            // Celebrate
            () => {
                animInstanceSetRange(guy.inst, guyTags.victory, 1 /* AnimStyle.Loop */);
            },
            // Feint
            () => {
                guy.dx = guy.facing * 75;
                animInstanceResetRange(guy.inst, guyTags.feint, 0 /* AnimStyle.NoLoop */);
            },
            // Parry
            () => {
                guy.dx = guy.facing * -10;
                animInstanceResetRange(guy.inst, guyTags.parry, 0 /* AnimStyle.NoLoop */);
            }
        ][stat]();
        return true;
    };
    if (firstGuy) {
        toState(5 /* GuyState.Garde */);
        firstGuy = false;
    }
    if (spawnGuyLoc) {
        toState(1 /* GuyState.Idle */);
        guy.x = spawnGuyLoc[0];
        guy.y = spawnGuyLoc[1];
        guy.dx = 0;
        guy.dy = 0;
        guy.lastFloor = findFloor([guy.x, guy.y]);
        guy.health = 3;
        cameraCutTo(guy.x, guy.y);
        spawnGuyLoc = 0;
    }
    let closestDist = 9999999;
    let closest = 0;
    enemies.forEach(e => {
        if (e.fighter && e.actv) {
            let dx = abs(e.x - guy.x);
            let dy = abs(e.y - guy.y);
            if (dx < closestDist && dy < 16) {
                closestDist = dx;
                closest = e;
            }
        }
    });
    guy.focus = closest;
    guy.timer += ds;
    if (guyRequestedState !== null) {
        toState(guyRequestedState);
        guyRequestedState = null;
    }
    guy.inst.onLoop = () => { };
    const walkPing = () => {
        guitarSingleString(0, [3, 4]);
    };
    let canFace = true;
    guy.attackBox = 0;
    guy.parryBox = 0;
    guy.feintBox = 0;
    [
        // Limbo 
        noop,
        // Idle
        () => {
            if (horizontal(1))
                toState(2 /* GuyState.Walk */);
            if (jump())
                toState(3 /* GuyState.Jump */);
            checkEnterGarde();
            takeDamage();
            fall();
        },
        // Walk
        () => {
            guy.inst.onLoop = walkPing;
            if (guy.timer > 0.25) {
                reportEvent(1 /* EventTypes.Move */);
            }
            horizontal(1);
            if (absx < 0.1)
                toState(1 /* GuyState.Idle */);
            if (jump())
                toState(3 /* GuyState.Jump */);
            checkEnterGarde();
            takeDamage();
            fall();
        },
        // Jump
        () => {
            horizontal(0.75);
            fall();
            jump();
        },
        // Fall
        () => {
            fall();
            if (land()) {
                toState(1 /* GuyState.Idle */);
            }
            else if (jump()) {
                toState(3 /* GuyState.Jump */);
            }
        },
        // Garde
        () => {
            reportEvent(4 /* EventTypes.GuyGarde */);
            canFace = false;
            faceFocus();
            if (horizontal(0.5))
                toState(6 /* GuyState.Advance */);
            checkRPS();
            checkExitGarde();
            takeDamage();
            fall();
        },
        // Advance
        () => {
            guy.inst.onLoop = walkPing;
            canFace = false;
            faceFocus();
            horizontal(0.5);
            if (absx < 0.1)
                toState(5 /* GuyState.Garde */);
            checkRPS();
            checkExitGarde();
            takeDamage();
            fall();
        },
        // Lunge
        () => {
            canFace = false;
            takeDamage();
            if (animIsRelativeFrame(guy.inst, 0)) {
                guy.attackBox = { x: guy.x + guy.facing * 8, y: guy.y, w: 9, h: 12 };
            }
            if (animIsFinished(guy))
                toState(5 /* GuyState.Garde */);
            if (guy.wasParried) {
                toState(10 /* GuyState.Knockback */);
                guy.dx = -guy.facing * 50;
                guy.dy = 50;
            }
        },
        // DrawGarde
        () => {
            canFace = false;
            if (animIsFinished(guy))
                toState(5 /* GuyState.Garde */);
        },
        // DrawIdle
        () => {
            canFace = false;
            if (animIsFinished(guy))
                toState(1 /* GuyState.Idle */);
        },
        // Knockback
        () => {
            if (!guy.wasParried) {
                guy.anim = sin(guy.timer * 70) > 0 ? guyAnimRed : guyAnim;
            }
            canFace = false;
            fall();
            if (land()) {
                toState(1 /* GuyState.Idle */);
            }
        },
        // Celebrate
        () => {
            guy.dx = 0;
            guy.dy = 0;
            let t = 1 - pow(0.01, ds);
            guy.x += (guyCelebratePosition[0] - guy.x) * t;
            guy.y += (guyCelebratePosition[1] - guy.y) * t;
        },
        // Feint
        () => {
            canFace = false;
            takeDamage();
            if (animIsFinished(guy))
                toState(5 /* GuyState.Garde */);
            guy.feintBox = capsuleAhead(guy, 0, 20);
        },
        // Parry
        () => {
            canFace = false;
            if (animIsRelativeFrame(guy.inst, 0)) {
                guy.parryBox = { x: guy.x + guy.facing * 5, y: guy.y, w: 6, h: 12 };
            }
            if (animIsFinished(guy))
                toState(5 /* GuyState.Garde */);
            checkRPS();
        },
    ][guy.stat]();
    guy.damage = [];
    guy.dx *= pow(0.01, ds);
    guy.x = moveHorizontalAgainstTilemap(guy.x, guy.y, guy.w, guy.dx * ds);
    if (canFace) {
        guy.facing = guy.dx >= 0 ? 1 : -1;
    }
    if (guy.y <= DeathFloor + 1) {
        sceneDeath();
    }
    enemies.forEach(e => {
        if (e.actv && intersectCapsules(guy, e)) {
            if (e.danger) {
                guyTakeDamage(e);
            }
            else if (e.blocker) {
                guy.x = e.x - (guy.w + e.w) * guy.facing;
            }
        }
    });
    guy.gardeCheck.x = guy.x;
    guy.gardeCheck.y = guy.y;
    animInstanceTick(guy.anim, guy.inst);
    cameraSetTarget(guy.x + guy.dx / 4, guy.lastFloor + (guy.y - guy.lastFloor) / 4 + 10);
    //cameraSetTarget(0, 0);
}
function guyDraw(guy) {
    if (guy.actv) {
        applyCameraPos(guy.x, guy.y);
        if (guy.facing < 0) {
            flipHorizontal();
        }
        drawAnim(guy.anim, guy.inst.frm, -16, -24);
    }
}
function guyCelebrate(x, y) {
    if (guy.stat !== 11 /* GuyState.Celebrate */) {
        guyRequestedState = 11 /* GuyState.Celebrate */;
        guyCelebratePosition = [x, y];
    }
}
function guyTakeDamage(e) {
    guy.damage.push(e);
}
function guyParrySuccess(e) {
    reportEvent(6 /* EventTypes.Parry */);
    guy.parryTime = clck;
    guy.dx = 60;
}
function guyFeintSuccess(e) {
    reportEvent(7 /* EventTypes.Feint */);
    guy.feintTime = clck;
}
function guyHitLanded() {
    if (!guy.wasParried) {
        guy.dx *= 0.5;
    }
}
function guysHitWasParried() {
    guy.wasParried = true;
}
function spawnGuy(x, y) {
    guy.actv = true;
    guy.dx = 0;
    guy.dy = 0;
    guy.stat = 0 /* GuyState.Limbo */;
    guyRequestedState = 1 /* GuyState.Idle */;
    spawnGuyLoc = [x, y];
}
let enemies = [];
function makeEnemy(x, y, w, h, anim, rnge, onSpawn, onStateChange, onTick, onIntersect) {
    let e = {
        anim, inst: makeAnimInstance(rnge, 1 /* AnimStyle.Loop */),
        x, y, w, h,
        onStateChange,
        onTick,
        onIntersect,
        timer: 0,
        actionTimer: 0,
        stat: 0,
        danger: true,
        blocker: true,
        facing: 1,
        health: 2,
        actv: true,
        dx: 0
    };
    enemySetState(e, 0);
    enemies.push(e);
    onSpawn(e);
    return e;
}
function dispatchEnemyMap(map, e) {
    let c = map[e.stat];
    if (c) {
        c(e);
    }
    c = map[100 /* EnemyGeneralStates.Any */];
    if (c) {
        c(e);
    }
}
let enemyIntersectionType = 0 /* EnemyIntersectionType.GuyTouch */;
const isIntersection = (t) => t === enemyIntersectionType;
function enemiesTick() {
    let hitlanded = false;
    enemies.forEach(e => {
        if (e.actv && guy.actv) {
            e.detect = void 0;
            e.attack = void 0;
            e.timer += ds;
            e.actionTimer += ds;
            dispatchEnemyMap(e.onTick, e);
            if (intersectCapsules(guy.attackBox, e)) {
                enemyIntersectionType = 1 /* EnemyIntersectionType.GuyAttack */;
                dispatchEnemyMap(e.onIntersect, e);
                hitlanded = true;
            }
            if (intersectCapsules(guy, e)) {
                enemyIntersectionType = 0 /* EnemyIntersectionType.GuyTouch */;
                dispatchEnemyMap(e.onIntersect, e);
            }
            if (intersectCapsules(e.detect, guy)) {
                enemyIntersectionType = 2 /* EnemyIntersectionType.GuyDetected */;
                dispatchEnemyMap(e.onIntersect, e);
            }
            if (intersectCapsules(e.attack, guy)) {
                console.log('ouch');
                enemyIntersectionType = 3 /* EnemyIntersectionType.EnemyAttack */;
                dispatchEnemyMap(e.onIntersect, e);
                guyTakeDamage(e);
            }
            if (intersectCapsules(e.attack, guy.parryBox)) {
                enemyIntersectionType = 4 /* EnemyIntersectionType.GuyParried */;
                dispatchEnemyMap(e.onIntersect, e);
                guyParrySuccess(e);
            }
            if (intersectCapsules(e, guy.feintBox)) {
                enemyIntersectionType = 5 /* EnemyIntersectionType.GuyFeinted */;
                dispatchEnemyMap(e.onIntersect, e);
                guyFeintSuccess(e);
            }
            animInstanceTick(e.anim, e.inst);
        }
    });
    if (hitlanded) {
        guitarTwoStrings(1, 1);
        reportEvent(5 /* EventTypes.Lunge */);
        guyHitLanded();
    }
}
function enemySetState(e, s) {
    //console.log(`${e.stat} => ${s}`)
    e.stat = s;
    e.timer = 0;
    dispatchEnemyMap(e.onStateChange, e);
}
function enemiesDraw() {
    enemies.forEach(e => {
        if (e.actv) {
            applyCameraPos(e.x, e.y);
            if (e.facing < 0) {
                flipHorizontal();
            }
            drawAnim(e.anim, e.inst.frm, -16, -24);
        }
    });
}
function enemiesClear() {
    enemies = [];
    coinsTotal = 0;
    coinCounter = 0;
}
function enemyCheckStandoff(e, near, far) {
    let gx = abs(guy.x - e.x);
    return gx < near || gx > far;
}
function enemyAdjustStandoff(e, near, far, speed) {
    enemyFacePlayer(e);
    let gx = abs(guy.x - e.x);
    if (gx < near) {
        e.x -= e.facing * speed * ds;
        e.inst.styl = 2 /* AnimStyle.LoopReverse */;
        return false;
    }
    if (gx > far) {
        e.x += e.facing * speed * ds;
        e.inst.styl = 1 /* AnimStyle.Loop */;
        return false;
    }
    return true;
}
function enemyActionTimer(e, tme, func) {
    if (e.actionTimer > tme) {
        e.actionTimer = 0;
        func();
    }
}
let coinCounter = 0;
let coinsTotal = 0;
fillCels(coinAnim, 10);
function spawnCoin(x, y, actv = true, onPickup = () => { }) {
    coinsTotal++;
    return makeEnemy(x, y, 3, 8, coinAnim, coinTags.idle, (e) => {
        e.actv = actv;
        e.blocker = false;
    }, {
        [0 /* CoinState.Idle */]: (e) => {
            e.danger = false;
            e.timer = random() * 5;
            e.inst.styl = 3 /* AnimStyle.PingPong */;
        },
        [2 /* CoinState.PickedUp */]: (e) => {
            coinCounter++;
            e.inst.frm = 0;
            guitarSingleString(1, [4, 5], 1);
            animInstanceSetRange(e.inst, coinTags.idle, 0 /* AnimStyle.NoLoop */);
            enemySetState(e, 3 /* CoinState.Leaving */);
            onPickup();
        }
    }, {
        [0 /* CoinState.Idle */]: (e) => {
            e.y = y + abs(sin(e.timer * PI * 3)) * 3;
        },
        [1 /* CoinState.Appear */]: (e) => {
            let t = e.timer;
            let height = 20 - t * 17;
            e.x += ds * e.dx;
            e.y = y + abs(sin(t * PI * 3)) * height;
            if (t >= 1) {
                enemySetState(e, 0 /* CoinState.Idle */);
            }
        },
        [3 /* CoinState.Leaving */]: (e) => {
            e.y = y + pow(e.timer, 0.5) * 35;
            if (e.timer > 0.5) {
                enemies = enemies.filter(en => en != e);
            }
        }
    }, {
        [0 /* CoinState.Idle */]: (e) => {
            enemySetState(e, 2 /* CoinState.PickedUp */);
        },
        [1 /* CoinState.Appear */]: (e) => {
            if (e.timer > 1) {
                enemySetState(e, 2 /* CoinState.PickedUp */);
            }
        },
    });
}
function coinAppear(e, x, y) {
    e.actv = true;
    e.x = x;
    e.y = y;
    e.dx = x > guy.x ? 30 : -30;
    enemySetState(e, 1 /* CoinState.Appear */);
}
function enemyFacePlayer(e) {
    e.facing = guy.x > e.x ? 1 : -1;
}
//fillCels(dummyAnim, 6);
function spawnDummy(x, y) {
    let coin = spawnCoin(x, y, false);
    return makeEnemy(x, y, 4, 16, dummyAnim, dummyTags.idle, (e) => {
        e.fighter = true;
    }, {
        [0 /* DummyState.Idle */]: (e) => {
            animInstanceSetRange(e.inst, dummyTags.idle, 3 /* AnimStyle.PingPong */);
            e.inst.styl = 3 /* AnimStyle.PingPong */;
            e.danger = true;
        },
        [1 /* DummyState.Hit */]: (e) => {
        },
        [2 /* DummyState.Dead */]: (e) => {
            activeChord = chordBm;
            guitarPluck(1, activeChord, 1);
            e.danger = false;
            e.blocker = false;
            e.fighter = false;
        }
    }, {
        [0 /* DummyState.Idle */]: (e) => {
            enemyFacePlayer(e);
        },
        [1 /* DummyState.Hit */]: (e) => {
            if (animIsFinished(e)) {
                enemySetState(e, 0 /* DummyState.Idle */);
            }
        },
        [2 /* DummyState.Dead */]: (e) => {
            if (e.timer > 5) {
                //enemySetState(e, DummyState.Idle);
                //e.health = 2;
            }
        },
    }, {
        [0 /* DummyState.Idle */]: (e) => {
            if (isIntersection(1 /* EnemyIntersectionType.GuyAttack */)) {
                e.health -= 1;
                if (e.health === 0) {
                    animInstanceResetRange(e.inst, dummyTags.death, 0 /* AnimStyle.NoLoop */);
                    enemySetState(e, 2 /* DummyState.Dead */);
                    coinAppear(coin, e.x, e.y);
                }
                else {
                    animInstanceResetRange(e.inst, dummyTags.hit, 0 /* AnimStyle.NoLoop */);
                    enemySetState(e, 1 /* DummyState.Hit */);
                }
            }
        },
        [1 /* DummyState.Hit */]: 0,
        [2 /* DummyState.Dead */]: 0,
    });
}
const gateTile1 = forestTilesTags.gate[0];
const gateTile2 = forestTilesTags.gateCap[0];
const gateAnim = {
    cels: [composeTiles(forestTilesAnim, 5, -8, 3, 4, [
            gateTile2, gateTile2, gateTile2,
            gateTile1, gateTile1, gateTile1,
            gateTile1, gateTile1, gateTile1,
            gateTile1, gateTile1, gateTile1,
        ])]
};
function spawnGate(x, y) {
    return makeEnemy(x, y, 12, 64, gateAnim, [0, 0], (e) => {
        e.blocker = false;
    }, {
        [0 /* GateState.Closed */]: (e) => { e.danger = false; },
        [4 /* GateState.Celebrating */]: (e) => {
            guyCelebrate(x, y);
            reportEvent(3 /* EventTypes.Exit */);
            guitarArp(1, chordG);
        }
    }, {
        [0 /* GateState.Closed */]: (e) => {
            if (coinCounter >= coinsTotal) {
                enemySetState(e, 2 /* GateState.Opening */);
            }
        },
        [2 /* GateState.Opening */]: (e) => {
            let t = lerpInRange(0, 1.2, e.timer);
            e.x = x + random() * 2 - 1;
            e.y = y - t * 28;
            if (t >= 1) {
                e.x = x;
                enemySetState(e, 3 /* GateState.Open */);
            }
        },
        [1 /* GateState.Shudder */]: (e) => {
            e.x = x;
            if (e.timer < 0.5) {
                e.x = x + random() * 2 - 1;
            }
            if (e.timer > 2) {
                enemySetState(e, 0 /* GateState.Closed */);
            }
        },
        [4 /* GateState.Celebrating */]: (e) => {
            if (e.timer > 1) {
                sceneComplete();
            }
        }
    }, {
        [0 /* GateState.Closed */]: (e) => {
            if (isIntersection(0 /* EnemyIntersectionType.GuyTouch */)) {
                enemySetState(e, 1 /* GateState.Shudder */);
            }
        },
        [3 /* GateState.Open */]: (e) => {
            if (isIntersection(0 /* EnemyIntersectionType.GuyTouch */)) {
                enemySetState(e, 4 /* GateState.Celebrating */);
            }
        },
    });
}
const sherrifAnim = makeAnim(merryData);
recolorCels(sherrifAnim, 8);
function spawnSherrif(x, y) {
    let sherrif = spawnMerry(x, y);
    sherrif.anim = sherrifAnim;
}
function spawnMerry(x, y) {
    let coin = spawnCoin(x, y, false);
    let flags = {
        fighting: false,
        vulnerable: false
    };
    return makeEnemy(x, y, 6, 10, merryAnim, merryTags.idle, (e) => {
        e.health = 5;
        e.fighter = true;
    }, {
        [0 /* MerryStates.Idle */]: (e) => {
            flags.fighting = false;
            flags.vulnerable = true;
        },
        [1 /* MerryStates.Garde */]: (e) => {
            animInstanceSetRange(e.inst, merryTags.garde, 3 /* AnimStyle.PingPong */);
            if (!flags.fighting) {
                e.actionTimer = 2;
            }
            flags.fighting = true;
            flags.vulnerable = true;
        },
        [2 /* MerryStates.Advance */]: (e) => {
            animInstanceSetRange(e.inst, merryTags.advance, 1 /* AnimStyle.Loop */);
        },
        [4 /* MerryStates.Hit */]: (e) => {
            e.dx = -e.facing * 50;
            animInstanceResetRange(e.inst, merryTags.hit, 0 /* AnimStyle.NoLoop */);
            e.health--;
            if (e.health <= 0) {
                activeChord = chordBm;
                guitarPluck(1, activeChord, 1);
                coinAppear(coin, e.x, e.y);
                enemySetState(e, 8 /* MerryStates.Dead */);
            }
            flags.vulnerable = false;
        },
        [5 /* MerryStates.Windup */]: (e) => {
            animInstanceResetRange(e.inst, merryTags.windup, 0 /* AnimStyle.NoLoop */);
        },
        [6 /* MerryStates.Lunge */]: (e) => {
            e.dx = e.facing * 50;
            animInstanceResetRange(e.inst, merryTags.lunge, 0 /* AnimStyle.NoLoop */);
        },
        [3 /* MerryStates.Flinch */]: (e) => {
            animInstanceResetRange(e.inst, merryTags.flinch, 0 /* AnimStyle.NoLoop */);
        },
        [7 /* MerryStates.Parry */]: (e) => {
            animInstanceResetRange(e.inst, merryTags.parry, 0 /* AnimStyle.NoLoop */);
            flags.vulnerable = false;
        },
        [8 /* MerryStates.Dead */]: (e) => {
            animInstanceResetRange(e.inst, merryTags.death, 0 /* AnimStyle.NoLoop */);
            e.blocker = false;
            e.danger = false;
            e.fighter = false;
        },
        [9 /* MerryStates.Dodge */]: (e) => {
            animInstanceResetRange(e.inst, merryTags.advance, 2 /* AnimStyle.LoopReverse */);
            e.dx = e.facing * -100;
            e.actionTimer -= 1;
        }
    }, {
        [0 /* MerryStates.Idle */]: (e) => {
            enemyFacePlayer(e);
            e.detect = capsuleAhead(e, 0, 40);
        },
        [1 /* MerryStates.Garde */]: (e) => {
            e.danger = true;
            if (enemyCheckStandoff(e, 20, 30)) {
                enemySetState(e, 2 /* MerryStates.Advance */);
            }
            enemyActionTimer(e, 3, () => enemySetState(e, 5 /* MerryStates.Windup */));
        },
        [2 /* MerryStates.Advance */]: (e) => {
            if (enemyAdjustStandoff(e, 21, 29, 20)) {
                enemySetState(e, 1 /* MerryStates.Garde */);
            }
            enemyActionTimer(e, 3, () => enemySetState(e, 5 /* MerryStates.Windup */));
        },
        [4 /* MerryStates.Hit */]: (e) => {
            e.danger = false;
            e.x += e.dx * ds;
            e.dx -= e.dx * (1 - pow(0.01, ds));
            if (animIsFinished(e))
                enemySetState(e, 1 /* MerryStates.Garde */);
        },
        [5 /* MerryStates.Windup */]: (e) => {
            if (animIsFinished(e)) {
                enemySetState(e, 6 /* MerryStates.Lunge */);
            }
        },
        [6 /* MerryStates.Lunge */]: (e) => {
            e.x += e.dx * ds;
            e.dx -= e.dx * (1 - pow(0.01, ds));
            e.attack = capsuleAhead(e, 0, 12);
            if (animIsFinished(e)) {
                e.actionTimer = 0;
                enemySetState(e, 1 /* MerryStates.Garde */);
            }
        },
        [3 /* MerryStates.Flinch */]: (e) => {
            e.danger = false;
            if (animIsFinished(e)) {
                e.actionTimer = 0;
                enemySetState(e, 1 /* MerryStates.Garde */);
            }
        },
        [7 /* MerryStates.Parry */]: (e) => {
            if (animIsFinished(e)) {
                enemySetState(e, 1 /* MerryStates.Garde */);
            }
            enemyActionTimer(e, 3, () => enemySetState(e, 5 /* MerryStates.Windup */));
        },
        [9 /* MerryStates.Dodge */]: (e) => {
            e.x += e.dx * ds;
            e.dx -= e.dx * (1 - pow(0.001, ds));
            if (e.dx < 5) {
                enemySetState(e, 1 /* MerryStates.Garde */);
            }
        }
    }, {
        [100 /* EnemyGeneralStates.Any */]: (e) => {
            if (isIntersection(1 /* EnemyIntersectionType.GuyAttack */) && flags.vulnerable) {
                if (!contains([3 /* MerryStates.Flinch */, 4 /* MerryStates.Hit */], e.stat)
                    && (random() > 0.2 || !instructionsComplete[6 /* EventTypes.Parry */])) {
                    guysHitWasParried();
                    enemySetState(e, 7 /* MerryStates.Parry */);
                }
                else {
                    enemySetState(e, 4 /* MerryStates.Hit */);
                }
            }
            if (isIntersection(4 /* EnemyIntersectionType.GuyParried */)) {
                enemySetState(e, 3 /* MerryStates.Flinch */);
            }
            if (isIntersection(5 /* EnemyIntersectionType.GuyFeinted */) && contains([1 /* MerryStates.Garde */, 2 /* MerryStates.Advance */], e.stat)) {
                if (random() < 0.4) {
                    enemySetState(e, 9 /* MerryStates.Dodge */);
                }
                else if (random() < 0.8) {
                    enemySetState(e, 3 /* MerryStates.Flinch */);
                }
                else {
                    enemySetState(e, 6 /* MerryStates.Lunge */);
                }
            }
        },
        [0 /* MerryStates.Idle */]: (e) => {
            if (isIntersection(2 /* EnemyIntersectionType.GuyDetected */)) {
                enemySetState(e, 1 /* MerryStates.Garde */);
            }
        },
    });
}
function spawnPiggy(x, y, facing) {
    return makeEnemy(x, y, 8, 11, piggyAnim, piggyTags.idle, (e) => {
        e.facing = facing;
        e.danger = true;
        e.blocker = true;
    }, {
        [0 /* PiggyState.Idle */]: (e) => {
            animInstanceResetRange(e.inst, piggyTags.idle, 1 /* AnimStyle.Loop */);
        },
        [1 /* PiggyState.Sniffing */]: (e) => {
            animInstanceResetRange(e.inst, piggyTags.sniff, 1 /* AnimStyle.Loop */);
        },
        [2 /* PiggyState.Charging */]: (e) => {
            animInstanceResetRange(e.inst, piggyTags.run, 1 /* AnimStyle.Loop */);
        },
    }, {
        [0 /* PiggyState.Idle */]: (e) => {
            e.detect = capsuleAhead(e, -24, 40);
        },
        [1 /* PiggyState.Sniffing */]: (e) => {
            if (e.timer > 3) {
                enemySetState(e, 2 /* PiggyState.Charging */);
            }
        },
        [2 /* PiggyState.Charging */]: (e) => {
            e.attack = capsuleAhead(e, 0, 12);
            let tx = e.x + e.facing * 50 * ds;
            if (findFloor([tx, 10]) === e.y) {
                e.x += e.facing * 50 * ds;
            }
            if (e.timer > 3) {
                enemySetState(e, 0 /* PiggyState.Idle */);
            }
        }
    }, {
        [0 /* PiggyState.Idle */]: (e) => {
            enemySetState(e, 1 /* PiggyState.Sniffing */);
            enemyFacePlayer(e);
        },
    });
}
function spawnSpikes(x, y, phase) {
    return makeEnemy(x, y, 8, 12, spikeAnim, spikeTags.pop, (e) => {
        e.danger = false;
        e.blocker = false;
        e.timer = phase % 3;
    }, {
        [0 /* SpikeStates.Waiting */]: (e) => {
            animInstanceSetRange(e.inst, spikeTags.pop, 5 /* AnimStyle.NoLoopReverse */);
        },
        [1 /* SpikeStates.Sprung */]: (e) => {
            animInstanceSetRange(e.inst, spikeTags.pop, 0 /* AnimStyle.NoLoop */);
        },
    }, {
        [0 /* SpikeStates.Waiting */]: (e) => {
            e.danger = false;
            if (e.timer > 3) {
                enemySetState(e, 1 /* SpikeStates.Sprung */);
            }
        },
        [1 /* SpikeStates.Sprung */]: (e) => {
            e.danger = true;
            if (e.timer > 3) {
                enemySetState(e, 0 /* SpikeStates.Waiting */);
            }
        }
    }, {});
}
function spawnFlames(x, y) {
    return makeEnemy(x, y, 4, 8, flamesAnim, flamesTags.burning, (e) => {
        e.danger = true;
        e.blocker = false;
        e.inst.tme = random() * 5;
    }, {}, {}, {});
}
function makeDialog(input) {
    let lines = input.split('\n').map(line => {
        let parts = line.split('|');
        return { who: 1 * parts[0], says: parts[1], condition: 1 * parts[2] || 0 /* DialogCondition.Timeout */ };
    });
    dialog = { lines };
    dialogLine = -1;
    dialogNext();
}
function dialogClear() {
    dialog = 0;
    showingInstruction = -1;
}
let dialog = 0;
let dialogLine = 0;
let dialogTime = 0;
let dialogWait = 2;
let dialogShowingAll = false;
const dialogNext = () => {
    dialogLine++;
    dialogTime = 0;
    dialogWait = 2;
    dialogShowingAll = false;
};
function dialogIsComplete() {
    return dialog === 0 || dialogLine >= dialog.lines.length;
}
function dialogTick() {
    if (dialog === 0)
        return false;
    let dline = dialog.lines[dialogLine];
    if (!dline)
        return false;
    dialogTime += ds;
    if (dialogShowingAll) {
        dialogWait -= ds;
    }
    if (dline.condition === 1 /* DialogCondition.Press */) {
        if (justPressed[90 /* Keys.Dialog */]) {
            return dialogNext();
        }
    }
    if (dline.condition === 0 /* DialogCondition.Timeout */) {
        if (dialogWait < 0) {
            return dialogNext();
        }
    }
    let maxLetters = 22;
    let textX = 3;
    if (dline.who > 0) {
        ctx.resetTransform();
        fillStyl(cssPalette[0]);
        globalAlph(0.5);
        ctx.fillRect(0, 80 - 28, 22, 28);
        globalAlph(1);
        drawAnim(portraitAnim, (dline.who - 1) * 2 + (dialogShowingAll ? 0 : round(dialogTime * 8) % 2), 1, 80 - 27);
        maxLetters = 20;
        textX = 22;
    }
    let words = dline.says.split(' ');
    let line = '';
    let lines = [];
    while (words.length) {
        if (line.length + words[0].length > maxLetters) {
            lines.push(line);
            line = '';
        }
        line += ' ' + words.shift();
    }
    lines.push(line);
    let y = 80 - lines.length * 8 - 1;
    let remaining = dialogTime * 20;
    lines.map(l => {
        let showing = min(remaining, l.length);
        globalAlph(0.5);
        ctx.fillRect(textX, y - 1, 100, 8);
        globalAlph(1);
        let txt = l.substring(0, showing);
        let wid = printText(0, 0, txt, true);
        printText(textX + floor((screenWidth - 4 - textX - wid) / 2), y, txt);
        remaining -= showing;
        y += 8;
    });
    dialogShowingAll = remaining > 0;
    return true;
}
let sceneTime = 0;
let sceneFader = 0;
let sceneIsComplete = false;
let currentScene = -1;
let sceneFlags = {};
function startScene(index) {
    currentScene = index;
    let s = scenes[index];
    enemiesClear();
    tilemapsClear();
    dialogClear();
    instructionsSnapshot();
    guitarClearRequests();
    guy.actv = false;
    sceneTime = 0;
    sceneFader = 0;
    scene = s;
    sceneIsComplete = false;
    sceneFlags = {};
    activeChord = chordG;
    s.setup(s);
}
function sceneTick() {
    sceneTime += ds;
    scene.tick?.(scene);
    if (sceneIsComplete) {
        if (!sceneFlags.endd) {
            scene.endd?.();
            sceneFlags.endd = true;
        }
        if (dialogIsComplete()) {
            sceneFader -= ds * 3;
            if (sceneFader < 0) {
                sceneFader = 0;
                startScene(scene.nextScene);
            }
        }
    }
    else {
        sceneFader = min(sceneFader + ds, 1);
    }
    if (sceneFader < 1) {
        fillStyl(cssPalette[0]);
        globalAlph(1.0 - sceneFader);
        ctx.fillRect(0, 0, screenWidth, screenHeight);
        globalAlph(1);
    }
}
function sceneComplete() {
    sceneIsComplete = true;
}
function sceneDeath() {
    instructionsRestore();
    startScene(currentScene);
}
function guitarSong() {
    guitarClearRequests();
    jangleTime = 0;
    repeat(10, () => {
        guitarJangle(chordG, 2);
        guitarJangle(chordAm, 2);
        guitarJangle(chordF, 2);
        guitarJangle(chordGm, 2);
    });
}
const scenes = [
    {
        setup: (s) => {
            sceneFlags.loading = false;
        },
        tick: () => {
            let msg = "INSERT CARTRIDGE\nPRESS SPACE";
            if (sceneFlags.loading) {
                msg += "\nLOADING";
                repeat(sceneTime * 7, () => msg += '.');
                if (sceneTime > 3) {
                    sceneComplete();
                }
            }
            msg += (sceneTime % 0.25) > 0.1 ? "*" : "";
            printText(3, 3, msg);
            if (justPressed[32 /* Keys.Attack */] && !sceneFlags.loading) {
                sceneFlags.loading = true;
                sceneTime = 0;
            }
        },
        nextScene: 1,
        title: true
    },
    {
        setup: (s) => {
            spawnGuy(0, 0);
            guitarSong();
        },
        tick: () => {
            if (sceneTime > 3) {
                instructionsShow([0 /* EventTypes.Start */]);
            }
            printText(3, 3, "ROBIN\nOF\nTHIRTEENSLEY");
            if (justPressed[32 /* Keys.Attack */]) {
                reportEvent(0 /* EventTypes.Start */);
                sceneComplete();
            }
        },
        nextScene: 3,
        title: true
    },
    {
        setup: () => {
            spawnGuy(0, 0);
            guitarSong();
            guyCelebrate(0, 0);
            makeDialog(`|TO BE CONTINUETH!
|THANK THEE FOR PLAYING THIS DEMO!
|LOOK FOR THE FULL ADVENTURE AT GREAT STORES LIKE BYTE SHOP, IN THE FALL OF '83|2`);
        },
        tick: () => {
            if (sceneTime > 30 || justPressed[32 /* Keys.Attack */]) {
                dialogClear();
                sceneComplete();
            }
        },
        nextScene: 1,
        title: true
    },
    {
        setup: () => {
            makeLevel1();
            //playSong(songJangle);
            makeDialog(`1|HAH, YOU THINK YOU CAN JOIN OUR BAND?!
1|PROVE IT. COLLECT ALL THE COIN`);
        },
        tick: () => {
            instructionsShow([1 /* EventTypes.Move */, 2 /* EventTypes.Jump */]);
            if (coinCounter >= coinsTotal) {
                instructionsShow([3 /* EventTypes.Exit */]);
            }
        },
        endd: () => {
            makeDialog(`1|A MONKEY COULD HAVE DONE THAT...`);
        },
        nextScene: 4
    },
    {
        setup: () => {
            makeLevel2();
            makeDialog(`1|OK, COINS DON'T JUST GROW ON TREES
1|SKEWER THESE TRAINING DUMMIES`);
        },
        tick: () => {
            instructionsShow([4 /* EventTypes.GuyGarde */, 5 /* EventTypes.Lunge */]);
        },
        endd: () => {
            makeDialog(`1|WELL MAYBE YOU'RE NOT HOPELESS...`);
        },
        nextScene: 5
    },
    {
        setup: () => {
            makeLevel3();
            makeDialog(`1|LET'S TRY A REAL FIGHT
1|WILL, GET OVER HERE!`);
        },
        tick: () => {
            instructionsShow([6 /* EventTypes.Parry */, 7 /* EventTypes.Feint */]);
        },
        endd: () => {
            makeDialog(`1|THAT WAS PRETTY...
2|JOHN, JOHN!
2|THERE'S A CARRIAGE COMING!
1|HO BOY! EVERYONE TO THE AMBUSH
1|YOU TOO, ROBIN`);
        },
        nextScene: 6
    },
    {
        setup: () => {
            makeLevel4();
            makeDialog(`1|MAKE YOUR WAY CAREFULLY
1|STAY AWAY FROM THE WILDLIFE
1|OH, AND THE TRAPS. WE HAVE BOOBY TRAPS`);
        },
        tick: () => {
            instructionsShow([8 /* EventTypes.DoubleJump */]);
        },
        endd: () => {
            makeDialog(`1|EVERYONE HERE? SHHH THEY'RE COMING`);
        },
        nextScene: 7
    },
    {
        setup: () => {
            makeLevel5();
            makeDialog(`1|IT'S A REVERSE AMBUSH!
1|ROBIN TAKE CARE OF THE SHERRIF'S MEN!`);
        },
        tick: () => {
        },
        endd: () => {
            makeDialog(`3|HELP HELP!
2|IS THAT... THE MAID MARION?
1|ROBIN, STOP THAT CARRIAGE!`);
        },
        nextScene: 2
    },
];
let scene;
startScene(0);
let mainCanvas = document.getElementById('c');
let screenWidth = 128;
let screenHeight = 80;
mainCanvas.width = screenWidth;
mainCanvas.height = screenHeight;
let ctx = get2DContext(mainCanvas);
ctx.imageSmoothingEnabled = false;
//mainCanvas.style.maxWidth = `${screenWidth*4}px`;
let last = 0;
let titleWidth = [0, 0, 0, 0, 0];
let hudTick = noop;
function tick(clock) {
    resetTransform();
    fillStyl('#21181b');
    ctx.fillRect(0, 0, screenWidth, screenHeight);
    let dt = min(100, clock - last);
    if (last === 0) {
        dt = 0;
    }
    last = clock;
    ds = dt / 1000.0;
    //ds = 0.004;
    clck += ds;
    tickGuy(guy);
    enemiesTick();
    cameraUpdate();
    tilemapDraw();
    enemiesDraw();
    guyDraw(guy);
    ctx.resetTransform();
    if (dialogTick()) {
    }
    else {
        if (coinsTotal) {
            drawAnim(coinAnim, 0, 107 - 21, 73 - 18);
            printText(107, 72, `${coinCounter}/${coinsTotal}`);
        }
    }
    if (!scene.title) {
        let health = "";
        //console.log(guy.health);
        repeat(3, (i) => health += (i < guy.health ? '$' : '%'));
        printText(56, 4, health);
    }
    sceneTick();
    justPressed = [];
    hudTick();
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mainCanvas);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    guitarBeater();
    requestAnimationFrame(tick);
}
mainCanvas.style.display = 'none';
let canvas3d = document.createElement('canvas');
document.body.appendChild(canvas3d);
canvas3d.width = screenWidth * 8;
canvas3d.height = screenHeight * 8;
let gl = canvas3d.getContext("webgl2");
{
    let vertices = [
        -1, -1,
        -1, 1,
        1, -1,
        1, 1,
    ];
    let vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    let vertCode = `
attribute vec2 c;
varying vec2 u;
void main(void) {
u=c*0.5+0.5;
u.y=1.0-u.y;
gl_Position=vec4(c,0.5,1.0);
}`;
    let vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);
    let fragCode = `
precision highp float;
varying vec2 u;
uniform sampler2D t;
void main(void) {
vec2 a=u;
a.x+=sin(u.x*6.28)*0.01;
a.y+=sin(u.y*6.28)*0.01;
vec4 c=texture2D(t,a);
c.r=texture2D(t,a+vec2(0.004,0.0)).r;
c.b=texture2D(t,a-vec2(0.004,0.0)).b;
vec2 d=abs(2.0*u-1.0);
float v=1.0-pow(d.x,20.0)-pow(d.y,20.0);
float l=1.0-pow(d.x,4.0)-pow(d.y,4.0);
c*=(0.5+0.6*l)*step(0.0,v)*(0.8+0.3*abs(sin(a.y*3.14*${screenHeight}.0)));
c.a = 0.8;
gl_FragColor=c;
}`;
    let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);
    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //gl.viewport(0,0,canvas3d.width,canvas3d.height);
}
tick(0);
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
    let fix3 = (n) => n !== undefined ? n.toFixed(1).padStart(5, ' ') : 'N/A';
    let fix = (n) => n !== undefined ? n.toFixed(1) : 'N/A';
    let int = (n) => n !== undefined ? n.toFixed(0) : 'N/A';
    let animStyle = (i) => ['nloop', ' loop', ' revr', ' ping', ' pong'][i];
    hudTick = () => {
        ctx.save();
        let en = enemies.filter(e => e.anim == merryAnim)[0];
        let lines = [
            `guy: p${fix(guy.x)},${fix(guy.y)}, f${int(findFloor([guy.x, guy.y]))}`,
            `guystat: ${guy.stat} d${fix3(guy.dx)},${fix3(guy.dy)}`,
            `guy fr:${guy.inst.frm} t:${fix3(guy.inst.tme)} dur:${guy.anim.cels[guy.inst.frm].dur} m:${animStyle(guy.inst.styl)}`,
            `tile: ${floor(guy.x / 8)},${floor(guy.y / 8)}`,
            `camera: ${camera[0]},${camera[1]}`,
            `${fix3(1.0 / ds)}fps`,
        ];
        if (en) {
            lines = lines.concat([
                `enmy fr:${en.inst.frm} t:${fix3(en.inst.tme)} dur:${en.anim.cels[en.inst.frm].dur} m:${animStyle(en.inst.styl)}`,
                `enmy st:${en.stat} tm:${fix3(en.timer)} hlt:${en.health}`,
                `enmy act:${fix3(en.actionTimer)}`,
            ]);
        }
        debugHUD.innerText = lines.join('\n');
        applyCamera();
        const debugCapsule = (c, col) => {
            if (!c) {
                return;
            }
            ctx.strokeStyle = col;
            //ctx.strokeRect(round(c.x - c.w) - 0.5, round(-c.y) - 0.5, round(c.w *   2), round(-c.h));
        };
        globalAlph(0.5);
        ctx.lineWidth = 1;
        ctx.imageSmoothingEnabled = false;
        let intersecting = false;
        enemies.forEach(e => {
            if (!e.actv) {
                return;
            }
            debugCapsule(e.detect, '#0aa');
            debugCapsule(e.attack, '#f33');
            if (e.danger) {
                if (intersectCapsules(e, guy.gardeCheck)) {
                    intersecting = true;
                }
            }
        });
        debugCapsule(guy, '#ff0');
        //debugCapsule(guy.gardeCheck, intersecting ? '#009' : '#09f');
        enemies.forEach(e => {
            if (e.actv) {
                debugCapsule(e, '#ff0');
            }
        });
        debugCapsule(guy.attackBox, '#f09');
        debugCapsule(guy.parryBox, '#0f9');
        debugCapsule(guy.feintBox, '#f09');
        ctx.restore();
    };
})();
//ENDDEBUG
