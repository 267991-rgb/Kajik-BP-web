const content = {
  radost: {
    table: [
      { text: "Mám dnes radostný den.", audio: "audio-radost-1" },
      { text: "Cítím se lehce a klidně.", audio: "audio-radost-2" },
      { text: "V srdci mám světlo.", audio: "audio-radost-3" }
    ]
  },
  smutek: {
    table: [
      { text: "Je mi dnes tiché a smutné.", audio: "audio-smutek-1" },
      { text: "Cítím v sobě jemnou únavu.", audio: "audio-smutek-2" },
      { text: "Potřebuju chvíli klidu.", audio: "audio-smutek-3" }
    ]
  },
  hnev: {
    table: [
      { text: "Mám v sobě silný hněv.", audio: "audio-hnev-1" },
      { text: "Cítím prudkou energii.", audio: "audio-hnev-2" },
      { text: "Potřebuju vydechnout.", audio: "audio-hnev-3" }
    ]
  },
  duraz: {
    table: [
      { text: "Mám se dobře.", audio: "audio-duraz-1" },
      { text: "Jsem silný a klidný.", audio: "audio-duraz-2" },
      { text: "Dnes to zvládnu.", audio: "audio-duraz-3" }
    ]
  },
  rytmus: {
    table: [
      { text: "Dýchám pomalu a jistě.", audio: "audio-rytmus-1" },
      { text: "Každý nádech je klidný.", audio: "audio-rytmus-2" },
      { text: "Tady jsem a jsem v pohodě.", audio: "audio-rytmus-3" }
    ]
  }
};

// Rytmický přepis pro věty na stránce Rytmus.
// Každý záznam obsahuje pole segmentů, kde každý segment má vlastní značku.
// Příklad zápisu: "Us/. mí/- vám/- se/."
const rhythmBreakdownByText = {
  "Usmívám se celý den": [
    { segment: "Us", mark: "." },
    { segment: "mí", mark: "-" },
    { segment: "vám", mark: "-" },
    { segment: "se", mark: "." },
    { segment: "kaž", mark: "." },
    { segment: "dý", mark: "-" },
    { segment: "den", mark: "." }
  ],
  "Mám se dobře": [
    { segment: "Mám", mark: "-" },
    { segment: "se", mark: "." },
    { segment: "do", mark: "." },
    { segment: "bře", mark: "." }
  ],
  "Dnes je krásný den": [
    { segment: "Dnes", mark: "." },
    { segment: "je", mark: "." },
    { segment: "krás", mark: "-" },
    { segment: "ný", mark: "-" },
    { segment: "den", mark: "." }
  ],
  "Mám radostný den": [
    { segment: "Mám", mark: "." },
    { segment: "ra", mark: "." },
    { segment: "dos", mark: "." },
    { segment: "tný", mark: "-" },
    { segment: "den", mark: "." }
  ],
  "Venku svítí slunce": [
    { segment: "Ven", mark: "." },
    { segment: "ku", mark: "." },
    { segment: "sví", mark: "-" },
    { segment: "tí", mark: "-" },
    { segment: "slun", mark: "." },
    { segment: "ce", mark: "." }
  ],
  "Jsem šťastný": [
    { segment: "Jsem", mark: "." },
    { segment: "šťast", mark: "-" },
    { segment: "ný", mark: "-" }
  ],
  "Život je krásný": [
    { segment: "Ži", mark: "." },
    { segment: "vot", mark: "." },
    { segment: "je", mark: "." },
    { segment: "krás", mark: "-" },
    { segment: "ný", mark: "-" }
  ],
  "Srdce mi zpívá": [
    { segment: "Srd", mark: "." },
    { segment: "ce", mark: "." },
    { segment: "mi", mark: "." },
    { segment: "zpí", mark: "-" },
    { segment: "vá", mark: "-" }
  ],
  "Dýchám pomalu a jistě": [
    { segment: "Dý", mark: "-" },
    { segment: "chám", mark: "-" },
    { segment: "po", mark: "." },
    { segment: "ma", mark: "." },
    { segment: "lu", mark: "." },
    { segment: "a", mark: "." },
    { segment: "jis", mark: "-" },
    { segment: "tě", mark: "." }
  ],
  "Každý nádech je klidný": [
    { segment: "Kaž", mark: "-" },
    { segment: "dý", mark: "-" },
    { segment: "ná", mark: "-" },
    { segment: "dech", mark: "-" },
    { segment: "je", mark: "." },
    { segment: "klid", mark: "-" },
    { segment: "ný", mark: "-" }
  ],
  "Tady jsem a jsem v pohodě": [
    { segment: "Ta", mark: "." },
    { segment: "dy", mark: "." },
    { segment: "jsem", mark: "-" },
    { segment: "a", mark: "." },
    { segment: "jsem", mark: "-" },
    { segment: "v", mark: "." },
    { segment: "po", mark: "." },
    { segment: "ho", mark: "." },
    { segment: "dě", mark: "-" }
  ]
};

