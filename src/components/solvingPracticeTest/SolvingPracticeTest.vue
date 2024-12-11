
<template>
  <div class="practice-test">
    <Header
      section="Section 1, Module 1"
      module="Reading and Writing"
      timeRemaining="31:47"
      :batteryLevel="90"
    />
    <div class="test-content">
      <QuestionContent
        :questionNumber="currentQuestionNumber"
        :question="currentQuestion.questionText"
        :extra="currentQuestion.extra"
        :imageUrl="currentQuestion.imageUrl"
      />
      <AnswerOptions
        :options="currentQuestion.answers"
        :selectedOption="selectedOption"
        @select="selectAnswer"
      />
    </div>

    <SolvingPracticeTestFooter
      @nextQuestion="nextQuestion()" 
      @finishTest="finishTest()"
      :isTestFinish="currentQuestionNumber + 1 == practiceTestQuestionIds.length"
      >
    </SolvingPracticeTestFooter>
  </div>
</template>

<script>
import Header from './SolvingPracticeTestHeader.vue'; 
import QuestionContent from './SolvingPracticeTestQuestion.vue';
import AnswerOptions from './SolvingPracticeTestAnswerOptions.vue';
import SolvingPracticeTestFooter from './SolvingPracticeTestFooter.vue';

  export default{
    data(){
      return{
        currentQuestionNumber: 0,
        currentQuestion:{
        },
        practiceTestQuestionIds: [],
        selectedAnswerId: "",
        options : [
          { id: 'A', text: 'reduced' },
          { id: 'B', text: 'evaluated' },
          { id: 'C', text: 'determined' },
          { id: 'D', text: 'acquired' },
        ],
      }
    },

    components: {
      Header,
      QuestionContent,
      AnswerOptions,
      SolvingPracticeTestFooter
    },

    methods: {
      async getPracticeTestQuestions(){
        const response = await this.$axios.get("/solvedPracticeTest/getQuestionIds/" + this.solvedPracticeTestId, {headers: {'Authorization' : 'Bearer ' + localStorage.getItem('token')}})
        this.practiceTestQuestionIds = response.data.data;
        this.getQuestionAndAnswers(this.practiceTestQuestionIds[0])
        
      },

      async getQuestionAndAnswers(questionId){
        const response = await this.$axios.get("/question/getQuestion/" + questionId, {headers: {'Authorization' : 'Bearer ' + localStorage.getItem('token')}})
        this.currentQuestion = response.data.data;
      },

      nextQuestion(){
        if(this.currentQuestionNumber < this.practiceTestQuestionIds.length - 1){
          this.getQuestionAndAnswers(this.practiceTestQuestionIds[this.currentQuestionNumber + 1])
          this.currentQuestionNumber = this.currentQuestionNumber + 1
          this.saveAnswer()
        }
      },

      selectAnswer(id){
        console.log(id)
        this.selectedAnswerId=id;
      },

      async saveAnswer(){
        let savingQuestion = {}
        console.log(this.currentQuestion)
        savingQuestion.questionId = this.currentQuestion.questionId;
        savingQuestion.selectedAnswerId = this.selectedAnswerId;
        savingQuestion.solvedPracticeTestId = this.solvedPracticeTestId;
        console.log(savingQuestion)
        const response = await this.$axios.post("/answeredQuestion/editAnswer", savingQuestion, {headers: {'Authorization' : 'Bearer ' + localStorage.getItem('token')}})
      },

      async finishTest(){
        const respone = await this.$axios.get("/solvedPracticeTest/finishAndGetDetails/" + this.solvedPracticeTestId, {headers: {'Authorization' : 'Bearer ' + localStorage.getItem('token')}})
        console.log(respone);
        this.$router.push("/finishedPracticeTest/" + this.solvedPracticeTestId)
      }
    },

    computed: {
      solvedPracticeTestId(){
        return this.$route.params.practiceTestId;
      }
    },

    mounted(){
      this.getPracticeTestQuestions();
    }

   }
</script>

<style scoped>
.practice-test {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
}

.test-content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
}
</style>