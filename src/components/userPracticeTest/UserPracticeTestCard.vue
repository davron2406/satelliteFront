<script>
export default{
  data(){
    return{

    }
  },

  props: {
    test: {}
  }
}
</script>

<template>
  <div class="practice-card">
    <div class="card-header">
      <h2>{{ this.test.name }}</h2>
      <button class="trash-btn">
        <span class="material-icons">delete_outline</span>
      </button>
    </div>
    <div class="completion-status">
      <span class="check-icon">✓</span>
      <span>Completed</span>
    </div>
    <a href="#" class="view-responses">View My Responses</a>
  </div>
</template>

<style>
.practice-card {
  background: #fff;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.trash-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
}

.trash-btn:hover {
  background-color: #f5f5f5;
}

.completion-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #2e7d32;
}

.check-icon {
  font-weight: bold;
}

.view-responses {
  display: block;
  text-decoration: none;
  color: #000;
  font-weight: 500;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.view-responses:hover {
  color: #0066cc;
}
</style>