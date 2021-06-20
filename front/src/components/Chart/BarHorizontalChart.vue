<template>
  <div id="bar-horizontal-chart" class="bar-horizontal-chart" />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import echarts, { ECharts, EChartOption } from 'echarts'

export interface IBarHorizontalChart {
  title: Object
  legend: string[]
  colors: string[]
  yAxisData: string[]
  series: Object
  // series: SeriesType[]
}

// export interface SeriesType {
//   name: string
//   type: string
//   stack: string
//   data: number[]
// }

@Component({
  name: 'BarHorizontalChart'
})
export default class extends Vue {
  @Prop({ required: true }) private chartItems!: IBarHorizontalChart
  @Prop({ default: 'chart' }) private className!: string
  @Prop({ default: 'chart' }) private id!: string
  @Prop({ default: '100%' }) private width!: string
  @Prop({ default: '500px' }) private height!: string
  private chart!: ECharts

  @Watch('chartItems', {immediate: true, deep: true})
  public onInitChartChange(val: any, oldVal: any) {
    this.setOptions(this.chartItems)
  }

  mounted() {
    this.initProcess()
    this.$nextTick(function() {
      let vm = this
      window.addEventListener('resize', function() {
        if (vm.chart) {
          vm.chart.resize()
        }
      })
    })
  }

  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  }

  private async initProcess() {
    this.chart = await echarts.init(this.$el as HTMLDivElement)
    await this.setOptions(this.chartItems)
  }

  private setOptions(chartItems: IBarHorizontalChart) {
    if (this.chart) {
      this.chart.setOption(({
        title: chartItems.title,
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          x: 'center',
          y: 'bottom',
          icon: 'rect',
          itemGap: 30,
          itemWidth: 9,
          itemHeight: 9,
          data: chartItems.legend
        },
        color: chartItems.colors,
        grid: {
          left: '0%',
          right: '0%',
          top: '10%',
          bottom: '10%',
          containLabel: true
        },
        toolbox: {},
        xAxis: {
          type: 'value'
          // axisLine: { show: false },
          // axisLabel: { show: false },
          // axisTick: { show: false },
          // splitLine: { show: false }
        },
        yAxis: {
          type: 'category',
          inverse: true,
          axisLine: { show: false },
          // axisLabel: { show: false },
          axisTick: { show: false },
          data: chartItems.yAxisData
        },
        series: chartItems.series
      } as unknown) as EChartOption<EChartOption.SeriesLine>)
    }
  }
}
</script>
<style lang="scss">
.bar-horizontal-chart {
  width: 100%;
  height: 400px;
}
</style>
