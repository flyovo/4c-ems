<template>
  <div class="dashboard-receipt-waiting-time">
    <div class="dashboard-receipt-waiting-time__header">
      <div class="dashboard-receipt-waiting-time__header__title">{{ title }}</div>
    </div>
    <div class="dashboard-receipt-waiting-time__wrapper">
      <div class="dashboard-receipt-waiting-time__chart-card">
        <bar-chart :chart-items="chartItems" />
        <chart-to-csv :chart-title="title" :chart-items="chartItems" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import BarChart, { IBarChart } from '@/components/Chart/BarChart.vue'
import variables from '@/styles/_variables.scss'
import ChartToCsv from '@/components/ChartToCsv/index.vue'
import { DashboardStoreModule } from '@/store/modules/dashboard/store.ts'

@Component({
  name: 'DashboardReceiptWaitingTime',
  components: { BarChart, ChartToCsv }
})
export default class extends Vue {
  // @Prop() public initDateRange!: {}

  public data: any = {}
  public type: string = 'wait'

  @Watch('initDate', {immediate: true, deep: true})
  public onInitDateChange(val: any, oldVal: any) {
    this.fetchData()
  }

  private title: string = '수납대기 시간'
  private chartItems: IBarChart = {
    title: {
      text: ''
    },
    legend: ['10:00~12:00', '14:00~16:00', '1일 평균 대기시간'],
    colors: [variables.payment, variables.arrive, variables.install],
    // xAxisData: ['세브란스병원', '연세암병원', '심장혈관병원', '어린이병원', '안과병원'],
    xAxisData: [],
    series: []
  }
  
  private async fetchData() {
    DashboardStoreModule.Dashboard({
      type: this.type,
      range: {}
    }).then(async (result: any) => {
      this.data = result
      await this.setChart()
    })
  }

  private async setChart() {
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
        stack: '',
        label: {
          show: true,
          position: 'top'
        },
        data: this.data.data.avgtime
      }
    ]
  }
}
</script>

<style lang="scss">
.dashboard-receipt-waiting-time {
  margin-bottom: 30px;
  &__header {
    margin-top: 10px;
    margin-bottom: 10px;
    &__title {
      font-size: 20px;
      font-weight: 600;
    }
  }
  &__wrapper {
    position: relative;
    // height: 100%;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    border: solid 1px #e5e5e5;
  }
}
</style>
