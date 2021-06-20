import store from '@/store'
import { dashCertificate, dashKiosk, dashWaitTime, dashMenuUse } from '@/api/dashboard-api'
import { DashboardStoreState } from './type'
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { cloneDeep } from 'lodash'
import { TEST_TABLE_DATA } from './mock'
import dayjs from 'dayjs'
@Module({ dynamic: true, store, name: 'dashboardStore', namespaced: true })
class DashboardStore extends VuexModule implements DashboardStoreState {
  public dashboardList = []
  public dashboardListTotalCount = 0

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
  // public Dashboard(data: { type: string, range: {}}) {
  public Dashboard(data: { type: string, range: {}}) {
    let resultCd
    switch (data.type) {
      case 'certificate':
        resultCd = dashCertificate(data.range)
      break
      case 'kiosk':
          resultCd = dashKiosk(data.range)
      break
      case 'wait':
        resultCd = dashWaitTime(data.range)
      break
      case 'menu':
        resultCd = dashMenuUse(data.range)
      break
      default:
        resultCd = dashCertificate(data.range)
      break
    }

    return new Promise(resolve => {
      resolve(resultCd)      
    })
    // if (resultCd === 200) {
    //   return new Promise(resolve => {
    //     resolve(200)
    //   })
    // }
  }

  @Action({ rawError: true })
  public ChangeValue(payload: { key: string; value: any }) {
    this.SET_CHANGE_VALUE(payload)
  }

  @Action({ rawError: true })
  public GetDashboardData(payload: any) {
    const page = payload.page
    const limit = payload.limit
    const dataList2 = cloneDeep(TEST_TABLE_DATA)
    let count = 1
    const dataList = dataList2.map(item => {
      item.hosType = item.hosType + count++
      return { ...item }
    })
    const pageList = dataList.filter((_, index) => index < (limit as number) * (page as number) && index >= (limit as number) * ((page as number) - 1))
    const totalCount = dataList.length

    this.SET_CHANGE_VALUE({ key: 'dashboardList', value: pageList })
    this.SET_CHANGE_VALUE({ key: 'dashboardListTotalCount', value: totalCount })
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

export const DashboardStoreModule = getModule(DashboardStore)