function normalizeRhythmText(text) {
  return String(text || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.!?]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getRhythmBreakdownForText(text) {
  const normalized = normalizeRhythmText(text);
  const matchingKey = Object.keys(rhythmBreakdownByText).find(
    (key) => normalizeRhythmText(key) === normalized
  );
  return matchingKey ? rhythmBreakdownByText[matchingKey] : buildDefaultRhythmBreakdown(text);
}

function getRandomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function normalizeSentenceToAudioFile(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function buildAudioSrcCandidates(page, item) {
  if (!item || !item.text) return [];

  const fileName = normalizeSentenceToAudioFile(item.text);
  if (!fileName) return [];

  const candidates = [];
  const addCandidate = (value) => {
    const reference = String(value || '').trim().replace(/\\/g, '/');
    if (!reference) return;
    const cleanReference = reference.replace(/^\.\/audio\//i, '').replace(/^audio\//i, '');
    const withExtension = /\.(mp3|m4a|wav)$/i.test(cleanReference)
      ? cleanReference
      : `${cleanReference}.mp3`;
    const src = `./audio/${withExtension}`;
    if (!candidates.includes(src)) candidates.push(src);
  };

  addCandidate(item.audio);

  const prefixes = ['radost', 'smutek', 'hnev'].includes(page)
    ? ['emoce', page, 'radost', 'smutek', 'hnev']
    : [page];

  const uniquePrefixes = [];
  const seen = new Set();
  for (const prefix of prefixes) {
    if (!prefix || seen.has(prefix)) continue;
    seen.add(prefix);
    uniquePrefixes.push(prefix);
  }

  uniquePrefixes.forEach((prefix) => addCandidate(`${prefix}_${fileName}.mp3`));
  return candidates;
}

function buildAudioSrc(page, item) {
  const candidates = buildAudioSrcCandidates(page, item);
  return candidates[0] || '';
}

async function resolveAudioSrc(page, item) {
  const candidates = buildAudioSrcCandidates(page, item);
  if (!candidates.length) return '';

  for (const src of candidates) {
    try {
      const res = await fetch(src, { method: 'HEAD' });
      if (res.ok) return src;
    } catch (error) {
      // Pokračujeme na další variantu názvu souboru.
    }
  }

  return candidates[0];
}

let sentenceAudio = null;

function getSentenceAudioElement() {
  if (!sentenceAudio) {
    sentenceAudio = document.createElement('audio');
    sentenceAudio.preload = 'auto';
    sentenceAudio.style.display = 'none';
    document.body.appendChild(sentenceAudio);
  }
  return sentenceAudio;
}

function stopSentenceAudio() {
  const audio = getSentenceAudioElement();
  audio.pause();
  audio.currentTime = 0;
}

function playSentenceAudio(src) {
  if (!src) return;
  const audio = getSentenceAudioElement();
  stopSentenceAudio();
  audio.src = src;
  audio.load();
  audio.play().catch(() => {});
}

function parseRhythmBreakdown(rawValue) {
  if (rawValue === undefined || rawValue === null) return [];

  const text = String(rawValue).trim();
  if (!text) return [];

  const parts = text
    .split(/\r?\n/)
    .flatMap((line) => line.split(/\s+/))
    .filter(Boolean);

  const result = [];
  for (const part of parts) {
    const match = part.match(/^(.*?)(?:\/|\|)(.*)$/);
    if (match) {
      const segment = match[1].trim();
      const mark = match[2].trim();
      if (segment) result.push({ segment, mark: mark || '.' });
      continue;
    }

    const directMatch = part.match(/^(.*?)([.\-])$/);
    if (directMatch) {
      const segment = directMatch[1].trim();
      const mark = directMatch[2] === '-' ? '-' : '.';
      if (segment) result.push({ segment, mark });
      continue;
    }

    result.push({ segment: part.trim(), mark: '.' });
  }

  return result;
}

function buildDefaultRhythmBreakdown(text) {
  const words = String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return words.map((word) => {
    const cleanWord = word.replace(/[.,;:!?]/g, '').trim();
    if (!cleanWord) return { segment: word, mark: '.' };
    const hasLongVowel = /[áéíóúůý]/i.test(cleanWord);
    return { segment: word, mark: hasLongVowel ? '-' : '.' };
  });
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));
}

function getRichTextMarkup(cell) {
  const text = String(cell?.w ?? cell?.v ?? '').trim();
  if (!cell?.h || typeof DOMParser === 'undefined') {
    return { text, html: escapeHtml(text), hasBold: false };
  }
  const root = new DOMParser().parseFromString(`<div>${cell.h}</div>`, 'text/html')
    .body.firstElementChild;
  let hasBold = false;
  const renderNode = (node, inheritedBold = false) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const value = node.nodeValue || '';
      return inheritedBold ? `<strong class="emphasis-word">${escapeHtml(value)}</strong>` : escapeHtml(value);
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    const style = node.getAttribute('style') || '';
    const isBold = inheritedBold || /^(b|strong)$/i.test(node.tagName)
      || /font-weight\s*:\s*(bold|[6-9]00)/i.test(style);
    if (isBold) hasBold = true;
    return Array.from(node.childNodes).map((child) => renderNode(child, isBold)).join('');
  };
  const html = Array.from(root?.childNodes || []).map((node) => renderNode(node)).join('');
  return { text, html: html || escapeHtml(text), hasBold };
}

