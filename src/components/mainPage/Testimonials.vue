<!-- TestimonialsSection.vue -->
<template>
  <section class="testimonials" ref="root" :class="{ in: inView }">
    <div class="container">
      <span class="eyebrow">MIJOZLAR</span>
      <h2 class="title">Mijozlar fikrlari</h2>

      <ul class="cards">
        <li
          v-for="(t, i) in testimonials"
          :key="t.id"
          class="card"
          :ref="el => setCardRef(el, t.id)"
        >
          <figure class="photo">
            <img :src="t.photo" :alt="t.name" loading="lazy" />
          </figure>

          <div class="headrow">
            <span class="quote-mark">“</span>
            <div class="stars" aria-label="rating">
              <svg v-for="n in 5" :key="n" viewBox="0 0 24 24" width="16" height="16">
                <path
                  d="m12 17.27 6.18 3.73-1.64-7.03L21 9.24l-7.19-.62L12 2 10.19 8.62 3 9.24l4.46 4.73L5.82 21z"
                  fill="#f5b50a"
                />
              </svg>
            </div>
            <span class="badge">Verified</span>
          </div>

          <p class="summary">{{ t.summary }}</p>

          <div class="person">
            <div class="name">{{ t.name }}</div>
            <div class="role">{{ t.role }}</div>
          </div>

         
          <!-- Inline expanding story (not a modal) -->
          <transition
            @before-enter="expBeforeEnter"
            @enter="expEnter"
            @after-enter="expAfterEnter"
            @before-leave="expBeforeLeave"
            @leave="expLeave"
          >
            <div v-show="openId === t.id" class="story">
              <div class="story-inner">
                <p class="big">{{ t.long }}</p>

                <div class="mini">
                  <div class="stat">
                    <span class="label">Oldin</span>
                    <span class="val">{{ t.before }}</span>
                  </div>
                  <div class="bar">
                    <span :style="{width: t.progress + '%'}"></span>
                  </div>
                  <div class="stat">
                    <span class="label">Keyin</span>
                    <span class="val">{{ t.after }}</span>
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <div class="actions">
            <button class="btn primary" @click="toggle(t.id)">
              <span>{{ openId === t.id ? 'Hide story' : 'Read full story' }}</span>
              <svg class="chev" viewBox="0 0 24 24" width="16" height="16" :class="{up: openId===t.id}">
                <path d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

/* Demo data — replace with your own */
const testimonials = [
  {
    id: 1,
    name: 'Ochilov Azim',
    role: 'SAT Student',
    photo:
      'https://images.unsplash.com/photo-1519895609939-d2a6491c1196?q=80&w=800&auto=format&fit=crop',
    summary:
      "This is the space to share a review from one of the business's clients or customers.",
    long:
      'Men Satellite’da o‘qishni boshlaganimdan beri grammatikani tizimli ko‘rishni, xatolar ustidan ishlashni o‘rgandim. Haftalik rejalar, topshiriqlar va murabbiylarning fikr-mulohazalari eng kerakli joylarda yordam berdi.',
    tags: ['Weekly progress', 'Mistake logs', 'Personalized plan'],
    before: '1050',
    after: '1370',
    progress: 72
  },
  {
    id: 2,
    name: 'Ochilov Azim',
    role: 'Parent',
    photo:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    summary:
      "This is the space to share a review from one of the business's clients or customers.",
    long:
      'Trenerlar doimiy aloqa qiladi, bola qaerda qiynalayotganini aniq ko‘rsatadi. Hisobotlar orqali haftadan haftaga o‘sishni kuzatdik.',
    tags: ['Office hours', 'Live & recorded', 'Actionable feedback'],
    before: '990',
    after: '1280',
    progress: 63
  },
  {
    id: 3,
    name: 'Ochilov Azim',
    role: 'Scholarship Winner',
    photo:
      'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=800&auto=format&fit=crop',
    summary:
      "This is the space to share a review from one of the business's clients or customers.",
    long:
      'Kursda eng muhim mavzularga diqqat qaratiladi. Qisqa, lekin samarali mashqlar natija berdi — vaqtni to‘g‘ri boshqarishni o‘rgandim.',
    tags: ['Smart drills', 'Exam strategies', 'Fast-track'],
    before: '1120',
    after: '1410',
    progress: 68
  }
]

/* Which card is open */
const openId = ref(null)

