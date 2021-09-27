<template>
  <div v-show="visible" class="chart-to-csv" @click="makeCSV">
    <svg-icon name="part03-s-file-csv" class="chartCsvIcon" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import XLSX from 'xlsx'

@Component({
  name: 'ChartToCsv'
})
export default class extends Vue {
  @Prop({ required: true }) private chartItems!: any
  @Prop({ required: true }) private chartTitle!: string

  private items = []
  private visible = true
  private regexpSpecial = /[&/\\#,+()$~%'":*?<>{}|]/g
  private regexpBlank = /(\s)/g
  private async makeCSV() {
    const vm = this

    // A workbook is the name given to an Excel file
    const wb = XLSX.utils.book_new() // make Workbook of Excel

    // make data
    // initialize & Setting
    let worksheet = this.chartTitle.replace(this.regexpSpecial, '-')

    this.items = []

    // parsing table data
    if (this.chartItems.seriesData) {
      this.items = this.chartItems.seriesData
    } else if (this.chartItems.xAxisData) {
      for (let i = 0; i < this.chartItems.xAxisData.length; i++) {
        let item = {
          category: this.chartItems.xAxisData[i]
        }
        for (let j = 0; j < this.chartItems.legend.length; j++) {
          item[this.chartItems.legend[j]] = this.chartItems.series[j].data[i]
        }
        this.items.push(item)
      }
    } else {
      for (let i = 0; i < this.chartItems.yAxisData.length; i++) {
        let item = {
          category: this.chartItems.yAxisData[i]
        }
        for (let j = 0; j < this.chartItems.legend.length; j++) {
          item[this.chartItems.legend[j]] = this.chartItems.series[j].data[i]
        }
        this.items.push(item)
      }
    }

    // export json to Worksheet of Excel
    const reportWS = XLSX.utils.json_to_sheet(this.items)

    // add Worksheet to Workbook
    XLSX.utils.book_append_sheet(wb, reportWS, worksheet) // sheetAName is name of Worksheet

    // export Excel files
    // XLSX.writeFile(wb, `[${this.getDate}]${worksheet}.xlsx`)

    XLSX.writeFile(wb, `${worksheet.replace(this.regexpBlank, '_')}.xlsx`)
  }
}
</script>

<style lang="scss" scoped>
.chart-to-csv {
  position: absolute;
  top: 20px;
  right: 20px;
  display: inline-block;
  cursor: pointer;
  z-index: 1;
  :hover {
    background: #d5dbe7;
  }
}

.chart-to-csv .chartCsvIcon {
  fill: #949494;
  background: none;
}
</style>
