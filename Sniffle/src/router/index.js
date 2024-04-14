import { createRouter, createWebHistory } from 'vue-router'
import Homepage from '@/pages/Homepage.vue'
import Breedpage from '@/pages/Breedpage.vue'
import BreedDetails from '@/pages/BreedDetails.vue'
import ErrorNotFound from '@/pages/ErrorNotFound.vue'
import NewListing from '@/components/NewListing.vue'
import ListingPage from '@/pages/ListingPage.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Homepage
    },
    {
      path: '/breeds',
      name: 'breeds',
      component: Breedpage
    },
    {
      path: '/breed/:id',
      name: 'breed',
      component: BreedDetails
    },
    {
      path: '/newlisting',
      name: 'newlisting',
      component: NewListing
    },
    {
      path: '/listing/:id',
      name: 'listing',
      component: ListingPage
    },
    {
      path: '/404',
      name: '404',
      component: ErrorNotFound
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/404'
    },
    
  ]
})

export default router
