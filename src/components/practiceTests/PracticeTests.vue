<template>
    <div class="questions container">
        <div class="table-wrapper">
            <table class="form-table">
                <thead>
                    <tr>
                        <th>Question</th>
                        <th>Extra Info</th>
                    </tr>
                </thead>

                <tbody class="table-body">
                    <tr v-for="practiceTest in practiceTests">
                        <td>{{ practiceTest.name }}</td>
                      
                       
                        <td><button @click="openQuestionsModal(practiceTest.id)">Questions</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
       
       <button>backward</button>
       <button @click="forward()">forward</button>
    </div>

    <button @click="generatePracticeTest()">Add Question</button>

    <PracticeTestQuestions v-if="isQuestionsModalOpen" @close="openQuestionsModal" :practiceTestId = "practiceTestId"></PracticeTestQuestions>
    <GeneratePracticeTestModal v-if="isGenerateModalOpen" @close="generatePracticeTest()"></GeneratePracticeTestModal>

</template>

<script>
    import PracticeTestQuestions from './PracticeTestQuestions.vue';
    import GeneratePracticeTestModal from './GeneratePracticeTestModal.vue'
    export default{
        data(){
            return{
                practiceTests:[],
                defaultPageNumber: 0,
                defaultPageSize: 10,

                isQuestionsModalOpen: false,
                isGenerateModalOpen: false,
                practiceTestId: "",
            }
        },

        components:{
           PracticeTestQuestions,
           GeneratePracticeTestModal,
        },

        methods:{
            openQuestionsModal(practiceTestId){
                if(this.isQuestionsModalOpen){
                    this.isQuestionsModalOpen = false;
                }else{
                    this.practiceTestId = practiceTestId
                    this.isQuestionsModalOpen = true; 
                }
            },

        

            async getPracticeTests(){
                const response = await this.$axios.get("/practiceTest/getPracticeTests",
                    {headers: {"Authorization": "Bearer " + localStorage.getItem("token")}}
                )

                this.practiceTests = response.data.data;              
            },

            generatePracticeTest(){
                if(this.isGenerateModalOpen){
                    this.isGenerateModalOpen = false
                }
                else{
                    this.isGenerateModalOpen = true;
                }
            }
        },

        mounted(){
            this.getPracticeTests();
        }
    }
</script>

<style>

    
</style>