async function loadTableFromXLSX(page) {
  const baseName = `tabulka-${page}.xlsx`;
  const candidates = [`./${baseName}`];

  for (const path of candidates) {
    try {
      const separator = path.includes('?') ? '&' : '?';
      const res = await fetch(`${path}${separator}v=20260913`, { cache: 'no-store' });
      if (!res.ok) continue;
      const ab = await res.arrayBuffer();
      const workbook = XLSX.read(ab, { type: 'array', cellHTML: true });
      const firstSheet = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheet];
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      const items = [];
      for (let rowIndex = range.s.r; rowIndex <= range.e.r; rowIndex += 1) {
          const textCell = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: 0 })];
          const richText = getRichTextMarkup(textCell);
          const rhythmCell = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: 1 })];
          const audioCell = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: 2 })];
          const text = richText.text;
          const rhythmRaw = rhythmCell ? String(rhythmCell.w ?? rhythmCell.v ?? '').trim() : '';
          const parsedRhythm = parseRhythmBreakdown(rhythmRaw);
          const item = {
            text,
            emphasisHtml: richText.html,
            hasBold: richText.hasBold,
            rhythm: parsedRhythm.length || page !== 'rytmus'
              ? parsedRhythm
              : getRhythmBreakdownForText(text),
            audio: audioCell ? String(audioCell.w ?? audioCell.v ?? '').trim() : `audio-${page}-${rowIndex + 1}`
          };
          if (item.text.length > 0) items.push(item);
      }

      if (items.length) {
        content[page] = content[page] || {};
        content[page].table = items;
        content[page].queue = shuffle(items.slice());
        content[page].idx = 0;
      }
      return items;
    } catch (e) {
      // pokračujeme další možností
    }
  }

  return null;
}

function loadGraphImage(page) {
  const img = document.getElementById('graph-img');
  if (!img) return;
  const src = `graf-${page}.PNG`;
  img.src = src;
  img.onerror = () => { img.style.display = 'none'; };
  img.onload = () => { img.style.display = 'block'; };
}

async function loadCombinedTables(pages) {
  const all = [];
  for (const p of pages) {
    const items = await loadTableFromXLSX(p);
    if (items && items.length) all.push(...items);
  }
  return all;
}

