<template>
    <div class="sign"> 
        <div class="sign-main container">
            <div class="exit" @click="exit">
                <span class="material-icons">close</span>
            </div>

            <div class="sign-left">
                <p>Take First step to success</p>
            </div>

            <div class="sign-right">
                <div class="signUp" v-if="this.signType=='signUp'">
                    <div>
                        <label for="name">First Name*</label>
                        <input type="text" id="name" name="name" v-model="user.firstName">
                    </div>
                
                    <div>
                        <label for="last name">Last Name*</label>
                        <input type="text" id="lastName" name="lastName" v-model="user.lastName">
                    </div>
                    
                    <div>
                        <label for="email"> Email*</label>
                        <input type="email" id="email" name="email" v-model="user.email">
                    </div>
                    
                    <div>
                        <label for="phone">Phone Number*</label>
                        <input type="text" id="phone" name="phone" v-model="user.phoneNumber">
                    </div>

                    <div>
                        <label for="password">Password*</label>
                        <input type="password" id="password" name="password" v-model="user.password">
                    </div>

                    <div>
                        <button class="btn-sign-up" @click="register()">SIGN UP</button>
                    </div>

                    <div>
                        <p class="changingSign">if you have an account please <button @click="openSignIn">SIGN IN</button></p>
                    </div>
                </div>

                <div class="signIn" v-if="this.signType=='signIn'">
                    <div>
                        <label for="email"> Email*</label>
                        <input type="email" id="email" name="email" v-model="userSignIn.email">
                    </div>

                    <div>
                        <label for="password">Password*</label>
                        <input type="password" id="password" name="password" v-model="userSignIn.password">
                    </div>

                    <div>
                        <button class="btn-sign-up" @click="login()">SIGN IN</button>
                    </div>

                    <div>
                        <p class="changingSign">if you don't have an account please <button @click="openSignUp" >SIGN UP</button></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Popup v-if="isPopUpOpen" :message="this.popUpMessage"
        time=3
        :backgroundColor="this.backgroundColor"
        @closePopup="closePopup()">
    </Popup>
</template>

<script>
    import Popup from '../utils/Popup.vue';
    export default{ 
        data(){
            return{
                user:{
                    firstName:"",
                    lastName:"",
                    email:"",
                    phoneNumber:"",
                    password: ""
                },

                userSignIn:{
                    email:"",
                    password: "",
                },
                popUpMessage: "",
                backgroundColor: "",
                isPopUpOpen: false,
            }
        },

        components:{
            Popup
        },

        methods:{
            async register(){
                for(let key in this.user){
                    if(!this.user[key]){
                        this.popUpMessage = `${key} cannot be empty`
                        this.backgroundColor = "red";
                        this.isPopUpOpen = true;
                        return;
                    }
                }
                if(!this.user.email.includes('@')){
                    this.popUpMessage = `Please enter correct email`
                    this.backgroundColor = "red";
                    this.isPopUpOpen = true;
                    return;
                }

                try{
                    const response = await this.$axios.post("/auth/register", this.user)
                    if(!response.data.isSuccess){
                        this.popUpMessage = `Successfully registerd Please verify your email and Sign in`
                        this.backgroundColor = "green";
                        this.isPopUpOpen = true;
                    }
                    await this.wait(3000);

                    this.openSignIn();
                }
                catch(error){
                    this.popUpMessage = error.message
                    this.backgroundColor = "green";
                    this.isPopUpOpen = true;
                }
                
            },

            exit(){
                this.$emit("closeSign")
            },

            openSignUp(){
                this.$emit("openSignUp")
            },

            openSignIn(){
                this.$emit("openSignIn")
            },

            closePopup(){
                this.isPopUpOpen = false
            },

            async login(){
              for(let key in this.userSignIn){
                if(!this.userSignIn[key]){
                    this.popUpMessage = `Please fill ${key}`
                    this.backgroundColor = "red"
                    this.isPopUpOpen = true
                    return;
                }
              }
              try{
                const response = await this.$axios.post("/auth/login", this.userSignIn)
                if(response.data.success == false){
                    this.userSignIn.email = null
                    this.userSignIn.password = null
                    this.popUpMessage = "Password or email is incorrect"
                    this.backgroundColor = "red"
                    this.isPopUpOpen = true
                }
                else{
                    localStorage.setItem('token',response.data)
                    this.$router.push('/dashboard')
                }
              }catch(error){
                 this.backgroundColor = "red"
                 this.popUpMessage = error.message
                 this.isPopUpOpen = true
              }
              
            },

            wait(ms){
                return new Promise(resolve => setTimeout(resolve, ms));
            }
        },

        props:{
            signType:{
                type: String,
                required: true
            }
        }
    }

</script>

<style>
    .sign{
        height: 100vh;
        width: 100vw;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(255, 255, 255, 0.647);
        z-index: 500;
        display: flex;
        place-items: center;
    }

    .exit{
        position: absolute;
        top: 10px;
        right: 10px;
        color: red;
        cursor: pointer;
    }

    .sign-main{
        display: flex;
        align-items: center;
        background-color: #EBECF3;
        padding: 50px;
        border-radius: 30px;
        position: relative;   
    }

    .sign-right, .sign-left{
        width: 50%;
    }

    .sign-left p{
        font-size: 64px;
        line-height: 64px;
    }

    .sign-right, .signIn, .signUp{
        display: flex;
        flex-direction: column;
        row-gap: 20px;
    }
    .sign-right div{
        display: flex;
        flex-direction: column;
    }

    .sign-right div input{
        outline: none;
        border: none;
        background-color: transparent;
        border-bottom: 1px solid black;
        padding: 10px;
        font-size: 18px;
    }

    .btn-sign-up{
        padding: 10px;
        background-color: #2F2B36;
        border: none;
        color: white;
        font-weight: 600;
        letter-spacing: 1px;
        font-size: 18px;
        border-radius: 10px;
        cursor: pointer;
    }

    .scrollDisable{
        height: 100vh;
        overflow-y: hidden;
    }


    @media (max-width: 1000px){
        .sign-left p{
            font-size: 48px;
        }

        .changingSign{
            font-size: 18px;
        }

        .sign-right, .signIn, .signUp{
            row-gap: 10px;
        }

        .sign-right div input{
            padding: 5px;
        }
    }

    @media (max-width: 700px){
        .sign-left p{
            font-size: 24px;
            line-height: 28px;
        }

        .sign-left{
            margin-bottom: 10px;
        }

        .sign-main{
            flex-direction: column;
            padding: 20px 50px;
        }

        .sign-left{
            width: 100%;
            text-align: center;
        }

        .sign-right{
            width: 100%;
        }

        .changingSign{
            font-size: 18px;
        }

        .sign-right, .signIn, .signUp{
            row-gap: 10px;
        }

        .sign-right div input{
            padding: 5px;
        }

        .signIn, .signUp label{
            font-size: 16px;
        }
    }


</style>