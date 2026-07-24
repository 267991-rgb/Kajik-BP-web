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

function buildAudioSrc(item) {
  if (!item || !item.text) return '';
  const fileName = normalizeSentenceToAudioFile(item.text);
  return fileName ? `./audio/${fileName}.m4a` : '';
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

async function loadTableFromXLSX(page) {
  const path = `tabulka-${page}.xlsx`;
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error('not found');
    const ab = await res.arrayBuffer();
    const workbook = XLSX.read(ab, { type: 'array' });
    const firstSheet = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheet];
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const items = rows
      .map((r, i) => ({ text: String(r[0] || '').trim(), audio: r[1] ? String(r[1]).trim() : `audio-${page}-${i + 1}` }))
      .filter((it) => it.text.length > 0);
    if (items.length) {
      content[page] = content[page] || {};
      content[page].table = items;
      content[page].queue = shuffle(items.slice());
      content[page].idx = 0;
    }
    return items;
  } catch (e) {
    return null;
  }
}

function loadGraphImage(page) {
  const img = document.getElementById('graph-img');
  if (!img) return;
  const src = `graf-${page}.jpg`;
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
    const words = item.text.split(' ');
    const emphasizedIndex = Math.floor(words.length / 2);
    words[emphasizedIndex] = `<span class="emphasis-word">${words[emphasizedIndex]}</span>`;
    sentenceEl.innerHTML = words.join(' ');
  } else if (page === 'rytmus') {
    const words = item.text.split(/\s+/).filter(Boolean);
    sentenceEl.innerHTML = words
      .map((word) => {
        const mark = getRhythmMark(word);
        return `<span class="rhythm-word"><span class="word-text">${word}</span><span class="rhythm-mark">${mark}</span></span>`;
      })
      .join('');
  } else {
    sentenceEl.textContent = item.text;
  }

  const audioSrc = buildAudioSrc(item);
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
