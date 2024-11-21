<template>
    <div class="dashboard">
        <div>
            <SideBar> </SideBar>
        </div>
        <div class="dashboard-main">
            <DashboardHeader></DashboardHeader>
            <div class="dashboard-extra">
                <router-view/>
            </div>
        </div>
   
    </div>
</template>

<script>
    import SideBar from "./Sidebar.vue";
    import DashboardHeader from "./DashboardHeader.vue"
    export default{
        data() {
            return{
                
            }
        },

        components: {
            SideBar,
            DashboardHeader,
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