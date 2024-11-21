<template>
    <div class="testimonials">
        <div class="testimonials-main container">
            <div class="title">
                <p>Testimonials</p>
            </div>

            <div class="subtitle">
                <p>What people are saying</p>
            </div>

            <div class="testimonials-cards">
                <div class="testimonials-card">
                    <div class="testimonials-card-img-wrapper">
                        <div class="testimonials-card-img">
                            <img src="../../assets/azim-dc6a7831.png" alt="">
                        </div>
                    </div>

                    <div class="testimonials-card-info">
                        <p class="client-claim">This is the space to share a review from one of the business's clients or customers.</p>
                        <p class="client-name">Ochilov azim</p>
                    </div>
                </div>

                <div class="testimonials-card">
                    <div class="testimonials-card-img-wrapper">
                        <div class="testimonials-card-img">
                            <img src="../../assets/azim-dc6a7831.png" alt="">
                        </div>
                    </div>

                    <div class="testimonials-card-info">
                        <p class="client-claim">This is the space to share a review from one of the business's clients or customers.</p>
                        <p class="client-name">Ochilov azim</p>
                    </div>
                </div>

                <div class="testimonials-card">
                    <div class="testimonials-card-img-wrapper">
                        <div class="testimonials-card-img">
                            <img src="../../assets/azim-dc6a7831.png" alt="">
                        </div>
                    </div>

                    <div class="testimonials-card-info">
                        <p class="client-claim">This is the space to share a review from one of the business's clients or customers.</p>
                        <p class="client-name">Ochilov azim</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

</script>

<style>

    .testimonials{
        padding: 100px 0;
    }

    .testimonials-cards{
        margin-top: 50px;
        display: flex;
        justify-content: space-between;
    }

    .testimonials-card{
        width: 30%;
        border: 1px solid black;
    }

    .testimonials-card-img-wrapper{
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 50px 0;
        border-bottom: 1px solid black;
    }

    .testimonials-card-img{
        width: 70%;
        height: 70%;
        border-top-left-radius: 50%;
        border-top-right-radius: 50%;
        border-bottom-right-radius: 50%;
        overflow: hidden;
        transition: all .3s;
    }

    .testimonials-card-img:hover{
        scale: 1.1;
        height: 80%;
    }

    .testimonials-card-img img{
        width: 100%;
        height: 100%;
    }

    .testimonials-card-info{
        padding: 30px;
    }

    .client-claim{
        text-align: center;
        font-size: 20px;
    }

    .client-name{
        text-align: center;
        margin-top: 20px;
    }
</style>