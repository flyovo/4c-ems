<template>
  <div class="statistics-wrapper">
    <div class="statistics-wrapper__header">
      <control-header-table @selectCenter="fetchCenter" @selectDate="fetchDate"/>
    </div>
    <!-- <data-table :initData="mock"></data-table> -->
    <data-table></data-table>
    <!-- <back-to-top :visibility-height="300" :back-position="50" transition-name="fade" /> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ControlHeaderTable from '@/components/ControlHeader/table.vue'
// import { dashboard } from '../../../router/modules/router-constants'
import DataTable from './DataTable.vue'
// import BackToTop from '@/components/BackToTop/index.vue'
// import { MOCK_STATISTICS_CERTIFICATE } from '@/store/modules/statustucs/mock/statistics-certificate'

@Component({
  name: 'statistics',
  components: { 
    DataTable,
    ControlHeaderTable
  }
})
export default class extends Vue {
  // private mock: any = MOCK_STATISTICS_CERTIFICATE

  private async fetchCenter(value: number) {
    console.log(value)
    // this.selectDate = await value
    // this.getDateRange()
  }
  private async fetchDate(value: number) {
    console.log(value)
    // this.selectDate = await value
    // this.getDateRange()
  }
}
</script>

<style lang="scss" scoped>
.statistics-wrapper {
  &__header {
    display: flex;
    // height: 90px;
    // margin-bottom: 20px;
    height: setViewport('vh', 90);
    margin-bottom: setViewport('vh', 20);
  }
}
</style>
