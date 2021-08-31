<template>
  <div class="dashboard-status-use-by-menu">
    <pie-chart :chart-items="chartItems" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import PieChart, { IPieChart } from '@/components/Chart/PieChart.vue'
import variables from '@/styles/_variables.scss'
import { DashboardStoreModule } from '@/store/modules/dashboard/store.ts'

@Component({
  name: 'DashboardStatusUseByMenu',
  components: { PieChart }
})
export default class extends Vue {
  public data: any = {}
  private interval: any
  private type: string = 'menu'
  private title: string = '메뉴별 이용 현황'
  private chartItems: IPieChart = {}
  private chartItemsOrigin: IPieChart = {
    title: this.title,
    // legend: ['약처방전', '차량등록', '진료전 자기평가', '수납 불가', '진료비 수납', '번호표 발행'],
    legend: [],
    colors: [variables.darkBlue, variables.lightRed, variables.darkYellow, variables.darkPurple, variables.darkGreen, variables.darkTurquoise, variables.lightTurquoise, variables.lightGreen],
    seriesRadius: ['40%', '70%'],
    seriesMegTitle: '현황',
    seriesPosition: ['47%', '50%'],
    seriesData: []
  }

  // 사이트 변경
  @Watch('selectedSite', { immediate: true, deep: true })
  public onInitSiteChange(val: any, oldVal: any) {
    if (this.interval) {
      clearInterval(this.interval)
    }
    console.log('init 사이트 변경:::', val)
    this.fetchData()
  }

  // 날짜 범위 변경
  @Watch('dateRange', { immediate: true, deep: true })
  public onInitDateChange(val: any, oldVal: any) {
    if (this.interval) {
      clearInterval(this.interval)
    }
    console.log('init 날짜 범위 변경')
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
    DashboardStoreModule.Dashboard({
      type: this.type,
      site: this.selectedSite.id,
      ...this.dateRange.date
    }).then(async (result: any) => {
      this.data = result
      await this.setChart()
    })
  }

  private async intervalData() {
    this.interval = setInterval(() => {
      DashboardStoreModule.Dashboard({
        type: this.type,
        ...this.dateRange.date
      }).then(async (result: any) => {
        this.data = result
        await this.setChart()
      })
    }, 1000 * 60 * 1)
  }

  private async setChart() {
    // init
    this.chartItems = JSON.parse(JSON.stringify(this.chartItemsOrigin))

    this.chartItems.legend = this.data.column
    this.chartItems.seriesData = this.data.data
  }
}
</script>

<style lang="scss">
.dashboard-status-use-by-menu {
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
