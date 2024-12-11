<template>
    <div class="home">
        <div class="home-main container">
            <div class="home-info">
                <h1>Biz bilan yuqori natijalar sari</h1>
                <p>SAT imtihoniga eng kerakli materiallar, kurslar, practice testlar bilan tayyorlaning</p>
            </div>

            <div class="home-img">
                <div class="animation">
                    <div class="animation-row animation-row-1">
                        <div class="animation-col animation-col-1"></div>
                        <div class="animation-col animation-col-2"></div>
                        <div class="animation-col animation-col-3"></div>
                        <div class="animation-col animation-col-4"></div>
                    </div>
                    <div class="animation-row animation-row-2">
                        <div class="animation-col animation-col-1"></div>
                        <div class="animation-col animation-col-2"></div>
                        <div class="animation-col animation-col-3"></div>
                        <div class="animation-col animation-col-4"></div>
                    </div>
                    <div class="animation-row animation-row-3">
                        <div class="animation-col animation-col-1"></div>
                        <div class="animation-col animation-col-2"></div>
                        <div class="animation-col animation-col-3"></div>
                        <div class="animation-col animation-col-4"></div>
                    </div>
                </div>
            </div>
        </div>
       
    </div>
</template>

<script>

</script>

<style>
    .home{
        padding-top: 50px;
        margin-top: 100px;
        height: 100vh;
        font: normal normal normal 22px / 1.4em madefor-text, helveticaneuew01-45ligh, helveticaneuew02-45ligh, helveticaneuew10-45ligh, sans-serif;
        background-color: #f4f1f1;
    }

    .home-main{
        display: flex;
        width: 80%;
        justify-content: space-between;
    }

    .home-info{
        width: 45%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .home-info h1{
        font-size: 72px;
        color: rgb(47,43,54);
        margin-bottom: 15px;
    }

    .home-info p{
        color: rgb(47,43,54);
        width: 90%;
    }
    .home-img{
        width: 50%;
    }

    .animation{
        width: 100%;
        height: 100%;
        overflow-x: hidden;
    }

    .animation-row{
        height: 200px;
        position: relative;
        display: flex;
    }

    .animation-row-1 .animation-col-1{
        background-color: #1E2328;
        width: 50%;
        height: 100%;
        border-bottom-right-radius: 150px;
        border-top-left-radius: 150px;
    }

    .animation-row-1 .animation-col-2{
        position: absolute;
        background-color: #2A2E34;
        width: 50%;
        height: 100%;
        border-bottom-right-radius: 150px;
        border-top-left-radius: 150px;
        transition: all .3s;
    }

    .animation-row-1 .animation-col-3{
        position: absolute;
        background-color: #3B3F46;
        width: 50%;
        height: 100%;
        border-bottom-right-radius: 150px;
        border-top-left-radius: 150px;
        transition: all .3s;
    }

    .animation-row-1 .animation-col-4{
        width: 50%;
        height: 100%;
        border-bottom-left-radius: 150px;
        background-color: #2A2E34;
        transition: all .3s;
    }

    .animation:hover .animation-row-1 .animation-col-2{
        transform: translateX(50px);
    }

    .animation:hover .animation-row-1 .animation-col-3{
        transform: translateX(100px);
    }
    .animation:hover .animation-row-1 .animation-col-4{
        transform: translateX(100px);
    }

    .animation-row-2 .animation-col-1{
        width: 65%;
        height: 100%;
        background-color: #F5B301;
        border-top-right-radius: 100px;
        border-bottom-right-radius: 100px;
    }

    .animation-row-2 .animation-col-2{
        position: absolute;
        right: 0;
        z-index: 100;
        width: 35%;
        height: 100%;
        background-color: #F5A302;
        border-radius: 50%;
        transition: all .3s;
    }

    .animation-row-2 .animation-col-3{
        position: absolute;
        z-index: 50;
        right: 0;
        width: 35%;
        height: 100%;
        background-color: #F5B301;
        border-radius: 50%;
        transition: all .3s;

    }

    .animation-row-2 .animation-col-4{
        position: absolute;
        right: 0;
        width: 35%;
        height: 100%;
        background-color: #FED053;
        border-radius: 50%;
    }

    .animation:hover .animation-row-2 .animation-col-2{
        transform: translateX(-150px);
    }

    .animation:hover .animation-row-2 .animation-col-3{
        transform: translateX(-75px);
    }

    .animation-row-3 .animation-col-1{
        width: 40%;
        height: 100%;
        background-color: #fff;
        border-bottom-left-radius: 150px;
    }
    
    .animation-row-3 .animation-col-2{
        width: 10%;
        height: 100%;
        background-color: #e7e5e5;
        transition: all .5s;
    }

    .animation-row-3 .animation-col-3{
        width: 10%;
        height: 100%;
        background-color: #d0cfcf;
        transition: all .5s;
    }

    
    .animation-row-3 .animation-col-4{
        width: 40%;
        height: 100%;
        background-color: #c3c2c2;
        border-bottom-right-radius: 150px;
        border-top-right-radius: 150px;
    }

    .animation:hover .animation-row-3 .animation-col-2{
        background-color: #c3c2c2;
    }

    .animation:hover .animation-row-3 .animation-col-3{
        background-color: #c3c2c2;
    }


    @media (max-width: 1000px){
        .home-info h1{
            font-size: 48px;
        }

        .home{
            height: 70vh;
        }

        .home-main{
            height: 100%;
        }

        .home-img{
            height: 100%;
        }

        .animation-row{
            height: 130px;
        }
    }

    @media (max-width: 700px){
        .home-main{
            flex-direction: column;
            height: auto;
            gap: 20px;
        }

        .home{
            height: auto;
        }

        .home-info{
            width: 100%;
        }

        .home-img{
            width: 100%;
        }

        .animation-row{
            height: 150px;
        }
    }


    @media (max-width: 550px){
        .animation-row{
            height: 120px;
        }
    }


</style>