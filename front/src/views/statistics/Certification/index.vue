<template>
  <div typeList class="statistics-table__body__table" ref="tableWrapper">
    <el-table :data="tableData" header-align="center" :max-height="getHeight" :span-method="objectSpanMethod">
        <el-table-column label="구분" sortable align="center">
          <el-table-column prop="기관" label="센터명" sortable align="center"></el-table-column>
          <el-table-column prop="층" label="층" sortable align="center"></el-table-column>
          <el-table-column prop="구역" label="구역" sortable align="center"></el-table-column>
        </el-table-column>
        <el-table-column prop="입퇴원증명서" label="입퇴원증명서" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="통원증명서" label="통원증명서" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="납입증명서" label="납입증명서" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="장애인증명서" label="장애인증명서" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="입원영수증" label="입원진료비영수증" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="외래진료비" label="외래비진료비영수증" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="응급진료비" label="응급진료비영수증" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="계" label="계" sortable :formatter="getNumFormat" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { StatisticsStoreModule } from '@/store/modules/statistics/store'

@Component({
  name: 'Certification'
})
export default class extends Vue {
  // @Prop({ default: [] }) private tableData!: []
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

  private handleResize() {
    this.getHeight = this.$refs.tableWrapper.clientHeight
  }

  mounted(){
		this.$nextTick(function () {
      this.handleResize()
			window.addEventListener("resize", this.handleResize);
		});
  }
  
  objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    if (columnIndex === 0) {
      if (rowIndex % 2 === 0) {
        return {
          rowspan: 2,
          colspan: 1
        };
      } else {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    }
  }
}
</script>
