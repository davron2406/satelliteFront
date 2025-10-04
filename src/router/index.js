import { createRouter, createWebHistory } from 'vue-router'

import Web from '../components/mainPage/Web.vue'
import DashboardLayout from '../components/views/DashboardLayout.vue'

// dashboard pages
import Overview from '../components/views/Overview.vue'
import PracticeTestsBuilder from '../components/views/PracticeTestBuilder.vue'
import QuestionCreator from '../components/views/QuestionCreator.vue'
import PracticeTestRunner from '../components/views/PracticeTestRunner.vue'
import Classess from '../components/views/Classess.vue'
import TestResults from '../components/views/TestResults.vue'
import Settings from '../components/views/Settings.vue'
import Students from '../components/views/Students.vue'

const routes = [
  { path: '/', name: 'home', component: Web },
  {
    path: '/dashboard',
    component: DashboardLayout, // owns Sidebar + <router-view />
    children: [
      { path: '', redirect: { name: 'db-overview' } },
      { path: 'overview',           name: 'db-overview',         component: Overview,               meta: { title: 'Dashboard' } },
      { path: 'practice',           name: 'db-practice',         component: PracticeTestsBuilder,   meta: { title: 'Practice Tests' } },
      { path: 'practice-test-runner', name: 'db-practiceTestRunner', component: PracticeTestRunner, meta: { title: 'Practice Tests' } },
      { path: 'question',           name: 'db-question',         component: QuestionCreator,        meta: { title: 'Question Creator' } },
      { path: 'classes',            name: 'db-classes',          component: Classess,               meta: { title: 'Classes' } },
      { path: 'test-results',       name: 'db-testResults',      component: TestResults,            meta: { title: 'Test Results' } },
      { path: 'students',           name: 'db-students',         component: Students,               meta: { title: 'Students' } },
      { path: 'settings',           name: 'db-settings',         component: Settings,               meta: { title: 'Settings' } },
    ]
  }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})
