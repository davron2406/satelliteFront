<template>
  <div class="select-practice-test">
    <div class="select-field">
      <label class="label">
        Choose Practice Test
        <span class="required">*</span>
      </label>
      <select
        v-model="selectedPracticeTestId"
        class="select-input"
        required
      >
        <option value="" disabled selected>Select</option>
        <option
          v-for="practiceTest in practiceTests"
          :key="practiceTest.value"
          :value="practiceTest.id"
        >
          {{ practiceTest.name }}
        </option>
      </select>
      <span class="required-text">* = Required</span>
    </div>
  </div>

  <div class="select-practice-test-footer">
    <div class="btns">
      <button class="back-btn" @click="backToHome()">Back</button>
      <button @click="solvePracticeTest()" class="next-btn">Next</button>
    </div>
    
  </div>
</template>


<script>
  export default{
    data(){
      return{
        practiceTests:[],
        selectedPracticeTestId: ""
      }
    },

    methods: {
      async getPracticeTests(){
        const response = await this.$axios.get("/practiceTest/getPracticeTests", {headers: {"Authorization": "Bearer " + localStorage.getItem("token")}})
        this.practiceTests = response.data.data
      },

      async solvePracticeTest(){
        const response = await this.$axios.post("/solvedPracticeTest/generateSolvedPracticeTest", this.selectedPracticeTestId, {headers: {"Authorization": "Bearer " + localStorage.getItem("token")}})
        this.$router.push("/solvingPracticeTest/" + response.data.data);
      },

      backToHome(){
        this.$router.push('/dashboard')
      }
    },

    mounted(){
      this.getPracticeTests();
    }
  }

</script>

<style>

.select-practice-test{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 90vh;
}

.select-field {
  width: 500px;
  height: 200px;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
}

.label {
  display: block;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.required {
  color: #e74c3c;
  margin-left: 0.25rem;
}

.select-input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
}

.select-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.required-text {
  display: block;
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.5rem;
}

.next-btn, .back-btn{
  padding: 10px 20px;
  border-radius: 20px;
  background-color: rgb(60, 60, 246);
  outline: none;
  border: 1px solid rgb(60, 60, 246);
  color: white;
  font-size: 18px;
  cursor: pointer;
}

.select-practice-test-footer{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 50px;
  border-top: 2px dashed black;
  height: 10vh;
}

.btns{
  display: flex;
  align-items: center;
  gap: 20px;
}
</style>