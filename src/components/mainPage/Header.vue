<!-- SiteHeader.vue -->
<template>
  <header class="site-header" role="banner">
    <div class="bar">
      <!-- Brand -->
      <a class="logo" href="/">
        <img src="../../assets/logo.svg" alt="">
      </a>

      <!-- Mobile burger -->
      <button
        class="burger"
        :aria-expanded="isOpen ? 'true' : 'false'"
        aria-label="Toggle navigation"
        @click="isOpen = !isOpen"
      >
        <span :class="{ open: isOpen }"></span>
        <span :class="{ open: isOpen }"></span>
        <span :class="{ open: isOpen }"></span>
      </button>

      <!-- Nav -->
      <nav class="nav" :class="{ open: isOpen }" role="navigation">
        <a class="link" href="#" :class="{ active: active === 'home' }" @click="go('home')">{{ $t('nav1') }}</a>
        <a class="link" href="#" :class="{ active: active === 'practice' }" @click="go('practice')">{{ $t('nav2') }}</a>
        <a class="link" href="#books" :class="{ active: active === 'books' }" @click="go('books')">{{ $t('nav3') }}</a>
        <a class="link" href="#courses" :class="{ active: active === 'courses' }" @click="go('courses')">{{ $t('nav4') }}</a>
        <a class="link" href="#contact" :class="{ active: active === 'contact' }" @click="go('contact')">{{ $t('nav5') }}</a>

        <div class="sep" aria-hidden="true"></div>

        <!-- Language chooser -->
        <label class="lang" title="Choose language">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Zm0 2c1.6 0 3.07.6 4.2 1.6H7.8A6.97 6.97 0 0 1 12 4Zm-7 8c0-.7.1-1.37.3-2h13.4c.2.63.3 1.3.3 2s-.1 1.37-.3 2H5.3c-.2-.63-.3-1.3-.3-2Zm1.8 5.4h10.4A6.97 6.97 0 0 1 12 20c-1.6 0-3.07-.6-4.2-1.6ZM7 7.6h10A8 8 0 0 1 19.4 10H4.6A8 8 0 0 1 7 7.6Z"/>
          </svg>
          <select v-model="$i18n.locale">
            <option v-for="l in langs" :key="l.value" :value="l.value">{{ l.label }}</option>
          </select>
        </label>

        <!-- Auth buttons -->
        <button class="btn" @click="openAuth('signup')">{{ $t('signUp') }}</button>
        <button class="btn" @click="openAuth('signin')">{{ $t('signIn') }}</button>
      </nav>
    </div>
  </header>

  <!-- ===== Auth Modal (one component, two modes) ===== -->
  <div
    v-if="auth.open"
    class="overlay"
    @click.self="closeAuth"
    :aria-hidden="auth.open ? 'false' : 'true'"
  >
    <div class="dialog" role="dialog" aria-modal="true" :aria-labelledby="auth.mode + '-title'">
      <div class="dialog-head">
        <h3 class="dialog-title" :id="auth.mode + '-title'">
          {{ auth.mode === 'signin' ? 'Sign in' : 'Create your account' }}
        </h3>
        <button class="x" aria-label="Close" @click="closeAuth">×</button>
      </div>

      <form class="form" @submit.prevent="submitAuth">
        <template v-if="auth.mode === 'signup'">
          <label class="field">
            <span>Full name</span>
            <input ref="firstField" v-model.trim="form.name" type="text" required autocomplete="name" />
          </label>
        </template>

        <label class="field" :class="{ full: auth.mode === 'signin' }">
          <span>Email</span>
          <input :ref="auth.mode === 'signin' ? 'firstField' : null" v-model.trim="form.email" type="email" required autocomplete="email" />
        </label>

        <label class="field">
          <span>Password</span>
          <input v-model="form.password" :type="showPw ? 'text' : 'password'" required autocomplete="current-password" />
          <button class="ghost tiny" type="button" @click="showPw = !showPw">{{ showPw ? 'Hide' : 'Show' }}</button>
        </label>

        <div class="row-between">
          <label class="check" v-if="auth.mode === 'signin'">
            <input type="checkbox" v-model="form.remember" />
            <span>Remember me</span>
          </label>

          <a class="ghost" href="#" v-if="auth.mode === 'signin'">Forgot password?</a>
        </div>

        <button class="cta" type="submit">
          {{ auth.mode === 'signin' ? 'Sign in' : 'Create account' }}
        </button>

        <div class="or">
          <span>or continue with</span>
        </div>

        <div class="socials">
          <button type="button" class="sbtn">Google</button>
          <button type="button" class="sbtn">GitHub</button>
        </div>

        <p class="switch">
          <template v-if="auth.mode === 'signin'">
            Don’t have an account?
            <button class="ghost" type="button" @click="switchMode('signup')">Sign up</button>
          </template>
          <template v-else>
            Already have an account?
            <button class="ghost" type="button" @click="switchMode('signin')">Sign in</button>
          </template>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";

