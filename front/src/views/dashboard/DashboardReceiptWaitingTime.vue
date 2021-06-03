<template>
  <div class="dashboard-receipt-waiting-time">
    <div class="dashboard-receipt-waiting-time__header">
      <div class="dashboard-receipt-waiting-time__header__title">{{ title }}</div>
    </div>
    <div class="dashboard-receipt-waiting-time__wrapper">
      <div class="dashboard-receipt-waiting-time__chart-card">
        <!-- <bar-line-chart :chart-items="chartItems" /> -->
        <bar-chart :chart-items="chartItems" />
        <!-- <date-picker /> -->
        <!-- <el-date-picker v-model="test" type="date" placeholder="날짜 선택" /> -->
        <chart-to-csv :chart-title="title" :chart-items="chartItems" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// import DatePicker from '@/components/DatePicker/index.vue'
// import BarLineChart, { IBarLineChart } from '@/components/Chart/BarLineChart.vue'
import BarChart, { IBarChart } from '@/components/Chart/BarChart.vue'
import variables from '@/styles/_variables.scss'
import { MessageService } from '@/utils/message-service'
import ChartToCsv from '@/components/ChartToCsv/index.vue'

@Component({
  name: 'DashboardReceiptWaitingTime',
  // components: { BarLineChart, ChartToCsv }
  components: { BarChart, ChartToCsv }
})
export default class extends Vue {
  private title: string = '수납대기 시간'
  private searchStartDate: any = ''
  private searchEndDate: any = ''
  // private chartItems: IBarLineChart = {
  private chartItems: IBarChart = {
    title: {
      text: ''
    },
    legend: ['10:00~12:00', '14:00~16:00', '1일 평균 대기시간'],
    colors: [variables.payment, variables.arrive, variables.install],
    xAxisData: ['세브란스병원', '연세암병원', '심장혈관병원', '어린이병원', '안과병원'],
    series: [
      {
        barGap: 0.2,
        name: '10:00~12:00',
        type: 'bar',
        stack: '',
        label: {
          show: true,
          position: 'top'
        },
        data: [20, 27, 38, 24, 28]
      },
      {
        name: '14:00~16:00',
        type: 'bar',
        stack: '',
        label: {
          show: true,
          position: 'top'
        },
        data: [21, 30, 41, 13, 12]
      },
      {
        name: '1일 평균 대기시간',
        type: 'line',
        stack: '',
        label: {
          show: true,
          position: 'top'
        },
        data: [20, 29, 40, 19, 20]
      }
    ]
  }
  private searchUseItem() {
    const searchStartDate = this.searchStartDate || ''
    const searchEndDate = this.searchEndDate || ''
    if (searchStartDate === '') {
      MessageService.notiWarning('시작 기간을 입력해 주세요.')
      return false
    }
    if (searchEndDate === '') {
      MessageService.notiWarning('종료 기간을 입력해 주세요.')
      return false
    }
    if (searchStartDate > searchEndDate) {
      MessageService.notiWarning('기간 입력을 확인해 주세요.')
      return false
    }
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
