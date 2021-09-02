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
              <el-date-picker
                size="mini"
                :disabled="selectDate !== dateList.length - 1"
                v-model="calendarDate"
                type="daterange"
                range-separator="~"
                :start-placeholder="dateRange.date.from"
                :end-placeholder="dateRange.date.to"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="control_header_wrapper">
        <div class="control_header__title">{{ typeLabel }}</div>
        <div v-if="menuType === 'failure'" class="control_header__date">
          <el-dropdown>
            <el-button> {{ comboText.fail_op_prog }}<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item, index) in comboList" :key="`${item}-${index}`" @click.native="handleComboChange(index)">{{ item.fail_op_prog }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div v-else class="control_header__date">
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
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { RawDataStoreModule } from '@/store/modules/rawdata/store'
import { SettingsModule } from '@/store/modules/settings/store'
import dayjs from 'dayjs'

@Component({
  name: 'ControlHeaderDashboard-rawdata'
})
export default class extends Vue {
  @Prop({ default: { label: { from: new Date(), to: new Date() } } }) private dateRange!: {}
  @Prop({ default: [] }) private dateList!: []
  @Prop({ default: '' }) private typeLabel!: String
  @Prop({ default: [] }) private typeList!: []
  @Prop({ default: 0 }) private selectDate!: Number
  @Prop({ default: 0 }) private selectType!: Number
  @Prop({ default: 'dashboard' }) private menuType!: String
  
  @Watch('menuType', { immediate: true })
  public async onInitCombo() {
    if (this.menuType === 'failure') {
      await RawDataStoreModule.GetComboList({
        position: this.menuPosition.join(',')
      })
    } else {
      await [].join(',')
    }
  }

  get typeIndex() {
    return RawDataStoreModule.typeIndex
  }

  get menuPosition() {
    return SettingsModule.menuPosition
  }

  get menuText() {
    return SettingsModule.menuText
  }

  get comboList() {
    return RawDataStoreModule.comboList
  }
  get comboIndex() {
    return RawDataStoreModule.comboIndex
  }
  get comboText() {
    if (this.comboList.length > 0) {
      return this.comboList[this.comboIndex]
    } else {
      return '선택'
    }
  }

  public get calendarDate(): any {
    return [this.dateRange.date.from, this.dateRange.date.to]
  }
  public set calendarDate(arr: any) {
    console.log(arr)
    this.dateList[this.dateList.length - 1] = {
      label: {
        text: '기간 조회',
        from: dayjs(arr[0]).format('YYYY년 MM월 DD일'),
        to: dayjs(arr[1]).format('YYYY년 MM월 DD일')
      },
      date: {
        term: 'term',
        from: dayjs(arr[0]).format('YYYY-MM-DD'),
        to: dayjs(arr[1]).format('YYYY-MM-DD')
      }
    }
    this.handleDateChange(this.dateList.length - 1)
  }

  private async handleDateChange(value: number) {
    if (this.dateList.length - 1 === value) {
      await this.$emit('selectDate', value)
    } else {
      await this.$emit('selectDate', value)
    }
  }
  private async handleTypeChange(value: number) {
    await this.$emit('selectType', value)
  }
  private async handleComboChange(value: number) {
    await RawDataStoreModule.SetComboIndex({
      index: value
    })
  }
}
</script>

<style lang="scss">
.control_header {
  .type_text {
    font-family: 'NotoSansCJKKR';
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
  .calendar {
    // width: setViewport('vw', 255);
    // width: setViewport('vw', 290);
    // height: 100%;
    margin-left: setViewport('vw', 15);
    .el-range-editor {
      width: 100%;
      height: 100%;
      font-size: setViewport('vw', 14);
    }
    .el-date-editor {
      border: 1px solid $lightGray;
      font-size: setViewport('vw', 14);
      padding-left: 0;
      padding-right: setViewport('vw', 10);

      &.is-disabled {
        input.el-range-input {
          width: setViewport('vw', 70);
          min-width: 50px;
          font-size: setViewport('vw', 14);
          letter-spacing: -0.84px;
          text-align: left;
        }
      }
      &:not(.is-disabled) {
        input.el-range-input {
          width: 70px;
          font-size: setViewport('vw', 14);
          color: $subMenuText;
          letter-spacing: -0.84px;
          &::placeholder,
          &::-webkit-input-placeholder,
          &:-moz-placeholder,
          &::-moz-placeholder,
          &:-ms-input-placeholder {
            color: $subMenuText;
          }
        }
      }
      .el-input__icon {
        line-height: 0.6;
        width: setViewport('vw', 24);
        height: setViewport('vw', 24);
        // margin-right: 12px;
        margin-left: setViewport('vw', 10);
        &.el-range__close-icon {
          display: none;
        }
      }
      .el-range-separator {
        padding: 0;
        line-height: 0;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.control_header {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;

  .control_header_wrapper {
    display: flex;
    // width: 100%;
    // height: 36px;
    // height: setViewport('vh', 36);

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

        &:hover,
        &:focus {
          background-color: $subMenuBg;
        }
      }
    }
  }
  &__title {
    display: flex;
    align-items: center;
    min-width: 40px;
    // margin-right: 20px;
    // font-size: 16px;
    // width: setViewport('vw', 63);
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
    // min-width: calc(100% - #{setViewport('vw', 116)});
    // min-width: calc(100% - #{setViewport('vw', 116)});
    // height: 100%;

    .date-warpper {
      width: 100%;
      // height: 100%;
      display: -webkit-box;
      // justify-content: space-between;

      .date__buttons {
        button {
          // height: 100%;
          height: setViewport('vh', 36);
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
          &:not(.is-disabled):hover,
          &:not(.is-disabled):active,
          &:not(.is-disabled).active {
            background-color: $menuActiveText;
            color: $subMenuActiveText;
          }
        }
      }
    }
  }
}
</style>
