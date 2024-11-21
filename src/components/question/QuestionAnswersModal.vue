<template>
    <div class="modal-backdrop">
        <div class="modal">
            <header class="modal-header">
                <slot name="header">
                    Add Teacher
                </slot>
                <button type="button" class="btn-close" @click="close()"> x
                </button>
            </header>

            <section class="modal-body">
    
              <button >Add answer</button>
            </section>

            <footer class="modal-footer">
                <button type="button" class="btn-green"> 
                    Add
                </button>
            </footer>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    export default{
        data(){
            return{

            }
        },

        props:{
            questionId: {
                type: String,
                required: true,
            }
        },

    
        methods:{
            close(){
                this.$emit('close')
            },

            async getQuestionAnswers(){
                console.log(this.questionId)
               const response = await axios.get('http://localhost:8080/api/answer/getQuestionAnswers/' + this.questionId, {headers: {'Authorization' : 'Bearer ' + localStorage.getItem('token')}})
               console.log(response)
            }
        },

        mounted(){
            this.getQuestionAnswers()
        }
    }
</script>