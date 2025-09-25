<template>
  <main class="main">
    <header class="topbar">
      <h1>{{ pageTitle }}</h1>
      <div class="user">
        <div class="avatar">{{ user?.firstName?.charAt(0) || 'U' }}</div>  <!-- Display first initial or fallback -->
        <div class="user-text">
          <div class="name">{{ user?.firstName || 'Guest' }}</div>   <!-- Display firstName if available -->
          <small class="role">{{ user?.role.name || 'Unknown' }}</small>     <!-- Display role if available -->
        </div>
      </div>
    </header>

    <!-- CONTENT FOR (changes with router) -->
    <section class="content-for">
      <router-view></router-view>
      <slot />   <!-- <router-view/> is injected here by DashboardLayout -->
    </section>
  </main>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const user = ref(null); // Holds the user data
const error = ref(null); // Holds any error message

const route = useRoute();
const pageTitle = computed(() => route.meta.title ?? 'Dashboard');

// Fetch headers, including the token for authentication
async function getHeaders() {
  const token = sessionStorage.getItem('token');  // Retrieve token from sessionStorage
  const headers = { 'Accept': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// Fetch the current user data from the API
async function fetchCurrentUser() {
  try {
    const headers = await getHeaders();
    const resp = await fetch('https://satelliteback.onrender.com/api/auth/me', {
      method: 'GET',
      headers,
      credentials: 'include',
    });
    
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    
    user.value = await resp.json(); // Populate user data
  } catch (e) {
    error.value = e?.message || 'Unknown error';
    user.value = null; // Reset user if there's an error
  }
}

// Fetch user data when the component is mounted
onMounted(() => {
  fetchCurrentUser();
});
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* Top bar styling */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border: 1px solid #e6e8ee;
  border-radius: 16px;
  margin: 16px;
  padding: 14px 18px;
  box-shadow: 0 1px 0 rgba(16, 24, 40, .02);
}
.topbar h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
}
.user {
  display: flex;
  gap: 10px;
  align-items: center;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: #3b82f6;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}
.user-text .name {
  font-weight: 700;
  color: #0f172a;
  line-height: 1.1;
}
.user-text .role {
  color: #64748b;
}

/* Content card styling */
.content-for {
  background: #fff;
  border: 1px solid #e6e8ee;
  border-radius: 16px;
  box-shadow: 0 1px 0 rgba(16, 24, 40, .02);
  margin: 0 16px 16px;
  padding: 16px;
  min-height: calc(100vh - 140px);
}
</style>
