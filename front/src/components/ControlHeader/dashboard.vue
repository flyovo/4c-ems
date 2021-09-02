<template>
  <div class="control_header">
    <div class="control_header_wrapper">
      <div class="control_header__title">기관 선택</div>
      <el-dropdown>
        <el-button> {{ siteLabel.label }}<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item, index) in siteList" :key="`${item}-${index}`" @click.native="handleSiteChange(item)">{{ item.label }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="control_header__date">
        <div class="date-warpper">
          <div class="date__buttons">
            <el-button type="info" :class="{ active: selectDate === 0 }" @click="handleDateChange(0)">당월(주별)</el-button>
            <el-button type="info" :class="{ active: selectDate === 1 }" @click="handleDateChange(1)">전월(주별)</el-button>
            <el-button type="info" :class="{ active: selectDate === 2 }" @click="handleDateChange(2)">연간(월별)</el-button>
          </div>
          <div class="date_text">
            <!-- <img src="@/assets/images/ic-calendar-bk.svg"> -->
            <i class="el-icon-date"></i>
            조회 기간 : {{ dateRange.label.from }} ~ {{ dateRange.label.to }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import AsyncComputed from 'vue-async-computed-decorator'
import { SettingsModule } from '@/store/modules/settings/store'
import { UserStoreModule } from '@/store/modules/user/store'
import { DashboardStoreModule } from '@/store/modules/dashboard/store.ts'
@Component({
  name: 'ControlHeaderDashboard'
})
export default class extends Vue {
  private selectDate: number = 0
  public initData: {
    kiosk: {}
    status: {}
    wait: {}
    certificate: {}
  }

  created() {
    this.getDateRange()
  }

  @AsyncComputed()
  // 기관 리스트
  async siteList() {
    let position = [];
    if( JSON.parse(localStorage.getItem('4c-userState')).site ){
      position.push( JSON.parse(localStorage.getItem('4c-userState')).site )
    }

    let list = await SettingsModule.GetSite({
      site: 'pos_1',
      position: position.join(','),
      organ: JSON.parse(localStorage.getItem('4c-userState')).organ,
      pos_4: JSON.parse(localStorage.getItem('4c-userState')).pos_4,
      // ...JSON.parse(localStorage.getItem('4c-userState')),
      auth: localStorage.getItem('4c-userAuth')
    }).then((result: any) => {
      return result
    })
    return [...list]
  }

  // 사이트 텍스트
  get siteLabel() {
    return DashboardStoreModule.selectedSite
  }

  // 날짜 텍스트
  get dateRange() {
    return DashboardStoreModule.dateRange
  }

  // 사이트 버튼 선택 -> vuex에 저장
  private async handleSiteChange(value: Object) {
    const payload = value
    console.log('handleSiteChange : ', payload)
    await DashboardStoreModule.GetSite(payload)
  }

  // 날짜 버튼 선택
  private async handleDateChange(value: number) {
    this.selectDate = await value
    this.getDateRange()
  }

  // 날짜 버튼 선택 -> vuex에 저장
  private async getDateRange() {
    const payload = {
      date: this.selectDate
    }
    await DashboardStoreModule.GetDateRange(payload)
  }
}
</script>

<style lang="scss">
.el-dropdown-menu {
  // width: setViewport('vw', 100);
  padding: setViewport('vh', 6) 0;
  .el-dropdown-menu__item {
    line-height: 2.4 !important;
    padding: 0px setViewport('vw', 15) !important;
    font-size: setViewport('vw', 14) !important;
    width: auto !important;
    min-width: 55px;
    text-align: center;
  }
}
</style>
<style lang="scss" scoped>
.control_header {
  width: 100%;
  .control_header_wrapper {
    display: flex;
    width: 100%;
    // height: 36px;
    height: setViewport('vh', 36);

    .el-button--primary {
      border-color: none;
    }
    .el-dropdown {
      // margin: 0 20px;
      margin-left: setViewport('vw', 12);
      margin-right: setViewport('vw', 22);
      flex-grow: 0;
      .el-button {
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        // width: 96px;
        // width: setViewport('vw', 100);
        height: 100%;
        border-radius: 4px;
        border: 1px solid $lightGray;
        // padding: 0 setViewport('vw', 25) 0 setViewport('vw', 12);
        padding: 0 setViewport('vw', 12);
        // font-size: 14px;
        font-size: setViewport('vw', 14);
        text-align: left;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1;
        letter-spacing: normal;
        color: $subMenuText;
        &:hover,
        &:focus {
          background-color: $subMenuBg;
        }
        // .el-icon-arrow-down {
        //   position: absolute;
        //   right: 0;
        // }
      }
    }
  }
  &__title {
    display: flex;
    align-items: center;
    // min-width: 40px;
    // margin-right: 20px;
    // font-size: 16px;
    // width: setViewport('vw', 63);
    // font-size: 20px;
    font-size: setViewport('vw', 20);
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    color: $subMenuText;
  }
  &__date {
    // width: calc(100% - 212px);
    // width: calc(100% - #{setViewport('vw', 212)});
    min-width: calc(100% - 212px);
    // width: 100%;
    height: 100%;
    .date-warpper {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      .date__buttons {
        button {
          height: 100%;
          padding: 0px setViewport('vw', 12);
          border-radius: 2px;
          margin-left: 0;
          background-color: $subMenuBg;
          border: 1px solid $lightGray;
          font-size: setViewport('vw', 14);
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1;
          letter-spacing: normal;
          color: $subMenuText;
          &:hover,
          &:active,
          &.active {
            background-color: $menuActiveText;
            color: $subMenuActiveText;
          }
        }
      }
      .date_text {
        display: flex;
        align-items: center;
        // font-size: 14px;
        font-size: setViewport('vw', 14);
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: -0.84px;
        text-align: right;
        color: $darkGrayText;
        img {
          // width: 24px;
          // height: 24px;
          // margin: 0 4px 0 0;
          width: setViewport('vw', 24);
          height: setViewport('vh', 24);
          margin: 0 setViewport('vw', 4) 0 0;
          object-fit: contain;
        }
        i {
          margin: 0 4px 0 0;
          object-fit: contain;
        }
      }
    }
  }
}
</style>
