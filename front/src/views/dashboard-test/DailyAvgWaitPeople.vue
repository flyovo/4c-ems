<template>
  <div class="dashboard-daily-avg-wait-people">
    <div class="dashboard-daily-avg-wait-people__wrapper">
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
  name: 'DashboardDailyAvgWaitPeople',
  components: { PieChart, ChartToCsv }
})
export default class extends Vue {
  private title: string = '일 평균 대기인수'
  private chartItems: IPieChart = {
    title: {
      text: this.title,
      textStyle: {
        fontSize: 15
      }
    },
    legend: ['결재', '도착확인', '번호표발급'],
    colors: [variables.proof, variables.insurance, variables.install],
    seriesRadius: '50%',
    seriesMegTitle: '현황',
    seriesPosition: ['50%', '45%'],
    seriesData: [
      { name: '결재', value: 335 },
      { name: '도착확인', value: 310 },
      { name: '번호표발급', value: 234 }
    ]
  }
}
</script>

<style lang="scss">
.dashboard-daily-avg-wait-people {
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
