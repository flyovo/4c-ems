<template>
  <div id="bar-horizontal-chart" class="bar-horizontal-chart" />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import echarts, { ECharts, EChartOption } from 'echarts'
import commonScss from '@/styles/common.scss'

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
    if (this.chart) {
      this.chart.clear();
    }
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
    // this.chart = null
  }

  private async initProcess() {
    this.chart = await echarts.init(this.$el as HTMLDivElement)
    await this.setOptions(this.chartItems)
  }

  private setOptions(chartItems: IBarHorizontalChart) {
    if (this.chart) {
      this.chart.setOption(({
        // title: chartItems.title,
        title: {
          text: chartItems.title,
          left: 'center',
          textStyle: {
            fontSize: commonScss.chartFont
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          x: 'center',
          y: 'bottom',
          icon: 'rect',
          itemGap: 30,
          itemWidth: 12,
          itemHeight: 12,
          data: chartItems.legend
        },
        color: chartItems.colors,
        grid: {
          width: commonScss.chartWidth,
          height: commonScss.chartHeight,
          left: commonScss.chartLeft,
          right: commonScss.chartRight,
          top: commonScss.chartTop,
          bottom: commonScss.chartBottom,
          // width: "100%",
          // height: "80%",
          // left: '0%',
          // right: '3%',
          // top: '15%',
          // bottom: '0%',
          containLabel: true
        },
        toolbox: {},
        xAxis: {
          type: 'value'
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
  height: 100% !important;
  // height: 400px;
  // height: setViewport('vh', 400);
}
</style>
