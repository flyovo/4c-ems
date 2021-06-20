<template>
  <div class="dashboard-status-use-by-menu">
    <div class="dashboard-status-use-by-menu__header">
      <div class="dashboard-status-use-by-menu__header__title">{{ title }}</div>
    </div>
    <div class="dashboard-status-use-by-menu__wrapper">
      <img src="@/assets/images/cycle.svg" />
      <pie-chart :chart-items="chartItems" />
      <chart-to-csv :chart-title="title" :chart-items="chartItems" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import PieChart, { IPieChart } from '@/components/Chart/PieChart.vue'
import variables from '@/styles/_variables.scss'
import ChartToCsv from '@/components/ChartToCsv/index.vue'
import { DashboardStoreModule } from '@/store/modules/dashboard/store.ts'

@Component({
  name: 'DashboardStatusUseByMenu',
  components: { PieChart, ChartToCsv }
})
export default class extends Vue {
  // @Prop() public initDateRange!: {}

  public data: any = {}
  private type: string = 'menu'
  private interval: any

  @Watch('initDate', {immediate: true, deep: true})
  public onInitDateChange(val: any, oldVal: any) {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.fetchData()
    this.intervalData()
  }

  private title: string = '메뉴별 이용 현황'
  private chartItems: IPieChart = {
    title: {
      text: '',
      textStyle: {
        fontSize: 15
      }
    },
    // legend: ['약처방전', '차량등록', '진료전 자기평가', '수납 불가', '진료비 수납', '번호표 발행'],
    legend: [],
    colors: [variables.payment, variables.arrive, variables.numberTicket, variables.proof, variables.insurance, variables.install],
    seriesRadius: ['40%', '70%'],
    seriesMegTitle: '현황',
    seriesPosition: ['50%', '45%'],
    seriesData: []
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
    this.chartItems.legend = this.data.column
    this.chartItems.seriesData = this.data.data
  }
}
</script>

<style lang="scss">
.dashboard-status-use-by-menu {
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
