<template>
    <div class="faq">
        <div class="faq-main container">
            <div class="faq-title">
                <div class="title">
                    <p>FAQ</p>
                </div>

                <div class="subtitle">
                    <p>Your Questions, answered</p>
                </div>
            </div>

            <div class="faq-info">
                <FaqQuestion v-for="faqQuestion in faqQuestions"
                :question="faqQuestion.question"
                :answer="faqQuestion.answer"
                ></FaqQuestion>
            </div>
        </div>
    </div>
</template>

<script>
import FaqQuestion from './FaqQuestion.vue';
export default{
    data(){
        return{
            faqQuestions: [
                {"question": "What is the FAQ section “Questions and Answers” ​​about?",
                 "answer": "The FAQ section answers frequently asked questions about your business, such as “What areas do you deliver to?”, “What are your hours of operation?” or “How to sign up for a service?”"
                },

                {"question": "What is the FAQ section “Questions and Answers” ​​about?",
                 "answer": "The FAQ section answers frequently asked questions about your business, such as “What areas do you deliver to?”, “What are your hours of operation?” or “How to sign up for a service?”"
                },

                {"question": "What is the FAQ section “Questions and Answers” ​​about?",
                 "answer": "The FAQ section answers frequently asked questions about your business, such as “What areas do you deliver to?”, “What are your hours of operation?” or “How to sign up for a service?”"
                }   

            ]
        }
    },

    components: {
        FaqQuestion,
    }
}

</script>

<style>
    .faq{
        padding: 200px 0;
    }
    .faq-main{
        display: flex;
        justify-content: space-between;
    }

    .faq-title{
        width: 40%;
    }

    .faq-info{
        width: 60%;
    }

    @media (max-width: 700px){
        .faq-main{
            flex-direction: column;
        }

        .faq-info{
            width: 100%;

            font-size: 18px;
        }
    }

   
</style>