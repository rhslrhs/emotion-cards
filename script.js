// emotionsData.js 에서 가져온 데이터를 전역 변수로 초기화
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

/* --- 카테고리/선택 상태에 맞게 덱 데이터 동기화 --- */
function updateFilteredData(category = getActiveCategory()) {
  let list = emotionsData;
  if (category !== 'all') {
    list = list.filter(item => item.category === category);
  }
  // 💡 선택된 감정 목록(selectedEmotions)에 이미 있는 카드는 덱에서 제외!
  filteredData = list.filter(item => !selectedEmotions.has(item.name));

  if (currentIndex >= filteredData.length) {
    currentIndex = Math.max(0, filteredData.length - 1);
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
// 1. 초기화 버튼 클릭 시 (모달 열기)
function resetEmotions() {
  if (selectedEmotions.size === 0) {
    showToast('초기화할 감정이 없습니다');
    return;
  }
  // 브라우저 confirm 대신 커스텀 모달 열기
  document.getElementById('confirmResetModal').classList.add('active');
}

// 2. 초기화 모달 닫기 (취소 버튼)
function closeResetModal() {
  document.getElementById('confirmResetModal').classList.remove('active');
}

// 3. 모달에서 [초기화] 최종 승인 시 실행
function executeReset() {
  closeResetModal(); // 모달 닫기
  
  selectedEmotions.clear();
  saveToStorage();
  updateSelectedUI();
  updateFilteredData(); // 덱 목록 복원
  shuffleCards();        // 💡 초기화 후 카드 덱 자동 셔플!
  
  if (document.getElementById('modalOverlay').classList.contains('active')) {
    renderModalList();
  }
  
  showToast('🔄 모든 감정이 초기화되었습니다');
}

function renderDeck() {
  cardDeck.innerHTML = '';
  if (filteredData.length === 0) {
    cardDeck.innerHTML = '<div style="display:flex; justify-content:center; align-items:center; height:100%; color:#b2bec3;">선택 가능한 카드가 없습니다</div>';
    return;
  }

  for (let i = currentIndex; i < Math.min(currentIndex + 3, filteredData.length); i++) {
    const item = filteredData[i];
    const cardIndex = i - currentIndex;
    
    const card = document.createElement('div');
    card.className = 'card'; // extra-card 클래스 구분을 지워 일반 카드 스타일로 통일
    
    const scale = 1 - cardIndex * 0.05;
    const translateY = cardIndex * 15;
    card.style.transform = `translateY(${translateY}px) scale(${scale})`;
    card.style.zIndex = 10 - cardIndex;
    card.style.opacity = 1 - cardIndex * 0.2;

    // 💡 [추가] 뱃지 노출 코드를 제거하고 일반 카드와 동일한 구조만 남김
    card.innerHTML = `
      <div class="card-top-row">
        <span class="card-id ${showNumber ? '' : 'hidden'}">NO. ${item.id}</span>
        <span></span>
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
      // 💡 아래로 당겨 담았을 때: 담은 후 덱에서 해당 카드 제거
      card.style.transform = 'translateY(300px)';
      card.style.opacity = '0';
      setTimeout(() => { addEmotion(emotionItem); }, 200);
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
  if (filteredData.length === 0) return;
  currentIndex = (currentIndex < filteredData.length - 1) ? currentIndex + 1 : 0;
  renderDeck();
}

function prevCard() {
  if (currentIndex > 0) { currentIndex--; renderDeck(); }
}

function selectCurrentCard() {
  if (filteredData.length === 0) return;
  addEmotion(filteredData[currentIndex]);
}

function addEmotion(item) {
  if (!selectedEmotions.has(item.name)) {
    selectedEmotions.set(item.name, { ...item, note: "" });
    saveToStorage();
    updateSelectedUI();
    
    // 💡 선택했으므로 덱 데이터에서 제거하고 다시 렌더링
    updateFilteredData();
    renderDeck();
  }
}

function removeEmotion(name) {
  selectedEmotions.delete(name);
  saveToStorage();
  updateSelectedUI();
  
  // 💡 선택 해제했으므로 덱에 다시 추가
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

/* 💡 Win11 및 PC 환경을 위한 직관적 복사 공유 처리 */
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