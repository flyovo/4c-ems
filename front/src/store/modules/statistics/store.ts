import store from '@/store'
import { statistics } from '@/api/statistics-api'
import { rawDataCombo } from '@/api/rawdata-api'
import { StatisticsStoreState } from './type'
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { cloneDeep } from 'lodash'
import dayjs from 'dayjs'

@Module({ dynamic: true, store, name: 'StatisticsStore', namespaced: true })
class StatisticsStore extends VuexModule implements StatisticsStoreState {
  public totalTableList = []
  public tableList = []
  public tableListTotalCount = 0
  public dateRange = {
    date: {
      type: 'all',
      term: 'weekly',
      from: dayjs().format('YYYY-MM-DD'),
      to: dayjs().format('YYYY-MM-DD')
    }
  }
  public dateToday = dayjs(new Date())
  public dateList = [
    {
      label: {
        text: '전체 날짜',
        from: this.dateToday.format('YYYY년 MM월 DD일'),
        to: this.dateToday.format('YYYY년 MM월 DD일')
      },
      date: {
        term: 'all',
        from: this.dateToday.format('YYYY-MM-DD'),
        to: this.dateToday.format('YYYY-MM-DD')
      }
    },
    {
      label: {
        text: '당월 조회',
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
        text: '전월 조회',
        from: dayjs(this.dateToday)
          .subtract(1, 'month')
          .date(1)
          .format('YYYY년 MM월 DD일'),
        to: dayjs(this.dateToday)
          .subtract(1, 'month')
          .date(dayjs(this.dateToday).subtract(1, 'month').daysInMonth())
          .format('YYYY년 MM월 DD일')
      },
      date: {
        term: 'weekly',
        from: dayjs(this.dateToday)
          .subtract(1, 'month')
          .date(1)
          .format('YYYY-MM-DD'),
        to: dayjs(this.dateToday)
          .subtract(1, 'month')
          .date(dayjs(this.dateToday).subtract(1, 'month').daysInMonth())
          .format('YYYY-MM-DD')
      }
    },
    {
      label: {
        text: '연간 조회',
        from: dayjs(this.dateToday)
          .set('month', 0)
          .date(1)
          .format('YYYY년 MM월 DD일'),
        to: this.dateToday.format('YYYY년 MM월 DD일')
      },
      date: {
        term: 'monthly',
        from: dayjs(this.dateToday)
          .set('month', 0)
          .date(1)
          .format('YYYY-MM-DD'),
        to: this.dateToday.format('YYYY-MM-DD')
      }
    },
    {
      label: {
        text: '기간 조회',
        from: dayjs(this.dateToday).format('YYYY년 MM월 DD일'),
        to: this.dateToday.format('YYYY년 MM월 DD일')
      },
      date: {
        term: 'term',
        from: dayjs(this.dateToday).format('YYYY-MM-DD'),
        to: this.dateToday.format('YYYY-MM-DD')
      }
    }
  ]
  public typeLabel = [
    {
      id: 'out-patient',
      label: ''
    },
    {
      id: 'leaves',
      label: ''
    },
    {
      id: 'week',
      label: '수납 타입 선택'
    },
    {
      id: 'certification',
      label: ''
    },
    {
      id: 'wait-time',
      label: ''
    },
    {
      id: 'arrive',
      label: ''
    },
    {
      id: 'measurements',
      label: '신체계측 타입 선택'
    },
    {
      id: 'failure',
      label: '타입 선택'
    }
  ]
  public typeList = [
    {
      id: 'out-patient',
      list: []
    },
    {
      id: 'leaves',
      list: []
    },
    {
      id: 'week',
      list: ['수납 전체', '외래 수납', '중간금 수납', '퇴원 수납']
    },
    {
      id: 'certification',
      list: []
    },
    {
      id: 'wait-time',
      list: []
    },
    {
      id: 'arrive',
      list: []
    },
    {
      id: 'measurements',
      list: ['신체계측 전체', '신체계측(혈압)', '신체계측(신장체중)']
    },
    {
      id: 'failure',
      list: []
    }
  ]
  public typeIndex = 0
  public comboIndex = 0
  public comboList = []

  @Mutation
  private SET_CHANGE_VALUE(payload: { key: string; value: any }) {
    const { key, value } = payload
    if (Object.prototype.hasOwnProperty.call(this, key)) {
      ;(this as any)[key] = value
    }
  }

  @Action({ rawError: true })
  public RawTableData(payload: any) {
    let userState = JSON.parse(sessionStorage.getItem('4c-userState'))
    if(sessionStorage.getItem('4c-userAuth') === "P"){
      payload.position[0] = userState.site
      payload.position[1] = userState.organ
    }
    let params = {
      auth: sessionStorage.getItem('4c-userAuth'),
      pos_4: userState.pos_4,
      type: payload.type,
      option: payload.option,
      position: payload.position.join(','),
      dateTerm: payload.range.term,
      startDate: payload.range.from,
      endDate: payload.range.to
    }
    let resultCd = statistics(params)
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
  public GetTotalTableData(payload: any) {
    this.SET_CHANGE_VALUE({ key: 'totalTableList', value: payload.data })
  }

  @Action({ rawError: true })
  public GetDateRange(payload: any) {
    let date = this.dateList[payload.date]
    this.SET_CHANGE_VALUE({ key: 'dateRange', value: date })
  }

  @Action({ rawError: true })
  public GetType(payload: any) {
    let type= this.typeList[payload.type]
    this.SET_CHANGE_VALUE({ key: 'typeIndex', value: type })
  }

  @Action({ rawError: true })
  public GetComboList(payload: any) {
    let resultCd = rawDataCombo(payload)
    new Promise(resolve => {
      return resolve(resultCd)
    }).then(result => {
      this.SET_CHANGE_VALUE({ key: 'comboList', value: result })
    })
  }

  @Action({ rawError: true })
  public SetComboIndex(payload: any) {
    this.SET_CHANGE_VALUE({ key: 'comboIndex', value: payload.index })
  }

  @Action({ rawError: true })
  public SetInitDataList(payload: any) {
    this.SET_CHANGE_VALUE({ key: 'tableList', value: [] })
    this.SET_CHANGE_VALUE({ key: 'tableListTotalCount', value: 0 })
  }
}

export const StatisticsStoreModule = getModule(StatisticsStore)
