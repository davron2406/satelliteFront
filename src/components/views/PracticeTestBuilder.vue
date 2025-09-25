<template>
  <div class="page">
    <!-- Header -->
    <div class="card header">
      <h1>Practice Test Templates</h1>
      <div class="header-actions">
        <button class="btn primary" @click="openCreateModal" :disabled="busy">
          + New template
        </button>
      </div>
    </div>

    <!-- Templates table -->
    <div class="card">
      <div class="title">Previous templates</div>

      <div v-if="loadingTemplates" class="loading">Loading templates…</div>
      <div v-else-if="templates.length === 0" class="empty">
        No templates yet. Create your first one!
      </div>

      <table class="tpl-table" v-else>
        <thead>
          <tr>
            <th>Title</th>
            <th style="width:140px">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in templates" :key="t.id">
            <td class="cell-title" :title="t.name || 'Untitled'">
              <span class="title-link" @click="openDetails(t)">{{ t.name || 'Untitled' }}</span>
            </td>
            <td class="actions left">
              <div class="btn-group">
                <button class="btn ghost sm" title="Open" @click="openDetails(t)">Open</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="table-footer" v-if="!loadingTemplates">
        <div class="pager-left">
          <label class="pagesize">
            Page size
            <select class="input" v-model.number="size" @change="onPageSizeChange">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
          </label>
          <span class="range" v-if="totalElements>0">
            {{ startIndex + 1 }}–{{ endIndex }} of {{ totalElements }}
          </span>
        </div>
        <div class="pager-right">
          <button class="btn sm" :disabled="page<=0 || busy" @click="goToPage(page-1)">◀ Prev</button>
          <span class="page-indicator">Page {{ page+1 }} / {{ Math.max(totalPages,1) }}</span>
          <button class="btn sm" :disabled="page>=totalPages-1 || busy" @click="goToPage(page+1)">Next ▶</button>
        </div>
        <button class="btn primary" @click="openCreateModal" :disabled="busy">+ New template</button>
      </div>

      <p v-if="message" :class="['msg', ok ? 'ok' : 'err']">{{ message }}</p>
    </div>

    <!-- API footnote -->
    <div class="card footer">
      <div class="api-note">
        API:
        <code>GET {{ API }}/templates?page={{ page }}&size={{ size }}&sort=createdAt,desc</code> ·
        <code>POST {{ API }}/templates</code>
      </div>
    </div>

    <!-- Create Modal (centered with dim backdrop) -->
    <div
      v-if="showModal"
      class="modal-overlay"
      @click.self="closeCreateModal"
      @keydown.esc="closeCreateModal"
      tabindex="0"
      aria-modal="true"
      role="dialog"
    >
      <div class="modal">
        <!-- Header -->
        <div class="card header">
          <h1>Create Practice Test</h1>
          <div class="header-actions">
            <button class="btn ghost" @click="addLine" :disabled="busy">Add line</button>
            <button class="btn primary" @click="submit" :disabled="busy || requestBody.lines.length===0">
              {{ busy ? 'Creating…' : 'Create' }}
            </button>
          </div>
        </div>

        <!-- Meta -->
        <div class="card meta">
          <div class="row">
            <div class="col">
              <div class="label">Title</div>
              <input v-model="form.title" class="input" placeholder="My test" maxlength="160" />
            </div>
            <div class="col">
              <div class="label">Time Limit (minutes)</div>
              <input v-model.number="form.timeLimitMin" type="number" min="1" step="1" class="input" />
            </div>
          </div>
          <div class="row switches">
            <label class="switch">
              <input type="checkbox" v-model="form.shuffle" />
              <span>Shuffle final order</span>
            </label>
            <label class="switch">
              <input type="checkbox" v-model="form.allowPartial" />
              <span>Allow partial if lacking</span>
            </label>
            <div class="total">Total: <b>{{ totalCount }}</b> q</div>
          </div>
        </div>

        <!-- Lines -->
        <div class="card">
          <div class="title">Lines (Subject → Topic, Difficulty, Count)</div>

          <div v-for="(l, i) in form.lines" :key="l.uid" class="line">
            <!-- Subject -->
            <select class="input" v-model="l.subjectId" @change="onSubjectChange(l)">
              <option :value="null" disabled>Select subject</option>
              <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>

            <!-- Topic (single-select) -->
            <select class="input" v-model="l.topicId" :disabled="!l.subjectId">
              <option :value="null" disabled>Select topic</option>
              <option v-for="t in l.topics" :key="t.id" :value="t.id">{{ t.name }}</option>
            </select>

            <!-- Difficulty -->
            <select class="input" v-model="l.difficulty">
              <option v-for="d in difficulties" :key="d" :value="d">{{ d }}</option>
            </select>

            <!-- Count -->
            <input class="input" type="number" min="0" step="1" v-model.number="l.count" />

            <!-- Tools -->
            <div class="tools">
              <button class="icon" :disabled="i===0 || busy" @click="move(i,-1)" title="Up">▲</button>
              <button class="icon" :disabled="i===form.lines.length-1 || busy" @click="move(i,1)" title="Down">▼</button>
              <button class="icon danger" :disabled="busy" @click="removeLine(i)" title="Remove">✕</button>
            </div>
          </div>

          <div class="add-holder">
            <button class="btn add" @click="addLine" :disabled="busy">+ Add another line</button>
          </div>

          <p v-if="innerMessage" :class="['msg', innerOk ? 'ok' : 'err']">{{ innerMessage }}</p>
        </div>

        <!-- Footer -->
        <div class="card footer">
          <div class="api-note">API: POST <code>{{ API }}/templates</code></div>
          <div class="footer-actions">
            <button class="btn ghost" @click="closeCreateModal" :disabled="busy">Cancel</button>
            <button class="btn cta" @click="submit" :disabled="busy || requestBody.lines.length===0">
              Create Test
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';

