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
// import { MOCK_STATISTICS_IN_PATIENT } from '@/store/modules/statustucs/mock/statistics-in-patient'

@Component({
  name: 'statistics',
  components: { DataTable, BackToTop }
})
export default class extends Vue {
  // private mock: any = MOCK_STATISTICS_IN_PATIENT
}
</script>

<style lang="scss" scoped></style>
