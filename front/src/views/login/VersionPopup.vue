<template>
  <div class="dialog-container">
    <el-dialog :visible.sync="dialogVisible" title="" width=" 500px" top>
      <div class="app-version-warpper">
        <div class="version-img-warpper">
          <img v-if="env === 'production'" src="scms/img/appIcon.png" style="width: 30%;" />
          <img v-else src="favicon.ico" style="width: 30%;" />
        </div>
        <div class="version-text-warpper">
          App Version : v1.0.1
        </div>
      </div>
      <div class="licence-warppper">
        <el-carousel height="100px" :autoplay="true" :interval="10000">
          <el-carousel-item>
            <div class="licence-title-a">APP ICON [ C space ]</div>
            <div class="licence-content-a">
              Copyright <svg-icon name="part03-r-copyright" /> 2020.
              <a href="" title="logo">
                MEDILNX
              </a>
            </div>
          </el-carousel-item>
          <el-carousel-item>
            <div class="licence-title-a">
              WEB FONT [ 나눔 스퀘어 라운드 ]
            </div>
            <div class="licence-content-a">
              Copyright <svg-icon name="part03-r-copyright" /> 2010.
              <a href="https://www.navercorp.com/" title="NAVER Corporation">
                NAVER Corporation
              </a>
            </div>
          </el-carousel-item>
          <el-carousel-item>
            <div>
              <div class="licence-title-b">
                WEB ICONS [ PART 01 ]
              </div>
              <div class="licence-content-b">
                Copyright
                <svg-icon name="part03-r-copyright" />
                <a href="https://www.flaticon.com/" title="Flaticon"> FlatIcon </a> , Freepik Company
              </div>
              <div class="licence-content-b">
                [<a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a>, <a href="https://www.flaticon.com/authors/darius-dan" title="Darius Dan">Darius Dan</a>,
                <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a>,
                <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a>, <a href="https://www.flaticon.com/authors/catkuro" title="catkuro">catkuro</a> ]
              </div>
            </div>
          </el-carousel-item>
          <el-carousel-item>
            <div>
              <div class="licence-title-a">
                WEB ICONS [ PART02 ]
              </div>
              <div class="licence-content-a">
                Copyright
                <svg-icon name="part03-r-copyright" />
                <a href="http://www.onlinewebfonts.com/icon"> Icon Fonts</a>
                - By CC 3.0 License
              </div>
            </div>
          </el-carousel-item>
          <el-carousel-item>
            <div>
              <div class="licence-title-a">
                WEB ICONS [ PART03 ]
              </div>
              <div class="licence-content-a">
                Copyright
                <svg-icon name="part03-r-copyright" />
                <a href="https://www.fontawesome.com/"> Font Awesome</a> - By CC 4.0 License
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'VersionPopup'
})
export default class extends Vue {
  @Prop({ default: false }) private showDialog: boolean

  get env() {
    return process.env.NODE_ENV
  }

  get dialogVisible() {
    return this.showDialog
  }
  set dialogVisible(val) {
    this.$emit('update:visible', val)
  }
}
</script>

<style lang="scss" scoped>
.app-version-warpper {
  margin-top: 5%;
  .version-text-warpper {
    margin-top: 3%;
    font-weight: 900;
    font-size: 15px;
  }
}
.licence-warppper {
  .el-carousel__item h3 {
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }
  .el-carousel__item:nth-child(2n) {
    background-color: transparent;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: transparent;
  }
  .licence-title-a {
    margin-top: 10%;
    color: #687687;
    font-size: 12px;
    font-weight: bold;
  }
  .licence-content-a {
    margin-top: 1%;
    color: #687687;
    font-size: 12px;
  }
  .licence-title-b {
    margin-top: 7%;
    color: #687687;
    font-size: 12px;
    font-weight: bold;
  }
  .licence-content-b {
    margin-top: 1%;
    color: #687687;
    font-size: 12px;
  }
}
</style>
