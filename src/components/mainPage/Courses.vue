<!-- CoursesSection.vue -->
<template>
  <!-- ADDED: ref + class toggle for scroll-in animation -->
  <section class="courses" id="courses" ref="root" :class="{ in: inView }">
    <div class="container">
      <span class="eyebrow">{{ $t('courses') }}</span>
      <h2 class="title">{{ $t('coursesSubtitle') }}</h2>

      <ul class="cards">
        <li v-for="c in courses" :key="c.id" class="card">
          <figure class="thumb">
            <img :src="c.cover" :alt="c.title" />
            <span v-if="c.badge" class="badge">{{ c.badge }}</span>
          </figure>

          <div class="body">
            <div class="top">
              <h3 class="name">{{ c.title }}</h3>
              <span class="price">{{ money(c.price) }}</span>
            </div>
            <p class="desc">{{ c.desc }}</p>

            <ul class="meta">
              <li><strong>{{ $t('courseLevel')}}:</strong> {{ c.level }}</li>
              <li><strong>{{ $t('courseDuration' )}}:</strong> {{ c.duration }}</li>
              <li><strong>{{ $t('courseLessons') }}:</strong> {{ c.lessons }}</li>
            </ul>

            <div class="actions">
              <button class="btn primary" @click="openEnroll(c)">Enroll</button>
              <button class="btn ghost" @click="openPreview(c)">Preview</button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Preview Modal -->
    <transition name="fade">
      <div v-if="previewCourse" class="overlay" @click.self="closePreview">
        <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="preview-title">
          <button class="x" aria-label="Close preview" @click="closePreview">×</button>

          <figure class="hero">
            <img :src="previewCourse.cover" :alt="previewCourse.title" />
            <figcaption class="price-tag">{{ money(previewCourse.price) }}</figcaption>
          </figure>

          <h3 id="preview-title" class="dh">{{ previewCourse.title }}</h3>
          <p class="ds">
            {{ previewCourse.category }} · {{ previewCourse.level }} ·
            {{ previewCourse.duration }} · {{ previewCourse.lessons }} lessons
          </p>

          <p class="mb">{{ previewCourse.long }}</p>
          <h4 class="sh">Syllabus highlights</h4>
          <ul class="syll">
            <li v-for="(s,i) in previewCourse.syllabus" :key="i">• {{ s }}</li>
          </ul>

          <div class="dactions">
            <button class="btn primary" @click="goEnrollFromPreview">Enroll now</button>
            <button class="btn" @click="closePreview">Close</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Enroll Modal -->
    <transition name="fade">
      <div v-if="enrollCourse" class="overlay" @click.self="closeEnroll">
        <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="enroll-title">
          <button class="x" aria-label="Close enroll" @click="closeEnroll">×</button>

          <h3 id="enroll-title" class="dh">Enroll — {{ enrollCourse.title }}</h3>
          <p class="ds">{{ enrollCourse.level }} · {{ enrollCourse.duration }} · {{ money(enrollCourse.price) }}</p>

          <form class="form" @submit.prevent="submitEnroll">
            <label class="lbl">Student full name</label>
            <input v-model.trim="form.name" placeholder="e.g., Abdusamad Karimov" required />

            <label class="lbl">Email</label>
            <input
              v-model.trim="form.email"
              type="email"
              placeholder="you@example.com"
              @blur="touched.email = true"
              :class="{ invalid: touched.email && !validEmail }"
              required
            />
            <p v-if="touched.email && !validEmail" class="err">Enter a valid email.</p>

            <label class="lbl">Phone (Uzbekistan)</label>
            <div class="phonebox" :class="{ invalid: touched.phone && !validPhone }">
              <span class="cc">+998</span>
              <input
                v-model="phoneView"
                inputmode="numeric"
                maxlength="12"
                placeholder="90 123 45 67"
                @input="onPhone"
                @blur="touched.phone = true"
                required
              />
            </div>
            <small class="muted">Codes: 33, 90, 91, 93, 94, 95, 97, 98, 99, 71</small>
            <p v-if="touched.phone && !validPhone" class="err">{{ phoneErr }}</p>

            <label class="lbl">Mode</label>
            <div class="options">
              <label><input type="radio" value="Online" v-model="form.mode" /> Online</label>
              <label><input type="radio" value="Offline" v-model="form.mode" /> Offline</label>
            </div>

            <label class="lbl">Preferred start</label>
            <input v-model="form.start" type="date" />

            <label class="lbl">Notes</label>
            <textarea v-model.trim="form.notes" rows="3" placeholder="Any timing preferences, goals, etc."></textarea>

            <div class="dactions">
              <button class="btn primary" type="submit" :disabled="!formOK">Submit</button>
              <button class="btn" type="button" @click="closeEnroll">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'

