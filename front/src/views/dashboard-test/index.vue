<template>
  <div class="dashboard">
    <div class="dashboard__daily">
      <daily-avg-count></daily-avg-count>
      <daily-avg-price></daily-avg-price>
      <daily-avg-wait-time></daily-avg-wait-time>
      <daily-avg-wait-people></daily-avg-wait-people>
    </div>
    <setting-count></setting-count>
    <setting-price></setting-price>
    <div class="dashboard__ticket">
      <setting-ticket></setting-ticket>
      <daily-avg-ticket></daily-avg-ticket>
      <daily-use-ticket></daily-use-ticket>
    </div>
    <div class="dashboard__drug">
      <setting-drug></setting-drug>
      <setting-drug-by-pharmacy></setting-drug-by-pharmacy>
    </div>
    <div class="dashboard__etc">
      <setting-cars></setting-cars>
      <setting-self-evaluation></setting-self-evaluation>
    </div>
    <back-to-top :visibility-height="300" :back-position="50" transition-name="fade" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DailyAvgCount from './DailyAvgCount.vue'
import DailyAvgPrice from './DailyAvgPrice.vue'
import DailyAvgWaitTime from './DailyAvgWaitTime.vue'
import DailyAvgWaitPeople from './DailyAvgWaitPeople.vue'
import DailyAvgTicket from './DailyAvgTicket.vue'
import DailyUseTicket from './DailyUseTicket.vue'
import SettingCount from './SettingCount.vue'
import SettingPrice from './SettingPrice.vue'
import SettingTicket from './SettingTicket.vue'
import SettingDrug from './SettingDrug.vue'
import SettingDrugByPharmacy from './SettingDrugByPharmacy.vue'
import SettingCars from './SettingCars.vue'
import SettingSelfEvaluation from './SettingSelfEvaluation.vue'
import { dashboard } from '../../router/modules/router-constants'
import BackToTop from '@/components/BackToTop/index.vue'
@Component({
  name: 'DashboardTest',
  components: {
    DailyAvgCount,
    DailyAvgPrice,
    DailyAvgWaitTime,
    DailyAvgWaitPeople,
    DailyAvgTicket,
    DailyUseTicket,
    SettingCount,
    SettingPrice,
    SettingTicket,
    SettingDrug,
    SettingDrugByPharmacy,
    SettingCars,
    SettingSelfEvaluation,
    BackToTop
  }
})
export default class extends Vue {}
</script>

<style lang="scss" scoped>
.dashboard {
  width: 100%;
  height: 100%;
  &__daily {
    width: 100%;
    display: grid;
    column-gap: 10px;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  &__ticket {
    width: 100%;
    display: grid;
    column-gap: 10px;
    grid-template-columns: 2fr 1fr 1fr;
  }
  &__drug,
  &__etc {
    width: 100%;
    display: grid;
    column-gap: 10px;
    grid-template-columns: 1fr 1fr;
  }
}
</style>
