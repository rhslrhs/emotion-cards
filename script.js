const baseEmotions = [
  { id: "01", name: "편안한", category: "calm", emoji: "🌿" },
  { id: "02", name: "따뜻한", category: "calm", emoji: "☀️" },
  { id: "03", name: "반가운", category: "positive", emoji: "👋" },
  { id: "04", name: "흥미로운", category: "positive", emoji: "🔍" },
  { id: "05", name: "궁금한", category: "positive", emoji: "🧐" },
  { id: "06", name: "자랑스러운", category: "positive", emoji: "👑" },
  { id: "07", name: "느긋한", category: "calm", emoji: "☕" },
  { id: "08", name: "행복한", category: "positive", emoji: "🥰" },
  { id: "09", name: "신나는", category: "positive", emoji: "🎉" },
  { id: "10", name: "기대되는", category: "positive", emoji: "✨" },
  { id: "11", name: "감사한", category: "positive", emoji: "🙏" },
  { id: "12", name: "통쾌한", category: "positive", emoji: "💥" },
  { id: "13", name: "다정한", category: "positive", emoji: "🌸" },
  { id: "14", name: "재미있는", category: "positive", emoji: "😆" },
  { id: "15", name: "감동한", category: "positive", emoji: "🥺" },
  { id: "16", name: "사랑스러운", category: "positive", emoji: "❤️" },
  { id: "17", name: "뿌듯한", category: "positive", emoji: "🌟" },
  { id: "18", name: "만족스러운", category: "calm", emoji: "😊" },
  { id: "19", name: "든든한", category: "calm", emoji: "🛡️" },
  { id: "20", name: "열중한", category: "positive", emoji: "🔥" },
  { id: "21", name: "창피한/수줍은", category: "negative", emoji: "😳" },
  { id: "22", name: "슬픈", category: "negative", emoji: "💧" },
  { id: "23", name: "지루한", category: "negative", emoji: "🥱" },
  { id: "24", name: "답답한", category: "negative", emoji: "😤" },
  { id: "25", name: "짜증나는", category: "negative", emoji: "💢" },
  { id: "26", name: "서운한", category: "negative", emoji: "🌧️" },
  { id: "27", name: "마음이아픈", category: "negative", emoji: "💔" },
  { id: "28", name: "걱정스러운", category: "negative", emoji: "😟" },
  { id: "29", name: "지친", category: "negative", emoji: "🔋" },
  { id: "30", name: "무서운", category: "negative", emoji: "😱" },
  { id: "31", name: "긴장된", category: "negative", emoji: "😬" },
  { id: "32", name: "불안한", category: "negative", emoji: "😰" },
  { id: "33", name: "외로운", category: "negative", emoji: "🎈" },
  { id: "34", name: "실망스러운", category: "negative", emoji: "😞" },
  { id: "35", name: "화가난", category: "negative", emoji: "😡" },
  { id: "36", name: "후회스러운", category: "negative", emoji: "🌧️" },
  { id: "37", name: "불쾌한", category: "negative", emoji: "😖" },
  { id: "38", name: "괴로운/고통스러운", category: "negative", emoji: "🩹" },
  { id: "39", name: "미안한", category: "negative", emoji: "🙇" },
  { id: "40", name: "귀찮은", category: "negative", emoji: "🛋️" },
  { id: "41", name: "기쁜", category: "positive", emoji: "😄" },
  { id: "42", name: "흥분된/황홀한", category: "positive", emoji: "🤩" },
  { id: "43", name: "안정된", category: "calm", emoji: "⚓" },
  { id: "44", name: "자신감있는", category: "positive", emoji: "💪" },
  { id: "45", name: "활기있는", category: "positive", emoji: "⚡" },
  { id: "46", name: "생기가도는", category: "positive", emoji: "🌱" },
  { id: "47", name: "편한/가벼운", category: "calm", emoji: "🎈" },
  { id: "48", name: "안심되는", category: "calm", emoji: "😌" },
  { id: "49", name: "명확해진", category: "calm", emoji: "💡" },
  { id: "50", name: "가슴뭉클한", category: "positive", emoji: "💖" },
  { id: "51", name: "우울한", category: "negative", emoji: "☁️" },
  { id: "52", name: "속상한", category: "negative", emoji: "😿" },
  { id: "53", name: "겁나는", category: "negative", emoji: "😨" },
  { id: "54", name: "미운", category: "negative", emoji: "😠" },
  { id: "55", name: "피곤한", category: "negative", emoji: "💤" },
  { id: "56", name: "억울한", category: "negative", emoji: "🥺" },
  { id: "57", name: "불편한", category: "negative", emoji: "😣" },
  { id: "58", name: "놀란", category: "negative", emoji: "😲" },
  { id: "59", name: "심란한", category: "negative", emoji: "🌀" },
  { id: "60", name: "무관심한", category: "calm", emoji: "😶" }
];

