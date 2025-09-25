<template>
    <div class="verify-email">
        <div class="verify-logo" :class="{ successLogo: isSuccess, failLogo: !isSuccess }">
            <span class="material-icons" >{{ icon }}</span>
        </div>
        <p class="verify-message">  {{ message }} </p>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                email: "",
                emailCode: "",
                message: "",
                icon: "",
                isSuccess: false
            }
        },

        methods: {
            async verifyEmail(){
                const formData = new FormData();
                formData.append("email", this.email)
                formData.append("emailCode", this.emailCode)

                const response = await this.$axios.post("http://localhost:8080/api/auth/verifyEmail", formData)
                if(response.data.success){
                    this.message = "Email successfullly verified"
                    this.icon="check"
                    this.isSuccess = true
                }
                else{
                    this.icon="close"
                    this.message = "Something went wrong"
                    this.isSuccess = false
                }
            }
        },

        mounted(){
           this.email = this.$route.query.email;
           this.emailCode = this.$route.query.emailCode 
           this.verifyEmail();
        }
    }
</script>


<style>
    .verify-email{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100vw;
        height: 100vh;
    }

    .verify-logo{
         width: 100px;
         height: 100px;
         display: flex;
         align-items: center;
         justify-content: center;
         border: 4px solid;
         border-radius: 50%;   
         margin-bottom: 20px;
        /* background-color: red; */
    }

    .verify-logo span{
        font-size: 48px;
    }

    .successLogo{
        border-color: #057F4B;
        color: #057F4B;
    }

    .failLogo{
        border-color: red;
        color: red;
    }

    .verify-message{
        font-size: 36px;
    }
</style>