/* Sample data (replace with your API) */
const courses = reactive([
  {
    id: 1,
    title: 'SAT English Mastery',
    category: 'English',
    level: 'Intermediate',
    duration: '6 weeks',
    lessons: 24,
    price: 149,
    badge: 'Top pick',
    cover: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1200&auto=format&fit=crop',
    desc: 'Grammar patterns, transitions, and reading tactics with timed drills.',
    long: 'High-yield grammar, punctuation, transitions, and reading strategies for the Digital SAT. Includes weekly checklists, timed sets, and review clinics.',
    syllabus: ['Evidence questions', 'Transitions & cohesion', 'Punctuation pack', 'Paired passages']
  },
  {
    id: 2,
    title: 'SAT Math Intensive',
    category: 'Math',
    level: 'Advanced',
    duration: '5 weeks',
    lessons: 20,
    price: 169,
    badge: 'Fast-track',
    cover: 'https://images.unsplash.com/photo-1523246191841-7c58925b6f87?q=80&w=1200&auto=format&fit=crop',
    desc: 'Algebra, functions, exponents, and data analysis. Convert traps into patterns.',
    long: 'Linear/quadratic forms, function moves, exponential thinking, and data analysis. Calculator and no-calc pacing rehearsed weekly.',
    syllabus: ['Linear & quadratic forms', 'Function shifts', 'Ratios & percents', 'Data & statistics']
  },
  {
    id: 3,
    title: 'Proctored Practice + Analytics',
    category: 'Practice',
    level: 'All levels',
    duration: '4 weeks',
    lessons: 8,
    price: 99,
    cover: 'https://images.unsplash.com/photo-1518085250887-2f903c200fee?q=80&w=1200&auto=format&fit=crop',
    desc: 'Official-style tests under exam rules with same-day analytics.',
    long: 'Time-per-question, skill breakdowns, top three fixes. Review clinics teach you how to learn from mistakes.',
    syllabus: ['Timed full tests', 'Error logs', 'Pacing drills', 'Review clinics']
  }
])

/* Money format */
const money = n => (n === 0 ? 'Free' : `$${n}`)

/* ----- Preview modal ----- */
const previewCourse = ref(null)
function openPreview(c){ previewCourse.value = c }
function closePreview(){ previewCourse.value = null }
function goEnrollFromPreview(){
  if (!previewCourse.value) return
  openEnroll(previewCourse.value)
  closePreview()
}

/* ----- Enroll modal + form ----- */
const enrollCourse = ref(null)
const form = ref({ name: '', email: '', mode: 'Online', start: '', notes: '' })
const phoneView = ref('')
const touched = ref({ email: false, phone: false })
const uzCodes = new Set(['33','90','91','93','94','95','97','98','99','71'])

function openEnroll(c){
  enrollCourse.value = c
  form.value = { name: '', email: '', mode: 'Online', start: '', notes: '' }
  phoneView.value = ''
  touched.value = { email: false, phone: false }
}
function closeEnroll(){ enrollCourse.value = null }

/* Validation */
const validEmail = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(form.value.email.trim()))
const phoneDigits = computed(() => phoneView.value.replace(/\D/g,'').slice(0,9))
const phoneErr = computed(() => {
  if (phoneDigits.value.length !== 9) return 'Enter 9 digits after +998.'
  const code = phoneDigits.value.slice(0,2)
  if (!uzCodes.has(code)) return `Invalid code: ${code}`
  return ''
})
const validPhone = computed(() => phoneErr.value === '')
const formOK = computed(() =>
  form.value.name.trim().length >= 2 && validEmail.value && validPhone.value
)

