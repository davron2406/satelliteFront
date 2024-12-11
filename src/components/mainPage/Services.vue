<template>
    <div class="services">
        <div class="title container">
            <p>services</p>
        </div>
        <div class="subtitle container">
            <p>Committed to Excellence</p>
        </div>

        <Service v-for="service in services"
        :serviceNumber="service.serviceNumber"
        :serviceName="service.serviceName"
        :serviceDescription="service.serviceDescription"
        ></Service>
    </div>
</template>

<script>
import Service from './Service.vue';
export default{
    data(){
        return{
            services: [
                {
                    "serviceNumber": 1,
                    "serviceName": "SAT ENGLISH",
                    "serviceDescription": "This is the space to describe the service and explain how customers or clients can benefit from it. It’s an opportunity to add a short description that includes relevant details, like pricing, duration, location and how to book the service."
                },
                {
                    "serviceNumber": 2,
                    "serviceName": "SAT MATH",
                    "serviceDescription": "This is the space to describe the service and explain how customers or clients can benefit from it. It’s an opportunity to add a short description that includes relevant details, like pricing, duration, location and how to book the service."
                },
                {
                    "serviceNumber": 3,
                    "serviceName": "PRACTICE TESTS",
                    "serviceDescription": "This is the space to describe the service and explain how customers or clients can benefit from it. It’s an opportunity to add a short description that includes relevant details, like pricing, duration, location and how to book the service."
                },
                {
                    "serviceNumber": 4,
                    "serviceName": "Name of Service",
                    "serviceDescription": "This is the space to describe the service and explain how customers or clients can benefit from it. It’s an opportunity to add a short description that includes relevant details, like pricing, duration, location and how to book the service."
                },
                {
                    "serviceNumber": 5,
                    "serviceName": "Name of Service",
                    "serviceDescription": "This is the space to describe the service and explain how customers or clients can benefit from it. It’s an opportunity to add a short description that includes relevant details, like pricing, duration, location and how to book the service."
                }
            ]
        }
    },

    components: {
        Service,
    }
}

</script>

<style>
    .services{
        padding-top: 100px;
    }

    .title p{
        display: inline-block;
        background-color: #F5B301;
        padding: 3px 10px;
        text-transform: uppercase;
        color: black;
        font-size: 16px;
        letter-spacing: 2px;
        font-weight: 700;
        border-top-right-radius: 10px;
    }

    .subtitle{
        margin: 30px auto;
    }
    .subtitle p{
        font-size: 48px;
        color: #2F2B36;
        font-weight: 700;
        line-height: 48px;
    }

    @media (max-width: 1000px){
        .title p {
            font-size: 14px;
        }

        .subtitle p {
            font-size: 36px;
            line-height: 36px;
        }
    }

    @media (max-width: 700px){
        .title p {
            font-size: 12px;
        }

        .subtitle p {
            font-size: 24px;
            line-height: 36px;
        }
    }
</style>