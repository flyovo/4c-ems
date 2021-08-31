<template>
  <div typeList class="raw-data-table__body__table">
    <el-table :data="tableData" header-align="center">
        <el-table-column prop="날짜" label="날짜" sortable align="center"></el-table-column>
        <el-table-column prop="요일" label="요일" sortable align="center"></el-table-column>
        <el-table-column prop="센터명" label="센터명" sortable align="center"></el-table-column>
        <el-table-column prop="창구코드" label="창구코드" sortable align="center"></el-table-column>
        <el-table-column prop="층수" label="층수" sortable align="center"></el-table-column>
        <el-table-column prop="창구명" label="창구명" sortable align="center"></el-table-column>
        <el-table-column prop="등록번호" label="환자등록번호" sortable align="center"></el-table-column>
        <el-table-column prop="증명서 종류" label="증명서 종류" sortable align="center"></el-table-column>
        <el-table-column prop="발급건수" label="발급건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { RawDataStoreModule } from '@/store/modules/rawdata/store'

@Component({
  name: 'Certification'
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
    return RawDataStoreModule.dateList
  }

  get dateRange() {
    return RawDataStoreModule.dateRange
  }

  get tableData() {
    return RawDataStoreModule.tableList
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