function onPhone(e){
  const d = e.target.value.replace(/\D/g,'').slice(0,9)
  phoneView.value = [d.slice(0,2), d.slice(2,5), d.slice(5,7), d.slice(7,9)]
    .filter(Boolean).join(' ')
}
function submitEnroll(){
  touched.value = { email: true, phone: true }
  if (!formOK.value) return
  const payload = {
    courseId: enrollCourse.value.id,
    courseTitle: enrollCourse.value.title,
    name: form.value.name.trim(),
    email: form.value.email.trim(),
    phone: '+998 ' + phoneDigits.value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/,'$1 $2 $3 $4'),
    mode: form.value.mode,
    start: form.value.start || null,
    notes: form.value.notes.trim()
  }
  console.log('Enroll payload:', payload)
  alert('Thanks! Your enrollment request was sent.')
  closeEnroll()
}

/* Optional: close modals with ESC */
function onKey(e){
  if (e.key === 'Escape') {
    if (previewCourse.value) closePreview()
    if (enrollCourse.value) closeEnroll()
  }
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

/* === Scroll-in animation toggles (minimal; no layout change) === */
const root = ref(null)
const inView = ref(false)
let io
onMounted(() => {
  io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      inView.value = true
      io.unobserve(entry.target)
    }
  }, { threshold: 0.18 })
  if (root.value) io.observe(root.value)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

.courses{
  --ink:#1A1B23;
  --muted:#566070;
  --line:#e6ebf2;
  --accent:#f2b200;
  --max:1200px;
  --card:#fff;
}

*{ box-sizing:border-box }
.courses{
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
  color:var(--ink); background:#fff; padding:44px 0 80px;
}
.container{ max-width:var(--max); margin:0 auto; padding:0 16px }

