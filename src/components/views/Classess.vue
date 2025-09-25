<template>
  <div class="classes-page">
    <div class="head">
      <h2 class="title">Classes</h2>
      <div class="spacer"></div>

      <!-- Only admins can create a class -->
      <button
        v-if="isAdmin"
        class="btn primary"
        @click="openCreateModal"
        :disabled="busy"
      >
        + Add Class
      </button>
    </div>

    <div class="subhead">
      <span class="muted">
        You are logged in as <b>{{ role }}</b>.
        <template v-if="isTeacher">Showing only your classes.</template>
        <template v-else-if="isAdmin">Showing all classes.</template>
      </span>
      <button class="btn" @click="reload" :disabled="busy">Reload</button>
    </div>

    <!-- List -->
    <div v-if="loading" class="list">
      <div class="skeleton" v-for="i in 6" :key="i"></div>
    </div>
    <div v-else class="list">
      <div
        v-for="c in classes"
        :key="c.id"
        class="class-row"
        :title="c.name"
        @click="openDetails(c.id)"
      >
        <div class="class-main">
          <div class="class-name">{{ c.name }}</div>
          <div class="class-sub">
            <span class="pill">
              Teachers:
              <b>
                <template v-if="Array.isArray(c.teachers) && c.teachers.length">
                  {{ c.teachers.map(userName).join(', ') }}
                </template>
                <template v-else-if="Array.isArray(c.teacherList) && c.teacherList.length">
                  {{ c.teacherList.map(userName).join(', ') }}
                </template>
                <template v-else-if="c.teacher">
                  {{ userName(c.teacher) }}
                </template>
                <template v-else-if="c.teacherName">
                  {{ c.teacherName }}
                </template>
                <template v-else>—</template>
              </b>
            </span>
            <span class="pill">
              Students:
              <b>{{ c.studentCount ?? (Array.isArray(c.students) ? c.students.length : 0) }}</b>
            </span>
          </div>
        </div>
        <span class="chev">›</span>
      </div>

      <div v-if="!classes.length" class="muted pad">No classes found.</div>
    </div>

    <p v-if="msg" :class="ok ? 'ok' : 'err'">{{ msg }}</p>

    <!-- ====================== CREATE CLASS MODAL (Admins only) ====================== -->
    <div v-if="createModal.open" class="modal" @click.self="closeCreateModal">
      <div class="modal-card">
        <div class="modal-head">
          <h3 class="modal-title">Create Class</h3>
          <button class="close" @click="closeCreateModal" aria-label="Close">×</button>
        </div>

        <div class="modal-body">
          <!-- success banner INSIDE modal after create -->
          <div v-if="createSuccess" class="banner ok">✅ Test created</div>

          <label class="form-row">
            <span class="label">Class name <span class="req">*</span></span>
            <input
              class="input"
              v-model.trim="createForm.name"
              placeholder="e.g. Grade 9 – Algebra"
              :disabled="busy"
            />
          </label>

          <div class="grid-2">
            <!-- TEACHERS: MULTI select with server search (dual-list; only selected move) -->
            <div class="form-block">
              <div class="label">Teachers <span class="req">*</span></div>

              <div class="search-wrap">
                <input
                  class="input"
                  v-model.trim="teacherQuery"
                  placeholder="Search teachers…"
                  @input="debouncedFetchTeachers"
                  :disabled="busy"
                />
              </div>

              <div class="dual">
                <!-- Available teachers (left, multi-select) -->
                <select
                  class="input"
                  size="7"
                  multiple
                  v-model="selectedLeftTeachers"
                  :disabled="busy || !teacherOptions.length"
                >
                  <option v-for="t in teacherOptions" :key="t.id" :value="t.id">
                    {{ displayUser(t) }}
                  </option>
                </select>

                <div class="dual-actions">
                  <button class="btn" @click="addSelectedTeachers" :disabled="busy || !selectedLeftTeachers.length">Add →</button>
                  <button class="btn" @click="removeSelectedTeachers" :disabled="busy || !selectedRightTeachers.length">← Remove</button>
                </div>

                <!-- Chosen teachers (right) -->
                <select
                  class="input"
                  size="7"
                  multiple
                  v-model="selectedRightTeachers"
                  :disabled="busy"
                >
                  <option
                    v-for="t in chosenTeachers"
                    :key="t.id"
                    :value="t.id"
                  >
                    {{ displayUser(t) }}
                  </option>
                </select>
              </div>

              <div class="row-actions">
                <button class="btn subtle" @click="clearChosenTeachers" :disabled="busy || !chosenTeachers.length">Clear teachers</button>
              </div>
            </div>

            <!-- STUDENTS: MULTI select with server search (dual-list; only selected move) -->
            <div class="form-block">
              <div class="label">Students</div>

              <div class="search-wrap">
                <input
                  class="input"
                  v-model.trim="studentQuery"
                  placeholder="Search students…"
                  @input="debouncedFetchStudents"
                  :disabled="busy"
                />
              </div>

              <div class="dual">
                <!-- Available students (left, multi-select) -->
                <select
                  class="input"
                  size="7"
                  multiple
                  v-model="selectedLeftStudents"
                  :disabled="busy || !studentOptions.length"
                >
                  <option v-for="s in studentOptions" :key="s.id" :value="s.id">
                    {{ displayUser(s) }}
                  </option>
                </select>

                <div class="dual-actions">
                  <button class="btn" @click="addSelectedStudents" :disabled="busy || !selectedLeftStudents.length">Add →</button>
                  <button class="btn" @click="removeSelectedStudents" :disabled="busy || !selectedRightStudents.length">← Remove</button>
                </div>

                <!-- Chosen students (right) -->
                <select
                  class="input"
                  size="7"
                  multiple
                  v-model="selectedRightStudents"
                  :disabled="busy"
                >
                  <option
                    v-for="s in chosenStudents"
                    :key="s.id"
                    :value="s.id"
                  >
                    {{ displayUser(s) }}
                  </option>
                </select>
              </div>

              <div class="row-actions">
                <button class="btn subtle" @click="clearChosenStudents" :disabled="busy || !chosenStudents.length">Clear students</button>
              </div>
            </div>
          </div>

          <div v-if="formError" class="err">{{ formError }}</div>
        </div>

        <div class="modal-foot">
          <div class="left-foot muted small">
            Tip: Use Ctrl/Cmd + click to multi-select in the lists.
          </div>
          <div class="foot-actions">
            <button class="btn" @click="closeCreateModal" :disabled="busy">Close</button>
            <button class="btn primary" @click="createClass" :disabled="busy || !canSubmit">Create</button>
          </div>
        </div>
      </div>
    </div>
    <!-- ============================================================================ -->

    <!-- ================ DETAILS DRAWER (right side) ================ -->
    <div class="drawer" :class="{ open: details.open }" @click.self="closeDetails">
      <div class="drawer-card">
        <div class="drawer-head">
          <h3 class="drawer-title">{{ details.data?.name || 'Class details' }}</h3>
          <button class="close" @click="closeDetails" aria-label="Close">×</button>
        </div>

        <div class="drawer-body" v-if="!details.loading && details.data">
          <div class="kv">
            <div class="k">Teachers</div>
            <div class="v">
              <template v-if="details.data.teachers?.length">
                {{ details.data.teachers.map(userName).join(', ') }}
              </template>
              <template v-else>—</template>
            </div>
          </div>

          <div class="kv">
            <div class="k">Students</div>
            <div class="v">
              {{ details.data.studentCount ?? (details.data.students?.length || 0) }}
            </div>
          </div>

          <div v-if="details.data.students?.length" class="students-list">
            <div class="list-head">Students</div>
            <ul>
              <li v-for="s in details.data.students" :key="s.id">
                {{ displayUser(s) }}
              </li>
            </ul>
          </div>
        </div>

        <div class="drawer-body" v-else>
          <div class="skeleton block"></div>
          <div class="skeleton block"></div>
          <div class="skeleton block short"></div>
        </div>
      </div>
    </div>
    <!-- ============================================================= -->
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import axios from 'axios'

