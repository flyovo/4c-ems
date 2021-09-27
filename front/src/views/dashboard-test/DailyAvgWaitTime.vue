<template>
  <div class="dashboard-daily-avg-wait-time">
    <div class="dashboard-daily-avg-wait-time__wrapper">
      <pie-chart :chart-items="chartItems" />
      <chart-to-csv :chart-title="title" :chart-items="chartItems" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PieChart, { IPieChart } from '@/components/Chart/PieChart.vue'
import variables from '@/styles/_variables.scss'
import ChartToCsv from '@/components/ChartToCsv/index.vue'

@Component({
  name: 'DashboardDailyAvgWaitTime',
  components: { PieChart, ChartToCsv }
})
export default class extends Vue {
  private title: string = '일 평균 대기시간'
  private chartItems: IPieChart = {
    title: {
      text: this.title,
      textStyle: {
        fontSize: 15
      }
    },
    legend: ['보험청구', '앱설치', '장애'],
    colors: [variables.payment, variables.arrive, variables.numberTicket],
    seriesRadius: '50%',
    seriesMegTitle: '현황',
    seriesPosition: ['50%', '45%'],
    seriesData: [
      { value: 1548, name: '보험청구' },
      { value: 135, name: '앱설치' },
      { value: 135, name: '장애' }
    ]
  }
}
</script>

<style lang="scss">
.dashboard-daily-avg-wait-time {
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
