<template>
    <button @click="solvePracticeTest()"> Practice Test Solve</button>
</template>

<script>
    export default{
        data(){
            return{}
        },

        methods: {
            solvePracticeTest(){
                this.$router.push("/solvePracticeTest")
            }
        }
    }
</script>