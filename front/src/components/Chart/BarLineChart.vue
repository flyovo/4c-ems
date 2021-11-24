<template>
  <div id="bar-chart" class="bar-chart" />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import echarts, { ECharts, EChartOption } from 'echarts'
import commonScss from '@/styles/common.scss'
// import { AppStoreModule } from '@/store/modules/app/store'

export interface IBarChart {
  title: Object
  legend: Object
  colors: string[]
  xAxisData: string[]
  series: Object,
  tooltip: any
}

@Component({
  name: 'BarChart'
})
export default class extends Vue {
  @Prop({ required: true }) private chartItems!: IBarChart
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

  // get sidebar() {
  //   return AppStoreModule.sidebar
  // }

  // @Watch('sidebar', { immediate: true, deep: true })
  // public onInitResize(val: any, oldVal: any) {
  //   // this.$nextTick(function() {
  //     console.log('1')
  //       if (this.chart) {
  //         console.log('2')
  //       //   this.chart.resize(domWidth)
  //         this.chart.dispose()
  //         console.log('3')
  //       }
  //       this.initProcess()
  //         console.log('4')
  //     // window.dispatchEvent(new Event('resize'));
  //     // var evt = document.createEvent("HTMLEvents");
  //     // evt.initEvent('resize', true, false);
  //     // window.dispatchEvent(evt);

  //   // })
  // }

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

  private setOptions(chartItems: IBarChart) {
    if (this.chart) {
      this.chart.setOption(({
        // title: chartItems.title,
        style: {
          width: "100%",
          height: "100%",
        },
        title: {
          text: chartItems.title,
          left: 'center',
          textStyle: {
            fontSize: commonScss.chartFont
          }
        },
        tooltip: chartItems.tooltip ? 
          chartItems.tooltip : 
          { // 수납시간에서 평균시간을 따로 계산하기 위해 formatter 설정
            trigger: 'axis',
            formatter: function (params) {
              function addZero(num) {
                return ((num < 10) ? '0' : '') + num;
              }

              function secToStr(seconds){
                if(seconds < 60) {
                  return '00:00:' + addZero(Math.round(seconds));
                }
                if(seconds < 3600) {
                  var min = Math.floor(seconds/60);
                  var sec = Math.round(seconds - min*60);
                  return '00:'+ addZero(min) + ':' + addZero(sec);
                }
                var hours = Math.floor(seconds/3600);
                var min = Math.floor((seconds - hours*3600)/60);
                var sec = Math.round(seconds - hours*3600 - min*60);
                return addZero(hours) + ':' + addZero(min) + ':' + addZero(sec);
              }

              return `${params[0].name}<br />
              ${params[0].marker} ${params[0].seriesName}: ${secToStr(params[0].value)}<br />\
              ${params[1].marker} ${params[1].seriesName}: ${secToStr(params[1].value)}<br />\
              ${params[2].marker} ${params[2].seriesName}: ${secToStr(params[2].value)}<br />\
              `;
              // => ${params[0].seriesName}: ${params[0].value}<br />\
            }
          },
        legend: {
          x: 'center',
          bottom: 0,
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
          containLabel: true
        },
        toolbox: {},
        xAxis: {
          type: 'category',
          data: chartItems.xAxisData
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: function(value){
              let seconds = Number(value);

              if(seconds === 0) return seconds;

              var hours = "";
              var min = "";
              var sec = "";

              function secToStr(seconds){
                if(seconds < 60) {
                  return Math.round(seconds) + '초';
                }
                if(seconds < 3600) {
                  min = Math.floor(seconds/60);
                  sec = Math.round(seconds - min*60) > 0 ? 
                    Math.round(seconds - min*60) + '초'
                    : "";
                  return min + '분' + sec;
                }
                hours = Math.floor(seconds/3600);
                min = Math.floor((seconds - hours*3600)/60);
                sec = Math.round(seconds - hours*3600 - min*60);
                return hours + '시' + min + '분' + sec + '초';
              }
              return secToStr(seconds);
            },
          }
        },
        series: chartItems.series
      } as unknown) as EChartOption<EChartOption.SeriesBar>)
    }
  }
}
</script>
<style lang="scss">
.bar-chart {
  width: 100% !important;
  height: 100% !important;
  // height: 400px;
  // height: setViewport('vh', 400);
  & > div {
    width: auto !important;
  }
}
</style>
