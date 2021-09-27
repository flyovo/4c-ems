import request from '@/utils/request'

export const dashChartData = (data: any) =>
  request({
    url: `/dashboard/${data.type}`,
    method: 'get',
    params: data
  })