const BASE = 'https://satelliteback.onrender.com';
const API  = `${BASE}/api`;

const tokenHeader = () => {
  const t = sessionStorage.getItem('token');
  return t ? { Authorization: `Bearer ${t}` } : {};
};

const busy = ref(false);
const loading = ref(true);
const msg = ref('');
const ok = ref(false);

const role = ref('GUEST');
const isAdmin = computed(() => String(role.value).toUpperCase().includes('ADMIN'));
const isTeacher = computed(() => String(role.value).toUpperCase().includes('TEACHER'));

const classes = ref([]);

function setMsg(m, isOk=false){ msg.value = m; ok.value = isOk; }
function displayUser(u){
  return [
    u?.fullName || u?.name || (u?.firstName && u?.lastName ? `${u.firstName} ${u.lastName}` : null) || u?.username || u?.email,
    u?.email && `(${u.email})`
  ].filter(Boolean).join(' ');
}
function userName(u){ return u ? displayUser(u) : null; }

onMounted(async () => {
  try {
    await loadRole();
    await reload();
  } catch (e) {
    setMsg('Failed to load classes: ' + (e.message || e), false);
  }
});

async function loadRole(){
  const r = await fetch(`${API}/auth/me`, { headers: tokenHeader(), credentials: 'include' });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  const me = await r.json();
  role.value = me?.role?.name || me?.role || me?.authorities?.[0] || 'USER';
}

