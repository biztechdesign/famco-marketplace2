/* ═══════════════════════════════════════════════════════════════════════
   FAMCO · Autocomplete Search
   Shared across Homepage, BrowseEquipment & EquipmentDetail.
   Pure vanilla JS — no dependencies.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─────────────────────────────────────────
     1. PRODUCT CATALOGUE
     Single source of truth for all suggestions
     ───────────────────────────────────────── */
  var CATALOGUE = [
    {
      name:     'Volvo FH 500 6×4 Tractor Head',
      category: 'Trucks & Commercial',
      brand:    'Volvo',
      year:     '2022',
      meta:     '2022 · 210,000 km · Dubai, UAE',
      href:     'EquipmentDetail.html'
    },
    {
      name:     'Volvo FH16 540 Heavy Haulage',
      category: 'Trucks & Commercial',
      brand:    'Volvo',
      year:     '2021',
      meta:     '2021 · 310,000 km · Sharjah, UAE',
      href:     'EquipmentDetail.html'
    },
    {
      name:     'Volvo FH 460 Globetrotter XL',
      category: 'Trucks & Commercial',
      brand:    'Volvo',
      year:     '2020',
      meta:     '2020 · 390,000 km · Dubai, UAE',
      href:     'EquipmentDetail.html'
    },
    {
      name:     'Volvo FH 2024 Flagship Model',
      category: 'Trucks & Commercial',
      brand:    'Volvo',
      year:     '2024',
      meta:     '2024 · 28,000 km · Abu Dhabi, UAE',
      href:     'EquipmentDetail2.html'
    },
    {
      name:     'Caterpillar 320 GX Hydraulic Excavator',
      category: 'Construction Equipment',
      brand:    'Caterpillar',
      year:     '2021',
      meta:     '2021 · 4,200 hrs · Sharjah, UAE',
      href:     'EquipmentDetail.html'
    },
    {
      name:     'Toyota 8FG25 LPG Counterbalance Forklift',
      category: 'Material Handling',
      brand:    'Toyota',
      year:     '2020',
      meta:     '2020 · 3,800 hrs · Dubai, UAE',
      href:     'EquipmentDetail.html'
    },
    {
      name:     'JCB 3CX Backhoe Loader — Site Master',
      category: 'Construction Equipment',
      brand:    'JCB',
      year:     '2021',
      meta:     '2021 · 5,100 hrs · Abu Dhabi, UAE',
      href:     'EquipmentDetail.html'
    },
    {
      name:     'Hyster H5.0FT Counterbalance Forklift',
      category: 'Material Handling',
      brand:    'Hyster',
      year:     '2019',
      meta:     '2019 · 6,200 hrs · Dubai, UAE',
      href:     'EquipmentDetail.html'
    },
    {
      name:     'Komatsu PC200-8 Hydraulic Excavator',
      category: 'Construction Equipment',
      brand:    'Komatsu',
      year:     '2020',
      meta:     '2020 · 4,900 hrs · Sharjah, UAE',
      href:     'EquipmentDetail.html'
    },
    {
      name:     'Mercedes-Benz Actros 2546 Tractor Head',
      category: 'Trucks & Commercial',
      brand:    'Mercedes-Benz',
      year:     '2022',
      meta:     '2022 · 180,000 km · Dubai, UAE',
      href:     'EquipmentDetail.html'
    },
    {
      name:     'Linde E20 Electric Counterbalance Forklift',
      category: 'Material Handling',
      brand:    'Linde',
      year:     '2021',
      meta:     '2021 · 2,100 hrs · Fujairah, UAE',
      href:     'EquipmentDetail.html'
    },
    {
      name:     'Volvo EC300E Hydraulic Crawler Excavator',
      category: 'Construction Equipment',
      brand:    'Volvo',
      year:     '2022',
      meta:     '2022 · 3,200 hrs · Dubai, UAE',
      href:     'EquipmentDetail.html'
    }
  ];

  /* ─────────────────────────────────────────
     2. INJECT STYLES (once per page)
     ───────────────────────────────────────── */
  if (!document.getElementById('famco-ac-css')) {
    var styleEl = document.createElement('style');
    styleEl.id = 'famco-ac-css';
    styleEl.textContent = [
      /* --- anchor --- */
      '.srch{position:relative;}',

      /* --- dropdown shell --- */
      '.ac-drop{',
        'display:none;',
        'position:absolute;',
        'top:calc(100% + 8px);',
        'left:0;right:0;',
        'background:#fff;',
        'border:1.5px solid #E5E7EB;',
        'border-radius:12px;',
        'box-shadow:0 8px 32px rgba(0,0,0,.12);',
        'z-index:9999;',
        'overflow:hidden;',
        'font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;',
      '}',
      '.ac-drop.open{display:block;}',

      /* --- suggestion row --- */
      '.ac-item{',
        'display:flex;align-items:center;gap:12px;',
        'padding:11px 16px;',
        'cursor:pointer;',
        'border-bottom:1px solid #F3F4F6;',
        'transition:background .12s;',
      '}',
      '.ac-item:last-of-type{border-bottom:none;}',
      '.ac-item:hover,.ac-item.ac-on{background:#F9FAFB;}',

      /* --- icon bubble --- */
      '.ac-icon{',
        'flex-shrink:0;',
        'width:34px;height:34px;',
        'background:#F3F4F6;',
        'border-radius:8px;',
        'display:flex;align-items:center;justify-content:center;',
        'color:#9CA3AF;',
        'transition:background .12s,color .12s;',
      '}',
      '.ac-item:hover .ac-icon,.ac-item.ac-on .ac-icon{background:#FFF9E0;color:#C9A400;}',

      /* --- text body --- */
      '.ac-body{flex:1;min-width:0;}',
      '.ac-name{',
        'font-size:13.5px;font-weight:600;color:#111827;',
        'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;',
        'line-height:1.4;',
      '}',
      '.ac-sub{',
        'display:flex;align-items:center;gap:7px;',
        'margin-top:3px;flex-wrap:wrap;',
      '}',
      '.ac-badge{',
        'font-size:10px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;',
        'color:#C9A400;background:#FFFBE6;',
        'padding:2px 7px;border-radius:4px;flex-shrink:0;',
      '}',
      '.ac-meta{font-size:11.5px;color:#9CA3AF;}',

      /* --- match highlight --- */
      'mark.ac-hl{',
        'background:#FEF08A;color:#854D0E;',
        'border-radius:2px;padding:0 1px;',
        'font-style:normal;',
      '}',

      /* --- footer / browse-all row --- */
      '.ac-footer{',
        'display:flex;align-items:center;justify-content:space-between;',
        'padding:10px 16px;',
        'background:#F9FAFB;',
        'border-top:1.5px solid #E5E7EB;',
        'cursor:pointer;',
        'font-size:12.5px;font-weight:600;color:#4B5563;',
        'transition:background .12s;',
      '}',
      '.ac-footer:hover{background:#EDEEF0;}',
      '.ac-arr{color:#9CA3AF;transition:transform .15s;}',
      '.ac-footer:hover .ac-arr{transform:translateX(3px);}',

      /* --- empty state --- */
      '.ac-empty{',
        'padding:20px 16px;text-align:center;',
        'font-size:13px;color:#9CA3AF;',
      '}'
    ].join('');
    document.head.appendChild(styleEl);
  }

  /* ─────────────────────────────────────────
     3. UTILITIES
     ───────────────────────────────────────── */

  /** Safely escape HTML characters */
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /** Escape a string for use inside a RegExp */
  function escRe(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Return HTML of `text` with every matched token wrapped in <mark>.
   * Works on already-escaped HTML, so entities stay safe.
   */
  function highlight(text, tokens) {
    var out = esc(text);
    tokens.forEach(function (t) {
      if (!t) return;
      out = out.replace(
        new RegExp('(' + escRe(esc(t)) + ')', 'gi'),
        '<mark class="ac-hl">$1</mark>'
      );
    });
    return out;
  }

  /**
   * Score an item against the query tokens.
   * Higher score = better match / shown first.
   *
   *   3 pts — item.name starts with the full raw query
   *   2 pts — any word in item.name starts with the first token
   *   1 pt  — any searchable field contains every token (anywhere)
   *   0     — no match (excluded)
   */
  function scoreItem(item, raw, tokens) {
    var nameLow = item.name.toLowerCase();
    var rawLow  = raw.trim().toLowerCase();
    var hay     = [item.name, item.category, item.brand, item.year, item.meta]
                    .join(' ').toLowerCase();

    /* All tokens must appear somewhere — baseline gate */
    var allContained = tokens.every(function (t) {
      return hay.indexOf(t) !== -1;
    });
    if (!allContained) return 0;

    /* Prefix on full name (highest priority) */
    if (nameLow.indexOf(rawLow) === 0) return 3;

    /* Any word inside the name starts with the first token */
    var firstToken = tokens[0];
    var nameWords  = nameLow.split(/[\s\-×\/]+/);
    var wordPrefix = nameWords.some(function (w) {
      return w.indexOf(firstToken) === 0;
    });
    if (wordPrefix) return 2;

    /* Generic contains — still a valid result */
    return 1;
  }

  /** Return up to 6 items, sorted best-match first; triggers from 1 character */
  function queryItems(raw) {
    if (!raw || raw.trim().length < 1) return [];
    var tokens = raw.trim().toLowerCase().split(/\s+/).filter(Boolean);

    var scored = [];
    CATALOGUE.forEach(function (item) {
      var s = scoreItem(item, raw, tokens);
      if (s > 0) scored.push({ item: item, score: s });
    });

    /* Sort by score descending, then alphabetically for ties */
    scored.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.item.name.localeCompare(b.item.name);
    });

    return scored.slice(0, 6).map(function (s) { return s.item; });
  }

  /* SVG icon used in every row */
  var ITEM_ICON =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8' +
    'a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>' +
    '</svg>';

  /* ─────────────────────────────────────────
     4. ATTACH AUTOCOMPLETE TO ONE INPUT
     ───────────────────────────────────────── */
  function attach(input) {
    var srch = input.closest('.srch');
    if (!srch) return;

    /* Create and append the dropdown */
    var drop = document.createElement('div');
    drop.className = 'ac-drop';
    drop.setAttribute('role', 'listbox');
    drop.setAttribute('aria-label', 'Search suggestions');
    srch.appendChild(drop);

    var hits   = [];   /* current result array  */
    var cursor = -1;   /* keyboard-focused index */

    /* ── Render the dropdown for a given query ── */
    function render(raw) {
      hits   = queryItems(raw);
      cursor = -1;
      drop.innerHTML = '';

      if (!raw || raw.trim().length < 1) { close(); return; }

      /* Empty state */
      if (hits.length === 0) {
        var emptyEl = document.createElement('div');
        emptyEl.className = 'ac-empty';
        emptyEl.innerHTML = 'No equipment found for \u201c<strong>' + esc(raw.trim()) + '</strong>\u201d';
        drop.appendChild(emptyEl);
        open();
        return;
      }

      var tokens = raw.trim().toLowerCase().split(/\s+/).filter(Boolean);

      hits.forEach(function (item, idx) {
        var row = document.createElement('div');
        row.className = 'ac-item';
        row.setAttribute('role', 'option');
        row.setAttribute('aria-selected', 'false');
        row.innerHTML =
          '<div class="ac-icon">' + ITEM_ICON + '</div>' +
          '<div class="ac-body">' +
            '<div class="ac-name">' + highlight(item.name, tokens) + '</div>' +
            '<div class="ac-sub">' +
              '<span class="ac-badge">' + esc(item.category) + '</span>' +
              '<span class="ac-meta">' + esc(item.meta) + '</span>' +
            '</div>' +
          '</div>';

        /* mousedown (not click) so it fires before the input's blur */
        row.addEventListener('mousedown', function (e) {
          e.preventDefault();
          navigate(null, item.name);
        });
        row.addEventListener('mouseenter', function () { setCursor(idx); });
        drop.appendChild(row);
      });

      /* Browse-all footer */
      var footer = document.createElement('div');
      footer.className = 'ac-footer';
      footer.innerHTML =
        '<span>Browse all results for \u201c<strong>' + esc(raw.trim()) + '</strong>\u201d</span>' +
        '<span class="ac-arr">&#8594;</span>';
      footer.addEventListener('mousedown', function (e) {
        e.preventDefault();
        navigate(null, raw.trim());
      });
      drop.appendChild(footer);

      open();
    }

    /* ── Keyboard cursor management ── */
    function setCursor(i) {
      var rows = drop.querySelectorAll('.ac-item');
      rows.forEach(function (r) {
        r.classList.remove('ac-on');
        r.setAttribute('aria-selected', 'false');
      });
      cursor = i;
      if (i >= 0 && rows[i]) {
        rows[i].classList.add('ac-on');
        rows[i].setAttribute('aria-selected', 'true');
      }
    }

    function open()  { drop.classList.add('open');    }
    function close() { drop.classList.remove('open'); cursor = -1; }

    function navigate(href, query) {
      close();
      /* If a query is provided, go to listing page with search param */
      if (query) {
        window.location.href = 'BrowseEquipment.html?q=' + encodeURIComponent(query);
      } else {
        window.location.href = href;
      }
    }

    /* ── Input events ── */
    input.addEventListener('input', function () {
      render(this.value);
    });

    input.addEventListener('focus', function () {
      if (this.value.trim().length >= 1) render(this.value);
    });

    /* Delay close so mousedown on rows can fire first */
    input.addEventListener('blur', function () {
      setTimeout(close, 160);
    });

    input.addEventListener('keydown', function (e) {
      if (!drop.classList.contains('open')) return;

      var rows = drop.querySelectorAll('.ac-item');
      var max  = rows.length - 1;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setCursor(cursor < max ? cursor + 1 : 0);
          break;

        case 'ArrowUp':
          e.preventDefault();
          setCursor(cursor > 0 ? cursor - 1 : max);
          break;

        case 'Enter':
          e.preventDefault();
          if (cursor >= 0 && cursor < hits.length) {
            navigate(null, hits[cursor].name);
          } else if (input.value.trim().length >= 1) {
            navigate(null, input.value.trim());
          }
          break;

        case 'Escape':
          close();
          input.blur();
          break;
      }
    });

    /* Close on any click outside the search container */
    document.addEventListener('click', function (e) {
      if (!srch.contains(e.target)) close();
    });
  }

  /* ─────────────────────────────────────────
     5. INITIALISE
     ───────────────────────────────────────── */
  function init() {
    document.querySelectorAll('.srch-input').forEach(attach);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
