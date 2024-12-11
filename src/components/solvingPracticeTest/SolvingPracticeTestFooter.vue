<template>
    <div class="footer-question">
        <div class="footer-name">
            Davron Saydulayev
        </div>

        <div class="questions-info">
            Question 1 of 27
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

            }
        },

        props: {
            isTestFinish: {
                type: Boolean,
                Required: true,
            }
        },

        methods: {
            nextQuestion(){
                this.$emit("nextQuestion")
                if(this.isTestFinish){
                    this.$emit("finishTest")
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
    }

    .questions-info{
        background-color: rgb(37, 37, 37);
        padding: 10px 20px;
        border-radius: 15px;
        color: white;
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