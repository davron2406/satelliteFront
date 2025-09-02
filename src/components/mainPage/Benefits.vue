<!-- BenefitsRowRight.vue -->
<template>
  <section class="benefits" ref="root">
    <div class="wrap">
      <!-- Header on top, aligned to the right -->
      <div class="head head--right">
        <div class="eyebrow" :class="{ show: headIn }">BENEFITS</div>
        <h2 class="title" :class="{ show: headIn }">Why choose us</h2>
      </div>

      <!-- Cards (horizontal row / responsive grid) -->
      <ul class="grid" :class="{ in: listIn }">
        <li
          v-for="(b,i) in items"
          :key="i"
          class="card"
          :class="{ open: open === i }"
          :style="{ '--i': i }"
        >
          <div class="toprow">
            <div class="icon" v-html="b.icon"></div>
            <span v-if="b.badge" class="badge">{{ b.badge }}</span>
          </div>

          <h3 class="heading">{{ b.title }}</h3>
          <p class="summary">{{ b.summary }}</p>

          <div class="chips" v-if="b.tags?.length">
            <span v-for="(t,ti) in b.tags" :key="ti" class="chip">{{ t }}</span>
          </div>

          <!-- Expanded details ABOVE the button -->
          <transition name="reveal">
            <div
              v-show="open === i"
              class="more"
              :id="`benefit-${i}-panel`"
              role="region"
              :aria-labelledby="`benefit-${i}-btn`"
            >
              <p v-for="(p,pi) in b.details" :key="pi" class="para">{{ p }}</p>
              <ul v-if="b.points?.length" class="bullets">
                <li v-for="(pt,ki) in b.points" :key="ki">• {{ pt }}</li>
              </ul>
            </div>
          </transition>

          <button
            class="cta"
            :id="`benefit-${i}-btn`"
            :aria-controls="`benefit-${i}-panel`"
            :aria-expanded="open === i ? 'true' : 'false'"
            @click="toggle(i)"
          >
            <span>{{ open===i ? 'Hide details' : 'Learn more' }}</span>
            <svg class="arrow" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="currentColor" d="M8.6 5.6L10 4l8 8-8 8-1.4-1.4L14.2 12z"/>
            </svg>
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => ([
      {
        title: 'Proven Results',
        summary: 'Boost your SAT score with a data-driven study plan and expert guidance.',
        tags: ['+200 avg. score gain', 'Personalized plan', 'Weekly progress'],
        badge: 'Top pick',
        details: [
          'Diagnostics + targeted drills mean you work on the right things at the right time.',
          'Weekly goals & clear reports keep you moving without burnout.'
        ],
        points: ['Adaptive sets', 'Weekly reports', 'Skill breakdown'],
        icon: `
          <svg viewBox="0 0 48 48" width="48" height="48">
            <rect x="0" y="0" width="48" height="48" rx="12" fill="#FFF3C7" stroke="#FFE29A"/>
            <path d="M24 10l3.1 6.3 7 .9-5 4.8 1.2 6.8L24 24.9l-6.3 3.9 1.2-6.8-5-4.8 7-.9L24 10z" fill="#111"/>
          </svg>`
      },
      {
        title: 'Expert Instructors',
        summary: 'Learn from instructors who’ve been there—top scorers & experienced mentors.',
        tags: ['Live & recorded', 'Office hours', 'Actionable feedback'],
        badge: 'Trusted',
        details: [
          'Focused lessons + live Q&A so you always know what to practice next.',
          'Office hours give you quick, personal guidance when you’re stuck.'
        ],
        points: ['Quick feedback loops', 'Clear milestones'],
        icon: `
          <svg viewBox="0 0 48 48" width="48" height="48">
            <rect x="0" y="0" width="48" height="48" rx="12" fill="#FFF3C7" stroke="#FFE29A"/>
            <path d="M14 16h20v12H14z" fill="#111"/><path d="M12 32h24v2H12z" fill="#111"/>
          </svg>`
      },
      {
        title: 'Efficient Learning',
        summary: 'Master high-yield topics first with focused practice that sticks.',
        tags: ['Smart drills', 'Mistake logs', 'Exam strategies'],
        badge: 'Fast-track',
        details: [
          'We prioritize the fastest score movers—no busy work.',
          'Mistake logs help you turn errors into reliable habits.'
        ],
        points: ['Time-per-question pacing', 'Retake strategy', 'Checklists'],
        icon: `
          <svg viewBox="0 0 48 48" width="48" height="48">
            <rect x="0" y="0" width="48" height="48" rx="12" fill="#FFF3C7" stroke="#FFE29A"/>
            <path d="M12 34h24v2H12zm0-8h24v2H12zm0-8h24v2H12z" fill="#111"/>
          </svg>`
      }
    ])
  }
})

