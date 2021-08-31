import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'

import * as routerName from '@/router/modules/router-constants'

Vue.use(Router)

export const constantRoutes: RouteConfig[] = [
  {
    path: '/redirect',
    component: routerName['Layout'],
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path*',
        component: routerName['rediredct']
      }
    ]
  },
  {
    path: '/login',
    component: routerName['login'],
    meta: { hidden: true }
  },
  // {
  //   path: '/profile',
  //   component: routerName['Layout'],
  //   redirect: '/profile/index',
  //   meta: { hidden: true },
  //   children: [
  //     {
  //       path: 'index',
  //       component: routerName['profile'],
  //       name: 'Profile',
  //       meta: {
  //         title: 'profile',
  //         icon: 'user',
  //         noCache: true
  //       }
  //     }
  //   ]
  // },
  {
    path: '/auth-redirect',
    component: routerName['authRedirect'],
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: routerName['error404Page'],
    meta: { hidden: true }
  },
  {
    path: '/401',
    component: routerName['error401Page'],
    meta: { hidden: true }
  },
  {
    path: '/',
    component: routerName['Layout'],
    redirect: '/dashboard',
    meta: { hidden: true },
    children: [
      {
        path: 'main',
        component: routerName['main'],
        name: 'Main',
        meta: {
          title: 'main',
          affix: true
        }
      }
    ]
  },
  {
    path: '/dashboard',
    component: routerName['Layout'],
    redirect: '/dashboard/dashboard',
    // redirect: '/dashboard',
    meta: {
      title: 'dashboard'
    },
    children: [
      {
        path: '/dashboard',
        component: routerName['dashboard'],
        name: 'dashboard',
        meta: {
          title: 'dashboard',
          noCache: true
        }
      }
    ]
  },
  // {
  //   path: '/dashboardTemp',
  //   component: routerName['Layout'],
  //   redirect: '/dashboardTemp/dashboardTemp',
  //   meta: {
  //     title: 'dashboardTemp'
  //   },
  //   children: [
  //     {
  //       path: 'dashboardTemp',
  //       component: routerName['dashboardTemp'],
  //       name: 'dashboardTemp',
  //       meta: {
  //         title: 'dashboardTemp',
  //         noCache: true
  //       }
  //     }
  //   ]
  // },
  {
    path: '/raw-data',
    component: routerName['Layout'],
    redirect: '/raw-data/:path*/:path*',
    // redirect: '/raw-data',
    meta: {
      title: 'raw-data'
    },
    children: [
      {
        path: '/raw-data/:path*/:path*',
        component: routerName['rawData'],
        name: 'raw-data',
        meta: {
          title: 'raw-data',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/statistics',
    component: routerName['Layout'],
    redirect: '/statistics/:path*/:path*',
    // redirect: '/statistics',
    meta: {
      title: 'statistics'
    },
    children: [
      {
        path: '/statistics/:path*/:path*',
        component: routerName['statistics'],
        name: 'statistics',
        meta: {
          title: 'statistics',
          noCache: true
        }
      }
    ]
  }
  // {
  //   path: '/unmannedPayment',
  //   component: routerName['Layout'],
  //   redirect: '/unmannedPayment/unmannedPayment',
  //   meta: {
  //     title: 'unmannedPayment'
  //   },
  //   children: [
  //     {
  //       path: 'unmannedPayment1F',
  //       component: routerName['unmannedPayment'],
  //       name: 'unmannedPayment1F',
  //       meta: {
  //         title: 'unmannedPayment1F',
  //         noCache: true
  //       }
  //     },
  //     {
  //       path: 'unmannedPayment2F',
  //       component: routerName['unmannedPayment'],
  //       name: 'unmannedPayment2F',
  //       meta: {
  //         title: 'unmannedPayment2F',
  //         noCache: true
  //       }
  //     },
  //     {
  //       path: 'unmannedPayment3F',
  //       component: routerName['unmannedPayment'],
  //       name: 'unmannedPayment3F',
  //       meta: {
  //         title: 'unmannedPayment3F',
  //         noCache: true
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/hospitalizationDischarge',
  //   component: routerName['Layout'],
  //   redirect: '/hospitalizationDischarge/hospitalizationDischarge',
  //   meta: {
  //     title: 'hospitalizationDischarge'
  //   },
  //   children: [
  //     {
  //       path: 'hospitalizationDischarge',
  //       component: routerName['hospitalizationDischarge'],
  //       name: 'hospitalizationDischarge',
  //       meta: {
  //         title: 'hospitalizationDischarge',
  //         noCache: true
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/arrivalConfirmation',
  //   component: routerName['Layout'],
  //   redirect: '/arrivalConfirmation/arrivalConfirmation',
  //   meta: {
  //     title: 'arrivalConfirmation'
  //   },
  //   children: [
  //     {
  //       path: 'arrivalConfirmation',
  //       component: routerName['arrivalConfirmation'],
  //       name: 'arrivalConfirmation',
  //       meta: {
  //         title: 'arrivalConfirmation',
  //         noCache: true
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/insuranceClaim',
  //   component: routerName['Layout'],
  //   redirect: '/insuranceClaim/insuranceClaim',
  //   meta: {
  //     title: 'insuranceClaim'
  //   },
  //   children: [
  //     {
  //       path: 'insuranceClaim',
  //       component: routerName['insuranceClaim'],
  //       name: 'insuranceClaim',
  //       meta: {
  //         title: 'insuranceClaim',
  //         noCache: true
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/issuanceOfCertificate',
  //   component: routerName['Layout'],
  //   redirect: '/issuanceOfCertificate/issuanceOfCertificate',
  //   meta: {
  //     title: 'issuanceOfCertificate'
  //   },
  //   children: [
  //     {
  //       path: 'issuanceOfCertificate',
  //       component: routerName['issuanceOfCertificate'],
  //       name: 'issuanceOfCertificate',
  //       meta: {
  //         title: 'issuanceOfCertificate',
  //         noCache: true
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/issuanceOfNumberTag',
  //   component: routerName['Layout'],
  //   redirect: '/issuanceOfNumberTag/issuanceOfNumberTag',
  //   meta: {
  //     title: 'issuanceOfNumberTag'
  //   },
  //   children: [
  //     {
  //       path: 'issuanceOfNumberTag',
  //       // issuanceOfNumberTag
  //       component: routerName['icons'],
  //       name: 'issuanceOfNumberTag',
  //       meta: {
  //         title: 'issuanceOfNumberTag',
  //         noCache: true
  //       }
  //     }
  //   ]
  // }
]

export const asyncRoutes: RouteConfig[] = [
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true }
  }
]

const createRouter = () =>
  new Router({
    scrollBehavior: (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
    },
    base: process.env.VUE_APP_BASE_URL,
    routes: constantRoutes
  })

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  ;(router as any).matcher = (newRouter as any).matcher
}

export default router
