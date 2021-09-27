import Vue from 'vue'
import Vuex from 'vuex'
import { AppState } from './modules/app/type'
import { TagsViewState } from './modules/tag-view/type'
import { PermissionState } from './modules/permission/type'
import { SettingsState } from './modules/settings/type'
import { UserStoreState } from './modules/user/type'
import { DashboardStoreState } from './modules/dashboard/type'
import { RawDataStoreState } from './modules/rawdata/type'
import { StatisticsStoreState } from './modules/statistics/type'

Vue.use(Vuex)

export interface IRootState {
  app: AppState
  tagsView: TagsViewState
  permission: PermissionState
  settings: SettingsState
  userStore: UserStoreState
  dashboardStore: DashboardStoreState
  rawDataStore: RawDataStoreState
  statisticsStore: StatisticsStoreState
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({})
