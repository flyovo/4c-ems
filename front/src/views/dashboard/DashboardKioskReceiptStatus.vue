<template>
  <div class="dashboard-kiosk-receipt-status">
    <div class="dashboard-kiosk-receipt-status__header">
      <div class="dashboard-kiosk-receipt-status__header__title">{{ title }}</div>
    </div>
    <div class="dashboard-kiosk-receipt-status__wrapper">
      <div class="dashboard-kiosk-receipt-status__chart-card">
        <div class="dashboard-kiosk-receipt-status__button">
          <div class="dashboard-kiosk-receipt-status__button__date">
            <el-dropdown>
              <el-button type="primary">
                기관 선택<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
              </el-dropdown-menu>
            </el-dropdown>  
            <el-button type="info" :class="{ active: selectDate === 0 }" @click="handleDateChange(0)">당월</el-button>
            <el-button type="info" :class="{ active: selectDate === 1 }" @click="handleDateChange(1)">전월</el-button>
            <el-button type="info" :class="{ active: selectDate === 2 }" @click="handleDateChange(2)">연간</el-button>
            <!-- <div class="dashboard-kiosk-receipt-status__date__text">
              <div>조회 기간 : {{ dateRange.from }} ~ {{ dateRange.to }}</div>
            </div> -->
          </div>
        </div>
        <chart-to-csv :chart-title="title" :chart-items="chartItems" />
        <bar-chart class="dashboard-kiosk-receipt-status__chart" :chart-items="chartItems" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import BarChart, { IBarChart } from '@/components/Chart/BarChart.vue'
import variables from '@/styles/_variables.scss'
import ChartToCsv from '@/components/ChartToCsv/index'
import { DashboardStoreModule } from '@/store/modules/dashboard/store.ts'

@Component({
  name: 'DashboardKioskReceiptStatus',
  components: { BarChart, ChartToCsv }
})
export default class extends Vue {
  private selectDate: number = 0
  // @Prop() public initDateRange!: {}

  public data: any = {}
  public type: string = 'kiosk'

  // @Watch('initDate', {immediate: true, deep: true})
  // public onInitDateChange(val: any, oldVal: any) {
  //   this.fetchData()
  // }

  created() {
    this.getDateRange()
  }

  get dateRange() {
    this.$emit('fetch', DashboardStoreModule.dateRange)
    return DashboardStoreModule.dateRange
  }

  private async handleDateChange(value: number) {
    this.selectDate = await value
    this.getDateRange()
  }

  private async getDateRange() {
    const payload = {
      date: this.selectDate
    }
    await DashboardStoreModule.GetDateRange(payload)
    this.fetchData()
  }

  private title: string = '키오스크 수납 현황'
  private chartItems: IBarChart = {
    title: {
      text: ''
    },
    legend: [],
    colors: [variables.payment, variables.arrive],
    xAxisData: [],
    series: []
  }

  private async fetchData() {
    DashboardStoreModule.Dashboard({
      type: this.type,
      range: this.dateRange
    }).then(async (result: any) => {
      this.data = result
      await this.setChart()
    })
  }

  private async setChart() {
    this.chartItems.xAxisData = []
    this.chartItems.legend = []
    this.chartItems.series = []

    for(let data of this.data.column){
      this.chartItems.xAxisData.push(data)
    }
    for(let key in this.data.data){
      let legentTitle = `${key} 키오스크 (건수)`;

      this.chartItems.legend.push(legentTitle);
      this.chartItems.series.push(
        {
          barGap: 0.2,
          name: legentTitle,
          type: 'bar',
          stack: '',
          label: {
            show: true,
            position: 'top',
            formatter: d => {
              let value = d.value
              if (value == undefined) {
                  return "";
              }
              value = typeof value === 'string' ? value : value.toString()
              return value.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            }
          },
          data: this.data.data[key]
        }
      )
    }
  }
}
</script>

<style lang="scss">
.dashboard-kiosk-receipt-status {
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
  &__button{
    position: absolute;
    top: 16px;
    right: 40px;
    z-index: 1;
    // height: 20px;
    .el-dropdown {
      height: 100%;
      margin-right: 15px;
    }
    .el-button {
      height: 100%;
      padding: 3px 8px;
      font-size: 10px;
      background-color: #5d5d5d;
      border-color: #5d5d5d;
      &.active {
        background-color: #2a2a2a;
        border-color: #2a2a2a;
      }
      &:nth-child(4) {
        margin-right: 15px;
      }
    }
  }
}
</style>
