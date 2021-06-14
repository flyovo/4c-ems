import request from '@/utils/request'

export const dashCertificate = (data: any) =>
  request({
    url: '/dashboard/certificate',
    method: 'get',
    data
  })

export const dashKiosk = (data: any) =>
  request({
    url: '/dashboard/kiosk',
    method: 'get',
    data
  })

export const dashWaitTime = (data: any) =>
  request({
    url: '/dashboard/wait',
    method: 'get',
    data
  })

export const dashStatusUse = (data: any) =>
  request({
    url: '/dashboard/status',
    method: 'get',
    data
  })
