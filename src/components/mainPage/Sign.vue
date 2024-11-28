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
                        <input type="text" id="email" name="email" v-model="user.email">
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
                        <label for="avatar">Avatar*</label>
                        <input type="file" id="avatar" ref="fileInput" @change="handleFile()">
                    </div>

                    <div>
                        <button class="btn-sign-up" @click="register()">SIGN UP</button>
                    </div>

                    <div>
                        <p>if you have an account please <button @click="openSignIn">SIGN IN</button></p>
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
                        <p>if you don't have an account please <button @click="openSignUp" >SIGN UP</button></p>
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
                user:{
                    firstName:"",
                    lastName:"",
                    email:"",
                    phoneNumber:"",
                },

                userSignIn:{
                    email:"",
                    password: "",
                }
            }
        },

        methods:{
            async register(){
                if(this.user.name == "" || this.user.surname == "" || this.user.email == "" || this.user.phoneNumber == "", this.user.email ==""){
                    console.log("Please fill all fields")
                }
                else{
                    const response = await axios.post("http://localhost:8080/api/auth/register", this.user)
                    console.log(response);
                }
                this.$emit("closeSign")
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

            async login(){
              const response = await this.$axios.post("/auth/login", this.userSignIn)
              if(response.data.success == false){
                this.userSignIn.email = null
                this.userSignIn.password = null
              }
              else{
                localStorage.setItem('token',response.data)
                this.$router.push('/dashboard')
              }
            },
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
</style>