const isOpen = ref(false);
const active = ref("home");
const lang = ref("en");

const langs = [
    { value: 'UZ', label: 'UZ' },
    { value: 'EN', label: 'EN' },
    { value: 'RU', label: 'RU' },
  ]

function go(key) { active.value = key; isOpen.value = false; }
function changeLang() {
  document.documentElement.setAttribute("lang", lang.value);
  window.dispatchEvent(new CustomEvent("language-changed", { detail: lang.value }));
}

/* ===== Auth state ===== */
const auth = ref({ open: false, mode: "signin" }); // 'signin' | 'signup'
const form = ref({ name: "", email: "", password: "", remember: true });
const showPw = ref(false);
const firstField = ref(null);

function lockScroll(lock) { document.body.style.overflow = lock ? "hidden" : ""; }

function openAuth(mode) {
  auth.value.mode = mode;
  auth.value.open = true;
  lockScroll(true);
  nextTick(() => firstField.value?.focus());
}
function closeAuth() { auth.value.open = false; lockScroll(false); }
function switchMode(mode) { auth.value.mode = mode; nextTick(() => firstField.value?.focus()); }

function submitAuth() {
  // Replace with your real request
  const payload = { ...form.value, mode: auth.value.mode };
  console.log("Auth submit:", payload);
  alert(`${auth.value.mode === "signin" ? "Signed in" : "Signed up"} as ${form.value.email}`);
  closeAuth();
}

/* Close with ESC */
function onKey(e) { if (e.key === "Escape" && auth.value.open) closeAuth(); }
onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));
</script>

