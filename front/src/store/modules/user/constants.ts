import { UserState, UserSearchItem, DashboardUserItem } from './type'

export const DEFAULT_USER_SEARCH_ITEM: UserSearchItem = {
  userName: '',
  joinPath: 'ALL',
  birthday: '',
  gender: 'ALL',
  pageNum: 0,
  rowNum: 30
}

export const DEFAULT_DASH_USER_ITEM: DashboardUserItem = {
  totalUserCnt: 0,
  nowJoinCnt: 0,
  visitUserCnt: 0
}

export const DEFAULT_USER_STATE: UserState = {
  organ: 'default',
  pos_4: 'default'
}
