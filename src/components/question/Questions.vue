<template>
    <div class="questions container">
        <div class="table-wrapper">
            <table class="form-table">
                <thead>
                    <tr>
                        <th>Question</th>
                        <th>Extra Info</th>
                        <th>Level</th>
                        <th>Subject</th>
                        <th>Topic</th>
                        <th>Image</th>
                        <th>Answers</th>
                    </tr>
                </thead>

                <tbody class="table-body">
                    <tr v-for="question in questions">
                        <td>{{ question.questionText }}</td>
                        <td>{{ question.extra }}</td>
                        <td>{{ question.questionLevel }}</td>
                        <td>{{ question.subject }}</td>
                        <td>{{ question.topic.name }}</td>
                        <td>
                            <div class="question-image">
                                <img :src="question.questionImage?.fileUrl" alt="">
                            </div>
                        </td>
                        <td><button @click="openAnswersModal(question.id)">Answers</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
       
       <button>backward</button>
       <button @click="forward()">forward</button>
    </div>

    <button @click="addQuestion()">Add Question</button>

    
    <AddQuestionModal v-if="isModalOpen"   @close="addQuestion"></AddQuestionModal>
    <QuestionAnswersModal 
                    v-if="isAnswersModalOpen"
                    @close="closeAnswerModal"
                    :questionId="answersQuestionId"></QuestionAnswersModal>
</template>

<script>
    import AddQuestionModal from "./AddQuestionModal.vue"
    import QuestionAnswersModal from './QuestionAnswersModal.vue';
    export default{
        data(){
            return{
                questions:[],
                isModalOpen: false,
                isAnswersModalOpen: false,
                defaultPageNumber: 0,
                defaultPageSize: 10,
                answersQuestionId: ""
            }
        },

        components:{
            AddQuestionModal,
            QuestionAnswersModal
        },

        methods:{
            addQuestion(){
                if(this.isModalOpen){
                    this.isModalOpen = false;
                }else{
                    this.isModalOpen = true;
                }
            },

            async getQuestions(pageNumber, pageSize){
                const response = await this.$axios.get("/question/getQuestions?page=" + pageNumber + "&size=" + pageSize,
                    {headers: {"Authorization": "Bearer " + localStorage.getItem("token")}}
                )
                console.log(response)
                this.questions = response.data.data.content;              
            },

            openAnswersModal(questionId){
                    this.isAnswersModalOpen = true;
                    this.answersQuestionId = questionId;
            },

            closeAnswerModal(){
                this.isAnswersModalOpen = false;
                this.answersQuestionId = ""
            },

            forward(){
                this.defaultPageNumber++;
                this.getQuestions(this.defaultPageNumber, this.defaultPageSize)
            }

         
        },

        mounted(){
            this.getQuestions(this.defaultPageNumber,this.defaultPageSize);
        }
    }
</script>

<style>

    .table-wrapper{
        border-radius: 20px;
        overflow: hidden;
        border: 1px solid #ddd;
    }
    .form-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
        height: 80vh;
        line-height: 32px;
    }

    .form-table th, .form-table td {
        border: 1px solid #ddd;
        padding: 0 5px;
        text-align: left;
    }

    .form-table th {
        background-color: #f2f2f2; 
        font-weight: bold;
    }


    .form-table td {
        line-height: 18px;
    }

    .form-table input[type="text"],
    .form-table input[type="number"],
    .form-table input[type="file"] {
        width: 100%;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .form-table button {
        background-color: #4CAF50;
        color: white;
        padding: 5px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .form-table button:hover {
        background-color: #45a049;
    }

    .question-image{
        width: 30px;
        height: 30px;
    }

    .question-image img{
        width: 100%;
        height: 100%;
    }


    td:first-child {
        width: 40%; /* Set width for the first column */
    }
   
</style>