<template>
  <div class="sidebar-logo-container">
    <div class="sidebar-logo-link">
      <div class="sidebar-logo">
        <img src="@/assets/images/icon-logo-4c-logo.svg" />
      </div>
    </div>
    <div class="sidebar-logo-user">
      <div class="sidebar-image">
        <img src="@/assets/images/ic-users.svg" />
      </div>
      <div class="sidebar-title">
        <div class="text1">{{ getterSetter }}</div>
        <div class="text2">{{ userId }}</div>
      </div>
      <el-button type="text" @click.native="logout()"><img src="@/assets/images/ic-export.svg"/></el-button>
    </div>
    <div class="sidebar-logo-menu">
      <el-tree :data="menuListTree" :props="defaultProps" @node-click="handleNodeClick" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { UserStoreModule } from '@/store/modules/user/store'
import { SettingsModule } from '@/store/modules/settings/store'
import { Loading } from 'element-ui'
@Component({
  name: 'SidebarLogo'
})
export default class extends Vue {
  @Prop({ required: true }) private collapse!: boolean
  public userId = localStorage.getItem('4c-userId')
  public userAuth = ''
  public menuActive = 'dashboard'
  public defaultProps = {
    children: 'children',
    label: 'label',
  }
  public menuUrl = []
  public menuText = []

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
    // this.handleNodeClick
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


  get menuListTree() {
    console.log('get menuListTree')
    return SettingsModule.menuListTree
  }
  get menuList() {
    return SettingsModule.menuList
  }
  private handleFunctionCall(funcName, funcParam) {
    this.menuActive = funcName;
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

  private async handleNodeClick(data, checked, indeterminate) {
    this.menuUrl = [];
    this.menuText = [];

    this.parseJson(checked);
    let url = this.menuUrl.reverse();
    let text = this.menuText.reverse().slice(1);
    
    if(text.length > 0){
      text.push(`<span>${text.pop()}</span>`);
      await SettingsModule.SetMenuText(text)
    }
    
    this.$router.push(`/${url.join('/')}`)
  }

  private parseJson(node) {
    if(node.data.id){
      this.menuUrl.push(node.data.id);
      this.menuText.push(node.data.label);
    }
    if(node.parent){
      this.parseJson(node.parent);
    }
  }
}
</script>


<style lang="scss">
.sidebar-logo-container {
  .el-tree {
    &>.el-tree-node:first-child {
      .el-tree-node__expand-icon {
        background-image: url('~@/assets/images/ic-home.svg');
      }
    }
    // background-color: #fafafa; 
    .is-current {
      &>.el-tree-node__content {
        color: $menuActiveText;
        border-left: 4px solid $menuActiveText;
        background-color: $menuActiveBg;
        &+.el-tree-node__children {
          .el-tree-node__expand-icon {
            margin-left: 16px;
            margin-left: setViewport('vw', 16);
          }          
        }
      }
      .el-tree-node__expand-icon {
        // margin-left: 12px;
        margin-left: setViewport('vw', 12);
      }
    }
    .el-tree-node__expand-icon {
      // width: 24px;
      // height: 24px;
      // margin-right: 4px;
      // margin-left: 16px;
      width: setViewport('vw', 24);
      height: setViewport('vw', 24);
      margin-right: setViewport('vw', 4);
      margin-left: setViewport('vw', 16);
      background-size: contain;
      background-image: url('~@/assets/images/ic-plus.svg');
      &.expanded {
        background-image: url('~@/assets/images/ic-minus.svg');
        transform: unset;
      }
      &.el-icon-caret-right:before {
        content: ''
      }
    }
    .el-tree-node {
      // min-height: 40px;
      min-height: setViewport('vh', 40);
      color: $subMenuText;
      // font-size: 16px;
      font-size: setViewport('vw', 16);
      font-weight: bold;
      & > div {
        // min-height: 40px;
        min-height: setViewport('vh', 40);
      }
    }
  }
}
</style>
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
  width: $sideBarWidth;
  height: 100%;
  
  & .sidebar-logo-user {
    width: 100%;
    height: 60px;
    height: setViewport('vh', 60);
    display: flex;
    background-color: $subMenuUserBg;
    justify-content: space-between;
    align-items: center;

    & .sidebar-image {
      // margin: 0 4px 0 16px;
      margin: 0 setViewport('vh', 4) 0 setViewport('vh', 16);
    }
    & .sidebar-title {
      width: 100%;
      // height: 60px;
      height: setViewport('vh', 60);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 5px;
      .text1 {
        color: #fff;
        // font-size: 15px;
        font-size: setViewport('vw', 15);
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
        // font-size: 15px;
        font-size: setViewport('vw', 15);
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
    button {
      // margin-right: 18px;
      margin-right: setViewport('vw', 18);
    }
  }

  & .sidebar-logo-menu {
    width: 100%;
    // height: calc(100vh - 250px);
    height: calc(100vh - #{setViewport('vh', 250)});
    background-color: $subMenuBg;
    overflow: scroll;
  }

  & .sidebar-logo-link {
    width: 100%;
    // height: 122px;
    height: setViewport('vh', 122);
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
