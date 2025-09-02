<template>
    <div class="footer-question">
        <div class="footer-name">
            Davron Saydulayev
        </div>

        <div class="questions-info">
            <ul class="questionNumbers" v-if="isQuestionNumbersOpen">
                <li v-for="i in totalQuestionNumber" class="questionNumber" @click="getExactQuestion(i)"><p>{{ i }}</p></li>
            </ul>
            Question {{ currentQuestionNumber }} of {{ totalQuestionNumber }}
            <span class="material-icons" @click="openQuestionNumbers" style="cursor:pointer">{{ questionsMaterialIcons }}</span>
        </div>
 
        <div>
            <button class="next-btn" @click="nextQuestion()">{{ isTestFinish? "Finish":"Next" }}</button>
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                questionsMaterialIcons: "keyboard_arrow_up",
                isQuestionNumbersOpen: false,
            }
        },

        props: {
            isTestFinish: {
                type: Boolean,
                Required: true,
            },

            currentQuestionNumber:{},
            totalQuestionNumber:{}
        },

        methods: {
            nextQuestion(){
                this.$emit("nextQuestion")
                if(this.isTestFinish){
                    this.$emit("finishTest")
                }
            },

            getExactQuestion(index){
                this.$emit("getExactQuestion", index)
            },

            openQuestionNumbers(){
                if(this.isQuestionNumbersOpen){
                    this.isQuestionNumbersOpen = false;
                    this.questionsMaterialIcons = "keyboard_arrow_up"
                }
                else{
                    this.isQuestionNumbersOpen = true;
                    this.questionsMaterialIcons = "keyboard_arrow_down"
                }
            }
        }
    }
</script>

<style>
    .footer-question{
        display: flex;
        justify-content: space-between;
        padding: 20px 30px;
        border-top: 2px dashed black;
        position: relative;
    }

    .questions-info{
        background-color: rgb(37, 37, 37);
        padding: 10px 20px;
        border-radius: 15px;
        color: white;
    }

    .questionNumbers{
        display: flex;
        gap: 20px;
        position: absolute;
        top: 0;
        transform: translate(-50%,calc(-100% - 10px));
        z-index: 20;
        color: black;
        border: 1px solid black;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        padding: 10px;
        max-width: 400px;
        flex-wrap: wrap;
    }

    .questionNumber{
        padding: 3px;
        background-color: black;
        color: white;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    .next-btn{
        padding: 10px 20px;
        border-radius: 20px;
        background-color: rgb(60, 60, 246);
        outline: none;
        border: 1px solid rgb(60, 60, 246);
        color: white;
    }
</style>