/* ── FAMCO Accent Color Picker ── */
(function(){
  'use strict';

  var DEFAULT = '#FFD100';

  var PRESETS = [
    { hex:'#FFD100', label:'Yellow'      },
    { hex:'#4AABED', label:'FAMCO Blue'  },
    { hex:'#00BFA5', label:'Teal'        },
    { hex:'#10B981', label:'Emerald'     }
  ];

  /* ── colour math ── */
  function hexToRgb(h){
    h = h.replace('#','');
    return [parseInt(h.substring(0,2),16), parseInt(h.substring(2,4),16), parseInt(h.substring(4,6),16)];
  }
  function rgbToHex(r,g,b){
    return '#'+[r,g,b].map(function(v){ return ('0'+v.toString(16)).slice(-2); }).join('').toUpperCase();
  }
  function mix(c,t,p){ return Math.round(c+(t-c)*p); }

  function darken(rgb,pct){
    return rgb.map(function(c){ return Math.max(0, Math.round(c*(1-pct))); });
  }
  function lighten(rgb,pct){
    return rgb.map(function(c){ return mix(c,255,pct); });
  }

  /* derive all five accent tokens from one base hex */
  function applyAccent(hex){
    var rgb = hexToRgb(hex);
    var dark    = darken(rgb, 0.10);
    var deeper  = darken(rgb, 0.22);
    var light   = lighten(rgb, 0.92);
    var pale    = lighten(rgb, 0.96);
    var root = document.documentElement.style;

    root.setProperty('--y',        hex);
    root.setProperty('--y-rgb',    rgb.join(','));
    root.setProperty('--y-dark',   rgbToHex(dark[0],dark[1],dark[2]));
    root.setProperty('--y-deeper', rgbToHex(deeper[0],deeper[1],deeper[2]));
    root.setProperty('--y-light',  rgbToHex(light[0],light[1],light[2]));
    root.setProperty('--y-pale',   rgbToHex(pale[0],pale[1],pale[2]));

    updateSwatches(hex);
  }

  /* ── inject styles ── */
  var css = document.createElement('style');
  css.textContent = [
    '#cp-fab{position:fixed;right:18px;top:50%;transform:translateY(-50%);z-index:9999;width:42px;height:42px;border-radius:50%;border:2px solid rgba(255,255,255,.25);background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.25);transition:transform .2s,box-shadow .2s;}',
    '#cp-fab:hover{transform:translateY(-50%) scale(1.08);box-shadow:0 6px 22px rgba(0,0,0,.35);}',
    '#cp-fab svg{pointer-events:none;}',
    '#cp-panel{position:fixed;right:18px;top:50%;transform:translateY(-50%) scale(.92);z-index:9998;background:var(--white,#fff);border:1px solid var(--border,#e5e7eb);border-radius:14px;padding:20px 18px 16px;width:200px;box-shadow:0 10px 40px rgba(0,0,0,.16);opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;}',
    '#cp-panel.open{opacity:1;pointer-events:auto;transform:translateY(-50%) scale(1);}',
    '#cp-panel-title{font-size:11px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:var(--muted,#9CA3AF);margin-bottom:14px;}',
    '#cp-swatches{display:flex;gap:10px;margin-bottom:16px;justify-content:center;}',
    '.cp-sw{width:32px;height:32px;border-radius:50%;border:2.5px solid transparent;cursor:pointer;transition:transform .15s,border-color .15s;position:relative;}',
    '.cp-sw:hover{transform:scale(1.12);}',
    '.cp-sw.on{border-color:var(--ink,#111827);}',
    '.cp-sw.on::after{content:"";position:absolute;inset:3px;border-radius:50%;border:2px solid #fff;}',
    '#cp-custom-wrap{position:relative;margin-bottom:12px;}',
    '#cp-custom-btn{width:100%;padding:7px 10px;font-size:12px;font-weight:700;font-family:inherit;border:1.5px solid var(--border,#e5e7eb);border-radius:8px;background:var(--surface,#f9fafb);color:var(--ink,#111827);cursor:pointer;display:flex;align-items:center;gap:6px;transition:border-color .15s;}',
    '#cp-custom-btn:hover{border-color:var(--ink-3,#374151);}',
    '#cp-custom-swatch{width:14px;height:14px;border-radius:4px;border:1px solid rgba(0,0,0,.12);flex-shrink:0;}',
    '#cp-native{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;}',
    '#cp-reset{width:100%;padding:7px 10px;font-size:12px;font-weight:700;font-family:inherit;border:1.5px solid var(--border,#e5e7eb);border-radius:8px;background:transparent;color:var(--muted,#9CA3AF);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;transition:all .15s;}',
    '#cp-reset:hover{border-color:var(--ink-3,#374151);color:var(--ink,#111827);}',
    '@media(max-width:600px){#cp-fab{right:12px;width:36px;height:36px;}#cp-panel{right:12px;width:180px;padding:16px 14px 12px;}}',
  ].join('\n');
  document.head.appendChild(css);

  /* ── inject HTML ── */
  var fab = document.createElement('button');
  fab.id = 'cp-fab';
  fab.setAttribute('aria-label','Change accent colour');
  fab.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><circle cx="8" cy="10" r="1.5" fill="currentColor"/><circle cx="12" cy="7" r="1.5" fill="currentColor"/><circle cx="16" cy="10" r="1.5" fill="currentColor"/><circle cx="15" cy="16" r="2" fill="currentColor"/></svg>';

  var panel = document.createElement('div');
  panel.id = 'cp-panel';

  var swatchesHTML = PRESETS.map(function(p){
    return '<div class="cp-sw" data-hex="'+p.hex+'" title="'+p.label+'" style="background:'+p.hex+'"></div>';
  }).join('');

  panel.innerHTML =
    '<div id="cp-panel-title">Accent Colour</div>' +
    '<div id="cp-swatches">'+swatchesHTML+'</div>' +
    '<div id="cp-custom-wrap">' +
      '<button id="cp-custom-btn"><span id="cp-custom-swatch" style="background:'+DEFAULT+'"></span>Custom Colour</button>' +
      '<input type="color" id="cp-native" value="'+DEFAULT+'">' +
    '</div>' +
    '<button id="cp-reset"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Reset</button>';

  document.body.appendChild(panel);
  document.body.appendChild(fab);

  /* ── interactions ── */
  fab.addEventListener('click', function(){
    panel.classList.toggle('open');
  });

  /* close on outside click */
  document.addEventListener('click', function(e){
    if(!panel.contains(e.target) && e.target !== fab){
      panel.classList.remove('open');
    }
  });

  function updateSwatches(hex){
    hex = hex.toUpperCase();
    var sws = panel.querySelectorAll('.cp-sw');
    for(var i=0;i<sws.length;i++){
      sws[i].classList.toggle('on', sws[i].getAttribute('data-hex').toUpperCase() === hex);
    }
    document.getElementById('cp-custom-swatch').style.background = hex;
    document.getElementById('cp-native').value = hex;
  }

  /* preset clicks */
  document.getElementById('cp-swatches').addEventListener('click', function(e){
    var sw = e.target.closest('.cp-sw');
    if(!sw) return;
    applyAccent(sw.getAttribute('data-hex'));
  });

  /* native color picker */
  document.getElementById('cp-native').addEventListener('input', function(){
    applyAccent(this.value);
  });

  /* reset */
  document.getElementById('cp-reset').addEventListener('click', function(){
    applyAccent(DEFAULT);
  });

  /* initialise swatch state */
  updateSwatches(DEFAULT);

})();
