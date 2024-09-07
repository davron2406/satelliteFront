<template>
    <div class="header-wrapper">
        <header class="header container">
            <div class="header-logo">
                <a href="#">
                    <img src="../assets/logo.svg" alt="">
                </a>
            </div>

            <nav class="header-nav">
                <ul class="header-menu">
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
                    <button class="btn-header">Sign-up</button>
                </div>
                
            </nav>
        </header>
    </div>
    
</template>

<script>

</script>

<style>

.container{
    /* width: 80%; */
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
    list-style: none;
    gap: 20px;
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
    padding: 0 10px;
    background-color: #F5B301;
    color: black;
    padding: 7px 25px;
    font-weight: normal;
    border-radius: 20px;
    transition: all .3s;
    /* border: .5px solid black; */
    cursor: pointer;
    border: none;
}

.btn-header:hover{
    background-color: black;
    color: #F5B301;
    /* border: .5px solid black; */
}

</style>