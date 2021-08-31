<template>
  <div class="statistics-wrapper">
    <div class="statistics-wrapper__header">
      <control-header-table
        :dateRange="dateRange"
        :dateList="dateList"
        :typeLabel="typeLabel"
        :typeList="typeList"
        :selectDate="date"
        :menuType="routeData"
        @selectCenter="fetchCenter"
        @selectDate="fetchDate"
      />
      <!-- :selectType="type" -->
    </div>
    <data-table :dateRange="dateRange" :dateList="dateList" :typeList="typeList" :selectDate="date" :selectType="type" :menuType="routeData" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { StatisticsStoreModule } from '@/store/modules/statistics/store'
import ControlHeaderTable from '@/components/ControlHeader/statistics.vue'
import DataTable from './DataTable.vue'

@Component({
  name: 'statistics',
  components: {
    DataTable,
    ControlHeaderTable
  }
})
export default class extends Vue {
  public routeData: String
  private date: number = 0
  private type: number = 0

  created() {
    this.routeData = this.$route.path.split('/')[2].replace(`${this.$route.path.split('/')[1]}-`, '')
    console.log(this.routeData)

    StatisticsStoreModule.SetInitDataList()
  }

  private async selectDate(value: number) {
    this.date = await value
  }

  get fetchDate() {
    return (value: number) => {
      this.date = value
      const payload = {
        date: value
      }
      return StatisticsStoreModule.GetDateRange(payload)
    }
  }

  get fetchType() {
    return (value: number) => {
      this.type = value
      const payload = {
        type: value
      }
      return StatisticsStoreModule.GetType(payload)
    }
  }

  get fetchCenter() {
    return (value: number) => {
      this.type = value
      return StatisticsStoreModule.typeList.filter(list => {
        if (list.id === this.routeData) {
          console.log('>>> ', list.id, this.routeData)
        }
        return list.id === this.routeData
      })[0].list[value]
    }
  }

  get dateList() {
    return StatisticsStoreModule.dateList
  }
  get typeLabel() {
    return StatisticsStoreModule.typeLabel.filter(list => {
      return list.id === this.routeData
    })[0].label
  }
  get typeList() {
    return StatisticsStoreModule.typeList.filter(list => {
      return list.id === this.routeData
    })[0].list
  }
  get dateRange() {
    return StatisticsStoreModule.dateRange
  }
}
</script>

<style lang="scss" scoped>
.statistics-wrapper {
  height: 100%;
  &__header {
    display: flex;
    // height: 90px;
    // margin-bottom: 20px;
    // height: setViewport('vh', 90);
    margin-bottom: setViewport('vh', 20);
  }
}
</style>