const API = 'https://satelliteback.onrender.com';
const difficulties = ['EASY', 'MEDIUM', 'HARD'];

// pageable state
const page = ref(0); // zero-based
const size = ref(10);
const totalPages = ref(1);
const totalElements = ref(0);

// templates list
const templates = ref([]);
const loadingTemplates = ref(true);
const busy = ref(false);
const message = ref('');
const ok = ref(false);

// modal state
const showModal = ref(false);
const innerMessage = ref('');
const innerOk = ref(false);

// subjects & topics (cached across modal openings)
const subjects = ref([]);
const topicCache = reactive(new Map());

const form = reactive({
  title: 'My test',
  timeLimitMin: 60,
  shuffle: true,
  allowPartial: false,
  lines: []
});

function newLine() {
  return {
    uid: uuid(),
    subjectId: null,
    topics: [],
    topicId: null,
    difficulty: 'MEDIUM',
    count: 1
  };
}

function uuid(){
  return (crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2));
}

const tokenHeader = () => {
  const t = sessionStorage.getItem('token');
  return t ? { Authorization: `Bearer ${t}` } : {};
};

onMounted(async () => {
  await Promise.all([loadTemplates(), loadSubjectsIfNeeded()]);
});

// lock body scroll when modal is open
watch(showModal, (v) => {
  try { document.body.style.overflow = v ? 'hidden' : ''; } catch { /* no-op */ }
});

async function loadTemplates(){
  loadingTemplates.value = true;
  setMsg('', false);
  try {
    const res = await axios.get(`${API}/templates`, {
      headers: { 'Accept': 'application/json', ...tokenHeader() },
      params: { page: page.value, size: size.value, sort: 'createdAt,desc' }
    });

    // Try Spring Data style { content, totalPages, totalElements, number, size }
    if (res.data && typeof res.data === 'object' && 'content' in res.data && Array.isArray(res.data.content)) {
      templates.value = res.data.content;
      totalPages.value = Number(res.data.totalPages ?? 1) || 1;
      totalElements.value = Number(res.data.totalElements ?? res.data.content.length) || res.data.content.length;
      // keep server page if it echoes it back
      if (typeof res.data.number === 'number') page.value = res.data.number;
    }
    // Or a generic paging shape { items, total, page }
    else if (res.data && typeof res.data === 'object' && 'items' in res.data && Array.isArray(res.data.items)) {
      templates.value = res.data.items;
      totalElements.value = Number(res.data.total ?? res.data.items.length) || res.data.items.length;
      totalPages.value = Math.max(1, Math.ceil(totalElements.value / size.value));
      if (typeof res.data.page === 'number') page.value = Math.max(0, res.data.page);
    }
    // Or plain array (fallback)
    else {
      const arr = Array.isArray(res.data) ? res.data : [];
      totalElements.value = arr.length;
      totalPages.value = Math.max(1, Math.ceil(arr.length / size.value));
      const start = page.value * size.value;
      templates.value = arr.slice(start, start + size.value);
    }
  } catch(e){
    setMsg('Failed to load templates: ' + niceError(e), false);
    templates.value = [];
    totalPages.value = 1; totalElements.value = 0;
  } finally {
    loadingTemplates.value = false;
  }
}

async function loadSubjectsIfNeeded(){
  if (subjects.value.length) return;
  try {
    const res = await axios.get(`${API}/subjects`, { headers: { 'Accept': 'application/json', ...tokenHeader() }});
    subjects.value = (res.data || []).map(s => ({ id: String(s.id), name: s.name }));
  } catch (e) {
    setMsg('Failed to load subjects: ' + niceError(e), false);
  }
}

