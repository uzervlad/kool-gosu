class BackgroundBuffer {
  constructor(first, second) {
    /** @type {HTMLImageElement} */
    this.bottom = first;
    /** @type {HTMLImageElement} */
    this.top = second;
    this.displaying = "";
  }

  swapImages() {
    this.top.classList.toggle("hidden");
    this.bottom.classList.toggle("hidden");
    let t = this.top;
    this.top = this.bottom;
    this.bottom = t;
  }

  pushImage(path) {
    if(this.displaying == path) return;
    this.displaying = path;
    let img = new Image();
    img.addEventListener("load", _ => {
      this.bottom.src = img.src;
      this.swapImages();
    });
    img.addEventListener("error", _ => {
      this.bottom.src = "";
      this.swapImages();
    });
    img.src = path;
  }
}

/*
  hide-hits -> hides hit counts in gameplay
  hide-mods -> hides mods
  hide-fc-pp -> hides "if fc pp" counter
  hide-stats-l / hide-stats-r -> hides map stats on left/right side
*/
const props = location.hash.slice(1).split("+");

const createCountUp = (el, opts = {}) => new countUp.CountUp(el, 0, {
  duration: 0.5,
  useGrouping: false,
  ...opts,
})

const socket = new ReconnectingWebSocket(`ws://${location.host}/ws`);

if(props.includes("hide-stats-l")) {
  document.querySelector(".stats.left").setAttribute("style", "display: none");
}
if(props.includes("hide-stats-r")) {
  document.querySelector(".stats.right").setAttribute("style", "display: none");
}
if(props.includes("hide-mods")) {
  document.querySelector(".mods").setAttribute("style", "display: none");
}

const els = {
  container: document.querySelector(".container"),
  bg: [
    document.getElementById("first"),
    document.getElementById("second"),
  ],
  artist: document.querySelector(".artist"),
  title: document.querySelector(".title"),
  version: document.querySelector(".version"),
  previews: {
    98: createCountUp(document.querySelectorAll(".pp-preview>.pp")[0], { suffix: 'pp' }),
    99: createCountUp(document.querySelectorAll(".pp-preview>.pp")[1], { suffix: 'pp' }),
    100: createCountUp(document.querySelectorAll(".pp-preview>.pp")[2], { suffix: 'pp' }),
  },
  pp: {
    container: document.querySelector("div.pp"),
    now: createCountUp(document.querySelector(".pp>.now"), { suffix: 'pp' }),
    fc: createCountUp(document.querySelector(".pp>.fc"), { prefix: 'if fc: ', suffix: 'pp' }),
  },
  stats: {
    bpm: document.querySelector(".bpm>.value"),
    stars: document.querySelector(".stars>.value"),
    ar: document.querySelector(".ar>.value"),
    od: document.querySelector(".od>.value"),
    cs: document.querySelector(".cs>.value"),
    hp: document.querySelector(".hp>.value"),
  },
  hits: {
    container: document.querySelector(".hits-container"),
    100: createCountUp(document.querySelectorAll(".hit>.value")[0]),
    50: createCountUp(document.querySelectorAll(".hit>.value")[1]),
    0: createCountUp(document.querySelectorAll(".hit>.value")[2]),
    sb: createCountUp(document.querySelectorAll(".hit>.value")[3]),
  },
  mods: document.querySelector(".mods"),
};

const bg = new BackgroundBuffer(...els.bg);

let oldMods = "";

socket.addEventListener("message", ev => {
  let data = JSON.parse(ev.data);
  let bgPath = `http://${location.host}/Songs/${data.menu.bm.path.full.replace(/#/g,'%23').replace(/%/g,'%25')}`;
  bg.pushImage(bgPath);

  let playing = [2, 7, 14].includes(data.menu.state);
  let showHits = data.menu.state == 2;

  if(playing) {
    els.container.classList.add("playing");
  } else {
    els.container.classList.remove("playing");
  }

  if(showHits && !props.includes("hide-hits")) {
    els.hits.container.classList.add("show");
  } else {
    els.hits.container.classList.remove("show");
  }

  els.artist.innerText = data.menu.bm.metadata.artist;
  els.title.innerText = data.menu.bm.metadata.title;
  els.version.innerText = '[' + data.menu.bm.metadata.difficulty + ']';

  els.stats.bpm.innerText = data.menu.bm.stats.BPM.max;
  els.stats.stars.innerText = data.menu.bm.stats.fullSR;
  els.stats.ar.innerText = data.menu.bm.stats.AR;
  els.stats.od.innerText = data.menu.bm.stats.OD;
  els.stats.cs.innerText = data.menu.bm.stats.CS;
  els.stats.hp.innerText = data.menu.bm.stats.HP;

  els.previews[98].update(data.menu.pp['98']);
  els.previews[99].update(data.menu.pp['99']);
  els.previews[100].update(data.menu.pp['100']);

  els.hits[100].update(data.gameplay.hits['100']);
  els.hits[50].update(data.gameplay.hits['50']);
  els.hits[0].update(data.gameplay.hits['0']);
  els.hits.sb.update(data.gameplay.hits.sliderBreaks);

  let showFcPp = data.gameplay.hits['0'] + data.gameplay.hits.sliderBreaks > 0;

  if(showFcPp && !props.includes("hide-fc-pp")) {
    els.pp.container.classList.add("rip");
  } else {
    els.pp.container.classList.remove("rip");
  }

  els.pp.now.update(data.gameplay.pp.current);
  els.pp.fc.update(data.gameplay.pp.fc);

  let mods = data.menu.mods.str;
  if(oldMods != mods) {
    oldMods = mods;
    mods = mods.match(/.{2}/g) ?? [];
    if(mods[0] == "NM") mods = [];
    if(mods.includes("PF")) mods.splice(mods.indexOf("SD"), 1);
    els.mods.innerHTML = "";
    for(let mod of mods) {
      let modDiv = document.createElement("div");
      modDiv.classList.add("mod");
      if(['EZ', 'NF', 'HT'].includes(mod))
        modDiv.classList.add("green");
      if(['HR', 'SD', 'PF', 'DT', 'NC', 'HD', 'FL'].includes(mod))
        modDiv.classList.add("red");
      if(['RX', 'AP', 'SO', 'AT', 'CN'].includes(mod))
        modDiv.classList.add("blue");
      if(['V2'].includes(mod))
        modDiv.classList.add("gray");
      modDiv.innerText = mod;
      els.mods.append(modDiv);
    }
  }
});