<template>
  <aside :class="['sidebar', { collapsed }]">
    <!-- Brand Logo and Collapse Button -->
    <div class="brand">
      <div class="logo">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="10" width="4" height="10" rx="1" />
          <rect x="10" y="4" width="4" height="16" rx="1" />
          <rect x="17" y="14" width="4" height="6" rx="1" />
        </svg>
      </div>
      <span class="brand-text" v-if="!collapsed">Logo</span>
      <button class="collapse" @click="toggle" :title="collapsed ? 'Expand' : 'Collapse'">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <path :d="collapsed ? 'M15 18l-6-6 6-6' : 'M9 6l6 6-6 6'"/>
        </svg>
      </button>
    </div>

    <!-- Navigation Menu -->
    <nav class="menu">
      <RouterLink v-for="item in filteredItems" :key="item.to"
                  :to="item.to" class="link" active-class="active">
        <span class="icon" v-html="item.icon"></span>
        <span v-if="!collapsed" class="text">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="spacer"></div>

    <!-- Sign-out Button -->
    <button class="signout" :class="{center: collapsed}" @click="$emit('signout')">
      <span class="icon" v-html="exitIcon"></span>
      <span v-if="!collapsed">Sign out</span>
    </button>
  </aside>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
const API = import.meta.env.VITE_API;

const user1 = ref(null); // Holds the user data
const collapsed = ref(false);
const role = ref(''); // Store user role (e.g., 'admin', 'student', 'teacher')

onMounted(() => {
  collapsed.value = localStorage.getItem('sb_collapsed') === '1';
  fetchCurrentUser();
});

function toggle() {
  collapsed.value = !collapsed.value;
  localStorage.setItem('sb_collapsed', collapsed.value ? '1' : '0');
}

async function getHeaders() {
  const token = sessionStorage.getItem('token');  // Retrieve token from sessionStorage
  const headers = { 'Accept': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// Fetch the current user data from the API
async function fetchCurrentUser() {
  try {
   const saved = sessionStorage.getItem('user')



    user1.value = await JSON.parse(saved); // Populate user data
    role.value = user1.value.role;   // Set role from user data
  } catch (e) {
    user1.value = null;
    role.value = ''; // Reset role if there's an error
  }
}

// Menu items (default for all users)
const items = [
  { to: '/dashboard/overview', label: 'Overview', icon: home() },
  { to: '/dashboard/practice', label: 'Practice Tests', icon: list() },
  { to: '/dashboard/question', label: 'Ask a Question', icon: user() },
  { to: '/dashboard/practice-test-runner', label: 'Solve Practice Test', icon: doc() },
  { to: '/dashboard/classes', label: 'Classes', icon: doc() },
  { to: '/dashboard/test-results', label: 'Test Results', icon: doc() },
  { to: '/dashboard/students', label: 'Students', icon: doc() },
  { to: '/dashboard/settings', label: 'Settings', icon: gear() },
];

// Filtered menu items based on user role
const filteredItems = computed(() => {
  if (role.value.name === 'ADMIN') {
    return items; // Admin sees all menu items
  }
  if (role.value.name === 'TEACHER') {
    // Teachers see specific menu items
    return items.filter(item => item.to !== '/dashboard/practice-test-runner' && item.to !== '/dashboard/settings');
  }
  if (role.value.name === 'STUDENT') {
    // Students only see Solve Practice Test
    return items.filter(item => item.to === '/dashboard/practice-test-runner');
  }
  return []; // Default fallback if the role is unknown
});

// Icons for the menu items
const exitIcon = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M10 17l-5-5 5-5"/><path d="M15 12H5"/><path d="M19 21V3"/>
</svg>`;

function home() {
  return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M3 12l9-9 9 9"/><path d="M9 21V9h6v12"/>
  </svg>`;
}

function list() {
  return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/>
    <circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>
  </svg>`;
}

function user() {
  return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="7" r="4"/><path d="M5.5 21a8.5 8.5 0 0113 0"/>
  </svg>`;
}

function doc() {
  return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <path d="M14 2v6h6"/>
  </svg>`;
}

function gear() {
  return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33"/>
  </svg>`;
}
</script>

<style scoped>
.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  background: #0b1220;
  color: #e8eef7;
  border-right: 1px solid #0f1a2e;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 260px;
  transition: width 0.3s ease-in-out;
}

.collapsed {
  width: 80px;
}

.brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
}

.brand .logo {
  flex-grow: 0;
}

.brand-text {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}

.collapse {
  background: transparent;
  border: none;
  cursor: pointer;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.menu .link {
  display: flex;
  align-items: center;
  color: #e8eef7;
  font-size: 16px;
  text-decoration: none;
}

.menu .link:hover {
  background-color: #1c2736;
  border-radius: 5px;
  padding: 8px;
}

.menu .icon {
  margin-right: 10px;
  width: 20px;
  height: 20px;
}

.signout {
  margin-top: auto;
  background-color: #e8eef7;
  color: #0b1220;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
}

.signout.center {
  text-align: center;
}

.spacer {
  flex-grow: 1;
}
</style>
