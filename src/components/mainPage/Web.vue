<template>
  <div :class="{'scrollDisable': isScrollDisable}">
    <Header @openSignUp="openSignUp" @openSignIn="openSignIn"></Header>
    <HomePage></HomePage>
    <Services></Services>
    <Courses></Courses>
    <Books></Books>
    <Benefits></Benefits>
    <Testimonials></Testimonials>
    <Faq></Faq>
    <Contact></Contact>
    <Footer></Footer>
    
  </div>
</template>

<script>
    import Header from "./Header.vue"
    import HomePage from "./HomePage.vue"
    import Services from "./Services.vue"
    import Benefits from "./Benefits.vue"
    import Testimonials from "./Testimonials.vue"
    import Faq from "./Faq.vue"
    import Footer from "./Footer.vue"
    import Courses from './Courses.vue'
    import Books from './Books.vue'
    import Contact from './Contact.vue'
    export default{
        data(){
        return{
            isSignOpen: false,
            isScrollDisable: false,
            signType: "",
        }
        },

        components:{
            Header,
            HomePage,
            Services,
            Benefits,
            Testimonials,
            Faq,
            Footer,
            Courses,
            Books,
            Contact
        },

        methods: {
        openSignUp(){
            this.isSignOpen = true;
            this.isScrollDisable = true;
            this.signType = "signUp"
        },

        openSignIn(){
            this.isSignOpen = true;
            this.isScrollDisable = true;
            this.signType = "signIn"
        },

        closeSign(){
            this.isSignOpen = false;
            this.isScrollDisable = false;
        },
        }
    }
</script>

<style>

</style>