<script>
export default{
  data(){
    return{
      practiceTestName:"",

    }
  },

  methods:{
    async getPracticeTestName(){
      const response = await this.$axios.get("/practiceTest/getPracticeTestName/" + this.test.practiceTestId, {headers: {'Authorization' : 'Bearer ' + localStorage.getItem('token')}})
      this.practiceTestName = response.data.data
    },

    continueSolving(id){
        this.$router.push("/solvingPracticeTest/" + id);
    },

    review(id){
      this.$router.push("/finishedPracticeTest/" + id)
    }
  },


  props: {
    test: {}
  },

  mounted(){
    this.getPracticeTestName();
  }

}
</script>

<template>
  <div class="practice-card">
    <div class="card-header">
      <h2>{{ this.test.name }}</h2>
      <button class="trash-btn">
        <span class="material-icons">delete_outline</span>
      </button>
    </div>

    <div class="practice-test-name">
      {{ practiceTestName }}
    </div>
    <div class="completion-status">
      <span class="check-icon material-icons" :class="{pending: test.status === 'SOLVING'}" v-if="test.status === 'SOLVING'">pending</span>
      <span class="check-icon" v-if="test.status === 'FINISHED'">✓</span>
      <span :class="{pending: test.status === 'SOLVING'}">{{test.status}}</span>
    </div>

    <p class="view-responses" v-if="test.status === 'SOLVING'" @click="continueSolving(test.id)">Continue Solving</p>
    <p class="view-responses" v-if="test.status === 'FINISHED'" @click="review(test.id)">Review</p>
  </div>
</template>

<style>
.practice-card {
  background: #fff;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.trash-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
}

.trash-btn:hover {
  background-color: #f5f5f5;
}

.practice-test-name{
  margin-bottom: 15px;
  font-size: 24px;
}
.completion-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #2e7d32;
  font-size: 16px;
}

.check-icon {
  font-weight: bold;
}

.pending{
  color: red;
}

.view-responses {
  display: block;
  text-decoration: none;
  color: #000;
  font-weight: 500;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.view-responses:hover {
  color: #0066cc;
}
</style>