/* one-open accordion behavior */
const open = ref(-1)
function toggle(i){ open.value = open.value === i ? -1 : i }

/* scroll-in animations (header + staggered cards) */
const root = ref(null)
const headIn = ref(false)
const listIn = ref(false)
let io
onMounted(() => {
  io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      headIn.value = true
      setTimeout(() => (listIn.value = true), 120)
      io.unobserve(entry.target)
    }
  }, { threshold: 0.18 })
  if (root.value) io.observe(root.value)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@600;700;800&display=swap');

.benefits{
  --ink:#111319; --muted:#576077; --line:#e9eef7; --accent:#f2b200;
  --pill:#e9f0ff; --pillText:#193b8c; --shadow: 0 20px 60px rgba(2,12,27,.06);
  background:#fff; padding: 48px 0 56px;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
}
.wrap{ max-width:1200px; margin:0 auto; padding:0 20px; display: flex; flex-direction: column; }

/* Header on top, aligned to right, with reveal */
.head{ margin-bottom:18px }
.head--right{
  width: 100%;
  text-align:center;
  display:flex; flex-direction:column; align-items:center; gap:10px; justify-content: center;
}
@media (max-width: 680px){
  .head--right{ text-align:center; align-items:center; justify-content: center; }
}
.eyebrow{
  display:inline-block; background:var(--accent); color:#111; font-weight:800;
  letter-spacing:.14em; font-size:12px; padding:10px 16px; border-radius:12px;
  opacity:0; transform: translateX(-28px); transition: opacity .6s, transform .6s;
}
.title{
  margin:10px 0 0; font-weight:800; font-size: clamp(32px, 6vw, 56px); line-height:1.1; color:#0b1220;
  opacity:0; transform: translateX(-30px); transition: opacity .7s .05s, transform .7s .05s;
}
.eyebrow.show, .title.show{ opacity:1; transform:none }

/* Cards row + staggered reveal */
.grid{
  list-style:none; padding:0; margin:22px 0 0;
  display:grid; gap:22px; grid-template-columns: repeat(3, minmax(0,1fr));
}
@media (max-width: 1024px){ .grid{ grid-template-columns: repeat(2,1fr) } }
@media (max-width: 680px){ .grid{ grid-template-columns: 1fr } }

.card{
  background:#fff; border:1px solid var(--line); border-radius:28px; box-shadow: var(--shadow);
  padding: 26px 26px 18px; position:relative; transition: box-shadow .2s, transform .2s;
  opacity:0; transform: translateY(24px);
  transition-delay: calc(var(--i) * 80ms + 100ms);
}
.grid.in .card{ opacity:1; transform:none }
.card:hover{ transform: translateY(-2px); box-shadow: 0 30px 80px rgba(2,12,27,.10) }
.card.open{ box-shadow: 0 32px 90px rgba(2,12,27,.12) }

/* Card content */
.toprow{ display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; }
.icon{ width:64px; height:64px; display:grid; place-items:center; border-radius:16px; overflow:hidden }
.badge{ background:var(--pill); color:var(--pillText); font-weight:800; font-size:13px; padding:8px 14px; border-radius:999px }

.heading{ margin: 8px 0 4px; font-size: clamp(18px, 2.2vw, 28px); font-weight:800; color:#223049 }
.summary{ margin: 0 0 12px; color: var(--muted); font-size:17px; line-height:1.55 }

.chips{ display:flex; flex-wrap:wrap; gap:10px; margin-bottom:10px }
.chip{ background:#f5f7fb; border:1px solid #e8edf6; color:#142034; font-weight:800; font-size:13px; padding:8px 12px; border-radius:999px }

/* Expanded details ABOVE the button */
.more{ margin-top:6px; padding-top:12px; border-top:1px dashed #eef2f7 }
.para{ margin:8px 0; color:#2b3344 }
.bullets{ margin:10px 0 0 16px; padding:0; color:#223049 }
.bullets li{ margin:4px 0 }

/* CTA */
.cta{
  display:inline-flex; align-items:center; gap:10px;
  background:#0b0b0c; color:#fff; font-weight:800; font-size:16px;
  padding:12px 18px; border-radius:16px; border:0; cursor:pointer; margin-top:12px;
}
.cta .arrow{ transition: transform .2s ease }
.card.open .cta .arrow{ transform: translateX(2px) rotate(90deg) }

/* Height animation for details */
.reveal-enter-from,.reveal-leave-to{ max-height:0; opacity:0 }
.reveal-enter-to,.reveal-leave-from{ max-height:480px; opacity:1 }
.reveal-enter-active,.reveal-leave-active{ transition:max-height .28s ease, opacity .18s ease; overflow:hidden }

/* Reduced motion */
@media (prefers-reduced-motion: reduce){
  .eyebrow,.title,.card{ transition:none !important; transform:none !important; opacity:1 !important; }
}
</style>
