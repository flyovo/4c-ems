<template>
  <div class="dashboard-setting-ticket">
    <div class="dashboard-setting-ticket__header">
      <div class="dashboard-setting-ticket__header__title">번호표</div>
    </div>
    <div class="dashboard-setting-ticket__wrapper">
      <div class="dashboard-setting-ticket__chart-card">
        <line-chart :chart-items="chartItems" />
        <chart-to-csv :chart-title="title" :chart-items="chartItems" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import LineChart, { ILineChart } from '@/components/Chart/LineChart.vue'
import variables from '@/styles/_variables.scss'
import { MessageService } from '@/utils/message-service'
import ChartToCsv from '@/components/ChartToCsv/index.vue'

@Component({
  name: 'DashboardSettingTicket',
  components: { LineChart, ChartToCsv }
})
export default class extends Vue {
  private title: string = '번호표 발행건수'
  private searchStartDate: any = ''
  private searchEndDate: any = ''
  private symbolSize: number = 10
  private chartItems: ILineChart = {
    title: {
      text: this.title,
      textStyle: {
        fontSize: 15
      }
    },
    legend: ['전년', '금년'],
    colors: [variables.payment, variables.arrive],
    xAxisData: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    series: [
      {
        name: '전년',
        type: 'line',
        stack: '',
        symbolSize: this.symbolSize,
        data: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90]
      },
      {
        name: '금년',
        type: 'line',
        stack: '',
        symbolSize: this.symbolSize,
        data: [101, 134, 90, 230, 210, 150, 232, 201, 154, 190, 330, 410]
      }
    ]
  }
}
</script>

<style lang="scss">
.dashboard-setting-ticket {
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
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    border: solid 1px #e5e5e5;
  }
}
</style>
