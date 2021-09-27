<template>
  <div class="dashboard-receipt-waiting-time">
    <bar-chart :chart-items="chartItems" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import BarChart, { IBarChart } from '@/components/Chart/BarChart.vue'
import variables from '@/styles/_variables.scss'
import { DashboardStoreModule } from '@/store/modules/dashboard/store.ts'

@Component({
  name: 'DashboardReceiptWaitingTime',
  components: { BarChart }
})
export default class extends Vue {
  public data: any = {}
  private interval: any
  public type: string = 'wait'
  private title: string = '수납대기 시간'
  private chartItems: IBarChart = {}
  private chartItemsOrigin: IBarChart = {
    title: this.title,
    legend: ['10:00~12:00', '14:00~16:00', '1일 평균 대기시간'],
    colors: [variables.darkRed, variables.darkGray, variables.darkTurquoise],
    xAxisData: [],
    series: []
    // tooltip : {  // 여기서 설정하면 formatter가 동작하지 않아 barChart 파일 내에서 선언
    //   trigger: 'axis',
    //   formatter: (params) => {
    //   return `
    //     Tooltip: <br />
    //     ${params[0].seriesName}: ${params[0].value}<br />
    //     ${params[1].seriesName}: ${params[1].value}
    //     `;
    //   }
    // }
  }

  // 사이트 변경
  @Watch('selectedSite', { immediate: true, deep: true })
  public onInitSiteChange(val: any, oldVal: any) {
    if (this.interval) {
      clearInterval(this.interval)
    }
    if (oldVal) {
      // console.log('watch Site::::', val, oldVal)
      this.fetchData()
    }
  }

  // 날짜 범위 변경
  @Watch('dateRange', { immediate: true, deep: true })
  public onInitDateChange(val: any, oldVal: any) {
    if (this.interval) {
      clearInterval(this.interval)
    }
    if (oldVal) {
      // console.log('watch Date::::', val, oldVal)
      this.fetchData()
    }
  }

  // 사이트 텍스트
  get selectedSite() {
    return DashboardStoreModule.selectedSite
  }

  // 날짜 텍스트
  get dateRange() {
    return DashboardStoreModule.dateRange
  }

  private async fetchData() {
    let position = []

    // site
    if (JSON.parse(sessionStorage.getItem('4c-userState')).site) {
      position.push(JSON.parse(sessionStorage.getItem('4c-userState')).site)
    } else {
      position.push('')
    }
    // pos_1
    position.push(this.selectedSite.id)

    DashboardStoreModule.Dashboard({
      type: this.type,
      position: position.join(','),
      dateTerm: this.dateRange.date.term,
      startDate: this.dateRange.date.from,
      endDate: this.dateRange.date.to
    }).then(async (result: any) => {
      this.data = result
      await this.setChart()
    })
  }

  private async setChart() {
    // init
    this.chartItems = JSON.parse(JSON.stringify(this.chartItemsOrigin))

    this.chartItems.xAxisData = this.data.column
    this.chartItems.series = [
      {
        barGap: 0.2,
        name: '10:00~12:00',
        type: 'bar',
        stack: '',
        label: {
          show: true,
          position: 'top'
        },
        data: this.data.data.am
      },
      {
        name: '14:00~16:00',
        type: 'bar',
        stack: '',
        label: {
          show: true,
          position: 'top'
        },
        data: this.data.data.pm
      },
      {
        name: '1일 평균 대기시간',
        type: 'line',
        data: this.data.data.avgSec
      },
      {
        name: '',
        type: 'line',
        data: this.data.data.avgTime
      }
    ]
  }
}
</script>

<style lang="scss">
.dashboard-receipt-waiting-time {
  width: 100%;
  height: 100%;
  position: relative;
  padding: setViewport('vh', 20) setViewport('vw', 20);
  border-radius: 10px;
  border: solid 2px $lightGray;
  background-color: $subMenuBg;
  box-shadow: 0 4px 10px 0 rgba(68, 68, 68, 0.1);
}
</style>