function getRhythmWordEndIndexes(text, rhythmItems) {
  const words = String(text || '')
    .split(/\s+/)
    .map((word) => normalizeRhythmText(word).replace(/[^a-záéíóúůýčřžšťďň]/gi, ''))
    .filter(Boolean);
  const wordEndIndexes = new Set();
  let wordIndex = 0;
  let wordLength = words[0] ? words[0].length : 0;
  let segmentLength = 0;

  rhythmItems.forEach(({ segment }, index) => {
    segmentLength += normalizeRhythmText(segment).replace(/[^a-záéíóúůýčřžšťďň]/gi, '').length;
    if (wordLength && segmentLength >= wordLength) {
      wordEndIndexes.add(index);
      wordIndex += 1;
      wordLength = words[wordIndex] ? words[wordIndex].length : 0;
      segmentLength = 0;
    }
  });

  return wordEndIndexes;
}

function showLocalFileWarning() {
  if (location.protocol !== 'file:') return;

  const existing = document.getElementById('local-file-warning');
  if (existing) return;

  const banner = document.createElement('div');
  banner.id = 'local-file-warning';
  banner.textContent = 'Audio nefunguje při otevření přes file://. Spusťte stránku přes localhost: http://localhost:8000/';
  banner.style.position = 'fixed';
  banner.style.top = '0';
  banner.style.left = '0';
  banner.style.right = '0';
  banner.style.zIndex = '9999';
  banner.style.background = '#7a1f1f';
  banner.style.color = '#fff';
  banner.style.padding = '12px 16px';
  banner.style.fontSize = '14px';
  banner.style.fontWeight = '600';
  banner.style.textAlign = 'center';
  banner.style.boxShadow = '0 2px 8px rgba(0,0,0,0.25)';

  document.body.prepend(banner);
}