function openCreateModal(){
  showModal.value = true;
  clearInnerMsg();
  // fresh form
  form.title = 'My test';
  form.timeLimitMin = 60;
  form.shuffle = true;
  form.allowPartial = false;
  form.lines = [newLine()];
}
function closeCreateModal(){
  if (busy.value) return;
  showModal.value = false;
}

async function onSubjectChange(line){
  line.topicId = null;
  line.topics = [];
  if (!line.subjectId) return;

  const key = String(line.subjectId);
  if (topicCache.has(key)) {
    line.topics = [...topicCache.get(key)];
    return;
  }
  try {
    const res = await axios.get(`${API}/subjects/${encodeURIComponent(line.subjectId)}/topics`, { headers: { 'Accept': 'application/json', ...tokenHeader() }});
    const list = (res.data || []).map(t => ({ id: String(t.id), name: t.name }));
    topicCache.set(key, list);
    line.topics = [...list];
  } catch (e) {
    setInnerMsg('Failed to load topics: ' + niceError(e), false);
  }
}

function addLine(){ form.lines.push(newLine()); }
function removeLine(i){ form.lines.splice(i, 1); }
function move(i, d){ const j = i + d; if (j<0 || j>=form.lines.length) return; [form.lines[i], form.lines[j]] = [form.lines[j], form.lines[i]]; }

const totalCount = computed(() => form.lines.reduce((s, l) => s + (Number.isFinite(l.count)? l.count : 0), 0));

const requestBody = computed(() => ({
  title: form.title?.trim() || 'Untitled',
  timeLimitSec: Math.max(60, (form.timeLimitMin|0) * 60),
  shuffle: !!form.shuffle,
  allowPartial: !!form.allowPartial,
  lines: form.lines
    .filter(l => l.subjectId && l.topicId && Number.isFinite(l.count) && l.count>=0)
    .map(l => ({ difficulty: l.difficulty, count: l.count|0, topicId: l.topicId }))
}));

async function submit(){
  clearInnerMsg();
  if (requestBody.value.lines.length === 0) {
    return setInnerMsg('Add at least one valid line (subject + topic + count).', false);
  }
  busy.value = true;
  try {
    const res = await axios.post(`${API}/templates`, requestBody.value, {
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', ...tokenHeader() }
    });
    const createdId = res.data?.id ?? res.data; // support either {id} or raw id
    setInnerMsg(`Template created${createdId ? ` (ID: ${createdId})` : ''}.`, true);
    // After creation, reload first page to include newest at top
    page.value = 0;
    await loadTemplates();
    closeCreateModal();
  } catch (e) {
    setInnerMsg('Failed to create template: ' + niceError(e), false);
  } finally {
    busy.value = false;
  }
}

// pagination helpers
function onPageSizeChange(){
  page.value = 0; // reset to first page when size changes
  loadTemplates();
}
function goToPage(p){
  const clamped = Math.min(Math.max(0, p), Math.max(0, totalPages.value-1));
  if (clamped !== page.value){
    page.value = clamped;
    loadTemplates();
  }
}
const startIndex = computed(() => (totalElements.value===0 ? 0 : page.value*size.value));
const endIndex = computed(() => Math.min(totalElements.value, startIndex.value + templates.value.length));

// helpers
function openDetails(t){
  // wire this to your router if you have a details/run page:
  // router.push(`/templates/${t.id}`)
  console.log('open', t);
}
function niceError(e){
  if (e?.response?.data) {
    if (typeof e.response.data === 'string') return `${e.response.status} ${e.response.statusText}: ${e.response.data}`;
    try { return JSON.stringify(e.response.data); } catch { /* ignore */ }
  }
  return e?.message || String(e);
}
function setMsg(m, okFlag){ message.value=m; ok.value=okFlag; }
function clearInnerMsg(){ innerMessage.value=''; innerOk.value=false; }
function setInnerMsg(m, okFlag){ innerMessage.value=m; innerOk.value=okFlag; }
</script>

