<template>
  <div class="select-field container">
    <label class="label">
      Test Type
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

  <button @click="solvePracticeTest()">Next</button>
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
      }
    },

    mounted(){
      this.getPracticeTests();
    }
  }

</script>

<style>
.select-field {
  margin-bottom: 1.5rem;
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
</style>