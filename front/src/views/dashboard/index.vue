<template>
  <div class="dashboard-content">
    <div class="dashboard-content__header">
      <div class="dashboard-content__header__date">
        <el-button type="info" :class="{ active: selectDate === 0 }" @click="handleDateChange(0)">당월</el-button>
        <el-button type="info" :class="{ active: selectDate === 1 }" @click="handleDateChange(1)">전월</el-button>
        <el-button type="info" :class="{ active: selectDate === 2 }" @click="handleDateChange(2)">연간</el-button>
        <div class="dashboard-content__header__text">
          <div>조회 기간 : {{ dateRange.from }} ~ {{ dateRange.to }}</div>
        </div>
      </div>
    </div>
    <div class="dashboard-content__charts">
      <dashboard-kiosk-receipt-status></dashboard-kiosk-receipt-status>
      <dashboard-status-use-by-menu></dashboard-status-use-by-menu>
      <dashboard-receipt-waiting-time></dashboard-receipt-waiting-time>
      <dashboard-certificate-issuance-status></dashboard-certificate-issuance-status>
    </div>
    <back-to-top :visibility-height="300" :back-position="50" transition-name="fade" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DashboardKioskReceiptStatus from './DashboardKioskReceiptStatus.vue'
import DashboardStatusUseByMenu from './DashboardStatusUseByMenu.vue'
import DashboardReceiptWaitingTime from './DashboardReceiptWaitingTime.vue'
import DashboardCertificateIssuanceStatus from './DashboardCertificateIssuanceStatus.vue'
import { dashboard } from '../../router/modules/router-constants'
import BackToTop from '@/components/BackToTop/index.vue'
import { DashboardStoreModule } from '@/store/modules/dashboard/store'
@Component({
  name: 'Dashboard',
  components: {
    DashboardKioskReceiptStatus,
    DashboardStatusUseByMenu,
    DashboardReceiptWaitingTime,
    DashboardCertificateIssuanceStatus,
    BackToTop
  }
})
export default class extends Vue {
  private selectDate: number = 0

  created() {
    this.getDateRange()
  }

  get dateRange() {
    this.$emit('fetch', DashboardStoreModule.dateRange)
    return DashboardStoreModule.dateRange
  }

  private async handleDateChange(value: number) {
    this.selectDate = await value
    this.getDateRange()
  }

  private async getDateRange() {
    const payload = {
      date: this.selectDate
    }
    await DashboardStoreModule.GetDateRange(payload)
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  .dashboard-content {
    width: 100%;
    height: 100%;
    &__header {
      padding-bottom: 20px;
      &__text {
        display: inline-block;
        div {
          padding-left: 20px;
          font-size: 14px;
        }
      }
    }
    &__charts {
      display: grid;
      column-gap: 10px;
      grid-template-columns: 1fr 1fr;
    }
  }
}

.mobile {
  // &.openSidebar {
  .app-main {
    .dashboard-content {
      &__charts {
        flex-grow: 0;
        grid-template-columns: none;
      }
    }
  }
}
</style>
