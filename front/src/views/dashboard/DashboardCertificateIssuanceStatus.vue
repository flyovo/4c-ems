<template>
  <div class="dashboard-certificate-issuanse-status">
    <div class="dashboard-certificate-issuanse-status__header">
      <div class="dashboard-certificate-issuanse-status__header__title">{{ title }}</div>
    </div>
    <div class="dashboard-certificate-issuanse-status__wrapper">
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
  name: 'DashboardCertificateIssuanceStatus',
  components: { BarHorizontalChart, IBarHorizontalChart, ChartToCsv }
})
export default class extends Vue {
  private title: string = '증명서 발급 현황'
  private barWidth: number = 20
  private chartItems: IBarHorizontalChart = {
    title: {
      text: '',
      textStyle: {
        fontSize: 15
      }
    },
    legend: [],
    colors: [variables.numberTicket],
    yAxisData: ['외래진료비 영수증', '소득공제용\n장애인증명서', '입퇴원 확인서', '납입 증명서', '통원확인서'],
    series: [
      {
        name: '최대',
        type: 'bar',
        stack: 'total',
        data: [10, 22, 30, 24, 39],
        barWidth: this.barWidth,
        label: {
          show: true,
          valueAnimation: true,
          position: 'right',
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
.dashboard-certificate-issuanse-status {
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
