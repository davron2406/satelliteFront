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

  <!-- ===== Auth Modal (two modes; design unchanged) ===== -->
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
        <!-- Sign-up extra fields -->
        <template v-if="auth.mode === 'signup'">
          <label class="field">
            <span>First name</span>
            <input ref="firstField" v-model.trim="form.firstName" type="text" required autocomplete="given-name" />
          </label>

          <label class="field">
            <span>Last name</span>
            <input v-model.trim="form.lastName" type="text" required autocomplete="family-name" />
          </label>

          <label class="field">
            <span>Phone</span>
            <div class="phone">
              <span class="cc">+998</span>
              <input
                v-model="phoneView"
                inputmode="numeric"
                maxlength="12"
                placeholder="90 123 45 67"
                @input="onPhone"
                autocomplete="tel-national"
                required
              />
            </div>
          </label>
          <small class="hint">Codes: 33, 90, 91, 93, 94, 95, 97, 98, 99, 71</small>
        </template>

        <!-- Shared fields -->
        <label class="field" :class="{ full: auth.mode === 'signin' }">
          <span>Email</span>
          <input :ref="auth.mode === 'signin' ? 'firstField' : null" v-model.trim="form.email" type="email" required autocomplete="email" />
        </label>

        <label class="field">
          <span>Password</span>
          <input v-model="form.password" :type="showPw ? 'text' : 'password'" required autocomplete="current-password" />
          <button class="ghost tiny" type="button" @click="showPw = !showPw">{{ showPw ? 'Hide' : 'Show' }}</button>
        </label>

        <!-- Password checker (signup only) -->
        <div v-if="auth.mode==='signup'" class="pcheck">
          <div class="pbar" :data-strength="strengthLabel">
            <div class="pbar-fill" :style="{ width: strengthPct + '%' }"></div>
          </div>
          <div class="prow">
            <span class="pbadge" :class="{ok: passLen}">8+ chars</span>
            <span class="pbadge" :class="{ok: passLetter}">letter</span>
            <span class="pbadge" :class="{ok: passDigit}">number</span>
            <span class="pbadge" :class="{ok: passSpecial}">special</span>
          </div>
          <small class="pnote">Strength: {{ strengthLabel }}</small>
        </div>

        <div class="row-between">
          <label class="check" v-if="auth.mode === 'signin'">
            <input type="checkbox" v-model="form.remember" />
            <span>Remember me</span>
          </label>
          <a class="ghost" href="#" v-if="auth.mode === 'signin'">Forgot password?</a>
        </div>

        <button class="cta" type="submit" :disabled="busy">
          {{ auth.mode === 'signin' ? 'Sign in' : 'Create account' }}
        </button>

        <div class="or">
          <span>or continue with</span>
        </div>

        <div class="socials">
          <button type="button" class="sbtn" :disabled="busy">Google</button>
          <button type="button" class="sbtn" :disabled="busy">GitHub</button>
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

  <!-- ===== Toast (top-right popup) ===== -->
  <transition name="toast">
    <div
      v-if="toast.show"
      class="toast"
      :class="toast.type"
      role="status"
      aria-live="polite"
      @mouseenter="pauseToast"
      @mouseleave="resumeToast"
    >
      <div class="ticon" v-if="toast.type==='error'">!</div>
      <div class="ticon ok" v-else>✓</div>
      <div class="tmsg">{{ toast.message }}</div>
      <button class="tclose" @click="hideToast" aria-label="Close">×</button>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import axios from "axios";

/* ---------- Axios (no interceptor; we decide success by payload) ---------- */
const api = axios.create({
  baseURL: "https://satelliteback.onrender.com/api",
  withCredentials: true,
});

/* ---------- Helpers to interpret backend responses ---------- */
function looksLikeSuccess(d) {
  if (!d || typeof d !== 'object') return false;
  if (typeof d.token === 'string' && d.token.length > 12) return true;
  if (d.token?.accessToken) return true;
  if (d.success === true || d.authenticated === true) return true;
  if (typeof d.status === 'string' && ['ok','success'].includes(d.status.toLowerCase())) return true;
  if (d.code === 0 || d.statusCode === 200) return true;
  if (d.user && (d.user.id || d.user.email)) return true;
  return false;
}
function looksLikeFailure(d) {
  if (!d || typeof d !== 'object') return false;
  if (d.success === false || d.authenticated === false) return true;
  if (typeof d.status === 'string' && d.status.toLowerCase() === 'error') return true;
  if (d.code === 401 || d.statusCode === 401) return true;
  const msg = (d.message || d.error || '').toString().toLowerCase();
  return ['incorrect','invalid','not found','unauthorized','wrong','failed'].some(k => msg.includes(k));
}
function extractToken(d) { return d?.token?.accessToken || d?.token || d?.jwt || null; }
function extractUser(d)  { return d?.user || d?.data?.user || null; }
function extractMessage(d, fallback) { return d?.message || d?.error || fallback; }

