import request from '@/utils/request'

export const statisticsOutPatient = (data: any) =>
  request({
    url: '/statistics/out-patient',
    method: 'get',
    params: data
  })

export const statisticsInPatient = (data: any) =>
  request({
    url: '/statistics/in-patient',
    method: 'get',
    params: data
  })

  export const statisticsCertification = (data: any) =>
  request({
    url: '/statistics/certification',
    method: 'get',
    params: data
  })

  export const statisticsWeek = (data: any) =>
  request({
    url: '/statistics/week',
    method: 'get',
    params: data
  })

  export const statisticsWaitTime = (data: any) =>
  request({
    url: '/statistics/wait',
    method: 'get',
    params: data
  })