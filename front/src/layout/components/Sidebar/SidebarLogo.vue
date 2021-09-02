<template>
  <div class="sidebar-logo-container">
    <div class="sidebar-logo-link">
      <div class="sidebar-logo">
        <img src="@/assets/images/icon-logo-4c-logo.svg" />
      </div>
    </div>
    <!-- <div class="sidebar-logo-user">
      <div class="sidebar-image">
        <img src="@/assets/images/ic-users.svg" />
      </div>
      <div class="sidebar-title">
        <div class="text1">{{ getterSetter }}</div>
        <div class="text2">{{ userId }}</div>
      </div>
      <el-button @click.native="logout()"><img src="@/assets/images/ic-export.svg"/></el-button>
    </div> -->
    <el-button class="sidebar-logo-user" @click.native="logout()">
      <img class="sidebar-image" src="@/assets/images/ic-users.svg" />
      <div class="sidebar-title">
        <div class="text1">{{ getterSetter }}</div>
        <div class="text2">{{ userId }}</div>
      </div>
      <img src="@/assets/images/ic-export.svg"/>
    </el-button>
    <div class="sidebar-logo-menu">
      <el-tree ref="tree" node-key="id" :highlight-current="true" :render-after-expand="false" :default-expand-all="true" :data="menuListTree" :props="defaultProps" @node-click="handleNodeClick" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import AsyncComputed from 'vue-async-computed-decorator'
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
  public initMenu = {}
  public menuActive = 'dashboard'
  public defaultProps = {
    children: 'children',
    id: 'id',
    label: 'label'
  }
  public menuUrl = []
  public menuText = []

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

    if (this.$route.path.split('/')[1] !== 'dashboard') {
      this.setCheckedNodes().then(result => {
        this.$refs.tree.setCurrentKey(result)
      })
    } else {
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey('dashboard')
      })
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

  // @AsyncComputed()
  // 기관 리스트
  // siteList() {
  //   return async(type, position) => {
  private async siteList(type, position) {
    // return async() => {
      console.log('siteList::::::::::', type)
    let list = await SettingsModule.GetSite({
      site: type,
      position: position,
      organ: JSON.parse(localStorage.getItem('4c-userState')).organ,
      pos_4: JSON.parse(localStorage.getItem('4c-userState')).pos_4,
      // ...JSON.parse(localStorage.getItem('4c-userState')),
      auth: localStorage.getItem('4c-userAuth')
    }).then((result: any) => {
      return result
    })
    return [...list]
    // }
  }

  private async append(data, newChild) {
    if (!data.children) {
      this.$set(data, 'children', [])
    }
    data.children = newChild
  }
  private setCheckedNodes() {
    // 화면 처음 진입했을 때 tree setting

    return new Promise(async(resolve, reject) => {
      await SettingsModule.SetMenuText([])

      let path = this.$route.path.split('/')
      path.shift()
      for (let [index, p] of path.entries()) {
        path[index] = decodeURIComponent(p)
      }

      let text = []
      let position = path.slice()
      if (position[0] === 'dashboard') {
        return
      } else {
        position = position.slice(2)
      }
      console.log("path :::::", path)

      for (let [index, p] of path.entries()) {
        let type = ''
        if (index === 0) {
          this.initMenu = this.menuListTree.filter(tree => {
            return tree.id === p
          })[0]
        } else if (index === 1) {
          type = 'site'
          this.initMenu = this.initMenu.children.filter(tree => {
            return tree.id === p
          })[0]
        } else if (index === 2) {
          type = 'pos_1'
          this.initMenu = this.initMenu.children.filter(tree => {
            return tree.id === p
          })[0]
        } else if (index === 3) {
          type = 'pos_2'
          this.initMenu = this.initMenu.children.filter(tree => {
            return tree.id === p
          })[0]
        } else if (index === 4) {
          type = 'pos_3'
          this.initMenu = this.initMenu.children.filter(tree => {
            return tree.id === p
          })[0]
        }

        let pos = position.join(',')
        if (type !== '') {
          await this.siteList(type, pos).then(async res => {
            if (index < path.length) {
              if (res) {
                this.$set(this.initMenu, 'children', res)
              }
            }
          })
        }
        if (path.length > 2) {
          if (index === path.length - 1) {
            let strong = path.slice().pop()
            text.push(`<span>${strong}</span>`)
            await SettingsModule.SetMenuText(text)
          } else if (index > 1) {
            text.push(p)
          }
        }
      }
      console.log(position)
      console.log('SetMenuPosition::::::', position)
      await SettingsModule.SetMenuPosition(position)
      resolve(path[path.length - 1])
    })
  }
  private async handleNodeClick(data, checked, indeterminate) {
    // tree click event

    this.menuUrl = []
    this.menuText = []

    this.parseJson(checked)
    let url = this.menuUrl.reverse()
    let text = this.menuText.reverse().slice(2)

    let type = ''
    if (checked.level === 2) {
      type = 'site'
    } else if (checked.level === 3) {
      type = 'pos_1'
    } else if (checked.level === 4) {
      type = 'pos_2'
    } else if (checked.level === 5) {
      type = 'pos_3'
    }
    // if(type === ''){
    //   return;
    // }
    console.log('::::::::: ', type)

    let position = this.menuUrl.slice(1).join(',')
    if (url[0] !== 'dashboard') {
      position = this.menuUrl.slice(2).join(',')
      if (type !== '') {
        await this.siteList(type, position).then(async res => {
          if (!data.children && res.length > 0) {
            this.append(data, res)
          }
        })
      }

      if (text.length > 0) {
        text.push(`<span>${text.pop()}</span>`)
        await SettingsModule.SetMenuText(text)
      } else {
        await SettingsModule.SetMenuText([])
      }
      console.log('position:::', position)
      await SettingsModule.SetMenuPosition(position.split(','))
    }

    // if(url[0] === 'dashboard' || checked.level == 6){
    this.$router.push(`/${url.join('/')}`)
    // }
  }

  private parseJson(node) {
    if (node.data.id) {
      this.menuUrl.push(node.data.id)
      this.menuText.push(node.data.label)
    }
    if (node.parent) {
      this.parseJson(node.parent)
    }
  }
}
</script>

