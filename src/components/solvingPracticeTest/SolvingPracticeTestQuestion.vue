<script>
export default{
  data(){
    return{

    }
  },


  props:{
        question: {
          type: String,
          required: true,
        },

        extra: {
          type: String,
          required: true,
        },

        imageUrl: {
          type: String,
          required: true,
        },

        questionNumber:{
          type: Number,
          required: true
        },

  },

}
</script>

<template>
  <div class="question-content">
    <div class="question-header">
      <div class="question-info">
        <span class="number">{{ questionNumber }}</span>
        <button class="bookmark-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
        <span class="mark-review">Mark for Review</span>
      </div>
    </div>
    <div class="content">
      {{ question }}
    </div>

    <div>
      {{ extra }}
    </div>

    <div class="questionImage">
      <img :src="imageUrl" v-if="imageUrl != null" alt="">
    </div>
  </div>
</template>

<style >
.question-content {
  padding: 1.5rem;
  background-color: white;
  border-right: 1px solid #e5e7eb;
  height: 100%;
  overflow-y: scroll;
}

.question-header {
  margin-bottom: 1.5rem;
}

.question-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.number {
  background-color: #1e293b;
  color: white;
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
}

.bookmark-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  display: flex;
  align-items: center;
}

.mark-review {
  color: #6b7280;
  font-size: 0.875rem;
}

.content {
  font-size: 1rem;
  line-height: 1.6;
  color: #1f2937;
  max-width: 90%;
}

.questionImage{
  width: 600px;
  height: 400px;
}

.questionImage img{
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>