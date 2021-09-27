<template>
  <div typeList class="statistics-table__body__table" ref="tableWrapper">
    <el-table :data="tableData" header-align="center" :max-height="getHeight">
      <el-table-column label="구분" align="center">
        <el-table-column prop="기관" label="기관" sortable align="center"></el-table-column>
        <el-table-column prop="층" label="층" sortable align="center"></el-table-column>
        <el-table-column prop="구역" label="구역" sortable align="center"></el-table-column>
        <el-table-column prop="대수" label="대수" sortable align="center"></el-table-column>
      </el-table-column>
      <el-table-column :label="`월(${dayOfWeek[1]})`" align="center">
        <el-table-column prop="월건수" label="건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="월금액" label="금액" sortable :formatter="getNumFormat" align="center"></el-table-column>
      </el-table-column>
      <el-table-column :label="`화(${dayOfWeek[2]})`" align="center">
        <el-table-column prop="화건수" label="건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="화금액" label="금액" sortable :formatter="getNumFormat" align="center"></el-table-column>
      </el-table-column>
      <el-table-column :label="`수(${dayOfWeek[3]})`" align="center">
        <el-table-column prop="수건수" label="건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="수금액" label="금액" sortable :formatter="getNumFormat" align="center"></el-table-column>
      </el-table-column>
      <el-table-column :label="`목(${dayOfWeek[4]})`" align="center">
        <el-table-column prop="목건수" label="건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="목금액" label="금액" sortable :formatter="getNumFormat" align="center"></el-table-column>
      </el-table-column>
      <el-table-column :label="`금(${dayOfWeek[5]})`" align="center">
        <el-table-column prop="금건수" label="건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="금금액" label="금액" sortable :formatter="getNumFormat" align="center"></el-table-column>
      </el-table-column>
      <el-table-column :label="`토(${dayOfWeek[6]})`" align="center">
        <el-table-column prop="토건수" label="건수" sortable :formatter="getNumFormat" align="center"></el-table-column>
        <el-table-column prop="토금액" label="금액" sortable :formatter="getNumFormat" align="center"></el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { StatisticsStoreModule } from '@/store/modules/statistics/store'
import dayjs from 'dayjs'

@Component({
  name: 'Week'
})
export default class extends Vue {
  // @Prop({ default: [] }) private tableData!: []
  private page: number = 1
  private selectDate: number = 0
  public type: string = 'receipt'
  public data: []
  public dayOfWeek: Array<number> = [0,0,0,0,0,0,0]
  public getHeight: number = 300

  created() {
    this.getDateRange()
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

  @Watch('dateRange', { immediate: true, deep: true })
  public onDayCount(val: any, oldVal: any) {
    this.countDayOfWeek()
  }

  private getNumFormat(row: any, column: any) {
    let value = row[column.property]
    if (value === undefined) {
      return ''
    }
    value = typeof value === 'string' ? value : value.toString()
    return value.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
  }

  private countDayOfWeek(){
    this.dayOfWeek = this.dayOfWeek.fill(0) // 일, 월, 화, 수, 목, 금, 토
    let from = this.dateRange.date.from;
    do {
      this.dayOfWeek[dayjs(from).day()] += 1;
      from = dayjs(from).add(1, 'day').format('YYYY-MM-DD')
    } while (from <= this.dateRange.date.to)
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
