import store from '@/store'
import { rawDataCertification, rawDataReceipt } from '@/api/rawdata-api'
import { RawDataStoreState } from './type'
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { cloneDeep } from 'lodash'
import dayjs from 'dayjs'

@Module({ dynamic: true, store, name: 'rawDataStore', namespaced: true })
class RawDataStore extends VuexModule implements RawDataStoreState {
  public tableList = []
  public tableListTotalCount = 0
  public dateRange = {}
  public dateToday = dayjs(new Date())
  public dateList = [
    {
      label: {
        text: '전체 날짜',
        from: dayjs(this.dateToday)
          .date(1)
          .format('YYYY년 MM월 DD일'),
        to: this.dateToday.format('YYYY년 MM월 DD일')
      },
      date: {
        term: 'weekly',
        from: dayjs(this.dateToday)
          .date(1)
          .format('YYYY-MM-DD'),
        to: this.dateToday.format('YYYY-MM-DD')
      }
    },
    {
      label: {
        text: '당월',
        from: dayjs(this.dateToday)
          .date(1)
          .format('YYYY년 MM월 DD일'),
        to: this.dateToday.format('YYYY년 MM월 DD일')
      },
      date: {
        term: 'weekly',
        from: dayjs(this.dateToday)
          .date(1)
          .format('YYYY-MM-DD'),
        to: this.dateToday.format('YYYY-MM-DD')
      }
    },
    {
      label: {
        text: '1개월',
        from: dayjs(this.dateToday)
          .date(1)
          .format('YYYY년 MM월 DD일'),
        to: this.dateToday.format('YYYY년 MM월 DD일')
      },
      date: {
        term: 'weekly',
        from: dayjs(this.dateToday)
          .date(1)
          .format('YYYY-MM-DD'),
        to: this.dateToday.format('YYYY-MM-DD')
      }
    },
    {
      label: {
        text: '2개월',
        from: dayjs(this.dateToday)
          .date(1)
          .format('YYYY년 MM월 DD일'),
        to: this.dateToday.format('YYYY년 MM월 DD일')
      },
      date: {
        term: 'weekly',
        from: dayjs(this.dateToday)
          .date(1)
          .format('YYYY-MM-DD'),
        to: this.dateToday.format('YYYY-MM-DD')
      }
    },
    {
      label: {
        text: '3개월',
        from: dayjs(this.dateToday)
          .date(1)
          .format('YYYY년 MM월 DD일'),
        to: this.dateToday.format('YYYY년 MM월 DD일')
      },
      date: {
        term: 'weekly',
        from: dayjs(this.dateToday)
          .date(1)
          .format('YYYY-MM-DD'),
        to: this.dateToday.format('YYYY-MM-DD')
      }
    },
    {
      label: {
        text: '연간 조회',
        from: dayjs(this.dateToday)
          .date(1)
          .format('YYYY년 MM월 DD일'),
        to: this.dateToday.format('YYYY년 MM월 DD일')
      },
      date: {
        term: 'weekly',
        from: dayjs(this.dateToday)
          .date(1)
          .format('YYYY-MM-DD'),
        to: this.dateToday.format('YYYY-MM-DD')
      }
    },
    {
      label: {
        text: '기간 조회',
        from: dayjs(this.dateToday)
          .date(1)
          .format('YYYY년 MM월 DD일'),
        to: this.dateToday.format('YYYY년 MM월 DD일')
      },
      date: {
        term: 'weekly',
        from: dayjs(this.dateToday)
          .date(1)
          .format('YYYY-MM-DD'),
        to: this.dateToday.format('YYYY-MM-DD')
      }
    }
  ]
  public typeList = ['수납 전체', '외래 수납', '중간금 수납', '퇴원 수납']


  @Mutation
  private SET_CHANGE_VALUE(payload: { key: string; value: any }) {
    const { key, value } = payload
    if (Object.prototype.hasOwnProperty.call(this, key)) {
      ;(this as any)[key] = value
    }
  }

  @Action({ rawError: true })
  public RawTableData(data: { type: string, range: {}}) {
    let resultCd
    switch (data.type) {
      case 'certification':
        resultCd = rawDataCertification(data.range)
      break
      case 'receipt':
        resultCd = rawDataReceipt(data.range)
      break
    }

    return new Promise(resolve => {
      resolve(resultCd)      
    })
  }

  @Action({ rawError: true })
  public ChangeValue(payload: { key: string; value: any }) {
    this.SET_CHANGE_VALUE(payload)
  }

  @Action({ rawError: true })
  public GetTableData(payload: any) {
    const page = payload.page
    const limit = payload.limit
    const dataList2 = cloneDeep(payload.data)
    let count = 1
    const dataList = dataList2.map(item => {
      return { ...item }
    })
    const pageList = dataList.filter((_, index) => index < (limit as number) * (page as number) && index >= (limit as number) * ((page as number) - 1))
    const totalCount = dataList.length

    this.SET_CHANGE_VALUE({ key: 'tableList', value: pageList })
    this.SET_CHANGE_VALUE({ key: 'tableListTotalCount', value: totalCount })
  }

  @Action({ rawError: true })
  public GetDateRange(payload: any) {
    // const selectDate = payload.date
    console.log('RawDataStoreModule:::::::', payload.date)
    console.log(this.dateList[payload.date].date)
    let date = this.dateList[payload.date]
    this.SET_CHANGE_VALUE({ key: 'dateRange', value: date })
  }
}

export const RawDataStoreModule = getModule(RawDataStore)
