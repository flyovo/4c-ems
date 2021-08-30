<template>
  <div class="statistics-table">
    <div class="statistics-table__header">
      <div class="statistics-table__header__date_text">
        <i class="el-icon-date"></i>
        조회 기간 : {{ dateRange.label.from }} ~ {{ dateRange.label.to }}
      </div>
      <div class="button-group">
        <el-dropdown>
            <el-button>
                25개씩<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>25개씩</el-dropdown-item>
                <el-dropdown-item>30개씩</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <el-button type="info" @click="fetchData">데이터 조회</el-button>
        <download-excel class="excel" :data="tableData" name="filename.xls">
          <el-button type="info">엑셀 저장</el-button>
        </download-excel>
      </div>
    </div>
    <OutPatient v-if="menuType === 'out-patient'"/> <!-- 외래&입원 수납 Data -->
    <Leaves v-else-if="menuType === 'leaves'" /> <!-- 증명서 발급 Data -->
    <Week v-else-if="menuType === 'week'" /> <!-- 도착확인 Data -->
    <Certification v-else-if="menuType === 'certification'" /> <!-- 신체계측 Data -->
    <WaitTime v-else-if="menuType === 'wait-time'" /> <!-- 실패 Data -->
    <Arrive v-else-if="menuType === 'arrive'" /> <!-- 실패 Data -->
    <Measurements v-else-if="menuType === 'measurements'" /> <!-- 실패 Data -->
    <div class="statistics-table__body__paging">
      <!-- <el-pagination :page-size="15" layout="prev, pager, next" :total="totalCount" :current-change="currentPage" @current-change="handleCurrentChange"> </el-pagination> -->
      <div class="button-group">
        <el-button type="info" @click="fetchData">데이터 조회</el-button>
        <download-excel class="excel" :data="tableData" name="filename.xls">
          <el-button type="info">엑셀 저장</el-button>
        </download-excel>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { StatisticsStoreModule } from '@/store/modules/statistics/store'
import { SettingsModule } from '@/store/modules/settings/store'
import OutPatient from './outPatient/index.vue'
import Leaves from './leaves/index.vue'
import Week from './week/index.vue'
import Certification from './certification/index.vue'
import WaitTime from './waitTime/index.vue'
import Arrive from './arrive/index.vue'
import Measurements from './measurements/index.vue'

@Component({
  name: 'TableList',
  components: { 
    OutPatient,
    Leaves,
    Week,
    Certification,
    WaitTime,
    Arrive,
    Measurements
  }
})
export default class extends Vue {
  // @Prop({ default: {label:{from:"", to:""}} }) private dateRange!: {}
  // @Prop({ default: [] }) private dateList!: []
  @Prop({ default: 'dashboard' }) private menuType!: String
  @Prop({ default: [] }) private typeList!: []
  @Prop({ default: 0 }) private selectDate!: Number
  @Prop({ default: 0 }) private selectType!: Number
  @Prop({ default: 25 }) private pageNum!: Number

private page: number = 1
public data: []

  created() {
    this.getDateRange()
    // this.fetchData()
  }
  
  get comboIndex() {
    return StatisticsStoreModule.comboIndex
  }
  
  get dateList() {
    return StatisticsStoreModule.dateList
  }

  get dateRange() {
    return StatisticsStoreModule.dateRange
  }

  get menuPosition() {
    console.log('menuPosition:::::', SettingsModule.menuPosition)
    return SettingsModule.menuPosition
  }

private async handleDateChange(value: number) {
    this.selectDate = value
    await this.getDateRange()
    // this.fetchData()
  }

  private async getDateRange() {
    const payload = {
      date: this.selectDate
    }
    await StatisticsStoreModule.GetDateRange(payload)
  }
  
  get tableData() {
    return StatisticsStoreModule.tableList
  }

  get totalCount() {
    return StatisticsStoreModule.tableListTotalCount
  }

  get currentPage() {
    return this.page
  }

  set currentPage(value) {
    this.$emit('update:page', value)
  }

  private async getTablePagination() {
    await StatisticsStoreModule.GetTableData({
      data: this.data,
      page: this.page,
      limit: this.pageNum
    })
  }

  private async handleCurrentChange(value: number) {
    this.page = await value
    this.getTablePagination()
  }

  private async fetchData() {
    if(this.menuType  === undefined) return;
    // if(this.typeList[this.selectType] === undefined) return;
    if(this.selectDate === undefined) return;
    if(this.dateRange === undefined) return;

    console.log(this.menuType, this.typeList, this.selectType, this.typeList[this.selectType], this.selectDate, this.dateRange)

    let option;
    if(this.typeList[this.selectType] === undefined){
      option = []
    }else{
      option = this.typeList[this.selectType]
    }

    await StatisticsStoreModule.RawTableData({      
      type: this.menuType,
      option: option,
      range: this.dateRange.date,
      position: this.menuPosition.join(",")
    }).then( (result: any) => {
      console.log(result)
      this.data = result
      this.handleCurrentChange(1)
    })
  }

  private getNumFormat(row:any, column:any) {
    let value = row[column.property];
    if (value == undefined) {
        return "";
    }
    value = typeof value === 'string' ? value : value.toString()
    return value.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
  }
}
</script>

