import store from '@/store'
import { login, checkLogin, logout, getUserList, getDashboardUser } from '@/api/user-api'
import { DEFAULT_USER_STATE, DEFAULT_USER_SEARCH_ITEM, DEFAULT_DASH_USER_ITEM } from './constants'
import { UserStoreState } from './type'
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { cloneDeep } from 'lodash'
@Module({ dynamic: true, store, name: 'userStore', namespaced: true })
class UserStore extends VuexModule implements UserStoreState {
  public roles = []
  public routerList = []
  public userList = []
  public userListCount = 0
  public userState = cloneDeep(DEFAULT_USER_STATE)
  public userSearchItem = cloneDeep(DEFAULT_USER_SEARCH_ITEM)
  public dashboardUserItem = cloneDeep(DEFAULT_DASH_USER_ITEM)
  @Mutation
  private SET_CHANGE_VALUE(payload: { key: string; value: any }) {
    const { key, value } = payload
    if (Object.prototype.hasOwnProperty.call(this, key)) {
      ;(this as any)[key] = value
    }
  }
  @Mutation
  private SET_USER_LIST_SCROLL(userList: any) {
    userList.forEach((item: any) => {
      this.userList.push(item)
    })
  }

  @Action({ rawError: true })
  public async Login(userInfo: { userId: string; userPwd: string }) {
    let { userId, userPwd } = userInfo
    userId = userId.trim()
    const { data, resultCd } = await login({ userId, userPwd })    
    // this.userState.organ = data.organ
    // this.userState.pos_4 = data.pos_4
    // this.SET_CHANGE_VALUE({ key: 'userState', value: {organ: data.organ, pos_4: data.pos_4} })
    // console.log('Usesr Store userState ::::::::::::', this.userState)
    if (resultCd === 200) {
      return new Promise(resolve => {
        resolve(200)
      })
    }
  }

  // @Action({ rawError: true })
  // public async CheckLogin(payload: any) {
  //   const { resultCd } = await checkLogin(payload)
  //   if (resultCd === 200) {
  //     const readyRouterList = []
  //     this.SET_CHANGE_VALUE({ key: 'routerList', value: Object.freeze(readyRouterList) })
  //     this.SET_CHANGE_VALUE({ key: 'roles', value: ['admin'] })
  //   }
  // }

  @Action({ rawError: true })
  public async Logout() {
    // await logout({ title: '로그아웃' })
    localStorage.removeItem('token')
  }

  @Action({ rawError: true })
  public ChangeValue(payload: { key: string; value: any }) {
    this.SET_CHANGE_VALUE(payload)
  }
}

export const UserStoreModule = getModule(UserStore)