/* Title */
.eyebrow{ display:inline-block; background:var(--accent); color:#111; font-weight:800; font-size:12px; letter-spacing:.14em; padding:8px 14px; border-radius:10px }
.title{ margin:14px 0 18px; font-weight:800; font-size: clamp(28px, 5vw, 40px) }

/* Cards */
.cards{ list-style:none; margin:16px 0 0; padding:0; display:flex; flex-wrap:wrap; gap:22px }
.card{
  flex:1 1 320px; min-width:280px; background:var(--card); border:1px solid var(--line);
  border-radius:16px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,.04);
}
.thumb{ position:relative; aspect-ratio:16/9; background:#f3f5f8 }
.thumb img{ width:100%; height:100%; object-fit:cover; display:block }
.badge{ position:absolute; left:10px; top:10px; background:#fff6d8; border:1px solid #ffe59a; padding:4px 8px; border-radius:999px; font-size:12px; font-weight:800 }
.body{ padding:12px 14px 14px }
.top{ display:flex; align-items:center; justify-content:space-between; gap:10px }
.name{ margin:0; font-weight:800; font-size:18px; color:#223046 }
.price{ font-weight:800; background:#fff6d8; border:1px solid #ffe59a; padding:6px 10px; border-radius:10px }
.desc{ color:var(--muted); margin:8px 0 12px }
.meta{ display:flex; gap:14px; flex-wrap:wrap; list-style:none; padding:0; margin:0 0 12px; color:#2b3344; font-weight:700; font-size:13px }
.actions{ display:flex; gap:8px }
.btn{ border:1px solid #e6e8ee; background:#fff; color:#1a1b23; font-weight:800; padding:10px 12px; border-radius:10px; cursor:pointer }
.btn.primary{ background:#111; color:#fff; border-color:#111 }
.btn.ghost{ background:#f7f8fb }

/* Modals shared */
.overlay{
  position:fixed; inset:0; background:rgba(0,0,0,.38);
  display:flex; align-items:center; justify-content:center; padding:16px; z-index:1000;
}

.dialog{
  width: min(760px, 100%);
  background:#fff;
  border-radius:18px;
  border:1px solid var(--line);
  box-shadow:0 30px 70px rgba(0,0,0,.25);

  /* height behavior */
  max-height: min(88svh, 760px);
  overflow: auto;
  scrollbar-gutter: stable both-edges;

  padding:16px 16px 18px;
  position:relative;
}

@supports not (height: 1svh) {
  .dialog { max-height: min(88vh, 760px); }
}

.x{ position:absolute; top:8px; right:10px; border:0; background:transparent; font-size:28px; cursor:pointer; line-height:1 }
.dh{ margin:6px 0 2px; font-size:22px; font-weight:800 }
.ds{ color:#6a7280; font-size:13px; margin:0 0 8px }
.mb{ color:#566070; margin:8px 0 12px }
.syll{ margin:0 0 12px 18px }
.dactions{ display:flex; gap:10px; justify-content:flex-end }

/* Preview hero */
.hero{ margin:6px 0 10px; border-radius:12px; overflow:hidden; border:1px solid var(--line) }
.hero img{
  width:100%;
  height: clamp(160px, 30svh, 280px);
  object-fit: cover;
  display:block;
}

.dialog{ -webkit-overflow-scrolling: touch; }
.price-tag{ position:absolute; right:18px; top:18px; background:#fff6d8; border:1px solid #ffe59a; border-radius:10px; padding:6px 10px; font-weight:800 }

/* Enroll form */
.form{ display:flex; flex-direction:column; gap:8px }
.lbl{ font-weight:800; color:#223046; margin-top:6px }
.form input,.form textarea{
  border:1px solid var(--line); border-radius:12px; padding:10px 12px; font-weight:600; outline:0;
}
.form input:focus,.form textarea:focus{ border-color:#cfd7e3; box-shadow:0 0 0 3px #e9eef7 }
.options{ display:flex; gap:12px; flex-wrap:wrap }
.phonebox{
  display:flex; align-items:center; gap:8px; border:1px solid var(--line); border-radius:12px; padding:6px 8px; background:#fafbff
}
.cc{ font-weight:800; background:#fff6d8; border:1px solid #ffe59a; padding:6px 10px; border-radius:10px; color:#0f172a }
.phonebox input{ border:0; outline:0; flex:1; font-weight:700; padding:8px 6px 8px 2px }
.muted{ color:#6a7280; font-size:12px }
.err{ color:#dc2626; font-size:12px; margin:0 }
.invalid{ border-color:#ef4444 !important; box-shadow:0 0 0 3px #fee2e2 !important }

/* Transition */
.fade-enter-from,.fade-leave-to{ opacity:0; transform: translateY(8px) }
.fade-enter-active,.fade-leave-active{ transition: opacity .18s ease, transform .18s ease }

/* =========================
   Scroll-in animations (header + cards)
   ========================= */
.courses .eyebrow,
.courses .title{
  opacity:0;
  transform: translateX(-22px);
}
.courses .eyebrow{ transition: opacity .6s, transform .6s; }
.courses .title{ transition: opacity .7s .05s, transform .7s .05s; }
.courses.in .eyebrow,
.courses.in .title{
  opacity:1;
  transform:none;
}

.courses .cards .card{
  opacity:0;
  transform: translateY(18px);
  transition: opacity .45s ease, transform .45s ease;
}
.courses.in .cards .card{ opacity:1; transform:none; }
/* stagger */
.courses.in .cards .card:nth-child(1){ transition-delay:.10s }
.courses.in .cards .card:nth-child(2){ transition-delay:.16s }
.courses.in .cards .card:nth-child(3){ transition-delay:.22s }
.courses.in .cards .card:nth-child(4){ transition-delay:.28s }
.courses.in .cards .card:nth-child(5){ transition-delay:.34s }
.courses.in .cards .card:nth-child(6){ transition-delay:.40s }
.courses.in .cards .card:nth-child(7){ transition-delay:.46s }
.courses.in .cards .card:nth-child(8){ transition-delay:.52s }
.courses.in .cards .card:nth-child(9){ transition-delay:.58s }
.courses.in .cards .card:nth-child(10){ transition-delay:.64s }

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce){
  .courses .eyebrow,.courses .title,.courses .cards .card{
    transition:none !important; transform:none !important; opacity:1 !important;
  }
}

/* Responsive */
@media (max-width: 860px){
  .hero img{ height:200px }
}
</style>
