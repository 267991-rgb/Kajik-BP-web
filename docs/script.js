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
  duraz: {},
  rytmus: {}
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
        // prepare non-repeating shuffled queue
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
  // use non-repeating queue if present
  if (pageData.queue && Array.isArray(pageData.queue) && pageData.queue.length) {
    if (pageData.idx === undefined) pageData.idx = 0;
    item = pageData.queue[pageData.idx];
    pageData.idx += 1;
    if (pageData.idx >= pageData.queue.length) {
      // reshuffle for next cycle
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

  if (audioEl) {
    audioEl.textContent = item.audio;
  }
}

const page = document.body.dataset.page;
const sentenceEl = document.getElementById('sentence');
const audioEl = document.getElementById('audio-label');
const nextBtn = document.getElementById('next-sentence');

async function initPage(page) {
  if (!page) return;

  // try loading the page's own table
  await loadTableFromXLSX(page);

  // If duraz or rytmus we combine radost/smutek/hnev
  if (page === 'duraz' || page === 'rytmus') {
    const combined = await loadCombinedTables(['radost', 'smutek', 'hnev']);
    if (combined.length) {
      content[page] = content[page] || {};
      content[page].table = combined;
      content[page].queue = shuffle(combined.slice());
      content[page].idx = 0;
    } else {
      // if no excel table could be loaded, keep the page empty until the file exists
      content[page] = content[page] || {};
      content[page].table = [];
      content[page].queue = [];
      content[page].idx = 0;
    }
  }

  // load graph image for emotion pages
  if (['radost','smutek','hnev'].includes(page)) loadGraphImage(page);

  // render first sentence (falls back to built-in content if no table loaded)
  renderSentence(page, sentenceEl, audioEl);

  if (nextBtn) {
    nextBtn.addEventListener('click', () => renderSentence(page, sentenceEl, audioEl));
  }
}

if (page && sentenceEl) {
  // initialize asynchronously
  initPage(page);
}
