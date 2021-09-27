<template>
  <div class="dashboard-content">
    <div class="dashboard-content__header">
      <control-header-dashboard />
    </div>
    <div class="dashboard-content__charts">
      <dashboard-kiosk-receipt-status />
      <dashboard-status-use-by-menu />
      <dashboard-receipt-waiting-time />
      <dashboard-certificate-issuance-status />
    </div>
    <!-- <back-to-top :visibility-height="300" :back-position="50" transition-name="fade" /> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ControlHeaderDashboard from '@/components/ControlHeader/dashboard.vue'
import DashboardKioskReceiptStatus from './DashboardKioskReceiptStatus.vue'
import DashboardStatusUseByMenu from './DashboardStatusUseByMenu.vue'
import DashboardReceiptWaitingTime from './DashboardReceiptWaitingTime.vue'
import DashboardCertificateIssuanceStatus from './DashboardCertificateIssuanceStatus.vue'
@Component({
  name: 'Dashboard',
  components: {
    ControlHeaderDashboard,
    DashboardKioskReceiptStatus,
    DashboardStatusUseByMenu,
    DashboardReceiptWaitingTime,
    DashboardCertificateIssuanceStatus
  }
})
export default class extends Vue {
  public initData: {
    kiosk: {}
    status: {}
    wait: {}
    certificate: {}
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  .dashboard-content {
    width: 100%;
    height: 100%;
    &__header {
      display: flex;
      // height: 36px;
      // margin-bottom: 72px;
      height: setViewport('vh', $header-height);
      margin-bottom: setViewport('vh', $header-bottom);
    }
    &__charts {
      width: 100%;
      height: calc(100% - #{setViewport('vh', $header-height + $header-bottom)});
      display: flex;
      flex-wrap: wrap;
      // flex-direction: column;
      gap: setViewport('vw', 40);
      > div {
        width: calc(50% - #{setViewport('vw', 20)});
        height: calc(50% - #{setViewport('vh', 20)});
        display: flex;
        justify-content: center;
        flex-direction: column;
      }
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