async function reload(){
  setMsg('');
  loading.value = true;
  const url =  `${API}/classes`;
  const r = await axios.get(url, { headers: tokenHeader(), credentials: 'include' });
  classes.value = Array.isArray(r.data) ? r.data : (r.data.items || []);
  loading.value = false;
}

/* ---------------- CREATE CLASS (ADMIN) ---------------- */
const createModal = reactive({ open: false });
const createForm = reactive({ name: '' });
const formError = ref('');
const createSuccess = ref(false);

// Teachers search + dual-list selections
const teacherOptions = ref([]);           // left list options
const chosenTeachers = ref([]);           // right list items (objects)
const selectedLeftTeachers = ref([]);     // left list selected ids
const selectedRightTeachers = ref([]);    // right list selected ids
const teacherQuery = ref('');

// Students search + dual-list selections
const studentOptions = ref([]);           // left
const chosenStudents = ref([]);           // right
const selectedLeftStudents = ref([]);     // left selected ids
const selectedRightStudents = ref([]);    // right selected ids
const studentQuery = ref('');

// Open/close create modal
function openCreateModal(){
  createModal.open = true;
  createSuccess.value = false;
  formError.value = '';
  teacherQuery.value = '';
  studentQuery.value = '';
  clearChosenTeachers();
  clearChosenStudents();
  selectedLeftTeachers.value = [];
  selectedRightTeachers.value = [];
  selectedLeftStudents.value = [];
  selectedRightStudents.value = [];
  fetchTeachers();
  fetchStudents();
}
function closeCreateModal(){
  if (busy.value) return;
  createModal.open = false;
  // keep data as-is; it’s fine either way
}

// validations
const canSubmit = computed(() => {
  return !!createForm.name.trim() && chosenTeachers.value.length > 0;
});

// Debounced searches
let tTimer = null, sTimer = null;
function debouncedFetchTeachers(){ clearTimeout(tTimer); tTimer = setTimeout(fetchTeachers, 250); }
function debouncedFetchStudents(){ clearTimeout(sTimer); sTimer = setTimeout(fetchStudents, 250); }

// Search API calls
async function fetchTeachers(){
  const q = encodeURIComponent(teacherQuery.value || '');
  const r = await fetch(`${API}/classes/users?role=TEACHER&q=${q}&limit=50`, {
    headers: tokenHeader(), credentials: 'include'
  });
  if (!r.ok) { teacherOptions.value = []; return; }
  const data = await r.json();
  teacherOptions.value = Array.isArray(data) ? data : (data.items || []);
}
async function fetchStudents(){
  const q = encodeURIComponent(studentQuery.value || '');
  const r = await fetch(`${API}/classes/users?role=STUDENT&q=${q}&limit=100`, {
    headers: tokenHeader(), credentials: 'include'
  });
  if (!r.ok) { studentOptions.value = []; return; }
  const data = await r.json();
  studentOptions.value = Array.isArray(data) ? data : (data.items || []);
}

