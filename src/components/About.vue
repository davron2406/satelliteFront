<template>
    <div class="about" ref="about">
        <div class="about-main">
            <div class="about-title" :class="{'stopped': isTitleStopped, 'paddingTop800': paddingTop800}">
                <div class="title">
                    <p>About</p>
                </div>
                <div class="subtitle">
                    <p>About our Business</p>
                </div>
            </div>

            <div class="about-info" ref="aboutInfo">
                <p>This is a space to share more about the business. Take advantage of this long text to tell people who's behind it, what it does, how it began, and other details. It's an excellent place to share the story behind the business and describe what this site has to offer its visitors.
                    You can write about the business's history here, from its founding until now. Draw readers in with an engaging narrative. By telling its story, you can help people connect to the business. Share what inspired its creation and what need it was meant to fill. You can include details of the obstacles it overcame to get where it is today.
                    This space is also a good spot to talk about a particular feature of the business that sets it apart from its competitors. Explain to readers what makes this business unique and why they should choose it over other options. Focus on the value this business can offer its users.
                    Let visitors to this website know that they'll find what they're looking for right here. Present the business as the solution to a specific problem and highlight the ways the business's products or services can make life better for people.
                    Outline the business's mission and core values. Describe the principles that drive its work and the standards it upholds. In a few words, explain the impact this business has had, or hopes to have, on its community and the world.
                    Tell readers how the business puts its users first. Emphasize how it looks out for them, finding solutions to meet their needs and keep them satisfied. Reassure prospective clients and customers that they won't regret choosing the business's services or products.</p>
            </div>

            <div class="about-img" :class="{'stopped': isImgStopped, 'paddingTop1000': paddingTop1000}">
                <div class="about-img-row about-img-row-1">
                    <div class="about-img-col about-img-col-1"></div>
                    <div class="about-img-col about-img-col-2"></div>
                </div>
                <div class="about-img-row about-img-row-2">
                    <div class="about-img-col about-img-col-1"></div>
                    <div class="about-img-col about-img-col-2"></div>
                </div>
                <div class="about-img-row about-img-row-3">
                    <div class="about-img-col about-img-col-1"></div>
                    <div class="about-img-col about-img-col-2"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                isTitleStopped: false,
                isImgStopped:false,
                paddingTop1000: false,
                paddingTop800: false,
            }
        },

        methods: {
            handleScroll(){
                const rectAbout = this.$refs.about.getBoundingClientRect();
                const rectAboutInfo = this.$refs.aboutInfo.getBoundingClientRect();
                console.log(rectAboutInfo.top)

                const contentHeight = document.querySelector('.about-info').offsetHeight;

                if(rectAbout.top < 100){
                    this.isTitleStopped = true;
                }
           
                if(rectAbout.top > 200 ){
                    this.isTitleStopped = false;
                }

                if(rectAboutInfo.top < -400){
                    this.isImgStopped = true;
                }

                if(rectAboutInfo.top > -400){
                    this.isImgStopped = false;
                }

                if(rectAbout.bottom < 750){
                    this.isTitleStopped = false;
                    this.isImgStopped = false;
                    this.paddingTop1000 = true;
                    this.paddingTop800 = true;
                }

                if(rectAbout.bottom > 750){
                    this.paddingTop1000 = false;
                    this.paddingTop800 = false;
                }


                // else{
                //     this.isStopped = false;
                // }
            }
        },

        mounted(){
            window.addEventListener('scroll', this.handleScroll)
        },

        beforeDestroy(){
            window.removeEventListener('scroll', this.handleScroll)
        }
    }

</script>

<style>

    .about{
        padding: 100px 0;
        background-color: #fff;
    }

    .about-main{
        margin-left: 10%;
        display: flex;
        justify-content: space-between;
    }

    .about-title{
        width: 30rem;
    }

    .about-title.stopped{
        position: fixed;
        top: 200px;
        z-index: 1500;
    }

    .about-title.stopped + div{
        margin-left: 40rem;
    }

    .about-info{
        width: 20rem;
        font-size: 18px;
        padding-top: 800px;
    }

    .about-img{
        width: 20rem;
        padding-top: 600px;
        /* padding-bottom: 200px; */
    }

    .about-img.stopped{
        position: fixed;
        top: 200px;
        right: 0;
        z-index: 1500;
        padding-top: 0;

    }

    .about-img-row{ 
        display: flex;
        height: 200px;
    }

    .about-img-row-1 .about-img-col-1{
        width: 50%;
        background-color: #1E2328;
        border-top-left-radius: 100px;
        border-bottom-left-radius: 100px;
        border-top-right-radius: 100px;
    }

    .about-img-row-1 .about-img-col-2{
        width: 50%;
        background-color: #3B3F46;
        border-top-right-radius: 100px;
    }

    .about-img-row-2 .about-img-col-1{
        width: 50%;
        background-color: #1E2328;
        border-top-left-radius: 100px;
        border-bottom-left-radius: 100px;
        border-bottom-right-radius: 100px;
    }

    
    .about-img-row-2 .about-img-col-2{
        width: 50%;
        background-color: #1E2328;
        border-top-right-radius: 100px;
        border-bottom-left-radius: 100px;
        border-bottom-right-radius: 100px;
    }

    .about-img-row-3 .about-img-col-1{
        width: 50%;
        background-color: #F5A302;
        border-bottom-left-radius: 100px;
    }

    .about-img-row-3 .about-img-col-2{
        width: 50%;
        background-color: #FED053;
        border-top-right-radius: 100px;
        border-bottom-left-radius: 100px;
        border-bottom-right-radius: 100px;
    }

    .before-enter{
        opacity: 0;
        transform: translateY(100px);
        transition: all 2s ease-out;
    }

    .enter{
        opacity: 1;
        transform: translateY(0px);
    }

    .paddingTop1000{
        padding-top: 1500px;
    }

    .paddingTop800{
        padding-top: 1660px;
    }

</style>