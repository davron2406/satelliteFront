<!-- BooksSectionAuto.vue -->
<template>
  <section class="books" id="books" ref="root" :class="{ in: inView }">
    <div class="container">
      <span class="eyebrow">{{ $t('books') }}</span>
      <h2 class="title">{{ $t('booksSubtitle') }}</h2>

      <div class="toolbar">
        <div class="search">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-.7.7l.3.3v.8L20 21l1-1-5.5-6Z" fill="currentColor"/>
          </svg>
          <input v-model="q" placeholder="Search books…" />
        </div>

        <label class="select">
          <span>Category</span>
          <select v-model="cat">
            <option value="">All</option>
            <option v-for="c in cats" :key="c" :value="c">{{ c }}</option>
          </select>
        </label>
      </div>

      <!-- Carousel -->
      <div class="carousel">
        <div class="edge left" aria-hidden="true"></div>
        <div class="edge right" aria-hidden="true"></div>

        <!-- arrows -->
        <button class="nav prev" :disabled="!canLeft" @click="scrollBy(-1)" aria-label="Previous">
          <svg viewBox="0 0 24 24" width="20" height="20"><path d="M15.5 4.5 7.9 12l7.6 7.5-1.4 1.5L5 12l9.1-9 1.4 1.5Z" fill="currentColor"/></svg>
        </button>
        <button class="nav next" :disabled="!canRight" @click="scrollBy(1)" aria-label="Next">
          <svg viewBox="0 0 24 24" width="20" height="20"><path d="m8.5 4.5 1.4-1.5L19 12l-9.1 9-1.4-1.5L16.1 12 8.5 4.5Z" fill="currentColor"/></svg>
        </button>

        <div class="viewport" ref="rail" @scroll="onScroll" @pointerdown="onDragStart">
          <ul class="rail">
            <li v-for="b in filtered" :key="b.id" class="card">
              <figure class="cover">
                <img :src="b.cover" :alt="b.title" loading="lazy" />
                <span class="pdf-tag">PDF</span>
              </figure>

              <div class="meta">
                <h3 class="name" :title="b.title">{{ b.title }}</h3>
                <div class="sub">
                  <span class="author">{{ b.author }}</span>
                  <span class="dot">•</span>
                  <span class="misc">{{ metaText(b) }}</span>
                </div>
              </div>

              <div class="actions">
                <button class="btn primary" @click="openPdf(b)">Read</button>
                <a
                  class="btn"
                  :href="b.pdf"
                  :download="(b.title.replace(/[^a-z0-9]+/gi,'_') + '.pdf')"
                  target="_blank"
                  rel="noopener"
                >Download</a>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="progress">
        <div class="bar" :style="{ width: progress + '%' }"></div>
      </div>
    </div>

    <!-- Reader modal -->
    <div v-if="modal" class="overlay" @click.self="modal = null">
      <div class="dialog" role="dialog" aria-modal="true">
        <div class="dhead">
          <div>
            <h3 class="dh">{{ modal.title }}</h3>
            <div class="ds">{{ modal.author }} <span v-if="modal.lang">· {{ modal.lang }}</span></div>
          </div>
          <button class="x" aria-label="Close" @click="modal = null">×</button>
        </div>

        <div class="viewer">
          <iframe :src="modal.pdf" title="PDF preview" frameborder="0"></iframe>
        </div>

        <div class="dactions">
          <a class="btn primary" :href="modal.pdf" target="_blank" rel="noopener">Open in new tab</a>
          <a class="btn" :href="modal.pdf" :download="(modal.title.replace(/[^a-z0-9]+/gi,'_') + '.pdf')">Download</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

/* auto-import PDFs + covers from src/assets/books */
const pdfMods = import.meta.glob('/src/assets/books/**/*.pdf', { as: 'url', eager: true })
const coverMods = import.meta.glob('/src/assets/books/covers/*.{jpg,jpeg,png,webp,avif}', { as: 'url', eager: true })

const base = (p) => p.split('/').pop().replace(/\.[^.]+$/,'')
const slug = (p) => base(p).toLowerCase()
const titleCase = (s) => s.replace(/[-_]/g,' ').replace(/\s+/g,' ').trim().replace(/\b\w/g, c => c.toUpperCase())

const guessCat = (s) => /math/i.test(s) ? 'Math' : /english|reading/i.test(s) ? 'English' : /practice|test/i.test(s) ? 'Practice' : 'Other'
const guessLang = (s) => /uzb|uz/i.test(s) ? 'UZ' : /rus|ru/i.test(s) ? 'RU' : 'EN'
const guessAuthor = (s) => /karimov|saydullayev|umarova/i.test(s)
  ? titleCase((s.match(/karimov|saydullayev|umarova/i)||[])[0])
  : 'Team Satellite'

