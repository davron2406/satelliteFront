
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
        :questionId = "this.currentQuestion.questionId"
        :practiceTestId="this.solvedPracticeTestId"
        @select="selectAnswer"
      /> 
    </div>

    <SolvingPracticeTestFooter
      @nextQuestion="nextQuestion()" 
      @finishTest="finishTest()"
      @getExactQuestion="getExactQuestion"
      :currentQuestionNumber="this.currentQuestionNumber"
      :totalQuestionNumber = "this.totalQuestionNumber"
      :isTestFinish="currentQuestionNumber  == practiceTestQuestionIds.length"
      >
    </SolvingPracticeTestFooter>

    <LoadPage v-if="isLoadOpen"></LoadPage>
  </div>
</template>

<script>
import Header from './SolvingPracticeTestHeader.vue'; 
import QuestionContent from './SolvingPracticeTestQuestion.vue';
import AnswerOptions from './SolvingPracticeTestAnswerOptions.vue';
import SolvingPracticeTestFooter from './SolvingPracticeTestFooter.vue';
import LoadPage from "../utils/LoadPage.vue"

  export default{
    data(){
      return{
        currentQuestionNumber: 1,
        totalQuestionNumber: 0,
        currentQuestion:{
        },
        practiceTestQuestionIds: [],
        selectedAnswerId: "",
        isLoadOpen: false
      }
    },

    components: {
      Header,
      QuestionContent,
      AnswerOptions,
      SolvingPracticeTestFooter,
      LoadPage
    },

    methods: {
      async getPracticeTestQuestions(){
        this.isLoadOpen = true;
        const response = await this.$axios.get("/solvedPracticeTest/getQuestionIds/" + this.solvedPracticeTestId, {headers: {'Authorization' : 'Bearer ' + localStorage.getItem('token')}})
        this.practiceTestQuestionIds = response.data.data;
        this.totalQuestionNumber = this.practiceTestQuestionIds.length
        this.getQuestionAndAnswers(this.practiceTestQuestionIds[0])
        this.isLoadOpen = false
      },

      async getQuestionAndAnswers(questionId){
        const response = await this.$axios.get("/question/getQuestion/" + questionId, {headers: {'Authorization' : 'Bearer ' + localStorage.getItem('token')}})
        this.currentQuestion = response.data.data;
        console.log(this.currentQuestion.questionId)
      },

      nextQuestion(){
          this.getQuestionAndAnswers(this.practiceTestQuestionIds[this.currentQuestionNumber])
          this.currentQuestionNumber = this.currentQuestionNumber + 1
      },

      getExactQuestion(index){
        this.saveAnswer();
        this.getQuestionAndAnswers(this.practiceTestQuestionIds[index-1])
        this.currentQuestionNumber = index
      },

      selectAnswer(id){
        this.selectedAnswerId=id;
        this.saveAnswer()
        this.selectedAnswerId = ""
      },

      async saveAnswer(){
        if(this.selectedAnswerId){
          let savingQuestion = {}
          savingQuestion.questionId = this.currentQuestion.questionId;
          savingQuestion.selectedAnswerId = this.selectedAnswerId;
          savingQuestion.solvedPracticeTestId = this.solvedPracticeTestId;
          console.log(savingQuestion)
          const response = await this.$axios.post("/answeredQuestion/editAnswer", savingQuestion, {headers: {'Authorization' : 'Bearer ' + localStorage.getItem('token')}})  
        }
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

    created(){
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