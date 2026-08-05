// emotionsData.js 에서 가져온 데이터를 전역 변수로 초기화
let filteredData = [...emotionsData];
let currentIndex = 0;
let showNumber = false;
let isAnimating = false; // 애니메이션 중복 실행 방지 플래그

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

    card.innerHTML = `
      <div class="card-top-row">
        <span class="card-id ${showNumber ? '' : 'hidden'}">NO. ${item.id}</span>
        <span></span>
      </div>
      <div class="card-emoji">${item.emoji}</div>
      <div class="card-title">${item.name}</div>
      <div class="card-hint">↓ 아래로 당겨 담기</div>
    `;

    // 맨 위 카드에만 스와이프/드래그 이벤트 부착
    if (i === 0) attachTouchEvents(card, item);
    cardDeck.appendChild(card);
  }
}

/* --- 터치/마우스 이벤트 매핑 (단 1개로 통합 정리) --- */
function attachTouchEvents(card, emotionItem) {
  let startX = 0, startY = 0, currentX = 0, currentY = 0, isDragging = false;

  const onStart = (e) => {
    if (isAnimating) return;
    isDragging = true;
    const touch = e.touches ? e.touches[0] : e;
    startX = touch.clientX; 
    startY = touch.clientY;
    card.style.transition = 'none';

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
  };

  const onMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches ? e.touches[0] : e;
    currentX = touch.clientX - startX; 
    currentY = touch.clientY - startY;

    const rotateDeg = currentX * 0.08;
    card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotateDeg}deg)`;
  };

  const onEnd = () => {
    if (!isDragging) return;
    isDragging = false;

    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onEnd);

    // 1. [아래로 당기기] -> 감정 담기
    if (currentY > 80) {
      animateAndAdd(card, emotionItem);
    } 
    // 2. [왼쪽으로 스와이프] -> 다음 카드 (카드는 왼쪽으로 슈욱)
    else if (currentX < -60) {
      animateAndNext(card);
    } 
    // 3. [오른쪽으로 스와이프] -> 이전 카드 (카드는 오른쪽으로 슈욱)
    else if (currentX > 60) {
      animateAndPrev(card);
    } 
    // 4. 복귀
    else {
      card.style.transition = 'transform 0.2s ease-out';
      card.style.transform = 'translate(0, 0) rotate(0deg)';
    }
  };

  card.addEventListener('touchstart', onStart, { passive: true });
  card.addEventListener('touchmove', onMove, { passive: true });
  card.addEventListener('touchend', onEnd);
  card.addEventListener('mousedown', onStart);
}

/* --- 애니메이션 및 카드 전환 로직 --- */

// 다음 카드 (오른쪽 버튼 클릭 or 왼쪽 스와이프)
function animateAndNext(targetCard = null) {
  if (isAnimating || filteredData.length === 0) return;
  isAnimating = true;

  const topCard = targetCard || cardDeck.querySelector('.card');
  if (topCard) {
    topCard.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
    topCard.style.transform = 'translateX(-500px) rotate(-20deg)';
    topCard.style.opacity = '0';
  }

  setTimeout(() => {
    currentIndex = (currentIndex + 1) % filteredData.length;
    renderDeck();
    isAnimating = false;
  }, 180);
}

// 이전 카드 (왼쪽 버튼 클릭 or 오른쪽 스와이프)
function animateAndPrev(targetCard = null) {
  if (isAnimating || filteredData.length === 0) return;
  isAnimating = true;

  const topCard = targetCard || cardDeck.querySelector('.card');
  if (topCard) {
    topCard.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
    topCard.style.transform = 'translateX(500px) rotate(20deg)';
    topCard.style.opacity = '0';
  }

  setTimeout(() => {
    currentIndex = (currentIndex - 1 + filteredData.length) % filteredData.length;
    renderDeck();
    isAnimating = false;
  }, 180);
}

// 아래로 당겨 담기
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

/* --- 하단 버튼 연결 --- */
function nextCard() {
  animateAndNext();
}

function prevCard() {
  animateAndPrev();
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

  updateFilteredData(category);
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

  navigator.clipboard.writeText(shareText)
    .then(() => showToast('📋 감정이 클립보드에 복사되었습니다!'))
    .catch(() => showToast('❌ 복사에 실패했습니다.'));
}

function shareEmotionsWithNotes() {
  if (selectedEmotions.size === 0) return;
  const list = [];
  selectedEmotions.forEach((item, name) => {
    const noteText = item.note ? ` : ${item.note}` : '';
    list.push(`• ${item.emoji} ${name}${noteText}`);
  });
  const shareText = `[오늘 나의 마음 기록 💡]\n\n${list.join('\n')}`;

  navigator.clipboard.writeText(shareText)
    .then(() => showToast('📋 내용이 클립보드에 복사되었습니다!'))
    .catch(() => showToast('❌ 복사에 실패했습니다.'));
}

// 앱 초기 실행
loadFromStorage();
updateFilteredData();
shuffleCards();
updateSelectedUI();