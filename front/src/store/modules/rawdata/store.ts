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
  public dateList = ['당월', '전월', '연간']
  public dateRange = {}
  public dateToday = dayjs(new Date())
  public crntMonth = {
    term: 'weekly',
    from: dayjs(this.dateToday)
      .date(1)
      .format('YYYY-MM-DD'),
    to: this.dateToday.format('YYYY-MM-DD')
  }
  public PrevMonth = {
    term: 'weekly',
    from: dayjs(this.dateToday)
      .subtract(1, 'month')
      .date(1)
      .format('YYYY-MM-DD'),
      to: dayjs(this.dateToday)
      .subtract(1, 'month')
      .date(this.dateToday.daysInMonth())
      .format('YYYY-MM-DD')
  }
  public PrevYear = {
    term: 'monthly',
    from: dayjs(this.dateToday)
      // .subtract(1, 'year')
      .set('month', 0)
      .date(1)
      .format('YYYY-MM-DD'),
    to: this.dateToday.format('YYYY-MM-DD')
  }

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
    const selectDate = payload.date
    let date = this.crntMonth

    switch (selectDate) {
      case 0:
        date = this.crntMonth
        break
      case 1:
        date = this.PrevMonth
        break
      case 2:
        date = this.PrevYear
        break
      default:
        date = this.crntMonth
        break
    }
    this.SET_CHANGE_VALUE({ key: 'dateRange', value: date })
  }
}

export const RawDataStoreModule = getModule(RawDataStore)
