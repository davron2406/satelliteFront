
<template>
  <div class="answer-options">
    <div class="options-container">
      <div
        v-for="option,index in options"
        :key="option.id"
        class="option"
        :class="{selected: option.id == answeredQuestion.selectedAnswerId}"
        @click="selectOption(option.id)"
      >
        <div style="display: flex;gap: 20px;">
          <div class="option-label">{{ String.fromCharCode(index + 65) }}</div>
          <div class="option-text"><p>{{ option.answerText }}</p>
          </div>
        </div>

        <div class="answer-img"><img :src="option.answerImage?.fileUrl" alt=""></div>
      </div>
    </div>
  </div>
</template>

<script >
  export default{
    data(){
      return{
        answeredQuestion:{},
      }
    },

    props:{
       options: {
       },

       selectedAnswerId:{},
       questionId:{},
       practiceTestId: {},
    },

    methods: {
      selectOption(id){
        console.log(id + "Working")
        this.answeredQuestion.selectedAnswerId = id;
        this.$emit("select", id);
      },

      async getAnsweredQuestion(){
        console.log(this.questionId)
        const response = await this.$axios("/answeredQuestion/getAnsweredQuestionByPracticeTestIdAndQuestionId/" + this.practiceTestId +"/" + this.questionId, {headers: {'Authorization' : 'Bearer ' + localStorage.getItem('token')}})
        console.log(response)
        this.answeredQuestion = response.data.data
      }
    },

    watch:{
      questionId(newVal){
        if(newVal){
          this.getAnsweredQuestion();
        }
      }
    },

    computed: {
    }
  }
</script>

<style>
.answer-options {
  padding: 1.5rem;
  background-color: white;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  padding: 30px;
}

.options-container {
  /* max-width: 480px; */
  width: 100%;
  height: 100%;
}

.option {
  display: flex;
  align-items: start;
  flex-direction: column;
  gap: 2rem;
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
  width: 30px;
  height: 30px;
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
  display: flex;
  flex-direction: column;
}

.answer-img{
  width: 100%;
  display: flex;
  justify-content: center;
}

.answer-img img{
  width: 60%;
}
</style>