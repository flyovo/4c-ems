<template>
  <div class="dashboard-status-use-by-menu">
    <div class="dashboard-status-use-by-menu__header">
      <div class="dashboard-status-use-by-menu__header__title">{{ title }}</div>
    </div>
    <div class="dashboard-status-use-by-menu__wrapper">
      <pie-chart :chart-items="chartItems" />
      <chart-to-csv :chart-title="title" :chart-items="chartItems" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PieChart, { IPieChart } from '@/components/Chart/PieChart.vue'
import variables from '@/styles/_variables.scss'
import ChartToCsv from '@/components/ChartToCsv/index.vue'

@Component({
  name: 'DashboardStatusUseByMenu',
  components: { PieChart, ChartToCsv }
})
export default class extends Vue {
  private title: string = '일 평균 대기시간'
  private chartItems: IPieChart = {
    title: {
      text: '',
      textStyle: {
        fontSize: 15
      }
    },
    legend: ['약처방전', '차량등록', '진료전 자기평가', '수납 불가', '진료비 수납', '번호표 발행'],
    colors: [variables.payment, variables.arrive, variables.numberTicket, variables.proof, variables.insurance, variables.install],
    seriesRadius: ['40%', '70%'],
    seriesMegTitle: '현황',
    seriesPosition: ['50%', '45%'],
    seriesData: [
      { value: 548, name: '약처방전' },
      { value: 135, name: '차량등록' },
      { value: 251, name: '진료전 자기평가' },
      { value: 148, name: '수납 불가' },
      { value: 165, name: '진료비 수납' },
      { value: 233, name: '번호표 발행' }
    ]
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
  }
}
</style>
