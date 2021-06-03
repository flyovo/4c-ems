<template>
  <div v-show="visible" class="date-picker">
    <!-- <el-date-picker v-model="searchStartDate" type="date" placeholder="날짜 선택" /> -->
    <el-date-picker v-model="searchDate" type="daterange" align="right" unlink-panels range-separator="To" start-placeholder="Start date" end-placeholder="End date" :picker-options="pickerOptions">
    </el-date-picker>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { MessageService } from '@/utils/message-service'

@Component({
  name: 'DatePicker'
})
export default class extends Vue {
  private searchDate: any = ''
  private pickerOptions = {
    shortcuts: [
      {
        text: '지난 일주일',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '지난달',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '지난 세달',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          picker.$emit('pick', [start, end])
        }
      }
    ]
  }
}
</script>

<style lang="scss" scoped>
.date-picker {
}
</style>
