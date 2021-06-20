<template>
  <div class="sidebar-logo-container">
    <div class="sidebar-logo-link">
      <div class="sidebar-logo">
        <img src="@/assets/images/icon-logo-4c-gray.png" />
      </div>
    </div>
    <div class="sidebar-logo-user">
      <div class="sidebar-image">
        <img src="@/assets/images/icon-admin-user.png" />
      </div>
      <div class="sidebar-title">
        <div class="text1">{{ getterSetter }}</div>
        <div class="text2">{{ userId }}</div>
      </div>
      <el-button class="button-1" type="text" @click.native="logout()"><img src="@/assets/images/icon-out.png"/></el-button>
    </div>
    <div class="sidebar-logo-menu">
      <div class="sidebar-menu" v-for="item in menuList" :key="item.title" @click="handleFunctionCall(item.menu, '')">
        <span :class="item.menu"> {{ item.title }} </span>
        <ul v-if="item.child">
          <li v-for="chlidItem in item.child" :key="chlidItem.title" @click="handleFunctionCall(item.menu, chlidItem.menu)">
            {{ chlidItem.title }}
          </li>
        </ul>
      </div>
    </div>
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

  created(){
    switch(localStorage.getItem('4c-userAuth')){
      case 'S': this.userAuth = 'Super Admin(4cgate)'
      break;
      case 'A': this.userAuth = '병원 총괄 관리자'
      break;
      case 'P': this.userAuth = '기관 / 부서 관리자'
      break;
      default: this.userAuth = '기관 / 부서 관리자'
      break;
    }
  }
  get getterSetter() {
    return this.userAuth;
  }
  set getterSetter(value) {
    this.userAuth = value;
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

  get menuList() {
    return SettingsModule.menuList
  }
  private handleFunctionCall(funcName, funcParam) {
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
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: #3d424e;
  & .sidebar-logo-user {
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    & .sidebar-image {
      margin-left: 20px;
    }
    & .sidebar-title {
      width: 182px;
      height: 60px;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
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
      margin-right: 20px;
    }
  }

  & .sidebar-logo-menu {
    width: 100%;
    height: calc(100vh - 250px);
    overflow: scroll;
    & .sidebar-menu {
      display: inline-block;
      width: 100%;
      padding-left: 20px;
      padding-top: 20px;
      padding-bottom: 20px;
      color: #fff;
      font-size: 18px;
      font-weight: 700;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      cursor: default;
      .dashboard {
        cursor: pointer;
      }
      ul {
        margin-bottom: 0;
        li {
          font-weight: 500;
          padding: 10px 0;
          cursor: pointer;
        }
      }
    }
  }

  & .sidebar-logo-link {
    width: 100%;
    height: 100px;
    background-color: #323640;
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
