<template>
    <div class="header-wrapper">
        <header class="header container">
            <div class="header-logo">
                <a href="#">
                    <img src="../../assets/logo.svg" alt="">
                </a>
            </div>

            <nav class="header-nav">
                <ul class="header-menu" :class="{openedMenu: isMenuOpen, closedMenu: !isMenuOpen}">
                    <li class="header-menu-item">
                        <a href="#">Home</a>
                    </li>

                    <li class="header-menu-item">
                        <a href="#">Practice teste</a>
                    </li>

                    <li class="header-menu-item">
                        <a href="#">Books</a>
                    </li>

                    <li class="header-menu-item">
                        <a href="#">Courses </a>
                    </li>

                    <li class="header-menu-item">
                        <a href="#">Contact</a>
                    </li>
                </ul>

                <div class="btn-wrapper">
                    <button class="btn-header" @click="signUp">Sign-up</button>
                    <button class="btn-header" @click="signIn">Sign-In</button>
                </div>
                
                <button class="menu" @click="openMenu()"><span class="material-icons">menu</span></button>
            </nav>
        </header>
    </div>
    
</template>

<script>
    export default{
        data(){
            return{
                isMenuOpen: false
            }
        },

        methods:{
            signUp(){
                this.$emit("openSignUp")
            },

            signIn(){
                this.$emit("openSignIn")
            },

            openMenu(){
                if(this.isMenuOpen){
                    this.isMenuOpen = false
                }
                else{
                    this.isMenuOpen = true
                }
            }
        }
    }
</script>

<style scoped>

.container{
    width: 80%;
    margin: 0 auto;
}

.header-wrapper{
    background-color: #f4f1f1;
    width: 100%;
    height: 100px;
    display: flex;
    place-items: center;
    position: fixed;
    z-index: 150;
    top: 0;
}


.header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 10px 20px;
    border-radius: 40px;
}

.header-logo{
    height: 100%;
    width: 12%;
}


.header-logo img{
    width: 100%;
}

.header-nav{
    display: flex;
    align-items: center;
    gap: 20px;
    position: relative;
}

.header-menu::after{
    position: absolute;
    content: "";
    width: 1.5px;
    height: 120%;
    align-self: center;
    background-color: #000;
    right: -10px;
}


.header-menu{
    position: relative;
    display: flex;
    align-items: center;
    list-style: none;
    column-gap: 20px;
    margin-bottom: 0;
}

.header-menu-item a{
    text-decoration: none;
    color: #2F2B36;;
    font-family: madefor-text, helveticaneuew01-45ligh, helveticaneuew02-45ligh, helveticaneuew10-45ligh, sans-serif;
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    letter-spacing: 1px;

}

.header-menu-item:hover a{
    color: #76747B;
}

.btn-wrapper{
    display: flex;
    place-items: center;
}

.btn-header{
    background-color: #F5B301;
    color: black;
    padding: 5px 25px;
    font-weight: normal;
    border-radius: 20px;
    transition: all .3s;
    cursor: pointer;
    border: none;
    font-size: 16px;
}

.btn-header:hover{
    background-color: black;
    color: #F5B301;
}

.menu{
    border: none;
    outline: none;
    display: none;
}

@media (max-width: 990px){

    .container{
        width: 95%;
    }
    .header-menu a{
        font-size: 12px;
    }

    .header-nav{
        gap: 5px;
    }

    .btn-header{
        padding: 4px 10px;
        font-size: 12px;
    }

    .btn-wrapper{
        margin-left: 15px;
    }

    
}

@media (max-width: 650px){

    .menu{
        display: block;
    }

.header-logo{
    width: 30%;
}

.btn-header{
    font-size: 18px;
}
.header-menu{
    flex-direction: column;
    order: 1;
    position: absolute;
    right: -40px;
    top: calc(100% + 35px);
    background-color: #fff;
    padding: 30px;
    height: 100vh;
    border-top-left-radius: 20px;
    transition: all 0.3s ease-in-out;
}


.closedMenu{
    transform: translateX(200px);
}

.openedMenu{
    transform: translateX(0);
}
.header-menu::after{
    display: none
}
}
</style>