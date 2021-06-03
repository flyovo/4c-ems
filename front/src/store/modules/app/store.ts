import store from '@/store'

// import { getSidebarStatus, getSize, setSidebarStatus, setLanguage, setSize } from '@/utils/cookies'
import { getSize, setLanguage, setSize } from '@/utils/cookies'
import { getLocale } from '@/lang'

import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'

export enum DeviceType {
  Desktop,
  Mobile
}

export interface IAppState {
  device: DeviceType
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
  language: string
  size: string
}

@Module({ dynamic: true, store, name: 'app', namespaced: true })
class App extends VuexModule implements IAppState {
  public sidebar = {
    opened: true, // getSidebarStatus() !== 'closed',
    withoutAnimation: false
  }
  public device = DeviceType.Desktop
  public language = getLocale()
  public size = getSize() || 'medium'

  @Mutation
  private TOGGLE_SIDEBAR(withoutAnimation: boolean) {
    console.log('Mutation TOGGLE_SIDEBAR : ', !this.sidebar.opened, withoutAnimation)
    this.sidebar.opened = !this.sidebar.opened
    this.sidebar.withoutAnimation = withoutAnimation
    // if (this.sidebar.opened) {
    //   setSidebarStatus('opened')
    // } else {
    //   setSidebarStatus('closed')
    // }
  }

  @Mutation
  private CLOSE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = false
    this.sidebar.withoutAnimation = withoutAnimation
    // setSidebarStatus('closed')
  }

  @Mutation
  private TOGGLE_DEVICE(device: DeviceType) {
    this.device = device
  }

  @Mutation
  private SET_LANGUAGE(language: string) {
    this.language = language
    setLanguage(this.language)
  }

  @Mutation
  private SET_SIZE(size: string) {
    this.size = size
    setSize(this.size)
  }

  @Action({ rawError: true })
  public ToggleSideBar(withoutAnimation: boolean) {
    console.log('ToggleSideBar : ', withoutAnimation)
    this.TOGGLE_SIDEBAR(withoutAnimation)
  }

  @Action({ rawError: true })
  public CloseSideBar(withoutAnimation: boolean) {
    this.CLOSE_SIDEBAR(withoutAnimation)
  }

  @Action({ rawError: true })
  public ToggleDevice(device: DeviceType) {
    this.TOGGLE_DEVICE(device)
  }

  @Action({ rawError: true })
  public SetLanguage(language: string) {
    this.SET_LANGUAGE(language)
  }

  @Action({ rawError: true })
  public SetSize(size: string) {
    this.SET_SIZE(size)
  }
}

export const AppStoreModule = getModule(App)
