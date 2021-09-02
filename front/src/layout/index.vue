<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="classObj.mobile && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <!-- <div v-if="sidebar.opened" class="drawer-bg" @click="handleClickOutside" /> -->
    <div class="container">
      <sidebar class="sidebar-container" />
      <div :class="{ hasTagsView: showTagsView }" class="main-container" id="main-container">
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
  // min-width: 375px;
  min-width: setViewport('vw', 375);
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
  height: 100%;
}
.main-container {
  width: calc(100% - #{$sideBarWidth});
  min-height: 100%;
  background-color: #f4f3ef;
  position: relative;
}

.sidebar-container {
  transition: width 0.28s;
  transition-duration: 0.3s;
  width: $sideBarWidth;
  height: 100%;
  background-color: $subMenuBg;
}

.hideSidebar {
  .sidebar-container {
    width: 0px;
  }
  .main-container {
    width: 100%;
  }
  .navbar {
    left: setViewport('vw', 5);
  }
}

/* for mobile response */
.mobile {
  &.openSidebar {
    position: fixed;
    .container {
      .sidebar-container {
        transition: transform 0.28s;
        // width: 100%;
      }
      .main-container {
        .app-main {
          width: 100vw;
        }
      }
    }
  }

  &.hideSidebar {
    .sidebar-container {
      position: absolute;
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-$sideBarWidth, 0, 0);
    }
  }

  .drawer-bg {
    display: none;
  }
}
</style>
