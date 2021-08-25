<template>
<div class="control_header">
  <div class="control_header_group">
    <div class="control_header_wrapper">
      <div class="control_header__title">기간 선택</div>
      <div class="control_header__date">
          <div class="date-warpper">
              <div class="date__buttons">
                  <el-button v-for="(item, index) in dateList" :key="index" type="info" :class="{ active: selectDate === index }" @click.native="handleDateChange(index)">{{ item.label.text }}</el-button>
              </div>
              <div class="date__buttons calendar">
                <el-button type="info" :class="{ active: selectDate === dateList.length }" @click.native="handleDateChange(7)" icon="el-icon-date">
                  <!-- <span> -->
                    <!-- <img src="@/assets/images/ic-calendar-gray.svg"> -->                    
                    {{ dateRange.label.from }} ~ {{ dateRange.label.to }}
                  <!-- </span> -->
                </el-button>
              </div>
          </div>
      </div>
    </div>
    <div class="control_header_wrapper">
      <div class="control_header__title">수납 타입 선택</div>
      <div class="control_header__date">
          <div class="date-warpper">
              <div class="date__buttons">
                  <el-button v-for="(item, index) in typeList" :key="index" type="info" :class="{ active: selectType === index }" @click.native="handleTypeChange(index)">{{ item }}</el-button>
              </div>
          </div>
      </div>
    </div>
  </div>
  <div class="type_text" v-html="menuText"></div>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { RawDataStoreModule } from '@/store/modules/rawdata/store'
import { SettingsModule } from '@/store/modules/settings/store'

@Component({
  name: 'ControlHeaderDashboard'
})
export default class extends Vue {
  private selectDate: number = 0
  private selectType: number = 0
  public init_data: { 
    kiosk: {}, 
    status: {}, 
    wait: {}, 
    certificate: {} 
  }

  created() {
    this.getDateRange()
  }

  get menuText() {
    return SettingsModule.menuText
  }
  get dateList() {
    console.log('RawDataStoreModule.dateList::::', RawDataStoreModule.dateList)
    return RawDataStoreModule.dateList
  }
  get typeList() {
    return RawDataStoreModule.typeList
  }
  get dateRange() {
    return RawDataStoreModule.dateRange
  }

  private async handleDateChange(value: number) {
    this.selectDate = await value
    this.getDateRange();
  }
  private async handleTypeChange(value: number) {
    this.selectType = await value
    // this.getDateRange();
  }

  private async getDateRange() {
    const payload = {
      date: this.selectDate
    }
    await RawDataStoreModule.GetDateRange(payload)
  }
}
</script>

<style lang="scss">
.control_header {
  .type_text {
    font-family: NotoSansCJKKR;
    // font-size: 26px;
    font-size: setViewport('vw', 26);
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 0.77;
    letter-spacing: -1.04px;
    text-align: right;
    color: #333;
    span {
      color: #0058ff;
    }
  }
}
</style>
<style lang="scss" scoped>
.control_header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .control_header_group {
    width: 80%;
    & + div {
      width: 20%;
    }
  }

  .control_header_wrapper {
    display: flex;
    // width: 100%;
    // height: 36px;
    height: setViewport('vh', 36);

    &:first-child {
      // margin-bottom: 12px;
      margin-bottom: setViewport('vh', 12);
    }
  
    .el-button--primary {
      border-color: none;
    }
    .el-dropdown {
      // margin: 0 12px;
      margin: 0 setViewport('vw', 12);
      flex-grow: 0;

      .el-button {
        // width: 96px;
        // height: 36px;
        width: setViewport('vw', 96);
        height: setViewport('vh', 36);
        border-radius: 4px;
        border: 1px solid $lightGray;
        padding: 0;
        // font-size: 14px;
        font-size: setViewport('vw', 14);
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1;
        letter-spacing: normal;
        color: $subMenuText;

        &:hover, &:focus {
          background-color: $subMenuBg;
        }
      }
    }
  }
  &__title {
    display: flex;
    align-items: center;
    // min-width: 63px;
    // margin-right: 20px;
    // font-size: 16px;
    min-width: setViewport('vw', 63);
    margin-right: setViewport('vw', 20);
    font-size: setViewport('vw', 16);
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    color: $subMenuText;
  }
  &__date {
    // min-width: calc(100% - 116px);
    min-width: calc(100% - #{setViewport('vw', 116)});
    height: 100%;

    .date-warpper {
      width: 100%;
      height: 100%;
      display: flex;
      // justify-content: space-between;

      .date__buttons {
        &.calendar {
          button {
            width: auto;
            // margin-left: 15px;
            // padding: 0 10px;
            border-radius: 4px;
            margin-left: setViewport('vw', 15);
            padding: 0 setViewport('vw', 10);
            span {
              display: flex;
              align-items: center;
            }
          }
        }
        button {
          // width: 85px;
          width: setViewport('vw', 85);
          height: 100%;
          padding: 0;
          border-radius: 2px;
          margin-left: 0;
          background-color: $subMenuBg;
          border: 1px solid $lightGray;
          // font-size: 14px;
          font-size: setViewport('vw', 14);
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1;
          letter-spacing: normal;
          color: $subMenuText;

          &:hover, &:active, &.active {
              background-color: $menuActiveText;
              color: $subMenuActiveText;
          }
        }
      }
    }
  }
}
</style>
