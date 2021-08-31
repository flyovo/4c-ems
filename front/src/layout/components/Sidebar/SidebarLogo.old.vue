<template>
  <div class="sidebar-logo-container">
    <div class="navbar" :class="[{ 'is-active': isCollapse }]" @click="isCollapse = !isCollapse"></div>
    <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
      <el-menu-item index="1">
        <div class="sidebar-logo-link">
          <div class="sidebar-logo">
            <!-- <img src="@/assets/images/icon-logo-4c-gray.png" /> -->
            <img src="@/assets/images/icon-logo-4c-logo.svg" />
          </div>
        </div>
      </el-menu-item>
      <el-menu-item index="2">
        <div class="sidebar-logo-user">
          <div class="sidebar-image">
            <img src="@/assets/images/ic-users.svg" />
          </div>
          <div class="sidebar-title">
            <div class="text1">{{ getterSetter }}</div>
            <div class="text2">{{ userId }}</div>
          </div>
          <el-button class="button-1" type="text" @click.native="logout()"><img src="@/assets/images/ic-export.svg"/></el-button>
        </div>
      </el-menu-item>
      <!-- <el-submenu index="3"> -->
      <div class="sidebar-logo-menu">
        <el-tree :data="menuListTree" :props="defaultProps" @node-click="handleNodeClick" />
      </div>
      <!-- <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">Navigator One</span>
        </template>
        <el-menu-item-group>
          <span slot="title">Group One</span>
          <el-menu-item index="1-1">item one</el-menu-item>
          <el-menu-item index="1-2">item two</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="Group Two">
          <el-menu-item index="1-3">item three</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="1-4">
          <span slot="title">item four</span>
          <el-menu-item index="1-4-1">item one</el-menu-item>
        </el-submenu> -->
      <!-- </el-submenu> -->
    </el-menu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { UserStoreModule } from '@/store/modules/user/store'
import { SettingsModule } from '@/store/modules/settings/store'
import { Loading } from 'element-ui'
import router from '@/router'
@Component({
  name: 'SidebarLogo'
})
export default class extends Vue {
  @Prop({ required: true }) private collapse!: boolean
  public userId = localStorage.getItem('4c-userId')
  public userAuth = ''
  // public menuActive = location.pathname.split("/")[2]
  public menuActive = 'dashboard'
  public defaultProps = {
    children: 'children',
    label: 'label'
  }
  public isCollapse = false

  created() {
    switch (localStorage.getItem('4c-userAuth')) {
      case 'S':
        this.userAuth = 'Super Admin(4cgate)'
        break
      case 'A':
        this.userAuth = '병원 총괄 관리자'
        break
      case 'P':
        this.userAuth = '기관 / 부서 관리자'
        break
      default:
        this.userAuth = '기관 / 부서 관리자'
        break
    }
  }
  get getterSetter() {
    return this.userAuth
  }
  set getterSetter(value) {
    this.userAuth = value
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

  get menuListTree() {
    return SettingsModule.menuListTree
  }
  get menuList() {
    return SettingsModule.menuList
  }
  private handleFunctionCall(funcName, funcParam) {
    this.menuActive = funcName
    if (funcName !== 'dashboard' && funcParam === '') return
    if (funcName === 'dashboard') {
      funcParam = 'dashboard'
    }
    let path = `/${funcName}/${funcParam}`
    if (this.$route.path === path) {
      return
    }
    this.$router.push(path)
  }
  private toCamelCase(string) {
    return string.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
  }
  private handleNodeClick(data) {
    console.log(data)
  }
  private handleOpen(key, keyPath) {
    console.log(key, keyPath)
  }
  private handleClose(key, keyPath) {
    console.log(key, keyPath)
  }
}
</script>

<style lang="scss">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 260px;
  min-height: 400px;
}
.sidebar-logo-container {
  .el-menu {
    height: 100%;
    .el-menu-item {
      height: auto;
      padding: 0 !important;
    }
  }
  .el-tree {
    & > .el-tree-node:first-child {
      .el-tree-node__expand-icon {
        background-image: url('~@/assets/images/ic-home.svg');
      }
    }
    // background-color: #fafafa;
    .is-current {
      & > .el-tree-node__content {
        color: $menuActiveText;
        border-left: 4px solid $menuActiveText;
        background-color: $menuActiveBg;
      }
      .el-tree-node__expand-icon {
        margin-left: 12px;
      }
    }
    .el-tree-node__expand-icon {
      width: 24px;
      height: 24px;
      margin-right: 4px;
      margin-left: 16px;
      background-size: contain;
      background-image: url('~@/assets/images/ic-plus.svg');
      &.expanded {
        background-image: url('~@/assets/images/ic-minus.svg');
        transform: unset;
      }
      &.el-icon-caret-right:before {
        content: '';
      }
    }
    .el-tree-node {
      min-height: 40px;
      color: $subMenuText;
      font-size: 16px;
      font-weight: bold;
      & > div {
        min-height: 40px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.navbar {
  position: absolute;
  top: 41px;
  left: 10px;
  width: 40px;
  height: 40px;
  border-radius: 40px;
  box-shadow: 0 4px 10px 0 rgba(68, 68, 68, 0.1);
  background-color: #fff;
  background-size: contain;
  background-image: url('~@/assets/images/ic-chevron-right.svg');
  z-index: 1;

  &.is-active {
    transform: rotate(180deg);
  }
}

// .sidebarLogoFade-enter-active {
//   transition: opacity 1.5s;
// }

// .sidebarLogoFade-enter,
// .sidebarLogoFade-leave-to {
//   opacity: 0;
// }

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 100%;
  & .sidebar-logo-user {
    width: 100%;
    height: 60px;
    display: flex;
    background-color: $subMenuUserBg;
    justify-content: space-between;
    align-items: center;

    & .sidebar-image {
      margin: 0 4px 0 16px;
    }
    & .sidebar-title {
      width: 100%;
      height: 60px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 5px;
      .text1 {
        color: #fff;
        font-size: 15px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        display: flex;
        height: 50%;
        align-items: center;
      }
      .text2 {
        color: #fff;
        font-size: 15px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        display: flex;
        height: 50%;
        align-items: center;
      }
    }
    .button-1 {
      margin-right: 18px;
    }
  }

  // & .sidebar-logo-menu {
  //   width: 100%;
  //   height: calc(100vh - 250px);
  //   background-color: $subMenuBg;
  //   overflow: scroll;
  // }

  & .sidebar-logo-link {
    width: 100%;
    height: 122px;
    background-color: $subMenuBg;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & .sidebar-logo {
      width: 50%;
      img {
        width: 100%;
      }
    }
  }
}
</style>
