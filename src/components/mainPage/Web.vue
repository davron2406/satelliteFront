<template>
  <div :class="{'scrollDisable': isScrollDisable}">
    <Header @openSignUp="openSignUp" @openSignIn="openSignIn"></Header>
    <HomePage></HomePage>
    <Services></Services>
    <!-- <About></About> -->
    <Aproach></Aproach>
    <Benefits></Benefits>
    <Testimonials></Testimonials>
    <Faq></Faq>
    <Footer></Footer>
    <Sign
        v-if="this.isSignOpen"
        @closeSign="closeSign"
        @openSignUp="openSignUp"
        @openSignIn="openSignIn"
        :signType="this.signType"></Sign>
  </div>
</template>

<script>
    import Header from "./Header.vue"
    import HomePage from "./HomePage.vue"
    import Services from "./Services.vue"
    import About from "./About.vue"
    import Aproach from "./Aproach.vue"
    import Benefits from "./Benefits.vue"
    import Testimonials from "./Testimonials.vue"
    import Faq from "./Faq.vue"
    import Footer from "./Footer.vue"
    import Sign from "./Sign.vue"
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
            About,
            Aproach,
            Benefits,
            Testimonials,
            Faq,
            Footer,
            Sign,
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
        }
        }
    }
</script>

<style>

</style>