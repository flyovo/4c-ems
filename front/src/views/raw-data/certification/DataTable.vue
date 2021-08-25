<template>
  <div class="raw-data-table">
    <div class="raw-data-table__header">
      <div class="raw-data-table__header__button">
        <div class="raw-data-table__header__button__date">
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
          <div class="raw-data-table__header__button__date__text">
            <div>조회 기간 : {{ dateRange.label.from }} ~ {{ dateRange.label.to }}</div>
          </div>
        </div>
        <div class="raw-data-table__header__button__excel">
          <download-excel :data="tableData" name="filename.xls">
            <el-button type="info"><svg-icon name="excel" style="margin-right:7px;" />엑셀출력</el-button>
          </download-excel>
        </div>
      </div>
    </div>
    <div class="raw-data-table__body">
      <div class="raw-data-table__body__table">
        <el-table :data="tableData" header-align="center">
          <el-table-column label="row" align="center">
            <el-table-column prop="날짜" label="날짜" sortable align="center"></el-table-column>
            <el-table-column prop="요일" label="요일" sortable align="center"></el-table-column>
            <el-table-column prop="센터명" label="센터명" sortable align="center"></el-table-column>
            <el-table-column prop="기관" label="기관" sortable align="center"></el-table-column>
            <el-table-column prop="구역" label="구역" sortable align="center"></el-table-column>
            <el-table-column prop="층" label="층" sortable align="center"></el-table-column>
            <el-table-column prop="Model" label="Model" sortable align="center"></el-table-column>
            <el-table-column prop="등록번호" label="등록번호" sortable align="center"></el-table-column>
            <el-table-column prop="발급시간" label="발급시간" sortable align="center"></el-table-column>
            <el-table-column prop="발급건수" label="발급건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
            <el-table-column prop="증명서 종류" label="증명서 종류" sortable align="center"></el-table-column>
            <el-table-column prop="폐기여부" label="폐기여부" sortable align="center"></el-table-column>
            <!-- <el-table-column prop="certificate_date" label="날짜" align="center"></el-table-column>
            <el-table-column prop="week" label="요일" align="center"></el-table-column>
            <el-table-column prop="site" label="센터명" align="center"></el-table-column>
            <el-table-column prop="pos_1" label="창구" align="center"></el-table-column>
            <el-table-column prop="pos_2" label="층수" align="center"></el-table-column>
            <el-table-column prop="pos_3" label="진료과" align="center"></el-table-column>
            <el-table-column prop="pos_4" label="위치4" align="center"></el-table-column>
            <el-table-column prop="dev_model" label="모델명" align="center"></el-table-column>
            <el-table-column prop="chart_no" label="환자등록번호" align="center"></el-table-column>
            <el-table-column prop="certificate_time" label="발급시간" align="center"></el-table-column>
            <el-table-column prop="cnt_certificate" label="발급건수" align="center"></el-table-column> -->
          </el-table-column>
        </el-table>
        <div class="raw-data-table__body__paging">
          <el-pagination :page-size="15" layout="prev, pager, next" :total="totalCount" :current-change="currentPage" @current-change="handleCurrentChange"> </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { RawDataStoreModule } from '@/store/modules/rawdata/store'

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
    return RawDataStoreModule.dateList
  }

  get dateRange() {
    return RawDataStoreModule.dateRange
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
    await RawDataStoreModule.GetDateRange(payload)
  }
  
  get tableData() {
    return RawDataStoreModule.tableList
  }

  get totalCount() {
    return RawDataStoreModule.tableListTotalCount
  }

  get currentPage() {
    return this.page
  }

  set currentPage(value) {
    this.$emit('update:page', value)
  }

  private async getTablePagination() {
    await RawDataStoreModule.GetTableData({
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
    await RawDataStoreModule.RawTableData({
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
.raw-data-table {
  &__header {
    padding-bottom: 20px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;

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
      // table {
      //   thead {
      //     tr:nth-child(1) {
      //       display: none;
      //     }
      //   }
      // }
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

<style lang="scss">
.raw-data-table {
  table {
    thead {
      tr:nth-child(1) {
        display: none;
      }
    }
  }
}
</style>
