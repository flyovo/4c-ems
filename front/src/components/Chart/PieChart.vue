<template>
  <div id="pie-chart" class="pie-chart" />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import echarts, { ECharts, EChartOption } from 'echarts'

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

  private setOptions(chartItems: IPieChart) {
    if (this.chart) {
      this.chart.setOption({
        title: chartItems.title,
        tooltip: {
          trigger: 'item',
          // formatter: '{b} : {c} ({d}%)'
          formatter: function (params) {
            let value = params.value
            if (value == undefined) {
                return "";
            }
            value = typeof value === 'string' ? value : value.toString()
            value = value.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
            return `${params.name} : ${value} (${params.percent}%)`
          }
        },
        legend: {
          x: 'center',
          y: 'bottom',
          icon: 'rect',
          // itemGap: 30,
          itemWidth: 9,
          itemHeight: 9,
          data: chartItems.legend
        },
        color: chartItems.colors,
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
      } as EChartOption<EChartOption.SeriesPie>)
    }
  }
}
</script>
<style lang="scss">
.pie-chart {
  width: 100%;
  height: 400px;
}
</style>
