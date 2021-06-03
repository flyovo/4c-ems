<template>
  <div class="dashboard-daily-avg-price">
    <div class="dashboard-daily-avg-price__wrapper">
      <bar-horizontal-chart :chart-items="chartItems" />
      <chart-to-csv :chart-title="title" :chart-items="chartItems" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import BarHorizontalChart, { IBarHorizontalChart } from '@/components/Chart/BarHorizontalChart.vue'
import variables from '@/styles/_variables.scss'
import ChartToCsv from '@/components/ChartToCsv/index.vue'

@Component({
  name: 'DashboardDailyAvgPrice',
  components: { BarHorizontalChart, ChartToCsv }
})
export default class extends Vue {
  private title: string = '일 평균 수납금액'
  private barWidth: number = 20
  private chartItems: IBarHorizontalChart = {
    title: {
      text: this.title,
      textStyle: {
        fontSize: 15
      }
    },
    legend: ['최대', '최소'],
    colors: [variables.numberTicket, variables.proof],
    yAxisData: ['월', '화', '수', '목', '금', '토'],
    series: [
      {
        name: '최대',
        type: 'bar',
        stack: 'total',
        data: [1235750, 3455342, 3525430, 3122344, 1312439, 1322230],
        barWidth: this.barWidth,
        label: {
          show: true,
          valueAnimation: true,
          // position: 'insideTopRight',
          position: 'top',
          //   distance: -13,
          formatter: function(a) {
            return a.value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
          }
        }
      },
      {
        name: '최소',
        type: 'bar',
        stack: 'total',
        data: [0, 0, 0, 0, 0, 0],
        barWidth: this.barWidth,
        label: {
          show: false,
          valueAnimation: true,
          // position: 'insideTopRight',
          position: 'top',
          //   distance: -13,
          formatter: function(a) {
            return a.value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
          }
        }
      }
    ]
  }
}
</script>

<style lang="scss">
.dashboard-daily-avg-price {
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
