<template>
  <div class="dashboard-certificate-issuanse-status">
    <bar-horizontal-chart :chart-items="chartItems" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import BarHorizontalChart, { IBarHorizontalChart } from '@/components/Chart/BarHorizontalChart.vue'
import variables from '@/styles/_variables.scss'
import { DashboardStoreModule } from '@/store/modules/dashboard/store.ts'

@Component({
  name: 'DashboardCertificateIssuanceStatus',
  components: { BarHorizontalChart, IBarHorizontalChart }
})
export default class extends Vue {
  public data: any = {}
  private interval: any
  private type: string = 'certificate'
  private title: string = '증명서 발급 현황'
  private barWidth: number = 20
  private chartItems: IBarHorizontalChart = {}
  private chartItemsOrigin: IBarHorizontalChart = {
    title: this.title,
    legend: [],
    colors: [variables.lightGreen],
    // yAxisData: ['외래진료비 영수증', '소득공제용\n장애인증명서', '입퇴원 확인서', '납입 증명서', '통원확인서'],
    yAxisData: [],
    series: []
  }

  // 사이트 변경
  @Watch('selectedSite', { immediate: true, deep: true })
  public onInitSiteChange(val: any, oldVal: any) {
    if (this.interval) {
      clearInterval(this.interval)
    }
    console.log('selectedSite::::', val)
    this.fetchData()
  }

  // 날짜 범위 변경
  @Watch('dateRange', { immediate: true, deep: true })
  public onInitDateChange(val: any, oldVal: any) {
    if (this.interval) {
      clearInterval(this.interval)
    }
    console.log('dateRange::::', val)
    this.fetchData()
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
    if( JSON.parse(sessionStorage.getItem('4c-userState')).site ){
      position.push( JSON.parse(sessionStorage.getItem('4c-userState')).site )
    }else{
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

  private async intervalData() {
    this.interval = setInterval(() => {
      DashboardStoreModule.Dashboard({
        type: this.type,
        dateTerm: this.dateRange.date.term,
        startDate: this.dateRange.date.from,
        endDate: this.dateRange.date.to
      }).then(async (result: any) => {
        this.data = result
        await this.setChart()
      })
    }, 1000 * 60 * 1)
  }

  private async setChart() {
    // init
    this.chartItems = JSON.parse(JSON.stringify(this.chartItemsOrigin))

    for (let col of this.data.column) {
      col = col.replace(' ', '\n')
      this.chartItems.yAxisData.push(col)
    }
    this.chartItems.series = [
      {
        name: '발급 수',
        type: 'bar',
        stack: 'total',
        // data: [10, 22, 30, 24, 39],
        data: this.data.data,
        barWidth: this.barWidth,
        label: {
          show: true,
          valueAnimation: true,
          position: 'right',
          formatter: d => {
            let value = d.value
            if (value === undefined) {
              return ''
            }
            value = typeof value === 'string' ? value : value.toString()
            return value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
          }
        }
      }
    ]
  }
}
</script>

<style lang="scss">
.dashboard-certificate-issuanse-status {
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
