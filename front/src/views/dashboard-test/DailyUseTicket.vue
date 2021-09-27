<template>
  <div class="dashboard-daily-use-ticket">
    <div class="dashboard-daily-use-ticket__wrapper">
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
  name: 'DashboardDailyUseTicket',
  components: { BarHorizontalChart, ChartToCsv }
})
export default class extends Vue {
  private title: string = '사용 시간/요일'
  private barWidth: number = 20
  private chartItems: IBarHorizontalChart = {
    title: {
      text: this.title,
      textStyle: {
        fontSize: 15
      }
    },
    legend: ['혼잡', '원활'],
    colors: [variables.numberTicket, variables.proof],
    yAxisData: ['월', '화', '수', '목', '금', '토'],
    series: [
      {
        name: '혼잡',
        type: 'bar',
        stack: 'total',
        data: [1203550, 2234552, 3132430, 2312344, 3312439, 1212230],
        barWidth: this.barWidth,
        label: {
          show: true,
          valueAnimation: true,
          // position: 'insideTopRight',
          position: 'top',
          formatter: function(a) {
            return a.value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
          }
        }
      },
      {
        name: '원활',
        type: 'bar',
        stack: 'total',
        data: [0, 0, 0, 0, 0, 0],
        barWidth: this.barWidth,
        label: {
          show: false,
          valueAnimation: true,
          position: 'insideTopRight',
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
.dashboard-daily-use-ticket {
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
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
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    border: solid 1px #e5e5e5;
  }
}
</style>
