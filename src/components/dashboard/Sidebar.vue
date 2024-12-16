<template>
    <aside class="sidebar" :class="`${this.is_expanded ? 'is-expanded' : ''}`">
        <div class="logo">
            <img src="../../assets/logo.svg" alt="">
            <p>{{ this.currentUser.fullName }}</p>
            <p>{{ this.currentUser.email }}</p>
        </div>

        <div class="menu-toggle-wrap">
            <button class="menu-toggle" @click="toggleMenu">
                <span class="material-icons">keyboard_double_arrow_right</span>
            </button>
        </div>

        <h3>Menu</h3>
        <div class="menu">
            <router-link class="button" to="/dashboard">
                <span class="material-icons">home</span>
                <span class="text">Home</span>
            </router-link>
            <router-link v-for="sideBar in sideBars" class="button" :to="sideBar.routerLink">
                <span class="material-icons">{{ sideBar.iconName }}</span>
                <span class="text">{{ sideBar.name }}</span>
            </router-link>
        </div>

        <div class="flex"></div>

            <div class="menu">
                <router-link class="button" to="/settings">
                    <span class="material-icons">settings</span>
                    <span class="text">Settings</span>
                </router-link> 
            </div>
    </aside>



</template>

<script >
    export default{

        data(){
            return{
                is_expanded : false,
                currentUser: {
                    fullName: "",
                    email: "",
                    id: "",
                },
                sideBars : []
            }
        },

        methods: {
            toggleMenu(){
                this.is_expanded = !this.is_expanded
            },

            async getSidebar(){
                let response = await this.$axios.get("/sidebar/getSidebars", {headers : { "Authorization": 'Bearer ' + localStorage.getItem('token')}});
                this.sideBars = response.data.data
            },

         
        },

        created: function(){
            this.getSidebar();
       }
    }
</script>

<style scoped>


    aside{
        display: flex;
        flex-direction: column;
        width: 4rem;
        overflow: hidden;
        min-height: 100vh;
        padding: 1rem;
        background-color: #FFFFFF;
        color: #A3AED0;

        transition: 0.2s ease-out;
    }

    aside.is-expanded{
        width: 300px;
    }

    aside.is-expanded .menu-toggle-wrap{
        top: -3rem;
    }

    .logo{
        margin-bottom: 1rem;
    }

    .logo img{
        width: 2rem;

    }

    .menu-toggle-wrap{
        display: flex;
        justify-content: flex-end;
        margin-bottom: 1rem;
        position: relative;
        top: 0;
        transition: 0.2s ease-out;
    }

    .menu-toggle{
        transition: 0.2s ease-out;
        background: transparent;
        border: none;
        cursor: pointer;
    }

   .menu-toggle .material-icons{
        font-size: 2rem;
        color: #E5E5E5
   }

   .menu-toggle:hover .material-icons{
        color: #4318FF;
        transform: translateX(0.5rem);
        transition: 0.2s ease-out;
   }

   aside.is-expanded .menu-toggle{
        transform: rotate(-180deg);
   }

   aside.is-expanded h3, .button, .text{
    opacity: 1;
   }

   aside.is-expanded  .button{
    opacity: 1;
   }

   aside.is-expanded .text{
    opacity: 1;
   }


   h3, .text{
        opacity: 0;
        transition: 0.3s ease-out;
   }
   .menu{
        margin: 0 -1rem;
   }

   .flex{
     flex: 1 1 0;
   }

   .menu .button{
        display: flex;
        align-items: center;
        text-decoration: none;

        padding: 0.5rem 1rem;
        transition: 0.2s ease-out;
   }

   .menu .button .material-icons{
        font-size: 2rem;
        color: #E5E5E5;
        transition: 0.2s ease-out;
        margin-right: 1rem;
   }

   .menu .button .text{
        color: #E5E5E5;
        transition: 0.2s ease-out;
   }

   .button:hover{
        background-color: #4318FF;
   }

   .button.router-link-exact-active{
    background-color: #4318FF;
   }

   .button.router-link-exact-active .text{
    color: #FFFFFF;
   }

   .button.router-link-exact-active .material-icons{
    color: #FFFFFF;
   }
   .button:hover .text{
    color: #FFFFFF;
   }

   .button:hover .material-icons{
    color: #FFFFFF;
   }

   h3{
    color: gray;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
   }

   .button.router-link-exact-active{
    border-right: 5px solid #44beee;
   }
   
 
    @media (max-width: 700px){
        
    }

</style>