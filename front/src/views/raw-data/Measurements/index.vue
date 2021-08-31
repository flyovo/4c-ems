<template>
  <div typeList class="raw-data-table__body__table">
    <el-table :data="tableData" header-align="center">
        <el-table-column prop="타입" label="타입" sortable align="center"></el-table-column>
        <el-table-column prop="날짜" label="날짜" sortable align="center"></el-table-column>
        <el-table-column prop="센터명" label="센터명" sortable align="center"></el-table-column>
        <el-table-column prop="기관" label="기관" sortable align="center"></el-table-column>
        <el-table-column prop="층" label="층" sortable align="center"></el-table-column>
        <el-table-column prop="구역" label="구역" sortable align="center"></el-table-column>
        <el-table-column prop="관리부서" label="관리부서" sortable align="center"></el-table-column>
        <el-table-column prop="ID" label="ID" sortable align="center"></el-table-column>
        <el-table-column prop="Model" label="Model" sortable align="center"></el-table-column>
        <el-table-column prop="등록번호" label="등록번호" sortable align="center"></el-table-column>
        <el-table-column prop="예약진료수" label="예약진료수" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="신체계측성공" label="신체계측성공" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="신체계측실패" label="신체계측실패" sortable :formatter="getNumFormat" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { RawDataStoreModule } from '@/store/modules/rawdata/store'

@Component({
  name: 'Measurements'
})
export default class extends Vue {
  private page: number = 1
  private selectDate: number = 0
  public type: string = 'receipt'
  public data: []

  created() {
    this.getDateRange()
    // this.fetchData()
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
    // this.fetchData()
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
