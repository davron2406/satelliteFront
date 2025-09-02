<!-- SiteFooter.vue -->
<template>
    <footer class="footer footer--edge" ref="root" role="contentinfo">
      <div class="inner">
        <!-- Brand -->
        <div class="tile brand" :class="{ show: inView }" style="--i:0">
          <div class="avatar" aria-hidden="true"><img src="../../assets/Ds.jpg" alt=""></div>
          <div class="brand-text">
            <div class="brand-name">Davron Saydullayev</div>
            <div class="brand-tag">SAT materials • Courses • Practice tests</div>
          </div>
        </div>
  
        <!-- Columns -->
        <div class="cols">
          <section class="tile col" :class="{ show: inView }" style="--i:1" aria-labelledby="fmenu">
            <h3 id="fmenu" class="h">{{ $t('menu') }}</h3>
            <ul class="links">
              <li><a href="#home">{{ $t('nav1') }}</a></li>
              <li><a href="#practice">{{ $t('nav2') }}</a></li>
              <li><a href="#books">{{ $t('nav3') }}</a></li>
              <li><a href="#courses">{{ $t('nav4') }}</a></li>
              <li><a href="#contact">{{ $t('nav5') }}</a></li>
            </ul>
          </section>
  
          <section class="tile col" :class="{ show: inView }" style="--i:2" aria-labelledby="fcontact">
            <h3 id="fcontact" class="h">{{ $t('contact') }}</h3>
            <ul class="links">
              <li class="row">
                <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M6.6 10.8a15.9 15.9 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.36 2.3.57 3.6.62a1 1 0 0 1 1 1v3.3a1 1 0 0 1-1 1C10.6 21.9 2.1 13.4 2.1 3.9a1 1 0 0 1 1-1H6.4a1 1 0 0 1 1 1c.05 1.3.26 2.5.62 3.6a1 1 0 0 1-.25 1L6.6 10.8Z"/></svg>
                <a href="tel:+998944288899">+998 94 428 88 99</a>
              </li>
              <li class="row">
                <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M4 6h16a1 1 0 0 1 .9.6L12 13 3.1 6.6A1 1 0 0 1 4 6Zm16 12H4a1 1 0 0 1-1-1V8.4l8.6 6.4a1 1 0 0 0 1.2 0L21 8.4V17a1 1 0 0 1-1 1Z"/></svg>
                <!-- <a href="mailto:davronsaydullayev2406@gmail.com">davronsaydullayev2406@gmail.com</a> -->
                <!-- <button class="copy" @click="copy('davronsaydullayev2406@gmail.com')">Copy</button> -->
              </li>
            </ul>
          </section>
  
     <section class="tile col" :class="{ show: inView }" style="--i:3" aria-labelledby="faddr">
            <h3 id="faddr" class="h">{{ $t('address') }}</h3>
            <ul class="links">
              <li class="row">
                <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7Zm0 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>
                <span>Jizzakh region</span>
              </li>
              <li class="row">
                <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M19 8.5 12 3 5 8.5V20h6v-6h2v6h6V8.5Z"/></svg>
                <span>Zarbdor city</span>
              </li>
            </ul>
          </section>
  
          <section class="tile col" :class="{ show: inView }" style="--i:4" aria-labelledby="fsocial">
            <h3 id="fsocial" class="h">{{ $t('socialMedia') }}</h3>
            <ul class="links">
              <li class="row">
                <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M9.3 13.8 8.9 18l3.4-2.4 4.8 3.5 3-12.1-14 5.5 3.1 1.3 9.2-5.7-9.1 6.7Z"/></svg>
                <a href="https://t.me/" target="_blank" rel="noopener">Telegram</a>
              </li>
              <li class="row">
                <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 6.5A3.5 3.5 0 1 0 15.5 12 3.5 3.5 0 0 0 12 8.5Zm6.5-.8a1.2 1.2 0 1 0 1.2 1.2 1.2 1.2 0 0 0-1.2-1.2Z"/></svg>
                <a href="https://instagram.com/" target="_blank" rel="noopener">Instagram</a>
              </li>
            </ul>
          </section>
        </div>
  
        <hr class="rule" />
  
        <div class="sub">
          <a href="#" class="policy">Privacy Policy</a>
          <span class="copyline">© 2024 By Davron Saydullayev</span>
        </div>
      </div>
  
      <!-- Toast -->
      <div class="toast" v-show="toast" role="status" aria-live="polite">{{ toast }}</div>
  
      <!-- Back to top -->
      <button v-show="showTop" class="to-top" @click="toTop" aria-label="Back to top">
        ↑
      </button>
    </footer>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  
  const root = ref(null);
  const inView = ref(false);
  const toast = ref('');
  const showTop = ref(false);
  
  function copy(text) {
    navigator.clipboard?.writeText(text).then(() => {
      toast.value = 'Email copied';
      setTimeout(() => (toast.value = ''), 1600);
    });
  }
  function toTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  
  /* reveal on view + show "to top" on scroll */
  let io;
  function onScroll() { showTop.value = window.scrollY > 600; }
  
  onMounted(() => {
    io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { inView.value = true; io.unobserve(e.target); } },
      { threshold: 0.2 }
    );
    if (root.value) io.observe(root.value);
    window.addEventListener('scroll', onScroll, { passive: true });
  });
  onBeforeUnmount(() => {
    io?.disconnect();
    window.removeEventListener('scroll', onScroll);
  });
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
  
  :root{
    --bg:#383D44;         /* footer background */
    --ink:#F3F6FA;        /* main text */
    --muted:#B9C2CF;      /* secondary text */
    --accent:#F2B200;     /* golden accent */
    --line:#4A515A;       /* separators */
    --max:1200px;
  }
  
  /* FULL-BLEED: span entire viewport width */
  .footer--edge{
    width:100%;
  }
  
  .footer{
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
    background:var(--bg);
    color:var(--ink);
    position: relative;
  }
  
  .inner{
    max-width: 100%;
    margin:0 auto;
    padding: 56px 18px 24px;
  }
  
  /* Brand row */
  .brand{
    display:flex; align-items:center; gap:16px;
    margin-bottom: 22px;
  }
  .avatar{
    width:56px; height:56px; border-radius:50%;
    background:#fff; color:#111; font-weight:800;
    display:grid; place-items:center;

    overflow: hidden;           /* clip image to rounded corners */
    background: #f3f4f6; 
  }

  .avatar img{
    width: 100%;
    height: 100%;
    object-fit: cover;          /* fill without distortion (crops if needed) */
    object-position: center;    /* keep center visible */
    display: block;  
  }
  .brand-name{ font-weight:800; font-size:22px }
  .brand-tag{ color:var(--muted); font-size:13px }
  
  /* Columns (flex only) */
  .cols{
    display:flex; flex-wrap:wrap; gap:28px 46px;
    margin-top: 18px;
  }
  .col{ min-width:220px; flex:1 1 220px; }
  
  .h{
    margin: 10px 0 12px;
    font-size: 20px; font-weight: 800; letter-spacing:.02em;
  }
  .links{ list-style:none; margin:0; padding:0; }
  .links li{ margin:10px 0; }
  .row{ display:flex; align-items:center; gap:10px; }
  a{ color:var(--ink); text-decoration:none; }
  a:hover{ text-decoration:underline; }
  .copy{
    margin-left:8px; background:#2d3239; color:#fff; border:1px solid #4b525c;
    font-size:12px; font-weight:700; padding:4px 8px; border-radius:8px; cursor:pointer;
  }
  .copy:hover{ filter:brightness(1.08) }
  
  /* Divider + bottom */
  .rule{
    border:0; height:1px; background:var(--line);
    margin: 26px 0 14px;
  }
  .sub{
    display:flex; align-items:center; justify-content:space-between; gap:12px;
    color:var(--muted); font-size:14px; padding-bottom: 16px;
  }
  .policy{ color:var(--ink) }
  .copyline{ color:var(--muted) }
  
  /* Reveal (stagger) */
  .tile{
    opacity:0; transform: translateY(22px);
    transition: transform .6s cubic-bezier(.22,.65,.2,1), opacity .6s;
    transition-delay: calc(var(--i) * 110ms + 60ms);
  }
  .tile.show{ opacity:1; transform:none }
  
  /* Toast */
  .toast{
    position: fixed; left: 50%; bottom: 22px; transform: translateX(-50%);
    background:#111; color:#fff; padding:10px 14px; border-radius:12px;
    font-weight:800; box-shadow:0 10px 26px rgba(0,0,0,.25); z-index: 10;
  }
  
  /* Back to top */
  .to-top{
    position: fixed; right: 18px; bottom: 18px; z-index: 10;
    width:42px; height:42px; border-radius:12px; border:none; cursor:pointer;
    background: var(--accent); color:#111; font-weight:900; font-size:18px;
    box-shadow: 0 8px 22px rgba(0,0,0,.25);
  }
  
  /* Responsive */
  @media (max-width: 860px){
    .brand{ margin-bottom: 10px }
    .h{ font-size:18px }
    .sub{ flex-direction:column; align-items:flex-start }
  }
  
  /* Respect reduced motion */
  @media (prefers-reduced-motion: reduce){
    .tile{ transition:none !important; transform:none !important; opacity:1 !important; }
  }
  </style>
  