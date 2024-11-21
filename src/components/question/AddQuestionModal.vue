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
              <div class="question">
                <div class="input-row">
                  <div class="input-wrapper width100">
                    <label for="questionText" class="input-label">Question</label>
                    <input type="text" id="questionText" v-model="question.questionText">
                  </div>
                </div>  

                <div class="input-row">
                  <div class="input-wrapper width100">
                    <label for="questionExtraInfo" class="input-label">Extra Info</label>
                    <input type="text" id="questionExtraInfo" v-model="question.extra">
                  </div>
                </div>
                
                <div class="input-row"> 
                  <div class="input-wrapper" >
                    <label for="questionLevel" class="input-label">Level</label>
                    <input type="number" id="questionLevel" v-model="question.questionLevel">
                  </div>

                  <div class="input-wrapper">
                    <label for="questionFile" class="input-label">Choose Image</label>
                    <input type="file" id="questionFile" ref="imageInput" @change="handleImage()">
                  </div>
                </div> 
              </div>

              <div class="answers">
                <div class="answer" v-for="answer, index in question.answers">
                  <p>{{ index + 1}} - answer</p>
                  <div class="input-row">
                    <div class="input-wrapper width50">
                      <label for="questionText" class="input-label">Answer Text</label>
                      <input type="text" id="questionText" v-model="question.answers[index].answerText">
                    </div>

                    <div class="input-wrapper width50">
                      <label for="answerExtra" class="input-label">Extra definition</label>
                      <input type="text" id="answerExtra" v-model="question.answers[index].extra">
                    </div>
                  </div> 

                  <div class="input-row">
                    <div class="input-wrapper ">
                      <label for="isTrue" class="input-label">Correct</label>
                      <input type="checkbox" id="isTrue" v-model="question.answers[index].isTrue">
                    </div>

                    <div class="input-wrapper">
                      <label for="answerFile" class="input-label">Choose Image</label>
                      <input type="file" id="answerFile" ref="answerImageInput" @change="handleAnswerImage(index, $event)">
                    </div>
                  </div> 
                </div>
              </div>

              <button @click="addAnswer()">Add answer</button>
            </section>

            <footer class="modal-footer">
                <button type="button" class="btn-green" @click="addQuestion()"> 
                    Add
                </button>
            </footer>
        </div>

    </div>
</template>

<script>
  import axios from "axios"
  export default{
    data(){
      return{
        question:{
          questionText:"",
          extra:"",
          questionLevel: 0,
          questionImage: null,

          answers:[
          {
            answerText:"",
            extra:"",
            isTrue: false,
          }
        ],
        },
      }
    },

    methods: {
       handleImage(){
          const file = this.$refs.imageInput.files[0]; // Access the file using the ref

          console.log(this.$refs.imageInput)
          if (file && file.type.startsWith('image/')) {
            this.question.questionImage = file;

          } else {
            this.question.questionImage = null;
            alert("Please select a valid image file.");
          }
        },

         handleAnswerImage(index, event){
          console.log("working" + index)
            const file = event.target.files[0];
            
            if (file && file.type.startsWith('image/')) {
              this.question.answers[index].answerImage = file;

            } else {
              this.question.answers[index].answerImage = null;
              alert("Please select a valid image file.");
            }

            console.log(this.answers[index])
        },

        async addQuestion(){

          const formData = new FormData();
          formData.append("questionImage", this.question.questionImage)
          formData.append("data", JSON.stringify({questionText: this.question.questionText, questionLevel: this.question.questionLevel, extra: this.question.extra}))

          const response = await axios.post('https://satelliteback.onrender.com/api/question/addQuestion', formData, {
            headers:{
              'Authorization':  'Bearer ' + localStorage.getItem('token'),
              "Content-Type": "multipart/form-data",
            },
          })


        },

        close(){
          this.$emit('close')
          console.log("close working")
        },

        addAnswer(){
          this.question.answers.push({
            answerText:"",
            extra:"",
            isTrue: false,
            answerImg: null,}
          )
        },

       

        // async getQuestionImage(){
        //   console.log("mounted working")
        //   const response = await axios.get("http://localhost:8080/api/image/downloadImage/ee5939e4-227e-4f7f-87ca-81cbcc4ca389", {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
        //   console.log(response);
        //   this.image = 'data:image/png;base64,' + response.data.data
        // }
    },

    // mounted(){
    //   this.getQuestionImage()
    // }
  }

</script>

<style>
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;      
      background-color: rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
    }

  .modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-radius: 20px;
  }

  
  .modal-header,
  .modal-footer {
    padding: 15px;
    display: flex;
  }

  .modal-header {
    position: relative;
    border-bottom: 1px solid #eeeeee;
    color: #1b2559;
    justify-content: space-between;
  }

  .modal-footer {
    border-top: 1px solid #eeeeee;
    flex-direction: column;
    justify-content: flex-end;
  }

  .modal-body {
    position: relative;
    padding: 20px 50px;
    overflow-y: scroll;
    height: 70vh;
  }

  .btn-close {
    position: absolute;
    top: -10px;
    right:-10px;
    border: none;
    font-size: 20px;
    padding: 10px;
    cursor: pointer;
    font-weight: bold;
    color: red;
    background: transparent;
  }

  .btn-green {
    color: white;
    background: #4AAE9B;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
    padding: 5px ;
  }

  .input-row{
    display: flex;
    gap: 50px;
    align-items: center;
    width: 100%;
    justify-content: space-between;
  }

  .input-wrapper{
    display: flex;
    flex-direction: column;
  }

  .width100{
    width: 100%;
  }
  .input-label{
    font-size: 16px;
  }

  .input-wrapper input{
    padding: 10px;
    border-radius: 5px;
    border: 2px solid  #C0C4C9;
    background-color: #F9FAFB;
    outline: none;
    font-size: 18px;
  }

  .input-wrapper input:focus{
    border: 2px solid #3b4ce2;
  }

  input[type="file"] {
    position: relative;
  }

input[type="file"]::file-selector-button {
  width: 40px;
  color: transparent;
  cursor: pointer;
}

/* Faked label styles and icon */
input[type="file"]::before {
  position: absolute;
  z-index: 100;
  pointer-events: none;
  top: 12px;
  left: 20px;
  height: 20px;
  width: 20px;
  content: "";
  background-image: url("../assets/upload-sign.svg");
  background-size: cover; /* Cover the entire button */
  background-position: center;
  color: #1b2559;
  /* background-color: black; */
}

  .answers{
    padding-top: 20px;
    margin-top: 30px;
    border-top: 2px solid #C0C4C9;
  }

  .answer{
    padding: 20px 0;
    border-bottom: 1px solid #C0C4C9;
  }

  .width50{
    width: 45%;
  }

</style>