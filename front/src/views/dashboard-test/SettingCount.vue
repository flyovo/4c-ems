<template>
  <div class="dashboard-setting-count">
    <div class="dashboard-setting-count__header">
      <div class="dashboard-setting-count__header__title">{{ title }}</div>
    </div>
    <div class="dashboard-setting-count__wrapper">
      <div class="dashboard-setting-count__chart-card">
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
import BarChart, { IBarChart } from '@/components/Chart/BarChart.vue'
import variables from '@/styles/_variables.scss'
import { MessageService } from '@/utils/message-service'
import ChartToCsv from '@/components/ChartToCsv/index.vue'

@Component({
  name: 'DashboardSettingCount',
  components: { BarChart, ChartToCsv }
})
export default class extends Vue {
  private title: string = '수납건수'
  private searchStartDate: any = ''
  private searchEndDate: any = ''
  private chartItems: IBarChart = {
    title: {
      text: ''
    },
    legend: ['전년', '금년'],
    colors: [variables.payment, variables.arrive],
    xAxisData: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    series: [
      {
        barGap: 0,
        name: '전년',
        type: 'bar',
        stack: '',
        data: [120, 132, 101, 132, 90, 230, 101, 132, 134, 101, 134, 90, 134, 90]
      },
      {
        name: '금년',
        type: 'bar',
        stack: '',
        data: [220, 182, 191, 120, 290, 330, 310, 120, 234, 210, 230, 210, 230, 210]
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
.dashboard-setting-count {
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
    height: 100%;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    border: solid 1px #e5e5e5;
  }
}
</style>