<style>
/* Fixed header spacer */
:root { --header-h: 88px; --brand-yellow: #f2b200; }
body { padding-top: var(--header-h); background: #f2eeee; }

/* Header shell */
.site-header {
  position: fixed; inset: 0 0 auto 0; z-index: 1000;
  display: flex; justify-content: center;
  padding: 16px 12px;
  backdrop-filter: saturate(180%) blur(6px);
}
.bar {
  width: min(1240px, 100%);
  background: #fff;
  border-radius: 999px;
  padding: 14px 18px;
  box-shadow: 0 6px 18px rgba(0,0,0,.06);
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
}

/* Logo */
.logo{
  width: 150px;
}

.logo img{
  width: 100%;
}

/* Nav */
.nav { display: flex; align-items: center; gap: 22px; }
.link {
  text-decoration: none; color: #243042; font-weight: 600;
  padding: 6px 8px; border-radius: 10px; transition: .2s ease;
}
.link:hover { color: #111; }
.link.active { color: #0f172a; box-shadow: inset 0 -2px 0 0 #0f172a1a; }
.sep { width: 1px; height: 24px; background: #1f2a4066; margin: 0 6px; }

/* Language */
.lang { display: inline-flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 999px; background: #f7f7f7; border: 1px solid #e8e8e8; }
.lang select { border: 0; background: transparent; outline: none; font-weight: 700; cursor: pointer; appearance: none; padding-right: 4px; }

/* Buttons */
.btn {
  border: none; cursor: pointer;
  background: var(--brand-yellow); color: #111; font-weight: 800;
  padding: 10px 18px; border-radius: 999px;
  box-shadow: 0 2px 0 rgba(0,0,0,.06) inset; transition: transform .08s ease;
}
.btn:active { transform: translateY(1px); }

/* Burger */
.burger { display: none; width: 44px; height: 40px; border: 0; background: transparent; cursor: pointer; position: relative; }
.burger span { position: absolute; left: 8px; right: 8px; height: 2px; background: #1f2a40; transition: .2s ease; }
.burger span:nth-child(1){ top:12px } .burger span:nth-child(2){ top:19px } .burger span:nth-child(3){ top:26px }
.burger span.open:nth-child(1){ transform: translateY(7px) rotate(45deg) }
.burger span.open:nth-child(2){ opacity: 0 }
.burger span.open:nth-child(3){ transform: translateY(-7px) rotate(-45deg) }

/* Responsive (flex only) */
@media (max-width: 1023px){
  .burger { display: inline-block; }
  .nav {
    position: fixed; top: var(--header-h); right: 12px; left: 12px;
    padding: 14px; background: #fff; border-radius: 20px; box-shadow: 0 12px 28px rgba(0,0,0,.12);
    flex-direction: column; align-items: stretch; gap: 12px; display: none;
  }
  .nav.open { display: flex; }
  .sep { display: none; }
  .btn { width: 100%; text-align: center; }
  .lang { justify-content: space-between; }
}

/* ===== Modal styles ===== */
.overlay{
  position: fixed; inset: 0; background: rgba(0,0,0,.35);
  display:flex; align-items:center; justify-content:center; padding: 16px; z-index: 1100;
  animation: fade .15s ease-out;
}
@keyframes fade { from{ opacity:0 } to{ opacity:1 } }

.dialog{
  width: min(560px, 100%); background:#fff; border-radius: 18px; box-shadow: 0 30px 70px rgba(0,0,0,.25);
  display:flex; flex-direction: column; gap: 12px; padding: 18px 18px 20px;
  transform: translateY(6px); animation: pop .18s ease-out forwards;
}
@keyframes pop{ to{ transform: translateY(0) } }

.dialog-head{ display:flex; align-items:center; justify-content:space-between; }
.dialog-title{ margin:0; font-weight:800; font-size: 22px; }
.x{ border:0; background:transparent; font-size: 28px; line-height: 1; cursor:pointer; padding: 2px 6px; }

.form{ display:flex; flex-direction: column; gap: 12px; }
.field{ display:flex; align-items:center; gap: 10px; padding: 10px 12px; border:1px solid #e6e8ee; border-radius: 12px; }
.field span{ font-weight:700; color:#223046; min-width: 86px }
.field.full span{ min-width: 60px }
.field input{ border:0; outline:0; flex:1; font-weight:600; }
.check{ display:flex; align-items:center; gap: 8px; color:#223046; }
.row-between{ display:flex; align-items:center; justify-content:space-between; }
.ghost{ background:transparent; border:0; color:#243041; font-weight:800; cursor:pointer; }
.tiny{ font-size: 12px; margin-left: 6px }
.cta{
  border:0; background: var(--brand-yellow); color:#111; font-weight:800; padding: 12px; border-radius: 12px; cursor:pointer;
}
.or{ display:flex; align-items:center; gap: 10px; color:#6a7280; font-size: 12px; justify-content:center }
.or::before,.or::after{ content:""; height:1px; background:#e7ebf2; flex:1 }
.socials{ display:flex; gap:10px; justify-content:center }
.sbtn{ border:1px solid #e7ebf2; background:#fff; padding:10px 12px; border-radius: 10px; font-weight:800; cursor:pointer }
.switch{ text-align:center; color:#4f5866 }

/* Reduced motion */
@media (prefers-reduced-motion: reduce){
  .overlay,.dialog{ animation:none !important }
}
</style>
