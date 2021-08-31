<template>
  <div typeList class="statistics-table__body__table">
    <el-table :data="tableData" header-align="center">
      <el-table-column prop="날짜" label="날짜" sortable align="center"></el-table-column>
      <el-table-column prop="센터명" label="센터명" sortable align="center"></el-table-column>
      <el-table-column prop="기관" label="기관" sortable align="center"></el-table-column>
      <el-table-column prop="층수" label="층수" sortable align="center"></el-table-column>
      <el-table-column prop="구역" label="구역" sortable align="center"></el-table-column>
      <el-table-column prop="부서" label="관리부서" sortable align="center"></el-table-column>
      <el-table-column prop="ID" label="ID" sortable align="center"></el-table-column>
      <el-table-column prop="Model" label="Model" sortable align="center"></el-table-column>
      <el-table-column prop="등록번호" label="등록번호" sortable align="center"></el-table-column>
      <el-table-column prop="예약진료수" label="예약진료수" sortable :formatter="getNumFormat" align="center"></el-table-column>
      <el-table-column prop="문진성공" label="문진성공" sortable :formatter="getNumFormat" align="center"></el-table-column>
      <el-table-column prop="문진실패" label="문진실패" sortable :formatter="getNumFormat" align="center"></el-table-column>
      <el-table-column prop="도착확인성공" label="도착확인성공" sortable :formatter="getNumFormat" align="center"></el-table-column>
      <el-table-column prop="도착확인실패" label="도착확인실패" sortable :formatter="getNumFormat" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { StatisticsStoreModule } from '@/store/modules/statistics/store'

@Component({
  name: 'Arrive'
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
    }).then((result: any) => {
      this.data = result
      this.handleCurrentChange(1)
    })
  }

  private getNumFormat(row: any, column: any) {
    let value = row[column.property]
    if (value === undefined) {
      return ''
    }
    value = typeof value === 'string' ? value : value.toString()
    return value.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
  }
}
</script>
