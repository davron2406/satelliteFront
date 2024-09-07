<template>
    <div class="question-wrapper" @click="count">
        <div class="question-only" @click="count">
            <div class="question" @click="count">
                <p>{{ question }}</p>
            </div>

            <span class="material-icons">{{ this.arrow }}</span>
        </div>
        <div class="answer" :class="{'openedAnswer': isAnswerOpen}">
            <p>{{ answer }}</p>
        </div>
    </div>
</template>

<script>

export default{
    data(){
        return{
            isAnswerOpen: false,
            arrow: "keyboard_arrow_down"
        }
    },

    methods:{
        count(){
            if(this.isAnswerOpen){
                this.isAnswerOpen = false;
                this.arrow = "keyboard_arrow_down"
            }
            else{
                this.isAnswerOpen = true;
                this.arrow = "keyboard_arrow_up"
            }
        },

        
    },

    props:{
        question:{
            type: String,
            required: true
        },

        answer:{
            type: String,
            required: true
        }
    }
}

</script>


<style>

    .question-wrapper{
        padding: 30px 0;
        border-bottom: 1px solid black;
        cursor: pointer;
    }

  

    .question-only{
        display: flex;
        justify-content: space-between;
    }

    .answer{
       display: none;
       margin-top: 10px;
       font-size: 18px;
    }

    .openedAnswer{
        display: block;
    }


</style>