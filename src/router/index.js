import {createRouter, createWebHistory} from 'vue-router'
import Dashboard from "../components/dashboard/Dashboard.vue"
import Web from "../components/mainPage/Web.vue"
import Questions from "../components/question/Questions.vue"
import PracticeTests from "../components/practicetests/PracticeTests.vue"


const routes = [

    {
        path: '/',
        name: 'Web',
        component: Web
    },
    {
        path: '/dashboard',
        name: "Dashboard",
        component: Dashboard,
        children: [
            {
                path: "/questions",
                component: Questions
            },

            {
                path: "/practicetests",
                component: PracticeTests
            }
        ]
    }

]


const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router