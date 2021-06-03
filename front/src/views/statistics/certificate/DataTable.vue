<template>
  <div class="statistics-table">
    <div class="statistics-table__header">
      <div class="statistics-table__header__button">
        <div class="statistics-table__header__button__date">
          <el-button type="info" :class="{ active: selectDate === 0 }" @click="handleDateChange(0)">당월</el-button>
          <el-button type="info" :class="{ active: selectDate === 1 }" @click="handleDateChange(1)">전월</el-button>
          <el-button type="info" :class="{ active: selectDate === 2 }" @click="handleDateChange(2)">연간</el-button>
          <div class="statistics-table__header__button__date__text">
            <div>조회 기간 : {{ dateRange.from }} ~ {{ dateRange.to }}</div>
          </div>
        </div>
        <div class="statistics-table__header__button__excel">
          <download-excel :data="tableData" name="filename.xls">
            <el-button type="info"><svg-icon name="excel" style="margin-right:7px;" />엑셀출력</el-button>
          </download-excel>
        </div>
      </div>
      <!-- <div class="statistics-table__header__text">
        <div>조회 기간 : {{ dateRange.from }} ~ {{ dateRange.to }}</div>
      </div> -->
    </div>
    <div class="statistics-table__body">
      <div class="statistics-table__body__table">
        <el-table :data="tableData" header-align="center">
          <el-table-column label="구분" align="center">
            <el-table-column prop="pos_1" label="센터명" align="center"></el-table-column>
            <el-table-column prop="pos_2" label="층" align="center"></el-table-column>
            <!-- <el-table-column prop="pos_3" label="창구명" align="center"></el-table-column> -->
          </el-table-column>
          <el-table-column prop="cnt_01" label="입퇴원 증명서" align="center"></el-table-column>
          <el-table-column prop="cnt_02" label="통원 증명서" align="center"></el-table-column>
          <el-table-column prop="cnt_03" label="납입 증명서" align="center"></el-table-column>
          <el-table-column prop="cnt_04" label="장애인 증명서" align="center"></el-table-column>
          <el-table-column prop="cnt_05" label="입원진료비 영수증" align="center"></el-table-column>
          <el-table-column prop="cnt_06" label="외래진료비 영수증" align="center"></el-table-column>
          <el-table-column prop="cnt_07" label="응급진료비 영수증" align="center"></el-table-column>
          <el-table-column prop="total" label="계" align="center"></el-table-column>
        </el-table>
        <div class="statistics-table__body__paging">
          <el-pagination :page-size="15" layout="prev, pager, next" :total="totalCount" :current-change="currentPage" @current-change="handleCurrentChange"> </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { DashboardStoreModule } from '@/store/modules/dashboard/store'

@Component({
  name: 'TableList'
})
export default class extends Vue {
  // @Prop({ default: 'hi' }) private msg!: string
  @Prop() private initData?: []

  private page: number = 1
  private selectDate: number = 0

  created() {
    console.log('???')
    this.getDateRange()
    this.getTableList()
  }

  get dateRange() {
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

  get tableData() {
    return DashboardStoreModule.tableList
  }
  get totalCount() {
    return DashboardStoreModule.tableListTotalCount
  }

  get currentPage() {
    return this.page
  }

  set currentPage(value) {
    this.$emit('update:page', value)
  }

  private async handleCurrentChange(value: number) {
    this.page = await value
    this.getTableList()
  }

  private async getTableList() {
    const payload = {
      data: this.initData,
      page: this.page,
      limit: 15
    }
    await DashboardStoreModule.GetTableData(payload)
  }
}
</script>

<style lang="scss" scoped>
.statistics-table {
  &__header {
    padding-bottom: 20px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    &__text {
      div {
        padding-top: 20px;
        font-size: 14px;
      }
    }
    &__button {
      height: 32px;
      display: flex;
      justify-content: space-between;
      &__date {
        height: 100%;
        &__text {
          display: inline-block;
          div {
            font-size: 14px;
          }
        }
      }
      &__excel {
        height: 100%;
        > div {
          height: 100%;
        }
      }
      .el-button {
        height: 100%;
        padding: 0px 15px;
        &.active {
          background-color: #2a2a2a;
          border-color: #2a2a2a;
        }
        &:nth-child(3) {
          margin-right: 15px;
        }
      }
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
      text-align: center;
      padding: 3%;
      .el-pagination {
        .el-pager li {
          font-size: 16px;
        }
        .btn-prev {
          .el-icon .el-icon-arrow-left {
            font-size: 18px;
          }
        }
      }
    }
  }
}
</style>
