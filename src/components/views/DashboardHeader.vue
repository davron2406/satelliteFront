<template>
    <header class="header">
      <h1>Dashboard</h1>
      <div class="user">
        <div class="avatar" :style="avatarStyle">{{ initials }}</div>
        <div class="meta">
          <div class="name">{{ user.name }}</div>
          <div class="role">{{ user.role.name }}</div>
        </div>
      </div>
    </header>
  </template>
  
  <script setup>
const API = import.meta.env.VITE_API;

  const props = defineProps({
    user: { type: Object, default: () => ({ name: 'Davron', role: 'Student', color: '#2f6fed' }) }
  });
  const initials = (props.user.name || 'U').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  const avatarStyle = `background:${props.user.color};`;
  </script>
  
  <style scoped>
  .header{
    height: 72px; background:#ffffff; border-radius: 12px;
    display:flex; align-items:center; justify-content:space-between;
    padding: 0 20px; box-shadow: 0 4px 20px rgba(0,0,0,.05);
  }
  h1{ font-size:28px; font-weight:800; letter-spacing:.2px; color:#0b1522;}
  .user{ display:flex; align-items:center; gap:12px;}
  .avatar{
    width:40px; height:40px; border-radius:999px; color:#fff; display:grid; place-items:center;
    font-weight:700; letter-spacing:.5px;
  }
  .meta{ line-height:1.1 }
  .name{ font-weight:700; color:#0b1522 }
  .role{ font-size:12px; color:#7b8798 }
  </style>
  