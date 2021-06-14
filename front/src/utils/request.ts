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
    // if (localStorage.getItem('token')) {
    //  set(config.headers, 'token', localStorage.getItem('token'))
    // }
    const reqType = config.method
    switch (reqType) {
      case 'get':
        if (localStorage.getItem('token')) {
          set(config.headers, 'token', localStorage.getItem('token'))
        }
        break
      case 'post':
        if (localStorage.getItem('token')) {
          config.data.token = localStorage.getItem('token')
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
      localStorage.setItem('token', response.data.token)
    }

    const token = localStorage.getItem('token')
    if (token === '' || !token) {
      MessageService.MsgError('토큰 불일치 또는 만료')
      // localStorage.removeItem('userId')
      // localStorage.removeItem('token')
      router.push(`/login`)
    }

    if (response.status === 500) {
      MessageService.MsgError('내부 시스템 오류 관리자에게 문의하세요.')
    }
    if (response.data.resultCd === 300) {
      MessageService.MsgError('아이디 및 비밀번호를 확인해 주세요.')
    }
    console.log(response.data)
    return response.data
  },
  error => {
    MessageService.MsgError(error.message || 'empty error message')
    loading.close()
    return Promise.reject(error)
  }
)

export default service