/* ---------- Header state ---------- */
const isOpen = ref(false);
const active = ref("home");
const langs = [
  { value: 'UZ', label: 'UZ' },
  { value: 'EN', label: 'EN' },
  { value: 'RU', label: 'RU' },
];
function go(key) { active.value = key; isOpen.value = false; }

/* ===== Auth state ===== */
const auth = ref({ open: false, mode: "signin" }); // 'signin' | 'signup'
const form = ref({
  firstName: "",
  lastName: "",
  phoneNumber: "",     // 9 digits (no +998)
  email: "",
  password: "",
  remember: true
});
const showPw = ref(false);
const firstField = ref(null);
const busy = ref(false);

function lockScroll(lock) { document.body.style.overflow = lock ? "hidden" : ""; }
function openAuth(mode) {
  auth.value.mode = mode;
  auth.value.open = true;
  lockScroll(true);
  nextTick(() => firstField.value?.focus());
}
function closeAuth() { auth.value.open = false; lockScroll(false); }
function switchMode(mode) { auth.value.mode = mode; nextTick(() => firstField.value?.focus()); }

/* ===== Phone (UZ) ===== */
const phoneView = ref("");
const uzCodes = new Set(["33","90","91","93","94","95","97","98","99","71"]);
const phoneDigits = computed(() => phoneView.value.replace(/\D/g, "").slice(0, 9));
const phoneErr = computed(() => {
  if (phoneDigits.value.length !== 9) return "Enter 9 digits after +998.";
  const code = phoneDigits.value.slice(0, 2);
  if (!uzCodes.has(code)) return `Invalid code: ${code}`;
  return "";
});
const validPhone = computed(() => phoneErr.value === "");
function onPhone(e){
  const d = e.target.value.replace(/\D/g,'').slice(0,9);
  phoneView.value = [d.slice(0,2), d.slice(2,5), d.slice(5,7), d.slice(7,9)]
    .filter(Boolean).join(' ');
  form.value.phone = phoneDigits.value;
}

/* Email validity */
const validEmail = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(form.value.email.trim())
);

/* ===== Password checker (signup only) ===== */
const passLen     = computed(() => form.value.password.length >= 8);
const passLetter  = computed(() => /[A-Za-z]/.test(form.value.password));
const passDigit   = computed(() => /\d/.test(form.value.password));
const passSpecial = computed(() => /[^A-Za-z0-9]/.test(form.value.password));
const strengthScore = computed(() =>
  [passLen.value, passLetter.value, passDigit.value, passSpecial.value].filter(Boolean).length
);
const strengthPct = computed(() => [0, 30, 60, 85, 100][strengthScore.value]);
const strengthLabel = computed(() => ['Weak','Weak','Fair','Strong','Very strong'][strengthScore.value]);

/* ===== Toast ===== */
const toast = ref({ show: false, message: '', type: 'error' });
let toastTimer = null;
function showToast(message, type = 'error', duration = 3000) {
  toast.value = { show: true, message, type };
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.value.show = false, duration);
}
function hideToast(){ toast.value.show = false; clearTimeout(toastTimer); }
function pauseToast(){ clearTimeout(toastTimer); }
function resumeToast(){ if (toast.value.show) toastTimer = setTimeout(() => toast.value.show = false, 1600); }

