(function () {
  "use strict";

  var DURATION = 10000;
  var $ = function (id) { return document.getElementById(id); };
  var body = document.body;
  var headline = $("headline"), subline = $("subline"), logs = $("logs");
  var terminal = $("terminal"), popup = $("popup"), hint = $("hint");
  var muteBtn = $("mute"), volume = $("volume"), againBtn = $("again");

  var running = false;
  var muted = false;
  var timers = [];
  var logTimer = null;
  var ctx = null, master = null;

  /* ---------- timers ---------- */
  function at(ms, fn) {
    var id = setTimeout(function () { if (running) fn(); }, ms);
    timers.push(id);
  }
  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
    if (logTimer) { clearInterval(logTimer); logTimer = null; }
  }

  /* ---------- audio ---------- */
  function level() { return (volume.value / 100) * 0.5; }

  function ensureAudio() {
    if (ctx || muted) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = level();
      master.connect(ctx.destination);
      ctx.onstatechange = function () { updateHint(); startHum(); };
      if (ctx.state === "suspended") { ctx.resume().catch(function () {}); }
    } catch (e) { ctx = null; master = null; }
    updateHint();
  }

  function stopAudio() {
    var c = ctx, m = master;
    ctx = null; master = null; hum = null;
    if (!c) { updateHint(); return; }
    try {
      c.onstatechange = null;
      var t = c.currentTime;
      m.gain.cancelScheduledValues(t);
      m.gain.setValueAtTime(m.gain.value, t);
      m.gain.linearRampToValueAtTime(0, t + 0.03);
    } catch (e) {}
    setTimeout(function () { try { c.close(); } catch (e) {} }, 60);
    updateHint();
  }

  function tone(freq, dur, peak) {
    if (!running || muted || !ctx || ctx.state !== "running") return;
    var t = ctx.currentTime + 0.01;
    var osc = ctx.createOscillator();
    var g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + 0.02);
    g.gain.setValueAtTime(peak, t + dur - 0.03);
    g.gain.linearRampToValueAtTime(0, t + dur);
    osc.connect(g); g.connect(master);
    osc.onended = function () { try { osc.disconnect(); g.disconnect(); } catch (e) {} };
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }
  var hum = null, humEnd = 0;
  function startHum() {
    if (hum || !running || muted || !ctx || ctx.state !== "running") return;
    var left = humEnd - performance.now();
    if (left < 400) return;
    var t = ctx.currentTime + 0.01, d = left / 1000;
    var osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.linearRampToValueAtTime(600, t + d);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.4, t + 0.25);
    g.gain.setValueAtTime(0.4, t + d - 0.4);
    g.gain.linearRampToValueAtTime(0, t + d);
    osc.connect(g); g.connect(master);
    osc.onended = function () { try { osc.disconnect(); g.disconnect(); } catch (e) {} if (hum === osc) hum = null; };
    osc.start(t);
    osc.stop(t + d + 0.02);
    hum = osc;
  }
  function beep() {}
  function doubleBeep() {}

  function updateHint() {
    hint.hidden = !(running && !muted && (!ctx || ctx.state !== "running"));
  }

  function unlock() {
    if (!running || muted) return;
    ensureAudio();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().then(startHum).catch(function () {});
    } else { startHum(); }
  }

  /* ---------- scène ---------- */
  var extra = [
    "poort 4410… open", "handshake PX-7F3A… ok", "sessie 0xA13C (fictief)",
    "kanaal versleuteld…", "ontvanger: onbekend", "pakket 0912 ontvangen",
    "luisteren…", "signaal sterker…"
  ];

  function addLine(text) {
    var old = logs.querySelector(".cursor");
    if (old) old.classList.remove("cursor");
    var d = document.createElement("div");
    d.className = "cursor";
    d.textContent = "> " + text;
    logs.appendChild(d);
    while (logs.children.length > 8) logs.removeChild(logs.firstChild);
  }

  function setPhase(n) {
    body.classList.remove("phase-0", "phase-1", "phase-2", "phase-3");
    body.classList.add("phase-" + n);
  }

  function reset() {
    clearTimers();
    logs.textContent = "";
    terminal.classList.remove("on");
    popup.classList.remove("on");
    headline.textContent = "ONBEKENDE VERBINDING ACTIEF";
    subline.textContent = "Een onverwacht signaal is binnengekomen.";
    body.classList.remove("revealed");
    setPhase(0);
    $("reveal").hidden = true;
    $("scene").hidden = false;
  }

  function start() {
    stopAudio();
    reset();
    running = true;
    humEnd = performance.now() + 9000;
    ensureAudio();
    updateHint();
    at(300, startHum);

    at(2000, function () { terminal.classList.add("on"); setPhase(1); });
    at(2300, function () { addLine("Verbinding vastgesteld…"); doubleBeep(700); });
    at(3300, function () { addLine("Bron niet herkend…"); doubleBeep(680); });
    at(4300, function () { addLine("Protocol 10 gestart…"); doubleBeep(660); });

    at(5000, function () {
      setPhase(2);
      headline.textContent = "WIE ZIT ER AAN DE ANDERE KANT?";
      subline.textContent = "Het signaal komt dichterbij.";
      popup.classList.add("on");
      var i = 0;
      logTimer = setInterval(function () {
        addLine(extra[i++ % extra.length]);
        if (i % 2 === 0) beep(820);
      }, 450);
    });

    at(8000, function () {
      clearInterval(logTimer); logTimer = null;
      setPhase(3);
      popup.classList.remove("on");
      headline.textContent = "LAATSTE TRANSMISSIE…";
      subline.textContent = "";
      addLine("laatste transmissie…");
    });

    // 9–10 s: stilte
    at(DURATION, reveal);
  }

  function reveal() {
    if (!running && body.classList.contains("revealed")) return;
    running = false;
    clearTimers();
    stopAudio();
    popup.classList.remove("on");
    terminal.classList.remove("on");
    hint.hidden = true;
    body.classList.remove("phase-0", "phase-1", "phase-2", "phase-3");
    body.classList.add("revealed");
    body.classList.remove("intro-mode");
    $("intro").hidden = true;
    $("scene").hidden = true;
    $("reveal").hidden = false;
  }

  /* ---------- bediening ---------- */
  $("stop").addEventListener("click", reveal);
  againBtn.addEventListener("click", start);

  muteBtn.addEventListener("click", function () {
    muted = !muted;
    muteBtn.setAttribute("aria-pressed", String(muted));
    muteBtn.textContent = muted ? "Geluid aan" : "Geluid uit";
    if (muted) stopAudio(); else { unlock(); }
    updateHint();
  });

  volume.addEventListener("input", function () {
    if (ctx && master) master.gain.setTargetAtTime(level(), ctx.currentTime, 0.02);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && (running || !body.classList.contains("revealed"))) { reveal(); return; }
    unlock();
  });
  document.addEventListener("pointerdown", unlock, { passive: true });
  document.addEventListener("touchstart", unlock, { passive: true });
  document.addEventListener("touchend", unlock, { passive: true });
  document.addEventListener("click", unlock);

  document.addEventListener("visibilitychange", function () { if (document.hidden && running) reveal(); });
  window.addEventListener("pagehide", function () { if (running) reveal(); });

  $("open").addEventListener("click", function () {
    body.classList.remove("intro-mode");
    $("intro").hidden = true;
    start();
  });
})();