/* Keep refs to each card so we can scroll into view when opened */
const cardEls = new Map()
function setCardRef(el, id) {
  if (el) cardEls.set(id, el)
}
function toggle(id) {
  openId.value = openId.value === id ? null : id
  if (openId.value === id) {
    nextTick(() => {
      cardEls.get(id)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }
}

/* Expand / collapse animation (auto height) */
function expBeforeEnter(el) {
  el.style.height = '0'
  el.style.opacity = '0'
}
function expEnter(el) {
  const h = el.scrollHeight
  el.style.transition = 'height .28s ease, opacity .28s ease'
  // next frame
  requestAnimationFrame(() => {
    el.style.height = h + 'px'
    el.style.opacity = '1'
  })
}
function expAfterEnter(el) {
  el.style.height = 'auto'
  el.style.transition = ''
}
function expBeforeLeave(el) {
  el.style.height = el.scrollHeight + 'px'
  el.style.opacity = '1'
}
function expLeave(el) {
  el.style.transition = 'height .26s ease, opacity .26s ease'
  // next frame
  requestAnimationFrame(() => {
    el.style.height = '0'
    el.style.opacity = '0'
  })
}

/* Scroll-in section animation */
const root = ref(null)
const inView = ref(false)
let io
onMounted(() => {
  io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      inView.value = true
      io.unobserve(e.target)
    }
  }, { threshold: 0.18 })
  if (root.value) io.observe(root.value)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

.testimonials{
  --ink:#111827; --muted:#5b6473; --line:#e7ecf4; --card:#fff;
  --accent:#f2b200; --ok:#e8f6ff;
  font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;
  color:var(--ink); background:#fff; padding:48px 0 80px;
}
.container{ max-width:1200px; margin:0 auto; padding:0 16px; }
.eyebrow{ display:inline-block; background:var(--accent); color:#111; font-weight:800; font-size:12px; letter-spacing:.14em; padding:8px 14px; border-radius:10px }
.title{ margin:14px 0 24px; font-weight:800; font-size: clamp(28px, 5vw, 44px) }

/* grid */
.cards{
  list-style:none; margin:0; padding:0;
  display:grid; gap:22px;
  grid-template-columns: repeat(3, minmax(0,1fr));
}
@media (max-width: 1024px){ .cards{ grid-template-columns: repeat(2, minmax(0,1fr)); } }
@media (max-width: 640px){ .cards{ grid-template-columns: 1fr; } }

.card{
  border:1px solid var(--line); border-radius:18px; background:var(--card);
  box-shadow:0 6px 18px rgba(0,0,0,.04); padding:18px 18px 16px;
  display:flex; flex-direction:column; gap:14px;
}

/* photo block */
.photo{ margin:0; border-radius:14px; overflow:hidden; border:1px solid var(--line); background:#f7f8fb }
.photo img{ width:100%; height:240px; object-fit:cover; display:block }
@media (max-width: 640px){ .photo img{ height:200px } }

/* rating row */
.headrow{ display:flex; align-items:center; gap:10px; border-top:1px solid var(--line); padding-top:14px }
.quote-mark{ font-size:26px; font-weight:800; color:#c6cbd7; margin-right:2px }
.stars{ display:flex; gap:2px }
.badge{
  margin-left:auto; font-weight:800; font-size:12px; color:#0f172a;
  background:#eef6ff; border:1px solid #cfe6ff; padding:4px 10px; border-radius:999px;
}

.summary{ color:#2b3344; line-height:1.6; margin:0 }

.person{ display:flex; align-items:center; justify-content:space-between; }
.name{ font-weight:800; font-size:16px }
.role{ color:var(--muted); font-size:12px }

.actions{ display:flex; gap:10px }
.btn{
  border:1px solid #e6e8ee; background:#fff; color:#0f172a; font-weight:800;
  padding:10px 14px; border-radius:12px; cursor:pointer; display:inline-flex; align-items:center; gap:8px;
}
.btn.primary{ background:#111; color:#fff; border-color:#111 }
.btn .chev{ transition: transform .2s ease }
.btn .chev.up{ transform: rotate(180deg) }

/* expanded story */
.story{
  overflow:hidden; border:1px dashed var(--line); border-radius:14px; background:#fafbfd; margin-top:8px;
}
.story-inner{ padding:14px }
.big{ margin:0 0 10px; color:#334052 }
.chips{ display:flex; gap:8px; flex-wrap:wrap; margin:8px 0 12px }
.chip{
  background:#fff; border:1px solid #e7ecf4; color:#1a2436; font-weight:700; font-size:12px;
  padding:6px 10px; border-radius:999px;
}
.mini{ display:grid; grid-template-columns: 1fr auto 1fr; align-items:center; gap:10px }
.stat{ display:flex; flex-direction:column; }
.label{ color:#6a7280; font-size:12px }
.val{ font-weight:800 }
.bar{ height:8px; background:#eef2f7; border-radius:999px; width:100%; position:relative; overflow:hidden }
.bar > span{ position:absolute; left:0; top:0; bottom:0; width:0; background:var(--accent); border-radius:999px; box-shadow:0 2px 10px rgba(242,178,0,.35) }
.story[style] .bar > span{ width:inherit } /* just to satisfy some editors */

/* ===== scroll-in animations ===== */
.testimonials .eyebrow, .testimonials .title{
  opacity:0; transform: translateX(-22px);
}
.testimonials .eyebrow{ transition: opacity .6s, transform .6s; }
.testimonials .title{ transition: opacity .7s .05s, transform .7s .05s; }
.testimonials.in .eyebrow, .testimonials.in .title{ opacity:1; transform:none; }

/* stagger cards */
.card{ opacity:0; transform: translateY(18px); transition: opacity .45s ease, transform .45s ease }
.testimonials.in .card{ opacity:1; transform:none }
.testimonials.in .card:nth-child(1){ transition-delay:.10s }
.testimonials.in .card:nth-child(2){ transition-delay:.18s }
.testimonials.in .card:nth-child(3){ transition-delay:.26s }

/* accessible reduced motion */
@media (prefers-reduced-motion: reduce){
  .testimonials .eyebrow,.testimonials .title,.card{ transition:none !important; transform:none !important; opacity:1 !important }
}
</style>
