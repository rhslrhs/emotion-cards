// emotionsData.js 에서 가져온 데이터를 전역 변수로 초기화
let filteredData = [...emotionsData];
let currentIndex = 0;
let isAnimating = false; // 애니메이션 중복 실행 방지 플래그

// 한 바퀴 감지용 변수
let viewedCount = 0;
let hasToastedFullLoop = false;

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

/* --- 카테고리/선택 상태에 맞게 덱 데이터 동기화 --- */
function updateFilteredData(category = getActiveCategory()) {
  let list = emotionsData;
  if (category !== 'all') {
    list = list.filter(item => item.category === category);
  }
  filteredData = list.filter(item => !selectedEmotions.has(item.name));

  if (filteredData.length === 0) {
    currentIndex = 0;
  } else if (currentIndex >= filteredData.length) {
    currentIndex = filteredData.length - 1;
  }
}

function getActiveCategory() {
  const activeChip = document.querySelector('.filter-chip.active');
  if (!activeChip) return 'all';
  const text = activeChip.textContent;
  if (text.includes('긍정')) return 'positive';
  if (text.includes('편안')) return 'calm';
  if (text.includes('슬픔')) return 'negative';
  return 'all';
}

/* --- 초기화 모달 제어 함수 --- */
function resetEmotions() {
  if (selectedEmotions.size === 0) {
    showToast('초기화할 감정이 없습니다');
    return;
  }
  document.getElementById('confirmResetModal').classList.add('active');
}

function closeResetModal() {
  document.getElementById('confirmResetModal').classList.remove('active');
}

function executeReset() {
  closeResetModal();
  
  selectedEmotions.clear();
  saveToStorage();
  updateSelectedUI();
  updateFilteredData();
  shuffleCards();
  
  if (document.getElementById('modalOverlay').classList.contains('active')) {
    renderModalList();
  }
  
  showToast('🔄 모든 감정이 초기화되었습니다');
}

/* --- 덱 렌더링 --- */
function renderDeck() {
  cardDeck.innerHTML = '';
  if (filteredData.length === 0) {
    cardDeck.innerHTML = '<div style="display:flex; justify-content:center; align-items:center; height:100%; color:#b2bec3;">선택 가능한 카드가 없습니다</div>';
    return;
  }

  const displayCount = Math.min(3, filteredData.length);

  for (let i = 0; i < displayCount; i++) {
    const dataIndex = (currentIndex + i) % filteredData.length;
    const item = filteredData[dataIndex];
    
    const card = document.createElement('div');
    card.className = 'card';
    
    const scale = 1 - i * 0.05;
    const translateY = i * 15;
    card.style.transform = `translateY(${translateY}px) scale(${scale})`;
    card.style.zIndex = 10 - i;
    card.style.opacity = 1 - i * 0.2;

    // 번호 표시 (NO. XX)
    card.innerHTML = `
      <div class="card-top-row">
        <span class="card-id">NO. ${item.id}</span>
        <span></span>
      </div>
      <div class="card-emoji">${item.emoji}</div>
      <div class="card-title">${item.name}</div>
      <div class="card-hint">↓ 아래로 당겨 담기</div>
    `;

    // 맨 위 카드에만 드래그 이벤트 부착
    if (i === 0) attachTouchEvents(card, item);
    cardDeck.appendChild(card);
  }
}

/* --- 터치/마우스 이벤트 (아래로 당기기 전용) --- */
function attachTouchEvents(card, emotionItem) {
  let startY = 0, currentY = 0, isDragging = false;

  const onStart = (e) => {
    if (isAnimating) return;
    isDragging = true;
    const touch = e.touches ? e.touches[0] : e;
    startY = touch.clientY;
    card.style.transition = 'none';

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
  };

  const onMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches ? e.touches[0] : e;
    currentY = touch.clientY - startY;

    if (currentY > 0) {
      if (e.cancelable) e.preventDefault(); // 스크롤 동작 방지
      card.style.transform = `translateY(${currentY}px)`;
    }
  };

  const onEnd = () => {
    if (!isDragging) return;
    isDragging = false;

    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onEnd);
    window.removeEventListener('touchmove', onMove);
    window.removeEventListener('touchend', onEnd);

    if (currentY > 80) {
      animateAndAdd(card, emotionItem);
    } else {
      card.style.transition = 'transform 0.2s ease-out';
      card.style.transform = 'translateY(0)';
    }
  };

  card.addEventListener('touchstart', onStart, { passive: true });
  card.addEventListener('mousedown', onStart);
}