<style lang="scss">
.sidebar-logo-container {
  & .sidebar-logo-user {
    display: flex;
    width: 100%;
    // height: 60px;
    height: setViewport('vh', 60);
    padding: 0;
    background-color: $subMenuUserBg;
    justify-content: space-between;
    align-items: center;

    &>span {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .el-tree {
    margin-bottom: 50px;
    & > .el-tree-node:first-child {
      .el-tree-node__expand-icon {
        background-image: url('~@/assets/images/ic-home.svg');
      }
    }
    // background-color: #fafafa;
    .el-tree-node__content {
      min-height: 3.3333333333vh;
    }
    .is-current {
      & > .el-tree-node__content {
        color: $menuActiveText;
        border-left: 4px solid $menuActiveText;
        background-color: $menuActiveBg;
        & + .el-tree-node__children {
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
        content: '';
      }
    }
    .el-tree-node {
      // min-height: 40px;
      min-height: setViewport('vh', 40);
      color: $subMenuText;
      // font-size: 16px;
      font-size: setViewport('vw', 16);
      font-weight: bold;
    }
    .el-tree-node__label {
      font-size: setViewport('vw', 14);
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
    display: flex;
    width: 100%;
    // height: 60px;
    height: setViewport('vh', 60);
    padding: 0 16px;
    background-color: $subMenuUserBg;
    justify-content: space-between;
    align-items: center;
    border-radius: 0;
    &:hover, &:active {
      border-color: unset;
    }
    img {
      width: setViewport('vw', 24);
      height: setViewport('vw', 24);
    }
    & .sidebar-image {
      margin-right: setViewport('vw', 4);
    }
    & .sidebar-title {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
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
        // height: 50%;
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
    // button {
      // margin-right: 18px;
      // margin-right: setViewport('vw', 18);
    // }
  }

  & .sidebar-logo-menu {
    width: 100%;
    // height: calc(100vh - 250px);
    height: calc(100% - #{setViewport('vh', 171)});
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
