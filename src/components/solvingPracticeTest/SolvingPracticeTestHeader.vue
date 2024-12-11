<script setup lang="ts">
interface Props {
  section: string;
  module: string;
  timeRemaining: string;
  batteryLevel: number;
}

defineProps<Props>();
</script>

<template>
  <header class="test-header">
    <div class="left-section">
      <h1>{{ section }}</h1>
      <div class="module-info">
        <h2>{{ module }}</h2>
        <button class="directions-btn">Directions ▼</button>
      </div>
    </div>
    <div class="center-section">
      <div class="practice-badge">THIS IS A PRACTICE TEST</div>
    </div>
    <div class="right-section">
      <div class="time">{{ timeRemaining }}</div>
      <div class="battery">
        <div class="battery-icon">
          <div class="battery-level" :style="{ width: `${batteryLevel}%` }"></div>
        </div>
        <span class="battery-text">{{ batteryLevel }}%</span>
      </div>
      <div class="actions">
        <button class="icon-btn">✏️</button>
        <button class="icon-btn">📝</button>
        <button class="icon-btn">⋮</button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  height: 64px;
}

.left-section h1 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.module-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.25rem;
}

.left-section h2 {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: normal;
  margin: 0;
}

.directions-btn {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
}

.practice-badge {
  background-color: #1e293b;
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.time {
  font-size: 0.875rem;
  color: #1f2937;
  font-weight: 500;
}

.battery {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.battery-icon {
  width: 24px;
  height: 12px;
  border: 1.5px solid #9ca3af;
  border-radius: 2px;
  padding: 1px;
  position: relative;
}

.battery-level {
  height: 100%;
  background-color: #22c55e;
  border-radius: 1px;
}

.battery-text {
  font-size: 0.75rem;
  color: #6b7280;
}

.actions {
  display: flex;
  gap: 1rem;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #6b7280;
  padding: 0.25rem;
}

.icon-btn:hover {
  color: #1f2937;
}
</style>