/* ===== Submit (robust & permissive for 200s) ===== */
async function submitAuth() {
  if (busy.value) return;

  // Client checks before API
  if (auth.value.mode === 'signin') {
    const errs = [];
    if (!validEmail.value) errs.push('Email');
    if (!form.value.password.trim()) errs.push('Password');
    if (errs.length) { showToast(`Please fill: ${errs.join(', ')}`, 'error'); return; }
  } else {
    const errs = [];
    if (form.value.firstName.trim().length < 2) errs.push('First name');
    if (form.value.lastName.trim().length  < 2) errs.push('Last name');
    if (!validEmail.value)                 errs.push('Email');
    const digits = phoneDigits.value, code = digits.slice(0,2);
    if (digits.length !== 9 || !uzCodes.has(code)) errs.push('Phone');
    if (!passLen.value || !passLetter.value || !passDigit.value) errs.push('Password (8+, letter & number)');
    if (errs.length) { showToast(`Please fix: ${errs.join(', ')}`, 'error'); return; }
  }

  busy.value = true;
  try {
    if (auth.value.mode === 'signin') {
      const res = await api.post('/auth/login', {
        email: form.value.email.trim(),
        password: form.value.password,
        remember: !!form.value.remember,
      });
      const data = res.data || {};
      sessionStorage.setItem('token', data)
    
      if (looksLikeFailure(data)) {
        showToast(extractMessage(data, 'Email or password is incorrect.'), 'error');
        return;
      }

      const token = extractToken(data);
      if (token) {
        localStorage.setItem('token', token);
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
      }
      const user = extractUser(data);
      if (user) localStorage.setItem('user', JSON.stringify(user));

      closeAuth();
      window.location.assign('/dashboard');
    } else {
      const digits = phoneDigits.value;
      const res = await api.post('/auth/register', {
        firstName: form.value.firstName.trim(),
        lastName:  form.value.lastName.trim(),
        phoneNumber:     `+998${digits}`,
        email:     form.value.email.trim(),
        password:  form.value.password,
      });
      const data = res.data || {};

      if (looksLikeFailure(data)) {
        showToast(extractMessage(data, 'Could not create account.'), 'error');
        return;
      }

      const token = extractToken(data);
      if (token) {
        localStorage.setItem('token', token);
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
      }
      const user = extractUser(data);
      if (user) localStorage.setItem('user', JSON.stringify(user));

      closeAuth();
      window.location.assign('/dashboard');
    }
  } catch (e) {
    const msg =
      e?.response?.data?.message ||
      (e?.response?.status === 401 ? 'Email or password is incorrect.' : 'Something went wrong. Please try again.');
    showToast(msg, 'error');
  } finally {
    busy.value = false;
  }
}

/* Close with ESC */
function onKey(e) { if (e.key === "Escape" && auth.value.open) closeAuth(); }
onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));
</script>

<style>
/* Fixed header spacer */
:root { --header-h: 88px; --brand-yellow: #f2b200; }
body { background: #f2eeee; }

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
.logo{ width: 150px; }
.logo img{ width: 100%; }

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

/* Phone row */
.phone{ display:flex; align-items:center; gap:8px; width:100% }
.cc{ font-weight:800; background:#fff6d8; border:1px solid #ffe59a; padding:6px 10px; border-radius:10px; color:#0f172a; white-space:nowrap }
.hint{ color:#6a7280; margin-top:-6px; margin-bottom:2px; font-size:12px }

/* Password checker */
.pcheck{ display:flex; flex-direction:column; gap:6px; margin-top:-6px }
.pbar{
  position:relative; height:8px; border-radius:999px; background:#eef2f7; overflow:hidden;
  border:1px solid #e6e8ee;
}
.pbar-fill{
  position:absolute; left:0; top:0; bottom:0;
  width:0; background:linear-gradient(90deg, #f87171, #fbbf24, #34d399, #22c55e);
  transition: width .2s ease;
}
.prow{ display:flex; gap:6px; flex-wrap:wrap }
.pbadge{
  font-size:12px; font-weight:800; padding:4px 8px; border-radius:999px;
  border:1px solid #e6e8ee; background:#fff; color:#6b7280;
}
.pbadge.ok{ color:#0f172a; border-color:#cfe6ff; background:#eef6ff }
.pnote{ color:#6b7280 }

/* ===== Toast (top-right popup) ===== */
.toast{
  position: fixed;
  right: 16px; top: 16px; z-index: 1200;
  display:flex; align-items:center; gap:10px;
  background:#fff; color:#111827;
  border:1px solid #f3dcdc; border-left:6px solid #dc2626;
  border-radius:12px; box-shadow:0 12px 28px rgba(0,0,0,.12);
  padding:12px 40px 12px 12px; max-width: min(420px, 90vw);
}
.toast.success{ border-left-color:#16a34a; border-color:#d7f0df; }
.ticon{ width:22px; height:22px; border-radius:50%; background:#fee2e2; color:#b91c1c; display:grid; place-items:center; font-weight:800; }
.ticon.ok{ background:#dcfce7; color:#166534 }
.tmsg{ line-height:1.3 }
.tclose{ position:absolute; right:8px; top:6px; border:0; background:transparent; font-size:20px; cursor:pointer; color:#334155 }

.toast-enter-from,.toast-leave-to{ opacity:0; transform: translateY(-12px) }
.toast-enter-active,.toast-leave-active{ transition: opacity .18s ease, transform .18s ease }

@media (max-width: 640px){
  .toast{ left:12px; right:12px; top:12px; padding-right:36px }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce){
  .overlay,.dialog,.toast{ animation:none !important; transition:none !important }
}
</style>
