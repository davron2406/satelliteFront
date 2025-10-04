<template>
  <div class="runner">
    <!-- ========= FLOATING / FIXED TIMER (always visible while playing) ========= -->
    <div
      v-if="step==='play' && remainingSec > 0"
      class="timer-floating"
      :class="{ danger: remainingSec <= 60 }"
      title="Time remaining"
    >
      ⏳ {{ formatTime(remainingSec) }}
    </div>
    <!-- ========================================================================= -->

    <!-- Step 1: choose (REMOTE SEARCH to backend) -->
    <div v-if="step==='choose'" class="card">
      <div class="choose-head">
        <div class="left-head">
          <h2 class="title">Practice Tests</h2>
          <span class="count-badge" v-if="!loadingList && hasQuery && results.length>=0">{{ results.length }} found</span>
        </div>

        <div class="search">
          <div class="search-wrap">
            <input
              class="input search-input"
              v-model="query"
              placeholder="Search tests by name… (min 3 chars)"
              @keydown.enter.prevent
            />
            <button v-if="query" class="clear-btn" @click="query=''" aria-label="Clear">×</button>
          </div>
        </div>
      </div>

      <div v-if="loadingList" class="list">
        <div class="skeleton-row" v-for="i in 6" :key="i"></div>
      </div>

      <div v-else class="list">
        <div v-if="!hasQuery" class="muted pad">Type at least <b>{{ MIN_CHARS }}</b> characters to search.</div>
        <div v-else-if="error" class="err pad">{{ error }}</div>
        <template v-else>
          <button
            v-for="t in results"
            :key="t.id"
            class="test-row"
            @click="loadTest(t.id)"
            :disabled="busy"
            :title="`Open ${t.title}`"
          >
            <div class="t-main">
              <div class="t-title">{{ t.title }}</div>
              <div class="t-sub">ID: {{ t.id }}</div>
            </div>
            <span class="open-pill">Open</span>
          </button>
          <div v-if="hasQuery && !results.length && !loadingList" class="muted pad">
            No tests match “{{ query }}”.
          </div>
        </template>
      </div>

      <div class="actions">
        <button class="btn" @click="manualSearch" :disabled="busy || loadingList || !hasQuery">Search</button>
      </div>

      <p v-if="msg" :class="ok ? 'ok' : 'err'">{{ msg }}</p>
    </div>

    <!-- Step 2: render questions and answers -->
    <div v-else-if="step==='play'" class="card">
      <div class="test-header">
        <div class="test-title">{{ testTitle }}</div>
        <div class="muted">ID: {{ testId }}</div>

        <div
          v-if="remainingSec > 0"
          class="timer"
          :class="{ danger: remainingSec <= 60 }"
          :title="'Time remaining'"
        >
          ⏳ {{ formatTime(remainingSec) }}
        </div>
      </div>

      <div class="timeline">
        <div class="item" v-for="it in items" :key="it.position">
          <div class="dot"></div>
          <div class="content">
            <div class="qhead">
              <div class="qindex">Question {{ it.position + 1 }}</div>
              <div class="qid muted">#{{ it.question.id }}</div>
            </div>

            <div class="qtext" v-html="formatText(it.question.text)"></div>

            <!-- question image (click-to-zoom) -->
            <img
              v-if="imgSrc(it.question.imageUrl, it.question.hint)"
              :src="imgSrc(it.question.imageUrl, it.question.hint)"
              class="qimg clickable"
              alt="question image"
              @click="openImage(imgSrc(it.question.imageUrl, it.question.hint), 'question image')"
            />

            <div v-if="textHint(it.question.hint)" class="hint">
              <span class="hint-label">Hint:</span> {{ textHint(it.question.hint) }}
            </div>

            <div class="answers">
              <label class="ans" v-for="a in it.question.answers" :key="a.id">
                <input
                  type="checkbox"
                  :value="a.id"
                  :checked="isSelected(it.question.id, a.id)"
                  @change="onChangeSingle(it.question.id, a.id, $event.target.checked)"
                />
                <span class="ans-text">{{ a.text }}</span>

                <!-- answer image (click-to-zoom) -->
                <img
                  v-if="isImg(a.imageUrl)"
                  :src="a.imageUrl"
                  class="ans-img-inline clickable"
                  alt="answer image"
                  @click="openImage(a.imageUrl, 'answer image')"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="btn" @click="backToList" :disabled="busy">Back</button>
        <button class="btn primary" @click="submit" :disabled="busy || items.length===0">Submit</button>
      </div>

      <p v-if="msg" :class="ok ? 'ok' : 'err'">{{ msg }}</p>
    </div>

    <!-- Step 3: after submit (shows donut with correct/total) -->
    <div v-else-if="step==='done'" class="card center">
      <h2 class="title">Submitted ✅</h2>

      <div class="score-wrap" v-if="result.total > 0">
        <svg class="ring" viewBox="0 0 120 120" width="120" height="120" aria-label="Result">
          <circle class="ring-bg" cx="60" cy="60" r="54" />
          <circle
            class="ring-fg"
            cx="60" cy="60" r="54"
            :style="{
              strokeDasharray: ringCircumference + ' ' + ringCircumference,
              strokeDashoffset: ringOffset + 'px'
            }"
          />
          <text class="ring-text" x="60" y="65">{{ Math.round(result.percent) }}%</text>
        </svg>
        <div class="score-text">
          <div class="big">{{ result.correct }} / {{ result.total }}</div>
          <div class="muted">correct</div>
        </div>
      </div>

      <p class="muted" v-else>No questions counted.</p>

      <div class="actions">
        <button class="btn" @click="resetAll">Back to tests</button>
      </div>

      <p v-if="msg" :class="ok ? 'ok' : 'err'">{{ msg }}</p>
    </div>

    <!-- IMAGE LIGHTBOX (MODAL) -->
    <div
      v-if="imgModal.open"
      class="lightbox"
      @click.self="closeImage"
      role="dialog"
      aria-modal="true"
    >
      <div class="lightbox-content">
        <button class="lightbox-close" @click="closeImage" aria-label="Close">×</button>
        <img :src="imgModal.src" :alt="imgModal.alt || 'image'" class="lightbox-img" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue';

