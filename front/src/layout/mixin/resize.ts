import { Component, Vue, Watch } from 'vue-property-decorator'
import { AppStoreModule, DeviceType } from '@/store/modules/app/store'

const WIDTH = 680 // refer to Bootstrap's responsive design
// const WIDTH = 1023 // refer to Bootstrap's responsive design

@Component({
  name: 'ResizeMixin'
})
export default class extends Vue {
  get device() {
    return AppStoreModule.device
  }

  get sidebar() {
    return AppStoreModule.sidebar
  }

  @Watch('$route')
  private onRouteChange() {
    if (this.device === DeviceType.Mobile && this.sidebar.opened) {
      AppStoreModule.CloseSideBar(false)
    }
  }

  beforeMount() {
    window.addEventListener('resize', this.resizeHandler)
  }

  mounted() {
    const isMobile = this.isMobile()
    if (isMobile) {
      AppStoreModule.ToggleDevice(DeviceType.Mobile)
      AppStoreModule.CloseSideBar(true)
    }
    this.$nextTick(function() {
      window.addEventListener('resize', this.resizeHandler)
    })
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler)
  }

  private isMobile() {
    const rect = document.body.getBoundingClientRect()
    console.log('rect = ', document.body.getBoundingClientRect().width, rect.width - 1 < WIDTH)
    return rect.width - 1 < WIDTH
  }

  private resizeHandler() {
    if (!document.hidden) {
      const isMobile = this.isMobile()
      console.log('Mobile : ', isMobile, DeviceType.Mobile, DeviceType.Desktop)
      console.log(isMobile ? DeviceType.Mobile : DeviceType.Desktop)
      AppStoreModule.ToggleDevice(isMobile ? DeviceType.Mobile : DeviceType.Desktop)
      if (isMobile) {
        AppStoreModule.CloseSideBar(true)
      }
    }
  }
}
