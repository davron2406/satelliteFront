<template>
    <div class="modal-backdrop">
        <div class="modal">
            <header class="modal-header">
                <slot name="header">
                    Practice Test Questions
                </slot>
                <button type="button" class="btn-close" @click="close()"> x
                </button>
            </header>

            <section class="modal-body">
                <table class="form-table">
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Extra Info</th>
                            <th>Image</th>
                            <th>Answers</th>
                        </tr>
                    </thead>

                    <tbody class="table-body">
                        <tr v-for="question in questions">
                            <td>{{ question.questionText }}</td>
                            <td>{{ question.extra }}</td>
                            <td> 
                                <div class="question-image">
                                    <img :src="question.questionImage.fileUrl" alt="">
                                </div>
                            </td>
                            <td>
                                <span class="material-icons danger"  @click="removeQuestion(question.id)">delete</span>
                            </td>
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
    export default{
        data(){
            return{
                questions: [],
            }
        },

        props:{
            practiceTestId: {
                type: String,
                required: true,
            }
        },

    
        methods:{
            close(){
                this.$emit('close')
            },

            async getQuestionAnswers(){
               const response = await this.$axios.get('/practiceTest/getPracticeTestQuestions/' + this.practiceTestId, {headers: {'Authorization' : 'Bearer ' + localStorage.getItem('token')}})
               this.questions = response.data.data;
            },

            async removeQuestion(questionId){
               
                const response = await this.$axios.delete('/practiceTest/removeQuestion/' + this.practiceTestId + "?questionId=" + questionId, {
                    
                    headers:{
                    'Authorization':  'Bearer ' + localStorage.getItem('token'),
                    },
                })
                console.log(response);
            }
        },

        mounted(){
            this.getQuestionAnswers()
        }
    }
</script>


<style>
    .danger{
        color: red;
        background-color: transparent;
        cursor: pointer;
    }
</style>