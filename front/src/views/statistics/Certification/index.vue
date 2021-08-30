<template>
<div typeList class="statistics-table__body__table">
  <el-table :data="tableData" header-align="center">
    <el-table-column label="row" align="center">
      <el-table-column prop="구분" label="구분" sortable align="center">
        <el-table-column prop="센터명" label="센터명" sortable align="center"></el-table-column>
        <el-table-column prop="층" label="층" sortable align="center"></el-table-column>
      </el-table-column>
      <el-table-column prop="입퇴원증명서" label="입퇴원증명서" sortable :formatter="getNumFormat" align="center"></el-table-column>
      <el-table-column prop="통원증명서" label="통원증명서" sortable :formatter="getNumFormat" align="center"></el-table-column>
      <el-table-column prop="납입증명서" label="납입증명서" sortable :formatter="getNumFormat" align="center"></el-table-column>
      <el-table-column prop="장애인증명서" label="장애인증명서" sortable :formatter="getNumFormat" align="center"></el-table-column>
      <el-table-column prop="입원진료비영수증" label="입원진료비영수증" sortable :formatter="getNumFormat" align="center"></el-table-column>
      <el-table-column prop="외래비진료비영수증" label="외래비진료비영수증" sortable :formatter="getNumFormat" align="center"></el-table-column>
      <el-table-column prop="응급진료비영수증" label="응급진료비영수증" sortable :formatter="getNumFormat" align="center"></el-table-column>
      <el-table-column prop="계" label="계" sortable :formatter="getNumFormat" align="center"></el-table-column>
    </el-table-column>
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
