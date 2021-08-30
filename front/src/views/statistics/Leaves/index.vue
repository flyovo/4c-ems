<template>
<div typeList class="statistics-table__body__table">
  <el-table :data="tableData" header-align="center">
    <el-table-column prop="구분" label="구분" sortable align="center"></el-table-column>
    <el-table-column prop="구분(각1대)" label="구분(각1대)" sortable :formatter="getNumFormat" align="center"></el-table-column>
    <el-table-column label="입퇴원비 수납" align="center">
      <el-table-column label="중간수납" align="center">
        <el-table-column prop="중간수납건수" label="건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="중간수납금액" label="금액" sortable :formatter="getNumFormat" align="center"></el-table-column>
      </el-table-column>
      <el-table-column label="퇴원수납" align="center">
        <el-table-column prop="퇴원수납건수" label="건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="퇴원수납금액" label="금액" sortable :formatter="getNumFormat" align="center"></el-table-column>
      </el-table-column>
      <el-table-column prop="불능건수" label="불능건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
    </el-table-column>
    <el-table-column label="입퇴원비 조회" align="center">
      <el-table-column prop="조회건수" label="조회건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
      <el-table-column prop="불능건수" label="불능건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
    </el-table-column>
    <el-table-column label="주차등록/변경" align="center">
      <el-table-column prop="등록건수" label="등록건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
      <el-table-column prop="변경건수" label="변경건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
    </el-table-column>
    <el-table-column label="보호자 밥(죽) 건수" align="center">
      <el-table-column prop="신청건" label="신청건" sortable :formatter="getNumFormat" align="center"></el-table-column>
      <el-table-column prop="변경건" label="변경건" sortable :formatter="getNumFormat" align="center"></el-table-column>
      <el-table-column prop="취소건" label="취소건" sortable :formatter="getNumFormat" align="center"></el-table-column>
      <el-table-column prop="조회건" label="조회건" sortable :formatter="getNumFormat" align="center"></el-table-column>
    </el-table-column>
    <el-table-column prop="수술진행안내건수" label="수술진행안내건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
  </el-table>
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { StatisticsStoreModule } from '@/store/modules/statistics/store'

@Component({
  name: 'Leaves'
})
export default class extends Vue {
  // @Prop({ default: [] }) private tableData!: []
  private page: number = 1
  private selectDate: number = 0
  public type: string = 'receipt'
  public data: []

  created() {
    this.getDateRange()
    // this.fetchData()
  }

  get dateList() {
    return StatisticsStoreModule.dateList
  }

  get dateRange() {
    return StatisticsStoreModule.dateRange
  }

  get tableData() {
    return StatisticsStoreModule.tableList
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
