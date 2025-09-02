<template>
  <div class="modal-backdrop">
        <div class="modal">
            <header class="modal-header">
                <slot name="header">
                    Generate Practice Test
                </slot>
                <button type="button" class="btn-close" @click="close()"> x
                </button>
            </header>

            <section class="modal-body">
              <div class="question">

                <div class="input-row">
                  <div class="input-wrapper ">
                    <label for="practiceTestName" class="input-label">Practice Test Name</label>
                    <input type="text" id="practiceTestName" v-model="practiceTestDetails.name">
                  </div>
                </div>
              
                <div class="input-row" v-for="topic,index in practiceTestDetails.topics">
                  <div class="input-wrapper ">
                    <label for="questionSubject" class="input-label">Question Subject</label>
                    <select name="questionSubject" id="questionSubject" v-model="practiceTestDetails.subjects[index]" @change="getSubjectTopics(index)">
                        <option v-for="subject in subjects" :value="subject">{{ subject }}</option>
                    </select>
                  </div>

                  <div class="input-wrapper ">
                    <label for="questionTopic" class="input-label">Question Topic</label>
                    <select name="questionTopic" id="questionTopic" v-model="practiceTestDetails.topics[index]">
                        <option v-for="topic in topics[index]" :value="topic.id">{{ topic.name }}</option>
                    </select>
                  </div>

                  <div class="input-wrapper ">
                    <label for="questionLevel" class="input-label">Question Level</label>
                    <input type="number" max="5" min="1" id="questionLevel" v-model="practiceTestDetails.questionLevels[index]">
                  </div>

                  <div class="input-wrapper">
                    <label for="numberOfQuestions" class="input-label">Number Of Questions</label>
                    <input type="number" max="100" min="1" id="numberOfQuestions" v-model="practiceTestDetails.numberOfQuestions[index]"
                  </div>
                </div>   
                </div>
            </section>

            <button @click="addDetail()">Add Detail</button>

            <footer class="modal-footer">
                <button type="button" class="btn-green" @click="generatePracticeTest()"> 
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
      practiceTestDetails:{
        name: "",
        subjects:[""],
        topics: [""],
        questionLevels: [0],
        numberOfQuestions: [1]
      },
      

      subjects:[],
      topics: [[]],
    }
  },

  methods:{

      async getSubjects(){
          const response = await this.$axios.get('/topic/getSubjects', {
            headers:{
              'Authorization':  'Bearer ' + localStorage.getItem('token'),
            },
          })
          this.subjects = response.data;
      },

      async  getSubjectTopics(index){
          const response = await this.$axios.get('/topic/getTopicsBySubject/' + this.practiceTestDetails.subjects[index], {
            headers:{
              'Authorization':  'Bearer ' + localStorage.getItem('token'),
            },
          })
          this.topics[index] = response.data.data;
        },

        addDetail(){
          this.practiceTestDetails.topics.push("")
          this.practiceTestDetails.subjects.push("")
          this.practiceTestDetails.numberOfQuestions.push(1)
          this.questionLevels.push(0)
        },

        async generatePracticeTest(){

          console.log(this.practiceTestDetails)
          const response = await this.$axios.post('/practiceTest/generatePracticeTest', this.practiceTestDetails, {headers:{
              'Authorization':  'Bearer ' + localStorage.getItem('token'),
            }})
          },



     close(){
      this.$emit('close')
     }
  },

  mounted(){
    this.getSubjects()
  }
}

</script>