<template>
  <div class="dashboard-certificate-issuanse-status">
    <div class="dashboard-certificate-issuanse-status__header">
      <div class="dashboard-certificate-issuanse-status__header__title">{{ title }}</div>
    </div>
    <div class="dashboard-certificate-issuanse-status__wrapper">
      <img src="@/assets/images/cycle.svg" />
      <bar-horizontal-chart :chart-items="chartItems" />
      <chart-to-csv :chart-title="title" :chart-items="chartItems" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import BarHorizontalChart, { IBarHorizontalChart } from '@/components/Chart/BarHorizontalChart.vue'
import variables from '@/styles/_variables.scss'
import ChartToCsv from '@/components/ChartToCsv/index.vue'
import { DashboardStoreModule } from '@/store/modules/dashboard/store.ts'

@Component({
  name: 'DashboardCertificateIssuanceStatus',
  components: { BarHorizontalChart, IBarHorizontalChart, ChartToCsv }
})
export default class extends Vue {
  // @Prop() public initDateRange!: {}

  public data: any = {}
  private type: string = 'certificate'
  private interval: any

  @Watch('initDate', {immediate: true, deep: true})
  public onInitDateChange(val: any, oldVal: any) {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.fetchData()
    this.intervalData()
  }

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
    // yAxisData: ['외래진료비 영수증', '소득공제용\n장애인증명서', '입퇴원 확인서', '납입 증명서', '통원확인서'],
    yAxisData: [],
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
  private async intervalData() {
    this.interval = setInterval(() => {
      DashboardStoreModule.Dashboard({
        type: this.type,
        range: {}
      }).then(async (result: any) => {
        this.data = result
        await this.setChart()
      })
    }, 1000 * 60 * 1);
  }

  private async setChart() {
    for(let col of this.data.column){
      col = col.replace(' ', '\n')
      this.chartItems.yAxisData.push(col)
    }
    this.chartItems.series = [{
      name: '발급 수',
      type: 'bar',
      stack: 'total',
      // data: [10, 22, 30, 24, 39],
      data: this.data.data,
      barWidth: this.barWidth,
      label: {
        show: true,
        valueAnimation: true,
        position: 'right',
        formatter: d => {
          let value = d.value
          if (value == undefined) {
              return "";
          }
          value = typeof value === 'string' ? value : value.toString()
          return value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
        }
      }
    }]
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
    img {
      position: absolute;
      top: 23px;
      left: 20px;
      display: inline-block;
      z-index: 1;
      transition: all linear 1s;
      animation: binglebingle 1s linear infinite;
    }
    @keyframes binglebingle {
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
      }
    }
  }
}
</style>