// Move selected teachers
function addSelectedTeachers(){
  const set = new Set(chosenTeachers.value.map(t => t.id));
  const toAdd = selectedLeftTeachers.value
    .map(id => teacherOptions.value.find(t => t.id === id))
    .filter(Boolean)
    .filter(t => !set.has(t.id));
  chosenTeachers.value = chosenTeachers.value.concat(toAdd);
  selectedLeftTeachers.value = [];
}
function removeSelectedTeachers(){
  if (!selectedRightTeachers.value.length) return;
  const removeSet = new Set(selectedRightTeachers.value);
  chosenTeachers.value = chosenTeachers.value.filter(t => !removeSet.has(t.id));
  selectedRightTeachers.value = [];
}
function clearChosenTeachers(){
  chosenTeachers.value = [];
  selectedRightTeachers.value = [];
}

// Move selected students
function addSelectedStudents(){
  const set = new Set(chosenStudents.value.map(s => s.id));
  const toAdd = selectedLeftStudents.value
    .map(id => studentOptions.value.find(s => s.id === id))
    .filter(Boolean)
    .filter(s => !set.has(s.id));
  chosenStudents.value = chosenStudents.value.concat(toAdd);
  selectedLeftStudents.value = [];
}
function removeSelectedStudents(){
  if (!selectedRightStudents.value.length) return;
  const removeSet = new Set(selectedRightStudents.value);
  chosenStudents.value = chosenStudents.value.filter(s => !removeSet.has(s.id));
  selectedRightStudents.value = [];
}
function clearChosenStudents(){
  chosenStudents.value = [];
  selectedRightStudents.value = [];
}

