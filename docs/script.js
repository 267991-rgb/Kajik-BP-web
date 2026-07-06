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
    if (items.length) content[page] = content[page] || {} , content[page].table = items;
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

function renderSentence(page, sentenceEl, audioEl) {
  const pageData = content[page];
  if (!pageData || !pageData.table || !pageData.table.length) return;

  const item = getRandomItem(pageData.table || []);
  if (page === 'duraz') {
    const words = item.text.split(' ');
    const emphasizedIndex = Math.floor(words.length / 2);
    words[emphasizedIndex] = `<span class="emphasis-word">${words[emphasizedIndex]}</span>`;
    sentenceEl.innerHTML = words.join(' ');
  } else if (page === 'rytmus') {
    sentenceEl.textContent = item.text;
    sentenceEl.innerHTML = item.text
      .split('')
      .map((char) => {
        if (char === ' ') return '&nbsp;';
        if (char === '.') return '·';
        if (char === ',') return '•';
        return char;
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
    if (combined.length) content[page] = content[page] || {}, content[page].table = combined;
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
