<template>
    <div class="page">
      <!-- Header -->
      <div class="card header">
        <h1>Settings</h1>
        <div class="header-actions"></div>
      </div>
  
      <div class="grid">
        <!-- Account Info -->
        <section class="card">
          <div class="sect-head">
            <h2>Account information</h2>
            <span class="muted">View or update your profile details.</span>
          </div>
  
          <div v-if="loadingMe" class="loading">Loading your info…</div>
          <template v-else>
            <div class="form-grid">
              <div class="field">
                <div class="label">Full name</div>
                <input v-model="meForm.firstName" class="input" placeholder="Your name" maxlength="120" />
              </div>
  
              <div class="field">
                <div class="label">Username</div>
                <input v-model="meForm.username" class="input" readonly />
              </div>
  
              <div class="field">
                <div class="label">Email</div>
                <input v-model="meForm.email" class="input" type="email" placeholder="you@example.com" />
              </div>
  
              <div class="field">
                <div class="label">Role</div>
                <input v-model="meForm.role.name" class="input" readonly />
              </div>
  
              <div class="field">
                <div class="label">Member since</div>
                <input :value="formatDate(meForm.createdAt)" class="input" readonly />
              </div>
            </div>
  
            <div class="actions">
              <button class="btn ghost" :disabled="busy || !dirtyInfo" @click="resetInfo">Reset</button>
              <button class="btn primary" :disabled="busy || !dirtyInfo" @click="saveInfo">
                {{ busy ? 'Saving…' : 'Save changes' }}
              </button>
            </div>
  
            <p v-if="infoMsg" :class="['msg', infoOk ? 'ok' : 'err']">{{ infoMsg }}</p>
          </template>
        </section>
  
        <!-- Change Password -->
        <section class="card">
          <div class="sect-head">
            <h2>Change password</h2>
            <span class="muted">Use a strong password you haven’t used elsewhere.</span>
          </div>
  
          <div class="form-grid pass">
            <div class="field">
              <div class="label">Current password</div>
              <div class="password">
                <input :type="show.cur ? 'text' : 'password'" v-model="passForm.current" class="input" autocomplete="current-password" />
                <button class="peek" @click="show.cur=!show.cur" type="button">{{ show.cur ? 'Hide' : 'Show' }}</button>
              </div>
            </div>
  
            <div class="field">
              <div class="label">New password</div>
              <div class="password">
                <input :type="show.new ? 'text' : 'password'" v-model="passForm.newPass" class="input" autocomplete="new-password" />
                <button class="peek" @click="show.new=!show.new" type="button">{{ show.new ? 'Hide' : 'Show' }}</button>
              </div>
              <ul class="hints">
                <li :class="{ ok: passForm.newPass.length >= 8 }">At least 8 characters</li>
                <li :class="{ ok: /[A-Z]/.test(passForm.newPass) }">One uppercase letter</li>
                <li :class="{ ok: /[a-z]/.test(passForm.newPass) }">One lowercase letter</li>
                <!-- If you want Unicode digits, replace /\d/ with /\p{Nd}/u everywhere -->
                <li :class="{ ok: /\d/.test(passForm.newPass) }">One number</li>
              </ul>
            </div>
  
            <div class="field">
              <div class="label">Confirm new password</div>
              <div class="password">
                <input :type="show.cfm ? 'text' : 'password'" v-model="passForm.confirm" class="input" autocomplete="new-password" />
                <button class="peek" @click="show.cfm=!show.cfm" type="button">{{ show.cfm ? 'Hide' : 'Show' }}</button>
              </div>
              <div class="tiny" :class="{ ok: passMatch, err: !passMatch && passForm.confirm }">
                {{ passForm.confirm ? (passMatch ? 'Passwords match' : 'Passwords do not match') : '' }}
              </div>
            </div>
          </div>
  
          <div class="actions">
            <button class="btn primary" :disabled="busy || !canSubmitPass" @click="changePassword">
              {{ busy ? 'Updating…' : 'Update password' }}
            </button>
          </div>
  
          <p v-if="passMsg" :class="['msg', passOk ? 'ok' : 'err']">{{ passMsg }}</p>
        </section>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref, computed, onMounted } from 'vue';
  import axios from 'axios';
  
  const API = 'https://satelliteback.onrender.com';
  
  const busy = ref(false);
  
  /* =========================
     Auth header
  ========================= */
  const tokenHeader = () => {
    const t = sessionStorage.getItem('token');
    return t ? { Authorization: `Bearer ${t}` } : {};
  };
  
  /* =========================
     Account info
  ========================= */
  const loadingMe = ref(true);
  const originalMe = ref(null);
  const meForm = reactive({
    id: null,
    username: '',
    fullName: '',
    email: '',
    role: '',
    createdAt: ''
  });
  
  const infoMsg = ref('');
  const infoOk = ref(false);
  
  const dirtyInfo = computed(() => {
    if (!originalMe.value) return false;
    return (
      meForm.fullName !== (originalMe.value.fullName || '') ||
      meForm.email !== (originalMe.value.email || '')
    );
  });
  
  function resetInfo() {
    if (!originalMe.value) return;
    meForm.fullName = originalMe.value.fullName || '';
    meForm.email = originalMe.value.email || '';
  }
  
  async function loadMe() {
    loadingMe.value = true;
    setInfoMsg('', false);
    try {
      const res = await axios.get(`${API}/auth/me`, {
        headers: { Accept: 'application/json', ...tokenHeader() }
      });
      const me = res.data || {};
      console.log(me)
      originalMe.value = me;
      meForm.id = me.id ?? null;
      meForm.username = me.username ?? '';
      meForm.fullName = me.firstName?? '';
      meForm.email = me.email ?? '';
      meForm.role = me.role ?? '';
      meForm.createdAt = me.createdAt ?? '';
    } catch (e) {
      setInfoMsg('Failed to load account info: ' + niceError(e), false);
    } finally {
      loadingMe.value = false;
    }
  }
  
  async function saveInfo() {
    setInfoMsg('', false);
    busy.value = true;
    try {
      const body = {
        fullName: meForm.fullName?.trim() || '',
        email: meForm.email?.trim() || ''
      };
      await axios.put(`${API}/auth/me`, body, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...tokenHeader() }
      });
      setInfoMsg('Profile updated.', true);
      await loadMe();
    } catch (e) {
      setInfoMsg('Failed to update profile: ' + niceError(e), false);
    } finally {
      busy.value = false;
    }
  }
  
  /* =========================
     Change password
  ========================= */
  const passForm = reactive({
    current: '',
    newPass: '',
    confirm: ''
  });
  const show = reactive({ cur: false, new: false, cfm: false });
  
  const passMsg = ref('');
  const passOk = ref(false);
  
  const passMatch = computed(() => !!passForm.confirm && passForm.confirm === passForm.newPass);
  const passStrongEnough = computed(() =>
    passForm.newPass.length >= 8 &&
    /[A-Z]/.test(passForm.newPass) &&
    /[a-z]/.test(passForm.newPass) &&
    /\d/.test(passForm.newPass)       // <-- fixed (no double escape)
    // If you want Unicode digits instead: /\p{Nd}/u.test(passForm.newPass)
  );
  const canSubmitPass = computed(() =>
    !!passForm.current && passStrongEnough.value && passMatch.value && !busy.value
  );
  
  async function changePassword() {
    setPassMsg('', false);
    if (!canSubmitPass.value) return;
  
    busy.value = true;
    try {
      await axios.post(
        `${API}/auth/change-password`,
        {
          currentPassword: passForm.current,
          newPassword: passForm.newPass
        },
        { headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...tokenHeader() } }
      );
      setPassMsg('Password changed successfully.', true);
      passForm.current = '';
      passForm.newPass = '';
      passForm.confirm = '';
    } catch (e) {
      setPassMsg('Failed to change password: ' + niceError(e), false);
    } finally {
      busy.value = false;
    }
  }
  
  /* =========================
     Helpers
  ========================= */
  function setInfoMsg(m, ok) { infoMsg.value = m; infoOk.value = !!ok; }
  function setPassMsg(m, ok) { passMsg.value = m; passOk.value = !!ok; }
  function niceError(e){
    if (e?.response?.data) {
      if (typeof e.response.data === 'string') return `${e.response.status} ${e.response.statusText}: ${e.response.data}`;
      try { return JSON.stringify(e.response.data); } catch { /* ignore */ }
    }
    return e?.message || String(e);
  }
  function formatDate(d){
    if (!d) return '';
    try { return new Date(d).toLocaleString(); } catch { return String(d); }
  }
  
  onMounted(loadMe);
  </script>
  
  <style scoped>
  .page{ background:#eef2f6; padding:14px; }
  .card{ background:#fff; border:1px solid #e6e8ee; border-radius:16px; padding:16px; margin-bottom:14px;
         box-shadow:0 1px 0 rgba(16,24,40,.02); }
  .header{ display:flex; align-items:center; justify-content:space-between; }
  .header h1{ font-size:28px; font-weight:700; color:#1f2937; margin:0; }
  .header-actions{ display:flex; gap:10px; }
  
  .grid{ display:grid; grid-template-columns: 1fr 1fr; gap:14px; }
  @media (max-width: 980px){ .grid{ grid-template-columns: 1fr; } }
  
  .sect-head{ display:flex; flex-direction:column; gap:4px; margin-bottom:12px; }
  .sect-head h2{ margin:0; font-size:20px; color:#0f172a; }
  .muted{ color:#64748b; font-size:13px; }
  
  .form-grid{ display:grid; grid-template-columns: 1fr 1fr; gap:12px; }
  .form-grid.pass{ grid-template-columns: 1fr; }
  .field{ display:flex; flex-direction:column; gap:6px; }
  .label{ font-weight:700; color:#111827; margin-bottom:2px; }
  
  .input{
    width:100%; border:1px solid #cbd5e1; border-radius:10px; padding:10px 12px; background:#fff; color:#0f172a;
    font-size:14px; outline:none;
  }
  .input:focus{ border-color:#93c5fd; box-shadow:0 0 0 3px rgba(59,130,246,.2); }
  
  .password{ position:relative; display:flex; align-items:center; gap:8px; }
  .password .peek{ border:1px solid #cbd5e1; background:#f8fafc; border-radius:8px; padding:6px 10px; cursor:pointer; font-size:12px; }
  
  .hints{ list-style:none; padding:0; margin:6px 0 0 0; display:grid; gap:2px; color:#64748b; font-size:12px; }
  .hints li.ok{ color:#16a34a; }
  .tiny{ font-size:12px; margin-top:4px; color:#64748b; }
  .tiny.ok{ color:#16a34a; }
  .tiny.err{ color:#dc2626; }
  
  .actions{ display:flex; gap:10px; justify-content:flex-end; margin-top:12px; }
  
  .btn{ border:1px solid #cbd5e1; background:#fff; color:#0f172a; padding:10px 14px; border-radius:10px; font-weight:600; cursor:pointer; }
  .btn.primary{ background:#facc15; border-color:#eab308; }
  .btn.ghost{ background:#f8fafc; }
  .btn:disabled{ opacity:.6; cursor:not-allowed; }
  
  .loading{ color:#64748b; text-align:left; }
  
  .msg{ margin-top:8px; font-size:14px; }
  .msg.ok{ color:#16a34a; }
  .msg.err{ color:#dc2626; }
  </style>
  