/** Layout **/
export const Layout = () => import('@/layout/index.vue')

/** Comn **/
export const rediredct = () => import('@/views/redirect/index.vue')
export const login = () => import('@/views/login/index.vue')
export const authRedirect = () => import('@/views/login/auth-redirect.vue')
export const error404Page = () => import('@/views/error-page/404.vue')
export const error401Page = () => import('@/views/error-page/401.vue')

/** dev **/
export const icons = () => import('@/views/dev/icons/index.vue')

/** Biz */
export const dashboard = () => import('@/views/dashboard/index.vue')
export const dashboardTemp = () => import('@/views/dashboard-temp/index.vue')

export const rawData = () => import('@/views/raw-data/index.vue')
export const statistics = () => import('@/views/statistics/index.vue')
export const unmannedPayment = () => import('@/views/unmanned-payment/index.vue')
export const hospitalizationDischarge = () => import('@/views/hospitalization-discharge/index.vue')
export const arrivalConfirmation = () => import('@/views/arrival-confirmation/index.vue')
export const insuranceClaim = () => import('@/views/insurance-claim/index.vue')
export const issuanceOfCertificate = () => import('@/views/issuance-certificate/index.vue')
export const issuanceOfNumberTag = () => import('@/views/issuance-number-tag/index.vue')
