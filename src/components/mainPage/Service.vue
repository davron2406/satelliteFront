<template>
    <div class="service">
        <div class="service-main container">
            <div class="service-number">
                <p>0{{serviceNumber}}</p>
            </div>

            <div class="service-name">
                <p>{{ serviceName }}</p>
            </div>

            <div class="service-description">
                <p>{{ serviceDescription }}</p>
            </div>
        </div>
    </div>
</template>

<script>

export default{
    data(){
        return{

        }
    },

    props:{
        serviceNumber:{
            type: String,
            required: true
        },

        serviceName:{
            type:String,
            required: true,
        },

        serviceDescription:{
            type:String,
            required: true,
        },
    }
}

</script>

<style>

    .service{
        padding: 50px 0;
        border-top: 1px solid #76747B;
        border-bottom: 1px solid #76747B;
        transition: all .1s;
    }
    .service-main{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .service-number{
        width: 10%;
    }
    .service-number p{
        font-size: 48px;
        letter-spacing: 2px;
        color: #F5B301;
    }

    .service-name{
        width: 30%;
    }

    .service-name p{
        font-size: 32px;
        font-weight: 200;
        transition: all .1s;
        text-align: center;
    }

    .service-description{
        width: 60%;
    }

    .service-description p{
        transition: all .1s;
        font-weight: 200;
    }

    .service:hover{
        background-color: #76747B;
        color: white;
    }

    @media (max-width: 1000px){
        .service-name p{
            font-size: 24px;
        }

        .service-description p {
            font-size: 16px;
            text-align: center;
        }
    }

    @media(max-width: 700px){
        .service-main{
            flex-direction: column;
            gap: 20px;
        }

        .service{
            padding: 20px 0;
        }

        .service-description{
            width: 100%;
        }
    }

</style>