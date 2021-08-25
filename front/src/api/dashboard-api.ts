import request from '@/utils/request'

export const dashCertificate = (data: any) =>
  request({
    url: '/dashboard/certificate',
    method: 'get',
    params: data
  })

export const dashKiosk = (data: any) =>
  request({
    url: '/dashboard/kiosk',
    method: 'get',
    params: data
  })

export const dashWaitTime = (data: any) =>
  request({
    url: '/dashboard/wait',
    method: 'get',
    params: data
  })

export const dashMenuUse = (data: any) =>
  request({
    url: '/dashboard/menu',
    method: 'get',
    params: data
  })
