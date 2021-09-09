import axios from 'axios'

import { Loading } from 'element-ui'
import { MessageService } from '@/utils/message-service'
import { set } from 'lodash'
import router from '@/router'

declare module 'axios' {
  export interface AxiosResponse<T = any> extends Promise<T> {
    data: T
    resultCd: number
    status: number
    statusText: string
    headers: any
    config: AxiosRequestConfig
    request?: any
  }
}
const service = axios.create({
  withCredentials: true,
  baseURL: `http://${process.env.VUE_APP_SERVER_API}:${process.env.VUE_APP_SERVER_PORT}/api`,
  timeout: 100000
})

let loading: any
service.interceptors.request.use(
  config => {
    // if (sessionStorage.getItem('token')) {
    //  set(config.headers, 'token', sessionStorage.getItem('token'))
    // }
    const reqType = config.method
    switch (reqType) {
      case 'get':
        if (sessionStorage.getItem('token')) {
          set(config.headers, 'token', sessionStorage.getItem('token'))
        }
        break
      case 'post':
        if (sessionStorage.getItem('token')) {
          config.data.token = sessionStorage.getItem('token')
        }
        break
      default:
        break
    }
    loading = Loading.service({
      fullscreen: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    return config
  },
  error => {
    loading.close()
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    loading.close()

    if (response.data.token) {
      console.log(response.data.data)
      sessionStorage.setItem('token', response.data.token)
      sessionStorage.setItem('4c-userId', response.data.data.user_id)
      sessionStorage.setItem('4c-userAuth', response.data.data.authority)
      sessionStorage.setItem('4c-userState', JSON.stringify({ site: response.data.data.site, organ: response.data.data.organ, pos_4: response.data.data.pos_4 }))
    }

    const token = sessionStorage.getItem('token')
    if (token === '' || !token) {
      MessageService.MsgError('토큰 불일치 또는 만료')
      // sessionStorage.removeItem('userId')
      // sessionStorage.removeItem('token')
      router.push(`/login`)
    }

    if (response.status === 500) {
      MessageService.MsgError('내부 시스템 오류 관리자에게 문의하세요.')
    }
    if (response.data.resultCd === 300) {
      MessageService.MsgError('아이디 및 비밀번호를 확인해 주세요.')
    }

    return response.data
  },
  error => {
    MessageService.MsgError(error.message || 'empty error message')
    loading.close()
    return Promise.reject(error)
  }
)

export default service
