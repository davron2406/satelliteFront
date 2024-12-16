<template>
    <div>You answered {{ finishedPracticeTest.correctAnswersNumber }} correctly out of {{ finishedPracticeTest.questionsNumber }} </div>
    <div>Do you want to review your test 
        <button @click="review">Review</button>
    </div>  

    <ReviewingPracticeTest 
    :answeredQuestions="finishedPracticeTest.answeredQuestions" 
    v-if="isReviewingOpen"
    :solvedPracticeTestId="this.solvedPracticeTestId">

    </ReviewingPracticeTest>
</template>

<script>
    import ReviewingPracticeTest from "./ReviewingPracticeTest.vue"
    export default{
        data(){
            return{
                finishedPracticeTest: {},
                isReviewingOpen: false,
            }
        },

        components:{
            ReviewingPracticeTest
        },

        methods: {
            async finishTest(){
                const response = await this.$axios.get("/solvedPracticeTest/finishAndGetDetails/" + this.solvedPracticeTestId, {headers: {'Authorization' : 'Bearer ' + localStorage.getItem('token')}})
                this.finishedPracticeTest = response.data.data;
                console.log(this.finishedPracticeTest)
            },

            review(){
                this.isReviewingOpen = true;
            }
        },
    
        computed: {
            solvedPracticeTestId(){
                return this.$route.params.solvedPraticeTestId;
            }   
        },

        mounted(){
            this.finishTest()
        }
    }

</script>

<style>

</style>