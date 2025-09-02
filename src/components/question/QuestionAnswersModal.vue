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
                <table class="form-table">
                    <thead>
                        <tr>
                            <th>Answer</th>
                            <th>Extra Info</th>
                            <th>Image</th>
                            <th>Correct</th>
                        </tr>
                    </thead>

                    <tbody class="table-body">
                        <tr v-for="answer in answers">
                            <td>{{ answer.answerText }}</td>
                            <td>{{ answer.extra }}</td>
                            <td> 
                                <div class="question-image">
                                    <img :src="answer.answerImage?.fileUrl" alt="">
                                </div>
                            </td>
                            <td>{{ answer.correst }}</td>
                           
                        </tr>
                    </tbody>
                </table>
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
                answers: [],
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
               const response = await this.$axios.get('/answer/getQuestionAnswers/' + this.questionId, {headers: {'Authorization' : 'Bearer ' + localStorage.getItem('token')}})
               this.answers = response.data.data;
            }
        },

        mounted(){
            this.getQuestionAnswers()
        }
    }
</script>