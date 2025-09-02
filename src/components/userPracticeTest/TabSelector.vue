<script>
export default{
  data(){
    return{

    }
  },

  methods:{
    toggleTab(tab){
      this.$emit('update:activeTab', tab)
    }
  },

  props: {
    activeTab: {
      type: String,
      required: true
    }
  }
}
</script>

<template>
  <div class="tabs">
    <button 
      :class="['tab-btn', activeTab === 'active' ? 'active' : '']"
      @click="toggleTab('active')"
    >
      Active
    </button>
    <button 
      :class="['tab-btn', activeTab === 'past' ? 'active' : '']"
      @click="toggleTab('past')"
    >
      Past
    </button>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: 0.5rem;
  background-color: #f5f5f5;
  padding: 0.25rem;
  border-radius: 8px;
}

.tab-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: none;
  cursor: pointer;
  font-weight: 500;
}

.tab-btn.active {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>