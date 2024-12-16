import {createRouter, createWebHistory} from 'vue-router'
import Dashboard from "../components/dashboard/Dashboard.vue"
import Web from "../components/mainPage/Web.vue"
import Questions from "../components/question/Questions.vue"
import PracticeTests from "../components/practiceTests/PracticeTests.vue"
import MyPracticeTests from '../components/practiceTests/MyPracticeTests.vue'
import PracticeTestsToSolve from "../components/practiceTests/SelectPracticeTest.vue"
import SolvingPracticeTest from "../components/solvingPracticeTest/SolvingPracticeTest.vue"
import FinishedPracticeTest from '../components/solvingPracticeTest/FinishedPracticeTest.vue'
import VerifyEmail from '../components/utils/VerifyEmail.vue'



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
                path: "/myPracticeTests",
                component: MyPracticeTests
            },

            {
                path: "/practiceTests",
                component: PracticeTests
            }
        ]
    },

    {
        path: "/solvePracticeTest",
        component: PracticeTestsToSolve
    },

    {
        path:"/solvingPracticeTest/:practiceTestId",
        component: SolvingPracticeTest
    },

    {
        path: "/finishedPracticeTest/:solvedPraticeTestId",
        component: FinishedPracticeTest
    },

    {
        path: "/verifyEmail",
        component: VerifyEmail
    }

    

]


const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router