function initThemeToggle() {
  const savedTheme = localStorage.getItem('kajik-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.body.dataset.theme = initialTheme;

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'theme-toggle';
  toggle.addEventListener('click', () => {
    const theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    document.body.dataset.theme = theme;
    localStorage.setItem('kajik-theme', theme);
    updateThemeToggle(toggle, theme);
  });

  const actions = document.querySelector('.top-bar-actions');
  if (actions) {
    actions.appendChild(toggle);
  } else {
    document.body.appendChild(toggle);
  }
  updateThemeToggle(toggle, initialTheme);
}

function updateThemeToggle(toggle, theme) {
  const isDark = theme === 'dark';
  toggle.innerHTML = `<span class="theme-toggle-icon" aria-hidden="true">${isDark ? '☀' : '☾'}</span><span>${isDark ? 'Světlý režim' : 'Tmavý režim'}</span>`;
  toggle.setAttribute('aria-label', isDark ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim');
  toggle.title = toggle.getAttribute('aria-label');
}

const sentenceStreakStorageKey = 'kajik-sentence-streak';

function readSentenceStreak() {
  try {
    return JSON.parse(sessionStorage.getItem(sentenceStreakStorageKey) || 'null');
  } catch (error) {
    return null;
  }
}

function markCurrentSessionPage() {
  const state = readSentenceStreak();
  if (!state || state.path === location.pathname) return;
  sessionStorage.setItem(sentenceStreakStorageKey, JSON.stringify({
    path: location.pathname,
    count: 0
  }));
}

function showStreakCelebration() {
  let celebration = document.getElementById('streak-celebration');
  if (!celebration) {
    celebration = document.createElement('div');
    celebration.id = 'streak-celebration';
    celebration.className = 'streak-celebration';
    celebration.setAttribute('role', 'status');
    celebration.setAttribute('aria-live', 'polite');
    celebration.innerHTML = `
      <div class="streak-celebration-card">
        <div class="streak-celebration-icon" aria-hidden="true">&#127881;</div>
        <strong>Skvělá série!</strong>
        <span>10 vět za sebou</span>
      </div>
      <i class="streak-confetti streak-confetti-one" aria-hidden="true"></i>
      <i class="streak-confetti streak-confetti-two" aria-hidden="true"></i>
      <i class="streak-confetti streak-confetti-three" aria-hidden="true"></i>
      <i class="streak-confetti streak-confetti-four" aria-hidden="true"></i>`;
    document.body.appendChild(celebration);
  }

  celebration.classList.remove('is-visible');
  void celebration.offsetWidth;
  celebration.classList.add('is-visible');
  window.clearTimeout(celebration.hideTimer);
  celebration.hideTimer = window.setTimeout(() => {
    celebration.classList.remove('is-visible');
  }, 2200);
}

function registerSentenceProgress() {
  const state = readSentenceStreak();
  const nextState = state && state.path === location.pathname
    ? { path: state.path, count: state.count + 1 }
    : { path: location.pathname, count: 1 };

  if (nextState.count >= 10) {
    nextState.count = 0;
    showStreakCelebration();
  }
  sessionStorage.setItem(sentenceStreakStorageKey, JSON.stringify(nextState));
}

async function renderSentence(page, sentenceEl, audioEl) {
  const pageData = content[page];
  if (!pageData || !pageData.table || !pageData.table.length) return;

  let item = null;
  if (pageData.queue && Array.isArray(pageData.queue) && pageData.queue.length) {
    if (pageData.idx === undefined) pageData.idx = 0;
    item = pageData.queue[pageData.idx];
    pageData.idx += 1;
    if (pageData.idx >= pageData.queue.length) {
      pageData.queue = shuffle(pageData.table.slice());
      pageData.idx = 0;
    }
  } else {
    item = getRandomItem(pageData.table || []);
  }

  if (page === 'duraz') {
    if (item.hasBold) {
      sentenceEl.innerHTML = item.emphasisHtml;
    } else {
      const words = item.text.split(' ');
      const emphasizedIndex = Math.floor(words.length / 2);
      words[emphasizedIndex] = `<span class="emphasis-word">${escapeHtml(words[emphasizedIndex])}</span>`;
      sentenceEl.innerHTML = words.join(' ');
    }
  } else if (page === 'rytmus') {
    const rhythmItems = Array.isArray(item.rhythm) && item.rhythm.length
      ? item.rhythm
      : getRhythmBreakdownForText(item.text);

    if (rhythmItems.length) {
      const wordEndIndexes = getRhythmWordEndIndexes(item.text, rhythmItems);
      sentenceEl.innerHTML = rhythmItems
        .map(({ segment, mark }, index) => {
          const displayedMark = mark === '-' ? '-' : mark;
          const wordEndClass = wordEndIndexes.has(index) ? ' rhythm-word-end' : '';
          const markClass = mark === '-' ? ' rhythm-long-mark' : '';
          return `<span class="rhythm-word${wordEndClass}"><span class="rhythm-segment">${segment}</span><span class="rhythm-mark${markClass}">${displayedMark}</span></span>`;
        })
        .join(' ');
    } else {
      sentenceEl.textContent = item.text;
    }
  } else {
    sentenceEl.textContent = item.text;
  }

  const preferredAudioSrc = buildAudioSrc(page, item);
  const audioSrc = await resolveAudioSrc(page, item) || preferredAudioSrc;

  if (audioEl) {
    audioEl.textContent = audioSrc ? audioSrc.replace('./audio/', '') : 'Žádný soubor';
    audioEl.style.cursor = 'pointer';
    audioEl.onclick = () => playSentenceAudio(audioSrc);
  }

  if (sentenceEl) {
    sentenceEl.style.cursor = 'pointer';
    sentenceEl.onclick = () => playSentenceAudio(audioSrc);
  }

  if (playBtn) {
    playBtn.disabled = !audioSrc;
    playBtn.title = audioSrc ? 'Přehrát audio' : 'Žádný soubor';
    playBtn.onclick = () => playSentenceAudio(audioSrc);
  }

  registerSentenceProgress();
}

const page = document.body.dataset.page;
const sentenceEl = document.getElementById('sentence');
const audioEl = document.getElementById('audio-label');
const nextBtn = document.getElementById('next-sentence');
const playBtn = document.getElementById('play-audio-btn');

async function initPage(page) {
  if (!page) return;

  await loadTableFromXLSX(page);

  if (page === 'duraz' || page === 'rytmus') {
    const combined = await loadCombinedTables(['radost', 'smutek', 'hnev']);
    if (combined.length) {
      content[page] = content[page] || {};
      content[page].table = combined;
      content[page].queue = shuffle(combined.slice());
      content[page].idx = 0;
    }
  }

  if (['radost','smutek','hnev'].includes(page)) loadGraphImage(page);

  await renderSentence(page, sentenceEl, audioEl);

  if (nextBtn) {
    nextBtn.addEventListener('click', async () => {
      stopSentenceAudio();
      await renderSentence(page, sentenceEl, audioEl);
    });
  }
}

showLocalFileWarning();
initThemeToggle();
markCurrentSessionPage();

if (page && sentenceEl) {
  initPage(page);
}