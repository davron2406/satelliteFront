<template>
    <div class="reviewing-practice-test">
        <ul>
            <li v-for="answeredQuestion, index in answeredQuestions"  :class="{correct: answeredQuestion.correctAnswerId == answeredQuestion.selectedAnswerId, incorrect: answeredQuestion.correctAnswerId != answeredQuestion.selectedAnswerId}">
                <p >{{ index + 1 }}</p>
            </li>
        </ul>
    </div>

</template>

<script>
    export default{
        data(){
            return{

            }
        },

        methods: {
            
        },

        props:{
            answeredQuestions: {},
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

    .correct{
        background-color: green;
    }

    .incorrect{
        background-color: red;
    }
    
</style>