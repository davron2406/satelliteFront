<template>
  <div class="page">
    <!-- Header -->
    <header class="toolbar">
      <div class="left">
        <h1 class="title">Test Results</h1>
        <div class="meta"><span class="chip">v4</span><span class="sep">•</span><span class="muted">class & template search</span></div>
      </div>
      <div class="right">
        <button class="btn ghost" @click="resetAll" :disabled="loading">↺ Reset</button>
      </div>
    </header>

    <!-- Search Row -->
    <section class="searchRow">
      <!-- Class search/selector -->
      <div class="col card">
        <div class="colHead">Class</div>

        <div class="inputWrap">
          <span class="prefix">🎓</span>
          <input
            v-model.trim="classQuery"
            class="input"
            placeholder="Search class name (≥2)"
            @input="onClassInput"
          />
          <button v-if="classQuery" class="clear" @click="clearClassQuery">×</button>
        </div>

        <div class="selectWrap">
          <select v-model="selectedClassId" :disabled="classesLoading || loading">
            <option value="" disabled>Select your class…</option>
            <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
          <span class="caret">▾</span>
        </div>

        <div class="listWrap">
          <ul class="list" v-if="classes.length">
            <li
              v-for="c in classes"
              :key="c.id"
              :class="['row', {active: c.id===selectedClassId}]"
              @click="selectedClassId = c.id"
            >
              <span class="dot"></span>
              <span v-html="highlight(c.name, classQuery)"></span>
            </li>
          </ul>
          <div class="empty muted" v-else-if="!classesLoading">No classes found</div>
          <div class="loading muted" v-if="classesLoading">Loading…</div>
        </div>
      </div>

      <!-- Template search/selector -->
      <div class="col card">
        <div class="colHead">Template</div>

        <div class="inputWrap">
          <span class="prefix">🔎</span>
          <input
            v-model.trim="templateQuery"
            class="input"
            placeholder="Search template name (≥3)"
            @input="onTemplateInput"
          />
          <button v-if="templateQuery" class="clear" @click="clearTemplateQuery">×</button>
        </div>

        <div class="listWrap">
          <ul class="list" v-if="templates.length">
            <li
              v-for="t in templates"
              :key="t.id"
              :class="['row', {active: t.id===selectedTemplateId}]"
              @click="selectedTemplateId = t.id"
            >
              <span class="badgeId">#{{ (t.id+'').slice(0,8) }}</span>
              <span v-html="highlight(t.name, templateQuery)"></span>
            </li>
          </ul>
          <div class="empty muted" v-else-if="searched && !templatesLoading">No templates</div>
          <div class="loading muted" v-if="templatesLoading">Searching…</div>
        </div>
      </div>

      <!-- Action -->
      <div class="col card actionCol">
        <button class="btn primary xl" @click="getResults" :disabled="loading || !selectedClassId || !selectedTemplateId">
          <span v-if="!loading">⬇ Get Results</span>
          <span v-else>Fetching…</span>
        </button>
        <div class="hint muted">Requires class & template</div>
      </div>
    </section>

    <section v-if="error" class="alert">⚠ {{ error }}</section>

    <!-- Results / Skeleton -->
    <section class="card tableWrap" v-if="loading && !results.length">
      <div class="skeleton" v-for="i in 6" :key="i"></div>
    </section>

    <section v-else-if="results.length" class="card tableWrap">
      <div class="topline">
        <div class="chips">
          <span class="chip soft">Class: <b>{{ classLabel }}</b></span>
          <span class="chip soft">Template: <b>{{ templateLabel }}</b></span>
          <span class="chip soft">Students: <b>{{ results.length }}</b></span>
        </div>
        <div class="filters">
          <button class="pill" :class="{on: statusFilter==='all'}" @click="statusFilter='all'">All</button>
          <button class="pill" :class="{on: statusFilter==='completed'}" @click="statusFilter='completed'">Completed</button>
          <button class="pill" :class="{on: statusFilter==='in_progress'}" @click="statusFilter='in_progress'">In progress</button>
          <button class="pill" :class="{on: statusFilter==='not_started'}" @click="statusFilter='not_started'">Not started</button>
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th class="num">Score</th>
            <th class="num">Percent</th>
            <th>Taken at</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r,i) in filtered" :key="r.studentId">
            <td class="idx">{{ i+1 }}</td>
            <td>
              <div class="person">
                <div class="avatar" :data-i="initials(r.firstName)"></div>
                <div class="col2">
                  <div class="nm">{{ r.firstName }}</div>
                </div>
              </div>
            </td>
            <td class="muted">{{ r.lastName || '—' }}</td>
            <td class="num" :class="tone(r)">{{ r.score }}/{{ r.totalQuestions }}</td>
            <td class="num">{{ toPercent(r.score, r.totalQuestions) }}</td>
            <td>{{ formatDate(r.finishedAt || r.startedAt) }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section v-else-if="fetched && !loading" class="card emptyBlock">
      <div class="emoji">🗂️</div>
      <p class="muted">No results for this selection.</p>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// API (name-only)
const API_BASE = 'https://satelliteback.onrender.com/api'
const ENDPOINTS = {
  classes: (name) => `${API_BASE}/classes/my${name ? `?name=${encodeURIComponent(name)}` : ''}`,
  templates: (name) => `${API_BASE}/templates/search?name=${encodeURIComponent(name)}`,
  results: (classId, templateId) => `${API_BASE}/classes/templates/results/${classId}/${templateId}`
}

// State
const classes = ref([])
const classesLoading = ref(false)
const classQuery = ref('')
const selectedClassId = ref('')

const templateQuery = ref('')
const templates = ref([])
const templatesLoading = ref(false)
const selectedTemplateId = ref('')
const searched = ref(false)

const results = ref([])
const loading = ref(false)
const fetched = ref(false)
const error = ref('')
const statusFilter = ref('all')

// lifecycle
onMounted(() => loadClasses())

// fetchers
async function loadClasses(name = ''){
  try {
    classesLoading.value = true
    const res = await fetch(ENDPOINTS.classes(name), { headers: authHeaders() })
    if(!res.ok) throw new Error(await safeText(res) || 'Failed to load classes')
    classes.value = await res.json()
  } catch(e){ error.value = e.message } finally { classesLoading.value = false }
}

let cTimer
function onClassInput(){
  clearTimeout(cTimer)
  const q = classQuery.value.trim()
  if(q.length === 0){ loadClasses(''); return }
  if(q.length < 2) return
  cTimer = setTimeout(() => loadClasses(q), 300)
}
function clearClassQuery(){ classQuery.value=''; loadClasses('') }

let tTimer
function onTemplateInput(){
  clearTimeout(tTimer)
  const q = templateQuery.value.trim()
  if(q.length < 3){ templates.value=[]; searched.value=false; return }
  tTimer = setTimeout(loadTemplates, 350)
}
function clearTemplateQuery(){ templateQuery.value=''; templates.value=[]; searched.value=false }

async function loadTemplates(){
  const q = templateQuery.value.trim()
  if(q.length < 3) return
  templatesLoading.value = true
  searched.value = true
  try {
    const res = await fetch(ENDPOINTS.templates(q), { headers: authHeaders() })
    if(!res.ok) throw new Error(await safeText(res) || 'Template search failed')
    templates.value = await res.json()
    if(!templates.value.find(t => t.id === selectedTemplateId.value)) selectedTemplateId.value = ''
  } catch(e){ error.value = e.message } finally { templatesLoading.value = false }
}

async function getResults(){
  if(!selectedClassId.value || !selectedTemplateId.value) return
  loading.value = true; error.value=''; fetched.value=false; results.value=[]
  try {
    const res = await fetch(ENDPOINTS.results(selectedClassId.value, selectedTemplateId.value), { headers: authHeaders() })
    if(!res.ok) throw new Error(await safeText(res) || 'Failed to fetch results')
    const data = await res.json()
    console.log(data)
    results.value = Array.isArray(data) ? data : []
    fetched.value = true
  } catch(e){ error.value = e.message } finally { loading.value = false }
}

// helpers
function resetAll(){ classQuery.value=''; templateQuery.value=''; classes.value=[]; templates.value=[]; selectedClassId.value=''; selectedTemplateId.value=''; results.value=[]; fetched.value=false; error.value=''; loadClasses('') }
function authHeaders(){ const t=sessionStorage.getItem('token'); return t?{Authorization:`Bearer ${t}`}:{} }
async function safeText(res){ try{return await res.text()}catch{return ''} }
function pct(r){ return r && r.total ? Math.round((r.correct/r.total)*100) : 0 }
function toPercent(c,t){ if(!t) return '—'; return Math.round((c/t)*100)+'%' }
function tone(r){ const v=pct(r); return v>=85?'hi':v>=60?'mid':v>0?'low':'' }
function statusText(s){ return ({completed:'Completed',in_progress:'In progress',not_started:'Not started'})[s] || s || '—' }
function formatDate(iso){ if(!iso) return '—'; const d=new Date(iso); return isNaN(d)?'—':d.toLocaleString() }
function initials(n){ if(!n) return ''; const p=String(n).trim().split(/\s+/); return (p[0]?.[0]||'')+(p[1]?.[0]||'') }
function highlight(text, q){ if(!q) return escapeHtml(text); const i = text.toLowerCase().indexOf(q.toLowerCase()); if(i<0) return escapeHtml(text); return escapeHtml(text.slice(0,i)) + '<mark>' + escapeHtml(text.slice(i,i+q.length)) + '</mark>' + escapeHtml(text.slice(i+q.length)) }
function escapeHtml(s){ return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;') }

const classLabel = computed(() => classes.value.find(c=>c.id===selectedClassId.value)?.name || '—')
const templateLabel = computed(() => templates.value.find(t=>t.id===selectedTemplateId.value)?.name || ('#'+selectedTemplateId.value))
const filtered = computed(() => statusFilter.value==='all' ? results.value : results.value.filter(r=>r.status===statusFilter.value))
</script>

<style scoped>
.page{
  --bg:#f6f7fb; --card:#ffffff; --ink:#0f172a; --muted:#6b7280; --line:#e5e7eb;
  --primary:#2563eb; --primary-2:#1d4ed8; --soft:#eef2ff; --soft-2:#e0f2fe;
  --ok:#16a34a; --mid:#2563eb; --low:#d97706;
}
.page{ max-width:1100px; margin:0 auto; padding:20px; color:var(--ink); background:var(--bg); }
.toolbar{ display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
.title{ font-weight:800; font-size:24px; }
.meta{ display:flex; gap:8px; align-items:center; }
.chip{ background:var(--soft); border:1px solid #c7d2fe; color:#3730a3; padding:2px 8px; border-radius:999px; font-size:12px; }
.sep{ color:var(--muted) }

.btn{ height:40px; padding:0 16px; border-radius:12px; font-weight:700; border:1px solid transparent; cursor:pointer; }
.btn.primary{ background:var(--primary); color:#fff; }
.btn.primary:hover{ background:var(--primary-2); }
.btn.ghost{ background:#fff; border:1px solid var(--line); color:#334155; }
.btn.xl{ height:48px; font-size:15px; }

.searchRow{ display:grid; grid-template-columns:1.1fr 1.4fr .7fr; gap:16px; }
@media (max-width: 980px){ .searchRow{ grid-template-columns: 1fr; } }
.col{ display:flex; flex-direction:column; gap:10px; }
.card{ background:var(--card); border:1px solid var(--line); border-radius:16px; padding:14px; box-shadow:0 6px 18px rgba(0,0,0,.04); }
.colHead{ font-weight:800; letter-spacing:.2px; }

.inputWrap{ position:relative; display:flex; align-items:center; border:1px solid var(--line); border-radius:12px; background:#fff; padding:4px 10px; }
.input{ height:38px; border:none; outline:none; flex:1; }
.prefix{ margin-right:6px }
.clear{ position:absolute; right:8px; top:6px; height:28px; width:28px; border:none; border-radius:8px; background:#f1f5f9; cursor:pointer; color:#334155; }

.selectWrap{ position:relative; }
select{ width:100%; height:42px; padding:8px 36px 8px 12px; border:1px solid var(--line); border-radius:12px; background:#fff; outline:none; appearance:none; }
select:focus{ border-color:var(--primary); box-shadow:0 0 0 3px #bfdbfe }
.caret{ position:absolute; right:12px; top:9px; color:#94a3b8 }

.listWrap{ border:1px solid var(--line); border-radius:12px; background:#fff; height:240px; overflow:auto; padding:6px }
.list{ list-style:none; margin:0; padding:0 }
.row{ padding:10px 12px; border-radius:10px; cursor:pointer; display:flex; align-items:center; gap:8px }
.row:hover{ background:#f8fafc }
.row.active{ background:var(--soft-2); border:1px solid #bae6fd }
.dot{ width:8px; height:8px; background:var(--primary); border-radius:50% }
.badgeId{ background:#f1f5f9; border:1px solid var(--line); border-radius:999px; padding:2px 8px; font-size:12px; color:#475569 }

.actionCol{ align-items:center; justify-content:center }
.hint{ font-size:12px }

.alert{ margin-top:12px; padding:12px 14px; border:1px solid #fecaca; background:#fff0f0; color:#b91c1c; border-radius:10px }

.tableWrap{ margin-top:16px; }
.topline{ display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:10px }
.chips{ display:flex; gap:8px; flex-wrap:wrap }
.chip.soft{ background:#f8fafc; border:1px solid var(--line); color:#334155 }
.filters{ display:flex; gap:8px; }
.pill{ background:#f1f5f9; border:1px solid var(--line); border-radius:999px; padding:6px 12px; font-weight:700; color:#334155 }
.pill.on{ background:#e0f2fe; border-color:#bae6fd; color:#075985 }

.table{ width:100%; border-collapse:collapse }
.table thead{ background:#f8fafc }
.table th, .table td{ padding:12px 14px; border-bottom:1px solid var(--line); text-align:left }
.table .num{ text-align:right }
.idx{ color:#94a3b8 }

.person{ display:flex; align-items:center; gap:10px; min-width:220px }
.avatar{ width:32px; height:32px; border-radius:50%; background:linear-gradient(180deg,#e5e7eb,#cbd5e1); border:1px solid var(--line); position:relative }
.avatar::after{ content: attr(data-i); position:absolute; inset:0; display:grid; place-items:center; font-weight:800; color:#1e293b }
.col2{ display:grid; gap:4px; width:100% }
.nm{ font-weight:700 }
.bar{ height:6px; border:1px solid var(--line); border-radius:999px; overflow:hidden }
.fill{ height:100%; background:linear-gradient(90deg, var(--ok), var(--primary)) }

.stat{ display:inline-block; padding:3px 10px; border-radius:999px; font-size:12px; border:1px solid var(--line) }
.stat.completed{ background:#dcfce7; color:#15803d; border-color:#bbf7d0 }
.stat.in_progress{ background:#fef9c3; color:#a16207; border-color:#fde68a }
.stat.not_started{ background:#f1f5f9; color:#475569 }

.skeleton{ height:46px; border:1px solid var(--line); border-radius:12px; background:linear-gradient(90deg,#f8fafc,#eef2f7,#f8fafc); background-size:200% 100%; animation:shimmer 1.2s infinite; margin:8px 0 }
@keyframes shimmer{ 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.emptyBlock{ text-align:center; padding:24px; color:var(--muted) }
.emoji{ font-size:40px }
.muted{ color:var(--muted) }
mark{ background: #fff3bf; padding: 0 2px; border-radius: 3px }
</style>
