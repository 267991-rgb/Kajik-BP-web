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

function renderSentence(page, sentenceEl, audioEl) {
  const pageData = content[page];
  if (!pageData) return;

  const item = getRandomItem(pageData.table);
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

if (page && sentenceEl) {
  renderSentence(page, sentenceEl, audioEl);

  if (nextBtn) {
    nextBtn.addEventListener('click', () => renderSentence(page, sentenceEl, audioEl));
  }
}
