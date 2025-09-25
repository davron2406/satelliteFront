<template>
  <div class="layout">
    <!-- Sidebar -->
    <Sidebar
      :user="user"
      :loading="loading"
      :collapsed="collapsed"
      @toggle="collapsed = !collapsed"
      @signout="signOut"
    />

    <!-- Main area -->
    <DashboardMain></DashboardMain>
  </div>
</template>

<script setup>
import { onMounted, ref,watch } from 'vue';
import Sidebar from './Sidebar.vue';
import DashboardMain from './DashboardMain.vue';
// import DashboardHeader from './DashboardHeader.vue' // if you render it here

// If you already have a tokenHeader() util, import it; else use the inline getHeaders below.
// import { tokenHeader } from '@/utils/auth';


const loading = ref(true);
const error = ref(null);
const collapsed = ref(getInitialCollapsed());

function getInitialCollapsed() {
  try {
    return localStorage.getItem('sidebar:collapsed') === '1';
  } catch { return false; }
}

function persistCollapsed() {
  try {
    localStorage.setItem('sidebar:collapsed', collapsed.value ? '1' : '0');
  } catch {}
}





function signOut() {
  // Wire your real signout here (revoke token, redirect, etc.)
  // Example:
  // await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  localStorage.removeItem('access_token');
  window.location.href = '/login';
}


onMounted(() => {
  console.log("it is working parent")
});

// persist sidebar collapsed state
watch(collapsed, persistCollapsed);
</script>

<style scoped>
.layout{
  display:grid;
  grid-template-columns: 260px 1fr;
  min-height:100vh;
  background:#eef2f6;
}

.content{
  padding: 20px;
  min-height: 100%;
}

.state{
  display: grid;
  place-items: center;
  padding: 48px 16px;
  border: 1px dashed #c9d3e0;
  border-radius: 12px;
  background: #f7f9fc;
  font-size: 14px;
}
.state--loading{ opacity: .8; }
.state--error{ color: #b00020; }

.btn{
  margin-top: 12px;
  border: none;
  padding: 10px 14px;
  border-radius: 10px;
  background: #2b6cb0;
  color: #fff;
  cursor: pointer;
}

@media (max-width: 1280px){
  .layout{ grid-template-columns: 220px 1fr; }
}
@media (max-width: 1024px){
  .layout{ grid-template-columns: 80px 1fr; }
}
@media (max-width: 640px){
  .content{ padding: 14px; }
}
</style>