const extraEmotions = [
  { id: "61", name: "설레는", category: "positive", emoji: "💓", isExtra: true },
  { id: "62", name: "아련한", category: "calm", emoji: "🌌", isExtra: true },
  { id: "63", name: "씁쓸한", category: "negative", emoji: "☕", isExtra: true },
  { id: "64", name: "홀가분한", category: "calm", emoji: "🕊️", isExtra: true },
  { id: "65", name: "벅차오르는", category: "positive", emoji: "🎆", isExtra: true },
  { id: "66", name: "허전한", category: "negative", emoji: "🍂", isExtra: true },
  { id: "67", name: "벅찬", category: "positive", emoji: "🌈", isExtra: true },
  { id: "68", name: "멍한", category: "calm", emoji: "😶‍🌫️", isExtra: true },
  { id: "69", name: "평화로운", category: "calm", emoji: "🏡", isExtra: true },
  { id: "70", name: "울컥하는", category: "negative", emoji: "💧", isExtra: true }
];

const emotionsData = [...baseEmotions, ...extraEmotions];
let filteredData = [...emotionsData];
let currentIndex = 0;
let showNumber = false;

const STORAGE_KEY = 'my_selected_emotions_v1';
const selectedEmotions = new Map();

const cardDeck = document.getElementById('cardDeck');
const selectedContainer = document.getElementById('selectedContainer');
const selectedCount = document.getElementById('selectedCount');
const confirmBtn = document.getElementById('confirmBtn');

/* --- 스토리지 관련 함수 --- */
function saveToStorage() {
  const arrayData = Array.from(selectedEmotions.entries());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arrayData));
}

function loadFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      selectedEmotions.clear();
      parsed.forEach(([key, val]) => selectedEmotions.set(key, val));
    } catch (e) {
      console.error("스토리지 복구 오류:", e);
    }
  }
}

/* --- 감정 초기화 --- */
function resetEmotions() {
  if (selectedEmotions.size === 0) {
    showToast('초기화할 감정이 없습니다');
    return;
  }
  
  if (confirm('초기화하시겠어요?')) {
    selectedEmotions.clear();
    saveToStorage();
    updateSelectedUI();
    if (document.getElementById('modalOverlay').classList.contains('active')) {
      renderModalList();
    }
    showToast('🔄 모든 감정이 초기화되었습니다');
  }
}

function renderDeck() {
  cardDeck.innerHTML = '';
  if (filteredData.length === 0) {
    cardDeck.innerHTML = '<div style="display:flex; justify-content:center; align-items:center; height:100%; color:#b2bec3;">카드가 없습니다</div>';
    return;
  }

  for (let i = currentIndex; i < Math.min(currentIndex + 3, filteredData.length); i++) {
    const item = filteredData[i];
    const cardIndex = i - currentIndex;
    
    const card = document.createElement('div');
    card.className = `card ${item.isExtra ? 'extra-card' : ''}`;
    
    const scale = 1 - cardIndex * 0.05;
    const translateY = cardIndex * 15;
    card.style.transform = `translateY(${translateY}px) scale(${scale})`;
    card.style.zIndex = 10 - cardIndex;
    card.style.opacity = 1 - cardIndex * 0.2;

    card.innerHTML = `
      <div class="card-top-row">
        <span class="card-id ${showNumber ? '' : 'hidden'}">NO. ${item.id}</span>
        ${item.isExtra ? '<span class="extra-badge">추가</span>' : '<span></span>'}
      </div>
      <div class="card-emoji">${item.emoji}</div>
      <div class="card-title">${item.name}</div>
      <div class="card-hint">↓ 아래로 당겨 담기</div>
    `;

    if (cardIndex === 0) attachTouchEvents(card, item);
    cardDeck.appendChild(card);
  }
}