const API = import.meta.env.VITE_API;
const tokenHeader = () => {
  const t = sessionStorage.getItem('token');
  return t ? { Authorization: `Bearer ${t}` } : {};
};

const MIN_CHARS = 3; // fire remote search when >= 3 chars

const step = ref('choose');
const busy = ref(false);
const msg = ref('');
const ok = ref(false);

// ---- REMOTE SEARCH STATE ----
const query = ref('');
const results = ref([]);
const loadingList = ref(false);
const error = ref('');
const hasQuery = computed(() => query.value.trim().length >= MIN_CHARS);
let debounceTimer = null;
let activeAbort = null; // AbortController to cancel in-flight search

onMounted(() => {
  // no initial fetch; we only search when user types >=3 chars
});

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer);
  if (activeAbort) activeAbort.abort();
  stopTimer();
});

// Debounced watcher: queries backend after 300ms when >= MIN_CHARS
watch(query, () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  if (!hasQuery.value){
    results.value = [];
    error.value = '';
    return; // don't call backend for short queries
  }
  debounceTimer = setTimeout(() => remoteSearch(query.value), 300);
});

async function manualSearch(){
  if (!hasQuery.value) return;
  await remoteSearch(query.value);
}

async function remoteSearch(name){
  error.value = '';
  loadingList.value = true;
  if (activeAbort) activeAbort.abort();
  activeAbort = new AbortController();
  try{
    const url = `${API}/templates/search?name=${encodeURIComponent(name)}`;
    const r = await fetch(url, { method: 'GET', headers: tokenHeader(), credentials: 'include', signal: activeAbort.signal });
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    const data = await r.json();
    // Accept arrays or Page-style responses
    const arr = Array.isArray(data)
      ? data
      : (Array.isArray(data.content) ? data.content : (Array.isArray(data.items) ? data.items : []));
    results.value = arr.map(x => ({ id: x.id, title: x.title ?? x.name ?? `Test #${x.id}` }));
  } catch(e){
    if (e.name !== 'AbortError') error.value = `Search failed: ${e.message}`;
  } finally {
    loadingList.value = false;
    activeAbort = null;
  }
}

