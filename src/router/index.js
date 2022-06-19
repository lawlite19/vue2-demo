import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const menu = () => import(/* webpackChunkName: "index" */ '../page/menu.vue')
const ipLocation = () => import(/* webpackChunkName: "index" */ '../page/ipLocation.vue')

const routes = [
  {
    path: '/',
    component: menu,
    name: '',
    children: [{
			path: '/ipLocation',
			component: ipLocation,
			meta: ['IP定位']
		}]
  }
]

export default new Router({
  routes,
  strict: process.env.NODE_ENV !== 'production'
})
