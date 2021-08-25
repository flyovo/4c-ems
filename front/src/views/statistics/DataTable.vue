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
        <el-button type="info">데이터 조회</el-button>
        <download-excel class="excel" :data="tableData" name="filename.xls">
          <el-button type="info">엑셀 저장</el-button>
        </download-excel>
      </div>
    </div>
    <div class="statistics-table__body__table">
      <el-table :data="tableData" header-align="center">
        <el-table-column label="구분" align="center">
          <el-table-column prop="기관" label="기관" sortable align="center"></el-table-column>
          <el-table-column prop="구역" label="구역" sortable align="center"></el-table-column>
          <el-table-column prop="층" label="층" sortable align="center"></el-table-column>
        </el-table-column>
        <el-table-column prop="입퇴원증명서" label="입퇴원 증명서" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="통원증명서" label="통원 증명서" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="납입증명서" label="납입 증명서" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="장애인증명서" label="장애인 증명서" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="입원영수증" label="입원진료비 영수증" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="외래진료비" label="외래진료비 영수증" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="응급진료비" label="응급진료비 영수증" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="계" label="계" sortable :formatter="getNumFormat" align="center"></el-table-column>
      </el-table>
      <div class="statistics-table__body__paging">
        <el-pagination :page-size="15" layout="prev, pager, next" :total="totalCount" :current-change="currentPage" @current-change="handleCurrentChange"> </el-pagination>
        <div class="button-group">
          <el-button type="info">데이터 조회</el-button>
          <download-excel class="excel" :data="tableData" name="filename.xls">
            <el-button type="info">엑셀 저장</el-button>
          </download-excel>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { StatisticsStoreModule } from '@/store/modules/statistics/store'

@Component({
  name: 'TableList'
})
export default class extends Vue {
  private page: number = 1
  private selectDate: number = 0
  public type: string = 'certification'
  public data: []

  created() {
    this.getDateRange()
    this.fetchData()
  }

  get dateList() {
    return StatisticsStoreModule.dateList
  }

  get dateRange() {
    return StatisticsStoreModule.dateRange
  }

  private async handleDateChange(value: number) {
    this.selectDate = value
    await this.getDateRange()
    this.fetchData()
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
        limit: 15
      })
  }

  private async handleCurrentChange(value: number) {
    this.page = await value
    this.getTablePagination()
  }

  private async fetchData() {
    await StatisticsStoreModule.RawTableData({
      type: this.type,
      range: this.dateRange
    }).then( (result: any) => {
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
  // padding: 20px 30px 30px;
  padding: setViewport('vw', 20) setViewport('vw', 30) setViewport('vw', 30);
  border-radius: 10px;
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
  &__body {
    height: 100%;
    background-color: #fff;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border-bottom: solid 1px #e5e5e5;
    margin-bottom: 100px;
    &__table {
      padding: 0%;
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
      border-radius: 4px;
      &:hover, &:active, &.active {
        background-color: $buttonActiveBg;
        border-color: $buttonActiveBg;
      }
    }

    & > .el-dropdown {
      height: 100%;
      // margin-right: 10px;
      margin-right: setViewport('vw', 10);
    }
    & > .el-button {
      height: 100%;
      // margin-right: 4px;
      // padding: 0px 15px;
      // border-radius: 4px;
      margin-right: setViewport('vw', 4);
      padding: 0px setViewport('vw', 15);
      border-radius: setViewport('vw', 4);
      background-color: $buttonBg;
      border-color: $buttonBg;
      border-radius: 4px;
      &:hover, &:active, &.active {
        background-color: $buttonActiveBg;
        border-color: $buttonActiveBg;
      }
    }
  }
}
</style>

<style lang="scss">
.statistics-table {
  table {
    thead {
      tr:nth-child(1) {
        // display: none;
      }
    }
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
        border-radius: 4px;
        color: $subMenuActiveText;
        background-color: $buttonActiveBg;
      }
    }
  }
}
</style>