function attachTouchEvents(card, emotionItem) {
  let startX = 0, startY = 0, currentX = 0, currentY = 0, isDragging = false;

  const onStart = (e) => {
    isDragging = true;
    const touch = e.touches ? e.touches[0] : e;
    startX = touch.clientX; startY = touch.clientY;
    card.style.transition = 'none';
  };

  const onMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches ? e.touches[0] : e;
    currentX = touch.clientX - startX; currentY = touch.clientY - startY;
    card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${currentX * 0.05}deg)`;
  };

  const onEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

    if (currentY > 100) {
      card.style.transform = 'translateY(300px)';
      card.style.opacity = '0';
      setTimeout(() => { addEmotion(emotionItem); nextCard(); }, 200);
    } else if (currentX < -100) {
      card.style.transform = 'translateX(-300px)';
      setTimeout(() => nextCard(), 200);
    } else if (currentX > 100) {
      card.style.transform = 'translateX(300px)';
      setTimeout(() => prevCard(), 200);
    } else {
      card.style.transform = 'translate(0, 0)';
    }
  };

  card.addEventListener('touchstart', onStart, { passive: true });
  card.addEventListener('touchmove', onMove, { passive: true });
  card.addEventListener('touchend', onEnd);
  card.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);
}

function nextCard() {
  currentIndex = (currentIndex < filteredData.length - 1) ? currentIndex + 1 : 0;
  renderDeck();
}

function prevCard() {
  if (currentIndex > 0) { currentIndex--; renderDeck(); }
}

function selectCurrentCard() {
  if (filteredData.length === 0) return;
  addEmotion(filteredData[currentIndex]);
  nextCard();
}

function addEmotion(item) {
  if (!selectedEmotions.has(item.name)) {
    selectedEmotions.set(item.name, { ...item, note: "" });
    saveToStorage();
    updateSelectedUI();
  }
}

function removeEmotion(name) {
  selectedEmotions.delete(name);
  saveToStorage();
  updateSelectedUI();
  if (document.getElementById('modalOverlay').classList.contains('active')) {
    renderModalList();
  }
}

function updateSelectedUI() {
  selectedCount.textContent = selectedEmotions.size;
  confirmBtn.disabled = selectedEmotions.size === 0;

  if (selectedEmotions.size === 0) {
    selectedContainer.innerHTML = '<div class="empty-msg">아직 선택된 감정이 없습니다</div>';
    return;
  }

  selectedContainer.innerHTML = '';
  selectedEmotions.forEach((item, name) => {
    const chip = document.createElement('div');
    chip.className = `selected-chip ${item.isExtra ? 'is-extra' : ''}`;
    chip.innerHTML = `
      <span>${item.emoji} ${name}</span>
      <button class="remove-btn" onclick="removeEmotion('${name}')">&times;</button>
    `;
    selectedContainer.appendChild(chip);
  });
  selectedContainer.scrollLeft = selectedContainer.scrollWidth;
}

function shuffleCards() {
  for (let i = filteredData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filteredData[i], filteredData[j]] = [filteredData[j], filteredData[i]];
  }
  currentIndex = 0;
  renderDeck();
}

function toggleCardNumber() {
  showNumber = document.getElementById('showNumberToggle').checked;
  renderDeck();
}

function filterEmotions(category, event) {
  document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.remove('active'));
  if (event) event.target.classList.add('active');

  if (category === 'all') filteredData = [...emotionsData];
  else filteredData = emotionsData.filter(item => item.category === category);
  
  currentIndex = 0;
  renderDeck();
}

function renderModalList() {
  const modalList = document.getElementById('modalList');
  modalList.innerHTML = '';

  if (selectedEmotions.size === 0) {
    modalList.innerHTML = '<div style="color:var(--text-muted); font-size:0.85rem; text-align:center; padding:20px;">선택된 감정이 없습니다.</div>';
    return;
  }

  selectedEmotions.forEach((item, name) => {
    const itemEl = document.createElement('div');
    itemEl.className = `modal-item ${item.isExtra ? 'is-extra' : ''}`;
    itemEl.innerHTML = `
      <div class="modal-item-header">
        <div class="modal-item-title">${item.emoji} ${name}</div>
        <button class="remove-btn" onclick="removeEmotion('${name}')">&times;</button>
      </div>
      <input type="text" class="modal-item-input" 
             placeholder="이유나 생각을 기록해보세요 (선택)" 
             value="${item.note || ''}" 
             oninput="updateNote('${name}', this.value)">
    `;
    modalList.appendChild(itemEl);
  });
}

function updateNote(name, value) {
  if (selectedEmotions.has(name)) {
    selectedEmotions.get(name).note = value;
    saveToStorage();
  }
}

function openModal() {
  renderModalList();
  document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
}

function showToast(msg) {
  const toast = document.getElementById('toastMsg');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

function copySelectedEmotions() {
  if (selectedEmotions.size === 0) return;
  const list = [];
  selectedEmotions.forEach((item, name) => list.push(`${item.emoji} ${name}`));
  navigator.clipboard.writeText(list.join(', ')).then(() => showToast('📋 클립보드에 복사되었습니다!'));
}

function shareOnlyEmotions() {
  if (selectedEmotions.size === 0) return;
  const list = [];
  selectedEmotions.forEach((item, name) => list.push(`${item.emoji} ${name}`));
  const shareText = `[오늘 나의 마음]\n${list.join(', ')}`;

  if (navigator.share) {
    navigator.share({ title: '오늘 나의 마음', text: shareText }).catch(() => {});
  } else {
    navigator.clipboard.writeText(shareText).then(() => showToast('📋 감정이 클립보드에 복사되었습니다!'));
  }
}

function shareEmotionsWithNotes() {
  if (selectedEmotions.size === 0) return;
  const list = [];
  selectedEmotions.forEach((item, name) => {
    const noteText = item.note ? ` : ${item.note}` : '';
    list.push(`• ${item.emoji} ${name}${noteText}`);
  });
  const shareText = `[오늘 나의 마음 기록 💡]\n\n${list.join('\n')}`;

  if (navigator.share) {
    navigator.share({ title: '오늘 나의 마음 기록', text: shareText }).catch(() => {});
  } else {
    navigator.clipboard.writeText(shareText).then(() => showToast('📋 내용이 클립보드에 복사되었습니다!'));
  }
}

// 앱 초기 실행
loadFromStorage();
shuffleCards();
updateSelectedUI();