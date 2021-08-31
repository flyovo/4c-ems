<template>
  <div id="pie-chart" class="pie-chart" />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import echarts, { ECharts, EChartOption } from 'echarts'
import commonScss from '@/styles/common.scss'

export interface IPieChart {
  title: Object
  legend: string[]
  colors: string[]
  seriesData: SeriesType[]
  seriesRadius: string | string[]
  seriesMegTitle: string
  seriesPosition: string[]
}

export interface SeriesType {
  value: number
  name: string
}

@Component({
  name: 'PieChart'
})
export default class extends Vue {
  @Prop({ required: true }) private chartItems!: IPieChart
  @Prop({ default: 'chart' }) private className!: string
  @Prop({ default: 'chart' }) private id!: string
  @Prop({ default: '100%' }) private width!: string
  @Prop({ default: '500px' }) private height!: string
  private chart!: ECharts

  @Watch('chartItems', { immediate: true, deep: true })
  public onInitChartChange(val: any, oldVal: any) {
    if (this.chart) {
      this.chart.clear()
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

  private setOptions(chartItems: IPieChart) {
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
          trigger: 'item',
          // formatter: '{b} : {c} ({d}%)'
          formatter: function(params) {
            let value = params.value
            if (value === undefined) {
              return ''
            }
            value = typeof value === 'string' ? value : value.toString()
            value = value.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
            return `${params.name} : ${value} (${params.percent}%)`
          }
        },
        legend: {
          orient: 'vertical',
          right: '2%',
          top: '25%',
          bottom: '25%',
          icon: 'rect',
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
        series: [
          {
            name: chartItems.seriesMegTitle,
            type: 'pie',
            radius: chartItems.seriesRadius,
            label: {
              position: 'inner',
              color: '#fff',
              fontSize: 14,
              formatter: '{d}% '
            },
            center: chartItems.seriesPosition,
            data: chartItems.seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      } as unknown) as EChartOption<EChartOption.SeriesPie>)
    }
  }
}
</script>
<style lang="scss">
.pie-chart {
  width: 100%;
  height: 100% !important;
  // height: 400px;
  // height: setViewport('vh', 400);
}
</style>
