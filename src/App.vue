<template>
  <Header></Header>
  <HomePage></HomePage>
  <Services></Services>
  <About></About>
  <Aproach></Aproach>
  <Benefits></Benefits>
  <Testimonials></Testimonials>
  <Faq></Faq>
  </template>

<script>
import Header from "./components/Header.vue"
import HomePage from "./components/HomePage.vue"
import Services from "./components/Services.vue"
import About from "./components/About.vue"
import Aproach from "./components/Aproach.vue"
import Benefits from "./components/Benefits.vue"
import Testimonials from "./components/Testimonials.vue"
import Faq from "./components/Faq.vue"
  export default{
    data(){
      return{

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
    }
  }

</script>

<style>

body{
  background-color: #E0e0e0;
}
</style>