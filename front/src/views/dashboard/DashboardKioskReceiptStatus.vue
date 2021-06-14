<template>
  <div class="dashboard-kiosk-receipt-status">
    <div class="dashboard-kiosk-receipt-status__header">
      <div class="dashboard-kiosk-receipt-status__header__title">{{ title }}</div>
    </div>
    <div class="dashboard-kiosk-receipt-status__wrapper">
      <div class="dashboard-kiosk-receipt-status__chart-card">
        <bar-chart :chart-items="chartItems" />
        <!-- <date-picker /> -->
        <!-- <el-date-picker v-model="test" type="date" placeholder="날짜 선택" /> -->
        <chart-to-csv :chart-title="title" :chart-items="chartItems" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
// import DatePicker from '@/components/DatePicker/index.vue'
import BarChart, { IBarChart } from '@/components/Chart/BarChart.vue'
import variables from '@/styles/_variables.scss'
import ChartToCsv from '@/components/ChartToCsv/index.vue'

@Component({
  name: 'DashboardKioskReceiptStatus',
  components: { BarChart, ChartToCsv }
})
export default class extends Vue {
  @Prop() private initData?: []

  private title: string = '키오스크 수납 현황'
  private chartItems: IBarChart = {

    title: {
      text: ''
    },
    legend: ['20년 키오스크 (건수)', '21년 키오스크 (건수)'],
    colors: [variables.payment, variables.arrive],
    xAxisData: ['8월', '9월', '10월', '11월', '12월'],
    series: [
      {
        barGap: 0.2,
        name: '20년 키오스크 (건수)',
        type: 'bar',
        stack: '',
        label: {
          show: true,
          position: 'top'
        },
        data: [10421, 13554, 9385, 24134, 9730]
      },
      {
        name: '21년 키오스크 (건수)',
        type: 'bar',
        stack: '',
        label: {
          show: true,
          position: 'top'
        },
        data: [21410, 23780, 21210, 27320, 21840]
      }
    ]
  }
[{"start":"2021/03/07","end":"2021/03/13","date":"202110","cnt_sunap":"20"},{"start":"2021/03/14","end":"2021/03/20","date":"202111","cnt_sunap":"35"}]
  created() {
    this.fetchData()
  }

  private async fetchData() {
    
    // await DashboardStoreModule.GetDateRange(payload)
  }

}
</script>

<style lang="scss">
.dashboard-kiosk-receipt-status {
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
