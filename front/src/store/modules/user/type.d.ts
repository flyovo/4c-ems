import { PageQuery } from '@/utils/comn-code/type'

export interface UserStoreState {
  userState: UserState
  roles: string[]
  routerList: RouteConfig[]
  userList: any[]
  userSearchItem: UserSearchItem
  userListCount: number
  dashboardUserItem: DashboardUserItem
}
export interface UserState {
  organ: string
  pos_4: string
}
export interface UserSearchItem {
  userName: string
  joinPath: string
  birthday: string
  gender: string
  pageNum: number
  rowNum: number
}

export interface DashboardUserItem {
  totalUserCnt: number
  nowJoinCnt: number
  visitUserCnt: number
}
