<template>
    <!-- Use :name to pick an icon -->
    <svg v-if="name==='home'" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 11l8-7 8 7v8a2 2 0 0 1-2 2h-4v-6H10v6H6a2 2 0 0 1-2-2z" fill="currentColor"/>
    </svg>
  
    <svg v-else-if="name==='list'" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16v2H4zM4 11h16v2H4zM4 16h16v2H4z" fill="currentColor"/>
    </svg>
  
    <svg v-else-if="name==='student'" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l10 5-10 5L2 8l10-5zm0 7l6.5-3.25M4 13.5a8 4 0 1016 0" stroke="currentColor" stroke-width="2" fill="none"/>
    </svg>
  
    <svg v-else-if="name==='teacher'" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12a4 4 0 100-8 4 4 0 000 8zM3 21a9 9 0 0118 0" fill="none" stroke="currentColor" stroke-width="2"/>
    </svg>
  
    <svg v-else-if="name==='settings'" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 8a4 4 0 100 8 4 4 0 000-8zm7.4 4a7.4 7.4 0 01-.1 1l2.1 1.6-2 3.4-2.5-1a7.7 7.7 0 01-1.7 1l-.4 2.6H9.2l-.4-2.6a7.7 7.7 0 01-1.7-1l-2.5 1-2-3.4L4.7 13a7.4 7.4 0 010-2L2.6 9.4l2-3.4 2.5 1c.5-.37 1.1-.7 1.7-1l.4-2.6h3.6l.4 2.6c.6.3 1.2.63 1.7 1l2.5-1 2 3.4L19.3 11c.1.32.1.66.1 1z" fill="currentColor"/>
    </svg>
  
    <svg v-else-if="name==='signout'" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 17l-1.5-1.5L12 12 8.5 8.5 10 7l5 5-5 5zM4 4h7v2H6v12h5v2H4z" fill="currentColor"/>
    </svg>
  </template>
  
  <script setup>
  defineProps({ name: { type: String, required: true } });
  </script>
  
  <style scoped>
  svg{ width:22px; height:22px; display:block; }
  </style>




<template>
  
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import axios from 'axios';


</script>

<style scoped>
</style>

  