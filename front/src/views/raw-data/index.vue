<template>
  <div class="raw-data-wrapper">
    <div class="raw-data-wrapper__header">
      <control-header-table
        :dateRange="dateRange"
        :dateList="dateList"
        :typeLabel="typeLabel"
        :typeList="typeList"
        :selectDate="date"
        :selectType="type"
        :menuType="routeData"
        @selectCenter="fetchCenter"
        @selectDate="fetchDate"
        @selectType="fetchType"
      />
    </div>
    <data-table :dateRange="dateRange" :dateList="dateList" :typeList="typeList" :selectDate="date" :selectType="type" :menuType="routeData" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { RawDataStoreModule } from '@/store/modules/rawdata/store'
import ControlHeaderTable from '@/components/ControlHeader/rawData.vue'
import DataTable from './DataTable.vue'

@Component({
  name: 'rawData',
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
    
    RawDataStoreModule.SetInitDataList()
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
      return RawDataStoreModule.GetDateRange(payload)
    }
  }

  get fetchType() {
    return (value: number) => {
      this.type = value
      const payload = {
        type: value
      }
      return RawDataStoreModule.GetType(payload)
    }
  }

  get fetchCenter() {
    return (value: number) => {
      this.type = value
      return RawDataStoreModule.typeList.filter(list => {
        if (list.id === this.routeData) {
          console.log('>>> ', list.id, this.routeData)
        }
        return list.id === this.routeData
      })[0].list[value]
    }
  }

  get dateList() {
    return RawDataStoreModule.dateList
  }
  get typeLabel() {
    return RawDataStoreModule.typeLabel.filter(list => {
      return list.id === this.routeData
    })[0].label
  }
  get typeList() {
    return RawDataStoreModule.typeList.filter(list => {
      return list.id === this.routeData
    })[0].list
  }
  get dateRange() {
    return RawDataStoreModule.dateRange
  }
}
</script>

<style lang="scss" scoped>
.raw-data-wrapper {
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
