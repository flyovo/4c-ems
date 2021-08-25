<template>
  <div class="raw-data-wrapper">
    <dash-table></dash-table>
    <back-to-top :visibility-height="300" :back-position="50" transition-name="fade" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { dashboard } from '../../router/modules/router-constants'
// import DashTable from `./${this.$route.path}/DashTable.vue`
import BackToTop from '@/components/BackToTop/index.vue'

const statisticsInPatient = () => import('@/views/statistics/in-patient/index.vue')
@Component({
  name: 'Statistics',
  components: {
    // DashTable,
    BackToTop
  }
})
export default class extends Vue {
  components = {
    DashTable: this.$route.path.split('/')[this.$route.path.split('/').length - 1]
  }
}
</script>

<style lang="scss" scoped></style>
