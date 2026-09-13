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
  return rhythmBreakdownByText[normalized] || buildDefaultRhythmBreakdown(text);
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

function buildAudioSrc(page, item) {
  if (!item || !item.text) return '';
  const fileName = normalizeSentenceToAudioFile(item.text);
  if (!fileName) return '';
  const pagePrefix = page === 'duraz' || page === 'rytmus' ? `${page}_` : '';
  const extension = pagePrefix ? 'mp3' : 'm4a';
  return `./audio/${pagePrefix}${fileName}.${extension}`;
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
  audio.onerror = () => {
    const fallbackSrc = src.replace(/\.m4a$/i, '.mp3');
    if (audio.src !== new URL(fallbackSrc, window.location.href).href) {
      audio.src = fallbackSrc;
      audio.load();
      audio.play().catch(() => {});
    }
  };
  audio.src = src;
  audio.load();
  audio.play().catch(() => {});
}

function parseRhythmBreakdown(rawValue) {
  if (rawValue === undefined || rawValue === null) return [];

  const parts = String(rawValue)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return parts.reduce((result, part) => {
    const match = part.match(/^(.*?)(?:\/|\|)(.*)$/);
    if (match) {
      const segment = match[1].trim();
      if (segment) result.push({ segment, mark: match[2].trim() || '.' });
      return result;
    }

    const directMatch = part.match(/^(.*?)([.,-])$/);
    if (directMatch) {
      result.push({
        segment: directMatch[1].trim(),
        mark: directMatch[2] === '-' ? '-' : directMatch[2]
      });
      return result;
    }

    result.push({ segment: part, mark: '.' });
    return result;
  }, []);
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
  const candidates = [baseName];
  const pathname = window.location.pathname.replace(/\\/g, '/');

  if (!pathname.includes('/docs/')) {
    candidates.push(`docs/${baseName}`);
  } else {
    candidates.push(`./${baseName}`);
  }

  for (const path of candidates) {
    try {
      const res = await fetch(path, { cache: 'no-store' });
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

function getRhythmMark(word) {
  const cleaned = word.toLowerCase().replace(/[^a-záéíóúůýčřžšťď]/g, '');
  if (!cleaned) return '·';
  const syllables = (cleaned.match(/[aeiouyáéíóúůý]+/g) || []).length;
  return syllables > 1 ? '–' : '·';
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

function renderSentence(page, sentenceEl, audioEl) {
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

  const audioSrc = buildAudioSrc(page, item);
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

  renderSentence(page, sentenceEl, audioEl);

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopSentenceAudio();
      renderSentence(page, sentenceEl, audioEl);
    });
  }
}

if (page && sentenceEl) {
  initPage(page);
}
