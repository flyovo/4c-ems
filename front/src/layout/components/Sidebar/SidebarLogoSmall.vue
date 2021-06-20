<template>
  <div class="sidebar-small-logo-container">
    <div class="sidebar-logo-link">
      LOGO
      <!-- <img src="@/assets/images/icon-logo.png" /> -->
    </div>
    <div class="sidebar-logo-user">
      <img src="@/assets/images/icon-admin-user.png" alt="" />
    </div>
    <div class="sidebar-logo-logout">
      <el-button class="button-1" type="text" @click.native="logout()"><img src="@/assets/images/icon-out.png"/></el-button>
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
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-small-logo-container {
  position: relative;
  width: 100%;
  background: #3d424e;
  & [class*='sidebar-logo'] {
    width: 100%;
    text-align: center;
    margin-bottom: 20px;
  }
  & .sidebar-logo-link {
    display: flex;
    height: 80px;
    justify-content: center;
    flex-direction: column;
    background-color: #323640;
    font-size: 15px;
    color: #ffffff;
  }
  & .sidebar-logo-user {
    img {
      width: 40px;
      height: 40px;
    }
  }
  & .sidebar-logo-logout {
    .button-1 {
      width: 40px;
      height: 40px;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
