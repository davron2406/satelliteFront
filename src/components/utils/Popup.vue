<template>
    <div class="popup-main" :class="{active: this.isActive}" :style="cssProps">
        <h1 class="popup-message">{{ message }}</h1>
        <div class="popup-time" :style="cssProps">
            <div></div>
        </div>
    </div>

</template>

<script>
export default{
    data(){
        return{
            isActive:false,
        }
    },

    props:{
        message:{
            type:String,
            required: true,
        },

        backgroundColor: {
            type:String,
            required: true
        }
        ,
        time:{ 
            type: String,
            required: true
        }
    },

    computed: {
        cssProps() {
            return {
                '--animation-duration': (this.time) + "s",
                '--backgroundColor': this.backgroundColor
            }
        }
  },

    mounted(){
        const timeOut = setTimeout(() => {
            this.isActive = true;
        },10);

        const timeOutToDeletePopup = setTimeout(() => {
            this.isActive = false;
        },(this.time-0.5) * 1000)

        const timeOut1 = setTimeout(() => {
            this.$emit("closePopup")
        }, this.time*1000);
    }
}
</script>


<style>
    .popup-main{
        position: fixed;
        right: -300px;
        top: 20px;
        width: 300px;
        background-color: var(--backgroundColor);
        border: 2px solid #fff;
        border-radius: 5px;
        background-clip: padding-box;
        padding: 10px;
        transition: all .3s ease-out;
        z-index: 10000;
    }

    .popup-main.active{
        right: 0;
    }

    .popup-message{
        font-size: 22px;
        text-align: center;
        color: white;
    }
    .popup-time{
        width: 100%;
        height: 3px;
        position: absolute;
        bottom: 0;
        left: 0;
        border-radius: 2px;
        animation-name: popupTime;
        animation-duration: var(--animation-duration);
    }

    .popup-time div{
        display: block;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.703);
    }

    @keyframes popupTime {
        from {width: 100%;}
        to {width: 0;}
    }
</style>