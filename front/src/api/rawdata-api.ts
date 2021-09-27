import request from '@/utils/request'

export const rawData = (data: any) =>
  request({
    url: `/rawdata/${data.type}`,
    method: 'get',
    params: data
  })

export const rawDataCombo = (data: any) =>
  request({
    url: `/rawdata/combo`,
    method: 'get',
    params: data
  })