async function createClass(){
  try{
    formError.value = '';
    createSuccess.value = false;
    if (!canSubmit.value) {
      formError.value = 'Please provide a unique class name and select at least one teacher.';
      return;
    }
    busy.value = true;

    const payload = {
      name: createForm.name,
      teacherIds: chosenTeachers.value.map(t => t.id),
      studentIds: chosenStudents.value.map(s => s.id)
    };

    const r = await fetch(`${API}/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...tokenHeader() },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    if (r.status === 409) {
      formError.value = 'Class name must be unique.';
      return;
    }
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);

    // success: show banner INSIDE modal, keep it open
    createSuccess.value = true;
    await reload(); // refresh list so the new class appears
  } catch(e) {
    formError.value = 'Failed to create class: ' + (e.message || e);
  } finally {
    busy.value = false;
  }
}

/* ---------------- DETAILS DRAWER ---------------- */
const details = reactive({
  open: false,
  loading: false,
  data: null
});

async function openDetails(id){
  try{
    details.open = true;
    details.loading = true;
    details.data = null;
    const r = await fetch(`${API}/classes/${encodeURIComponent(id)}`, {
      headers: tokenHeader(), credentials: 'include'
    });
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    details.data = await r.json();
  } catch(e){
    details.data = { name: 'Error', teachers: [], students: [], studentCount: 0 };
  } finally {
    details.loading = false;
  }
}
function closeDetails(){ details.open = false; }
</script>

<style scoped>
/* Page & Head */
.classes-page{ display:grid; gap:14px; }
.head{ display:flex; align-items:center; gap:12px; }
.title{ margin:0; font-size:20px; font-weight:800; color:#0f172a; }
.spacer{ flex:1; }
.subhead{ display:flex; align-items:center; justify-content:space-between; }

/* List */
.list{ display:grid; gap:8px; }
.class-row{
  border:1px solid #e6e8ee; border-radius:14px; background:#fff;
  padding:12px 14px; display:flex; align-items:center; justify-content:space-between;
  transition: box-shadow .15s ease, transform .05s ease, background .15s ease;
  cursor:pointer;
}
.class-row:hover{ background:#fafcff; box-shadow: 0 6px 20px rgba(0,0,0,.06); }
.class-name{ font-weight:800; color:#0f172a; }
.class-sub{ display:flex; flex-wrap:wrap; gap:8px; margin-top:6px; }
.pill{
  background:#f8fafc; border:1px solid #e6e8ee; border-radius:999px; padding:4px 10px;
  font-size:12px; color:#3b4452;
}
.chev{ color:#94a3b8; font-size:20px; margin-left:8px; }

/* Skeletons */
.skeleton{ height:48px; border-radius:12px; background:
  linear-gradient(90deg, #f3f6fb 25%, #e9eef6 37%, #f3f6fb 63%); background-size:400% 100%;
  animation: shimmer 1.2s ease-in-out infinite; border:1px solid #e6e8ee; }
.skeleton.block{ height:18px; margin:8px 0; }
.skeleton.block.short{ width:40%; }
@keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }

/* Buttons */
.btn{ border:1px solid #cbd5e1; background:#fff; color:#0f172a; padding:8px 12px; border-radius:10px; font-weight:700; cursor:pointer; }
.btn.primary{ background:#2563eb; border-color:#1d4ed8; color:#fff; }
.btn.subtle{ background:#f8fafc; }
.btn:disabled{ opacity:.6; cursor:not-allowed; }

.ok{ color:#16a34a; } .err{ color:#dc2626; }
.muted{ color:#64748b; }
.small{ font-size:12px; }
.pad{ padding:8px 0; }

/* Modal */
.modal{
  position:fixed; inset:0; display:flex; align-items:center; justify-content:center;
  background:rgba(0,0,0,.45); z-index:1000; padding:16px;
}
.modal-card{
  background:#fff; border-radius:16px; width:min(980px, 96vw);
  box-shadow:0 16px 48px rgba(0,0,0,.28);
  display:grid; grid-template-rows:auto 1fr auto; overflow:hidden;
}
.modal-head{
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 16px; border-bottom:1px solid #eef2f7; background:#f8fafc;
}
.modal-title{ margin:0; font-size:18px; font-weight:800; }
.close{ border:none; background:#fff; width:36px; height:36px; border-radius:999px; font-size:20px; cursor:pointer; }
.modal-body{ padding:14px 16px; display:grid; gap:14px; }
.modal-foot{
  padding:12px 14px; border-top:1px solid #eef2f7;
  display:flex; align-items:center; justify-content:space-between; gap:10px;
  background:#f8fafc;
}
.left-foot{ }
.foot-actions{ display:flex; gap:8px; }

.banner.ok{
  border:1px solid #86efac; background:#f0fdf4; color:#065f46;
  padding:10px 12px; border-radius:10px; font-weight:700;
}

/* Form */
.form-row{ display:grid; gap:6px; }
.label{ font-weight:700; color:#0f172a; }
.req{ color:#dc2626; margin-left:2px; }
.input{
  width:100%; padding:10px 12px; border:1px solid #e6e8ee; border-radius:10px; outline:none;
}
.input:disabled{ background:#f8fafc; }
.grid-2{ display:grid; grid-template-columns: 1fr 1fr; gap:16px; }
.form-block{ display:grid; gap:8px; }
.search-wrap{ }

.dual{ display:grid; grid-template-columns: 1fr auto 1fr; gap:10px; align-items:center; }
.dual-actions{ display:grid; gap:8px; justify-items:center; }
.row-actions{ margin-top:8px; }

@media (max-width: 940px) {
  .grid-2{ grid-template-columns: 1fr; }
  .dual{ grid-template-columns: 1fr; }
  .dual-actions{ grid-auto-flow: column; grid-template-columns: repeat(2, auto); }
}

/* Drawer (right-side details) */
.drawer{
  position: fixed; inset:0; pointer-events:none;
}
.drawer.open{ pointer-events:auto; }
.drawer-card{
  position:absolute; right:0; top:0; bottom:0;
  width:min(420px, 94vw);
  transform: translateX(110%);
  transition: transform .2s ease;
  background:#fff; border-left:1px solid #e6e8ee; box-shadow: -16px 0 40px rgba(0,0,0,.2);
}
.drawer.open .drawer-card{ transform: translateX(0%); }
.drawer-head{
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 16px; border-bottom:1px solid #eef2f7; background:#f8fafc;
}
.drawer-title{ margin:0; font-size:18px; font-weight:800; }
.drawer-body{ padding:14px 16px; display:grid; gap:12px; overflow:auto; height: calc(100% - 58px); }

.kv{ display:grid; grid-template-columns: 120px 1fr; gap:8px; }
.k{ color:#64748b; font-weight:600; }
.v{ color:#0f172a; }

.students-list .list-head{ font-weight:800; margin:8px 0 4px; }
.students-list ul{ margin:0; padding-left:18px; }
.students-list li{ margin:2px 0; }
</style>
