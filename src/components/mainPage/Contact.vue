<!-- ContactSection.vue (updated: form only) -->
<template>
    <section class="contact" id="contact" ref="root">
      <div class="container">
        <span class="eyebrow" :class="{ show: headingIn }">{{ $t('contact')}}</span>
        <h2 class="title" :class="{ show: headingIn }">{{ $t('contactSubtitle') }}</h2>
  
        <!-- Only the form (centered) -->
        <div class="wrap" :class="{ in: listIn }">
          <form class="card form form--solo" @submit.prevent="submit" novalidate>
            <div class="field">
              <input
                id="email"
                v-model.trim="form.email"
                type="email"
                inputmode="email"
                placeholder="you@example.com"
                @blur="touch.email = true"
                :class="{ invalid: touch.email && !validEmail }"
                required
              />
              <p v-if="touch.email && !validEmail" class="err">Please enter a valid email.</p>
            </div>
  
            <div class="field">
           
              <div class="phonebox" :class="{ invalid: touch.phone && !validPhone }">
                <span class="cc">+998</span>
                <input
                  id="phone"
                  v-model="phoneDigits"
                  type="tel"
                  inputmode="numeric"
                  autocomplete="tel"
                  placeholder="90 123 45 67"
                  maxlength="12"
                  @input="digitsOnly"
                  @blur="touch.phone = true"
                  aria-describedby="ph-help"
                />
              </div>
              <p v-if="touch.phone && !validPhone" class="err">{{ phoneError }}</p>
            </div>
  
            <div class="field">
           
              <textarea
                id="msg"
                v-model.trim="form.message"
                rows="5"
                placeholder="How can we help?"
                @blur="touch.message = true"
                :class="{ invalid: touch.message && !validMsg }"
                required
              ></textarea>
              <p v-if="touch.message && !validMsg" class="err">Please write at least 10 characters.</p>
            </div>
  
            <button class="btn primary" type="submit" :disabled="!formOk">Send message</button>
            <p class="note">By sending, you agree to be contacted via email or phone.</p>
          </form>
        </div>
      </div>
  
      <!-- Toast -->
      <div class="toast" v-show="toast">{{ toast }}</div>
    </section>
  </template>
  
  <script setup>
  import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
  
  /* Scroll reveal */
  const root = ref(null);
  const headingIn = ref(false);
  const listIn = ref(false);
  let io;
  onMounted(() => {
    io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          headingIn.value = true;
          setTimeout(() => (listIn.value = true), 150);
          io.unobserve(e.target);
        }
      },
      { threshold: 0.2 }
    );
    if (root.value) io.observe(root.value);
  });
  onBeforeUnmount(() => io?.disconnect());
  
  /* Form state */
  const form = ref({ email: '', message: '' });
  const phoneDigits = ref(''); // 9-digit national number without +998
  const touch = ref({ email: false, phone: false, message: false });
  const toast = ref('');
  
  /* Uzbekistan codes */
  const uzCodes = new Set(['33','90','91','93','94','95','97','98','99','71']);
  
  const validEmail = computed(() => {
    const v = form.value.email.trim();
    return v.length > 3 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v);
  });
  const phoneError = computed(() => {
    const d = digitsOnlyRaw(phoneDigits.value);
    if (d.length !== 9) return 'Enter 9 digits after +998.';
    const code = d.slice(0, 2);
    if (!uzCodes.has(code)) return `Invalid UZ code: ${code}. Try 33, 90, 91, 93, 94, 95, 97, 98, 99, 71.`;
    return '';
  });
  const validPhone = computed(() => phoneError.value === '');
  const validMsg = computed(() => form.value.message.trim().length >= 10);
  const formOk   = computed(() => validEmail.value && validPhone.value && validMsg.value);
  
  /* Helpers */
  function digitsOnlyRaw(v){ return String(v).replace(/\D/g,'').slice(0,9); }
  function digitsOnly(e){
    const raw = digitsOnlyRaw(e.target.value);
    phoneDigits.value = format9(raw);
  }
  function format9(d){
    const g1 = d.slice(0,2), g2 = d.slice(2,5), g3 = d.slice(5,7), g4 = d.slice(7,9);
    return [g1,g2,g3,g4].filter(Boolean).join(' ');
  }
  
  /* Submit */
  function submit(){
    touch.value = { email: true, phone: true, message: true };
    if (!formOk.value) return;
  
    const payload = {
      email: form.value.email.trim(),
      phone: '+998 ' + digitsOnlyRaw(phoneDigits.value).replace(/(\d{2})(\d{3})(\d{2})(\d{2})/,'$1 $2 $3 $4'),
      message: form.value.message.trim(),
    };
    console.log('Contact payload:', payload);
  
    toast.value = 'Thanks! We will contact you soon.';
    setTimeout(() => (toast.value = ''), 2000);
  
    form.value = { email: '', message: '' };
    phoneDigits.value = '';
    touch.value = { email: false, phone: false, message: false };
  }
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
  
  .contact{
    --ink:#1A1B23;
    --muted:#566070;
    --line:#e6ebf2;
    --accent:#f2b200;
    --max:1200px;
    --card:#fff;
    --form-max: 720px; /* max width for single form */
  }
  
  *{ box-sizing:border-box }
  .contact{
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
    color:var(--ink);
    background:#fff;
    padding:44px 0 80px;
  }
  .container{ max-width:var(--max); margin:0 auto; padding:0 16px }
  
  /* Title */
  .eyebrow{
    display:inline-block; background:var(--accent); color:#111;
    font-weight:800; font-size:12px; letter-spacing:.14em; padding:8px 14px; border-radius:10px;
    opacity:0; transform: translateX(-26px); transition: opacity .6s, transform .6s;
  }
  .title{
    margin: 14px 0 18px; font-weight:800; font-size: clamp(28px, 5vw, 40px);
    opacity:0; transform: translateX(-30px); transition: opacity .7s .05s, transform .7s .05s;
  }
  .eyebrow.show,.title.show{ opacity:1; transform:none }
  
  /* Centered form */
  .wrap{
    display:flex; justify-content:center; margin-top:6px;
    opacity:0; transform: translateY(24px); transition: transform .6s cubic-bezier(.22,.65,.2,1), opacity .6s;
  }
  .wrap.in{ opacity:1; transform:none }
  .card{
    background:var(--card); border:1px solid var(--line); border-radius:16px;
    box-shadow: 0 6px 18px rgba(0,0,0,.04);
  }
  .form{ width:100%; max-width: var(--form-max); padding:16px }
  
  /* Fields */
  .field{ margin-bottom:12px }
  .field label{ display:block; font-weight:800; margin-bottom:6px; color:#223046 }
  .field input, .field textarea{
    width:100%; border:1px solid var(--line); border-radius:12px; padding:10px 12px; font-weight:600; outline:none;
    transition: border-color .2s, box-shadow .2s;
  }
  .field input:focus, .field textarea:focus{ border-color:#cfd7e3; box-shadow: 0 0 0 3px #e9eef7 }
  .field .muted{ color:#6a7280; font-size:12px }
  .invalid{ border-color:#ef4444 !important; box-shadow: 0 0 0 3px #fee2e2 !important }
  .err{ color:#dc2626; font-size:12px; margin-top:6px }
  
  /* Phone */
  .phonebox{
    display:flex; align-items:center; gap:8px; border:1px solid var(--line); border-radius:12px; padding:6px 8px;
  }
  .phonebox .cc{
    font-weight:800; background:#fff6d8; border:1px solid #ffe59a; padding:6px 10px; border-radius:10px; color:#0f172a
  }
  .phonebox input{ border:0; outline:0; flex:1; font-weight:700; padding:8px 6px 8px 2px }
  
  /* Actions */
  .btn{
    border:1px solid #e6e8ee; background:#fff; color:#1a1b23;
    font-weight:800; padding:10px 14px; border-radius:10px; cursor:pointer;
  }
  .btn.primary{ background:var(--accent); color:#111; border-color: var(--accent) }
  .note{ color:#6a7280; font-size:12px; margin-top:8px }
  
  /* Toast */
  .toast{
    position: fixed; left: 50%; bottom: 22px; transform: translateX(-50%);
    background:#111; color:#fff; padding:10px 14px; border-radius:12px;
    font-weight:800; box-shadow:0 10px 26px rgba(0,0,0,.25); z-index: 10;
  }
  
  /* Reduced motion */
  @media (prefers-reduced-motion: reduce){
    .wrap{ transition:none !important; transform:none !important; opacity:1 !important; }
  }
  </style>
  