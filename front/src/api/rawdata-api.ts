import request from '@/utils/request'

export const rawDataCertification = (data: any) =>
  request({
    url: '/rawdata/certification',
    method: 'get',
    params: data
  })

export const rawDataReceipt = (data: any) =>
  request({
    url: '/rawdata/receipt',
    method: 'get',
    params: data
  })
