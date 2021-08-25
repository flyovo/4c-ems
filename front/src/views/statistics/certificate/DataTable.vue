<template>
  <div class="statistics-table">
    <div class="statistics-table__header">
      <div class="statistics-table__header__button">
        <div class="statistics-table__header__button__date">
          <!-- <el-button type="info" :class="{ active: selectDate === 0 }" @click="handleDateChange(0)">당월</el-button>
          <el-button type="info" :class="{ active: selectDate === 1 }" @click="handleDateChange(1)">전월</el-button>
          <el-button type="info" :class="{ active: selectDate === 2 }" @click="handleDateChange(2)">연간</el-button> -->
          <el-dropdown>
            <el-button type="primary">
              {{ dateList[selectDate] }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item 
                v-for="(item, index) in dateList" 
                :key="index"
                :label="item"
                @click.native="handleDateChange(index)">{{ item }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>  
          <el-dropdown>
            <el-button type="primary">
              센터명 선택<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown>
            <el-button type="primary">
              기관 선택<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
            </el-dropdown-menu>
          </el-dropdown>  
          <div class="statistics-table__header__button__date__text">
            <div>조회 기간 : {{ dateRange.label.from }} ~ {{ dateRange.label.to }}</div>
          </div>
        </div>
        <div class="statistics-table__header__button__excel">
          <download-excel :data="tableData" name="filename.xls">
            <el-button type="info"><svg-icon name="excel" style="margin-right:7px;" />엑셀출력</el-button>
          </download-excel>
        </div>
      </div>
    </div>
    <div class="statistics-table__body">
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
      .el-dropdown {
        height: 100%;
        margin-right: 15px;
      }
      .el-button {
        height: 100%;
        padding: 0px 15px;
        background-color: #5d5d5d;
        border-color: #5d5d5d;
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
