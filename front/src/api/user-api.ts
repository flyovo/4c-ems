import request from '@/utils/request'

export const login = (data: any) =>
  request({
    url: '/user/login',
    method: 'post',
    data
  })

export const checkLogin = (data: any) =>
  request({
    url: '/user/check-login',
    method: 'post',
    data
  })

export const logout = (data: any) =>
  request({
    url: '/user/logout',
    method: 'post',
    data
  })

export const getUserList = (data: any) =>
  request({
    url: '/user/user-list',
    method: 'post',
    data
  })

export const getDashboardUser = (data: any) =>
  request({
    url: '/user/dashboard-userlist',
    method: 'post',
    data
  })

export const getSite = (data: any) =>
  request({
    url: '/user/site',
    method: 'get',
    params: data
  })
