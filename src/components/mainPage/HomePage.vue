<!-- HeroSat.vue -->
<template>
    <section class="hero">
      <div class="wrap">
        <!-- LEFT: copy -->
        <div class="copy">
          <h1>{{ $t('MainPageTitle') }}</h1>
          <p>
           {{ $t('MainPageSubTitle') }}
          </p>
        </div>
  
        <!-- RIGHT: geometric illustration (SVG) -->
        <div
          class="art"
          :class="{ on: hovered }"
          @mouseenter="hovered = true"
          @mouseleave="hovered = false"
        >
          <!-- Responsive viewBox; all shapes are positioned via CSS transforms
               so we can animate between two arrangements cleanly. -->
          <svg class="stage" viewBox="0 0 700 520" aria-hidden="true">
            <!-- top-left rounded block -->
            <g class="shape tl">
              <rect x="0" y="0" width="360" height="220" rx="110" fill="#383D44"/>
              <!-- soft inner shade like screenshot -->
              <rect x="22" y="18" width="316" height="184" rx="92" fill="#3F454D"/>
            </g>
  
            <!-- top-right rounded block -->
            <g class="shape tr">
              <rect x="0" y="0" width="360" height="220" rx="110" fill="#2D3238"/>
            </g>
  
            <!-- long yellow pill -->
            <g class="shape bar">
              <rect x="0" y="0" width="560" height="200" rx="100" fill="#F2B200"/>
            </g>
  
            <!-- orange circles (2 shown in first layout, 3 in second) -->
            <g class="shape c c1"><circle r="110" cx="110" cy="110" fill="#F39C00"/></g>
            <g class="shape c c2"><circle r="110" cx="110" cy="110" fill="#F2AD00"/></g>
            <g class="shape c c3"><circle r="110" cx="110" cy="110" fill="#FFD05E"/></g>
  
            <!-- bottom-left big white quarter-ish block -->
            <g class="shape bl">
              <rect x="0" y="0" width="360" height="260" rx="130" fill="#FFFFFF"/>
            </g>
  
            <!-- bottom-right grey pill -->
            <g class="shape br">
              <rect x="0" y="0" width="500" height="220" rx="110" fill="#C9C9C9"/>
              <rect x="80" y="0" width="60" height="220" fill="#D7D7D7"/>
              <rect x="140" y="0" width="60" height="220" fill="#D0D0D0"/>
            </g>
          </svg>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref } from "vue";
  const hovered = ref(false);
  </script>
  
  <style>
  :root{
    --bg:#F2EEEE;
    --ink:#2A2730;
    --max:1180px;
  }
  
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial}
  
  /* Layout */
  .hero{padding:6vw 2rem; padding-top:120px
  }
  .wrap{
    max-width:var(--max);
    margin:0 auto;
    display:flex;
    align-items:center;
    gap:min(5vw,60px);
  }
  .copy{flex:1 1 48%}
  .copy h1{
    margin:0 0 18px;
    font-weight:800;
    line-height:1.06;
    font-size: clamp(32px, 6vw, 72px);
    letter-spacing:.2px;
  }
  .copy p{
    margin:0;
    font-size: clamp(16px, 2.1vw, 22px);
    color:#333541;
  }
  
  .art{
    flex:1 1 52%;
    position:relative;
    aspect-ratio: 700 / 520;
    min-height: 320px;
  }
  .stage{width:100%;height:100%}
  
  /* --- Animation system ---
     We place every primitive at origin and position it using CSS transforms.
     Two states:
     - default = “first image”
     - .art.on = “second image”
  */
  
  .shape{transition: transform .7s cubic-bezier(.21,.7,.18,1), opacity .5s}
  
  /* FIRST IMAGE (default) positions */
  .art .tl{ transform: translate(195px, 0px) }
  .art .tr{ transform: translate(470px, 0px) }
  .art .bar{ transform: translate(180px, 180px) }
  .art .c1 { transform: translate(620px, 178px) }   /* orange on right */
  .art .c2 { transform: translate(740px, 178px) }   /* second orange on right */
  .art .c3 { transform: translate(860px, 178px); opacity:0 } /* hidden initially */
  .art .bl { transform: translate(180px, 360px) }
  .art .br { transform: translate(420px, 360px) }
  
  /* SECOND IMAGE (hover) positions */
  .art.on .tl{ transform: translate(50px, 0px) }
  .art.on .tr{ transform: translate(330px, 0px) }
  .art.on .bar{ transform: translate(20px, 200px) }
  .art.on .c1{ transform: translate(290px, 190px) }
  .art.on .c2{ transform: translate(410px, 190px) }
  .art.on .c3{ transform: translate(530px, 190px); opacity:1 } /* third bubble appears */
  .art.on .bl{ transform: translate(20px, 350px) }
  .art.on .br{ transform: translate(300px, 360px) }
  
  /* Small screens: stack */
  @media (max-width: 900px){
    .wrap{flex-direction:column; align-items:flex-start}
    .art{width:100%}
  }
  </style>
  