<style lang="scss" scoped>
.statistics-table {
  height: calc(100% - #{setViewport('vh', 90)});
  // padding: 20px 30px 30px;
  // border-radius: 10px;
  padding: setViewport('vw', 20) setViewport('vw', 30) setViewport('vw', 30);
  border-radius: setViewport('vw', 10);
  box-shadow: 0 4px 10px 0 rgba(68, 68, 68, 0.1);
  border: solid 2px $lightGray;
  background-color: #fff;

  &__header {
    display: flex;
    // height: 36px;
    // margin-bottom: 20px;
    height: setViewport('vh', 36);
    margin-bottom: setViewport('vh', 20);
    justify-content: space-between;
    align-items: center;

    &__date_text {
      i {
        margin: 0 4px 0 0;
        object-fit: contain;
      }
      // font-size: 14px;
      font-size: setViewport('vw', 14);
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: -0.84px;
      color: #999;
    }
  }
}
</style>

<style lang="scss">
.el-dropdown-menu__item {
  line-height: 1.4 !important;
  padding: setViewport('vw', 3) setViewport('vw', 16) !important;
  font-size: setViewport('vw', 14) !important;
  width: setViewport('vw', 100);
  text-align: center;
}
.statistics-table {
  .el-table {
      border-top-left-radius: setViewport('vw', 6);
      border-top-right-radius: setViewport('vw', 6);
    .caret-wrapper {
      width: setViewport('vw', 24);
    }
  }
  table {
    thead {
      tr:nth-child(1) {
        display: none;
      }
      th {
        padding: 0;

        &:nth-child(2n-1){
          border: solid 1px #333;
          background-color: #333;
        }
        &:nth-child(2n){
          border: solid 1px #555;
          background-color: #555;
        }
      }
      .cell {
        height: setViewport('vh', 32);
        vertical-align: unset;
        font-size: setViewport('vw', 16);
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: 0.88;
        letter-spacing: normal;
        text-align: center;
        color: #fff;
        padding-left: 0 !important;
        padding-right: 0;
        align-items: center;
        justify-content: center;
      }
    }
    tbody {
      td {
        padding: 0;
        .cell {
          height: setViewport('vh', 32);
          vertical-align: unset;
          font-size: setViewport('vw', 16);
          font-weight: 500;
          font-stretch: normal;
          font-style: normal;
          letter-spacing: normal;
          text-align: center;
          padding-left: 0 !important;
          padding-right: 0;
        }
      }
    }
  }
  .el-table__empty-block {
    font-size: setViewport('vw', 16);
  }

  .el-pagination {
    height: 100%;
    display: flex;
    button {
      height: 100%;
      display: flex;
      align-items: center;
      color: $paginationText;
    }
    .el-icon {
      line-height: none;
      // font-size: 24px;
      font-size: setViewport('vw', 24);
    }
    .el-pager li {
      display: flex;
      justify-content: center;
      align-items: center;
      // width: 36px;
      // height: 36px;
      // font-size: 16px;
      width: setViewport('vw', 36);
      height: setViewport('vh', 36);
      font-size: setViewport('vw', 16);
      font-weight: bold;
      line-height: 1.5;
      color: $paginationText;
      &.active {
        // border-radius: 4px;
        border-radius: setViewport('vw', 4);
        color: $subMenuActiveText;
        background-color: $buttonActiveBg;
      }
    }
  }

  .statistics-table__body {
    height: 100%;
    background-color: #fff;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border-bottom: solid 1px #e5e5e5;
    margin-bottom: 100px;
    &__table {
      padding: 0%;
      height: calc(100% - #{setViewport('vh', 137)});
      .el-table, .el-table__body-wrapper {
        height: 100%;
      }
    }
    &__paging {
      width: 100%;
      // height: 36px;
      // margin-top: 45px;
      height: setViewport('vh', 36);
      margin-top: setViewport('vh', 45);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      .button-group {
        position: absolute;
        right: 0;
      }

      .el-pagination {
        position: absolute;
        padding: 0;

        .el-pager li {
          // font-size: 16px;
          font-size: setViewport('vw', 16);
        }
        .btn-prev {
          .el-icon .el-icon-arrow-left {
            // font-size: 18px;
            font-size: setViewport('vw', 18);
          }
        }
      }
    }
  }
  
  .button-group {
    display: flex;
    height: 100%;

    :not(.el-dropdown) .el-button {
      height: 100%;
      // padding: 0px 15px;
      padding: 0px setViewport('vw', 15);
      background-color: $buttonBg;
      border-color: $buttonBg;
      // border-radius: 4px;
      border-radius: setViewport('vw', 4);
      &:hover, &:active, &.active {
        background-color: $buttonActiveBg;
        border-color: $buttonActiveBg;
      }
    }

    & > .el-dropdown {
      height: 100%;
      // margin-right: 10px;
      margin-right: setViewport('vw', 10);
      // font-size: 14px;
      font-size: setViewport('vw', 14);
      & > .el-button {
        width: setViewport('vw', 100);
        padding: 0px setViewport('vw', 15);
        background-color: $subMenuBg;
        color: $darkGrayText;
        border: 1px solid $lightGray;
        &:hover, &:focus {
          background-color: $subMenuBg;
        }
        &:hover, &:focus {
          color: $darkGrayText;
          border-color: $lightGray;
        }
      }
    }
    & .el-button {
      height: 100%;
      // margin-right: 4px;
      // padding: 0px 15px;
      // border-radius: 4px;
      margin-right: setViewport('vw', 4);
      padding: 0px setViewport('vw', 15);
      border-radius: setViewport('vw', 4);
      // font-size: 14px;
      font-size: setViewport('vw', 14);
      background-color: $buttonBg;
      border-color: $buttonBg;
      &:hover, &:active, &.active {
        background-color: $buttonActiveBg;
        border-color: $buttonActiveBg;
      }
      .el-icon-arrow-down {
        position: absolute;
        right: setViewport('vw', 12);
      }
    }
  }
}
</style>