const coverBySlug = {}
for (const [p, url] of Object.entries(coverMods)) coverBySlug[slug(p)] = url

const placeholder = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 800'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='#f7f8fb'/><stop offset='1' stop-color='#e9eef7'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><rect x='70' y='140' width='460' height='520' fill='white' stroke='#dfe5ef' stroke-width='6' rx='18'/><text x='50%' y='52%' text-anchor='middle' font-family='Inter,Arial' font-size='44' fill='#223046' font-weight='800'>PDF</text></svg>`
)}`

const books = Object.entries(pdfMods)
  .map(([p, url], i) => {
    const s = slug(p)
    const cov = coverBySlug[s] || coverBySlug[s.replace(/-v\d+$/,'')] || placeholder
    return { id: i + 1, title: titleCase(base(p)), author: guessAuthor(s), pages: undefined, lang: guessLang(s), category: guessCat(s), cover: cov, pdf: url }
  })
  .sort((a,b)=> a.title.localeCompare(b.title))

/* filters */
const q = ref(''); const cat = ref('')
const cats = computed(() => Array.from(new Set(books.map(b => b.category))))
const filtered = computed(() => {
  const k = q.value.trim().toLowerCase()
  return books.filter(b => (!k || (b.title + ' ' + b.author).toLowerCase().includes(k)) && (!cat.value || b.category === cat.value))
})

/* modal */
const modal = ref(null)
function openPdf(b){ modal.value = b }

const BASE = import.meta.env.BASE_URL || '/'
const pdfViewerSrc = (fileUrl) => `${BASE}pdfjs/web/viewer.html?file=${encodeURIComponent(fileUrl)}#zoom=page-fit`
const metaText = (b) => [b.pages ? `${b.pages}p` : null, b.lang].filter(Boolean).join(' · ')

/* animations */
const root = ref(null)
const inView = ref(false)
let io
onMounted(() => {
  io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { inView.value = true; io.unobserve(entry.target) }
  }, { threshold: 0.18 })
  if (root.value) io.observe(root.value)
})
onBeforeUnmount(() => io?.disconnect())

/* carousel controls */
const rail = ref(null)
const canLeft = ref(false), canRight = ref(true), progress = ref(0)

function updateEnds(){
  const el = rail.value
  if (!el) return
  const max = Math.max(0, el.scrollWidth - el.clientWidth)
  const x = el.scrollLeft
  canLeft.value = x > 2
  canRight.value = x < max - 2
  progress.value = max <= 0 ? 0 : Math.min(100, Math.max(0, (x / max) * 100))
}
function onScroll(){ updateEnds() }
function scrollBy(dir){
  const el = rail.value
  if (!el) return
  el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' })
}

/* drag-to-scroll (safe for buttons/links) */
let drag = { active:false, moved:false, startX:0, startLeft:0 }
function isInteractive(el){ return el && el.closest('button, a, input, textarea, select, label') }

function onDragStart(e){
  if (e.button !== undefined && e.button !== 0) return
  if (isInteractive(e.target)) return
  const el = rail.value
  if (!el) return
  drag = { active:true, moved:false, startX: e.clientX ?? 0, startLeft: el.scrollLeft }
  window.addEventListener('pointermove', onDragMove, { passive: true })
  window.addEventListener('pointerup', onDragEnd, { passive: false })
}
function onDragMove(e){
  if (!drag.active) return
  const el = rail.value
  if (!el) return
  const x = e.clientX ?? 0
  const dx = x - drag.startX
  if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; el.style.scrollBehavior = 'auto'; el.setPointerCapture?.(e.pointerId) }
  if (drag.moved) el.scrollLeft = drag.startLeft - dx
}
function onDragEnd(e){
  const el = rail.value
  if (el) el.style.scrollBehavior = ''
  if (drag.moved) { e.preventDefault(); e.stopPropagation() }
  drag = { active:false, moved:false, startX:0, startLeft:0 }
  window.removeEventListener('pointermove', onDragMove)
  window.removeEventListener('pointerup', onDragEnd)
  updateEnds()
}

/* sync on mount/resize and when list changes */
onMounted(() => {
  updateEnds()
  const onRz = () => updateEnds()
  window.addEventListener('resize', onRz)
  onBeforeUnmount(() => window.removeEventListener('resize', onRz))
})
watch([filtered], async () => { await nextTick(); updateEnds() })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

