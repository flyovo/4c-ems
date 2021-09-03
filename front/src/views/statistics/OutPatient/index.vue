<template>
  <div typeList class="statistics-table__body__table" ref="tableWrapper">
    <el-table :data="tableData" header-align="center" :max-height="getHeight">
      <el-table-column label="구분" align="center">
        <el-table-column prop="센터명" label="센터명" sortable align="center"></el-table-column>
        <el-table-column prop="기관" label="기관" sortable align="center"></el-table-column>
        <el-table-column prop="층" label="층" sortable align="center"></el-table-column>
        <el-table-column prop="구역" label="구역" sortable align="center"></el-table-column>
        <el-table-column prop="용도" label="용도" sortable align="center"></el-table-column>
        <el-table-column prop="대수" label="대수" sortable :formatter="getNumFormat" align="center"></el-table-column>
      </el-table-column>
      <el-table-column label="수납관련사항" align="center">
        <el-table-column prop="수납가능건수" label="수납가능건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="수납건수" label="수납건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="수납불가" label="수납불가" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="금액" label="금액" sortable :formatter="getNumFormat" align="center"></el-table-column>
      </el-table-column>
      <el-table-column label="기타사항" align="center">
        <el-table-column prop="처방전 발급 건수" label="처방전 발급 건" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="약국 전송 건수" label="약국 전송 건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="주차등록" label="주차등록" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="차량등록/변경" label="차량등록/변경" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="진료전자기평가" label="진료전자기평가" sortable :formatter="getNumFormat" align="center"></el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { StatisticsStoreModule } from '@/store/modules/statistics/store'

@Component({
  name: 'OutPatient'
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
    return StatisticsStoreModule.dateList
  }

  get dateRange() {
    return StatisticsStoreModule.dateRange
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
