<template>
    <div class="reviewing-practice-test">
        <ul>
            <li v-for="answeredQuestion, index in answeredQuestions"  
            :class="{correct: answeredQuestion.correctAnswerId == answeredQuestion.selectedAnswerId, incorrect: answeredQuestion.correctAnswerId != answeredQuestion.selectedAnswerId}"
            @click="getExactQuestion(index)">
                <p >{{ index + 1 }}</p>
            </li>
        </ul>

        <div style="display: flex; ">
            <div class="question-content" style="width: 50%">
                <div class="question-header">
                <div class="question-info">
                    <span class="number">{{ questionNumber }}</span>
                    <!-- <button class="bookmark-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                    </button>
                    <span class="mark-review">Mark for Review</span> -->
                </div>
                </div>
                <div class="content">
                {{ currentQuestion.questionText }}
                </div>

                <div v-if="currentQuestion.extra != null">
                {{ currentQuestion.extra }}
                </div>

                <div class="questionImage">
                    <img :src="imageUrl" v-if="currentQuestion.imageUrl != null" alt="">
                </div>
            </div>

            <div class="answer-options" style="width:50%">
                <div class="options-container">
                <div
                    v-for="option,index in currentQuestion.answers"
                    :key="option.id"
                    class="option"
                    :class="{correct: option.id == correctAnswerId , incorrect: option.id == selectedAnswerId && selectedAnswerId != correctAnswerId }"
                >
                    <div style="display: flex; gap: 20px;">   
                        <div class="option-label">{{ String.fromCharCode(index + 65) }}</div>
                        <div class="option-text">{{ option.answerText }}</div>
                    </div>
                </div>
                </div>
            </div>
        </div>

        <div class="reviewing-footer">
            <div class="btns">
                <button class="back-btn" @click="backToHome()">Home Page</button>
                <button class="next-btn" @click="nextQuestion">Next</button>
            </div>
        </div>
    </div>

</template>

<script>
    export default{
        data(){
            return{
                questionNumber: 1,
                practiceTestQuestionIds: {},
                currentQuestion: {},
                selectedAnswerId: "",
                correctAnswerId: "",
            }
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
                console.log(this.currentQuestion)
                this.answeredQuestions.forEach(answeredQuestion => {
                    if(answeredQuestion.questionId == questionId){
                        this.selectedAnswerId = answeredQuestion.selectedAnswerId
                        this.correctAnswerId = answeredQuestion.correctAnswerId
                    }
                });

                console.log(this.selectedAnswerId)
                console.log(this.correctAnswerId)
            },

            nextQuestion(){
                this.getQuestionAndAnswers(this.practiceTestQuestionIds[this.questionNumber])
                this.questionNumber = this.questionNumber + 1
            },

            getExactQuestion(index){
                this.getQuestionAndAnswers(this.practiceTestQuestionIds[index]);
                this.questionNumber = index + 1
            },

            backToHome(){
                this.$router.push('/dashboard')
            }
        },

        props:{
            answeredQuestions: {},
            solvedPracticeTestId: {}
        },

        mounted(){
            this.getPracticeTestQuestions()
        },

        computed: {
        
        }
    }
</script>

<style>

    .reviewing-practice-test{
        margin-top: 20px;
    }

    .reviewing-practice-test ul{
        display: flex;
        gap: 20px;
        flex-wrap: wrap;

    }
    .reviewing-practice-test ul li{
        width: 50px;
        height: 50px;
        /* background-color: red; */
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .correct .option-label {
        background-color: #26ec18;
        color: white;
        border-color: #26ec18;
    }

    .correct:hover{
        background-color: green;
        color: white;
        border-color: #26ec18;
    }

    .incorrect .option-label{
        background-color: #f11d0e;
        color: white;
        border-color: #f11d0e;
    }

    .incorrect:hover{
        background-color: red;
        color: white;
        border-color: #f11d0e;
    }

    .correct{
        background-color: green;
        cursor: pointer;
    }

    .incorrect{
        background-color: red;
        cursor: pointer;
    }

    .reviewing-footer{
        display: flex;
        justify-content: flex-end;
        padding: 10px 50px;
        border-top: 2px dashed black;
    }
    
</style>