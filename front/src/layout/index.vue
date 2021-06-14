<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="classObj.mobile && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <!-- <div v-if="sidebar.opened" class="drawer-bg" @click="handleClickOutside" /> -->
    <div class="container">
      <sidebar class="sidebar-container" />
      <div :class="{ hasTagsView: showTagsView }" class="main-container">
        <navbar />
        <div :class="{ 'fixed-header': fixedHeader }">
          <tags-view v-if="showTagsView" />
        </div>
        <app-main />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { DeviceType, AppStoreModule } from '@/store/modules/app/store'
import { SettingsModule } from '@/store/modules/settings/store'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/resize'

@Component({
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Settings,
    Sidebar,
    TagsView
  }
})
export default class extends mixins(ResizeMixin) {
  get classObj() {
    return {
      hideSidebar: !this.sidebar.opened,
      openSidebar: this.sidebar.opened,
      withoutAnimation: this.sidebar.withoutAnimation,
      mobile: this.device === DeviceType.Mobile
    }
  }

  get showSettings() {
    return SettingsModule.showSettings
  }

  get showTagsView() {
    return SettingsModule.showTagsView
  }

  get fixedHeader() {
    return SettingsModule.fixedHeader
  }

  private handleClickOutside() {
    AppStoreModule.CloseSideBar(false)
  }
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  min-width: 375px;
  display: flex;
  flex-direction: column;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.container {
  display: flex;
}
.main-container {
  min-height: 100%;
  background-color: #f4f3ef;
  position: relative;
  width: calc(100% - #{$sideBarWidth});
}

.sidebar-container {
  // transition: width 0.28s;
  // transition-duration: 0.3s;
  width: $sideBarWidth;
  height: 100%;
  background-color: #3b404d;
  overflow: hidden;
}

// .fixed-header {
//   position: fixed;
//   top: 0;
//   right: 0;
//   z-index: 9;
//   width: calc(100% - #{$sideBarWidth});
//   transition: width 0.28s;
// }

.hideSidebar {
  .sidebar-container {
    width: 0px;
  }
  .main-container {
    width: 100%;
  }

  // .fixed-header {
  //   width: 100%;
  // }
}

/* for mobile response */
.mobile {
  &.openSidebar {
    position: fixed;
    // top: 0;
    .container {
      // display: block;
      .sidebar-container {
        // transition: transform 0.28s;
        // width: 100%;
      }
      .main-container {
        .app-main,
        .navbar {
          width: 100vw;
        }
      }
    }
  }

  &.hideSidebar {
    .sidebar-container {
      position: absolute;
      pointer-events: none;
      // transition-duration: 0.3s;
      // transform: translate3d(-$sideBarWidth, 0, 0);
    }
  }

  // .fixed-header {
  //   width: 100%;
  // }

  .drawer-bg {
    display: none;
  }
}
</style>
