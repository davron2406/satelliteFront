<template>
    <div class="dashboard-header">
        <div class="search">
            <span class="material-icons">search</span>
            <input type="text" placeholder="Search">
        </div>

        <div class="header-main">
            <div class="languages">
                <div class="language-main">
                    <div class="flag">
                        <img src="../../assets/Без названия.png" alt="">
                    </div>
                </div>
            </div>

            <div class="notifications">
                <span class="material-icons">notifications</span>
            </div>

            <div class="account">
                <div class="account-avatar" @click="openAccount()">
                    <img :src="user.avatarImage?.imageUrl || defaultAvatarImgUrl" alt="User Avatar">
                </div>

                <div class="account-extra" v-if="isAccountOpen">
                    <div class="user-info">
                        <div class="account-avatar">
                            <img :src="user.avatarImage?.imageUrl || defaultAvatarImgUrl" alt="User Avatar">
                        </div>
                        <div>
                            <p class="user-name">{{ user.firstName }} {{ user.lastName }}</p>
                            <p class="user-email">{{ user.email }}</p>
                        </div>
                    </div>

                    <div class="account-nav">
                        <ul class="account-menu">
                            <li class="account-menu-item">
                                <a href="">
                                    <span class="material-icons">person</span>
                                    <p>View profile</p>
                                </a>
                            </li>
                            <li class="account-menu-item">
                                <a href="">
                                    <span class="material-icons">manage_accounts</span>
                                    <p>Account settings</p>
                                </a>
                            </li>

                            <li class="account-menu-item">
                                <a href="">
                                    <span class="material-icons">help_center</span>
                                    <p>Help center</p>
                                </a>
                            </li>

                            <li class="account-menu-item">
                                <a href="">
                                    <span class="material-icons">logout</span>
                                    <p>Log out</p>
                                </a>
                            </li>
                        </ul>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                isAccountOpen: false,
                defaultAvatarImgUrl: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
            }
        },

        props: {
            user: {}
        },
        methods:{
            openAccount(){
                if(this.isAccountOpen){
                    this.isAccountOpen = false;
                }
                else{
                    this.isAccountOpen = true;
                }
            }
        }
    }

</script>

<style scoped>
    a{
        color: #1b2559;
    }

    .dashboard-header{
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        height: 80px;
        padding: 0 20px;
    }

    .search{
        display: flex;
        gap: 5px;
        align-items: center;
        padding: 10px 20px;
        background-color: white;
        border: 1px solid white;
        border-radius: 10px;
        width: 30%;
    }

    .search span{
        font-size: 28px;
    }

    .search input{
        border: none;
        background: transparent;
        outline: none;
        font-size: 20px;
    }

    .search:has(input:focus){
        border-color: #44beee;
    }

    .header-main{
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .languages{
        cursor: pointer;
    }

    .language-main{
        width: 50px;
    }

    .language-main img{
        width: 100%;
    }

    .notifications span{
        color: rgb(92, 154, 213);
        font-size: 32px;
        cursor: pointer;
    }

    .account{
        color: #1b2559;
        position: relative;
    }
    .account-avatar{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        cursor: pointer;
    }

    .account-avatar img{
        width: 100%;
    }

    .account-extra{
        position: absolute;
        bottom: -750%;
        right: 0;
        background-color: white;
        border-radius: 20px;
    }

    .user-info{
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 10px 20px;
        border-bottom: 1px solid black;
    }

    .user-name, .user-email{
        font-size: 16px;
        line-height: 18px;
    }

    .account-nav{
        padding: 10px 20px;
    }

    .account-menu-item a{
        padding: 10px;
    }

    .account-menu-item:hover{
        background-color: #e9edf7;
        border-radius: 5px;
    }
    .account-menu-item a{
        font-size: 18px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 5px;
        }
</style>