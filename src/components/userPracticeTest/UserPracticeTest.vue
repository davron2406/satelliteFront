<script>
    import PracticeCard from './UserPracticeTestCard.vue';
    import TabSelector from './TabSelector.vue';
    export default{
      data(){
        return{
          practiceTests: [],
          activeTab: "active"
        }
      },

      components: {
        PracticeCard,
        TabSelector
      },

      methods:{
        openSelectPracticetest(){
          this.$router.push("/solvePracticeTest")
        },

        async getUserPracticeTests(){
          const response = await this.$axios.get("/solvedPracticeTest/getUserPracticeTests", {headers: {'Authorization' : 'Bearer ' + localStorage.getItem('token')}})
          this.practiceTests = response.data.data
          console.log(response)
        }
      },

      mounted(){
        this.getUserPracticeTests()
      }
    }
</script>

<template>
  <div class="practice-container">
    <div class="header">
      <h1 class="title">Practice and Prepare</h1>
      <TabSelector v-model:activeTab="activeTab" />
      <a href="#" class="learn-more">Learn more about Bluebook practice</a>
    </div>

    <div class="full-tests" v-if="activeTab === 'active'">
      <div class="practice-card">
        <div class="card-img">
          <img src="../../assets/Test Preview.png" alt="">
        </div>
        <div class="card-header">
          <h2>Test Preview</h2>
        </div>
      </div>

      <div class="practice-card" @click="openSelectPracticetest()">
        <div class="card-img">
          <img src="../../assets/Full-length-test.png" alt="">
        </div>
        <div class="card-header">
          <h2>Full Length Tests</h2>
        </div>
      </div>
    </div>

    <div class="practice-grid" v-if="activeTab === 'past'">
      <PracticeCard
        v-for="test in practiceTests"
        :key="test.id"
        :test="test"
      />
    </div>
  </div>
</template>

<style scoped>
.practice-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.title {
  font-size: 2rem;
  margin: 0;
}

.learn-more {
  color: #0066cc;
  text-decoration: none;
}

.practice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.full-tests{
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.card-img{
  height: 150px;
}

.practice-card{
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>