.books{
  --ink:#1A1B23; --muted:#566070; --line:#e6ebf2; --accent:#f2b200;
  --max:1200px; --card:#fff;
  color:var(--ink); background:#fff; padding:44px 0 80px;
  font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;
}
.container{ max-width:var(--max); margin:0 auto; padding:0 16px; }
.eyebrow{ display:inline-block; background:var(--accent); color:#111; font-weight:800; font-size:12px; letter-spacing:.14em; padding:8px 14px; border-radius:10px }
.title{ margin:14px 0 18px; font-weight:800; font-size: clamp(28px, 5vw, 40px) }

/* Toolbar */
.toolbar{ display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin-bottom:8px; }
.search{ flex:1 1 260px; min-width:260px; display:flex; align-items:center; gap:8px; border:1px solid var(--line); border-radius:12px; padding:10px 12px; color:#6a7280; }
.search input{ border:0; outline:0; flex:1; background:transparent; font-weight:600 }
.select{ display:flex; align-items:center; gap:8px; border:1px solid var(--line); border-radius:10px; padding:8px 10px; background:#fafbfd; }
.select select{ border:0; background:transparent; font-weight:700; outline:none }

/* ===== Carousel layout ===== */
.carousel{ position:relative; margin-top:16px; }

/* gradient edges */
.edge{
  position:absolute; top:0; bottom:0; width:48px; pointer-events:none; z-index:2;
  background: linear-gradient(to right, #fff, rgba(255,255,255,0));
}
.edge.right{ right:0; transform: scaleX(-1); }
.edge.left{ left:0; }

/* viewport/rail */
.viewport{
  overflow-x:auto; overflow-y:hidden; -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory; scroll-padding: 0 10px;
  padding: 4px 8px 2px; touch-action: pan-y;
}
.viewport::-webkit-scrollbar{ height:8px }
.viewport::-webkit-scrollbar-thumb{ background:transparent }

.rail{
  list-style:none; margin:0; padding:0; display:grid; gap:18px; grid-auto-flow: column;
  /* desktop/tablet defaults */
  grid-auto-columns: 82%;
}
@media (min-width: 480px){ .rail{ grid-auto-columns: 64%; } }
@media (min-width: 680px){ .rail{ grid-auto-columns: 52%; } }
@media (min-width: 960px){ .rail{ grid-auto-columns: 34%; } }
@media (min-width: 1200px){ .rail{ grid-auto-columns: 25%; } }

.card{
  scroll-snap-align: start;
  background:var(--card); border:1px solid var(--line); border-radius:16px; overflow:hidden;
  box-shadow: 0 6px 18px rgba(0,0,0,.04);
  display:flex; flex-direction:column;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}
.card:hover{ transform: translateY(-2px); border-color:#dfe5ef; box-shadow:0 10px 26px rgba(0,0,0,.07); }

.cover{ position:relative; aspect-ratio: 3 / 4; background:#f3f5f8; overflow:hidden }
.cover img{ width:100%; height:100%; object-fit:cover; display:block }
.pdf-tag{ position:absolute; right:10px; top:10px; background:#111; color:#fff; font-size:12px; font-weight:800; padding:4px 8px; border-radius:999px; }

/* meta/actions */
.meta{ padding: 12px 12px 0 }
.name{ margin:0; font-size:16px; font-weight:800; color:#223046; line-height:1.3; height:2.6em; overflow:hidden }
.sub{ color:#6a7280; font-size:13px; display:flex; align-items:center; gap:8px }
.dot{ opacity:.5 }
.actions{ display:flex; gap:8px; padding: 10px 12px 12px }
.btn{ border:1px solid #e6e8ee; background:#fff; color:#1a1b23; font-weight:800; cursor:pointer; padding:10px 12px; border-radius:10px; flex:1 1 auto; text-align:center }
.btn.primary{ background:#111; color:#fff; border-color:#111 }
.btn.primary:hover{ filter: brightness(0.95) }

/* nav arrows (desktop/tablet: center vertically) */
.nav{
  position:absolute; top:50%; transform: translateY(-50%);
  width:clamp(36px, 3.5vw, 44px); height:clamp(36px, 3.5vw, 44px);
  border-radius:999px; border:1px solid #e6e8ee;
  background:rgba(255,255,255,.86);
  backdrop-filter: blur(6px);
  color:#111; display:grid; place-items:center; cursor:pointer;
  box-shadow:0 10px 24px rgba(0,0,0,.15);
  z-index:3; opacity:.98; transition: transform .16s ease, box-shadow .16s ease, background .16s, color .16s, border-color .16s;
}
.nav:hover{ transform: translateY(-50%) scale(1.04); box-shadow:0 14px 30px rgba(0,0,0,.18) }
.nav:active{ transform: translateY(-50%) scale(.98) }
.nav.prev{ left:8px } .nav.next{ right:8px }
.nav:hover{ background:#111; color:#fff; border-color:#111 }
.nav:disabled{ opacity:.35; cursor:not-allowed; box-shadow:none; }

/* show on hover for desktop */
@media (hover: hover){
  .nav{ opacity:0; pointer-events:none }
  .carousel:hover .nav, .nav:focus-visible{ opacity:1; pointer-events:auto }
}

/* progress */
.progress{ height:6px; background:#f1f4f9; border-radius:999px; margin:12px 6px 0 }
.progress .bar{
  height:100%; width:0%; background:var(--accent); border-radius:999px;
  box-shadow: 0 2px 10px rgba(242,178,0,.35);
  transition: width .22s ease;
}

/* ======= Small-screen tweaks ======= */
@media (max-width: 680px){
  /* give room for arrows at bottom */
  .carousel{ padding-bottom: 56px; }

  /* lock arrows to bottom-center (stable position) */
  .nav{
    top:auto; bottom:10px; transform:none;
    width:42px; height:42px;
  }
  .nav.prev{ left: calc(50% - 56px); }
  .nav.next{ left: calc(50% + 14px); right:auto; }
  .nav:hover{ transform: none; } /* no hover scale on touch */
}

/* make cards shorter & narrower on very small screens */
@media (max-width: 480px){
  .rail{ grid-auto-columns: 74%; gap:14px; }
  .card{ border-radius:14px; }
  .cover{ aspect-ratio: 2 / 3; }            /* shorter cover */
  .meta{ padding:10px 10px 0 }
  .name{ font-size:14px; height:2.4em }
  .sub{ font-size:12px }
  .actions{ padding:8px 10px 10px }
  .btn{ padding:8px 10px; font-size:13px }
  .pdf-tag{ font-size:11px; padding:3px 7px }
}

/* Modal */
.overlay{
  position:fixed; inset:0; background:rgba(0,0,0,.35);
  display:flex; align-items:center; justify-content:center; padding:16px; z-index:50;
  animation: fade .15s ease-out;
}
.dialog{
  width:min(960px,100%); background:#fff; border-radius:18px; box-shadow:0 30px 70px rgba(0,0,0,.25);
  border:1px solid var(--line);
  max-height: min(70svh, 760px);
  overflow:auto; -webkit-overflow-scrolling: touch; scrollbar-gutter: stable both-edges;
  padding:16px;
}
@supports not (height: 1svh){ .dialog{ max-height:min(88vh,760px) } }
.dhead{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px }
.dh{ margin:0; font-size:22px; font-weight:800 }
.ds{ color:#6a7280; font-size:13px }
.x{ border:0; background:transparent; font-size:28px; cursor:pointer; line-height:1 }
.viewer{ height: clamp(160px, 90svh, 800px); border:1px solid var(--line); border-radius:12px; overflow:hidden; background:#f7f8fb; }
.viewer iframe{ width:100%; height:100% }
.dactions{ display:flex; gap:10px; justify-content:flex-end; margin-top:10px }
@keyframes fade{ from{opacity:0} to{opacity:1} }

/* scroll-in animations */
.books .eyebrow, .books .title{ opacity:0; transform: translateX(-22px); }
.books .eyebrow{ transition: opacity .6s, transform .6s; }
.books .title{ transition: opacity .7s .05s, transform .7s .05s; }
.books.in .eyebrow, .books.in .title{ opacity:1; transform:none; }

.books .rail .card{ opacity:0; transform: translateY(18px); transition: opacity .45s ease, transform .45s ease; }
.books.in .rail .card{ opacity:1; transform:none; }
.books.in .rail .card:nth-child(1){ transition-delay:.10s }
.books.in .rail .card:nth-child(2){ transition-delay:.16s }
.books.in .rail .card:nth-child(3){ transition-delay:.22s }
.books.in .rail .card:nth-child(4){ transition-delay:.28s }
.books.in .rail .card:nth-child(5){ transition-delay:.34s }
.books.in .rail .card:nth-child(6){ transition-delay:.40s }
.books.in .rail .card:nth-child(7){ transition-delay:.46s }
.books.in .rail .card:nth-child(8){ transition-delay:.52s }
.books.in .rail .card:nth-child(9){ transition-delay:.58s }
.books.in .rail .card:nth-child(10){ transition-delay:.64s }

@media (prefers-reduced-motion: reduce){
  .books .eyebrow,.books .title,.books .rail .card{ transition:none !important; transform:none !important; opacity:1 !important; }
}
</style>
