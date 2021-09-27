<template>
  <div class="navbar" :class="[{ 'is-active': sidebar.opened }]" @click="toggleSideBar">
    <!-- <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" /> -->
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
    <!-- <div class="right-menu">
      <count-down class="right-menu-item hover-effect" />
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppStoreModule } from '@/store/modules/app/store'
import { UserStoreModule } from '@/store/modules/user/store'
import CountDown from './CountDown.vue'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import Hamburger from '@/components/Hamburger/index.vue'
import { Loading } from 'element-ui'
@Component({
  name: 'Navbar',
  components: {
    Breadcrumb,
    Hamburger,
    CountDown
  }
})
export default class extends Vue {
  get sidebar() {
    return AppStoreModule.sidebar
  }

  get device() {
    return AppStoreModule.device.toString()
  }

  private toggleSideBar() {
    AppStoreModule.ToggleSideBar(this.sidebar.opened)
  }

  private async logout() {
    await UserStoreModule.Logout()
    this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    let loading: any
    loading = Loading.service({
      fullscreen: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  position: absolute;
  // top: 41px;
  // left: -20px;
  // width: 40px;
  // height: 40px;
  // border-radius: 40px;
  // box-shadow: 0 4px 10px 0 rgba(68, 68, 68, 0.1);
  top: setViewport('vh', 41);
  left: setViewport('vw', -20);
  width: setViewport('vw', 40);
  height: setViewport('vw', 40);
  border-radius: setViewport('vw', 40);
  box-shadow: 0 setViewport('vw', 4) setViewport('vh', 10) 0 rgba(68, 68, 68, 0.1);
  background-color: #fff;
  background-size: contain;
  background-image: url('~@/assets/images/ic-chevron-right.svg');
  z-index: 1;

  &.is-active {
    transform: rotate(180deg);
  }
  // padding-left: 15px;
  // width: 100%;
  // height: 50px;
  // position: relative;
  // background: #fff;
  // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    // line-height: 46px;
    line-height: setViewport('vh', 46);
    height: 100%;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    // &:hover {
    //   background: rgba(0, 0, 0, 0.025);
    // }
  }
  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    // padding-right: 40px;
    // line-height: 50px;
    padding-right: setViewport('vw', 40);
    line-height: setViewport('vh', 50);

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      height: 100%;
      // padding: 0 8px;
      // font-size: 18px;
      padding: 0 setViewport('vw', 8);
      font-size: setViewport('vw', 18);
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        // &:hover {
        //   background: rgba(0, 0, 0, 0.025);
        // }
      }
    }

    .avatar-container {
      // margin-right: 30px;
      margin-right: setViewport('vw', 30);

      .avatar-wrapper {
        // margin-top: 5px;
        margin-top: setViewport('vh', 5);
        position: relative;

        .user-avatar {
          cursor: pointer;
          // width: 40px;
          // height: 40px;
          // border-radius: 10px;
          width: setViewport('vw', 40);
          height: setViewport('vh', 40);
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          // right: -20px;
          // top: 25px;
          // font-size: 12px;
          right: setViewport('vw', -20);
          top: setViewport('vh', 25);
          font-size: setViewport('vw', 12);
        }
      }
    }
  }
}
</style>
