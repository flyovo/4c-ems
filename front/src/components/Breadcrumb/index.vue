<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <!-- <transition-group name="breadcrumb"> -->
    <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.menu">
      <span v-if="item.redirect === 'noredirect' || index === breadcrumbs.length - 1" class="no-redirect">{{ $t(item.meta.title) }}</span>
      <a v-else @click.prevent="handleLink(item)">{{ $t(item.meta.title) }}</a>
    </el-breadcrumb-item>
    <!-- </transition-group> -->
  </el-breadcrumb>
</template>

<script lang="ts">
import pathToRegexp from 'path-to-regexp'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { RouteRecord, Route } from 'vue-router'
import { SettingsModule } from '@/store/modules/settings/store'

@Component({
  name: 'Breadcrumb'
})
export default class extends Vue {
  private breadcrumbs: RouteRecord[] = []

  @Watch('$route')
  private onRouteChange(route: Route) {
    if (route.path.startsWith('/redirect/')) {
      return
    }
    this.getBreadcrumb()
  }

  created() {
    this.getBreadcrumb()
  }

  private getBreadcrumb() {
    console.log('this.$route.matched')
    console.log('this.$route.matched')
    console.log('this.$route.matched')
    console.log('this.$route.matched')
    console.log('this.$route.currentRoute')
    console.log(this.$route.path) // url: /statistics/receipt/compare

    let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
    console.log(matched)

    const first = matched[0]

    if (!this.isDashboard(first)) {
      matched = [{ path: '/', meta: { title: 'main' } } as RouteRecord].concat(matched)
    }
    console.log(matched)
    this.breadcrumbs = matched.filter(item => {
      return item.meta && item.meta.title && item.meta.breadcrumb !== false
    })
    // dashboardTemp/dashboardTemp
    // raw-data/receipt
    // statistics/receipt/compare
    console.log('this.breadcrumbs : ', this.breadcrumbs)
    const path = this.$route.path.split('/')
    console.log(path)
    this.breadcrumbs = this.getPath(path)

    console.log('this.breadcrumbs---------------------------')
    console.log(this.breadcrumbs)
  }

  get menuList(): object[] {
    return SettingsModule.menuList
  }

  private getPath(path: string[]) {
    let temp = []
    this.menuList.forEach(item => {
      if (item.menu === path[1]) {
        temp = temp.concat({
          redirect: path[1] === 'dashboard' ? 'redirect' : 'noredirect',
          meta: {
            title: item.title
          }
        })
        if (item.child) {
          let childMenu = ''
          let childPath = ''
          for (let i = 2; i <= path.length - 1; i++) {
            childPath += '/' + path[i]
          }
          item.child.forEach(child => {
            if ('/' + child.menu === childPath) {
              temp = temp.concat({
                redirect: 'redirect',
                meta: {
                  title: child.title
                }
              })
            }
          })
        }
      }
    })
    return temp
  }

  private isDashboard(route: RouteRecord) {
    const name = route && route.name
    if (!name) {
      return false
    }
    return name.trim().toLocaleLowerCase() === 'Main'.toLocaleLowerCase()
  }

  private pathCompile(path: string) {
    const { params } = this.$route
    const toPath = pathToRegexp.compile(path)
    return toPath(params)
  }

  private handleLink(item: any) {
    const { redirect, path } = item
    if (redirect) {
      this.$router.push(redirect)
      return
    }
    this.$router.push(path)
  }
}
</script>

<style lang="scss" scoped>
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}

.app-breadcrumb.el-breadcrumb {
  // display: inline-block;
  font-size: 18px;
  line-height: 50px;
  margin-left: 8px;
  .no-redirect {
    // color: #97a8be;
    display: inline-block;
    font-size: 18px;
    line-height: 50px;
    margin-left: 8px;
    cursor: text;
  }
}
</style>
<style lang="scss">
.el-breadcrumb__separator {
  margin: 0 0 0 9px;
}
</style>
