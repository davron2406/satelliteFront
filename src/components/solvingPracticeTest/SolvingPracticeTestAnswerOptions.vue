
<template>
  <div class="answer-options">
    <div class="options-container">
      <div
        v-for="option,index in options"
        :key="option.id"
        class="option"
        :class="{selected: option.id == selectedAnswerId}"
        @click="selectOption(option.id)"
      >
        <div class="option-label">{{ String.fromCharCode(index + 65) }}</div>
        <div class="option-text">{{ option.answerText }}</div>
      </div>
    </div>
  </div>
</template>

<script >
  export default{
    data(){
      return{
        selectedAnswerId: "",
      }
    },

    props:{
       options: {
       }
    },

    methods: {
      selectOption(id){
        console.log(id + "Working")
        this.selectedAnswerId = id;
        this.$emit("select", id);
      }
    },

    computed: {
      letters(num){
        console.log(num)
        return String.fromCharCode(64 + num);
      }
    }
  }
</script>

<style scoped>
.answer-options {
  padding: 1.5rem;
  background-color: white;
  height: 100%;
}

.options-container {
  max-width: 480px;
}

.option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.option:hover {
  border-color: #9ca3af;
  background-color: #f9fafb;
}

.option.selected {
  border-color: #4f46e5;
  background-color: #f5f3ff;
}

.option-label {
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #9ca3af;
  border-radius: 50%;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
}

.selected .option-label {
  background-color: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.option-text {
  font-size: 0.875rem;
  color: #1f2937;
}
</style>