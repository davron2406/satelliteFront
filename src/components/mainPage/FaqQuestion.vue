<template>
    <div class="question-wrapper" @click="open">
        <div class="question-only" @click="open">
            <div class="question" @click="open">
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
        open(){
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


<style scoped>

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