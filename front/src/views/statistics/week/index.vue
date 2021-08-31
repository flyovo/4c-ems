<template>
  <div typeList class="statistics-table__body__table">
    <el-table :data="tableData" header-align="center">
      <el-table-column label="구분" align="center">
        <el-table-column prop="기관" label="센터명" sortable align="center"></el-table-column>
        <el-table-column prop="층" label="층" sortable align="center"></el-table-column>
        <el-table-column prop="구역" label="창구명" sortable align="center"></el-table-column>
        <el-table-column prop="용도" label="용도" sortable align="center"></el-table-column>
        <el-table-column prop="대수" label="대수" sortable align="center"></el-table-column>
      </el-table-column>
      <!-- <el-table-column :label="`월(일수:${dayOfWeek[1]})`" align="center"> -->
      <el-table-column :label="`월`" align="center">
        <el-table-column prop="월건수" label="건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="월금액" label="금액" sortable :formatter="getNumFormat" align="center"></el-table-column>
      </el-table-column>
      <!-- <el-table-column :label="`화(일수:${dayOfWeek[2]})`" align="center"> -->
      <el-table-column :label="`화`" align="center">
        <el-table-column prop="화건수" label="건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="화금액" label="금액" sortable :formatter="getNumFormat" align="center"></el-table-column>
      </el-table-column>
      <!-- <el-table-column :label="`수(일수:${dayOfWeek[3]})`" align="center"> -->
      <el-table-column :label="`수`" align="center">
        <el-table-column prop="수건수" label="건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="수금액" label="금액" sortable :formatter="getNumFormat" align="center"></el-table-column>
      </el-table-column>
      <!-- <el-table-column :label="`목(일수:${dayOfWeek[4]})`" align="center"> -->
      <el-table-column :label="`목`" align="center">
        <el-table-column prop="목건수" label="건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="목금액" label="금액" sortable :formatter="getNumFormat" align="center"></el-table-column>
      </el-table-column>
      <!-- <el-table-column :label="`금(일수:${dayOfWeek[5]})`" align="center"> -->
      <el-table-column :label="`금`" align="center">
        <el-table-column prop="금건수" label="건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="금금액" label="금액" sortable :formatter="getNumFormat" align="center"></el-table-column>
      </el-table-column>
      <!-- <el-table-column :label="`토(일수:${dayOfWeek[6]})`" align="center"> -->
      <el-table-column :label="`토`" align="center">
        <el-table-column prop="토건수" label="건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="토금액" label="금액" sortable :formatter="getNumFormat" align="center"></el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { StatisticsStoreModule } from '@/store/modules/statistics/store'

@Component({
  name: 'Week'
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
