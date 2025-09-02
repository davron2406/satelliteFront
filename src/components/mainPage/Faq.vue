<!-- FaqSection.vue -->
<template>
    <section class="faq" ref="root">
      <div class="wrap">
        <!-- LEFT -->
        <div class="left">
          <span class="eyebrow" :class="{ show: headingIn }">FAQ</span>
          <h2 class="title" :class="{ show: headingIn }">
            {{ $t('faq') }}
          </h2>
  
          <div class="actions">
            <button class="btn" @click="expandAll(true)">{{ $t('expand') }}</button>
            <button class="btn ghost" @click="expandAll(false)">{{ $t('collapse') }}</button>
          </div>
        </div>
  
        <!-- RIGHT -->
        <div class="right">
          <div class="search">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-.7.7l.3.3v.8L20 21l1-1-5.5-6Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.51 4.51 0 0 1 9.5 14Z" fill="currentColor"/>
            </svg>
            <input v-model="query" placeholder="Search questions…" />
          </div>
  
          <ul class="accordion" :class="{ in: listIn }">
            <li
              v-for="(item, i) in filtered"
              :key="item.id"
              class="acc-item"
              :class="{ open: isOpen(item.id) }"
              :style="{ '--i': i }"
            >
              <button
                class="head"
                :aria-expanded="isOpen(item.id) ? 'true' : 'false'"
                @click="toggle(item.id)"
              >
                <span class="q">{{ item.q }}</span>
                <span class="icons">
                  <span class="dot" v-if="item.new">NEW</span>
                  <svg class="chev" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path d="m8 10 4 4 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </button>
  
              <div
                class="panel"
                :style="panelStyle(item.id)"
                :ref="el => registerPanel(el, item.id)"
              >
                <div class="body">
                  <p>{{ item.a }}</p>
                  <ul class="bullets" v-if="item.points?.length">
                    <li v-for="p in item.points" :key="p">{{ p }}</li>
                  </ul>
                  <button class="mini" @click="contact(item.q)">
                    Still need help? Contact us
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, reactive, computed, nextTick, onMounted, onBeforeUnmount } from 'vue';
  
  const root = ref(null);
  const headingIn = ref(false);
  const listIn = ref(false);
  const query = ref('');
  
  const items = reactive([
    {
      id: 1,
      q: 'What is the FAQ section “Questions and Answers” about?',
      a: 'It highlights the most common questions and gives short, clear answers so visitors quickly find what they need.',
      new: true,
      points: ['Short answers', 'Always accessible', 'Continuously updated']
    },
    {
      id: 2,
      q: 'Can I expand multiple questions at the same time?',
      a: 'Yes. You can open any combination of questions or use “Expand all / Collapse all.”'
    },
    {
      id: 3,
      q: 'How can I contact support if my question is not listed?',
      a: 'Use the “Contact us” link at the end of any answer or reach out via email and Telegram.',
      points: ['Avg. response < 24h', 'Priority for enrolled students']
    }
  ]);
  
  const openIds = reactive(new Set());
  const panelEls = new Map();
  const heights = reactive({}); // id -> px height
  
  const filtered = computed(() => {
    const q = query.value.trim().toLowerCase();
    if (!q) return items;
    return items.filter(it => (it.q + ' ' + it.a).toLowerCase().includes(q));
  });
  
  function registerPanel(el, id) {
    if (el) panelEls.set(id, el);
    else panelEls.delete(id);
  }
  function isOpen(id) { return openIds.has(id); }
  
  function setHeight(id) {
    nextTick(() => {
      const el = panelEls.get(id);
      if (el) heights[id] = el.scrollHeight;
    });
  }
  function toggle(id) {
    if (openIds.has(id)) openIds.delete(id);
    else openIds.add(id);
    setHeight(id);
  }
  function expandAll(state) {
    if (state) items.forEach(it => openIds.add(it.id));
    else openIds.clear();
    items.forEach(it => setHeight(it.id));
  }
  function panelStyle(id) {
    return { maxHeight: isOpen(id) ? (heights[id] || 400) + 'px' : '0px' };
  }
  function contact(topic) {
    alert(`We’ll help you with: ${topic}`);
  }
  
  /* Scroll reveal */
  let io;
  onMounted(() => {
    io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          headingIn.value = true;
          setTimeout(() => (listIn.value = true), 160);
          io.unobserve(e.target);
        }
      },
      { threshold: 0.2 }
    );
    if (root.value) io.observe(root.value);
  
    const onResize = () => items.forEach(it => setHeight(it.id));
    window.addEventListener('resize', onResize);
  });
  onBeforeUnmount(() => io?.disconnect());
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
  
  .faq{
    --ink:#1A1B23;
    --muted:#556072;
    --line:#dfe6ee;
    --accent:#f2b200;
    --max:1200px;
  }
  
  *{ box-sizing:border-box }
  .faq{
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
    color:var(--ink);
    background:#fff;
    padding:44px 0 76px;
  }
  .wrap{
    max-width:var(--max);
    margin:0 auto;
    padding:0 16px;
    display:flex; gap:40px; align-items:flex-start; /* flex-only */
  }
  .left{ flex:0 0 38%; }
  .left{
    width: 100%;
  }
  .right{ flex:1; min-width:320px }
  
  
  /* Eyebrow + Title */
  .eyebrow{
    display:inline-block;
    background:var(--accent);
    color:#111;
    font-weight:800; font-size:12px; letter-spacing:.14em;
    padding:8px 14px; border-radius:10px;
    opacity:0; transform: translateX(-26px);
    transition: opacity .6s ease, transform .6s ease;
  }
  .title{
    margin:14px 0 18px;
    font-weight:800; font-size: clamp(28px, 5vw, 48px); line-height:1.12;
    opacity:0; transform: translateX(-30px);
    transition: opacity .7s ease .05s, transform .7s ease .05s;
  }
  .show{ opacity:1 !important; transform:none !important; }
  
  .actions{ display:flex; gap:10px; margin-top:8px }
  .btn{
    border:0; background:#111; color:#fff; font-weight:800;
    padding:10px 14px; border-radius:10px; cursor:pointer;
  }
  .btn.ghost{ background:#f6f7fb; color:#1a1b23; border:1px solid #e7ebf2 }
  
  /* Search */
  .search{
    display:flex; align-items:center; gap:8px;
    border:1px solid var(--line); border-radius:12px; padding:10px 12px;
    margin-bottom:14px; color:#6b7483;
  }
  .search input{
    border:0; outline:0; flex:1; background:transparent; font-weight:600;
  }
  
  /* Accordion */
  .accordion{ list-style:none; margin:0; padding:0; }
  .acc-item{
    border-bottom:1px solid var(--line);
    opacity:0; transform: translateY(26px);
    transition: transform .6s cubic-bezier(.22,.65,.2,1), opacity .6s;
    transition-delay: calc(var(--i) * 110ms + 120ms);
  }
  .accordion.in .acc-item{ opacity:1; transform:none; }
  
  .head{
    width:100%; background:#fff; border:0;
    padding:14px 4px; text-align:left; cursor:pointer;
    display:flex; align-items:center; justify-content:space-between; gap:12px;
    font-weight:700; color:#223044;
  }
  .head:hover{ color:#0f172a }
  .icons{ display:flex; align-items:center; gap:10px }
  .chev{ transition: transform .25s ease }
  .acc-item.open .chev{ transform: rotate(180deg) }
  .dot{
    font-size:11px; font-weight:800; color:#0f172a;
    background:#eef3ff; border:1px solid #dbe6ff;
    padding:4px 8px; border-radius:999px;
  }
  
  /* Animated panel */
  .panel{
    max-height:0; overflow:hidden;
    transition: max-height .4s ease;
  }
  .body{
    padding: 8px 4px 16px;
    color:var(--muted);
  }
  .bullets{ margin:8px 0 0; padding-left:18px; }
  .bullets li{ margin:4px 0 }
  
  /* Responsive */
  @media (max-width: 900px){
    .wrap{ flex-direction:column; }
    .left{ flex: none; }
  }
  
  /* Reduced motion */
  @media (prefers-reduced-motion: reduce){
    .eyebrow,.title,.acc-item,.chev,.panel{ transition:none !important; transform:none !important; opacity:1 !important; }
  }
  </style>
  