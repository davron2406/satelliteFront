<!-- ServicesSection.vue -->
<template>
    <section class="svc" ref="root">
      <div class="container">
        <!-- Eyebrow + Title (come from left) -->
        <div class="intro">
          <span class="eyebrow" :class="{ show: headingIn }">{{ $t('services') }}</span>
          <h2 class="title" :class="{ show: headingIn }">{{ $t('servicesSubtitle') }}</h2>
        </div>
  
        <!-- List (slide up from down) -->
        <ul class="list" :class="{ in: listIn }">
          <li
            v-for="(s, idx) in services"
            :key="s.id"
            class="row"
            :style="{ '--i': idx }"
          >
            <div class="no">{{ (idx + 1).toString().padStart(2, '0') }}</div>
            <div class="name">{{ s.name }}</div>
            <div class="desc">{{ s.desc }}</div>
          </li>
        </ul>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  
  const root = ref(null);
  const headingIn = ref(false);
  const listIn = ref(false);
  
  const services = [
    {
      id: 1,
      name: 'SAT ENGLISH',
      desc:
        'This is the space to describe the service and explain how customers or clients can benefit from it. It’s an opportunity to add a short description that includes relevant details, like pricing, duration, location and how to book the service.',
    },
    {
      id: 2,
      name: 'SAT MATH',
      desc:
        'This is the space to describe the service and explain how customers or clients can benefit from it. It’s an opportunity to add a short description that includes relevant details, like pricing, duration, location and how to book the service.',
    },
    {
      id: 3,
      name: 'PRACTICE TESTS',
      desc:
        'This is the space to describe the service and explain how customers or clients can benefit from it. It’s an opportunity to add a short description that includes relevant details, like pricing, duration, location and how to book the service.',
    },
    {
      id: 4,
      name: 'Name of Service',
      desc:
        'This is the space to describe the service and explain how customers or clients can benefit from it. It’s an opportunity to add a short description that includes relevant details, like pricing, duration, location and how to book the service.',
    },
    {
      id: 5,
      name: 'Name of Service',
      desc:
        'This is the space to describe the service and explain how customers or clients can benefit from it. It’s an opportunity to add a short description that includes relevant details, like pricing, duration, location and how to book the service.',
    },
  ];
  
  let io;
  onMounted(() => {
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            headingIn.value = true;              // slide in “Services” + title
            setTimeout(() => (listIn.value = true), 150); // then list rises
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    if (root.value) io.observe(root.value);
  });
  onBeforeUnmount(() => io && io.disconnect());
  </script>
  
  <style scoped>
  .svc{
    --ink:#1f2333;
    --muted:#5b616e;
    --line:#d8dde4;
    --accent:#f2b200;
    --max:1100px;
  }
  
  .svc{
    background:#fff;
    color:var(--ink);
    padding: 56px 16px 72px;
    width: 100%;
  }
  
  .container{ max-width: var(--max); margin: 0 auto; }
  
  /* Intro (from left) */
  .intro{ margin-bottom: 10px; }
  .eyebrow{
    display:inline-block;
    background:var(--accent);
    color:#111;
    font-weight:800;
    font-size:12px;
    letter-spacing:.14em;
    padding:8px 14px;
    border-radius:10px;
    text-transform: uppercase;
    opacity:0; transform: translateX(-26px);
    transition: opacity .6s ease, transform .6s ease;
  }
  .title{
    margin: 12px 0 18px;
    font-size: clamp(26px, 3.6vw, 34px);
    line-height: 1.2;
    font-weight: 800;
    opacity:0; transform: translateX(-36px);
    transition: transform .8s cubic-bezier(.21,.7,.18,1), opacity .8s;
  }
  .eyebrow.show,.title.show{ opacity:1; transform:none; }
  
  /* List (up from down) */
  .list{
    list-style:none; padding:0; margin:8px 0 0;
    border-top:1px solid var(--line);
  }
  .row{
    display:flex; align-items:flex-start; gap:28px;
    padding:22px 0; border-bottom:1px solid var(--line);
    opacity:0; transform: translateY(28px);
    transition: transform .6s cubic-bezier(.22,.65,.2,1), opacity .6s;
    transition-delay: calc(var(--i) * 110ms + 120ms);
  }
  .list.in .row{ opacity:1; transform:none; }
  
  .no{
    width:58px; flex:0 0 58px;
    font-weight:800; color:var(--accent);
    font-size:26px; line-height:1.1;
  }
  
  /* 3 columns (flex only) */
  .name{ min-width:180px; font-weight:700; letter-spacing:.2px; color:#2b3445; }
  .desc{ color:var(--muted); max-width:600px; }
  
  /* Nice polish */
  .row:hover{
    background: linear-gradient(0deg, #fff, #fff) padding-box,
                linear-gradient(90deg, #fff 0, #ffe59a 25%, #ffd54d 50%, #fff 100%) border-box;
    border-bottom-color: transparent; border-top-color: transparent;
    box-shadow: 0 10px 18px rgba(0,0,0,.04) inset;
  }
  .row:hover .name{ color:#0f172a }
  .row:hover .no{ transform: translateX(2px); }
  
  /* Responsive */
  @media (max-width: 820px){
    .row{ flex-wrap: wrap; gap: 10px 18px; }
    .no{ width:44px; flex-basis:44px; font-size:22px }
    .name{ min-width:auto; width:45%; }
    .desc{ width:100%; }
  }
  
  /* Respect reduced motion */
  @media (prefers-reduced-motion: reduce){
    .eyebrow,.title,.row{ transition:none !important; transform:none !important; opacity:1 !important; }
  }
  </style>
  