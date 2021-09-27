<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { TagsViewModule } from '@/store/modules/tag-view/store'

@Component({
  name: 'AppMain'
})
export default class extends Vue {
  get cachedViews() {
    return TagsViewModule.cachedViews
  }

  get key() {
    return this.$route.path
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  // min-height: 100vh;
  width: 100%;
  height: 100%;
  // padding: 20px 60px;
  // padding: setViewport('vh', 20) setViewport('vw', 60);
  padding: setViewport('vh', 20) setViewport('vw', 60) setViewport('vh', 70) setViewport('vw', 60);
  // position: relative;
  // overflow: hidden;
  background-color: $loginBg;
}

.fixed-header + .app-main {
  // padding-top: 50px;
  padding-top: setViewport('vh', 50);
  height: 100vh;
  overflow: auto;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    // min-height: calc(100vh - 84px);
    min-height: calc(100vh - #{setViewport('vh', 84)});
  }

  .fixed-header + .app-main {
    // padding-top: 84px;
    padding-top: setViewport('vh', 84);
  }
}
</style>
