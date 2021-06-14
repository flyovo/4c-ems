import store from '@/store'
import { dashCertificate, dashKiosk, dashWaitTime, dashStatusUse } from '@/api/dashboard-api'
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
    from: dayjs(this.dateToday)
      .date(1)
      .format('YYYY-MM-DD'),
    to: this.dateToday.format('YYYY-MM-DD')
  }
  public PrevMonth = {
    from: dayjs(this.dateToday)
      .subtract(1, 'month')
      .date(1)
      .format('YYYY-MM-DD'),
    to: this.dateToday.format('YYYY-MM-DD')
  }
  public PrevYear = {
    from: dayjs(this.dateToday)
      .subtract(1, 'year')
      .date(1)
      .format('YYYY-MM-DD'),
    to: this.dateToday.format('YYYY-MM-DD')
  }
  public tableList = []
  public tableListTotalCount = 0

  @Mutation
  private SET_CHANGE_VALUE(payload: { key: string; value: any }) {
    const { key, value } = payload
    if (Object.prototype.hasOwnProperty.call(this, key)) {
      ;(this as any)[key] = value
    }
  }

  @Action({ rawError: true })
  public async Dashboard(type: string) {
    let resultCd
    switch (type) {
      case 'certificate':
        resultCd = await dashCertificate(type)
        break
      case 'kiosk':
        resultCd = await dashKiosk(type)
        break
      case 'wait':
        resultCd = await dashWaitTime(type)
        break
      case 'status':
        resultCd = await dashStatusUse(type)
        break
      default:
        resultCd = await dashCertificate(type)
        break
    }

    if (resultCd === 200) {
      return new Promise(resolve => {
        resolve(200)
      })
    }
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

export const DashboardStoreModule = getModule(DashboardStore)