<style scoped>
/* page */
.page{ background:#eef2f6; padding:14px; }
.card{ background:#fff; border:1px solid #e6e8ee; border-radius:16px; padding:16px; margin-bottom:14px;
       box-shadow:0 1px 0 rgba(16,24,40,.02); }
.header{ display:flex; align-items:center; justify-content:space-between; }
.header h1{ font-size:28px; font-weight:700; color:#1f2937; margin:0; }
.header-actions{ display:flex; gap:10px; }

/* section titles */
.title{ font-weight:700; color:#111827; text-align:center; margin-bottom:12px; }
.loading{ color:#64748b; text-align:center; }
.empty{ color:#475569; text-align:center; padding:16px; }

/* table styles */
.tpl-table{ width:100%; border-collapse:separate; border-spacing:0; overflow:hidden; border:1px solid #e6e8ee; border-radius:12px; }
.tpl-table thead th{ position:sticky; top:0; text-align:left; background:linear-gradient(#f8fafc,#f1f5f9); color:#0f172a; font-weight:700; padding:12px 14px; border-bottom:1px solid #e6e8ee; z-index:1; }
.tpl-table tbody tr{ transition:background .12s ease; }
.tpl-table tbody tr:hover{ background:#f9fbff; }
.tpl-table tbody td{ padding:12px 14px; border-bottom:1px solid #eef2f6; color:#334155; vertical-align:middle; }
.tpl-table tbody tr:last-child td{ border-bottom:none; }
.tpl-table .cell-title{ max-width: 640px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight:600; color:#0f172a; }
.tpl-table .title-link{ cursor:pointer; text-decoration:none; }
.tpl-table .title-link:hover{ text-decoration:underline; }
.tpl-table .actions.left{ text-align:left; }
.btn-group{ display:flex; gap:8px; align-items:center; }

/* buttons */
.btn{ border:1px solid #cbd5e1; background:#fff; color:#0f172a; padding:10px 14px; border-radius:10px; font-weight:600; cursor:pointer; }
.btn.primary{ background:#facc15; border-color:#eab308; }
.btn.ghost{ background:#f8fafc; }
.btn.danger{ color:#dc2626; border-color:#fecaca; background:#fff1f2; }
.btn.add{ background:#e5edff; border-color:#c7d2fe; }
.btn.sm{ padding:6px 10px; border-radius:8px; font-size:13px; }

.table-footer{ display:grid; grid-template-columns: 1fr auto auto; gap:10px; align-items:center; padding-top:10px; }
.table-footer .pager-left{ display:flex; align-items:center; gap:12px; }
.table-footer .pagesize{ display:flex; align-items:center; gap:8px; }
.table-footer .range{ color:#475569; }
.table-footer .pager-right{ display:flex; align-items:center; gap:10px; }
.page-indicator{ min-width: 120px; text-align:center; }

/* modal overlay centered */
.modal-overlay{ position:fixed; inset:0; background:rgba(15,23,42,.55); backdrop-filter:saturate(120%) blur(2px); display:flex; align-items:center; justify-content:center; padding:24px; overflow:auto; z-index:1000; }
.modal{ width:min(980px, 100%); transform:scale(1); animation:pop .14s ease-out; }
@keyframes pop{ from{ transform:scale(.98); opacity:.0 } to{ transform:scale(1); opacity:1 } }

/* meta card inside modal */
.meta .row{ display:grid; grid-template-columns: 1fr 1fr; gap:14px; }
.meta .switches{ grid-template-columns: auto auto 1fr; align-items:center; }
.label{ font-weight:700; color:#111827; text-align:center; margin-bottom:8px; }
.switch{ display:flex; align-items:center; gap:8px; color:#111827; }
.total{ justify-self:end; color:#334155; font-weight:600; }

/* lines */
.line{ display:grid; grid-template-columns: 1.3fr 1.5fr 1.1fr .9fr auto; gap:12px; align-items:center;
       background:#f8fafc; border:1px solid #e6e8ee; border-radius:12px; padding:10px; margin-bottom:10px; }

.input{ width:100%; border:1px solid #cbd5e1; border-radius:10px; padding:10px 12px; background:#fff; color:#0f172a; font-size:14px; outline:none; }
.input:focus{ border-color:#93c5fd; box-shadow:0 0 0 3px rgba(59,130,246,.2); }

.tools{ display:flex; gap:8px; justify-content:flex-end; }
.icon{ border:1px solid #cbd5e1; background:#fff; border-radius:10px; padding:8px 10px; cursor:pointer; }
.icon.danger{ color:#dc2626; border-color:#fecaca; background:#fff1f2; }
.icon:disabled{ opacity:.5; cursor:not-allowed; }

.footer{ text-align:center; }
.footer .footer-actions{ display:flex; gap:10px; justify-content:center; }
.api-note{ color:#64748b; font-size:12px; margin-bottom:10px; }
.cta{ width:100%; padding:14px; background:#facc15; border-color:#eab308; font-size:18px; }

.msg{ margin-top:8px; font-size:14px; text-align:center; }
.msg.ok{ color:#16a34a; }
.msg.err{ color:#dc2626; }
</style>
