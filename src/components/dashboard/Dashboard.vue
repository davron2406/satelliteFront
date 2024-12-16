<template>
    <div class="dashboard">
        <div class="sidebar-main">
            <SideBar v-if="isUserAdmin"> </SideBar>
        </div>
        <div class="dashboard-main">
            <DashboardHeader
            :user = "this.user"
            ></DashboardHeader>
            <div class="dashboard-extra">
                <UserPracticeTest v-if="isUser"></UserPracticeTest>
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script>
    import SideBar from "./Sidebar.vue";
    import DashboardHeader from "./DashboardHeader.vue"
    import UserPracticeTest from "../userPracticeTest/UserPracticeTest.vue"
    export default{
        data() {
            return{
                isUserAdmin: false,
                isUser: false,
                user: {}
            }
        },

        methods: {
            async getCurrentUser(){
                console.log("working")
                const response = await this.$axios("/sidebar/getCurrentUser", {headers : { "Authorization": 'Bearer ' + localStorage.getItem('token')}})
                console.log(response)
                if(response.data.role.name === "admin"){
                    this.isUserAdmin = true
                }
                else{
                    this.isUserAdmin = false;
                    this.isUser = true;
                }

                this.user = response.data;
            }
        },

        mounted(){
            console.log("working")
            this.getCurrentUser()
        },

        components: {
            SideBar,
            DashboardHeader,
            UserPracticeTest
        }
    }
    

</script>

<style>
    .dashboard{
        width: 100%;
        height: 100%;
        background-color: #F4F7FE;;
        display: flex;
    }

    .dashboard-main{
        display: flex;
        flex-direction: column;
        width: 100%;
        overflow-y: scroll;
    }


    .dashboard-extra{
        overflow-y: scroll;
        height: calc(100vh - 80px)
    }

  


    /* .dashboard-extra{
    } */
</style>