// ---- chosen test content ----
const testId = ref(null);
const testTitle = ref('');
const items = ref([]);
const selected = reactive(new Map());
const result = reactive({ correct: 0, total: 0, percent: 0 });

// --- TIMER ---
const remainingSec = ref(0);
let timerHandle = null;
function startTimer(sec){
  stopTimer();
  remainingSec.value = Math.max(0, Math.floor(Number(sec) || 0));
  if (remainingSec.value <= 0) return;
  timerHandle = setInterval(async () => {
    if (remainingSec.value > 0) remainingSec.value -= 1;
    if (remainingSec.value <= 0) {
      stopTimer();
      if (step.value === 'play' && !busy.value) {
        try { await submit(); } catch (_) {}
      }
    }
  }, 1000);
}
function stopTimer(){ if (timerHandle) { clearInterval(timerHandle); timerHandle = null; } }
function formatTime(total){
  const s = Math.max(0, total|0);
  const h = Math.floor(s/3600);
  const m = Math.floor((s%3600)/60);
  const ss = s%60;
  return h > 0
    ? `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`
    : `${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
}
function extractDurationSeconds(obj){
  if (!obj || typeof obj !== 'object') return 0;
  const pickNum = (...keys) => { for (const k of keys) if (k in obj && obj[k] != null && !isNaN(Number(obj[k]))) return Number(obj[k]); return null; };
  const sec = pickNum('timeLimitSec','timeSeconds','durationSec','durationSeconds','seconds','timeLimitSeconds','limitSeconds','timeSec');
  if (sec != null) return Math.max(0, Math.floor(sec));
  const min = pickNum('timeMinutes','durationMin','durationMinutes','minutes','timeLimitMin','timeLimitMinutes');
  if (min != null) return Math.max(0, Math.floor(min * 60));
  const deadlineKey = ['deadline','expiresAt','endsAt','endAt','dueAt','finishAt'].find(k => k in obj && obj[k]);
  if (deadlineKey) {
    const t = new Date(obj[deadlineKey]).getTime();
    if (!isNaN(t)) return Math.max(0, Math.floor((t - Date.now())/1000));
  }
  return 0;
}

// IMAGE MODAL
const imgModal = reactive({ open: false, src: '', alt: '' });
function openImage(src, alt = 'image'){ if (!src) return; imgModal.src = src; imgModal.alt = alt; imgModal.open = true; document.body.style.overflow = 'hidden'; }
function closeImage(){ imgModal.open = false; imgModal.src = ''; imgModal.alt = ''; document.body.style.overflow = ''; }

// helpers
function setMsg(m, isOk){ msg.value = m; ok.value = isOk; }
function backToList(){ stopTimer(); step.value = 'choose'; }
function resetAll(){ stopTimer(); step.value = 'choose'; testId.value = null; testTitle.value = ''; items.value = []; selected.clear(); result.correct = 0; result.total = 0; result.percent = 0; msg.value = ''; ok.value = false; }
function formatText(s){ return s ? String(s).replace(/\n/g, '<br/>') : ''; }
function isImg(s){ return typeof s === 'string' && /^(data:image\/[a-zA-Z]+;base64,|https?:\/\/)/.test(s); }
function imgSrc(imageUrl, hint){ if (isImg(imageUrl)) return imageUrl; if (isImg(hint)) return hint; return null; }
function textHint(hint){ if (!hint || typeof hint !== 'string') return ''; const t = hint.trim(); if (isImg(t)) return ''; if (t.toLowerCase() === 'there is nothing to hint') return ''; return t; }
function isSelected(qId, aId){ return selected.get(qId) === aId; }
function onChangeSingle(qId, aId, checked){ if (checked) selected.set(qId, aId); else if (selected.get(qId) === aId) selected.delete(qId); }

// donut math
const R = 54; const ringCircumference = 2 * Math.PI * R; const ringOffset = computed(() => { const p = Math.max(0, Math.min(100, Number(result.percent) || 0)); return ringCircumference * (1 - p / 100); });

// START & LOAD TEST
async function loadTest(id) {
  setMsg('', false);
  busy.value = true;
  try {
    const startRes = await fetch(`${API}/templates/start?templateId=${encodeURIComponent(id)}`, { method: 'POST', headers: tokenHeader(), credentials: 'include' });
    if (!startRes.ok) throw new Error(`${startRes.status} ${startRes.statusText}`);
    const started = await startRes.json();
    if(started.success){
      testId.value = started.data.testId;
      testTitle.value = started.data.title || 'Practice Test';

      const testRes = await fetch(`${API}/tests/${encodeURIComponent(started.data.testId)}`, { method: 'GET', headers: tokenHeader(), credentials: 'include' });
      if (!testRes.ok) throw new Error(`${testRes.status} ${testRes.statusText}`);
      const data1 = await testRes.json();

      items.value = Array.isArray(data1.items) ? data1.items : [];
      selected.clear();

      const sec = extractDurationSeconds(data1) || extractDurationSeconds(started);
      if (sec > 0) startTimer(sec); else stopTimer();

      step.value = 'play';
    } else {
      setMsg(started.message, false)
    }
  } catch (e) {
    setMsg('Failed to load test content: ' + e.message, false);
  } finally {
    busy.value = false;
  }
}

// ---- submit ----
async function submit(){
  try{
    if (busy.value) return;      // prevent double submit (timer + click)
    busy.value = true;
    stopTimer();

    // Build payload backend expects: practiceTestId + [{questionId, answerId}]
    const answers = items.value.map(it => {
      const ans = selected.get(it.question.id) ?? null;
      return {
        questionId: it.question.id,
        answerId: ans,            // backend primary field
        selectedAnswerId: ans     // optional alias
      };
    });

    const resp = await fetch(`${API}/tests/${encodeURIComponent(testId.value)}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...tokenHeader() },
      credentials: 'include',
      body: JSON.stringify({
        practiceTestId: testId.value, // keep if your backend expects it
        answers
      })
    });

    if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);

    // Some APIs return 204 No Content
    let data = {};
    try { data = await resp.json(); } catch { /* empty body */ }

    const corr = data.correct ?? data.correctCount ?? 0;
    const tot  = data.total   ?? data.totalCount   ?? (items.value?.length || 0);
    const pct  = data.percent ?? (tot > 0 ? (100 * corr / tot) : 0);

    result.correct = corr;
    result.total   = tot;
    result.percent = Math.max(0, Math.min(100, pct));

    ok.value = true;
    setMsg('Answers submitted successfully.', true);
    step.value = 'done';
  } catch(e) {
    setMsg('Submit failed: ' + e.message, false);
  } finally {
    busy.value = false;
  }
}
</script>

