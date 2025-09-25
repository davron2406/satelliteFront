<template>
    <div class="page">
      <!-- Header -->
      <div class="card header">
        <h1>Add student</h1>
        <div class="header-actions"></div>
      </div>
  
      <section class="card">
        <div class="sect-head">
          <h2>Student details</h2>
          <span class="muted">Fill in the student’s information and submit to create an account.</span>
        </div>
  
        <div class="form-grid">
          <!-- First name -->
          <div class="field">
            <div class="label">First name</div>
            <input v-model.trim="form.firstName" class="input" placeholder="Ali" maxlength="60" />
            <div class="tiny err" v-if="touched.firstName && !form.firstName">Required</div>
          </div>
  
          <!-- Last name -->
          <div class="field">
            <div class="label">Last name</div>
            <input v-model.trim="form.lastName" class="input" placeholder="Karimov" maxlength="60" />
            <div class="tiny err" v-if="touched.lastName && !form.lastName">Required</div>
          </div>
  
          <!-- Phone -->
          <div class="field">
            <div class="label">Phone number</div>
            <input
              v-model.trim="form.phoneNumber"
              class="input"
              placeholder="+998 90 123 45 67"
              @blur="normalizePhone"
            />
            <div class="tiny err" v-if="touched.phoneNumber && !validPhone">Enter a valid phone number</div>
          </div>
  
          <!-- Email -->
          <div class="field">
            <div class="label">Email</div>
            <input v-model.trim="form.email" class="input" type="email" placeholder="student@example.com" />
            <div class="tiny err" v-if="touched.email && !validEmail">Enter a valid email</div>
          </div>
  
          <!-- Password -->
          <div class="field pw">
            <div class="label">Password</div>
            <div class="password">
              <input :type="showPw ? 'text' : 'password'" v-model="form.password" class="input" autocomplete="new-password" />
              <button class="peek" @click="showPw = !showPw" type="button">{{ showPw ? 'Hide' : 'Show' }}</button>
            </div>
            <ul class="hints">
              <li :class="{ ok: form.password.length >= 8 }">At least 8 characters</li>
              <li :class="{ ok: /[A-Z]/.test(form.password) }">One uppercase letter</li>
              <li :class="{ ok: /[a-z]/.test(form.password) }">One lowercase letter</li>
              <li :class="{ ok: /\d/.test(form.password) }">One number</li>
            </ul>
          </div>
        </div>
  
        <div class="actions">
          <button class="btn ghost" :disabled="busy" @click="reset">Reset</button>
          <button class="btn primary" :disabled="busy || !canSubmit" @click="submit">
            {{ busy ? 'Creating…' : 'Create student' }}
          </button>
        </div>
  
        <p v-if="message" :class="['msg', ok ? 'ok' : 'err']">{{ message }}</p>
      </section>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref, computed } from 'vue';
  import axios from 'axios';
  
  const API = 'https://satelliteback.onrender.com/api';
  const busy = ref(false);
  const message = ref('');
  const ok = ref(false);
  const showPw = ref(false);
  
  // form
  const form = reactive({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: ''
  });
  
  // touched flags
  const touched = reactive({
    firstName: false,
    lastName: false,
    phoneNumber: false,
    email: false
  });
  
  const tokenHeader = () => {
    const t = sessionStorage.getItem('token');
    return t ? { Authorization: `Bearer ${t}` } : {};
  };
  
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validEmail = computed(() => emailRe.test(form.email));
  const validPhone = computed(() => {
    // simple rule: 10–20 digits after stripping non-digits (+ works)
    const digits = form.phoneNumber.replace(/\D/g, '');
    return digits.length >= 9 && digits.length <= 20;
  });
  const strongPw = computed(() =>
    form.password.length >= 8 &&
    /[A-Z]/.test(form.password) &&
    /[a-z]/.test(form.password) &&
    /\d/.test(form.password)
  );
  
  const canSubmit = computed(() =>
    form.firstName && form.lastName && validPhone.value && validEmail.value && strongPw.value && !busy.value
  );
  
  function normalizePhone() {
    // keep + and digits, compress spaces
    form.phone = form.phone.replace(/[^\d+]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  
  function reset() {
    form.firstName = '';
    form.lastName = '';
    form.phoneNumber = '';
    form.email = '';
    form.password = '';
    Object.keys(touched).forEach(k => touched[k] = false);
    setMsg('', false);
  }
  
  function setMsg(m, okFlag){ message.value = m; ok.value = !!okFlag; }
  
  async function submit() {
    // mark fields touched to show errors
    touched.firstName = true;
    touched.lastName = true;
    touched.phoneNumber = true;
    touched.email = true;
  
    if (!canSubmit.value) {
      setMsg('Please fix the errors above.', false);
      return;
    }
  
    busy.value = true;
    setMsg('', false);
  
    try {
      // Adjust payload to your backend contract:
      // This example assumes /api/auth/register accepts:
      // { firstName, lastName, phone, email, password, role }
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: 'STUDENT'
      };
  
      await axios.post(`${API}/auth/register`, payload, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...tokenHeader() }
      });
  
      setMsg('Student account created successfully.', true);
      reset();
    } catch (e) {
      const msg = niceError(e);
      setMsg('Failed to create student: ' + msg, false);
    } finally {
      busy.value = false;
    }
  }
  
  function niceError(e){
    if (e?.response?.data) {
      if (typeof e.response.data === 'string') return e.response.data;
      try { return JSON.stringify(e.response.data); } catch { /* ignore */ }
    }
    return e?.message || String(e);
  }
  </script>
  
  <style scoped>
  .page{ background:#eef2f6; padding:14px; }
  .card{ background:#fff; border:1px solid #e6e8ee; border-radius:16px; padding:16px; margin-bottom:14px;
         box-shadow:0 1px 0 rgba(16,24,40,.02); }
  .header{ display:flex; align-items:center; justify-content:space-between; }
  .header h1{ font-size:28px; font-weight:700; color:#1f2937; margin:0; }
  
  .sect-head{ display:flex; flex-direction:column; gap:4px; margin-bottom:12px; }
  .sect-head h2{ margin:0; font-size:20px; color:#0f172a; }
  .muted{ color:#64748b; font-size:13px; }
  
  .form-grid{ display:grid; grid-template-columns: 1fr 1fr; gap:12px; }
  @media (max-width: 980px){ .form-grid{ grid-template-columns: 1fr; } }
  .field{ display:flex; flex-direction:column; gap:6px; }
  .label{ font-weight:700; color:#111827; margin-bottom:2px; }
  
  .input{
    width:100%; border:1px solid #cbd5e1; border-radius:10px; padding:10px 12px; background:#fff; color:#0f172a;
    font-size:14px; outline:none;
  }
  .input:focus{ border-color:#93c5fd; box-shadow:0 0 0 3px rgba(59,130,246,.2); }
  
  .password{ display:flex; align-items:center; gap:8px; }
  .peek{ border:1px solid #cbd5e1; background:#f8fafc; border-radius:8px; padding:6px 10px; cursor:pointer; font-size:12px; }
  
  .hints{ list-style:none; padding:0; margin:6px 0 0 0; display:grid; gap:2px; color:#64748b; font-size:12px; }
  .hints li.ok{ color:#16a34a; }
  
  .tiny{ font-size:12px; color:#64748b; }
  .tiny.err{ color:#dc2626; }
  
  .actions{ display:flex; gap:10px; justify-content:flex-end; margin-top:12px; }
  
  .btn{ border:1px solid #cbd5e1; background:#fff; color:#0f172a; padding:10px 14px; border-radius:10px; font-weight:600; cursor:pointer; }
  .btn.primary{ background:#facc15; border-color:#eab308; }
  .btn.ghost{ background:#f8fafc; }
  .btn:disabled{ opacity:.6; cursor:not-allowed; }
  
  .msg{ margin-top:8px; font-size:14px; }
  .msg.ok{ color:#16a34a; }
  .msg.err{ color:#dc2626; }
  </style>
  