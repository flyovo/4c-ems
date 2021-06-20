<template>
  <div class="raw-data-wrapper">
    <!-- <data-table :initData="mock"></data-table> -->
    <data-table></data-table>
    <back-to-top :visibility-height="300" :back-position="50" transition-name="fade" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { dashboard } from '../../../router/modules/router-constants'
import DataTable from './DataTable.vue'
import BackToTop from '@/components/BackToTop/index.vue'
// import { MOCK_RAW_DATA_RECEIPT } from '@/store/modules/rawdata/mock/rawdata-receipt'

@Component({
  name: 'rawData',
  components: { DataTable, BackToTop }
})
export default class extends Vue {
  // private mock: any = MOCK_RAW_DATA_RECEIPT
  // public data: any = {}
  // public type: string = 'receipt'

  // private async fetchData() {
  //   RawDataStoreModule.RawTableData({
  //     type: this.type,
  //     range: this.initDateRange
  //   }).then(async (result: any) => {
  //     this.data = result
  //   })
  // }
}
</script>

<style lang="scss" scoped></style>