<style scoped>
/* base layout kept the same */
.runner{ display:grid; gap:14px; }
.card{ background:#fff; border:1px solid #e6e8ee; border-radius:16px; padding:16px; box-shadow:0 1px 0 rgba(16,24,40,.02); }
.center{ display:grid; place-items:center; gap:10px; min-height:320px; }
.title{ margin:0; font-size:20px; font-weight:800; color:#0f172a; }

.choose-head{ display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:8px; }
.left-head{ display:flex; align-items:center; gap:10px; }
.count-badge{ background:#eef2f7; color:#3b4452; padding:4px 10px; border-radius:999px; font-weight:700; font-size:12px; }

.search{ min-width:280px; }
.search-wrap{ position:relative; }
.search-input{ padding-right:34px; }
.clear-btn{ position:absolute; right:8px; top:50%; transform:translateY(-50%); border:none; background:#f1f4f8; color:#0f172a; width:24px; height:24px; border-radius:8px; cursor:pointer; }

.list{ display:grid; gap:8px; }
.test-row{ display:flex; align-items:center; justify-content:space-between; gap:12px; text-align:left; padding:12px 14px; border:1px solid #e6e8ee; border-radius:12px; background:#f8fafc; cursor:pointer; transition: background .15s ease, transform .05s ease; }
.test-row:hover{ background:#f3f6fb; }
.test-row:active{ transform: translateY(1px); }
.t-main{ display:flex; flex-direction:column; gap:4px; }
.t-title{ font-weight:800; color:#0f172a; }
.t-sub{ color:#64748b; font-size:12px; }
.open-pill{ font-size:12px; font-weight:700; background:#fff; border:1px solid #e6e8ee; padding:4px 8px; border-radius:999px; color:#0f172a; }

.pad{ padding:8px 0; }

.skeleton-row{ height:48px; border-radius:12px; background: linear-gradient(90deg, #f3f6fb 25%, #e9eef6 37%, #f3f6fb 63%); background-size:400% 100%; animation: shimmer 1.2s ease-in-out infinite; border:1px solid #e6e8ee; }
@keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }

.actions{ display:flex; gap:10px; justify-content:flex-end; margin-top:12px; }
.btn{ border:1px solid #cbd5e1; background:#fff; color:#0f172a; padding:10px 14px; border-radius:10px; font-weight:700; cursor:pointer; }
.btn.primary{ background:#facc15; border-color:#eab308; }
.btn:disabled{ opacity:.6; cursor:not-allowed; }
.ok{ color:#16a34a; } .err{ color:#dc2626; }
.muted{ color:#64748b; }

.test-header{ display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; gap:8px; flex-wrap:wrap; }
.test-title{ font-weight:800; color:#0f172a; font-size:18px; }

/* HEADER TIMER (kept) */
.timer{ margin-left:auto; font-weight:800; padding:6px 10px; border-radius:999px; border:1px solid #e6e8ee; background:#fff; color:#0f172a; }
.timer.danger{ background:#fff3cd; border-color:#facc15; }

/* ===== FIXED / FLOATING TIMER ===== */
.timer-floating{ position: fixed; top: 16px; right: 16px; z-index: 2000; font-weight:800; padding:8px 12px; border-radius:999px; border:1px solid #e6e8ee; background:#fff; color:#0f172a; box-shadow: 0 4px 18px rgba(0,0,0,.08); }
.timer-floating.danger{ background:#fff3cd; border-color:#facc15; }

/* ===== IMAGES: slightly larger + clickable ===== */
.clickable{ cursor: zoom-in; }

/* Question image bigger for readability */
.qimg{ max-width: 320px; max-height: 240px; border-radius:10px; border:1px solid #e5e7eb; margin:6px 0; }

/* Answer inline images bigger as well */
.ans-img-inline{ max-width: 160px; max-height: 100px; border-radius:8px; border:1px solid #e6e7eb; margin-left:6px; }

.hint{ font-size:13px; color:#374151; background:#fff; border:1px dashed #d1d5db; border-radius:8px; padding:6px 8px; margin-top:6px; }
.hint-label{ font-weight:700; margin-right:6px; }

.answers{ display:grid; gap:6px; margin-top:8px; }
.ans{ display:flex; align-items:center; gap:8px; background:#fff; border:1px solid #e6e8eb; border-radius:10px; padding:8px 10px; }
.ans input{ accent-color:#2563eb; }

/* ===== LIGHTBOX (modal) ===== */
.lightbox{ position: fixed; inset: 0; background: rgba(0,0,0,.6); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 24px; }
.lightbox-content{ position: relative; max-width: 90vw; max-height: 90vh; }
.lightbox-img{ max-width: 90vw; max-height: 90vh; display: block; border-radius: 12px; background: #fff; }
.lightbox-close{ position: absolute; top: -12px; right: -12px; width: 36px; height: 36px; border: none; border-radius: 999px; background: #fff; color: #111; font-weight: 800; font-size: 22px; cursor: pointer; box-shadow: 0 6px 24px rgba(0,0,0,.25); line-height: 1; }
.lightbox-close:hover{ transform: scale(1.05); }

/* ===== RESULT DONUT + TEXT ===== */
.score-wrap{ display:flex; align-items:center; gap:16px; margin:10px 0 6px; }
.ring{ display:block; }
.ring-bg{ fill:none; stroke:#eef2f7; stroke-width:12; }
.ring-fg{ fill:none; stroke:#16a34a; stroke-width:12; transform: rotate(-90deg); transform-origin: 50% 50%; transition: stroke-dashoffset .6s ease; }
.ring-text{ font-size:22px; font-weight:800; text-anchor:middle; fill:#0f172a; }
.score-text .big{ font-size:22px; font-weight:800; color:#0f172a; }
</style>
