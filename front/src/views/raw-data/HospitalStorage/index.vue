<template>
  <div class="raw-data-table__body__table" ref="tableWrapper">
    <el-table :data="tableData" header-align="center" :max-height="getHeight">
        <el-table-column prop="수납타입" label="수납타입" sortable align="center"></el-table-column>
        <el-table-column prop="날짜" label="날짜" sortable align="center"></el-table-column>
        <el-table-column prop="요일" label="요일" sortable align="center"></el-table-column>
        <el-table-column prop="센터명" label="센터명" sortable align="center"></el-table-column>
        <el-table-column prop="기관" label="기관" sortable align="center"></el-table-column>
        <el-table-column prop="층" label="층" sortable align="center"></el-table-column>
        <el-table-column prop="구역" label="구역" sortable align="center"></el-table-column>
        <el-table-column prop="부서" label="부서" sortable align="center"></el-table-column>
        <el-table-column prop="창구코드" label="창구코드" sortable align="center"></el-table-column>
        <el-table-column prop="Model" label="모델명" sortable align="center"></el-table-column>
        <el-table-column prop="등록번호" label="등록번호" sortable align="center"></el-table-column>
        <el-table-column prop="수납가능건수" label="수납가능건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="수납시간" label="수납시간" sortable align="center"></el-table-column>
        <el-table-column prop="수납건수" label="수납건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="수납불가" label="수납불가" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="수납금액" label="수납금액" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="처방전 발급 건수" label="처방전 발급 건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="약국 전송 건수" label="약국 전송 건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="약국" label="약국" sortable align="center"></el-table-column>
        <el-table-column prop="번호표" label="번호표" sortable align="center"></el-table-column>
        <el-table-column prop="폐기여부" label="폐기여부" sortable align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { RawDataStoreModule } from '@/store/modules/rawdata/store'

@Component({
  name: 'Hospitalization'
})
export default class extends Vue {
  private page: number = 1
  private selectDate: number = 0
  public type: string = 'receipt'
  public data: []
  public getHeight: number = 300

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

  private handleResize() {
    this.getHeight = this.$refs.tableWrapper.clientHeight
  }

  mounted(){
		this.$nextTick(function () {
      this.handleResize()
			window.addEventListener("resize", this.handleResize);
		});
  }

  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  }
  
}
</script>
