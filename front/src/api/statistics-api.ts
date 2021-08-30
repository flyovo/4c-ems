import request from '@/utils/request'

export const statistics = (data: any) =>
  request({
    url: `/statistics/${data.type}`,
    method: 'get',
    params: data
  })