/* --- 한 바퀴 넘김 감지 로직 --- */
function checkLoopProgress() {
  if (filteredData.length <= 1) return;

  viewedCount++;
  if (viewedCount >= filteredData.length && !hasToastedFullLoop) {
    showToast('🎉 모든 카드를 한 바퀴 둘러보셨습니다!');
    hasToastedFullLoop = true; // 중복 토스트 방지
  }
}

// 다음 카드 (오른쪽 버튼)
function nextCard() {
  if (filteredData.length === 0) return;
  currentIndex = (currentIndex + 1) % filteredData.length;
  checkLoopProgress();
  renderDeck();
}

// 이전 카드 (왼쪽 버튼)
function prevCard() {
  if (filteredData.length === 0) return;
  currentIndex = (currentIndex - 1 + filteredData.length) % filteredData.length;
  checkLoopProgress();
  renderDeck();
}

// 아래로 당겨 담기 애니메이션
function animateAndAdd(targetCard, item) {
  if (isAnimating) return;
  isAnimating = true;

  if (targetCard) {
    targetCard.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
    targetCard.style.transform = 'translateY(500px)';
    targetCard.style.opacity = '0';
  }

  setTimeout(() => {
    addEmotion(item);
    isAnimating = false;
  }, 180);
}

function selectCurrentCard() {
  if (filteredData.length === 0) return;
  const topCard = cardDeck.querySelector('.card');
  animateAndAdd(topCard, filteredData[currentIndex]);
}

function addEmotion(item) {
  if (!selectedEmotions.has(item.name)) {
    selectedEmotions.set(item.name, { ...item, note: "" });
    saveToStorage();
    updateSelectedUI();
    
    updateFilteredData();
    renderDeck();
  }
}

function removeEmotion(name) {
  selectedEmotions.delete(name);
  saveToStorage();
  updateSelectedUI();
  
  updateFilteredData();
  renderDeck();

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

// 🔀 셔플 함수
function shuffleCards() {
  for (let i = filteredData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filteredData[i], filteredData[j]] = [filteredData[j], filteredData[i]];
  }

  currentIndex = 0;
  viewedCount = 0;           // 한 바퀴 카운트 리셋
  hasToastedFullLoop = false; // 토스트 플래그 리셋
  
  renderDeck();
}

function filterEmotions(category, event) {
  document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.remove('active'));
  if (event) event.target.classList.add('active');

  updateFilteredData(category);
  currentIndex = 0;
  viewedCount = 0;
  hasToastedFullLoop = false;
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
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(list.join(', '))
      .then(() => showToast('📋 클립보드에 복사되었습니다!'))
      .catch(() => showToast('❌ 복사에 실패했습니다.'));
  } else {
    showToast('❌ 이 브라우저에서는 복사를 지원하지 않습니다.');
  }
}

function shareOnlyEmotions() {
  if (selectedEmotions.size === 0) return;
  const list = [];
  selectedEmotions.forEach((item, name) => list.push(`${item.emoji} ${name}`));
  const shareText = `[오늘 나의 마음]\n${list.join(', ')}`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(shareText)
      .then(() => showToast('📋 감정이 클립보드에 복사되었습니다!'))
      .catch(() => showToast('❌ 복사에 실패했습니다.'));
  } else {
    showToast('❌ 이 브라우저에서는 복사를 지원하지 않습니다.');
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

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(shareText)
      .then(() => showToast('📋 내용이 클립보드에 복사되었습니다!'))
      .catch(() => showToast('❌ 복사에 실패했습니다.'));
  } else {
    showToast('❌ 이 브라우저에서는 복사를 지원하지 않습니다.');
  }
}

// 앱 초기 실행
loadFromStorage();
updateFilteredData();
shuffleCards();
updateSelectedUI();