<template>
  <div id="bar-line-chart" class="bar-line-chart" />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import echarts, { ECharts, EChartOption } from 'echarts'
import variables from '@/styles/_variables.scss'

export interface IBarLineChart {
  title: Object
  legend: Object
  colors: string[]
  xAxisData: string[]
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
  name: 'BarLineChart'
})
export default class extends Vue {
  @Prop({ required: true }) private chartItems!: IBarLineChart
  @Prop({ default: 'chart' }) private className!: string
  @Prop({ default: 'chart' }) private id!: string
  @Prop({ default: '100%' }) private width!: string
  @Prop({ default: '500px' }) private height!: string
  private chart!: ECharts

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

  private setOptions(chartItems: IBarLineChart) {
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
          top: '5%',
          bottom: '10%',
          containLabel: true
        },
        toolbox: {},
        xAxis: {
          type: 'category',
          data: chartItems.xAxisData
        },
        yAxis: [
          {
            type: 'value',
            name: '',
            min: 0,
            max: 250,
            interval: 50
          },
          {
            type: 'value',
            name: '',
            min: 0,
            max: 25,
            interval: 5
          }
        ],
        series: chartItems.series
      } as unknown) as EChartOption<EChartOption.SeriesLine>)
    }
  }
}
</script>
<style lang="scss">
.bar-line-chart {
  width: 100%;
  height: 400px;
}
</style>
