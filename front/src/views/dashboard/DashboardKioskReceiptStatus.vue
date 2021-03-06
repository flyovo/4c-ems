<template>
  <div class="dashboard-kiosk-receipt-status">
    <bar-chart :chart-items="chartItems" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import BarChart, { IBarChart } from '@/components/Chart/BarChart.vue'
import variables from '@/styles/_variables.scss'
import { DashboardStoreModule } from '@/store/modules/dashboard/store.ts'

@Component({
  name: 'DashboardKioskReceiptStatus',
  components: { BarChart }
})
export default class extends Vue {
  public data: any = {}
  private interval: any
  public type: string = 'kiosk'
  private title: string = '키오스크 수납 현황'
  private chartItems: IBarChart = {}
  private chartItemsOrigin: IBarChart = {
    title: this.title,
    legend: [],
    colors: [variables.darkBlue, variables.lightRed],
    xAxisData: [],
    series: [],
    tooltip : {
      trigger: 'axis'
    }
  }

  // 사이트 변경
  @Watch('selectedSite', { immediate: true, deep: true })
  public onInitSiteChange(val: any, oldVal: any) {
    if (this.interval) {
      clearInterval(this.interval)
    }
    this.fetchData()
  }

  // 날짜 범위 변경
  @Watch('dateRange', { immediate: true, deep: true })
  public onInitDateChange(val: any, oldVal: any) {
    if (this.interval) {
      clearInterval(this.interval)
    }
    this.fetchData()
  }

  // 사이트 텍스트 (site? pos_1?)
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

  private async setChart() {
    // init
    this.chartItems = JSON.parse(JSON.stringify(this.chartItemsOrigin))

    for (let data of this.data.column) {
      this.chartItems.xAxisData.push(data)
    }
    for (let key in this.data.data) {
      let legentTitle = `${key} 키오스크 (건수)`

      this.chartItems.legend.push(legentTitle)
      this.chartItems.series.push({
        barGap: 0.2,
        name: legentTitle,
        type: 'bar',
        stack: '',
        label: {
          show: true,
          position: 'top',
          formatter: d => {
            let value = d.value
            if (value === undefined) {
              return ''
            }
            value = typeof value === 'string' ? value : value.toString()
            return value.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
          }
        },
        data: this.data.data[key]
      })
    }
  }
}
</script>

<style lang="scss">
.dashboard-kiosk-receipt-status {
  width: 100%;
  height: 100%;
  position: relative;
  // padding: 20px;
  padding: setViewport('vh', 20) setViewport('vw', 20);
  border-radius: 10px;
  border: solid 2px $lightGray;
  background-color: $subMenuBg;
  box-shadow: 0 4px 10px 0 rgba(68, 68, 68, 0.1);
}
</style>
